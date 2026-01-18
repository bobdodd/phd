# Potential Keyboard Trap

**Issue Type:** `potential-keyboard-trap`
**Severity:** Warning
**WCAG:** 2.1.2 (No Keyboard Trap)

## Description

When Tab key navigation is intercepted with `preventDefault()` without providing an Escape key exit mechanism, keyboard users can become trapped in a component. They cannot navigate away using standard keyboard controls, violating WCAG 2.1.2 (No Keyboard Trap). Every focus trap must provide a clear exit mechanism.

## The Problem

```javascript
// ❌ Bad: Tab intercepted without Escape exit
element.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    focusNextItemInTrap();
    // User is trapped - no way to exit!
  }
});

// ❌ Bad: Modal with focus trap but no Escape handler
function createModal() {
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      // Cycle focus within modal
      cycleFocusWithinModal();
    }
    // Missing: Escape to close modal
  });
}

// ❌ Bad: Custom dropdown that traps focus
dropdown.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    return; // Blocks Tab entirely
  }
});
```

**Why this is a problem:**
- Keyboard users cannot navigate away from the component
- Violates WCAG 2.1.2 (No Keyboard Trap) - Level A
- Creates frustrating user experience
- May require page reload to escape
- Screen reader users become stranded

## The Solution

Always provide an Escape key handler when intercepting Tab navigation.

```javascript
// ✅ Good: Focus trap with Escape exit
element.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    focusNextItemInTrap();
  } else if (event.key === 'Escape') {
    // Allow user to escape the trap
    closeComponent();
  }
});

// ✅ Good: Modal with proper focus trap
function createModal() {
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();

      if (event.shiftKey) {
        focusPreviousElement();
      } else {
        focusNextElement();
      }
    } else if (event.key === 'Escape') {
      closeModal();
      restorePreviousFocus();
    }
  });
}

// ✅ Good: Dropdown with Escape to close
dropdown.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    focusNextOption();
  } else if (event.key === 'Escape') {
    closeDropdown();
    returnFocusToTrigger();
  }
});
```

## Common Patterns

### 1. Modal Dialog with Focus Trap

```javascript
// ✅ Complete modal implementation
class Modal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.previousFocus = null;
    this.setupFocusTrap();
  }

  open() {
    this.previousFocus = document.activeElement;
    this.modal.classList.add('open');
    this.focusFirstElement();
  }

  close() {
    this.modal.classList.remove('open');
    this.previousFocus?.focus();
  }

  setupFocusTrap() {
    this.modal.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        event.preventDefault();

        const focusableElements = this.getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift+Tab: wrap to last element
          if (document.activeElement === firstElement) {
            lastElement.focus();
          } else {
            this.focusPreviousElement();
          }
        } else {
          // Tab: wrap to first element
          if (document.activeElement === lastElement) {
            firstElement.focus();
          } else {
            this.focusNextElement();
          }
        }
      } else if (event.key === 'Escape') {
        // Critical: Allow user to escape
        this.close();
      }
    });
  }

  getFocusableElements() {
    return Array.from(
      this.modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }
}
```

### 2. Custom Combobox/Autocomplete

```javascript
// ✅ Combobox with proper keyboard handling
class Combobox {
  constructor(input, listbox) {
    this.input = input;
    this.listbox = listbox;
    this.setupKeyboard();
  }

  setupKeyboard() {
    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.openListbox();
        this.focusFirstOption();
      } else if (event.key === 'Escape') {
        // Allow escape from combobox
        this.closeListbox();
      }
    });

    this.listbox.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        // Allow Tab to exit listbox naturally
        this.closeListbox();
      } else if (event.key === 'Escape') {
        // Escape closes and returns to input
        this.closeListbox();
        this.input.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusNextOption();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusPreviousOption();
      }
    });
  }
}
```

### 3. Toolbar with Roving Tabindex

```javascript
// ✅ Toolbar with escape mechanism
class Toolbar {
  constructor(toolbarElement) {
    this.toolbar = toolbarElement;
    this.currentIndex = 0;
    this.setupKeyboard();
  }

  setupKeyboard() {
    this.toolbar.addEventListener('keydown', (event) => {
      const items = this.getToolbarItems();

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.currentIndex = (this.currentIndex + 1) % items.length;
        items[this.currentIndex].focus();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.currentIndex = (this.currentIndex - 1 + items.length) % items.length;
        items[this.currentIndex].focus();
      } else if (event.key === 'Tab' && !event.shiftKey) {
        // Allow Tab to exit toolbar (move to next focusable outside)
        // Don't preventDefault - let natural focus order work
      } else if (event.key === 'Escape') {
        // Escape returns focus to page content
        document.getElementById('main-content')?.focus();
      }
    });
  }
}
```

## React Example

```typescript
// ✅ React modal with focus trap and Escape
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // Critical: Escape exits modal
          onClose();
        } else if (event.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

## Testing

### Manual Testing

1. **Enter the Focus Trap:**
   - Tab to the component
   - Verify you can navigate within it

2. **Try to Escape:**
   - Press Escape key
   - Verify the component closes or releases focus
   - Verify focus returns to a logical location

3. **Test Tab Behavior:**
   - Press Tab repeatedly
   - Verify focus cycles within trap (if modal)
   - Or verify Tab eventually exits (if not modal)

4. **Screen Reader Testing:**
   - Use NVDA/JAWS/VoiceOver
   - Verify you can navigate into and out of the component
   - Verify screen reader announces the escape mechanism

### Automated Testing

```javascript
describe('Focus trap with escape', () => {
  it('should allow escape with Escape key', () => {
    const modal = new Modal(document.getElementById('modal'));
    modal.open();

    // Simulate Escape key
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    // Modal should close
    expect(modal.isOpen()).toBe(false);
  });

  it('should trap Tab key within modal', () => {
    const modal = new Modal(document.getElementById('modal'));
    modal.open();

    const focusableElements = modal.getFocusableElements();
    const lastElement = focusableElements[focusableElements.length - 1];
    lastElement.focus();

    // Simulate Tab key at last element
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    lastElement.dispatchEvent(tabEvent);

    // Focus should wrap to first element
    expect(document.activeElement).toBe(focusableElements[0]);
  });
});
```

## Quick Fix

Paradise provides a template for adding Escape handler:

```javascript
// Add this alongside your Tab handler
element.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    // Allow user to escape the trapped focus
    closeComponent();

    // Optional: restore previous focus
    previousActiveElement?.focus();
  }
});
```

## Best Practices

1. **Always Provide Escape:** Every focus trap needs an Escape key exit
2. **Restore Focus:** Return focus to logical location when exiting
3. **Document Exit Method:** Announce escape mechanism to screen readers
4. **Consider Alt Exits:** Click outside, close button, etc.
5. **Test Thoroughly:** Verify escape works in all scenarios

## Related Issues

- [missing-escape-handler](./missing-escape-handler.md) - Modal without Escape key
- [focus-restoration-missing](./focus-restoration-missing.md) - Missing focus restoration
- [tab-without-shift](./tab-without-shift.md) - Tab without Shift+Tab handling

## Additional Resources

- [WCAG 2.1.2: No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap)
- [ARIA Authoring Practices: Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [MDN: Keyboard-navigable JavaScript widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
