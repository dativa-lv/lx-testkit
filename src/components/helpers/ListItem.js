import { ButtonComponent } from '../ButtonComponent.js';
import { CheckboxComponent } from '../CheckboxComponent.js';
import { DropDownMenuComponent } from '../DropDownMenuComponent.js';
import { IconComponent } from '../IconComponent.js';
import { LoaderComponent } from '../LoaderComponent.js';
import { RadioButtonComponent } from '../RadioButtonComponent.js';

export class ListItem {
  constructor({ parentRoot, kind, hasSelecting, selectionKind, id }) {
    if (id == null) {
      throw new Error('ListItem requires id');
    }

    this.parentRoot = parentRoot;
    this.kind = kind;
    this.hasSelecting = hasSelecting;
    this.selectionKind = selectionKind;
    this.id = `${id}`;
    this.root = parentRoot.locator(
      `[data-container="list-item"]:has(> .lx-list-item-wrapper[id="${this.id}"])`
    );
    this.wrapper = this.root.locator(':scope > .lx-list-item-wrapper');
  }

  #requireKind(name, kind) {
    if (this.kind !== kind) {
      throw new Error(`${name} is not available for kind: ${this.kind}`);
    }
  }

  getId() {
    return this.id;
  }

  getRoot() {
    return this.root;
  }

  getContent() {
    return this.wrapper.locator(':scope > .lx-list-item');
  }

  getLabel() {
    return this.getContent().locator('header > .lx-primary');
  }

  getDescription() {
    return this.getContent().locator('header > .lx-secondary');
  }

  getSearchHighlights() {
    return this.getContent().locator('header .lx-highlight');
  }

  getIcon() {
    return new IconComponent({ parent: this.getContent().locator('.lx-list-icon-wrapper') });
  }

  getLoader() {
    return new LoaderComponent({ parent: this.wrapper.locator(':scope > .lx-list-item-loader') });
  }

  // One visible action renders as a button, more of them go into the actions menu
  getActionButton({ id }) {
    return new ButtonComponent({ parent: this.wrapper, id: `${this.id}-action-${id}` });
  }

  async getActionsMenu() {
    return DropDownMenuComponent.fromParent(this.wrapper.locator('.lx-list-item-actions'));
  }

  getSelectionControl() {
    if (!this.hasSelecting) {
      throw new Error('Selection control is not available for hasSelecting: false');
    }

    if (this.kind === 'draggable') {
      throw new Error(`Selection control is not available for kind: ${this.kind}`);
    }

    switch (this.selectionKind) {
      case 'single':
        return new RadioButtonComponent({ parent: this.root, directChild: true });
      case 'multiple':
        return new CheckboxComponent({ parent: this.root, directChild: true });
      default:
        throw new Error(`Unknown selectionKind: ${this.selectionKind}`);
    }
  }

  getHandle() {
    this.#requireKind('Handle', 'draggable');

    return this.root.locator(':scope > [data-component="lx-drop-down-menu"] .lx-handle');
  }

  async getMoveMenu() {
    this.#requireKind('Move menu', 'draggable');

    return DropDownMenuComponent.fromParent(this.root, { directChild: true });
  }

  // Wide layout: chevron that expands the children in place. Narrow layout: arrow that opens the
  // children as the next level. Not rendered for items without children or in client search.
  getExpandButton() {
    this.#requireKind('Expand button', 'treelist');

    const row = this.root.locator('xpath=..');

    return new ButtonComponent({ parent: row, directChild: true });
  }

  getReloadButton() {
    this.#requireKind('Reload button', 'treelist');

    return new ButtonComponent({ parent: this.parentRoot, id: `${this.id}-reload` });
  }

  getLoadingError() {
    this.#requireKind('Loading error', 'treelist');

    return this.parentRoot.locator(
      `.tree-item-invalid:has([id="${this.id}-reload"]) > .invalid-text`
    );
  }
}
