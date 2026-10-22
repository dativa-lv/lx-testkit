export class BaseComponent {
  constructor({ component = null, page = null, parent = null, id = null } = {}) {
    if (!component) {
      throw new Error('BaseComponent requires component');
    }

    if (!page && !parent) {
      throw new Error('BaseComponent requires page or parent');
    }

    if (!parent && !id) {
      throw new Error('BaseComponent requires id when parent is not provided');
    }

    const componentSelector = `[data-component="${component}"]`;
    const escapedId = id ? (globalThis.CSS?.escape?.(id) ?? id) : id;
    const idSelector = id ? `[data-id="${escapedId}"], [id="${escapedId}"]` : '';

    this.page = page;
    this.id = id;
    this.root = parent
      ? parent.locator(id ? `${componentSelector}:is(${idSelector})` : componentSelector)
      : page.locator(`${componentSelector}:is(${idSelector})`);
  }

  getId() {
    return this.id;
  }

  getRoot() {
    return this.root;
  }

  async getState() {
    const state = await this.root.getAttribute('data-state');

    if (!state) {
      return {};
    }

    return JSON.parse(state);
  }
}
