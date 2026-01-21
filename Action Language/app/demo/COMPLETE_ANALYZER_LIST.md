# Complete Paradise Analyzer List

**Total Analyzers: 35**
**Total Issue Types: 100+**
**Last Updated: January 2026**

This document provides a comprehensive list of all accessibility analyzers in Paradise, organized by category and implementation phase.

---

## Table of Contents
- [Behavioral Analysis (JavaScript + DOM)](#behavioral-analysis)
- [Structural Analysis (HTML/DOM)](#structural-analysis)
- [Framework-Specific Analysis](#framework-specific-analysis)
- [Production Hardening (Sprint 14)](#production-hardening)
- [WCAG Coverage](#wcag-coverage)

---

## Behavioral Analysis (JavaScript + DOM)

### 1. FocusManagementAnalyzer
**WCAG:** 2.4.3, 2.4.7, 4.1.2
**Issue Types:** 6
- `removal-without-focus-management` - Element removed without checking focus
- `hiding-without-focus-management` - Element hidden without focus check
- `hiding-class-without-focus-management` - classList changes may hide element
- `possibly-non-focusable` - focus() called on non-focusable element
- `standalone-blur` - blur() without proper focus management
- `focus-restoration-missing` - Modal close without focus restoration

**Critical for:** Modals, tabs, dynamic content, single-page applications

---

### 2. KeyboardNavigationAnalyzer
**WCAG:** 2.1.1 (Keyboard)
**Issue Types:** 5
- `missing-keyboard-handler` - Click without keyboard equivalent
- `space-not-handled` - Click handler without Space key
- `enter-not-handled` - Click handler without Enter key
- `tab-navigation-prevented` - Tab key prevented without alternative
- `arrow-key-navigation-missing` - Widget without arrow key support

**Critical for:** Custom controls, interactive widgets, non-button clickables

---

### 3. KeyboardTrapAnalyzer
**WCAG:** 2.1.2 (No Keyboard Trap)
**Issue Types:** 2
- `keyboard-trap` - Tab intercepted without escape mechanism
- `modal-keyboard-trap` - Modal without Escape key exit

**Critical for:** Modals, dialogs, custom focus management

---

### 4. SingleLetterShortcutAnalyzer
**WCAG:** 2.1.4 (Character Key Shortcuts)
**Issue Types:** 2
- `screen-reader-conflict` - Single-letter key conflicts with SR navigation
- `shortcut-without-modifier` - Single-char shortcut without Ctrl/Alt/Shift

**Critical for:** Keyboard shortcuts, quick navigation features

---

### 5. MouseOnlyClickAnalyzer
**WCAG:** 2.1.1 (Keyboard)
**Issue Types:** 1
- `mouse-only-click` - Click handler on non-interactive element without keyboard

**Critical for:** Divs/spans with click handlers, custom controls

---

### 6. AriaStateManagementAnalyzer
**WCAG:** 4.1.2 (Name, Role, Value)
**Issue Types:** 1
- `aria-state-static` - ARIA state attributes never updated dynamically

**Critical for:** Accordions, tabs, toggles, expandable sections

---

### 7. ARIASemanticAnalyzer
**WCAG:** 4.1.2, 1.3.1
**Issue Types:** 10+
- `invalid-role` - Non-existent ARIA role
- `missing-required-aria` - Role missing required attributes
- `aria-label-on-generic` - aria-label on div/span without role
- `redundant-role` - Role matches implicit role
- `invalid-aria-attribute` - Invalid ARIA attribute for element
- Plus validation for all ARIA roles and attributes

**Critical for:** ARIA widget patterns, semantic markup

---

### 8. MissingAriaConnectionAnalyzer
**WCAG:** 1.3.1, 4.1.2
**Issue Types:** 4
- `aria-labelledby-missing-target` - aria-labelledby references non-existent ID
- `aria-describedby-missing-target` - aria-describedby references non-existent ID
- `aria-controls-missing-target` - aria-controls references non-existent ID
- `aria-activedescendant-missing-target` - aria-activedescendant invalid

**Critical for:** Complex ARIA relationships, custom widgets

---

### 9. VisibilityFocusConflictAnalyzer
**WCAG:** 2.4.7
**Issue Types:** 3
- `hidden-element-focusable` - display:none/visibility:hidden but focusable
- `aria-hidden-focusable` - aria-hidden="true" but focusable
- `inert-focusable` - inert attribute but still focusable

**Critical for:** Hidden content, overlays, off-screen navigation

---

### 10. FocusOrderConflictAnalyzer
**WCAG:** 2.4.3 (Focus Order)
**Issue Types:** 2
- `positive-tabindex` - tabindex > 0 disrupts natural order
- `tabindex-order-conflict` - Explicit tabindex order doesn't match DOM order

**Critical for:** Form fields, navigation, widget patterns

---

### 11. NestedInteractiveElementsAnalyzer
**WCAG:** 4.1.2
**Issue Types:** 3
- `nested-buttons` - Button inside button
- `nested-links` - Link inside link or button
- `nested-interactive` - Interactive element inside interactive element

**Critical for:** Card components, complex layouts

---

### 12. OrphanedEventHandlerAnalyzer
**WCAG:** 4.1.2
**Issue Types:** 2
- `orphaned-click-handler` - Click handler targets non-existent element
- `orphaned-keyboard-handler` - Keyboard handler targets non-existent element

**Critical for:** Dynamic content, split JavaScript files

---

### 13. WidgetPatternAnalyzer
**WCAG:** 4.1.2, 2.1.1
**Issue Types:** 21+ (one per widget pattern)
- Validates all WAI-ARIA widget patterns: tabs, accordion, dialog, combobox, menu, tree, toolbar, slider, etc.
- Checks required ARIA attributes, keyboard navigation, focus management

**Critical for:** Complex interactive widgets, design systems

---

### 14. FormSubmissionAnalyzer
**WCAG:** 3.3.1, 3.3.3
**Issue Types:** 4
- `form-submit-without-validation` - Submit without client-side validation
- `missing-error-feedback` - No error announcement mechanism
- `missing-success-feedback` - No success confirmation
- `ajax-submit-without-status` - AJAX form without loading/error status

**Critical for:** Forms, user input, data submission

---

### 15. ModalAccessibilityAnalyzer
**WCAG:** 2.4.3, 4.1.2
**Issue Types:** 5
- `modal-missing-label` - Dialog without aria-label/aria-labelledby
- `modal-no-focus-trap` - Modal without focus trap
- `modal-no-escape` - Modal can't be closed with Escape
- `modal-no-initial-focus` - Modal doesn't set initial focus
- `modal-no-focus-restoration` - Modal doesn't restore focus on close

**Critical for:** Dialogs, popups, lightboxes

---

## Structural Analysis (HTML/DOM)

### 16. HeadingStructureAnalyzer
**WCAG:** 1.3.1, 2.4.6
**Issue Types:** 4
- `page-doesnt-start-with-h1` - Page missing H1 or doesn't start with H1
- `heading-levels-skipped` - H1→H3 skip (missing H2)
- `empty-heading` - Heading with no text content
- `heading-too-long` - Heading over 120 characters

**Critical for:** Document structure, screen reader navigation

---

### 17. LandmarkStructureAnalyzer
**WCAG:** 1.3.1, 2.4.1
**Issue Types:** 5
- `missing-main-landmark` - Page without <main> or role="main"
- `multiple-main-landmarks` - Multiple <main> without unique labels
- `missing-navigation-label` - Multiple <nav> without aria-label
- `redundant-landmark-role` - <nav> with role="navigation" (implicit)
- `landmark-in-wrong-context` - Landmark nested inappropriately

**Critical for:** Page structure, screen reader quick navigation

---

### 18. FormLabelAnalyzer
**WCAG:** 1.3.1, 3.3.2
**Issue Types:** 4
- `input-missing-label` - Input without associated <label> or aria-label
- `label-without-for` - <label> without for attribute
- `label-for-missing-input` - for attribute references non-existent input
- `input-inside-label-no-id` - Input inside label but missing id

**Critical for:** Forms, user input

---

### 19. AltTextAnalyzer
**WCAG:** 1.1.1 (Non-text Content)
**Issue Types:** 5
- `img-missing-alt` - <img> without alt attribute
- `img-alt-empty-not-decorative` - Empty alt but image appears meaningful
- `img-alt-filename` - alt="photo.jpg" (filename used as alt text)
- `img-alt-too-long` - alt text over 125 characters
- `redundant-text-alternative` - alt duplicates nearby text

**Critical for:** Images, icons, graphics

---

### 20. LinkTextAnalyzer
**WCAG:** 2.4.4, 2.4.9
**Issue Types:** 4
- `link-empty-text` - Link with no text content
- `link-generic-text` - "click here", "read more", "learn more"
- `link-url-as-text` - Link text is raw URL
- `link-same-text-different-destination` - Multiple links with same text go to different pages

**Critical for:** Navigation, hyperlinks

---

### 21. ButtonLabelAnalyzer
**WCAG:** 4.1.2, 2.5.3
**Issue Types:** 3
- `button-empty-label` - Button with no text or aria-label
- `button-only-icon` - Button with only icon, missing aria-label
- `button-generic-label` - "OK", "Submit" without context

**Critical for:** Buttons, interactive controls

---

### 22. TableAccessibilityAnalyzer
**WCAG:** 1.3.1
**Issue Types:** 5
- `table-missing-caption` - Data table without <caption>
- `table-missing-th` - Data table without <th> headers
- `table-missing-scope` - Complex table headers without scope
- `table-layout-has-headers` - Layout table has <th> or role attributes
- `table-missing-summary` - Complex table without summary/aria-describedby

**Critical for:** Data tables, grids

---

### 23. LanguageAttributeAnalyzer
**WCAG:** 3.1.1, 3.1.2
**Issue Types:** 3
- `missing-html-lang` - <html> without lang attribute
- `invalid-lang-code` - Invalid BCP 47 language code
- `content-lang-mismatch` - Foreign language content without lang attribute

**Critical for:** Internationalization, screen reader pronunciation

---

### 24. AnimationControlAnalyzer
**WCAG:** 2.2.2, 2.3.1
**Issue Types:** 3
- `animation-no-pause` - Continuous animation without pause control
- `auto-play-media-no-control` - Video/audio autoplays without controls
- `animation-exceeds-duration` - Animation over 5 seconds without pause

**Critical for:** Motion sensitivity, vestibular disorders

---

### 25. DeprecatedKeyCodeAnalyzer
**WCAG:** 2.1.1 (code quality)
**Issue Types:** 4
- `deprecated-keycode` - Using event.keyCode instead of event.key
- `deprecated-which` - Using event.which instead of event.key
- `numeric-key-comparison` - Comparing keyCode to magic numbers
- `deprecated-charcode` - Using event.charCode

**Critical for:** Modern code quality, maintainability

---

## Framework-Specific Analysis

### 26. ReactA11yAnalyzer
**WCAG:** Various
**Issue Types:** 15+
- React-specific patterns: onClick without onKeyDown, autofocus, fragments without keys
- React Hooks accessibility issues
- Portal accessibility
- stopPropagation issues blocking accessibility events

**Critical for:** React applications

---

### 27. AngularReactivityAnalyzer
**WCAG:** 4.1.2
**Issue Types:** 3
- `angular-aria-not-reactive` - ARIA attributes not in change detection
- `angular-missing-cd-ref` - Component missing ChangeDetectorRef
- `angular-async-pipe-missing` - Async data without async pipe

**Critical for:** Angular applications

---

### 28. VueReactivityAnalyzer
**WCAG:** 4.1.2
**Issue Types:** 3
- `vue-aria-not-reactive` - ARIA attributes not reactive
- `vue-v-model-accessibility` - v-model without label
- `vue-computed-aria` - ARIA in computed property without dependency

**Critical for:** Vue.js applications

---

### 29. SvelteReactivityAnalyzer
**WCAG:** 4.1.2
**Issue Types:** 3
- `svelte-aria-not-reactive` - ARIA attributes not in reactive statement
- `svelte-bind-accessibility` - bind:value without label
- `svelte-store-aria` - ARIA from store without subscription

**Critical for:** Svelte applications

---

## Production Hardening (Sprint 14)

### 30. ColorContrastAnalyzer
**WCAG:** 1.4.3 (Contrast Minimum)
**Issue Types:** 2
- `insufficient-contrast-ratio` - Text contrast below 4.5:1 (normal) or 3:1 (large)
- `insufficient-contrast-large-text` - Large text contrast below 3:1

**Critical for:** Low vision users, color blindness, readability

---

### 31. LiveRegionAnalyzer
**WCAG:** 4.1.3 (Status Messages)
**Issue Types:** 5
- `live-region-never-updated` - aria-live set but content never changes
- `updates-without-live-region` - Dynamic DOM updates without aria-live
- `incorrect-politeness` - Wrong politeness level (assertive vs polite)
- `redundant-role-alert` - Both role="alert" and aria-live="assertive"
- `invalid-live-region-role` - Invalid role for live region

**Critical for:** Status messages, notifications, dynamic updates

---

### 32. AutocompleteAnalyzer
**WCAG:** 1.3.5 (Identify Input Purpose)
**Issue Types:** 3
- `missing-autocomplete` - Input collects personal data without autocomplete
- `invalid-autocomplete-value` - Invalid autocomplete token
- `autocomplete-off-discouraged` - autocomplete="off" on personal data fields

**Validates:** 53 autocomplete tokens from HTML spec
**Critical for:** Forms, mobile usability, password managers

---

### 33. OrientationLockAnalyzer
**WCAG:** 1.3.4 (Orientation)
**Issue Types:** 3
- `screen-orientation-lock` - Uses Screen Orientation API to lock
- `matchmedia-orientation-restriction` - JavaScript blocks content by orientation
- `css-orientation-lock` - CSS hides content in one orientation

**Critical for:** Mobile accessibility, device-mounted users

---

### 34. TimeoutAnalyzer
**WCAG:** 2.2.1 (Timing Adjustable)
**Issue Types:** 4
- `session-timeout-no-warning` - Session expires without warning (< 20 hours)
- `automatic-redirect-no-control` - setTimeout redirect without user control
- `countdown-timer-no-extension` - Timer without pause/extend mechanism
- `inactivity-timeout-too-short` - Inactivity timeout < 20 hours without data preservation

**Critical for:** Users who need more time, cognitive disabilities

---

### 35. PointerTargetAnalyzer
**WCAG:** 2.5.5 (Level AAA), 2.5.8 (Level AA)
**Issue Types:** 3
- `touch-target-too-small` - Interactive element < 24×24px (AA) or 44×44px (AAA)
- `adjacent-targets-too-close` - Interactive elements without 8px spacing
- `inline-link-insufficient-target` - Inline links without adequate spacing

**Critical for:** Touch devices, motor disabilities, mobile usability

---

## WCAG Coverage

### Level A (Must Have)
- **2.1.1 Keyboard:** KeyboardNavigationAnalyzer, MouseOnlyClickAnalyzer
- **2.1.2 No Keyboard Trap:** KeyboardTrapAnalyzer
- **2.2.1 Timing Adjustable:** TimeoutAnalyzer
- **1.1.1 Non-text Content:** AltTextAnalyzer
- **1.3.1 Info and Relationships:** HeadingStructureAnalyzer, LandmarkStructureAnalyzer, FormLabelAnalyzer, TableAccessibilityAnalyzer
- **3.1.1 Language of Page:** LanguageAttributeAnalyzer
- **4.1.2 Name, Role, Value:** ARIASemanticAnalyzer, WidgetPatternAnalyzer, many others

### Level AA (Should Have)
- **1.3.4 Orientation:** OrientationLockAnalyzer
- **1.3.5 Identify Input Purpose:** AutocompleteAnalyzer
- **1.4.3 Contrast (Minimum):** ColorContrastAnalyzer
- **2.4.3 Focus Order:** FocusOrderConflictAnalyzer
- **2.4.4 Link Purpose (In Context):** LinkTextAnalyzer
- **2.4.6 Headings and Labels:** HeadingStructureAnalyzer
- **2.4.7 Focus Visible:** FocusManagementAnalyzer, VisibilityFocusConflictAnalyzer
- **2.5.8 Target Size (Minimum):** PointerTargetAnalyzer (24×24px)
- **4.1.3 Status Messages:** LiveRegionAnalyzer

### Level AAA (Best Practice)
- **2.5.5 Target Size:** PointerTargetAnalyzer (44×44px)
- **2.1.4 Character Key Shortcuts:** SingleLetterShortcutAnalyzer

---

## Issue Severity Levels

### Error (Must Fix)
- WCAG Level A violations
- Completely inaccessible features
- Critical barriers to access
- Examples: missing alt text, keyboard traps, invalid ARIA

### Warning (Should Fix)
- WCAG Level AA violations
- Usability barriers
- Incomplete implementations
- Examples: focus management issues, poor contrast, missing labels

### Info (Consider Fixing)
- WCAG Level AAA recommendations
- Best practices
- Code quality improvements
- Examples: deprecated APIs, optimization suggestions, edge cases

---

## Implementation Status

**All 35 analyzers: ✅ IMPLEMENTED**

Each analyzer includes:
- ✅ Multi-model analysis (DOM + JavaScript + CSS + ARIA)
- ✅ Cross-file pattern detection
- ✅ Actionable fix recommendations
- ✅ WCAG criteria mapping
- ✅ Confidence scoring
- ✅ Framework-specific enhancements (where applicable)
- ✅ Comprehensive test coverage
- ✅ VS Code extension integration
- ✅ Playground integration

---

## Testing Coverage

**Test Files:** 35+ comprehensive test files
**Test Cases:** 500+ test scenarios
**Coverage:** All issue types, compliant examples, edge cases

Each test file includes:
- Error examples (violations)
- Warning examples (usability issues)
- Info examples (recommendations)
- Compliant examples (correct implementations)
- Edge cases and exceptions
- Framework-specific patterns (where applicable)

---

## Usage

### VS Code Extension
All 35 analyzers run automatically on HTML, JavaScript, TypeScript, JSX, TSX, Vue, and Svelte files.

### Playground
All 35 analyzers available in Paradise Playground for live testing and experimentation.

### API
```typescript
import { AnalyzerName } from 'paradise-a11y';

const analyzer = new AnalyzerName();
const issues = analyzer.analyze(context);
```

---

## Future Enhancements

### Planned Features
- Real-time analysis in playground
- Fix auto-application
- Batch analysis across projects
- Custom rule configuration
- Suppression comments
- Baseline management

### Research Areas
- AI-powered fix generation
- Semantic accessibility scoring
- Visual regression testing
- Runtime analysis integration
- Accessibility metrics dashboard

---

**Last Updated:** January 2026
**Version:** 1.0
**Maintainer:** Paradise Development Team
