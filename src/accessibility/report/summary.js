import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Counts the findings in a built report - one per `errorRegistry` entry, i.e.
 * the errors listed in the assessment. Works for reports from this run and
 * for previously uploaded ones, so the two counts are always comparable.
 */
export function countFindings(report) {
  return Object.keys(report?.errorRegistry ?? {}).length;
}

/**
 * Reads a previous report and returns its findings count, or `null` when the
 * file is missing or not a report - a baseline is optional, so this never throws.
 */
export async function readBaselineFindings(baselinePath) {
  try {
    const report = JSON.parse(await readFile(baselinePath, 'utf8'));
    if (!report?.errorRegistry) throw new Error('not an accessibility report');
    return countFindings(report);
  } catch (err) {
    console.warn(`Baseline report ignored (${baselinePath}): ${err.message}`);
    return null;
  }
}

/**
 * Writes scan totals as shell-sourceable `KEY=value` lines, so CI steps that
 * lack a JSON parser (e.g. a plain curl image) can read them with `. <path>`.
 * `A11Y_FINDINGS_TOTAL_PREVIOUS` is only written when a baseline count is known.
 */
export async function writeSummary({ scans, findings, previousFindings = null }, summaryPath) {
  const lines = [`A11Y_SCANS=${scans}`, `A11Y_FINDINGS_TOTAL=${findings}`];
  if (previousFindings !== null) lines.push(`A11Y_FINDINGS_TOTAL_PREVIOUS=${previousFindings}`);

  await mkdir(path.dirname(summaryPath), { recursive: true });
  await writeFile(summaryPath, `${lines.join('\n')}\n`, 'utf8');
}
