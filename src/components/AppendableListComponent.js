import { BaseComponent } from './BaseComponent.js';
import { ToolbarComponent } from './ToolbarComponent.js';
import { AppendableListItemsWrapper } from './helpers/AppendableListItemsWrapper.js';
import { AppendableListItem } from './helpers/AppendableListItem.js';

export class AppendableListComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-appendable-list', page, parent, id });
  }

  async getItemsWrapper() {
    const { expandable } = await this.getState();

    return new AppendableListItemsWrapper({ parentRoot: this.root, expandable });
  }

  async getItem({ id = null, n = null } = {}) {
    const { expandable } = await this.getState();

    return new AppendableListItem({ parentRoot: this.root, expandable, id, n });
  }

  getToolbar() {
    return new ToolbarComponent({ parent: this.root });
  }
}
