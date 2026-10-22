## Available Components

Components covered by the test utils:

- `AppendableListComponent`
- `AutoCompleteComponent`
- `ButtonComponent`
- `CardComponent`
- `CheckboxComponent`
- `ContentSwitcherComponent`
- `DateTimePickerComponent`
- `DateTimeRangeComponent`
- `DropDownMenuComponent`
- `DurationInputComponent`
- `ExpanderComponent`
- `FileUploaderComponent`
- `IconComponent`
- `InfoBoxComponent`
- `InfoWrapperComponent`
- `LoaderComponent`
- `MarkdownTextAreaComponent`
- `NumberInputComponent`
- `RadioButtonComponent`
- `StateDisplayComponent`
- `StepsComponent`
- `TextAreaComponent`
- `TextInputComponent`
- `ToggleComponent`
- `ToolbarComponent`
- `ValuePickerComponent`

---

### `AppendableListComponent`

Use `AppendableListComponent` for LX appendable lists.

**Component selector (data-component):** `lx-appendable-list`

**Available methods:**

- `getRoot()` - returns the appendable list component root **locator**.
- `getItem({ id, n })` - returns one list item **wrapper** by item id or zero-based index. _Async_.
  - `getRoot()` - returns the appendable list item root **locator**.
  - `getContainer()` - returns the item content container **locator**.
- `getItemsWrapper()` - returns the list items **wrapper** for the current mode (expandable or not). _Async_.
  - `getRoot()` - returns the appendable list items wrapper root **locator**.
  - `getItem({ id, n })` - see `getItem({ id, n })` above (except this is _not async_).
- `getToolbar()` - returns the appendable list toolbar **component** (`ToolbarComponent`).

---

### `AutoCompleteComponent`

Use `AutoCompleteComponent` for LX auto completes.

**Component selector (data-component):** `lx-auto-complete`

**Available methods:**

- `getRoot()` - returns the auto complete component root **locator**.
- `getInputWrapper()` - returns the input wrapper **locator**.
- `getInput()` - returns the underlying input **locator**.
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `getReadOnlyData()` - returns the read-only data **locator**. _Async_.
- `getClearButton()` - returns the clear button **component** (`ButtonComponent`).
- `getPopper()` - returns the popper **locator**.

---

### `ButtonComponent`

Use `ButtonComponent` for LX buttons.

**Component selector (data-component):** `lx-button`

**Available methods:**

- `getRoot()` - returns the button component root **locator**.
- `getLabel()` - returns the visible label **locator**.
- `getIcon()` - returns the icon **component** (`IconComponent`).
- `getBadge()` - returns the badge **component** (`BadgeComponent`).
- `getLoader()` - returns the loader **component** (`LoaderComponent`).

---

### `CardComponent`

Use `CardComponent` for LX cards.

**Component selector (data-component):** `lx-card`

**Available methods:**

- `getRoot()` - returns the card component root **locator**.
- `getFront()` - returns the front face **locator**.
- `getBack()` - returns the back face **locator**.
- `getFlipButton()` - returns the flip button **component** (`ButtonComponent`). _Async_.

---

### `CheckboxComponent`

Use `CheckboxComponent` for LX checkboxes.

**Component selector (data-component):** `lx-checkbox`

**Available methods:**

- `getRoot()` - returns the checkbox component root **locator**.
- `getInput()` - returns the underlying checkbox input **locator**.
- `getLabelWrapper()` - returns the checkbox label wrapper **locator**.
- `getLabel()` - returns the visible checkbox label **locator**.
- `getAppearance()` - returns the visual checkbox control **locator**.
- `getThumbIcon()` - returns the checkbox thumb icon **locator**.
- `getInvalidationMessage()` - returns the invalidation message **locator**.

---

### `ContentSwitcherComponent`

Use `ContentSwitcherComponent` for LX content switchers.

**Component selector (data-component):** `lx-content-switcher`

**Available methods:**

