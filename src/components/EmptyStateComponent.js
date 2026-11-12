import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { DropDownMenuComponent } from './DropDownMenuComponent.js';
import { IconComponent } from './IconComponent.js';

export class EmptyStateComponent extends BaseComponent {
  static component = 'lx-empty-state';

  get #data() {
    return this.root.locator(':scope > .lx-empty-state-data');
  }

  getIcon() {
    return new IconComponent({ parent: this.#data, directChild: true });
  }

  getLabel() {
    return this.#data.locator(':scope > .lx-primary');
  }

  getDescription() {
    return this.#data.locator(':scope > .lx-secondary');
  }

  // Up to three actions render as buttons, more of them go into the actions menu
  getActionButton({ id }) {
    return new ButtonComponent({ parent: this.#data.locator('.lx-empty-state-buttons'), id });
  }

  async getActionsMenu() {
    return DropDownMenuComponent.fromParent(this.#data);
  }
}
