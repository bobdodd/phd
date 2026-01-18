# Focus Restoration Missing

**Issue Type:** `focus-restoration-missing`
**Severity:** Warning
**WCAG:** 2.4.3 (Focus Order)

## Description

When closing a modal or dialog, focus must be explicitly restored to the element that opened it (or another logical location). Without focus restoration, keyboard users lose their place in the page and must navigate from the beginning. This is especially problematic for users who rely on keyboard navigation or screen readers.

## The Problem

```javascript
// ❌ Bad: Close modal without restoring focus
function closeModal() {
  const modal = document.querySelector('.modal');
  modal.remove(); // Focus lost - user stranded
}

// ❌ Bad: Hide dialog without focus management
function closeDialog() {
  const dialog = document.getElementById('myDialog');
  dialog.style.display = 'none'; // Where does focus go?
}

// ❌ Bad: Toggle modal without tracking opener
function toggleModal() {
  const modal = document.querySelector('[role="dialog"]');
  const isOpen = !modal.classList.contains('hidden');

  modal.classList.toggle('hidden');
  // If closing, no focus restoration
}
```

**Why this is a problem:**
- Keyboard users lose their position in the page
- Focus typically jumps to document body (top of page)
- Must re-navigate through entire page to return to context
- Screen reader users lose context
- Violates WCAG 2.4.3 (Focus Order)
- Creates frustrating user experience

## The Solution

Always store a reference to the element that opened the modal and restore focus to it when closing.

```javascript
// ✅ Good: Store and restore focus
function openModal() {
  const modal = document.querySelector('.modal');

  // Store reference to currently focused element
  modal.dataset.previousFocus = document.activeElement.id;

  modal.classList.add('open');

  // Focus first element in modal
  const firstButton = modal.querySelector('button');
  firstButton?.focus();
}

function closeModal() {
  const modal = document.querySelector('.modal');

  modal.classList.remove('open');

  // Restore focus to opener
  const previousFocusId = modal.dataset.previousFocus;
  if (previousFocusId) {
    document.getElementById(previousFocusId)?.focus();
  }
}

// ✅ Good: Using class property
class Modal {
  private previousFocus: HTMLElement | null = null;

  open() {
    // Store current focus
    this.previousFocus = document.activeElement as HTMLElement;

    this.element.classList.add('open');
    this.focusFirstElement();
  }

  close() {
    this.element.classList.remove('open');

    // Restore previous focus
    this.previousFocus?.focus();
    this.previousFocus = null;
  }
}

// ✅ Good: Using closure
function createModalManager(modalSelector) {
  let previousFocus = null;

  return {
    open() {
      const modal = document.querySelector(modalSelector);
      previousFocus = document.activeElement;

      modal.classList.add('open');
      modal.querySelector('button')?.focus();
    },

    close() {
      const modal = document.querySelector(modalSelector);
      modal.classList.remove('open');

      previousFocus?.focus();
      previousFocus = null;
    }
  };
}
```

## Common Patterns

### 1. Modal Dialog with Focus Trap

```javascript
// ✅ Complete modal implementation
class ModalDialog {
  constructor(dialogId) {
    this.dialog = document.getElementById(dialogId);
    this.previousFocus = null;
    this.setupEventListeners();
  }

  open(triggerElement) {
    // Store who opened the modal
    this.previousFocus = triggerElement || document.activeElement;

    // Show modal
    this.dialog.classList.add('open');
    this.dialog.setAttribute('aria-hidden', 'false');

    // Focus first focusable element
    const firstFocusable = this.dialog.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    // Trap focus within modal
    this.trapFocus();
  }

  close() {
    // Hide modal
    this.dialog.classList.remove('open');
    this.dialog.setAttribute('aria-hidden', 'true');

    // Restore focus
    this.previousFocus?.focus();
    this.previousFocus = null;
  }

  trapFocus() {
    this.dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
      // Additional focus trap logic...
    });
  }

  setupEventListeners() {
    // Close button
    const closeBtn = this.dialog.querySelector('[data-close]');
    closeBtn?.addEventListener('click', () => this.close());

    // Click outside to close
    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) {
        this.close();
      }
    });
  }
}

// Usage
const modal = new ModalDialog('myModal');
const openBtn = document.getElementById('open-modal');

openBtn.addEventListener('click', () => {
  modal.open(openBtn); // Pass trigger element
});
```

### 2. Sidebar Panel with Toggle

```javascript
// ✅ Sidebar with focus restoration
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const isOpen = sidebar.classList.contains('open');

  if (isOpen) {
    // Closing - check if sidebar has focus
    if (sidebar.contains(document.activeElement)) {
      // Restore to toggle button
      toggleBtn.focus();
    }

    sidebar.classList.remove('open');
  } else {
    // Opening - focus first item
    sidebar.classList.add('open');

    const firstLink = sidebar.querySelector('a');
    firstLink?.focus();
  }

  toggleBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
}
```

### 3. Custom Alert Dialog

