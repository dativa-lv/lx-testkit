import { BaseComponent } from './BaseComponent.js';
import { TextInputComponent } from './TextInputComponent.js';
import { ValuePickerComponent } from './ValuePickerComponent.js';

export class DurationInputComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-duration-input', page, parent, id });
  }

  async getInput(name) {
    const { variant } = await this.getState();

    if (variant === 'default') {
      if (name === 'single-value') {
        return new TextInputComponent({ parent: this.root, id: `${this.id}-value` });
      }

      if (name === 'single-unit') {
        return new ValuePickerComponent({ parent: this.root, id: `${this.id}-unit` });
      }

      throw new Error(`Unsupported name: ${name}`);
    }

    const fieldNamesByVariant = {
      hours: ['hours', 'minutes'],
      days: ['days', 'hours', 'minutes'],
      months: ['months', 'days', 'hours', 'minutes'],
    };

    const allowedFieldNames = fieldNamesByVariant[variant];

    if (!allowedFieldNames) {
      throw new Error(`Unknown variant: ${variant}`);
    }

    if (!allowedFieldNames.includes(name)) {
      throw new Error(`Unsupported name: ${name}`);
    }

    return this.root.locator(`[id="${this.id}-${name}"]`);
  }

  async getReadOnlyData() {
    const { readOnly } = await this.getState();

    if (!readOnly) {
      throw new Error('DurationInputComponent is not in read-only mode');
    }

    return this.root.locator('.lx-data');
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }
}
