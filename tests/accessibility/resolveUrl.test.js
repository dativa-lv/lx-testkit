import { describe, test, expect } from 'bun:test';
import { resolvePageUrl } from '../../src/accessibility/config/resolveUrl.js';

describe('resolvePageUrl', () => {
  test('joins baseUrl and path', () => {
    expect(resolvePageUrl('https://example.com', { path: '/users' })).toBe(
      'https://example.com/users'
    );
  });

  test('handles baseUrl trailing slash and path without leading slash', () => {
    expect(resolvePageUrl('https://example.com/', { path: 'users' })).toBe(
      'https://example.com/users'
    );
  });

  test('handles baseUrl trailing slash and path with leading slash', () => {
    expect(resolvePageUrl('https://example.com/', { path: '/users' })).toBe(
      'https://example.com/users'
    );
  });

  test('handles baseUrl with a sub-path', () => {
    expect(resolvePageUrl('https://lx-ui.dev/lv', { path: '/sandbox/button/variations' })).toBe(
      'https://lx-ui.dev/lv/sandbox/button/variations'
    );
  });

  test('uses an absolute page url as-is when provided', () => {
    expect(resolvePageUrl('https://example.com', { url: 'https://other.com/page' })).toBe(
      'https://other.com/page'
    );
  });
});
