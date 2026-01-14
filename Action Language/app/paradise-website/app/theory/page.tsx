export default function Theory() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Theory: Why ActionLanguage?
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            Understanding the theoretical foundation: CRUD operations on intermediate representations
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r-lg mb-12">
            <h2 className="text-2xl font-bold text-yellow-800 mb-3">The Question Everyone Asks</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              "There must be AI or machine learning doing the grunt work of understanding code
              and detecting accessibility issues, right?"
            </p>
            <p className="text-xl text-gray-700 mt-4 font-bold">
              No. There isn't.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6">The Confusion</h2>
            <p className="text-gray-700 leading-relaxed">
              People assume AI because accessibility seems "hard" and subjective. How can software
              understand whether code is accessible without being trained on millions of examples?
            </p>

            <p className="text-gray-700 leading-relaxed">
              The confusion stems from not understanding the elegant simplicity of the
              <strong> intermediate representation pattern</strong>.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">The Key Insight</h2>

            <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-8 rounded-r-lg my-8">
              <p className="text-2xl font-semibold text-paradise-blue mb-4">
                Accessibility issues are patterns in code structure, not semantic meaning.
              </p>
              <p className="text-gray-700 text-lg">
                You don't need AI to detect structural patterns. You just need to represent
                the structure in a way that makes pattern matching trivial.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">What AI/ML Would Need</h2>

            <div className="bg-red-50 rounded-lg p-6 mb-8 border border-red-200">
              <ul className="space-y-3 text-gray-700">
                <li>📊 <strong>Training data:</strong> Millions of labeled examples of accessible and inaccessible code</li>
                <li>🔄 <strong>Continuous retraining:</strong> Every time WCAG updates or new patterns emerge</li>
                <li>❓ <strong>Probabilistic outputs:</strong> False positives and false negatives</li>
                <li>🎲 <strong>Black box reasoning:</strong> Can't explain why something was flagged</li>
                <li>💰 <strong>High computational cost:</strong> GPU clusters for inference</li>
                <li>⏱️ <strong>Latency:</strong> Seconds per analysis instead of milliseconds</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">What Paradise Actually Needs</h2>

            <div className="bg-paradise-green/10 rounded-lg p-6 mb-8 border border-paradise-green">
              <ul className="space-y-3 text-gray-700">
                <li>✅ <strong>Well-defined schema:</strong> ActionLanguage specification (written once)</li>
                <li>✅ <strong>Pattern definitions:</strong> Deterministic rules based on WCAG (written once)</li>
                <li>✅ <strong>Tree traversal:</strong> Standard algorithms (DFS, BFS)</li>
                <li>✅ <strong>Metadata tracking:</strong> Element references, scope, relationships</li>
                <li>✅ <strong>Minimal computation:</strong> Runs on any laptop in milliseconds</li>
                <li>✅ <strong>Zero latency:</strong> Real-time analysis as you type</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Example: Detecting Mouse-Only Clicks</h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Let's see how Paradise detects a mouse-only click handler without any AI:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
              <p className="font-semibold mb-3">Step 1: Source Code (JavaScript)</p>
              <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const button = document.getElementById('submit');
button.addEventListener('click', handleSubmit);`}</code></pre>
            </div>

            <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green mb-6">
              <p className="font-semibold mb-3">Step 2: ActionLanguage (CREATE)</p>
              <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
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
    handler: { id: "handler-123" }
  }
]`}</code></pre>
            </div>

            <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue mb-6">
              <p className="font-semibold mb-3">Step 3: Pattern Detection (READ)</p>
              <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Find all click handlers
const clickHandlers = tree.filter(
  node => node.actionType === 'eventHandler' &&
          node.event === 'click'
);

