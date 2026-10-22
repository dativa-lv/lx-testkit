import { describe, test, expect } from 'bun:test';
import { resolveAxeRuleIds } from '../../src/accessibility/scanner/resolveAxeRules.js';
import { axeRuleSets, knownRuleSets } from '../../src/accessibility/wcag/checklist.js';

describe('resolveAxeRuleIds', () => {
  test('returns null (no restriction, axe default rule set) when ruleSets is undefined', () => {
    expect(resolveAxeRuleIds(undefined)).toBeNull();
  });

  test('returns null for the explicit "all" rule set', () => {
    expect(resolveAxeRuleIds(['all'])).toBeNull();
  });

  test('returns the axe rule ids whose checklist entry references "LVSEN301549"', () => {
    const ids = resolveAxeRuleIds(['LVSEN301549']);
    expect(ids).toContain('th-has-data-cells');
    expect(ids.length).toBeGreaterThan(0);
  });

  test('"axe" returns every rule with any checklist mapping, regardless of which standard', () => {
    const ids = resolveAxeRuleIds(['axe']);
    expect(ids).toEqual(Object.keys(axeRuleSets));
    expect(ids).toContain('button-name');
  });

  test('restricts to a smaller subset for a less common standard ("W3C ARIA")', () => {
    const ids = resolveAxeRuleIds(['W3C ARIA']);
    expect(ids).toEqual(Object.keys(axeRuleSets).filter((id) => axeRuleSets[id].includes('W3C ARIA')));
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.length).toBeLessThan(Object.keys(axeRuleSets).length);
  });

  test('returns an empty array for a set name that matches no rules', () => {
    expect(resolveAxeRuleIds(['not-a-real-standard'])).toEqual([]);
  });

  test('returns the union of rules mapped to selected standards without duplicates', () => {
    const selectedSets = ['act', 'W3C ARIA'];
    const ids = resolveAxeRuleIds(selectedSets);
    const expected = Object.keys(axeRuleSets).filter((id) =>
      selectedSets.some((selectedSet) => axeRuleSets[id].includes(selectedSet))
    );
    expect(ids).toEqual(expected);
  });

  test('returns null when all is one of multiple selected sets', () => {
    expect(resolveAxeRuleIds(['act', 'all'])).toBeNull();
  });

  test('every generated rule set name is a non-empty string present in knownRuleSets', () => {
    for (const id of Object.keys(axeRuleSets)) {
      for (const set of axeRuleSets[id]) {
        expect(knownRuleSets).toContain(set);
      }
    }
  });
});
