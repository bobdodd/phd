# Paradise Analyzer Roadmap: Current vs Planned Capability

**Date:** January 16, 2026
**Purpose:** Bridge the gap between current 10 issue types and planned 35+ issue types

---

## Executive Summary

**Current State:** 7 analyzers detecting **10 unique issue types**
**Documented Potential:** DETECTED_ISSUES.md lists **35+ issue types**
**Gap:** **25+ analyzers need to be implemented**

This roadmap outlines what needs to be built to achieve the full detection capability described in DETECTED_ISSUES.md.

---

## Current Implementation (✅ COMPLETE)

### Implemented Analyzers: 7

| Analyzer | Issues Detected | Status |
|----------|----------------|--------|
| MouseOnlyClickAnalyzer | mouse-only-click | ✅ Complete |
| OrphanedEventHandlerAnalyzer | orphaned-event-handler | ✅ Complete |
| MissingAriaConnectionAnalyzer | missing-aria-connection | ✅ Complete |
| FocusOrderConflictAnalyzer | positive-tabindex, duplicate-tabindex | ✅ Complete |
| VisibilityFocusConflictAnalyzer | aria-hidden-focusable, interactive-element-hidden, css-hidden-focusable | ✅ Complete |
| ReactPortalAnalyzer | react-portal-accessibility | ✅ Complete |
| ReactStopPropagationAnalyzer | react-stop-propagation | ✅ Complete |

**Total Issues Detected:** 10 unique issue types

---

## Planned Implementation (📋 NEEDED)

### Phase 1: Focus Management Analyzer (6 new issue types)

**File:** `src/analyzers/FocusManagementAnalyzer.ts`

**Issues to Detect:**

1. **`removal-without-focus-management`** (warning)
   - Element.remove() called without checking if element has focus
   - WCAG: 2.4.3, 2.4.7
   - Detection: Parse `.remove()` calls, check for `document.activeElement` guard
   - Fix: `if (element.contains(document.activeElement)) { /* move focus */ } element.remove();`

2. **`hiding-without-focus-management`** (warning)
   - Element hidden (display:none, visibility:hidden) without focus check
   - WCAG: 2.4.3, 2.4.7
   - Detection: Parse `style.display = 'none'`, `style.visibility = 'hidden'`
   - Fix: Check if element contains focus before hiding

3. **`hiding-class-without-focus-management`** (info)
   - classList.remove() may hide element without focus check
   - WCAG: 2.4.7
   - Detection: Parse `classList.add/remove()`, requires CSS analysis
   - Fix: Check if class affects visibility

4. **`possibly-non-focusable`** (warning)
   - .focus() called on element that may not be focusable
   - WCAG: 2.4.3, 4.1.2
   - Detection: Parse `.focus()` on non-interactive elements without tabindex
   - Fix: `element.setAttribute('tabindex', '0'); element.focus();`

5. **`standalone-blur`** (info)
   - .blur() called without focus management
   - WCAG: 2.4.7
   - Detection: Parse `.blur()` without subsequent `.focus()` call
   - Fix: Move focus to specific element instead of blurring

6. **`focus-restoration-missing`** (warning) - NEW
   - Modal/dialog closed without restoring focus
   - WCAG: 2.4.3
   - Detection: Look for modal close without previousActiveElement pattern
   - Fix: Store `previousActiveElement` and restore on close

**Implementation Complexity:** MEDIUM (3-4 weeks)
- Requires tracking control flow to detect missing patterns
- Need to understand if element is interactive
- CSS integration needed for visibility detection

---

### Phase 2: Keyboard Navigation Analyzer (7 new issue types)

**File:** `src/analyzers/KeyboardNavigationAnalyzer.ts`

**Issues to Detect:**

1. **`potential-keyboard-trap`** (warning)
   - Focus may become trapped (Tab intercepted without Escape)
   - WCAG: 2.1.2
   - Detection: Parse Tab key preventDefault without Escape handler
   - Fix: Add Escape key handler or proper focus cycling

