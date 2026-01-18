# page-doesnt-start-with-h1

**Severity:** Warning
**WCAG Criteria:** [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships), [2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels)

## Description

This issue occurs when a page's first heading is not an H1 element. While pages can have valid heading structures that don't start with H1, it's best practice to begin with H1 as it provides immediate context about the page's main purpose.

## Why This Matters

- **Immediate Context**: H1 should be the first thing screen reader users encounter when navigating by headings
- **Logical Structure**: Starting with H1 establishes clear document hierarchy
- **User Expectations**: Users expect H1 to be the page's main topic, presented first
- **Navigation Efficiency**: Screen reader users pressing "1" to jump to H1 expect to find the start of main content

## The Problem

Page starts with lower-level heading:

```html
<!-- ❌ BAD: Page starts with H2 -->
<h2>Welcome Message</h2>
<p>Thanks for visiting our site.</p>

<h1>Company Services</h1>
<h2>Web Development</h2>
<h2>Design Services</h2>
```

The H1 appears after other content, so users navigating by headings don't immediately understand the page's main purpose.

## The Solution

Start the page with H1 describing the main content:

```html
<!-- ✅ GOOD: Page starts with H1 -->
<h1>Company Services</h1>

<h2>Welcome Message</h2>
<p>Thanks for visiting our site.</p>

<h2>Web Development</h2>
<p>Details about web development.</p>

<h2>Design Services</h2>
<p>Details about design services.</p>
```

## Common Scenarios

### Scenario 1: Navigation Before Content

```html
<!-- ❌ BAD: H2 in navigation appears first -->
<nav>
  <h2>Site Navigation</h2>
  <ul>...</ul>
</nav>
<main>
  <h1>Page Title</h1>
</main>

<!-- ✅ GOOD: H1 comes first, or use proper landmarks -->
<h1>Page Title</h1>
<nav aria-label="Main navigation">
  <ul>...</ul>
</nav>
<main>
  <!-- content -->
</main>
```

### Scenario 2: Greeting Before Title

```html
<!-- ❌ BAD: Greeting takes H1, main title is H2 -->
<h1>Hello!</h1>
<h2>Product Catalog</h2>

<!-- ✅ GOOD: Main title is H1 -->
<h1>Product Catalog</h1>
<p class="greeting">Hello! Welcome to our catalog.</p>
```

### Scenario 3: Banner Content

```html
<!-- ❌ BAD: Banner heading comes before main heading -->
<div class="banner">
  <h2>Sale: 50% Off!</h2>
</div>
<h1>Online Store</h1>

<!-- ✅ GOOD: H1 first, banner uses paragraph -->
<h1>Online Store</h1>
<div class="banner" role="banner">
  <p class="sale-announcement">Sale: 50% Off!</p>
</div>
```

## ARIA Landmarks Can Help

If you need content before H1, use ARIA landmarks to help users skip:

```html
<!-- ✅ GOOD: Landmarks provide structure -->
<div role="banner">
  <p>Announcement: Site maintenance scheduled</p>
</div>

<nav aria-label="Main navigation">
  <ul>...</ul>
</nav>

<main>
  <h1>Page Title</h1>
  <!-- main content -->
</main>
```

## Quick Fix

Paradise will suggest moving H1 to the beginning:

```html
<h1>Page Title</h1>
<h2>First Section</h2>
```

## Related Issues

- `no-h1-on-page`: Page missing H1 entirely
- `multiple-h1-headings`: Page has more than one H1
- `heading-levels-skipped`: Heading hierarchy has gaps

## Additional Resources

- [W3C: Headings and Labels](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels)
- [WebAIM: Semantic Structure](https://webaim.org/techniques/semanticstructure/)
- [MDN: Document and Website Structure](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure)

## Testing

### Screen Reader Testing

1. Open page with screen reader
2. Press 1 to jump to H1
3. Verify you land at the beginning of main content
4. Check if H1 clearly identifies page purpose

### Visual Inspection

Look at the HTML source order (not visual layout). The first heading element should be an H1.

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** MEDIUM
**Auto-fix:** Available via Quick Fix
