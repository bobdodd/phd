# incomplete-combobox-pattern

**Severity:** Warning
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

A combobox (autocomplete dropdown) requires `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete`, a listbox with options, and arrow key navigation. Missing any of these components makes the widget inaccessible.

## Required Components

- Input with `role="combobox"`
- `aria-expanded="true/false"` to indicate dropdown state
- `aria-controls="listbox-id"` linking to options list
- `aria-autocomplete="list"` or `"both"` or `"inline"`
- `aria-activedescendant` pointing to currently focused option
- Listbox with `role="listbox"` containing options with `role="option"`
- Arrow keys navigate options, Enter selects, Escape closes

## Example

```html
<label for="country">Country:</label>
<input
  type="text"
  role="combobox"
  id="country"
  aria-expanded="false"
  aria-controls="country-listbox"
  aria-autocomplete="list"
  aria-activedescendant=""
>
<ul id="country-listbox" role="listbox" hidden>
  <li role="option" id="option-1">United States</li>
  <li role="option" id="option-2">Canada</li>
  <li role="option" id="option-3">Mexico</li>
</ul>
```

```javascript
// Handle arrow navigation and selection
combobox.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    moveToNextOption();
  } else if (e.key === 'ArrowUp') {
    moveToPreviousOption();
  } else if (e.key === 'Enter') {
    selectCurrentOption();
  } else if (e.key === 'Escape') {
    closeListbox();
  }
});
```

## Additional Resources

- [WAI-ARIA: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

---

**Detected by:** Paradise Widget Pattern Analyzer
**Auto-fix:** Available via Quick Fix
