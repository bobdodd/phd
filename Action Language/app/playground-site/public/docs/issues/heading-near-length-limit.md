# heading-near-length-limit

**Severity:** Info
**WCAG Criteria:** [2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels)

## Description

This issue occurs when a heading is between 40-60 characters long, approaching the recommended maximum of 60 characters. While not an error, this informational message suggests considering whether the heading could be more concise.

## Why This Matters

- **Scannability**: Shorter headings are easier to scan and understand quickly
- **Mobile Friendly**: Shorter headings display better on small screens
- **Screen Reader UX**: Concise headings reduce cognitive load for screen reader users
- **Future-Proofing**: Leaves room for translations, which often expand text

## The Problem

Headings approaching the length limit:

```html
<!-- ⚠️ WARNING: 58 characters - near limit -->
<h2>Complete Guide to Building Accessible Web Applications</h2>

<!-- ⚠️ WARNING: 52 characters -->
<h3>Understanding ARIA Roles, States, and Properties</h3>

<!-- ⚠️ WARNING: 47 characters -->
<h2>Key Features of Our Premium Service Package</h2>
```

These headings work, but could potentially be shortened for better scannability.

## The Solution

Consider whether the heading can be shortened:

```html
<!-- ✅ BETTER: 37 characters (was 58) -->
<h2>Building Accessible Web Applications</h2>

<!-- ✅ BETTER: 31 characters (was 52) -->
<h3>Understanding ARIA Attributes</h3>

<!-- ✅ BETTER: 24 characters (was 47) -->
<h2>Premium Service Features</h2>
```

Or keep the original if shortening would lose important context.

## When to Shorten

### You Should Consider Shortening If:

1. **Redundant words**: "Complete Guide to..." could be just the topic
2. **Unnecessary adjectives**: "Amazing", "Revolutionary", "Comprehensive"
3. **Can use subtitle**: Move details to a paragraph or subtitle
4. **Repeating context**: Don't repeat what's obvious from page context

### It's OK to Keep Longer If:

1. **Needs specificity**: Technical terms or specific topics require detail
2. **Search/Navigation**: Users specifically search for that phrasing
3. **Legal/Compliance**: Exact wording is required for regulatory reasons
4. **Already concise**: Can't shorten without losing important meaning

## Examples

### Example 1: Can Be Shortened

```html
<!-- ⚠️ Original: 56 characters -->
<h2>How to Configure Your Account Settings and Preferences</h2>

<!-- ✅ Better: 28 characters -->
<h2>Account Settings</h2>
<p>Configure your account preferences and options.</p>
```

### Example 2: Should Keep

```html
<!-- ⚠️ Original: 54 characters -->
<h2>GDPR Data Processing Agreement for EU Customers</h2>

<!-- ✅ Keep it - specificity matters -->
<h2>GDPR Data Processing Agreement for EU Customers</h2>
<p>Details about data processing under GDPR regulations.</p>
```

### Example 3: Use Hierarchy

```html
<!-- ⚠️ Original: 48 characters -->
<h2>Advanced React Hooks for State Management</h2>

<!-- ✅ Alternative: Break into hierarchy -->
<h2>Advanced React Hooks</h2>
<h3>State Management</h3>
```

## Length Guidelines

- **0-40 chars**: ✅ Ideal range
- **40-60 chars**: ⚠️ Near limit (this issue)
- **60+ chars**: ❌ Too long (separate issue: `heading-too-long`)

## Translation Considerations

Text often expands when translated:

```html
<!-- English: 41 characters -->
<h2>Welcome to Our Customer Support Portal</h2>

<!-- German: 52 characters (27% longer) -->
<h2>Willkommen auf unserem Kundendienst-Portal</h2>

<!-- Spanish: 49 characters (20% longer) -->
<h2>Bienvenido a nuestro Portal de Atención al Cliente</h2>
```

Leaving buffer room (keeping under 50 chars) allows for translation expansion.

## Quick Check

Ask yourself:

1. **Can I remove any words without losing meaning?**
2. **Are there unnecessary adjectives or adverbs?**
3. **Can I move details to a subtitle or paragraph?**
4. **Would users understand with fewer words?**

## Common Patterns

### Pattern 1: Remove "How to"

```html
<!-- ⚠️ 45 chars -->
<h2>How to Install and Configure the Software</h2>

<!-- ✅ 33 chars -->
<h2>Installation and Configuration</h2>
```

### Pattern 2: Remove "Complete/Comprehensive"

```html
<!-- ⚠️ 48 chars -->
<h2>Comprehensive Guide to Email Marketing</h2>

<!-- ✅ 29 chars -->
<h2>Email Marketing Guide</h2>
```

### Pattern 3: Use More Specific Terms

```html
<!-- ⚠️ 52 chars -->
<h2>Methods for Improving Website Performance</h2>

<!-- ✅ 33 chars -->
<h2>Website Performance Optimization</h2>
```

## Not Required, But Recommended

This is an **informational** message, not an error or warning. Your heading is acceptable, but consider whether it could be more concise for better user experience.

### When to Ignore

- Technical documentation needing precise terminology
- Legal/compliance content requiring specific wording
- Already as concise as possible without losing meaning
- User testing shows the current wording is clearer

### When to Act

- Can remove filler words without losing meaning
- Marketing language can be simplified
- Details can move to paragraph text
- Shorter heading would be clearer

## Quick Fix

Paradise will suggest:

```html
<h2>Concise Descriptive Title</h2>
```

Review and adjust to fit your content's needs.

## Related Issues

- `heading-too-long`: Heading exceeds 60 characters (error)
- `aria-label-overuse`: Similar verbosity issues with ARIA

## Additional Resources

- [Nielsen Norman Group: Headings](https://www.nngroup.com/articles/headings-pickup-lines/)
- [Readable: Ideal Heading Length](https://readable.com/blog/what-is-the-ideal-length-for-seo-headings/)
- [W3C: Descriptive Headings](https://www.w3.org/WAI/WCAG21/Techniques/general/G130)

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** MEDIUM
**Auto-fix:** Manual review recommended
