import { ButtonComponent } from '../ButtonComponent.js';
import { CheckboxComponent } from '../CheckboxComponent.js';
import { IconComponent } from '../IconComponent.js';
import { isTouchOnly } from './touch.js';

class ValuePickerDropDownItem {
  constructor({ panel, pickerId, selectionKind, id = null, n = null }) {
    if (!id && typeof n !== 'number') {
      throw new Error('ValuePickerDropDownItem requires id or n');
    }

    this.selectionKind = selectionKind;
    this.root = id
      ? panel.locator(`[role="option"][id="${pickerId}-item-${id}"]`)
      : panel.locator('[role="option"]').nth(n);
  }

  getRoot() {
    return this.root;
  }

  getLabel() {
    return this.selectionKind === 'multiple'
      ? this.root.locator('.lx-checkbox-text-wrapper')
      : this.root.locator('label');
  }

  getCheckbox() {
    if (this.selectionKind !== 'multiple') {
      throw new Error(`Checkbox is not available for selectionKind: ${this.selectionKind}`);
    }

    return new CheckboxComponent({ parent: this.root });
  }

  getCheckmarkIcon() {
    if (this.selectionKind !== 'single') {
      throw new Error(`Checkmark icon is not available for selectionKind: ${this.selectionKind}`);
    }

    // The checkmark class is on the lx-icon element itself, so narrow the root instead of scoping
    // the parent; this skips icons rendered inside customItem slot content
    const icon = new IconComponent({ parent: this.root });
    icon.root = icon.root.and(this.root.locator('.lx-popover-item-checkmark'));

    return icon;
  }
}

// Covers the dropdown variant without search (LxDropDown for single, own markup for multiple).
// The panel is teleported to #poppers, so panel lookups go through the page.
export class ValuePickerDropDown {
  constructor({ parentRoot, id, selectionKind }) {
    this.parentRoot = parentRoot;
    this.id = id;
    this.selectionKind = selectionKind;
    this.root = parentRoot.locator(`.lx-dropdown-default[id="${id}"]`);
  }

  #requireMultiple(name) {
    if (this.selectionKind !== 'multiple') {
      throw new Error(`${name} is not available for selectionKind: ${this.selectionKind}`);
    }
  }

  getRoot() {
    return this.root;
  }

  getInputWrapper() {
    return this.root.locator('.lx-dropdown-default-panel');
  }

  getValue() {
    return this.root.locator('.lx-dropdown-default-data');
  }

  getPlaceholder() {
    return this.selectionKind === 'multiple'
      ? this.root.locator('.lx-value-picker-placeholder.emptyModel')
      : this.root.locator('.lx-placeholder');
  }

  getChevronIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-input-icon-wrapper') });
  }

  getInvalidationIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-invalidation-icon-wrapper') });
  }

  getSelectedCount() {
    this.#requireMultiple('Selected count');

    return this.root.locator('.lx-tag-label');
  }

  getClearButton() {
    this.#requireMultiple('Clear button');

    return new ButtonComponent({ parent: this.root, id: `${this.id}-clear-button` });
  }

  getPopper() {
    return this.root.page().locator(`#poppers .popper:has([id="${this.id}-listbox"])`);
  }

  getPanel() {
    return this.root.page().locator(`#poppers [id="${this.id}-listbox"]`);
  }

  getItems() {
    return this.getPanel().locator('[role="option"]');
  }

  getItem({ id = null, n = null } = {}) {
    return new ValuePickerDropDownItem({
      panel: this.getPanel(),
      pickerId: this.id,
      selectionKind: this.selectionKind,
      id,
      n,
    });
  }

  getSelectAll() {
    this.#requireMultiple('Select all');

    return this.getPanel().locator(`[id="${this.id}-select-all"]`);
  }

  getEmptyState() {
    return this.getPanel().locator('.lx-empty');
  }

  async open() {
    if ((await this.root.getAttribute('aria-expanded')) !== 'true') {
      await this.#toggle();
    }

    await this.getPanel().waitFor();
  }

  async close() {
    if ((await this.root.getAttribute('aria-expanded')) === 'true') {
      await this.#toggle();
    }

    await this.getPanel().waitFor({ state: 'detached' });
  }

  async #toggle() {
    if (!(await isTouchOnly(this.root.page()))) {
      await this.root.click();
      return;
    }

    await this.root.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      el.click();
    });
  }
}
