export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Paradise Architecture
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            Complete technical documentation of Paradise's multi-model architecture,
            from ActionLanguage intermediate representation to cross-file analysis.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Table of Contents */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Architecture Components</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a href="#actionlanguage" className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">1</div>
                <div className="text-lg font-semibold">ActionLanguage Model</div>
                <div className="text-sm opacity-90 mt-2">Intermediate representation</div>
              </a>

              <a href="#dommodel" className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">2</div>
                <div className="text-lg font-semibold">DOMModel</div>
                <div className="text-sm opacity-90 mt-2">HTML structure</div>
              </a>

              <a href="#cssmodel" className="group relative overflow-hidden bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-lg font-semibold">CSSModel</div>
                <div className="text-sm opacity-90 mt-2">Stylesheet representation</div>
              </a>

              <a href="#documentmodel" className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">4</div>
                <div className="text-lg font-semibold">DocumentModel</div>
                <div className="text-sm opacity-90 mt-2">Integration layer</div>
              </a>

              <a href="#nested-trees" className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">5</div>
                <div className="text-lg font-semibold">Nested Tree Structure</div>
                <div className="text-sm opacity-90 mt-2">Hierarchical organization</div>
              </a>

              <a href="#merge-process" className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">6</div>
                <div className="text-lg font-semibold">Model Merge Process</div>
                <div className="text-sm opacity-90 mt-2">Cross-reference resolution</div>
              </a>

              <a href="#analysis-flow" className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">7</div>
                <div className="text-lg font-semibold">Analysis Flow</div>
                <div className="text-sm opacity-90 mt-2">Detection pipeline</div>
              </a>

              <a href="#fragments" className="group relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">8</div>
                <div className="text-lg font-semibold">Fragment-Aware Analysis</div>
                <div className="text-sm opacity-90 mt-2">Incremental development support</div>
              </a>

              <a href="#extensibility" className="group relative overflow-hidden bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold mb-2">9</div>
                <div className="text-lg font-semibold">Extensibility</div>
                <div className="text-sm opacity-90 mt-2">Platform expansion</div>
              </a>
            </div>
          </div>

          <div className="space-y-16">
          {/* 1. ActionLanguage Model */}
          <section id="actionlanguage" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-indigo-600">1. ActionLanguage Model</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                ActionLanguage is an <strong>intermediate representation (IR)</strong> that captures UI interactions
                and accessibility-relevant behaviors from any programming language. It serves as the foundation
                of Paradise's analysis system.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Core Concept</h3>
              <p className="text-gray-700 mb-4">
                ActionLanguage transforms imperative UI code (JavaScript, Swift, Kotlin, etc.) into a declarative
                tree structure that describes <em>what</em> accessibility actions occur, not <em>how</em> they're implemented.
                This abstraction enables universal analysis across all platforms.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Node Types</h3>

              <div className="space-y-6 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <h4 className="text-xl font-bold mb-3 text-blue-900">EventHandler</h4>
                  <p className="text-gray-800 mb-3">
                    Represents event listeners attached to UI elements. Captures the event type, target element,
                    and handler function for accessibility analysis.
                  </p>
                  <pre className="bg-white p-4 rounded border border-blue-200 overflow-x-auto text-sm">
{`{
  id: "node-1",
  nodeType: "eventHandler",
  actionType: "eventHandler",
  event: "click",
  element: {
    selector: "#submitButton",
    binding: "button"
  },
  handler: {
    body: "submitForm();",
    calls: ["submitForm"],
    hasPreventDefault: false
  },
  timing: {
    synchronous: true,
    async: false
  },
  location: {
    file: "handlers.js",
    line: 42,
    column: 5
  }
}`}
                  </pre>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h4 className="text-xl font-bold mb-3 text-green-900">FocusChange</h4>
                  <p className="text-gray-800 mb-3">
                    Captures focus management operations. Critical for keyboard navigation, modals,
                    and dynamic content updates.
                  </p>
                  <pre className="bg-white p-4 rounded border border-green-200 overflow-x-auto text-sm">
{`{
  id: "node-2",
  nodeType: "focusChange",
  actionType: "focusChange",
  targetElement: {
    selector: "#errorMessage",
    binding: "errorMsg"
  },
  timing: "immediate",  // or "delayed", "onEvent"
  condition: {
    type: "conditional",
    expression: "hasError"
  },
  restorePrevious: false,
  location: {
    file: "validation.js",
    line: 89,
    column: 7
  }
}`}
                  </pre>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                  <h4 className="text-xl font-bold mb-3 text-purple-900">AriaStateChange</h4>
                  <p className="text-gray-800 mb-3">
                    Tracks ARIA attribute updates. Essential for detecting static ARIA (set once, never updated)
                    and incomplete state management.
                  </p>
                  <pre className="bg-white p-4 rounded border border-purple-200 overflow-x-auto text-sm">
{`{
  id: "node-3",
  nodeType: "ariaStateChange",
  actionType: "ariaStateChange",
  element: {
    selector: "[role='tabpanel']",
    binding: "panel"
  },
  attribute: "aria-hidden",
  newValue: "true",
  oldValue: "false",
  updateCount: 1,  // Tracked across file
  location: {
    file: "tabs.js",
    line: 156,
    column: 3
  }
}`}
                  </pre>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                  <h4 className="text-xl font-bold mb-3 text-orange-900">DomManipulation</h4>
                  <p className="text-gray-800 mb-3">
                    Represents DOM changes that affect accessibility tree (add/remove elements, attribute changes).
                    Used to detect focus loss when elements are removed.
                  </p>
                  <pre className="bg-white p-4 rounded border border-orange-200 overflow-x-auto text-sm">
{`{
  id: "node-4",
  nodeType: "domManipulation",
  actionType: "domManipulation",
  operation: "remove",  // or "add", "setAttribute"
  targetElement: {
    selector: ".modal",
    binding: "modal"
  },
  affectsFocus: true,
  focusRestored: false,
  location: {
    file: "modal.js",
    line: 203,
    column: 10
  }
}`}
                  </pre>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h4 className="text-xl font-bold mb-3 text-red-900">TabIndexChange</h4>
                  <p className="text-gray-800 mb-3">
                    Captures programmatic tabindex modifications. Detects positive tabindex values
                    that disrupt natural tab order.
                  </p>
                  <pre className="bg-white p-4 rounded border border-red-200 overflow-x-auto text-sm">
{`{
  id: "node-5",
  nodeType: "tabIndexChange",
  actionType: "tabIndexChange",
  element: {
    selector: "#dynamicElement",
    binding: "element"
  },
  newValue: 5,  // Positive = warning
  oldValue: 0,
  reason: "dynamic-focus",
  location: {
    file: "focus-manager.js",
    line: 67,
    column: 15
  }
}`}
                  </pre>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Tree Structure</h3>
              <p className="text-gray-700 mb-4">
                ActionLanguage nodes form a <strong>tree structure</strong> where parent-child relationships
                represent code structure (function scope, conditionals, loops). This preserves context
                necessary for accurate analysis.
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold mb-3 text-gray-900">Example: Modal with Focus Trap</h4>
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`// JavaScript source
function openModal() {
  modal.style.display = 'block';
  firstButton.focus();

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      // trap focus
    }
  });
}

// ActionLanguage tree
{
  type: "functionDeclaration",
  name: "openModal",
  children: [
    {
      type: "domManipulation",
      operation: "setAttribute",
      element: { binding: "modal" }
    },
    {
      type: "focusChange",
      targetElement: { binding: "firstButton" },
      timing: "immediate"
    },
    {
      type: "eventHandler",
      event: "keydown",
      element: { binding: "modal" },
      children: [
        {
          type: "conditionalStatement",
          condition: "e.key === 'Tab'",
          children: [
            { type: "focusTrap" }
          ]
        }
      ]
    }
  ]
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Element References</h3>
              <p className="text-gray-700 mb-4">
                Every ActionLanguage node that interacts with UI elements includes an <code>element</code> reference
                with two components:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>binding</strong>: Variable name in source code (e.g., <code>"button"</code>)</li>
                <li><strong>selector</strong>: CSS selector for element (e.g., <code>"#submitButton"</code>)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Selectors are extracted from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><code>document.getElementById('foo')</code> → <code>#foo</code></li>
                <li><code>document.querySelector('.bar')</code> → <code>.bar</code></li>
                <li><code>document.querySelectorAll('[role="button"]')</code> → <code>[role="button"]</code></li>
              </ul>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Metadata</h3>
              <p className="text-gray-700 mb-4">
                All nodes include rich metadata for analysis and reporting:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>location</strong>: Source file, line number, column for precise error reporting</li>
                <li><strong>timing</strong>: When action occurs (immediate, delayed, async, on-event)</li>
                <li><strong>scope</strong>: Function/block scope for context-aware analysis</li>
                <li><strong>dependencies</strong>: Other nodes this depends on (for ordering analysis)</li>
              </ul>
            </div>
          </section>

          {/* 2. DOMModel */}
          <section id="dommodel" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-blue-600">2. DOMModel</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                DOMModel is a complete representation of HTML structure, parsed from source files or built
                output. It provides the "ground truth" of what elements exist and their accessibility-relevant
                attributes.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Parser</h3>
              <p className="text-gray-700 mb-4">
                Paradise uses <strong>parse5</strong>, a spec-compliant HTML parser used by jsdom and TypeScript.
                It handles malformed HTML gracefully and provides precise source locations.
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold mb-3 text-gray-900">Example: DOMElement Node</h4>
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`{
  id: "dom-1",
  nodeType: "element",
  tagName: "button",
  attributes: {
    id: "submitButton",
    class: "primary-btn",
    type: "submit",
    "aria-label": "Submit form",
    tabindex: "0"
  },
  children: [
    {
      nodeType: "text",
      content: "Submit"
    }
  ],
  parent: { /* reference to parent element */ },

  // Attached after merge
  jsHandlers: [
    { event: "click", file: "handlers.js", line: 42 },
    { event: "keydown", file: "keyboard.js", line: 18 }
  ],
  cssRules: [
    { selector: ".primary-btn", property: "outline", file: "styles.css" }
  ],

  // Computed properties
  focusable: true,
  interactive: true,
  hasSemanticRole: true,

  location: {
    file: "index.html",
    line: 45,
    column: 8,
    startOffset: 1203,
    endOffset: 1287
  }
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Accessibility-Relevant Attributes</h3>
              <p className="text-gray-700 mb-4">
                DOMModel extracts and indexes all attributes that affect accessibility:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Identifiers</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>id</code> - Element identifier</li>
                    <li>• <code>class</code> - CSS class list</li>
                    <li>• <code>name</code> - Form element name</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">ARIA Attributes</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>role</code> - ARIA role</li>
                    <li>• <code>aria-label</code> - Accessible name</li>
                    <li>• <code>aria-labelledby</code> - Label reference</li>
                    <li>• <code>aria-describedby</code> - Description reference</li>
                    <li>• <code>aria-controls</code> - Controlled element</li>
                    <li>• <code>aria-expanded</code> - Expansion state</li>
                    <li>• <code>aria-hidden</code> - Hidden from AT</li>
                    <li>• All other <code>aria-*</code> attributes</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-900 mb-2">Focus Management</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>tabindex</code> - Tab order</li>
                    <li>• <code>autofocus</code> - Initial focus</li>
                    <li>• <code>disabled</code> - Not focusable</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-bold text-orange-900 mb-2">Form Elements</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>for</code> - Label association</li>
                    <li>• <code>required</code> - Required field</li>
                    <li>• <code>placeholder</code> - Placeholder text</li>
                    <li>• <code>alt</code> - Image alternative text</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Semantic Analysis</h3>
              <p className="text-gray-700 mb-4">
                DOMModel computes semantic properties for each element:
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`{
  // Computed during model build
  focusable: boolean,           // Can receive keyboard focus
  interactive: boolean,         // Has click/keyboard handlers
  hasSemanticRole: boolean,     // Role matches tag (button, link, etc.)
  naturallyFocusable: boolean,  // Focusable without tabindex

  // ARIA role resolution
  implicitRole: "button",       // From tag name
  explicitRole: null,           // From role attribute
  effectiveRole: "button",      // Final computed role

  // Name computation (per accname spec)
  accessibleName: "Submit form",
  nameFrom: "aria-label",       // or "content", "alt", "labelledby"

  // Relationship tracking
  labelledBy: ["label-1"],      // IDs from aria-labelledby
  describedBy: ["help-text"],   // IDs from aria-describedby
  controls: ["panel-1"],        // IDs from aria-controls
  owns: [],                     // IDs from aria-owns

  // Tree relationships
  parent: DOMElement,
  children: DOMElement[],
  nextSibling: DOMElement,
  previousSibling: DOMElement
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Selector Queries</h3>
              <p className="text-gray-700 mb-4">
                DOMModel provides efficient selector queries for cross-referencing with ActionLanguage:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><code>getElementById(id)</code> - O(1) lookup via internal index</li>
                <li><code>querySelector(selector)</code> - Returns first match</li>
                <li><code>querySelectorAll(selector)</code> - Returns all matches</li>
                <li><code>getElementsByRole(role)</code> - All elements with ARIA role</li>
                <li><code>getAllFocusableElements()</code> - All keyboard-focusable elements</li>
              </ul>
            </div>
          </section>

          {/* 3. CSSModel */}
          <section id="cssmodel" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-cyan-600">3. CSSModel</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                CSSModel represents stylesheets and identifies CSS rules that affect accessibility.
                It detects visibility conflicts, focus styling issues, and other CSS-related problems.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Parser</h3>
              <p className="text-gray-700 mb-4">
                Paradise uses <strong>css-tree</strong>, a fast CSS parser that produces an AST used by
                PostCSS and other CSS tools. It preserves source locations and handles CSS at-rules.
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold mb-3 text-gray-900">Example: CSSRule Node</h4>
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`{
  id: "css-1",
  nodeType: "rule",
  selector: ".primary-btn:focus",
  specificity: [0, 2, 0],  // [id, class+attribute, type]

  properties: {
    outline: "2px solid blue",
    "outline-offset": "2px",
    "background-color": "#4f46e5"
  },

  // Accessibility impact flags
  affectsFocus: true,          // Has :focus or outline
  affectsVisibility: false,    // No display/visibility/opacity
  affectsContrast: true,       // Changes color/background
  affectsInteraction: false,   // No pointer-events

  // Computed impact
  accessibilityImpact: "positive",  // or "negative", "neutral"
  issues: [],

  location: {
    file: "styles.css",
    line: 42,
    column: 1,
    startOffset: 1203,
    endOffset: 1287
  }
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Accessibility-Affecting Properties</h3>
              <p className="text-gray-700 mb-4">
                CSSModel tracks properties that impact accessibility:
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-red-900 mb-2">Visibility (High Priority)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>display: none</code> - Removes from accessibility tree</li>
                    <li>• <code>visibility: hidden</code> - Hidden but occupies space</li>
                    <li>• <code>opacity: 0</code> - Invisible but focusable</li>
                    <li>• <code>clip: rect(0,0,0,0)</code> - Visually hidden technique</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-blue-900 mb-2">Focus Indicators</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>outline</code> - Focus ring</li>
                    <li>• <code>outline-offset</code> - Focus ring spacing</li>
                    <li>• <code>box-shadow</code> - Alternative focus indicator</li>
                    <li>• <code>border</code> - Focus border change</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-purple-900 mb-2">Color Contrast</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>color</code> - Text color</li>
                    <li>• <code>background-color</code> - Background color</li>
                    <li>• <code>background</code> - Background (includes color)</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-green-900 mb-2">Interaction</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>pointer-events: none</code> - Not clickable</li>
                    <li>• <code>cursor</code> - Visual affordance</li>
                    <li>• <code>user-select: none</code> - Text selection</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Selector Matching</h3>
              <p className="text-gray-700 mb-4">
                CSSModel implements CSS selector matching to determine which rules apply to elements:
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`// Supported selectors
#id                    // ID selector
.class                 // Class selector
element                // Type selector
[attribute]            // Attribute selector
[attribute="value"]    // Attribute with value

// Combinators
element.class          // Combined
parent > child         // Direct child
ancestor descendant    // Descendant
prev + next           // Adjacent sibling

// Pseudo-classes
:focus                 // Focus state
:hover                 // Hover state
:disabled              // Disabled state
:not(selector)         // Negation

// Specificity calculation
[id, class+attr, type] = [0, 0, 0]
Examples:
  #button              = [1, 0, 0]
  .btn.primary         = [0, 2, 0]
  button:focus         = [0, 1, 1]
  #submit.btn:focus    = [1, 2, 1]

// Rules applied in specificity order (highest wins)`}
                </pre>
              </div>
            </div>
          </section>

          {/* 4. DocumentModel */}
          <section id="documentmodel" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-purple-600">4. DocumentModel (Integration Layer)</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                DocumentModel is the <strong>integration layer</strong> that merges DOMModel, ActionLanguageModel,
                and CSSModel into a unified representation. This is where cross-file analysis becomes possible.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Structure</h3>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`{
  scope: "page",  // or "workspace", "file"

  models: {
    dom: DOMModel,                      // HTML structure
    javascript: ActionLanguageModel[],  // Array for multiple JS files
    css: CSSModel[]                     // Array for multiple CSS files
  },

  // Cross-reference indexes (built during merge)
  elementsBySelector: Map<string, DOMElement[]>,
  handlersByElement: Map<DOMElement, ActionLanguageNode[]>,
  rulesByElement: Map<DOMElement, CSSRule[]>,

  // ARIA relationship graph
  ariaRelationships: {
    labelledBy: Map<DOMElement, DOMElement[]>,
    describedBy: Map<DOMElement, DOMElement[]>,
    controls: Map<DOMElement, DOMElement[]>,
    owns: Map<DOMElement, DOMElement[]>
  },

  // Validation results
  validationErrors: ValidationError[],
  validationWarnings: ValidationWarning[]
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Element Context</h3>
              <p className="text-gray-700 mb-4">
                For each DOM element, DocumentModel provides a complete <code>ElementContext</code> with
                all accessibility-relevant information:
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`interface ElementContext {
  // Core element
  element: DOMElement,

  // Attached behaviors (from ActionLanguage)
  jsHandlers: {
    click: ActionLanguageNode[],
    keydown: ActionLanguageNode[],
    focus: ActionLanguageNode[],
    blur: ActionLanguageNode[],
    // ... other events
  },

  // Attached styles (from CSSModel)
  cssRules: CSSRule[],
  computedStyles: {
    display: string,
    visibility: string,
    opacity: string,
    outline: string,
    // ... other relevant properties
  },

  // Computed accessibility properties
  focusable: boolean,
  interactive: boolean,
  hasClickHandler: boolean,
  hasKeyboardHandler: boolean,
  hasAriaUpdates: boolean,

  // Validation results
  issues: Issue[],
  warnings: Warning[]
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* 5. Nested Tree Structure */}
          <section id="nested-trees" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-pink-600">5. Nested Tree Structure</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Paradise's architecture uses <strong>nested trees</strong> where models form hierarchical
                structures, and cross-references create connections between trees.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Tree Hierarchy</h3>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 mb-6">
                <pre className="bg-white p-6 rounded-lg border border-blue-300 overflow-x-auto text-sm font-mono">
{`DocumentModel (root)
├── DOMModel
│   ├── <html>
│   │   ├── <head>
│   │   │   ├── <title>
│   │   │   └── <link rel="stylesheet">
│   │   └── <body>
│   │       ├── <header>
│   │       │   └── <nav>
│   │       │       └── <button id="menu">
│   │       └── <main>
│   │           ├── <form>
│   │           │   ├── <input id="email">
│   │           │   └── <button id="submit">
│   │           └── <div role="dialog">
│   │
│   ├── ActionLanguageModel[]
│   │   ├── File: handlers.js
│   │   │   ├── EventHandler (click on #submit)
│   │   │   │   └── FunctionCall (validateForm)
│   │   │   └── EventHandler (click on #menu)
│   │   │       ├── DomManipulation (show nav)
│   │   │       └── FocusChange (focus first link)
│   │   │
│   │   └── File: validation.js
│   │       ├── FunctionDeclaration (validateForm)
│   │       │   ├── ConditionalStatement
│   │       │   │   ├── AriaStateChange (aria-invalid)
│   │       │   │   └── FocusChange (focus error)
│   │       │   └── EventHandler (keydown on #email)
│   │       │       └── KeyCheck (Enter key)
│   │       │
│   │       └── File: keyboard.js
│   │           └── EventHandler (keydown on #submit)
│   │               ├── KeyCheck (Enter key)
│   │               └── KeyCheck (Space key)
│   │
│   └── CSSModel[]
│       ├── File: styles.css
│       │   ├── Rule: #submit
│       │   │   ├── Property: background-color
│       │   │   └── Property: border
│       │   ├── Rule: #submit:focus
│       │   │   └── Property: outline
│       │   └── Rule: [aria-invalid="true"]
│       │       └── Property: border-color (red)
│       │
│       └── File: responsive.css
│           └── MediaQuery: @media (max-width: 768px)
│               └── Rule: #menu
│                   └── Property: display`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Cross-Tree References</h3>
              <p className="text-gray-700 mb-4">
                References between trees are established via <strong>CSS selectors</strong>:
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`// Example: Button element with cross-references

DOMElement {
  id: "#submit",
  tagName: "button",

  // References to ActionLanguage nodes
  jsHandlers: [
    → ActionLanguageNode (click handler in handlers.js:42)
    → ActionLanguageNode (keydown handler in keyboard.js:18)
  ],

  // References to CSS rules
  cssRules: [
    → CSSRule (#submit in styles.css:15)
    → CSSRule (#submit:focus in styles.css:20)
  ]
}

// These references are bi-directional:
ActionLanguageNode (click handler) {
  element: {
    selector: "#submit",
    resolvedElement: → DOMElement (#submit)
  }
}

CSSRule (#submit:focus) {
  selector: "#submit:focus",
  matchedElements: [
    → DOMElement (#submit)
  ]
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Why Nested Trees?</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-blue-900 mb-2">1. Preserves Source Structure</h4>
                  <p className="text-gray-700 text-sm">
                    Each tree maintains its original structure (HTML hierarchy, JavaScript scope, CSS cascade),
                    making analysis more accurate and error messages more useful.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-green-900 mb-2">2. Enables Independent Updates</h4>
                  <p className="text-gray-700 text-sm">
                    When a file changes, only its tree is re-parsed. Cross-references are quickly rebuilt
                    without re-parsing other files.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-purple-900 mb-2">3. Supports Multiple Files</h4>
                  <p className="text-gray-700 text-sm">
                    Arrays of ActionLanguageModel and CSSModel allow analyzing projects with hundreds of
                    JavaScript and CSS files without flattening structure.
                  </p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-orange-900 mb-2">4. Facilitates Extensibility</h4>
                  <p className="text-gray-700 text-sm">
                    Adding new model types (SwiftUIModel, AndroidLayoutModel) follows the same pattern:
                    create tree, establish selectors, build cross-references.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Merge Process */}
          <section id="merge-process" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-orange-600">6. Model Merge Process</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The merge process connects trees by resolving selectors to elements and attaching
                behaviors/styles. This is where the magic happens.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Algorithm</h3>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`function mergeModels(documentModel: DocumentModel): void {
  // Step 1: Build element index by selector
  const elementsBySelector = new Map<string, DOMElement[]>();

  for (const element of documentModel.models.dom.getAllElements()) {
    // Index by ID
    if (element.attributes.id) {
      const selector = \`#\${element.attributes.id}\`;
      elementsBySelector.set(selector, [element]);
    }

    // Index by classes
    if (element.attributes.class) {
      const classes = element.attributes.class.split(/\\s+/);
      for (const cls of classes) {
        const selector = \`.\${cls}\`;
        if (!elementsBySelector.has(selector)) {
          elementsBySelector.set(selector, []);
        }
        elementsBySelector.get(selector)!.push(element);
      }
    }

    // Index by tag name
    const tagSelector = element.tagName;
    if (!elementsBySelector.has(tagSelector)) {
      elementsBySelector.set(tagSelector, []);
    }
    elementsBySelector.get(tagSelector)!.push(element);

    // Index by role
    if (element.attributes.role) {
      const roleSelector = \`[role="\${element.attributes.role}"]\`;
      if (!elementsBySelector.has(roleSelector)) {
        elementsBySelector.set(roleSelector, []);
      }
      elementsBySelector.get(roleSelector)!.push(element);
    }
  }

  // Step 2: Attach JavaScript handlers to elements
  for (const jsModel of documentModel.models.javascript) {
    for (const node of jsModel.nodes) {
      if (node.element && node.element.selector) {
        const elements = elementsBySelector.get(node.element.selector) || [];

        for (const element of elements) {
          if (!element.jsHandlers) {
            element.jsHandlers = [];
          }
          element.jsHandlers.push(node);

          // Bi-directional reference
          node.element.resolvedElement = element;
        }

        // Warning if no elements matched
        if (elements.length === 0) {
          documentModel.validationWarnings.push({
            type: 'orphaned-handler',
            message: \`Handler for '\${node.element.selector}' has no matching elements\`,
            location: node.location,
            suggestions: findSimilarSelectors(node.element.selector, elementsBySelector)
          });
        }
      }
    }
  }

  // Step 3: Attach CSS rules to elements
  for (const cssModel of documentModel.models.css) {
    for (const rule of cssModel.rules) {
      const elements = querySelectorAll(rule.selector, documentModel.models.dom);

      for (const element of elements) {
        if (!element.cssRules) {
          element.cssRules = [];
        }
        element.cssRules.push(rule);

        // Sort by specificity (highest first)
        element.cssRules.sort((a, b) =>
          compareSpecificity(b.specificity, a.specificity)
        );
      }

      // Track matched elements
      rule.matchedElements = elements;
    }
  }

  // Step 4: Build ARIA relationship graph
  for (const element of documentModel.models.dom.getAllElements()) {
    // aria-labelledby
    if (element.attributes['aria-labelledby']) {
      const ids = element.attributes['aria-labelledby'].split(/\\s+/);
      for (const id of ids) {
        const target = documentModel.models.dom.getElementById(id);
        if (target) {
          documentModel.ariaRelationships.labelledBy.set(element,
            [...(documentModel.ariaRelationships.labelledBy.get(element) || []), target]
          );
        } else {
          documentModel.validationErrors.push({
            type: 'missing-aria-target',
            message: \`aria-labelledby references non-existent element '\${id}'\`,
            location: element.location
          });
        }
      }
    }

    // aria-describedby, aria-controls, aria-owns (same pattern)
    // ...
  }

  // Step 5: Compute accessibility properties for each element
  for (const element of documentModel.models.dom.getAllElements()) {
    const context = computeElementContext(element, documentModel);

    element.focusable = context.focusable;
    element.interactive = context.interactive;
    element.hasClickHandler = context.hasClickHandler;
    element.hasKeyboardHandler = context.hasKeyboardHandler;
  }
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Performance Optimizations</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li><strong>Indexing</strong>: Build selector → element maps once (O(n) elements)</li>
                <li><strong>Lazy evaluation</strong>: ElementContext computed on-demand</li>
                <li><strong>Incremental updates</strong>: Only re-merge changed files</li>
                <li><strong>Selector caching</strong>: Cache querySelectorAll results</li>
              </ul>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Validation During Merge</h3>
              <p className="text-gray-700 mb-4">
                The merge process detects several issue types automatically:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg">
                  <span className="text-red-500 font-bold text-lg">❌</span>
                  <div>
                    <strong className="text-red-900">Orphaned Handlers:</strong>
                    <span className="text-gray-700 text-sm ml-2">
                      JavaScript references element that doesn't exist in HTML
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg">
                  <span className="text-red-500 font-bold text-lg">❌</span>
                  <div>
                    <strong className="text-red-900">Missing ARIA Targets:</strong>
                    <span className="text-gray-700 text-sm ml-2">
                      aria-labelledby/describedby/controls points to non-existent ID
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg">
                  <span className="text-orange-500 font-bold text-lg">⚠️</span>
                  <div>
                    <strong className="text-orange-900">Visibility Conflicts:</strong>
                    <span className="text-gray-700 text-sm ml-2">
                      Element is focusable but hidden by CSS (display:none, opacity:0)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg">
                  <span className="text-orange-500 font-bold text-lg">⚠️</span>
                  <div>
                    <strong className="text-orange-900">Focus Order Chaos:</strong>
                    <span className="text-gray-700 text-sm ml-2">
                      Multiple positive tabindex values in non-sequential order
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Analysis Flow */}
          <section id="analysis-flow" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-emerald-600">7. Analysis Flow</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                With models merged, analyzers query the DocumentModel to detect accessibility issues.
                Analyzers have complete context: HTML structure, JavaScript behaviors, and CSS styles.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Analyzer Interface</h3>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`interface Analyzer {
  name: string;
  wcagCriteria: string[];  // e.g., ["2.1.1", "4.1.2"]
  severity: "error" | "warning" | "info";

  // Main analysis method
  analyze(context: AnalyzerContext): Issue[];

  // Optional: suggest fixes
  suggestFix?(issue: Issue): Fix | null;
}

interface AnalyzerContext {
  // Multi-model context (preferred)
  documentModel?: DocumentModel;

  // File-scope fallback (backward compatibility)
  actionLanguageModel?: ActionLanguageModel;

  // Analysis scope
  scope: "file" | "workspace" | "page";
}

interface Issue {
  type: string;              // e.g., "mouse-only-click"
  severity: "error" | "warning" | "info";
  wcag: string[];            // WCAG criteria violated
  message: string;           // Human-readable description
  element?: DOMElement;      // Primary element (if applicable)
  locations: SourceLocation[];  // All relevant code locations
  relatedNodes?: {           // Cross-file context
    handlers: ActionLanguageNode[];
    rules: CSSRule[];
  };
  fix?: Fix;                 // Suggested fix (optional)
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Example: MouseOnlyClickAnalyzer</h3>
              <p className="text-gray-700 mb-4">
                This analyzer demonstrates the power of multi-model context:
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`class MouseOnlyClickAnalyzer implements Analyzer {
  name = "MouseOnlyClickAnalyzer";
  wcagCriteria = ["2.1.1"];
  severity = "error";

  analyze(context: AnalyzerContext): Issue[] {
    // Prefer document model (zero false positives)
    if (context.documentModel?.models.dom) {
      return this.analyzeWithDocumentModel(context.documentModel);
    }

    // Fall back to file-scope (may have false positives)
    if (context.actionLanguageModel) {
      return this.analyzeFileScope(context.actionLanguageModel);
    }

    return [];
  }

  private analyzeWithDocumentModel(doc: DocumentModel): Issue[] {
    const issues: Issue[] = [];

    // Iterate all DOM elements
    for (const element of doc.models.dom.getAllElements()) {
      // Get complete element context
      const context = doc.getElementContext(element);

      // Check: has click handler but no keyboard handler
      const hasClick = context.jsHandlers.some(h =>
        h.actionType === 'eventHandler' && h.event === 'click'
      );

      const hasKeyboard = context.jsHandlers.some(h =>
        h.actionType === 'eventHandler' &&
        (h.event === 'keydown' || h.event === 'keypress')
      );

      if (hasClick && !hasKeyboard) {
        // Get all locations: HTML element + JS handlers
        const locations = [
          element.location,
          ...context.jsHandlers
            .filter(h => h.event === 'click')
            .map(h => h.location)
        ];

        issues.push({
          type: 'mouse-only-click',
          severity: 'error',
          wcag: ['2.1.1'],
          message: \`Element <\${element.tagName}> has click handler but no keyboard handler\`,
          element: element,
          locations: locations,
          relatedNodes: {
            handlers: context.jsHandlers,
            rules: context.cssRules
          },
          fix: this.generateFix(element, context)
        });
      }
    }

    return issues;
  }

  private analyzeFileScope(model: ActionLanguageModel): Issue[] {
    // File-scope analysis (legacy, may have false positives)
    // Only sees handlers in current file
    const issues: Issue[] = [];

    const clickHandlers = model.nodes.filter(n =>
      n.actionType === 'eventHandler' && n.event === 'click'
    );

    for (const click of clickHandlers) {
      const hasKeyboard = model.nodes.some(n =>
        n.actionType === 'eventHandler' &&
        n.element.binding === click.element.binding &&
        (n.event === 'keydown' || n.event === 'keypress')
      );

      if (!hasKeyboard) {
        // FALSE POSITIVE if keyboard handler is in another file!
        issues.push({
          type: 'mouse-only-click',
          severity: 'warning',  // Lower severity for file-scope
          wcag: ['2.1.1'],
          message: \`Click handler without keyboard handler (file-scope analysis)\`,
          locations: [click.location]
        });
      }
    }

    return issues;
  }

  private generateFix(element: DOMElement, context: ElementContext): Fix {
    // Generate keyboard handler for element
    const clickHandler = context.jsHandlers.find(h => h.event === 'click');

    return {
      type: 'add-keyboard-handler',
      description: 'Add keyboard handler for Enter and Space keys',
      changes: [{
        file: clickHandler?.location.file || 'unknown',
        insertAfter: clickHandler?.location.line || 0,
        code: \`
\${element.element.binding}.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    // Trigger same action as click handler
  }
});\`
      }]
    };
  }
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Analysis Pipeline</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Parse Files</div>
                      <div className="text-sm text-gray-600">
                        HTML → DOMModel, JavaScript → ActionLanguageModel, CSS → CSSModel
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">~31ms</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Build DocumentModel</div>
                      <div className="text-sm text-gray-600">
                        Merge models, resolve selectors, build indexes
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">~3ms</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Run Analyzers</div>
                      <div className="text-sm text-gray-600">
                        Each analyzer queries DocumentModel (13 analyzers in parallel)
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">~100ms</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">4</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Report Results</div>
                      <div className="text-sm text-gray-600">
                        Format issues with all locations, suggest fixes, output diagnostics
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">~5ms</div>
                  </div>

                  <div className="mt-6 pt-6 border-t-2 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-gray-900 text-lg">Total Analysis Time</div>
                      <div className="font-bold text-blue-600 text-2xl">~140ms</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      For typical page (100-line HTML, 300-line JS, 50-rule CSS)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Fragment-Aware Analysis */}
          <section id="fragments" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-violet-600">8. Fragment-Aware Analysis</h2>

            <div className="prose prose-lg max-w-none">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                <p className="text-lg font-semibold text-yellow-900 mb-2">The Reality of Development</p>
                <p className="text-gray-700">
                  Developers don't build complete, unified applications in one step. They work incrementally:
                  creating components in isolation, building features separately, and gradually integrating
                  everything together. Paradise must work at <strong>every stage</strong> of this process.
                </p>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">The Problem: Tree Completeness Assumption</h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Traditional accessibility tools assume they're analyzing a <strong>complete, unified tree</strong>:
                one connected DOM with all components integrated. This assumption breaks down during real development.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h4 className="text-xl font-bold text-red-900 mb-3">What Traditional Tools Assume</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✗ Single complete page exists</li>
                  <li>✗ All components are integrated</li>
                  <li>✗ All ARIA references resolve</li>
                  <li>✗ Complete element hierarchy available</li>
                  <li>✗ Analysis happens after build/integration</li>
                </ul>
              </div>

              <div className="bg-paradise-blue/10 border border-paradise-blue/30 rounded-lg p-6 mb-8">
                <h4 className="text-xl font-bold text-paradise-blue mb-3">What Actually Happens</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Multiple <strong>disconnected component fragments</strong></li>
                  <li>✓ Components built <strong>before</strong> pages exist</li>
                  <li>✓ ARIA references span <strong>separate files</strong></li>
                  <li>✓ Event handlers in <strong>different fragments</strong></li>
                  <li>✓ Analysis needed <strong>during development</strong></li>
                </ul>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Development Stages</h3>

              <div className="space-y-6 mb-8">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl font-bold text-red-600">Stage 1</div>
                    <h4 className="text-xl font-bold text-gray-900">Early Development: Many Fragments</h4>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Developer creates individual component files, not yet connected to any page.
                  </p>
                  <div className="bg-white rounded p-4 text-sm font-mono mb-3">
                    {`// ButtonComponent.tsx (isolated)
export function Button() {
  return <button onClick={handleClick}>Submit</button>;
}

// DialogComponent.tsx (isolated)
export function Dialog() {
  return <dialog>...</dialog>;
}

// FormComponent.tsx (isolated)
export function Form() {
  return <form>...</form>;
}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Paradise sees:</strong> 3 disconnected fragments<br />
                    <strong>Tree completeness:</strong> 0.3 (LOW)<br />
                    <strong>Confidence:</strong> LOW - Many unconnected components
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl font-bold text-orange-600">Stage 2</div>
                    <h4 className="text-xl font-bold text-gray-900">Partial Integration: Some Connections</h4>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Developer starts connecting components, some references resolve.
                  </p>
                  <div className="bg-white rounded p-4 text-sm font-mono mb-3">
                    {`// Page.tsx (partial)
export function Page() {
  return (
    <div>
      <Button />  {/* Connected! */}
      {/* Dialog and Form not imported yet */}
    </div>
  );
}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Paradise sees:</strong> 2 fragments (Page+Button, Dialog, Form)<br />
                    <strong>Tree completeness:</strong> 0.7 (MEDIUM)<br />
                    <strong>Confidence:</strong> MEDIUM - Partial tree with some connections
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl font-bold text-green-600">Stage 3</div>
                    <h4 className="text-xl font-bold text-gray-900">Complete Integration: Single Tree</h4>
                  </div>
                  <p className="text-gray-700 mb-3">
                    All components integrated into complete page tree.
                  </p>
                  <div className="bg-white rounded p-4 text-sm font-mono mb-3">
                    {`// Page.tsx (complete)
export function Page() {
  return (
    <div>
      <Button />   {/* Connected */}
      <Dialog />   {/* Connected */}
      <Form />     {/* Connected */}
    </div>
  );
}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Paradise sees:</strong> 1 complete tree<br />
                    <strong>Tree completeness:</strong> 1.0 (HIGH)<br />
                    <strong>Confidence:</strong> HIGH - Definitive analysis possible
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Paradise's Solution: Multiple DOMModel Fragments</h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Instead of requiring a single complete tree, Paradise's DocumentModel supports
                an <strong>array of DOM fragments</strong>, each representing an independent component tree.
              </p>

              <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-8">
                <pre className="text-sm overflow-x-auto">{`// Before: Single tree assumption
export class DocumentModel {
  dom?: DOMModel;  // ❌ Only one tree allowed
}

// After: Fragment-aware architecture
export class DocumentModel {
  dom?: DOMModel[];  // ✅ Multiple fragments supported

  getFragmentCount(): number {
    return this.dom?.length || 0;
  }

  getTreeCompleteness(): number {
    // Calculate 0.0-1.0 completeness score
    // Based on fragment count + reference resolution
  }

  isFragmentComplete(fragmentId: string): boolean {
    // Check if fragment is self-contained
  }
}`}</pre>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Tree Completeness Algorithm</h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Paradise calculates a <strong>completeness score</strong> (0.0 to 1.0) based on two factors:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border-2 border-paradise-blue rounded-lg p-6">
                  <h4 className="text-lg font-bold text-paradise-blue mb-3">Factor 1: Fragment Count</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Fewer fragments = more complete tree
                  </p>
                  <div className="bg-gray-50 rounded p-3 text-xs font-mono">
{`base = fragments === 1
  ? 0.7   // Single tree
  : max(0.3, 1.0 - (fragments * 0.1))

Examples:
• 1 fragment:  0.7
• 2 fragments: 0.8
• 3 fragments: 0.7
• 5 fragments: 0.5
• 8+ fragments: 0.3 (floor)`}
                  </div>
                </div>

                <div className="bg-white border-2 border-paradise-green rounded-lg p-6">
                  <h4 className="text-lg font-bold text-paradise-green mb-3">Factor 2: Reference Resolution</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    More resolved references = higher confidence
                  </p>
                  <div className="bg-gray-50 rounded p-3 text-xs font-mono">
{`rate = resolved / (resolved + unresolved)
boost = rate * 0.3  // Max +0.3

Examples:
• All resolved:  +0.3
• Half resolved: +0.15
• None resolved: +0.0

Final = min(1.0, base + boost)`}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Confidence Scoring</h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Paradise reports <strong>confidence levels</strong> for every issue, based on tree completeness.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">✅</div>
                    <h4 className="text-xl font-bold text-green-800">HIGH Confidence (0.9-1.0)</h4>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Single complete tree, all references resolve. Issues are <strong>definitive</strong>.
                  </p>
                  <div className="bg-white rounded p-3 text-sm">
                    <strong>Example:</strong> "Button missing keyboard handler"<br />
                    <span className="text-gray-600">Reason: Element verified in complete tree</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">⚠️</div>
                    <h4 className="text-xl font-bold text-yellow-800">MEDIUM Confidence (0.5-0.9)</h4>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Partial tree or some fragments. Issues are <strong>likely</strong>.
                  </p>
                  <div className="bg-white rounded p-3 text-sm">
                    <strong>Example:</strong> "Possible orphaned handler"<br />
                    <span className="text-gray-600">Reason: Partial tree analysis (70% complete)</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">ℹ️</div>
                    <h4 className="text-xl font-bold text-blue-800">LOW Confidence (0.0-0.5)</h4>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Many disconnected fragments. Issues are <strong>uncertain</strong>.
                  </p>
                  <div className="bg-white rounded p-3 text-sm">
                    <strong>Example:</strong> "Possible missing label"<br />
                    <span className="text-gray-600">Reason: Multiple disconnected fragments (30% complete)<br />
                    Consider integrating components for definitive analysis</span>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900">How Analyzers Use Fragments</h3>

              <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-8">
                <pre className="text-sm overflow-x-auto">{`export class MouseOnlyClickAnalyzer {
  analyze(documentModel: DocumentModel): Issue[] {
    const issues: Issue[] = [];

    // Get all interactive elements from ALL fragments
    const interactive = documentModel.getInteractiveElements();

    for (const element of interactive) {
      if (element.hasClickHandler && !element.hasKeyboardHandler) {
        // Calculate confidence based on tree completeness
        const completeness = documentModel.getTreeCompleteness();
        const fragmentCount = documentModel.getFragmentCount();

        let confidence: IssueConfidence;

        if (completeness >= 0.9) {
          // Definitive: Single complete tree
          confidence = {
            level: 'HIGH',
            reason: 'Element verified in complete tree',
            treeCompleteness: completeness
          };
        } else if (fragmentCount === 1) {
          // Likely: Single incomplete tree
          confidence = {
            level: 'MEDIUM',
            reason: \`Partial tree analysis (\${Math.round(completeness * 100)}% complete)\`,
            treeCompleteness: completeness
          };
        } else {
          // Uncertain: Multiple fragments
          confidence = {
            level: 'LOW',
            reason: \`Multiple fragments (\${fragmentCount} disconnected)\`,
            treeCompleteness: completeness
          };
        }

        issues.push({
          type: 'mouse-only-click',
          severity: 'warning',
          message: 'Button has click handler but no keyboard handler',
          confidence,  // Include confidence in result
          locations: [element.location],
          wcagCriteria: ['2.1.1']
        });
      }
    }

    return issues;
  }
}`}</pre>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Cross-Fragment References</h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Paradise can resolve references <strong>across fragments</strong>, enabling analysis
                even when components are in separate files.
              </p>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-bold mb-3">Example: ARIA References Across Fragments</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Fragment 1: Label Component</p>
                    <div className="bg-gray-50 rounded p-3 text-xs font-mono">
{`// Label.tsx
<span id="submit-label">
  Submit Form
</span>`}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Fragment 2: Button Component</p>
                    <div className="bg-gray-50 rounded p-3 text-xs font-mono">
{`// Button.tsx
<button
  aria-labelledby="submit-label"
>
  Submit
</button>`}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-gray-700">
                  ✓ Paradise searches ALL fragments for "submit-label"<br />
                  ✓ Reference resolves across fragments<br />
                  ✓ Completeness score boosted by resolved reference<br />
                  ✓ Confidence level increases
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Progressive Enhancement</h3>

              <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 border-2 border-paradise-blue/30 rounded-xl p-8">
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Analysis Improves Naturally</h4>
                <p className="text-lg text-gray-700 mb-6">
                  As developers integrate components, Paradise's analysis becomes more accurate <strong>automatically</strong>.
                  No configuration changes needed - confidence scores naturally improve as the tree becomes complete.
                </p>

                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-3xl mb-2">📦</div>
                    <div className="font-bold text-gray-900">Early Dev</div>
                    <div className="text-sm text-gray-600 mt-1">Many fragments</div>
                    <div className="text-sm text-blue-600 font-semibold mt-2">LOW confidence</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-3xl mb-2">🔗</div>
                    <div className="font-bold text-gray-900">Integration</div>
                    <div className="text-sm text-gray-600 mt-1">Partial connections</div>
                    <div className="text-sm text-yellow-600 font-semibold mt-2">MEDIUM confidence</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="font-bold text-gray-900">Complete</div>
                    <div className="text-sm text-gray-600 mt-1">Unified tree</div>
                    <div className="text-sm text-green-600 font-semibold mt-2">HIGH confidence</div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Benefits</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="font-semibold text-gray-900">Works at Any Stage</div>
                      <div className="text-sm text-gray-600">From single file to complete application</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="font-semibold text-gray-900">Transparent Confidence</div>
                      <div className="text-sm text-gray-600">No false sense of certainty</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="font-semibold text-gray-900">Zero Configuration</div>
                      <div className="text-sm text-gray-600">No manual annotation required</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="font-semibold text-gray-900">Progressive Enhancement</div>
                      <div className="text-sm text-gray-600">Analysis improves as code integrates</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="font-semibold text-gray-900">Real-Time Feedback</div>
                      <div className="text-sm text-gray-600">Immediate analysis during development</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="font-semibold text-gray-900">Backward Compatible</div>
                      <div className="text-sm text-gray-600">Works with existing single-file analysis</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Extensibility */}
          <section id="extensibility" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-6 text-fuchsia-600">9. Extensibility</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Paradise's architecture is designed for extensibility. Adding support for new platforms
                or languages follows a clear pattern.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Adding a New Model Type</h3>
              <p className="text-gray-700 mb-4">
                To add support for a new platform (e.g., SwiftUI, Android XML), create a model that
                implements the <code>Model</code> interface:
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`// Example: SwiftUIModel for iOS accessibility

class SwiftUIModel implements Model {
  type: ModelType = 'SwiftUI';
  version = '1.0.0';
  sourceFile: string;

  elements: SwiftUIElement[] = [];

  parse(source: string): SwiftUIElement[] {
    // Parse Swift source with Swift parser
    // Extract View hierarchy, modifiers, actions

    const ast = parseSwift(source);
    const elements = this.transformAST(ast);

    return elements;
  }

  validate(): ValidationResult {
    // Validate SwiftUI-specific patterns
    const errors: ValidationError[] = [];

    for (const element of this.elements) {
      // Check for .accessibilityLabel()
      if (!element.hasAccessibilityLabel && element.isInteractive) {
        errors.push({
          message: 'Interactive element missing .accessibilityLabel()',
          location: element.location,
          code: 'missing-accessibility-label'
        });
      }

      // Check for .accessibilityAction()
      // Check for .accessibilityHidden()
      // ... other SwiftUI-specific checks
    }

    return { valid: errors.length === 0, errors, warnings: [] };
  }

  serialize(): string {
    return JSON.stringify(this.elements, null, 2);
  }
}

// SwiftUI element structure
interface SwiftUIElement extends ModelNode {
  viewType: string;  // Button, Text, Image, etc.
  modifiers: SwiftUIModifier[];
  actions: SwiftUIAction[];
  children: SwiftUIElement[];

  // Accessibility-specific
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityTraits: AccessibilityTrait[];
  isAccessibilityElement: boolean;

  // For cross-reference
  identifier?: string;  // SwiftUI .id() modifier
  accessibilityIdentifier?: string;
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Integration with DocumentModel</h3>
              <p className="text-gray-700 mb-4">
                Once the model is created, integrate it with DocumentModel:
              </p>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`// Extend DocumentModel to support SwiftUI
interface DocumentModel {
  scope: AnalysisScope;

  models: {
    dom?: DOMModel;              // HTML (web)
    swiftui?: SwiftUIModel;      // iOS
    android?: AndroidLayoutModel; // Android
    javascript: ActionLanguageModel[];
    css: CSSModel[];
  };

  // ... rest of DocumentModel
}

// Merge process for SwiftUI
function mergeSwiftUIModel(doc: DocumentModel): void {
  if (!doc.models.swiftui) return;

  // Build element index by identifier
  const elementsById = new Map<string, SwiftUIElement>();

  for (const element of doc.models.swiftui.elements) {
    if (element.identifier || element.accessibilityIdentifier) {
      const id = element.identifier || element.accessibilityIdentifier;
      elementsById.set(id, element);
    }
  }

  // Attach ActionLanguage nodes (from Swift actions)
  for (const swiftModel of doc.models.swiftui.elements) {
    for (const action of swiftModel.actions) {
      // Convert Swift action to ActionLanguage node
      const alNode = convertSwiftActionToActionLanguage(action);

      if (!swiftModel.jsHandlers) {
        swiftModel.jsHandlers = [];
      }
      swiftModel.jsHandlers.push(alNode);
    }
  }

  // Validate accessibility
  for (const element of doc.models.swiftui.elements) {
    if (element.isInteractive && !element.accessibilityLabel) {
      doc.validationErrors.push({
        type: 'missing-accessibility-label',
        message: \`\${element.viewType} missing .accessibilityLabel()\`,
        location: element.location
      });
    }
  }
}`}
                </pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Future Model Types</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-900 mb-3">🍎 SwiftUIModel</h4>
                  <p className="text-gray-700 text-sm mb-3">iOS and macOS accessibility analysis</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Parse SwiftUI View hierarchies</li>
                    <li>• Validate .accessibilityLabel() and traits</li>
                    <li>• Check VoiceOver compatibility</li>
                    <li>• Verify Dynamic Type support</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-green-900 mb-3">🤖 AndroidLayoutModel</h4>
                  <p className="text-gray-700 text-sm mb-3">Android XML layout analysis</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Parse XML layout files</li>
                    <li>• Validate contentDescription</li>
                    <li>• Check TalkBack compatibility</li>
                    <li>• Verify touch target sizes</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-purple-900 mb-3">☕ KotlinModel</h4>
                  <p className="text-gray-700 text-sm mb-3">Kotlin Jetpack Compose analysis</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Parse @Composable functions</li>
                    <li>• Validate Modifier.semantics</li>
                    <li>• Check state management</li>
                    <li>• Verify focus handling</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-orange-900 mb-3">⚛️ ARIAModel</h4>
                  <p className="text-gray-700 text-sm mb-3">Dedicated ARIA relationship graph</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Track all ARIA relationships</li>
                    <li>• Validate role hierarchies</li>
                    <li>• Detect circular references</li>
                    <li>• Verify live region updates</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Pattern for Extension</h3>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-6">
                <li>
                  <strong>Create Model Interface</strong> - Implement <code>Model</code> interface with platform-specific node types
                </li>
                <li>
                  <strong>Build Parser</strong> - Parse source files to AST, extract accessibility-relevant information
                </li>
                <li>
                  <strong>Define Selectors</strong> - Establish how elements are identified (IDs, identifiers, accessibility IDs)
                </li>
                <li>
                  <strong>Integrate with DocumentModel</strong> - Add model type to DocumentModel, implement merge logic
                </li>
                <li>
                  <strong>Create Analyzers</strong> - Write platform-specific analyzers that query the new model
                </li>
                <li>
                  <strong>Test Thoroughly</strong> - Unit tests, integration tests, real-world examples
                </li>
              </ol>

              <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 border-2 border-paradise-blue/30 rounded-xl p-8 mt-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Universal Accessibility</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  By following this architecture, Paradise can analyze accessibility across <strong>any platform</strong>:
                  web, iOS, Android, desktop, VR/AR, and future platforms. The nested tree structure with
                  cross-references provides a universal pattern for accessibility analysis.
                </p>
              </div>
            </div>
          </section>
          </div>
        </div>
      </section>
    </main>
  );
}
