# membr-fullcalendar — agent notes

Fork of FullCalendar 2.0.3 maintained by Xplor/Membr. Adds custom template hooks
for the bookings calendar. Upstream: https://github.com/arshaw/fullcalendar (v2.0.3 tag).

## Build

**Must be run from your own terminal** — the Cursor agent shell cannot write
to `dist/` (sandbox restriction on repos outside the primary workspace).

```bash
./node_modules/.bin/grunt lumbar:build
```

Output: `dist/fullcalendar.js` (and `.css`, `gcal.js`). Lumbar concatenates
`src/**/*.js` in the order defined in `lumbar.json`.

After building, copy to the frontend:

```bash
cp dist/fullcalendar.js ../frontend/vendor/fullcalendar/dist/
```

## Tests

The Karma test runner is broken (`grunt-karma` 0.8.3 + socket.io 0.9 crash on
Node 6+). Run karma directly, bypassing grunt:

```bash
nvm use 5   # socket.io 0.9 crashes on Node 6+ — needs Node 4 or 5
./node_modules/.bin/karma start build/karma.conf.js --single-run --browsers ChromeHeadless
```

`dist/lang-all.js` must exist (stub is fine):

```bash
echo "// stub" > dist/lang-all.js
```

Automated tests live in `tests/automated/*.js`.

## Custom hooks added (Membr fork)

All four hooks follow the same pattern: function or per-view hash, resolved via
`smartProperty`. Per-view hash is preferred so month/agenda can differ.

### `eventContent`

**File:** `src/agenda/AgendaEventRenderer.js` → `getSlotSegInnerHtml()`  
**File:** `src/common/DayEventRenderer.js` → `getDaySegInnerHtml()`

```javascript
// Signature
eventContent(fcEvent, seg, view, htmlEscape) → HTML string

// Config
eventContent: {
    agendaWeek: fn,
    agendaDay:  fn,
    month:      fn   // DayEventRenderer path
}
```

Returns the full `.fc-event-inner` HTML. Empty string or falsy → FC default.  
FC outer wrapper, `.fc-event-bg`, and resize handle are always FC's.

### `eventOuterAttributes`

**File:** `src/agenda/AgendaEventRenderer.js` → `slotSegHtml()`  
**File:** `src/common/DayEventRenderer.js` → `buildHTMLForSegment()`  
**Helper:** `DayEventRenderer.buildEventExtraAttrs()` — shared, exported via `t`.


```javascript
// Signature
eventOuterAttributes(fcEvent, seg, view) → object

// Config
eventOuterAttributes: {
    agendaWeek: fn,
    agendaDay:  fn,
    month:      fn
}
```

Return object keys become HTML attributes on `.fc-event`. `class` key is merged
with FC's own classes (draggable, start/end, etc). All other values are
`htmlEscape`d. Null/undefined values are skipped.

```javascript
// Example
return {
    id: 'event' + event.id,
    'data-custom': 'true',
    'class': event.allDay ? 'is-allday' : null  // null values are skipped
};
```

### `columnHeaderContent`

**File:** `src/agenda/AgendaView.js` → `getColumnHeaderHtml()`

```javascript
// Signature
columnHeaderContent(date, colIndex, view, htmlEscape) → HTML string

// Config
columnHeaderContent: {
    agendaWeek: fn,
    agendaDay:  fn
}
```

### `headerSectionRender`

**File:** `src/Header.js` → `invokeHeaderSectionRender()`

```javascript
// Signature
headerSectionRender(position, sectionEl, calendar) → void (DOM mutation)

// Config
headerSectionRender: {
    agendaWeek: fn,
    month:      fn
}
```

`position` is `'left'`, `'center'`, or `'right'`.

## Source layout (relevant files only)

```
src/
  defaults.js                  — all hook defaults (null = built-in)
  common/
    DayEventRenderer.js        — month/basicWeek/basicDay event HTML
  agenda/
    AgendaEventRenderer.js     — agendaWeek/agendaDay timed slot HTML
    AgendaView.js              — column header HTML
  Header.js                    — calendar header sections
tests/automated/
  event-content.js             — eventContent agenda tests
  event-content-month.js       — eventContent month tests
  event-outer-attributes.js    — eventOuterAttributes tests
  column-header-content.js     — columnHeaderContent tests
  header-section-render.js     — headerSectionRender tests
```

## angular-ui-calendar gotcha

`angular-ui-calendar` wraps all top-level config functions in `$timeout`.
Hooks that must return a value synchronously (`eventContent`,
`eventOuterAttributes`) must be passed as **per-view object hashes**, not bare
functions, so angular-ui-calendar doesn't wrap them.

```javascript
// Wrong — gets $timeout-wrapped, returns undefined synchronously
eventContent: buildMyTemplate

// Correct — plain object at top level, fns inside are not wrapped
eventContent: {
    agendaWeek: buildMyTemplate,
    agendaDay:  buildMyTemplate
}
```

Side-effect-only callbacks (`eventAfterRender`, `viewRender`, etc.) are fine as
bare functions because their return value is ignored.

## Adding a new hook

1. Add a `null` default in `src/defaults.js` (per-view hash or plain null).
2. Call `opt('yourHook')`, check `$.isFunction()`, call and use the result.
3. If the hook is on the outer element, add it to `buildEventExtraAttrs` or
   follow the `eventOuterAttributes` pattern.
4. Write tests in `tests/automated/your-hook.js`.

