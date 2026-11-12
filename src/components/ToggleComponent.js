import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';

export class ToggleComponent extends BaseComponent {
  static component = 'lx-toggle';

  getAppearance() {
    return this.root.locator('.lx-toggle-appearance');
  }

  getThumb() {
    return this.root.locator('.lx-toggle-thumb');
  }

  getLabelWrapper() {
    return this.root.locator('.lx-toggle-label-wrapper');
  }

  getText() {
    return this.root.locator('.lx-toggle-text');
  }

  getInvalidationIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-invalidation-icon-wrapper') });
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }
}
