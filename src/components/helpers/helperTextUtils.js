import { IconComponent } from '../IconComponent.js';

// Shared by the components that support `helperText` and `helperTextKind`

export function findHelperText(root) {
  return root.locator('.lx-helper-text');
}

// Input-like components render the icon inside the input, others below the content
export function findHelperIconWrapper(root) {
  return root.locator('.lx-input-helper-wrapper, .lx-helper-info-row');
}

export function findHelperIcon(root) {
  return new IconComponent({ parent: findHelperIconWrapper(root) });
}
