# incomplete-menu-pattern

**Severity:** Warning
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

A menu widget requires `role="menu"` container with `role="menuitem"` children, arrow key navigation, and Enter/Space activation. Missing these components prevents keyboard navigation.

## Required Components

- Container with `role="menu"` or `role="menubar"`
- Items with `role="menuitem"`, `role="menuitemcheckbox"`, or `role="menuitemradio"`
- Arrow keys navigate between items
- Enter or Space activates menu items
- Escape closes menu
- Optional: Home/End keys jump to first/last item

## Example

```html
<div role="menu" aria-label="File menu">
  <div role="menuitem" tabindex="0">New File</div>
  <div role="menuitem" tabindex="-1">Open File</div>
  <div role="menuitem" tabindex="-1">Save</div>
  <div role="separator"></div>
  <div role="menuitem" tabindex="-1">Exit</div>
</div>
```

```javascript
menu.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    focusNextItem();
  } else if (e.key === 'ArrowUp') {
    focusPreviousItem();
  } else if (e.key === 'Enter' || e.key === ' ') {
    activateCurrentItem();
  } else if (e.key === 'Escape') {
    closeMenu();
  }
});
```

## Additional Resources

- [WAI-ARIA: Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)

---

**Detected by:** Paradise Widget Pattern Analyzer
**Auto-fix:** Available via Quick Fix
