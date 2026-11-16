/**
 * Claude CLI usage provider for OpenChamber.
 *
 * OpenChamber spawns this as a `provides: ["quota"]` service and asks it for
 * usage exactly the way it asks a built-in (`POST /quota`, `usage.read`).
 * Instead of calling Anthropic's OAuth usage endpoint the way the built-in
 * `claude` provider does — that endpoint needs a local credential file, and
 * when the CLI is a relay stub the OAuth token lives on the far host — this
 * provider shells out to a Claude Code CLI and runs `-p "/usage"`, which is a
 * local command (`local_command=true`): it costs no quota and works through a
 * stdio relay.
 *
 * Which binary is spawned, in priority order:
 *   1. `CLAUDE_USAGE_CLI` in the service's environment. Note the host copies
 *      only PATH/HOME/temp/locale into service environments, so this mainly
 *      helps manual testing and hosts that inject service env.
 *   2. A path written to `~/.config/claude-cli-usage/cli-path` (HOME is
 *      inherited, so this is the reliable in-app override).
 *   3. `claude` on PATH.
 *
 * The spawn closes stdin (`stdio: 'ignore'`), which relay stubs typically
 * require: they wait for stdin EOF before answering.
 */

import http from 'node:http';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PORT = Number(process.env.OPENCHAMBER_SERVICE_PORT ?? 0);
const TOKEN = process.env.OPENCHAMBER_SERVICE_TOKEN ?? '';
if (!PORT || !TOKEN) {
  console.error('Missing OPENCHAMBER_SERVICE_PORT or OPENCHAMBER_SERVICE_TOKEN');
  process.exit(2);
}

const QUOTA_PATH = '/quota';
// The host answers usage.read with a 20 s deadline, but a CLI behind a relay
// can take ~30 s. So reads answer from the last good result and refreshes run
// in the background; only a cold start ever waits, and never past the wire.
const CLI_TIMEOUT_MS = 45_000;
const ANSWER_WAIT_MS = 17_000;
const FRESH_MS = 60_000;
const OVERRIDE_FILE = path.join(os.homedir(), '.config', 'claude-cli-usage', 'cli-path');
const CACHE_FILE = path.join(os.homedir(), '.config', 'claude-cli-usage', 'last-usage.json');

const SESSION_WINDOW_SECONDS = 5 * 60 * 60;
const WEEKLY_WINDOW_SECONDS = 7 * 24 * 60 * 60;

const resolveCli = () => {
  const env = typeof process.env.CLAUDE_USAGE_CLI === 'string' ? process.env.CLAUDE_USAGE_CLI.trim() : '';
  if (env) return env;
  try {
    const file = fs.readFileSync(OVERRIDE_FILE, 'utf8').trim();
    if (file) return file;
  } catch {
    // no override file — fall through to PATH
  }
  return 'claude';
};

const runCli = (bin) =>
  new Promise((resolve) => {
    execFile(bin, ['-p', '/usage', '--output-format', 'json'], {
      timeout: CLI_TIMEOUT_MS,
      killSignal: 'SIGKILL',
      maxBuffer: 4 * 1024 * 1024,
      encoding: 'utf8',
      windowsHide: true,
      env: process.env,
    }, (error, stdout, stderr) => {
      resolve({ error, stdout: stdout ?? '', stderr: stderr ?? '' });
    });
  });

// ---------------- parsing ----------------

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Milliseconds the named zone is ahead of UTC at `utcMs`, via Intl's zone math. */
const tzOffsetMs = (timeZone, utcMs) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date(utcMs));
  const get = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
  return asUTC - utcMs;
};

/**
 * "Nov 16, 1:19am" plus an optional "(America/Los_Angeles)" → epoch ms.
 * The CLI prints no year, so both adjacent years are tried and the first
 * plausible one (not deeper than ~2 days in the past) wins.
 */
const parseResetAt = (monthName, day, hour12, minute, ampm, timeZone) => {
  const month = MONTHS[monthName.slice(0, 3).toLowerCase()];
  if (month === undefined) return null;
  let hour = Number(hour12) % 12;
  if (/pm/i.test(ampm)) hour += 12;
  const now = Date.now();
  for (const year of [new Date(now).getFullYear(), new Date(now).getFullYear() + 1]) {
    let utcMs = Date.UTC(year, month, Number(day), hour, Number(minute));
    if (timeZone) {
      try {
        utcMs -= tzOffsetMs(timeZone, utcMs);
      } catch {
        return null; // zone name we cannot resolve — drop the reset time
      }
    }
    if (utcMs > now - 2 * 24 * 3600 * 1000) return utcMs;
  }
  return null;
};

