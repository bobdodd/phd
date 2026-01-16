# incomplete-accordion-pattern

**Severity:** Warning
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

This issue occurs when an accordion (disclosure widget) doesn't properly implement `aria-expanded` state management and `aria-controls` relationships. A properly implemented accordion requires button headers with `aria-expanded` that toggle panel visibility, with `aria-controls` linking headers to their panels.

## Why This Matters

- **Screen Reader Users**: Need `aria-expanded` to know if section is open/closed
- **Keyboard Users**: Need button semantics for keyboard activation
- **State Communication**: `aria-controls` establishes programmatic relationship
- **WCAG Compliance**: Required for WCAG 2.1 Level A compliance (4.1.2)

## The Problem

An incomplete accordion pattern might be missing:
- `aria-expanded` attribute on header buttons
- `aria-controls` linking header to panel
- Proper button element for header
- Toggle handler that updates `aria-expanded`
- Unique `id` on panel elements

```javascript
// ❌ BAD: Incomplete accordion pattern
const header = document.querySelector('.accordion-header');
header.setAttribute('aria-expanded', 'false');
// Missing: aria-controls
// Missing: toggle handler that updates aria-expanded
// Missing: click/keyboard handler
```

## The Solution

Implement the complete accordion pattern:

```html
<!-- HTML Structure -->
<div class="accordion">
  <h3>
    <button
      aria-expanded="false"
      aria-controls="panel1"
      id="accordion1"
      class="accordion-button"
    >
      Section 1
    </button>
  </h3>
  <div id="panel1" role="region" aria-labelledby="accordion1" hidden>
    <p>Content for section 1...</p>
  </div>

  <h3>
    <button
      aria-expanded="false"
      aria-controls="panel2"
      id="accordion2"
      class="accordion-button"
    >
      Section 2
    </button>
  </h3>
  <div id="panel2" role="region" aria-labelledby="accordion2" hidden>
    <p>Content for section 2...</p>
  </div>
</div>
```

```javascript
// ✅ GOOD: Complete accordion implementation
class Accordion {
  constructor(accordionElement) {
    this.accordion = accordionElement;
    this.buttons = Array.from(
      this.accordion.querySelectorAll('.accordion-button')
    );

    this.buttons.forEach(button => {
      button.addEventListener('click', () => this.toggle(button));

      // Keyboard support (Enter/Space already handled by button)
      // Optional: Add arrow key navigation between headers
      button.addEventListener('keydown', (e) => {
        const index = this.buttons.indexOf(button);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % this.buttons.length;
          this.buttons[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + this.buttons.length) % this.buttons.length;
          this.buttons[prevIndex].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.buttons[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          this.buttons[this.buttons.length - 1].focus();
        }
      });
    });
  }

  toggle(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const panelId = button.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);

    if (!panel) {
      console.error(`Panel ${panelId} not found`);
      return;
    }

    // Toggle state
    button.setAttribute('aria-expanded', String(!isExpanded));

    // Toggle visibility
    if (isExpanded) {
      panel.setAttribute('hidden', '');
    } else {
      panel.removeAttribute('hidden');
    }
  }

  // Optional: Expand specific section
  expand(index) {
    const button = this.buttons[index];
    if (button && button.getAttribute('aria-expanded') === 'false') {
      this.toggle(button);
    }
  }

  // Optional: Collapse specific section
  collapse(index) {
    const button = this.buttons[index];
    if (button && button.getAttribute('aria-expanded') === 'true') {
      this.toggle(button);
    }
  }

  // Optional: Expand all sections
  expandAll() {
    this.buttons.forEach(button => {
      if (button.getAttribute('aria-expanded') === 'false') {
        this.toggle(button);
      }
    });
  }

  // Optional: Collapse all sections
  collapseAll() {
    this.buttons.forEach(button => {
      if (button.getAttribute('aria-expanded') === 'true') {
        this.toggle(button);
      }
    });
  }
}

// Usage
const accordion = new Accordion(document.querySelector('.accordion'));
```

## Required Components

### 1. Header Button
- `<button>` element (not div with click handler)
- `aria-expanded="true"` when panel open, `"false"` when closed
- `aria-controls="panel-id"` linking to panel
- `id` attribute for panel's `aria-labelledby`
- Wrapped in heading element (`<h2>`, `<h3>`, etc.) for proper structure

### 2. Panel
- Unique `id` attribute matching button's `aria-controls`
- `role="region"` for screen reader identification
- `aria-labelledby="button-id"` linking back to button
- `hidden` attribute when collapsed

### 3. Toggle Behavior
- Click handler that updates `aria-expanded`
- Visibility toggle (show/hide panel)
- Enter and Space keys work automatically with `<button>` element

