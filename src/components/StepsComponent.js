import { BaseComponent } from './BaseComponent.js';
import { StepsItem } from './helpers/StepsItem.js';

export class StepsComponent extends BaseComponent {
  static component = 'lx-steps';

  getItem({ id = null } = {}) {
    return new StepsItem({ parentRoot: this.root, id });
  }

  getSlider() {
    return this.root.locator('.lx-steps-slider');
  }

  getFilledSlider() {
    return this.root.locator('.lx-steps-filled-slider');
  }

  getFullSlider() {
    return this.root.locator('.lx-steps-full-slider');
  }
}
