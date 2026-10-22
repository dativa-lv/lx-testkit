import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { ToggleComponent } from './ToggleComponent.js';
import { AutoCompleteComponent } from './AutoCompleteComponent.js';

export class ToolbarComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-toolbar', page, parent, id });
  }

  getButton(id) {
    return new ButtonComponent({ parent: this.root, id });
  }

  getToggle(id) {
    return new ToggleComponent({ parent: this.root, id });
  }

  async getSearchWrapper() {
    const { searchMode } = await this.getState();

    const rootBySearchMode = {
      default: '.lx-toolbar-search',
      compact: '.toolbar-search',
    };

    const rootSelector = rootBySearchMode[searchMode];

    if (!rootSelector) {
      throw new Error(`Unknown searchMode: ${searchMode}`);
    }

    const root = this.root.locator(rootSelector);
    const input = new AutoCompleteComponent({
      page: this.page,
      parent: root,
      id: `${this.id}-search-input`,
    });

    return {
      getRoot: () => root,
      getInput: () => input,
      getClearButton: () => input.getClearButton(),
      getExpandButton: () =>
        new ButtonComponent({ parent: this.root, id: `${this.id}-search-toggle-button` }),
    };
  }
}
