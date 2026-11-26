import { describe, test, expect, spyOn } from 'bun:test';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { countFindings, readBaselineFindings, writeSummary } from '../../src/accessibility/report/summary.js';

async function withTempDir(fn) {
  const dir = await mkdtemp(path.join(tmpdir(), 'a11y-summary-'));
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe('countFindings', () => {
  test('counts errorRegistry entries', () => {
    expect(countFindings({ errorRegistry: { a: {}, b: {}, c: {} } })).toBe(3);
  });

  test('treats a report without errorRegistry as zero findings', () => {
    expect(countFindings({})).toBe(0);
  });
});

describe('readBaselineFindings', () => {
  test('returns the findings count of a previous report', async () => {
    await withTempDir(async (dir) => {
      const baselinePath = path.join(dir, 'baseline.json');
      await writeFile(baselinePath, JSON.stringify({ pages: [], errorRegistry: { a: {}, b: {} } }));

      expect(await readBaselineFindings(baselinePath)).toBe(2);
    });
  });

  test('returns null for a missing file or a non-report', async () => {
    const warnSpy = spyOn(console, 'warn').mockImplementation(() => {});
    try {
      await withTempDir(async (dir) => {
        const notReportPath = path.join(dir, 'not-report.json');
        await writeFile(notReportPath, '[]');

        expect(await readBaselineFindings(path.join(dir, 'missing.json'))).toBeNull();
        expect(await readBaselineFindings(notReportPath)).toBeNull();
      });
    } finally {
      warnSpy.mockRestore();
    }
  });
});

describe('writeSummary', () => {
  test('writes shell-sourceable totals, creating the directory', async () => {
    await withTempDir(async (dir) => {
      const summaryPath = path.join(dir, 'nested', 'summary.env');
      await writeSummary({ scans: 3, findings: 5, previousFindings: 7 }, summaryPath);

      expect(await readFile(summaryPath, 'utf8')).toBe(
        'A11Y_SCANS=3\nA11Y_FINDINGS_TOTAL=5\nA11Y_FINDINGS_TOTAL_PREVIOUS=7\n'
      );
    });
  });

  test('omits A11Y_FINDINGS_TOTAL_PREVIOUS when there is no baseline', async () => {
    await withTempDir(async (dir) => {
      const summaryPath = path.join(dir, 'summary.env');
      await writeSummary({ scans: 1, findings: 0 }, summaryPath);

      expect(await readFile(summaryPath, 'utf8')).toBe('A11Y_SCANS=1\nA11Y_FINDINGS_TOTAL=0\n');
    });
  });
});
