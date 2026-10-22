// The checklist can have a handful of "axe" mapping ids that aren't real
// axe-core rule ids (typos/stale references - see wcag/checklist.js). Rather
// than validating the checklist against axe-core ahead of time, retry the
// scan with any rejected id stripped: axe's own error tells us exactly which
// id it doesn't recognize.
const UNKNOWN_RULE_PATTERN = /unknown rule `([^`]+)` in options\.runOnly/;

/**
 * Runs `runScan(ruleIds)` (expected to call `AxeBuilder.withRules(ruleIds)`
 * when `ruleIds` isn't null, then `.analyze()`), retrying with any axe-rejected
 * rule id removed until it succeeds, `ruleIds` is exhausted, or the error
 * isn't an "unknown rule" error (which is rethrown as-is).
 */
export async function scanWithRuleRetry(ruleIds, runScan) {
  let remainingIds = ruleIds;
  const maxAttempts = (remainingIds?.length ?? 0) + 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await runScan(remainingIds);
    } catch (err) {
      const match = UNKNOWN_RULE_PATTERN.exec(err.message);
      if (!remainingIds || !match || !remainingIds.includes(match[1])) {
        throw err;
      }
      remainingIds = remainingIds.filter((id) => id !== match[1]);
    }
  }

  throw new Error('scanWithRuleRetry: exceeded retry attempts without a successful scan.');
}
