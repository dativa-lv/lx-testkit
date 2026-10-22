import { BaseComponent } from './BaseComponent.js';
import { TextInputComponent } from './TextInputComponent.js';

export class NumberInputComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-number-input', page, parent, id });
  }

  async getWrapper() {
    const { kind, readOnly } = await this.getState();

    if (readOnly) {
      throw new Error(`Wrapper is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }

    switch (kind) {
      case 'slider':
        return this.root.locator('.lx-number-slider-wrapper');
      case 'stepper':
        return this.root.locator('.lx-number-stepper');
      default:
        throw new Error(`Unknown kind: ${kind}`);
    }
  }

  // The element that carries the value: the range input for the slider, the text
  // input for the stepper with an input and the spinbutton for the one without
  async getInput() {
    const { kind, readOnly, hasInput } = await this.getState();

    if (readOnly) {
      throw new Error(`Input is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }

    switch (kind) {
      case 'slider':
        return this.root.locator('input.lx-number-input');
      case 'stepper':
        return hasInput
          ? (await this.getTextInput()).getInput()
          : this.root.locator('.lx-number-stepper-value');
      default:
        throw new Error(`Unknown kind: ${kind}`);
    }
  }

  // Not guarded by hasInput on purpose — without an input the container is
  // hidden (slider) or missing (stepper), which is worth asserting
  async getTextInputContainer() {
    const { kind, readOnly } = await this.getState();

    if (readOnly) {
      throw new Error(
        `Text input container is not available for kind: ${kind}, readOnly: ${readOnly}`
      );
    }

    switch (kind) {
      case 'slider':
        return this.root.locator('.lx-number-slider-range-text');
      case 'stepper':
        return this.root.locator('.lx-number-stepper');
      default:
        throw new Error(`Unknown kind: ${kind}`);
    }
  }

  async getTextInput() {
    const { kind, readOnly, hasInput } = await this.getState();

    if (readOnly || !hasInput) {
      throw new Error(
        `Text input is not available for kind: ${kind}, readOnly: ${readOnly}, hasInput: ${hasInput}`
      );
    }
    const container = await this.getTextInputContainer();

    return new TextInputComponent({ parent: container });
  }

  async getReadOnlyData() {
    const { kind, readOnly } = await this.getState();

    if (!readOnly) {
      throw new Error(`Read-only data is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    return this.root.locator('.lx-data');
  }

  // Only the slider paints its range, so only it exposes one
  async getRange() {
    const { kind, readOnly } = await this.getState();

    if (readOnly || kind !== 'slider') {
      throw new Error(`Range is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    const input = await this.getInput();

    return input.evaluate((el) => ({
      value: Number(el.value),
      min: Number(el.min),
      max: Number(el.max),
    }));
  }

  async getSliderContainer() {
    const { kind, readOnly } = await this.getState();

    if (readOnly || kind !== 'slider') {
      throw new Error(`Slider container is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    return this.root.locator('.lx-number-slider-container');
  }

  async getTrack() {
    const { kind, readOnly } = await this.getState();

    if (readOnly || kind !== 'slider') {
      throw new Error(`Track is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    return this.root.locator('.lx-number-slider-track');
  }

  async getFilledTrack() {
    const { kind, readOnly } = await this.getState();

    if (readOnly || kind !== 'slider') {
      throw new Error(`Filled track is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    return this.root.locator('.lx-number-slider-track-filled');
  }

  async getUnfilledTrack() {
    const { kind, readOnly } = await this.getState();

    if (readOnly || kind !== 'slider') {
      throw new Error(`Unfilled track is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    return this.root.locator('.lx-number-slider-track-unfilled');
  }

  async getRangeLabels() {
    const { kind, readOnly } = await this.getState();

    if (readOnly || kind !== 'slider') {
      throw new Error(`Range labels are not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    return this.root.locator('.lx-number-slider-range-label');
  }

  async getDecreaseButton() {
    const { kind, readOnly } = await this.getState();

    if (readOnly || kind !== 'stepper') {
      throw new Error(`Decrease button is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    return this.root.locator('.lx-number-stepper-decrease');
  }

  async getIncreaseButton() {
    const { kind, readOnly } = await this.getState();

    if (readOnly || kind !== 'stepper') {
      throw new Error(`Increase button is not available for kind: ${kind}, readOnly: ${readOnly}`);
    }
    return this.root.locator('.lx-number-stepper-increase');
  }

  async getStatus() {
    const { kind, readOnly, hasInput } = await this.getState();

    if (readOnly || (kind === 'stepper' && hasInput)) {
      throw new Error(
        `Status is not available for kind: ${kind}, readOnly: ${readOnly}, hasInput: ${hasInput}`
      );
    }
    return this.root.locator('[role="status"]');
  }
}
