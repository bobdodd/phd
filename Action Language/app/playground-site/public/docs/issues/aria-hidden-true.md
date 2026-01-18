# aria-hidden on Focusable Element

**Issue Type:** `aria-hidden-true`
**Severity:** Error
**WCAG:** 4.1.2 (Name, Role, Value)

## Description

This issue occurs when an element has `aria-hidden="true"` but can receive keyboard focus or is interactive. This creates a confusing experience where keyboard users can focus on elements that screen readers cannot detect or announce.

## Why This Matters

`aria-hidden="true"` removes an element and all its descendants from the accessibility tree, making them invisible to screen readers. However, it doesn't affect:
- Keyboard focusability
- Visual display
- Mouse interaction

When focusable elements are aria-hidden:
- Keyboard users can tab to invisible elements
- Screen reader users hear nothing when focus lands on the element
- Users become disoriented, not knowing where focus is
- Interactive elements become unusable for screen reader users

## Examples

### ❌ Problematic Code

```javascript
// Button that's aria-hidden but still focusable
const closeButton = document.getElementById('close-btn');
closeButton.setAttribute('aria-hidden', 'true');
// BUG: Button is still keyboard-focusable!

// Focus change on hidden element
const hiddenSection = document.getElementById('collapsed-section');
hiddenSection.setAttribute('aria-hidden', 'true');
const firstInput = hiddenSection.querySelector('input');
firstInput.focus(); // BUG: Focusing hidden element!

// Interactive elements within hidden parent
const menu = document.getElementById('dropdown-menu');
menu.setAttribute('aria-hidden', 'true');
menu.innerHTML = `
  <button>Option 1</button>
  <button>Option 2</button>
`;
// BUG: Buttons are focusable but hidden from screen readers!
```

### ✅ Correct Code

```javascript
// Option 1: Remove aria-hidden if element needs to be interactive
const closeButton = document.getElementById('close-btn');
// Don't use aria-hidden on interactive elements

// Option 2: Make element truly non-focusable
const decorativeIcon = document.getElementById('icon');
decorativeIcon.setAttribute('aria-hidden', 'true');
decorativeIcon.setAttribute('tabindex', '-1');
decorativeIcon.inert = true; // Make all descendants non-interactive

// Option 3: Use hidden attribute for complete hiding
const collapsedSection = document.getElementById('collapsed-section');
collapsedSection.hidden = true; // Removes from both visual and a11y tree

// Option 4: Use CSS display:none for complete hiding
const menu = document.getElementById('dropdown-menu');
menu.style.display = 'none'; // Removes from both visual and a11y tree

// Decorative elements - aria-hidden is appropriate
const decorativeSVG = document.querySelector('.decorative-icon');
decorativeSVG.setAttribute('aria-hidden', 'true');
// This is correct - purely decorative, no interactive content
```

## When aria-hidden IS Appropriate

### ✅ Decorative Images/Icons (with meaningful alt text elsewhere)
```javascript
<button aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">
    <path d="..."/> {/* X icon */}
  </svg>
  <span class="sr-only">Close</span>
</button>
```

### ✅ Duplicate Content (visible text + hidden text for screen readers)
```javascript
<button>
  <span aria-hidden="true">📧</span>
  <span class="sr-only">Send email</span>
</button>
```

### ✅ Presentational Icons with Adjacent Labels
```javascript
<a href="/settings">
  <i class="icon-settings" aria-hidden="true"></i>
  Settings
</a>
```

### ✅ Visual-Only Separators
```javascript
<div class="breadcrumb">
  <a href="/">Home</a>
  <span aria-hidden="true">›</span>
  <a href="/products">Products</a>
</div>
```

## When aria-hidden is NOT Appropriate

### ❌ Focusable Elements
```javascript
// WRONG
<button aria-hidden="true">Click me</button>
<input aria-hidden="true" type="text" />
<a href="/page" aria-hidden="true">Link</a>
```

### ❌ Elements with Focus Changes
```javascript
// WRONG
const dialog = document.getElementById('dialog');
dialog.setAttribute('aria-hidden', 'true');
dialog.querySelector('input').focus(); // Focus on hidden element!
```

### ❌ Collapsible Content (Use hidden attribute instead)
```javascript
// WRONG
<div aria-hidden="true">
  <p>Collapsed content</p>
  <button>Action</button>
</div>

// CORRECT
<div hidden>
  <p>Collapsed content</p>
  <button>Action</button>
</div>
```

