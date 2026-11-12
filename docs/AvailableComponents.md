## Available Components

Components covered by the test utils:

- `AppendableListComponent`
- `AutoCompleteComponent`
- `BadgeComponent`
- `ButtonComponent`
- `CameraComponent`
- `CardComponent`
- `ChatComponent`
- `CheckboxComponent`
- `ContentSwitcherComponent`
- `DateTimePickerComponent`
- `DateTimeRangeComponent`
- `DropDownMenuComponent`
- `DurationInputComponent`
- `EmptyStateComponent`
- `ExpanderComponent`
- `FileUploaderComponent`
- `IconComponent`
- `InfoBoxComponent`
- `InfoWrapperComponent`
- `ListComponent`
- `LoaderComponent`
- `MarkdownTextAreaComponent`
- `NumberInputComponent`
- `RadioButtonComponent`
- `SkipLinkComponent`
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

### `BadgeComponent`

Use `BadgeComponent` for LX badges.

**Component selector (data-component):** `lx-badge`

**Available methods:**

- `getRoot()` - returns the badge component root **locator**.
- `getText()` - returns the badge text **locator**.
- `getIcon()` - returns the badge icon **component** (`IconComponent`).

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

### `CameraComponent`

Use `CameraComponent` for LX cameras.

**Component selector (data-component):** `lx-camera`

The camera needs a video device and camera permission. In Playwright, grant the `camera` permission
and launch Chromium with `--use-fake-ui-for-media-stream` and `--use-fake-device-for-media-stream`.
Without access, the camera shows the error state.

**Available methods:**

- `getRoot()` - returns the camera component root **locator**.
- `getComponentId()` - returns the component id, read from `data-id` when the wrapper was created without one. _Async_.
- `getFrame()` - returns the camera frame **locator** (carries `lx-disabled` while the stream is starting).
- `getVideo()` - returns the live video **locator**, shown while there is no photo.
- `getPhoto()` - returns the taken photo **locator** (`img`).
- `getLoader()` - returns the loader **component** (`LoaderComponent`), shown while the stream is starting.
- `getToolbar()` - returns the toolbar **component** (`ToolbarComponent`), shown while there is no photo. _Async_.
- `getSwitchCameraButton()` - returns the switch camera button **component** (`ButtonComponent`). Only for `cameraSwitcherMode = 'toggle'`, with more than one camera. _Async_.
- `getCameraMenu()` - returns the camera list **component** (`DropDownMenuComponent`), with one `camera-<deviceId>` action per camera. Only for `cameraSwitcherMode = 'list'`, with more than one camera. _Async_.
- `getFlashlightToggle()` - returns the flashlight toggle **component** (`ToggleComponent`). Only for `hasFlashlightToggle`, when the camera supports a torch. _Async_.
- `getTakePhotoButton()` - returns the take photo button **component** (`ButtonComponent`), shown while there is no photo. _Async_.
- `getDeletePhotoButton()` - returns the delete photo button **component** (`ButtonComponent`), shown while there is a photo. _Async_.
- `getErrorState()` - returns the error **component** (`EmptyStateComponent`), shown without camera access, with the `refresh` action.
- `getHelperText()` - returns the inline helperText **locator** (`helperTextKind="label"`).
- `getHelperIconWrapper()` - returns the helperText info wrapper **locator** (`helperTextKind="icon"`).
- `getHelperIcon()` - returns the helperText info icon **component** (`IconComponent`) (`helperTextKind="icon"`).

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

### `ChatComponent`

Use `ChatComponent` for LX chats.

**Component selector (data-component):** `lx-chat`

Messages are looked up by the message id (the `items` entry `id`). The chat layout follows its own
width, not the viewport: `size = 'l'` above 900px, `'m'` below.

**Available methods:**

- `getRoot()` - returns the chat component root **locator**.
- `getComponentId()` - returns the component id, read from `data-id` when the wrapper was created without one. _Async_.
- `getMessages()` - returns a **locator** matching every message.
- `getMessage({ id, n })` - returns one message **wrapper** by message id or zero-based index. _Async_.
  - `getId()` - returns the message id.
  - `getRoot()` - returns the message root **locator**.
  - `getUserGroup()` - returns the **locator** of the group the message is in (messages of one user and day, carries `lx-chat-user-me` and `lx-chat-user-ai`).
  - `getHeader()` - returns the person header **locator** (name and time), shown at the start of a group or for every message without `messageGrouping`.
  - `getBadge()` - returns the header badge **component** (`BadgeComponent`), from `userDefinitions` or the default AI badge.
  - `getTime()` - returns the time label **locator**, shown instead of the header for own messages in a narrow chat and after a `messageGroupingInterval` gap.
  - `getBubble()` - returns the bubble **locator** (carries `lx-category-*` and `lx-invalid`).
  - `getText()` - returns the message text **locator** (the form prompt for a message with `schema`).
  - `getForm()` - returns the clarifying questions form **locator**, for a message with `schema` and `clarifyingQuestionsBuilder`.
  - `getFormActionButton({ id })` - returns a form action button **component** (`ButtonComponent`), by the message `actionDefinitions` id, `lx_submit_default` without them.
  - `getInvalidationIcon()` - returns the invalidation icon **component** (`IconComponent`), for an `invalid` message.
  - `getInvalidationMessage()` - returns the invalidation message **locator** (`invalidationMessage`).
  - `getActionButton({ id })` - returns a `messageActionDefinitions` button **component** (`ButtonComponent`), rendered when one action is visible.
  - `getActionsMenu()` - returns the actions **component** (`DropDownMenuComponent`), rendered when more actions are visible. _Async_.
