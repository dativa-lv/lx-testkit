export class AppendableListItem {
  constructor({ parentRoot, expandable, id = null, n = null }) {
    if (!id && typeof n !== 'number') {
      throw new Error('AppendableListItem requires id or n');
    }

    this.parentRoot = parentRoot;
    this.expandable = expandable;
    this.root = null;

    if (id) {
      this.root = this.parentRoot.locator(`.lx-appendable-list-item[id="${id}"]`);
    } else if (typeof n === 'number') {
      this.root = this.parentRoot.locator('.lx-appendable-list-item').nth(n);
    }
  }

  getRoot() {
    return this.root;
  }

  getContainer() {
    return this.expandable
      ? this.root.locator('.lx-data-block-wrapper') // TODO: implement and use DataBlockComponent
      : this.root.locator('.lx-form-grid'); // TODO: implement and use FormComponent
  }
}
