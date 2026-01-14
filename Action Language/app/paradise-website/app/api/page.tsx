'use client';

import { useState } from 'react';

type APISection = 'overview' | 'node-types' | 'core-operations' | 'analyzers' | 'fixers';

export default function API() {
  const [activeSection, setActiveSection] = useState<APISection>('overview');

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            ActionLanguage API Reference
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            Complete specification for ActionLanguage nodes, operations, and integration
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="flex gap-8">

          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeSection === 'overview'
                    ? 'bg-paradise-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSection('node-types')}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeSection === 'node-types'
                    ? 'bg-paradise-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Node Types
              </button>
              <button
                onClick={() => setActiveSection('core-operations')}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeSection === 'core-operations'
                    ? 'bg-paradise-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Core Operations
              </button>
              <button
                onClick={() => setActiveSection('analyzers')}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeSection === 'analyzers'
                    ? 'bg-paradise-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Writing Analyzers
              </button>
              <button
                onClick={() => setActiveSection('fixers')}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeSection === 'fixers'
                    ? 'bg-paradise-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Writing Fixers
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">

            {/* Overview */}
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Overview</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    ActionLanguage is a universal intermediate representation for UI interactions. It abstracts
                    away language-specific syntax to capture only interaction semantics, enabling deterministic
                    accessibility analysis across all programming languages.
                  </p>
                </div>

                <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg">
                  <h3 className="text-xl font-bold mb-3">Design Principles</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Language-Agnostic:</strong> Identical representation for equivalent interactions across all languages</li>
                    <li><strong>Semantic Focus:</strong> Captures what code does, not how it's written</li>
                    <li><strong>Metadata-Rich:</strong> Preserves context needed for analysis and fix generation</li>
                    <li><strong>Tree-Structured:</strong> Enables efficient traversal and pattern matching</li>
                    <li><strong>Deterministic:</strong> No ambiguity—same code always produces same ActionLanguage</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Basic Structure</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Every ActionLanguage node is a JavaScript object with an <code className="bg-gray-100 px-2 py-1 rounded">actionType</code> field
                    that determines its structure and meaning.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <pre className="text-sm overflow-x-auto"><code>{`{
  "id": "node-123",                    // Unique identifier
  "actionType": "eventHandler",        // Node type (required)
  "element": {                         // Element reference
    "binding": "button",               // Variable/object name
    "selector": "#submit"              // Optional CSS selector
  },
  "event": "click",                    // Event name
  "handler": {                         // Handler reference
    "id": "handler-456",
    "body": [...]                      // Handler body nodes
  },
  "location": {                        // Source location
    "line": 42,
    "column": 10,
    "file": "app.js"
  },
  "metadata": {                        // Additional context
    "wcag": ["2.1.1"],
    "scope": "global"
  }
}`}</code></pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Node Categories</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-paradise-blue mb-2">Event Handling</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• eventHandler</li>
                        <li>• eventListener</li>
                        <li>• keyHandler</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-paradise-green mb-2">DOM Manipulation</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• domMutation</li>
                        <li>• createElement</li>
                        <li>• setAttribute</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-paradise-orange mb-2">Focus Management</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• focusChange</li>
                        <li>• tabIndexChange</li>
                        <li>• blurHandler</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-paradise-purple mb-2">ARIA & Semantics</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• ariaStateChange</li>
                        <li>• roleAssignment</li>
                        <li>• liveRegion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Node Types */}
            {activeSection === 'node-types' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-6">Node Types Reference</h2>

                {/* Event Handler */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-blue">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-blue">eventHandler</h3>
                  <p className="text-gray-700 mb-4">
                    Represents an event handler attached to a DOM element.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`{
  "actionType": "eventHandler",
  "element": {
    "binding": "button",           // Element variable name
    "type": "HTMLButtonElement"    // Optional type
  },
  "event": "click",                // Event name (click, keydown, etc.)
  "handler": {
    "id": "handler-123",
    "type": "function",
    "params": ["event"],
    "body": [...]                  // Handler body as ActionLanguage nodes
  },
  "keysChecked": ["Enter", " "],   // Keys handled (for keyboard events)
  "location": { "line": 10, "column": 5 }
}`}</code></pre>
                  </div>
                  <div className="bg-paradise-blue/10 p-4 rounded">
                    <p className="text-sm font-semibold mb-2">Example Mappings:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><strong>JavaScript:</strong> <code className="bg-white px-2 py-1 rounded">button.addEventListener('click', fn)</code></li>
                      <li><strong>Objective-C:</strong> <code className="bg-white px-2 py-1 rounded">[button addTarget:self action:@selector(fn) forControlEvents:UIControlEventTouchUpInside]</code></li>
                      <li><strong>Kotlin:</strong> <code className="bg-white px-2 py-1 rounded">button.setOnClickListener {'{ fn() }'}</code></li>
                    </ul>
                  </div>
                </div>

                {/* Focus Change */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-orange">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-orange">focusChange</h3>
                  <p className="text-gray-700 mb-4">
                    Represents programmatic focus changes.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`{
  "actionType": "focusChange",
  "element": {
    "binding": "modal",
    "selector": "#confirmation-modal"
  },
  "method": "focus",               // focus, blur, or focusWithin
  "preventScroll": false,
  "trigger": {                     // What triggered this focus change
    "type": "user-action",         // user-action, programmatic, auto
    "source": "node-456"
  },
  "location": { "line": 25, "column": 3 }
}`}</code></pre>
                  </div>
                </div>

                {/* tabIndexChange */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-orange">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-orange">tabIndexChange</h3>
                  <p className="text-gray-700 mb-4">
                    Represents changes to element tabIndex.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`{
  "actionType": "tabIndexChange",
  "element": {
    "binding": "div",
    "role": "dialog"
  },
  "oldValue": null,                // Previous tabIndex value
  "newValue": -1,                  // New tabIndex value
  "location": { "line": 30, "column": 8 }
}`}</code></pre>
                  </div>
                </div>

                {/* ARIA State Change */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-purple">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-purple">ariaStateChange</h3>
                  <p className="text-gray-700 mb-4">
                    Represents ARIA attribute modifications.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`{
  "actionType": "ariaStateChange",
  "element": {
    "binding": "accordion",
    "role": "button"
  },
  "attribute": "aria-expanded",    // ARIA attribute name
  "oldValue": "false",
  "newValue": "true",
  "isConditional": false,          // Is this in a conditional block?
  "updateCount": 2,                // How many times updated in scope
  "location": { "line": 45, "column": 12 }
}`}</code></pre>
                  </div>
                </div>

                {/* DOM Mutation */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-green">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-green">domMutation</h3>
                  <p className="text-gray-700 mb-4">
                    Represents DOM tree modifications (add, remove, replace).
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`{
  "actionType": "domMutation",
  "operation": "remove",           // add, remove, replace
  "target": {
    "binding": "modal",
    "focusable": true
  },
  "parent": {
    "binding": "container"
  },
  "focusHandling": {               // Focus management during mutation
    "savesFocus": false,
    "restoresFocus": false,
    "movesTo": null
  },
  "location": { "line": 60, "column": 5 }
}`}</code></pre>
                  </div>
                </div>

                {/* Navigation */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-blue">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-blue">navigation</h3>
                  <p className="text-gray-700 mb-4">
                    Represents page navigation or URL changes.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`{
  "actionType": "navigation",
  "method": "push",                // push, replace, back, forward
  "url": "/dashboard",
  "trigger": {
    "type": "user-action",         // user-action, automatic, timed
    "event": "click",
    "element": { "binding": "link" }
  },
  "warning": false,                // Was user warned of navigation?
  "location": { "line": 15, "column": 3 }
}`}</code></pre>
                  </div>
                </div>

                {/* Timing */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-purple">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-purple">timing</h3>
                  <p className="text-gray-700 mb-4">
                    Represents setTimeout, setInterval, and timing operations.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`{
  "actionType": "timing",
  "type": "timeout",               // timeout, interval, animation
  "delay": 5000,                   // Delay in milliseconds
  "callback": {
    "id": "callback-789",
    "body": [...]
  },
  "userControllable": false,       // Can user pause/stop?
  "purpose": "auto-refresh",       // Inferred purpose
  "location": { "line": 70, "column": 8 }
}`}</code></pre>
                  </div>
                </div>

              </div>
            )}

            {/* Core Operations */}
            {activeSection === 'core-operations' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-6">Core CRUD Operations</h2>

                {/* CREATE */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-green">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-green">CREATE (Parse)</h3>
                  <p className="text-gray-700 mb-4">
                    Transform source code into ActionLanguage. This is the only language-specific operation.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`/**
 * Parse source code to ActionLanguage
 * @param sourceCode - Source code string
 * @param language - Programming language
 * @param options - Parser configuration
 * @returns ActionLanguage tree
 */
function CREATE(
  sourceCode: string,
  language: 'javascript' | 'typescript' | 'objc' | 'kotlin',
  options?: ParserOptions
): ActionNode[] {
  // 1. Parse to AST (language-specific)
  const ast = parseToAST(sourceCode, language);

  // 2. Transform AST to ActionLanguage
  const actionTree = transformAST(ast);

  // 3. Enrich with metadata
  enrichWithMetadata(actionTree);

  // 4. Build element bindings
  resolveBindings(actionTree);

  return actionTree;
}

// Example usage
const tree = CREATE(code, 'javascript', {
  jsx: true,
  preserveComments: false
});`}</code></pre>
                  </div>
                </div>

                {/* READ */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-blue">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-blue">READ (Analyze)</h3>
                  <p className="text-gray-700 mb-4">
                    Traverse ActionLanguage to detect accessibility patterns. Universal across all languages.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`/**
 * Analyze ActionLanguage for accessibility issues
 * @param tree - ActionLanguage tree
 * @param analyzers - Array of analyzer instances
 * @returns Detected issues
 */
function READ(
  tree: ActionNode[],
  analyzers: Analyzer[]
): Issue[] {
  const issues: Issue[] = [];

  // Run each analyzer on the tree
  for (const analyzer of analyzers) {
    const detected = analyzer.analyze(tree);
    issues.push(...detected);
  }

  // Sort by severity and location
  return issues.sort(bySeverityAndLocation);
}

// Example usage
const issues = READ(tree, [
  new MouseOnlyClickAnalyzer(),
  new PositiveTabIndexAnalyzer(),
  new StaticAriaStateAnalyzer()
]);`}</code></pre>
                  </div>
                </div>

                {/* UPDATE */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-orange">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-orange">UPDATE (Fix)</h3>
                  <p className="text-gray-700 mb-4">
                    Generate fixes by modifying ActionLanguage. Universal across all languages.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`/**
 * Generate fixes for detected issues
 * @param tree - ActionLanguage tree
 * @param issues - Detected issues
 * @param fixers - Fix generator instances
 * @returns Modified ActionLanguage tree with fixes
 */
function UPDATE(
  tree: ActionNode[],
  issues: Issue[],
  fixers: Fixer[]
): ActionNode[] {
  let modifiedTree = [...tree];

  for (const issue of issues) {
    // Find appropriate fixer
    const fixer = fixers.find(f => f.canFix(issue));
    if (!fixer) continue;

    // Apply fix to tree
    modifiedTree = fixer.fix(modifiedTree, issue);
  }

  return modifiedTree;
}

// Example usage
const fixedTree = UPDATE(tree, issues, [
  new MouseOnlyClickFixer(),
  new PositiveTabIndexFixer()
]);`}</code></pre>
                  </div>
                </div>

                {/* DELETE */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-paradise-purple">
                  <h3 className="text-2xl font-bold mb-3 text-paradise-purple">DELETE (Optimize)</h3>
                  <p className="text-gray-700 mb-4">
                    Remove unused code and optimize before code generation.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`/**
 * Optimize ActionLanguage tree
 * @param tree - ActionLanguage tree
 * @returns Optimized tree
 */
function DELETE(tree: ActionNode[]): ActionNode[] {
  let optimized = [...tree];

  // Remove unused bindings
  optimized = removeUnusedBindings(optimized);

  // Remove unreachable code
  optimized = removeUnreachableCode(optimized);

  // Deduplicate handlers
  optimized = deduplicateHandlers(optimized);

  // Clean up metadata
  optimized = cleanMetadata(optimized);

  return optimized;
}

// Example usage
const optimizedTree = DELETE(fixedTree);`}</code></pre>
                  </div>
                </div>

                {/* Code Generation */}
                <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-3">Code Generation (Language-Specific)</h3>
                  <p className="text-gray-700 mb-4">
                    Transform ActionLanguage back to source code. Language-specific but straightforward.
                  </p>
                  <div className="bg-white rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto"><code>{`/**
 * Generate source code from ActionLanguage
 * @param tree - ActionLanguage tree
 * @param language - Target language
 * @param style - Code style options
 * @returns Source code string
 */
function generate(
  tree: ActionNode[],
  language: string,
  style: StyleOptions
): string {
  const generator = getGenerator(language);
  return generator.generate(tree, style);
}

// Example: JavaScript generation
const fixedCode = generate(optimizedTree, 'javascript', {
  indent: 2,
  quotes: 'single',
  semicolons: true
});`}</code></pre>
                  </div>
                </div>

              </div>
            )}

            {/* Writing Analyzers */}
            {activeSection === 'analyzers' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-6">Writing Custom Analyzers</h2>

                <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg">
                  <p className="text-gray-700">
                    Analyzers traverse ActionLanguage trees to detect accessibility patterns. They are universal—
                    write once, work on all languages.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Analyzer Interface</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto"><code>{`interface Analyzer {
  // Unique analyzer ID
  readonly id: string;

  // Human-readable name
  readonly name: string;

  // WCAG criteria covered
  readonly wcag: string[];

  // Analyze tree and return issues
  analyze(tree: ActionNode[]): Issue[];

  // Optional: Filter which nodes to visit
  filter?(node: ActionNode): boolean;
}

