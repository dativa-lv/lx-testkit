import { describe, test, expect } from 'bun:test';
import { axeRuleNames, axeRuleSets, knownRuleSets } from '../../src/accessibility/wcag/checklist.js';

describe('checklist (loaded on the spot from criteria-and-rules.json)', () => {
  test('maps a known axe rule id to its checklist name', () => {
    expect(axeRuleNames['th-has-data-cells']).toBe('Neizmantoti `th` elementi tabulas izkārtojumā');
  });

  test('collects the other standards each axe rule is also mapped to', () => {
    expect(axeRuleSets['th-has-data-cells']).toContain('LVSEN301549');
    expect(axeRuleSets['th-has-data-cells']).toContain('wcag21');
  });

  test('knownRuleSets lists every standard name referenced in the checklist', () => {
    expect(knownRuleSets).toContain('LVSEN301549');
    expect(knownRuleSets).toContain('wcag21');
  });

  test('includes checklist entries whose "axe" id is not a real axe-core rule id (handled at scan time, not filtered here)', () => {
    expect(axeRuleNames['1.4.10-reflow']).toBeDefined();
  });
});
