import { BaseComponent } from './BaseComponent.js';

export class DateTimePickerComponent extends BaseComponent {
  constructor({ page = null, parent = null, id = null } = {}) {
    super({ component: 'lx-date-time-picker', page, parent, id });
  }

  getInput() {
    return this.root.locator(`input.lx-date-time-picker[id="${this.id}"]`).first();
  }

  getInputWrapper() {
    return this.root.locator('.lx-input-wrapper').first();
  }

  getDateTimePickerWrapper() {
    return this.root.locator('.lx-date-time-picker-wrapper').first();
  }

  async openCalendar() {
    await this.getInput().press('ArrowDown');
  }

  getCalendarContainer() {
    return this.page
      .locator('.lx-dropdown-panel-wrapper.date-picker-type .lx-calendar-container')
      .first();
  }

  getMonthLayoutButton() {
    return this.page
      .locator('.lx-dropdown-panel-wrapper.date-picker-type .lx-calendar-months-select-button')
      .first();
  }

  getSelectedDay() {
    return this.root.locator('.lx-selected-day').first();
  }

  getCalendarDayButton() {
    return this.root.locator('.lx-calendar-day button').first();
  }

  getInvalidationMessage() {
    return this.root.locator('.lx-invalidation-message').first();
  }
}
