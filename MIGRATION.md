# LX/Testkit Migration Guide

As LX/Testkit evolves, some component methods are refined, renamed, or replaced by better
alternatives. This guide documents all breaking changes and recommended migration paths between
releases.

Testkit versions track [LX/UI](https://github.com/dativa-lv/lx-ui) releases, because the locators
follow LX/UI's markup. Upgrade both together.

## 2.3.5 → 2.3.7

### Breaking changes

#### `NumberInputComponent`

**Method changes**

- `getFullTrack()` — replaced by `getTrack()` for the full slider track. Use the existing
  `getFilledTrack()` and new `getUnfilledTrack()` to locate the filled and unfilled segments of the track
  separately.

**Before:**

```js
const numberInput = new NumberInputComponent({ page, id: 'volume' });
const fullTrack = await numberInput.getFullTrack();
const filledTrack = await numberInput.getFilledTrack();
```

**After:**

```js
const numberInput = new NumberInputComponent({ page, id: 'volume' });
const fullTrack = await numberInput.getTrack();
const filledTrack = await numberInput.getFilledTrack();
const unfilledTrack = await numberInput.getUnfilledTrack();
```

## 2.3.1 → 2.3.3

### Breaking changes

#### `StateDisplayComponent`

LxStateDisplay was rebuilt on LxBadge's structure in LX/UI 2.3.3: every `displayShape` now renders a
real icon, and the label is a `<div class="lx-state-text">` instead of a `<p class="lx-primary">`.
The component's locators follow.

**Method removals**

- `getIndicator()` — the `.lx-state-indicator` element it located no longer exists. Circle and
  diamond shapes are now icons, so use `getIcon()` for every shape.

**Before:**

```js
const stateDisplay = new StateDisplayComponent({ page, id: 'status' });

// only for circle / diamond shapes
await expect(stateDisplay.getIndicator()).toBeVisible();
// only for icon / custom shapes
await expect(stateDisplay.getIcon().getRoot()).toBeVisible();
```

**After:**

```js
const stateDisplay = new StateDisplayComponent({ page, id: 'status' });

// every shape
await expect(stateDisplay.getIcon().getRoot()).toBeVisible();
```

Assertions on the indicator's `background-color` and `border-color` have no direct equivalent: the
shape is an SVG now, so assert its `fill` instead.

**`getLabel()` returns a different element**

`getLabel()` still returns the state's label, but it now locates `.lx-state-text` rather than
`.lx-primary`. No call site changes are needed — but a test that reached past the method with its
own `.lx-primary` selector, or that asserted the label is a `<p>`, has to be updated.

This makes testkit 2.3.2 require LX/UI 2.3.3 or newer.
