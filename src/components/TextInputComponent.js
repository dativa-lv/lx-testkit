import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { IconComponent } from './IconComponent.js';

export class TextInputComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-text-input', page, parent, id });
  }

  getInputWrapper() {
    return this.root.locator('.lx-text-input-wrapper');
  }

  getInput() {
    return this.root.locator('input.lx-text-input');
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

  getHelperText() {
    return this.root.locator('.lx-helper-text');
  }

  getHelperIconWrapper() {
    return this.root.locator('.lx-input-helper-wrapper');
  }

  getHelperIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-input-helper-wrapper') });
  }

  getSearchIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-input-icon-wrapper') });
  }

  getFlagWrapper() {
    return this.root.locator('.lx-input-flag-wrapper');
  }

  async getReadOnlyData() {
    const { readOnly } = await this.getState();

    if (!readOnly) {
      throw new Error('TextInputComponent is not in read-only mode');
    }

    return this.root.locator('.lx-data');
  }

  async getPasswordToggleButton() {
    const { kind, hidePassword } = await this.getState();

    if (kind !== 'password') {
      throw new Error(
        'TextInputComponent does not support password toggle button when it is not of kind "password"'
      );
    }

    return new ButtonComponent({
      parent: this.root,
      id: hidePassword ? `${this.id}-show-password` : `${this.id}-hide-password`,
    });
  }
}