2. **`screen-reader-conflict`** (warning)
   - Single-character shortcut conflicts with screen reader navigation
   - Keys: h, b, k, t, l, f, g, d, e, r, i, m, n, p, q, s, x, c, v, z, o, a, u, 1-6
   - WCAG: 2.1.4
   - Detection: Parse keydown handlers checking single letters
   - Fix: Require modifier keys (Ctrl/Alt/Shift) or allow remapping

3. **`screen-reader-arrow-conflict`** (info)
   - Arrow key handling may interfere with screen reader browse mode
   - WCAG: 2.1.4
   - Detection: Parse arrow key handlers on document/body
   - Fix: Use role="application" or only handle in focus mode

4. **`deprecated-keycode`** (info)
   - Using event.keyCode or event.which instead of event.key
   - WCAG: 4.1.2 (future-proofing)
   - Detection: Parse `event.keyCode` or `event.which`
   - Fix: Replace with `event.key`

5. **`tab-without-shift`** (info)
   - Tab key checked without Shift key consideration
   - May miss backward navigation
   - Detection: Parse `event.key === 'Tab'` without `event.shiftKey` check
   - Fix: `if (event.key === 'Tab' && !event.shiftKey)`

6. **`missing-escape-handler`** (warning) - NEW
   - Modal/dialog without Escape key close
   - WCAG: 2.1.1
   - Detection: Look for modal/dialog role without Escape handler
   - Fix: Add keydown handler for Escape

7. **`missing-arrow-navigation`** (info) - NEW
   - ARIA widget without arrow key navigation
   - For: listbox, menu, tree, grid, tablist
   - Detection: Check role against expected keyboard patterns
   - Fix: Implement arrow key handlers per ARIA pattern

**Implementation Complexity:** MEDIUM-HIGH (4-5 weeks)
- Requires understanding keyboard event patterns
- Need to map ARIA roles to expected keyboard behavior
- Must track modifier key usage

---

### Phase 3: ARIA Semantic Analyzer (8 new issue types)

**File:** `src/analyzers/ARIASemanticAnalyzer.ts`

**Issues to Detect:**

1. **`invalid-role`** (error)
   - Using a role that doesn't exist in ARIA spec
   - WCAG: 4.1.2
   - Detection: Parse `role` attributes, validate against ARIA 1.2 spec
   - Fix: Suggest correct role or remove

2. **`interactive-role-static`** (warning)
   - Interactive role (button, link, etc.) without event handler
   - WCAG: 2.1.1, 4.1.2
   - Detection: Parse interactive roles without click/keyboard handlers
   - Fix: Add event handlers or use non-interactive role

3. **`aria-expanded-static`** (info)
   - aria-expanded set but never updated dynamically
   - May confuse screen reader users
   - Detection: Find `aria-expanded` without subsequent updates
   - Fix: Add dynamic updates in event handlers

4. **`dialog-missing-label`** (warning)
   - Dialog without aria-label or aria-labelledby
   - WCAG: 4.1.2, 2.5.3
   - Detection: Parse `role="dialog"` without labeling
   - Fix: Add `aria-labelledby` pointing to title

5. **`missing-required-aria`** (warning)
   - Role requires specific ARIA attributes that are missing
   - Examples:
     - checkbox needs aria-checked
     - combobox needs aria-controls, aria-expanded
     - slider needs aria-valuenow, aria-valuemin, aria-valuemax
   - WCAG: 4.1.2
   - Detection: Map roles to required attributes, check presence
   - Fix: Add missing required attributes

6. **`assertive-live-region`** (info)
   - aria-live="assertive" should be used sparingly
   - Interrupts screen reader immediately
   - WCAG: 4.1.3
   - Detection: Find `aria-live="assertive"`
   - Fix: Recommend `aria-live="polite"` unless urgent

