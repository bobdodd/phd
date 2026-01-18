# Hiding Class Without Focus Management

**Issue Type:** `hiding-class-without-focus-management`
**Severity:** Info
**WCAG:** 2.4.7 (Focus Visible)

## Description

Using `classList` operations (add, remove, toggle) may hide or show elements if your CSS uses those classes to control visibility. Without checking focus, this can cause keyboard users to lose their position just like direct style manipulation, but it's harder to detect since the visibility change happens indirectly through CSS.

## The Problem

```javascript
// ❌ Bad: classList may trigger CSS that hides element
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('hidden'); // CSS .hidden { display: none; }
  // If sidebar content has focus, user loses their place
}

// ❌ Bad: Adding class that hides content
function collapseSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.classList.add('collapsed'); // CSS .collapsed { display: none; }
}

// ❌ Bad: Removing class that shows content
function hideModal() {
  const modal = document.querySelector('.modal');
  modal.classList.remove('visible'); // CSS .visible { display: block; }
}
```

**Why this is a problem:**
- CSS classes can hide content without it being obvious in JavaScript
- Classes like `hidden`, `collapsed`, `closed`, `invisible` often affect visibility
- Focus remains on invisible elements
- Harder to detect than direct style manipulation
- Creates confusion for keyboard and screen reader users

## The Solution

When using classList operations that might affect visibility, check if the element or its descendants have focus and move it to a safe location.

```javascript
// ✅ Good: Check focus before classList operation
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.getElementById('sidebar-toggle');

  // Check if toggling would hide sidebar and it has focus
  const willHide = !sidebar.classList.contains('hidden');

  if (willHide && sidebar.contains(document.activeElement)) {
    // Return focus to toggle button
    toggleButton?.focus();
  }

  sidebar.classList.toggle('hidden');
  toggleButton?.setAttribute('aria-expanded', willHide ? 'false' : 'true');
}

// ✅ Good: Focus management with classList.add
function collapseSection(sectionId) {
  const section = document.getElementById(sectionId);
  const button = document.querySelector(`[aria-controls="${sectionId}"]`);

  if (section.contains(document.activeElement)) {
    // Move focus to expand/collapse button
    (button as HTMLElement)?.focus();
  }

  section.classList.add('collapsed');
  button?.setAttribute('aria-expanded', 'false');
}

// ✅ Good: Generic helper for class-based hiding
function safeToggleClass(element, className, returnFocusTo) {
  // Check if this class change will hide the element
  const willBeHidden = element.classList.contains(className)
    ? false // Removing hidden class = showing
    : true; // Adding hidden class = hiding

  if (willBeHidden && element.contains(document.activeElement)) {
    // Move focus to safe location
    if (returnFocusTo instanceof HTMLElement) {
      returnFocusTo.focus();
    } else {
      document.body.focus();
    }
  }

  element.classList.toggle(className);
}
```

## Common Patterns

### 1. Accordion with CSS Classes

```javascript
// ✅ Accordion using classList
function toggleAccordionPanel(panelId) {
  const panel = document.getElementById(panelId);
  const button = document.querySelector(`[aria-controls="${panelId}"]`);
  const isExpanded = !panel.classList.contains('collapsed');

  if (isExpanded && panel.contains(document.activeElement)) {
    // Collapsing - return focus to button
    button?.focus();
  }

  panel.classList.toggle('collapsed');
  button?.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
}
```

### 2. Tab Panels with Show/Hide Classes

```javascript
// ✅ Tab panel switching with classes
function showTabPanel(panelId) {
  const panels = document.querySelectorAll('.tab-panel');
  const newPanel = document.getElementById(panelId);
  const tab = document.querySelector(`[aria-controls="${panelId}"]`);

  panels.forEach(panel => {
    if (panel !== newPanel && panel.contains(document.activeElement)) {
      // Moving away from current panel, focus its tab
      const currentTab = document.querySelector(`[aria-controls="${panel.id}"]`);
      (currentTab as HTMLElement)?.focus();
    }

    panel.classList.remove('active');
    panel.hidden = true;
  });

  newPanel.classList.add('active');
  newPanel.hidden = false;
}
```

### 3. Modal with Utility Classes

