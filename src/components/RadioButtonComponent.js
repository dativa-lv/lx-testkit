import { BaseComponent } from './BaseComponent.js';

export class RadioButtonComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-radio-button', page, parent, id });
  }

  getInput() {
    return this.root.locator('input');
  }

  getLabelWrapper() {
    return this.root.locator('.lx-radio-button-text-wrapper');
  }

  getLabel() {
    return this.root.locator('.lx-radio-button-label');
  }

  getAppearance() {
    return this.root.locator('.lx-radio-button-container');
  }

  getThumb() {
    return this.root.locator('.lx-radio-button-thumb');
  }
}
