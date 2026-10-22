// Reads the manual accessibility checklist once, so wcag/criteria.js and
// wcag/checklist.js can both derive their data from a single source.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const checklistPath = path.join(dir, '../criteria-and-rules.json');

export const checklistData = JSON.parse(readFileSync(checklistPath, 'utf8'));