```javascript
// ✅ Alert dialog with automatic focus restoration
function showAlert(message) {
  return new Promise((resolve) => {
    const previousFocus = document.activeElement;

    // Create alert
    const alert = document.createElement('div');
    alert.className = 'alert-dialog';
    alert.setAttribute('role', 'alertdialog');
    alert.setAttribute('aria-modal', 'true');
    alert.innerHTML = `
      <p>${message}</p>
      <button id="alert-ok">OK</button>
    `;

    document.body.appendChild(alert);

    // Focus OK button
    const okButton = alert.querySelector('#alert-ok');
    okButton.focus();

    // Handle close
    okButton.addEventListener('click', () => {
      alert.remove();

      // Restore focus
      (previousFocus as HTMLElement)?.focus();

      resolve();
    });

    // Handle Escape key
    alert.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        okButton.click();
      }
    });
  });
}

// Usage
const deleteBtn = document.getElementById('delete');
deleteBtn.addEventListener('click', async () => {
  await showAlert('Are you sure you want to delete this item?');
  // Focus automatically restored to deleteBtn
  performDelete();
});
```

### 4. Lightbox/Gallery with Navigation

```javascript
// ✅ Lightbox with focus restoration
class Lightbox {
  private previousFocus: HTMLElement | null = null;

  open(imageIndex, triggerElement) {
    this.previousFocus = triggerElement || document.activeElement;

    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('open');

    // Show image
    this.showImage(imageIndex);

    // Focus close button
    lightbox.querySelector('.close-btn')?.focus();
  }

  close() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('open');

    // Restore focus to image thumbnail that opened lightbox
    this.previousFocus?.focus();
    this.previousFocus = null;
  }

  navigate(direction) {
    // Navigation within lightbox doesn't affect previousFocus
    this.currentIndex += direction;
    this.showImage(this.currentIndex);
  }
}
```

### 5. Context Menu

```javascript
// ✅ Context menu with focus restoration
function showContextMenu(x, y, triggerElement) {
  const menu = document.getElementById('context-menu');

  // Store trigger
  menu.dataset.trigger = triggerElement.id;

  // Position and show
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.hidden = false;

  // Focus first menu item
  const firstItem = menu.querySelector('[role="menuitem"]');
  firstItem?.focus();
}

function closeContextMenu() {
  const menu = document.getElementById('context-menu');
  const triggerId = menu.dataset.trigger;

  menu.hidden = true;

  // Restore focus to trigger
  if (triggerId) {
    document.getElementById(triggerId)?.focus();
  }
}

// Usage with right-click
document.addEventListener('contextmenu', (e) => {
  if (e.target.classList.contains('has-context-menu')) {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, e.target);
  }
});
```

## React Example

```typescript
// ✅ React modal with focus restoration
function Modal({ isOpen, onClose, children }) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus modal
      modalRef.current?.focus();
    } else if (previousFocusRef.current) {
      // Restore focus when closing
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="modal"
    >
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

## Testing

### Manual Testing

1. **Open Modal:**
   - Focus a button
   - Click to open modal
   - Note the button (trigger element)

2. **Close Modal:**
   - Close the modal (button, Escape, or backdrop)
   - Verify focus returns to trigger button
   - Tab and verify logical order

3. **Screen Reader:**
   - Use screen reader to open modal
   - Close modal
   - Verify screen reader announces focus restoration
   - Verify context is maintained

### Automated Testing

```javascript
describe('Modal focus restoration', () => {
  it('should restore focus when closing modal', () => {
    const openBtn = document.getElementById('open-modal');
    const modal = new Modal('myModal');

    // Open from button
    openBtn.focus();
    openBtn.click();

    expect(document.activeElement).not.toBe(openBtn);

    // Close modal
    modal.close();

    // Focus should return
    expect(document.activeElement).toBe(openBtn);
  });

  it('should handle Escape key', () => {
    const openBtn = document.getElementById('open-modal');
    const modal = new Modal('myModal');

    openBtn.focus();
    modal.open();

    // Press Escape
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    expect(document.activeElement).toBe(openBtn);
  });
});
```

## Quick Fix

Paradise provides a template for focus restoration:

```javascript
// Store focus before opening modal
const previousFocus = document.activeElement;

// ... modal logic ...

// Restore focus when closing
if (previousFocus instanceof HTMLElement) {
  previousFocus.focus();
}
```

## Best Practices

1. **Always Store Previous Focus:** Before showing modal
2. **Focus Modal Content:** Move focus into modal when opening
3. **Trap Focus:** Keep focus within modal
4. **Handle Escape:** Close and restore on Escape key
5. **Restore on All Close Methods:** Button, backdrop click, Escape
6. **Test with Keyboard:** Verify entire flow works keyboard-only

## Related Issues

- [removal-without-focus-management](./removal-without-focus-management.md) - Element removal focus management
- [hiding-without-focus-management](./hiding-without-focus-management.md) - Element hiding focus management
- [react-portal-accessibility](./react-portal-accessibility.md) - React portal focus management

## Additional Resources

- [WCAG 2.4.3: Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)
- [ARIA Authoring Practices: Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN: Dialog Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [A11y Matters: Modal Dialogs](https://www.a11ymatters.com/pattern/modal-dialog/)
