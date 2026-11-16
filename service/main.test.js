import { test, expect } from 'bun:test';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the service's parser without starting its HTTP listener or CLI.
const source = fs.readFileSync(new URL('./main.js', import.meta.url), 'utf8');
const parser = source.slice(source.indexOf('const MONTHS ='), source.indexOf('const usageTextFrom ='));
class ReadingDate extends Date {
  constructor(...args) { super(...(args.length ? args : ['2026-11-16T19:25:00Z'])); }
  static now() { return Date.parse('2026-11-16T19:25:00Z'); }
}
const parse = (input) => vm.runInNewContext(`${parser}\nparseUsageText(input)`, {
  input,
  Intl,
  Date: ReadingDate,
  SESSION_WINDOW_SECONDS: 18000,
  WEEKLY_WINDOW_SECONDS: 604800,
});

for (const [clock, utcClock] of [
  ['11am', '19:00'],
  ['10pm', '06:00'],
  ['11:59am', '19:59'],
  ['10:59pm', '06:59'],
  ['12am', '08:00'],
  ['12pm', '20:00'],
]) {
  test(`keeps the full reset time and timezone for ${clock}`, () => {
    const result = parse(`Current session: 30% used · resets Nov 16, ${clock} (America/Los_Angeles)`);
    const day = clock.startsWith('10') ? '17' : '16';
    expect(result.windows['5h'].resetAt).toBe(Date.parse(`2026-11-${day}T${utcClock}:00Z`));
  });
}

test('does not invent midnight when a reset time is incomplete', () => {
  const result = parse('Current session: 30% used · resets Nov 16, unavailable');
  expect(result.windows['5h'].resetAt).toBeNull();
});

test('parses weekly and model-scoped whole-hour resets', () => {
  const resetAt = Date.parse('2026-11-21T06:00:00Z');
  const result = parse([
    'Current week (all models): 9% used · resets Nov 20, 10pm (America/Los_Angeles)',
    'Current week (Fable): 3% used · resets Nov 20, 10pm (America/Los_Angeles)',
  ].join('\n'));
  expect(result.windows['7d'].resetAt).toBe(resetAt);
  expect(result.models.Fable.windows['7d'].resetAt).toBe(resetAt);
});

test('ignores cache entries written by the broken reset parser', () => {
  const cacheReader = source.slice(source.indexOf('const isUsageData ='), source.indexOf('let cached ='));
  const stored = { at: Date.now(), data: { ok: true, usage: { windows: {} } } };
  const load = () => vm.runInNewContext(`${cacheReader}\nloadCache()`, {
    fs: { readFileSync: () => JSON.stringify(stored) },
    CACHE_FILE: 'unused',
    CACHE_VERSION: 2,
  });
  expect(load()).toBeNull();
  stored.version = 2;
  expect(load()?.data.ok).toBe(true);
});
