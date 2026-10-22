// Maps axe-core's own WCAG tags (e.g. "wcag111", "wcag1411") to dotted
// success-criterion numbers (e.g. "1.1.1", "1.4.11").
//
// axe-core rules declare these tags themselves as part of their metadata, so
// deriving the mapping from `tags` (rather than hand-listing rule -> criteria
// pairs) keeps the mapping accurate and automatically covers new axe rules
// without code changes here.
const WCAG_TAG_PATTERN = /^wcag(\d)(\d)(\d{1,2})$/;

export function axeTagToCriterionNumber(tag) {
  const match = WCAG_TAG_PATTERN.exec(tag);

  if (!match) {
    return null;
  }

  const [, principle, guideline, criterion] = match;
  return `${principle}.${guideline}.${Number(criterion)}`;
}

export function axeTagsToCriterionNumbers(tags = []) {
  const numbers = tags.map(axeTagToCriterionNumber).filter((number) => number !== null);
  return [...new Set(numbers)];
}
