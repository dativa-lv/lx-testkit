import { ButtonComponent } from '../ButtonComponent.js';
import { DropDownMenuComponent } from '../DropDownMenuComponent.js';
import { IconComponent } from '../IconComponent.js';

// Covers the rotator variant. Left click (or Space / Enter) rotates to the next item, right click
// opens a drop down menu with every item. The menu panel is teleported to #poppers, so panel
// lookups go through DropDownMenuComponent.
export class ValuePickerRotator {
  constructor({ parentRoot, id, menuId }) {
    this.parentRoot = parentRoot;
    this.id = id;
    this.root = parentRoot.locator(`.lx-rotator[id="${id}"]`);
    this.menu = new DropDownMenuComponent({ parent: this.root, id: menuId });
  }

  getId() {
    return this.id;
  }

  getRoot() {
    return this.root;
  }

  getMenu() {
    return this.menu;
  }

  getInputWrapper() {
    return this.root.locator('.lx-rotator-dropdown-wrapper');
  }

  getInputArea() {
    return this.root.locator('.lx-rotator-set');
  }

  // Previous, current and next items; leaving items are skipped while the rotate transition runs
  getItems() {
    return this.getInputArea().locator('.lx-rotator-tag:not(.rotator-leave-active)');
  }

  getCurrentItem() {
    return this.getItems().nth(1);
  }

  getRotatorIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-input-icon-wrapper') });
  }

  getPopper() {
    return this.menu.getPopper();
  }

  getPanel() {
    return this.menu.getPanel();
  }

  getMenuItems() {
    return this.getPanel().locator('[data-component="lx-button"]');
  }

  getMenuItem({ id = null, n = null } = {}) {
    if (!id && typeof n !== 'number') {
      throw new Error('ValuePickerRotator.getMenuItem requires id or n');
    }

    if (id) {
      return new ButtonComponent({ parent: this.getPanel(), id: `${id}-item-button` });
    }

    const button = new ButtonComponent({ parent: this.getPanel() });
    button.root = button.root.nth(n);

    return button;
  }

  async rotate() {
    await this.getInputWrapper().click();
  }

  async open() {
    if ((await this.menu.getToggler().getAttribute('aria-expanded')) !== 'true') {
      await this.getInputWrapper().click({ button: 'right' });
    }

    await this.getPanel().waitFor();
  }

  async close() {
    if ((await this.menu.getToggler().getAttribute('aria-expanded')) === 'true') {
      await this.getInputWrapper().click({ button: 'right' });
    }

    await this.getPanel().waitFor({ state: 'detached' });
  }
}
