import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';

export class BadgeComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-badge', page, parent, id });
  }

  getIcon() {
    return new IconComponent({ parent: this.root });
  }

  getText() {
    return this.root.locator('.lx-data.lx-badge-text');
  }
}
