# Tab Without Shift

**Issue Type:** `tab-without-shift`
**Severity:** Info
**WCAG:** 2.1.1 (Keyboard)

## Description

When handling Tab key navigation, you must also handle Shift+Tab for reverse navigation. Tab moves focus forward, while Shift+Tab moves focus backward. If your code only handles Tab without considering Shift+Tab, keyboard users cannot navigate backward through interactive elements, creating a frustrating one-directional navigation experience.

## The Problem

```javascript
// ❌ Bad: Only handles Tab, not Shift+Tab
element.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    focusNextElement();
    // User can't go backward!
  }
});

// ❌ Bad: Focus trap without reverse navigation
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    const focusableElements = getFocusableElements();
    const currentIndex = findCurrentIndex();
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex].focus();
    // No way to go backward with Shift+Tab!
  }
});

// ❌ Bad: Custom tabindex navigation without reverse
container.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    moveToNextCustomElement();
    // Shift+Tab will break out of container
  }
});
```

**Why this is a problem:**
- Keyboard users cannot navigate backward
- Forces users to cycle through all elements to go back
- Violates user expectations (Shift+Tab is universal)
- Creates accessibility barriers
- Frustrating user experience
- May trap users in focus loops

## The Solution

Always check `event.shiftKey` to handle both forward and backward Tab navigation.

```javascript
// ✅ Good: Handles both Tab and Shift+Tab
element.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();

    if (event.shiftKey) {
      focusPreviousElement();  // Shift+Tab = backward
    } else {
      focusNextElement();      // Tab = forward
    }
  }
});

// ✅ Good: Focus trap with bidirectional navigation
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();

    const focusableElements = getFocusableElements();
    const currentIndex = findCurrentIndex();

    if (event.shiftKey) {
      // Shift+Tab: go backward
      const prevIndex = currentIndex === 0
        ? focusableElements.length - 1
        : currentIndex - 1;
      focusableElements[prevIndex].focus();
    } else {
      // Tab: go forward
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      focusableElements[nextIndex].focus();
    }
  }
});

// ✅ Good: Custom navigation with reverse support
container.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();

    if (event.shiftKey) {
      moveToPreviousCustomElement();
    } else {
      moveToNextCustomElement();
    }
  }
});
```

## Common Patterns

### 1. Modal Focus Trap

```javascript
// ✅ Complete modal focus trap with bidirectional navigation
class ModalFocusTrap {
  constructor(modalElement) {
    this.modal = modalElement;
    this.previousFocus = null;
    this.setupFocusTrap();
  }

  open() {
    this.previousFocus = document.activeElement;
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.showModal();
    this.focusFirstElement();
  }

  close() {
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.close();
    this.previousFocus?.focus();
  }

  setupFocusTrap() {
    this.modal.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const focusableElements = this.getFocusableElements();

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentElement = document.activeElement;

        if (event.shiftKey) {
          // Shift+Tab: moving backward
          if (currentElement === firstElement) {
            event.preventDefault();
            lastElement.focus();  // Wrap to end
          }
        } else {
          // Tab: moving forward
          if (currentElement === lastElement) {
            event.preventDefault();
            firstElement.focus();  // Wrap to beginning
          }
        }
      } else if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  getFocusableElements() {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(this.modal.querySelectorAll(selector));
  }

  focusFirstElement() {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
}
```

### 2. Roving Tabindex with Tab Navigation

```javascript
// ✅ Toolbar with roving tabindex and Tab/Shift+Tab support
class RovingTabindexToolbar {
  constructor(toolbarElement) {
    this.toolbar = toolbarElement;
    this.currentIndex = 0;
    this.items = [];
    this.init();
  }

  init() {
    this.items = Array.from(
      this.toolbar.querySelectorAll('[role="button"], button')
    );

    if (this.items.length === 0) return;

    // Set initial tabindex
    this.items.forEach((item, index) => {
      item.tabIndex = index === 0 ? 0 : -1;
    });

    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    this.toolbar.addEventListener('keydown', (event) => {
      const { key, shiftKey } = event;

      // Arrow key navigation (within toolbar)
      if (key === 'ArrowRight') {
        event.preventDefault();
        this.focusNext();
      } else if (key === 'ArrowLeft') {
        event.preventDefault();
        this.focusPrevious();
      }

      // Tab/Shift+Tab: exit toolbar
      else if (key === 'Tab') {
        // Don't preventDefault - allow natural Tab behavior
        // This lets Tab/Shift+Tab move focus out of toolbar

        // Update tabindex so returning to toolbar focuses last active item
        this.items.forEach((item, index) => {
          item.tabIndex = index === this.currentIndex ? 0 : -1;
        });
      }
    });
  }

  focusNext() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateFocus();
  }

  focusPrevious() {
    this.currentIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateFocus();
  }

  updateFocus() {
    this.items.forEach((item, index) => {
      item.tabIndex = index === this.currentIndex ? 0 : -1;
    });
    this.items[this.currentIndex].focus();
  }
}
```

### 3. Custom Tab Order

