# Paradise Issue Types Reference

**Complete catalog of all 100+ accessibility issues detected by Paradise's 35 analyzers.**

This document provides:
- Issue type identifiers
- What the issue is and why it matters
- How Paradise detects it
- Whether it can be detected in code fragments or requires full page context

---

## Understanding Scope Requirements

### 🟢 Fragment-Safe
Can be detected in isolated HTML/CSS/JS code snippets. No full document context needed.

**Examples:**
- Missing alt text on `<img>` tag
- Click handler without keyboard equivalent
- Invalid ARIA attribute value

### 🟡 Body-Required
Requires at least `<body>` tag context to make accurate determination.

**Examples:**
- Missing `<main>` landmark (need to check all body children)
- Multiple `<h1>` elements (need document-wide count)
- Skip link validation (need to check first focusable element)

### 🔴 Full-Page Required
Requires complete `<html><head></head><body></body></html>` document structure.

**Examples:**
- Missing `lang` attribute on `<html>`
- Missing `<title>` in `<head>`
- Missing viewport meta tag in `<head>`
- CSS media query analysis (requires `<style>` or `<link>` in `<head>`)

---

## Analyzer 1: FocusManagementAnalyzer (6 issue types)

### 1. `removal-without-focus-management`
- **Severity:** Warning
- **WCAG:** 2.4.3, 2.4.7
- **What it is:** `element.remove()` called without checking if element has focus. When removed element has focus, focus is lost and moves to `<body>`, disorienting keyboard users.
- **How we detect:** Find ActionLanguage nodes with `domManipulation` type containing `remove()`, check if preceded by `document.activeElement` check or focus management.
- **Scope:** 🟢 Fragment-Safe - Can detect removal patterns in isolated code

### 2. `hidden-without-focus-management`
- **Severity:** Warning
- **WCAG:** 2.4.3, 2.4.7
- **What it is:** Element hidden (`display:none`, `visibility:hidden`, `aria-hidden="true"`) without checking if it or descendants have focus.
- **How we detect:** Find CSS changes or ARIA changes that hide elements, verify focus management logic exists.
- **Scope:** 🟢 Fragment-Safe - Can detect hiding patterns in isolated code

### 3. `disabled-without-focus-management`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** Interactive element disabled without checking if it has focus. Disabled elements cannot receive focus.
- **How we detect:** Find `disabled` attribute assignments, check for focus management.
- **Scope:** 🟢 Fragment-Safe - Can detect disable patterns in isolated code

### 4. `focus-moved-to-removed-element`
- **Severity:** Error
- **WCAG:** 2.4.3
- **What it is:** `.focus()` called on element that will be immediately removed or hidden.
- **How we detect:** Find `focus()` calls followed by removal/hiding in same execution context.
- **Scope:** 🟢 Fragment-Safe - Can detect within function/handler

### 5. `focus-on-non-interactive-without-tabindex`
- **Severity:** Warning
- **WCAG:** 2.4.3, 4.1.2
- **What it is:** `.focus()` called on non-interactive element (div, span) without `tabindex="-1"` or `tabindex="0"`.
- **How we detect:** Find `focus()` calls, check if target element is naturally focusable or has tabindex.
- **Scope:** 🟢 Fragment-Safe - Can check element attributes

### 6. `modal-without-focus-trap`
- **Severity:** Error
- **WCAG:** 2.1.2, 2.4.3
- **What it is:** Modal dialog shown without focus trap implementation. Users can tab out of modal to background.
- **How we detect:** Detect dialog/modal patterns (ARIA role, className patterns), verify focus trap logic exists.
- **Scope:** 🟢 Fragment-Safe - Can detect dialog patterns and focus trap code

---

## Analyzer 2: KeyboardNavigationAnalyzer (9 issue types)

### 7. `click-without-keyboard`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** `onclick` handler on non-interactive element without `onkeydown`/`onkeypress` handler for Enter/Space.
- **How we detect:** Find elements with click handlers, check if keyboard handlers exist for same element.
- **Scope:** 🟢 Fragment-Safe - Can check event handlers in isolation

### 8. `mousedown-without-keyboard`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** `onmousedown` without keyboard equivalent.
- **How we detect:** Find mousedown handlers without corresponding keyboard handlers.
- **Scope:** 🟢 Fragment-Safe

### 9. `hover-without-focus`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** `onmouseover`/`onmouseenter` without `onfocus` equivalent. Hover-only interactions exclude keyboard users.
- **How we detect:** Find hover handlers without focus handlers.
- **Scope:** 🟢 Fragment-Safe

### 10. `drag-without-keyboard-alternative`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** Drag and drop (`ondragstart`, `ondrop`) without keyboard alternative.
- **How we detect:** Find drag event handlers, check for keyboard-based alternative (arrow keys, button-based reordering).
- **Scope:** 🟢 Fragment-Safe

### 11. `double-click-without-alternative`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** `ondblclick` handler without single-click or keyboard alternative. Hard to replicate with keyboard.
- **How we detect:** Find `dblclick` handlers, verify alternative exists.
- **Scope:** 🟢 Fragment-Safe

### 12. `right-click-without-alternative`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** `oncontextmenu` handler without keyboard alternative. Context menus often keyboard-inaccessible.
- **How we detect:** Find `contextmenu` handlers, check for keyboard trigger.
- **Scope:** 🟢 Fragment-Safe

### 13. `character-key-shortcut-without-disable`
- **Severity:** Warning
- **WCAG:** 2.1.4
- **What it is:** Single-character keyboard shortcut (like 's' for search) without ability to disable/remap. Conflicts with screen reader commands.
- **How we detect:** Find keydown handlers checking single character keys (not Ctrl+, Alt+, etc.), verify disable mechanism.
- **Scope:** 🟢 Fragment-Safe

