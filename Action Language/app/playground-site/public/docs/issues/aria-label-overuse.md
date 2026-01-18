# aria-label Overriding Visible Text

**Issue Type:** `aria-label-overuse`
**Severity:** Info
**WCAG:** 2.5.3 (Label in Name)

## Description

This issue occurs when `aria-label` is used on an element that already has visible text content. While not always incorrect, this pattern can create confusion when the aria-label differs from the visible text, violating WCAG 2.5.3 which requires that labels contain the visible text.

## Why This Matters

When aria-label is used on elements with visible text:
- Screen readers announce the aria-label **instead of** the visible text
- Voice control users say the visible text but it may not match the accessible name
- Users experience different content than what they see
- Creates maintenance burden (two places to update text)

This is especially problematic for voice control users (Dragon NaturallySpeaking, Voice Control) who:
- See "Submit" button but aria-label says "Send form"
- Say "click Submit" but command fails because accessible name is "Send form"
- Must discover the hidden accessible name through trial and error

## Examples

### ❌ Problematic Code

```javascript
// Button with visible text AND aria-label (redundant)
<button aria-label="Submit the form">
  Submit
</button>
// Screen reader hears: "Submit the form, button"
// Voice control sees: "Submit" but must say "Submit the form"

// Link with different aria-label (confusing)
<a href="/products" aria-label="View our product catalog">
  Products
</a>
// Screen reader hears: "View our product catalog"
// User sees: "Products"
// Voice control: "click Products" might not work

// Heading with aria-label override
<h2 aria-label="User account settings page">
  Settings
</h2>
// Screen reader: "User account settings page, heading level 2"
// Visual: "Settings"
```

### ✅ Correct Code

```javascript
// Button with only visible text (best for most cases)
<button>
  Submit Form
</button>
// Everyone experiences the same content

// Icon-only button (aria-label is appropriate)
<button aria-label="Close dialog">
  <svg><!-- X icon --></svg>
</button>
// No visible text, aria-label provides the name

// Button with icon + text (no aria-label needed)
<button>
  <svg aria-hidden="true"><!-- icon --></svg>
  Submit
</button>
// Icon is decorative, visible text is the name

// Link with descriptive visible text
<a href="/products">
  View Product Catalog
</a>
// No aria-label needed - text is already clear

// If additional context is needed, use aria-describedby
<button aria-describedby="submit-help">
  Submit
</button>
<div id="submit-help" class="sr-only">
  Submits the form and saves your progress
</div>
// Name: "Submit"
// Description: "Submits the form and saves your progress"
```

## When aria-label IS Appropriate

### ✅ Icon-Only Buttons
```javascript
<button aria-label="Delete item">
  <svg><!-- trash icon --></svg>
</button>
```

### ✅ Icon Links Without Text
```javascript
<a href="https://twitter.com" aria-label="Follow us on Twitter">
  <svg><!-- Twitter icon --></svg>
</a>
```

### ✅ Vague Visible Text Needing Context
```javascript
// Visible "More" needs context
<button aria-label="More options for Project Alpha">
  More
</button>

// BUT BETTER: Make visible text descriptive
<button>
  More options
</button>
```

### ✅ Form Inputs Without Visible Labels (Use aria-label OR label element)
```javascript
// Search input with aria-label
<input type="search" aria-label="Search products" />

// Better: Visible label
<label for="search">Search products</label>
<input type="search" id="search" />
```

## When aria-label is NOT Appropriate

### ❌ Buttons/Links with Visible Text
```javascript
// WRONG - Redundant
<button aria-label="Save changes">
  Save
</button>

// CORRECT - Just use visible text
<button>
  Save Changes
</button>
```

### ❌ Headings with Text Content
```javascript
// WRONG - Overrides visible text
<h1 aria-label="Main page heading">
  Welcome to Our Site
</h1>

// CORRECT - No aria-label needed
<h1>
  Welcome to Our Site
</h1>
```

### ❌ Text Elements
```javascript
// WRONG - Completely unnecessary
<p aria-label="Description paragraph">
  This is the product description.
</p>

// CORRECT - Paragraphs don't need labels
<p>
  This is the product description.
</p>
```