- `getRoot()` - returns the content switcher component root **locator**.
- `getItem({ id, n })` - returns one content switcher item **wrapper** by item id or zero-based index.
  - `getRoot()` - returns the content switcher item root **locator**.
  - `getLabel()` - returns the content switcher item label **locator**.
  - `getIcon()` - returns the content switcher item icon **component** (`IconComponent`).
  - `getBadge()` - returns the content switcher item badge **component** (`BadgeComponent`).
- `getReadOnlyData()` - returns the read-only data **locator**. _Async_.

---

### `DateTimePickerComponent`

Use `DateTimePickerComponent` for LX date time pickers.

**Component selector (data-component):** `lx-date-time-picker`

**Available methods:**

- `getRoot()` - returns the date time picker component root **locator**.
- `getInput()` - returns the underlying date time picker input **locator**.
- `getInputWrapper()` - returns the input wrapper **locator**.
- `getDateTimePickerWrapper()` - returns the date time picker wrapper **locator**.
- `getCalendarContainer()` - returns the open calendar container **locator**.
- `getMonthLayoutButton()` - returns the calendar month layout toggle button **locator**.
- `getSelectedDay()` - returns the selected day **locator**.
- `getCalendarDayButton()` - returns the first calendar day button **locator**.
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `openCalendar()` - opens the calendar by pressing `ArrowDown` on the input. _Async_.

---

### `DateTimeRangeComponent`

Use `DateTimeRangeComponent` for LX date time range pickers.

**Component selector (data-component):** `lx-date-time-range-picker`

**Available methods:**

- `getRoot()` - returns the date time range picker component root **locator**.
- `getInput(name)` - returns the input **locator** by name - `from` or `till`.
- `getInputWrapper(name)` - returns the input wrapper **locator** by name - `from` or `till`.

---

### `DropDownMenuComponent`

Use `DropDownMenuComponent` for LX drop down menus.

**Component selector (data-component):** `lx-drop-down-menu`

The panel is rendered only while the menu is open and is teleported to `#poppers`, so panel methods
look it up at page level through the component id (`id` is required for them).

**Available methods:**

- `getRoot()` - returns the drop down menu component root **locator**.
- `getToggler()` - returns the toggler **locator** (`role="button"`, carries `aria-expanded`).
- `getPanel()` - returns the open panel **locator** (`role="menu"`) inside `#poppers`.
- `getPopper()` - returns the popper container **locator** that positions the panel.
- `getActionButtons()` - returns a **locator** matching every action button in the panel.
- `getActionButton({ id })` - returns one action button **component** (`ButtonComponent`).
- `getActionToggle({ id })` - returns one toggle action **component** (`ToggleComponent`).
- `getGroupLabel({ groupId })` - returns the group label **locator** for a `groupDefinitions` group.

---

### `DurationInputComponent`

Use `DurationInputComponent` for LX duration inputs.

**Component selector (data-component):** `lx-duration-input`

**Available methods:**

- `getRoot()` - returns the duration input component root **locator**.
- `getInput(name)` - returns one duration input by name, based on current component variant. _Async_.
  - If `variant = 'default'`:
    - If `name = 'single-value'` - returns text input **component** (`TextInputComponent`).
    - If `name = 'single-unit'` - returns value picker **component** (`ValuePickerComponent`).
  - If `variant = 'hours'`:
    - If `name = 'hours'`, `name = 'minutes'` - returns the corresponding field **locator**.
  - If `variant = 'days'`:
    - If `name = 'days'`, `name = 'hours'`, `name = 'minutes'` - returns the corresponding field **locator**.
  - If `variant = 'months'`:
    - If `name = 'months'`, `name = 'days'`, `name = 'hours'`, `name = 'minutes'` - returns the corresponding field **locator**.
- `getReadOnlyData()` - returns the read-only data **locator**. _Async_.
- `getInvalidationMessage()` - returns the invalidation message **locator**.

---

### `ExpanderComponent`