### 14. `scroll-event-without-keyboard-trigger`
- **Severity:** Warning
- **WCAG:** 2.1.1
- **What it is:** Important functionality triggered by scroll events, not accessible via keyboard.
- **How we detect:** Find scroll handlers with significant logic (not just animation), verify keyboard alternative.
- **Scope:** 🟢 Fragment-Safe

### 15. `gesture-without-keyboard`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** Touch gestures (swipe, pinch) without keyboard alternative.
- **How we detect:** Find touch event handlers with gesture logic, verify keyboard alternative.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 3: MissingAriaConnectionAnalyzer (3 issue types)

### 16. `aria-labelledby-references-missing`
- **Severity:** Error
- **WCAG:** 1.3.1, 4.1.2
- **What it is:** `aria-labelledby` references IDs that don't exist in document.
- **How we detect:** Parse `aria-labelledby` values, check if target IDs exist in DOM model.
- **Scope:** 🟡 Body-Required - Need to search entire document for ID references

### 17. `aria-describedby-references-missing`
- **Severity:** Error
- **WCAG:** 1.3.1, 4.1.2
- **What it is:** `aria-describedby` references non-existent IDs.
- **How we detect:** Parse `aria-describedby`, verify target IDs exist.
- **Scope:** 🟡 Body-Required - Need full document for ID lookup

### 18. `aria-controls-references-missing`
- **Severity:** Warning
- **WCAG:** 1.3.1, 4.1.2
- **What it is:** `aria-controls` references non-existent IDs. Screen readers use this to announce controlled elements.
- **How we detect:** Parse `aria-controls`, verify targets exist.
- **Scope:** 🟡 Body-Required - Need full document for ID lookup

---

## Analyzer 4: VisibilityFocusConflictAnalyzer (3 issue types)

### 19. `focusable-element-hidden`
- **Severity:** Error
- **WCAG:** 2.4.7, 4.1.2
- **What it is:** Focusable element (button, link, input) hidden with CSS (`display:none`, `visibility:hidden`) but still in tab order.
- **How we detect:** Cross-reference DOM elements with CSS visibility, check if focusable elements are hidden.
- **Scope:** 🟢 Fragment-Safe - Can check element's own CSS and attributes

### 20. `aria-hidden-on-focusable`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** `aria-hidden="true"` on focusable element. Element is keyboard-focusable but hidden from screen readers.
- **How we detect:** Find focusable elements with `aria-hidden="true"`.
- **Scope:** 🟢 Fragment-Safe - Check element attributes

### 21. `visibility-state-mismatch`
- **Severity:** Warning
- **WCAG:** 4.1.2
- **What it is:** ARIA state (expanded, pressed) doesn't match visual visibility. Example: `aria-expanded="false"` but content visible.
- **How we detect:** Check ARIA states against CSS visibility of related elements.
- **Scope:** 🟢 Fragment-Safe - Can check in local context

---

## Analyzer 5: FocusOrderConflictAnalyzer (2 issue types)

### 22. `positive-tabindex`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** `tabindex > 0` used. Creates unpredictable focus order, jumps around document.
- **How we detect:** Find elements with `tabindex` attribute where value is positive integer.
- **Scope:** 🟢 Fragment-Safe

### 23. `focus-order-conflicts-reading-order`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** Tabindex creates focus order that conflicts with visual/reading order. Confuses users.
- **How we detect:** Compare tabindex values with DOM order, flag when jumping backwards or skipping.
- **Scope:** 🟡 Body-Required - Need to compare positions across document

---

## Analyzer 6: ARIASemanticAnalyzer (8 issue types)

### 24. `invalid-aria-role`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Invalid ARIA role (typo, deprecated, or non-existent).
- **How we detect:** Check `role` attribute against valid ARIA role list.
- **Scope:** 🟢 Fragment-Safe

### 25. `required-aria-attribute-missing`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** ARIA role used without required attributes. Example: `role="checkbox"` without `aria-checked`.
- **How we detect:** Check role against required attribute mappings from ARIA spec.
- **Scope:** 🟢 Fragment-Safe

### 26. `invalid-aria-attribute-value`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** ARIA attribute with invalid value. Example: `aria-checked="yes"` (should be "true").
- **How we detect:** Validate attribute values against ARIA value type constraints (true/false, tristate, ID reference, etc.).
- **Scope:** 🟢 Fragment-Safe

### 27. `aria-role-conflicts-with-semantic`
- **Severity:** Warning
- **WCAG:** 4.1.2
- **What it is:** Explicit ARIA role conflicts with native element semantics. Example: `<button role="link">`.
- **How we detect:** Check explicit role against element's implicit role, flag mismatches.
- **Scope:** 🟢 Fragment-Safe

### 28. `interactive-role-not-focusable`
- **Severity:** Error
- **WCAG:** 4.1.2, 2.1.1
- **What it is:** Interactive ARIA role (button, link, checkbox) on element without `tabindex` or native focusability.
- **How we detect:** Find interactive roles, verify element is focusable (native tag or tabindex).
- **Scope:** 🟢 Fragment-Safe

### 29. `label-target-mismatch`
- **Severity:** Error
- **WCAG:** 2.5.3, 4.1.2
- **What it is:** Visible label text doesn't match accessible name. Example: button shows "Submit" but `aria-label="Send Form"`.
- **How we detect:** Compare visible text content with computed accessible name (aria-label, aria-labelledby).
- **Scope:** 🟢 Fragment-Safe

