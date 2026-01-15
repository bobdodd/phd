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
            A self-paced journey through the core concepts, multi-model architecture, fragment-aware analysis,
            confidence scoring, CRUD operations, and practical applications
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
                  Start here. Learn what ActionLanguage is, why it exists, how it integrates with the multi-model
                  architecture, and how fragment-aware analysis with confidence scoring enables real-world development workflows.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> 25-30 minutes • <strong>Level:</strong> Beginner
                </p>
              </div>
            </div>
          </a>

          {/* Module 2 */}
          <a href="/learn-actionlanguage/module-2" className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-paradise-green hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-paradise-green text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-paradise-green">ActionLanguage Schema Reference</h3>
                <p className="text-gray-700 mb-2">
                  Deep dive into the structure: node types, properties, relationships, and how they represent UI interactions.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> 30-40 minutes • <strong>Level:</strong> Intermediate
                </p>
              </div>
            </div>
          </a>

          {/* Module 3 */}
          <a href="/learn-actionlanguage/module-3" className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-paradise-orange hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-paradise-orange text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-paradise-orange">CRUD Operations on ActionLanguage ⭐</h3>
                <p className="text-gray-700 mb-2">
                  <strong>THE KEY SECTION:</strong> Learn how CREATE, READ, UPDATE, and DELETE operations enable universal adaptivity.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> 45-60 minutes • <strong>Level:</strong> Intermediate
                </p>
              </div>
            </div>
          </a>

          {/* Module 4 */}
          <a href="/learn-actionlanguage/module-4" className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-paradise-purple hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-paradise-purple text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-paradise-purple">Adaptivity Across Languages</h3>
                <p className="text-gray-700 mb-2">
                  See how CRUD operations on ActionLanguage enable one set of analyzers to work for JavaScript, Objective-C, Kotlin, and beyond.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> 30-40 minutes • <strong>Level:</strong> Advanced
                </p>
              </div>
            </div>
          </a>

          {/* Module 5 */}
          <a href="/learn-actionlanguage/module-5" className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-paradise-blue hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-paradise-blue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-paradise-blue">Writing Custom Analyzers</h3>
                <p className="text-gray-700 mb-2">
                  Build your own accessibility analyzers that operate on ActionLanguage. Detect custom patterns and generate fixes.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> 60+ minutes • <strong>Level:</strong> Advanced
                </p>
              </div>
            </div>
          </a>

          {/* Module 6 */}
          <a href="/learn-actionlanguage/module-6" className="block bg-white rounded-lg p-8 shadow-lg border-l-4 border-paradise-green hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-paradise-green text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                6
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-paradise-green">Building VS Code Extensions</h3>
                <p className="text-gray-700 mb-2">
                  Create VS Code extensions that integrate your custom analyzers with real-time diagnostics and one-click fixes.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> 60+ minutes • <strong>Level:</strong> Advanced
                </p>
              </div>
            </div>
          </a>
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

              {/* Table of Contents - Colored Tiles */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200 shadow-sm my-12 not-prose">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">In This Module</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <a href="#problem" className="group block bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border-2 border-red-200 hover:border-red-400 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-red-900 group-hover:text-red-700 transition-colors">The Problem</h4>
                        <p className="text-sm text-red-700">Many languages, one accessibility goal</p>
                      </div>
                    </div>
                  </a>

                  <a href="#solution" className="group block bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-green-900 group-hover:text-green-700 transition-colors">The Solution</h4>
                        <p className="text-sm text-green-700">Intermediate representation pattern</p>
                      </div>
                    </div>
                  </a>

                  <a href="#multi-model" className="group block bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-blue-900 group-hover:text-blue-700 transition-colors">Multi-Model Architecture</h4>
                        <p className="text-sm text-blue-700">DOM, ActionLanguage, and CSS integration</p>
                      </div>
                    </div>
                  </a>

                  <a href="#fragments" className="group block bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-purple-900 group-hover:text-purple-700 transition-colors">Fragment-Aware Analysis</h4>
                        <p className="text-sm text-purple-700">Real-world incremental development</p>
                      </div>
                    </div>
                  </a>

                  <a href="#example" className="group block bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border-2 border-orange-200 hover:border-orange-400 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-orange-900 group-hover:text-orange-700 transition-colors">Simple Example</h4>
                        <p className="text-sm text-orange-700">JavaScript → ActionLanguage transformation</p>
                      </div>
                    </div>
                  </a>

                  <a href="#analyzers" className="group block bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-5 border-2 border-teal-200 hover:border-teal-400 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        6
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-teal-900 group-hover:text-teal-700 transition-colors">How Analyzers Work</h4>
                        <p className="text-sm text-teal-700">Pattern detection with confidence scoring</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              <h3 id="problem" className="text-3xl font-bold mt-12 mb-4">The Problem: Many Languages, One Goal</h3>
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

              <h3 id="solution" className="text-3xl font-bold mt-12 mb-4">The Solution: Intermediate Representation</h3>

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

              <h3 id="multi-model" className="text-3xl font-bold mt-12 mb-4">ActionLanguage Within the Multi-Model Architecture</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                ActionLanguage doesn't work in isolation. Paradise uses a <strong>multi-model architecture</strong> where
                ActionLanguage integrates with other models to enable comprehensive accessibility analysis:
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-8 not-prose">
                <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-paradise-green">
                  <div className="text-3xl mb-3">🌳</div>
                  <h4 className="font-semibold text-lg mb-2 text-paradise-green">DOMModel</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Represents HTML/JSX structure, elements, and attributes extracted from markup or React components.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Role: Defines what elements exist on the page
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-paradise-blue">
                  <div className="text-3xl mb-3">⚡</div>
                  <h4 className="font-semibold text-lg mb-2 text-paradise-blue">ActionLanguage</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Represents user interactions, event handlers, and behavioral patterns extracted from JavaScript/TypeScript.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Role: Defines how elements behave
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-paradise-purple">
                  <div className="text-3xl mb-3">🎨</div>
                  <h4 className="font-semibold text-lg mb-2 text-paradise-purple">CSSModel</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Represents styling rules that affect accessibility: focus indicators, visibility, contrast, and interaction states.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Role: Defines how elements appear and respond
                  </p>
                </div>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">Integration is Key</p>
                <p className="text-gray-700 mb-0">
                  These models are merged via the <strong>DocumentModel</strong> integration layer. Paradise attaches
                  ActionLanguage handlers to DOMModel elements based on selectors (IDs, classes, tags). This enables
                  cross-file analysis: a click handler in <code className="bg-gray-100 px-2 py-1 rounded">handlers.js</code> can
                  be linked to a button in <code className="bg-gray-100 px-2 py-1 rounded">Button.tsx</code>, eliminating false positives.
                </p>
              </div>

              <h3 id="fragments" className="text-3xl font-bold mt-12 mb-4">Fragment-Aware Analysis: Real-World Development</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Here's a crucial insight about how developers actually work: <strong>you don't start with complete, integrated pages</strong>.
                You start with disconnected component fragments that get integrated later. Paradise's multi-model architecture handles this reality.
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-8 not-prose">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h4 className="font-semibold text-lg">Early Stage</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Many disconnected components being developed in parallel. No parent pages yet.
                  </p>
                  <div className="bg-white rounded p-3 text-xs font-mono text-gray-600 mb-3">
                    Button.tsx<br/>
                    Modal.tsx<br/>
                    Form.tsx<br/>
                    Header.tsx
                  </div>
                  <p className="text-xs text-red-700 font-semibold">
                    Paradise: LOW confidence (0.0-0.5)
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h4 className="font-semibold text-lg">Integration Stage</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Components being composed into pages. Some ARIA references resolve across fragments.
                  </p>
                  <div className="bg-white rounded p-3 text-xs font-mono text-gray-600 mb-3">
                    Dashboard.tsx<br/>
                    ├─ Header.tsx<br/>
                    ├─ Sidebar.tsx<br/>
                    └─ Button.tsx
                  </div>
                  <p className="text-xs text-yellow-700 font-semibold">
                    Paradise: MEDIUM confidence (0.5-0.9)
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h4 className="font-semibold text-lg">Complete Stage</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Fully integrated application. All components connected, all ARIA references resolve.
                  </p>
                  <div className="bg-white rounded p-3 text-xs font-mono text-gray-600 mb-3">
                    App.tsx<br/>
                    └─ Routes<br/>
                      ├─ Dashboard<br/>
                      └─ Settings
                  </div>
                  <p className="text-xs text-green-700 font-semibold">
                    Paradise: HIGH confidence (0.9-1.0)
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6 mb-6">
                Paradise handles all three stages through <strong>fragment-aware analysis</strong>. The DocumentModel
                can contain multiple <code className="bg-gray-100 px-2 py-1 rounded">DOMModel[]</code> fragments
                (not just a single DOM tree). Paradise calculates <strong>tree completeness</strong> based on:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <h4 className="font-semibold text-gray-700 mb-4">Tree Completeness Algorithm</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-paradise-blue text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Fragment Count Factor</p>
                      <p className="text-sm text-gray-600">
                        1 fragment = 0.7 base score • Multiple fragments = lower base (max 0.3 floor)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-paradise-green text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Reference Resolution Factor</p>
                      <p className="text-sm text-gray-600">
                        ARIA references (aria-labelledby, aria-controls) + event handler connections • Resolved refs boost score up to +0.3
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-600">
                    <strong>Final Score</strong> = min(1.0, base + boost) → Maps to HIGH/MEDIUM/LOW confidence
                  </p>
                </div>
              </div>

              <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-green mb-2">Progressive Enhancement</p>
                <p className="text-gray-700 mb-0">
                  As you integrate components, Paradise's confidence improves automatically. Issues reported with
                  LOW confidence during early development become HIGH confidence once components are integrated.
                  This matches your workflow: start with fragments, integrate gradually, get more accurate analysis over time.
                </p>
              </div>

              <h3 id="example" className="text-3xl font-bold mt-12 mb-4">A Simple Example</h3>

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

              <h3 id="analyzers" className="text-3xl font-bold mt-12 mb-4">How Analyzers Use ActionLanguage with Confidence Scoring</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Once we have ActionLanguage integrated with the DocumentModel, analyzers can look for patterns
                while transparently reporting confidence based on tree completeness:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold text-gray-700 mb-3">Analyzer Logic (Pseudocode with Confidence):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto mb-0"><code>{`// For each DOM element, check its attached handlers
for (const element of documentModel.dom.getAllElements()) {
  const context = documentModel.getElementContext(element);

  // Check if element has click handler but no keyboard handler
  if (context.hasClickHandler && !context.hasKeyboardHandler) {

    // Calculate confidence based on tree completeness
    const fragmentCount = documentModel.getFragmentCount();
    const completeness = documentModel.getTreeCompleteness();

    let confidence;
    if (fragmentCount > 1) {
      // Multiple fragments: keyboard handler might be in another fragment
      confidence = {
        level: 'LOW',
        reason: 'Element analyzed, but multiple disconnected fragments exist',
        treeCompleteness: completeness
      };
    } else if (completeness > 0.9) {
      // Single complete tree: definitely missing keyboard handler
      confidence = {
        level: 'HIGH',
        reason: 'Element verified in complete tree',
        treeCompleteness: 1.0
      };
    } else {
      // Single incomplete tree: medium confidence
      confidence = {
        level: 'MEDIUM',
        reason: 'Element verified in partial tree',
        treeCompleteness: completeness
      };
    }

    // Report issue with confidence
    issues.push({
      type: 'mouse-only-click',
      severity: 'warning',
      wcag: ['2.1.1'],
      element: element,
      confidence: confidence  // NEW: Transparent confidence reporting
    });
  }
}`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                This analyzer works on ActionLanguage integrated with DOMModel, so it:
              </p>

              <ul className="text-gray-700 space-y-2 mb-6">
                <li>✅ <strong>Automatically works</strong> for JavaScript, TypeScript, React, Vue, and future languages</li>
                <li>✅ <strong>Eliminates false positives</strong> through cross-file analysis via DocumentModel</li>
                <li>✅ <strong>Reports confidence transparently</strong> based on fragment count and tree completeness</li>
                <li>✅ <strong>Improves progressively</strong> as components integrate (LOW → MEDIUM → HIGH confidence)</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-yellow-800 mb-2">Why Confidence Matters</p>
                <p className="text-gray-700 mb-0">
                  Without confidence scoring, Paradise would report "missing keyboard handler" with the same
                  certainty whether analyzing a single complete page (definitely missing) or 10 disconnected
                  components (might be in another file). Confidence scoring prevents false confidence and
                  matches the reality of incremental development.
                </p>
              </div>

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
                Now that you understand <em>what</em> ActionLanguage is, <em>why</em> it exists, and
                <em>how</em> it integrates with the multi-model architecture, you're ready to dive deeper:
              </p>

              <ul className="text-gray-700 space-y-2">
                <li><strong>Module 2</strong> will teach you the ActionLanguage schema in detail—every node type, every property</li>
                <li><strong>Module 3</strong> (⭐ THE KEY SECTION) will show you how CRUD operations enable universal adaptivity</li>
                <li><strong>Module 4</strong> will demonstrate how the same analyzers work across JavaScript, Objective-C, and Kotlin</li>
                <li><strong>Module 5</strong> will teach you to write your own custom analyzers with multi-model context and confidence scoring</li>
                <li><strong>Architecture Page</strong> has deep-dive sections on the multi-model architecture and fragment-aware analysis</li>
              </ul>
            </div>

            {/* Module Complete Card */}
            <div className="bg-gradient-to-r from-paradise-green to-paradise-blue text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-3">Module 1 Complete! 🎉</h3>
              <p className="text-lg mb-6">
                You now understand what ActionLanguage is, how it enables universal accessibility analysis
                through an intermediate representation pattern, and how it integrates with the multi-model
                architecture (DOMModel, ActionLanguage, CSSModel) to support fragment-aware analysis with
                confidence scoring.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/playground" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Try It in Playground
                </a>
                <a href="/architecture" className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
                  Explore Architecture
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
