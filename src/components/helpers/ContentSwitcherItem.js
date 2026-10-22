import { IconComponent } from '../IconComponent.js';
import { BadgeComponent } from '../BadgeComponent.js';

export class ContentSwitcherItem {
  constructor({ parentRoot, id = null, n = null }) {
    if (!id && typeof n !== 'number') {
      throw new Error('ContentSwitcherItem requires id or n');
    }

    this.parentRoot = parentRoot;
    this.root = null;

    if (id) {
      this.root = this.parentRoot.locator(`.lx-content-switcher-item[id="${id}"]`);
    } else if (typeof n === 'number') {
      this.root = this.parentRoot.locator('.lx-content-switcher-item').nth(n);
    }
  }

  getRoot() {
    return this.root;
  }

  getLabel() {
    return this.root.locator('.lx-content-switcher-text');
  }

  getIcon() {
    return new IconComponent({ parent: this.root });
  }

  getBadge() {
    return new BadgeComponent({ parent: this.root });
  }
}