### 30. `generic-name`
- **Severity:** Warning
- **WCAG:** 2.4.6, 4.1.2
- **What it is:** Accessible name is too generic ("button", "link", "click here"). Not descriptive.
- **How we detect:** Check accessible name against generic term list.
- **Scope:** 🟢 Fragment-Safe

### 31. `duplicate-accessible-name`
- **Severity:** Warning
- **WCAG:** 2.4.6
- **What it is:** Multiple interactive elements with same accessible name. Users can't distinguish.
- **How we detect:** Track accessible names, flag duplicates within same context.
- **Scope:** 🟡 Body-Required - Need to compare across document

---

## Analyzer 7: MouseOnlyClickAnalyzer (1 issue type)

### 32. `mouse-only-click-handler`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** Element has only `onclick` in HTML/JSX but no keyboard handler. Catches inline onclick attributes without keyboard support.
- **How we detect:** Parse HTML/JSX for `onclick` attributes, verify `onkeydown`/`onkeypress` exists.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 8: OrphanedEventHandlerAnalyzer (2 issue types)

### 33. `event-handler-on-missing-element`
- **Severity:** Error
- **WCAG:** 2.1.1, 4.1.2
- **What it is:** JavaScript attaches event handler to element that doesn't exist in DOM (wrong selector, typo).
- **How we detect:** Cross-reference JavaScript event bindings with DOM elements, flag missing targets.
- **Scope:** 🟡 Body-Required - Need to check if selector matches any DOM elements

### 34. `event-handler-never-triggered`
- **Severity:** Warning
- **WCAG:** 2.1.1
- **What it is:** Event handler defined but element/event combination unlikely to trigger (e.g., `click` on non-interactive element).
- **How we detect:** Check if target element is interactive or has appropriate ARIA role.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 9: ReactA11yAnalyzer (7 issue types)

### 35. `useeffect-focus-missing-deps`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** `useEffect` calls `.focus()` but missing dependencies. Focus management may not trigger correctly.
- **How we detect:** Parse React hooks, find `focus()` calls in useEffect, check dependency array.
- **Scope:** 🟢 Fragment-Safe

### 36. `useeffect-focus-no-cleanup`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** `useEffect` focuses element but doesn't return cleanup. Can cause focus issues on unmount.
- **How we detect:** Find focus in useEffect, verify return statement or cleanup function.
- **Scope:** 🟢 Fragment-Safe

### 37. `react-portal-no-focus-management`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** `ReactDOM.createPortal` used (modal, tooltip) without focus management. Focus doesn't move to portal.
- **How we detect:** Find `createPortal` calls, verify focus logic (useEffect, ref.current.focus).
- **Scope:** 🟢 Fragment-Safe

### 38. `react-portal-no-focus-return`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** Portal (modal) doesn't return focus to trigger element when closed.
- **How we detect:** Find portal pattern, check for focus return in cleanup/close handler.
- **Scope:** 🟢 Fragment-Safe

### 39. `stopPropagation-blocks-global-handlers`
- **Severity:** Warning
- **WCAG:** 2.1.1
- **What it is:** `e.stopPropagation()` in React prevents keyboard shortcuts/global handlers from working.
- **How we detect:** Find `stopPropagation` calls in event handlers, warn about accessibility impact.
- **Scope:** 🟢 Fragment-Safe

### 40. `react-fragment-missing-key-affects-a11y`
- **Severity:** Warning
- **WCAG:** 4.1.2
- **What it is:** React Fragment in list without `key` prop. Can break focus management and ARIA on re-render.
- **How we detect:** Find Fragment usage in `.map()` or array, check for key prop.
- **Scope:** 🟢 Fragment-Safe

### 41. `ref-forwarding-accessibility-issue`
- **Severity:** Warning
- **WCAG:** 4.1.2
- **What it is:** Component receives ref but doesn't forward to interactive element. External focus management broken.
- **How we detect:** Find components accepting ref prop, verify `React.forwardRef` used and ref attached to focusable element.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 10: AngularReactivityAnalyzer (2 issue types)

### 42. `angular-aria-update-no-change-detection`
- **Severity:** Warning
- **WCAG:** 4.1.2, 4.1.3
- **What it is:** ARIA attribute bound to property but `ChangeDetectorRef.detectChanges()` not called. Screen reader doesn't announce change.
- **How we detect:** Find ARIA attribute bindings in Angular templates, check if change detection triggered.
- **Scope:** 🟢 Fragment-Safe

### 43. `angular-async-pipe-aria-delay`
- **Severity:** Info
- **WCAG:** 4.1.3
- **What it is:** ARIA attribute bound to Observable via async pipe. Delayed update may not announce immediately.
- **How we detect:** Find ARIA bindings using `| async`, suggest immediate state management.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 11: VueReactivityAnalyzer (2 issue types)

### 44. `vue-aria-update-not-reactive`
- **Severity:** Warning
- **WCAG:** 4.1.2, 4.1.3
- **What it is:** ARIA attribute set directly (not reactive). Changes won't trigger screen reader updates.
- **How we detect:** Find ARIA attributes in Vue templates bound to non-reactive data.
- **Scope:** 🟢 Fragment-Safe

### 45. `vue-v-model-aria-missing`
- **Severity:** Warning
- **WCAG:** 4.1.2
- **What it is:** Custom component with `v-model` but missing ARIA attributes. Screen readers don't know value state.
- **How we detect:** Find components with v-model, verify ARIA value attributes present.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 12: SvelteReactivityAnalyzer (2 issue types)

