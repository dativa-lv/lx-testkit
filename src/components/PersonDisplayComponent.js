import { BaseComponent } from './BaseComponent.js';
import { EmptyValueComponent } from './EmptyValueComponent.js';
import { IconComponent } from './IconComponent.js';
import { InfoWrapperComponent } from './InfoWrapperComponent.js';

// A person is drawn as a generated avatar, the fallback user icon or a custom icon
const AVATAR_SELECTOR = '.lx-avatar-display, .lx-user-icon-display, .lx-person-icon-display';

export class PersonDisplayComponent extends BaseComponent {
  static component = 'lx-person-display';

  // The info wrapper reuses the component id, which a parent-only lookup does not know
  async getComponentId() {
    return this.id ?? this.root.getAttribute('data-id');
  }

  getAvatars() {
    return this.root.locator(AVATAR_SELECTOR);
  }

  getAvatar({ n = 0 } = {}) {
    return this.getAvatars().nth(n);
  }

  getInitials({ n = 0 } = {}) {
    return this.getAvatar({ n }).locator('.lx-avatar-initials');
  }

  // Only the user icon and custom icons are LX icons; generated avatars are plain SVG
  getIcon({ n = 0 } = {}) {
    return new IconComponent({ parent: this.getAvatar({ n }) });
  }

  getName() {
    return this.root.locator('.lx-person-display-name');
  }

  getDescription() {
    return this.root.locator('.lx-description');
  }

  getOverflowCounter() {
    return this.root.locator('.lx-person-display-multiple > .overflow');
  }

  // At most one empty value renders: for no people, a missing name or a missing description
  getEmptyValue() {
    return new EmptyValueComponent({ parent: this.root });
  }

  // The info wrapper looks up its panel in the page-level popper container
  async getInfoWrapper() {
    return new InfoWrapperComponent({
      page: this.root.page(),
      parent: this.root,
      id: await this.getComponentId(),
    });
  }
}
