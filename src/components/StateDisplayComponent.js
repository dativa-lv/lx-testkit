import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';

export class StateDisplayComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-state-display', page, parent, id });
  }

  getLabel() {
    return this.root.locator('.lx-state-text');
  }

  // Covers every displayShape: circle and diamond are icons too, not CSS shapes.
  getIcon() {
    return new IconComponent({ parent: this.root });
  }
}