## Complete Patterns

### Show/Hide Toggle with Proper Hiding
```javascript
function setupToggle(trigger, panel) {
  let isVisible = false;

  trigger.addEventListener('click', () => {
    isVisible = !isVisible;

    // Use hidden attribute for complete hiding
    panel.hidden = !isVisible;

    // Update aria-expanded on trigger
    trigger.setAttribute('aria-expanded', String(isVisible));
  });
}
```

### Modal Dialog with Proper Inert Background
```javascript
function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  const mainContent = document.getElementById('main-content');

  // Show dialog
  dialog.hidden = false;
  dialog.setAttribute('aria-modal', 'true');

  // Hide background from screen readers AND keyboard
  mainContent.setAttribute('aria-hidden', 'true');
  mainContent.inert = true; // Makes everything non-focusable

  // Focus first element in dialog
  const firstFocusable = dialog.querySelector('button, [href], input');
  firstFocusable?.focus();
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  const mainContent = document.getElementById('main-content');

  // Hide dialog
  dialog.hidden = true;

  // Restore background accessibility
  mainContent.removeAttribute('aria-hidden');
  mainContent.inert = false;
}
```

### Icon Button with Hidden Decorative Icon
```javascript
function createIconButton(iconSVG, label) {
  const button = document.createElement('button');
  button.setAttribute('aria-label', label);

  const icon = iconSVG.cloneNode(true);
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('focusable', 'false'); // Prevent SVG focus in IE

  button.appendChild(icon);
  return button;
}

// Usage
const closeIcon = document.querySelector('#close-icon');
const closeButton = createIconButton(closeIcon, 'Close dialog');
```

### Breadcrumb with Hidden Separators
```javascript
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li>
      <a href="/">Home</a>
      <span aria-hidden="true" class="separator">›</span>
    </li>
    <li>
      <a href="/products">Products</a>
      <span aria-hidden="true" class="separator">›</span>
    </li>
    <li>
      <span aria-current="page">Product Details</span>
    </li>
  </ol>
</nav>
```

## React Component Examples

### Icon Button
```typescript
function IconButton({ icon, label, onClick }) {
  return (
    <button aria-label={label} onClick={onClick}>
      <svg aria-hidden="true" focusable="false">
        {icon}
      </svg>
    </button>
  );
}
```

### Collapsible Panel
```typescript
function CollapsiblePanel({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>

      {/* Use conditional rendering instead of aria-hidden */}
      {isOpen && (
        <div>{children}</div>
      )}

      {/* OR use hidden attribute */}
      <div hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
}
```

## How to Fix

1. **Remove aria-hidden from interactive elements**: Buttons, links, inputs should never be aria-hidden
2. **Use hidden attribute**: For collapsible content, use `hidden` instead of `aria-hidden`
3. **Use CSS display:none**: Complete hiding removes from both visual and accessibility tree
4. **Add tabindex="-1"**: If aria-hidden is necessary, prevent keyboard focus
5. **Use inert attribute**: Modern way to make content non-interactive
6. **Avoid focusing hidden elements**: Never call `.focus()` on aria-hidden elements

## Common Mistakes

### Mistake 1: Using aria-hidden for Off-Screen Content
```javascript
// WRONG - Doesn't affect keyboard focus
offscreenMenu.setAttribute('aria-hidden', 'true');

// CORRECT - Use hidden attribute or display:none
offscreenMenu.hidden = true;
```

### Mistake 2: Hiding Modal Background Without Inert
```javascript
// INSUFFICIENT - Background still keyboard-focusable
mainContent.setAttribute('aria-hidden', 'true');

// COMPLETE - Removes from screen reader AND keyboard
mainContent.setAttribute('aria-hidden', 'true');
mainContent.inert = true;
```

### Mistake 3: aria-hidden on Form Fields
```javascript
// WRONG - Never hide form fields this way
<input type="text" aria-hidden="true" />

// CORRECT - Use CSS or hidden attribute
<input type="text" hidden />
<input type="text" style="display: none;" />
```

## Related Issues

- [focus-trap-missing](./focus-trap-missing.md) - Missing focus management in modals
- [keyboard-trap](./keyboard-trap.md) - Focus trapped without escape

## Resources

- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [aria-hidden (ARIA 1.2)](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden)
- [The inert attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert)
- [Fourth Rule of ARIA](https://www.w3.org/TR/using-aria/#fourth)
