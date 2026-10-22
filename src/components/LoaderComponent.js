import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';

export class LoaderComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-loader', page, parent, id });
  }

  getTrack() {
    return this.root.locator('[data-container="loader-track"]');
  }

  getIndicator() {
    return this.root.locator('.lx-loader-active');
  }

  getPrimaryText() {
    return this.root.locator('.lx-primary');
  }

  getSecondaryText() {
    return this.root.locator('.lx-secondary');
  }

  getStateIcon() {
    return new IconComponent({ parent: this.root });
  }
}
