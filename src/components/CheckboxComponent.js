import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';

export class CheckboxComponent extends BaseComponent {
  static component = 'lx-checkbox';

  getInput() {
    return this.root.locator('input');
  }

  getLabelWrapper() {
    return this.root.locator('.lx-checkbox-text-wrapper');
  }

  getLabel() {
    return this.root.locator('.lx-checkbox-label');
  }

  getAppearance() {
    return this.root.locator('.lx-checkbox-container');
  }

  getThumbIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-checkbox-thumb') });
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }
}
