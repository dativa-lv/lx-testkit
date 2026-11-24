import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';
import {  
  findHelperText,
} from './helpers/helperTextUtils.js';

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

  getWrapper() {
    return this.root.locator('.lx-toggle-wrapper');
  }

  getInput() {
    return this.root.locator('input.lx-toggle');
  }

  getInvalidationIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-invalidation-icon-wrapper') });
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }

  getHelperText() {
    return findHelperText(this.root);
  }

  getHelperIconWrapper() {
    return this.root.locator('.lx-toggle-helper-wrapper');
  }

  getHelperIcon() {
    return new IconComponent({ parent: this.getHelperIconWrapper() });
  }
}
