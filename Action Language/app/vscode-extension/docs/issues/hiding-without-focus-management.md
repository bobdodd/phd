# Hiding Without Focus Management

**Issue Type:** `hiding-without-focus-management`
**Severity:** Warning
**WCAG:** 2.4.3 (Focus Order), 2.4.7 (Focus Visible)

## Description

Hiding a DOM element (via `display: none`, `visibility: hidden`, or `hidden` attribute) without checking if it or its descendants have focus causes keyboard users to lose their position in the page. This creates the same problems as removing elements but is often more subtle since the element still exists in the DOM.

## The Problem

```javascript
// ❌ Bad: Hides element without checking focus
function collapseMenu() {
  const menu = document.querySelector('.dropdown-menu');
  menu.style.display = 'none'; // Items inside might have focus
}

// ❌ Bad: Uses visibility property without focus check
function hidePanel() {
  const panel = document.getElementById('side-panel');
  panel.style.visibility = 'hidden'; // Panel content might be focused
}

// ❌ Bad: Uses hidden attribute
function hideSection() {
  const section = document.querySelector('.collapsible-section');
  section.hidden = true; // Elements inside might have focus
}
```

**Why this is a problem:**
- Focus becomes invisible but still technically on the hidden element
- Keyboard users can't see where focus is
- Tab key appears broken (moving through invisible elements)
- Screen readers may still announce hidden content
- Violates WCAG 2.4.3 and 2.4.7

## The Solution

Always check if the element or its descendants have focus before hiding. Move focus to a logical location if needed.

```javascript
// ✅ Good: Checks focus before hiding
function collapseMenu() {
  const menu = document.querySelector('.dropdown-menu');
  const toggleButton = document.getElementById('menu-toggle');

  // Check if menu or its children have focus
  if (menu.contains(document.activeElement)) {
    // Return focus to toggle button
    toggleButton?.focus();
  }

  menu.style.display = 'none';
}

// ✅ Good: Comprehensive focus management
function hidePanel() {
  const panel = document.getElementById('side-panel');

  if (panel.contains(document.activeElement)) {
    // Option 1: Focus the show/hide toggle
    const toggleBtn = document.querySelector('[aria-controls="side-panel"]');
    if (toggleBtn instanceof HTMLElement) {
      toggleBtn.focus();
    } else {
      // Option 2: Focus main content
      document.getElementById('main-content')?.focus();
    }
  }

  panel.style.visibility = 'hidden';
  panel.setAttribute('aria-hidden', 'true');
}

// ✅ Good: Using hidden attribute with focus management
function hideSection(sectionId) {
  const section = document.getElementById(sectionId);
  const expandButton = document.querySelector(`[aria-controls="${sectionId}"]`);

  if (section.contains(document.activeElement)) {
    // Return focus to expand/collapse button
    (expandButton as HTMLElement)?.focus();
  }

  section.hidden = true;
}
```

## Common Patterns

### 1. Collapsible Sections (Accordions)

```javascript
// ✅ Proper accordion focus management
function collapseAccordionSection(sectionId) {
  const section = document.getElementById(sectionId);
  const button = document.querySelector(`[aria-controls="${sectionId}"]`);

  if (section.contains(document.activeElement)) {
    // Always return to the toggle button
    button?.focus();
  }

  section.hidden = true;
  button?.setAttribute('aria-expanded', 'false');
}
```

### 2. Dropdown Menus

```javascript
// ✅ Proper dropdown focus management
function closeDropdown() {
  const dropdown = document.querySelector('.dropdown-menu');
  const trigger = document.getElementById('dropdown-trigger');

  // Check if any menu item has focus
  if (dropdown.contains(document.activeElement)) {
    // Return focus to trigger
    trigger?.focus();
  }

  dropdown.style.display = 'none';
  trigger?.setAttribute('aria-expanded', 'false');
}
```

### 3. Tab Panels

