# empty-heading

**Severity:** Error
**WCAG Criteria:** [2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels), [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships)

## Description

This issue occurs when a heading element (h1-h6) contains no text content or only whitespace. Empty headings confuse screen reader users who expect headings to describe the sections they introduce.

## Why This Matters

- **Screen Reader Confusion**: Screen readers announce "heading level X, empty" which provides no information
- **Navigation Problems**: Users navigating by headings encounter meaningless stops
- **Document Structure**: Empty headings break the logical content outline
- **WCAG Compliance**: Violates WCAG 2.1 Level AA (Success Criterion 2.4.6)

## The Problem

Empty or whitespace-only headings:

```html
<!-- ❌ BAD: Completely empty -->
<h2></h2>

<!-- ❌ BAD: Only whitespace -->
<h3>   </h3>

<!-- ❌ BAD: Only line breaks -->
<h2>

</h2>

<!-- ❌ BAD: Empty with child elements but no text -->
<h2><span class="icon"></span></h2>
```

Screen readers will announce these as "heading level 2, empty" or similar, which is confusing and unhelpful.

## The Solution

### Option 1: Add Descriptive Text

```html
<!-- ✅ GOOD: Descriptive text content -->
<h2>Customer Reviews</h2>
<h3>Product Features</h3>
<h4>Technical Specifications</h4>
```

### Option 2: Use Icons with Accessible Text

```html
<!-- ✅ GOOD: Icon with accessible text -->
<h2>
  <svg aria-hidden="true" class="icon">...</svg>
  <span>Settings</span>
</h2>

<!-- ✅ GOOD: Icon with visually-hidden text -->
<h2>
  <i class="icon-settings" aria-hidden="true"></i>
  <span class="sr-only">Settings</span>
</h2>

<!-- ✅ GOOD: Icon with aria-label -->
<h2 aria-label="Settings">
  <i class="icon-settings" aria-hidden="true"></i>
</h2>
```

### Option 3: Remove if Unnecessary

```html
<!-- ❌ BAD: Empty placeholder heading -->
<div class="section">
  <h2></h2>
  <p>Content goes here...</p>
</div>

<!-- ✅ GOOD: Remove if not needed -->
<div class="section">
  <p>Content goes here...</p>
</div>
```

## Common Causes

### Cause 1: JavaScript Injection

```javascript
// ❌ BAD: Creates empty heading temporarily
const heading = document.createElement('h2');
document.body.appendChild(heading);
// ... later ...
heading.textContent = 'Loaded Content';

// ✅ GOOD: Set content immediately
const heading = document.createElement('h2');
heading.textContent = 'Loaded Content';
document.body.appendChild(heading);
```

### Cause 2: Template Placeholders

```html
<!-- ❌ BAD: Empty template -->
<h2 id="product-name"></h2>

<!-- ✅ GOOD: Hide until populated -->
<h2 id="product-name" hidden></h2>

<script>
  const heading = document.getElementById('product-name');
  heading.textContent = productData.name;
  heading.hidden = false;
</script>
```

### Cause 3: CSS-Only Content

```html
<!-- ❌ BAD: Content only in CSS ::before/::after -->
<h2 class="section-heading"></h2>

<style>
  .section-heading::before {
    content: "Section Title";
  }
</style>

<!-- ✅ GOOD: Real text content -->
<h2>Section Title</h2>
```

CSS-generated content is not accessible to screen readers.

## Framework-Specific Examples

### React

```jsx
// ❌ BAD: Conditional rendering creates empty heading
<h2>{data ? data.title : ''}</h2>

// ✅ GOOD: Don't render if empty
{data?.title && <h2>{data.title}</h2>}

// ✅ GOOD: Provide fallback text
<h2>{data?.title || 'Untitled Section'}</h2>
```

### Vue

```vue
<!-- ❌ BAD: May be empty during loading -->
<h2>{{ title }}</h2>

<!-- ✅ GOOD: Conditional rendering -->
<h2 v-if="title">{{ title }}</h2>

<!-- ✅ GOOD: Fallback content -->
<h2>{{ title || 'Loading...' }}</h2>
```

### Angular

```html
<!-- ❌ BAD: Empty during async load -->
<h2>{{ title }}</h2>

<!-- ✅ GOOD: Use *ngIf -->
<h2 *ngIf="title">{{ title }}</h2>

<!-- ✅ GOOD: Provide fallback -->
<h2>{{ title || 'Untitled' }}</h2>
```

## Visually Hidden Text

If you need a heading for screen readers but not visually:

```html
<!-- ✅ GOOD: Visually hidden but accessible -->
<h2 class="sr-only">Skip to Content</h2>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

**Never use `display: none` or `visibility: hidden`** as these hide content from screen readers too.

## Quick Fix

Paradise will suggest adding descriptive text:

```html
<h2>Descriptive Section Title</h2>
```

Or removing the heading if it's not needed.

## Related Issues

- `hidden-heading`: Heading exists but hidden by CSS
- `heading-too-long`: Heading text exceeds recommended length
- `aria-level-without-role`: ARIA heading pattern without proper role

## Additional Resources

- [WebAIM: Headings](https://webaim.org/techniques/semanticstructure/#headings)
- [W3C: Providing Descriptive Headings](https://www.w3.org/WAI/WCAG21/Techniques/general/G130)
- [Deque: Empty Headings](https://dequeuniversity.com/rules/axe/4.4/empty-heading)

## Testing

### Screen Reader Testing

1. Navigate by headings (H key in NVDA/JAWS)
2. Listen for "empty" or blank announcements
3. Verify all headings have meaningful text

### Automated Testing

```javascript
// Check for empty headings
document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
  if (heading.textContent.trim() === '') {
    console.error('Empty heading:', heading);
  }
});
```

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** HIGH
**Auto-fix:** Available via Quick Fix
