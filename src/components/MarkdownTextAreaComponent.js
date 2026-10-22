import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { ToolbarComponent } from './ToolbarComponent.js';
import { IconComponent } from './IconComponent.js';

export class MarkdownTextAreaComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-markdown-text-area', page, parent, id });
  }

  getWrapper() {
    return this.root.locator('.lx-markdown-text-area-wrapper');
  }

  getComplexInput() {
    return this.root.locator('.lx-complex-input');
  }

  getInputWrapper() {
    return this.root.locator('.lx-input-wrapper');
  }

  getToolbar() {
    return new ToolbarComponent({ parent: this.root, id: `${this.id}-toolbar` });
  }

  getEditor() {
    return this.root.locator('.lx-markdown-text-area.lx-input-area');
  }

  // `.ProseMirror` is the tiptap editor root rendered inside the editor container
  getEditorContent() {
    return this.getEditor().locator('.ProseMirror');
  }

  getEditorPlaceholder() {
    return this.getEditorContent().locator('p.is-editor-empty').first();
  }

  getInvalidationIconWrapper() {
    return this.root.locator('.lx-invalidation-icon-wrapper');
  }

  getInvalidationIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-invalidation-icon-wrapper') });
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message');
  }

  getHelperText() {
    return this.root.locator('.lx-helper-text');
  }

  getHelperIconWrapper() {
    return this.root.locator('.lx-input-helper-wrapper');
  }

  getHelperIcon() {
    return new IconComponent({ parent: this.root.locator('.lx-input-helper-wrapper') });
  }

  getFooter() {
    return this.root.locator('.lx-input-footer');
  }

  getMaxLengthCounter() {
    return this.root.locator('.lx-text-length');
  }

  getColorPickerButton() {
    return new ButtonComponent({ parent: this.root, id: `${this.id}-action-color` });
  }

  getPlaceholderPickerButton() {
    return new ButtonComponent({ parent: this.root, id: `${this.id}-action-placeholder` });
  }

  async getReadOnlyData() {
    const { readOnly } = await this.getState();

    if (!readOnly) {
      throw new Error('MarkdownTextAreaComponent is not in read-only mode');
    }

    return this.root.locator('.lx-rich-text-wrapper');
  }
}