Use `ExpanderComponent` for LX expanders.

**Component selector (data-component):** `lx-expander`

**Available methods:**

- `getRoot()` - returns the expander component root **locator**.
- `getHeader()` - returns the expander header **locator**.
- `getBody()` - returns the expandable body **locator**.
- `getLabel()` - returns the expander label **locator**.
- `getDescription()` - returns the expander description **locator**.
- `getChevronIcon()` - returns the chevron icon **component** (`IconComponent`).
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `getBadge()` - returns the badge **component** (`BadgeComponent`).

---

### `FileUploaderComponent`

Use `FileUploaderComponent` for LX file uploaders.

**Component selector (data-component):** `lx-file-uploader`

The details modal is rendered outside the component root, so `getDetailsModal()` looks it up at
page level through the component id.

**Available methods:**

- `getRoot()` - returns the file uploader component root **locator**.
- `getComponentId()` - returns the component id, read from `data-id` when the wrapper was created without one. _Async_.
- `getInput()` - returns the hidden file input **locator** (for `setInputFiles`). Not available for `readOnly`. _Async_.
- `getUploadButton()` - returns the upload button **component** (`ButtonComponent`), which opens the file chooser. _Async_.
- `getDropZone()` - returns the drop zone **locator**, which receives the drag-and-drop events. It is not focusable, use `getUploadButton()` for click and keyboard interaction. _Async_.
- `getItemsWrapper()` - returns the uploaded files list **locator**.
- `getItems()` - returns a **locator** matching every uploaded file item.
- `getItem({ id, n })` - returns one uploaded file item **wrapper** by file id or zero-based index. _Async_.
  - `getRoot()` - returns the item root **locator**.
  - `getName()` - returns the file name **locator**.
  - `getMeta()` - returns the file meta **locator**:
    - If `mode = 'default'` - one entry per value (size, extension, extra info).
    - If `mode = 'compact'` - one joined text.
  - `getRemoveButton()` - returns the remove button **component** (`ButtonComponent`).
  - `getInfoButton()` - returns the details button **component** (`ButtonComponent`).
  - `getDownloadButton()` - returns the download trigger **locator** (with `hasDownloadButton`).
  - `getInvalidationMessage()` - returns the item invalidation message **locator**.
- `getToolbar()` - returns the list toolbar **component** (`ToolbarComponent`), which holds the search when `hasSearch` is on.
- `getEmptyState()` - returns the empty list state **locator**.
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `getDetailsModal()` - returns the file details modal **wrapper**. _Async_.
  - `getRoot()` - returns the modal root **locator**.
  - `getCloseButton()` - returns the modal close button **component** (`ButtonComponent`).

---

### `IconComponent`

Use `IconComponent` for LX icons.

**Component selector (data-component):** `lx-icon`

**Available methods:**

- `getRoot()` - returns the icon component root **locator**.

---

### `InfoBoxComponent`

Use `InfoBoxComponent` for LX info boxes.

**Component selector (data-component):** `lx-info-box`

**Available methods:**

- `getRoot()` - returns the info box component root **locator**.
- `getTitle()` - returns the info box title **locator**.
- `getDescription()` - returns the info box description **locator**.
- `getIcon()` - returns the info box icon **component** (`IconComponent`).
- `getButton()` - returns the action button **component** (`ButtonComponent`).

---

### `InfoWrapperComponent`

Use `InfoWrapperComponent` for LX info wrappers.

**Component selector (data-component):** `lx-info-wrapper`

**Available methods:**

- `getRoot()` - returns the info wrapper component root **locator**.
- `getTrigger()` - returns the trigger/content area **locator**.
- `getDescriptionId()` - returns the computed description id string (`${id}-description`).
- `getPopper()` - returns the active popper container **locator** for this info wrapper.
- `getPanel()` - returns the currently visible panel **locator** inside popper.
- `getPanelData()` - returns the panel text/data **locator**.
- `getTooltip()` - returns the tooltip body **locator** inside popper.
- `getArrow()` - returns the popper arrow **locator**.
- `getFieldWrapper()` - returns the popper field wrapper **locator**.
- `getCloseButton()` - returns the panel close button **component** (`ButtonComponent`).
- `getHandleIcon()` - returns the panel handle icon **component** (`IconComponent`).

