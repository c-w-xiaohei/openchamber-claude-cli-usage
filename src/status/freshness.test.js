import { test, expect } from 'bun:test';
import fs from 'node:fs';
import vm from 'node:vm';

test('shows compact minute age only after one full minute', () => {
  const source = fs.readFileSync(new URL('./main.js', import.meta.url), 'utf8');
  // Test the formatting used by the visible age label, without a DOM or host.
  const start = source.indexOf('const freshness =');
  expect(start).toBeGreaterThan(-1);
  const end = source.indexOf('\n};', start) + 3;
  const format = (cachedAt, now) => vm.runInNewContext(`${source.slice(start, end)}\nfreshness(at, now)`, { at: cachedAt, now });
  expect(format(100000, 130000).label).toBe('');
  expect(format(100000, 159999).label).toBe('');
  expect(format(100000, 160000).label).toBe('1m ago');
  expect(format(100000, 220000).label).toBe('2m ago');
  expect(format(100000, 460000).label).toBe('6m ago');
  expect(format(null, 460000).label).toBe('');
  expect(format(220000, 100000).label).toBe('');
});
