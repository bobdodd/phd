# Missing Escape Handler

**Issue Type:** `missing-escape-handler`
**Severity:** Warning
**WCAG:** 2.1.2 (No Keyboard Trap)

## Description

Modal dialogs and overlays must provide an Escape key handler to allow keyboard users to close them. Without an Escape key exit, keyboard users may become trapped in the modal with no way to dismiss it except by completing the action or reloading the page. This creates a frustrating experience and violates WCAG 2.1.2 (No Keyboard Trap).

## The Problem

```javascript
// ❌ Bad: Modal without Escape handler
function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  modal.querySelector('button').focus();

  // User has no way to close this with keyboard!
}

// ❌ Bad: Dialog with only close button
const dialog = document.querySelector('dialog');
dialog.showModal();

// If close button is hidden or user doesn't find it, they're trapped

// ❌ Bad: Overlay with click-outside only
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    closeOverlay();
  }
});

// Keyboard users can't click outside!

// ❌ Bad: Modal with focus trap but no exit
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    cycleFocusWithinModal();
    // Tab is trapped, but no Escape handler!
  }
});
```

**Why this is a problem:**
- Keyboard users become trapped in modals
- Violates WCAG 2.1.2 (No Keyboard Trap) - Level A
- Forces users to complete unwanted actions
- May require page reload to escape
- Creates frustrating user experience
- Screen reader users may not find close button

**Elements that MUST have Escape handlers:**
- Modal dialogs (`role="dialog"` with `aria-modal="true"`)
- Alert dialogs (`role="alertdialog"`)
- Overlays and lightboxes
- Custom dropdowns and comboboxes
- Slideover panels and drawers
- Fullscreen modes
- Any element that traps focus

## The Solution

Always provide an Escape key handler for modals and overlays.

```javascript
// ✅ Good: Modal with Escape handler
function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');

  const previousFocus = document.activeElement;

  // Escape key handler
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal(modal, previousFocus);
    }
  });

  modal.querySelector('button').focus();
}

function closeModal(modal, previousFocus) {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  previousFocus?.focus();
}

// ✅ Good: Dialog with Escape and close button
const dialog = document.querySelector('dialog');

function openDialog() {
  const previousFocus = document.activeElement;

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDialog(previousFocus);
    }
  }, { once: true });

  dialog.showModal();
}

function closeDialog(previousFocus) {
  dialog.close();
  previousFocus?.focus();
}

// ✅ Good: Overlay with Escape and click-outside
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    closeOverlay();
  }
});

overlay.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeOverlay();
  }
});

// ✅ Good: Focus trap WITH Escape exit
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    cycleFocusWithinModal();
  } else if (event.key === 'Escape') {
    // CRITICAL: Allow user to escape
    closeModal();
  }
});
```

## Common Patterns

### 1. Complete Modal Dialog

```javascript
// ✅ Full modal implementation with Escape handler
class ModalDialog {
  constructor(dialogElement) {
    this.dialog = dialogElement;
    this.previousFocus = null;
    this.onCloseCallback = null;
  }

  open(onClose) {
    this.previousFocus = document.activeElement;
    this.onCloseCallback = onClose;

    // Show modal
    this.dialog.setAttribute('aria-hidden', 'false');
    this.dialog.classList.add('open');

    // Setup keyboard handlers
    this.keydownHandler = this.handleKeyDown.bind(this);
    this.dialog.addEventListener('keydown', this.keydownHandler);

    // Setup close button
    const closeButton = this.dialog.querySelector('[data-close]');
    closeButton?.addEventListener('click', () => this.close());

    // Focus first focusable element
    this.focusFirstElement();
  }

  close() {
    // Hide modal
    this.dialog.setAttribute('aria-hidden', 'true');
    this.dialog.classList.remove('open');

    // Remove event listener
    this.dialog.removeEventListener('keydown', this.keydownHandler);

    // Restore focus
    this.previousFocus?.focus();

    // Call close callback
    this.onCloseCallback?.();
  }

  handleKeyDown(event) {
    // Escape key closes modal
    if (event.key === 'Escape') {
      this.close();
      return;
    }

    // Tab key focus trap
    if (event.key === 'Tab') {
      const focusableElements = this.getFocusableElements();

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift+Tab at first element wraps to last
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab at last element wraps to first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
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

    return Array.from(this.dialog.querySelectorAll(selector));
  }

  focusFirstElement() {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      // No focusable elements, focus the dialog itself
      this.dialog.tabIndex = -1;
      this.dialog.focus();
    }
  }
}

// Usage
const modal = new ModalDialog(document.getElementById('confirm-dialog'));
modal.open(() => {
  console.log('Modal closed');
});
```

### 2. Alert Dialog

