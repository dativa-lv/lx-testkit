import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { IconComponent } from './IconComponent.js';

export class InfoWrapperComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-info-wrapper', page, parent, id });
  }

  getTrigger() {
    return this.root.locator('.lx-info-wrapper-content');
  }

  getDescriptionId() {
    return `${this.id}-description`;
  }

  getPopper() {
    return this.page.locator('#poppers .popper').filter({ has: this.getPanel() }).first();
  }

  getPanel() {
    return this.page
      .locator(`#poppers [id="${this.getDescriptionId()}"][aria-hidden="false"]`)
      .first();
  }

  getPanelData() {
    return this.getPanel().locator('.lx-data').first();
  }

  getTooltip() {
    return this.getPopper().locator('.lx-info-wrapper').first();
  }

  getArrow() {
    return this.getPopper().locator('.popper-floating-arrow').first();
  }

  getFieldWrapper() {
    return this.page.locator(`.popper-wrapper[id="${this.id}-popper"]`);
  }

  getCloseButton() {
    return new ButtonComponent({
      parent: this.getPanel(),
      id: `${this.id}-close-button`,
    });
  }

  getHandleIcon() {
    return new IconComponent({ parent: this.getPanel().locator('.handle-wrapper') });
  }
}
