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
const CLI_TIMEOUT_MS = 15_000; // under the host's 20 s usage.read deadline
const OVERRIDE_FILE = path.join(os.homedir(), '.config', 'claude-cli-usage', 'cli-path');

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

const readUsage = async () => {
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
