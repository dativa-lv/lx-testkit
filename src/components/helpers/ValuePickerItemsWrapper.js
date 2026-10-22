import { ValuePickerItem } from './ValuePickerItem.js';

export class ValuePickerItemsWrapper {
  constructor({ parentRoot, variant, selectionKind }) {
    this.parentRoot = parentRoot;
    this.variant = variant;
    this.selectionKind = selectionKind;
    this.root = this.parentRoot.locator('[data-container="value-picker-items-wrapper"]');
  }

  getRoot() {
    return this.root;
  }

  getItem({ id = null, n = null } = {}) {
    return new ValuePickerItem({
      parentRoot: this.root,
      variant: this.variant,
      selectionKind: this.selectionKind,
      id,
      n,
    });
  }
}
