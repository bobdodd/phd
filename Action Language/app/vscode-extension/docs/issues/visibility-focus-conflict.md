# visibility-focus-conflict

**Severity:** Warning
**WCAG Criteria:** [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)

## Description

This issue occurs when an element can receive keyboard focus but is visually hidden or invisible. This creates confusion for keyboard users who can focus on elements they cannot see, making it impossible to know where they are on the page.

## Why This Matters

- **Keyboard Users**: Need to see where focus is to navigate effectively
- **Low Vision Users**: Rely heavily on visible focus indicators
- **WCAG Compliance**: Required for Level AA compliance (WCAG 2.4.7)
- **User Experience**: Hidden focused elements cause confusion and lost context

## The Problem

### Pattern 1: Hidden Element with Focus

```html
<!-- ❌ BAD: Element can receive focus but is hidden -->
<button style="display: none;" tabindex="0">Hidden Button</button>
<button style="visibility: hidden;">Also Hidden</button>
<button style="opacity: 0;">Invisible Button</button>
```

User presses Tab, focus moves to hidden button, but they see nothing.

### Pattern 2: Off-Screen Element Still Focusable

```html
<!-- ❌ BAD: Element moved off-screen but still focusable -->
<button style="position: absolute; left: -9999px;">
  Off-screen Button
</button>
```

### Pattern 3: Removing Focus Outline

```css
/* ❌ BAD: Removing focus indicator */
*:focus {
  outline: none;
}

button:focus {
  outline: 0;
}
```

Element is visible but focus indicator is not.

## The Solution

### Solution 1: Remove from Tab Order When Hidden

```html
<!-- ✅ GOOD: Hidden elements have tabindex="-1" -->
<button style="display: none;" tabindex="-1">Hidden Button</button>
```

Or better yet, use `inert` attribute (modern browsers):

```html
<!-- ✅ BEST: Inert completely removes from accessibility tree -->
<div inert style="display: none;">
  <button>Hidden Button</button>
  <!-- All children automatically unfocusable -->
</div>
```

### Solution 2: Properly Manage Visibility State

```javascript
// ✅ GOOD: Toggle both visibility and focusability
function hideElement(element) {
  element.style.display = 'none';
  element.setAttribute('tabindex', '-1');
  element.setAttribute('aria-hidden', 'true');
}

function showElement(element) {
  element.style.display = 'block';
  element.removeAttribute('tabindex'); // Or set to '0'
  element.removeAttribute('aria-hidden');
}
```

### Solution 3: Visible Focus Indicators

```css
/* ✅ GOOD: Clear focus indicators */
*:focus {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}

/* ✅ BETTER: Use :focus-visible for keyboard-only focus */
*:focus-visible {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}

/* Remove outline only for mouse clicks */
*:focus:not(:focus-visible) {
  outline: none;
}
```

## Common Scenarios

### Scenario 1: Accordion/Collapsible Content

```html
<!-- ❌ BAD: Hidden content still focusable -->
<button aria-expanded="false" aria-controls="content">Toggle</button>
<div id="content" style="display: none;">
  <a href="#">Still focusable link!</a>
</div>

<!-- ✅ GOOD: Use inert or remove from tab order -->
<button aria-expanded="false" aria-controls="content">Toggle</button>
<div id="content" inert hidden>
  <a href="#">Not focusable when hidden</a>
</div>
```

JavaScript:

```javascript
function toggleAccordion(button, content) {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    content.hidden = true;
    content.setAttribute('inert', '');
    button.setAttribute('aria-expanded', 'false');
  } else {
    content.hidden = false;
    content.removeAttribute('inert');
    button.setAttribute('aria-expanded', 'true');
  }
}
```

### Scenario 2: Modal Dialogs

```javascript
// ✅ GOOD: Hide background content when modal opens
function openModal(modal) {
  modal.style.display = 'block';
  modal.removeAttribute('inert');

  // Make background inert
  document.getElementById('main-content').setAttribute('inert', '');

  // Trap focus in modal
  modal.querySelector('button').focus();
}

function closeModal(modal) {
  modal.style.display = 'none';
  modal.setAttribute('inert', '');

  // Restore background
  document.getElementById('main-content').removeAttribute('inert');
}
```

### Scenario 3: Skip Links