---

### `LoaderComponent`

Use `LoaderComponent` for LX loaders.

**Component selector (data-component):** `lx-loader`

**Available methods:**

- `getRoot()` - returns the loader component root **locator**.
- `getTrack()` - returns the loader track **locator**.
- `getIndicator()` - returns the loader indicator **locator**.
- `getPrimaryText()` - returns the primary text **locator**.
- `getSecondaryText()` - returns the secondary text **locator**.
- `getStateIcon()` - returns the state icon **component** (`IconComponent`).

---

### `MarkdownTextAreaComponent`

Use `MarkdownTextAreaComponent` for LX markdown text areas.

**Component selector (data-component):** `lx-markdown-text-area`

**Available methods:**

- `getRoot()` - returns the markdown text area component root **locator**.
- `getWrapper()` - returns the editable markdown wrapper **locator** (absent in read-only mode).
- `getComplexInput()` - returns the complex input container **locator** (holds the toolbar and the editor).
- `getInputWrapper()` - returns the input wrapper **locator**.
- `getToolbar()` - returns the embedded toolbar **component** (`ToolbarComponent`).
- `getEditor()` - returns the editor container **locator** (carries the `rows` driven min height).
- `getEditorContent()` - returns the tiptap editor root **locator**.
- `getEditorPlaceholder()` - returns the empty first paragraph **locator** that renders the placeholder through its `::before`.
- `getInvalidationIconWrapper()` - returns the invalidation icon wrapper **locator**.
- `getInvalidationIcon()` - returns the invalidation icon **component** (`IconComponent`).
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `getHelperText()` - returns the inline helperText **locator** (`helperTextKind="label"`).
- `getHelperIconWrapper()` - returns the helperText info wrapper **locator** (`helperTextKind="icon"`).
- `getHelperIcon()` - returns the helperText info icon **component** (`IconComponent`) (`helperTextKind="icon"`).
- `getFooter()` - returns the input footer **locator** (holds the invalidation message / helperText and the counter).
- `getMaxLengthCounter()` - returns the character max length counter **locator**.
- `getColorPickerButton()` - returns the color picker toolbar button **component** (`ButtonComponent`).
- `getPlaceholderPickerButton()` - returns the placeholder picker toolbar button **component** (`ButtonComponent`).
- `getReadOnlyData()` - returns the read-only rich text **locator**. _Async_.

---

### `NumberInputComponent`

Use `NumberInputComponent` for LX number inputs.

**Component selector (data-component):** `lx-number-input`

The number input renders as a slider or as a stepper, with or without a text input,
but you ask for the same things either way — the component reads its own state and
returns whatever the current kind renders.

**Available methods:**

- `getRoot()` - returns the number input component root **locator**.
- `getWrapper()` - returns the wrapper **locator** of the current kind (slider or stepper). _Async_.
- `getInput()` - returns the input that carries the value. _Async_.
  - If `kind = 'slider'` - returns the range input **locator**.
  - If `kind = 'stepper'`:
    - If `hasInput = true` - returns the text input **locator**.
    - If `hasInput = false` - returns the spinbutton **locator**.
- `getTextInputContainer()` - returns the container **locator** around the text input. Not guarded by `hasInput`, so you can assert that it is hidden or missing. _Async_.
- `getTextInput()` - returns the text input **component** (`TextInputComponent`). _Async_.
- `getReadOnlyData()` - returns the read-only data **locator**. _Async_.
- `getRange()` - returns the slider's `{ value, min, max }`. _Async_.
- `getSliderContainer()` - returns the slider container **locator**. _Async_.
- `getTrack()` - returns the full slider track **locator**. _Async_.
- `getFilledTrack()` - returns the filled part **locator** of the slider track. _Async_.
- `getUnfilledTrack()` - returns the unfilled part **locator** of the slider track. _Async_.
- `getRangeLabels()` - returns the min and max label **locator**. _Async_.
- `getDecreaseButton()` - returns the stepper's decrease button **locator**. _Async_.
- `getIncreaseButton()` - returns the stepper's increase button **locator**. _Async_.
- `getStatus()` - returns the live region **locator**. _Async_.

