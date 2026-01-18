# missing-aria-connection

**Severity:** Warning
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships)

## Description

This issue occurs when an ARIA attribute references an element ID that doesn't exist in the document. Common examples include `aria-labelledby`, `aria-describedby`, `aria-controls`, and `aria-owns` pointing to non-existent elements.

## Why This Matters

- **Screen Readers**: Screen readers follow ARIA references to provide context to users
- **Broken Relationships**: When references are broken, users lose critical context
- **Confusing Experience**: Screen reader may announce "unlabeled" or fail silently
- **WCAG Compliance**: Required for proper semantic relationships (WCAG 1.3.1, 4.1.2)

## The Problem

### Example 1: Missing Label Reference

```html
<!-- ❌ BAD: aria-labelledby points to non-existent element -->
<button aria-labelledby="save-label">
  <svg>...</svg>
</button>
<!-- No element with id="save-label" exists! -->
```

Screen reader will announce: "Unlabeled button" or just "Button" without context.

### Example 2: Typo in ID

```html
<!-- ❌ BAD: Typo in aria-describedby -->
<input
  type="text"
  aria-describedby="password-hint"  <!-- Wrong: "password-hint" -->
/>
<div id="password-hints">  <!-- Actual ID: "password-hints" (plural) -->
  Must be at least 8 characters
</div>
```

### Example 3: Missing Controlled Element

```html
<!-- ❌ BAD: aria-controls points to non-existent panel -->
<button
  aria-expanded="false"
  aria-controls="settings-panel"
>
  Settings
</button>
<!-- No element with id="settings-panel" exists -->
```

## The Solution

### Solution 1: Add the Missing Element

Create the element that the ARIA attribute references:

```html
<!-- ✅ GOOD: Label element exists -->
<button aria-labelledby="save-label">
  <svg>...</svg>
</button>
<span id="save-label" class="sr-only">Save document</span>
```

### Solution 2: Fix the ID Reference

Correct typos in ARIA attribute values:

```html
<!-- ✅ GOOD: ID matches exactly -->
<input
  type="text"
  aria-describedby="password-hints"  <!-- Matches the ID below -->
/>
<div id="password-hints">
  Must be at least 8 characters
</div>
```

### Solution 3: Use Direct Labeling

If you don't need the referenced element, use direct ARIA attributes:

```html
<!-- ✅ GOOD: Direct aria-label instead of aria-labelledby -->
<button aria-label="Save document">
  <svg>...</svg>
</button>
```

## Common ARIA Reference Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `aria-labelledby` | References element(s) that label this element | `<button aria-labelledby="label-id">` |
| `aria-describedby` | References element(s) that describe this element | `<input aria-describedby="hint-id">` |
| `aria-controls` | References element(s) controlled by this element | `<button aria-controls="panel-id">` |
| `aria-owns` | References element(s) owned by this element | `<div aria-owns="child-id">` |
| `aria-activedescendant` | References the currently active descendant | `<div aria-activedescendant="item-3">` |
| `aria-flowto` | References next element in reading order | `<div aria-flowto="section-2">` |

## Pattern: Multiple References

Some ARIA attributes accept space-separated lists of IDs:

```html
<!-- ✅ GOOD: Multiple references -->
<button
  aria-labelledby="icon-label action-label"  <!-- Two IDs -->
>
  <svg id="icon-label" aria-label="Save">...</svg>
  <span id="action-label">Save</span>
</button>
```

All referenced IDs must exist:

```html
<!-- ❌ BAD: Second ID doesn't exist -->
<button
  aria-labelledby="icon-label missing-label"  <!-- "missing-label" doesn't exist -->
>
  <svg id="icon-label" aria-label="Save">...</svg>
</button>
```

## Real-World Examples

### Example 1: Form Field with Hint

```html
<!-- ❌ BAD: Missing hint element -->
<label for="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby="email-hint"  <!-- References missing element -->
/>

<!-- ✅ GOOD: Hint element exists -->
<label for="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby="email-hint"
/>
<div id="email-hint">
  We'll never share your email with anyone.
</div>
```

### Example 2: Expandable Section (Disclosure)