interface Issue {
  type: string;              // Issue type ID
  severity: 'error' | 'warning' | 'info';
  message: string;           // Human-readable message
  wcag: string[];           // WCAG criteria violated
  node: ActionNode;         // Node where issue occurs
  fix?: FixSuggestion;      // Optional fix suggestion
}`}</code></pre>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Complete Example: Mouse-Only Click Analyzer</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`class MouseOnlyClickAnalyzer implements Analyzer {
  readonly id = 'mouse-only-click';
  readonly name = 'Mouse-Only Click Handler';
  readonly wcag = ['2.1.1'];

  analyze(tree: ActionNode[]): Issue[] {
    const issues: Issue[] = [];

    // Find all click handlers
    const clickHandlers = tree.filter(
      node => node.actionType === 'eventHandler' &&
              node.event === 'click'
    );

    // For each click handler, check for keyboard equivalent
    for (const clickHandler of clickHandlers) {
      const element = clickHandler.element;

      // Look for keyboard handler on same element
      const hasKeyboard = tree.some(
        node => node.actionType === 'eventHandler' &&
                node.element.binding === element.binding &&
                (node.event === 'keydown' || node.event === 'keypress')
      );

      if (!hasKeyboard) {
        issues.push({
          type: this.id,
          severity: 'warning',
          wcag: this.wcag,
          message: \`Click handler on '\${element.binding}' without keyboard equivalent\`,
          node: clickHandler,
          fix: {
            type: 'add-keyboard-handler',
            element: element
          }
        });
      }
    }

    return issues;
  }
}`}</code></pre>
                  </div>
                  <p className="text-sm text-gray-600">
                    This analyzer detects click handlers without corresponding keyboard handlers—a common
                    accessibility issue (WCAG 2.1.1: Keyboard Accessible).
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Pattern Detection Strategies</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-paradise-green mb-2">1. Presence Detection</h4>
                      <p className="text-sm text-gray-700 mb-2">Check if specific nodes exist:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <code className="text-xs">tree.filter(n =&gt; n.actionType === 'eventHandler')</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-paradise-blue mb-2">2. Absence Detection</h4>
                      <p className="text-sm text-gray-700 mb-2">Check if required nodes are missing:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <code className="text-xs">!tree.some(n =&gt; n.actionType === 'focusChange')</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-paradise-orange mb-2">3. State Tracking</h4>
                      <p className="text-sm text-gray-700 mb-2">Count updates to track static state:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <code className="text-xs">node.updateCount === 1 // Only set once, never updated</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-paradise-purple mb-2">4. Relationship Detection</h4>
                      <p className="text-sm text-gray-700 mb-2">Check connections between nodes:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <code className="text-xs">node1.element.binding === node2.element.binding</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-paradise-green/10 to-paradise-blue/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3">Best Practices</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Use descriptive analyzer IDs and names</li>
                    <li>✓ Include WCAG criteria in every issue</li>
                    <li>✓ Provide clear, actionable messages</li>
                    <li>✓ Minimize false positives with context awareness</li>
                    <li>✓ Include fix suggestions when possible</li>
                    <li>✓ Test against real-world code samples</li>
                  </ul>
                </div>

              </div>
            )}

            {/* Writing Fixers */}
            {activeSection === 'fixers' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-6">Writing Fix Generators</h2>

                <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-6 rounded-r-lg">
                  <p className="text-gray-700">
                    Fix generators modify ActionLanguage trees to resolve detected issues. Like analyzers,
                    they are universal—work once, fix all languages.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Fixer Interface</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto"><code>{`interface Fixer {
  // Unique fixer ID
  readonly id: string;

  // Issue types this fixer handles
  readonly handles: string[];

  // Check if this fixer can fix the issue
  canFix(issue: Issue): boolean;

  // Generate fix by modifying tree
  fix(tree: ActionNode[], issue: Issue): ActionNode[];
}

interface FixSuggestion {
  type: string;              // Fix type
  description: string;       // Human-readable description
  confidence: 'high' | 'medium' | 'low';
  changes: Change[];         // Proposed changes
}`}</code></pre>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Complete Example: Mouse-Only Click Fixer</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm overflow-x-auto"><code>{`class MouseOnlyClickFixer implements Fixer {
  readonly id = 'mouse-only-click-fixer';
  readonly handles = ['mouse-only-click'];

  canFix(issue: Issue): boolean {
    return issue.type === 'mouse-only-click' &&
           issue.node.actionType === 'eventHandler';
  }

  fix(tree: ActionNode[], issue: Issue): ActionNode[] {
    const clickHandler = issue.node;
    const element = clickHandler.element;

    // Create keyboard handler node
    const keyboardHandler: ActionNode = {
      id: generateId(),
      actionType: 'eventHandler',
      element: element,
      event: 'keydown',
      keysChecked: ['Enter', ' '],
      handler: {
        id: generateId(),
        type: 'function',
        params: ['event'],
        body: [
          {
            actionType: 'conditional',
            condition: {
              operator: 'OR',
              left: { compare: 'event.key', equals: 'Enter' },
              right: { compare: 'event.key', equals: ' ' }
            },
            then: [
              {
                actionType: 'methodCall',
                object: 'event',
                method: 'preventDefault'
              },
              // Copy click handler body
              ...clickHandler.handler.body
            ]
          }
        ]
      },
      location: {
        line: clickHandler.location.line + 1,
        column: clickHandler.location.column
      }
    };

    // Insert keyboard handler after click handler
    const index = tree.indexOf(clickHandler);
    return [
      ...tree.slice(0, index + 1),
      keyboardHandler,
      ...tree.slice(index + 1)
    ];
  }
}`}</code></pre>
                  </div>
                  <p className="text-sm text-gray-600">
                    This fixer adds a keyboard handler that responds to Enter and Space keys,
                    making the element keyboard-accessible.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Fix Generation Patterns</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-paradise-green mb-2">1. Addition (Add Missing Nodes)</h4>
                      <p className="text-sm text-gray-700 mb-2">Insert new nodes into the tree:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <code className="text-xs">tree.splice(index, 0, newNode)</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-paradise-blue mb-2">2. Modification (Update Existing)</h4>
                      <p className="text-sm text-gray-700 mb-2">Change properties of existing nodes:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <code className="text-xs">node.newValue = 0 // Change tabIndex from positive to 0</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-paradise-orange mb-2">3. Removal (Delete Problematic)</h4>
                      <p className="text-sm text-gray-700 mb-2">Remove problematic nodes:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <code className="text-xs">tree.filter(n =&gt; n.id !== problematicNode.id)</code>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-paradise-purple mb-2">4. Wrapping (Add Context)</h4>
                      <p className="text-sm text-gray-700 mb-2">Wrap nodes in conditional or scoped blocks:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <code className="text-xs">{'{ actionType: "conditional", then: [node] }'}</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-paradise-orange/10 to-paradise-purple/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3">Best Practices</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Preserve existing code structure and style</li>
                    <li>✓ Generate minimal, focused fixes</li>
                    <li>✓ Maintain correct source locations</li>
                    <li>✓ Handle edge cases gracefully</li>
                    <li>✓ Test fixes against real codebases</li>
                    <li>✓ Provide confidence levels for ambiguous fixes</li>
                  </ul>
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build With ActionLanguage?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start with the learning modules to understand the concepts, then try building custom analyzers in the playground.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/learn-actionlanguage" className="bg-white text-paradise-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
              Start Learning
            </a>
            <a href="/playground" className="bg-paradise-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors text-lg">
              Try Playground
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
