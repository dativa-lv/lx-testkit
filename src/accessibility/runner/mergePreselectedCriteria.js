// A state can reveal additional content the base page doesn't have (e.g.
// opening a dialog with images), so its preselectedCriteria is merged with
// (not a replacement for) the page's preselectedCriteria for that scan.
export function mergePreselectedCriteria(pageConfig, state) {
  return [...new Set([...(pageConfig.preselectedCriteria ?? []), ...(state.preselectedCriteria ?? [])])];
}
