import { describe, test, expect } from 'bun:test';
import { evaluateAxeResults, impactToLevel } from '../../src/accessibility/wcag/evaluator.js';

function rule(tags, extra = {}) {
  return { id: 'some-rule', tags, ...extra };
}

describe('evaluateAxeResults', () => {
  test('marks a criterion as match when a mapped rule passes with no violations', () => {
    const results = evaluateAxeResults({ passes: [rule(['wcag412'])] });
    expect(results.get('4.1.2')).toEqual({ matchStatus: 'match', violations: [], incomplete: [] });
  });

  test('marks a criterion as not-match when a mapped rule has a violation', () => {
    const violation = rule(['wcag111'], { id: 'image-alt' });
    const results = evaluateAxeResults({ violations: [violation] });
    expect(results.get('1.1.1').matchStatus).toBe('not-match');
    expect(results.get('1.1.1').violations).toEqual([violation]);
  });

  test('violations win even if the same criterion also has a pass elsewhere', () => {
    const results = evaluateAxeResults({
      passes: [rule(['wcag412'], { id: 'button-name' })],
      violations: [rule(['wcag412'], { id: 'aria-command-name' })],
    });
    expect(results.get('4.1.2').matchStatus).toBe('not-match');
  });

  test('marks a criterion as not-verifiable when a mapped rule is inconclusive/inapplicable', () => {
    const incomplete = evaluateAxeResults({ incomplete: [rule(['wcag143'])] });
    expect(incomplete.get('1.4.3').matchStatus).toBe('not-verifiable');

    const inapplicable = evaluateAxeResults({ inapplicable: [rule(['wcag143'])] });
    expect(inapplicable.get('1.4.3').matchStatus).toBe('not-verifiable');
  });

  test('a criterion with no automated rule at all has no entry in the map', () => {
    const results = evaluateAxeResults({ passes: [rule(['wcag412'])] });
    expect(results.has('2.1.1')).toBe(false);
  });

  test('a violation from a rule with no WCAG tag lands in "Uncategorized" (number "0") instead of vanishing', () => {
    const results = evaluateAxeResults({
      violations: [rule(['cat.keyboard', 'best-practice'], { id: 'tabindex' })],
    });
    expect(results.get('0').matchStatus).toBe('not-match');
    expect(results.get('0').violations).toHaveLength(1);
  });

  test('does not claim every criterion passes just because axe found zero violations', () => {
    const results = evaluateAxeResults({ violations: [], passes: [rule(['wcag412'])] });
    // Only the criterion with actual automated coverage gets "match".
    expect(results.get('4.1.2').matchStatus).toBe('match');
    expect(results.has('1.1.1')).toBe(false);
  });

  test('an incomplete finding is collected but keeps the criterion not-verifiable (never not-match)', () => {
    const incomplete = rule(['wcag131'], { id: 'th-has-data-cells' });
    const results = evaluateAxeResults({ incomplete: [incomplete] });
    expect(results.get('1.3.1').matchStatus).toBe('not-verifiable');
    expect(results.get('1.3.1').incomplete).toEqual([incomplete]);
  });

  test('an incomplete finding with no WCAG tag lands in "Uncategorized" too', () => {
    const results = evaluateAxeResults({
      incomplete: [rule(['best-practice'], { id: 'some-review-item' })],
    });
    expect(results.get('0').incomplete).toHaveLength(1);
  });
});

describe('impactToLevel', () => {
  test('maps known axe impacts to LX error levels', () => {
    expect(impactToLevel('minor')).toBe(2);
    expect(impactToLevel('moderate')).toBe(3);
    expect(impactToLevel('serious')).toBe(4);
    expect(impactToLevel('critical')).toBe(5);
  });

  test('falls back to medium for unknown impact values', () => {
    expect(impactToLevel(undefined)).toBe(3);
    expect(impactToLevel('unknown')).toBe(3);
  });
});
