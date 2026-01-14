export default function Module4() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white text-paradise-purple w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl">
              4
            </div>
            <div>
              <h1 className="text-5xl font-bold">
                Adaptivity Across Languages
              </h1>
              <p className="text-xl text-white/90 mt-2">
                One set of analyzers, infinite languages
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-3xl">
            <p className="text-lg">
              <strong>Time:</strong> 30-40 minutes • <strong>Level:</strong> Advanced
            </p>
            <p className="text-lg mt-2">
              See concrete examples of the same analyzers detecting the same issues in JavaScript,
              Objective-C, and Kotlin—proving that universal adaptivity actually works.
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
              <a href="#the-challenge" className="text-paradise-blue hover:underline">→ The Challenge</a>
              <a href="#javascript" className="text-paradise-blue hover:underline">→ Example 1: JavaScript</a>
              <a href="#objective-c" className="text-paradise-blue hover:underline">→ Example 2: Objective-C</a>
              <a href="#kotlin" className="text-paradise-blue hover:underline">→ Example 3: Kotlin</a>
              <a href="#comparison" className="text-paradise-blue hover:underline">→ Side-by-Side Comparison</a>
              <a href="#more-examples" className="text-paradise-blue hover:underline">→ More Examples</a>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">

            {/* The Challenge */}
            <section id="the-challenge">
              <h2 className="text-3xl font-bold mt-12 mb-6">The Challenge</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Here's the problem Paradise solves: accessibility issues appear in <strong>every UI language</strong>,
                but each language has completely different syntax and APIs.
              </p>

              <div className="bg-red-50 rounded-lg p-6 border border-red-200 my-8">
                <h3 className="text-xl font-bold text-red-800 mb-4">Without ActionLanguage (The Old Way)</h3>
                <p className="text-gray-700 mb-4">
                  To detect mouse-only clicks across three languages, you'd need:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>❌ A JavaScript analyzer that understands <code className="bg-white px-2 py-1 rounded">addEventListener</code></li>
                  <li>❌ An Objective-C analyzer that understands <code className="bg-white px-2 py-1 rounded">addTarget:action:forControlEvents:</code></li>
                  <li>❌ A Kotlin analyzer that understands <code className="bg-white px-2 py-1 rounded">setOnClickListener</code></li>
                  <li>❌ Maintain all three separately when WCAG updates</li>
                  <li>❌ Test all three independently</li>
                  <li>❌ Fix bugs in all three when found</li>
                </ul>
              </div>

              <div className="bg-paradise-green/10 rounded-lg p-6 border border-paradise-green my-8">
                <h3 className="text-xl font-bold text-paradise-green mb-4">With ActionLanguage (The Paradise Way)</h3>
                <p className="text-gray-700 mb-4">
                  To detect mouse-only clicks across all languages:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>✅ Write <strong>one</strong> KeyboardAnalyzer that queries ActionLanguage</li>
                  <li>✅ Write CREATE functions for each language (days of work per language)</li>
                  <li>✅ The analyzer automatically works for all languages</li>
                  <li>✅ WCAG updates? Change the analyzer once</li>
                  <li>✅ Bug found? Fix it once</li>
                  <li>✅ Add a new language? Analyzer works immediately</li>
                </ul>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">This Module's Goal</p>
                <p className="text-gray-700 mb-0">
                  We'll take the exact same accessibility issue—a click handler without keyboard support—and
                  show how Paradise detects it identically in JavaScript, Objective-C, and Kotlin using
                  <strong> one analyzer</strong>.
                </p>
              </div>
            </section>

            {/* JavaScript Example */}
            <section id="javascript">
              <h2 className="text-3xl font-bold mt-12 mb-6">Example 1: JavaScript (Web)</h2>

              <h3 className="text-2xl font-bold mt-8 mb-4">The Inaccessible Code</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">JavaScript - Mouse-only button:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Inaccessible: No keyboard support
