import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';

export class SkipLinkComponent extends BaseComponent {
  static component = 'lx-skip-link';

  // Clipped until it gets keyboard focus
  getButton() {
    return new ButtonComponent({ parent: this.root });
  }
}
