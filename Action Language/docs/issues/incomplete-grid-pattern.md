# incomplete-grid-pattern

**Severity:** Warning
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

A grid requires `role="grid"` with row/gridcell structure and 2D arrow navigation (Up/Down for rows, Left/Right for cells).

## Required Components

- Container with `role="grid"`
- Rows with `role="row"`
- Cells with `role="gridcell"` or `role="columnheader"`/`role="rowheader"`
- 2D arrow key navigation

## Example

```html
<div role="grid" aria-label="Data table">
  <div role="row">
    <div role="columnheader">Name</div>
    <div role="columnheader">Age</div>
  </div>
  <div role="row">
    <div role="gridcell" tabindex="0">Alice</div>
    <div role="gridcell" tabindex="-1">30</div>
  </div>
</div>
```

## Additional Resources

- [WAI-ARIA: Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)

---

**Detected by:** Paradise Widget Pattern Analyzer
