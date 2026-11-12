import { BaseComponent } from './BaseComponent.js';
import {
  findHelperIcon,
  findHelperIconWrapper,
  findHelperText,
} from './helpers/helperTextUtils.js';
import { ValuePickerItemsWrapper } from './helpers/ValuePickerItemsWrapper.js';
import { ValuePickerItem } from './helpers/ValuePickerItem.js';
import { ToolbarComponent } from './ToolbarComponent.js';
import { AutoCompleteComponent } from './AutoCompleteComponent.js';
import { ValuePickerDropDown } from './helpers/ValuePickerDropDown.js';
import { ValuePickerRotator } from './helpers/ValuePickerRotator.js';

export class ValuePickerComponent extends BaseComponent {
  static component = 'lx-value-picker';

  // Dropdown and rotator items live in their own panels, so point to the variant specific getters
  #requireInlineItems(name, variant) {
    switch (variant) {
      case 'dropdown':
      case 'dropdown-custom':
        throw new Error(`${name} is not available for variant: ${variant}, use getDropDown()`);
      case 'rotator':
      case 'rotator-custom':
        throw new Error(`${name} is not available for variant: ${variant}, use getRotator()`);
    }
  }

  async getItemsWrapper() {
    const { variant, selectionKind } = await this.getState();
    this.#requireInlineItems('Items wrapper', variant);

    return new ValuePickerItemsWrapper({ parentRoot: this.root, variant, selectionKind });
  }

  async getItem({ id = null, n = null } = {}) {
    const { variant, selectionKind } = await this.getState();
    this.#requireInlineItems('Item', variant);

    return new ValuePickerItem({ parentRoot: this.root, variant, selectionKind, id, n });
  }

  async getReadOnlyData() {
    const { readOnlyRenderType } = await this.getState();

    switch (readOnlyRenderType) {
      case 'row':
        return this.root.locator('.lx-data');
      case 'column':
        return this.root.locator('.lx-column-read-only-data');
      default:
        throw new Error(`Unknown readOnlyRenderType: ${readOnlyRenderType}`);
    }
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }

  getHelperText() {
    return findHelperText(this.root);
  }

  getHelperIconWrapper() {
    return findHelperIconWrapper(this.root);
  }

  getHelperIcon() {
    return findHelperIcon(this.root);
  }

  async getToolbar() {
    const { variant } = await this.getState();

    switch (variant) {
      case 'default':
      case 'default-custom':
      case 'horizontal':
      case 'horizontal-custom':
      case 'indicator':
      case 'tags':
      case 'tags-custom':
      case 'tiles':
      case 'tiles-custom':
        return new ToolbarComponent({ parent: this.root });
      case 'dropdown':
      case 'dropdown-custom':
      case 'rotator':
      case 'rotator-custom':
        throw new Error(`Toolbar is not available for variant: ${variant}`);
      default:
        throw new Error(`Unknown variant: ${variant}`);
    }
  }

  async getDropDown() {
    const { variant, selectionKind, hasSearch, readOnly } = await this.getState();

    if (variant !== 'dropdown' && variant !== 'dropdown-custom') {
      throw new Error(`DropDown is not available for variant: ${variant}`);
    }

    if (readOnly) {
      throw new Error('DropDown is not available for readOnly: true, use getReadOnlyData()');
    }

    const id = this.id ?? (await this.root.getAttribute('data-id'));

    if (hasSearch) {
      return new AutoCompleteComponent({ parent: this.root, id });
    }

    return new ValuePickerDropDown({ parentRoot: this.root, id, selectionKind });
  }

  async getRotator() {
    const { variant, readOnly } = await this.getState();

    if (variant !== 'rotator' && variant !== 'rotator-custom') {
      throw new Error(`Rotator is not available for variant: ${variant}`);
    }

    if (readOnly) {
      throw new Error('Rotator is not available for readOnly: true, use getReadOnlyData()');
    }

    const id = this.id ?? (await this.root.getAttribute('data-id'));
    // The rotator does not pass an id to its drop down menu, so read the generated one
    const menuId = await this.root
      .locator('[data-component="lx-drop-down-menu"]')
      .getAttribute('data-id');

    return new ValuePickerRotator({ parentRoot: this.root, id, menuId });
  }
}
