# incomplete-tree-pattern

**Severity:** Warning
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

A tree widget requires `role="tree"` container with `role="treeitem"` children, `aria-expanded` on parent nodes, arrow key navigation (Up/Down for items, Right to expand, Left to collapse), and Home/End support.

## Required Components

- Container with `role="tree"`
- Items with `role="treeitem"`
- Groups with `role="group"`
- `aria-expanded="true/false"` on parent nodes
- Up/Down arrows navigate items
- Right arrow expands, Left arrow collapses
- Home/End jump to first/last

## Example

```html
<ul role="tree" aria-label="File tree">
  <li role="treeitem" aria-expanded="false">
    <span>src/</span>
    <ul role="group">
      <li role="treeitem">index.js</li>
      <li role="treeitem">utils.js</li>
    </ul>
  </li>
</ul>
```

## Additional Resources

- [WAI-ARIA: Tree Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)

---

**Detected by:** Paradise Widget Pattern Analyzer
