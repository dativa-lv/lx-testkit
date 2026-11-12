import { BaseComponent } from './BaseComponent.js';

export class RadioButtonComponent extends BaseComponent {
  static component = 'lx-radio-button';

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
