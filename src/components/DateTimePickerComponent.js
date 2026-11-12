import { BaseComponent } from './BaseComponent.js';
import { ButtonComponent } from './ButtonComponent.js';
import { isTouchOnly } from './helpers/touch.js';

export class DateTimePickerComponent extends BaseComponent {
  static component = 'lx-date-time-picker';

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
    const input = this.getInput();

    if (!(await isTouchOnly(input.page()))) {
      await input.press('ArrowDown');
      return;
    }

    // press() focuses with a tap there, so send the keyup the picker listens to in the page
    await input.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown', bubbles: true }));
    });
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