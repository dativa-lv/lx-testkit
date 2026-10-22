# Tester Guide - Using Playwright Test Utils

These **test utils** provide reusable components for Playwright tests.
Each util is a `*Component` class that wraps one LX component in the
app and lets you fetch the DOM parts you need without hand-writing CSS/XPath
selectors. You ask the component for the part you want and it returns a
Playwright [`Locator`](https://playwright.dev/docs/api/class-locator) pointing
at exactly the right element in the DOM.

## The one rule to remember

> **Components only return locators (or other components). They do not click, type, or assert.**

Once a component hands you a locator, everything else is plain Playwright:
`click()`, `fill()`, `inputValue()`, `getAttribute()`, `textContent()`,
`toBeVisible()`, `toBeChecked()`, `evaluate()`, and so on. The component's
job ends the moment you have the locator.

That means you never look for methods like `component.click()` or
`component.assertChecked()` — they don't exist on purpose. Call `.click()` on
the locator the component gave you.

## Quick start

```js
import { test, expect } from '@playwright/test';
import { CheckboxComponent } from '@dativa-lv/lx-testkit';

test('checkbox is checked and has the expected value and label', async ({ page }) => {
  await page.goto('/your/page');

  // 1. Build the component for a specific instance on the page.
  const checkbox = new CheckboxComponent({ page, id: 'accept-terms' });

  // 2. Ask the component for the locators you care about.
  const input = checkbox.getInput();
  const label = checkbox.getLabel();

  // 3. Use standard Playwright API on those locators.
  await expect(input).toBeChecked();
  await expect(input).toHaveValue('terms-accepted');
  await expect(label).toHaveText('Accept terms');
});
```

## How a component finds the element

Every LX component in the app renders two attributes that the utils
use to locate it:

- `data-component="lx-<name>"` — identifies the component type
  (e.g. `lx-checkbox`, `lx-radio-button`, `lx-icon`, `lx-value-picker`).
- `data-id="<id>"` or `id="<id>"` — matches the `id` prop passed to the
  component in the application code.

That's why every component you construct with `{ page, id }` needs the same
`id` the LX component was rendered with. If the LX component doesn't have a
stable `id` in the app, add one — it's the contract between the UI and your
tests.

## Constructing a component

There are two supported constructor shapes:

**By `id`, from the `page` root:**

```js
const checkbox = new CheckboxComponent({ page, id: 'accept-terms' });
```

Use this when the component is addressable directly by its `data-id` or `id`.
This is what page objects use to expose top-level components.

**By `parent`, scoped to another component's root:**

```js
const checkbox = new CheckboxComponent({ parent: someComponent.getRoot() });
```

Use this when a component lives inside another one (for example, a checkbox
rendered inside a value picker item). The `parent` locator scopes the search
so you don't accidentally match a component with the same type somewhere else
on the page.

If needed, you can combine `parent` and `id` to target one specific nested
instance:

```js
const checkbox = new CheckboxComponent({
  parent: someComponent.getRoot(),
  id: 'accept-terms'
});
```

You must always pass a lookup scope (`page` or `parent`).
If you pass only `page`, then `id` is required.

## What a component gives you

Each component exposes `get*` methods that return locators for the parts
you commonly work with in tests. The general shape is:

- `getRoot()` — the root element of the component (inherited from
  `BaseComponent`).
- `getInput()` — the underlying `<input>` for input-like components.
- `getLabel()` / `getLabelWrapper()` — the visible label / its container.
- Component-specific parts — e.g. `getAppearance()`, `getThumb()`, `getInvalidationMessage()`.

Because these are just locators, use them as you would anywhere in
Playwright:

```js
// Reading text
const text = await checkbox.getLabel().textContent();

// Reading a value
const value = await checkbox.getInput().inputValue();

// Reading an attribute
const name = await checkbox.getInput().getAttribute('name');

// Reading a computed style
const color = await checkbox
  .getLabel()
  .evaluate((el) => getComputedStyle(el).color);

// Interacting
await checkbox.getInput().click();

// Asserting
await expect(checkbox.getRoot()).toBeVisible();
await expect(checkbox.getInput()).toBeChecked();
```

## Composed components

Some components are containers for other components. The value picker is one
of the examples: depending on its `variant` and `selectionKind`, each item is
backed by a different element (a radio button, a checkbox, an autocomplete, or a
custom container). The component handles that branching for you.

The API mirrors the component structure: value picker → items wrapper →
individual item → the concrete inner component or a set of locators for that
variant.

```js
import { ValuePickerComponent } from '@dativa-lv/lx-testkit';

const valuePicker = new ValuePickerComponent({ page, id: 'colors' });

// The items wrapper — the container that holds all items.
const itemsWrapper = await valuePicker.getItemsWrapper();
await expect(itemsWrapper.getRoot()).toBeVisible();

// The items wrapper may use gap to space items apart — assert it's
// not collapsed to 0.
const gap = await itemsWrapper
  .getRoot()
  .evaluate((el) => getComputedStyle(el).gap);
expect(parseFloat(gap)).toBeGreaterThan(0);

// A single item, either by its id or by 0-based index.
const firstItem = await valuePicker.getItem({ n: 0 });
const redItem   = await valuePicker.getItem({ id: 'red' });

// Ask the item for its container. What you get back depends on the variant:
//   default + single   → RadioButtonComponent
//   default + multiple → CheckboxComponent
//   horizontal / indicator / tags / tiles → an object of locator getters
const container = firstItem.getContainer();

// From there it's the usual pattern — get a locator, then use Playwright.
await expect(container.getInput()).toBeChecked();

// Icons that appear inside items are IconComponent instances.
const icon = firstItem.getIcon();
await expect(icon.getRoot()).toBeVisible();

// The value picker also exposes its toolbar when the variant supports one.
const toolbar = await valuePicker.getToolbar();
await expect(toolbar.getRoot()).toBeVisible();

// And you can keep going deeper — the toolbar returns components for its own
// children (buttons, search, …) which in turn return locators or more
// components you can drill into.
const addButton = toolbar.getButton('add');
await expect(addButton.getLabel()).toHaveText('Add');
await addButton.getRoot().click();
```

> Some of methods are `async` because they read the component's state
before deciding what to return, e.g., `getItemsWrapper`, `getItem`,
`getToolbar`, `getReadOnlyData`. However the methods on an item itself
(`getContainer`, `getIcon`, `getRoot`) are synchronous.

> Some combinations are intentionally not supported (for example, asking for a
toolbar on the `dropdown` variant). In those cases the component throws a
clear error like `Toolbar is not available for variant: dropdown`.
