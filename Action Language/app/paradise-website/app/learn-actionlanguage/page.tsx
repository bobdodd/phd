export default function LearnActionLanguage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Learn ActionLanguage
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            The universal intermediate representation that makes accessibility analysis possible across all UI languages
          </p>
          <p className="text-xl text-white/90 max-w-3xl">
            A self-paced journey through the core concepts, CRUD operations, and practical applications
          </p>
        </div>
      </section>

      {/* Learning Path Overview */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Your Learning Path</h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Module 1 */}
          <a href="#module-1" className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-paradise-blue hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-paradise-blue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-paradise-blue">What is ActionLanguage?</h3>
                <p className="text-gray-700 mb-2">
                  Start here. Learn what ActionLanguage is, why it exists, and how it enables universal accessibility analysis.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> 15-20 minutes • <strong>Level:</strong> Beginner
                </p>
              </div>
            </div>
          </a>

          {/* Module 2 */}
          <div className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-gray-300 opacity-75">
            <div className="flex items-start gap-4">
              <div className="bg-gray-300 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-600">ActionLanguage Schema Reference</h3>
                <p className="text-gray-600 mb-2">
                  Deep dive into the structure: node types, properties, relationships, and how they represent UI interactions.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Time:</strong> 30-40 minutes • <strong>Level:</strong> Intermediate • <em>Coming soon</em>
                </p>
              </div>
            </div>
          </div>

          {/* Module 3 */}
          <div className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-gray-300 opacity-75">
            <div className="flex items-start gap-4">
              <div className="bg-gray-300 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-600">CRUD Operations on ActionLanguage ⭐</h3>
                <p className="text-gray-600 mb-2">
                  <strong>THE KEY SECTION:</strong> Learn how CREATE, READ, UPDATE, and DELETE operations enable universal adaptivity.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Time:</strong> 45-60 minutes • <strong>Level:</strong> Intermediate • <em>Coming soon</em>
                </p>
              </div>
            </div>
          </div>

          {/* Module 4 */}
          <div className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-gray-300 opacity-75">
            <div className="flex items-start gap-4">
              <div className="bg-gray-300 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-600">Adaptivity Across Languages</h3>
                <p className="text-gray-600 mb-2">
                  See how CRUD operations on ActionLanguage enable one set of analyzers to work for JavaScript, Objective-C, Kotlin, and beyond.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Time:</strong> 30-40 minutes • <strong>Level:</strong> Advanced • <em>Coming soon</em>
                </p>
              </div>
            </div>
          </div>

          {/* Module 5 */}
          <div className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-gray-300 opacity-75">
            <div className="flex items-start gap-4">
              <div className="bg-gray-300 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-600">Writing Custom Analyzers</h3>
                <p className="text-gray-600 mb-2">
                  Build your own accessibility analyzers that operate on ActionLanguage. Detect custom patterns and generate fixes.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Time:</strong> 60+ minutes • <strong>Level:</strong> Advanced • <em>Coming soon</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: What is ActionLanguage? */}
      <section id="module-1" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-paradise-blue text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl">
                1
              </div>
              <div>
                <h2 className="text-4xl font-bold text-paradise-blue">What is ActionLanguage?</h2>
                <p className="text-gray-600">Your first step into understanding Paradise</p>
              </div>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg mb-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">Learning Objective</p>
                <p className="text-gray-700 mb-0">
                  By the end of this module, you'll understand what ActionLanguage is, why it exists,
                  and how it solves the fundamental challenge of universal accessibility analysis.
                </p>
              </div>

              <h3 className="text-3xl font-bold mt-12 mb-4">The Problem: Many Languages, One Goal</h3>
              <p className="text-gray-700 leading-relaxed">
                Imagine you're building an accessibility analyzer. You want to detect issues like:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>Click handlers without keyboard equivalents</li>
                <li>Focus traps without escape mechanisms</li>
                <li>ARIA states that never get updated</li>
                <li>Form submissions triggered unexpectedly</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mt-6">
                Here's the challenge: these patterns appear in <strong>every UI language</strong>:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg mb-3 text-gray-900">JavaScript</h4>
                  <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`button.addEventListener('click',
  handleClick
);`}</code></pre>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg mb-3 text-gray-900">React JSX</h4>
                  <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`<button onClick={handleClick}>
  Submit
</button>`}</code></pre>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg mb-3 text-gray-900">Objective-C</h4>
                  <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[button addTarget:self
  action:@selector(handleClick:)
  forControlEvents:
    UIControlEventTouchUpInside];`}</code></pre>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg mb-3 text-gray-900">Kotlin</h4>
                  <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`button.setOnClickListener {
  handleClick()
}`}</code></pre>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Each language has different syntax, different APIs, different ways of expressing the same concept.
                Do we need to write separate accessibility analyzers for each one?
                That would mean maintaining <strong>dozens of separate codebases</strong>, each with its own bugs,
                each requiring updates when WCAG guidelines change.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-yellow-800 mb-2">The Traditional Approach (Bad)</p>
                <p className="text-gray-700 mb-0">
                  Write separate analyzers for JavaScript, TypeScript, React, Vue, Objective-C, Swift, Kotlin,
                  Java... Each one parsing different syntax, looking for patterns in different ways. When WCAG
                  updates, update all analyzers. When adding a new detection, add it to all analyzers.
                </p>
              </div>

              <h3 className="text-3xl font-bold mt-12 mb-4">The Solution: Intermediate Representation</h3>

              <p className="text-gray-700 leading-relaxed">
                This is where <strong className="text-paradise-blue">ActionLanguage</strong> comes in.
                ActionLanguage is an <strong>intermediate representation</strong> (IR) that captures the
                <em>semantic intent</em> of UI interactions, independent of the source language syntax.
              </p>

              <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-green mb-2">The Paradise Approach (Good)</p>
                <p className="text-gray-700 mb-4">
                  Parse each language into ActionLanguage. Write analyzers once that work on ActionLanguage.
                  Generate fixes back to the original language. When WCAG updates, update one set of analyzers.
                  When adding a detection, add it once.
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  Any Language → ActionLanguage → Universal Analysis → Any Language
                </p>
              </div>

              <h3 className="text-3xl font-bold mt-12 mb-4">What ActionLanguage Captures</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                ActionLanguage is specifically designed to represent <strong>user interactions and accessibility-relevant patterns</strong>.
                It captures:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8 not-prose">
                <div className="bg-paradise-blue/5 rounded-lg p-5 border border-paradise-blue/20">
                  <div className="text-3xl mb-2">🖱️</div>
                  <h4 className="font-semibold text-lg mb-2">Event Handlers</h4>
                  <p className="text-sm text-gray-600">Click, keyboard, touch, focus, blur events and their relationships</p>
                </div>

                <div className="bg-paradise-blue/5 rounded-lg p-5 border border-paradise-blue/20">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold text-lg mb-2">Focus Management</h4>
                  <p className="text-sm text-gray-600">Focus() calls, tabIndex changes, focus traps, focus restoration</p>
                </div>

                <div className="bg-paradise-blue/5 rounded-lg p-5 border border-paradise-blue/20">
                  <div className="text-3xl mb-2">♿</div>
                  <h4 className="font-semibold text-lg mb-2">ARIA Attributes</h4>
                  <p className="text-sm text-gray-600">aria-* attributes, role assignments, state changes over time</p>
                </div>

                <div className="bg-paradise-blue/5 rounded-lg p-5 border border-paradise-blue/20">
                  <div className="text-3xl mb-2">🧭</div>
                  <h4 className="font-semibold text-lg mb-2">Navigation</h4>
                  <p className="text-sm text-gray-600">Location changes, history manipulation, form submissions</p>
                </div>

                <div className="bg-paradise-blue/5 rounded-lg p-5 border border-paradise-blue/20">
                  <div className="text-3xl mb-2">⏱️</div>
                  <h4 className="font-semibold text-lg mb-2">Timing</h4>
                  <p className="text-sm text-gray-600">setTimeout, setInterval, auto-refresh mechanisms</p>
                </div>

                <div className="bg-paradise-blue/5 rounded-lg p-5 border border-paradise-blue/20">
                  <div className="text-3xl mb-2">🏗️</div>
                  <h4 className="font-semibold text-lg mb-2">DOM Manipulation</h4>
                  <p className="text-sm text-gray-600">Element creation, removal, attribute changes, content updates</p>
                </div>
              </div>

              <h3 className="text-3xl font-bold mt-12 mb-4">A Simple Example</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Let's see how JavaScript gets transformed into ActionLanguage:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold text-gray-700 mb-3">Input (JavaScript):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto mb-0"><code>{`const button = document.getElementById('submit');
