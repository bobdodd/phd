# incomplete-toolbar-pattern

**Severity:** Warning
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

A toolbar requires `role="toolbar"`, roving tabindex pattern (one item with `tabindex="0"`, others `-1`), and arrow key navigation.

## Required Components

- Container with `role="toolbar"`
- Roving tabindex (one focusable button)
- Arrow keys navigate between toolbar items
- Home/End jump to first/last item

## Example

```html
<div role="toolbar" aria-label="Text formatting">
  <button tabindex="0">Bold</button>
  <button tabindex="-1">Italic</button>
  <button tabindex="-1">Underline</button>
</div>
```

## Additional Resources

- [WAI-ARIA: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

---

**Detected by:** Paradise Widget Pattern Analyzer