```html
<!-- ❌ BAD: Missing panel element -->
<button
  aria-expanded="false"
  aria-controls="details-panel"
>
  Show details
</button>

<!-- ✅ GOOD: Panel element exists -->
<button
  aria-expanded="false"
  aria-controls="details-panel"
>
  Show details
</button>
<div id="details-panel" hidden>
  Detailed information here...
</div>
```

### Example 3: Combobox with Listbox

```html
<!-- ❌ BAD: Missing listbox element -->
<input
  role="combobox"
  aria-controls="country-listbox"  <!-- References missing listbox -->
  aria-expanded="false"
/>

<!-- ✅ GOOD: Listbox exists -->
<input
  role="combobox"
  aria-controls="country-listbox"
  aria-expanded="false"
/>
<ul id="country-listbox" role="listbox" hidden>
  <li role="option">United States</li>
  <li role="option">Canada</li>
  <li role="option">Mexico</li>
</ul>
```

## Dynamic Content Considerations

When creating elements dynamically, ensure references are valid:

```javascript
// ❌ BAD: Setting aria-controls before creating the element
const button = document.createElement('button');
button.setAttribute('aria-controls', 'dynamic-panel'); // Element doesn't exist yet!
document.body.appendChild(button);

// Later...
const panel = document.createElement('div');
panel.id = 'dynamic-panel';
document.body.appendChild(panel);

// ✅ GOOD: Create both elements before setting aria-controls
const panel = document.createElement('div');
panel.id = 'dynamic-panel';
document.body.appendChild(panel);

const button = document.createElement('button');
button.setAttribute('aria-controls', 'dynamic-panel'); // Now it exists!
document.body.appendChild(button);

// ✅ BETTER: Set aria-controls after both exist
const button = document.createElement('button');
const panel = document.createElement('div');
panel.id = 'dynamic-panel';

document.body.appendChild(button);
document.body.appendChild(panel);

button.setAttribute('aria-controls', 'dynamic-panel'); // Both exist in DOM
```

## How Paradise Detects This

When analyzing with **document-scope** (HTML + JavaScript), Paradise:

1. Parses HTML to build a map of all element IDs
2. Finds all ARIA reference attributes in the HTML
3. Validates that each referenced ID exists in the document
4. Reports missing IDs with HIGH confidence

**Example:**

```html
<button aria-labelledby="save-label">Save</button>  <!-- No element with id="save-label" -->
<button aria-labelledby="delete-label">Delete</button>  <!-- ✅ OK -->
<span id="delete-label">Delete item</span>
```

Paradise will flag the `save-label` reference as missing but not the `delete-label` reference.

## Confidence Levels

- **HIGH Confidence**: Document-scope analysis with full HTML - we can definitively say the ID doesn't exist
- **LOW Confidence**: File-scope analysis - element might exist in HTML we haven't analyzed

## Quick Fix

Paradise helps identify the issue:

1. Hover over the warning to see which ID is missing
2. Check for typos in the ARIA attribute value
3. Add the missing element with the correct ID
4. Or use direct ARIA attributes (`aria-label`) instead

## Testing with Screen Readers

### NVDA/JAWS (Windows)

1. Navigate to the element with broken ARIA reference
2. Listen for "unlabeled" or missing context
3. Check if described-by information is announced

### VoiceOver (Mac)

1. Navigate with VO+Right Arrow
2. Listen for incomplete or missing announcements
3. Use VO+F3 to check if referenced elements are reachable

### Browser DevTools

1. Open DevTools → Elements
2. Check Accessibility panel
3. Look for warnings about invalid ARIA references

## Related Issues

- `orphaned-event-handler`: JavaScript references non-existent element
- `dialog-missing-label`: Dialog missing `aria-label` or `aria-labelledby`
- `missing-required-aria`: Required ARIA attributes are missing

## Additional Resources

- [MDN: aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby)
- [MDN: aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)
- [ARIA Authoring Practices: Naming and Describing](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
- [WebAIM: ARIA Techniques](https://webaim.org/techniques/aria/)

---

**Detected by:** Paradise Accessibility Analyzer (Document-scope analysis)
**Confidence:** HIGH when full HTML context available
**Auto-fix:** Not available (requires manual ID correction or element creation)
