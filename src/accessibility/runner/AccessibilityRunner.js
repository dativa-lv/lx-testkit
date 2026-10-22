import { chromium } from 'playwright';
import { resolvePageUrl } from '../config/resolveUrl.js';
import { scanPageForViolations } from '../scanner/AxeScanner.js';
import { runCustomChecks } from '../customChecks/index.js';
import { mergePreselectedCriteria } from './mergePreselectedCriteria.js';
import * as testkit from '../../components/index.js';

/**
 * Runs the configured pages/states through Playwright + axe-core.
 *
 * For each configured page:
 * 1. Launch a fresh browser context.
 * 2. Navigate to the resolved URL.
 * 3. Run every configured state's `run({ page, testkit })` setup (or a single
 *    default state when none are configured).
 * 4. Scan the resulting page with axe-core, then (unless `config.customChecks
 *    === false`) run the generic keyboard/orientation/sensory-characteristics
 *    checks from `customChecks/` and merge their findings in - these cover
 *    WCAG criteria axe-core cannot check (see `customChecks/index.js`).
 * 5. Close the context, regardless of success/failure.
 *
 * Returns raw scan results per page/state: `{ name, url, axeResults, preselectedCriteria }`.
 * This function has no knowledge of WCAG criteria or the LX report format -
 * that mapping/building happens downstream in `wcag/evaluator.js` and
 * `report/AccessibilityReportBuilder.js`.
 */
export async function runAccessibilityChecks(config, { onPageScanned } = {}) {
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const pageConfig of config.pages) {
      const states = pageConfig.states?.length ? pageConfig.states : [{ name: 'default' }];
      const url = resolvePageUrl(config.baseUrl, pageConfig);

      for (const state of states) {
        const name = pageConfig.states ? `${pageConfig.name} (${state.name})` : pageConfig.name;
        const context = await browser.newContext(
          config.ignoreHTTPSErrors ? { ignoreHTTPSErrors: true } : {}
        );
        const page = await context.newPage();

        try {
          await page.goto(url, { waitUntil: 'networkidle' });

          if (typeof state.run === 'function') {
            await state.run({ page, testkit });
          }

          const axeResults = await scanPageForViolations(page, { ruleSets: config.ruleSets });

          if (config.customChecks !== false) {
            const customResults = await runCustomChecks(page);
            axeResults.violations = [...(axeResults.violations ?? []), ...customResults.violations];
            axeResults.incomplete = [...(axeResults.incomplete ?? []), ...customResults.incomplete];
          }

          const preselectedCriteria = mergePreselectedCriteria(pageConfig, state);
          const result = { name, url, axeResults, preselectedCriteria };
          results.push(result);
          onPageScanned?.(result);
        } catch (err) {
          throw new Error(
            `Failed scanning page "${pageConfig.name}" (state: "${state.name}") at ${url}: ${err.message}`
          );
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}
