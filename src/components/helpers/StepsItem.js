import { IconComponent } from '../IconComponent.js';
import { LoaderComponent } from '../LoaderComponent.js';

export class StepsItem {
  constructor({ parentRoot, id = null }) {
    if (!id) {
      throw new Error('StepsItem requires id');
    }

    this.parentRoot = parentRoot;
    this.root = this.parentRoot.locator(
      `[id$="-step-${id}"]:visible, [id$="-step-small-${id}"]:visible`
    );
  }

  getRoot() {
    return this.root;
  }

  getLabel() {
    return this.root.locator('.lx-steps-label');
  }

  getDescription() {
    return this.root.locator('.lx-steps-description');
  }

  getIcon() {
    return new IconComponent({ parent: this.root });
  }

  getLoader() {
    return new LoaderComponent({ parent: this.root.locator('.lx-steps-loader') });
  }
}
