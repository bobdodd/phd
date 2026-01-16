# Missing Required ARIA Attributes

**Issue Type:** `missing-required-aria`
**Severity:** Error
**WCAG:** 4.1.2 (Name, Role, Value)

## Description

This issue occurs when an element has an ARIA role that requires specific ARIA attributes, but those required attributes are missing. Certain roles depend on specific attributes to convey their state and properties to assistive technologies.

## Why This Matters

ARIA roles establish contracts with assistive technologies about what properties will be available. When required attributes are missing:
- Screen readers cannot announce the element's state
- Users lack critical information about interactive elements
- The element's behavior becomes unpredictable
- The accessibility tree is incomplete or incorrect

For example, a checkbox that doesn't report its checked state is functionally useless to screen reader users.

## Required Attributes by Role

### checkbox
**Required:** `aria-checked`

```javascript
// ❌ Incorrect
element.setAttribute('role', 'checkbox');

// ✅ Correct
element.setAttribute('role', 'checkbox');
element.setAttribute('aria-checked', 'false');
```

### radio
**Required:** `aria-checked`

```javascript
// ✅ Correct
element.setAttribute('role', 'radio');
element.setAttribute('aria-checked', 'false');
```

### slider
**Required:** `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

```javascript
// ✅ Correct
element.setAttribute('role', 'slider');
element.setAttribute('aria-valuenow', '50');
element.setAttribute('aria-valuemin', '0');
element.setAttribute('aria-valuemax', '100');
element.setAttribute('aria-label', 'Volume');
```

### scrollbar
**Required:** `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

```javascript
// ✅ Correct
element.setAttribute('role', 'scrollbar');
element.setAttribute('aria-valuenow', '0');
element.setAttribute('aria-valuemin', '0');
element.setAttribute('aria-valuemax', '100');
element.setAttribute('aria-controls', 'content-area');
```

### spinbutton
**Required:** `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

```javascript
// ✅ Correct
element.setAttribute('role', 'spinbutton');
element.setAttribute('aria-valuenow', '10');
element.setAttribute('aria-valuemin', '1');
element.setAttribute('aria-valuemax', '100');
element.setAttribute('aria-label', 'Quantity');
```

### separator (when focusable)
**Required:** `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

```javascript
// ✅ Correct for resizable separator
element.setAttribute('role', 'separator');
element.setAttribute('tabindex', '0');
element.setAttribute('aria-valuenow', '50');
element.setAttribute('aria-valuemin', '10');
element.setAttribute('aria-valuemax', '90');
```

### combobox
**Required:** `aria-expanded`, `aria-controls`

```javascript
// ✅ Correct
element.setAttribute('role', 'combobox');
element.setAttribute('aria-expanded', 'false');
element.setAttribute('aria-controls', 'listbox-id');
element.setAttribute('aria-haspopup', 'listbox');
```

## Examples

### ❌ Problematic Code

```javascript
// Checkbox without checked state
const checkbox = document.getElementById('agree');
checkbox.setAttribute('role', 'checkbox');
// BUG: Missing aria-checked!

checkbox.addEventListener('click', () => {
  checkbox.classList.toggle('checked');
  // State change not announced to screen readers
});

// Slider without value information
const volumeSlider = document.getElementById('volume');
volumeSlider.setAttribute('role', 'slider');
// BUG: Missing aria-valuenow, aria-valuemin, aria-valuemax!

// Combobox without expansion state
const combobox = document.getElementById('country-select');
combobox.setAttribute('role', 'combobox');
// BUG: Missing aria-expanded and aria-controls!
```

### ✅ Correct Code

