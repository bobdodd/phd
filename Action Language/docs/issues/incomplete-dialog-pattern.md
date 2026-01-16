# incomplete-dialog-pattern

**Severity:** Warning
**WCAG Criteria:** [2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap), [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)

## Description

This issue occurs when a dialog (modal) doesn't follow the complete WAI-ARIA Authoring Practices pattern. A properly implemented dialog requires `aria-modal`, an accessible name, Escape key handler, and focus trap to prevent keyboard users from escaping the modal context.

## Why This Matters

- **Keyboard Users**: Need Escape key to close and focus trap to stay within dialog
- **Screen Reader Users**: Need `aria-modal` to understand context and `aria-labelledby` for dialog title
- **Focus Management**: Must trap focus within dialog and restore focus on close
- **WCAG Compliance**: Required for WCAG 2.1 Level A compliance (2.1.2, 4.1.2, 2.4.3)

## The Problem

An incomplete dialog pattern might be missing:
- `aria-modal="true"` attribute
- `aria-labelledby` or `aria-label` for accessible name
- Escape key handler to close dialog
- Focus trap (Tab cycles within dialog)
- Focus restoration (return focus to trigger element on close)
- Close button with accessible label

```javascript
// ❌ BAD: Incomplete dialog pattern
const dialog = document.querySelector('[role="dialog"]');
// Missing: aria-modal="true"
// Missing: aria-labelledby
// Missing: Escape key handler
// Missing: focus trap
```

## The Solution

Implement the complete WAI-ARIA dialog pattern:

```html
<!-- HTML Structure -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" class="modal" hidden>
  <div class="modal-content">
    <h2 id="dialog-title">Confirm Action</h2>
    <p>Are you sure you want to delete this item?</p>

    <button class="cancel-btn">Cancel</button>
    <button class="confirm-btn" autofocus>Confirm</button>
    <button class="close-btn" aria-label="Close dialog">&times;</button>
  </div>
</div>
```

```javascript
// ✅ GOOD: Complete dialog implementation
class Dialog {
  constructor(dialogElement) {
    this.dialog = dialogElement;
    this.trigger = null;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
  }

  open(triggerElement) {
    // Store trigger for focus restoration
    this.trigger = triggerElement || document.activeElement;

    // Show dialog
    this.dialog.removeAttribute('hidden');

    // Get focusable elements
    this.updateFocusableElements();

    // Focus first element (or element with autofocus)
    const autoFocus = this.dialog.querySelector('[autofocus]');
    if (autoFocus) {
      autoFocus.focus();
    } else {
      this.firstFocusable?.focus();
    }

    // Setup event listeners
    this.dialog.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keydown', this.handleEscape);
  }

  close() {
    // Hide dialog
    this.dialog.setAttribute('hidden', '');

    // Restore focus to trigger
    if (this.trigger) {
      this.trigger.focus();
    }

    // Remove event listeners
    this.dialog.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('keydown', this.handleEscape);
  }

  updateFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    this.focusableElements = Array.from(
      this.dialog.querySelectorAll(focusableSelectors)
    );

    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
  }

  handleKeydown = (event) => {
    // Focus trap: cycle focus within dialog
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift+Tab: moving backwards
        if (document.activeElement === this.firstFocusable) {
          event.preventDefault();
          this.lastFocusable?.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === this.lastFocusable) {
          event.preventDefault();
          this.firstFocusable?.focus();
        }
      }
    }
  }

  handleEscape = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }
}

// Usage
const confirmDialog = new Dialog(document.querySelector('[role="dialog"]'));

// Open dialog when button clicked
document.querySelector('.open-dialog-btn').addEventListener('click', (event) => {
  confirmDialog.open(event.target);
});

// Close handlers
document.querySelector('.close-btn').addEventListener('click', () => {
  confirmDialog.close();
});

document.querySelector('.cancel-btn').addEventListener('click', () => {
  confirmDialog.close();
});

document.querySelector('.confirm-btn').addEventListener('click', () => {
  // Perform action
  confirmAction();
  confirmDialog.close();
});
```

## Required Components

### 1. Dialog Container
- `role="dialog"` or `role="alertdialog"` (for urgent messages)
- `aria-modal="true"` to indicate modal behavior
- `aria-labelledby` pointing to title element's `id`, OR `aria-label` with title text
- Optional: `aria-describedby` pointing to description element

### 2. Accessible Name
- `<h2 id="dialog-title">` heading for title
- Link with `aria-labelledby="dialog-title"`

### 3. Keyboard Behavior
- **Escape**: Close dialog
- **Tab**: Cycle focus within dialog (focus trap)
- **Shift+Tab**: Cycle focus backwards within dialog

### 4. Focus Management
- On open: Move focus into dialog (to first focusable element or `autofocus` element)
- On close: Return focus to trigger element
- Prevent focus from leaving dialog while open

### 5. Close Button
- Accessible close button with `aria-label="Close dialog"`
- Click and keyboard handlers

## Common Patterns

### Pattern 1: Alert Dialog
For urgent messages requiring immediate attention:

```html
<div role="alertdialog" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-desc">
  <h2 id="alert-title">Error</h2>
  <p id="alert-desc">Your session has expired. Please log in again.</p>
  <button>OK</button>
</div>
```

