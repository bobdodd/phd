# Complete Issue Coverage in Demo Files

This document shows WHERE each detectable accessibility issue is demonstrated in the demo project.

## Summary Statistics

- **Total Issue Types**: 35+ (includes 10 new Phase 1-3 enhancements)
- **Demo Pages**: 11 (added phase-enhancements.js)
- **Coverage**: 100% (all issue types have examples)

---

## Issue Coverage by Type

### Focus Management Issues (6 types)

| Issue Type | Severity | Demo File | Line/Location |
|------------|----------|-----------|---------------|
| `removal-without-focus-management` | warning | [focus.js (bad)](js/inaccessible/focus.js) | Line 41, 58 |
| `hiding-without-focus-management` | warning | [focus.js (bad)](js/inaccessible/focus.js) | Line 85 |
| `hiding-class-without-focus-management` | info | [focus.js (bad)](js/inaccessible/focus.js) | Line 214-216 |
| `positive-tabindex` | warning | [focus.js (bad)](js/inaccessible/focus.js) | Line 140-142, 156 |
| `standalone-blur` | info | [focus.js (bad)](js/inaccessible/focus.js) | Line 181 |
| `possibly-non-focusable` | warning | [complex.js (bad)](js/inaccessible/complex.js) | Line 148 |

### Keyboard Navigation Issues (9 types) ✨ 3 NEW

| Issue Type | Severity | Demo File | Line/Location |
|------------|----------|-----------|---------------|
| `mouse-only-click` | warning | [button.js (bad)](js/inaccessible/button.js) | Multiple |
| `mouse-only-click` | warning | [navigation.js (bad)](js/inaccessible/navigation.js) | Line 67-80 |
| `mouse-only-click` | warning | [complex.js (bad)](js/inaccessible/complex.js) | Line 135 |
| `potential-keyboard-trap` | warning | [modal.js (bad)](js/inaccessible/modal.js) | Missing Escape key |
| `screen-reader-conflict` | warning | [shortcuts.js (bad)](js/inaccessible/shortcuts.js) | Line 64-85 |
| `screen-reader-arrow-conflict` | info | [shortcuts.js (bad)](js/inaccessible/shortcuts.js) | Line 88-96 |
| `deprecated-keycode` | info | [complex.js (bad)](js/inaccessible/complex.js) | Line 170, 175, 291 |
| `tab-without-shift` | info | [complex.js (bad)](js/inaccessible/complex.js) | Line 175 |
| ✨ `missing-escape-handler` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 18-37 |
| ✨ `incomplete-activation-keys` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 51-66 |
| ✨ `touch-without-click` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 77-98 |

### ARIA Issues (10 types) ✨ 4 NEW

| Issue Type | Severity | Demo File | Line/Location |
|------------|----------|-----------|---------------|
| `invalid-role` | error | [complex.js (bad)](js/inaccessible/complex.js) | Line 35 (role="banana") |
| `interactive-role-static` | warning | [complex.js (bad)](js/inaccessible/complex.js) | Line 49 |
| `missing-required-aria` | warning | [complex.js (bad)](js/inaccessible/complex.js) | Line 35 (slider without values) |
| `aria-hidden-true` | info | [complex.js (bad)](js/inaccessible/complex.js) | Line 306 |
| `aria-expanded-static` | info | [accordion.js (bad)](js/inaccessible/accordion.js) | Set but never updated |
| `dialog-missing-label` | warning | [modal.js (bad)](js/inaccessible/modal.js) | Dialog without aria-label |
| `assertive-live-region` | info | Multiple files | Overuse of assertive |
| ✨ `static-aria-state` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 109-135 |
| ✨ `aria-reference-not-found` | info | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 147-153 |
| ✨ `missing-live-region` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 163-177 |

### Widget Pattern Issues (6 types)

| Issue Type | Severity | Demo File | Description |
|------------|----------|-----------|-------------|
| `incomplete-dialog-pattern` | varies | [modal.js (bad)](js/inaccessible/modal.js) | Missing focus trap, Escape, restoration |
| `incomplete-tabs-pattern` | varies | [tabs.js (bad)](js/inaccessible/tabs.js) | Missing arrow navigation, ARIA |
| `incomplete-accordion-pattern` | varies | [accordion.js (bad)](js/inaccessible/accordion.js) | Missing keyboard nav, ARIA |
| `incomplete-combobox-pattern` | varies | [complex.js (bad)](js/inaccessible/complex.js) | Missing ARIA, keyboard nav |
| `incomplete-tree-pattern` | varies | [complex.js (bad)](js/inaccessible/complex.js) | Missing roles, keyboard nav |
| `incomplete-toolbar-pattern` | varies | [complex.js (bad)](js/inaccessible/complex.js) | Missing roving tabindex |

### ✨ Context Change Issues (2 types) NEW

