// Minimal host bridge: hello + serviceRequest over postMessage.
const CHANNEL = 'openchamber.sdk';
const V = 1;
let seq = 0;
const pending = new Map();

window.addEventListener('message', (event) => {
  const m = event.data;
  if (!m || m.channel !== CHANNEL || m.v !== V) return;
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.ok === false ? reject(new Error(m.error || 'host error')) : resolve(m.payload);
  }
});

const post = (msg) => window.parent.postMessage({ channel: CHANNEL, v: V, ...msg }, '*');
post({ type: 'hello' });

const call = (type, payload) => new Promise((resolve, reject) => {
  const id = `oc-${++seq}`;
  pending.set(id, { resolve, reject });
  setTimeout(() => {
    if (pending.delete(id)) reject(new Error('host timeout'));
  }, 20000);
  post({ type, id, payload });
});

const serviceGet = (path) => call('service-request', { method: 'GET', path });

// ---------- render ----------
const TITLES = {
  '5h': 'Session (5h)', '7d': 'Weekly', '1d': 'Daily',
  monthly: 'Monthly', extra_usage: 'Extra usage', credits_balance: 'Credits',
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const windowHtml = (label, w) => {
  const used = w?.usedPercent;
  const value = used !== null && used !== undefined ? `${Math.round(used)}%` : (w?.valueLabel ?? '—');
  const reset = w?.resetAt ? `resets ${new Date(w.resetAt).toLocaleString()}` : '';
  return `<div class="row"><span class="label">${esc(label)}${reset ? ` · <span class="muted">${esc(reset)}</span>` : ''}</span><span class="value">${esc(value)}</span></div>` +
    (used !== null && used !== undefined ? `<div class="bar"><i style="width:${Math.min(100, Math.max(0, used))}%"></i></div>` : '');
};

const render = (s) => {
  const view = document.getElementById('view');
  if (!s?.ok) { view.textContent = 'service unavailable'; return; }
  const parts = [];
  parts.push(`<div class="row"><span class="label">CLI</span><span class="value"><code>${esc(s.cli)}</code></span></div>`);
  if (s.cachedAt) {
    const ago = Math.max(0, Math.round((Date.now() - s.cachedAt) / 60000));
    parts.push(`<div class="row"><span class="label">Last read</span><span class="value">${ago < 1 ? 'just now' : `${ago}m ago`}${s.inflight ? ' · refreshing…' : ''}</span></div>`);
  } else {
    parts.push(`<div class="row"><span class="label">Last read</span><span class="value">${s.inflight ? 'in progress…' : 'never'}</span></div>`);
  }
  const usage = s.usage;
  if (usage?.windows) {
    for (const [k, w] of Object.entries(usage.windows)) parts.push(windowHtml(TITLES[k] ?? k, w));
    for (const [model, e] of Object.entries(usage.models ?? {})) {
      for (const [k, w] of Object.entries(e.windows ?? {})) parts.push(windowHtml(`${model} · ${TITLES[k] ?? k}`, w));
    }
  }
  if (s.lastAttempt && !s.lastAttempt.ok && s.lastAttempt.error) {
    parts.push(`<div class="row"><span class="label err">${esc(s.lastAttempt.error)}</span></div>`);
  }
  view.className = '';
  view.innerHTML = parts.join('');
};

const tick = () => serviceGet('/status-json').then((r) => render(JSON.parse(r.body))).catch((e) => {
  document.getElementById('view').innerHTML = `<span class="err">${esc(e.message)}</span>`;
});
tick();
setInterval(tick, 30000);
