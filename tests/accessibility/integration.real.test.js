import { describe, test, expect } from 'bun:test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

// Real end-to-end test: runs the actual Playwright + axe-core scan (no
// mocks) against a minimal local fixture page, through the real evaluator
// and report builder.
//
// This spawns a `node` child process for the scan itself (see
// fixtures/runIntegrationScan.mjs) because Bun's own JS runtime currently
// hangs when driving a real Chromium browser via Playwright - see
// /memories/bun-playwright.md. `bun test` still orchestrates/asserts here.
//
// Requires a Playwright chromium browser to be installed
// (`bunx playwright install chromium`).
const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures/runIntegrationScan.mjs'
);

describe('accessibility integration (real Playwright + axe)', () => {
  test('scans a real page and produces a contract-shaped report with real violations', async () => {
    const { stdout } = await execFileAsync('node', [scriptPath], { timeout: 30000 });
    const report = JSON.parse(stdout);

    expect(report.pages).toHaveLength(1);
    const page = report.pages[0];
    expect(page.name).toBe('Fixture page');
    expect(page.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);

    const nonTextContent = page.criteria.find((c) => c.number === '1.1.1');
    expect(nonTextContent.matchStatus).toBe('not-match');
    expect(nonTextContent.errors.length).toBeGreaterThan(0);

    const nameRoleValue = page.criteria.find((c) => c.number === '4.1.2');
    expect(nameRoleValue.matchStatus).toBe('not-match');

    for (const regId of nonTextContent.errors) {
      expect(report.errorRegistry[regId].pageId).toBe(page.id);
      expect(report.errorRegistry[regId].criterionNumber).toBe('1.1.1');
    }
  }, 40000);
});
