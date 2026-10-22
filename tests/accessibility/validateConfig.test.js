import { describe, test, expect } from 'bun:test';
import { validateConfig } from '../../src/accessibility/config/validateConfig.js';

function validConfig() {
  return {
    projectName: 'LX portāls',
    baseUrl: 'https://lx-ui.dev/lv',
    pages: [{ name: 'Buttons', path: '/sandbox/button/variations' }],
  };
}

describe('validateConfig', () => {
  test('accepts a valid config', () => {
    expect(() => validateConfig(validConfig())).not.toThrow();
  });

  test('accepts a page with states', () => {
    const config = validConfig();
    config.pages[0].states = [{ name: 'initial' }, { name: 'opened', run: async () => {} }];
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('rejects missing projectName', () => {
    const config = validConfig();
    delete config.projectName;
    expect(() => validateConfig(config)).toThrow(/projectName/);
  });

  test('rejects missing baseUrl', () => {
    const config = validConfig();
    delete config.baseUrl;
    expect(() => validateConfig(config)).toThrow(/baseUrl/);
  });

  test('rejects missing pages', () => {
    const config = validConfig();
    delete config.pages;
    expect(() => validateConfig(config)).toThrow(/pages/);
  });

  test('rejects empty pages array', () => {
    const config = validConfig();
    config.pages = [];
    expect(() => validateConfig(config)).toThrow(/pages/);
  });

  test('rejects a page missing both path and url', () => {
    const config = validConfig();
    config.pages = [{ name: 'Home' }];
    expect(() => validateConfig(config)).toThrow(/path.*url/);
  });

  test('rejects a page missing name', () => {
    const config = validConfig();
    config.pages = [{ path: '/home' }];
    expect(() => validateConfig(config)).toThrow(/name/);
  });

  test('accepts a page with an absolute url instead of path', () => {
    const config = validConfig();
    config.pages = [{ name: 'External', url: 'https://example.com/page' }];
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('rejects an invalid state (missing name)', () => {
    const config = validConfig();
    config.pages[0].states = [{ run: async () => {} }];
    expect(() => validateConfig(config)).toThrow(/states\[0\]\.name/);
  });

  test('rejects a state with a non-function run', () => {
    const config = validConfig();
    config.pages[0].states = [{ name: 'initial', run: 'not-a-function' }];
    expect(() => validateConfig(config)).toThrow(/run must be a function/);
  });

  test('accepts a page with valid preselectedCriteria', () => {
    const config = validConfig();
    config.pages[0].preselectedCriteria = ['images', 'form'];
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('rejects a non-array preselectedCriteria', () => {
    const config = validConfig();
    config.pages[0].preselectedCriteria = 'images';
    expect(() => validateConfig(config)).toThrow(/preselectedCriteria must be an array/);
  });

  test('rejects unknown preselectedCriteria values', () => {
    const config = validConfig();
    config.pages[0].preselectedCriteria = ['images', 'not-a-real-category'];
    expect(() => validateConfig(config)).toThrow(/preselectedCriteria\[1\] must be one of/);
  });

  test('accepts a state with valid preselectedCriteria', () => {
    const config = validConfig();
    config.pages[0].states = [{ name: 'dialog-open', preselectedCriteria: ['images'] }];
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('rejects unknown preselectedCriteria values on a state', () => {
    const config = validConfig();
    config.pages[0].states = [{ name: 'dialog-open', preselectedCriteria: ['not-a-real-category'] }];
    expect(() => validateConfig(config)).toThrow(/states\[0\]\.preselectedCriteria\[0\] must be one of/);
  });

  test('rejects a non-object config', () => {
    expect(() => validateConfig(null)).toThrow();
    expect(() => validateConfig('nope')).toThrow();
  });

  test('accepts an array with a valid ruleSets value', () => {
    const config = validConfig();
    config.ruleSets = ['LVSEN301549'];
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('accepts any known standard name in ruleSets, not just LVSEN301549', () => {
    const config = validConfig();
    config.ruleSets = ['act'];
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('accepts "axe" in ruleSets (every checklist-mapped axe rule)', () => {
    const config = validConfig();
    config.ruleSets = ['axe'];
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('accepts multiple rule sets', () => {
    const config = validConfig();
    config.ruleSets = ['act', 'W3C ARIA'];
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('rejects a string ruleSets value', () => {
    const config = validConfig();
    config.ruleSets = 'act';
    expect(() => validateConfig(config)).toThrow(/"ruleSets" must be a non-empty array/);
  });

  test('reports that the singular ruleSet key was renamed', () => {
    const config = validConfig();
    config.ruleSet = ['act'];
    expect(() => validateConfig(config)).toThrow(/"ruleSet" has been renamed to "ruleSets"/);
  });

  test('rejects an empty ruleSets array', () => {
    const config = validConfig();
    config.ruleSets = [];
    expect(() => validateConfig(config)).toThrow(/"ruleSets" must be a non-empty array/);
  });

  test('rejects an unknown ruleSets entry', () => {
    const config = validConfig();
    config.ruleSets = ['act', 'not-a-real-rule-set'];
    expect(() => validateConfig(config)).toThrow(/"ruleSets\[1\]" must be one of/);
  });

  test('accepts a boolean customChecks', () => {
    const config = validConfig();
    config.customChecks = false;
    expect(() => validateConfig(config)).not.toThrow();
  });

  test('rejects a non-boolean customChecks', () => {
    const config = validConfig();
    config.customChecks = 'nope';
    expect(() => validateConfig(config)).toThrow(/"customChecks" must be a boolean/);
  });

  test('collects multiple errors in one message', () => {
    expect(() => validateConfig({})).toThrow(/projectName[\s\S]*baseUrl[\s\S]*pages/);
  });
});
