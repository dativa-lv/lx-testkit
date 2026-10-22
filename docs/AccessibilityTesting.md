# Accessibility Testing

`testkit` includes an automated accessibility scanning CLI (`testkit-a11y`)
built on [Playwright](https://playwright.dev) and
[`@axe-core/playwright`](https://www.npmjs.com/package/@axe-core/playwright).
It scans configured pages (and UI states) with axe-core, maps the results to
WCAG 2.2 success criteria, and writes a JSON report compatible with the LX
accessibility protocol tool's report/protocol format.

## Installation

`testkit-a11y` and its dependencies (`playwright`, `@axe-core/playwright`)
ship with `testkit` itself - no extra install step beyond adding `testkit` as
a dependency. Playwright still needs a browser binary available:

```bash
bunx playwright install chromium
```

## Quick start

```bash
# from a project that depends on testkit (e.g. portal, after `bun add -d @dativa-lv/lx-testkit`):
bun testkit-a11y --config accessibility.config.js
```

```js
// accessibility.config.js
module.exports = {
  projectName: 'LX portal',
  baseUrl: 'https://lx-ui.dev/lv',
  pages: [
    { name: 'Buttons', path: '/sandbox/button/variations' },
  ],
};
```

`baseUrl` can point at any reachable environment, including a local dev
server (e.g. portal's `bun run dev`, typically `https://localhost:44342`).
Local dev servers commonly serve HTTPS with a self-signed certificate (e.g.
via `vite-plugin-mkcert`), so set `ignoreHTTPSErrors: true` when scanning
those instead of a real deployment:

```js
module.exports = {
  projectName: 'LX portal (local)',
  baseUrl: 'https://localhost:44342/lv',
  ignoreHTTPSErrors: true, // skip TLS validation for the local dev cert
  pages: [
    { name: 'Buttons', path: '/sandbox/button/variations' }
  ],
};
```

## CLI usage

```
testkit-a11y --config <path> [--output <path>] [--page <name>]

  -c, --config <path>   Path to the accessibility config module (required)
  -o, --output <path>   Path to write the JSON report to (default: accessibility-report.json)
  -p, --page <name>     Only scan the page with this configured name
  -h, --help            Show this help message
```

Exit codes:

- `0` - the scan itself ran successfully (config loaded, pages scanned, report written) - regardless of whether accessibility violations were found. Check the generated report for findings.
- `1` - a configuration or runtime error prevented the scan from completing (invalid config, unknown `--page` filter, Playwright/axe failure, etc.).

> **Note:** When invoked through Bun, `testkit-a11y` runs under Node because
> Playwright requires it. Ensure `node` is on your `PATH`.

## Configuration reference

| Field | Required | Description |
| ----- | -------- | ----------- |
| `projectName` | yes | Shown in the report's `projectDetails.projectName`. |
| `baseUrl` | yes | Base URL every page's `path` is resolved against. |
| `pages[]` | yes | Pages to scan. See below. |
| `pages[].name` | yes | Display name for the page (and report page name). |
| `pages[].path` | yes\* | Path resolved against `baseUrl` (e.g. `/abc` + `http://xyz` -> `http://xyz/abc`). |
| `pages[].url` | yes\* | Absolute URL, used instead of `path` when the page isn't under `baseUrl`. |
| `pages[].states[]` | no | UI states to exercise on the page (see below). Defaults to one implicit state. |
| `pages[].states[].name` | yes | State name (used in the report page name as `"<page> (<state>)"`). |
| `pages[].states[].run` | no | `async ({ page, testkit }) => {}` setup run after navigation, before scanning. |
| `pages[].states[].preselectedCriteria[]` | no | Additional content categories revealed by this state, merged with the page's. See below. |
| `pages[].preselectedCriteria[]` | no | Content categories confirmed present on the page: `"images"`, `"multimedia"`, `"form"`. See below. |
| `ignoreHTTPSErrors` | no | Skip TLS certificate validation - needed for local dev servers with self-signed certs. |
| `ruleSets[]` | no | Non-empty array containing `"all"`, `"axe"`, or standard names from `wcag/checklist.js`'s `knownRuleSets` (e.g. `"LVSEN301549"`, `"act"`). Selected standards are combined; `"all"` runs axe's full default rule set. See below. |
| `customChecks` | no | `true` (default) or `false` - run the generic keyboard/orientation/sensory-characteristics checks (see below) alongside axe. |
| `protocol.institutionName` | no | Populates `protocolData.institutionName`. |
| `protocol.checkPerformedBy[]` | no | `{ fullName, role }[]`, populates `protocolData.checkPerformedBy`. |
| `protocol.checkConfirmedByName` | no | Populates `protocolData.checkConfirmedByName`. |
| `protocol.checkConfirmedByRole` | no | Populates `protocolData.checkConfirmedByRole`. |

\* exactly one of `path`/`url` is required per page.

Invalid configs fail fast with a descriptive message (missing `projectName`,
missing `baseUrl`, missing/invalid `pages`, missing page `name`, etc.) instead
of failing later with an obscure Playwright error.

## Preselected criteria (images / multimedia / form)

Criteria in the `images`, `multimedia`, and `form` categories (e.g. `1.1.1`
non-text-content, `1.2.x` multimedia alternatives, `3.3.x` form errors) can
only be meaningfully evaluated when the page actually contains that kind of
content. By default, criteria in these categories are reported as
`"not-verifiable"` with no errors, since the tool can't assume a page has
images/media/forms just because a rule happens to fire.

Declare which of these content types a page has via `preselectedCriteria`:

```js
pages: [
  {
    name: 'Contact form',
    path: '/contact',
    preselectedCriteria: ['images', 'form'], // this page has an image and a form
  },
],
```

Once a category is preselected, its criteria are evaluated normally (axe
results decide `match`/`not-match`/`not-verifiable` as usual). Categories
outside `images`/`multimedia`/`form` (e.g. `structure`, `keyboard`) are always
evaluated normally and are unaffected by `preselectedCriteria`.

A state can also declare its own `preselectedCriteria` when it reveals
content the base page doesn't have (e.g. opening a dialog with images). It's
merged with (not a replacement for) the page's `preselectedCriteria` for that
state's scan only:

```js
{
  name: 'Exhibition',
  path: '/exhibition',
  states: [
    { name: 'initial' },
    {
      name: 'help dialog open',
      run: async ({ page, testkit }) => {
        await new testkit.ButtonComponent({ page, id: 'help-button' }).getRoot().click();
      },
      preselectedCriteria: ['images'], // only unlocked while the dialog is open
    },
  ],
}
```

## UI states and the `testkit` API

Each state's `run({ page, testkit })` callback receives the real Playwright
`page` and the `testkit` package's own component namespace (every exported
`*Component` class, e.g. `testkit.ButtonComponent`, `testkit.CheckboxComponent`).
Build components the same way you would in a Playwright test:

```js
run: async ({ page, testkit }) => {
  await new testkit.ButtonComponent({ page, id: 'some-button' }).getRoot().click();
};
```

If a page has no `states`, one default state runs (navigate, then scan). If
`states` is provided, every state runs in its own fresh browser context:
navigate to the page's URL, run the state's `run()` (if any), then scan.

## Output report

The report matches the LX accessibility protocol tool's format exactly:

```
{
  projectDetails: { projectName, date },
  protocolData: { institutionName, url, date, checkPerformedBy[], checkConfirmedByName, checkConfirmedByRole },
  selectedPageId,
  pages: [{ id, _lx_appendableKey, name, url, preselectedCriteria, criteria: [...] }],
  errorRegistry: { [regId]: { regId, id, name, errorDetails, files, extended, level, _lx_appendableKey, criterionId, criterionName, criterionNumber, criterionCategory, pageId } }
}
```

Every page includes **all** WCAG criteria from the registry
(`src/accessibility/wcag/criteria.js`), each with a `matchStatus`:

- `"not-match"` - an automated axe-core rule mapped to this criterion found a violation.
- `"match"` - a mapped rule ran and found no violations (automated evidence of a pass).
- `"not-verifiable"` - a mapped rule ran but was inconclusive/inapplicable on this page.
- `null` - no automated rule is mapped to this criterion at all; it requires manual review.

**Automated scanning never claims full WCAG conformance.** A criterion only
becomes `"match"` when there is real automated evidence for it - axe finding
zero violations elsewhere never flips unrelated criteria to `"match"`.

Violations become entries in `errorRegistry`, referenced by id from the
owning criterion's `errors[]` array (never duplicated inline). axe's
`incomplete` findings (things it flagged but couldn't confirm automatically,
e.g. a `<th>` that might be missing a data cell) are also registered as
errors - so reviewers can see exactly what needs a manual look - but the
criterion's `matchStatus` stays `"not-verifiable"` rather than `"not-match"`,
since these are not confirmed failures. Their `errorDetails` starts with
"Needs manual verification" to make that distinction clear.

## Extending WCAG mappings

Axe-core rules declare their own WCAG tags (e.g. `wcag412`, `wcag1411`).
`src/accessibility/wcag/axeTagMapper.js` derives criterion numbers directly
from those tags, so new/updated axe rules are picked up automatically -
no manual rule-id mapping table to maintain. To adjust status logic (e.g. how
`incomplete`/`inapplicable` results are classified), edit
`src/accessibility/wcag/evaluator.js`. Criterion metadata (name, category) comes
straight from `criteria-and-rules.json`'s `criteria` array via
`src/accessibility/wcag/criteria.js` - edit the JSON, not that file.

## Error names

`errorRegistry` entries' `name` field prefers the localized name from the LX
accessibility protocol tool's own manual checklist -
`src/accessibility/criteria-and-rules.json` - over axe's English help text, so
automated and manual reports read consistently. `src/accessibility/wcag/checklist.js`
reads and parses that JSON on the spot; update
the copy whenever checklist changes.

Axe rules with no entry in that checklist fall back to axe's own `help` /
`description` text. A handful of the checklist's "axe" mapping ids aren't
real axe-core rule ids (stale/typo'd references) - `AxeScanner.js` handles
those transparently at scan time (see below), so they never affect name
lookups either.

## Restricting to a specific standard's rule set

By default (`ruleSets` not set) axe runs its full default rule set. Set `ruleSets: ['axe']`
to restrict to every axe rule that has *any* mapping in
the LX manual checklist - some checklist entries are manual-only (e.g.
`menu-item-name` has no `axe` mapping at all) and are never included. Set
`ruleSets` to an array of specific standard names present in the checklist
mappings (e.g. `['LVSEN301549', 'act']`, `['wcag21', 'W3C ARIA']`) to select
the union of rules whose checklist entry references any selected standard.
An array containing `'all'` runs axe's full default rule set:

```js
module.exports = {
  projectName: 'LX',
  baseUrl: 'https://lx-ui.dev/lv',
  ruleSets: ['act', 'W3C ARIA'],
  pages: [...],
};
```

Valid standard names come straight from the checklist - see
`wcag/checklist.js`'s `knownRuleSets` export for the current list; it updates
automatically the next time the checklist JSON changes, no regeneration
needed (`'axe'` and `'all'` are always valid separately from that list). A few checklist
entries reference an "axe" id that isn't a real axe-core rule; if
`withRules()` rejects one, `scanner/scanWithRuleRetry.js` strips it and
retries automatically, so a stale checklist entry never breaks a scan. Note
`LVSEN301549` currently covers every axe-mapped rule in the checklist (EN 301
549 clause 9 mirrors WCAG 2.1 A/AA in full), so it behaves the same as
`'axe'`; other standards like `'act'` or `'W3C ARIA'` cover a genuinely
smaller subset.

This only changes which axe rules run - it does not change which WCAG
criteria appear in the report (that's already limited to the ~55 criteria in
`wcag/criteria.js`, mirroring the checklist).

## Custom checks (beyond axe-core)

axe-core only inspects static DOM/CSS - it can't tell you whether Tab
actually moves focus, whether a custom widget responds to Enter/Space, or
whether instructions rely on "the red button on the left". `src/accessibility/customChecks/`
adds a set of generic, page-agnostic checks that drive real
keyboard/viewport interaction to cover some of that gap:

| Check                      | Criterion | What it does |
| --------------------------- | --------- | ------------ |
| `sensoryCharacteristics.js` | 1.3.3     | Scans visible text for an action verb (click/press/nospied/...) near a shape/color/position word (English + Latvian). |
| `orientation.js`            | 1.3.4     | Resizes the viewport between portrait/landscape and compares visible interactive-element counts and "please rotate your device" prompts. |
| `keyboard.js`                | 2.1.1, 2.1.2, 2.4.7 | Presses real Tab/Enter/Space/Escape keys: can every focusable element receive focus, does focus move without getting stuck, is a focus indicator (outline/box-shadow) present, do custom ARIA-role widgets (e.g. `<div role="button">`) respond to Enter/Space, does an open dialog close on Escape. |

These run automatically after every axe scan (set `customChecks: false` in
the config to disable them) and merge into the same axe-shaped
`{ violations, incomplete }` result axe-core produces, so they flow through
the normal WCAG-tag mapping and report pipeline unmodified - no separate
report section or contract change.

Because they're heuristics over arbitrary third-party pages, false positives
are expected. Every custom-check finding marks its criterion `not-match`
(rather than `not-verifiable`) so it's visible, but keeps an honest "needs
manual verification" caveat in its `errorDetails` via `needsManualReview: true`
on the finding object (see `AccessibilityReportBuilder.addPage()`) - the one
exception is the keyboard engine's "no element ever received focus" case,
which is confident enough to report without that caveat.

## Limitations

- Automated axe-core scanning cannot verify most WCAG criteria (multimedia
  alternatives, keyboard traps, focus order, sensory characteristics, etc.).
  Those remain `null`/`"not-verifiable"` unless a custom check (see above)
  produces a finding, and still require manual/expert review either way.