7. **`aria-hidden-true`** (info)
   - Setting aria-hidden="true" removes content from accessibility tree
   - May hide important content
   - Detection: Find `aria-hidden="true"` on interactive elements
   - Fix: Ensure content is truly decorative

8. **`aria-label-overuse`** (info) - NEW
   - aria-label overriding visible label text
   - Creates confusion when different from visual
   - Detection: Find `aria-label` with different content than visible text
   - Fix: Use visible text or aria-labelledby

**Implementation Complexity:** MEDIUM (3-4 weeks)
- Requires ARIA 1.2 role/attribute specification database
- Need to validate attribute combinations
- Must check for dynamic updates in code

---

### Phase 4: Widget Pattern Validator (21 ARIA patterns)

**File:** `src/analyzers/WidgetPatternAnalyzer.ts`

**Comprehensive ARIA Pattern Detection:**

This analyzer validates complete implementation of WAI-ARIA Authoring Practices patterns.

**Patterns to Validate:**

1. **`incomplete-tabs-pattern`**
   - Required structure:
     - Container with role="tablist"
     - Children with role="tab" (aria-selected, aria-controls)
     - Panels with role="tabpanel" (aria-labelledby)
   - Required keyboard:
     - Arrow keys navigate tabs
     - Home/End jump to first/last
     - Tab enters panel content
   - Detection: Look for tab-like structure, validate completeness

2. **`incomplete-dialog-pattern`**
   - Required structure:
     - role="dialog" or role="alertdialog"
     - aria-modal="true"
     - aria-labelledby or aria-label
   - Required keyboard:
     - Focus trap (Tab cycles within)
     - Escape closes
     - Focus restoration on close
   - Detection: Look for dialog structure, validate behavior

3. **`incomplete-accordion-pattern`**
   - Required structure:
     - Button headers with aria-expanded
     - aria-controls linking header to panel
     - Unique IDs for panels
   - Required keyboard:
     - Enter/Space toggles
     - Optional: Up/Down navigate sections
   - Detection: Look for expandable sections pattern

4. **`incomplete-combobox-pattern`**
   - Required structure:
     - Input with role="combobox"
     - aria-expanded, aria-controls, aria-autocomplete
     - Listbox with role="listbox", options with role="option"
     - aria-activedescendant on combobox
   - Required keyboard:
     - Arrow keys navigate options
     - Enter selects
     - Escape closes
   - Detection: Look for input + dropdown pattern

5. **`incomplete-menu-pattern`**
   - Required structure:
     - Container with role="menu"
     - Items with role="menuitem"
     - Submenus with role="menu" (nested)
   - Required keyboard:
     - Arrow keys navigate
     - Enter activates
     - Escape closes
   - Detection: Look for menu structure

6. **`incomplete-tree-pattern`**
   - Required structure:
     - Container with role="tree"
     - Items with role="treeitem"
     - Groups with role="group"
     - aria-expanded on parent nodes
   - Required keyboard:
     - Up/Down navigate items
     - Right expands, Left collapses
     - Home/End jump
   - Detection: Look for hierarchical list structure

7. **`incomplete-toolbar-pattern`**
   - Required structure:
     - Container with role="toolbar"
     - Roving tabindex pattern (one item tabindex="0", others "-1")
   - Required keyboard:
     - Arrow keys navigate
     - Home/End jump
   - Detection: Look for button group with toolbar semantics

8-21. **Additional patterns:**
   - Grid pattern (role="grid")
   - Listbox pattern (role="listbox")
   - Radiogroup pattern (role="radiogroup")
   - Slider pattern (role="slider")
   - Spinbutton pattern (role="spinbutton")
   - Switch pattern (role="switch")
   - Breadcrumb pattern (role="navigation")
   - Feed pattern (role="feed")
   - Disclosure pattern (aria-expanded on non-button)
   - Carousel pattern (rotation + manual control)
   - Link pattern (role="link" on non-<a>)
   - Meter pattern (role="meter")
   - Progressbar pattern (role="progressbar")
   - Tooltip pattern (role="tooltip")