button.addEventListener('click', function() {
  console.log('Submitted!');
});`}</code></pre>
              </div>

              <div className="text-center py-4 text-2xl text-paradise-green">
                ↓ PARSE (CREATE) ↓
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold text-gray-700 mb-3">Output (ActionLanguage - simplified):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto mb-0"><code>{`[
  {
    actionType: "querySelector",
    method: "getElementById",
    selector: "submit",
    binding: "button"
  },
  {
    actionType: "eventHandler",
    element: { binding: "button" },
    event: "click",
    handler: {
      actionType: "functionExpression",
      body: [
        {
          actionType: "call",
          method: "log",
          object: "console",
          arguments: ["Submitted!"]
        }
      ]
    }
  }
]`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                Notice what happened:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>The <code className="bg-gray-100 px-2 py-1 rounded">getElementById</code> call became a <code className="bg-paradise-green/20 px-2 py-1 rounded">querySelector</code> action</li>
                <li>The <code className="bg-gray-100 px-2 py-1 rounded">addEventListener</code> became an <code className="bg-paradise-green/20 px-2 py-1 rounded">eventHandler</code> action</li>
                <li>The relationship between the button and its click handler is preserved</li>
                <li>All the syntax-specific details (dots, parentheses, semicolons) are gone</li>
              </ul>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">Key Insight</p>
                <p className="text-gray-700 mb-0">
                  ActionLanguage captures <strong>what the code does</strong>, not <strong>how it's written</strong>.
                  This means the React JSX version, the Objective-C version, and the Kotlin version of this
                  same interaction would all produce <em>the same ActionLanguage representation</em>.
                </p>
              </div>

              <h3 className="text-3xl font-bold mt-12 mb-4">How Analyzers Use ActionLanguage</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Once we have ActionLanguage, accessibility analyzers can look for patterns:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold text-gray-700 mb-3">Analyzer Logic (Pseudocode):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto mb-0"><code>{`// Find all click event handlers
