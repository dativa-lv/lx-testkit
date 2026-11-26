import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { DropDownMenuComponent } from './DropDownMenuComponent.js';
import { ExpanderComponent } from './ExpanderComponent.js';
import { InfoWrapperComponent } from './InfoWrapperComponent.js';
import { RowComponent } from './RowComponent.js';
import { SectionComponent } from './SectionComponent.js';
import { StepsComponent } from './StepsComponent.js';
import { TabControlComponent } from './TabControlComponent.js';

export class FormComponent extends BaseComponent {
  static component = 'lx-form';

  getHeader() {
    return this.root.locator(':scope > .lx-form-grid-header');
  }

  getHeaderTitle() {
    return this.root.locator(`[id="${this.id}-header"]`);
  }

  getPreHeader() {
    return this.getHeader().locator('.pre-header-group .lx-toolbar-chip');
  }

  getPostHeader() {
    return this.getHeader().locator('.post-header-group .lx-toolbar-chip');
  }

  getPreHeaderInfo() {
    return new InfoWrapperComponent({
      page: this.page,
      parent: this.getHeader(),
      id: `${this.id}-pre-header-info`,
    });
  }

  getPostHeaderInfo() {
    return new InfoWrapperComponent({
      page: this.page,
      parent: this.getHeader(),
      id: `${this.id}-post-header-info`,
    });
  }

  getFooter() {
    return this.root.locator(':scope > .lx-form-grid-footer');
  }

  getAction(actionId) {
    return new ButtonComponent({ parent: this.root, id: `${this.id}-action-${actionId}` });
  }

  // Matched by id, so the overflow menu button and buttons in the footer slot are left out
  getFooterActions() {
    return this.getFooter().locator(`[data-component="lx-button"][id^="${this.id}-action-"]`);
  }

  getRows() {
    return this.root.locator('[data-component="lx-row"]');
  }

  // By n, the row id is read first, because RowComponent builds its action ids from it
  async getRow({ id = null, n = null } = {}) {
    if (id) {
      return new RowComponent({ parent: this.root, id });
    }

    if (typeof n === 'number') {
      const rowId = await this.getRows().nth(n).getAttribute('data-id');
      return new RowComponent({ parent: this.root, id: rowId });
    }

    throw new Error('getRow requires id or n');
  }

  // Rows from the default slot are placed in the built-in section with id 'default'
  getSection(sectionId) {
    return new SectionComponent({ parent: this.root, id: `${this.id}-${sectionId}` });
  }

  // indexType 'default'. The form renders a full and a small index and shows one of them depending
  // on the viewport width, so this returns the one that is shown
  getIndex() {
    return this.root.locator(':scope > aside.lx-index:visible');
  }

  getIndexItems() {
    return this.getIndex().locator('li');
  }

  // `id` is the section id. Index items carry `<form id>-<section id>` as data-id, the same as their section
  getIndexItem({ id = null, n = null } = {}) {
    if (id) {
      return this.getIndex().locator(`li[data-id="${this.id}-${id}"]`);
    }

    if (typeof n === 'number') {
      return this.getIndexItems().nth(n);
    }

    throw new Error('getIndexItem requires id or n');
  }

  getSelectedIndexItems() {
    return this.getIndex().locator('li.lx-selected');
  }

  // indexType 'default' on the narrowest viewports, where the index is a menu in the header.
  // Without header actions it has its own menu, otherwise it is part of the header actions menu
  async getIndexMenu() {
    const menuButtons = `[id="${this.id}-index-menu-button"], [id="${this.id}-header-menu-button"]`;
    const id = await this.getHeader()
      .locator('[data-component="lx-drop-down-menu"]')
      .filter({ has: this.page.locator(menuButtons) })
      .first()
      .getAttribute('data-id');

    return new DropDownMenuComponent({ page: this.page, id });
  }

  async getIndexMenuItems() {
    return (await this.getIndexMenu()).getPanel().locator('.additional-index-button');
  }

  // indexType 'tabs'
  getTabControl() {
    return new TabControlComponent({ parent: this.root, id: `${this.id}-tab-control` });
  }

  // indexType 'wizard'. The step buttons are getAction('_lx_prev_step') and getAction('_lx_next_step')
  getWizardSteps() {
    return new StepsComponent({ parent: this.root, id: `${this.id}-wizard-steps` });
  }

  // indexType 'expanders'
  getSectionExpander(sectionId) {
    return new ExpanderComponent({
      parent: this.root,
      id: `${this.id}-${sectionId}-expander`,
    });
  }
}
