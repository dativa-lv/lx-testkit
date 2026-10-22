import { BaseComponent } from './BaseComponent.js';
import { StepsItem } from './helpers/StepsItem.js';

export class StepsComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-steps', page, parent, id });
  }

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
