# Standalone Blur Without Focus Movement

**Issue Type:** `standalone-blur`
**Severity:** Info
**WCAG:** 2.4.7 (Focus Visible)

## Description

Calling `.blur()` removes focus from an element without explicitly moving it elsewhere. While focus will move to the document body by default, this creates an unpredictable experience for keyboard users. It's better to explicitly move focus to a specific element using `.focus()` so users maintain their position in the page.

## The Problem

```javascript
// ❌ Bad: blur() without moving focus
function deselectInput() {
  const input = document.querySelector('input');
  input.blur(); // Focus moves to body - user loses position
}

// ❌ Bad: blur() in event handler
function handleEscape(e) {
  if (e.key === 'Escape') {
    e.target.blur(); // Where does focus go? Unclear.
  }
}

// ❌ Bad: blur() without context
function validateField(fieldId) {
  const field = document.getElementById(fieldId);

  if (!isValid(field.value)) {
    showError(fieldId);
    field.blur(); // Focus lost, hard to fix error
  }
}
```

**Why this can be problematic:**
- Focus moves to `document.body` (top of page)
- Keyboard users lose their position
- Tab key may jump unexpectedly
- Screen readers may not announce where focus went
- Creates unpredictable user experience

## The Solution

Instead of using `.blur()` alone, explicitly move focus to another element using `.focus()`.

```javascript
// ✅ Good: Move focus to specific element
function deselectInput() {
  const input = document.querySelector('input');
  const submitButton = document.getElementById('submit-btn');

  // Explicitly move focus
  submitButton.focus();
  // No need for .blur() - focus() handles it
}

// ✅ Good: Move focus to next field
function handleEscape(e) {
  if (e.key === 'Escape') {
    const nextField = findNextFocusableElement(e.target);
    if (nextField) {
      nextField.focus();
    } else {
      // Fallback to known safe location
      document.getElementById('main-content')?.focus();
    }
  }
}

// ✅ Good: Focus error message
function validateField(fieldId) {
  const field = document.getElementById(fieldId);

  if (!isValid(field.value)) {
    const errorMsg = showError(fieldId);

    // Make error focusable and focus it
    errorMsg.setAttribute('tabindex', '-1');
    errorMsg.focus();

    // User can read error and easily return to field
  }
}
```

## When blur() is Acceptable

There are legitimate cases where `.blur()` without explicit focus movement is okay:

### 1. Auto-Dismiss Temporary UI

```javascript
// ✅ Acceptable: Auto-dismiss search suggestions
function dismissSuggestions() {
  const searchInput = document.getElementById('search');
  const suggestions = document.querySelector('.suggestions');

  // Blur input, let focus return naturally
  searchInput.blur();
  suggestions.hidden = true;

  // OK because it's temporary UI that auto-dismisses
}
```

### 2. Clicking Outside Interactive Element

```javascript
// ✅ Acceptable: Click outside to deselect
document.addEventListener('click', (e) => {
  const activeElement = document.activeElement;

  if (activeElement && !e.target.contains(activeElement)) {
    // User clicked elsewhere, let them focus that
    activeElement.blur();
  }
});
```

### 3. Intentional "No Focus" State

```javascript
// ✅ Acceptable: Deliberately remove focus for presentation mode
function enterPresentationMode() {
  const controls = document.querySelectorAll('button, a, input');

  // Save current focus for restoration
  const previousFocus = document.activeElement;
  document.body.dataset.previousFocus = previousFocus.id;

  // Remove focus for clean presentation
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

function exitPresentationMode() {
  const previousFocusId = document.body.dataset.previousFocus;
  const previousFocus = document.getElementById(previousFocusId);

  // Restore focus
  previousFocus?.focus();
}
```

## Better Alternatives to blur()

### Alternative 1: Just Use focus()

```javascript
// Instead of this:
currentElement.blur();
nextElement.focus();

// Just do this:
nextElement.focus(); // Implicitly blurs current element
```

### Alternative 2: Focus Management Pattern

```javascript
// ✅ Focus manager utility
function moveFocus(from, to) {
  if (to instanceof HTMLElement) {
    to.focus();
    return true;
  }
  return false;
}

// Usage
moveFocus(input, submitButton);
// No .blur() needed
```

