# Developer Guide - Developing Playwright Test Utils

This document is for developers who build and maintain these test utils.

The goal of the utils is simple: expose stable, reusable locators for LX
components so tests do not rely on fragile CSS/XPath selectors.

## Core design rules

1. A `*Component` returns locators (or other components), not actions.
2. Tests do interactions and assertions (`click`, `fill`, `expect`, etc.).
3. Prefer stable selectors.
4. Throw explicit errors for unsupported modes/variants/etc.

## Required DOM contract in lx/ui

When introducing or updating an LX component that should be testable via
these utils, make sure the rendered DOM includes the contract below.

### 1) `data-component` on the component root

Each testable component root must have a unique component marker:

```html
<div data-component="lx-checkbox" ...>
```

Use the `lx-<name>` naming convention. This value is used directly by
`BaseComponent`:

- Root from page: `[data-component="..."][data-id="..."], [data-component="..."][id="..."]`
- Root from parent without id: `[data-component="..."]`
- Root from parent with id: `[data-component="..."][data-id="..."], [data-component="..."][id="..."]`

### 2) `data-id` or `id` for page-level lookup

If the component is instantiated with `{ page, id }`, the component must expose
that same `id` through `data-id` or `id`:

```html
<div data-component="lx-checkbox" data-id="accept-terms" ...>
```

Without `data-id` or `id`, page-level lookup cannot work reliably.

### 3) `data-container` for stable internal containers (when needed)

Use `data-container` for important nested structures inside a component when
test utils need to target them directly and class names or other selectors alone
are too fragile. It is especially useful when the same component renders different
variants, so helpers can find equivalent internal parts in one stable way.

Example values used by the value picker helpers:

- `data-container="value-picker-items-wrapper"`
- `data-container="value-picker-item"`

Unlike `data-component`, this is not for top-level component lookup. It is for
stable, explicit targeting of meaningful internal containers.

### 4) `data-state` for state-dependent APIs (when needed)

If a wrapper method must branch by runtime state (variant, selection kind,
read-only mode, etc.), the component root should expose that state in
`data-state` as JSON string:

```html
<div
	data-component="lx-value-picker"
	data-id="colors"
	data-state='{"variant":"default","selectionKind":"single"}'
></div>
```

`BaseComponent.getState()` parses this JSON and returns an object. If
`data-state` is missing, it returns `{}`.

Use `data-state` only for stable state needed by test-utils API decisions.

## BaseComponent usage (default pattern)

For standard LX wrappers, always extend `BaseComponent`.

Minimal skeleton - constructor only:

```js
import { BaseComponent } from './BaseComponent.js';

export class MyComponent extends BaseComponent {
	constructor({ page = null, parent = null, id = null } = {}) {
		super({ component: 'lx-my-component', page, parent, id });
	}

	// Add component-specific get* methods below when needed.
}
```

Component-specific methods are optional and should be added only when they make
sense for that component's DOM contract.

Example (for components that render an input):

```js
getInput() {
	return this.root.locator('input');
}
```

`BaseComponent` validates constructor arguments:

- `component` is required.
- At least one of `page` or `parent` is required.
- `id` is required when `parent` is not provided.
- When both `page` and `parent` are provided, `parent` is used as lookup scope.

`BaseComponent` also provides inherited methods that wrappers can use directly:

- `getRoot()` - returns the root locator for the component.
- `getId()` - returns the component id passed in the constructor.
- `getState()` - reads and parses `data-state` JSON from the root element.

## Constructor conventions

Follow this shape in every wrapper constructor:

```js
constructor({ page = null, parent = null, id = null } = {})
```

Support both forms:

1. `{ page, id }` for top-level instances.
2. `{ parent }` for nested instances inside another component.
3. `{ parent, id }` for nested instances when you need to target a specific child by id.

Do not add extra constructor requirements unless they are truly necessary.

## Method conventions

1. Use `get*` names (`getRoot`, `getInput`, `getLabel`, ...).
2. Keep methods focused on returning one locator/component.
3. Do not call Playwright actions in component classes.
4. Keep methods sync unless state lookup is required.

Use `async` methods only when you need `await this.getState()` to decide which
locator/component to return. For example, see `ValuePickerComponent`.

## Handling variants and unsupported combinations

For components with multiple render variants:

1. Read state from `data-state`.
2. Branch with explicit `switch` statements.
3. Throw clear errors for unsupported/invalid combinations.

Example error style:

- `Unknown variant: ${variant}`
- `Toolbar is not available for variant: ${variant}`

This keeps failures actionable and avoids silent false positives.

## Composition patterns

Prefer composition when a component contains other components.

Examples:

- `ValuePickerComponent` -> `ValuePickerItem`
- `ValuePickerComponent` -> `ValuePickerItemsWrapper` -> `ValuePickerItem` (optional path when you need items-wrapper-level access)
- `ValuePickerItem` -> `RadioButtonComponent` or `CheckboxComponent` (depending on state)
- `ValuePickerComponent` -> `ToolbarComponent` -> `ButtonComponent` -> `IconComponent`

When building composed APIs:

1. Keep each class narrow in responsibility.
2. Pass parent root locators down to child wrappers.
3. Keep return types stable and documented.

## Selector strategy

Use this priority order for selectors:

1. `data-component`, `data-id`, `id`, `data-container`, `data-state` contracts.
2. Stable semantic element selectors (like `input`).
3. Stable internal class selectors only when attribute contract is not enough.

Avoid text-based or position-based selectors unless unavoidable.

## Adding a new component wrapper

1. Ensure lx/ui renders `data-component` and `data-id`/`id` on component's root.
2. Add `data-container` if you need stable cross-variant targeting.
3. Add `data-state` if wrapper API needs runtime branching.
4. Create `<Name>Component.js` extending `BaseComponent`.
5. Add focused `get*` methods for commonly used DOM parts.
6. Add/update tests that consume the wrapper in real flows.
7. Update docs.