const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', function() {
  console.log('Form submitted');
  submitForm();
});`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 1: CREATE (Parse to ActionLanguage)</h3>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage Output:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    id: "js-node-1",
    actionType: "querySelector",
    method: "getElementById",
    selector: "submit",
    binding: "submitButton",
    language: "javascript"
  },
  {
    id: "js-node-2",
    actionType: "eventHandler",
    event: "click",
    element: { binding: "submitButton" },
    handler: {
      actionType: "functionExpression",
      body: [
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
    language: "javascript"
  }
]`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 2: READ (Analyze)</h3>

              <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue my-6">
                <p className="font-semibold mb-3">KeyboardAnalyzer detects issue:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class KeyboardAnalyzer {
  analyze(actionTree) {
    // Find click handler on submitButton
    const clickHandler = actionTree.find(
      node => node.id === "js-node-2"
    );

    // Search for keyboard handler on same element
    const keyboardHandler = actionTree.find(node =>
      node.actionType === "eventHandler" &&
      node.element.binding === "submitButton" &&
      (node.event === "keydown" || node.event === "keypress")
    );

    if (!keyboardHandler) {
      return {
        type: "mouse-only-click",
        severity: "warning",
        wcag: ["2.1.1"],
        node: clickHandler,
        message: "Click handler without keyboard equivalent"
      };
    }
  }
}

// Result: Issue detected! ❌`}</code></pre>
              </div>
            </section>

            {/* Objective-C Example */}
            <section id="objective-c">
              <h2 className="text-3xl font-bold mt-12 mb-6">Example 2: Objective-C (iOS)</h2>

              <h3 className="text-2xl font-bold mt-8 mb-4">The Inaccessible Code</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Objective-C - Mouse (touch) only button:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Inaccessible: No keyboard/VoiceOver activation support
UIButton *submitButton = (UIButton *)[self.view viewWithTag:100];

[submitButton addTarget:self
                 action:@selector(submitForm:)
       forControlEvents:UIControlEventTouchUpInside];

- (void)submitForm:(id)sender {
    NSLog(@"Form submitted");
    [self processFormSubmission];
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 1: CREATE (Parse to ActionLanguage)</h3>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage Output:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    id: "objc-node-1",
    actionType: "querySelector",
    method: "viewWithTag",
    selector: "100",
    binding: "submitButton",
    language: "objective-c"
  },
  {
    id: "objc-node-2",
    actionType: "eventHandler",
    event: "click",  // Normalized from TouchUpInside
    element: { binding: "submitButton" },
    handler: {
      actionType: "functionReference",
      name: "submitForm",
      body: [
        {
          actionType: "call",
          object: "NSLog",
          arguments: ["Form submitted"]
        },
        {
          actionType: "call",
          target: "self",
          method: "processFormSubmission",
          arguments: []
        }
      ]
    },
    language: "objective-c"
  }
]`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed my-6">
                Notice something important: <code className="bg-gray-100 px-2 py-1 rounded">UIControlEventTouchUpInside</code> was
                normalized to <code className="bg-paradise-green/20 px-2 py-1 rounded">event: "click"</code> in ActionLanguage!
                This is CREATE's job—mapping platform-specific events to universal concepts.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 2: READ (Analyze)</h3>

              <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue my-6">
                <p className="font-semibold mb-3">The EXACT SAME KeyboardAnalyzer runs:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class KeyboardAnalyzer {
  analyze(actionTree) {
    // Find click handler on submitButton
    const clickHandler = actionTree.find(
      node => node.id === "objc-node-2"
    );

    // Search for keyboard handler on same element
    const keyboardHandler = actionTree.find(node =>
      node.actionType === "eventHandler" &&
      node.element.binding === "submitButton" &&
      (node.event === "keydown" || node.event === "keypress")
    );

    if (!keyboardHandler) {
      return {
        type: "mouse-only-click",
        severity: "warning",
        wcag: ["2.1.1"],
        node: clickHandler,
        message: "Click handler without keyboard equivalent"
      };
    }
  }
}

// Result: Issue detected! ❌
// SAME CODE, DIFFERENT LANGUAGE!`}</code></pre>
              </div>

              <div className="bg-paradise-purple/10 border-l-4 border-paradise-purple p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-purple mb-2">Key Observation</p>
                <p className="text-gray-700 mb-0">
                  The KeyboardAnalyzer code is <strong>identical</strong> for JavaScript and Objective-C.
                  It doesn't know or care which language the original source code was written in—it
                  only sees ActionLanguage nodes.
                </p>
              </div>
            </section>

            {/* Kotlin Example */}
            <section id="kotlin">
              <h2 className="text-3xl font-bold mt-12 mb-6">Example 3: Kotlin (Android)</h2>

              <h3 className="text-2xl font-bold mt-8 mb-4">The Inaccessible Code</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Kotlin - Touch-only button:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Inaccessible: No keyboard/TalkBack activation support
