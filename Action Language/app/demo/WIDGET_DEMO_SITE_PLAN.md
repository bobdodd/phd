# Widget Pattern Demo Site Architecture

**Purpose:** Demonstrate Paradise's unique widget pattern validation capabilities through a multi-page, multi-model demo site that showcases both accessible and inaccessible implementations.

**Location:** `app/demo/widget-patterns/`

---

## Site Structure

```
app/demo/widget-patterns/
├── index.html                          # Landing page with site navigation
├── css/
│   ├── demo-site.css                   # Shared styles
│   ├── accessible-widgets.css          # Styles for good examples
│   └── inaccessible-widgets.css        # Styles for bad examples
├── js/
│   ├── shared/
│   │   ├── demo-framework.js           # Common demo infrastructure
│   │   └── analyzer-runner.js          # In-page analyzer execution
│   ├── accessible/
│   │   ├── tabs-complete.js            # ✅ Complete tabs implementation
│   │   ├── dialog-complete.js          # ✅ Complete dialog implementation
│   │   ├── accordion-complete.js       # ✅ Complete accordion implementation
│   │   └── ... (21 patterns)
│   └── inaccessible/
│       ├── tabs-incomplete.js          # ❌ Incomplete tabs
│       ├── dialog-incomplete.js        # ❌ Incomplete dialog
│       ├── accordion-incomplete.js     # ❌ Incomplete accordion
│       └── ... (21 patterns)
├── pages/
│   ├── navigation-widgets/
│   │   ├── tabs.html                   # Tabs pattern demo
│   │   ├── menu.html                   # Menu pattern demo
│   │   ├── tree.html                   # Tree pattern demo
│   │   ├── breadcrumb.html             # Breadcrumb pattern demo
│   │   ├── toolbar.html                # Toolbar pattern demo
│   │   ├── grid.html                   # Grid pattern demo
│   │   └── feed.html                   # Feed pattern demo
│   ├── input-widgets/
│   │   ├── combobox.html               # Combobox pattern demo
│   │   ├── listbox.html                # Listbox pattern demo
│   │   ├── radiogroup.html             # Radiogroup pattern demo
│   │   ├── slider.html                 # Slider pattern demo
│   │   ├── spinbutton.html             # Spinbutton pattern demo
│   │   ├── switch.html                 # Switch pattern demo
│   │   └── meter.html                  # Meter pattern demo
│   ├── disclosure-widgets/
│   │   ├── dialog.html                 # Dialog pattern demo
│   │   ├── accordion.html              # Accordion pattern demo
│   │   ├── disclosure.html             # Disclosure pattern demo
│   │   └── tooltip.html                # Tooltip pattern demo
│   ├── status-widgets/
│   │   ├── progressbar.html            # Progressbar pattern demo
│   │   ├── carousel.html               # Carousel pattern demo
│   │   └── link.html                   # Link pattern demo
│   └── multi-model-examples/
│       ├── cross-file-tabs/            # Tabs split across multiple files
│       │   ├── index.html
│       │   ├── tabs-structure.js       # DOM manipulation
│       │   ├── tabs-keyboard.js        # Keyboard navigation
│       │   └── tabs-styling.css        # Appearance
│       ├── component-based-dialog/     # React-style component dialog
│       │   ├── index.html
│       │   ├── Dialog.jsx              # Dialog component
│       │   ├── useDialog.js            # Dialog hook
│       │   └── dialog-styles.css
│       └── distributed-menu/           # Menu with handlers in different files
│           ├── index.html
│           ├── menu-setup.js           # Menu creation
│           ├── menu-navigation.js      # Arrow key navigation
│           ├── menu-actions.js         # Menu item actions
│           └── menu.css
└── analyzer-results/
    ├── tabs-accessible.json            # Expected analysis result
    ├── tabs-inaccessible.json          # Expected issues found
    └── ... (all patterns)
```

---

## Key Design Principles

### 1. Side-by-Side Comparison

Each page shows **two implementations** of the same widget:

```html
<div class="comparison-container">
  <section class="example accessible">
    <h2>✅ Accessible Implementation</h2>
    <div class="widget-demo">
      <!-- Complete pattern -->
    </div>
    <div class="analyzer-results">
      <strong>Paradise Analysis:</strong>
      <span class="result-badge success">0 issues found</span>
    </div>
  </section>

  <section class="example inaccessible">
    <h2>❌ Inaccessible Implementation</h2>
    <div class="widget-demo">
      <!-- Incomplete pattern -->
    </div>
    <div class="analyzer-results">
      <strong>Paradise Analysis:</strong>
      <span class="result-badge error">3 issues found</span>
      <ul class="issues-list">
        <li>incomplete-tabs-pattern: Missing arrow navigation</li>
        <li>incomplete-tabs-pattern: Missing Home/End support</li>
        <li>missing-aria-connection: aria-controls="panel3" not found</li>
      </ul>
    </div>
  </section>
</div>
```

