# Static aria-expanded Attribute

**Issue Type:** `aria-expanded-static`
**Severity:** Warning
**WCAG:** 4.1.2 (Name, Role, Value)

## Description

This issue occurs when an element has `aria-expanded` set to an initial value but the value is never updated when the element's state changes. The `aria-expanded` attribute is meant to be dynamic - it should reflect the current expanded/collapsed state of collapsible content.

## Why This Matters

Screen readers announce the `aria-expanded` state to help users understand:
- Whether associated content is currently visible or hidden
- What will happen when they activate the control
- The current state of accordions, dropdowns, and expandable sections

A static `aria-expanded` value creates a mismatch between what screen readers announce and the actual visual state, confusing users who rely on assistive technology.

## Examples

### ❌ Problematic Code

```javascript
// Set once but never updated
const toggleButton = document.getElementById('menu-toggle');
toggleButton.setAttribute('aria-expanded', 'false'); // Initial value
toggleButton.setAttribute('aria-controls', 'menu');

toggleButton.addEventListener('click', () => {
  const menu = document.getElementById('menu');
  menu.classList.toggle('hidden');
  // BUG: aria-expanded not updated!
});

// React component with static aria-expanded
function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded="false"  // BUG: Always false!
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

### ✅ Correct Code

```javascript
// Properly updated aria-expanded
const toggleButton = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

toggleButton.setAttribute('aria-expanded', 'false');
toggleButton.setAttribute('aria-controls', 'menu');

toggleButton.addEventListener('click', () => {
  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

  // Update both visual state and ARIA state
  menu.classList.toggle('hidden');
  toggleButton.setAttribute('aria-expanded', String(!isExpanded));
});

// React component with dynamic aria-expanded
function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded={isOpen}  // Dynamically reflects state
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

## Common Patterns

### Accordion/Collapsible Section
```javascript
function setupAccordion(button, panel) {
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', panel.id);
  panel.hidden = true;

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    panel.hidden = isExpanded;
  });
}
```

### Dropdown Menu
```javascript
function setupDropdown(button, menu) {
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-controls', menu.id);
  menu.hidden = true;

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    menu.hidden = isExpanded;
  });
}
```

### Disclosure Widget
```javascript
function setupDisclosure(trigger, content) {
  let isExpanded = false;

  trigger.setAttribute('aria-expanded', 'false');
  content.hidden = true;

  trigger.addEventListener('click', () => {
    isExpanded = !isExpanded;
    trigger.setAttribute('aria-expanded', String(isExpanded));
    content.hidden = !isExpanded;
  });
}
```

## How to Fix

1. **Update on state change**: Whenever the associated content shows/hides, update `aria-expanded`
2. **Sync with visual state**: Ensure `aria-expanded` matches the actual visibility
3. **Use boolean strings**: Values should be `"true"` or `"false"` (as strings)
4. **Bind to framework state**: In React/Vue/Angular, bind `aria-expanded` to state variables
5. **Test with screen reader**: Verify announcements match visual changes

## When to Use aria-expanded

Use `aria-expanded` for:
- ✅ Accordion sections
- ✅ Dropdown menus
- ✅ Collapsible panels
- ✅ Tree view nodes
- ✅ Combobox/select dropdowns
- ✅ Disclosure widgets

Don't use for:
- ❌ Modals/dialogs (use `aria-modal` instead)
- ❌ Tooltips (use `aria-describedby` instead)
- ❌ Tab panels (use `aria-selected` on tabs)

## Related Issues

- [missing-required-aria](./missing-required-aria.md) - Missing required ARIA attributes
- [static-aria](./static-aria.md) - Other static ARIA states

## Resources

- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [aria-expanded (ARIA 1.2)](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded)
- [Disclosure Pattern (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