const USAGE_LINE =
  /^(current session|current week(?:\s*\(([^)]*)\))?|extra usage)\s*:\s*(?:(\d+(?:\.\d+)?)%\s*used)?(.*?)$/i;
const RESET_PART =
  /resets?\s+([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{1,2}):(\d{2})\s*(am|pm))?(?:\s*\(([^)]+)\))?/i;
const MONEY_PART = /\$\s*([\d,]+(?:\.\d+)?)(?:\s*\/\s*\$\s*([\d,]+(?:\.\d+)?))?/;

/**
 * Turns the `/usage` report into quota windows. Session and weekly lines map
 * onto the built-in window names (`5h`, `7d`, `extra_usage`) so the card,
 * header and Work Status render it exactly like the built-in provider; a
 * model-scoped weekly line (e.g. "(Fable)") becomes a per-model `7d` window.
 */
const parseUsageText = (text) => {
  const windows = {};
  const models = {};
  let matched = 0;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    const m = line.match(USAGE_LINE);
    if (!m) continue;
    const [, scope, scopeDetail, percentRaw, tail] = m;
    matched += 1;
    const percent = percentRaw !== undefined ? Math.min(100, Math.max(0, Number(percentRaw))) : null;
    const rm = tail.match(RESET_PART);
    const resetAt = rm ? parseResetAt(rm[1], rm[2], rm[3] ?? '12', rm[4] ?? '0', rm[5] ?? 'am', rm[6]) : null;
    const money = tail.match(MONEY_PART);

    const key = scope.toLowerCase();
    if (key === 'current session') {
      windows['5h'] = { usedPercent: percent, windowSeconds: SESSION_WINDOW_SECONDS, resetAt };
    } else if (key.startsWith('current week')) {
      const window = { usedPercent: percent, windowSeconds: WEEKLY_WINDOW_SECONDS, resetAt };
      if (scopeDetail && !/all models/i.test(scopeDetail)) {
        models[scopeDetail] = { windows: { '7d': window } };
      } else {
        windows['7d'] = window;
      }
    } else if (key === 'extra usage') {
      const window = { usedPercent: percent, windowSeconds: null, resetAt: null };
      if (money) {
        const used = money[1].replace(/,/g, '');
        const limit = money[2]?.replace(/,/g, '');
        window.valueLabel = limit ? `$${used} / $${limit}` : `$${used}`;
      }
      windows['extra_usage'] = window;
    }
  }

  return { windows, models, matched };
};

const usageTextFrom = (stdout) => {
  try {
    const parsed = JSON.parse(stdout);
    if (typeof parsed?.result === 'string' && parsed.result.trim()) return parsed.result;
  } catch {
    // not JSON — the CLI sometimes streams the report plainly
  }
  return stdout;
};

// ---------------- usage read ----------------

const failure = (error, { configured = true } = {}) => ({
  ok: false,
  configured,
  error: String(error).slice(0, 2000),
  usage: null,
});

const isUsageData = (data) =>
  Boolean(data) && data.ok === true && typeof data === 'object'
  && typeof data.usage === 'object' && data.usage !== null
  && typeof data.usage.windows === 'object' && data.usage.windows !== null;

const loadCache = () => {
  try {
    const stored = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (isUsageData(stored?.data) && Number.isFinite(stored?.at)) {
      return { data: stored.data, at: stored.at };
    }
  } catch {
    // no usable cache yet
  }
  return null;
};

let cached = loadCache();
let inflight = null;

const saveCache = () => {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ at: cached.at, data: cached.data }));
  } catch {
    // a cache write failure must never fail a read
  }
};

