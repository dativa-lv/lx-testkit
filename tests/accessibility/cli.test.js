import { describe, test, expect, mock, spyOn } from 'bun:test';
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { mergePreselectedCriteria } from '../../src/accessibility/runner/mergePreselectedCriteria.js';

// The CLI's own Playwright/axe orchestration is covered by design (see
// AccessibilityRunner.js) - here we mock it so CLI argument handling, config
// loading, and report writing can be tested without launching a real browser.
// The mock mirrors the real runner's page/state looping (one scan per state)
// so progress-counter tests exercise the same shape the real runner produces.
const mockState = {
  axeResults: { violations: [], passes: [{ id: 'button-name', tags: ['wcag412'] }] },
};

mock.module('../../src/accessibility/runner/AccessibilityRunner.js', () => ({
  runAccessibilityChecks: async (config, { onPageScanned } = {}) => {
    const results = [];
    for (const pageConfig of config.pages) {
      const states = pageConfig.states?.length ? pageConfig.states : [{ name: 'default' }];
      for (const state of states) {
        const name = pageConfig.states ? `${pageConfig.name} (${state.name})` : pageConfig.name;
        const result = {
          name,
          url: 'https://example.com/mock',
          axeResults: mockState.axeResults,
          preselectedCriteria: mergePreselectedCriteria(pageConfig, state),
        };
        results.push(result);
        onPageScanned?.(result);
      }
    }
    return results;
  },
}));

const { main } = await import('../../src/accessibility/cli/index.js');

async function writeConfig(dir, contents) {
  const configPath = path.join(dir, 'accessibility.config.js');
  await writeFile(configPath, contents, 'utf8');
  return configPath;
}

describe('accessibility CLI', () => {
  test('--help prints usage and exits 0', async () => {
    expect(await main(['--help'])).toBe(0);
  });

  test('missing --config exits non-zero', async () => {
    expect(await main([])).toBe(1);
  });

  test('non-existent config file exits non-zero', async () => {
    expect(await main(['--config', 'does-not-exist.config.js'])).toBe(1);
  });

  test('runs a scan and writes a report to the requested output path', async () => {
    mockState.axeResults = { violations: [], passes: [{ id: 'button-name', tags: ['wcag412'] }] };
    const dir = await mkdtemp(path.join(tmpdir(), 'a11y-cli-'));
    try {
      const configPath = await writeConfig(
        dir,
        `export default {
          projectName: 'Test project',
          baseUrl: 'https://example.com',
          pages: [{ name: 'Home', path: '/' }],
        };`
      );
      const outputPath = path.join(dir, 'report.json');

      const code = await main(['--config', configPath, '--output', outputPath]);
      expect(code).toBe(0);

      const report = JSON.parse(await readFile(outputPath, 'utf8'));
      expect(report.projectDetails.projectName).toBe('Test project');
      expect(report.pages).toHaveLength(1);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('exits 0 even when an automated violation is found (exit code reflects scan success, not findings)', async () => {
    mockState.axeResults = {
      violations: [
        {
          id: 'button-name',
          tags: ['wcag412'],
          impact: 'critical',
          description: 'Buttons must have discernible text',
          nodes: [{ target: ['button'], failureSummary: 'Add text' }],
        },
      ],
      incomplete: [
        {
          id: 'color-contrast',
          tags: ['wcag143'],
          impact: 'serious',
          description: 'Contrast requires manual review',
          nodes: [{ target: ['button'], failureSummary: 'Background could not be determined' }],
        },
      ],
      passes: [],
    };
    const logSpy = spyOn(console, 'log');
    const dir = await mkdtemp(path.join(tmpdir(), 'a11y-cli-'));
    try {
      const configPath = await writeConfig(
        dir,
        `export default {
          projectName: 'Test project',
          baseUrl: 'https://example.com',
          pages: [{ name: 'Home', path: '/' }],
        };`
      );
      const outputPath = path.join(dir, 'report.json');

      const code = await main(['--config', configPath, '--output', outputPath]);
      expect(code).toBe(0);
      expect(logSpy.mock.calls.map((args) => args[0])).toContain('  \u2717 2 accessibility findings');

      const report = JSON.parse(await readFile(outputPath, 'utf8'));
      const criterion = report.pages[0].criteria.find((c) => c.number === '4.1.2');
      expect(criterion.matchStatus).toBe('not-match');
      expect(criterion.errors).toHaveLength(1);
      expect(report.errorRegistry[criterion.errors[0]]).toBeDefined();
    } finally {
      logSpy.mockRestore();
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('rejects a page name that does not exist in --page filter', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'a11y-cli-'));
    try {
      const configPath = await writeConfig(
        dir,
        `export default {
          projectName: 'Test project',
          baseUrl: 'https://example.com',
          pages: [{ name: 'Home', path: '/' }],
        };`
      );

      const code = await main(['--config', configPath, '--page', 'Nonexistent']);
      expect(code).toBe(1);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('progress counter divides by total scans (pages + states), not configured page count', async () => {
    mockState.axeResults = { violations: [], passes: [] };
    const logSpy = spyOn(console, 'log');
    const dir = await mkdtemp(path.join(tmpdir(), 'a11y-cli-'));
    try {
      const configPath = await writeConfig(
        dir,
        `export default {
          projectName: 'Test project',
          baseUrl: 'https://example.com',
          pages: [
            { name: 'Home', path: '/' },
            {
              name: 'Dialog',
              path: '/dialog',
              states: [{ name: 'closed' }, { name: 'open' }],
            },
          ],
        };`
      );

      // 1 default-state scan for "Home" + 2 state scans for "Dialog" = 3 total scans,
      // even though there are only 2 configured page entries.
      const outputPath = path.join(dir, 'report.json');
      const code = await main(['--config', configPath, '--output', outputPath]);
      expect(code).toBe(0);

      const progressLines = logSpy.mock.calls.map((args) => args[0]).filter((line) => /^\[\d+\/\d+\]/.test(line));
      expect(progressLines).toEqual([
        '[1/3] Home',
        '[2/3] Dialog (closed)',
        '[3/3] Dialog (open)',
      ]);
    } finally {
      logSpy.mockRestore();
      await rm(dir, { recursive: true, force: true });
    }
  });
});
