# Removal Without Focus Management

**Issue Type:** `removal-without-focus-management`
**Severity:** Warning
**WCAG:** 2.4.3 (Focus Order), 2.4.7 (Focus Visible)

## Description

Removing a DOM element without checking if it (or any of its descendants) has focus will cause keyboard users to lose their place in the page. When focus is lost, keyboard navigation typically resets to the top of the document, forcing users to navigate through the entire page again to reach their previous position.

## The Problem

```javascript
// ❌ Bad: Removes element without checking focus
function closePanel() {
  const panel = document.querySelector('.sidebar-panel');
  panel.remove(); // If panel or its children have focus, user loses their place
}

// ❌ Bad: Removes element with button inside that may have focus
function removeCard(cardId) {
  const card = document.getElementById(cardId);
  card.remove(); // Button inside the card might have focus
}
```

**Why this is a problem:**
- Keyboard users lose their position in the page
- Screen reader users must re-navigate from the beginning
- Creates confusion and frustration
- Violates WCAG 2.4.3 (Focus Order) and 2.4.7 (Focus Visible)

## The Solution

Always check if the element (or its descendants) has focus before removing it. If it does, move focus to an appropriate location first.

```javascript
// ✅ Good: Checks focus before removal
function closePanel() {
  const panel = document.querySelector('.sidebar-panel');

  // Check if panel or its children have focus
  if (panel.contains(document.activeElement)) {
    // Move focus to a logical location
    // Option 1: Focus a sibling element
    const previousFocusable = panel.previousElementSibling;
    if (previousFocusable instanceof HTMLElement) {
      previousFocusable.focus();
    } else {
      // Option 2: Focus a known fallback element
      document.getElementById('main-content')?.focus();
    }
  }

  panel.remove();
}

// ✅ Good: Moves focus to card's container
function removeCard(cardId) {
  const card = document.getElementById(cardId);
  const container = card.parentElement;

  if (card.contains(document.activeElement)) {
    // Find next card to focus
    const nextCard = card.nextElementSibling || card.previousElementSibling;

    if (nextCard instanceof HTMLElement) {
      // Focus interactive element within next card
      const focusable = nextCard.querySelector('button, a, [tabindex="0"]');
      (focusable as HTMLElement)?.focus();
    } else {
      // No other cards, focus container
      (container as HTMLElement)?.focus();
    }
  }

  card.remove();
}
```

## Common Patterns

### 1. Removing Modal/Dialog Content

```javascript
// ✅ Proper focus management for modal
function closeModal() {
  const modal = document.querySelector('.modal');

  // Store the element that opened the modal
  const triggerButton = document.getElementById('open-modal-btn');

  if (modal.contains(document.activeElement)) {
    // Return focus to trigger
    triggerButton?.focus();
  }

  modal.remove();
}
```

### 2. Removing List Items

```javascript
// ✅ Focus management for list item removal
function removeListItem(itemId) {
  const item = document.getElementById(itemId);
  const list = item.parentElement;

  if (item.contains(document.activeElement)) {
    // Focus next or previous item
    const next = item.nextElementSibling as HTMLElement;
    const prev = item.previousElementSibling as HTMLElement;

    if (next) {
      next.querySelector('button')?.focus();
    } else if (prev) {
      prev.querySelector('button')?.focus();
    } else {
      // Last item, focus add button or list container
      document.getElementById('add-item-btn')?.focus();
    }
  }

  item.remove();
}
```

### 3. Removing Notification Toast

```javascript
// ✅ Focus management for notifications
function dismissNotification(notificationId) {
  const notification = document.getElementById(notificationId);

  // If notification had focus, return to main content
  if (notification.contains(document.activeElement)) {
    // Don't steal focus for auto-dismissing notifications
    // Let focus naturally return to where it was
    document.body.focus();
  }

  notification.remove();
}
```

## Testing

### Manual Testing

1. **Keyboard Navigation:**
   - Navigate to an interactive element inside the component
   - Trigger the removal
   - Verify focus moves to a logical location
   - Verify you don't lose your place in the page

2. **Screen Reader Testing:**
   - Navigate with screen reader to element
   - Trigger removal
   - Verify screen reader announces the new focus location
   - Verify context is maintained

### Automated Testing

```javascript
describe('Focus management on removal', () => {
  it('should move focus when removing element with focus', () => {
    const panel = document.querySelector('.panel');
    const button = panel.querySelector('button');
    const fallback = document.getElementById('main-content');

    // Focus button inside panel
    button.focus();
    expect(document.activeElement).toBe(button);

    // Remove panel
    closePanel();

    // Focus should move to fallback
    expect(document.activeElement).toBe(fallback);
  });

  it('should not move focus when removing unfocused element', () => {
    const otherButton = document.getElementById('other-button');
    otherButton.focus();

    const panel = document.querySelector('.panel');
    closePanel();

    // Focus should stay on other button
    expect(document.activeElement).toBe(otherButton);
  });
});
```

## Quick Fix

Paradise can automatically add focus checking code:

```javascript
// Before:
element.remove();

// After fix:
const element = document.querySelector('.element');
if (element && element.contains(document.activeElement)) {
  // Move focus before removing
  const nextFocusable = element.previousElementSibling || element.parentElement;
  if (nextFocusable instanceof HTMLElement) {
    nextFocusable.focus();
  }
}
element.remove();
```

## Related Issues

- [hiding-without-focus-management](./hiding-without-focus-management.md) - Similar issue for hiding elements
- [focus-restoration-missing](./focus-restoration-missing.md) - Modal-specific focus restoration

## Additional Resources

- [WCAG 2.4.3: Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)
- [WCAG 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)
- [MDN: Element.remove()](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove)
- [MDN: Document.activeElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement)
