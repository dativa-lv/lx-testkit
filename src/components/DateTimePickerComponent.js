import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';

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

  getCalendarPanel() {
    return this.page
      .locator('.popper.fullscreen-popper .lx-dropdown-panel')
      .first();
  }

  getMonthLayoutButton() {
    return new ButtonComponent({
      parent: this.getCalendarContainer(),
      id: `${this.id}-months-select-button`,
    });
  }

  getYearLayoutButton() {
    return new ButtonComponent({
      parent: this.getCalendarContainer(),
      id: `${this.id}-years-select-button`,
    });
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

  getCalendarHeader() {
    return this.getCalendarContainer().locator('.lx-calendar-header').first();
  }

  getCalendarFooter() {
    return this.getCalendarContainer().locator('.lx-calendar-footer').first();
  }

  getCalendarWeekday() {
    return this.getCalendarContainer().locator('.lx-calendar-weekday').first();
  }

  getCalendarDayWrapper() {
    return this.getCalendarContainer().locator('.lx-calendar-day-wrapper').first();
  }

  getCalendarDay() {
    return this.getCalendarContainer()
      .locator('.lx-calendar-day:not(.lx-other-month):not(.lx-selected-day)')
      .first();
  }

  getTimePickerContainer() {
    return this.getCalendarContainer().locator('.lx-time-picker-container').first();
  }

  getTimeList() {
    return this.getCalendarContainer().locator('.lx-time-list-viewport').first();
  }

  getActiveTimeItem() {
    return this.getCalendarContainer().locator('.lx-time-list-item.lx-active').first();
  }

  getMobileTimeButton() {
    return new ButtonComponent({
      parent: this.getCalendarContainer(),
      id: `${this.id}-mobile-time-selection-button`,
    });
  }
}