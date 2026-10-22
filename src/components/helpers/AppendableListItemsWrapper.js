import { AppendableListItem } from './AppendableListItem.js';

export class AppendableListItemsWrapper {
  constructor({ parentRoot, expandable }) {
    this.parentRoot = parentRoot;
    this.expandable = expandable;
    this.root = this.parentRoot.locator('.lx-appendable-list');
  }

  getRoot() {
    return this.root;
  }

  getItem({ id = null, n = null } = {}) {
    return new AppendableListItem({
      parentRoot: this.root,
      expandable: this.expandable,
      id,
      n,
    });
  }
}