### 4. Optional: Arrow Navigation
- **Arrow Down**: Move focus to next header
- **Arrow Up**: Move focus to previous header
- **Home**: Move focus to first header
- **End**: Move focus to last header

## Common Patterns

### Pattern 1: Single-Expand Accordion
Only one section can be open at a time:

```javascript
toggle(button) {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';

  // Close all other sections
  this.buttons.forEach(btn => {
    if (btn !== button) {
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('hidden', '');
    }
  });

  // Toggle clicked section
  button.setAttribute('aria-expanded', String(!isExpanded));
  const panelId = button.getAttribute('aria-controls');
  const panel = document.getElementById(panelId);

  if (isExpanded) {
    panel.setAttribute('hidden', '');
  } else {
    panel.removeAttribute('hidden');
  }
}
```

### Pattern 2: Multi-Expand Accordion
Multiple sections can be open simultaneously (shown in main solution).

### Pattern 3: Nested Accordions
Accordions within accordion panels:

```html
<div class="accordion">
  <button aria-expanded="false" aria-controls="panel1">Section 1</button>
  <div id="panel1" role="region" hidden>
    <!-- Nested accordion -->
    <div class="accordion">
      <button aria-expanded="false" aria-controls="nested1">Subsection 1.1</button>
      <div id="nested1" role="region" hidden>
        <p>Nested content...</p>
      </div>
    </div>
  </div>
</div>
```

## Quick Fix

Paradise can generate a complete accordion pattern:

1. Place your cursor on the element with `aria-expanded`
2. Press `Ctrl+.` (Windows/Linux) or `Cmd+.` (Mac)
3. Select "Complete accordion pattern with aria-controls and toggle"

## Related Issues

- `missing-aria-connection`: `aria-controls` pointing to non-existent element
- `interactive-role-static`: Using `aria-expanded` on non-button element
- `incomplete-disclosure-pattern`: Similar but for non-accordion disclosures

## Additional Resources

- [WAI-ARIA: Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [MDN: aria-expanded](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)
- [Inclusive Components: Collapsible Sections](https://inclusive-components.design/collapsible-sections/)

## Testing

### Manual Testing

1. **Click**: Header toggles panel visibility
2. **Enter/Space**: Keyboard activation works
3. **aria-expanded**: State updates when toggled
4. **Screen Reader**: Announces "expanded" or "collapsed" state

### Screen Reader Testing

- **NVDA/JAWS (Windows)**: "Button, Section 1, collapsed" / "Button, Section 1, expanded"
- **VoiceOver (Mac)**: "Section 1, collapsed, button" / "Section 1, expanded, button"
- **TalkBack (Android)**: "Section 1 button, collapsed" / "Section 1 button, expanded"

## Examples

### Real-World Example: FAQ Section

```javascript
class FAQAccordion {
  constructor() {
    this.container = document.querySelector('.faq-accordion');
    this.init();
  }

  init() {
    // Generate accordion from FAQ data
    const faqs = [
      { question: 'What is WCAG?', answer: 'WCAG stands for...' },
      { question: 'Why is accessibility important?', answer: 'Accessibility ensures...' },
      { question: 'How do I test for accessibility?', answer: 'You can test...' }
    ];

    faqs.forEach((faq, index) => {
      const buttonId = `faq-btn-${index}`;
      const panelId = `faq-panel-${index}`;

      const section = document.createElement('div');
      section.className = 'faq-item';
      section.innerHTML = `
        <h3>
          <button
            id="${buttonId}"
            aria-expanded="false"
            aria-controls="${panelId}"
            class="faq-button"
          >
            ${faq.question}
          </button>
        </h3>
        <div
          id="${panelId}"
          role="region"
          aria-labelledby="${buttonId}"
          class="faq-panel"
          hidden
        >
          <p>${faq.answer}</p>
        </div>
      `;

      this.container.appendChild(section);
    });

    // Setup handlers
    this.buttons = Array.from(this.container.querySelectorAll('.faq-button'));
    this.buttons.forEach(button => {
      button.addEventListener('click', () => this.toggle(button));
    });
  }

  toggle(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const panelId = button.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);

    button.setAttribute('aria-expanded', String(!isExpanded));
    panel.hidden = isExpanded;

    // Optional: Scroll to panel when expanded
    if (!isExpanded) {
      setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }
}

// Initialize
new FAQAccordion();
```

---

**Detected by:** Paradise Widget Pattern Analyzer
**Confidence:** HIGH when analyzing with full document context
**Auto-fix:** Available via Quick Fix (Ctrl+. / Cmd+.)
