import Link from 'next/link';

export default function DesignersTrackPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🎨</div>
            <div>
              <h1 className="text-5xl font-bold">Designer Track</h1>
              <p className="text-xl text-purple-100 mt-2">Learn accessibility through visuals, UX, and design principles</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Designer Track Coming Soon</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            We're building out designer-specific content with visual examples, Figma templates, color contrast tools, and design specifications.
          </p>
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-purple-900 mb-3">What you'll learn:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Visual mockups and design patterns</li>
              <li>✓ Color contrast requirements and tools</li>
              <li>✓ Typography and spacing for accessibility</li>
              <li>✓ Figma/Sketch integration and templates</li>
              <li>✓ Design specification handoffs</li>
              <li>✓ Accessible component libraries</li>
            </ul>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/learn/developers"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Developer Track Instead
            </Link>
            <Link
              href="/learn"
              className="inline-block bg-gray-200 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Learn Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
