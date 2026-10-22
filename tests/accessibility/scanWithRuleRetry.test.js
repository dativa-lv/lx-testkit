import { describe, test, expect } from 'bun:test';
import { scanWithRuleRetry } from '../../src/accessibility/scanner/scanWithRuleRetry.js';

function unknownRuleError(id) {
  return new Error(`unknown rule \`${id}\` in options.runOnly`);
}

describe('scanWithRuleRetry', () => {
  test('returns the result on the first try when nothing throws', async () => {
    const result = await scanWithRuleRetry(['a', 'b'], async (ids) => ({ ids }));
    expect(result).toEqual({ ids: ['a', 'b'] });
  });

  test('calls runScan once with null ids unchanged when ruleIds is null', async () => {
    const seen = [];
    await scanWithRuleRetry(null, async (ids) => {
      seen.push(ids);
      return {};
    });
    expect(seen).toEqual([null]);
  });

  test('strips an axe-rejected rule id and retries until it succeeds', async () => {
    const attempts = [];
    const result = await scanWithRuleRetry(['good', 'bad-one', 'also-good'], async (ids) => {
      attempts.push(ids);
      if (ids.includes('bad-one')) {
        throw unknownRuleError('bad-one');
      }
      return { ids };
    });

    expect(attempts).toEqual([
      ['good', 'bad-one', 'also-good'],
      ['good', 'also-good'],
    ]);
    expect(result).toEqual({ ids: ['good', 'also-good'] });
  });

  test('strips multiple axe-rejected rule ids across several retries', async () => {
    const result = await scanWithRuleRetry(['a', 'b', 'c'], async (ids) => {
      if (ids.includes('a')) {
        throw unknownRuleError('a');
      }
      if (ids.includes('b')) {
        throw unknownRuleError('b');
      }
      return { ids };
    });

    expect(result).toEqual({ ids: ['c'] });
  });

  test('rethrows an "unknown rule" error for an id that was not in the current list', async () => {
    await expect(
      scanWithRuleRetry(['a'], async () => {
        throw unknownRuleError('not-in-the-list');
      })
    ).rejects.toThrow('not-in-the-list');
  });

  test('rethrows unrelated errors immediately without retrying', async () => {
    let calls = 0;
    await expect(
      scanWithRuleRetry(['a'], async () => {
        calls++;
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');
    expect(calls).toBe(1);
  });

  test('rethrows an "unknown rule" error when ruleIds is null (nothing to strip)', async () => {
    await expect(
      scanWithRuleRetry(null, async () => {
        throw unknownRuleError('whatever');
      })
    ).rejects.toThrow('whatever');
  });
});
