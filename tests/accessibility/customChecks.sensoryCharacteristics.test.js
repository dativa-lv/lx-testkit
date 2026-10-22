import { describe, test, expect } from 'bun:test';
import { SENSORY_REFERENCE_PATTERN } from '../../src/accessibility/customChecks/sensoryCharacteristics.js';

function matches(text) {
  SENSORY_REFERENCE_PATTERN.lastIndex = 0;
  return SENSORY_REFERENCE_PATTERN.test(text);
}

describe('SENSORY_REFERENCE_PATTERN', () => {
  test('flags an action verb near a color reference (English)', () => {
    expect(matches('Click the red button to continue.')).toBe(true);
  });

  test('flags an action verb near a position reference (English)', () => {
    expect(matches('Select the option on the left to proceed.')).toBe(true);
  });

  test('flags an action verb near a shape reference (English)', () => {
    expect(matches('Press the round icon at the top.')).toBe(true);
  });

  test('flags an action verb near a color reference (Latvian)', () => {
    expect(matches('Nospiediet zaļo pogu, lai turpinātu.')).toBe(true);
  });

  test('flags an action verb near a position reference (Latvian)', () => {
    expect(matches('Izvēlieties kreisajā pusē esošo opciju.')).toBe(true);
  });

  test('does not flag unrelated text', () => {
    expect(matches('This paragraph explains how the pricing plans work.')).toBe(false);
  });

  test('does not flag a sensory word with no nearby action verb', () => {
    expect(matches('The sky was blue and the field was green.')).toBe(false);
  });
});
