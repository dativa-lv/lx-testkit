import { describe, test, expect } from 'bun:test';
import {
  axeTagToCriterionNumber,
  axeTagsToCriterionNumbers,
} from '../../src/accessibility/wcag/axeTagMapper.js';

describe('axeTagToCriterionNumber', () => {
  test('parses 3-digit tags', () => {
    expect(axeTagToCriterionNumber('wcag111')).toBe('1.1.1');
    expect(axeTagToCriterionNumber('wcag412')).toBe('4.1.2');
  });

  test('parses 4-digit tags with a 2-digit success criterion', () => {
    expect(axeTagToCriterionNumber('wcag1411')).toBe('1.4.11');
    expect(axeTagToCriterionNumber('wcag2411')).toBe('2.4.11');
    expect(axeTagToCriterionNumber('wcag258')).toBe('2.5.8');
  });

  test('ignores non-numeric wcag tags', () => {
    expect(axeTagToCriterionNumber('wcag2a')).toBeNull();
    expect(axeTagToCriterionNumber('wcag21aa')).toBeNull();
  });

  test('ignores unrelated tags', () => {
    expect(axeTagToCriterionNumber('cat.text-alternatives')).toBeNull();
    expect(axeTagToCriterionNumber('best-practice')).toBeNull();
  });
});

describe('axeTagsToCriterionNumbers', () => {
  test('extracts and dedupes criterion numbers from a tag list', () => {
    const tags = ['cat.forms', 'wcag412', 'wcag2a', 'wcag412'];
    expect(axeTagsToCriterionNumbers(tags)).toEqual(['4.1.2']);
  });

  test('returns an empty array when nothing matches', () => {
    expect(axeTagsToCriterionNumbers(['best-practice'])).toEqual([]);
  });
});
