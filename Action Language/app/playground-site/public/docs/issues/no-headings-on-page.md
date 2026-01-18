# no-headings-on-page

**Severity:** Error
**WCAG Criteria:** [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships), [2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels)

## Description

This issue occurs when a page contains no heading elements (h1-h6). Headings provide crucial document structure that screen reader users rely on for navigation and understanding page organization.

## Why This Matters

- **Screen Reader Navigation**: Screen reader users frequently navigate pages by jumping between headings
- **Document Outline**: Headings create a logical outline that helps all users understand content hierarchy
- **SEO**: Search engines use headings to understand page structure and content importance
- **WCAG Compliance**: Required for WCAG 2.1 Level A compliance (Success Criteria 1.3.1, 2.4.6)

## The Problem

A page without headings:

```html
<!-- ❌ BAD: No heading structure -->
<div>
  <div class="title">Welcome to Our Site</div>
  <div>This is the main content area.</div>
  <div class="section-title">About Us</div>
  <div>Information about our company.</div>
</div>
```

Screen reader users cannot quickly navigate to different sections or understand the document structure.

## The Solution

Add proper heading hierarchy starting with H1:

```html
<!-- ✅ GOOD: Proper heading structure -->
<h1>Welcome to Our Site</h1>
<p>This is the main content area.</p>

<h2>About Us</h2>
<p>Information about our company.</p>

<h2>Our Services</h2>
<h3>Web Development</h3>
<p>Details about web development services.</p>

<h3>Design</h3>
<p>Details about design services.</p>
```

## Heading Navigation Commands

Screen readers provide special commands for heading navigation:

- **NVDA/JAWS**: H key to jump to next heading, Shift+H for previous
- **NVDA/JAWS**: 1-6 keys to jump to specific heading levels
- **VoiceOver**: VO+Command+H to open headings menu
- **TalkBack**: Local context menu > Headings

Without headings, users lose these powerful navigation shortcuts.

## Best Practices

1. **Every page needs at least one H1** that describes the main content
2. **Start with H1**, then use H2 for main sections
3. **Don't skip levels** (don't go from H1 to H3)
4. **Use headings for structure, not styling** (use CSS for visual appearance)
5. **Make headings descriptive** so they're useful out of context

## Quick Fix

Paradise will suggest adding a basic heading structure:

```html
<h1>Page Title</h1>
<h2>Main Section</h2>
<h3>Subsection</h3>
```

## Related Issues

- `no-h1-on-page`: Page has headings but missing H1
- `heading-levels-skipped`: Heading hierarchy has gaps
- `page-doesnt-start-with-h1`: First heading is not H1

## Additional Resources

- [WebAIM: Semantic Structure](https://webaim.org/techniques/semanticstructure/)
- [W3C: Headings Tutorial](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [MDN: HTML Headings](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)

## Testing

### Screen Reader Testing

1. Open your page with a screen reader
2. Try navigating by headings (H key in NVDA/JAWS)
3. Verify you can quickly jump to major sections
4. Check if heading list provides good overview

### Automated Testing

```bash
# Using axe-core
axe.run({
  runOnly: ['page-has-heading-one']
});
```

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** HIGH
**Auto-fix:** Available via Quick Fix