### 2. Live Analyzer Execution

Each page includes Paradise analyzer running in-browser:

```javascript
// analyzer-runner.js
class LiveAnalyzer {
  async analyzePage() {
    // Load Paradise analyzer bundle
    const { WidgetPatternAnalyzer } = await import('./paradise-bundle.js');

    // Parse current page
    const nodes = this.extractActionLanguageNodes(document);

    // Run analysis
    const analyzer = new WidgetPatternAnalyzer();
    const issues = analyzer.analyze({ nodes, scope: 'file' });

    // Display results
    this.displayResults(issues);
  }

  extractActionLanguageNodes(document) {
    // Convert DOM to ActionLanguage representation
    // Extract event handlers, ARIA attributes, etc.
  }

  displayResults(issues) {
    // Show issues inline with code examples
    // Highlight problematic elements
    // Provide fix suggestions
  }
}
```

### 3. Interactive Testing

Users can test widgets themselves:

```html
<div class="testing-panel">
  <h3>Try It Yourself</h3>
  <div class="testing-instructions">
    <h4>Keyboard Testing:</h4>
    <ol>
      <li>Press <kbd>Tab</kbd> to focus the tablist</li>
      <li>Press <kbd>→</kbd> to navigate to next tab</li>
      <li>Press <kbd>←</kbd> to navigate to previous tab</li>
      <li>Press <kbd>Home</kbd> to jump to first tab</li>
      <li>Press <kbd>End</kbd> to jump to last tab</li>
      <li>Press <kbd>Tab</kbd> again to enter panel content</li>
    </ol>
  </div>

  <div class="testing-checklist">
    <h4>What Should Happen:</h4>
    <ul>
      <li><input type="checkbox"> Arrow keys navigate between tabs</li>
      <li><input type="checkbox"> Home/End jump to first/last tab</li>
      <li><input type="checkbox"> Tab moves to panel content</li>
      <li><input type="checkbox"> aria-selected updates on change</li>
      <li><input type="checkbox"> Only one tab is focusable (roving tabindex)</li>
    </ul>
  </div>

  <div class="screen-reader-test">
    <h4>Screen Reader Announcements:</h4>
    <textarea class="sr-output" placeholder="Turn on screen reader and navigate...">
    </textarea>
    <p class="expected">Expected: "Tab 1 of 3, selected, button"</p>
  </div>
</div>
```

### 4. Code Walkthrough

Show exactly what Paradise detects:

```html
<div class="code-walkthrough">
  <h3>What Paradise Analyzes</h3>

  <div class="analysis-step">
    <h4>Step 1: Structure Detection</h4>
    <pre><code class="language-html">&lt;div role="tablist"&gt;  <span class="check">✓ Found</span>
  &lt;button role="tab"&gt;    <span class="check">✓ Found</span>
&lt;/div&gt;</code></pre>
  </div>

  <div class="analysis-step">
    <h4>Step 2: ARIA Relationships</h4>
    <pre><code class="language-html">&lt;button
  role="tab"
  aria-selected="true"     <span class="check">✓ Found</span>
  aria-controls="panel1"   <span class="check">✓ Found</span>
&gt;</code></pre>
  </div>

  <div class="analysis-step">
    <h4>Step 3: Keyboard Navigation</h4>
    <pre><code class="language-javascript">tablist.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { }  <span class="check">✓ Found</span>
  if (e.key === 'ArrowRight') { } <span class="check">✓ Found</span>
});</code></pre>
  </div>

  <div class="analysis-step">
    <h4>Step 4: State Management</h4>
    <pre><code class="language-javascript">function activateTab(tab) {
  tab.setAttribute('aria-selected', 'true');  <span class="check">✓ Found</span>
  // Updates aria-selected dynamically
}</code></pre>
  </div>

  <div class="analysis-result success">
    <strong>✅ Complete Pattern Detected</strong>
    <p>All required components present: structure, ARIA, keyboard, state.</p>
  </div>
</div>
```

---

## Multi-Model Demo Examples

### Example 1: Cross-File Tabs

**Demonstrates:** Pattern split across 3 files

```
cross-file-tabs/
├── index.html              # Structure only
├── tabs-structure.js       # DOM creation + click handlers
├── tabs-keyboard.js        # Keyboard navigation
└── tabs-styling.css        # Roving tabindex styles

Paradise Analysis:
✅ Detects complete pattern across all files
✅ Shows how multi-model analysis eliminates false positives
```