### 46. `svelte-reactive-aria-missing`
- **Severity:** Warning
- **WCAG:** 4.1.2, 4.1.3
- **What it is:** Reactive variable changes ARIA-related state but no reactive ARIA attribute binding.
- **How we detect:** Find reactive statements (`$:`) affecting accessibility state, verify ARIA bindings exist.
- **Scope:** 🟢 Fragment-Safe

### 47. `svelte-bind-without-aria`
- **Severity:** Warning
- **WCAG:** 4.1.2
- **What it is:** `bind:value` or `bind:checked` without corresponding ARIA attributes. Screen readers miss updates.
- **How we detect:** Find Svelte bind directives, check for ARIA attributes.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 13: AriaStateManagementAnalyzer (3 issue types)

### 48. `aria-state-not-updated`
- **Severity:** Error
- **WCAG:** 4.1.2, 4.1.3
- **What it is:** ARIA state attribute (expanded, checked, pressed) set initially but never updated. State changes invisible to screen readers.
- **How we detect:** Find ARIA state attributes in DOM, verify corresponding JavaScript updates exist.
- **Scope:** 🟢 Fragment-Safe - Can check if update logic exists in code

### 49. `aria-expanded-without-toggle`
- **Severity:** Warning
- **WCAG:** 4.1.2
- **What it is:** `aria-expanded` attribute exists but no code toggles it. Accordion/disclosure pattern broken.
- **How we detect:** Find `aria-expanded`, verify JavaScript toggles value on interaction.
- **Scope:** 🟢 Fragment-Safe

### 50. `aria-state-missing-for-interaction`
- **Severity:** Warning
- **WCAG:** 4.1.2
- **What it is:** Interactive pattern (toggle button, disclosure) without ARIA state. Screen readers don't know current state.
- **How we detect:** Detect toggle/disclosure patterns, verify ARIA state attributes present.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 14: FormSubmissionAnalyzer (3 issue types)

### 51. `form-submit-no-validation-feedback`
- **Severity:** Error
- **WCAG:** 3.3.1, 3.3.3
- **What it is:** Form submission handler prevents default but doesn't provide accessible validation feedback.
- **How we detect:** Find form submit handlers with `preventDefault()`, check for error announcement mechanism (aria-live, aria-invalid).
- **Scope:** 🟢 Fragment-Safe

### 52. `form-submit-no-loading-state`
- **Severity:** Warning
- **WCAG:** 4.1.3
- **What it is:** Async form submission without loading state announcement. Screen reader users don't know submission in progress.
- **How we detect:** Find async form submissions, verify aria-busy or aria-live loading announcement.
- **Scope:** 🟢 Fragment-Safe

### 53. `form-submit-no-success-confirmation`
- **Severity:** Warning
- **WCAG:** 3.3.4
- **What it is:** Form submission without accessible success confirmation. Users unsure if action completed.
- **How we detect:** Find form submission handlers, verify success announcement or navigation.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 15: KeyboardTrapAnalyzer (2 issue types)

### 54. `keyboard-trap-no-escape`
- **Severity:** Error
- **WCAG:** 2.1.2
- **What it is:** Modal/dialog traps focus but no Escape key handler to exit. Users can't close with keyboard.
- **How we detect:** Detect focus trap pattern, verify Escape key handler exists.
- **Scope:** 🟢 Fragment-Safe

### 55. `keyboard-trap-missing-instructions`
- **Severity:** Warning
- **WCAG:** 2.1.1
- **What it is:** Complex keyboard trap (like date picker) without instructions. Users don't know how to navigate.
- **How we detect:** Find focus trap patterns, check for associated instructions (aria-describedby, help text).
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 16: NestedInteractiveElementsAnalyzer (2 issue types)

### 56. `nested-interactive-elements`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Interactive element nested inside another (button in link, link in button). Invalid HTML, breaks screen readers.
- **How we detect:** Check DOM tree for interactive elements (a, button, input) inside other interactive elements.
- **Scope:** 🟢 Fragment-Safe

### 57. `interactive-inside-label`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Interactive element (button, link) inside `<label>`. Clicking nested element may not focus input.
- **How we detect:** Find interactive elements inside `<label>` tags.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 17: WidgetPatternAnalyzer (5 issue types)

### 58. `accordion-missing-aria`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Accordion pattern without proper ARIA (aria-expanded, aria-controls). Screen readers don't understand structure.
- **How we detect:** Detect accordion pattern (disclosure widget), verify required ARIA attributes.
- **Scope:** 🟢 Fragment-Safe

### 59. `tabs-missing-aria`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Tab pattern without ARIA roles (tablist, tab, tabpanel) or aria-selected. Not announced as tabs.
- **How we detect:** Detect tab pattern, verify ARIA roles and states.
- **Scope:** 🟢 Fragment-Safe

### 60. `tabs-missing-keyboard-navigation`
- **Severity:** Error
- **WCAG:** 2.1.1
- **What it is:** Tabs without arrow key navigation. Should use arrow keys to move between tabs.
- **How we detect:** Find tab pattern, check for arrow key handlers.
- **Scope:** 🟢 Fragment-Safe

### 61. `menu-missing-aria`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Menu widget without ARIA roles (menu, menuitem). Screen readers treat as generic list.
- **How we detect:** Detect menu pattern, verify ARIA roles.
- **Scope:** 🟢 Fragment-Safe

### 62. `dialog-missing-aria`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Dialog/modal without `role="dialog"` or `role="alertdialog"`. Not announced as dialog.
- **How we detect:** Detect dialog pattern, verify role attribute.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 18: HeadingStructureAnalyzer (5 issue types)