```javascript
// Checkbox with proper state management
const checkbox = document.getElementById('agree');
checkbox.setAttribute('role', 'checkbox');
checkbox.setAttribute('aria-checked', 'false');
checkbox.setAttribute('tabindex', '0');

function toggleCheckbox() {
  const isChecked = checkbox.getAttribute('aria-checked') === 'true';
  checkbox.setAttribute('aria-checked', String(!isChecked));
  checkbox.classList.toggle('checked');
}

checkbox.addEventListener('click', toggleCheckbox);
checkbox.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    toggleCheckbox();
  }
});

// Slider with complete value information
const volumeSlider = document.getElementById('volume');
volumeSlider.setAttribute('role', 'slider');
volumeSlider.setAttribute('aria-label', 'Volume');
volumeSlider.setAttribute('aria-valuenow', '50');
volumeSlider.setAttribute('aria-valuemin', '0');
volumeSlider.setAttribute('aria-valuemax', '100');
volumeSlider.setAttribute('aria-valuetext', '50%');
volumeSlider.setAttribute('tabindex', '0');

volumeSlider.addEventListener('keydown', (e) => {
  let value = parseInt(volumeSlider.getAttribute('aria-valuenow'));

  if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
    value = Math.min(100, value + 5);
  } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
    value = Math.max(0, value - 5);
  } else if (e.key === 'Home') {
    value = 0;
  } else if (e.key === 'End') {
    value = 100;
  } else {
    return;
  }

  volumeSlider.setAttribute('aria-valuenow', String(value));
  volumeSlider.setAttribute('aria-valuetext', `${value}%`);
  updateVolumeVisual(value);
});

// Combobox with complete state management
const combobox = document.getElementById('country-select');
const listbox = document.getElementById('country-listbox');

combobox.setAttribute('role', 'combobox');
combobox.setAttribute('aria-expanded', 'false');
combobox.setAttribute('aria-controls', 'country-listbox');
combobox.setAttribute('aria-haspopup', 'listbox');
combobox.setAttribute('tabindex', '0');

combobox.addEventListener('click', () => {
  const isExpanded = combobox.getAttribute('aria-expanded') === 'true';
  combobox.setAttribute('aria-expanded', String(!isExpanded));
  listbox.hidden = isExpanded;
});
```

## React Component Examples

### Checkbox Component
```typescript
function Checkbox({ label, checked, onChange }) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      {checked ? '✓' : '○'}
    </div>
  );
}
```

### Slider Component
```typescript
function Slider({ label, value, min, max, onChange }) {
  return (
    <div
      role="slider"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={`${value}%`}
      tabIndex={0}
      onKeyDown={(e) => {
        let newValue = value;
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          newValue = Math.min(max, value + 1);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          newValue = Math.max(min, value - 1);
        }
        if (newValue !== value) {
          onChange(newValue);
        }
      }}
    />
  );
}
```

## How to Fix

1. **Identify the role**: Check which ARIA role is assigned
2. **Consult the spec**: Look up required attributes for that role in ARIA 1.2
3. **Add all required attributes**: Don't skip any required attributes
4. **Set initial values**: Provide sensible default values
5. **Update dynamically**: Keep attribute values in sync with visual state
6. **Test with screen reader**: Verify all required information is announced

## Quick Reference Table

| Role | Required Attributes | Example Values |
|------|-------------------|----------------|
| checkbox | aria-checked | "true", "false", "mixed" |
| radio | aria-checked | "true", "false" |
| slider | aria-valuenow, aria-valuemin, aria-valuemax | "50", "0", "100" |
| scrollbar | aria-valuenow, aria-valuemin, aria-valuemax | "0", "0", "100" |
| spinbutton | aria-valuenow, aria-valuemin, aria-valuemax | "10", "1", "100" |
| separator* | aria-valuenow, aria-valuemin, aria-valuemax | "50", "10", "90" |
| combobox | aria-expanded, aria-controls | "false", "listbox-id" |

*Only when separator is focusable (resizable splitter)

## Related Issues

- [invalid-role](./invalid-role.md) - Invalid ARIA role values
- [interactive-role-static](./interactive-role-static.md) - Interactive roles without handlers
- [aria-expanded-static](./aria-expanded-static.md) - Static aria-expanded values

## Resources

- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [ARIA 1.2 Roles (Required States)](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