| Issue Type | Severity | Demo File | Line/Location |
|------------|----------|-----------|---------------|
| ✨ `unexpected-form-submit` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 194-210 |
| ✨ `unexpected-navigation` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 221-260 |

### ✨ Timing Issues (2 types) NEW

| Issue Type | Severity | Demo File | Line/Location |
|------------|----------|-----------|---------------|
| ✨ `unannounced-timeout` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 271-285 |
| ✨ `uncontrolled-auto-update` | warning | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 296-334 |

### ✨ Semantic HTML Issues (2 types) NEW

| Issue Type | Severity | Demo File | Line/Location |
|------------|----------|-----------|---------------|
| ✨ `non-semantic-button` | info | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 350-370 |
| ✨ `non-semantic-link` | info | [phase-enhancements.js (bad)](js/inaccessible/phase-enhancements.js) | Line 380-385 |

---

## Detailed File Breakdown

### 1. buttons.html → [button.js](js/inaccessible/button.js)
**Issues Demonstrated:**
- ✅ `mouse-only-click` - Div with click handler, no keyboard support
- ✅ `interactive-role-static` - Element with role="button" but no handler

**WCAG Criteria:** 2.1.1, 4.1.2

---

### 2. forms.html → [form.js](js/inaccessible/form.js)
**Issues Demonstrated:**
- ✅ `missing-required-aria` - Required fields without aria-required
- ✅ Basic form validation issues

**WCAG Criteria:** 3.3.2, 4.1.2

---

### 3. navigation.html → [navigation.js](js/inaccessible/navigation.js)
**Issues Demonstrated:**
- ✅ `mouse-only-click` - Click-only nav items
- ✅ Hover-only dropdown (no click/keyboard)
- ✅ Non-semantic HTML (divs instead of nav)

**WCAG Criteria:** 2.1.1, 2.4.1, 4.1.2

---

### 4. tabs.html → [tabs.js](js/inaccessible/tabs.js)
**Issues Demonstrated:**
- ✅ `incomplete-tabs-pattern` - Missing arrow key navigation
- ✅ `mouse-only-click` - Click-only tab switching
- ✅ Missing ARIA: aria-selected, aria-controls, aria-labelledby

**WCAG Criteria:** 2.1.1, 4.1.2

---

### 5. modals.html → [modal.js](js/inaccessible/modal.js)
**Issues Demonstrated:**
- ✅ `incomplete-dialog-pattern` - Missing focus trap
- ✅ `potential-keyboard-trap` - No Escape key
- ✅ `removal-without-focus-management` - No focus restoration
- ✅ `dialog-missing-label` - No aria-label/labelledby

**WCAG Criteria:** 2.1.2, 2.4.3, 4.1.2

---

### 6. disclosure.html → [accordion.js](js/inaccessible/accordion.js)
**Issues Demonstrated:**
- ✅ `incomplete-accordion-pattern` - Missing keyboard nav
- ✅ `aria-expanded-static` - aria-expanded never updated
- ✅ `mouse-only-click` - Click-only expand/collapse

**WCAG Criteria:** 2.1.1, 4.1.2

---

### 7. keyboard-shortcuts.html → [shortcuts.js](js/inaccessible/shortcuts.js)
**Issues Demonstrated:**
- ✅ `screen-reader-conflict` - Single keys: h, b, k, t
- ✅ `screen-reader-arrow-conflict` - Arrow key conflicts
- ✅ No way to disable shortcuts

**WCAG Criteria:** 2.1.4

---

### 8. focus-management.html → [focus.js](js/inaccessible/focus.js)
**Issues Demonstrated:**
- ✅ `removal-without-focus-management` - remove() without check
- ✅ `hiding-without-focus-management` - display:none without check
- ✅ `hiding-class-without-focus-management` - classList hide
- ✅ `positive-tabindex` - tabindex="1", "2", "3"
- ✅ `standalone-blur` - .blur() without focus management

**WCAG Criteria:** 2.4.3, 2.4.7

---

### 9. aria-live.html → [live.js](js/inaccessible/live.js)
**Issues Demonstrated:**
- ✅ `assertive-live-region` - aria-live="assertive" overuse
- ✅ Missing aria-atomic
- ✅ Incorrect aria-relevant values

**WCAG Criteria:** 4.1.3

---

### 10. complex-widgets.html → [complex.js](js/inaccessible/complex.js)
**Issues Demonstrated (MOST COMPREHENSIVE):**
- ✅ `invalid-role` - role="banana" (non-existent role)
- ✅ `missing-required-aria` - slider without aria-valuenow/min/max
- ✅ `interactive-role-static` - role="button" without handler
- ✅ `possibly-non-focusable` - .focus() on element without tabindex
- ✅ `deprecated-keycode` - event.keyCode and event.which
- ✅ `tab-without-shift` - Tab check without Shift consideration
- ✅ `aria-hidden-true` - Setting aria-hidden on interactive content
- ✅ `incomplete-combobox-pattern` - Missing ARIA and keyboard nav
- ✅ `incomplete-tree-pattern` - Missing roles and arrow navigation
- ✅ `incomplete-toolbar-pattern` - Missing roving tabindex
- ✅ `mouse-only-click` - Click-only widgets

