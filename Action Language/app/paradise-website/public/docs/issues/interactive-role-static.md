# Interactive Role Without Event Handler

**Issue Type:** `interactive-role-static`
**Severity:** Error
**WCAG:** 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)

## Description

This issue occurs when an element has an interactive ARIA role (like `button`, `link`, `checkbox`) but lacks the necessary event handlers to make it functional. Interactive elements must respond to user input to be accessible.

## Why This Matters

Interactive ARIA roles communicate to assistive technologies that an element:
- Can receive keyboard focus
- Should respond to activation (Enter, Space keys)
- Will trigger an action when interacted with

Without proper event handlers, the element becomes a "false promise" - it announces as interactive but doesn't actually work, frustrating keyboard and screen reader users.

## Examples

### ❌ Problematic Code

```javascript
// Button role without click handler
const customButton = document.getElementById('submit-btn');
customButton.setAttribute('role', 'button');
// Missing: click handler, keyboard handler

// Link role without navigation
const fakeLink = document.querySelector('.link-style');
fakeLink.setAttribute('role', 'link');
// Missing: click handler for navigation

// Checkbox role without toggle functionality
const checkboxDiv = document.getElementById('custom-checkbox');
checkboxDiv.setAttribute('role', 'checkbox');
checkboxDiv.setAttribute('aria-checked', 'false');
// Missing: click handler to toggle state
```

### ✅ Correct Code

```javascript
// Button role with proper handlers
const customButton = document.getElementById('submit-btn');
customButton.setAttribute('role', 'button');
customButton.setAttribute('tabindex', '0');

customButton.addEventListener('click', (e) => {
  submitForm();
});

customButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    submitForm();
  }
});

// Link role with navigation
const fakeLink = document.querySelector('.link-style');
fakeLink.setAttribute('role', 'link');
fakeLink.setAttribute('tabindex', '0');

fakeLink.addEventListener('click', (e) => {
  window.location.href = '/destination';
});

fakeLink.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    window.location.href = '/destination';
  }
});

// Checkbox role with toggle functionality
const checkboxDiv = document.getElementById('custom-checkbox');
checkboxDiv.setAttribute('role', 'checkbox');
checkboxDiv.setAttribute('aria-checked', 'false');
checkboxDiv.setAttribute('tabindex', '0');

function toggleCheckbox() {
  const isChecked = checkboxDiv.getAttribute('aria-checked') === 'true';
  checkboxDiv.setAttribute('aria-checked', String(!isChecked));
}

checkboxDiv.addEventListener('click', toggleCheckbox);
checkboxDiv.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    toggleCheckbox();
  }
});
```

## Interactive Roles Requiring Handlers

| Role | Required Events | Expected Behavior |
|------|----------------|-------------------|
| `button` | click, keydown (Enter, Space) | Activates action |
| `link` | click, keydown (Enter) | Navigates to URL |
| `checkbox` | click, change, keydown (Space) | Toggles checked state |
| `radio` | click, change, keydown (Space, Arrow keys) | Selects option |
| `switch` | click, change, keydown (Space) | Toggles on/off state |
| `tab` | click, keydown (Enter, Space, Arrow keys) | Selects tab panel |
| `menuitem` | click, keydown (Enter) | Activates menu action |
| `option` | click, keydown (Enter) | Selects option |
| `combobox` | click, keydown (Enter, Arrow keys, Escape) | Opens/closes, navigates options |
| `slider` | keydown (Arrow keys, Home, End, Page Up/Down) | Adjusts value |
| `spinbutton` | keydown (Arrow keys, Home, End) | Increases/decreases value |

## How to Fix

1. **Add click handlers**: Listen for click events and implement the expected behavior
2. **Add keyboard handlers**: Support Enter (and Space for buttons/checkboxes)
3. **Make focusable**: Add `tabindex="0"` if the element isn't naturally focusable
4. **Update ARIA state**: For stateful widgets (checkbox, switch), update `aria-checked`/`aria-pressed`
5. **Consider native HTML**: Use `<button>`, `<a>`, `<input type="checkbox">` instead of ARIA roles

## Related Issues

- [mouse-only-click](./mouse-only-click.md) - Click handlers without keyboard support
- [missing-required-aria](./missing-required-aria.md) - Roles missing required ARIA attributes

## Resources

- [WCAG 2.1.1: Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
