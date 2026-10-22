// Generic keyboard-operability engine, exercising real Tab/Enter/Space/Escape
// key presses against whatever page it's given - no app-specific knowledge
// required. Covers the parts of 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap),
// and 2.4.7 (Focus Visible) that axe-core cannot check because they require
// actually driving the keyboard, not just inspecting static DOM/CSS.
//
// Every finding here becomes a `violation` (matchStatus `not-match`) since
// each is based on real, observed keyboard behavior, not a text guess. Most
// still set `needsManualReview: true` to keep an honest caveat in their error
// text, since a single automated pass can still misjudge a legitimate
// pattern (e.g. a widget whose parent handles the keydown) - see
// `splitFindings()`. The one exception is "no element ever received focus":
// that's confident enough to report without a caveat.
import { FOCUSABLE_SELECTOR } from './constants.js';

const NATIVE_INTERACTIVE_TAGS = new Set(['button', 'a', 'input', 'select', 'textarea', 'summary']);
const INTERACTIVE_WIDGET_ROLES = new Set([
  'button',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'checkbox',
  'radio',
  'switch',
  'tab',
  'option',
]);
const DIALOG_SELECTOR = '[role="dialog"], [role="alertdialog"], [aria-modal="true"]';

/** A `role="button"`-style widget that isn't a native element already guaranteed to be keyboard-operable. */
export function isCustomWidgetCandidate(step) {
  return !step.isBody && Boolean(step.role) && INTERACTIVE_WIDGET_ROLES.has(step.role) && !NATIVE_INTERACTIVE_TAGS.has(step.tag);
}

/**
 * Pure decision logic over a recorded Tab-key trace, extracted so it can be
 * unit-tested with fabricated steps instead of a real browser.
 */
export function analyzeTabTrace(steps) {
  const stuckIndices = [];
  const missingFocusIndicatorIndices = [];

  steps.forEach((step, index) => {
    const isLast = index === steps.length - 1;
    if (step.same && !step.isBody && !isLast) {
      stuckIndices.push(index);
    }
    if (!step.isBody && !step.hasOutline && !step.hasBoxShadow) {
      missingFocusIndicatorIndices.push(index);
    }
  });

  return {
    reachedNothing: steps.length > 0 && steps.every((step) => step.isBody),
    stuckIndices,
    missingFocusIndicatorIndices,
  };
}

function splitFindings(findings) {
  return findings.reduce(
    (acc, { violation, ...finding }) => {
      acc[violation ? 'violations' : 'incomplete'].push(finding);
      return acc;
    },
    { violations: [], incomplete: [] }
  );
}

async function checkEscapeClosesDialog(page) {
  const isDialogVisible = () =>
    page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (!el) {
        return false;
      }
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }, DIALOG_SELECTOR);

  if (!(await isDialogVisible())) {
    return null;
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(75);

  if (!(await isDialogVisible())) {
    return null;
  }

  return {
    tags: ['wcag212'],
    impact: 'serious',
    id: 'custom-keyboard-escape',
    needsManualReview: true,
    help: 'An open dialog may not be closable with the Escape key',
    description:
      'Automated check: an element with role="dialog"/"alertdialog"/aria-modal="true" was still visible ' +
      'after pressing Escape.',
    nodes: [{ target: [DIALOG_SELECTOR], failureSummary: 'Dialog remained visible after Escape.' }],
  };
}

// Presses `key` on the widget under test and reports whether it fired a click.
// The listener is re-armed (and focus restored) before every press, so each
// key is tested independently - otherwise a `once` listener consumed by Enter,
// or focus moved by Enter (e.g. into an opened menu), would make Space always
// read `false`.
async function pressAndDetectClick(page, key) {
  const armed = await page.evaluate(() => {
    const el = window.__a11yActivationTarget;
    if (!el || !el.isConnected) {
      return false;
    }
    if (document.activeElement !== el) {
      el.focus();
    }
    window.__a11yActivationClicked = false;
    el.addEventListener('click', () => (window.__a11yActivationClicked = true), { once: true });
    return true;
  });

  if (!armed) {
    return false;
  }

  await page.keyboard.press(key);
  return page.evaluate(() => window.__a11yActivationClicked);
}

async function checkActivation(page) {
  const hasTarget = await page.evaluate(() => {
    window.__a11yActivationTarget = document.activeElement;
    return Boolean(document.activeElement);
  });

  if (!hasTarget) {
    return { enter: false, space: false };
  }

  const enter = await pressAndDetectClick(page, 'Enter');
  const space = await pressAndDetectClick(page, ' ');

  return { enter, space };
}