```javascript
// ✅ Custom tab order with bidirectional navigation
class CustomTabOrder {
  constructor(containerElement) {
    this.container = containerElement;
    this.setupCustomOrder();
  }

  setupCustomOrder() {
    // Define custom tab order (could be data-tab-order attribute)
    this.tabOrder = Array.from(
      this.container.querySelectorAll('[data-tab-order]')
    ).sort((a, b) => {
      const orderA = parseInt(a.getAttribute('data-tab-order'), 10);
      const orderB = parseInt(b.getAttribute('data-tab-order'), 10);
      return orderA - orderB;
    });

    this.container.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const currentElement = document.activeElement;
        const currentIndex = this.tabOrder.indexOf(currentElement);

        if (currentIndex === -1) return;

        event.preventDefault();

        if (event.shiftKey) {
          // Shift+Tab: previous element in custom order
          const prevIndex =
            currentIndex === 0
              ? this.tabOrder.length - 1
              : currentIndex - 1;
          this.tabOrder[prevIndex].focus();
        } else {
          // Tab: next element in custom order
          const nextIndex = (currentIndex + 1) % this.tabOrder.length;
          this.tabOrder[nextIndex].focus();
        }
      }
    });
  }
}
```

### 4. Composite Widget (Tabs)

```javascript
// ✅ Tab panel with proper Tab/Shift+Tab handling
class TabPanel {
  constructor(tablistElement) {
    this.tablist = tablistElement;
    this.tabs = Array.from(tablistElement.querySelectorAll('[role="tab"]'));
    this.panels = this.tabs.map(tab =>
      document.getElementById(tab.getAttribute('aria-controls'))
    );
    this.currentIndex = 0;
    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    this.tablist.addEventListener('keydown', (event) => {
      const { key, shiftKey } = event;

      // Arrow keys navigate within tabs
      if (key === 'ArrowRight') {
        event.preventDefault();
        this.selectNextTab();
      } else if (key === 'ArrowLeft') {
        event.preventDefault();
        this.selectPreviousTab();
      } else if (key === 'Home') {
        event.preventDefault();
        this.selectTab(0);
      } else if (key === 'End') {
        event.preventDefault();
        this.selectTab(this.tabs.length - 1);
      }

      // Tab/Shift+Tab: move out of tablist
      else if (key === 'Tab') {
        // Don't preventDefault!
        // Tab: moves to panel content
        // Shift+Tab: moves to previous focusable before tablist

        // No custom handling needed - native Tab behavior works
      }
    });
  }

  selectNextTab() {
    this.currentIndex = (this.currentIndex + 1) % this.tabs.length;
    this.selectTab(this.currentIndex);
  }

  selectPreviousTab() {
    this.currentIndex =
      (this.currentIndex - 1 + this.tabs.length) % this.tabs.length;
    this.selectTab(this.currentIndex);
  }

  selectTab(index) {
    // Update ARIA states
    this.tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
      tab.tabIndex = i === index ? 0 : -1;
    });

    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });

    this.tabs[index].focus();
    this.currentIndex = index;
  }
}
```

### 5. Listbox with Type-Ahead

```javascript
// ✅ Listbox with Tab/Shift+Tab exit and type-ahead
class Listbox {
  constructor(listboxElement) {
    this.listbox = listboxElement;
    this.options = Array.from(listboxElement.querySelectorAll('[role="option"]'));
    this.selectedIndex = 0;
    this.typeAheadBuffer = '';
    this.typeAheadTimeout = null;
    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    this.listbox.addEventListener('keydown', (event) => {
      const { key, shiftKey } = event;

      // Arrow keys for navigation
      if (key === 'ArrowDown') {
        event.preventDefault();
        this.selectNext();
      } else if (key === 'ArrowUp') {
        event.preventDefault();
        this.selectPrevious();
      } else if (key === 'Home') {
        event.preventDefault();
        this.selectFirst();
      } else if (key === 'End') {
        event.preventDefault();
        this.selectLast();
      }

      // Enter/Space to activate
      else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        this.activateSelected();
      }

      // Tab/Shift+Tab: exit listbox
      else if (key === 'Tab') {
        // Don't preventDefault - allow natural focus movement
        // Tab moves to next focusable element
        // Shift+Tab moves to previous focusable element
      }

      // Type-ahead
      else if (key.length === 1 && /[a-z0-9]/i.test(key)) {
        event.preventDefault();
        this.handleTypeAhead(key);
      }
    });
  }

  selectNext() {
    this.selectedIndex = Math.min(
      this.selectedIndex + 1,
      this.options.length - 1
    );
    this.updateSelection();
  }

  selectPrevious() {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    this.updateSelection();
  }

  selectFirst() {
    this.selectedIndex = 0;
    this.updateSelection();
  }

  selectLast() {
    this.selectedIndex = this.options.length - 1;
    this.updateSelection();
  }

  updateSelection() {
    this.options.forEach((option, index) => {
      option.setAttribute(
        'aria-selected',
        index === this.selectedIndex ? 'true' : 'false'
      );
    });
    this.options[this.selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  activateSelected() {
    const selectedOption = this.options[this.selectedIndex];
    selectedOption.click();
  }

  handleTypeAhead(char) {
    clearTimeout(this.typeAheadTimeout);
    this.typeAheadBuffer += char.toLowerCase();

    // Find matching option
    const match = this.options.findIndex(option =>
      option.textContent.toLowerCase().startsWith(this.typeAheadBuffer)
    );

    if (match !== -1) {
      this.selectedIndex = match;
      this.updateSelection();
    }

    // Clear buffer after 500ms
    this.typeAheadTimeout = setTimeout(() => {
      this.typeAheadBuffer = '';
    }, 500);
  }
}
```