### Pattern 2: Confirmation Dialog
For actions requiring confirmation:

```html
<div role="dialog" aria-modal="true" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Delete Item?</h2>
  <p>This action cannot be undone.</p>
  <button class="cancel-btn">Cancel</button>
  <button class="confirm-btn">Delete</button>
</div>
```

### Pattern 3: Form Dialog
For data entry:

```html
<div role="dialog" aria-modal="true" aria-labelledby="form-title">
  <h2 id="form-title">Add New Item</h2>
  <form>
    <label>Name: <input type="text" required></label>
    <label>Email: <input type="email" required></label>
    <button type="submit">Save</button>
    <button type="button" class="cancel">Cancel</button>
  </form>
</div>
```

## Quick Fix

Paradise can generate a complete dialog implementation:

1. Place your cursor on the `role="dialog"` line
2. Press `Ctrl+.` (Windows/Linux) or `Cmd+.` (Mac)
3. Select "Complete dialog pattern with focus trap and Escape handler"

## Related Issues

- `potential-keyboard-trap`: Focus trap not properly implemented
- `missing-escape-handler`: Dialog cannot be closed with Escape key
- `focus-restoration-missing`: Focus not returned to trigger on close
- `dialog-missing-label`: Dialog lacks accessible name

## Additional Resources

- [WAI-ARIA: Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN: ARIA Dialog Role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role)
- [A11y Dialog](https://a11y-dialog.netlify.app/) - Accessible dialog library

## Testing

### Manual Testing

1. **Open**: Dialog opens and focus moves inside
2. **Tab**: Focus cycles within dialog (does not leave)
3. **Escape**: Dialog closes
4. **Close**: Focus returns to trigger element
5. **Screen Reader**: Announces "Dialog, [title]"

### Screen Reader Testing

- **NVDA/JAWS (Windows)**: Announces "Dialog" and reads title
- **VoiceOver (Mac)**: "Dialog [title], web dialog"
- **TalkBack (Android)**: "Dialog [title]"

### Automated Testing

```javascript
// Test focus trap
test('dialog traps focus', () => {
  const dialog = new Dialog(dialogElement);
  dialog.open();

  // Tab through all focusable elements
  const focusable = dialog.focusableElements;
  focusable[focusable.length - 1].focus();

  // Simulate Tab key
  const event = new KeyboardEvent('keydown', { key: 'Tab' });
  dialogElement.dispatchEvent(event);

  // Focus should cycle to first element
  expect(document.activeElement).toBe(focusable[0]);
});

// Test Escape key
test('Escape closes dialog', () => {
  const dialog = new Dialog(dialogElement);
  dialog.open();

  const event = new KeyboardEvent('keydown', { key: 'Escape' });
  document.dispatchEvent(event);

  expect(dialogElement.hasAttribute('hidden')).toBe(true);
});
```

## Examples

### Real-World Example: Lightbox Gallery

```javascript
class LightboxDialog {
  constructor(images) {
    this.images = images;
    this.currentIndex = 0;
    this.createDialog();
  }

  createDialog() {
    this.dialog = document.createElement('div');
    this.dialog.setAttribute('role', 'dialog');
    this.dialog.setAttribute('aria-modal', 'true');
    this.dialog.setAttribute('aria-label', 'Image viewer');
    this.dialog.hidden = true;

    this.dialog.innerHTML = `
      <div class="lightbox-content">
        <button class="prev" aria-label="Previous image">&larr;</button>
        <img src="" alt="" class="lightbox-image">
        <button class="next" aria-label="Next image">&rarr;</button>
        <button class="close" aria-label="Close lightbox">&times;</button>
        <div class="caption" role="status" aria-live="polite"></div>
      </div>
    `;

    document.body.appendChild(this.dialog);
    this.setupHandlers();
  }

  setupHandlers() {
    // Close button
    this.dialog.querySelector('.close').addEventListener('click', () => this.close());

    // Navigation
    this.dialog.querySelector('.prev').addEventListener('click', () => this.navigate(-1));
    this.dialog.querySelector('.next').addEventListener('click', () => this.navigate(1));

    // Keyboard
    this.dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.navigate(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigate(1);
      }
    });

    // Focus trap
    const focusable = Array.from(this.dialog.querySelectorAll('button'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    this.dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  open(index, trigger) {
    this.currentIndex = index;
    this.trigger = trigger;
    this.showImage();
    this.dialog.hidden = false;
    this.dialog.querySelector('.close').focus();
  }

  close() {
    this.dialog.hidden = true;
    if (this.trigger) {
      this.trigger.focus();
    }
  }

  navigate(delta) {
    this.currentIndex = (this.currentIndex + delta + this.images.length) % this.images.length;
    this.showImage();
  }

  showImage() {
    const image = this.images[this.currentIndex];
    this.dialog.querySelector('.lightbox-image').src = image.src;
    this.dialog.querySelector('.lightbox-image').alt = image.alt;
    this.dialog.querySelector('.caption').textContent =
      `Image ${this.currentIndex + 1} of ${this.images.length}: ${image.alt}`;
  }
}
```

---

**Detected by:** Paradise Widget Pattern Analyzer
**Confidence:** HIGH when analyzing with full document context
**Auto-fix:** Available via Quick Fix (Ctrl+. / Cmd+.)
