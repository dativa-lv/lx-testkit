import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';
import { ButtonComponent } from './ButtonComponent.js';

export class InfoBoxComponent extends BaseComponent {
  static component = 'lx-info-box';

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
