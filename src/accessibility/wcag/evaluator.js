import { axeTagsToCriterionNumbers } from './axeTagMapper.js';

// Axe `impact` -> LX error "level" (1 = suggestion .. 5 = critical).
// Axe never reports "minor" as 1/"suggestion", so that level is reserved for
// future manual/informational findings and is not produced by this evaluator.
const IMPACT_TO_LEVEL = {
  minor: 2,
  moderate: 3,
  serious: 4,
  critical: 5,
};

export function impactToLevel(impact) {
  return IMPACT_TO_LEVEL[impact] ?? 3;
}

/**
 * Normalizes raw axe-core results (`{ violations, passes, incomplete, inapplicable }`)
 * into a per-criterion-number map describing what automated evidence exists.
 *
 * Status semantics (must match the LX accessibility protocol vocabulary):
 * - "not-match": at least one axe rule mapped to the criterion reported a violation.
 * - "match": no violations, but at least one mapped rule executed and passed.
 * - "not-verifiable": a mapped rule executed but was inconclusive/inapplicable on
 *   this page, so automation cannot confirm a pass. Inconclusive (`incomplete`)
 *   findings are still collected (see `entry.incomplete`) so reviewers can see
 *   exactly what axe flagged as uncertain, without claiming a confirmed failure.
 * - not present in the map at all: no axe rule is mapped to this criterion, so
 *   automation has no signal whatsoever (report builder leaves matchStatus null).
 *
 * IMPORTANT: axe finding no violations never implies every WCAG criterion passes.
 * Only criteria with actual automated evidence get "match".
 */
export function evaluateAxeResults(axeResults = {}) {
  const byCriterionNumber = new Map();

  const ensure = (number) => {
    if (!byCriterionNumber.has(number)) {
      byCriterionNumber.set(number, { matchStatus: 'not-verifiable', violations: [], incomplete: [] });
    }
    return byCriterionNumber.get(number);
  };

  for (const rule of axeResults.passes ?? []) {
    for (const number of axeTagsToCriterionNumbers(rule.tags)) {
      const entry = ensure(number);
      if (entry.matchStatus !== 'not-match') {
        entry.matchStatus = 'match';
      }
    }
  }

  for (const rule of axeResults.incomplete ?? []) {
    const numbers = axeTagsToCriterionNumbers(rule.tags);
    for (const number of numbers.length > 0 ? numbers : ['0']) {
      ensure(number).incomplete.push(rule);
    }
  }

  for (const rule of axeResults.inapplicable ?? []) {
    for (const number of axeTagsToCriterionNumbers(rule.tags)) {
      ensure(number);
    }
  }

  // Violations always win: a criterion with a confirmed failure is "not-match"
  // even if other mapped rules passed elsewhere on the page.
  // Violations from rules with no WCAG tag at all (e.g. axe best-practice
  // rules like "tabindex") still need to surface somewhere - route them to
  // the registry's "Uncategorized" (number "0") bucket instead of silently
  // dropping real findings.
  for (const rule of axeResults.violations ?? []) {
    const numbers = axeTagsToCriterionNumbers(rule.tags);
    for (const number of numbers.length > 0 ? numbers : ['0']) {
      const entry = ensure(number);
      entry.matchStatus = 'not-match';
      entry.violations.push(rule);
    }
  }

  return byCriterionNumber;
}