**Implementation Complexity:** HIGH (6-8 weeks)
- Requires deep understanding of all ARIA patterns
- Must validate complete implementation (structure + behavior)
- Need to check keyboard handling per pattern
- Large test suite required

---

### Phase 5: Event Pattern Analyzer (foundation for others)

**File:** `src/analyzers/EventPatternAnalyzer.ts`

**Purpose:** Foundation analyzer that provides data to other analyzers

**Patterns to Extract (not flagged as issues):**

1. **Click handlers**
   - addEventListener('click')
   - onclick attribute
   - jQuery $.click(), $.on('click')
   - React onClick

2. **Keyboard handlers**
   - addEventListener('keydown/keyup/keypress')
   - onkeydown/onkeyup/onkeypress attributes
   - jQuery keyboard events
   - React onKeyDown/onKeyUp/onKeyPress

3. **Focus handlers**
   - addEventListener('focus/blur/focusin/focusout')
   - onfocus/onblur attributes
   - jQuery focus events
   - React onFocus/onBlur

4. **Mouse handlers**
   - mouseenter, mouseleave, mouseover, mouseout, mousemove
   - Used to detect hover-only interactions

5. **Touch handlers**
   - touchstart, touchend, touchmove
   - Used to detect mobile-only interactions

**Implementation Complexity:** LOW-MEDIUM (2 weeks)
- Extends existing ActionLanguage parser
- Provides structured data for other analyzers
- Already partially implemented in ReactPatternDetector

---

## Implementation Priority Recommendation

### High Priority (Immediate Value)

1. **Keyboard Navigation Analyzer** (Phase 2)
   - **Why:** Addresses most common accessibility failures
   - **Impact:** 7 new critical issue types (keyboard traps, screen reader conflicts)
   - **Effort:** 4-5 weeks
   - **Dependencies:** Event Pattern Analyzer

2. **ARIA Semantic Analyzer** (Phase 3)
   - **Why:** Catches semantic misuse early
   - **Impact:** 8 new issue types (invalid roles, missing attributes)
   - **Effort:** 3-4 weeks
   - **Dependencies:** None (uses existing DOM parsing)

3. **Focus Management Analyzer** (Phase 1)
   - **Why:** Prevents lost focus issues
   - **Impact:** 6 new issue types (removal, hiding without focus management)
   - **Effort:** 3-4 weeks
   - **Dependencies:** Requires CSS integration

### Medium Priority (Comprehensive Coverage)

4. **Widget Pattern Validator** (Phase 4)
   - **Why:** Ensures complete ARIA widget implementations
   - **Impact:** 21 pattern validations
   - **Effort:** 6-8 weeks
   - **Dependencies:** ARIA Semantic Analyzer, Keyboard Navigation Analyzer

5. **Event Pattern Analyzer** (Phase 5)
   - **Why:** Foundation for other analyzers
   - **Impact:** Improves accuracy of existing analyzers
   - **Effort:** 2 weeks
   - **Dependencies:** None

---

## Revised Timeline to 35+ Issue Detection

| Phase | Weeks | Issues Added | Cumulative Total |
|-------|-------|--------------|------------------|
| **Current** | 0 | 10 | 10 |
| **Phase 5: Event Pattern Analyzer** | 2 | 0 (foundation) | 10 |
| **Phase 2: Keyboard Navigation** | 4-5 | 7 | 17 |
| **Phase 3: ARIA Semantic** | 3-4 | 8 | 25 |
| **Phase 1: Focus Management** | 3-4 | 6 | 31 |
| **Phase 4: Widget Patterns** | 6-8 | 21 | 52 |
| **Total** | **18-23 weeks** | **42 new** | **52 total** |

