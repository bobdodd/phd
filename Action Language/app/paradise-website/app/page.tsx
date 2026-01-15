export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section - Two Column Layout */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          {/* Left Column - Main Message */}
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-paradise-blue to-paradise-purple bg-clip-text text-transparent">
              Paradise
            </h1>
            <p className="text-2xl text-gray-700 mb-4 font-semibold">
              Universal Accessibility Analysis Through ActionLanguage
            </p>
            <p className="text-lg text-gray-600 mb-6">
              One intermediate representation, infinite possibilities. Parse any UI framework to ActionLanguage, analyze with universal patterns, generate tailored fixes.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-paradise-blue">13+</div>
                <div className="text-xs text-gray-600">Analyzers</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-paradise-green">React</div>
                <div className="text-xs text-gray-600">Full Support</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-paradise-purple">WCAG</div>
                <div className="text-xs text-gray-600">Compliant</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/playground"
                className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Try Playground →
              </a>
              <a
                href="/learn-actionlanguage"
                className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold border-2 border-paradise-blue hover:bg-paradise-blue/5 transition-colors"
              >
                Learn More
              </a>
              <a
                href="/extension"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Get Extension
              </a>
            </div>
          </div>

          {/* Right Column - Visual Diagram */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">How Paradise Works</h3>

            {/* Input Sources */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-24 text-right text-gray-600">JavaScript</div>
                <div className="flex-1 h-1 bg-gradient-to-r from-gray-300 to-paradise-green rounded"></div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-24 text-right text-gray-600">TypeScript</div>
                <div className="flex-1 h-1 bg-gradient-to-r from-gray-300 to-paradise-green rounded"></div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-24 text-right text-gray-600">React/JSX</div>
                <div className="flex-1 h-1 bg-gradient-to-r from-gray-300 to-paradise-green rounded"></div>
              </div>
            </div>

            {/* ActionLanguage Core */}
            <div className="bg-gradient-to-r from-paradise-green/20 to-paradise-blue/20 rounded-lg p-4 mb-4 border-2 border-paradise-green">
              <div className="text-center">
                <div className="text-lg font-bold text-paradise-green mb-1">ActionLanguage</div>
                <div className="text-xs text-gray-600">Intermediate Representation</div>
              </div>
            </div>

            {/* Output Results */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 h-1 bg-gradient-to-r from-paradise-blue to-gray-300 rounded"></div>
                <div className="w-32 text-gray-600">VS Code Diagnostics</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 h-1 bg-gradient-to-r from-paradise-blue to-gray-300 rounded"></div>
                <div className="w-32 text-gray-600">Auto Fixes</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 h-1 bg-gradient-to-r from-paradise-blue to-gray-300 rounded"></div>
                <div className="w-32 text-gray-600">WCAG Reports</div>
              </div>
            </div>
          </div>
        </div>

        {/* CRUD Operations - Compact */}
        <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-6 border border-paradise-blue/20">
          <h2 className="text-xl font-semibold mb-4 text-paradise-blue text-center">
            CRUD Operations on ActionLanguage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded p-3 shadow-sm text-center">
              <div className="text-2xl mb-1">✨</div>
              <div className="font-semibold text-paradise-green text-sm">CREATE</div>
              <div className="text-xs text-gray-600">Parse source</div>
            </div>
            <div className="bg-white rounded p-3 shadow-sm text-center">
              <div className="text-2xl mb-1">🔍</div>
              <div className="font-semibold text-paradise-blue text-sm">READ</div>
              <div className="text-xs text-gray-600">Analyze patterns</div>
            </div>
            <div className="bg-white rounded p-3 shadow-sm text-center">
              <div className="text-2xl mb-1">🔧</div>
              <div className="font-semibold text-paradise-orange text-sm">UPDATE</div>
              <div className="text-xs text-gray-600">Generate fixes</div>
            </div>
            <div className="bg-white rounded p-3 shadow-sm text-center">
              <div className="text-2xl mb-1">🗑️</div>
              <div className="font-semibold text-paradise-purple text-sm">DELETE</div>
              <div className="text-xs text-gray-600">Optimize code</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - Above Fold */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Why Paradise?</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-paradise-blue/5 to-paradise-blue/10 rounded-lg p-6 border border-paradise-blue/20">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-lg mb-2 text-paradise-blue">Deterministic Analysis</h3>
              <p className="text-gray-600 text-sm">
                No AI guesswork. Pattern matching through AST traversal ensures accurate, reproducible results every time.
              </p>
            </div>
            <div className="bg-gradient-to-br from-paradise-green/5 to-paradise-green/10 rounded-lg p-6 border border-paradise-green/20">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-lg mb-2 text-paradise-green">Universal Framework Support</h3>
              <p className="text-gray-600 text-sm">
                One set of analyzers works for React, Vue, Angular, and vanilla JS via ActionLanguage intermediate representation.
              </p>
            </div>
            <div className="bg-gradient-to-br from-paradise-purple/5 to-paradise-purple/10 rounded-lg p-6 border border-paradise-purple/20">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="font-semibold text-lg mb-2 text-paradise-purple">Transparent & Extensible</h3>
              <p className="text-gray-600 text-sm">
                Every detection, every fix is traceable. Add custom analyzers easily with full documentation and examples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Mailhub Story - Simplified */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Origin: The Mailhub Pattern</h2>

            <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-paradise-blue shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Paradise</strong> is named after a 1990s system that solved email interoperability: the <strong>Control Data Mailhub</strong>. It converted all mail formats to <strong>X.400</strong> (intermediate representation), applied rules, then converted back to target formats.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Paradise applies the same pattern to UI accessibility: convert all frameworks to <strong>ActionLanguage</strong>, analyze universally, generate framework-specific fixes.
              </p>
            </div>

            {/* Compact Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-xs font-semibold text-gray-500 mb-2">MAILHUB (1990s)</div>
                <div className="text-sm space-y-1 text-gray-700">
                  <div>Multiple mail formats</div>
                  <div className="text-paradise-blue font-semibold">→ X.400 (intermediate)</div>
                  <div>→ Universal rules</div>
                  <div>→ Target formats</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-4 border border-paradise-blue/30">
                <div className="text-xs font-semibold text-paradise-blue mb-2">PARADISE (2020s)</div>
                <div className="text-sm space-y-1 text-gray-700">
                  <div>Multiple UI frameworks</div>
                  <div className="text-paradise-green font-semibold">→ ActionLanguage (intermediate)</div>
                  <div>→ Universal analyzers</div>
                  <div>→ Framework-specific fixes</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <a href="/background" className="text-paradise-blue hover:text-paradise-purple font-semibold transition-colors">
                Read the full story →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Get Started</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <a href="/playground" className="group bg-gradient-to-br from-paradise-green/10 to-paradise-green/5 rounded-lg p-6 hover:shadow-lg transition-all border border-paradise-green/20">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-semibold mb-2 text-paradise-green group-hover:text-paradise-blue transition-colors">Playground</h3>
              <p className="text-sm text-gray-600">Try Paradise live with interactive examples</p>
            </a>
            <a href="/learn-actionlanguage" className="group bg-gradient-to-br from-paradise-blue/10 to-paradise-blue/5 rounded-lg p-6 hover:shadow-lg transition-all border border-paradise-blue/20">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold mb-2 text-paradise-blue group-hover:text-paradise-purple transition-colors">Learn</h3>
              <p className="text-sm text-gray-600">Understand ActionLanguage fundamentals</p>
            </a>
            <a href="/frameworks" className="group bg-gradient-to-br from-paradise-purple/10 to-paradise-purple/5 rounded-lg p-6 hover:shadow-lg transition-all border border-paradise-purple/20">
              <div className="text-3xl mb-2">⚛️</div>
              <h3 className="font-semibold mb-2 text-paradise-purple group-hover:text-paradise-blue transition-colors">Frameworks</h3>
              <p className="text-sm text-gray-600">React, Vue, Angular support details</p>
            </a>
            <a href="/extension" className="group bg-gradient-to-br from-gray-700/10 to-gray-700/5 rounded-lg p-6 hover:shadow-lg transition-all border border-gray-300">
              <div className="text-3xl mb-2">🔌</div>
              <h3 className="font-semibold mb-2 text-gray-700 group-hover:text-paradise-blue transition-colors">VS Code</h3>
              <p className="text-sm text-gray-600">Install the Paradise extension</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Ready to Build Accessible UIs?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Join the developers using Paradise to catch accessibility issues before they reach production
          </p>
          <div className="flex justify-center gap-4">
            <a href="/playground" className="bg-white text-paradise-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Try Playground
            </a>
            <a href="/extension" className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Install Extension
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
