import { describe, test, expect } from 'bun:test';
import { describeOrientationFindings } from '../../src/accessibility/customChecks/orientation.js';

describe('describeOrientationFindings', () => {
  test('returns no findings when both orientations look equivalent', () => {
    const portrait = { interactiveCount: 10, rotatePromptVisible: false };
    const landscape = { interactiveCount: 10, rotatePromptVisible: false };
    expect(describeOrientationFindings(portrait, landscape)).toEqual([]);
  });

  test('flags a rotate-device prompt detected in either orientation', () => {
    const portrait = { interactiveCount: 10, rotatePromptVisible: true };
    const landscape = { interactiveCount: 10, rotatePromptVisible: false };
    const findings = describeOrientationFindings(portrait, landscape);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatch(/rotate their device/);
  });

  test('flags a large drop in interactive element count between orientations', () => {
    const portrait = { interactiveCount: 2, rotatePromptVisible: false };
    const landscape = { interactiveCount: 10, rotatePromptVisible: false };
    const findings = describeOrientationFindings(portrait, landscape);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatch(/differs significantly/);
  });

  test('does not flag a small difference in interactive element count', () => {
    const portrait = { interactiveCount: 9, rotatePromptVisible: false };
    const landscape = { interactiveCount: 10, rotatePromptVisible: false };
    expect(describeOrientationFindings(portrait, landscape)).toEqual([]);
  });

  test('does not divide by zero when both counts are zero', () => {
    const portrait = { interactiveCount: 0, rotatePromptVisible: false };
    const landscape = { interactiveCount: 0, rotatePromptVisible: false };
    expect(describeOrientationFindings(portrait, landscape)).toEqual([]);
  });
});