/** One CLI run turned into a usage answer; never throws. */
const fetchUsageData = async () => {
  const bin = resolveCli();
  const { error, stdout, stderr } = await runCli(bin);

  if (error) {
    if (error.code === 'ENOENT' || /ENOENT/.test(String(error))) {
      return failure(
        `Cannot run "${bin}": not found. The service reads usage by running ` +
        `<cli> -p "/usage"; put the CLI on PATH as "claude", or override it via ` +
        `CLAUDE_USAGE_CLI or ${OVERRIDE_FILE}.`
      );
    }
    if (error.killed || error.signal === 'SIGKILL' || error.code === 'ETIMEDOUT') {
      return failure(`"${bin}" did not answer within ${CLI_TIMEOUT_MS / 1000}s`);
    }
    const detail = (stderr || stdout || error.message || 'failed').trim().split('\n').slice(-3).join(' ');
    return failure(`"${bin}" failed${error.code != null ? ` (${error.code})` : ''}: ${detail}`.slice(0, 2000));
  }

  const text = usageTextFrom(stdout).trim();
  if (!text) {
    return failure(`"${bin}" answered nothing for /usage`);
  }

  const { windows, models, matched } = parseUsageText(text);
  if (matched === 0) {
    const snippet = text.split('\n').slice(0, 3).join(' | ').slice(0, 400);
    return failure(`Could not read /usage output from "${bin}": ${snippet}`);
  }

  return {
    ok: true,
    configured: true,
    planLabel: `Claude Code (${path.basename(bin)})`,
    usage: {
      windows,
      ...(Object.keys(models).length > 0 ? { models } : {}),
    },
  };
};

/** Runs the CLI at most once at a time; a good answer becomes the new cache. */
let lastAttempt = null; // { at, ok, error }

