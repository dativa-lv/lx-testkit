import { ButtonComponent } from '../ButtonComponent.js';

export class FileUploaderItem {
  constructor({ parentRoot, mode, id }) {
    if (!id) {
      throw new Error('FileUploaderItem requires id');
    }

    this.parentRoot = parentRoot;
    this.mode = mode;
    this.id = id;
    this.root = this.parentRoot.locator(`[data-container="file-uploader-item"][id="${id}"]`);
  }

  getRoot() {
    return this.root;
  }

  getName() {
    return this.root.locator('.lx-file-name-wrapper .lx-primary');
  }

  // Default mode lists size, extension and extra info as separate entries, compact joins them
  getMeta() {
    switch (this.mode) {
      case 'default':
        return this.root.locator('.lx-file-meta .lx-data');
      case 'compact':
        return this.root.locator('header .lx-secondary');
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
    }
  }

  getRemoveButton() {
    return new ButtonComponent({ parent: this.root, id: `${this.id}-remove-button` });
  }

  getInfoButton() {
    switch (this.mode) {
      case 'default':
        // Narrow items render a second info button with the same id over the preview and collapse the one next to the meta
        return new ButtonComponent({
          parent: this.root.locator(
            '.small-preview .lx-file-preview, .lx-uploaded-file-preview-wrapper:not(.small-preview) .lx-file-addition-data-wrapper'
          ),
          id: `${this.id}-info-button`,
        });
      case 'compact':
        return new ButtonComponent({
          parent: this.root.locator('.lx-list-item-actions'),
          id: `${this.id}-info-button`,
        });
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
    }
  }

  getDownloadButton() {
    return this.root.locator('.lx-list-item[role="button"]');
  }

  getInvalidationMessage() {
    return this.root.locator(`[id="${this.id}-invalidation-message"]`);
  }
}
