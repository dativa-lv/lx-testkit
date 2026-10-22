<h1 align="center">lx/testkit</h1>

![LX Testkit](/public/imgs/lx-testkit.png)

Reusable Playwright component utils for LX UI that expose stable locators, so tests stay readable and resilient as UI internals evolve.

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
