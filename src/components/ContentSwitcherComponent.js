import { BaseComponent } from './BaseComponent.js';
import { ContentSwitcherItem } from './helpers/ContentSwitcherItem.js';

export class ContentSwitcherComponent extends BaseComponent {
  static component = 'lx-content-switcher';

  getItem({ id = null, n = null } = {}) {
    return new ContentSwitcherItem({ parentRoot: this.root, id, n });
  }

  async getReadOnlyData() {
    const { readOnly } = await this.getState();

    if (!readOnly) {
      throw new Error('ContentSwitcherComponent is not in read-only mode');
    }

    return this.root.locator('.lx-data');
  }
}
