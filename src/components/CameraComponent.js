import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { DropDownMenuComponent } from './DropDownMenuComponent.js';
import { EmptyStateComponent } from './EmptyStateComponent.js';
import { LoaderComponent } from './LoaderComponent.js';
import { ToggleComponent } from './ToggleComponent.js';
import { ToolbarComponent } from './ToolbarComponent.js';
import {
  findHelperIcon,
  findHelperIconWrapper,
  findHelperText,
} from './helpers/helperTextUtils.js';

export class CameraComponent extends BaseComponent {
  static component = 'lx-camera';

  // Inner ids are derived from the component id, which a parent-only lookup does not know
  async getComponentId() {
    return this.id ?? this.root.getAttribute('data-id');
  }

  get #frame() {
    return this.root.locator('.lx-camera-frame');
  }

  // Carries `lx-disabled` while the camera stream is starting
  getFrame() {
    return this.#frame;
  }

  getVideo() {
    return this.#frame.locator(':scope > video');
  }

  getPhoto() {
    return this.#frame.locator(':scope > img');
  }

  getLoader() {
    return new LoaderComponent({ parent: this.#frame, directChild: true });
  }

  // Rendered only while there is no photo
  async getToolbar() {
    return new ToolbarComponent({
      parent: this.root,
      id: `${await this.getComponentId()}-toolbar`,
    });
  }

  async #getToolbarActionId(actionId) {
    return `${await this.getComponentId()}-toolbar-action-${actionId}`;
  }

  async getSwitchCameraButton() {
    const { cameraSwitcherMode } = await this.getState();

    if (cameraSwitcherMode !== 'toggle') {
      throw new Error(
        `Switch camera button is not available for cameraSwitcherMode: ${cameraSwitcherMode}`
      );
    }

    return new ButtonComponent({
      parent: this.root,
      id: await this.#getToolbarActionId('switchCamera'),
    });
  }

  async getCameraMenu() {
    const { cameraSwitcherMode } = await this.getState();

    if (cameraSwitcherMode !== 'list') {
      throw new Error(`Camera menu is not available for cameraSwitcherMode: ${cameraSwitcherMode}`);
    }

    const triggerId = await this.#getToolbarActionId('changeCamera');

    return DropDownMenuComponent.fromParent(
      this.root.locator(`.action-definitions-group:has([id="${triggerId}"])`)
    );
  }

  async getFlashlightToggle() {
    const { hasFlashlightToggle } = await this.getState();

    if (!hasFlashlightToggle) {
      throw new Error('Flashlight toggle is not available for hasFlashlightToggle: false');
    }

    return new ToggleComponent({
      parent: this.root,
      id: await this.#getToolbarActionId('flashlight'),
    });
  }

  async getTakePhotoButton() {
    return new ButtonComponent({
      parent: this.root,
      id: `${await this.getComponentId()}-take-photo`,
    });
  }

  async getDeletePhotoButton() {
    return new ButtonComponent({
      parent: this.root,
      id: `${await this.getComponentId()}-delete-photo`,
    });
  }

  // Shown when camera access is denied or no camera is available
  getErrorState() {
    return new EmptyStateComponent({ parent: this.root.locator('.lx-camera-error') });
  }

  getHelperText() {
    return findHelperText(this.root);
  }

  getHelperIconWrapper() {
    return findHelperIconWrapper(this.root);
  }

  getHelperIcon() {
    return findHelperIcon(this.root);
  }
}