const refresh = () => {
  if (inflight) return inflight;
  const pending = (async () => {
    const data = await fetchUsageData();
    lastAttempt = { at: Date.now(), ok: Boolean(data?.ok), error: data?.ok ? null : (data?.error ?? 'unknown') };
    if (data.ok) {
      cached = { data, at: Date.now() };
      saveCache();
      return data;
    }
    // A failed refresh keeps the last good answer; the error is reported only
    // when nothing has ever read successfully.
    return cached?.data ?? data;
  })();
  inflight = pending;
  pending.finally(() => {
    if (inflight === pending) inflight = null;
  });
  return pending;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------- Work Status view ----------------

const WINDOW_TITLES = {
  '5h': 'Session (5h)',
  '7d': 'Weekly',
  '1d': 'Daily',
  monthly: 'Monthly',
  extra_usage: 'Extra usage',
  credits_balance: 'Credits',
};

const percentTone = (percent) =>
  percent === null || percent === undefined ? 'muted'
    : percent >= 90 ? 'error'
    : percent >= 75 ? 'warning'
    : 'default';

const fmtReset = (resetAt) => {
  if (!resetAt) return null;
  const date = new Date(resetAt);
  if (Number.isNaN(date.getTime())) return null;
  return `resets ${date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`;
};

/** Compact reset time for a narrow row: "7:07 PM" today, "Mon 8:00 AM" this week, "Nov 23, 8:00 AM" beyond. */
const fmtResetShort = (resetAt) => {
  if (!resetAt) return null;
  const date = new Date(resetAt);
  const now = new Date();
  if (Number.isNaN(date.getTime())) return null;
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  if (resetAt - now.getTime() < 7 * 24 * 3600 * 1000) {
    return date.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

/** "in 4h 12m" / "in 2d 5h" — how long until the window resets. */
const fmtCountdown = (resetAt) => {
  if (!resetAt) return null;
  const mins = Math.round((resetAt - Date.now()) / 60000);
  if (mins <= 0) return 'now';
  const h = Math.floor(mins / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `in ${d}d ${h % 24}h`;
  if (h > 0) return `in ${h}h ${mins % 60}m`;
  return `in ${mins}m`;
};

// Row and control ids must match /^[a-z][a-z0-9-]{0,39}$/ or the host schema
// refuses the whole view ("The extension's service sent something the app
// can't show"). Model names arrive as display strings ("Claude Opus 4.6"),
// so they are slugged before they go near an id.
const slug = (text, fallback = 'x') => {
  const clean = String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
  return clean || fallback;
};

const windowRow = (id, label, window) => {
  const used = window?.usedPercent ?? null;
  const resetShort = fmtResetShort(window?.resetAt);
  const countdown = fmtCountdown(window?.resetAt);
  const resetText = resetShort
    ? countdown ? ` · ${resetShort} · ${countdown}` : ` · ${resetShort}`
    : '';
  const row = {
    kind: 'line',
    id,
    label: `${label}${resetText}`,
    dot: percentTone(used),
    tooltip: [window?.valueLabel, fmtReset(window?.resetAt)].filter(Boolean).join(' · ') || undefined,
    value: used !== null
      ? `${Math.round(used)}%`
      : (window?.valueLabel ?? '—'),
    valueTone: percentTone(used),
  };
  if (used !== null) row.content = { kind: 'bar', value: used, tone: percentTone(used) };
  return row;
};

/** The `GuestStatusView` the Work Status section draws from the last read. */
const statusView = () => {
  const usage = cached?.data?.usage ?? null;
  const rows = [];

  if (!usage) {
    rows.push({
      kind: 'note',
      id: 'empty',
      text: lastAttempt?.error
        ? `Claude CLI usage: ${lastAttempt.error}`
        : `Claude CLI usage: first read in progress via ${path.basename(resolveCli())}`,
      tone: lastAttempt?.error ? 'warning' : 'muted',
    });
    return { rows };
  }

  for (const [key, window] of Object.entries(usage.windows ?? {})) {
    rows.push(windowRow(`w-${slug(key)}`, WINDOW_TITLES[key] ?? key, window));
  }
  // Per-model windows (e.g. "Current week (Fable)") stay in the /quota answer
  // for the Usage page card; the compact section leaves them out.

  const fetchedAgo = cached ? Math.max(0, Math.round((Date.now() - cached.at) / 60000)) : null;
  rows.push({
    kind: 'line',
    id: 'meta',
    label: inflight ? 'refreshing…' : `${path.basename(resolveCli())}`,
    value: fetchedAgo !== null ? (fetchedAgo < 1 ? 'just now' : `${fetchedAgo}m ago`) : undefined,
    valueTone: 'muted',
    tooltip: `${resolveCli()} · last read ${cached ? new Date(cached.at).toLocaleTimeString() : 'never'}`,
    actions: [{ kind: 'button', id: 'refresh', label: 'Refresh', variant: 'outline' }],
  });
  if (lastAttempt && !lastAttempt.ok && lastAttempt.error) {
    rows.push({ kind: 'note', id: 'last-error', text: lastAttempt.error, tone: 'warning' });
  }
  return { rows };
};

const readUsage = async () => {
  if (cached && Date.now() - cached.at < FRESH_MS) return cached.data;
  const pending = refresh();
  // A stale answer is better than a timed-out one: hand it over and let the
  // background refresh finish for the next call.
  if (cached) return cached.data;
  // Cold start with no history: wait, but never past the wire deadline.
  const raced = await Promise.race([pending, sleep(ANSWER_WAIT_MS).then(() => null)]);
  if (raced) return raced;
  return failure(
    `"${resolveCli()}" is still answering /usage — through a relay that can take ` +
    'about half a minute. Refresh in a moment; the service keeps the next read.'
  );
};

// ---------------- http ----------------

const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) req.destroy();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

const server = http.createServer((req, res) => {
  if (req.headers.authorization !== `Bearer ${TOKEN}`) {
    return send(res, 401, { error: 'unauthorized' });
  }
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/health') {
    return send(res, 200, { ok: true });
  }
  // The Work Status section's `source` reads this path while the section is
  // on screen (GET for rows, POST when a row control is activated).
  if (url.pathname === '/status' && req.method === 'GET') {
    refresh(); // keep the answer warm; a stale read still answers at once
    return send(res, 200, statusView());
  }
  // Raw state for the panel page (not a status view).
  if (url.pathname === '/status-json' && req.method === 'GET') {
    return send(res, 200, {
      ok: true,
      cli: resolveCli(),
      overrideFile: OVERRIDE_FILE,
      inflight: Boolean(inflight),
      cachedAt: cached?.at ?? null,
      planLabel: cached?.data?.planLabel ?? null,
      usage: cached?.data?.usage ?? null,
      lastAttempt,
      cacheFile: CACHE_FILE,
    });
  }
  if (url.pathname === '/status' && req.method === 'POST') {
    readBody(req).then(() => {
      refresh();
      send(res, 200, { ok: true });
    }).catch(() => send(res, 500, { error: 'could not read the request' }));
    return;
  }
  if (req.method === 'POST' && url.pathname === QUOTA_PATH) {
    readBody(req)
      .then(async (body) => {
        let request = null;
        try {
          request = JSON.parse(body);
        } catch {
          // not JSON
        }
        if (request?.v !== 1 || request?.method !== 'usage.read') {
          return send(res, 400, { error: 'not a usage call this service understands' });
        }
        try {
          const data = await readUsage();
          return send(res, 200, { ok: true, data });
        } catch (err) {
          return send(res, 200, { ok: false, error: { message: err?.message ?? 'usage read failed' } });
        }
      })
      .catch(() => send(res, 500, { error: 'could not read the request' }));
    return;
  }
  return send(res, 404, { error: 'not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`claude-cli-usage service on 127.0.0.1:${PORT} (cli: ${resolveCli()})`);
});
