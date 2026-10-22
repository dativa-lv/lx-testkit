#!/usr/bin/env node
import { parseArgs } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAccessibilityConfig } from '../config/loadConfig.js';
import { runAccessibilityChecks } from '../runner/AccessibilityRunner.js';
import { evaluateAxeResults } from '../wcag/evaluator.js';
import { AccessibilityReportBuilder } from '../report/AccessibilityReportBuilder.js';
import { writeReport } from '../report/serializeReport.js';

const DEFAULT_OUTPUT = 'accessibility-report.json';

function printUsage() {
  console.log(`Usage: testkit-a11y --config <path> [--output <path>] [--page <name>]

Options:
  -c, --config <path>   Path to the accessibility config module (required)
  -o, --output <path>   Path to write the JSON report to (default: ${DEFAULT_OUTPUT})
  -p, --page <name>     Only scan the page with this configured name
  -h, --help            Show this help message`);
}

export async function main(argv = process.argv.slice(2)) {
  const { values } = parseArgs({
    args: argv,
    options: {
      config: { type: 'string', short: 'c' },
      output: { type: 'string', short: 'o' },
      page: { type: 'string', short: 'p' },
      help: { type: 'boolean', short: 'h' },
    },
  });

  if (values.help) {
    printUsage();
    return 0;
  }

  if (!values.config) {
    console.error('Error: --config <path> is required.\n');
    printUsage();
    return 1;
  }

  const configPath = path.resolve(process.cwd(), values.config);
  const outputPath = path.resolve(process.cwd(), values.output || DEFAULT_OUTPUT);

  let config;
  try {
    config = await loadAccessibilityConfig(configPath);
  } catch (err) {
    console.error(`Failed to load accessibility config:\n${configPath}\n\nReason:\n${err.message}`);
    return 1;
  }

  let pagesToRun = config.pages;
  if (values.page) {
    pagesToRun = config.pages.filter((page) => page.name === values.page);
    if (pagesToRun.length === 0) {
      console.error(`Error: no page named "${values.page}" found in config.`);
      return 1;
    }
  }

  // Pages with multiple states each produce one scan per state, so the
  // progress denominator must count scans, not configured page entries.
  const totalScans = pagesToRun.reduce((sum, page) => sum + (page.states?.length || 1), 0);

  console.log('Accessibility scan started');
  console.log(`Project: ${config.projectName}`);
  console.log(`Pages: ${pagesToRun.length}`);
  console.log(`Scans: ${totalScans}\n`);

  const builder = new AccessibilityReportBuilder({
    projectName: config.projectName,
    protocol: config.protocol,
    baseUrl: config.baseUrl,
  });

  let index = 0;

  try {
    await runAccessibilityChecks(
      { ...config, pages: pagesToRun },
      {
        onPageScanned: ({ name, url, axeResults, preselectedCriteria }) => {
          index += 1;
          const findingsCount = (axeResults.violations?.length ?? 0) + (axeResults.incomplete?.length ?? 0);

          console.log(`[${index}/${totalScans}] ${name}`);
          console.log(findingsCount ? `  \u2717 ${findingsCount} accessibility findings` : '  \u2713 scanned');

          builder.addPage({
            name,
            url,
            criterionStatuses: evaluateAxeResults(axeResults),
            preselectedCriteria,
          });
        },
      }
    );
  } catch (err) {
    console.error(`\nAccessibility scan failed: ${err.message}`);
    return 1;
  }

  await writeReport(builder.build(), outputPath);

  console.log(`\nReport written to:\n${outputPath}`);

  // Exit code reflects whether the scan itself ran successfully, not
  // whether violations were found - check the report for findings.
  return 0;
}

if (typeof Bun !== 'undefined') {
  const { spawnSync } = await import('node:child_process');

  const result = spawnSync(
    'node',
    [fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    {
      stdio: 'inherit',
    }
  );

  if (result.error) {
    console.error(
      `Could not start Node: ${result.error.message}`
    );
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

const code = await main();
process.exit(code);
