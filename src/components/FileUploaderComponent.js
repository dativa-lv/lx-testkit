import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { ToolbarComponent } from './ToolbarComponent.js';
import { FileUploaderItem } from './helpers/FileUploaderItem.js';

export class FileUploaderComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-file-uploader', page, parent, id });
  }

  // Inner ids are derived from the component id, which a parent-only lookup does not know
  async getComponentId() {
    return this.id ?? this.root.getAttribute('data-id');
  }

  async getInput() {
    const { readOnly } = await this.getState();

    if (readOnly) {
      throw new Error('File input is not available for readOnly: true');
    }

    return this.root.locator('input[type="file"]');
  }

  async getUploadButton() {
    const { readOnly } = await this.getState();

    if (readOnly) {
      throw new Error('Upload button is not available for readOnly: true');
    }

    return new ButtonComponent({
      parent: this.root,
      id: `${await this.getComponentId()}-action-file-upload`,
    });
  }

  async getDropZone() {
    const { draggable, readOnly } = await this.getState();

    if (readOnly || !draggable) {
      throw new Error(
        `Drop zone is not available for draggable: ${draggable}, readOnly: ${readOnly}`
      );
    }

    return this.root.locator('.lx-draggable-drop-zone');
  }

  getItemsWrapper() {
    return this.root.locator('[data-container="file-uploader-items-wrapper"]');
  }

  getItems() {
    return this.getItemsWrapper().locator('[data-container="file-uploader-item"]');
  }

  async getItem({ id = null, n = null } = {}) {
    if (!id && typeof n !== 'number') {
      throw new Error('FileUploaderItem requires id or n');
    }

    const { mode } = await this.getState();
    const itemId = id ?? (await this.getItems().nth(n).getAttribute('id'));

    return new FileUploaderItem({ parentRoot: this.getItemsWrapper(), mode, id: itemId });
  }

  getToolbar() {
    return new ToolbarComponent({ parent: this.getItemsWrapper() });
  }

  getEmptyState() {
    return this.getItemsWrapper().locator('.lx-empty-state-data');
  }

  getInvalidationMessage() {
    return this.root.locator(':scope > .lx-invalidation-message');
  }

  async getDetailsModal() {
    const modalId = `${await this.getComponentId()}-info-modal`;
    const root = this.root.page().locator(`[id="${modalId}"]`);

    return {
      getRoot: () => root,
      getCloseButton: () => new ButtonComponent({ parent: root, id: `${modalId}-close-button` }),
    };
  }
}
