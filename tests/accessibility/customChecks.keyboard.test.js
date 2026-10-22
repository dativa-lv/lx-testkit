import { describe, test, expect } from 'bun:test';
import { analyzeTabTrace, isCustomWidgetCandidate } from '../../src/accessibility/customChecks/keyboard.js';

function step(overrides = {}) {
  return {
    same: false,
    isBody: false,
    tag: 'button',
    role: null,
    hasOutline: true,
    hasBoxShadow: false,
    text: '',
    ...overrides,
  };
}

describe('isCustomWidgetCandidate', () => {
  test('flags a div with an interactive widget role', () => {
    expect(isCustomWidgetCandidate(step({ tag: 'div', role: 'button' }))).toBe(true);
  });

  test('does not flag a native button even with a redundant role', () => {
    expect(isCustomWidgetCandidate(step({ tag: 'button', role: 'button' }))).toBe(false);
  });

  test('does not flag an element with no role at all', () => {
    expect(isCustomWidgetCandidate(step({ tag: 'div', role: null }))).toBe(false);
  });

  test('does not flag a role that is not an interactive widget role', () => {
    expect(isCustomWidgetCandidate(step({ tag: 'div', role: 'heading' }))).toBe(false);
  });

  test('never flags the body fallback step', () => {
    expect(isCustomWidgetCandidate(step({ isBody: true, role: 'button' }))).toBe(false);
  });
});

describe('analyzeTabTrace', () => {
  test('reports reachedNothing when every step lands on body', () => {
    const steps = [step({ isBody: true }), step({ isBody: true })];
    expect(analyzeTabTrace(steps).reachedNothing).toBe(true);
  });

  test('does not report reachedNothing when at least one step focuses a real element', () => {
    const steps = [step({ isBody: true }), step()];
    expect(analyzeTabTrace(steps).reachedNothing).toBe(false);
  });

  test('flags a stuck step in the middle of the sequence', () => {
    const steps = [step(), step({ same: true }), step()];
    expect(analyzeTabTrace(steps).stuckIndices).toEqual([1]);
  });

  test('does not flag the final step as stuck (running out of focusables is normal)', () => {
    const steps = [step(), step(), step({ same: true })];
    expect(analyzeTabTrace(steps).stuckIndices).toEqual([]);
  });

  test('does not flag a stuck body step (falling back to body is normal)', () => {
    const steps = [step(), step({ same: true, isBody: true }), step()];
    expect(analyzeTabTrace(steps).stuckIndices).toEqual([]);
  });

  test('flags a step with neither outline nor box-shadow while focused', () => {
    const steps = [step({ hasOutline: false, hasBoxShadow: false })];
    expect(analyzeTabTrace(steps).missingFocusIndicatorIndices).toEqual([0]);
  });

  test('does not flag a step with a box-shadow but no outline', () => {
    const steps = [step({ hasOutline: false, hasBoxShadow: true })];
    expect(analyzeTabTrace(steps).missingFocusIndicatorIndices).toEqual([]);
  });

  test('does not flag the body fallback step for missing focus indicator', () => {
    const steps = [step({ isBody: true, hasOutline: false, hasBoxShadow: false })];
    expect(analyzeTabTrace(steps).missingFocusIndicatorIndices).toEqual([]);
  });
});
