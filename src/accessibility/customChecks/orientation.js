// Custom heuristic check for WCAG 1.3.4 (Orientation), which axe-core only
// partially covers (its `css-orientation-lock` rule catches CSS media-query
// locks, not content that becomes unusable/hidden in one orientation for
// non-essential reasons). This resizes the viewport between a portrait and
// landscape layout and compares what's visible.
//
// A match is reported as a violation (matchStatus becomes `not-match`) since
// it's real, observed evidence worth surfacing prominently, but it's still a
// heuristic (it can never prove the page is compliant), so `needsManualReview`
// keeps the "needs manual verification" caveat in its error text.
import { FOCUSABLE_SELECTOR } from './constants.js';

const ROTATE_PROMPT_PATTERN =
  /(rotate|turn)\s+your\s+(device|screen|phone)|pagrieziet\s+(savu\s+)?(ier[īi]ci|ekr[āa]nu)/i;

async function inspectViewport(page, viewport) {
  await page.setViewportSize(viewport);
  // let responsive layout/JS (media query listeners, resize handlers) settle
  await page.waitForTimeout(75);

  return page.evaluate((selector) => {
    const isVisible = (el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    };

    const interactiveCount = Array.from(document.querySelectorAll(selector)).filter(isVisible).length;

    return { interactiveCount, bodyText: document.body.innerText || '' };
  }, FOCUSABLE_SELECTOR);
}

/**
 * Pure decision logic, extracted for unit testing without a browser.
 * `portrait`/`landscape` are `{ interactiveCount, rotatePromptVisible }`.
 */
export function describeOrientationFindings(portrait, landscape) {
  const findings = [];

  if (portrait.rotatePromptVisible || landscape.rotatePromptVisible) {
    findings.push('A message asking the user to rotate their device was detected.');
  }

  const counts = [portrait.interactiveCount, landscape.interactiveCount];
  const larger = Math.max(...counts);
  const smaller = Math.min(...counts);
  if (larger > 0 && smaller / larger < 0.7) {
    findings.push(
      `Interactive element count differs significantly between orientations ` +
        `(portrait: ${portrait.interactiveCount}, landscape: ${landscape.interactiveCount}).`
    );
  }

  return findings;
}

export async function checkOrientation(page) {
  const originalViewport = page.viewportSize();

  try {
    // Sequential, not parallel - both share the same page/viewport, so
    // resizing concurrently would race.
    const portraitRaw = await inspectViewport(page, { width: 390, height: 844 });
    const landscapeRaw = await inspectViewport(page, { width: 844, height: 390 });

    const portrait = { ...portraitRaw, rotatePromptVisible: ROTATE_PROMPT_PATTERN.test(portraitRaw.bodyText) };
    const landscape = { ...landscapeRaw, rotatePromptVisible: ROTATE_PROMPT_PATTERN.test(landscapeRaw.bodyText) };

    const findings = describeOrientationFindings(portrait, landscape);

    if (findings.length === 0) {
      return { violations: [], incomplete: [] };
    }

    return {
      violations: [
        {
          id: 'custom-orientation',
          impact: 'moderate',
          tags: ['wcag134'],
          needsManualReview: true,
          help: 'Content may restrict its view to a single display orientation',
          description: findings.join(' '),
          nodes: [{ target: ['html'], failureSummary: findings.join(' ') }],
        },
      ],
      incomplete: [],
    };
  } finally {
    if (originalViewport) {
      await page.setViewportSize(originalViewport);
    }
  }
}
