import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { DropDownMenuComponent } from './DropDownMenuComponent.js';
import { RowComponent } from './RowComponent.js';

export class SectionComponent extends BaseComponent {
  static component = 'lx-section';

  getHeader() {
    return this.root.locator(':scope > header');
  }

  getLabel() {
    return this.getHeader().locator('.heading-3');
  }

  getDescription() {
    return this.getHeader().locator('.lx-description');
  }

  // A single action renders as a button, more of them go into the actions menu
  getActionButton({ id }) {
    return new ButtonComponent({ parent: this.getHeader(), id });
  }

  async getActionsMenu() {
    return DropDownMenuComponent.fromParent(this.getHeader());
  }

  getRows() {
    return this.root.locator('[data-component="lx-row"]');
  }

  // By n, the row id is read first, because RowComponent builds its action ids from it
  async getRow({ id = null, n = null } = {}) {
    if (id) {
      return new RowComponent({ parent: this.root, id });
    }

    if (typeof n === 'number') {
      const rowId = await this.getRows().nth(n).getAttribute('data-id');
      return new RowComponent({ parent: this.root, id: rowId });
    }

    throw new Error('getRow requires id or n');
  }
}
