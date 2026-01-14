export default function Module2() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-blue to-paradise-green text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white text-paradise-blue w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl">
              2
            </div>
            <div>
              <h1 className="text-5xl font-bold">
                ActionLanguage Schema Reference
              </h1>
              <p className="text-xl text-white/90 mt-2">
                Understanding the structure: nodes, properties, and relationships
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-3xl">
            <p className="text-lg">
              <strong>Time:</strong> 30-40 minutes • <strong>Level:</strong> Intermediate
            </p>
            <p className="text-lg mt-2">
              By the end of this module, you'll understand the complete ActionLanguage schema and
              be able to read and write ActionLanguage representations of UI code.
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
              <a href="#core-structure" className="text-paradise-blue hover:underline">→ Core Structure</a>
              <a href="#event-handlers" className="text-paradise-blue hover:underline">→ Event Handlers</a>
              <a href="#dom-manipulation" className="text-paradise-blue hover:underline">→ DOM Manipulation</a>
              <a href="#focus-management" className="text-paradise-blue hover:underline">→ Focus Management</a>
              <a href="#aria-attributes" className="text-paradise-blue hover:underline">→ ARIA Attributes</a>
              <a href="#navigation" className="text-paradise-blue hover:underline">→ Navigation</a>
              <a href="#timing" className="text-paradise-blue hover:underline">→ Timing Operations</a>
              <a href="#relationships" className="text-paradise-blue hover:underline">→ Relationships</a>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg mb-12">
              <h3 className="text-2xl font-semibold text-paradise-green mb-3 mt-0">What You'll Learn</h3>
              <ul className="text-gray-700 space-y-2 mb-0">
                <li>The basic structure of ActionLanguage nodes</li>
                <li>All actionType values and what they represent</li>
                <li>How properties link nodes together</li>
                <li>Metadata for tracking scope and relationships</li>
                <li>Real examples from JavaScript → ActionLanguage transformations</li>
              </ul>
            </div>

            {/* Core Structure */}
            <section id="core-structure">
              <h2 className="text-3xl font-bold mt-12 mb-6">Core Structure</h2>

              <p className="text-gray-700 leading-relaxed">
                Every ActionLanguage representation is an <strong>array of nodes</strong>. Each node
                represents one semantic action in the UI code. Think of it as a tree where each node
                captures a specific operation.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Basic Node Structure:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: string,        // Required: The type of action
  location: {                // Optional: Source code location
    start: { line, column },
    end: { line, column }
  },
  metadata: {                // Optional: Additional context
    scope: string,
    file: string,
    ...
  },
  // ... other properties specific to the actionType
}`}</code></pre>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">Key Insight</p>
                <p className="text-gray-700 mb-0">
                  The <code className="bg-white px-2 py-1 rounded">actionType</code> property determines
                  what other properties are available. Think of actionType as the "class" of the node,
                  defining its schema.
                </p>
              </div>
            </section>

            {/* Action Types Overview */}
            <section id="action-types">
              <h2 className="text-3xl font-bold mt-12 mb-6">Action Types Overview</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                ActionLanguage has 20+ actionType values, each representing a specific category of UI operation:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8 not-prose">
                <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-paradise-blue">
                  <h4 className="font-bold text-lg mb-3 text-paradise-blue">DOM Operations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>querySelector</code></li>
                    <li>• <code>createElement</code></li>
                    <li>• <code>appendChild</code></li>
                    <li>• <code>removeChild</code></li>
                    <li>• <code>setAttribute</code></li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-bold text-lg mb-3 text-paradise-green">Event Handling</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>eventHandler</code></li>
                    <li>• <code>eventListener</code></li>
                    <li>• <code>removeEventListener</code></li>
                    <li>• <code>preventDefault</code></li>
                    <li>• <code>stopPropagation</code></li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-paradise-orange">
                  <h4 className="font-bold text-lg mb-3 text-paradise-orange">Focus & ARIA</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>focusElement</code></li>
                    <li>• <code>blurElement</code></li>
                    <li>• <code>ariaStateChange</code></li>
                    <li>• <code>ariaLiveUpdate</code></li>
                    <li>• <code>roleAssignment</code></li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-paradise-purple">
                  <h4 className="font-bold text-lg mb-3 text-paradise-purple">Navigation & Timing</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <code>navigationChange</code></li>
                    <li>• <code>formSubmit</code></li>
                    <li>• <code>setTimeout</code></li>
                    <li>• <code>setInterval</code></li>
                    <li>• <code>clearTimeout</code></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Event Handlers - Detailed */}
            <section id="event-handlers">
              <h2 className="text-3xl font-bold mt-12 mb-6">Event Handlers</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The <code className="bg-gray-100 px-2 py-1 rounded">eventHandler</code> actionType is
                one of the most important for accessibility analysis.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">eventHandler Schema:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "eventHandler",
  event: string,              // "click", "keydown", "focus", etc.
  element: {                  // Element reference
    binding?: string,         // Variable name: "button"
    selector?: string,        // CSS selector: "#submit"
    id?: string               // Element ID in the tree
  },
  handler: {                  // Handler function
    actionType: "functionExpression" | "functionReference",
    name?: string,            // Function name if named
    body: ActionNode[],       // Actions inside the handler
    params?: string[]         // Parameter names
  },
  capture?: boolean,          // Capture phase?
  passive?: boolean,          // Passive listener?
  once?: boolean              // Remove after first invocation?
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Click Handler</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">JavaScript:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', function(event) {
  event.preventDefault();
  console.log('Form submitted');
  submitForm();
});`}</code></pre>
              </div>

              <div className="text-center py-4 text-2xl text-paradise-green">
                ↓ TRANSFORMS TO ↓
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    actionType: "querySelector",
    method: "getElementById",
    selector: "submit",
    binding: "submitBtn",
    location: { start: { line: 1, column: 0 }, end: { line: 1, column: 56 } }
  },
  {
    actionType: "eventHandler",
    event: "click",
    element: { binding: "submitBtn" },
    handler: {
      actionType: "functionExpression",
      params: ["event"],
      body: [
        {
          actionType: "preventDefault",
          target: { binding: "event" }
        },
        {
          actionType: "call",
          object: "console",
          method: "log",
          arguments: ["Form submitted"]
        },
        {
          actionType: "call",
          name: "submitForm",
          arguments: []
        }
      ]
    },
    location: { start: { line: 2, column: 0 }, end: { line: 6, column: 3 } }
  }
]`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                Notice how:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>The <code className="bg-gray-100 px-2 py-1 rounded">querySelector</code> creates a binding named "submitBtn"</li>
                <li>The <code className="bg-gray-100 px-2 py-1 rounded">eventHandler</code> references that binding via <code className="bg-gray-100 px-2 py-1 rounded">element.binding</code></li>
                <li>The handler body contains three actions: preventDefault, console.log, and submitForm()</li>
                <li>Location metadata preserves source positions for error reporting</li>
              </ul>
            </section>

            {/* DOM Manipulation */}
            <section id="dom-manipulation">
              <h2 className="text-3xl font-bold mt-12 mb-6">DOM Manipulation</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                DOM manipulation nodes track element creation, modification, and removal—critical for
                detecting focus loss and dynamic content issues.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">createElement</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "createElement",
  tagName: string,           // "div", "button", "span", etc.
  binding?: string,          // Variable name assigned to
  attributes?: {             // Initial attributes
    [key: string]: string | ActionNode
  },
  children?: ActionNode[]    // Child elements
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">appendChild / removeChild</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "appendChild",
  parent: { binding | selector | id },
  child: { binding | selector | id | createElement node }
}

{
  actionType: "removeChild",
  parent: { binding | selector | id },
  child: { binding | selector | id }
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">setAttribute</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "setAttribute",
  element: { binding | selector | id },
  attribute: string,         // Attribute name
  value: string | ActionNode // Attribute value (can be computed)
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Complete Example: Modal Creation</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">JavaScript:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const modal = document.createElement('div');
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
document.body.appendChild(modal);`}</code></pre>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    actionType: "createElement",
    tagName: "div",
    binding: "modal"
  },
  {
    actionType: "setAttribute",
    element: { binding: "modal" },
    attribute: "role",
    value: "dialog"
  },
  {
    actionType: "setAttribute",
    element: { binding: "modal" },
    attribute: "aria-modal",
    value: "true"
  },
  {
    actionType: "appendChild",
    parent: { selector: "body" },
    child: { binding: "modal" }
  }
]`}</code></pre>
              </div>
            </section>

            {/* Focus Management */}
            <section id="focus-management">
              <h2 className="text-3xl font-bold mt-12 mb-6">Focus Management</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Focus operations are critical for keyboard accessibility and screen reader support.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "focusElement",
  element: { binding | selector | id },
  options?: {
    preventScroll?: boolean,
    focusVisible?: boolean
  }
}

{
  actionType: "blurElement",
  element: { binding | selector | id }
}

{
  actionType: "tabIndexChange",
  element: { binding | selector | id },
  oldValue: number | null,
  newValue: number | null
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Focus Trap</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">JavaScript:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const firstFocusable = modal.querySelector('button');
const lastFocusable = modal.querySelector('button:last-child');

modal.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
});`}</code></pre>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage (simplified):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    actionType: "querySelector",
    context: { binding: "modal" },
    selector: "button",
    binding: "firstFocusable"
  },
  {
    actionType: "querySelector",
    context: { binding: "modal" },
    selector: "button:last-child",
    binding: "lastFocusable"
  },
  {
    actionType: "eventHandler",
    event: "keydown",
    element: { binding: "modal" },
    handler: {
      actionType: "functionExpression",
      params: ["event"],
      body: [
        {
          actionType: "conditional",
          condition: {
            actionType: "binaryExpression",
            operator: "===",
            left: { property: "key", object: "event" },
            right: "Tab"
          },
          consequent: [
            // Focus trap logic with focusElement calls
            {
              actionType: "focusElement",
              element: { binding: "lastFocusable" }
            }
          ]
        }
      ]
    }
  }
]`}</code></pre>
              </div>
            </section>

            {/* ARIA Attributes */}
            <section id="aria-attributes">
              <h2 className="text-3xl font-bold mt-12 mb-6">ARIA Attributes</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                ARIA nodes track state changes over time—essential for detecting static ARIA states
                that never get updated.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "ariaStateChange",
  element: { binding | selector | id },
  attribute: string,         // "aria-expanded", "aria-selected", etc.
  oldValue: string | null,
  newValue: string,
  timestamp: number          // When the change occurred
}

{
  actionType: "ariaLiveUpdate",
  element: { binding | selector | id },
  region: { binding | selector | id },  // Live region container
  content: string | ActionNode,
  politeness: "polite" | "assertive"
}

{
  actionType: "roleAssignment",
  element: { binding | selector | id },
  role: string,              // "button", "dialog", "menu", etc.
  implicit: boolean          // True if role is from tagName
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Accordion</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">JavaScript:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`button.addEventListener('click', function() {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !expanded);
  panel.hidden = expanded;
});`}</code></pre>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    actionType: "eventHandler",
    event: "click",
    element: { binding: "button" },
    handler: {
      actionType: "functionExpression",
      body: [
        {
          actionType: "ariaStateChange",
          element: { binding: "button" },
          attribute: "aria-expanded",
          oldValue: { computed: true },  // Read from current state
          newValue: { computed: true }   // Negation of old value
        },
        {
          actionType: "setAttribute",
          element: { binding: "panel" },
          attribute: "hidden",
          value: { computed: true }
        }
      ]
    }
  }
]`}</code></pre>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">Why This Matters</p>
                <p className="text-gray-700 mb-0">
                  By tracking <code className="bg-white px-2 py-1 rounded">ariaStateChange</code> nodes,
                  analyzers can detect ARIA attributes that are set once but never updated—a common
                  accessibility anti-pattern.
                </p>
              </div>
            </section>

            {/* Navigation */}
            <section id="navigation">
              <h2 className="text-3xl font-bold mt-12 mb-6">Navigation</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Navigation nodes track context changes—important for WCAG 3.2 (Predictable).
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "navigationChange",
  method: "location.href" | "pushState" | "replaceState" | "back" | "forward",
  url?: string | ActionNode,
  triggeredBy: "user" | "automatic",  // User-initiated or automatic?
  context: string                     // "click", "focus", "input", etc.
}

