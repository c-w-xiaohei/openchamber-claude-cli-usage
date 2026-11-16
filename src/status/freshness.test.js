import { test, expect } from 'bun:test';
import fs from 'node:fs';
import vm from 'node:vm';

test('shows update age in minutes and suggests refreshing stale data', () => {
  const source = fs.readFileSync(new URL('./main.js', import.meta.url), 'utf8');
  // Test the formatting used by the visible age label, without a DOM or host.
  const start = source.indexOf('const freshness =');
  expect(start).toBeGreaterThan(-1);
  const end = source.indexOf('\n};', start) + 3;
  const format = (cachedAt, now) => vm.runInNewContext(`${source.slice(start, end)}\nfreshness(at, now)`, { at: cachedAt, now });
  expect(format(100000, 130000).label).toBe('Updated <1 min ago');
  expect(format(100000, 220000).label).toBe('Updated 2 min ago');
  expect(format(100000, 460000).stale).toBe(true);
  expect(format(null, 460000).label).toBe('Not updated yet');
});
