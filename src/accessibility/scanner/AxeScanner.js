import AxeBuilder from '@axe-core/playwright';
import { resolveAxeRuleIds } from './resolveAxeRules.js';
import { scanWithRuleRetry } from './scanWithRuleRetry.js';

/**
 * Runs an axe-core accessibility scan against a Playwright page.
 * Returns axe-core's raw results ({ violations, passes, incomplete,
 * inapplicable, ... }). This is treated as an internal representation only -
 * callers must go through the WCAG evaluator/report builder, never expose
 * this shape directly as the final report.
 *
 * `ruleSets: ['LVSEN301549', 'act']` (or any other standard names present in
 * the checklist mappings) restricts axe to rules whose checklist entry
 * references at least one selected standard, instead of axe's full default
 * rule set.
 */
export async function scanPageForViolations(page, { ruleSets = ['all'] } = {}) {
  const ruleIds = resolveAxeRuleIds(ruleSets);

  return scanWithRuleRetry(ruleIds, (ids) => {
    const builder = new AxeBuilder({ page });
    if (ids) {
      builder.withRules(ids);
    }
    return builder.analyze();
  });
}