### 63. `no-h1`
- **Severity:** Error
- **WCAG:** 1.3.1, 2.4.6
- **What it is:** Page has no `<h1>` element. Document structure unclear.
- **How we detect:** Check if any `<h1>` exists in document.
- **Scope:** 🟡 Body-Required - Need complete document to verify no H1 exists

### 64. `multiple-h1`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** Multiple `<h1>` elements. Should only have one page title (except in sectioning elements with distinct purpose).
- **How we detect:** Count `<h1>` elements, flag if > 1.
- **Scope:** 🟡 Body-Required - Need to count across entire document

### 65. `heading-level-skip`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** Heading levels skip (H1 → H3, no H2). Breaks document outline.
- **How we detect:** Track heading level sequence, flag jumps > 1.
- **Scope:** 🟡 Body-Required - Need to track sequence across document

### 66. `empty-heading`
- **Severity:** Error
- **WCAG:** 1.3.1, 2.4.6
- **What it is:** Heading element with no text content. Screen readers announce "heading level X" with no label.
- **How we detect:** Find heading elements with empty text content.
- **Scope:** 🟢 Fragment-Safe

### 67. `heading-too-long`
- **Severity:** Warning
- **WCAG:** 2.4.6
- **What it is:** Heading with excessively long text (> 120 chars). Hard to understand when announced.
- **How we detect:** Check heading text length.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 19: LandmarkAnalyzer (6 issue types)

### 68. `no-main-landmark`
- **Severity:** Error
- **WCAG:** 1.3.1
- **What it is:** Page has no `<main>` or `role="main"`. Screen reader users can't jump to main content.
- **How we detect:** Check if `<main>` or `role="main"` exists in document.
- **Scope:** 🟡 Body-Required - Need complete body to verify no main exists

### 69. `multiple-main-landmarks`
- **Severity:** Error
- **WCAG:** 1.3.1
- **What it is:** Multiple `<main>` landmarks without using hidden attribute. Only one should be visible.
- **How we detect:** Count visible main landmarks.
- **Scope:** 🟡 Body-Required - Need to count across document

### 70. `no-skip-link`
- **Severity:** Warning
- **WCAG:** 2.4.1
- **What it is:** No skip link to main content. Keyboard users must tab through header/nav every page load.
- **How we detect:** Check first focusable element is skip link (href="#main" or similar).
- **Scope:** 🟡 Body-Required - Need to check first focusable element in document

### 71. `landmark-missing-label`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** Multiple same-type landmarks (nav, aside) without distinguishing labels. Users can't tell them apart.
- **How we detect:** Count landmark types, flag duplicates without aria-label/aria-labelledby.
- **Scope:** 🟡 Body-Required - Need to count landmarks across document

### 72. `contentinfo-not-in-banner`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** `<footer>` outside top-level, doesn't create contentinfo landmark. Misunderstanding of landmark scoping.
- **How we detect:** Check if footer is direct child of body.
- **Scope:** 🟡 Body-Required - Need document structure context

### 73. `banner-not-in-body`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** `<header>` outside top-level, doesn't create banner landmark.
- **How we detect:** Check if header is direct child of body.
- **Scope:** 🟡 Body-Required - Need document structure context

---

## Analyzer 20: TableAccessibilityAnalyzer (5 issue types)

### 74. `table-missing-caption`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** `<table>` without `<caption>` or `aria-label`. Purpose unclear to screen reader users.
- **How we detect:** Find `<table>` elements, check for caption or label.
- **Scope:** 🟢 Fragment-Safe

### 75. `table-missing-headers`
- **Severity:** Error
- **WCAG:** 1.3.1
- **What it is:** Data table without `<th>` elements. Cells not associated with headers.
- **How we detect:** Find tables, check if contains `<th>` elements.
- **Scope:** 🟢 Fragment-Safe

### 76. `th-missing-scope`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** `<th>` without `scope` attribute. Ambiguous whether header is for row or column.
- **How we detect:** Find `<th>` elements without `scope="row"` or `scope="col"`.
- **Scope:** 🟢 Fragment-Safe

### 77. `complex-table-missing-id-headers`
- **Severity:** Error
- **WCAG:** 1.3.1
- **What it is:** Complex table (nested headers, multi-level) without id/headers attributes. Impossible to understand relationships.
- **How we detect:** Detect complex table structure, verify id/headers associations.
- **Scope:** 🟢 Fragment-Safe (can detect within table structure)

### 78. `layout-table-with-th`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** Table used for layout (not data) but contains `<th>`. Misleads screen readers.
- **How we detect:** Find tables with `role="presentation"` or layout patterns containing `<th>`.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 21: LinkAnalyzer (4 issue types)

### 79. `link-missing-href`
- **Severity:** Error
- **WCAG:** 2.4.4
- **What it is:** `<a>` without `href` attribute. Not keyboard-focusable, not announced as link.
- **How we detect:** Find `<a>` elements without `href`.
- **Scope:** 🟢 Fragment-Safe

### 80. `link-empty-text`
- **Severity:** Error
- **WCAG:** 2.4.4
- **What it is:** Link with no accessible name (no text, no aria-label, no title). Screen readers announce "link" with no destination.
- **How we detect:** Check link accessible name is not empty.
- **Scope:** 🟢 Fragment-Safe

### 81. `link-generic-text`
- **Severity:** Warning
- **WCAG:** 2.4.4
- **What it is:** Link text is too generic ("click here", "read more", "here"). Unhelpful out of context.
- **How we detect:** Check link text against generic phrase list.
- **Scope:** 🟢 Fragment-Safe

