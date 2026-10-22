// Real (non-mocked) Playwright + axe-core scan against a local fixture page.
// Runs the actual production runner/evaluator/report-builder code and prints
// the resulting report as JSON on stdout.
//
// This is executed as a child `node` process (see integration.real.test.js)
// because Bun's own JS runtime currently hangs on page.goto() when driving a
// real Chromium browser.
import { createServer } from 'node:http';
import { runAccessibilityChecks } from '../../../src/accessibility/runner/AccessibilityRunner.js';
import { evaluateAxeResults } from '../../../src/accessibility/wcag/evaluator.js';
import { AccessibilityReportBuilder } from '../../../src/accessibility/report/AccessibilityReportBuilder.js';

const HTML = `<!doctype html>
<html lang="en">
  <head><title>a11y integration fixture</title></head>
  <body>
    <img src="logo.png" />
    <button></button>
    <p>Hello, accessible world.</p>
  </body>
</html>`;

async function main() {
  const server = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(HTML);
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const config = {
      projectName: 'Integration fixture',
      baseUrl,
      pages: [{ name: 'Fixture page', path: '/', preselectedCriteria: ['images'] }],
    };

    const results = await runAccessibilityChecks(config);
    const builder = new AccessibilityReportBuilder({
      projectName: config.projectName,
      baseUrl: config.baseUrl,
    });

    for (const { name, url, axeResults, preselectedCriteria } of results) {
      builder.addPage({
        name,
        url,
        criterionStatuses: evaluateAxeResults(axeResults),
        preselectedCriteria,
      });
    }

    process.stdout.write(JSON.stringify(builder.build()));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