### Alternative 3: Focus Trap Pattern

```javascript
// ✅ Focus trap in modal
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus(); // Wrap to end
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus(); // Wrap to start
      }
    }
  });
}
```

## Common Patterns

### 1. Form Validation with Error Focus

```javascript
// ✅ Validate and focus error
function validateForm() {
  const requiredFields = document.querySelectorAll('[required]');

  for (const field of requiredFields) {
    if (!field.value) {
      // Show error and focus it
      const error = document.createElement('div');
      error.className = 'error-message';
      error.textContent = `${field.name} is required`;
      error.setAttribute('tabindex', '-1');

      field.parentNode.insertBefore(error, field);
      error.focus(); // Focus error, not blur field

      return false;
    }
  }

  return true;
}
```

### 2. Custom Dropdown Close

```javascript
// ✅ Close dropdown and restore focus
function closeDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const trigger = document.querySelector(`[aria-controls="${dropdownId}"]`);

  dropdown.hidden = true;

  // Return focus to trigger
  trigger?.focus();
  // No .blur() needed
}
```

### 3. Modal Close with Focus Restoration

```javascript
// ✅ Close modal with proper focus management
function closeModal() {
  const modal = document.querySelector('.modal');
  const trigger = modal.dataset.trigger;

  modal.classList.remove('open');

  // Restore focus to trigger
  if (trigger) {
    document.getElementById(trigger)?.focus();
  } else {
    document.getElementById('main-content')?.focus();
  }
  // No .blur() needed
}
```

### 4. Search with Suggestion List

```javascript
// ✅ Search with keyboard navigation
function handleSearchKeydown(e) {
  const searchInput = e.target;
  const suggestions = document.querySelector('.search-suggestions');
  const firstSuggestion = suggestions.querySelector('a');

  if (e.key === 'ArrowDown' && firstSuggestion) {
    e.preventDefault();
    firstSuggestion.focus(); // Move to suggestions
    // No need to blur input
  } else if (e.key === 'Escape') {
    suggestions.hidden = true;
    searchInput.focus(); // Keep on input
  }
}
```

## Testing

### Manual Testing

1. **Keyboard Flow:**
   - Navigate to element
   - Trigger blur condition
   - Note where focus moves
   - Verify it's a logical location
   - Continue tabbing to verify order

2. **Screen Reader Testing:**
   - Navigate to element
   - Trigger blur
   - Verify screen reader announces new focus location
   - Verify user maintains context

### Automated Testing

```javascript
describe('Focus movement instead of blur', () => {
  it('should move focus explicitly', () => {
    const input = document.getElementById('input');
    const button = document.getElementById('submit');

    input.focus();
    expect(document.activeElement).toBe(input);

    // Instead of input.blur(), use button.focus()
    button.focus();

    expect(document.activeElement).toBe(button);
  });

  it('should not leave focus on body', () => {
    const input = document.getElementById('input');

    input.focus();

    // Bad pattern - don't do this
    input.blur();

    // Focus should not be on body in well-designed interactions
    expect(document.activeElement).not.toBe(document.body);
  });
});
```

## Why Info Severity?

This issue is marked as **Info** rather than Warning because:

1. **Not Always Wrong**: `.blur()` has legitimate uses
2. **Context Dependent**: May be appropriate in some scenarios
3. **Defaults Work**: Focus moving to body isn't always problematic
4. **Low Impact**: Usually doesn't break functionality completely

**When to fix:** If keyboard users or screen reader users would benefit from focus moving to a specific element rather than the document body.

## Quick Fix

Paradise suggests using explicit `.focus()` calls:

```javascript
// Before:
element.blur();

// After fix suggestion:
// Move focus to specific element instead
otherElement.focus();
// .blur() not needed - .focus() handles it
```

## Related Issues

- [removal-without-focus-management](./removal-without-focus-management.md) - Managing focus when removing elements
- [hiding-without-focus-management](./hiding-without-focus-management.md) - Managing focus when hiding elements
- [focus-restoration-missing](./focus-restoration-missing.md) - Modal focus restoration

## Additional Resources

- [WCAG 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)
- [MDN: HTMLElement.blur()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/blur)
- [MDN: HTMLElement.focus()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
