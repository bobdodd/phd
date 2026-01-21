# All Detectable Accessibility Issues

⚠️ **NOTE:** This document is outdated. For the complete, up-to-date list of all 35 analyzers and 100+ issue types, see **[COMPLETE_ANALYZER_LIST.md](./COMPLETE_ANALYZER_LIST.md)**.

This legacy document lists early accessibility issues from the initial prototype. It covers only ~10 analyzers from Phase 1.

## Focus Management Issues (FocusAnalyzer)

### Critical Issues
- **`removal-without-focus-management`** (warning)
  - Element.remove() called without checking if element has focus
  - WCAG: 2.4.3, 2.4.7
  - Fix: Check document.activeElement before removing

- **`hiding-without-focus-management`** (warning)
  - Element hidden (display:none, visibility:hidden) without focus check
  - WCAG: 2.4.3, 2.4.7
  - Fix: Move focus before hiding

- **`hiding-class-without-focus-management`** (info)
  - classList.remove() may hide element without focus check
  - WCAG: 2.4.7
  - Fix: Check if class affects visibility

### Focus Order Issues
- **`positive-tabindex`** (warning)
  - tabIndex > 0 disrupts natural tab order
  - WCAG: 2.4.3
  - Fix: Use tabindex="0" or "-1"

- **`possibly-non-focusable`** (warning)
  - .focus() called on element that may not be focusable
  - WCAG: 2.4.3, 4.1.2
  - Fix: Add tabindex="0" or use focusable element

- **`standalone-blur`** (info)
  - .blur() called without focus management
  - WCAG: 2.4.7
  - Fix: Move focus to specific element instead

## Keyboard Navigation Issues (KeyboardAnalyzer)

### Mouse-Only Interactions
- **`mouse-only-click`** (warning)
  - Click handler without keyboard equivalent (Enter/Space)
  - WCAG: 2.1.1
  - Fix: Add keydown handler for Enter and Space

### Keyboard Traps
- **`potential-keyboard-trap`** (warning)
  - Focus may become trapped (Tab intercepted without Escape)
  - WCAG: 2.1.2
  - Fix: Provide Escape key exit or proper focus cycling

### Screen Reader Conflicts
- **`screen-reader-conflict`** (warning)
  - Single-character shortcut conflicts with screen reader quick navigation
  - Keys: h, b, k, t, l, f, g, d, e, r, i, m, n, p, q, s, x, c, v, z, o, a, u, 1-6
  - WCAG: 2.1.4
  - Fix: Use modifier keys (Ctrl, Alt, Shift) or allow remapping

- **`screen-reader-arrow-conflict`** (info)
  - Arrow key handling may interfere with screen reader browse mode
  - WCAG: 2.1.4
  - Fix: Use role="application" or only handle in focus mode

### Deprecated APIs
- **`deprecated-keycode`** (info)
  - Using event.keyCode or event.which instead of event.key
  - WCAG: 4.1.2
  - Fix: Use event.key (modern standard)

- **`tab-without-shift`** (info)
  - Tab key checked without Shift key consideration
  - May miss backward navigation
  - Fix: Check event.shiftKey for direction

## ARIA Issues (ARIAAnalyzer)

### Invalid Roles
- **`invalid-role`** (error)
  - Using a role that doesn't exist in ARIA spec
  - WCAG: 4.1.2
  - Fix: Use valid ARIA 1.2 role

### Interactive Role Issues
- **`interactive-role-static`** (warning)
  - Interactive role (button, link, etc.) without event handler
  - WCAG: 2.1.1, 4.1.2
  - Fix: Add click/keyboard handlers or use non-interactive role

### ARIA State Management
- **`aria-expanded-static`** (info)
  - aria-expanded set but never updated dynamically
  - May confuse screen reader users
  - Fix: Update aria-expanded in event handlers

### Labeling Issues
- **`dialog-missing-label`** (warning)
  - Dialog without aria-label or aria-labelledby
  - WCAG: 4.1.2, 2.5.3
  - Fix: Add aria-labelledby pointing to dialog title

- **`missing-required-aria`** (warning)
  - Role requires specific ARIA attributes that are missing
  - Examples:
    - checkbox needs aria-checked
    - combobox needs aria-controls, aria-expanded
    - slider needs aria-valuenow, aria-valuemin, aria-valuemax
  - WCAG: 4.1.2
  - Fix: Add all required attributes for the role

