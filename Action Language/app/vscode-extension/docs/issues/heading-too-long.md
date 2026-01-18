# heading-too-long

**Severity:** Warning
**WCAG Criteria:** [2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels)

## Description

This issue occurs when a heading exceeds 60 characters in length. Long headings are difficult to scan, remember, and navigate, especially for screen reader users and people with cognitive disabilities.

## Why This Matters

- **Scannability**: Users scan headings to find content quickly
- **Screen Reader UX**: Screen reader users hear entire heading before moving on
- **Memory Load**: Long headings are harder to remember when navigating
- **Cognitive Load**: People with cognitive disabilities benefit from concise headings
- **Mobile Devices**: Long headings may wrap awkwardly on small screens

## The Problem

Overly long, sentence-like headings:

```html
<!-- ❌ BAD: 120+ characters -->
<h2>
  This is an extremely long heading that tries to explain everything
  about the section in great detail rather than being concise and
  to the point which makes it difficult for users to scan
</h2>

<!-- ❌ BAD: 85 characters -->
<h3>
  Understanding the Importance of Accessible Web Design for
  All Users Including Those with Disabilities
</h3>
```

Screen reader users must listen to the entire heading before knowing if it's relevant.

## The Solution

Keep headings concise and descriptive (under 60 characters):

```html
<!-- ✅ GOOD: 32 characters -->
<h2>Accessible Web Design Guide</h2>
<p>
  Understanding the importance of accessible web design for all
  users, including those with disabilities, is crucial for creating
  inclusive digital experiences.
</p>

<!-- ✅ GOOD: 24 characters -->
<h3>Key Design Principles</h3>
<p>
  This section covers the fundamental principles that guide
  accessible web design practices.
</p>
```

Put detailed explanations in paragraphs, not headings.

## Guidelines

### Target Length

- **Ideal**: 20-40 characters
- **Maximum**: 60 characters
- **Warning threshold**: 40-60 characters (near limit)

### Good Heading Characteristics

1. **Descriptive**: Tells you what the section is about
2. **Concise**: Gets to the point quickly
3. **Scannable**: Easy to understand at a glance
4. **Unique**: Different from other headings on the page

## Common Mistakes

### Mistake 1: Full Sentences

```html
<!-- ❌ BAD: Full sentence (68 chars) -->
<h2>
  Here's Everything You Need to Know About Our Premium Features
</h2>

<!-- ✅ GOOD: Concise (16 chars) -->
<h2>Premium Features</h2>
```

### Mistake 2: Excessive Detail

```html
<!-- ❌ BAD: Too detailed (71 chars) -->
<h3>
  Step-by-Step Instructions for Installing and Configuring the Software
</h3>

<!-- ✅ GOOD: Concise (26 chars) -->
<h3>Installation Instructions</h3>
```

### Mistake 3: Marketing Language

```html
<!-- ❌ BAD: Marketing fluff (89 chars) -->
<h2>
  Discover Our Revolutionary, Award-Winning, Industry-Leading
  Solutions That Will Transform Your Business
</h2>

<!-- ✅ GOOD: Direct (19 chars) -->
<h2>Business Solutions</h2>
```

## Restructuring Long Headings

### Pattern 1: Heading + Subtitle

```html
<!-- ❌ BAD: One long heading (76 chars) -->
<h2>
  User Account Settings: Manage Your Profile, Password, and Preferences
</h2>

<!-- ✅ GOOD: Heading + subtitle (29 chars heading) -->
<h2>User Account Settings</h2>
<p class="subtitle">
  Manage your profile, password, and preferences
</p>
```

### Pattern 2: Heading + Description

```html
<!-- ❌ BAD: Long heading (82 chars) -->
<h2>
  How to Create an Accessible Form That Works for Everyone Including
  Screen Reader Users
</h2>

<!-- ✅ GOOD: Short heading + paragraph (30 chars heading) -->
<h2>Creating Accessible Forms</h2>
<p>
  Learn how to build forms that work for everyone, including
  screen reader users, with proper labels, instructions, and
  error handling.
</p>
```

### Pattern 3: Hierarchical Breakdown

```html
<!-- ❌ BAD: Cramming too much in one heading (65 chars) -->
<h2>
  Advanced JavaScript Techniques for React Component Optimization
</h2>

<!-- ✅ GOOD: Break into hierarchy (37 chars + 27 chars) -->
<h2>Advanced JavaScript Techniques</h2>
<h3>React Component Optimization</h3>
```

## Real-World Examples

### Blog Post

```html
<!-- ❌ BAD -->
<h1>
  Everything You Ever Wanted to Know About Chocolate Chip Cookies
  Including History, Recipes, and Baking Tips (92 chars)
</h1>

<!-- ✅ GOOD -->
<h1>The Complete Guide to Chocolate Chip Cookies</h1>
<p class="subtitle">History, recipes, and expert baking tips</p>
```

### Product Page

```html
<!-- ❌ BAD -->
<h2>
  Premium Wireless Bluetooth Noise-Cancelling Over-Ear Headphones
  with 30-Hour Battery Life (85 chars)
</h2>

<!-- ✅ GOOD -->
<h2>Premium Wireless Headphones</h2>
<ul class="features">
  <li>Bluetooth connectivity</li>
  <li>Active noise cancellation</li>
  <li>30-hour battery life</li>
</ul>
```

### Documentation

```html
<!-- ❌ BAD -->
<h3>
  Configuring Environment Variables and API Keys for Production
  Deployment (73 chars)
</h3>

<!-- ✅ GOOD -->
<h3>Production Configuration</h3>
<p>Setting up environment variables and API keys for deployment.</p>
```

## Styling Subtitles

```html
<h2>Main Heading</h2>
<p class="subtitle">Additional context or description</p>

<style>
  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #666;
    font-weight: 400;
    margin-top: 0;
  }
</style>
```

## Quick Fix

Paradise will suggest shortening the heading:

```html
<h2>Concise Descriptive Title</h2>

<!-- If more detail needed, use a paragraph: -->
<h2>Section Title</h2>
<p>Additional explanatory text can go here.</p>
```

## Related Issues

- `heading-near-length-limit`: Heading approaching 60 character limit
- `empty-heading`: Heading with no content
- `aria-label-overuse`: Overusing aria-label (similar verbosity issue)

## Additional Resources

- [Nielsen Norman Group: Headings Best Practices](https://www.nngroup.com/articles/headings-pickup-lines/)
- [WebAIM: Headings](https://webaim.org/techniques/semanticstructure/#headings)
- [W3C: Descriptive Headings](https://www.w3.org/WAI/WCAG21/Techniques/general/G130)

## Testing

### Manual Review

1. Read each heading alone, out of context
2. Ask: Does it clearly describe the section?
3. Ask: Could it be shorter without losing meaning?
4. Check character count

### Automated Check

```javascript
// Check heading lengths
document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
  const length = heading.textContent.trim().length;
  if (length > 60) {
    console.warn(`Heading too long (${length} chars):`, heading.textContent);
  }
});
```

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** HIGH
**Auto-fix:** Manual review recommended