val submitButton: Button = findViewById(R.id.submit)

submitButton.setOnClickListener {
    Log.d("Form", "Form submitted")
    submitForm()
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 1: CREATE (Parse to ActionLanguage)</h3>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage Output:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    id: "kotlin-node-1",
    actionType: "querySelector",
    method: "findViewById",
    selector: "R.id.submit",
    binding: "submitButton",
    language: "kotlin"
  },
  {
    id: "kotlin-node-2",
    actionType: "eventHandler",
    event: "click",  // Normalized from setOnClickListener
    element: { binding: "submitButton" },
    handler: {
      actionType: "functionExpression",
      body: [
        {
          actionType: "call",
          object: "Log",
          method: "d",
          arguments: ["Form", "Form submitted"]
        },
        {
          actionType: "call",
          name: "submitForm",
          arguments: []
        }
      ]
    },
    language: "kotlin"
  }
]`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed my-6">
                Again: <code className="bg-gray-100 px-2 py-1 rounded">setOnClickListener</code> became
                <code className="bg-paradise-green/20 px-2 py-1 rounded">event: "click"</code>. The CREATE
                function for Kotlin knows how to normalize Android APIs to ActionLanguage.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 2: READ (Analyze)</h3>

              <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue my-6">
                <p className="font-semibold mb-3">The EXACT SAME KeyboardAnalyzer runs again:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class KeyboardAnalyzer {
  analyze(actionTree) {
    // Find click handler on submitButton
    const clickHandler = actionTree.find(
      node => node.id === "kotlin-node-2"
    );

    // Search for keyboard handler on same element
    const keyboardHandler = actionTree.find(node =>
      node.actionType === "eventHandler" &&
      node.element.binding === "submitButton" &&
      (node.event === "keydown" || node.event === "keypress")
    );

    if (!keyboardHandler) {
      return {
        type: "mouse-only-click",
        severity: "warning",
        wcag: ["2.1.1"],
        node: clickHandler,
        message: "Click handler without keyboard equivalent"
      };
    }
  }
}

// Result: Issue detected! ❌
// SAME CODE, THIRD LANGUAGE!`}</code></pre>
              </div>

              <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-green mb-2">Universal Analysis</p>
                <p className="text-gray-700 mb-0">
                  Three completely different languages with completely different APIs, but
                  <strong> one analyzer</strong> detected the same accessibility issue in all three.
                  This is universal adaptivity in action.
                </p>
              </div>
            </section>

            {/* Side-by-Side Comparison */}
            <section id="comparison">
              <h2 className="text-3xl font-bold mt-12 mb-6">Side-by-Side Comparison</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Let's put them side by side to see just how different the source code is, yet how
                identical the ActionLanguage representation becomes:
              </p>

              <div className="overflow-x-auto my-8">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-4 text-left">Aspect</th>
                      <th className="border border-gray-300 p-4 text-left">JavaScript</th>
                      <th className="border border-gray-300 p-4 text-left">Objective-C</th>
                      <th className="border border-gray-300 p-4 text-left">Kotlin</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border border-gray-300 p-4 font-semibold">Platform</td>
                      <td className="border border-gray-300 p-4">Web</td>
                      <td className="border border-gray-300 p-4">iOS</td>
                      <td className="border border-gray-300 p-4">Android</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-4 font-semibold">Query Method</td>
                      <td className="border border-gray-300 p-4"><code>getElementById</code></td>
                      <td className="border border-gray-300 p-4"><code>viewWithTag</code></td>
                      <td className="border border-gray-300 p-4"><code>findViewById</code></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-4 font-semibold">Event API</td>
                      <td className="border border-gray-300 p-4"><code>addEventListener('click')</code></td>
                      <td className="border border-gray-300 p-4"><code>addTarget:action:forControlEvents:</code></td>
                      <td className="border border-gray-300 p-4"><code>setOnClickListener</code></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-4 font-semibold">Event Name</td>
                      <td className="border border-gray-300 p-4">"click"</td>
                      <td className="border border-gray-300 p-4">UIControlEventTouchUpInside</td>
                      <td className="border border-gray-300 p-4">(implicit in listener)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-4 font-semibold">Logging</td>
                      <td className="border border-gray-300 p-4"><code>console.log</code></td>
                      <td className="border border-gray-300 p-4"><code>NSLog</code></td>
                      <td className="border border-gray-300 p-4"><code>Log.d</code></td>
                    </tr>
                    <tr className="bg-paradise-green/10">
                      <td className="border border-gray-300 p-4 font-semibold">ActionLanguage</td>
                      <td className="border border-gray-300 p-4" colSpan={3}>
                        <code>{`{ actionType: "eventHandler", event: "click", ... }`}</code>
                        <div className="text-xs text-paradise-green font-bold mt-1">↑ IDENTICAL FOR ALL THREE</div>
                      </td>
                    </tr>
                    <tr className="bg-paradise-blue/10">
                      <td className="border border-gray-300 p-4 font-semibold">Analyzer</td>
                      <td className="border border-gray-300 p-4" colSpan={3}>
                        <code>KeyboardAnalyzer.analyze(actionTree)</code>
                        <div className="text-xs text-paradise-blue font-bold mt-1">↑ SAME CODE FOR ALL THREE</div>
                      </td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="border border-gray-300 p-4 font-semibold">Result</td>
                      <td className="border border-gray-300 p-4" colSpan={3}>
                        <code>mouse-only-click</code> warning (WCAG 2.1.1)
                        <div className="text-xs text-red-600 font-bold mt-1">↑ SAME ISSUE DETECTED IN ALL THREE</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 my-8">
                <h3 className="text-2xl font-bold mb-4">The Proof</h3>
                <p className="text-lg mb-4">
                  Three completely different APIs became one ActionLanguage representation.
                  One analyzer detected the issue in all three. This is not a theoretical concept—this
                  is exactly how Paradise works in production.
                </p>
                <p className="text-xl font-bold">
                  Universal adaptivity through intermediate representations.
                </p>
              </div>
            </section>

            {/* More Examples */}
            <section id="more-examples">
              <h2 className="text-3xl font-bold mt-12 mb-6">More Examples Across Languages</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The mouse-only click is just one example. Let's see how other detections work universally:
              </p>

              {/* Static ARIA State */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange my-8">
                <h3 className="text-xl font-bold mb-4 text-paradise-orange">Static ARIA State</h3>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-sm mb-2">JavaScript:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`button.setAttribute(
  'aria-expanded',
  'false'
);
// Never updated!`}</code></pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Objective-C:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`button.accessibilityValue =
  @"collapsed";