**index.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="tabs-styling.css">
</head>
<body>
  <div id="tabs-container"></div>

  <script src="tabs-structure.js"></script>
  <script src="tabs-keyboard.js"></script>
</body>
</html>
```

**tabs-structure.js:**
```javascript
// Creates tabs structure and click handlers
function createTabs() {
  const container = document.getElementById('tabs-container');

  const tablist = document.createElement('div');
  tablist.setAttribute('role', 'tablist');
  tablist.id = 'main-tabs';

  // Create tabs and panels
  const tabs = ['Home', 'Products', 'About'];
  tabs.forEach((label, index) => {
    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0);
    tab.setAttribute('aria-controls', `panel-${index}`);
    tab.textContent = label;
    tab.addEventListener('click', () => activateTab(index));
    tablist.appendChild(tab);

    const panel = document.createElement('div');
    panel.setAttribute('role', 'tabpanel');
    panel.id = `panel-${index}`;
    panel.textContent = `Content for ${label}`;
    panel.hidden = index !== 0;
    container.appendChild(panel);
  });

  container.insertBefore(tablist, container.firstChild);
}

createTabs();
```

**tabs-keyboard.js:**
```javascript
// Adds keyboard navigation (separate file!)
document.getElementById('main-tabs').addEventListener('keydown', (e) => {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const current = tabs.indexOf(document.activeElement);

  let next;
  if (e.key === 'ArrowRight') {
    next = (current + 1) % tabs.length;
  } else if (e.key === 'ArrowLeft') {
    next = (current - 1 + tabs.length) % tabs.length;
  } else if (e.key === 'Home') {
    next = 0;
  } else if (e.key === 'End') {
    next = tabs.length - 1;
  } else {
    return;
  }

  e.preventDefault();
  activateTab(next);
});
```

**Paradise Result:**
```json
{
  "file": "cross-file-tabs/",
  "issues": [],
  "patterns_detected": [
    {
      "type": "tabs-pattern",
      "status": "complete",
      "components": {
        "structure": "index.html",
        "click_handlers": "tabs-structure.js",
        "keyboard_navigation": "tabs-keyboard.js",
        "styling": "tabs-styling.css"
      },
      "confidence": "HIGH"
    }
  ]
}
```

### Example 2: Component-Based Dialog

**Demonstrates:** React-style component architecture

```
component-based-dialog/
├── index.html
├── Dialog.jsx              # Dialog component
├── useDialog.js            # Custom hook
└── dialog-styles.css

Paradise Analysis:
✅ Detects dialog pattern in component structure
✅ Validates hook-based focus management
✅ Confirms Escape handler in useEffect
```

**Dialog.jsx:**
```jsx
function Dialog({ isOpen, onClose, title, children }) {
  const dialogRef = useRef();
  const { handleKeyDown } = useDialog(dialogRef, onClose);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onKeyDown={handleKeyDown}
    >
      <h2 id="dialog-title">{title}</h2>
      {children}
      <button onClick={onClose} aria-label="Close dialog">×</button>
    </div>
  );
}
```

**useDialog.js:**
```javascript
function useDialog(dialogRef, onClose) {
  const triggerRef = useRef();

  useEffect(() => {
    if (dialogRef.current) {
      // Store trigger for focus restoration
      triggerRef.current = document.activeElement;

      // Focus first focusable element
      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable[0]?.focus();
    }

    // Escape key handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);

      // Restore focus
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, [dialogRef, onClose]);

  // Focus trap handler
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );

      if (e.shiftKey && document.activeElement === focusable[0]) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        e.preventDefault();
        focusable[0].focus();
      }
    }
  };

  return { handleKeyDown };
}
```

**Paradise Result:**
```json
{
  "file": "component-based-dialog/",
  "issues": [],
  "patterns_detected": [
    {
      "type": "dialog-pattern",
      "status": "complete",
      "components": {
        "structure": "Dialog.jsx",
        "aria_modal": "Dialog.jsx:10",
        "escape_handler": "useDialog.js:18",
        "focus_trap": "useDialog.js:34",
        "focus_restoration": "useDialog.js:28"
      },
      "architecture": "react-hooks",
      "confidence": "HIGH"
    }
  ]
}
```

---

## Analyzer Results Display

Each demo page shows **live analysis results**:

```html
<div class="paradise-analysis">
  <h3>Paradise Analysis Results</h3>

  <div class="analysis-summary">
    <div class="score-badge" data-score="100">
      <span class="score">100</span>
      <span class="label">Pattern Score</span>
    </div>
    <div class="stats">
      <div class="stat">
        <span class="number">5/5</span>
        <span class="label">Components Present</span>
      </div>
      <div class="stat">
        <span class="number">0</span>
        <span class="label">Issues Found</span>
      </div>
    </div>
  </div>

  <div class="analysis-details">
    <h4>Pattern Validation</h4>
    <ul class="validation-results">
      <li class="check-pass">
        <span class="icon">✓</span>
        <span class="text">Structural hierarchy (tablist → tab → tabpanel)</span>
      </li>
      <li class="check-pass">
        <span class="icon">✓</span>
        <span class="text">ARIA relationships (aria-controls, aria-labelledby)</span>
      </li>
      <li class="check-pass">
        <span class="icon">✓</span>
        <span class="text">Keyboard navigation (arrow keys, Home/End)</span>
      </li>
      <li class="check-pass">
        <span class="icon">✓</span>
        <span class="text">State management (aria-selected updates)</span>
      </li>
      <li class="check-pass">
        <span class="icon">✓</span>
        <span class="text">Focus management (roving tabindex)</span>
      </li>
    </ul>
  </div>

  <div class="wcag-compliance">
    <h4>WCAG 2.1 Compliance</h4>
    <ul class="criteria-list">
      <li class="criteria-met">
        <strong>1.3.1 Info and Relationships:</strong> Pass
      </li>
      <li class="criteria-met">
        <strong>2.1.1 Keyboard:</strong> Pass
      </li>
      <li class="criteria-met">
        <strong>4.1.2 Name, Role, Value:</strong> Pass
      </li>
    </ul>
  </div>
