export default function Module5() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-blue via-paradise-purple to-paradise-orange text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white text-paradise-blue w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl">
              5
            </div>
            <div>
              <h1 className="text-5xl font-bold">
                Writing Custom Analyzers
              </h1>
              <p className="text-xl text-white/90 mt-2">
                Build your own accessibility detectors
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-3xl">
            <p className="text-lg">
              <strong>Time:</strong> 60+ minutes • <strong>Level:</strong> Advanced
            </p>
            <p className="text-lg mt-2">
              Learn how to write custom analyzers that detect accessibility patterns in ActionLanguage.
              By the end, you'll build a complete analyzer from scratch.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Quick Navigation */}
          <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue/20 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-paradise-blue">Module Contents</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <a href="#anatomy" className="text-paradise-blue hover:underline">→ Analyzer Anatomy</a>
              <a href="#patterns" className="text-paradise-blue hover:underline">→ Pattern Detection</a>
              <a href="#querying" className="text-paradise-blue hover:underline">→ Querying ActionLanguage</a>
              <a href="#example-1" className="text-paradise-blue hover:underline">→ Example 1: Simple Pattern</a>
              <a href="#example-2" className="text-paradise-blue hover:underline">→ Example 2: Stateful Detection</a>
              <a href="#example-3" className="text-paradise-blue hover:underline">→ Example 3: Advanced Patterns</a>
              <a href="#fix-generators" className="text-paradise-blue hover:underline">→ Fix Generators</a>
              <a href="#testing" className="text-paradise-blue hover:underline">→ Testing Your Analyzer</a>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg mb-12">
              <h3 className="text-2xl font-semibold text-paradise-blue mb-3 mt-0">Why Write Custom Analyzers?</h3>
              <p className="text-gray-700 mb-0">
                Paradise ships with 9 analyzers detecting 35+ issues, but every organization has unique
                accessibility needs. Maybe you have custom UI components, internal design patterns, or
                specific WCAG interpretations. Custom analyzers let you extend Paradise to detect
                whatever patterns matter to your team—and they'll work across all languages automatically.
              </p>
            </div>

            {/* Anatomy */}
            <section id="anatomy">
              <h2 className="text-3xl font-bold mt-12 mb-6">Analyzer Anatomy</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Every analyzer follows the same basic structure. Here's the minimal template:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Basic Analyzer Template:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class MyCustomAnalyzer {
  constructor() {
    this.name = "MyCustomAnalyzer";
    this.version = "1.0.0";
  }

  /**
   * Main entry point - analyze the ActionLanguage tree
   * @param {ActionNode[]} actionTree - The parsed ActionLanguage
   * @returns {Issue[]} - Array of detected issues
   */
  analyze(actionTree) {
    const issues = [];

    // Your detection logic here
    // Query the tree, find patterns, detect issues

    return issues;
  }

  /**
   * Optional: Get metadata about this analyzer
   * @returns {Object} - Analyzer metadata
   */
  getMetadata() {
    return {
      name: this.name,
      version: this.version,
      detects: ["issue-type-1", "issue-type-2"],
      wcag: ["2.1.1", "4.1.2"]
    };
  }
}`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                That's it! An analyzer is just a class with an <code className="bg-gray-100 px-2 py-1 rounded">analyze()</code> method
                that takes an ActionLanguage tree and returns an array of issues.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Issue Format</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Standard Issue Object:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  type: string,              // Unique issue identifier
  severity: string,          // "error" | "warning" | "info"
  wcag: string[],            // WCAG success criteria (e.g., ["2.1.1"])
  node: ActionNode,          // The problematic node
  message: string,           // Human-readable description
  context: {                 // Optional: Additional context
    element: ElementRef,
    relatedNodes: ActionNode[],
    suggestedFix: string,
    ...
  }
}`}</code></pre>
              </div>
            </section>

            {/* Pattern Detection */}
            <section id="patterns">
              <h2 className="text-3xl font-bold mt-12 mb-6">Pattern Detection Strategies</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Analyzers detect patterns using three main strategies:
              </p>

              <div className="space-y-6 my-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-green">1. Presence Detection</h4>
                  <p className="text-gray-700 mb-3">
                    "Does X exist?" - Find nodes matching specific criteria.
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Example: Detect click handlers</p>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`const clicks = tree.filter(node =>
  node.actionType === 'eventHandler' &&
  node.event === 'click'
);`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-blue">2. Absence Detection</h4>
                  <p className="text-gray-700 mb-3">
                    "Does X exist without Y?" - Find nodes missing required counterparts.
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Example: Click without keyboard handler</p>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`for (const click of clicks) {
  const hasKeyboard = tree.some(node =>
    node.element === click.element &&
    node.event === 'keydown'
  );
  if (!hasKeyboard) issues.push(...);
}`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-orange">3. State Tracking</h4>
                  <p className="text-gray-700 mb-3">
                    "How many times does X change?" - Track operations over time.
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Example: ARIA state updated only once</p>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`const updateCounts = new Map();
for (const node of tree) {
  if (node.actionType === 'ariaStateChange') {
    const key = node.element + node.attribute;
    updateCounts.set(key, (updateCounts.get(key) || 0) + 1);
  }
}
// If updateCounts[key] === 1, it's static!`}</code></pre>
                </div>
              </div>
            </section>

            {/* Querying */}
            <section id="querying">
              <h2 className="text-3xl font-bold mt-12 mb-6">Querying ActionLanguage</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Paradise provides utility functions for common query patterns:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Query Utilities:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Find all nodes of a specific type
