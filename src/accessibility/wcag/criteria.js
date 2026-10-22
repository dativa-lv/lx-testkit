// Centralized WCAG criterion registry.
//
// Derived directly from the LX accessibility protocol tool's own checklist
// (a local copy of portal's src/assets/criteria-and-rules.json's `criteria`
// array) - not hand-maintained - so reports generated here automatically
// stay compatible with that tool's ids/numbers/names/categories, even as the
// checklist evolves.
//
// NOTE: automated axe-core scanning cannot verify every criterion below. See
// `wcag/evaluator.js` for how criteria are classified as `match`, `not-match`,
// `not-verifiable`, or left `null` when no automated signal is available.
import { checklistData } from './checklistData.js';

export const wcagCriteria = checklistData.criteria;

// Categories the LX protocol tool only evaluates when the page author
// confirms the page actually contains that kind of content (see
// `preselectedCriteria` on report pages). Criteria in these categories start
// as "not-verifiable" until their category is preselected for the page.
export const relevantCriteriaCategories = ['images', 'multimedia', 'form'];

export function getCriterionByNumber(number) {
  return wcagCriteria.find((criterion) => criterion.number === number) ?? null;
}

