import Link from 'next/link';

export default function QATrackPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">✅</div>
            <div>
              <h1 className="text-5xl font-bold">QA Tester Track</h1>
              <p className="text-xl text-green-100 mt-2">Learn accessibility through testing scenarios and validation</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">QA Track Coming Soon</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            We're building out QA-specific content with test case libraries, testing procedures, tool tutorials, and bug report templates.
          </p>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-green-900 mb-3">What you'll learn:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Comprehensive test case libraries</li>
              <li>✓ Step-by-step testing procedures</li>
              <li>✓ Screen reader testing protocols</li>
              <li>✓ Automated testing tools (axe, WAVE, Lighthouse)</li>
              <li>✓ Bug severity classification</li>
              <li>✓ Accessibility acceptance criteria</li>
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