const clicks = findByType(tree, 'eventHandler', { event: 'click' });

// Find nodes by element reference
const nodesForElement = findByElement(tree, elementRef);

// Check if two elements are the same
const isSame = sameElement(elem1, elem2);

// Walk tree recursively (for nested structures)
walkTree(tree, (node) => {
  if (node.actionType === 'conditional') {
    // Process conditionals
  }
});

// Find parent node
const parent = findParent(tree, node);

// Find all descendants
const descendants = findDescendants(tree, node);`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Element Reference Matching</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Elements can be referenced three ways (binding, selector, id). Always use the
                <code className="bg-gray-100 px-2 py-1 rounded">sameElement()</code> utility:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`function sameElement(elem1, elem2) {
  // Check binding match
  if (elem1.binding && elem2.binding) {
    return elem1.binding === elem2.binding;
  }

  // Check selector match
  if (elem1.selector && elem2.selector) {
    return elem1.selector === elem2.selector;
  }

  // Check ID match
  if (elem1.id && elem2.id) {
    return elem1.id === elem2.id;
  }

  return false;
}`}</code></pre>
              </div>
            </section>

            {/* Example 1: Simple Pattern */}
            <section id="example-1">
              <h2 className="text-3xl font-bold mt-12 mb-6">Example 1: Detecting Positive tabIndex</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Let's build a simple analyzer that detects positive tabIndex values (WCAG 2.4.3).
                Positive tabIndex disrupts natural tab order and should be avoided.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 1: Understand the Pattern</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Bad Code (Any Language):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// JavaScript
element.tabIndex = 5;  // ❌ Positive tabIndex

// Objective-C
element.accessibilityNavigationStyle = 5;  // ❌

// Kotlin
element.tabIndex = 5  // ❌`}</code></pre>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage (All Languages):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "tabIndexChange",
  element: { binding: "element" },
  oldValue: null,
  newValue: 5  // ← Positive value!
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 2: Write the Analyzer</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">PositiveTabIndexAnalyzer:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class PositiveTabIndexAnalyzer {
  constructor() {
    this.name = "PositiveTabIndexAnalyzer";
    this.version = "1.0.0";
  }

  analyze(actionTree) {
    const issues = [];

    // Find all tabIndexChange nodes
    const tabIndexChanges = actionTree.filter(
      node => node.actionType === 'tabIndexChange'
    );

    for (const change of tabIndexChanges) {
      const newValue = change.newValue;

      // Check if newValue is a positive number
      if (typeof newValue === 'number' && newValue > 0) {
        issues.push({
          type: 'positive-tabindex',
          severity: 'warning',
          wcag: ['2.4.3'],
          node: change,
          message: \`Positive tabIndex value (\${newValue}) disrupts natural tab order\`,
          context: {
            element: change.element,
            tabIndexValue: newValue,
            suggestedFix: 'Use tabIndex="0" for keyboard focusable elements or tabIndex="-1" for programmatic focus'
          }
        });
      }
    }

    return issues;
  }

  getMetadata() {
    return {
      name: this.name,
      version: this.version,
      detects: ['positive-tabindex'],
      wcag: ['2.4.3']
    };
  }
}`}</code></pre>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">That's It!</p>
                <p className="text-gray-700 mb-0">
                  This analyzer now works for JavaScript, Objective-C, Kotlin, and any future language
                  with a CREATE function. You wrote it once, and it runs universally.
                </p>
              </div>
            </section>

            {/* Example 2: Stateful Detection */}
            <section id="example-2">
              <h2 className="text-3xl font-bold mt-12 mb-6">Example 2: Detecting Duplicate Event Listeners</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                A more advanced pattern: detect when the same event listener is added multiple times
                to the same element without being removed. This requires state tracking.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 1: Understand the Pattern</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Bad Code (Creates Memory Leaks):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Called multiple times without cleanup
function setupButton() {
  button.addEventListener('click', handleClick);
  // If setupButton() runs twice, click handler is attached twice!
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 2: Write the Analyzer</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">DuplicateListenerAnalyzer:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class DuplicateListenerAnalyzer {
  constructor() {
    this.name = "DuplicateListenerAnalyzer";
  }

  analyze(actionTree) {
    const issues = [];

    // Track: element + event + handler -> count
    const listenerMap = new Map();
    const listenerNodes = new Map();

    // First pass: Count addEventListener calls
    for (const node of actionTree) {
      if (node.actionType === 'eventHandler') {
        const key = this.makeKey(node);

        if (!listenerMap.has(key)) {
          listenerMap.set(key, []);
        }
        listenerMap.get(key).push(node);
      }
    }

    // Second pass: Check for removeEventListener
    for (const node of actionTree) {
      if (node.actionType === 'removeEventListener') {
        const key = this.makeKey(node);

        // Remove one instance
        const listeners = listenerMap.get(key) || [];
        if (listeners.length > 0) {
          listeners.shift();
        }
      }
    }

    // Third pass: Find duplicates
    for (const [key, nodes] of listenerMap.entries()) {
      if (nodes.length > 1) {
        issues.push({
          type: 'duplicate-event-listener',
          severity: 'warning',
          wcag: [],  // Not directly WCAG, but good practice
          node: nodes[0],
          message: \`Event listener attached \${nodes.length} times without removal\`,
          context: {
            element: nodes[0].element,
            event: nodes[0].event,
            attachmentCount: nodes.length,
            allNodes: nodes
          }
        });
      }
    }

    return issues;
  }

  makeKey(node) {
    // Create unique key from element + event + handler name
    const elemKey = node.element.binding ||
                    node.element.selector ||
                    node.element.id;
    const handlerKey = node.handler?.name || 'anonymous';
    return \`\${elemKey}:\${node.event}:\${handlerKey}\`;
  }
}`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                This analyzer:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>📊 Tracks listener additions in a Map</li>
                <li>📊 Decrements count when removeEventListener is found</li>
                <li>📊 Reports duplicates (count &gt; 1)</li>
                <li>🌍 Works universally across all languages</li>
              </ul>
            </section>

            {/* Example 3: Advanced Patterns */}
            <section id="example-3">
              <h2 className="text-3xl font-bold mt-12 mb-6">Example 3: Context-Aware Detection</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Advanced analyzers consider the context in which code executes. Let's detect form
                submissions in focus handlers (WCAG 3.2.2 violation).
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 1: Understand the Pattern</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Bad Code (Unexpected Context Change):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// WCAG 3.2.2: On Input - Don't cause context changes on focus
input.addEventListener('focus', function() {
  form.submit();  // ❌ Submits form when input receives focus!
});`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 2: Write the Analyzer</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">UnexpectedSubmitAnalyzer:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class UnexpectedSubmitAnalyzer {
  constructor() {
    this.name = "UnexpectedSubmitAnalyzer";
  }

  analyze(actionTree) {
    const issues = [];

    // Find all focus/input event handlers
    const focusHandlers = actionTree.filter(node =>
      node.actionType === 'eventHandler' &&
      (node.event === 'focus' || node.event === 'input')
    );

    for (const handler of focusHandlers) {
      // Check if handler body contains form submission
      const hasSubmit = this.containsFormSubmit(handler.handler.body);

      if (hasSubmit) {
        issues.push({
          type: 'unexpected-form-submit',
          severity: 'error',
          wcag: ['3.2.2'],
          node: handler,
          message: \`Form submission in \${handler.event} handler causes unexpected context change\`,
          context: {
            element: handler.element,
            event: handler.event,
            explanation: 'Users do not expect forms to submit when focusing on or typing in an input field'
          }
        });
      }
    }

    return issues;
  }

  containsFormSubmit(body) {
    if (!body) return false;

    for (const node of body) {
      // Direct form submit
      if (node.actionType === 'formSubmit') {
        return true;
      }

      // Check nested structures
      if (node.actionType === 'conditional') {
        if (this.containsFormSubmit(node.consequent)) return true;
        if (this.containsFormSubmit(node.alternate)) return true;
      }

      // Check function calls
      if (node.actionType === 'call') {
        // Could check if function name suggests submission
        if (node.method === 'submit' || node.name === 'submitForm') {
          return true;
        }
      }
    }

    return false;
  }
}`}</code></pre>
              </div>

              <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-orange mb-2">Context-Aware Analysis</p>
                <p className="text-gray-700 mb-0">
                  This analyzer doesn't just look for form submissions—it checks <em>where</em> they occur.
                  The same submission in a button click handler would be fine. Context matters!
                </p>
              </div>
            </section>

            {/* Fix Generators */}
            <section id="fix-generators">
              <h2 className="text-3xl font-bold mt-12 mb-6">Writing Fix Generators</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Analyzers detect issues. Fix generators create ActionLanguage nodes that resolve those issues.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Fix Generator Structure</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Basic Fix Generator:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class PositiveTabIndexFixer {
  /**
   * Generate fix nodes for an issue
   * @param {Issue} issue - The detected issue
   * @param {ActionNode[]} actionTree - The full tree
   * @returns {ActionNode[]} - New nodes to insert
   */
  generateFix(issue, actionTree) {
    const problematicNode = issue.node;

    // Create a replacement node with tabIndex="0"
    const fixedNode = {
      ...problematicNode,
      newValue: 0,  // Change from positive to 0
      metadata: {
        ...problematicNode.metadata,
        fixedBy: 'PositiveTabIndexFixer'
      }
    };

    return [fixedNode];
  }

  /**
   * Instructions for applying the fix
   * @param {Issue} issue
   * @returns {Object} - Apply instructions
   */
  getApplyInstructions(issue) {
    return {
      operation: 'replace',
      target: issue.node.id,
      with: this.generateFix(issue)
    };
  }
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Fixing Missing Keyboard Handler</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">MouseOnlyClickFixer (Complex Fix):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class MouseOnlyClickFixer {
  generateFix(issue, actionTree) {
    const clickHandler = issue.node;

    // Create new keyboard handler
    const keyboardHandler = {
      id: this.generateId(),
      actionType: "eventHandler",
      event: "keydown",
      element: { ...clickHandler.element },  // Same element
      handler: {
        actionType: "functionExpression",
        params: ["event"],
        body: [
          {
            actionType: "conditional",
            condition: {
              actionType: "binaryExpression",
              operator: "||",
              left: {
                operator: "===",
                left: { property: "key", object: "event" },
                right: "Enter"
              },
              right: {
                operator: "===",
                left: { property: "key", object: "event" },
                right: " "
              }
            },
            consequent: [
              {
                actionType: "preventDefault",
                target: { binding: "event" }
              },
              // Copy the click handler's logic
              ...clickHandler.handler.body
            ]
          }
        ]
      },
      metadata: {
        fixedBy: 'MouseOnlyClickFixer',
        fixedIssue: issue.type
      }
    };

    return [keyboardHandler];
  }

  getApplyInstructions(issue) {
    return {
      operation: 'insertAfter',
      target: issue.node.id,
      with: this.generateFix(issue)
    };
  }

  generateId() {
    return \`fix-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  }
}`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                This fix generator:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>✨ Creates entirely new ActionLanguage nodes</li>
                <li>✨ Copies the element reference from the original</li>
                <li>✨ Duplicates the click handler's logic for keyboard</li>
                <li>✨ Adds Enter and Space key checks</li>
                <li>🌍 Works universally—GENERATE transforms it back to each language</li>
              </ul>
            </section>

            {/* Testing */}
            <section id="testing">
              <h2 className="text-3xl font-bold mt-12 mb-6">Testing Your Analyzer</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Always test analyzers with both positive and negative cases:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Test Structure:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`describe('PositiveTabIndexAnalyzer', () => {
  const analyzer = new PositiveTabIndexAnalyzer();

  test('detects positive tabIndex', () => {
    const tree = [
      {
        actionType: 'tabIndexChange',
        element: { binding: 'button' },
        newValue: 5
      }
    ];

    const issues = analyzer.analyze(tree);

    expect(issues).toHaveLength(1);
    expect(issues[0].type).toBe('positive-tabindex');
    expect(issues[0].context.tabIndexValue).toBe(5);
  });

  test('allows tabIndex 0 (no issue)', () => {
    const tree = [
      {
        actionType: 'tabIndexChange',
        element: { binding: 'button' },
        newValue: 0
      }
    ];

    const issues = analyzer.analyze(tree);

    expect(issues).toHaveLength(0);
  });

  test('allows tabIndex -1 (no issue)', () => {
    const tree = [
      {
        actionType: 'tabIndexChange',
        element: { binding: 'button' },
        newValue: -1
      }
    ];

    const issues = analyzer.analyze(tree);

    expect(issues).toHaveLength(0);
  });

  test('detects multiple positive tabIndex values', () => {
    const tree = [
      {
        actionType: 'tabIndexChange',
        element: { binding: 'button1' },
        newValue: 3
      },
      {
        actionType: 'tabIndexChange',
        element: { binding: 'button2' },
        newValue: 7
      }
    ];

    const issues = analyzer.analyze(tree);

    expect(issues).toHaveLength(2);
  });
});`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Integration Testing</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Test your analyzer with real source code from multiple languages:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`describe('PositiveTabIndexAnalyzer - Integration', () => {
  test('detects in JavaScript', () => {
    const jsCode = \`
      const button = document.getElementById('btn');
      button.tabIndex = 5;
    \`;

    const actionTree = CREATE(jsCode, 'javascript');
    const issues = analyzer.analyze(actionTree);

    expect(issues).toHaveLength(1);
  });

  test('detects in Objective-C', () => {
    const objcCode = \`
      UIButton *button = [self.view viewWithTag:100];
      button.accessibilityNavigationStyle = 5;
    \`;

    const actionTree = CREATE(objcCode, 'objective-c');
    const issues = analyzer.analyze(actionTree);

    expect(issues).toHaveLength(1);
  });

  test('detects in Kotlin', () => {
    const kotlinCode = \`
      val button: Button = findViewById(R.id.button)
      button.tabIndex = 5
    \`;

    const actionTree = CREATE(kotlinCode, 'kotlin');
    const issues = analyzer.analyze(actionTree);

    expect(issues).toHaveLength(1);
  });
});`}</code></pre>
              </div>

              <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-green mb-2">Universal Testing</p>
                <p className="text-gray-700 mb-0">
                  If your analyzer passes tests for JavaScript, Objective-C, and Kotlin, you can be
                  confident it will work for any language with a CREATE function. That's the power
                  of ActionLanguage.
                </p>
              </div>
            </section>

            {/* Best Practices */}
            <section id="best-practices">
              <h2 className="text-3xl font-bold mt-12 mb-6">Best Practices</h2>

              <div className="space-y-6 my-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
                  <h4 className="font-semibold text-lg mb-3">1. Keep Analyzers Focused</h4>
                  <p className="text-gray-700 text-sm">
                    Each analyzer should detect one category of issues. Don't create a "SuperAnalyzer"
                    that tries to do everything—it becomes unmaintainable.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-semibold text-lg mb-3">2. Use Element Reference Utilities</h4>
                  <p className="text-gray-700 text-sm">
                    Always use <code className="bg-gray-100 px-2 py-1 rounded">sameElement()</code> to
                    compare elements. Never compare binding/selector/id directly—you'll miss cases.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
                  <h4 className="font-semibold text-lg mb-3">3. Provide Context in Issues</h4>
                  <p className="text-gray-700 text-sm">
                    The <code className="bg-gray-100 px-2 py-1 rounded">context</code> object helps users
                    understand the issue. Include relevant elements, suggested fixes, and explanations.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-purple">
                  <h4 className="font-semibold text-lg mb-3">4. Test Thoroughly</h4>
                  <p className="text-gray-700 text-sm">
                    Write tests for both positive (issue detected) and negative (no false positives) cases.
                    Test with multiple languages to ensure universal behavior.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gray-600">
                  <h4 className="font-semibold text-lg mb-3">5. Document WCAG Mappings</h4>
                  <p className="text-gray-700 text-sm">
                    Always include the WCAG success criteria your analyzer checks. This helps users
                    understand the accessibility impact and prioritize fixes.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Turn */}
            <section id="your-turn">
              <h2 className="text-3xl font-bold mt-12 mb-6">Your Turn: Exercise</h2>

              <div className="bg-gradient-to-r from-paradise-orange/10 to-paradise-purple/10 rounded-lg p-8 my-8 border border-paradise-orange/20">
                <h3 className="text-2xl font-bold mb-4">Challenge: Write an Image Alt Text Analyzer</h3>
                <p className="text-gray-700 mb-4">
                  Create an analyzer that detects images without alt text (WCAG 1.1.1).
                </p>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Requirements:</strong></p>
                  <ul className="space-y-2 ml-4">
                    <li>• Detect <code className="bg-white px-2 py-1 rounded">createElement</code> nodes with <code className="bg-white px-2 py-1 rounded">tagName: "img"</code></li>
                    <li>• Check if they have an <code className="bg-white px-2 py-1 rounded">alt</code> attribute</li>
                    <li>• Report as WCAG 1.1.1 violation if missing</li>
                    <li>• Bonus: Detect empty alt text (<code className="bg-white px-2 py-1 rounded">alt=""</code>) on non-decorative images</li>
                  </ul>
                </div>
              </div>

              <details className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <summary className="font-semibold cursor-pointer">Show Solution</summary>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto mt-4"><code>{`class ImageAltTextAnalyzer {
  constructor() {
    this.name = "ImageAltTextAnalyzer";
  }

  analyze(actionTree) {
    const issues = [];

    // Find all createElement nodes for images
    const images = actionTree.filter(node =>
      node.actionType === 'createElement' &&
      node.tagName === 'img'
    );

    for (const img of images) {
      const attributes = img.attributes || {};
      const hasAlt = 'alt' in attributes;
      const altValue = attributes.alt;

      if (!hasAlt) {
        // Missing alt attribute entirely
        issues.push({
          type: 'missing-image-alt',
          severity: 'error',
          wcag: ['1.1.1'],
          node: img,
          message: 'Image missing alt attribute',
          context: {
            element: img.binding,
            suggestedFix: 'Add descriptive alt text or alt="" for decorative images'
          }
        });
      } else if (altValue === '') {
        // Empty alt text - could be intentional for decorative images
        // Flag as info to verify
        issues.push({
          type: 'empty-image-alt',
          severity: 'info',
          wcag: ['1.1.1'],
          node: img,
          message: 'Image has empty alt text - verify this is a decorative image',
          context: {
            element: img.binding,
            note: 'Empty alt is correct for decorative images but wrong for content images'
          }
        });
      }
    }

    return issues;
  }
}`}</code></pre>
              </details>
            </section>

            {/* Conclusion */}
            <section id="conclusion">
              <h2 className="text-3xl font-bold mt-12 mb-6">Conclusion</h2>

              <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 my-8">
                <h3 className="text-2xl font-bold mb-4">You're Now a Paradise Developer</h3>
                <p className="text-lg mb-4">
                  You've learned how to write custom analyzers that detect accessibility patterns in
                  ActionLanguage. These analyzers automatically work across all languages—JavaScript,
                  Objective-C, Kotlin, and any future language with a CREATE function.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-bold mb-2">What You've Learned:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>✓ Analyzer anatomy and structure</li>
                      <li>✓ Pattern detection strategies</li>
                      <li>✓ Querying ActionLanguage</li>
                      <li>✓ Writing fix generators</li>
                      <li>✓ Testing analyzers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">What You Can Do:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>→ Detect custom patterns</li>
                      <li>→ Enforce team conventions</li>
                      <li>→ Extend WCAG coverage</li>
                      <li>→ Build domain-specific rules</li>
                      <li>→ Contribute to Paradise</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-green mb-2">Universal Impact</p>
                <p className="text-gray-700 mb-0">
                  Every analyzer you write works for every language. Write one analyzer today, and it
                  automatically works for languages that don't even exist yet. That's the power of
                  CRUD operations on intermediate representations.
                </p>
              </div>
            </section>

            {/* Module Complete */}
            <div className="bg-gradient-to-r from-paradise-blue via-paradise-purple to-paradise-orange text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-3">Module 5 Complete! 🎉</h3>
              <p className="text-lg mb-6">
                You now know how to write custom analyzers that detect accessibility patterns in
                ActionLanguage. Next up: learn how to integrate these analyzers into VS Code
                to provide real-time feedback with diagnostics and one-click fixes!
              </p>
              <div className="flex gap-4">
                <a href="/learn-actionlanguage/module-6" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Continue to Module 6 →
                </a>
                <a href="/learn-actionlanguage" className="bg-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors border-2 border-white">
                  Back to Overview
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
