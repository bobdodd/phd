export default function Playground() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="bg-gradient-to-r from-paradise-green to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Interactive Playground
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            See Paradise in action. Watch your code transform into ActionLanguage and see CRUD operations in real-time.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-r-lg">
            <h2 className="text-2xl font-bold text-yellow-800 mb-3">🚧 Coming Soon</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Interactive Playground is currently under development. When complete, it will feature:
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>✨ Live code editor with syntax highlighting</li>
              <li>🔍 Real-time ActionLanguage visualization</li>
              <li>📊 CRUD operations viewer showing CREATE, READ, UPDATE, DELETE in action</li>
              <li>🐛 Live accessibility analysis with instant feedback</li>
              <li>🔧 One-click fix application</li>
              <li>📚 Example library with accessible and inaccessible patterns</li>
            </ul>
            <div className="flex gap-4">
              <a href="/learn-actionlanguage" className="bg-paradise-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-blue/90 transition-colors">
                Learn ActionLanguage First
              </a>
              <a href="/" className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Back to Home
              </a>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-lg p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold mb-4">In the Meantime</h3>
            <p className="text-gray-700 mb-6">
              While we're building the playground, you can explore Paradise through:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue/20">
                <h4 className="font-semibold text-lg mb-2 text-paradise-blue">📖 Learning Modules</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Start with Module 1 to understand ActionLanguage, then progress through CRUD operations and advanced topics.
                </p>
                <a href="/learn-actionlanguage" className="text-paradise-blue font-semibold hover:underline">
                  Start Learning →
                </a>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green/20">
                <h4 className="font-semibold text-lg mb-2 text-paradise-green">🔌 VS Code Extension</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Install the Paradise extension to see real-time analysis on your actual codebase.
                </p>
                <a href="/extension" className="text-paradise-green font-semibold hover:underline">
                  Get Extension →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
