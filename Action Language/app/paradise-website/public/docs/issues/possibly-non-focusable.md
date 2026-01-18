# Possibly Non-Focusable Element

**Issue Type:** `possibly-non-focusable`
**Severity:** Warning (or Info if element not in DOM)
**WCAG:** 2.4.3 (Focus Order), 4.1.2 (Name, Role, Value)

## Description

Calling `.focus()` on an element that is not focusable will silently fail, doing nothing. This creates confusion for keyboard users who expect focus to move but experience no change. Elements must be naturally focusable (buttons, links, inputs) or have `tabindex="0"` or higher to receive focus programmatically.

## The Problem

```javascript
// ❌ Bad: Trying to focus a <div> without tabindex
function highlightSection() {
  const section = document.querySelector('.content-section');
  section.focus(); // Silently fails - divs aren't focusable
}

// ❌ Bad: Focusing a <span> without tabindex
function showTooltip(spanId) {
  const span = document.getElementById(spanId);
  span.focus(); // Doesn't work - spans aren't focusable
}

// ❌ Bad: Generic element without checking focusability
function focusElement(selector) {
  const element = document.querySelector(selector);
  element.focus(); // May or may not work depending on element type
}
```

**Why this is a problem:**
- `.focus()` fails silently with no error
- Keyboard users don't see expected focus movement
- Screen readers don't announce the "focused" content
- Breaks expected interaction patterns
- Can make keyboard navigation appear broken

## The Solution

### Option 1: Use Naturally Focusable Elements

Use elements that are naturally focusable:

```javascript
// ✅ Good: Using naturally focusable elements
function highlightSection() {
  // Use a button or link instead
  const sectionButton = document.querySelector('.content-section button');
  sectionButton?.focus();
}

// ✅ Good: Focus a form element
function focusFirstInput() {
  const input = document.querySelector('form input');
  input?.focus(); // Inputs are naturally focusable
}
```

**Naturally focusable elements:**
- `<a href="...">` (only with href attribute)
- `<button>`
- `<input>` (except `type="hidden"`)
- `<select>`
- `<textarea>`
- `<iframe>`
- Elements with `contenteditable="true"`

### Option 2: Add tabindex to Make Elements Focusable

```javascript
// ✅ Good: Add tabindex to div
function makeContentFocusable() {
  const section = document.querySelector('.content-section');

  // Make focusable by adding tabindex
  section.setAttribute('tabindex', '-1'); // Focusable via JS only
  // or
  section.setAttribute('tabindex', '0'); // Focusable via JS and Tab key

  // Now .focus() will work
  section.focus();
}

// ✅ Good: Check and fix focusability before focusing
function safeFocus(element) {
  // Check if element is focusable
  const isFocusable =
    element.tabIndex >= 0 ||
    ['a', 'button', 'input', 'select', 'textarea'].includes(
      element.tagName.toLowerCase()
    );

  if (!isFocusable) {
    // Make focusable
    element.setAttribute('tabindex', '-1');
  }

  element.focus();
}
```

### Option 3: Use ARIA Roles Appropriately

```javascript
// ✅ Good: Landmark regions with tabindex
function focusMainContent() {
  const main = document.querySelector('main');

  // Landmarks should be focusable for skip links
  if (!main.hasAttribute('tabindex')) {
    main.setAttribute('tabindex', '-1');
  }

  main.focus();
}

// ✅ Good: Custom widget with proper role
function initCustomCombobox() {
  const combobox = document.querySelector('.custom-combobox');

  combobox.setAttribute('role', 'combobox');
  combobox.setAttribute('tabindex', '0'); // Make focusable
  combobox.setAttribute('aria-expanded', 'false');

  // Now .focus() will work
  combobox.focus();
}
```

## Common Patterns

### 1. Skip Links to Main Content

```javascript
// ✅ Skip link implementation
function setupSkipLink() {
  const skipLink = document.getElementById('skip-to-main');
  const mainContent = document.querySelector('main');

  // Ensure main is focusable
  if (!mainContent.hasAttribute('tabindex')) {
    mainContent.setAttribute('tabindex', '-1');
  }

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.focus();
  });
}
```

### 2. Focus Management in Modals