</div>
```

---

## Demo Site Features

### 1. Pattern Complexity Indicators

Show implementation difficulty:

```html
<div class="pattern-info">
  <h2>Tabs Pattern</h2>
  <div class="complexity">
    <span class="badge complexity-high">High Complexity</span>
    <span class="badge components-5">5 Components</span>
    <span class="badge wcag-3">3 WCAG Criteria</span>
  </div>
</div>
```

### 2. Progressive Disclosure

Show pattern building step-by-step:

```html
<div class="pattern-builder">
  <div class="step" data-step="1">
    <h4>Step 1: Basic Structure</h4>
    <pre><code>&lt;div role="tablist"&gt;&lt;/div&gt;</code></pre>
    <button class="add-step">Add Tabs →</button>
  </div>

  <div class="step hidden" data-step="2">
    <h4>Step 2: Tab Elements</h4>
    <pre><code>&lt;button role="tab"&gt;Tab 1&lt;/button&gt;</code></pre>
    <button class="add-step">Add Panels →</button>
  </div>

  <!-- ... -->
</div>
```

### 3. Real-Time Validation

Update analysis as user modifies code:

```html
<div class="code-editor">
  <textarea id="editable-code">
&lt;div role="tablist"&gt;
  &lt;button role="tab"&gt;Tab 1&lt;/button&gt;
&lt;/div&gt;
  </textarea>
  <button id="analyze-btn">Run Paradise Analyzer</button>
  <div id="live-results"></div>
</div>
```

---

## Implementation Priority

### Phase 1: Core Demo Pages (Week 1)
- Landing page with navigation
- 3 comprehensive demos (tabs, dialog, accordion)
- Basic analyzer integration

### Phase 2: Complete Pattern Coverage (Week 2)
- All 21 widget patterns
- Side-by-side comparisons
- Issue highlighting

### Phase 3: Multi-Model Examples (Week 3)
- Cross-file tabs demo
- Component-based dialog demo
- Distributed menu demo

### Phase 4: Interactive Features (Week 4)
- Live analyzer execution
- Code editor with validation
- Pattern builder tool

---

## Success Metrics

### User Understanding
- [ ] Users can identify incomplete patterns
- [ ] Users understand multi-file analysis benefits
- [ ] Users can implement patterns correctly after viewing demos

### Technical Demonstration
- [ ] Shows all 21 widget patterns
- [ ] Demonstrates multi-model analysis
- [ ] Proves zero false positives for complete patterns

### Educational Value
- [ ] Teaches ARIA widget patterns
- [ ] Explains keyboard navigation requirements
- [ ] Shows WCAG compliance validation

---

**Next Steps:**
1. Build landing page with pattern catalog
2. Create first 3 comprehensive demos (tabs, dialog, accordion)
3. Implement live analyzer runner
4. Add remaining 18 patterns
5. Build multi-model examples
6. Add interactive features

This demo site will be Paradise's **killer feature showcase**, proving that our widget pattern analysis is unlike anything else in the accessibility testing space.
