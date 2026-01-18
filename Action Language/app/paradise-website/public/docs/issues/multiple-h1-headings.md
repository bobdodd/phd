# multiple-h1-headings

**Severity:** Warning
**WCAG Criteria:** [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships)

## Description

This issue occurs when a page contains more than one H1 element. While HTML5 allows multiple H1s in different `<section>` elements, screen readers and assistive technologies work better with a single H1 per page that clearly identifies the main content.

## Why This Matters

- **Clarity**: Single H1 provides clear page identity
- **Navigation**: Screen reader users jumping to H1 expect to find the main topic
- **Document Structure**: Multiple H1s create ambiguity about page hierarchy
- **SEO**: Search engines may be confused about page's primary topic

## The Problem

Multiple H1 elements create confusion:

```html
<!-- ❌ BAD: Multiple H1 elements -->
<h1>Welcome to Our Site</h1>
<p>Introduction paragraph.</p>

<h1>About Our Company</h1>
<p>Company information.</p>

<h1>Contact Information</h1>
<p>How to reach us.</p>
```

Which H1 represents the page's main topic? Screen reader users pressing "1" to jump to H1 will land on the first one, potentially missing other important "main" headings.

## The Solution

Use a single H1 for the main page topic, with H2 for major sections:

```html
<!-- ✅ GOOD: Single H1, proper hierarchy -->
<h1>Company Information - Acme Corp</h1>

<h2>Welcome</h2>
<p>Introduction paragraph.</p>

<h2>About Our Company</h2>
<p>Company information.</p>

<h2>Contact Information</h2>
<p>How to reach us.</p>
```

## HTML5 Sections Exception

HTML5 theoretically allows multiple H1s within `<section>` elements:

```html
<!-- ⚠️ Technically valid HTML5, but not recommended -->
<h1>Main Page Title</h1>

<section>
  <h1>Section Title</h1>
  <p>Section content.</p>
</section>

<section>
  <h1>Another Section</h1>
  <p>More content.</p>
</section>
```

**However:** Most screen readers and assistive technologies don't implement the HTML5 outlining algorithm. They treat all H1s as top-level headings, causing confusion.

**Best Practice:** Use the traditional heading hierarchy even with sections:

```html
<!-- ✅ BETTER: Traditional hierarchy works everywhere -->
<h1>Main Page Title</h1>

<section>
  <h2>Section Title</h2>
  <p>Section content.</p>
</section>

<section>
  <h2>Another Section</h2>
  <p>More content.</p>
</section>
```

## When You Might Have Multiple H1s

Common scenarios causing this issue:

### Pattern 1: Header + Main Content

```html
<!-- ❌ BAD -->
<header>
  <h1>Site Name</h1>
</header>
<main>
  <h1>Page Title</h1>
</main>

<!-- ✅ GOOD -->
<header>
  <p class="site-name">Site Name</p> <!-- or use logo -->
</header>
<main>
  <h1>Page Title</h1>
</main>
```

### Pattern 2: Sidebar Content

```html
<!-- ❌ BAD -->
<main>
  <h1>Main Article</h1>
</main>
<aside>
  <h1>Related Links</h1>
</aside>

<!-- ✅ GOOD -->
<main>
  <h1>Main Article</h1>
</main>
<aside>
  <h2>Related Links</h2>
</aside>
```

## Quick Fix

Paradise will suggest converting additional H1s to H2:

```html
<h1>Main Page Title</h1>
<!-- Change other H1s to appropriate levels: -->
<h2>Section Title</h2>
<h2>Another Section</h2>
```

## Related Issues

- `no-h1-on-page`: Page missing H1 element
- `page-doesnt-start-with-h1`: First heading is not H1
- `heading-levels-skipped`: Heading hierarchy has gaps

## Additional Resources

- [HTML5 Doctor: The H1 Debate](http://html5doctor.com/howto-subheadings/)
- [Adrian Roselli: Don't Use Multiple h1 Elements](https://adrianroselli.com/2013/12/the-truth-about-multiple-h1-tags.html)
- [WebAIM: Semantic Structure](https://webaim.org/techniques/semanticstructure/)

## Testing

### Screen Reader Testing

1. Use heading navigation (H key in NVDA/JAWS)
2. Count how many H1 elements are announced
3. Verify only one H1 clearly identifies main content

### Manual Testing

```javascript
// Check for multiple H1s
const h1Count = document.querySelectorAll('h1').length;
console.log(`Found ${h1Count} H1 elements`); // Should be 1
```

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** HIGH
**Auto-fix:** Available via Quick Fix