```javascript
// ✅ Modal using utility classes
function closeModal() {
  const modal = document.querySelector('.modal');
  const trigger = document.querySelector('[data-modal-trigger]');

  if (modal.contains(document.activeElement)) {
    // Return to trigger element
    (trigger as HTMLElement)?.focus();
  }

  modal.classList.remove('is-open');
  modal.classList.add('is-closed');
  document.body.classList.remove('modal-open');
}
```

### 4. Dropdown with Toggle Classes

```javascript
// ✅ Dropdown menu with classList
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const trigger = document.querySelector(`[aria-controls="${dropdownId}"]`);
  const isOpen = dropdown.classList.contains('open');

  if (isOpen && dropdown.contains(document.activeElement)) {
    // Closing - return to trigger
    (trigger as HTMLElement)?.focus();
  }

  dropdown.classList.toggle('open');
  trigger?.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
}
```

## CSS Patterns That Hide Content

Be aware of common CSS patterns that affect visibility:

```css
/* Common hiding patterns */
.hidden { display: none; }
.collapsed { display: none; }
.closed { display: none; }
.invisible { visibility: hidden; }
.off-screen { position: absolute; left: -9999px; }
.visually-hidden { clip: rect(0 0 0 0); }

/* Animation/transition patterns */
.fade-out { opacity: 0; pointer-events: none; }
.slide-up { transform: translateY(-100%); }

/* Conditional visibility */
.desktop-only { display: none; } /* on mobile */
.mobile-only { display: block; } /* on mobile */
```

## Testing

### Manual Testing

1. **Identify Visibility Classes:**
   - Review CSS for classes that affect `display`, `visibility`, `opacity`
   - List classes that hide/show content

2. **Test Each Toggle:**
   - Focus an element inside toggleable content
   - Toggle the visibility class
   - Verify focus moves to appropriate location
   - Tab forward and verify logical order

3. **Test Edge Cases:**
   - Nested toggleable elements
   - Multiple classList changes in sequence
   - Animation/transition classes

### Automated Testing

```javascript
describe('classList focus management', () => {
  it('should manage focus when adding hiding class', () => {
    const section = document.querySelector('.section');
    const button = document.getElementById('toggle-btn');
    const link = section.querySelector('a');

    link.focus();
    expect(document.activeElement).toBe(link);

    // Add class that hides (CSS: .hidden { display: none; })
    section.classList.add('hidden');

    // Focus should move to button
    expect(document.activeElement).toBe(button);
  });

  it('should not interfere when adding non-hiding class', () => {
    const section = document.querySelector('.section');
    const link = section.querySelector('a');

    link.focus();

    // Add class that doesn't hide
    section.classList.add('highlighted');

    // Focus should stay
    expect(document.activeElement).toBe(link);
  });
});
```

## Why Info Severity?

This issue is marked as **Info** rather than Warning because:

1. **Uncertainty**: We can't know from JavaScript alone if a class actually hides content
2. **False Positives**: Classes like `active`, `selected`, `highlighted` don't hide content
3. **Requires Review**: Developer must verify the CSS behavior
4. **May Not Apply**: Some projects use classes only for styling, not visibility

**When to fix:** If your CSS uses the class to control visibility (display, visibility, opacity, position), add focus management. Otherwise, this warning can be safely ignored.

## Best Practice

Document which classes affect visibility:

```javascript
// Document visibility-affecting classes
const HIDING_CLASSES = ['hidden', 'collapsed', 'closed', 'invisible'];

function safeToggleClass(element, className, focusFallback) {
  if (HIDING_CLASSES.includes(className) &&
      element.contains(document.activeElement)) {
    focusFallback?.focus();
  }

  element.classList.toggle(className);
}
```

## Related Issues

- [hiding-without-focus-management](./hiding-without-focus-management.md) - Direct style manipulation
- [removal-without-focus-management](./removal-without-focus-management.md) - Element removal
- [visibility-focus-conflict](./visibility-focus-conflict.md) - Hidden but focusable elements

## Additional Resources

- [WCAG 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)
- [MDN: Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
- [MDN: Document.activeElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement)
- [CSS Tricks: Hiding Content](https://css-tricks.com/comparing-various-ways-to-hide-things-in-css/)
