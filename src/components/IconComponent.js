import { BaseComponent } from './BaseComponent.js';

export class IconComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-icon', page, parent, id });
  }
}
