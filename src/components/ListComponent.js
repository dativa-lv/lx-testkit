import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { DropDownMenuComponent } from './DropDownMenuComponent.js';
import { LoaderComponent } from './LoaderComponent.js';
import { ToolbarComponent } from './ToolbarComponent.js';
import { EmptyStateComponent } from './EmptyStateComponent.js';
import { SkipLinkComponent } from './SkipLinkComponent.js';
import { ListGroup } from './helpers/ListGroup.js';
import { ListItem } from './helpers/ListItem.js';

export class ListComponent extends BaseComponent {
  static component = 'lx-list';

  // Inner ids are derived from the component id, which a parent-only lookup does not know
  async getComponentId() {
    return this.id ?? this.root.getAttribute('data-id');
  }

  getItems() {
    return this.root.locator('[data-container="list-item"]');
  }

  async getItem({ id = null, n = null } = {}) {
    if (id == null && typeof n !== 'number') {
      throw new Error('ListItem requires id or n');
    }

    const { kind, hasSelecting, selectionKind } = await this.getState();
    const itemId =
      id ??
      (await this.getItems().nth(n).locator(':scope > .lx-list-item-wrapper').getAttribute('id'));

    return new ListItem({ parentRoot: this.root, kind, hasSelecting, selectionKind, id: itemId });
  }

  getGroups() {
    return this.root.locator('[data-component="lx-expander"]');
  }

  async getGroup({ id }) {
    const { kind, hasGroups, hasSelecting, selectionKind } = await this.getState();

    if (!hasGroups) {
      throw new Error('Group is not available for hasGroups: false');
    }

    const listId = await this.getComponentId();

    return new ListGroup({ parentRoot: this.root, listId, kind, hasSelecting, selectionKind, id });
  }

  async getToolbar() {
    return new ToolbarComponent({
      parent: this.root,
      id: `${await this.getComponentId()}-toolbar`,
    });
  }

  getSelectionStatus() {
    return this.root.locator('.lx-selection-status');
  }

  // Wide lists show the selection actions as buttons, narrow ones (`.is-narrow`) in a menu
  getSelectionActionButton({ id }) {
    return new ButtonComponent({ parent: this.root.locator('.selection-action-buttons'), id });
  }

  async getSelectionActionsMenu() {
    return DropDownMenuComponent.fromParent(this.root.locator('.selection-action-buttons-small'));
  }

  // Back button of the opened level in the narrow treelist layout
  async getTreeBackButton() {
    const { kind } = await this.getState();

    if (kind !== 'treelist') {
      throw new Error(`Tree back button is not available for kind: ${kind}`);
    }

    const parentRow = this.root.locator('.tree-list-small > .tree-item-small-parent');

    return new ButtonComponent({ parent: parentRow, directChild: true });
  }

  getEmptyState() {
    return new EmptyStateComponent({ parent: this.root });
  }

  getLoadMoreButton() {
    return new ButtonComponent({ parent: this.root.locator('.lx-load-more-button') });
  }

  getLoader() {
    return new LoaderComponent({ parent: this.root.locator('.lx-list-loader') });
  }

  getSkipLink() {
    return new SkipLinkComponent({ parent: this.root });
  }
}
