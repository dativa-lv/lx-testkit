import { BaseComponent } from './BaseComponent.js';
import { ValuePickerItemsWrapper } from './helpers/ValuePickerItemsWrapper.js';
import { ValuePickerItem } from './helpers/ValuePickerItem.js';
import { ToolbarComponent } from './ToolbarComponent.js';

export class ValuePickerComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-value-picker', page, parent, id });
  }

  async getItemsWrapper() {
    const { variant, selectionKind } = await this.getState();

    return new ValuePickerItemsWrapper({ parentRoot: this.root, variant, selectionKind });
  }

  async getItem({ id = null, n = null } = {}) {
    const { variant, selectionKind } = await this.getState();

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

  // TODO: implement
  // eslint-disable-next-line class-methods-use-this
  getDropDown() {
    return null;
  }

  // TODO: implement
  // eslint-disable-next-line class-methods-use-this
  getRotator() {
    return null;
  }
}
