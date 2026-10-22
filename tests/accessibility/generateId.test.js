import { describe, test, expect } from 'bun:test';
import { generateId } from '../../src/accessibility/ids/generateId.js';

describe('generateId', () => {
  test('produces ids in the LX + 32 hex char format', () => {
    const id = generateId();
    expect(id).toMatch(/^LX[0-9a-f]{32}$/);
  });

  test('produces unique ids', () => {
    const ids = new Set(Array.from({ length: 200 }, () => generateId()));
    expect(ids.size).toBe(200);
  });
});
