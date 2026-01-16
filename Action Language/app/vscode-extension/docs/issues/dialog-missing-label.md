# Dialog Missing Accessible Label

**Issue Type:** `dialog-missing-label`
**Severity:** Error
**WCAG:** 4.1.2 (Name, Role, Value)

## Description

This issue occurs when an element with `role="dialog"` or `role="alertdialog"` lacks an accessible name. Dialogs must have labels so screen reader users can identify the dialog's purpose when it opens.

## Why This Matters

When a dialog opens, screen readers announce:
1. That a dialog has opened
2. **The dialog's accessible name** (title/purpose)
3. The dialog's content

Without an accessible name, screen reader users hear "dialog" without context about what the dialog contains or what action it represents, forcing them to explore the content to understand its purpose.

## Examples

### ❌ Problematic Code

```javascript
// Dialog without accessible label
const dialog = document.getElementById('confirmation-dialog');
dialog.setAttribute('role', 'dialog');
dialog.setAttribute('aria-modal', 'true');
// BUG: No aria-label or aria-labelledby!

// Modal that opens but lacks context
const modal = document.createElement('div');
modal.setAttribute('role', 'dialog');
modal.innerHTML = `
  <h2>Confirm Action</h2>
  <p>Are you sure?</p>
`;
// BUG: Title exists but not linked with aria-labelledby!
```

### ✅ Correct Code

```javascript
// Dialog with aria-labelledby (preferred)
const dialog = document.getElementById('confirmation-dialog');
dialog.setAttribute('role', 'dialog');
dialog.setAttribute('aria-modal', 'true');
dialog.setAttribute('aria-labelledby', 'dialog-title');
dialog.innerHTML = `
  <h2 id="dialog-title">Confirm Delete</h2>
  <p>Are you sure you want to delete this item?</p>
`;

// Dialog with aria-label (when no visible title)
const alertDialog = document.createElement('div');
alertDialog.setAttribute('role', 'alertdialog');
alertDialog.setAttribute('aria-modal', 'true');
alertDialog.setAttribute('aria-label', 'Error notification');
alertDialog.innerHTML = `
  <p>An error occurred while saving.</p>
`;

// React dialog component with proper labeling
function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <h2 id="dialog-title">{title}</h2>
      <p>{message}</p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
```

## Labeling Methods

### Method 1: aria-labelledby (Preferred)
Use when the dialog has a visible title/heading:

```javascript
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Save Changes?</h2>
  <p>You have unsaved changes.</p>
</div>
```

**Advantages:**
- Links to visible text (better for all users)
- Screen readers announce the exact visible title
- Follows WCAG 2.5.3 (Label in Name)

### Method 2: aria-label
Use when the dialog has no visible title:

```javascript
<div role="dialog" aria-label="Settings">
  <div class="tabs">
    <!-- Tabs UI without main heading -->
  </div>
</div>
```

**When to use:**
- Complex dialogs without single main heading
- Dialogs with only icon/image headers
- Alert dialogs with short messages

### Method 3: aria-describedby (Additional)
Optionally add for longer descriptions:

```javascript
<div
  role="alertdialog"
  aria-labelledby="alert-title"
  aria-describedby="alert-description"
>
  <h2 id="alert-title">Warning</h2>
  <p id="alert-description">
    This action cannot be undone. All data will be permanently deleted.
  </p>
</div>
```

## Dialog vs Alert Dialog

### role="dialog"
Standard modal dialog for:
- Forms and settings
- Multi-step wizards
- Confirmation prompts
- General modal content

**Required:**
- `aria-labelledby` or `aria-label`
- `aria-modal="true"`
- Focus management (trap focus inside)

### role="alertdialog"
For dialogs requiring immediate attention:
- Error messages
- Critical warnings
- Destructive action confirmations
- Time-sensitive alerts

**Required:**
- `aria-labelledby` or `aria-label`
- `aria-modal="true"`
- Focus management
- Initial focus on action button (not close button)

## Complete Dialog Pattern

```javascript
function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  const previousFocus = document.activeElement;

  // Set ARIA properties
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'dialog-title');

  // Show dialog
  dialog.hidden = false;

  // Focus first focusable element
  const firstFocusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  firstFocusable?.focus();

  // Trap focus inside dialog
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDialog(dialogId, previousFocus);
    }
    if (e.key === 'Tab') {
      trapFocus(e, dialog);
    }
  });
}

function closeDialog(dialogId, returnFocus) {
  const dialog = document.getElementById(dialogId);
  dialog.hidden = true;
  returnFocus?.focus();
}
```

## How to Fix

1. **Add visible title**: Use `<h2>` or similar for dialog heading
2. **Link with aria-labelledby**: Connect title to dialog element
3. **Or use aria-label**: If no visible title exists
4. **Be descriptive**: Label should clearly identify the dialog's purpose
5. **Test announcement**: Use screen reader to verify the label is announced

## Related Issues

- [missing-required-aria](./missing-required-aria.md) - Other missing ARIA attributes
- [focus-trap-missing](./focus-trap-missing.md) - Dialogs without focus trapping

## Resources

- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [Dialog Pattern (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [aria-label vs aria-labelledby](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA16.html)
