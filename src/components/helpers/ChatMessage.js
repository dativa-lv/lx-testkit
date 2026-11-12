import { BadgeComponent } from '../BadgeComponent.js';
import { ButtonComponent } from '../ButtonComponent.js';
import { DropDownMenuComponent } from '../DropDownMenuComponent.js';
import { IconComponent } from '../IconComponent.js';

// One `items` entry, rendered as a bubble in a user group
export class ChatMessage {
  constructor({ parentRoot, chatId, id }) {
    if (id == null) {
      throw new Error('ChatMessage requires id');
    }

    this.parentRoot = parentRoot;
    this.id = `${id}`;
    this.domId = `${chatId}-message-${this.id}`;
    this.root = parentRoot.locator(`.lx-chat-message[id="${this.domId}"]`);
  }

  getId() {
    return this.id;
  }

  getRoot() {
    return this.root;
  }

  // Groups the messages of one user and day, carries `lx-chat-user-me` and `lx-chat-user-ai`
  getUserGroup() {
    return this.parentRoot.locator(`.lx-chat-user-group:has([id="${this.domId}"])`);
  }

  // Person display (name and time) with the badge, at the start of a group
  getHeader() {
    return this.root.locator('.lx-chat-bubble-header');
  }

  getBadge() {
    return new BadgeComponent({ parent: this.getHeader() });
  }

  // Shown instead of the header for own messages in a narrow chat, and for later messages after a time gap
  getTime() {
    return this.root.locator('.lx-chat-bubble-time');
  }

  // Carries `lx-category-*` and `lx-invalid`
  getBubble() {
    return this.root.locator('.lx-chat-bubble > .lx-list-item');
  }

  getText() {
    return this.getBubble().locator('header > .lx-rich-text-wrapper');
  }

  getForm() {
    return this.root.locator(`[id="${this.domId}-form"]`);
  }

  getFormActionButton({ id }) {
    return new ButtonComponent({ parent: this.getForm(), id: `${this.domId}-form-action-${id}` });
  }

  getInvalidationIcon() {
    return new IconComponent({ parent: this.getBubble().locator('.lx-invalidation-icon-wrapper') });
  }

  getInvalidationMessage() {
    return this.root.locator(`[id="${this.domId}-error"]`);
  }

  // One visible action renders as a button, more of them go into the actions menu
  getActionButton({ id }) {
    return new ButtonComponent({ parent: this.root, id: `${this.domId}-item-action-${id}` });
  }

  async getActionsMenu() {
    return DropDownMenuComponent.fromParent(this.root.locator('.lx-list-item-actions'));
  }
}
