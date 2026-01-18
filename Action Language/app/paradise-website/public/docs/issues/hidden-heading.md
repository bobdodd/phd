# hidden-heading

**Severity:** Warning
**WCAG Criteria:** [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships)

## Description

This issue occurs when a heading element contains text content but is hidden using `display: none` or `visibility: hidden`. Hidden headings are read inconsistently by different screen readers and break document structure.

## Why This Matters

- **Inconsistent Behavior**: Different screen readers handle hidden headings differently
- **Broken Structure**: Hidden headings create gaps in the document outline
- **User Confusion**: Some users hear the heading, others don't, creating inconsistent experience
- **Navigation Issues**: Heading count and structure varies between screen readers

## The Problem

Headings hidden with CSS:

```html
<!-- ❌ BAD: display: none -->
<h2 style="display: none;">Hidden Section</h2>

<!-- ❌ BAD: visibility: hidden -->
<h2 style="visibility: hidden;">Hidden Title</h2>

<!-- ❌ BAD: Hidden by class -->
<h2 class="hidden">Content</h2>

<style>
  .hidden {
    display: none;
  }
</style>
```

Most screen readers skip content with `display: none` or `visibility: hidden`, but behavior can vary. This creates an inconsistent experience.

## The Solution

### Option 1: Remove Hidden Headings

If the heading is truly not needed:

```html
<!-- ❌ BAD: Hidden heading -->
<h2 style="display: none;">Admin Section</h2>

<!-- ✅ GOOD: Remove it -->
<!-- Heading removed entirely -->
```

### Option 2: Make It Visible

If users need the heading:

```html
<!-- ❌ BAD: Hidden -->
<h2 class="hidden">Contact Information</h2>
<div class="contact-details">...</div>

<!-- ✅ GOOD: Visible -->
<h2>Contact Information</h2>
<div class="contact-details">...</div>
```

### Option 3: Visually Hidden (Screen Readers Only)

If you need the heading for screen readers but not visually:

```html
<!-- ✅ GOOD: Visually hidden but accessible -->
<h2 class="sr-only">Navigation Menu</h2>
<nav>...</nav>

<style>
  /* Hides visually but remains accessible */
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

The `.sr-only` class (screen reader only) hides content visually but keeps it in the accessibility tree.

## Common Patterns

### Pattern 1: Responsive Design

```html
<!-- ❌ BAD: Hiding on mobile -->
<h2 class="desktop-only">Features</h2>

<style>
  @media (max-width: 768px) {
    .desktop-only {
      display: none; /* Hides from everyone! */
    }
  }
</style>

<!-- ✅ GOOD: Use same heading, style differently -->
<h2 class="responsive-heading">Features</h2>

<style>
  @media (max-width: 768px) {
    .responsive-heading {
      font-size: 1.2rem; /* Smaller on mobile */
      padding: 0.5rem;
    }
  }
</style>
```

### Pattern 2: Tab Panels

```html
<!-- ❌ BAD: Hidden tab panel with heading -->
<div class="tab-panel" style="display: none;">
  <h2>Account Settings</h2>
  <div>Settings content...</div>
</div>

<!-- ✅ GOOD: Use aria-hidden with hidden attribute -->
<div class="tab-panel" hidden aria-hidden="true">
  <h2>Account Settings</h2>
  <div>Settings content...</div>
</div>

<!-- ✅ BETTER: Control at panel level, not heading -->
<div class="tab-panel" role="tabpanel" hidden>
  <h2>Account Settings</h2>
  <div>Settings content...</div>
</div>
```

### Pattern 3: JavaScript Show/Hide

```javascript
// ❌ BAD: Hiding individual headings
document.querySelector('h2.section-title').style.display = 'none';

// ✅ GOOD: Hide entire section
document.querySelector('.collapsible-section').hidden = true;
```

## Dynamic Content

### Accordion

```html
<!-- ✅ GOOD: Accordion pattern -->
<div class="accordion">
  <h3>
    <button
      aria-expanded="false"
      aria-controls="panel1"
    >
      Section Title
    </button>
  </h3>
  <div id="panel1" hidden>
    <p>Panel content...</p>
  </div>
</div>
```

The heading remains visible; the content panel is hidden.

### Progressive Disclosure

```html
<!-- ✅ GOOD: Show more pattern -->
<h2>Article Title</h2>
<p>Visible summary...</p>

<button
  aria-expanded="false"
  aria-controls="full-content"
>
  Read More
</button>

<div id="full-content" hidden>
  <h3>Full Content</h3>
  <p>Additional paragraphs...</p>
</div>
```

## Screen Reader Behavior

Different screen readers handle hidden content differently:

- **NVDA/JAWS**: Usually skip `display: none` and `visibility: hidden`
- **VoiceOver**: May announce some hidden content in certain contexts
- **TalkBack**: Behavior varies by Android version

**Best Practice:** Don't rely on CSS hiding for screen readers. Use proper semantic HTML and ARIA attributes.

## Quick Fix

Paradise will suggest:

1. Making the heading visible
2. Removing the heading if unnecessary
3. Using `.sr-only` pattern if needed for screen readers only

```html
<!-- Remove display:none/visibility:hidden -->
<h2>Section Title</h2>

<!-- OR use visually-hidden technique -->
<h2 class="sr-only">Section Title</h2>
```

## Related Issues

- `empty-heading`: Heading with no content
- `aria-hidden-true`: Using aria-hidden inappropriately
- `visibility-focus-conflict`: Hidden but focusable

## Additional Resources

- [WebAIM: Invisible Content](https://webaim.org/techniques/css/invisiblecontent/)
- [The A11Y Project: Hiding Content](https://www.a11yproject.com/posts/how-to-hide-content/)
- [W3C: Hidden Content](https://www.w3.org/WAI/WCAG21/Techniques/css/C7)

## Testing

### Screen Reader Testing

1. Turn on heading navigation
2. Count headings announced
3. Compare with DevTools heading count
4. Check for inconsistencies

### Manual Testing

```javascript
// Find hidden headings
document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
  const style = window.getComputedStyle(heading);
  if (style.display === 'none' || style.visibility === 'hidden') {
    console.warn('Hidden heading:', heading.textContent);
  }
});
```

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** HIGH
**Auto-fix:** Available via Quick Fix