// Never updated!`}</code></pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Kotlin:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`button.contentDescription =
  "collapsed"
// Never updated!`}</code></pre>
                  </div>
                </div>

                <div className="bg-paradise-orange/10 rounded p-4">
                  <p className="font-semibold text-sm mb-2">ActionLanguage (All Three):</p>
                  <pre className="text-xs bg-white p-3 rounded overflow-x-auto"><code>{`{ actionType: "ariaStateChange", attribute: "aria-expanded",
  oldValue: null, newValue: "false", updateCount: 1 }`}</code></pre>
                  <p className="text-xs text-paradise-orange font-bold mt-2">
                    ↑ ARIAAnalyzer detects: <code>updateCount === 1</code> → static-aria-state issue
                  </p>
                </div>
              </div>

              {/* Focus Trap Without Escape */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-purple my-8">
                <h3 className="text-xl font-bold mb-4 text-paradise-purple">Focus Trap Without Escape</h3>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-sm mb-2">JavaScript:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`modal.addEventListener(
  'keydown',
  (e) => {
    if (e.key === 'Tab') {
      // Trap focus
    }
    // No Escape!
  }
);`}</code></pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Objective-C:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`- (void)keyDown:(NSEvent*)e {
  if (e.keyCode == 48) {
    // Trap focus
  }
  // No Escape!
}`}</code></pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Kotlin:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`modal.setOnKeyListener {
  _, keyCode, _ ->
  if (keyCode == TAB) {
    // Trap focus
  }
  // No Escape!
}`}</code></pre>
                  </div>
                </div>

                <div className="bg-paradise-purple/10 rounded p-4">
                  <p className="font-semibold text-sm mb-2">ActionLanguage (All Three):</p>
                  <pre className="text-xs bg-white p-3 rounded overflow-x-auto"><code>{`{ actionType: "eventHandler", event: "keydown",
  handler: { checks: ["Tab"], hasFocusTrap: true,
  hasEscapeHandler: false } }`}</code></pre>
                  <p className="text-xs text-paradise-purple font-bold mt-2">
                    ↑ KeyboardAnalyzer detects: <code>hasFocusTrap && !hasEscapeHandler</code> → missing-escape-handler
                  </p>
                </div>
              </div>

              {/* Timeout Without Control */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green my-8">
                <h3 className="text-xl font-bold mb-4 text-paradise-green">Timeout Without User Control</h3>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-sm mb-2">JavaScript:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`setTimeout(() => {
  window.location =
    '/timeout';
}, 30000);
// No controls!`}</code></pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Objective-C:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`[NSTimer
  scheduledTimerWith...
  block:^{
    [self timeout];
  }
];
// No controls!`}</code></pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Kotlin:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`Handler().postDelayed({
  finish()
}, 30000)
// No controls!`}</code></pre>
                  </div>
                </div>

                <div className="bg-paradise-green/10 rounded p-4">
                  <p className="font-semibold text-sm mb-2">ActionLanguage (All Three):</p>
                  <pre className="text-xs bg-white p-3 rounded overflow-x-auto"><code>{`{ actionType: "setTimeout", delay: 30000,
  callback: { containsNavigation: true },
  hasUserControl: false }`}</code></pre>
                  <p className="text-xs text-paradise-green font-bold mt-2">
                    ↑ TimingAnalyzer detects: <code>!hasUserControl && containsNavigation</code> → timeout-without-control
                  </p>
                </div>
              </div>

              {/* Unexpected Navigation */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue my-8">
                <h3 className="text-xl font-bold mb-4 text-paradise-blue">Unexpected Navigation on Focus</h3>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-sm mb-2">JavaScript:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`input.addEventListener(
  'focus',
  () => {
    window.location =
      '/page';
  }
);`}</code></pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Objective-C:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`- (void)textFieldDid
  BeginEditing:(UITextField*)f {
  [self navigateToPage];
}`}</code></pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-2">Kotlin:</p>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`input.setOnFocusChange
  Listener { _, hasFocus ->
  if (hasFocus) {
    navigate()
  }
}`}</code></pre>
                  </div>
                </div>

                <div className="bg-paradise-blue/10 rounded p-4">
                  <p className="font-semibold text-sm mb-2">ActionLanguage (All Three):</p>
                  <pre className="text-xs bg-white p-3 rounded overflow-x-auto"><code>{`{ actionType: "eventHandler", event: "focus",
  handler: { containsNavigation: true,
  triggeredBy: "automatic" } }`}</code></pre>
                  <p className="text-xs text-paradise-blue font-bold mt-2">
                    ↑ ContextChangeAnalyzer detects: <code>event === "focus" && containsNavigation</code> → unexpected-navigation
                  </p>
                </div>
              </div>
            </section>

            {/* The Pattern */}
            <section id="pattern">
              <h2 className="text-3xl font-bold mt-12 mb-6">The Pattern Emerges</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                In every example, the pattern is the same:
              </p>

              <div className="bg-gradient-to-r from-paradise-green/10 via-paradise-blue/10 to-paradise-orange/10 rounded-lg p-8 my-8 border border-paradise-blue/20">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-paradise-green text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Different Syntax</h4>
                      <p className="text-gray-700 text-sm">
                        JavaScript, Objective-C, and Kotlin have completely different APIs and syntax
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-paradise-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Same ActionLanguage</h4>
                      <p className="text-gray-700 text-sm">
                        CREATE normalizes platform-specific APIs to universal concepts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-paradise-orange text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Same Analyzer</h4>
                      <p className="text-gray-700 text-sm">
                        One analyzer queries ActionLanguage and detects the issue universally
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-paradise-purple text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Same Issue Found</h4>
                      <p className="text-gray-700 text-sm">
                        All three languages get the same accessibility feedback
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-orange mb-2">Scale This Out</p>
                <p className="text-gray-700 mb-4">
                  Now imagine:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• 35+ accessibility issues (not just 1)</li>
                  <li>• 9 specialized analyzers (not just 1)</li>
                  <li>• 19+ WCAG 2.1 success criteria</li>
                  <li>• 10+ UI languages and frameworks</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Without ActionLanguage: <strong>35 × 10 = 350</strong> separate analyzers to write and maintain.
                </p>
                <p className="text-gray-700">
                  With ActionLanguage: <strong>35 universal analyzers + 10 CREATE functions</strong> = Done.
                </p>
              </div>
            </section>

            {/* Future Languages */}
            <section id="future">
              <h2 className="text-3xl font-bold mt-12 mb-6">Adding Future Languages</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The beauty of this architecture is that adding support for a new language is straightforward:
              </p>

              <div className="space-y-6 my-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-green">Step 1: Write CREATE Function</h4>
                  <p className="text-gray-700 mb-3">
                    Parse Swift/Flutter/React Native code and transform it to ActionLanguage. Map platform
                    APIs to universal concepts.
                  </p>
                  <p className="text-sm text-gray-600">
                    Time investment: Days to weeks depending on language complexity
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-blue">Step 2: Test with Existing Analyzers</h4>
                  <p className="text-gray-700 mb-3">
                    All 9 analyzers detecting 35+ issues immediately work. Run Paradise on Swift code—issues
                    are detected automatically.
                  </p>
                  <p className="text-sm text-gray-600">
                    Time investment: Hours to verify correct ActionLanguage generation
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-orange">Step 3: Write GENERATE Function</h4>
                  <p className="text-gray-700 mb-3">
                    Transform fixed ActionLanguage back to idiomatic Swift/Flutter/React Native. All existing
                    fixes work—just need code generation.
                  </p>
                  <p className="text-sm text-gray-600">
                    Time investment: Days to weeks depending on language complexity
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-purple">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-purple">Step 4: Ship It</h4>
                  <p className="text-gray-700 mb-3">
                    You now have full Paradise support for the new language: detection, fixing, WCAG compliance,
                    VS Code integration—everything.
                  </p>
                  <p className="text-sm text-gray-600">
                    Time investment: Zero—it all works automatically
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 my-8">
                <h3 className="text-2xl font-bold mb-4">Future-Proof Architecture</h3>
                <p className="text-lg mb-4">
                  When SwiftUI 2.0 comes out, or a brand new UI framework emerges, Paradise can support it
                  with minimal work. The analyzers never change—only CREATE and GENERATE need updates.
                </p>
                <p className="text-xl font-bold">
                  This is true universal adaptivity.
                </p>
              </div>
            </section>

            {/* Module Complete */}
            <div className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-3">Module 4 Complete! 🎉</h3>
              <p className="text-lg mb-6">
                You've seen concrete proof that universal adaptivity works. The same analyzers detect
                the same issues in JavaScript, Objective-C, and Kotlin—three completely different
                languages with completely different APIs.
              </p>
              <div className="flex gap-4">
                <a href="/learn-actionlanguage/module-5" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Continue to Module 5
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