### 82. `link-url-as-text`
- **Severity:** Warning
- **WCAG:** 2.4.4
- **What it is:** Link text is raw URL. Screen readers announce entire URL character by character.
- **How we detect:** Check if link text is URL pattern.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 22: LanguageAnalyzer (3 issue types)

### 83. `html-missing-lang`
- **Severity:** Error
- **WCAG:** 3.1.1
- **What it is:** `<html>` element missing `lang` attribute. Screen readers can't determine language for pronunciation.
- **How we detect:** Check if `<html>` has `lang` attribute.
- **Scope:** 🔴 Full-Page Required - Need `<html>` element

### 84. `invalid-lang-code`
- **Severity:** Error
- **WCAG:** 3.1.1
- **What it is:** `lang` attribute has invalid language code (not BCP 47 format).
- **How we detect:** Validate `lang` value against valid language code list.
- **Scope:** 🟢 Fragment-Safe (when checking non-html elements)

### 85. `content-lang-mismatch`
- **Severity:** Warning
- **WCAG:** 3.1.2
- **What it is:** Element contains text in different language but missing `lang` attribute. Pronunciation incorrect.
- **How we detect:** Detect language changes (heuristic or explicit marking), verify lang attribute.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 23: MissingLabelAnalyzer (3 issue types)

### 86. `input-missing-label`
- **Severity:** Error
- **WCAG:** 1.3.1, 4.1.2
- **What it is:** Form input without associated `<label>`, `aria-label`, or `aria-labelledby`. Screen readers don't announce purpose.
- **How we detect:** Find `<input>`, `<select>`, `<textarea>`, verify label association exists.
- **Scope:** 🟢 Fragment-Safe (but label association check may need broader scope)

### 87. `button-missing-accessible-name`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Button with no text content, no aria-label. Screen readers announce "button" with no label.
- **How we detect:** Check button accessible name is not empty.
- **Scope:** 🟢 Fragment-Safe

### 88. `label-without-control`
- **Severity:** Warning
- **WCAG:** 1.3.1
- **What it is:** `<label>` with `for` attribute referencing non-existent ID. Label doesn't associate with input.
- **How we detect:** Find `<label for="...">`, verify target ID exists.
- **Scope:** 🟡 Body-Required - Need to search for ID

---

## Analyzer 24: MissingAltTextAnalyzer (3 issue types)

### 89. `img-missing-alt`
- **Severity:** Error
- **WCAG:** 1.1.1
- **What it is:** `<img>` without `alt` attribute. Screen readers announce filename or URL.
- **How we detect:** Find `<img>` elements without `alt` attribute.
- **Scope:** 🟢 Fragment-Safe

### 90. `img-empty-alt-on-informative`
- **Severity:** Warning
- **WCAG:** 1.1.1
- **What it is:** Image appears informative but has `alt=""`. Image is hidden from screen readers when it shouldn't be.
- **How we detect:** Heuristic: check if image is inside link/button (probably informative), or large size, not decorative filename.
- **Scope:** 🟢 Fragment-Safe

### 91. `img-alt-filename`
- **Severity:** Warning
- **WCAG:** 1.1.1
- **What it is:** Alt text is filename (image.jpg, photo_123.png). Not descriptive.
- **How we detect:** Check if alt value looks like filename pattern.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 25: TabIndexAnalyzer (2 issue types)

### 92. `positive-tabindex-breaks-order`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** Duplicate of issue #22 from FocusOrderConflictAnalyzer. Positive tabindex creates confusing focus order.
- **How we detect:** Find `tabindex > 0`.
- **Scope:** 🟢 Fragment-Safe

### 93. `tabindex-on-interactive`
- **Severity:** Warning
- **WCAG:** 2.4.3
- **What it is:** `tabindex="0"` on natively focusable element (button, link). Redundant.
- **How we detect:** Find tabindex on native interactive elements.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 26: RedundantRoleAnalyzer (1 issue type)

### 94. `redundant-role`
- **Severity:** Info
- **WCAG:** 4.1.2
- **What it is:** Explicit ARIA role matches implicit role (`<button role="button">`). Redundant, adds noise.
- **How we detect:** Compare explicit role to element's implicit role.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 27: ContextChangeAnalyzer (2 issue types)

### 95. `select-onchange-redirect`
- **Severity:** Error
- **WCAG:** 3.2.2
- **What it is:** `<select>` onChange causes redirect/navigation. Keyboard users trigger unintentionally when arrowing through options.
- **How we detect:** Find select elements with change handlers that navigate (location.href changes).
- **Scope:** 🟢 Fragment-Safe

### 96. `input-onfocus-context-change`
- **Severity:** Error
- **WCAG:** 3.2.1
- **What it is:** Input onFocus causes unexpected context change (opens dialog, navigates). Disorienting.
- **How we detect:** Find input focus handlers with significant side effects.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 28: FormValidationAnalyzer (2 issue types)

### 97. `missing-required-indicator`
- **Severity:** Warning
- **WCAG:** 3.3.2
- **What it is:** Required input (`required` or `aria-required`) without visual indicator (*). Screen reader users know, sighted users don't.
- **How we detect:** Find required inputs, check for visual indicator in label or nearby.
- **Scope:** 🟢 Fragment-Safe

### 98. `missing-error-identification`
- **Severity:** Error
- **WCAG:** 3.3.1
- **What it is:** Form validation but errors not programmatically associated with inputs. Screen readers don't announce errors.
- **How we detect:** Find validation logic, verify aria-invalid and aria-describedby used.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 29: ColorContrastAnalyzer (2 issue types)

