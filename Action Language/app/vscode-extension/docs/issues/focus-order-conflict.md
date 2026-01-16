# focus-order-conflict

**Severity:** Warning
**WCAG Criteria:** [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)

## Description

This issue occurs when the visual order of elements doesn't match their focus order, or when positive tabindex values disrupt the natural tab order. This creates a confusing experience for keyboard users who rely on logical navigation.

## Why This Matters

- **Keyboard Users**: Expect Tab key to move focus in reading order (left-to-right, top-to-bottom)
- **Screen Reader Users**: Navigate by Tab and expect logical progression through content
- **Cognitive Accessibility**: Unpredictable focus order is disorienting
- **WCAG Compliance**: Required for Level A compliance (WCAG 2.4.3)

## The Problem

### Pattern 1: Positive tabindex Values

```html
<!-- ❌ BAD: Positive tabindex disrupts natural order -->
<button tabindex="3">First visually, third in focus order</button>
<input tabindex="1">Third visually, first in focus order</input>
<button tabindex="2">Second visually, second in focus order</button>
```

When user presses Tab:
1. Focuses input (tabindex="1")
2. Focuses second button (tabindex="2")
3. Focuses first button (tabindex="3")
4. Then continues to all tabindex="0" elements
5. Finally goes to negative tabindex elements

This is confusing because visual order ≠ focus order.

### Pattern 2: CSS Order vs DOM Order

```html
<div style="display: flex; flex-direction: row-reverse;">
  <button>Visually last</button>  <!-- But focuses first! -->
  <button>Visually first</button> <!-- But focuses last! -->
</div>
```

Visual order is reversed, but focus still follows DOM order.

## The Solution

### Solution 1: Remove Positive tabindex

```html
<!-- ✅ GOOD: Use tabindex="0" or no tabindex -->
<button>First</button>
<input>Second</input>
<button>Third</button>
```

Natural DOM order = focus order = visual order. Simple and predictable.

### Solution 2: Match DOM Order to Visual Order

```html
<!-- ✅ GOOD: Reorder DOM to match visual layout -->
<div style="display: flex; flex-direction: row-reverse;">
  <button style="order: 2;">Visually last</button>
  <button style="order: 1;">Visually first</button>
</div>
```

Or better yet, just reorder the DOM:

```html
<div style="display: flex; flex-direction: row-reverse;">
  <button>Visually first</button>  <!-- DOM order matches visual -->
  <button>Visually last</button>
</div>
```

### Solution 3: When You Need tabindex

Only use tabindex with these values:
- **tabindex="0"**: Element is focusable in natural order
- **tabindex="-1"**: Element is focusable only via JavaScript (not by Tab key)
- **No tabindex**: Natural focusability (buttons, links, inputs are focusable by default)

```html
<!-- ✅ GOOD: tabindex="0" for custom interactive elements -->
<div role="button" tabindex="0" onclick="...">Custom Button</div>

<!-- ✅ GOOD: tabindex="-1" for programmatic focus -->
<div id="error-message" tabindex="-1">Error: ...</div>
<script>
  // Focus error message programmatically
  document.getElementById('error-message').focus();
</script>
```

## Common Scenarios

### Scenario 1: Modal Dialogs

```javascript
// ❌ BAD: Using tabindex to force focus order in modal
modalTitle.setAttribute('tabindex', '1');
closeButton.setAttribute('tabindex', '2');
okButton.setAttribute('tabindex', '3');

// ✅ GOOD: Arrange DOM in focus order, use focus trap
<div role="dialog" aria-modal="true">
  <h2 id="modal-title">Title</h2>
  <button class="close">Close</button>
  <button class="ok">OK</button>
</div>
```

### Scenario 2: Skip Links

```html
<!-- ✅ GOOD: Skip link is first in DOM and focus order -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<nav>...</nav>
<main id="main-content">...</main>
```

Don't use tabindex to try to make skip link "first" - put it first in DOM.

### Scenario 3: Grid/Table Navigation

```html
<!-- ❌ BAD: Trying to control arrow key navigation with tabindex -->
<div role="grid">
  <div role="row">
    <div role="gridcell" tabindex="1">Cell 1</div>
    <div role="gridcell" tabindex="2">Cell 2</div>
  </div>
</div>

<!-- ✅ GOOD: Use roving tabindex pattern -->
<div role="grid">
  <div role="row">
    <div role="gridcell" tabindex="0">Cell 1</div>
    <div role="gridcell" tabindex="-1">Cell 2</div>
  </div>
</div>
<script>
  // Handle arrow keys and update tabindex dynamically
</script>
```

## How Paradise Detects This

Paradise looks for:
1. Any element with `tabindex > 0`
2. CSS properties that change visual order (flex-direction, order, position: absolute)
3. Mismatches between DOM order and visual presentation

## Testing

### Manual Testing

1. **Tab Through Page**: Press Tab repeatedly
2. **Check Order**: Does focus move in logical reading order?
3. **Visual vs Focus**: Does focus jump around unexpectedly?

### Browser DevTools

1. Open DevTools → Elements
2. Search for `tabindex` in HTML
3. Look for positive numbers (1, 2, 3, etc.)

### Screen Reader Testing

- **NVDA/JAWS**: Tab through page, listen for order
- **VoiceOver**: VO+Right Arrow, check if order matches visual layout

## Real-World Example

```html
<!-- ❌ BAD: Newsletter signup with confused order -->
<div class="signup-form">
  <input type="email" placeholder="Email" tabindex="2">
  <button tabindex="3">Subscribe</button>
  <a href="/privacy" tabindex="1">Privacy Policy</a> <!-- Focuses first, but visually last -->
</div>

<!-- ✅ GOOD: Natural order -->
<div class="signup-form">
  <a href="/privacy">Privacy Policy</a>
  <input type="email" placeholder="Email">
  <button>Subscribe</button>
</div>
```

Or if you need different visual order, use CSS:

```html
<!-- ✅ GOOD: CSS handles visual order, DOM is logical -->
<div class="signup-form" style="display: flex; flex-direction: column-reverse;">
  <a href="/privacy" style="order: 3;">Privacy Policy</a>
  <input type="email" placeholder="Email" style="order: 1;">
  <button style="order: 2;">Subscribe</button>
</div>
```

## Related Issues

- `positive-tabindex`: Using tabindex > 0
- `possibly-non-focusable`: Element not naturally focusable
- `potential-keyboard-trap`: Focus can't escape from component

## Additional Resources

- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/tabindex)
- [MDN: tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
- [ARIA Authoring Practices: Keyboard Navigation](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

---

**Detected by:** Paradise Accessibility Analyzer
**Confidence:** HIGH when analyzing with full document context
**Auto-fix:** Not available (requires manual DOM restructuring)
