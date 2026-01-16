# Invalid ARIA Role

**Issue Type:** `invalid-role`
**Severity:** Error
**WCAG:** 4.1.2 (Name, Role, Value)

## Description

This issue occurs when an element uses a `role` attribute value that does not exist in the ARIA 1.2 specification. Invalid roles prevent assistive technologies from correctly identifying and announcing the element's purpose.

## Why This Matters

Screen readers and other assistive technologies rely on valid ARIA roles to:
- Announce element types correctly ("button", "navigation", "dialog")
- Provide appropriate interaction methods
- Build accurate accessibility trees
- Enable proper keyboard navigation

Invalid roles are ignored by browsers, causing elements to lose their semantic meaning for assistive technology users.

## Examples

### ❌ Problematic Code

```javascript
// Invalid role value
const menuButton = document.getElementById('menu-btn');
menuButton.setAttribute('role', 'menubutton'); // Invalid! Should be 'button'

// Typo in role name
const navElement = document.querySelector('.navigation');
navElement.setAttribute('role', 'navegation'); // Invalid! Should be 'navigation'

// Made-up role
const customWidget = document.getElementById('widget');
customWidget.setAttribute('role', 'custom-widget'); // Invalid! Not in ARIA spec
```

### ✅ Correct Code

```javascript
// Valid ARIA 1.2 roles
const menuButton = document.getElementById('menu-btn');
menuButton.setAttribute('role', 'button'); // Valid

const navElement = document.querySelector('.navigation');
navElement.setAttribute('role', 'navigation'); // Valid

const customWidget = document.getElementById('widget');
customWidget.setAttribute('role', 'region'); // Valid
customWidget.setAttribute('aria-label', 'Custom Widget'); // Labeled for clarity
```

## Valid ARIA 1.2 Roles

### Widget Roles
- `button`, `checkbox`, `gridcell`, `link`, `menuitem`, `menuitemcheckbox`, `menuitemradio`
- `option`, `progressbar`, `radio`, `scrollbar`, `searchbox`, `separator`, `slider`
- `spinbutton`, `switch`, `tab`, `tabpanel`, `textbox`, `treeitem`

### Composite Widget Roles
- `combobox`, `grid`, `listbox`, `menu`, `menubar`, `radiogroup`, `tablist`, `tree`, `treegrid`

### Document Structure Roles
- `application`, `article`, `cell`, `columnheader`, `definition`, `directory`, `document`
- `feed`, `figure`, `group`, `heading`, `img`, `list`, `listitem`, `math`, `none`, `note`
- `presentation`, `region`, `row`, `rowgroup`, `rowheader`, `separator`, `table`, `term`
- `toolbar`, `tooltip`

### Landmark Roles
- `banner`, `complementary`, `contentinfo`, `form`, `main`, `navigation`, `region`, `search`

### Live Region Roles
- `alert`, `log`, `marquee`, `status`, `timer`

### Window Roles
- `alertdialog`, `dialog`

## How to Fix

1. **Check for typos**: Compare your role value against the ARIA 1.2 specification
2. **Use valid alternatives**: Replace invalid roles with semantically similar valid roles
3. **Consider native HTML**: Sometimes native HTML elements are better than ARIA roles
4. **Remove if unnecessary**: If no valid ARIA role fits, consider removing the role attribute

## Related Issues

- [interactive-role-static](./interactive-role-static.md) - Interactive roles without handlers
- [missing-required-aria](./missing-required-aria.md) - Roles missing required attributes

## Resources

- [ARIA 1.2 Roles](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [Using ARIA](https://www.w3.org/TR/using-aria/)