**Not available for every kind:** the tracks, the range labels and the range belong to the
slider, the buttons to the stepper. Asking for one on the other kind throws
a clear error like `Filled track is not available for kind: stepper, readOnly: false`.

---

### `StateDisplayComponent`

Use `StateDisplayComponent` for LX state displays.

**Component selector (data-component):** `lx-state-display`

**Available methods:**

- `getRoot()` - returns the state display component root **locator**.
- `getLabel()` - returns the state label **locator**.
- `getIcon()` - returns the state icon **component** (`IconComponent`), for every `displayShape`.

---

### `StepsComponent`

Use `StepsComponent` for LX steps.

**Component selector (data-component):** `lx-steps`

**Available methods:**

- `getRoot()` - returns the steps component root **locator**.
- `getItem({ id })` - returns one step item **wrapper** by item id.
  - `getRoot()` - returns the step item root **locator**.
  - `getLabel()` - returns the step label **locator**.
  - `getDescription()` - returns the step description **locator**.
  - `getIcon()` - returns the step icon **component** (`IconComponent`).
  - `getLoader()` - returns the step loader **component** (`LoaderComponent`).
- `getSlider()` - returns the steps slider **locator**.
- `getFilledSlider()` - returns the filled slider **locator**.
- `getFullSlider()` - returns the full slider **locator**.

---

### `RadioButtonComponent`

Use `RadioButtonComponent` for LX radio buttons.

**Component selector (data-component):** `lx-radio-button`

**Available methods:**

- `getRoot()` - returns the radio button component root **locator**.
- `getInput()` - returns the underlying radio input **locator**.
- `getLabelWrapper()` - returns the radio button label wrapper **locator**.
- `getLabel()` - returns the visible radio button label **locator**.
- `getAppearance()` - returns the visual radio button control **locator**.
- `getThumb()` - returns the radio button thumb **locator**.

---

### `TextAreaComponent`

Use `TextAreaComponent` for LX text areas.

**Component selector (data-component):** `lx-text-area`

**Available methods:**

- `getRoot()` - returns the text area component root **locator**.
- `getTextArea()` - returns the underlying text area **locator**.
- `getInvalidationIconWrapper()` - returns the invalidation icon wrapper **locator**.
- `getInvalidationIcon()` - returns the invalidation icon **component** (`IconComponent`).
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `getHelperText()` - returns the inline helperText **locator** (`helperTextKind="label"`).
- `getHelperIconWrapper()` - returns the helperText info wrapper **locator** (`helperTextKind="icon"`).
- `getHelperIcon()` - returns the helperText info icon **component** (`IconComponent`) (`helperTextKind="icon"`).
- `getReadOnlyData()` - returns the read-only data **locator**. _Async_.
- `getMaxLengthCounter()` - returns the character max length counter **locator**.

---

### `TextInputComponent`

Use `TextInputComponent` for LX text inputs.

**Component selector (data-component):** `lx-text-input`

**Available methods:**

