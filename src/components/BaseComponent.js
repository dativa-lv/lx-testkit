export class BaseComponent {
  // Subclasses declare their data-component as `static component = 'lx-…'`
  constructor({ page = null, parent = null, id = null, directChild = false } = {}) {
    const { component } = new.target;

    if (!component) {
      throw new Error(`${new.target.name} requires static component`);
    }

    if (!page && !parent) {
      throw new Error('BaseComponent requires page or parent');
    }

    if (!parent && !id) {
      throw new Error('BaseComponent requires id when parent is not provided');
    }

    // `directChild` matches only a direct child of `parent`, for components that can only be told
    // apart from nested ones of the same type by their position
    if (directChild && !parent) {
      throw new Error('BaseComponent requires parent when directChild is set');
    }

    const componentSelector = `${directChild ? ':scope > ' : ''}[data-component="${component}"]`;
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
