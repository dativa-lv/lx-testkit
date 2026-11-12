import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';

export class BadgeComponent extends BaseComponent {
  static component = 'lx-badge';

  getIcon() {
    return new IconComponent({ parent: this.root });
  }

  getText() {
    return this.root.locator('.lx-data.lx-badge-text');
  }
}