```html
<!-- ✅ GOOD: Skip link visible on focus -->
<a href="#main" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  left: -9999px; /* Off-screen by default */
}

.skip-link:focus {
  left: 0; /* Visible when focused */
  top: 0;
  background: #000;
  color: #fff;
  padding: 10px;
  z-index: 1000;
}
</style>
```

### Scenario 4: Loading Spinners

```html
<!-- ❌ BAD: Hidden spinner still has focusable content -->
<div class="spinner" style="display: none;">
  <button>Cancel</button> <!-- Still focusable! -->
</div>

<!-- ✅ GOOD: Use inert -->
<div class="spinner" inert hidden>
  <button>Cancel</button> <!-- Not focusable -->
</div>
```

## How Paradise Detects This

Paradise checks for:
1. Elements with `display: none`, `visibility: hidden`, or `opacity: 0` that are focusable
2. Elements positioned off-screen (`left: -9999px`) without visual indicators
3. Elements with `:focus` styles that remove outlines
4. Focus states that conflict with visibility

## Testing

### Manual Testing

1. **Tab Through Page**: Press Tab key repeatedly
2. **Watch Focus**: Can you see where focus is at all times?
3. **Hidden Sections**: Tab into collapsed accordions, closed modals
4. **Focus Indicators**: Are outlines visible when focusing with keyboard?

### Browser DevTools

```javascript
// Find focusable but hidden elements
document.querySelectorAll('[tabindex]').forEach(el => {
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    console.log('Hidden focusable element:', el);
  }
});
```

### Screen Reader Testing

- **NVDA/JAWS**: Tab through page, listen for announcements of hidden content
- **VoiceOver**: Check if invisible elements are announced

## Real-World Example: Tab Panel

```html
<!-- ❌ BAD: Hidden panels still focusable -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>

<div role="tabpanel" id="panel1">
  <a href="#">Link in visible panel</a>
</div>

<div role="tabpanel" id="panel2" style="display: none;">
  <a href="#">Link in hidden panel - still focusable!</a>
</div>

<!-- ✅ GOOD: Hidden panels are inert -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>

<div role="tabpanel" id="panel1">
  <a href="#">Link in visible panel</a>
</div>

<div role="tabpanel" id="panel2" inert hidden>
  <a href="#">Not focusable when hidden</a>
</div>
```

JavaScript:

```javascript
function showTab(tabButton) {
  // Hide all panels
  document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
    panel.hidden = true;
    panel.setAttribute('inert', '');
  });

  // Show selected panel
  const panelId = tabButton.getAttribute('aria-controls');
  const panel = document.getElementById(panelId);
  panel.hidden = false;
  panel.removeAttribute('inert');

  // Update aria-selected
  document.querySelectorAll('[role="tab"]').forEach(tab => {
    tab.setAttribute('aria-selected', 'false');
  });
  tabButton.setAttribute('aria-selected', 'true');
}
```

## Browser Support for `inert`

The `inert` attribute is supported in:
- Chrome 102+
- Edge 102+
- Firefox 112+
- Safari 15.5+

For older browsers, use a polyfill:

```html
<script src="https://cdn.jsdelivr.net/npm/wicg-inert@3/dist/inert.min.js"></script>
```

Or manually manage tabindex:

```javascript
function makeInert(container) {
  container.setAttribute('aria-hidden', 'true');

  // Find all focusable elements
  const focusable = container.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  focusable.forEach(el => {
    el.setAttribute('data-original-tabindex', el.getAttribute('tabindex') || '0');
    el.setAttribute('tabindex', '-1');
  });
}

function removeInert(container) {
  container.removeAttribute('aria-hidden');

  const focusable = container.querySelectorAll('[data-original-tabindex]');
  focusable.forEach(el => {
    const original = el.getAttribute('data-original-tabindex');
    if (original === '0') {
      el.removeAttribute('tabindex');
    } else {
      el.setAttribute('tabindex', original);
    }
    el.removeAttribute('data-original-tabindex');
  });
}
```

## Related Issues

- `focus-order-conflict`: Focus moves in unexpected order
- `potential-keyboard-trap`: Focus cannot escape from component
- `removal-without-focus-management`: Element removed while focused

## Additional Resources

- [MDN: inert attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert)
- [WebAIM: Invisible Content](https://webaim.org/techniques/css/invisiblecontent/)
- [ARIA Authoring Practices: Managing Focus](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

---

**Detected by:** Paradise Accessibility Analyzer
**Confidence:** HIGH when analyzing with full document context
**Auto-fix:** Not available (requires manual focus management)
