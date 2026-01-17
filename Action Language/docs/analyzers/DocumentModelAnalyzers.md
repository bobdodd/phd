# Writing Analyzers for Paradise

**Audience**: Developers and contributors who want to add new accessibility analyzers

**Last Updated**: January 17, 2026

---

## Table of Contents

1. [Introduction](#introduction)
2. [Analyzer Architecture](#analyzer-architecture)
3. [Getting Started](#getting-started)
4. [Dual-Mode Analysis Pattern](#dual-mode-analysis-pattern)
5. [Using DocumentModel](#using-documentmodel)
6. [Using ActionLanguageModel](#using-actionlanguagemodel)
7. [Confidence Scoring](#confidence-scoring)
8. [Testing Your Analyzer](#testing-your-analyzer)
9. [Best Practices](#best-practices)
10. [Complete Example](#complete-example)

---

## Introduction

Paradise analyzers detect accessibility issues in web applications. Each analyzer extends the `BaseAnalyzer` class and implements a specific accessibility check (e.g., missing keyboard handlers, invalid ARIA attributes).

**Key Characteristics**:

- **Dual-mode**: Work with both file-scope (ActionLanguageModel) and document-scope (DocumentModel)
- **Zero false positives**: Document-scope analysis sees complete context across files
- **Backward compatible**: File-scope fallback ensures broad compatibility
- **Confidence-scored**: Issues tagged with HIGH/MEDIUM/LOW confidence

---

## Analyzer Architecture

### Base Components

```typescript
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';

export class MyAnalyzer extends BaseAnalyzer {
  readonly name = 'my-analyzer';
  readonly description = 'Detects my specific accessibility issue';

  analyze(context: AnalyzerContext): Issue[] {
    // Your analysis logic here
  }
}
```

### Analysis Context

The `AnalyzerContext` provides access to available models:

```typescript
interface AnalyzerContext {
  /** Full DocumentModel (HTML + JS + CSS) - preferred */
  documentModel?: DocumentModel;

  /** Single JS file model - fallback */
  actionLanguageModel?: ActionLanguageModel;

  /** Scope: 'file' | 'page' | 'workspace' */
  scope: AnalysisScope;
}
```

---

## Getting Started

### Step 1: Create Analyzer File

Create a new file in `src/analyzers/`:

```bash
touch src/analyzers/MyAccessibilityAnalyzer.ts
```

### Step 2: Implement Basic Structure

```typescript
import {
  BaseAnalyzer,
  AnalyzerContext,
  Issue,
} from './BaseAnalyzer';

export class MyAccessibilityAnalyzer extends BaseAnalyzer {
  readonly name = 'my-accessibility-check';
  readonly description = 'Checks for my specific accessibility issue';

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // TODO: Add analysis logic

    return issues;
  }
}
```

### Step 3: Register in Extension

Add to `app/vscode-extension/src-ts/foregroundAnalyzer.ts`:

```typescript
import { MyAccessibilityAnalyzer } from '../lib/analyzers/MyAccessibilityAnalyzer';

// In constructor:
this.analyzers = [
  // ... existing analyzers
  new MyAccessibilityAnalyzer(),
];
```

---

## Dual-Mode Analysis Pattern

**Best Practice**: Implement both document-scope and file-scope analysis for maximum accuracy and compatibility.

### Pattern Structure

```typescript
analyze(context: AnalyzerContext): Issue[] {
  // Prefer document-scope (zero false positives)
  if (this.supportsDocumentModel(context)) {
    return this.analyzeWithDocumentModel(context);
  }

  // Fall back to file-scope (legacy, may have false positives)
  if (context.actionLanguageModel) {
    return this.analyzeFileScope(context);
  }

  return [];
}

private analyzeWithDocumentModel(context: AnalyzerContext): Issue[] {
  // Analysis with full context
}

private analyzeFileScope(context: AnalyzerContext): Issue[] {
  // Limited analysis on single file
}
```

### When to Use Each Mode

| Mode | Use When | Confidence | False Positives |
|------|----------|------------|-----------------|
| **Document-scope** | HTML + JS + CSS available | HIGH | Zero (sees all files) |
| **File-scope** | Only single JS file available | MEDIUM | Possible (can't see other files) |

---

## Using DocumentModel

DocumentModel provides integrated access to HTML elements with their JavaScript handlers and CSS rules.

### Getting Interactive Elements

```typescript
private analyzeWithDocumentModel(context: AnalyzerContext): Issue[] {
  const issues: Issue[] = [];
  const documentModel = context.documentModel!;

  if (!documentModel.dom) return issues;

  // Get all interactive elements (buttons, links, clickable divs, etc.)
  const interactiveElements = documentModel.getInteractiveElements();

  for (const elementContext of interactiveElements) {
    // Check element properties
    if (this.hasIssue(elementContext)) {
      issues.push(this.createIssue(elementContext, context));
    }
  }

  return issues;
}
```

### ElementContext Properties

```typescript
interface ElementContext {
  /** The DOM element */
  element: DOMElement;

  /** JavaScript event handlers attached to this element */
  jsHandlers: ActionLanguageNode[];

  /** CSS rules applied to this element */
  cssRules: CSSRule[];

  /** Is this element focusable? */
  focusable: boolean;

  /** Is this element interactive? */
  interactive: boolean;

  /** Does it have a click handler? */
  hasClickHandler: boolean;

  /** Does it have a keyboard handler? */
  hasKeyboardHandler: boolean;

  /** ARIA role (explicit or implicit) */
  role: string | null;

  /** ARIA label (computed) */
  label: string | null;
}
```

### Common Checks

#### Check for Missing Keyboard Handlers

```typescript
for (const ctx of interactiveElements) {
  // Skip native interactive elements (they have built-in keyboard support)
  if (this.hasNativeKeyboardSupport(ctx.element)) {
    continue;
  }

  if (ctx.hasClickHandler && !ctx.hasKeyboardHandler) {
    issues.push(
      this.createIssue(
        'missing-keyboard-handler',
        'error',
        'Click handler without keyboard alternative',
        ctx.element.location,
        ['2.1.1'], // WCAG 2.1.1: Keyboard
        context,
        { elementContext: ctx }
      )
    );
  }
}
```

#### Check for Hidden Focusable Elements

```typescript
for (const ctx of interactiveElements) {
  // Check if element is hidden by CSS
  const isHidden = ctx.cssRules.some(rule =>
    rule.properties.some(prop =>
      (prop.property === 'display' && prop.value === 'none') ||
      (prop.property === 'visibility' && prop.value === 'hidden')
    )
  );

  if (ctx.focusable && isHidden) {
    issues.push(
      this.createIssue(
        'hidden-focusable',
        'warning',
        'Focusable element is hidden by CSS',
        ctx.element.location,
        ['2.4.3'], // WCAG 2.4.3: Focus Order
        context
      )
    );
  }
}
```

#### Check for Missing ARIA Labels

```typescript
for (const ctx of interactiveElements) {
  if (ctx.focusable && !ctx.label) {
    const tagName = ctx.element.tagName.toLowerCase();

    // Exclude elements that don't need labels
    if (['div', 'span', 'p'].includes(tagName)) {
      continue;
    }

    issues.push(
      this.createIssue(
        'missing-label',
        'error',
        `${tagName} element is focusable but has no accessible label`,
        ctx.element.location,
        ['4.1.2'], // WCAG 4.1.2: Name, Role, Value
        context
      )
    );
  }
}
```

### Querying Elements

```typescript
// Query by tag name
const buttons = documentModel.querySelectorAll('button');

// Query by ID
const submitBtn = documentModel.querySelector('#submit');

// Query by class
const menuItems = documentModel.querySelectorAll('.menu-item');

// Query by ARIA role
const dialogs = documentModel.querySelectorAll('[role="dialog"]');
```

---

## Using ActionLanguageModel

File-scope analysis works with a single JavaScript file. It's less accurate but provides backward compatibility.

### Getting Event Handlers

```typescript
private analyzeFileScope(context: AnalyzerContext): Issue[] {
  const issues: Issue[] = [];
  const model = context.actionLanguageModel!;

  // Find all click handlers
  const clickHandlers = model.findEventHandlers('click');

  for (const handler of clickHandlers) {
    const selector = handler.element.selector;

    // Check if same element has keyboard handler
    if (!this.hasKeyboardHandlerForSelector(model, selector)) {
      issues.push(
        this.createIssue(
          'mouse-only-click',
          'warning', // Lower severity - might be false positive
          `Element "${selector}" has click handler but no keyboard handler (file-scope - may be false positive)`,
          handler.location,
          ['2.1.1'],
          context
        )
      );
    }
  }

  return issues;
}
```

### Helper: Check for Keyboard Handler

```typescript
private hasKeyboardHandlerForSelector(
  model: ActionLanguageModel,
  selector: string
): boolean {
  const handlers = model.findBySelector(selector);
  const keyboardEvents = ['keydown', 'keypress', 'keyup'];

  return handlers.some(
    h => h.actionType === 'eventHandler' &&
         h.event &&
         keyboardEvents.includes(h.event)
  );
}
```

---

## Confidence Scoring

Paradise uses confidence scoring to indicate the reliability of each issue.

### Automatic Confidence

The `createIssue()` helper automatically assigns confidence based on analysis scope:

```typescript
this.createIssue(
  'my-issue-type',
  'error',
  'Issue message',
  location,
  ['2.1.1'],
  context  // Confidence calculated from context.scope
);
```

**Automatic Levels**:

- **Document-scope** → HIGH confidence (zero false positives)
- **File-scope** → MEDIUM confidence (possible false positives)

### Manual Confidence Override

For specific cases, override confidence manually:

```typescript
this.createIssue(
  'complex-issue',
  'warning',
  'This might be an issue',
  location,
  ['4.1.2'],
  context,
  {
    confidence: {
      level: 'LOW',
      reason: 'Pattern detection is heuristic-based',
      scope: context.scope
    }
  }
);
```

### When to Override

- **LOW**: Heuristic checks, pattern matching, uncertain detections
- **MEDIUM**: File-scope analysis, missing context
- **HIGH**: Definitive violations visible in document-scope

---

## Testing Your Analyzer

### Unit Test Structure

Create test file in `src/analyzers/__tests__/`:

```typescript
import { MyAnalyzer } from '../MyAnalyzer';
import { DocumentModel } from '../../models/DocumentModel';
import { HTMLParser } from '../../parsers/HTMLParser';
import { JavaScriptParser } from '../../parsers/JavaScriptParser';

describe('MyAnalyzer', () => {
  let analyzer: MyAnalyzer;

  beforeEach(() => {
    analyzer = new MyAnalyzer();
  });

  describe('Document-scope analysis', () => {
    it('should detect issue in multi-file scenario', () => {
      // HTML file
      const html = `
        <button id="test">Click me</button>
      `;

      // JavaScript file
      const js = `
        document.getElementById('test').addEventListener('click', () => {
          console.log('clicked');
        });
      `;

      // Create DocumentModel
      const htmlParser = new HTMLParser();
      const jsParser = new JavaScriptParser();

      const domModel = htmlParser.parse(html, 'test.html');
      const actionModel = jsParser.parse(js, 'test.js');

      const documentModel = new DocumentModel();
      documentModel.addDOMFragment(domModel);
      documentModel.addActionLanguage(actionModel);

      // Analyze
      const issues = analyzer.analyze({
        documentModel,
        scope: 'page'
      });

      // Assert
      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('my-issue-type');
      expect(issues[0].confidence.level).toBe('HIGH');
    });
  });

  describe('File-scope analysis', () => {
    it('should detect issue in single file', () => {
      const js = `
        document.querySelector('.btn').addEventListener('click', fn);
      `;

      const jsParser = new JavaScriptParser();
      const model = jsParser.parse(js, 'test.js');

      const issues = analyzer.analyze({
        actionLanguageModel: model,
        scope: 'file'
      });

      expect(issues).toHaveLength(1);
      expect(issues[0].confidence.level).toBe('MEDIUM');
    });
  });
});
```

### Integration Testing

Test with real-world scenarios from the demo files:

```bash
npm test -- MyAnalyzer.test.ts
```

---

## Best Practices

### 1. Always Implement Both Modes

```typescript
✅ Good:
analyze(context) {
  if (this.supportsDocumentModel(context)) {
    return this.analyzeWithDocumentModel(context);
  }
  if (context.actionLanguageModel) {
    return this.analyzeFileScope(context);
  }
  return [];
}

❌ Bad:
analyze(context) {
  // Only document-scope - breaks when no HTML available
  return this.analyzeWithDocumentModel(context);
}
```

### 2. Skip Native Interactive Elements

```typescript
✅ Good:
if (this.hasNativeKeyboardSupport(element)) {
  continue; // Skip <button>, <a>, etc.
}

❌ Bad:
// Flags all elements, including <button> - false positives!
if (hasClickHandler && !hasKeyboardHandler) {
  issues.push(...);
}
```

### 3. Provide Helpful Messages

```typescript
✅ Good:
`<button> element with id="${id}" has click handler but no keyboard handler. All interactive elements must be keyboard accessible (WCAG 2.1.1).`

❌ Bad:
'Missing keyboard handler'
```

### 4. Use Correct WCAG Criteria

Map to specific WCAG 2.1 success criteria:

```typescript
const wcagMapping = {
  'keyboard-access': ['2.1.1'], // Keyboard
  'keyboard-trap': ['2.1.2'],   // No Keyboard Trap
  'focus-order': ['2.4.3'],     // Focus Order
  'focus-visible': ['2.4.7'],   // Focus Visible
  'aria-validity': ['4.1.2'],   // Name, Role, Value
};
```

### 5. Optimize Performance

```typescript
✅ Good:
const interactiveElements = documentModel.getInteractiveElements();
// Only check relevant elements

❌ Bad:
const allElements = documentModel.getAllElements();
// Checks every element, including <p>, <span>, etc.
```

### 6. Handle Edge Cases

```typescript
// Check for null/undefined
if (!element.attributes.id) {
  // Handle missing ID
}

// Check for empty handlers
if (handlers.length === 0) {
  return;
}

// Check for malformed ARIA
if (!isValidAriaRole(role)) {
  // Handle invalid role
}
```

---

## Complete Example

Here's a complete analyzer that checks for orphaned event handlers:

```typescript
/**
 * Orphaned Event Handler Analyzer
 *
 * Detects JavaScript event handlers attached to DOM elements
 * that don't exist in the HTML.
 */

import {
  BaseAnalyzer,
  AnalyzerContext,
  Issue,
} from './BaseAnalyzer';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

export class OrphanedEventHandlerAnalyzer extends BaseAnalyzer {
  readonly name = 'orphaned-event-handler';
  readonly description = 'Detects event handlers attached to non-existent elements';

  analyze(context: AnalyzerContext): Issue[] {
    // Document-scope only - file-scope can't detect this issue
    if (this.supportsDocumentModel(context)) {
      return this.analyzeWithDocumentModel(context);
    }

    // This issue requires DOM context
    return [];
  }

  private analyzeWithDocumentModel(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const documentModel = context.documentModel!;

    if (!documentModel.dom || !documentModel.actionLanguage) {
      return issues;
    }

    // Get all event handlers from JavaScript
    const allHandlers: ActionLanguageNode[] = [];
    for (const model of documentModel.actionLanguage) {
      allHandlers.push(...model.findAllEventHandlers());
    }

    for (const handler of allHandlers) {
      const selector = handler.element.selector;

      // Try to find matching element in DOM
      const matchingElements = documentModel.querySelectorAll(selector);

      if (matchingElements.length === 0) {
        // Handler attached to non-existent element!
        issues.push(
          this.createIssue(
            'orphaned-event-handler',
            'warning',
            `Event handler attached to selector "${selector}" but no matching element exists in DOM. This handler will never fire.`,
            handler.location,
            [], // Not a WCAG violation, but still an issue
            context
          )
        );
      }
    }

    return issues;
  }
}
```

---

## Next Steps

1. **Review existing analyzers**: See `src/analyzers/` for real examples
2. **Check documentation**: Read [MultiModelArchitecture.md](../architecture/MultiModelArchitecture.md)
3. **Run tests**: Validate your analyzer with `npm test`
4. **Submit PR**: Contribute your analyzer to Paradise

---

## Resources

- **BaseAnalyzer API**: [src/analyzers/BaseAnalyzer.ts](../../src/analyzers/BaseAnalyzer.ts)
- **DocumentModel API**: [src/models/DocumentModel.ts](../../src/models/DocumentModel.ts)
- **Example Analyzers**: [src/analyzers/](../../src/analyzers/)
- **WCAG 2.1 Criteria**: [W3C Understanding WCAG](https://www.w3.org/WAI/WCAG21/Understanding/)

---

**Questions?** Open an issue on GitHub or check existing analyzer implementations for patterns.
