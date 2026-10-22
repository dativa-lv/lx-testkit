import { RadioButtonComponent } from '../RadioButtonComponent.js';
import { CheckboxComponent } from '../CheckboxComponent.js';
import { IconComponent } from '../IconComponent.js';

export class ValuePickerItem {
  constructor({ parentRoot, variant, selectionKind, id = null, n = null }) {
    if (!id && typeof n !== 'number') {
      throw new Error('ValuePickerItem requires id or n');
    }

    this.parentRoot = parentRoot;
    this.variant = variant;
    this.selectionKind = selectionKind;
    this.root = null;

    if (id) {
      this.root = this.parentRoot.locator(`[data-container="value-picker-item"][id="${id}"]`);
    } else if (typeof n === 'number') {
      this.root = this.parentRoot.locator('[data-container="value-picker-item"]').nth(n);
    }
  }

  getRoot() {
    return this.root;
  }

  getContainer() {
    switch (this.variant) {
      case 'default':
      case 'default-custom':
        switch (this.selectionKind) {
          case 'single':
            return new RadioButtonComponent({ parent: this.root });
          case 'multiple':
            return new CheckboxComponent({ parent: this.root });
          default:
            throw new Error(`Unknown selectionKind: ${this.selectionKind}`);
        }
      case 'horizontal':
      case 'horizontal-custom':
        return {
          getRoot: () => this.root,
          getLabelWrapper: () => this.root.locator('.lx-label-wrapper'),
          getLabel: () => this.root.locator('.lx-value-picker-horizontal-item-label'),
          getIconWrapper: () => this.root.locator('.lx-value-picker-horizontal-icon-wrapper'),
          getIcon: () => new IconComponent({ parent: this.root }),
        };
      case 'indicator':
        return {
          getRoot: () => this.root,
          getIcon: () => new IconComponent({ parent: this.root }),
        };
      case 'tags':
      case 'tags-custom':
        return {
          getRoot: () => this.root,
        };
      case 'tiles':
      case 'tiles-custom':
        return {
          getRoot: () => this.root,
          getHeader: () => this.root.locator('.lx-value-picker-tile-header'),
          getName: () => this.root.locator('.lx-value-picker-tile-name'),
          getIcon: () => new IconComponent({ parent: this.root }),
          getDescription: () => this.root.locator('.lx-value-picker-description'),
        };
      default:
        throw new Error(`Unknown variant: ${this.variant}`);
    }
  }

  getIcon() {
    switch (this.variant) {
      case 'horizontal':
      case 'horizontal-custom':
      case 'indicator':
      case 'tiles':
      case 'tiles-custom':
        return new IconComponent({ parent: this.root });
      case 'default':
      case 'default-custom':
      case 'tags':
      case 'tags-custom':
      case 'dropdown':
      case 'dropdown-custom':
      case 'rotator':
      case 'rotator-custom':
        throw new Error(`Icon is not available for variant: ${this.variant}`);
      default:
        throw new Error(`Unknown variant: ${this.variant}`);
    }
  }
}