async function recordTabTrace(page, tabCount, maxActivationChecks) {
  await page.evaluate(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    window.__a11yPrevFocus = null;
  });

  const steps = [];
  let activationChecksRun = 0;

  for (let i = 0; i < tabCount; i++) {
    await page.keyboard.press('Tab');

    const step = await page.evaluate(() => {
      const el = document.activeElement;
      const same = el === window.__a11yPrevFocus;
      window.__a11yPrevFocus = el;

      if (!el || el === document.body) {
        return { same, isBody: true };
      }

      const style = window.getComputedStyle(el);
      return {
        same,
        isBody: false,
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        hasOutline: !(style.outlineStyle === 'none' || style.outlineWidth === '0px'),
        hasBoxShadow: style.boxShadow !== 'none' && style.boxShadow !== '',
        text: (el.textContent || '').trim().slice(0, 60),
      };
    });

    if (isCustomWidgetCandidate(step) && activationChecksRun < maxActivationChecks) {
      activationChecksRun += 1;
      step.activation = await checkActivation(page);
    }

    steps.push(step);
  }

  return steps;
}

export async function checkKeyboard(page, { maxTabs = 40, maxActivationChecks = 10 } = {}) {
  const dialogFinding = await checkEscapeClosesDialog(page);

  const candidateCount = await page.evaluate(
    (selector) => document.querySelectorAll(selector).length,
    FOCUSABLE_SELECTOR
  );

  if (candidateCount === 0) {
    return splitFindings(dialogFinding ? [{ ...dialogFinding, violation: true }] : []);
  }

  const steps = await recordTabTrace(page, Math.min(candidateCount, maxTabs), maxActivationChecks);
  const analysis = analyzeTabTrace(steps);
  const findings = dialogFinding ? [{ ...dialogFinding, violation: true }] : [];

  if (analysis.reachedNothing) {
    findings.push({
      violation: true,
      tags: ['wcag211'],
      impact: 'critical',
      id: 'custom-keyboard-unreachable',
      help: 'No element received keyboard focus even though focusable elements exist',
      description:
        `${candidateCount} element(s) matched common focusable selectors, but pressing Tab never moved ` +
        'focus onto any of them.',
      nodes: [{ target: ['body'], failureSummary: 'document.activeElement stayed on <body> for every Tab press.' }],
    });
  }

  if (analysis.stuckIndices.length > 0) {
    findings.push({
      violation: true,
      needsManualReview: true,
      tags: ['wcag212'],
      impact: 'serious',
      id: 'custom-keyboard-possible-trap',
      help: 'Focus may not move predictably with the keyboard (possible keyboard trap)',
      description:
        'Automated heuristic: pressing Tab did not change the focused element at a point mid-sequence. ' +
        'Manually verify focus is not trapped.',
      nodes: analysis.stuckIndices.map((index) => ({
        target: [steps[index].tag],
        failureSummary: `Tab press #${index + 1} did not move focus.`,
      })),
    });
  }

  if (analysis.missingFocusIndicatorIndices.length > 0) {
    findings.push({
      violation: true,
      needsManualReview: true,
      tags: ['wcag247'],
      impact: 'moderate',
      id: 'custom-keyboard-focus-visible',
      help: 'A focused element may have no visible focus indicator',
      description:
        'Automated heuristic: no outline or box-shadow change was detected while focused via keyboard ' +
        '(border/background-only indicators are not detected by this check). Manually verify focus is visible.',
      nodes: analysis.missingFocusIndicatorIndices.map((index) => ({
        target: [steps[index].tag],
        failureSummary: `Tab press #${index + 1} landed on a <${steps[index].tag}> with no detected outline/box-shadow.`,
      })),
    });
  }

  const brokenActivation = steps.filter((step) => step.activation && !step.activation.enter && !step.activation.space);
  if (brokenActivation.length > 0) {
    findings.push({
      violation: true,
      needsManualReview: true,
      tags: ['wcag211'],
      impact: 'serious',
      id: 'custom-keyboard-activation',
      help: 'A custom interactive widget may not be operable with Enter or Space',
      description:
        'Automated heuristic: a focused element with an interactive ARIA role (e.g. role="button") did not ' +
        'fire a click event when Enter or Space was pressed.',
      nodes: brokenActivation.map((step) => ({
        target: [`${step.tag}[role="${step.role}"]`],
        failureSummary: `"${step.text}" did not respond to Enter or Space.`,
      })),
    });
  }

  return splitFindings(findings);
}