- `getRoot()` - returns the text input component root **locator**.
- `getInputWrapper()` - returns the text input wrapper **locator**.
- `getInput()` - returns the underlying input **locator**.
- `getSearchIcon()` - returns the search modifier icon **component** (`IconComponent`) (`kind="search"`).
- `getFlagWrapper()` - returns the input flag wrapper **locator**.
- `getInvalidationIconWrapper()` - returns the invalidation icon wrapper **locator**.
- `getInvalidationIcon()` - returns the invalidation icon **component** (`IconComponent`).
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `getHelperText()` - returns the inline helperText **locator** (`helperTextKind="label"`).
- `getHelperIconWrapper()` - returns the helperText info wrapper **locator** (`helperTextKind="icon"`).
- `getHelperIcon()` - returns the helperText info icon **component** (`IconComponent`) (`helperTextKind="icon"`).
- `getReadOnlyData()` - returns the read-only data **locator**. _Async_.
- `getPasswordToggleButton()` - returns the show/hide password toggle button **component** (`ButtonComponent`) for password kind text inputs. _Async_.

---

### `ToggleComponent`

Use `ToggleComponent` for LX toggles.

**Component selector (data-component):** `lx-toggle`

**Available methods:**

- `getRoot()` - returns the toggle component root **locator**.
- `getAppearance()` - returns the toggle appearance **locator**.
- `getThumb()` - returns the toggle thumb **locator**.
- `getLabelWrapper()` - returns the toggle label wrapper **locator**.
- `getText()` - returns the toggle text **locator**.
- `getInvalidationIcon()` - returns the invalidation icon **component** (`IconComponent`).
- `getInvalidationMessage()` - returns the invalidation message **locator**.

---

### `ToolbarComponent`

Use `ToolbarComponent` for LX toolbars.

**Component selector (data-component):** `lx-toolbar`

**Available methods:**

- `getRoot()` - returns the toolbar component root **locator**.
- `getButton(id)` - returns the button **component** (`ButtonComponent`).
- `getToggle(id)` - returns the toggle **component** (`ToggleComponent`).
- `getSearchWrapper()` - returns search **wrapper** for the current toolbar search mode. _Async_.
  - `getRoot()` - returns the search wrapper root **locator**.
  - `getInput()` - returns the search field **component** (`AutoCompleteComponent`).
  - `getClearButton()` - returns the search field clear button **component** (`ButtonComponent`).
  - `getExpandButton()` - returns the expand button **component** (`ButtonComponent`).

---

### `ValuePickerComponent`

Use `ValuePickerComponent` for LX value pickers.

**Component selector (data-component):** `lx-value-picker`

**Available methods:**

- `getRoot()` - returns the value picker component root **locator**.
- `getItem({ id, n })` - returns one value picker item **wrapper** by item id or zero-based index. _Async_.
  - `getRoot()` - returns the item root **locator**.
  - `getContainer()` - returns a variant-specific item container:
    - If `variant = 'default'`, `variant = 'default-custom'`:
      - If `selectionKind = 'single'` - returns radio button **component** (`RadioButtonComponent`).
      - If `selectionKind = 'multiple'` - returns checkbox **component** (`CheckboxComponent`).
    - If `variant = 'horizontal'`, `variant = 'horizontal-custom'` - returns object with `getRoot()`, `getLabelWrapper()`, `getLabel()`, `getIconWrapper()`, `getIcon()`.
    - If `variant = 'indicator'` - returns object with `getRoot()`, `getIcon()`.
    - If `variant = 'tags'`, `variant = 'tags-custom'` - returns object with `getRoot()`.
    - If `variant = 'tiles'`, `variant = 'tiles-custom'` - returns object with `getRoot()`, `getHeader()`, `getName()`, `getIcon()`, `getDescription()`.
  - `getIcon()` - returns item icon **component** (`IconComponent`) for icon-capable variants (`horizontal*`, `indicator`, `tiles*`).
- `getItemsWrapper()` - returns the items **wrapper**. _Async_.
  - `getRoot()` - returns the items wrapper root **locator**.
  - `getItem({ id, n })` - see `getItem({ id, n })` above (except this is _not async_).
- `getToolbar()` - returns the toolbar **component** (`ToolbarComponent`) for supported variants (`default*`, `horizontal*`, `indicator`, `tags*`, `tiles*`). _Async_.
- `getReadOnlyData()` - returns the read-only data **locator**. _Async_.
