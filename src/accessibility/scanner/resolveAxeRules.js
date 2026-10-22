import { axeRuleSets } from '../wcag/checklist.js';

/**
 * Resolves a config `ruleSets` value to the axe rule ids a scan should be
 * restricted to, or `null` to run axe's full default rule set.
 *
 * `ruleSets` is an array and can contain:
 * - `'all'` - no restriction, axe's full default rule set.
 * - `'axe'` - every axe rule that has *any* mapping in the LX manual
 *   checklist (some checklist entries, e.g. a manual-only check like
 *   `menu-item-name`, have no axe mapping at all and are never included).
 * - names of standards present in the checklist mappings (e.g.
 *   `'LVSEN301549'`, `'wcag21'`, `'act'`) - restrict to rules whose checklist
 *   entry also references at least one selected standard.
 *
 * See `wcag/checklist.js` for the full mapping and `knownRuleSets` for valid
 * standard names.
 */
export function resolveAxeRuleIds(ruleSets) {
  if (!ruleSets || ruleSets.includes('all')) {
    return null;
  }

  if (ruleSets.includes('axe')) {
    return Object.keys(axeRuleSets);
  }

  return Object.entries(axeRuleSets)
    .filter(([, sets]) => ruleSets.some((selectedSet) => sets.includes(selectedSet)))
    .map(([id]) => id);
}