```javascript
// ✅ Alert dialog with Escape (only if dismissible)
class AlertDialog {
  constructor(dialogElement, options = {}) {
    this.dialog = dialogElement;
    this.dismissible = options.dismissible ?? true;  // Can be closed with Escape
    this.previousFocus = null;
  }

  open(message, onConfirm, onCancel) {
    this.previousFocus = document.activeElement;

    // Set message
    this.dialog.querySelector('[role="alert"]').textContent = message;

    // Show dialog
    this.dialog.setAttribute('aria-hidden', 'false');
    this.dialog.showModal();

    // Setup buttons
    const confirmBtn = this.dialog.querySelector('[data-confirm]');
    const cancelBtn = this.dialog.querySelector('[data-cancel]');

    confirmBtn.addEventListener('click', () => {
      this.close();
      onConfirm?.();
    }, { once: true });

    cancelBtn.addEventListener('click', () => {
      this.close();
      onCancel?.();
    }, { once: true });

    // Escape handler (only if dismissible)
    if (this.dismissible) {
      this.keydownHandler = (event) => {
        if (event.key === 'Escape') {
          this.close();
          onCancel?.();
        }
      };
      this.dialog.addEventListener('keydown', this.keydownHandler);
    }

    // Focus cancel button (safer default)
    cancelBtn.focus();
  }

  close() {
    this.dialog.setAttribute('aria-hidden', 'true');
    this.dialog.close();

    if (this.dismissible && this.keydownHandler) {
      this.dialog.removeEventListener('keydown', this.keydownHandler);
    }

    this.previousFocus?.focus();
  }
}

// Non-dismissible alert (critical action required)
const criticalAlert = new AlertDialog(
  document.getElementById('delete-confirm'),
  { dismissible: false }  // Must choose confirm or cancel
);

// Dismissible alert (can press Escape)
const infoAlert = new AlertDialog(
  document.getElementById('info-dialog'),
  { dismissible: true }
);
```

### 3. Dropdown Menu

```javascript
// ✅ Dropdown with Escape to close
class Dropdown {
  constructor(triggerButton, menuElement) {
    this.trigger = triggerButton;
    this.menu = menuElement;
    this.isOpen = false;

    this.trigger.addEventListener('click', () => this.toggle());
    this.trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        event.preventDefault();
        this.open();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.menu.hidden = false;
    this.trigger.setAttribute('aria-expanded', 'true');

    // Setup Escape handler
    this.keydownHandler = (event) => {
      if (event.key === 'Escape') {
        this.close();
        this.trigger.focus();  // Return focus to trigger
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusNextOption();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusPreviousOption();
      }
    };

    this.menu.addEventListener('keydown', this.keydownHandler);

    // Focus first menu item
    this.focusFirstOption();
  }

  close() {
    this.isOpen = false;
    this.menu.hidden = true;
    this.trigger.setAttribute('aria-expanded', 'false');

    if (this.keydownHandler) {
      this.menu.removeEventListener('keydown', this.keydownHandler);
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  focusFirstOption() {
    const firstOption = this.menu.querySelector('[role="menuitem"]');
    firstOption?.focus();
  }

  focusNextOption() {
    // Implementation
  }

  focusPreviousOption() {
    // Implementation
  }
}
```

### 4. Slideover Panel

```javascript
// ✅ Slideover with Escape and overlay click
class SlideoverPanel {
  constructor(panelElement) {
    this.panel = panelElement;
    this.overlay = document.getElementById('slideover-overlay');
    this.previousFocus = null;
  }

  open() {
    this.previousFocus = document.activeElement;

    // Show panel and overlay
    this.panel.classList.add('open');
    this.overlay.classList.add('open');
    this.panel.setAttribute('aria-hidden', 'false');

    // Escape handler
    this.keydownHandler = (event) => {
      if (event.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.keydownHandler);

    // Click outside to close
    this.overlayClickHandler = () => this.close();
    this.overlay.addEventListener('click', this.overlayClickHandler);

    // Focus first element in panel
    const firstFocusable = this.panel.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }

  close() {
    this.panel.classList.remove('open');
    this.overlay.classList.remove('open');
    this.panel.setAttribute('aria-hidden', 'true');

    // Remove event listeners
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
    if (this.overlayClickHandler) {
      this.overlay.removeEventListener('click', this.overlayClickHandler);
    }

    // Restore focus
    this.previousFocus?.focus();
  }
}
```

### 5. Combobox with Listbox

```javascript
// ✅ Combobox with Escape to close listbox
class Combobox {
  constructor(inputElement, listboxElement) {
    this.input = inputElement;
    this.listbox = listboxElement;
    this.isOpen = false;

    this.input.addEventListener('input', () => this.filterOptions());
    this.input.addEventListener('keydown', (event) => this.handleInputKeydown(event));
  }

  handleInputKeydown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.open();
      this.focusFirstOption();
    } else if (event.key === 'Escape') {
      if (this.isOpen) {
        // Close listbox
        this.close();
      } else {
        // Clear input
        this.input.value = '';
      }
    } else if (event.key === 'Enter') {
      if (this.isOpen) {
        this.selectFocusedOption();
      }
    }
  }

  open() {
    this.isOpen = true;
    this.listbox.hidden = false;
    this.input.setAttribute('aria-expanded', 'true');

    // Setup Escape handler for listbox
    this.listboxKeydownHandler = (event) => {
      if (event.key === 'Escape') {
        this.close();
        this.input.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusNextOption();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusPreviousOption();
      } else if (event.key === 'Enter') {
        this.selectFocusedOption();
      }
    };

    this.listbox.addEventListener('keydown', this.listboxKeydownHandler);
  }

  close() {
    this.isOpen = false;
    this.listbox.hidden = true;
    this.input.setAttribute('aria-expanded', 'false');

    if (this.listboxKeydownHandler) {
      this.listbox.removeEventListener('keydown', this.listboxKeydownHandler);
    }
  }

  filterOptions() {
    // Implementation
  }

  focusFirstOption() {
    // Implementation
  }

  focusNextOption() {
    // Implementation
  }

  focusPreviousOption() {
    // Implementation
  }

  selectFocusedOption() {
    // Implementation
    this.close();
    this.input.focus();
  }
}
```