- `getTypingIndicator()` - returns the typing indicator **wrapper**, shown while `typing` is on. _Async_.
  - `getRoot()` - returns the typing indicator root **locator**.
  - `getStatusText()` - returns the status **locator** (`typingUsers` names and the status text).
  - `getActionButton({ id })` - returns a `typingActionDefinitions` button **component** (`ButtonComponent`), rendered when one action is visible.
  - `getActionsMenu()` - returns the actions **component** (`DropDownMenuComponent`), rendered when more actions are visible. _Async_.
- `getEmptyState()` - returns the empty state **component** (`EmptyStateComponent`), shown without messages and typing.
- `getScrollDownButton()` - returns the scroll to latest messages button **component** (`ButtonComponent`), shown while the list is scrolled up. _Async_.
- `getMessageInput()` - returns the message input **component** (`TextAreaComponent`). Enter sends, Shift+Enter adds a new line. _Async_.
- `getSendButton()` - returns the send button **component** (`ButtonComponent`), disabled while the input is empty. _Async_.

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
- `getCalendarPanel()` - returns the open fullscreen calendar panel **locator**.
- `getMonthLayoutButton()` - returns the calendar month layout toggle **component** (`ButtonComponent`).
- `getYearLayoutButton()` - returns the calendar year layout toggle **component** (`ButtonComponent`).
- `getSelectedDay()` - returns the selected day **locator**.
- `getCalendarDayButton()` - returns the first calendar day button **locator**.
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `getCalendarHeader()` - returns the open calendar header **locator**.
- `getCalendarFooter()` - returns the open calendar footer **locator**.
- `getCalendarWeekday()` - returns the first calendar weekday label **locator**.
- `getCalendarDayWrapper()` - returns the first calendar day wrapper **locator**.
- `getCalendarDay()` - returns the first regular calendar day **locator** (a day in the displayed
  month that is not selected).
- `getTimePickerContainer()` - returns the calendar time picker container **locator**.
- `getTimeList()` - returns the calendar time list viewport **locator**.
- `getActiveTimeItem()` - returns the active time list item **locator**.
- `openCalendar()` - opens the calendar by pressing `ArrowDown` on the input. On touch-only devices it
  focuses the input and dispatches the `ArrowDown` keyup in the page instead. _Async_.
- `getMobileTimeButton()` - returns the mobile time selection toggle button **component** (`ButtonComponent`).

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

### `EmptyStateComponent`

Use `EmptyStateComponent` for LX empty states.

**Component selector (data-component):** `lx-empty-state`

**Available methods:**

- `getRoot()` - returns the empty state component root **locator**.
- `getIcon()` - returns the icon **component** (`IconComponent`).
- `getLabel()` - returns the label **locator**.
- `getDescription()` - returns the description **locator**.
- `getActionButton({ id })` - returns an action button **component** (`ButtonComponent`), for up to three actions.
- `getActionsMenu()` - returns the actions **component** (`DropDownMenuComponent`), for more than three actions. _Async_.

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

### `ListComponent`

Use `ListComponent` for LX lists.

**Component selector (data-component):** `lx-list`

Items are looked up by the LxListItem id (the item `idAttribute` value). A virtualized default list
(`state.virtualized`) renders only the rows around the viewport.

Treelist renders either a wide (nested) or, at `max-width: 800px`, a narrow (one level at a time)
layout, and item getters work on the rendered one. While a client search runs, it is replaced by a
flat list of matches.

**Available methods:**

