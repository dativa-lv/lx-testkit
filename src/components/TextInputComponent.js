import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { IconComponent } from './IconComponent.js';
import {
  findHelperIcon,
  findHelperIconWrapper,
  findHelperText,
} from './helpers/helperTextUtils.js';

export class TextInputComponent extends BaseComponent {
  static component = 'lx-text-input';

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
    return findHelperText(this.root);
  }

  getHelperIconWrapper() {
    return findHelperIconWrapper(this.root);
  }

  getHelperIcon() {
    return findHelperIcon(this.root);
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
