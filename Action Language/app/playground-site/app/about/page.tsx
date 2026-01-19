import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">About Paradise Playground</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            A powerful accessibility testing tool powered by ActionLanguage and the Paradise framework
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-5xl">

        {/* What is Paradise */}
        <section className="bg-white rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">What is Paradise?</h2>
          <p className="text-lg text-gray-700 mb-4">
            Paradise is a universal accessibility analysis framework built on ActionLanguage - a declarative
            language for describing user interactions and UI state across any framework or technology.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            By modeling interactions as CRUD operations (Create, Read, Update, Delete) on a unified data structure,
            Paradise enables deterministic accessibility analysis that works across HTML, React, Vue, Angular, Svelte, and more.
          </p>
        </section>

        {/* The Problem */}
        <section className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">The Problem</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong className="text-red-700">Traditional accessibility testing tools have critical limitations:</strong>
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">✗</span>
                <span><strong>Framework-Specific:</strong> Tools built for React don't work with Vue or Angular. You need different tools for each framework.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">✗</span>
                <span><strong>False Positives:</strong> They can't see across file boundaries. A click handler in one file and keyboard handler in another file both flagged as missing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">✗</span>
                <span><strong>Incomplete Analysis:</strong> They miss patterns that span HTML, CSS, and JavaScript because they analyze each language in isolation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-700 font-bold mt-1">✗</span>
                <span><strong>High Maintenance:</strong> Every new framework or pattern requires rewriting the entire analyzer.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* The Solution */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">The Paradise Solution</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong className="text-green-700">Paradise solves these problems with a revolutionary approach:</strong>
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3">
                <span className="text-green-700 font-bold mt-1">✓</span>
                <span><strong>Universal Analysis:</strong> One tool works across all frameworks. Write your analyzers once, use everywhere.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-700 font-bold mt-1">✓</span>
                <span><strong>Multi-Model Integration:</strong> Sees the complete picture by combining DOM, JavaScript, and CSS models. No more false positives from missing cross-file context.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-700 font-bold mt-1">✓</span>
                <span><strong>Framework-Aware:</strong> Understands React hooks, Vue reactivity, Angular zones, and Svelte stores - detecting framework-specific accessibility issues.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-700 font-bold mt-1">✓</span>
                <span><strong>Deterministic:</strong> Same code always produces the same results. No runtime dependencies, works in CI/CD, VS Code, and browsers.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">How Paradise Works</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">1. Parse Multiple Sources</h3>
              <p className="text-gray-700">
                Paradise parses HTML, JavaScript, CSS, and framework-specific code (JSX, Vue templates, Svelte components, etc.)
                into separate models.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">2. Extract ActionLanguage</h3>
              <p className="text-gray-700">
                Each parser extracts ActionLanguage statements describing user interactions: what happens when you click,
                how focus moves, what ARIA states change, etc.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">3. Unify Models</h3>
              <p className="text-gray-700">
                All models are combined into a unified DocumentModel that represents the complete UI state and behavior,
                regardless of source language or framework.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">4. Run Analyzers</h3>
              <p className="text-gray-700">
                Specialized analyzers query the unified model to detect accessibility issues. They see the full context:
                DOM structure + event handlers + styling + framework patterns.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-700">
            <p className="text-gray-900">
              <strong>Key Insight:</strong> By modeling everything as ActionLanguage, Paradise can analyze accessibility
              patterns that traditional tools miss - like keyboard handlers split across files, CSS that hides focusable elements,
              or framework hooks that break screen reader announcements.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">What Paradise Detects</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">Keyboard Navigation</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Missing keyboard handlers</li>
                <li>• Incomplete arrow key navigation</li>
                <li>• Tab traps</li>
                <li>• Missing Shift+Tab support</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-700">ARIA Issues</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Missing aria-controls connections</li>
                <li>• Invalid ARIA attribute combinations</li>
                <li>• Semantic conflicts</li>
                <li>• Missing required ARIA states</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Focus Management</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Hidden focusable elements</li>
                <li>• Incorrect tabindex usage</li>
                <li>• Missing focus restoration</li>
                <li>• Focus order conflicts</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-orange-700">Widget Patterns</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Incomplete ARIA patterns</li>
                <li>• Missing required roles</li>
                <li>• Incorrect widget behavior</li>
                <li>• State management issues</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-red-700">Framework-Specific</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• React Portal focus issues</li>
                <li>• Vue reactivity a11y bugs</li>
                <li>• Angular zone detection problems</li>
                <li>• Svelte store accessibility</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-700">Content Structure</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Heading hierarchy errors</li>
                <li>• Missing landmarks</li>
                <li>• Orphaned event handlers</li>
                <li>• Document structure issues</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-700 mb-2">Core Technologies</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• TypeScript for type safety</li>
                <li>• Babel for JavaScript/JSX parsing</li>
                <li>• PostCSS for CSS analysis</li>
                <li>• Custom HTML parser</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-pink-700 mb-2">Supported Frameworks</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• React (JSX/TSX)</li>
                <li>• Vue (SFC + Composition API)</li>
                <li>• Angular (Templates + Components)</li>
                <li>• Svelte (Components + Stores)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Try Paradise Playground</h2>
          <p className="text-xl mb-8 text-blue-100">
            Experience the power of universal accessibility analysis. Test your code now.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
          >
            Launch Playground →
          </Link>
        </section>
      </div>
    </div>
  );
}