## WCAG 2.5.3: Label in Name

The accessible name **must contain** the visible text label:

### ✅ Compliant Examples
```javascript
// Visible: "Submit", Accessible: "Submit"
<button>Submit</button>

// Visible: "Save", Accessible: "Save Changes"
<button aria-label="Save Changes">Save</button>

// Visible: "Search", Accessible: "Search products"
<input type="search" aria-label="Search products" placeholder="Search" />
```

### ❌ Non-Compliant Examples
```javascript
// Visible: "Submit", Accessible: "Send"
<button aria-label="Send">Submit</button>
// FAILS: Accessible name doesn't contain visible text

// Visible: "Products", Accessible: "View catalog"
<a href="/products" aria-label="View catalog">Products</a>
// FAILS: "Products" not in accessible name
```

## Better Alternatives to aria-label

### Alternative 1: Improve Visible Text
```javascript
// Instead of adding aria-label for context
<button aria-label="Delete Project Alpha">
  Delete
</button>

// Make visible text descriptive
<button>
  Delete Project Alpha
</button>
```

### Alternative 2: Use aria-describedby for Additional Context
```javascript
// Visible name + additional description
<button aria-describedby="delete-help">
  Delete
</button>
<div id="delete-help" class="sr-only">
  Permanently deletes this item. This cannot be undone.
</div>
```

### Alternative 3: Use title Attribute (Last Resort)
```javascript
// Provides tooltip for sighted users too
<button title="Delete this item permanently">
  Delete
</button>
// Note: title is less reliable for accessibility
```

### Alternative 4: Visible Label with sr-only Extension
```javascript
// Visible text with hidden extension
<button>
  Delete
  <span class="sr-only">this item permanently</span>
</button>
// Visible: "Delete"
// Screen reader: "Delete this item permanently"
```

## React Component Examples

### Icon Button (aria-label appropriate)
```typescript
function IconButton({ icon, label, onClick }) {
  return (
    <button aria-label={label} onClick={onClick}>
      <svg aria-hidden="true">
        {icon}
      </svg>
    </button>
  );
}
```

### Text Button (no aria-label needed)
```typescript
function Button({ children, onClick }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

// Usage
<Button onClick={handleSave}>
  Save Changes
</Button>
```

### Button with Icon and Text (aria-label NOT needed)
```typescript
function ButtonWithIcon({ icon, children, onClick }) {
  return (
    <button onClick={onClick}>
      <svg aria-hidden="true">
        {icon}
      </svg>
      {children}
    </button>
  );
}
```

### Button with Additional Context (aria-describedby)
```typescript
function ButtonWithDescription({ children, description, onClick }) {
  const descId = useId();

  return (
    <>
      <button aria-describedby={descId} onClick={onClick}>
        {children}
      </button>
      <div id={descId} className="sr-only">
        {description}
      </div>
    </>
  );
}
```

## How to Fix

1. **Remove unnecessary aria-label**: If element has clear visible text, remove aria-label
2. **Improve visible text**: Make visible text descriptive enough that aria-label isn't needed
3. **Ensure label contains visible text**: If keeping aria-label, include visible text within it
4. **Use aria-describedby for extra context**: Provide additional info without overriding the name
5. **Reserve aria-label for icon-only elements**: Use aria-label primarily when there's no text

## Decision Tree

```
Does the element have visible text?
│
├─ NO → aria-label is appropriate
│  └─ Example: Icon-only button
│
└─ YES → Does aria-label match/include visible text?
   │
   ├─ YES → Consider removing aria-label
   │  └─ Visible text is usually sufficient
   │
   └─ NO → WCAG 2.5.3 violation!
      └─ Fix: Ensure aria-label contains visible text
```

## Related Issues

- [missing-label](./missing-label.md) - Form fields without labels
- [invalid-role](./invalid-role.md) - Invalid ARIA role values

## Resources

- [WCAG 2.5.3: Label in Name](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html)
- [aria-label vs aria-labelledby](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14.html)
- [First Rule of ARIA](https://www.w3.org/TR/using-aria/#rule1)
- [Accessible Name Computation](https://www.w3.org/TR/accname-1.1/)
