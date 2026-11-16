import { BaseComponent } from './BaseComponent.js';

export class EmptyValueComponent extends BaseComponent {
  static component = 'lx-empty-value';

  getValue() {
    return this.root.locator(':scope > [aria-hidden="true"]');
  }
}
