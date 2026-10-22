import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';

export class TextAreaComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-text-area', page, parent, id });
  }

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
    return this.root.locator('.lx-helper-text');
  }

  getHelperIconWrapper() {
    return this.root.locator('.lx-input-helper-wrapper');
  }

  getHelperIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-input-helper-wrapper') });
  }


  getMaxLengthCounter() {
    return this.root.locator('.lx-text-length');
  }
}
