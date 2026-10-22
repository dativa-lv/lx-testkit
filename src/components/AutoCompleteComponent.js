import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';

export class AutoCompleteComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-auto-complete', page, parent, id });
  }

  getInputWrapper() {
    return this.root.locator('.lx-text-input-wrapper');
  }

  getInput() {
    return this.root.locator(`input[id="${this.id}"]`);
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }

  async getReadOnlyData() {
    const { readOnly } = await this.getState();

    if (!readOnly) {
      throw new Error('AutoCompleteComponent is not in read-only mode');
    }

    // TODO: implement and use EmptyStateComponent too
    return this.root.locator(
      '.lx-data > .lx-input-text, .lx-data > div, .lx-data > span > span:first-of-type'
    );
  }

  getClearButton() {
    return new ButtonComponent({
      parent: this.root,
      id: `${this.id}-clearButton`,
    });
  }

  // TODO: implement and use PopperComponent?
  getPopper() {
    return this.page.locator(`[id="${this.id}-popper"]`);
  }
}