### 99. `insufficient-contrast-aa`
- **Severity:** Error
- **WCAG:** 1.4.3
- **What it is:** Text/background contrast below 4.5:1 (normal text) or 3:1 (large text). Fails Level AA.
- **How we detect:** Extract colors from CSS, calculate WCAG contrast ratio, compare to thresholds.
- **Scope:** 🟢 Fragment-Safe (for inline styles) / 🔴 Full-Page (for CSS in `<head>`)

### 100. `insufficient-contrast-aaa`
- **Severity:** Warning
- **WCAG:** 1.4.6
- **What it is:** Text/background contrast below 7:1 (normal) or 4.5:1 (large). Fails Level AAA.
- **How we detect:** Same as above, different thresholds.
- **Scope:** 🟢 Fragment-Safe (inline) / 🔴 Full-Page (external CSS)

---

## Analyzer 30: LiveRegionAnalyzer (5 issue types)

### 101. `live-region-no-updates`
- **Severity:** Warning
- **WCAG:** 4.1.3
- **What it is:** `aria-live` attribute exists but no JavaScript ever updates the content. Unused pattern.
- **How we detect:** Find elements with aria-live, check if content ever modified in JavaScript.
- **Scope:** 🟢 Fragment-Safe

### 102. `live-region-missing-role`
- **Severity:** Warning
- **WCAG:** 4.1.3
- **What it is:** Live region without explicit role (status, alert, log). Less clear semantics.
- **How we detect:** Find aria-live, verify role attribute exists.
- **Scope:** 🟢 Fragment-Safe

### 103. `dynamic-content-no-live-region`
- **Severity:** Error
- **WCAG:** 4.1.3
- **What it is:** JavaScript updates DOM but no aria-live. Screen readers miss the update.
- **How we detect:** Find DOM manipulation (innerHTML, appendChild), check if target has aria-live.
- **Scope:** 🟢 Fragment-Safe

### 104. `incorrect-live-region-politeness`
- **Severity:** Warning
- **WCAG:** 4.1.3
- **What it is:** `aria-live="assertive"` used for non-urgent content (or vice versa). Interrupts screen reader unnecessarily.
- **How we detect:** Check aria-live value against content type heuristics.
- **Scope:** 🟢 Fragment-Safe

### 105. `live-region-too-frequent-updates`
- **Severity:** Warning
- **WCAG:** 4.1.3
- **What it is:** Live region updated very frequently (every second or faster). Overwhelms screen reader users.
- **How we detect:** Detect update frequency in loops/intervals targeting live regions.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 31: AutocompleteAnalyzer (3 issue types)

### 106. `missing-autocomplete-on-personal-data`
- **Severity:** Warning
- **WCAG:** 1.3.5
- **What it is:** Input collects personal data (name, email, phone) but missing `autocomplete` attribute. Harder for users to fill forms.
- **How we detect:** Match input name/id/label against personal data patterns, verify autocomplete exists.
- **Scope:** 🟢 Fragment-Safe

### 107. `invalid-autocomplete-token`
- **Severity:** Error
- **WCAG:** 1.3.5
- **What it is:** `autocomplete` attribute has invalid value (not in HTML spec list of 53 tokens).
- **How we detect:** Validate autocomplete value against spec token list.
- **Scope:** 🟢 Fragment-Safe

### 108. `autocomplete-off-on-personal-data`
- **Severity:** Warning
- **WCAG:** 1.3.5
- **What it is:** `autocomplete="off"` on personal data field. Prevents autofill, harder for users with cognitive disabilities.
- **How we detect:** Find personal data inputs with autocomplete="off".
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 32: OrientationLockAnalyzer (3 issue types)

### 109. `orientation-lock-detected`
- **Severity:** Error
- **WCAG:** 1.3.4
- **What it is:** Screen Orientation API used to lock orientation (portrait or landscape). Prevents users from rotating device.
- **How we detect:** Find `screen.orientation.lock()`, `lockOrientation()` calls.
- **Scope:** 🟢 Fragment-Safe

### 110. `css-orientation-restriction`
- **Severity:** Warning
- **WCAG:** 1.3.4
- **What it is:** CSS media query restricts content to one orientation (`@media (orientation: portrait)`). May hide content in landscape.
- **How we detect:** Parse CSS for orientation media queries that hide/disable content.
- **Scope:** 🟢 Fragment-Safe (inline) / 🔴 Full-Page (external CSS)

### 111. `viewport-orientation-lock`
- **Severity:** Warning
- **WCAG:** 1.3.4
- **What it is:** Viewport meta tag locks orientation. Less common but possible.
- **How we detect:** Parse viewport meta tag for orientation lock.
- **Scope:** 🔴 Full-Page Required - Need `<head>` section

---

## Analyzer 33: TimeoutAnalyzer (4 issue types)

### 112. `session-timeout-no-warning`
- **Severity:** Error
- **WCAG:** 2.2.1
- **What it is:** Session timeout < 20 hours without warning. User loses data unexpectedly.
- **How we detect:** Find setTimeout/setInterval with session-related code (logout, sessionStorage.clear), check duration and warning mechanism.
- **Scope:** 🟢 Fragment-Safe

### 113. `automatic-redirect-no-control`
- **Severity:** Warning
- **WCAG:** 2.2.1
- **What it is:** setTimeout redirects page without user control. Unexpected navigation.
- **How we detect:** Find setTimeout with location changes, verify user can cancel.
- **Scope:** 🟢 Fragment-Safe

### 114. `countdown-timer-no-extension`
- **Severity:** Warning
- **WCAG:** 2.2.1
- **What it is:** Countdown timer without ability to extend time. Users may not finish in time.
- **How we detect:** Find countdown patterns, verify extension mechanism exists.
- **Scope:** 🟢 Fragment-Safe

