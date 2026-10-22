import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';
import { BadgeComponent } from './BadgeComponent.js';

export class ExpanderComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-expander', page, parent, id });
  }

  getHeader() {
    return this.root.locator('header.lx-head');
  }

  getBody() {
    return this.root.locator('article.lx-body');
  }

  getLabel() {
    return this.root.locator('.lx-header-data .heading-4');
  }

  getDescription() {
    return this.root.locator('.lx-header-data .lx-description');
  }

  getChevronIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-chevron-icon') });
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }

  getBadge() {
    return new BadgeComponent({ parent: this.root });
  }
}
