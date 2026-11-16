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
const parse = (input, at = ReadingDate.now()) => vm.runInNewContext(`${parser}\nparseUsageText(input)`, {
  input,
  Intl,
  Date: class extends Date {
    constructor(...args) { super(...(args.length ? args : [at])); }
    static now() { return at; }
  },
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
    CACHE_VERSION: 3,
  });
  expect(load()).toBeNull();
  stored.version = 3;
  expect(load()?.data.ok).toBe(true);
});

for (const reset of [
  'Feb 30, 12pm (America/Los_Angeles)',
  'Nov 0, 12pm (America/Los_Angeles)',
  'Novgarbage 16, 12pm (America/Los_Angeles)',
  'Nov 16, 12pm (America/Los_Angeles',
]) {
  test(`rejects invalid or incomplete reset: ${reset}`, () => {
    expect(parse(`Current session: 30% used · resets ${reset}`).windows['5h'].resetAt).toBeNull();
  });
}

for (const [name, at, reset, expected] of [
  ['previous year', '2027-01-01T09:00:00Z', 'Dec 31, 11pm', '2027-01-01T07:00:00Z'],
  ['next year', '2026-12-31T23:00:00Z', 'Jan 1, 12am', '2027-01-01T08:00:00Z'],
  ['spring daylight saving', '2026-03-08T07:00:00Z', 'Mar 8, 3:30am', '2026-03-08T10:30:00Z'],
  ['autumn daylight saving', '2026-11-01T06:00:00Z', 'Nov 1, 2:30am', '2026-11-01T10:30:00Z'],
]) {
  test(`converts ${name} correctly`, () => {
    expect(parse(`Current session: 30% used · resets ${reset} (America/Los_Angeles)`, Date.parse(at)).windows['5h'].resetAt)
      .toBe(Date.parse(expected));
  });
}

test('does not roll an old reset date forward a whole year', () => {
  expect(parse('Current session: 30% used · resets Nov 16, 12pm (America/Los_Angeles)', Date.parse('2026-11-20T19:25:00Z')).windows['5h'].resetAt).toBeNull();
});

test('rejects a nonexistent local time in the spring DST gap', () => {
  expect(parse('Current session: 30% used · resets Mar 8, 2:30am (America/Los_Angeles)', Date.parse('2026-03-08T07:00:00Z')).windows['5h'].resetAt).toBeNull();
});

test('rejects an ambiguous local time when daylight saving ends', () => {
  expect(parse('Current session: 30% used · resets Nov 1, 1:30am (America/Los_Angeles)', Date.parse('2026-11-01T06:00:00Z')).windows['5h'].resetAt).toBeNull();
});

test('accepts a valid leap day', () => {
  expect(parse('Current session: 30% used · resets Feb 29, 12pm (America/Los_Angeles)', Date.parse('2028-02-29T19:00:00Z')).windows['5h'].resetAt).toBe(Date.parse('2028-02-29T20:00:00Z'));
});

test('keeps existing behavior when no source timezone is provided', () => {
  expect(parse('Current session: 30% used · resets Nov 16, 12pm').windows['5h'].resetAt).toBe(Date.parse('2026-11-16T12:00:00Z'));
});
