import { BaseComponent } from './BaseComponent.js';
import { ToolbarComponent } from './ToolbarComponent.js';
import { AppendableListItemsWrapper } from './helpers/AppendableListItemsWrapper.js';
import { AppendableListItem } from './helpers/AppendableListItem.js';

export class AppendableListComponent extends BaseComponent {
  static component = 'lx-appendable-list';

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
