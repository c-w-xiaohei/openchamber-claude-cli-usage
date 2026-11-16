import { connectHost } from '@openchamber/sdk';
import { applyHostReady } from '@openchamber/sdk/ui';

const host = connectHost();
const root = document.getElementById('root');
const grid = document.getElementById('usage');
const message = document.getElementById('message');
const cells = new Map();
let snapshot = null;
let reading = false;
let started = false;
let locale = 'en';
let requestingRefresh = false;
let controlsKey = '';
let spinTimer = null;
let spinFrame = 0;
// Classic braille spinner: header buttons take text only, so the animation is the label.
const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let height = -1;

const pad = (value) => String(value).padStart(2, '0');
const validTime = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;
const freshness = (cachedAt, now = Date.now()) => {
  if (typeof cachedAt !== 'number' || !Number.isFinite(cachedAt) || cachedAt <= 0) return { label: '', minutes: 0 };
  const minutes = Math.max(0, Math.floor((now - cachedAt) / 60000));
  return { label: minutes < 1 ? '' : `${minutes}m ago`, minutes };
};
const resetLabel = (value) => {
  if (!validTime(value)) return '—';
  const date = new Date(value);
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const remaining = (value) => {
  if (!validTime(value)) return '—';
  const minutes = Math.max(0, Math.ceil((value - Date.now()) / 60000));
  const hours = Math.floor(minutes / 60);
  if (hours >= 24) return `${Math.floor(hours / 24)}d${pad(hours % 24)}h`;
  if (hours) return `${hours}h${pad(minutes % 60)}m`;
  return minutes ? `${minutes}m` : '—';
};
const cell = (className) => {
  const element = document.createElement('span');
  element.className = `cell ${className}`;
  element.setAttribute('role', 'cell');
  return element;
};

// Both rows participate in this single grid, sharing all five column tracks.
for (const name of ['5h', '7d']) {
  const row = document.createElement('div');
  row.className = 'usage-row';
  row.setAttribute('role', 'row');
  const label = cell('name');
  label.textContent = name;
  const reset = cell('reset');
  const resetDate = document.createElement('span');
  const resetTime = document.createElement('span');
  reset.append(resetDate, resetTime);
  const countdown = cell('countdown');
  const meter = document.createElement('span');
  meter.className = 'meter';
  meter.setAttribute('role', 'progressbar');
  meter.setAttribute('aria-label', `${name} usage`);
  meter.setAttribute('aria-valuemin', '0');
  meter.setAttribute('aria-valuemax', '100');
  const fill = document.createElement('span');
  fill.className = 'fill';
  meter.append(fill);
  const percent = cell('percent');
  row.append(label, reset, countdown, meter, percent);
  grid.append(row);
  cells.set(name, { row, reset, resetDate, resetTime, countdown, meter, fill, percent });
}

// The refresh control lives in the section header the host draws, so the
// frame holds only the two rows. Idle: "↻" or "↻ 6m" (age after a full
// minute). Reading: the braille spinner replaces "↻", same width, button disabled.
function publishControls() {
  const busy = requestingRefresh || Boolean(snapshot?.inflight);
  if (busy && spinTimer === null) {
    spinTimer = setInterval(() => { spinFrame = (spinFrame + 1) % SPIN.length; publishControls(); }, 120);
  } else if (!busy && spinTimer !== null) {
    clearInterval(spinTimer);
    spinTimer = null;
  }
  const { minutes } = freshness(snapshot?.cachedAt);
  const icon = busy ? SPIN[spinFrame] : '↻';
  const label = minutes >= 1 ? `${icon} ${minutes}m` : icon;
  const controls = [{ kind: 'button', id: 'refresh', label, disabled: busy }];
  const key = JSON.stringify(controls);
  if (key === controlsKey) return;
  controlsKey = key;
  void host.setStatusControls(controls).catch(() => { controlsKey = ''; });
}

function render() {
  const windows = snapshot?.usage?.windows;
  const hasUsage = windows && ['5h', '7d'].some((name) => windows[name]);
  grid.hidden = !hasUsage;
  message.hidden = Boolean(hasUsage);
  if (!hasUsage) {
    message.textContent = snapshot?.lastAttempt?.error || (snapshot?.inflight ? 'Reading usage…' : 'No usage available. Refresh to try again.');
    message.dataset.error = String(Boolean(snapshot?.lastAttempt?.error));
  }
  for (const [name, elements] of cells) {
    const window = windows?.[name];
    elements.row.hidden = !window;
    if (!window) continue;
    const used = typeof window.usedPercent === 'number' && Number.isFinite(window.usedPercent)
      ? Math.min(100, Math.max(0, window.usedPercent)) : null;
    elements.row.dataset.tone = used >= 90 ? 'error' : used >= 75 ? 'warning' : 'default';
    const [date, time = ''] = resetLabel(window.resetAt).split(' ');
    elements.resetDate.textContent = date;
    elements.resetTime.textContent = time;
    elements.reset.title = validTime(window.resetAt) ? `Resets ${new Date(window.resetAt).toLocaleString(locale)}` : 'Reset time unavailable';
    elements.countdown.textContent = remaining(window.resetAt);
    elements.countdown.title = 'Time until reset';
    elements.percent.textContent = used === null ? '—' : `${Math.round(used)}%`;
    elements.fill.style.width = `${used ?? 0}%`;
    if (used === null) elements.meter.removeAttribute('aria-valuenow');
    else elements.meter.setAttribute('aria-valuenow', String(used));
  }
  publishControls();
}

function visible() {
  return !document.hidden && root.getBoundingClientRect().width > 0;
}

async function poll(force = false) {
  if (reading || !visible()) return;
  reading = true;
  if (force) { requestingRefresh = true; publishControls(); }
  try {
    if (force) {
      const result = await host.serviceRequest({ method: 'POST', path: '/status', body: JSON.stringify({ id: 'refresh' }) });
      if (result.status !== 200) throw new Error('Could not refresh usage.');
    }
    const result = await host.serviceRequest({ method: 'GET', path: '/status-json' });
    if (result.status !== 200) throw new Error('Could not read usage.');
    const next = JSON.parse(result.body);
    if (next?.ok !== true) throw new Error('Usage service returned an invalid answer.');
    snapshot = next;
    render();
  } catch (error) {
    if (snapshot) snapshot.inflight = false;
    message.hidden = false;
    message.dataset.error = 'true';
    message.textContent = error instanceof Error ? error.message : 'Could not read usage.';
  } finally {
    reading = false;
    requestingRefresh = false;
    publishControls();
  }
}

host.onStatusControl((event) => { if (event.id === 'refresh') void poll(true); });
host.onDirectory(() => { controlsKey = ''; if (started) publishControls(); });
host.onReady((context) => {
  applyHostReady(context, document.documentElement);
  locale = context.locale || 'en';
  controlsKey = '';
  if (started) { render(); return; }
  started = true;
  void poll(true);
  // Cached status reads do not spawn the CLI. Start one refresh per minute.
  setInterval(() => { void poll(); }, 5000);
  setInterval(() => { void poll(true); }, 60000);
  setInterval(() => { if (visible() && snapshot) render(); }, 1000);
});
document.addEventListener('visibilitychange', () => { if (started && visible()) void poll(); });
new ResizeObserver(() => {
  const next = Math.ceil(root.getBoundingClientRect().height);
  if (next === height) return;
  height = next;
  void host.setHeight(next).catch(() => {});
}).observe(root);