- `getRoot()` - returns the list component root **locator**.
- `getComponentId()` - returns the component id, read from `data-id` when the wrapper was created without one. _Async_.
- `getItems()` - returns a **locator** matching every rendered item.
- `getItem({ id, n })` - returns one item **wrapper** by item id or zero-based index. _Async_.
  - `getId()` - returns the item id.
  - `getRoot()` - returns the item container **locator** (holds the list item and its selection control or drag handle).
  - `getContent()` - returns the list item **locator** (`.lx-list-item`, carries `role="button"` for clickable items, `lx-selected`, `lx-list-item-disabled` and `lx-category-*`).
  - `getLabel()` - returns the item name **locator**.
  - `getDescription()` - returns the item description **locator**.
  - `getSearchHighlights()` - returns a **locator** matching the parts of the label and description that match the client search string. Not rendered with the `customItem` slot.
  - `getIcon()` - returns the clickable / href item icon **component** (`IconComponent`).
  - `getLoader()` - returns the busy item loader **component** (`LoaderComponent`).
  - `getActionButton({ id })` - returns the action button **component** (`ButtonComponent`), rendered when one action is visible.
  - `getActionsMenu()` - returns the actions **component** (`DropDownMenuComponent`), rendered when more actions are visible. _Async_.
  - `getSelectionControl()` - returns the selection control (`hasSelecting`, not for `draggable`):
    - If `selectionKind = 'single'` - returns radio button **component** (`RadioButtonComponent`).
    - If `selectionKind = 'multiple'` - returns checkbox **component** (`CheckboxComponent`). Its text label is visually hidden, click `getAppearance()`.
  - `getHandle()` - returns the drag handle **locator** (focusable, arrow keys move the item). Only for `kind = 'draggable'`.
  - `getMoveMenu()` - returns the move menu **component** (`DropDownMenuComponent`) opened by right clicking the handle, with actions `move-first`, `move-up`, `move-down`, `move-last`. Only for `kind = 'draggable'`. _Async_.
  - `getExpandButton()` - returns the expand button **component** (`ButtonComponent`). Only for `kind = 'treelist'`:
    - Wide layout - expands or collapses the children in place.
    - Narrow layout - opens the children as the next level (for the opened parent, it is the back button).
  - `getReloadButton()` - returns the reload button **component** (`ButtonComponent`) shown for `itemsStates[id].invalid`. Only for `kind = 'treelist'`. The narrow layout shows it for the opened parent only.
  - `getLoadingError()` - returns the loading error text **locator** next to the reload button. Only for `kind = 'treelist'`.
- `getGroups()` - returns a **locator** matching every group expander.
- `getGroup({ id })` - returns one `groupDefinitions` group **wrapper** by group id. Not available without `groupDefinitions`. _Async_.
  - `getId()` - returns the group id.
  - `getRoot()` - returns the group expander root **locator**.
  - `getExpander()` - returns the group **component** (`ExpanderComponent`).
  - `getSelectButton()` - returns the select / clear whole group button **component** (`ButtonComponent`) (`hasSelecting`, `selectionKind = 'multiple'`).
  - `getItems()` - returns a **locator** matching every item in the group.
  - `getItem({ id, n })` - see `getItem({ id, n })` above, within the group. _Async_.
- `getToolbar()` - returns the toolbar **component** (`ToolbarComponent`). _Async_.
- `getSelectionStatus()` - returns the selected item count **locator**, shown while items are selected.
- `getSelectionActionButton({ id })` - returns a `selectionActionDefinitions` button **component** (`ButtonComponent`), shown while items are selected.
- `getSelectionActionsMenu()` - returns the selection actions **component** (`DropDownMenuComponent`) used instead of the buttons in a narrow list. _Async_.
- `getTreeBackButton()` - returns the back button **component** (`ButtonComponent`) of the opened level in the narrow treelist layout. Only for `kind = 'treelist'`. _Async_.
- `getEmptyState()` - returns the empty state **component** (`EmptyStateComponent`), shown for an empty list (with `emptyStateIcon` and `emptyStateActionDefinitions`) or, with the label only, when a client search finds nothing.
- `getLoadMoreButton()` - returns the load more button **component** (`ButtonComponent`) (`showLoadMore`).
- `getLoader()` - returns the list loader **component** (`LoaderComponent`) (`loading` without `showLoadMore`).
- `getSkipLink()` - returns the skip link **component** (`SkipLinkComponent`) (`hasSkipLink`).

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

### `SkipLinkComponent`

Use `SkipLinkComponent` for LX skip links.

**Component selector (data-component):** `lx-skip-link`

**Available methods:**

- `getRoot()` - returns the skip link component root **locator**.
- `getButton()` - returns the skip link button **component** (`ButtonComponent`). It is clipped until it gets keyboard focus.

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
- `getItem({ id, n })` - returns one value picker item **wrapper** by item id or zero-based index. Not available for `dropdown*` and `rotator*` variants, use `getDropDown()` / `getRotator()`. _Async_.
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
  - `getDescription()` - returns item description **locator** for `variant = 'default'` and `variant = 'tiles'` (custom variants render the description in the slot).
