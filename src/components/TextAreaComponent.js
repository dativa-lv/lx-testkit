import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';
import {
  findHelperIcon,
  findHelperIconWrapper,
  findHelperText,
} from './helpers/helperTextUtils.js';

export class TextAreaComponent extends BaseComponent {
  static component = 'lx-text-area';

  getTextArea() {
    return this.root.locator('textarea').first();
  }

  getInvalidationIconWrapper() {
    return this.root.locator('.lx-invalidation-icon-wrapper');
  }

  getInvalidationIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-invalidation-icon-wrapper') });
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }

  async getReadOnlyData() {
    const { readOnly } = await this.getState();

    if (!readOnly) {
      throw new Error('TextAreaComponent is not in read-only mode');
    }

    return this.root.locator('.lx-data');
  }

  getHelperText() {
    return findHelperText(this.root);
  }

  getHelperIconWrapper() {
    return findHelperIconWrapper(this.root);
  }

  getHelperIcon() {
    return findHelperIcon(this.root);
  }


  getMaxLengthCounter() {
    return this.root.locator('.lx-text-length');
  }
}
