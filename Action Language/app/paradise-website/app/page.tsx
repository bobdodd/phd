export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Friendly & Informational */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-paradise-blue/5 to-paradise-purple/10">
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-paradise-blue/20 mb-8 shadow-sm">
              <svg className="w-5 h-5 text-paradise-blue" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Open source on GitHub</span>
            </div>

            {/* Hero Headline - Clear & Friendly */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-paradise-blue via-paradise-purple to-paradise-green bg-clip-text text-transparent">
                Catch accessibility issues
              </span>
              <br />
              <span className="text-gray-900">while you code</span>
            </h1>

            {/* Subheading - Informational */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Paradise analyzes your source code as you write it—JavaScript, TypeScript, React, Vue, Angular—and finds accessibility
              issues before you build or deploy. Using <span className="font-semibold text-paradise-green">ActionLanguage</span>, it works
              across frameworks and catches problems early in development.
            </p>

            {/* CTA - Friendly */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="/playground"
                className="px-8 py-3 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                Try the playground
              </a>
              <a
                href="/learn-actionlanguage"
                className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium border-2 border-gray-200 hover:border-paradise-blue transition-colors"
              >
                Learn how it works
              </a>
            </div>

            {/* Trust Indicators - Subtle */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-paradise-green rounded-full"></div>
                <span>13+ built-in analyzers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-paradise-blue rounded-full"></div>
                <span>Full React support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-paradise-purple rounded-full"></div>
                <span>WCAG 2.1 coverage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-paradise-blue/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-paradise-purple/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Code Example Section - Educational */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Analyze source code, not final builds
              </h2>
              <p className="text-lg text-gray-600">
                Paradise reads your JSX, TypeScript, and JavaScript files directly—catching issues before you even save the file
              </p>
            </div>

            {/* Code Example with Issue Detection */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before - With Issue */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400 font-mono">Button.tsx</span>
                </div>
                <div className="p-6 font-mono text-sm">
                  <div className="text-gray-500">1</div>
                  <div className="text-gray-500">2</div>
                  <div className="text-gray-800">
                    3  <span className="text-blue-600">&lt;div</span>
                  </div>
                  <div className="text-gray-800 bg-red-50 border-l-4 border-red-500 pl-2">
                    4    <span className="text-purple-600">onClick</span>=<span className="text-green-600">{`{handleClick}`}</span>
                    <span className="ml-4 text-red-600 text-xs">← Issue here</span>
                  </div>
                  <div className="text-gray-800">
                    5    <span className="text-purple-600">className</span>=<span className="text-green-600">"button"</span>
                  </div>
                  <div className="text-gray-800">
                    6  <span className="text-blue-600">&gt;</span>
                  </div>
                  <div className="text-gray-800">
                    7    Click me
                  </div>
                  <div className="text-gray-800">
                    8  <span className="text-blue-600">&lt;/div&gt;</span>
                  </div>
                </div>
                <div className="bg-red-50 border-t border-red-200 px-6 py-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="font-medium text-red-900 text-sm">Missing keyboard support</p>
                      <p className="text-red-700 text-xs mt-1">This clickable element can only be used with a mouse. Keyboard users won't be able to interact with it.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* After - Fixed */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-200">
                <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400 font-mono">Button.tsx</span>
                </div>
                <div className="p-6 font-mono text-sm">
                  <div className="text-gray-500">1</div>
                  <div className="text-gray-500">2</div>
                  <div className="text-gray-800">
                    3  <span className="text-blue-600">&lt;button</span>
                  </div>
                  <div className="text-gray-800">
                    4    <span className="text-purple-600">onClick</span>=<span className="text-green-600">{`{handleClick}`}</span>
                  </div>
                  <div className="text-gray-800 bg-green-50 border-l-4 border-green-500 pl-2">
                    5    <span className="text-purple-600">onKeyDown</span>=<span className="text-green-600">{`{handleKeyPress}`}</span>
                    <span className="ml-4 text-green-600 text-xs">← Fixed</span>
                  </div>
                  <div className="text-gray-800">
                    6    <span className="text-purple-600">className</span>=<span className="text-green-600">"button"</span>
                  </div>
                  <div className="text-gray-800">
                    7  <span className="text-blue-600">&gt;</span>
                  </div>
                  <div className="text-gray-800">
                    8    Click me
                  </div>
                  <div className="text-gray-800">
                    9  <span className="text-blue-600">&lt;/button&gt;</span>
                  </div>
                </div>
                <div className="bg-green-50 border-t border-green-200 px-6 py-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="font-medium text-green-900 text-sm">Now accessible</p>
                      <p className="text-green-700 text-xs mt-1">Using a semantic button element with keyboard support. Works for everyone.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple Explanation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Paradise works
              </h2>
              <p className="text-lg text-gray-600">
                Source code analysis in three steps—no build required
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-paradise-green/10 to-paradise-green/5 rounded-xl p-8 border border-paradise-green/20 h-full">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-paradise-green text-white rounded-lg font-bold text-lg mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Parse source files</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Paradise reads your source files directly—.tsx, .jsx, .ts, .js—and converts them to <span className="font-medium text-paradise-green">ActionLanguage</span>, a common format that works across all frameworks.
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-paradise-blue/10 to-paradise-blue/5 rounded-xl p-8 border border-paradise-blue/20 h-full">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-paradise-blue text-white rounded-lg font-bold text-lg mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Analyze patterns</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Built-in analyzers check for accessibility issues by examining code structure. Catches problems early in development—even in incomplete components.
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <div className="bg-gradient-to-br from-paradise-purple/10 to-paradise-purple/5 rounded-xl p-8 border border-paradise-purple/20 h-full">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-paradise-purple text-white rounded-lg font-bold text-lg mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Fix</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get suggestions in your editor with one-click fixes. The fixes match your framework and coding style.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - Informational Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What makes it different
              </h2>
              <p className="text-lg text-gray-600">
                Source-level analysis across languages and frameworks
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-paradise-blue/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-paradise-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Deterministic</h3>
                <p className="text-gray-600 leading-relaxed">
                  Uses pattern matching on your code's structure. Same code always produces the same results.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-paradise-green/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-paradise-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Multi-language support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Analyzes JavaScript, TypeScript, React, Vue, and Angular source files. Write analyzers once, use everywhere.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-paradise-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-paradise-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Extensible</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built with TypeScript. Add your own analyzers with full type support and documentation.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-paradise-orange/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-paradise-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Real-time in editor</h3>
                <p className="text-gray-600 leading-relaxed">
                  See issues as you type—directly in VS Code. No build step, no deploy, no waiting.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-paradise-blue/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-paradise-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">WCAG focused</h3>
                <p className="text-gray-600 leading-relaxed">
                  Checks align with WCAG 2.1 Level A and AA success criteria for web accessibility.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-paradise-green/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-paradise-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Auto-fix suggestions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Many issues come with one-click fixes that preserve your code formatting and style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story - The Mailhub Pattern */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Where the idea came from
              </h2>
              <p className="text-lg text-gray-600">
                Paradise is inspired by a 1990s email system
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200">
              <p className="text-gray-700 leading-relaxed mb-6">
                In the 1990s, the <strong>Control Data Mailhub</strong> solved email interoperability by converting all mail formats
                to <strong>X.400</strong> (an intermediate representation), applying universal rules, then converting back to target formats.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                Paradise applies the same pattern to UI accessibility: convert all frameworks to <strong>ActionLanguage</strong>,
                analyze with universal patterns, generate framework-specific fixes.
              </p>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 mb-3">MAILHUB (1990s)</div>
                  <div className="text-sm space-y-2 text-gray-700">
                    <div>Multiple mail formats</div>
                    <div className="text-paradise-blue font-medium">→ X.400 (intermediate)</div>
                    <div>→ Universal rules</div>
                    <div>→ Target formats</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-paradise-blue/5 to-paradise-purple/5 rounded-lg p-6 border border-paradise-blue/20">
                  <div className="text-xs font-semibold text-paradise-blue mb-3">PARADISE (today)</div>
                  <div className="text-sm space-y-2 text-gray-700">
                    <div>Multiple UI frameworks</div>
                    <div className="text-paradise-green font-medium">→ ActionLanguage (intermediate)</div>
                    <div>→ Universal analyzers</div>
                    <div>→ Framework-specific fixes</div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <a href="/background" className="text-paradise-blue hover:text-paradise-purple font-medium transition-colors inline-flex items-center gap-2">
                  Read the full story
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Gentle */}
      <section className="py-20 bg-gradient-to-br from-paradise-blue/10 via-paradise-purple/10 to-paradise-green/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to catch issues earlier?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start analyzing your source code with the playground or VS Code extension
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/playground"
              className="px-8 py-3 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              Try playground
            </a>
            <a
              href="/extension"
              className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              Get VS Code extension
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