## React Example

```typescript
// ✅ React modal with Escape handler
import { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Save previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Show modal
    modalRef.current.showModal();

    // Escape handler
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Native dialog already closes on Escape, but we need to call onClose
        onClose();
      }
    };

    const modal = modalRef.current;
    modal.addEventListener('keydown', handleKeyDown);

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);

      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog ref={modalRef} aria-labelledby="modal-title" aria-modal="true">
      <div className="modal-content">
        <header>
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="close-button"
          >
            ×
          </button>
        </header>

        <div className="modal-body">{children}</div>

        <footer>
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
    </dialog>
  );
}

// Usage
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
      >
        <p>Press Escape or click Close to dismiss.</p>
      </Modal>
    </div>
  );
}
```

## Testing

### Manual Testing

1. **Open Modal:**
   - Click button to open modal
   - Verify modal appears and receives focus

2. **Test Escape Key:**
   - Press Escape
   - Verify modal closes
   - Verify focus returns to trigger element

3. **Test Multiple Escapes:**
   - Open nested modals (if applicable)
   - Press Escape multiple times
   - Verify each modal closes in order

4. **Test Screen Reader:**
   - Use NVDA/JAWS/VoiceOver
   - Open modal
   - Verify Escape is announced as available action
   - Test Escape functionality

### Automated Testing

```javascript
describe('Modal Escape handler', () => {
  it('should close modal when Escape is pressed', () => {
    const onClose = jest.fn();
    const modal = new ModalDialog(document.getElementById('modal'));

    modal.open(onClose);

    // Press Escape
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    modal.dialog.dispatchEvent(escapeEvent);

    // Modal should close
    expect(modal.dialog.classList.contains('open')).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('should restore focus after closing with Escape', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const modal = new ModalDialog(document.getElementById('modal'));
    modal.open();

    // Press Escape
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    modal.dialog.dispatchEvent(escapeEvent);

    // Focus should return to trigger
    expect(document.activeElement).toBe(trigger);
  });

  it('should handle nested modals with Escape', () => {
    const modal1 = new ModalDialog(document.getElementById('modal1'));
    const modal2 = new ModalDialog(document.getElementById('modal2'));

    modal1.open();
    modal2.open();

    // First Escape closes modal2
    const escapeEvent1 = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    modal2.dialog.dispatchEvent(escapeEvent1);

    expect(modal2.dialog.classList.contains('open')).toBe(false);
    expect(modal1.dialog.classList.contains('open')).toBe(true);

    // Second Escape closes modal1
    const escapeEvent2 = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    modal1.dialog.dispatchEvent(escapeEvent2);

    expect(modal1.dialog.classList.contains('open')).toBe(false);
  });
});
```

## Quick Fix

Paradise provides a quick fix template:

```javascript
// Before (Paradise detects missing Escape handler)
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    // Focus trap logic
  }
});

// After (Paradise suggests)
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    // Focus trap logic
  } else if (event.key === 'Escape') {
    closeModal();
    restorePreviousFocus();
  }
});
```

## Best Practices

1. **Always Provide Escape Exit:** Every modal must have Escape handler
2. **Restore Focus:** Return focus to trigger element when closing
3. **Announce Behavior:** Document that Escape closes modal (in SR instructions)
4. **Provide Visible Close Button:** Don't rely on Escape alone
5. **Handle Nested Modals:** Close innermost modal first on Escape
6. **Don't Prevent Escape Unnecessarily:** Only block if absolutely critical
7. **Test with Screen Readers:** Verify Escape behavior is accessible

## When NOT to Use Escape

Some dialogs should **NOT** close on Escape (but this is rare):

```javascript
// Critical confirmation where accidental dismiss is dangerous
const criticalDialog = new AlertDialog(modal, {
  dismissible: false  // User MUST choose confirm or cancel
});

// User must explicitly choose "Delete" or "Cancel"
// Escape should do NOTHING or map to "Cancel" button
```

**Use this sparingly!** Most modals should allow Escape.

## Related Issues

- [potential-keyboard-trap](./potential-keyboard-trap.md) - Tab without Escape
- [tab-without-shift](./tab-without-shift.md) - Incomplete Tab handling
- [focus-restoration-missing](./focus-restoration-missing.md) - Missing focus restoration

## Additional Resources

- [WCAG 2.1.2: No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap)
- [ARIA Authoring Practices: Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN: HTMLDialogElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement)
- [A11y Dialog Example](https://a11y-dialog.netlify.app/)
