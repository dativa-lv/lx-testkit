import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { ToggleComponent } from './ToggleComponent.js';

export class DropDownMenuComponent extends BaseComponent {
  static component = 'lx-drop-down-menu';

  // Menus without an explicit id get a generated one, so read it from the DOM before building
  // the component, since the panel is found by id
  static async fromParent(parent, { directChild = false } = {}) {
    const unidentified = new DropDownMenuComponent({ parent, directChild });
    const id = await unidentified.root.getAttribute('data-id');

    return new DropDownMenuComponent({ parent, id, directChild });
  }

  getToggler() {
    return this.root.locator('.lx-dropdown-toggler').first();
  }

  #panelId() {
    if (!this.id) {
      throw new Error('DropDownMenuComponent requires id to locate its panel');
    }

    return `${this.id}-panel`;
  }

  // Teleported to #poppers, outside the root
  getPanel() {
    return this.root.page().locator(`#poppers [id="${this.#panelId()}"]`);
  }

  getPopper() {
    return this.root.page().locator(`#poppers .popper:has([id="${this.#panelId()}"])`);
  }

  getActionButtons() {
    return this.getPanel().locator('.lx-dropdown-menu-button [data-component="lx-button"]');
  }

  getActionButton({ id }) {
    return new ButtonComponent({ parent: this.getPanel(), id });
  }

  getActionToggle({ id }) {
    return new ToggleComponent({ parent: this.getPanel(), id });
  }

  getGroupLabel({ groupId }) {
    return this.getPanel().locator(`.lx-dropdown-menu-group .lx-label[id="${groupId}-group"]`);
  }
}
