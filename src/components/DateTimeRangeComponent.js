import { BaseComponent } from './BaseComponent.js';

export class DateTimeRangeComponent extends BaseComponent {
  static component = 'lx-date-time-range-picker';

  getInput(name) {
    switch (name) {
      case 'from':
        return this.root.locator(`input[id="from-${this.id}"]`);
      case 'till':
        return this.root.locator(`input[id="till-${this.id}"]`);
      default:
        throw new Error(`Unknown name: ${name}`);
    }
  }

  getInputWrapper(name) {
    switch (name) {
      case 'from':
        return this.root.locator(
          `.lx-start-input-and-separator-wrapper.lx-input-wrapper:has(input[id="from-${this.id}"])`
        );
      case 'till':
        return this.root.locator(`.lx-input-wrapper:has(input[id="till-${this.id}"])`);
      default:
        throw new Error(`Unknown name: ${name}`);
    }
  }
}