## React Example

```typescript
// ✅ React modal with proper Tab/Shift+Tab handling
import { useEffect, useRef, KeyboardEvent } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Save current focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Show modal
    modalRef.current.showModal();

    // Focus first element
    const focusableElements = getFocusableElements(modalRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    return () => {
      // Restore focus on close
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(modalRef.current!);

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentElement = document.activeElement;

      if (event.shiftKey) {
        // Shift+Tab: moving backward
        if (currentElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forward
        if (currentElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={modalRef}
      onKeyDown={handleKeyDown}
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {children}
    </dialog>
  );
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  return Array.from(container.querySelectorAll(selector));
}
```

## Testing

### Manual Testing

1. **Test Forward Navigation:**
   - Tab through all interactive elements
   - Verify focus moves forward correctly

2. **Test Backward Navigation:**
   - Shift+Tab through all interactive elements
   - Verify focus moves backward correctly
   - Ensure no elements are skipped

3. **Test Focus Trap:**
   - Open modal/dialog
   - Tab to last element
   - Press Tab again - should wrap to first element
   - Press Shift+Tab - should wrap to last element

4. **Screen Reader Testing:**
   - Use NVDA/JAWS/VoiceOver
   - Navigate with Tab/Shift+Tab
   - Verify expected behavior

### Automated Testing

```javascript
describe('Tab and Shift+Tab navigation', () => {
  it('should handle both Tab and Shift+Tab', () => {
    const focusNext = jest.fn();
    const focusPrevious = jest.fn();

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
          focusPrevious();
        } else {
          focusNext();
        }
      }
    });

    // Tab (forward)
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: false
    });
    document.dispatchEvent(tabEvent);
    expect(focusNext).toHaveBeenCalled();
    expect(focusPrevious).not.toHaveBeenCalled();

    // Shift+Tab (backward)
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true
    });
    document.dispatchEvent(shiftTabEvent);
    expect(focusPrevious).toHaveBeenCalled();
  });

  it('should wrap focus in modal (forward and backward)', () => {
    const modal = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    const button3 = document.createElement('button');

    modal.append(button1, button2, button3);
    document.body.append(modal);

    button3.focus();

    // Tab at last element should wrap to first
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: false,
      bubbles: true
    });
    button3.dispatchEvent(tabEvent);
    expect(document.activeElement).toBe(button1);

    // Shift+Tab at first element should wrap to last
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true
    });
    button1.dispatchEvent(shiftTabEvent);
    expect(document.activeElement).toBe(button3);
  });
});
```

## Quick Fix

Paradise provides a quick fix template:

```javascript
// Before (Paradise detects this)
if (event.key === 'Tab') {
  event.preventDefault();
  focusNextElement();
}

// After (Paradise suggests)
if (event.key === 'Tab') {
  event.preventDefault();

  if (event.shiftKey) {
    focusPreviousElement();
  } else {
    focusNextElement();
  }
}
```

## Best Practices

1. **Always Check shiftKey:** Every Tab handler must check `event.shiftKey`
2. **Wrap Focus in Modals:** First ↔ Last element wrapping
3. **Don't Trap Unless Necessary:** Only trap focus in modals/dialogs
4. **Test Bidirectional Navigation:** Verify both Tab and Shift+Tab work
5. **Document Tab Behavior:** Explain custom Tab behavior to users
6. **Respect Native Behavior:** Let Tab work naturally when possible

## When NOT to Handle Tab

You should **NOT** prevent default Tab behavior in these cases:

```javascript
// ✅ Good: Let Tab work naturally
const toolbar = document.querySelector('[role="toolbar"]');

toolbar.addEventListener('keydown', (event) => {
  // Handle arrow keys for toolbar navigation
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    focusNextTool();
  }

  // DON'T handle Tab - let it exit toolbar naturally
  // Tab should move to next focusable element outside toolbar
});
```

## Related Issues

- [potential-keyboard-trap](./potential-keyboard-trap.md) - Tab without Escape
- [missing-escape-handler](./missing-escape-handler.md) - Modal without Escape
- [focus-restoration-missing](./focus-restoration-missing.md) - Missing focus restoration

## Additional Resources

- [WCAG 2.1.1: Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)
- [ARIA Authoring Practices: Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [MDN: KeyboardEvent.shiftKey](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
- [Focus Management in Modals](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
