# Analyzer Architecture

This document explains how the different analyzers work together.

## Analyzer Overview

### 1. EventAnalyzer (Data Collection)
**Purpose:** Collects event handler registrations without flagging issues.

**What it detects:**
- `addEventListener` calls
- Property assignments (`element.onclick = handler`)
- `setAttribute('onclick', ...)` calls
- jQuery `.on()` and shorthand methods (`.click()`, `.focus()`, etc.)
- React JSX event handlers (`onClick`, `onKeyDown`, etc.)
- `removeEventListener` calls

**Output:**
```javascript
{
  handlers: [
    {
      type: 'addEventListener',
      elementRef: '#my-button',
      eventType: 'click',
      handler: { ... },
      location: { line: 42, column: 5 }
    }
  ],
  stats: {
    totalHandlers: 10,
    byEventType: { click: 5, keydown: 3, focus: 2 },
    byElement: { '#my-button': 2, '.nav-item': 3 }
  }
}
```

**Does NOT create issues** - just provides data for other analyzers.

---

### 2. KeyboardAnalyzer (Uses EventAnalyzer Data)
**Purpose:** Detects keyboard accessibility issues.

**What it does:**
1. Gets event handler data from EventAnalyzer
2. Analyzes keyboard patterns
3. **Creates issues** for accessibility violations

**Issues it creates:**
- `mouse-only-click` - Click handler without keyboard equivalent (Enter/Space)
  - Uses EventAnalyzer data to find elements with click but no keydown/keypress
- `potential-keyboard-trap` - Tab intercepted without Escape
- `screen-reader-conflict` - Single-letter shortcuts conflict with SR navigation
- `screen-reader-arrow-conflict` - Arrow key handling interferes with browse mode
- `deprecated-keycode` - Using event.keyCode instead of event.key
- `tab-without-shift` - Tab check without Shift consideration

**How mouse-only-click works:**
```javascript
// KeyboardAnalyzer checks:
const elementsWithClick = handlers.filter(h => h.eventType === 'click')
const elementsWithKeyboard = handlers.filter(h =>
  ['keydown', 'keypress'].includes(h.eventType)
)

// For each element with click:
if (hasClick && !hasKeyboard && !hasKeyboardAttribute) {
  issues.push({ type: 'mouse-only-click', ... })
}
```

---

### 3. FocusAnalyzer
**Purpose:** Detects focus management issues.

**What it detects:**
- `.focus()` and `.blur()` calls
- `tabIndex` manipulation
- `document.activeElement` access
- Element removal (`element.remove()`, `removeChild`)
- Element hiding (`display:none`, `visibility:hidden`, `hidden` attribute)
- `classList` operations that may hide elements

**Issues it creates:**
- `removal-without-focus-management`
- `hiding-without-focus-management`
- `hiding-class-without-focus-management`
- `positive-tabindex`
- `standalone-blur`
- `possibly-non-focusable`

---

### 4. ARIAAnalyzer
**Purpose:** Detects ARIA usage issues.

**What it detects:**
- ARIA attribute changes (`aria-*` attributes)
- `role` attribute changes
- ARIA property assignments
- Widget patterns (dialogs, tabs, menus, etc.)
- Live region patterns

**Issues it creates:**
- `invalid-role` - Non-existent ARIA role
- `interactive-role-static` - Interactive role without handler
- `missing-required-aria` - Role missing required attributes
- `aria-hidden-true` - Hiding important content
- `aria-expanded-static` - aria-expanded set but never updated
- `dialog-missing-label` - Dialog without accessible name
- `assertive-live-region` - Overuse of aria-live="assertive"

---

### 5. WidgetPatternValidator (Uses Multiple Analyzers)
**Purpose:** Validates complete WAI-ARIA widget patterns.

**What it validates:**
21 WAI-ARIA patterns including:
- Button, Link, Checkbox, Radio, Switch
- Dialog, Alert Dialog
- Tabs, Accordion, Disclosure
- Menu, Menubar
- Combobox, Listbox
- Tree, Treegrid
- Toolbar
- Tooltip
- Feed
- And more...