**WCAG Criteria:** 2.1.1, 2.1.2, 2.1.4, 2.4.3, 4.1.2

---

## Testing Instructions

### Test Individual Issues

1. **Open VSCode**
   ```bash
   code "/Users/bob3/Desktop/phd/Action Language"
   ```

2. **Open a demo file**
   ```
   Open: app/demo/js/inaccessible/complex.js
   ```

3. **Verify issues appear**
   - Yellow squiggles should appear on problematic lines
   - Hover to see issue details
   - Click "Apply Fix" to test remediation

### Test with CLI

```bash
cd "/Users/bob3/Desktop/phd/Action Language/app"

# Test single file
node src/cli/index.js demo/js/inaccessible/complex.js

# Test all inaccessible demos
for file in demo/js/inaccessible/*.js; do
  echo "Analyzing: $file"
  node src/cli/index.js "$file"
  echo "---"
done
```

### Expected Results

Each inaccessible demo file should produce:
- Multiple accessibility warnings/errors
- Correct issue type identification
- Proper WCAG 2.1 criterion mapping
- Helpful fix suggestions
- Accurate line numbers

---

## Issue Type Reference

### 11. ✨ NEW: Phase 1-3 Enhancements → [phase-enhancements.js](js/inaccessible/phase-enhancements.js)

**Issues Demonstrated:**
- ✅ `missing-escape-handler` - Focus trap without Escape key exit
- ✅ `incomplete-activation-keys` - Button with Enter but no Space, or vice versa
- ✅ `touch-without-click` - Touch events without click fallback
- ✅ `static-aria-state` - aria-pressed/checked/expanded set once, never updated
- ✅ `aria-reference-not-found` - aria-labelledby pointing to non-existent ID
- ✅ `missing-live-region` - Dynamic content updates without aria-live
- ✅ `unexpected-form-submit` - Form submission on input/change events
- ✅ `unexpected-navigation` - Navigation on input/change/focus events
- ✅ `unannounced-timeout` - setTimeout with navigation/major changes, no warning
- ✅ `uncontrolled-auto-update` - setInterval without clearInterval
- ✅ `non-semantic-button` - div/span with click handler or role="button"
- ✅ `non-semantic-link` - element with role="link"

**WCAG Criteria:** 2.1.1, 2.1.2, 2.2.1, 2.2.2, 2.5.2, 3.2.1, 3.2.2, 4.1.2, 4.1.3

**Accessible Fixes:** See [phase-enhancements.js (accessible)](js/accessible/phase-enhancements.js)

---

### By Severity

**Errors (1):**
- `invalid-role` - Non-existent ARIA role

**Warnings (19):** ✨ +10 NEW
- `removal-without-focus-management`
- `hiding-without-focus-management`
- `positive-tabindex`
- `possibly-non-focusable`
- `mouse-only-click`
- `potential-keyboard-trap`
- `screen-reader-conflict`
- `interactive-role-static`
- `missing-required-aria`
- `dialog-missing-label`
- ✨ `missing-escape-handler` NEW
- ✨ `incomplete-activation-keys` NEW
- ✨ `touch-without-click` NEW
- ✨ `static-aria-state` NEW
- ✨ `missing-live-region` NEW
- ✨ `unexpected-form-submit` NEW
- ✨ `unexpected-navigation` NEW
- ✨ `unannounced-timeout` NEW
- ✨ `uncontrolled-auto-update` NEW

**Info (15):** ✨ +3 NEW
- `hiding-class-without-focus-management`
- `standalone-blur`
- `screen-reader-arrow-conflict`
- `deprecated-keycode`
- `tab-without-shift`
- `aria-hidden-true`
- `aria-expanded-static`
- `assertive-live-region`
- ✨ `aria-reference-not-found` NEW
- ✨ `non-semantic-button` NEW
- ✨ `non-semantic-link` NEW
- Widget pattern issues (various)

---

## Coverage Verification Checklist

- [x] All 35+ issue types have examples ✨ UPDATED
- [x] Each issue maps to WCAG criterion
- [x] Examples use realistic code patterns
- [x] Both HTML and JS issues covered
- [x] Single-issue and multi-issue examples
- [x] All severity levels represented
- [x] Comments explain what's wrong
- [x] Files are runnable demos
- [x] Issues are intentional violations
- [x] Examples are educational
- [x] ✨ Phase 1-3 enhancements fully documented

## Next Steps

1. Run analyzer on all demos to verify detection
2. Test "Apply Fix" feature on each issue type
3. Update documentation with any missing patterns
4. Add more edge cases if needed
5. Create automated test suite to ensure all issues detected