### Live Region Issues
- **`assertive-live-region`** (info)
  - aria-live="assertive" should be used sparingly
  - Interrupts screen reader immediately
  - WCAG: 4.1.3
  - Fix: Use aria-live="polite" unless truly urgent

- **`aria-hidden-true`** (info)
  - Setting aria-hidden="true" removes content from accessibility tree
  - May hide important content
  - Fix: Ensure content is truly decorative

## Widget Pattern Issues (WidgetPatternValidator)

The validator checks for 21 WAI-ARIA widget patterns. Common issues include:

- **`incomplete-tabs-pattern`**
  - Missing: role="tablist", role="tab", role="tabpanel"
  - Missing: aria-selected, aria-controls, aria-labelledby
  - Missing: Arrow key navigation, Home/End support

- **`incomplete-dialog-pattern`**
  - Missing: role="dialog", aria-modal="true"
  - Missing: aria-labelledby or aria-label
  - Missing: Focus trap, Escape to close, focus restoration

- **`incomplete-accordion-pattern`**
  - Missing: Button headers with aria-expanded
  - Missing: aria-controls linking header to panel
  - Missing: Keyboard navigation between sections

- **`incomplete-combobox-pattern`**
  - Missing: role="combobox", aria-expanded, aria-controls
  - Missing: Arrow key navigation in listbox
  - Missing: aria-activedescendant tracking

- **`incomplete-menu-pattern`**
  - Missing: role="menu", role="menuitem"
  - Missing: Arrow key navigation
  - Missing: Escape to close, focus management

- **`incomplete-tree-pattern`**
  - Missing: role="tree", role="treeitem", role="group"
  - Missing: aria-expanded on parent nodes
  - Missing: Arrow key navigation (Right/Left to expand/collapse, Up/Down to navigate)

- **`incomplete-toolbar-pattern`**
  - Missing: role="toolbar"
  - Missing: Roving tabindex pattern
  - Missing: Arrow key navigation, Home/End support

## Event Handler Patterns (EventAnalyzer)

The EventAnalyzer detects but doesn't flag as issues - it provides data for other analyzers:
- Click handlers (used by KeyboardAnalyzer to find mouse-only patterns)
- Keyboard handlers (keydown, keyup, keypress)
- Focus handlers (focus, blur, focusin, focusout)
- Mouse handlers (mouseenter, mouseleave, mouseover, etc.)
- jQuery event patterns ($.on, $.click, etc.)

## Coverage by Demo Page

| Demo Page | Issues Demonstrated |
|-----------|---------------------|
| **buttons.html** | mouse-only-click, interactive-role-static, possibly-non-focusable |
| **forms.html** | missing-required-aria (for required fields), dialog-missing-label |
| **navigation.html** | mouse-only-click, screen-reader-conflict (if single keys used) |
| **tabs.html** | incomplete-tabs-pattern, aria-expanded-static, mouse-only-click |
| **modals.html** | incomplete-dialog-pattern, potential-keyboard-trap, removal-without-focus-management |
| **disclosure.html** | incomplete-accordion-pattern, aria-expanded-static |
| **keyboard-shortcuts.html** | screen-reader-conflict, screen-reader-arrow-conflict, deprecated-keycode |
| **focus-management.html** | removal-without-focus-management, hiding-without-focus-management, positive-tabindex, standalone-blur |
| **aria-live.html** | assertive-live-region, aria-hidden-true, missing-required-aria |
| **complex-widgets.html** | incomplete-combobox-pattern, incomplete-tree-pattern, incomplete-toolbar-pattern, invalid-role, missing-required-aria |

## Missing Examples

These issues need explicit examples added:
- [ ] `possibly-non-focusable` - Call .focus() on span without tabindex
- [ ] `invalid-role` - Use role="banana" or other made-up role
- [ ] `deprecated-keycode` - Use event.keyCode instead of event.key
- [ ] `tab-without-shift` - Check for Tab without checking Shift
- [ ] `aria-hidden-true` - Hide important content with aria-hidden
- [ ] `interactive-role-static` - Add role="button" without click handler

## Testing Checklist

To verify all issues are detectable:

1. Run analyzer on each demo page's inaccessible version
2. Verify expected issues appear in results
3. Check severity levels match documentation
4. Verify WCAG mappings are correct
5. Test "Apply Fix" feature for each issue type
6. Confirm fix suggestions are helpful
