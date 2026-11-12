import { ButtonComponent } from '../ButtonComponent.js';
import { DropDownMenuComponent } from '../DropDownMenuComponent.js';

// Shown after the messages while `typing` is on
export class ChatTypingIndicator {
  constructor({ parentRoot, chatId }) {
    this.root = parentRoot.locator(`[id="${chatId}-typing"]`);
    this.itemId = `${chatId}-typing-item`;
  }

  getRoot() {
    return this.root;
  }

  // The `typingUsers` names with the status text
  getStatusText() {
    return this.root.locator('.lx-chat-status-text');
  }

  // One `typingActionDefinitions` action renders as a button, more of them go into the actions menu
  getActionButton({ id }) {
    return new ButtonComponent({ parent: this.root, id: `${this.itemId}-action-${id}` });
  }

  async getActionsMenu() {
    return DropDownMenuComponent.fromParent(this.root.locator('.lx-list-item-actions'));
  }
}