- `getInvalidationMessage()` - returns the invalidation message **locator**.
- `getHelperText()` - returns the inline helperText **locator** (`helperTextKind="label"`).
- `getHelperIconWrapper()` - returns the helperText info wrapper **locator** (`helperTextKind="icon"`).
- `getHelperIcon()` - returns the helperText info icon **component** (`IconComponent`) (`helperTextKind="icon"`).
- `getItemsWrapper()` - returns the items **wrapper**. Not available for `dropdown*` and `rotator*` variants, use `getDropDown()` / `getRotator()`. _Async_.
  - `getRoot()` - returns the items wrapper root **locator**.
  - `getItem({ id, n })` - see `getItem({ id, n })` above (except this is _not async_).
- `getToolbar()` - returns the toolbar **component** (`ToolbarComponent`) for supported variants (`default*`, `horizontal*`, `indicator`, `tags*`, `tiles*`). _Async_.
- `getDropDown()` - returns the drop down for `dropdown*` variants. Not available for `readOnly`, use `getReadOnlyData()`. _Async_.
  - If `hasSearch = true` - returns auto complete **component** (`AutoCompleteComponent`).
  - If `hasSearch = false` - returns drop down **wrapper**:
    - `getRoot()` - returns the combobox **locator** (carries `aria-expanded`).
    - `getInputWrapper()` - returns the input wrapper **locator** (carries `lx-invalid` / `lx-disabled`).
    - `getValue()` - returns the displayed value **locator** (joined names for `selectionKind = 'multiple'`).
    - `getPlaceholder()` - returns the placeholder **locator**, rendered only while nothing is selected.
    - `getChevronIcon()` - returns the chevron icon **component** (`IconComponent`).
    - `getInvalidationIcon()` - returns the invalidation icon **component** (`IconComponent`).
    - `getSelectedCount()` - returns the selected item count **locator**. Only for `selectionKind = 'multiple'`.
    - `getClearButton()` - returns the clear selection button **component** (`ButtonComponent`). Only for `selectionKind = 'multiple'`.
    - `getPopper()` - returns the open popper container **locator** inside `#poppers`.
    - `getPanel()` - returns the open listbox **locator** (`role="listbox"`) inside `#poppers`.
    - `getItems()` - returns a **locator** matching every option in the panel.
    - `getItem({ id, n })` - returns one option **wrapper** by item id or zero-based index:
      - `getRoot()` - returns the option root **locator** (carries `aria-selected`).
      - `getLabel()` - returns the option label **locator**.
      - `getCheckbox()` - returns the checkbox **component** (`CheckboxComponent`). Only for `selectionKind = 'multiple'`.
      - `getCheckmarkIcon()` - returns the selected checkmark icon **component** (`IconComponent`). Only for `selectionKind = 'single'`.
    - `getSelectAll()` - returns the select all **locator** (`hasSelectAll`). Only for `selectionKind = 'multiple'`.
    - `getEmptyState()` - returns the empty list state **locator**.
    - `open()` - opens the panel by clicking the combobox, if it is not open yet. _Async_.
    - `close()` - closes the panel by clicking the combobox, if it is open. _Async_.
    - On touch-only devices both click the combobox in the page instead of by coordinates.
- `getRotator()` - returns the rotator **wrapper** for `rotator*` variants. Not available for `readOnly`, use `getReadOnlyData()`. _Async_.
  - `getId()` - returns the value picker id (rotator items have ids `${id}-item-${itemId}`).
  - `getRoot()` - returns the rotator root **locator**.
  - `getMenu()` - returns the drop down menu **component** (`DropDownMenuComponent`) opened by right click.
  - `getInputWrapper()` - returns the input wrapper **locator** (carries `lx-invalid` / `lx-disabled`, `aria-invalid`, `aria-disabled`).
  - `getInputArea()` - returns the rotator set **locator** (`.lx-rotator-set`).
  - `getItems()` - returns a **locator** matching the previous, current and next rotator items.
  - `getCurrentItem()` - returns the visible (current) rotator item **locator**.
  - `getRotatorIcon()` - returns the rotator icon **component** (`IconComponent`).
  - `getPopper()` - returns the open menu popper container **locator** inside `#poppers`.
  - `getPanel()` - returns the open menu panel **locator** inside `#poppers`.
  - `getMenuItems()` - returns a **locator** matching every item button in the menu panel.
  - `getMenuItem({ id, n })` - returns one menu item button **component** (`ButtonComponent`) by item id or zero-based index (carries `lx-active` / `aria-pressed` when selected).
  - `rotate()` - selects the next item by clicking the rotator. _Async_.
  - `open()` - opens the menu by right clicking the rotator, if it is not open yet. _Async_.
  - `close()` - closes the menu by right clicking the rotator, if it is open. _Async_.
- `getReadOnlyData()` - returns the read-only data **locator**. _Async_.

The drop down and rotator menu panels are rendered only while open and are teleported to
`#poppers`, so call `open()` before using the panel methods.
