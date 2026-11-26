import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { DropDownMenuComponent } from './DropDownMenuComponent.js';
import { ToggleComponent } from './ToggleComponent.js';

export class RowComponent extends BaseComponent {
  static component = 'lx-row';

  getHeader() {
    return this.root.locator(':scope > .lx-row-header');
  }

  getLabel() {
    return this.getHeader().locator('label');
  }

  getContent() {
    return this.root.locator(':scope > :is(.lx-vertical, .lx-horizontal)');
  }

  // A single action renders as a button, or as a toggle, more of them go into the actions menu
  getActionButton({ id }) {
    return new ButtonComponent({ parent: this.getHeader(), id: `${this.id}-action-${id}` });
  }

  getActionToggle({ id }) {
    return new ToggleComponent({ parent: this.getHeader(), id: `${this.id}-action-${id}` });
  }

  async getActionsMenu() {
    return DropDownMenuComponent.fromParent(this.getHeader());
  }
}