```javascript
// ✅ Modal focus with fallback
function openModal() {
  const modal = document.querySelector('.modal');
  const firstButton = modal.querySelector('button');
  const modalContainer = modal.querySelector('.modal-content');

  modal.classList.add('open');

  // Try to focus first interactive element
  if (firstButton) {
    firstButton.focus();
  } else {
    // Fallback: focus modal container
    if (!modalContainer.hasAttribute('tabindex')) {
      modalContainer.setAttribute('tabindex', '-1');
    }
    modalContainer.focus();
  }
}
```

### 3. Programmatic Scrolling with Focus

```javascript
// ✅ Scroll and focus section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);

  // Ensure section is focusable for screen readers
  if (!section.hasAttribute('tabindex')) {
    section.setAttribute('tabindex', '-1');
  }

  // Scroll and focus
  section.scrollIntoView({ behavior: 'smooth' });
  section.focus();

  // Optional: Remove tabindex after focus (if not needed for tab order)
  section.addEventListener('blur', () => {
    section.removeAttribute('tabindex');
  }, { once: true });
}
```

### 4. Custom Interactive Widgets

```javascript
// ✅ Custom slider with proper focus
function initCustomSlider() {
  const slider = document.querySelector('.custom-slider');

  // Set up ARIA
  slider.setAttribute('role', 'slider');
  slider.setAttribute('tabindex', '0');
  slider.setAttribute('aria-valuemin', '0');
  slider.setAttribute('aria-valuemax', '100');
  slider.setAttribute('aria-valuenow', '50');

  // Add keyboard support
  slider.addEventListener('keydown', (e) => {
    // Arrow keys to adjust value
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      increaseValue(slider);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      decreaseValue(slider);
    }
  });

  // Now .focus() will work and keyboard interaction is supported
  slider.focus();
}
```

## tabindex Values

Understanding `tabindex` values:

```javascript
// tabindex="-1": Focusable programmatically, not in tab order
element.setAttribute('tabindex', '-1');
element.focus(); // Works
// Tab key skips this element

// tabindex="0": Focusable programmatically and via Tab key
element.setAttribute('tabindex', '0');
element.focus(); // Works
// Tab key includes this element in natural order

// tabindex="1+" (positive): DON'T USE - breaks tab order
// Positive tabindex creates unpredictable focus order
```

**Best Practice:**
- Use `tabindex="-1"` for programmatic focus only (skip links, error messages)
- Use `tabindex="0"` for custom interactive widgets
- NEVER use positive tabindex values

## Testing

### Manual Testing

1. **Focus Test:**
   - Call `.focus()` on the element
   - Verify visible focus indicator appears
   - Tab away and back to verify tab order

2. **Keyboard Navigation:**
   - Use only keyboard to navigate
   - Verify element receives focus when expected
   - Check focus indicator is clearly visible

3. **Screen Reader Testing:**
   - Use screen reader to navigate to element
   - Verify screen reader announces element correctly
   - Check role and state are appropriate

### Automated Testing

```javascript
describe('Element focusability', () => {
  it('should focus naturally focusable elements', () => {
    const button = document.querySelector('button');
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('should focus elements with tabindex', () => {
    const div = document.querySelector('.focusable-div');
    div.setAttribute('tabindex', '-1');
    div.focus();
    expect(document.activeElement).toBe(div);
  });

  it('should not focus elements without tabindex', () => {
    const div = document.querySelector('.regular-div');
    const previousFocus = document.activeElement;

    div.focus(); // Should fail silently

    expect(document.activeElement).toBe(previousFocus); // Focus unchanged
  });
});
```

## Quick Fix

Paradise can suggest adding `tabindex`:

```javascript
// Before:
container.focus();

// After fix:
// Add tabindex to make container focusable
container.setAttribute('tabindex', '-1');
container.focus();
```

## Related Issues

- [focus-order-conflict](./focus-order-conflict.md) - Positive tabindex issues
- [visibility-focus-conflict](./visibility-focus-conflict.md) - Hidden but focusable elements
- [removal-without-focus-management](./removal-without-focus-management.md) - Focus management on removal

## Additional Resources

- [WCAG 2.4.3: Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)
- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
- [MDN: HTMLElement.focus()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)
- [MDN: tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
