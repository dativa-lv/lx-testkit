import { BaseComponent } from './BaseComponent.js';
import { IconComponent } from './IconComponent.js';

export class StateDisplayComponent extends BaseComponent {
  static component = 'lx-state-display';

  getLabel() {
    return this.root.locator('.lx-state-text');
  }

  // Covers every displayShape: circle and diamond are icons too, not CSS shapes.
  getIcon() {
    return new IconComponent({ parent: this.root });
  }
}
