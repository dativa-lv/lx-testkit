import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { ValuePickerComponent } from './ValuePickerComponent.js';

export class TabControlComponent extends BaseComponent {
  static component = 'lx-tab-control';

  getItems() {
    return this.root.locator('.lx-tab-container > .lx-tab');
  }

  getItem({ id = null, n = null } = {}) {
    if (id) {
      return this.root.locator(`[id="${this.id}-tab-${id}"]`);
    }

    if (typeof n === 'number') {
      return this.getItems().nth(n);
    }

    throw new Error('getItem requires id or n');
  }

  getSelectedItem() {
    return this.root.locator('.lx-tab-container > .lx-tab.lx-selected');
  }

  getPreviousButton() {
    return new ButtonComponent({ parent: this.root, id: `${this.id}-prev-button` });
  }

  getNextButton() {
    return new ButtonComponent({ parent: this.root, id: `${this.id}-next-button` });
  }

  // Replaces the tabs on narrow viewports, only when the tabs have no icons
  getDropdown() {
    return new ValuePickerComponent({ parent: this.root, id: `${this.id}-dropdown` });
  }
}
