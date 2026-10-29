<h1 align="center">lx/testkit</h1>

<p align="center">
 Reusable <strong>Playwright</strong> testing utilities for <a href="https://github.com/dativa-lv/lx-ui"><strong>LX/UI</strong></a> components, providing stable locators and predictable interactions that keep automated tests readable, reliable, and resilient to UI changes.
</p>
<p align="center">
    Test behavior. Not implementation details.
</p>

<p align="center">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/%40dativa-lv%2Flx-testkit?color=green" />
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40dativa-lv%2Flx-testkit?color=green" />
    <img alt="NPM License" src="https://img.shields.io/npm/l/%40dativa-lv%2Flx-testkit?color=white" />
    <a href="https://github.com/dativa-lv/lx-ui"><img alt="Powered by LX/UI" src="https://img.shields.io/badge/powered%20by-lx%2Fui-0960BC"/></a>
</p>

<p align="center">
 <img src="https://img.shields.io/npm/v/%40dativa-lv%2Flx-ui?color=blue&label=%40dativa-lv%2Flx-ui" alt="LX/UI Version" />
  <img src="https://img.shields.io/github/package-json/dependency-version/dativa-lv/lx-testkit/playwright?label=playwright"
  alt="playwright" />
    <img src="https://img.shields.io/github/package-json/dependency-version/dativa-lv/lx-testkit/%40axe-core%2Fplaywright?label=axe-core%2Fplaywright"
  alt="axe-core/playwright version" />
</p>



![LX Testkit](/public/imgs/lx-testkit.png)

## Get

Get using bun:
```bash
bun add -d '@dativa-lv/lx-testkit@latest'
```

Get using pnpm:
```bash
pnpm i -D '@dativa-lv/lx-testkit@latest'
```

## How it works

Each `*Component` class locates one LX component instance by:

- `data-component="lx-..."`
- `data-id="..."` or `id="..."`

Components return Playwright locators (or nested components). Interactions and assertions are still done with regular Playwright API.

### Basic example

```js
import { test, expect } from '@playwright/test';
import { CheckboxComponent } from '@dativa-lv/lx-testkit';

test('checkbox can be asserted with stable selectors', async ({ page }) => {
	await page.goto('/sandbox/checkbox/variations');

	const checkbox = new CheckboxComponent({ page, id: 'accept-terms' });

	await expect(checkbox.getRoot()).toBeVisible();
	await checkbox.getInput().check();
	await expect(checkbox.getInput()).toBeChecked();
});
```

### Nested component example

```js
import { test, expect } from '@playwright/test';
import { ValuePickerComponent } from '@dativa-lv/lx-testkit';

test('value picker item is visible', async ({ page }) => {
  const valuePicker = new ValuePickerComponent({ page, id: 'colors' });
  const item = await valuePicker.getItem({ n: 0 });

  await expect(item.getRoot()).toBeVisible();
});
```

## Read the docs

For full API details and conventions, read:

- [ℹ️ Available Components](docs/AvailableComponents.md)
- [ℹ️ Tester Guide](docs/TesterGuide.md)
- [ℹ️ Developer Guide](docs/DeveloperGuide.md)
- [ℹ️ Accessibility Testing](docs/AccessibilityTesting.md)
- [ℹ️ Migration Guide](MIGRATION.md)