### 115. `inactivity-timeout-too-short`
- **Severity:** Info
- **WCAG:** 2.2.1
- **What it is:** Inactivity timeout < 20 hours. WCAG recommends longer unless security/data preservation reason.
- **How we detect:** Find inactivity detection patterns, check timeout duration.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 34: PointerTargetAnalyzer (3 issue types)

### 116. `touch-target-too-small`
- **Severity:** Error (< 24px) / Warning (24-44px) / Info (no explicit size)
- **WCAG:** 2.5.8 (Level AA: 24px), 2.5.5 (Level AAA: 44px)
- **What it is:** Interactive element smaller than 24×24px (AA) or 44×44px (AAA). Hard to tap for users with motor disabilities.
- **How we detect:** Extract width/height from inline styles or attributes, compare to thresholds.
- **Scope:** 🟢 Fragment-Safe (for inline styles) / 🔴 Full-Page (for CSS sizing)

### 117. `adjacent-targets-too-close`
- **Severity:** Warning
- **WCAG:** 2.5.5
- **What it is:** Interactive elements without sufficient spacing (< 8px). Easy to tap wrong target.
- **How we detect:** Find adjacent interactive elements, check spacing (simplified: inline margins).
- **Scope:** 🟢 Fragment-Safe (checks siblings)

### 118. `inline-link-insufficient-target`
- **Severity:** Info
- **WCAG:** 2.5.5
- **What it is:** Inline link in paragraph without adequate padding/spacing. May be hard to tap accurately.
- **How we detect:** Find links inside paragraphs, check for padding or line-height.
- **Scope:** 🟢 Fragment-Safe

---

## Analyzer 35: StaticAriaAnalyzer (1 issue type)

### 119. `static-aria-error`
- **Severity:** Error
- **WCAG:** 4.1.2
- **What it is:** Generic ARIA validation errors (invalid roles, attributes, values). Early catch-all analyzer.
- **How we detect:** Basic ARIA validation rules.
- **Scope:** 🟢 Fragment-Safe

---

## Summary Statistics

### By Scope Requirement:
- **🟢 Fragment-Safe:** 96 issue types (80.7%)
- **🟡 Body-Required:** 16 issue types (13.4%)
- **🔴 Full-Page Required:** 7 issue types (5.9%)

### Body-Required Issues (16):
1. aria-labelledby-references-missing
2. aria-describedby-references-missing
3. aria-controls-references-missing
4. focus-order-conflicts-reading-order
5. duplicate-accessible-name
6. event-handler-on-missing-element
7. no-h1
8. multiple-h1
9. heading-level-skip
10. no-main-landmark
11. multiple-main-landmarks
12. no-skip-link
13. landmark-missing-label
14. contentinfo-not-in-banner
15. banner-not-in-body
16. label-without-control

### Full-Page Required Issues (7):
1. html-missing-lang
2. css-orientation-restriction (if in external CSS)
3. viewport-orientation-lock
4. insufficient-contrast-aa (if in external CSS)
5. insufficient-contrast-aaa (if in external CSS)
6. touch-target-too-small (if CSS-sized)
7. adjacent-targets-too-close (if CSS-spaced)

**Note:** Some issues are marked as both Fragment-Safe AND Full-Page depending on context:
- **CSS-related issues:** Fragment-Safe for inline styles, Full-Page for `<style>` or `<link>` in `<head>`
- **Color contrast:** Fragment-Safe if colors in inline styles, Full-Page if in external CSS
- **Touch targets:** Fragment-Safe if sized with inline styles/attributes, Full-Page if sized via CSS

---

## Recommendations for Paradise Playground

### For Fragment Mode (Current Default):
**Show only 🟢 Fragment-Safe issues** - 96 issue types that don't require document context.

**Example suppression message for Body/Full-Page issues:**
```
ℹ️ Note: Some analyzers require full page context and are disabled in fragment mode:
- Document structure (headings, landmarks)
- ID reference validation (aria-labelledby, aria-describedby)
- Global uniqueness checks

Switch to full-page mode to enable these checks.
```

### For Full-Page Mode:
**Show all 119 issue types** - Complete analysis with document context.

### Implementation Approach:

```typescript
// In playground analyzer execution
const BODY_REQUIRED_ISSUES = new Set([
  'aria-labelledby-references-missing',
  'aria-describedby-references-missing',
  'aria-controls-references-missing',
  // ... all 16 body-required issues
]);

const FULL_PAGE_REQUIRED_ISSUES = new Set([
  'html-missing-lang',
  'viewport-orientation-lock',
  // ... all 7 full-page issues
]);

function filterIssuesForFragmentMode(issues: Issue[], hasBodyTag: boolean, hasHtmlTag: boolean): Issue[] {
  return issues.filter(issue => {
    // Always exclude full-page issues in fragment mode
    if (!hasHtmlTag && FULL_PAGE_REQUIRED_ISSUES.has(issue.type)) {
      return false;
    }

    // Exclude body-required issues if no body tag
    if (!hasBodyTag && BODY_REQUIRED_ISSUES.has(issue.type)) {
      return false;
    }

    return true;
  });
}
```

### Documentation Updates:

1. **Update ANALYZERS.md** to note fragment vs full-page requirements
2. **Update analyzer tooltips** in playground with scope badges: 🟢 Fragment | 🟡 Body | 🔴 Full-Page
3. **Add mode toggle** in playground: "Fragment Mode" vs "Full-Page Mode"
4. **Show suppressed issue count**: "5 additional issues require full page mode"

---

**Last Updated:** January 2026
**Version:** Sprint 14 Complete (35 analyzers, 119 issue types)
