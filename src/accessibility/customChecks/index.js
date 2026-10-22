// Runs every custom (non-axe) accessibility check against a page and merges
// their results together. Each check returns axe-shaped
// `{ violations: [...], incomplete: [...] }` (same fields axe-core produces:
// `id`, `impact`, `tags`, `help`, `description`, `nodes`), so the existing
// `wcag/evaluator.js` + `AccessibilityReportBuilder.js` pipeline can consume
// them identically to real axe results - no separate merge logic needed
// downstream, just concatenate onto `axeResults.violations`/`.incomplete`.
import { checkSensoryCharacteristics } from './sensoryCharacteristics.js';
import { checkOrientation } from './orientation.js';
import { checkKeyboard } from './keyboard.js';

const CHECKS = [checkSensoryCharacteristics, checkOrientation, checkKeyboard];

function isContextDestroyedError(err) {
  return /Execution context was destroyed|Target page, context or browser has been closed|frame was detached/i.test(
    err?.message ?? ''
  );
}

// The checks drive the real page (Enter/Space on focused widgets, viewport
// resizes), which can trigger a full page navigation - e.g. a role="link"
// widget inside an <a>, or a dev server (Vite) reloading the page after
// optimizing dependencies. That destroys the execution context mid-evaluate.
// Aborting main-frame navigation requests with `aborted` (net::ERR_ABORTED)
// keeps the current document alive without committing an error page.
// In-app (pushState/hash) navigation issues no request and is unaffected.
async function blockNavigation(page) {
  const handler = (route) => {
    const request = route.request();
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
      return route.abort('aborted');
    }
    return route.fallback();
  };

  await page.route('**/*', handler);
  return () => page.unroute('**/*', handler).catch(() => {});
}

async function runCheck(check, page) {
  try {
    return await check(page);
  } catch (err) {
    if (!isContextDestroyedError(err) || page.isClosed()) {
      throw err;
    }
    // A navigation slipped through anyway (e.g. a back/forward history navigation) -
    // wait for the new document to settle and run the check once more.
    await page.waitForLoadState('load').catch(() => {});
    return check(page);
  }
}

export async function runCustomChecks(page) {
  const results = { violations: [], incomplete: [] };
  const unblockNavigation = await blockNavigation(page);

  try {
    // Sequential, not parallel: checkOrientation/checkKeyboard both mutate
    // shared page state (viewport size, DOM focus), so they'd race otherwise.
    for (const check of CHECKS) {
      try {
        const result = await runCheck(check, page);
        results.violations.push(...(result.violations ?? []));
        results.incomplete.push(...(result.incomplete ?? []));
      } catch (err) {
        // A custom check failing on an unusual page must never abort the
        // whole scan - axe's own results are still valid without it.
        console.warn(`Custom accessibility check failed: ${err.message}`);
      }
    }
  } finally {
    await unblockNavigation();
  }

  return results;
}
