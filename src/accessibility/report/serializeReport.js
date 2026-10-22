import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Serializes a report object to formatted JSON and writes it to disk,
 * creating the output directory if needed.
 */
export async function writeReport(report, outputPath) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(report, null, 2), 'utf8');
}
