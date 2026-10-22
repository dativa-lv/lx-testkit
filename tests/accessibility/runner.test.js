import { describe, test, expect } from 'bun:test';
import { mergePreselectedCriteria } from '../../src/accessibility/runner/mergePreselectedCriteria.js';

describe('mergePreselectedCriteria', () => {
  test('merges page-level and state-level values without duplicates', () => {
    const result = mergePreselectedCriteria({ preselectedCriteria: ['form'] }, { preselectedCriteria: ['images', 'form'] });
    expect(result.sort()).toEqual(['form', 'images']);
  });

  test('a page with no preselectedCriteria still picks up the state-level ones', () => {
    const result = mergePreselectedCriteria({}, { preselectedCriteria: ['multimedia'] });
    expect(result).toEqual(['multimedia']);
  });

  test('a state with no preselectedCriteria keeps just the page-level ones', () => {
    const result = mergePreselectedCriteria({ preselectedCriteria: ['form'] }, {});
    expect(result).toEqual(['form']);
  });

  test('neither page nor state declaring anything produces an empty array', () => {
    expect(mergePreselectedCriteria({}, {})).toEqual([]);
  });
});
