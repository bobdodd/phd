# mouse-only-click

**Severity:** Warning
**WCAG Criteria:** [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

This issue occurs when an element has a click event handler but no keyboard equivalent. This makes the interactive element inaccessible to keyboard-only users, including people who cannot use a mouse due to motor disabilities and screen reader users who navigate primarily with the keyboard.

## Why This Matters

- **Keyboard Users**: People who cannot use a mouse need to be able to activate all interactive elements using only the keyboard
- **Screen Reader Users**: Screen reader users navigate primarily with Tab and Enter/Space keys
- **Motor Disabilities**: Users with limited motor control often rely on keyboard navigation
- **WCAG Compliance**: Required for WCAG 2.1 Level A compliance (Success Criterion 2.1.1)

## The Problem

When you add a click handler to an element without providing keyboard access:

```javascript
// ❌ BAD: Mouse-only interaction
const button = document.getElementById('submit');
button.addEventListener('click', handleSubmit);
// No keyboard handler - keyboard users cannot activate this!
```

The element can only be activated by clicking with a mouse. Keyboard users pressing Enter or Space will see no response.

## The Solution

Add a keyboard event handler that responds to Enter and Space keys:

```javascript
// ✅ GOOD: Keyboard-accessible
const button = document.getElementById('submit');

// Handle mouse clicks
button.addEventListener('click', handleSubmit);

// Handle keyboard activation
button.addEventListener('keydown', (event) => {
  // Check for Enter or Space key
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent page scroll on Space
    handleSubmit(event);
  }
});
```

### Even Better: Use Semantic HTML

The best solution is often to use semantic HTML elements that have built-in keyboard support:

```html
<!-- ✅ BEST: Native button element has built-in keyboard support -->
<button id="submit" onclick="handleSubmit()">Submit</button>

<!-- ❌ AVOID: Div requires manual keyboard handling -->
<div id="submit" onclick="handleSubmit()">Submit</div>
```

Native `<button>` and `<a>` elements automatically respond to Enter and Space keys without requiring additional event handlers.

## Common Patterns

### Pattern 1: Interactive Div

```javascript
// ❌ BAD
const menuItem = document.querySelector('.menu-item');
menuItem.addEventListener('click', openMenu);

// ✅ GOOD
const menuItem = document.querySelector('.menu-item');
menuItem.setAttribute('role', 'button');
menuItem.setAttribute('tabindex', '0');

menuItem.addEventListener('click', openMenu);
menuItem.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openMenu(event);
  }
});
```

### Pattern 2: Custom Controls

```javascript
// ❌ BAD: Custom control without keyboard support
document.querySelector('.custom-toggle').addEventListener('click', toggle);

// ✅ GOOD: Full keyboard support
const toggleElement = document.querySelector('.custom-toggle');
toggleElement.setAttribute('role', 'button');
toggleElement.setAttribute('tabindex', '0');
toggleElement.setAttribute('aria-pressed', 'false');

toggleElement.addEventListener('click', toggle);
toggleElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle(event);
  }
});

function toggle(event) {
  const pressed = toggleElement.getAttribute('aria-pressed') === 'true';
  toggleElement.setAttribute('aria-pressed', String(!pressed));
  // ... toggle logic
}
```

## Quick Fix

Paradise can automatically generate the keyboard handler for you:

1. Place your cursor on the squiggly line
2. Press `Ctrl+.` (Windows/Linux) or `Cmd+.` (Mac)
3. Select "Add keyboard handler for Enter and Space keys"

## Related Issues

- `interactive-role-static`: Element has `role="button"` but no event handler
- `potential-keyboard-trap`: Focus may become trapped without keyboard exit
- `deprecated-keycode`: Using old `event.keyCode` instead of `event.key`

## Additional Resources

- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [MDN: Making Content Accessible with Keyboard](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
- [ARIA Authoring Practices: Keyboard Support](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

## Testing

### Manual Testing

1. Navigate to the element using Tab key
2. Press Enter - should activate the element
3. Press Space - should activate the element
4. Element should have visible focus indicator

### Screen Reader Testing

- **NVDA/JAWS (Windows)**: Tab to element, press Enter or Space
- **VoiceOver (Mac)**: VO+Right Arrow to element, press Enter or Space
- **TalkBack (Android)**: Swipe to element, double-tap

## Examples

### Real-World Example: Modal Close Button

```javascript
// ❌ BAD: Mouse-only close button
const closeBtn = document.querySelector('.modal-close');
closeBtn.addEventListener('click', closeModal);

// ✅ GOOD: Keyboard-accessible close button
const closeBtn = document.querySelector('.modal-close');
closeBtn.setAttribute('aria-label', 'Close dialog');
closeBtn.setAttribute('tabindex', '0');

closeBtn.addEventListener('click', closeModal);
closeBtn.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    closeModal();
  }
});

// Even better: Also add Escape key handler for modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});
```

---

**Detected by:** Paradise Accessibility Analyzer
**Confidence:** HIGH when analyzing with full document context
**Auto-fix:** Available via Quick Fix (Ctrl+. / Cmd+.)
