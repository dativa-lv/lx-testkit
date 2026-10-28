import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';
import { ButtonComponent } from './ButtonComponent.js';

export class InfoBoxComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-info-box', page, parent, id });
  }

  getTitle() {
    return this.root.locator('.lx-primary');
  }

  getDescription() {
    return this.root.locator('.lx-secondary');
  }

  getIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-info-box-icon') });
  }

  getButton() {
    return new ButtonComponent({ parent: this.root.locator('.lx-info-box-action-icon') });
  }
}