// For each click handler, look for keyboard equivalent
for (const click of clickHandlers) {
  const hasKeyboard = tree.find(
    node => node.actionType === 'eventHandler' &&
            node.element === click.element &&
            (node.event === 'keydown' || node.event === 'keypress')
  );

  if (!hasKeyboard) {
    // ISSUE DETECTED!
    issues.push({
      type: 'mouse-only-click',
      severity: 'warning',
      wcag: ['2.1.1'],
      element: click.element
    });
  }
}`}</code></pre>
            </div>

            <p className="text-gray-700 leading-relaxed">
              No AI. No machine learning. Just:
            </p>
            <ol className="text-gray-700 space-y-2">
              <li><strong>1.</strong> Parse JavaScript into ActionLanguage (CREATE)</li>
              <li><strong>2.</strong> Traverse the tree looking for click events (READ)</li>
              <li><strong>3.</strong> Check if a keyboard handler exists for the same element (READ)</li>
              <li><strong>4.</strong> If not, flag as an issue</li>
            </ol>

            <h2 className="text-3xl font-bold mt-12 mb-6">Why CRUD Operations?</h2>

            <div className="space-y-6 my-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                <h3 className="text-xl font-semibold mb-2 text-paradise-green">CREATE (Parse)</h3>
                <p className="text-gray-700">
                  Transform source code (any language) into ActionLanguage. This is the only
                  language-specific step—write a parser once per language.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
                <h3 className="text-xl font-semibold mb-2 text-paradise-blue">READ (Analyze)</h3>
                <p className="text-gray-700">
                  Traverse the ActionLanguage tree to detect patterns. These analyzers are
                  universal—they work for every language because they operate on ActionLanguage.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
                <h3 className="text-xl font-semibold mb-2 text-paradise-orange">UPDATE (Fix)</h3>
                <p className="text-gray-700">
                  Generate fixes by modifying the ActionLanguage tree. These fix generators
                  are also universal—they work on ActionLanguage, not source code.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-purple">
                <h3 className="text-xl font-semibold mb-2 text-paradise-purple">DELETE (Optimize)</h3>
                <p className="text-gray-700">
                  Remove unnecessary code, unused bindings, unreachable paths. All operations
                  on ActionLanguage before transforming back to source.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">The Adaptivity Advantage</h2>

            <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-8 my-8 border border-paradise-blue/20">
              <p className="text-xl font-semibold mb-4">
                Only CREATE (parsing) is language-specific. Everything else is universal.
              </p>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>JavaScript</strong> → ActionLanguage → Analysis → Fixes → JavaScript
                </p>
                <p>
                  <strong>Objective-C</strong> → ActionLanguage → Analysis → Fixes → Objective-C
                </p>
                <p>
                  <strong>Kotlin</strong> → ActionLanguage → Analysis → Fixes → Kotlin
                </p>
                <p>
                  <strong>Any Future Language</strong> → ActionLanguage → Analysis → Fixes → Any Future Language
                </p>
              </div>

              <p className="text-lg font-semibold mt-6 text-paradise-blue">
                Write analyzers once. Support every UI language forever.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Determinism vs Probability</h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h3 className="text-xl font-semibold mb-3 text-red-800">❌ AI/ML Approach</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>🎲 Probabilistic: "85% confident this is an issue"</li>
                  <li>❓ False positives and false negatives</li>
                  <li>🔮 Can't explain why something was flagged</li>
                  <li>🔄 Needs retraining as code patterns evolve</li>
                  <li>💰 Expensive inference costs</li>
                </ul>
              </div>

              <div className="bg-paradise-green/10 rounded-lg p-6 border border-paradise-green">
                <h3 className="text-xl font-semibold mb-3 text-paradise-green">✅ Paradise Approach</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>🎯 Deterministic: "This IS an issue because..."</li>
                  <li>✓ Zero false positives (by design)</li>
                  <li>📝 Every issue has explicit reasoning</li>
                  <li>🔒 Patterns don't change (based on WCAG)</li>
                  <li>⚡ Instant analysis on any hardware</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">The Historical Precedent</h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              This pattern isn't new. In the 1990s, Control Data built the Mailhub—a system
              that connected multiple proprietary mail systems by mapping them all to X.400:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
              <pre className="text-sm"><code>{`Proprietary Mail Systems ──┐
SMTP                      ─┼──> X.400 ──> Filters ──> Target Systems
X.400                     ─┘            (Paradise LDAP)`}</code></pre>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Paradise does the same thing for UI code:
            </p>

            <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue mb-6">
              <pre className="text-sm"><code>{`JavaScript/TypeScript ──┐
React/Vue             ─┼──> ActionLanguage ──> Analysis ──> Fixed Code
Objective-C/Kotlin    ─┘`}</code></pre>
            </div>

            <p className="text-gray-700 leading-relaxed">
              The Mailhub didn't need AI to understand email. Paradise doesn't need AI to
              understand accessibility. <strong>Both use intermediate representations and
              deterministic transformations.</strong>
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Conclusion</h2>

            <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 my-8">
              <p className="text-2xl font-bold mb-4">
                Paradise proves accessibility detection is about software architecture,
                not artificial intelligence.
              </p>
              <p className="text-lg mb-6">
                CRUD operations on a well-designed intermediate representation can solve problems
                that look like they need AI. The key is understanding that accessibility issues
                are structural patterns, not semantic mysteries.
              </p>
              <div className="flex gap-4">
                <a href="/learn-actionlanguage" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Learn ActionLanguage
                </a>
                <a href="/" className="bg-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors border-2 border-white">
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