```javascript
// ✅ Tab panel focus management
function hideTabPanel(panelId) {
  const panel = document.getElementById(panelId);
  const tab = document.querySelector(`[aria-controls="${panelId}"]`);

  // If panel content was focused, move to the tab itself
  if (panel.contains(document.activeElement)) {
    (tab as HTMLElement)?.focus();
  }

  panel.hidden = true;
  tab?.setAttribute('aria-selected', 'false');
  tab?.setAttribute('tabindex', '-1');
}
```

### 4. Slide-Out Panels

```javascript
// ✅ Slide panel focus management
function hideSlidePanel() {
  const panel = document.querySelector('.slide-panel');
  const closeBtn = panel.querySelector('.close-button');

  // Store what had focus before panel was opened
  const previousFocus = panel.dataset.previousFocus;

  if (panel.contains(document.activeElement)) {
    // Return to element that opened panel
    if (previousFocus) {
      document.getElementById(previousFocus)?.focus();
    } else {
      // Fallback to main content
      document.getElementById('main-content')?.focus();
    }
  }

  panel.style.display = 'none';
}
```

## Testing

### Manual Testing

1. **Keyboard Navigation:**
   - Navigate to an element inside the hideable component
   - Tab through a few items
   - Hide the component
   - Verify focus moves somewhere visible
   - Continue tabbing and verify logical order

2. **Screen Reader Testing:**
   - Navigate to hidden component
   - Focus an interactive element
   - Hide the component
   - Verify screen reader announces new focus location
   - Verify hidden content is properly marked

### Automated Testing

```javascript
describe('Focus management on hiding', () => {
  it('should move focus when hiding element with focus', () => {
    const menu = document.querySelector('.menu');
    const menuItem = menu.querySelector('a');
    const trigger = document.getElementById('menu-trigger');

    menuItem.focus();
    expect(document.activeElement).toBe(menuItem);

    closeMenu();

    expect(document.activeElement).toBe(trigger);
    expect(menu.style.display).toBe('none');
  });

  it('should not move focus when hiding unfocused element', () => {
    const otherButton = document.getElementById('other-button');
    otherButton.focus();

    closeMenu();

    expect(document.activeElement).toBe(otherButton);
  });
});
```

## CSS Considerations

Be aware that these CSS properties hide content:

- `display: none` - Removes from layout and accessibility tree
- `visibility: hidden` - Keeps layout, removes from accessibility tree
- `opacity: 0` - Visible to screen readers, invisible visually
- `clip-path: inset(100%)` - Visually hidden but accessible

**Best Practice:** Combine CSS hiding with proper ARIA:

```javascript
// ✅ Properly hide with CSS and ARIA
function hideElement(element) {
  if (element.contains(document.activeElement)) {
    // Move focus first
    moveFocusToSafeLocation();
  }

  element.style.display = 'none';
  element.setAttribute('aria-hidden', 'true');
}
```

## Quick Fix

Paradise can automatically add focus checking code:

```javascript
// Before:
element.style.display = 'none';

// After fix:
if (element.contains(document.activeElement)) {
  // Move focus before hiding
  const nextFocusable = element.previousElementSibling || element.parentElement;
  if (nextFocusable instanceof HTMLElement) {
    nextFocusable.focus();
  }
}
element.style.display = 'none';
```

## Related Issues

- [removal-without-focus-management](./removal-without-focus-management.md) - Similar issue for removing elements
- [visibility-focus-conflict](./visibility-focus-conflict.md) - Elements that are hidden but still focusable
- [focus-restoration-missing](./focus-restoration-missing.md) - Modal-specific focus management

## Additional Resources

- [WCAG 2.4.3: Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)
- [WCAG 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)
- [MDN: Document.activeElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement)
- [MDN: Element.contains()](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains)
- [Inclusive Components: Collapsibles](https://inclusive-components.design/collapsible-sections/)
