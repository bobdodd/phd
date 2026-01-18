# aria-level-without-role

**Severity:** Error
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)

## Description

This issue occurs when an element has the `aria-level` attribute but is missing the required `role="heading"` attribute. The `aria-level` attribute only works when the element's role is explicitly set to "heading".

## Why This Matters

- **Invalid ARIA**: `aria-level` without `role="heading"` has no effect
- **Screen Reader Confusion**: Screen readers won't recognize the element as a heading
- **Navigation Problems**: Users can't navigate to it using heading shortcuts
- **WCAG Compliance**: Violates WCAG 2.1 Level A (Success Criterion 4.1.2)

## The Problem

Using `aria-level` without `role="heading"`:

```html
<!-- ❌ BAD: aria-level without role -->
<div aria-level="2">Section Title</div>

<!-- ❌ BAD: Wrong role -->
<div role="banner" aria-level="1">Site Title</div>

<!-- ❌ BAD: aria-level on semantic heading (unnecessary) -->
<h2 aria-level="2">Section Title</h2>
```

Screen readers will not treat these as headings, making them invisible to heading navigation.

## The Solution

### Option 1: Add role="heading"

```html
<!-- ✅ GOOD: Complete ARIA heading pattern -->
<div role="heading" aria-level="2">Section Title</div>
<div role="heading" aria-level="3">Subsection</div>
<div role="heading" aria-level="1">Main Title</div>
```

### Option 2: Use Semantic HTML (Preferred)

```html
<!-- ✅ BETTER: Semantic HTML elements -->
<h2>Section Title</h2>
<h3>Subsection</h3>
<h1>Main Title</h1>
```

Semantic HTML headings (h1-h6) don't need ARIA attributes.

## ARIA Heading Pattern

When you need dynamic heading levels, use the complete pattern:

```html
<!-- ✅ GOOD: Dynamic heading level -->
<div
  role="heading"
  aria-level="2"
>
  Dynamic Section Title
</div>
```

### Valid aria-level Values

- `aria-level="1"` → Equivalent to `<h1>`
- `aria-level="2"` → Equivalent to `<h2>`
- `aria-level="3"` → Equivalent to `<h3>`
- `aria-level="4"` → Equivalent to `<h4>`
- `aria-level="5"` → Equivalent to `<h5>`
- `aria-level="6"` → Equivalent to `<h6>`

## When to Use ARIA Headings

### Use Case 1: Dynamic Content

```javascript
// ✅ GOOD: Dynamically generated heading
function createHeading(text, level) {
  const heading = document.createElement('div');
  heading.setAttribute('role', 'heading');
  heading.setAttribute('aria-level', level);
  heading.textContent = text;
  return heading;
}

const h2 = createHeading('Section Title', 2);
document.body.appendChild(h2);
```

### Use Case 2: Framework Components

```jsx
// ✅ GOOD: React component with flexible level
function Heading({ level, children }) {
  return (
    <div role="heading" aria-level={level}>
      {children}
    </div>
  );
}

<Heading level={2}>Section Title</Heading>
<Heading level={3}>Subsection</Heading>
```

### Use Case 3: Rich Text Editors

```html
<!-- ✅ GOOD: CMS-generated content -->
<div
  class="user-content"
  role="heading"
  aria-level="2"
>
  User-Generated Heading
</div>
```

## Prefer Semantic HTML

Always prefer semantic HTML when possible:

```html
<!-- ❌ Overcomplicated -->
<div role="heading" aria-level="2">Section</div>

<!-- ✅ Simple and clear -->
<h2>Section</h2>
```

Benefits of semantic HTML:
- Shorter, cleaner code
- Better browser compatibility
- Built-in styling
- No ARIA knowledge required
- Better for SEO

## Common Mistakes

### Mistake 1: Only Using aria-level

```html
<!-- ❌ BAD: Missing role -->
<div aria-level="2" class="heading">
  Title
</div>

<!-- ✅ GOOD: Complete pattern -->
<div role="heading" aria-level="2" class="heading">
  Title
</div>
```

### Mistake 2: Using on Semantic Headings

```html
<!-- ❌ BAD: Redundant (h2 already has level 2) -->
<h2 aria-level="2">Section</h2>

<!-- ✅ GOOD: No aria-level needed -->
<h2>Section</h2>

<!-- ⚠️ UNUSUAL: Changing semantic level -->
<h2 role="heading" aria-level="3">Acts as H3</h2>
<!-- This is valid but confusing - just use h3 -->
```

### Mistake 3: Wrong Role Value

```html
<!-- ❌ BAD: Wrong role -->
<div role="header" aria-level="1">Title</div>

<!-- ✅ GOOD: Correct role -->
<div role="heading" aria-level="1">Title</div>
```

## Framework Examples

### React

```jsx
// ✅ GOOD: Flexible heading component
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

function Heading({ level, children }: HeadingProps) {
  // Option 1: Use ARIA
  return (
    <div role="heading" aria-level={level}>
      {children}
    </div>
  );

  // Option 2: Use semantic HTML (better)
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag>{children}</Tag>;
}
```

### Vue

```vue
<template>
  <!-- ✅ GOOD: Dynamic heading -->
  <component
    :is="`h${level}`"
    v-if="level >= 1 && level <= 6"
  >
    <slot />
  </component>

  <!-- Or use ARIA for invalid levels -->
  <div
    v-else
    role="heading"
    :aria-level="level"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    level: {
      type: Number,
      required: true
    }
  }
};
</script>
```

### Angular

```typescript
// ✅ GOOD: Heading directive
@Component({
  selector: '[appHeading]',
  template: '<ng-content></ng-content>'
})
export class HeadingDirective implements OnInit {
  @Input() level: number = 2;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.setAttribute('role', 'heading');
    this.el.nativeElement.setAttribute('aria-level', this.level);
  }
}

// Usage
<div appHeading [level]="2">Section Title</div>
```

## Quick Fix

Paradise will suggest adding `role="heading"`:

```html
<div role="heading" aria-level="2">Section Title</div>

<!-- OR use semantic HTML: -->
<h2>Section Title</h2>
```

## Related Issues

- `invalid-role`: Using invalid ARIA role values
- `missing-required-aria`: Missing required ARIA attributes
- `heading-levels-skipped`: Heading hierarchy has gaps

## Additional Resources

- [MDN: aria-level](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-level)
- [W3C: ARIA heading role](https://www.w3.org/TR/wai-aria-1.2/#heading)
- [ARIA Authoring Practices: Heading](https://www.w3.org/WAI/ARIA/apg/patterns/heading/)

## Testing

### Screen Reader Testing

1. Navigate by headings (H key in NVDA/JAWS)
2. Verify the element is announced as a heading
3. Check the correct level is announced

### Automated Testing

```javascript
// Check for aria-level without role
document.querySelectorAll('[aria-level]').forEach(el => {
  const role = el.getAttribute('role');
  const tagName = el.tagName.toLowerCase();

  // Valid if: role="heading" or semantic heading (h1-h6)
  const isValid = role === 'heading' || /^h[1-6]$/.test(tagName);

  if (!isValid) {
    console.error('aria-level without role="heading":', el);
  }
});
```

---

**Detected by:** HeadingStructureAnalyzer
**Confidence:** HIGH
**Auto-fix:** Available via Quick Fix
