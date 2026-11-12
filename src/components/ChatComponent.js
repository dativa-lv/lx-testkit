import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { EmptyStateComponent } from './EmptyStateComponent.js';
import { TextAreaComponent } from './TextAreaComponent.js';
import { ChatMessage } from './helpers/ChatMessage.js';
import { ChatTypingIndicator } from './helpers/ChatTypingIndicator.js';

export class ChatComponent extends BaseComponent {
  static component = 'lx-chat';

  // Inner ids are derived from the component id, which a parent-only lookup does not know
  async getComponentId() {
    return this.id ?? this.root.getAttribute('data-id');
  }

  // The typing indicator shares `lx-chat-message` but is not in a user group
  getMessages() {
    return this.root.locator('.lx-chat-user-messages-group > .lx-chat-message');
  }

  async getMessage({ id = null, n = null } = {}) {
    if (id == null && typeof n !== 'number') {
      throw new Error('ChatMessage requires id or n');
    }

    const chatId = await this.getComponentId();
    const messageId =
      id ?? (await this.getMessages().nth(n).getAttribute('id')).slice(`${chatId}-message-`.length);

    return new ChatMessage({ parentRoot: this.root, chatId, id: messageId });
  }

  async getTypingIndicator() {
    return new ChatTypingIndicator({ parentRoot: this.root, chatId: await this.getComponentId() });
  }

  getEmptyState() {
    return new EmptyStateComponent({ parent: this.root.locator('.lx-chat-message-list') });
  }

  // Shown while the message list is scrolled away from the latest messages
  async getScrollDownButton() {
    return new ButtonComponent({
      parent: this.root,
      id: `${await this.getComponentId()}-scroll-down`,
    });
  }

  async getMessageInput() {
    return new TextAreaComponent({
      parent: this.root,
      id: `${await this.getComponentId()}-input`,
    });
  }

  async getSendButton() {
    return new ButtonComponent({
      parent: this.root,
      id: `${await this.getComponentId()}-toolbar-action-send`,
    });
  }
}