const clickHandlers = actionTree.filter(
  action => action.actionType === 'eventHandler' &&
            action.event === 'click'
);

// For each click handler, check if there's a keyboard handler
for (const clickHandler of clickHandlers) {
  const element = clickHandler.element;

  const hasKeyboard = actionTree.find(
    action => action.actionType === 'eventHandler' &&
              action.element === element &&
              (action.event === 'keydown' || action.event === 'keypress')
  );

  if (!hasKeyboard) {
    // Issue detected!
    issues.push({
      type: 'mouse-only-click',
      severity: 'warning',
      wcag: ['2.1.1'],
      element: element
    });
  }
}`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed">
                This analyzer works on ActionLanguage, so it automatically works for JavaScript, TypeScript,
                React, Vue, and in the future, Objective-C, Kotlin, Swift, and any other language we add parsers for.
              </p>

              <h3 className="text-3xl font-bold mt-12 mb-4">The Complete Pipeline</h3>

              <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-8 my-8 border border-paradise-blue/20">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-paradise-green text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <h4 className="font-bold text-lg">CREATE (Parse)</h4>
                    </div>
                    <p className="text-gray-700 ml-11">Source code → ActionLanguage tree</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-paradise-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <h4 className="font-bold text-lg">READ (Analyze)</h4>
                    </div>
                    <p className="text-gray-700 ml-11">9 specialized analyzers detect 35+ accessibility patterns</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-paradise-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <h4 className="font-bold text-lg">UPDATE (Fix Generation)</h4>
                    </div>
                    <p className="text-gray-700 ml-11">Generate context-aware fixes based on detected issues</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-paradise-purple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        4
                      </div>
                      <h4 className="font-bold text-lg">Code Generation</h4>
                    </div>
                    <p className="text-gray-700 ml-11">Transform fixes back to the original language syntax</p>
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-bold mt-12 mb-4">Why This Matters</h3>

              <div className="grid md:grid-cols-3 gap-6 my-8 not-prose">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-semibold text-lg mb-2">Write Once</h4>
                  <p className="text-sm text-gray-600">
                    Analyzers written once work for every language. Add Kotlin support?
                    All 35+ detections work immediately.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">🔬</div>
                  <h4 className="font-semibold text-lg mb-2">Deterministic</h4>
                  <p className="text-sm text-gray-600">
                    No AI, no ML, no training data. Just pattern matching on a well-defined structure.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">🌍</div>
                  <h4 className="font-semibold text-lg mb-2">Universal</h4>
                  <p className="text-sm text-gray-600">
                    One intermediate representation enables accessibility analysis for web, mobile, desktop—everywhere.
                  </p>
                </div>
              </div>

              <h3 className="text-3xl font-bold mt-12 mb-4">What's Next?</h3>

              <p className="text-gray-700 leading-relaxed">
                Now that you understand <em>what</em> ActionLanguage is and <em>why</em> it exists,
                you're ready to dive deeper:
              </p>

              <ul className="text-gray-700 space-y-2">
                <li><strong>Module 2</strong> will teach you the ActionLanguage schema in detail—every node type, every property</li>
                <li><strong>Module 3</strong> (⭐ THE KEY SECTION) will show you how CRUD operations enable universal adaptivity</li>
                <li><strong>Module 4</strong> will demonstrate how the same analyzers work across JavaScript, Objective-C, and Kotlin</li>
                <li><strong>Module 5</strong> will teach you to write your own custom analyzers</li>
              </ul>
            </div>

            {/* Module Complete Card */}
            <div className="bg-gradient-to-r from-paradise-green to-paradise-blue text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-3">Module 1 Complete! 🎉</h3>
              <p className="text-lg mb-6">
                You now understand what ActionLanguage is and how it enables universal accessibility analysis
                through an intermediate representation pattern.
              </p>
              <div className="flex gap-4">
                <a href="/playground" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Try It in Playground
                </a>
                <a href="/" className="bg-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors">
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
