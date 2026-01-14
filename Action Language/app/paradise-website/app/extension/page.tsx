export default function Extension() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            VS Code Extension
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            Real-time accessibility analysis powered by ActionLanguage CRUD operations
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r-lg mb-12">
            <h2 className="text-2xl font-bold text-yellow-800 mb-3">🚧 Installation Instructions Coming Soon</h2>
            <p className="text-gray-700 leading-relaxed">
              The Paradise VS Code extension is feature-complete and ready for use. We're currently preparing
              the VS Code Marketplace listing. In the meantime, you can install from source.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-8">What You Get</h2>

          <div className="space-y-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔍</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real-Time Analysis</h3>
                  <p className="text-gray-700">
                    Paradise analyzes your JavaScript, TypeScript, and React code as you type,
                    detecting 35+ accessibility issues across 19+ WCAG 2.1 success criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Inline Diagnostics</h3>
                  <p className="text-gray-700">
                    Issues appear directly in your code with colored underlines. Hover to see detailed
                    explanations with links to WCAG documentation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔧</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tailored Fixes</h3>
                  <p className="text-gray-700">
                    Every issue comes with a context-aware fix. Click "Apply Fix" to automatically
                    update your code with accessible patterns.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-purple">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📚</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Educational Content</h3>
                  <p className="text-gray-700">
                    Learn as you code. Each issue includes explanations of why it matters,
                    which WCAG criteria it affects, and how to prevent it in the future.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8">Detection Capabilities</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue/20">
              <h3 className="font-semibold text-lg mb-3 text-paradise-blue">Keyboard Accessibility</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Mouse-only click handlers</li>
                <li>• Missing keyboard activation keys</li>
                <li>• Focus traps without escape</li>
                <li>• Touch events without click fallback</li>
                <li>• Positive tabindex values</li>
              </ul>
            </div>

            <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green/20">
              <h3 className="font-semibold text-lg mb-3 text-paradise-green">ARIA Usage</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Static ARIA states never updated</li>
                <li>• Invalid ARIA references</li>
                <li>• Missing live regions for dynamic content</li>
                <li>• ARIA widget pattern violations</li>
                <li>• Incorrect role usage</li>
              </ul>
            </div>

            <div className="bg-paradise-orange/5 rounded-lg p-6 border border-paradise-orange/20">
              <h3 className="font-semibold text-lg mb-3 text-paradise-orange">Focus Management</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Lost focus after element removal</li>
                <li>• Standalone blur handlers</li>
                <li>• Focus traps in modals</li>
                <li>• Unfocusable interactive elements</li>
                <li>• Focus without visible indicators</li>
              </ul>
            </div>

            <div className="bg-paradise-purple/5 rounded-lg p-6 border border-paradise-purple/20">
              <h3 className="font-semibold text-lg mb-3 text-paradise-purple">Context Changes</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Unexpected form submissions</li>
                <li>• Navigation on focus/input</li>
                <li>• Timeouts without user control</li>
                <li>• Auto-refresh without pause</li>
                <li>• Non-semantic buttons and links</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8">How It Works</h2>

          <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-8 mb-12 border border-paradise-blue/20">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-paradise-green text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h4 className="font-bold text-lg">CREATE</h4>
                </div>
                <p className="text-gray-700 ml-11">Your JavaScript/TypeScript/React code is parsed into ActionLanguage</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-paradise-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h4 className="font-bold text-lg">READ</h4>
                </div>
                <p className="text-gray-700 ml-11">9 specialized analyzers detect patterns in the ActionLanguage tree</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-paradise-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h4 className="font-bold text-lg">UPDATE</h4>
                </div>
                <p className="text-gray-700 ml-11">Context-aware fixes are generated based on detected issues</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-paradise-purple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h4 className="font-bold text-lg">Present</h4>
                </div>
                <p className="text-gray-700 ml-11">Issues appear in VS Code with one-click fixes</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Powered by ActionLanguage</h3>
            <p className="text-lg mb-6">
              No AI. No machine learning. Just deterministic pattern matching on a universal intermediate representation.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/learn-actionlanguage" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Learn How It Works
              </a>
              <a href="/" className="bg-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors border-2 border-white">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
