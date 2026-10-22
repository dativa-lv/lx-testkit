// Loads the manual accessibility checklist and derives the pieces
// the automated scanner needs.
import { checklistData } from './checklistData.js';

// First occurrence wins when multiple manual rules map to the same axe id.
const names = {};
// Union across every manual rule mapped to the same axe id - "does any
// checklist entry using this axe rule reference standard X" is a yes/no
// question, unlike the display name (which needs a single winner).
const sets = {};

for (const rule of checklistData.accessibilityRules ?? []) {
  const axeMapping = rule.mapping?.find((m) => m.set === 'axe' && m.id);
  if (!axeMapping) {
    continue;
  }

  const id = axeMapping.id;
  if (!(id in names)) {
    names[id] = rule.name;
  }

  const ruleSets = (sets[id] ??= new Set());
  for (const mapping of rule.mapping) {
    if (mapping.set && mapping.set !== 'axe') {
      ruleSets.add(mapping.set);
    }
  }
}

/** { axeRuleId: localizedName } - see AccessibilityReportBuilder's error names. */
export const axeRuleNames = names;

/**
 * { axeRuleId: string[] } - other standards (LVSEN301549, wcag21, act, ...)
 * each axe rule's checklist entry is also mapped to. Used by
 * scanner/resolveAxeRules.js to restrict a scan's rule set via the config's
 * `ruleSets` option.
 *
 * NOTE: the checklist can have a handful of "axe" mapping ids that aren't real
 * axe-core rule ids (typos/stale references). This module doesn't validate
 * against real axe-core rules - AxeScanner.js handles that at scan time
 * (retries with unknown ids stripped) since only that call site has axe-core
 * available to check against.
 */
export const axeRuleSets = Object.fromEntries(
  Object.entries(sets).map(([id, ruleSets]) => [id, [...ruleSets].sort()])
);

/** Sorted list of every standard name referenced anywhere in the checklist. */
export const knownRuleSets = [...new Set(Object.values(axeRuleSets).flat())].sort();
