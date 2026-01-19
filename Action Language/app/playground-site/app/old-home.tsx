import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#0066CC] via-[#9933CC] to-[#00AA44] bg-clip-text text-transparent">
            Paradise Playground
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Learn web accessibility through interactive code analysis
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Test your HTML, JavaScript, and CSS code for accessibility issues in real-time.
            Get instant feedback with detailed explanations and learn how to build inclusive web experiences.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/playground/"
              className="bg-[#0066CC] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0052A3] transition-colors shadow-lg"
            >
              Launch Playground →
            </Link>
            <Link
              href="/learn/"
              className="bg-white text-[#0066CC] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg border-2 border-[#0066CC]"
            >
              Learn Accessibility
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-3 text-[#0066CC]">Real-Time Analysis</h3>
            <p className="text-gray-600">
              Get instant feedback as you code. 15+ specialized analyzers detect accessibility issues across HTML, JavaScript, and CSS.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-3 text-[#9933CC]">Comprehensive Docs</h3>
            <p className="text-gray-600">
              Click any issue to view detailed documentation with examples, explanations, and fix suggestions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-3 text-[#00AA44]">Jump to Errors</h3>
            <p className="text-gray-600">
              Click on any detected issue to jump directly to the problematic code with syntax highlighting.
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-12">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">ARIA Best Practices</h4>
                <p className="text-gray-600">Learn when and how to use ARIA attributes correctly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Keyboard Navigation</h4>
                <p className="text-gray-600">Ensure all interactive elements work with keyboard</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Focus Management</h4>
                <p className="text-gray-600">Handle focus properly in dynamic interfaces</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Semantic HTML</h4>
                <p className="text-gray-600">Use proper HTML structure for screen readers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Widget Patterns</h4>
                <p className="text-gray-600">Implement accessible tabs, dialogs, menus, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">WCAG Compliance</h4>
                <p className="text-gray-600">Meet WCAG 2.1 Level A and AA criteria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-[#0066CC] to-[#9933CC] rounded-2xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Accessible Websites?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Start testing your code in the interactive playground now.
          </p>
          <Link
            href="/playground/"
            className="inline-block bg-white text-[#0066CC] px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Launch Playground →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4">Paradise Playground - Interactive Accessibility Learning</p>
          <p className="text-sm text-gray-500">
            Powered by ActionLanguage • 15+ Accessibility Analyzers • WCAG 2.1 Compliant
          </p>
        </div>
      </footer>
    </div>
  );
}
