import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';
import { BadgeComponent } from './BadgeComponent.js';
import { LoaderComponent } from './LoaderComponent.js';

export class ButtonComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-button', page, parent, id });
  }

  getLabel() {
    return this.root.locator('.lx-button-label');
  }

  getIcon() {
    return new IconComponent({ parent: this.root });
  }

  getBadge() {
    return new BadgeComponent({ parent: this.root });
  }

  getLoader() {
    return new LoaderComponent({ parent: this.root });
  }
}