{
  actionType: "formSubmit",
  form: { binding | selector | id },
  method: "GET" | "POST",
  action?: string,
  triggeredBy: "user" | "automatic"
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Unexpected Navigation</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">JavaScript (Bad - WCAG 3.2.2 violation):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Navigation on focus - unexpected!
input.addEventListener('focus', function() {
  window.location.href = '/new-page';
});`}</code></pre>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    actionType: "eventHandler",
    event: "focus",
    element: { binding: "input" },
    handler: {
      actionType: "functionExpression",
      body: [
        {
          actionType: "navigationChange",
          method: "location.href",
          url: "/new-page",
          triggeredBy: "automatic",  // Not user-initiated!
          context: "focus"            // In a focus handler!
        }
      ]
    }
  }
]`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                The analyzer can easily detect: <code className="bg-gray-100 px-2 py-1 rounded">triggeredBy === "automatic"</code> AND{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">context === "focus"</code> = WCAG 3.2.2 violation!
              </p>
            </section>

            {/* Timing */}
            <section id="timing">
              <h2 className="text-3xl font-bold mt-12 mb-6">Timing Operations</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Timing nodes track setTimeout, setInterval, and related operations—critical for
                WCAG 2.2 (Enough Time).
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  actionType: "setTimeout",
  callback: {
    actionType: "functionExpression" | "functionReference",
    body: ActionNode[]
  },
  delay: number | ActionNode,
  binding?: string,          // Variable storing timeout ID
  hasUserControl: boolean    // Can user cancel/extend?
}

{
  actionType: "setInterval",
  callback: { ... },
  interval: number | ActionNode,
  binding?: string,
  hasUserControl: boolean
}

{
  actionType: "clearTimeout" | "clearInterval",
  id: { binding | literal }
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Timeout Without Control</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">JavaScript (Bad - WCAG 2.2.1 violation):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Timeout with no way for user to extend
setTimeout(function() {
  window.location.href = '/timeout';
}, 30000);  // 30 seconds`}</code></pre>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    actionType: "setTimeout",
    callback: {
      actionType: "functionExpression",
      body: [
        {
          actionType: "navigationChange",
          method: "location.href",
          url: "/timeout",
          triggeredBy: "automatic"
        }
      ]
    },
    delay: 30000,
    hasUserControl: false      // No controls detected!
  }
]`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                The analyzer checks: <code className="bg-gray-100 px-2 py-1 rounded">hasUserControl === false</code> AND{' '}
                callback contains navigation/destructive action = Issue detected!
              </p>
            </section>

            {/* Relationships */}
            <section id="relationships">
              <h2 className="text-3xl font-bold mt-12 mb-6">Element References & Relationships</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                ActionLanguage uses three ways to reference elements across nodes:
              </p>

              <div className="space-y-6 my-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
                  <h4 className="font-semibold text-lg mb-2">1. Binding (Variable Name)</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded mt-2 overflow-x-auto"><code>{`{ element: { binding: "submitButton" } }`}</code></pre>
                  <p className="text-sm text-gray-600 mt-2">
                    References an element by its JavaScript variable name. Most common and explicit.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-semibold text-lg mb-2">2. Selector (CSS Selector)</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded mt-2 overflow-x-auto"><code>{`{ element: { selector: "#submit-btn" } }`}</code></pre>
                  <p className="text-sm text-gray-600 mt-2">
                    References an element by CSS selector. Used when no binding exists.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
                  <h4 className="font-semibold text-lg mb-2">3. ID (Tree Node ID)</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded mt-2 overflow-x-auto"><code>{`{ element: { id: "node-42" } }`}</code></pre>
                  <p className="text-sm text-gray-600 mt-2">
                    Internal reference to a node in the ActionLanguage tree itself. Used for tracking relationships.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Complex Relationships</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">JavaScript:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const container = document.getElementById('menu');
const trigger = container.querySelector('button');
trigger.addEventListener('click', function() {
  const menu = document.getElementById('menu-list');
  menu.hidden = !menu.hidden;
  trigger.setAttribute('aria-expanded', !menu.hidden);
});`}</code></pre>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage (showing relationships):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    id: "node-1",
    actionType: "querySelector",
    method: "getElementById",
    selector: "menu",
    binding: "container"
  },
  {
    id: "node-2",
    actionType: "querySelector",
    context: { binding: "container" },  // Scoped to container
    selector: "button",
    binding: "trigger",
    metadata: {
      parentNode: "node-1"              // Relationship tracked
    }
  },
  {
    actionType: "eventHandler",
    event: "click",
    element: { binding: "trigger" },
    handler: {
      body: [
        {
          id: "node-3",
          actionType: "querySelector",
          method: "getElementById",
          selector: "menu-list",
          binding: "menu"
        },
        {
          actionType: "setAttribute",
          element: { binding: "menu" },
          attribute: "hidden",
          value: { computed: true }
        },
        {
          actionType: "ariaStateChange",
          element: { binding: "trigger" },
          attribute: "aria-expanded",
          value: { computed: true },
          metadata: {
            controlledElement: "node-3"  // ARIA relationship!
          }
        }
      ]
    }
  }
]`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                Notice how <code className="bg-gray-100 px-2 py-1 rounded">metadata.controlledElement</code> links
                the trigger's aria-expanded to the menu element—this enables sophisticated ARIA validation!
              </p>
            </section>

            {/* Schema Summary */}
            <section id="summary">
              <h2 className="text-3xl font-bold mt-12 mb-6">Schema Summary</h2>

              <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-8 my-8 border border-paradise-blue/20">
                <h3 className="text-2xl font-bold mb-4">Key Takeaways</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-paradise-green text-xl">✓</span>
                    <span><strong>Every node has actionType</strong> which determines its schema</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-paradise-green text-xl">✓</span>
                    <span><strong>Elements are referenced</strong> by binding, selector, or ID</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-paradise-green text-xl">✓</span>
                    <span><strong>Location metadata</strong> links back to source code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-paradise-green text-xl">✓</span>
                    <span><strong>Relationships are explicit</strong> via metadata and references</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-paradise-green text-xl">✓</span>
                    <span><strong>Time-based tracking</strong> enables detecting static ARIA states</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-paradise-green text-xl">✓</span>
                    <span><strong>Context tracking</strong> enables detecting unexpected behavior</span>
                  </li>
                </ul>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">The Power of Structure</p>
                <p className="text-gray-700 mb-0">
                  This structured representation is why Paradise doesn't need AI. Accessibility patterns
                  like "click handler without keyboard handler" or "ARIA state never updated" are
                  <strong> structural properties</strong> that can be detected with simple tree traversal.
                </p>
              </div>
            </section>

            {/* Module Complete */}
            <div className="bg-gradient-to-r from-paradise-blue to-paradise-green text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-3">Module 2 Complete! 🎉</h3>
              <p className="text-lg mb-6">
                You now understand the complete ActionLanguage schema and can read ActionLanguage
                representations. You're ready for Module 3: the CRUD operations that make it all work!
              </p>
              <div className="flex gap-4">
                <a href="/learn-actionlanguage/module-3" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Continue to Module 3 ⭐
                </a>
                <a href="/learn-actionlanguage" className="bg-paradise-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors">
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
