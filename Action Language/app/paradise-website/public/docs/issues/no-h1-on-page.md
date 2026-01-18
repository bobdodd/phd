# no-h1-on-page

**Severity:** Error
**WCAG Criteria:** [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships), [2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels)

## Description

This issue occurs when a page has heading elements but is missing an H1 element. The H1 serves as the main heading that describes the primary purpose or topic of the page, essential for screen reader users to quickly understand page content.

## Why This Matters

- **Page Identity**: H1 immediately tells screen reader users what the page is about
- **Navigation**: Screen readers can jump directly to H1 to find the main content
- **Document Hierarchy**: H1 establishes the top level of the content structure
- **SEO**: Search engines give special weight to H1 elements
- **WCAG Compliance**: Required for WCAG 2.1 Level A compliance

## The Problem

A page with headings but no H1:

```html
<!-- ❌ BAD: Missing H1 -->
<h2>Welcome Section</h2>
<p>Introduction to our services.</p>

<h2>About Us</h2>
<p>Company information.</p>

<h3>Our Team</h3>
<p>Team member details.</p>
```

Screen reader users don't have a clear entry point to understand the page's main purpose.

## The Solution

Add exactly one H1 that describes the main page content:

```html
<!-- ✅ GOOD: Proper H1 as main heading -->
<h1>Company Services - Acme Corp</h1>

<h2>Welcome Section</h2>
<p>Introduction to our services.</p>

<h2>About Us</h2>
<p>Company information.</p>

<h3>Our Team</h3>
<p>Team member details.</p>
```

## H1 Guidelines

### Do's

- **One H1 per page** representing the main topic
- **Make it descriptive** - should clearly describe page content
- **Place it early** in the document
- **Include key terms** that describe the page purpose

### Don'ts

- **Don't use multiple H1s** on a single page
- **Don't hide H1** with CSS display:none or visibility:hidden
- **Don't make it vague** like "Welcome" or "Home"
- **Don't duplicate site name only** - include page-specific content

## Example H1s

```html
<!-- ✅ GOOD Examples -->
<h1>Chocolate Chip Cookie Recipe</h1>
<h1>Contact Us - Customer Support</h1>
<h1>Shopping Cart (3 items)</h1>
<h1>Privacy Policy - Acme Corporation</h1>

<!-- ❌ BAD Examples -->
<h1>Welcome</h1>              <!-- Too vague -->
<h1>Page</h1>                 <!-- Not descriptive -->
<h1>Acme Corp</h1>            <!-- Site name only -->
<h1></h1>                     <!-- Empty -->
```

## Quick Fix

Paradise will suggest adding an H1:

```html
<h1>Page Title - Main Topic</h1>
```

You should customize this to match your actual page content.

## Related Issues

- `no-headings-on-page`: Page has no headings at all
- `multiple-h1-headings`: Page has more than one H1
- `page-doesnt-start-with-h1`: First heading is not H1
- `empty-heading`: H1 exists but has no content

## Additional Resources

- [WebAIM: Semantic Structure - Headings](https://webaim.org/techniques/semanticstructure/#headings)
- [W3C: Page Regions - Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [Nielsen Norman Group: H1 Best Practices](https://www.nngroup.com/articles/h1-headings/)

## Testing

### Manual Testing

1. Look for exactly one H1 element on the page
2. Verify H1 clearly describes the page's main purpose
3. Check that H1 appears early in the document
4. Confirm H1 is visible (not hidden by CSS)

### Screen Reader Testing

- **NVDA/JAWS**: Press 1 key to jump to H1
- **VoiceOver**: VO+Command+H, then navigate to H1
- Verify H1 accurately describes page content

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** HIGH
**Auto-fix:** Available via Quick Fix
