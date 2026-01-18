# heading-levels-skipped

**Severity:** Error
**WCAG Criteria:** [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships)

## Description

This issue occurs when heading levels are skipped in the document hierarchy. For example, jumping from H1 directly to H3 without an H2, or from H2 to H4. Screen readers rely on proper heading hierarchy to convey document structure.

## Why This Matters

- **Document Structure**: Skipped levels break the logical outline of the content
- **Screen Reader Navigation**: Users navigating by heading level may miss content
- **Comprehension**: Proper hierarchy helps users understand content relationships
- **WCAG Compliance**: Required for WCAG 2.1 Level A compliance (Success Criterion 1.3.1)

## The Problem

Skipping heading levels:

```html
<!-- ❌ BAD: Skips from H1 to H3 -->
<h1>Main Title</h1>
<h3>Subsection</h3>  <!-- Where is H2? -->
<p>Content...</p>

<!-- ❌ BAD: Skips from H2 to H5 -->
<h1>Products</h1>
<h2>Electronics</h2>
<h5>Laptops</h5>  <!-- Skipped H3 and H4! -->
```

Screen readers announce heading levels. When levels are skipped, users may think they've missed important sections or that the document structure is broken.

## The Solution

Maintain sequential heading levels without gaps:

```html
<!-- ✅ GOOD: Sequential hierarchy -->
<h1>Main Title</h1>
<h2>Major Section</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>
<h3>Another Subsection</h3>
<h2>Another Major Section</h2>
```

## Important Rules

### You CAN:
- **Increase by one level** (H1 → H2, H2 → H3, etc.)
- **Decrease by multiple levels** (H4 → H2, H3 → H1, etc.)
- **Stay at the same level** (H2 → H2, H3 → H3, etc.)

### You CANNOT:
- **Skip levels when increasing** (H1 → H3, H2 → H5, etc.)

## Examples

### Correct Hierarchy

```html
<!-- ✅ GOOD: Proper nesting -->
<h1>Recipe Collection</h1>

<h2>Breakfast Recipes</h2>
<h3>Pancakes</h3>
<h4>Ingredients</h4>
<h4>Instructions</h4>
<h3>Waffles</h3>

<h2>Lunch Recipes</h2>  <!-- Can jump back to H2 -->
<h3>Sandwiches</h3>
```

### Common Mistakes

```html
<!-- ❌ BAD: Common skipping patterns -->

<!-- Mistake 1: Skipping to create visual style -->
<h1>Title</h1>
<h4>Subtitle</h4>  <!-- Used H4 for smaller text -->

<!-- ✅ FIX: Use CSS for styling -->
<h1>Title</h1>
<h2 class="subtitle">Subtitle</h2>  /* Style with CSS */

<!-- Mistake 2: Inconsistent nesting -->
<h1>Main</h1>
<h2>Section</h2>
<h4>Detail</h4>  <!-- Should be H3 -->

<!-- ✅ FIX: Maintain sequence -->
<h1>Main</h1>
<h2>Section</h2>
<h3>Detail</h3>
```

## Visual Styling vs. Semantic Structure

**Don't choose heading levels based on appearance!**

```css
/* ✅ GOOD: Use CSS to control appearance */
h2.large-subtitle {
  font-size: 1.8rem;
  font-weight: 300;
}

h3.small-heading {
  font-size: 1rem;
  font-weight: 600;
}
```

Choose heading levels based on content hierarchy, then style them as needed.

## Real-World Example

```html
<!-- ✅ GOOD: Blog post structure -->
<article>
  <h1>Understanding Web Accessibility</h1>

  <h2>Introduction</h2>
  <p>Accessibility ensures everyone can use your website...</p>

  <h2>Key Principles</h2>
  <h3>Perceivable</h3>
  <p>Information must be presentable...</p>

  <h3>Operable</h3>
  <p>Interface must be usable...</p>

  <h4>Keyboard Access</h4>
  <p>All functionality must be keyboard accessible...</p>

  <h4>Timing</h4>
  <p>Users need enough time...</p>

  <h3>Understandable</h3>  <!-- Back to H3 is fine -->
  <p>Content must be understandable...</p>

  <h2>Conclusion</h2>  <!-- Back to H2 is fine -->
  <p>Accessibility benefits everyone...</p>
</article>
```

## Quick Fix

Paradise will suggest the correct heading level:

```html
<!-- From this: -->
<h1>Title</h1>
<h3>Section</h3>

<!-- To this: -->
<h1>Title</h1>
<h2>Section</h2>
```

## Related Issues

- `no-h1-on-page`: Page missing H1
- `multiple-h1-headings`: Multiple H1 elements
- `page-doesnt-start-with-h1`: First heading is not H1

## Additional Resources

- [WebAIM: Semantic Structure - Headings](https://webaim.org/techniques/semanticstructure/#headings)
- [W3C: Headings Tutorial](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [MDN: HTML Heading Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)

## Testing

### Screen Reader Testing

1. Navigate by headings (H key in NVDA/JAWS)
2. Listen to heading level announcements
3. Verify each level increase is only by one

### Automated Testing

```javascript
// Check heading hierarchy
const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
let previousLevel = 0;

headings.forEach(heading => {
  const level = parseInt(heading.tagName[1]);
  if (previousLevel > 0 && level > previousLevel + 1) {
    console.error(`Skipped from H${previousLevel} to H${level}`);
  }
  previousLevel = level;
});
```

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** HIGH
**Auto-fix:** Available via Quick Fix
