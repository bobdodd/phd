export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-paradise-blue to-paradise-purple bg-clip-text text-transparent">
            Welcome to Paradise
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Universal Accessibility Analysis Through ActionLanguage
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One intermediate representation, infinite possibilities
          </p>
        </div>

        {/* CRUD Teaser Box */}
        <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-8 mb-16 max-w-4xl mx-auto border border-paradise-blue/20">
          <h2 className="text-2xl font-semibold mb-4 text-paradise-blue">
            Understanding CRUD in ActionLanguage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded p-4 shadow-sm">
              <div className="text-3xl mb-2">✨</div>
              <div className="font-semibold text-paradise-green">CREATE</div>
              <div className="text-sm text-gray-600">Parse to ActionLanguage</div>
            </div>
            <div className="bg-white rounded p-4 shadow-sm">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold text-paradise-blue">READ</div>
              <div className="text-sm text-gray-600">Analyze patterns</div>
            </div>
            <div className="bg-white rounded p-4 shadow-sm">
              <div className="text-3xl mb-2">🔧</div>
              <div className="font-semibold text-paradise-orange">UPDATE</div>
              <div className="text-sm text-gray-600">Generate fixes</div>
            </div>
            <div className="bg-white rounded p-4 shadow-sm">
              <div className="text-3xl mb-2">🗑️</div>
              <div className="font-semibold text-paradise-purple">DELETE</div>
              <div className="text-sm text-gray-600">Optimize code</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mb-20">
          <a href="/learn-actionlanguage" className="bg-paradise-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-paradise-blue/90 transition-colors">
            Learn ActionLanguage
          </a>
          <a href="/playground" className="bg-paradise-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors">
            Try It Live
          </a>
          <a href="/extension" className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Get Extension
          </a>
        </div>
      </section>

      {/* The Mailhub Story */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Origin Story: The Mailhub</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8 mb-8 border-l-4 border-paradise-blue">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                The name <strong>Paradise</strong> comes from a pioneering project developed in the late 1990s:
                the <strong>Control Data Mailhub</strong>. The Mailhub was an ambitious system that connected
                multiple proprietary mail systems, SMTP (not yet the obvious winner), and X.400 together to
                enable message passing between them all.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The key insight was elegant: <strong className="text-paradise-blue">map everything to a common
                intermediate representation</strong>. The Mailhub mapped every mail format into X.400, applied
                filters and rules, and then recoded back out to the target mail system. An X.500 LDAP service
                managed users and routing—that server was called <strong>Paradise</strong>, and lived in a
                building in West London, UK.
              </p>
            </div>

            {/* The Analogy */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">The Pattern</h3>

              {/* Mailhub 1990s */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-6 mb-6">
                <div className="text-sm font-semibold text-gray-500 mb-3">MAILHUB (1990s)</div>
                <div className="font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Proprietary Mail Systems</span>
                    <span className="text-paradise-blue">→</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">SMTP</span>
                    <span className="text-paradise-blue">→</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">X.400</span>
                    <span className="text-paradise-blue">→</span>
                  </div>
                  <div className="pl-8">
                    <div className="bg-paradise-blue/10 rounded px-4 py-2 inline-block">
                      <strong className="text-paradise-blue">X.400</strong> (Intermediate)
                    </div>
                    <div className="text-gray-600 mt-2">↓ Filters & Rules (Paradise LDAP) ↓</div>
                  </div>
                  <div className="pl-8 text-gray-600">
                    <div>→ Target Mail System 1</div>
                    <div>→ Target Mail System 2</div>
                    <div>→ Target Mail System 3</div>
                  </div>
                </div>
              </div>

              {/* Paradise 2020s */}
              <div className="bg-gradient-to-r from-paradise-blue/10 to-paradise-purple/10 rounded-lg p-6 border border-paradise-blue/30">
                <div className="text-sm font-semibold text-paradise-blue mb-3">PARADISE (2020s)</div>
                <div className="font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">JavaScript/ES6</span>
                    <span className="text-paradise-green">→</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">TypeScript</span>
                    <span className="text-paradise-green">→</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">React/JSX</span>
                    <span className="text-paradise-green">→</span>
                  </div>
                  <div className="pl-8">
                    <div className="bg-paradise-green/20 rounded px-4 py-2 inline-block">
                      <strong className="text-paradise-green">ActionLanguage</strong> (Intermediate)
                    </div>
                    <div className="text-gray-700 mt-2">↓ Analysis & Detection ↓</div>
                  </div>
                  <div className="pl-8 text-gray-700">
                    <div>→ VS Code Diagnostics</div>
                    <div>→ Tailored Fixes</div>
                    <div>→ WCAG Reports</div>
                    <div>→ Educational Content</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Message */}
            <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 text-center">
              <p className="text-2xl font-semibold mb-3">
                Just as the Mailhub used X.400 as the universal mail representation,
              </p>
              <p className="text-2xl font-bold">
                Paradise uses ActionLanguage as the universal UI interaction representation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">Why This Matters</h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <h3 className="text-xl font-semibold mb-3 text-yellow-800">The Problem People Have</h3>
              <p className="text-gray-700 leading-relaxed">
                People look at this project and assume there must be AI or machine learning doing the
                "grunt work" of understanding code and detecting accessibility issues. <strong>There isn't.</strong> The
                confusion stems from not understanding the elegant simplicity of the intermediate representation pattern.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Deterministic</h3>
                <p className="text-gray-600 text-sm">
                  Pattern matching through tree traversal, not probabilistic AI inference
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="font-semibold text-lg mb-2">Universal</h3>
                <p className="text-gray-600 text-sm">
                  One set of analyzers works for every UI language via ActionLanguage
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="font-semibold text-lg mb-2">Transparent</h3>
                <p className="text-gray-600 text-sm">
                  Every CRUD operation is visible, traceable, and understandable
                </p>
              </div>
            </div>

            <div className="text-center">
              <a href="/theory" className="inline-block bg-paradise-purple text-white px-8 py-3 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors">
                Learn the Theory →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to explore ActionLanguage?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your journey into CRUD operations on intermediate representations
          </p>
          <div className="flex justify-center gap-4">
            <a href="/learn-actionlanguage" className="bg-paradise-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-paradise-blue/90 transition-colors">
              Start Learning
            </a>
            <a href="/playground" className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Open Playground
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
