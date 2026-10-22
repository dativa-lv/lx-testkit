import { describe, test, expect } from 'bun:test';
import { wcagCriteria, relevantCriteriaCategories, getCriterionByNumber } from '../../src/accessibility/wcag/criteria.js';
import { checklistData } from '../../src/accessibility/wcag/checklistData.js';

describe('wcagCriteria (derived from criteria-and-rules.json on the spot)', () => {
  test('is the same array as the checklist JSON\'s "criteria"', () => {
    expect(wcagCriteria).toBe(checklistData.criteria);
  });

  test('contains the expected fields for a known criterion', () => {
    const criterion = wcagCriteria.find((c) => c.id === 'non-text-content');
    expect(criterion).toEqual({
      id: 'non-text-content',
      name: 'Netekstuāls saturs',
      number: '1.1.1',
      category: 'images',
    });
  });

  test('includes the Uncategorized fallback criterion', () => {
    expect(getCriterionByNumber('0')).toMatchObject({ id: 'Uncategorized' });
  });

  test('getCriterionByNumber returns null for an unknown number', () => {
    expect(getCriterionByNumber('99.9.9')).toBeNull();
  });

  test('relevantCriteriaCategories still gates images/multimedia/form', () => {
    expect(relevantCriteriaCategories).toEqual(['images', 'multimedia', 'form']);
  });
});