**Note:** Final count (52) exceeds DETECTED_ISSUES.md (35) because we've identified additional patterns during implementation.

---

## Comparison: Plan vs Current Reality

### What DETECTED_ISSUES.md Promised

```
Focus Management Issues: 6 types
Keyboard Navigation Issues: 7 types
ARIA Issues: 8 types
Widget Pattern Issues: 21 patterns
---
Total: 42 issue types
```

### What Currently Exists

```
Mouse/Keyboard: 1 type (mouse-only-click)
Code Integrity: 1 type (orphaned-event-handler)
ARIA Relationships: 1 type (missing-aria-connection)
Focus Management: 2 types (positive-tabindex, duplicate-tabindex)
Visibility Conflicts: 3 types (aria-hidden-focusable, etc.)
React-Specific: 2 types (portal, stopPropagation)
---
Total: 10 issue types
```

### The Gap

**Missing:** 32 issue types from DETECTED_ISSUES.md specification
**Additional:** React-specific analyzers (not in original spec)

---

## Resources Needed

### Development Resources

- **5 new analyzer files** (~1,500-2,000 lines each)
- **ARIA 1.2 specification database** (roles, required attributes, patterns)
- **Keyboard pattern specifications** (per ARIA widget type)
- **100+ new unit tests** (20 tests per analyzer minimum)
- **50+ integration tests** (cross-analyzer validation)

### Documentation Needed

- **32 new help documentation files** (200-400 lines each)
- **Testing guide** for each issue type
- **Fix examples** for each pattern
- **WCAG mappings** for all new issues

### External Dependencies

- None (all detectable from source code analysis)
- Optional: CSS specificity calculator for better visibility detection

---

## Success Metrics

### Coverage Goals

- **52 unique issue types** detected (exceeds original 35+ goal)
- **4 WCAG 2.1 principles** covered (Perceivable, Operable, Understandable, Robust)
- **15+ success criteria** mapped
- **21 ARIA widget patterns** validated

### Quality Goals

- **Zero false positives** (confidence scoring system)
- **>90% test coverage** for all analyzers
- **<100ms analysis time** per file
- **100% help documentation** coverage

### User Goals

- **Immediate feedback** during development
- **Actionable fixes** with code examples
- **Educational value** (teach accessibility patterns)
- **Production-ready** suggestions

---

## Next Steps

1. **Immediate (Sprint 5 completion):**
   - ✅ Current 7 analyzers complete
   - ✅ Documentation complete for existing issues
   - ⏳ Update website/marketing to reflect "10 issue types, 42 more planned"

2. **Sprint 6 (2 weeks):**
   - Implement Event Pattern Analyzer (foundation)
   - Begin Keyboard Navigation Analyzer

3. **Sprint 7-8 (8 weeks):**
   - Complete Keyboard Navigation Analyzer
   - Complete ARIA Semantic Analyzer
   - Complete Focus Management Analyzer
   - **Milestone: 31 issue types detected**

4. **Sprint 9-11 (8 weeks):**
   - Implement Widget Pattern Validator
   - **Milestone: 52 issue types detected**

---

## Conclusion

Paradise currently detects **10 unique issue types** with 7 analyzers. The DETECTED_ISSUES.md document describes a vision for **35+ issue types** requiring **5 additional major analyzers** and **18-23 weeks of development**.

The current implementation is **production-ready** and provides **immediate value** for React developers. The roadmap provides a clear path to comprehensive WCAG 2.1 coverage.

**Recommendation:** Market Paradise as:
- **Current:** "Detects 10 critical accessibility issues in React applications"
- **Roadmap:** "Expanding to 50+ issue types covering complete WCAG 2.1 compliance"

This sets realistic expectations while showcasing the vision.

---

**Document Version:** 1.0
**Last Updated:** January 16, 2026
**Next Review:** After Sprint 5 completion
