import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';
import { ButtonComponent } from './ButtonComponent.js';

export class InfoBoxComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-info-box', page, parent, id });
  }

  getTitle() {
    return this.root.locator('.lx-alert-header .lx-data');
  }

  getDescription() {
    return this.root.locator('.lx-alert-description .lx-description');
  }

  getIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-info-box-icon') });
  }

  getButton() {
    return new ButtonComponent({ parent: this.root.locator('.lx-info-box-action-icon') });
  }
}