**How it works:**
1. Gets data from KeyboardAnalyzer (keyboard handlers)
2. Gets data from ARIAAnalyzer (roles, ARIA attributes)
3. Gets data from FocusAnalyzer (focus management)
4. Validates if pattern is complete

**Issues it creates:**
- `incomplete-{pattern}-pattern` for each incomplete pattern
- Specific sub-issues for missing pieces

---

### 6. AccessibilityReporter (Orchestrator)
**Purpose:** Runs all analyzers and combines results.

**What it does:**
1. Runs EventAnalyzer (collects handlers)
2. Runs FocusAnalyzer (detects focus issues)
3. Runs ARIAAnalyzer (detects ARIA issues)
4. Runs KeyboardAnalyzer (detects keyboard issues, uses EventAnalyzer data)
5. Runs WidgetPatternValidator (validates patterns, uses all analyzer data)
6. Compiles all issues
7. Maps issues to WCAG 2.1 criteria
8. Calculates accessibility scores
9. Generates recommendations

**Output:**
```javascript
{
  scores: { keyboard: 75, aria: 80, focus: 70, widgets: 85, overall: 77 },
  grade: 'C',
  issues: [ ... ],
  wcagCompliance: { ... },
  recommendations: [ ... ],
  statistics: { ... }
}
```

---

## Data Flow

```
JavaScript Code
     ↓
ActionTree (AST representation)
     ↓
┌────────────────────────────────────────┐
│  EventAnalyzer                         │
│  Collects: handlers, by type, by elem │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│  KeyboardAnalyzer                      │
│  Uses: EventAnalyzer data             │
│  Creates: keyboard issues              │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│  FocusAnalyzer                         │
│  Analyzes: focus operations            │
│  Creates: focus issues                 │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│  ARIAAnalyzer                          │
│  Analyzes: ARIA usage                  │
│  Creates: ARIA issues                  │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│  WidgetPatternValidator                │
│  Uses: ALL analyzer data               │
│  Creates: pattern issues               │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│  AccessibilityReporter                 │
│  Combines: all issues                  │
│  Outputs: comprehensive report         │
└────────────────────────────────────────┘
```

---

## Missing Features (TODO)

### EventAnalyzer.accessibilityPatterns
The AccessibilityReporter expects EventAnalyzer to provide `accessibilityPatterns` array with patterns like `click-without-keyboard`, but this is currently **not implemented** in EventAnalyzer.

**Current workaround:** KeyboardAnalyzer handles this by using EventAnalyzer's handler data.

**Should we implement it?**
- No - keep EventAnalyzer as pure data collection
- KeyboardAnalyzer is the right place for accessibility analysis

---

## Example Usage

```javascript
const { parseAndTransform } = require('./parser');
const AccessibilityReporter = require('./analyzer/AccessibilityReporter');

const code = `
  const button = document.getElementById('btn');
  button.addEventListener('click', () => {
    console.log('clicked');
  });
`;

const tree = parseAndTransform(code);
const reporter = new AccessibilityReporter();
const results = reporter.analyze(tree);

console.log(results.issues);
// [
//   {
//     type: 'mouse-only-click',
//     severity: 'warning',
//     message: 'Click handler without keyboard equivalent',
//     ...
//   }
// ]
```

---

## Design Principles

1. **Separation of Concerns**
   - EventAnalyzer: Data collection only
   - Other analyzers: Issue detection
   - Reporter: Orchestration and reporting

2. **Composability**
   - Each analyzer can be used standalone
   - WidgetPatternValidator builds on other analyzers
   - Reporter combines everything

3. **Extensibility**
   - Easy to add new analyzers
   - Easy to add new issue types
   - Easy to add new widget patterns

4. **Accuracy**
   - Minimal false positives
   - Clear fix suggestions
   - Correct WCAG mappings
