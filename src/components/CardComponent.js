import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';

export class CardComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-card', page, parent, id });
  }

  getFront() {
    return this.root.locator('.lx-card-front');
  }

  getBack() {
    return this.root.locator('.lx-card-back');
  }

  async getFlipButton() {
    const { isFlipped } = await this.getState();

    return new ButtonComponent({
      parent: this.root,
      id: isFlipped ? `${this.id}-flip-button-back` : `${this.id}-flip-button-front`,
    });
  }
}
