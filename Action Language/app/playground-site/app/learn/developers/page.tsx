import Link from 'next/link';
import { modules, getModulesByDomain } from '../data/modules';
import { learningPaths, getLearningPathsByTrack } from '../data/learningPaths';

export default function DevelopersTrackPage() {
  const developerPaths = getLearningPathsByTrack('developer');
  const quickStart = learningPaths.find((p) => p.id === 'quick-start');

  // Get modules by domain for overview
  const domain1 = getModulesByDomain(1); // Disabilities & AT
  const domain2 = getModulesByDomain(2); // Standards

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">👨‍💻</div>
            <div>
              <h1 className="text-5xl font-bold">Developer Track</h1>
              <p className="text-xl text-blue-100 mt-2">Learn accessibility through code, APIs, and patterns</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Quick Start CTA */}
        {quickStart && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-8 mb-12 border-2 border-orange-300">
            <div className="flex items-start gap-6">
              <div className="text-6xl">⚡</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-orange-900 mb-3">{quickStart.name}</h2>
                <p className="text-lg text-gray-700 mb-4">{quickStart.description}</p>
                <div className="flex items-center gap-6 mb-4">
                  <div className="text-sm font-semibold text-orange-700">
                    {quickStart.estimatedHours} hours
                  </div>
                  <div className="text-sm font-semibold text-orange-700">
                    {quickStart.moduleIds.length} modules
                  </div>
                </div>
                <Link
                  href={`/learn/developers/modules/${modules[0]?.slug || 'understanding-disability-models'}`}
                  className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Start Quick Start Path →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* What You'll Learn */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Semantic HTML & ARIA</h3>
                <p className="text-gray-700">
                  Master semantic HTML elements and WAI-ARIA roles, states, and properties for accessible markup.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">⌨️</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Keyboard Navigation</h3>
                <p className="text-gray-700">
                  Implement keyboard-accessible patterns including focus management, roving tabindex, and shortcuts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🎛️</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Widgets</h3>
                <p className="text-gray-700">
                  Build accessible accordions, tabs, dialogs, comboboxes, and other interactive components.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🧪</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Testing & Automation</h3>
                <p className="text-gray-700">
                  Integrate accessibility testing into your workflow with automated tools and manual testing strategies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Choose Your Learning Path</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {developerPaths.map((path) => (
              <div key={path.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <h3 className="text-2xl font-bold text-blue-700 mb-3">{path.name}</h3>
                <p className="text-gray-700 mb-4">{path.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-sm font-semibold text-gray-600">
                    {path.estimatedHours} hours
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    {path.moduleIds.length} modules
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="text-sm font-semibold text-blue-900 mb-2">Goal:</div>
                  <div className="text-sm text-gray-700">{path.goal}</div>
                </div>
                <Link
                  href={`/learn/developers/modules/${modules[0]?.slug || 'understanding-disability-models'}`}
                  className="inline-block text-blue-700 font-semibold hover:text-blue-900"
                >
                  Start this path →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Browse All Modules */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse All Modules</h2>
          <p className="text-lg text-gray-700 mb-8">
            Or explore all 65 modules organized by domain. Each module includes code examples, playground integration, and practical exercises.
          </p>

          <div className="space-y-6">
            {/* Domain 1 Preview */}
            <div className="border-l-4 border-purple-600 pl-6 py-4 bg-purple-50 rounded-r">
              <h3 className="text-2xl font-semibold text-purple-900 mb-2">
                Domain 1: Disabilities & Assistive Technologies
              </h3>
              <p className="text-gray-700 mb-3">{domain1.length} modules • Foundation for understanding users</p>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                {domain1.slice(0, 6).map((mod) => (
                  <div key={mod.id}>• {mod.title}</div>
                ))}
              </div>
              <Link
                href={`/learn/developers/modules/${domain1[0]?.slug}`}
                className="inline-block mt-4 text-purple-700 font-semibold hover:text-purple-900"
              >
                Start Domain 1 →
              </Link>
            </div>

            {/* Domain 2 Preview */}
            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 rounded-r">
              <h3 className="text-2xl font-semibold text-blue-900 mb-2">
                Domain 2: Standards & Guidelines
              </h3>
              <p className="text-gray-700 mb-3">{domain2.length} modules • Master WCAG 2.2 and ARIA</p>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                {domain2.slice(0, 6).map((mod) => (
                  <div key={mod.id}>• {mod.title}</div>
                ))}
              </div>
              <Link
                href={`/learn/developers/modules/${domain2[0]?.slug}`}
                className="inline-block mt-4 text-blue-700 font-semibold hover:text-blue-900"
              >
                Start Domain 2 →
              </Link>
            </div>

            {/* Coming Soon - More Domains */}
            <div className="border-l-4 border-gray-400 pl-6 py-4 bg-gray-50 rounded-r">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Domains 3-8: Coming Soon
              </h3>
              <p className="text-gray-600 mb-3">
                Laws & Regulations, Semantic Structure, Images & Media, Forms, Custom Widgets, and Advanced Topics
              </p>
              <div className="text-sm text-gray-500">45 additional modules in development</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-12 border-2 border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Developer Learning Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">1️⃣</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Read Code-First Content</h3>
                <p className="text-gray-700">
                  Every concept explained with working code examples, before/after comparisons, and framework-specific implementations.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">2️⃣</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Try It in Paradise Playground</h3>
                <p className="text-gray-700">
                  Load examples directly into the interactive playground. Test with screen reader simulator, modify code, see real-time analysis.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">3️⃣</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fix Broken Examples</h3>
                <p className="text-gray-700">
                  Challenge yourself with intentionally inaccessible code. Get hints, see solutions, learn from mistakes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">4️⃣</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Apply to Your Projects</h3>
                <p className="text-gray-700">
                  Copy-paste-ready code, testing strategies, and integration patterns you can use immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started CTA */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl shadow-lg p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Coding Accessibly?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Begin with the Quick Start path or jump into any module. Your progress is tracked automatically.
          </p>
          <Link
            href={`/learn/developers/modules/${modules[0]?.slug || 'understanding-disability-models'}`}
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Learning →
          </Link>
        </div>
      </div>
    </div>
  );
}
