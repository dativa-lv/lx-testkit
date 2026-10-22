import { randomUUID } from 'node:crypto';

// Mirrors the "LX" + 32-hex-char id format produced by lx-ui's
// `lxStringUtils.generateUUID()` so generated reports use the same id shape
// (e.g. "LX861859d096bbc118a78db080b9915fd6").
export function generateId() {
  return `LX${randomUUID().replace(/-/g, '')}`;
}
