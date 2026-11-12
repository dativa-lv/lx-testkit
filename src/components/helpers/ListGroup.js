import { ButtonComponent } from '../ButtonComponent.js';
import { ExpanderComponent } from '../ExpanderComponent.js';
import { ListItem } from './ListItem.js';

// One `groupDefinitions` entry, rendered as an expander that holds the group items
export class ListGroup {
  constructor({ parentRoot, listId, kind, hasSelecting, selectionKind, id }) {
    if (id == null) {
      throw new Error('ListGroup requires id');
    }

    this.kind = kind;
    this.hasSelecting = hasSelecting;
    this.selectionKind = selectionKind;
    this.id = `${id}`;
    // Draggable group expanders are prefixed with the list id; other kinds use the bare group id
    const expanderId = kind === 'draggable' ? `${listId}-${this.id}-group` : this.id;
    this.expander = new ExpanderComponent({ parent: parentRoot, id: expanderId });
    this.root = this.expander.getRoot();
  }

  getId() {
    return this.id;
  }

  getRoot() {
    return this.root;
  }

  getExpander() {
    return this.expander;
  }

  // Selects or clears the whole group (multiple selection only)
  getSelectButton() {
    return new ButtonComponent({
      parent: this.root.locator(':scope > .lx-expander-head .lx-expander-head-actions'),
      id: 'selectGroup',
    });
  }

  getItems() {
    return this.expander.getBody().locator('[data-container="list-item"]');
  }

  async getItem({ id = null, n = null } = {}) {
    if (id == null && typeof n !== 'number') {
      throw new Error('ListGroup.getItem requires id or n');
    }

    const itemId =
      id ??
      (await this.getItems().nth(n).locator(':scope > .lx-list-item-wrapper').getAttribute('id'));

    return new ListItem({
      parentRoot: this.expander.getBody(),
      kind: this.kind,
      hasSelecting: this.hasSelecting,
      selectionKind: this.selectionKind,
      id: itemId,
    });
  }
}
