import Link from 'next/link';
import { learningPaths } from './data/learningPaths';

export default function LearnPage() {
  const quickStart = learningPaths.find((p) => p.id === 'quick-start');
  const comprehensive = learningPaths.find((p) => p.id === 'comprehensive');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-700 to-purple-900 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Learn Accessibility</h1>
          <p className="text-2xl text-indigo-100 max-w-3xl mb-6">
            Master digital accessibility through practical, hands-on learning that builds real-world skills
          </p>
          <p className="text-lg text-indigo-200 max-w-3xl">
            Self-paced, profession-specific courses aligned with WCAG 2.2 and IAAP standards. Choose your track and start learning today.
          </p>
        </div>
      </section>

      {/* Choose Your Track */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Choose Your Learning Path</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Learn accessibility through your professional lens. Same concepts, tailored to how you work.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Developer Track */}
          <Link
            href="/learn/developers"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border-4 border-blue-600 hover:border-blue-700 hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">👨‍💻</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-3 group-hover:text-blue-800">Developers</h3>
            <p className="text-gray-700 mb-4">
              Learn through code examples, APIs, and patterns. Build accessible web applications with confidence.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✓ Working code examples</li>
              <li>✓ Before/after comparisons</li>
              <li>✓ Framework-specific guides</li>
              <li>✓ Testing automation</li>
            </ul>
            <div className="text-blue-700 font-semibold group-hover:text-blue-800">
              Start Developer Track →
            </div>
          </Link>

          {/* Designer Track */}
          <Link
            href="/learn/designers"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border-4 border-purple-600 hover:border-purple-700 hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-3 group-hover:text-purple-800">Designers</h3>
            <p className="text-gray-700 mb-4">
              Learn through visual examples and UX principles. Create designs that are beautiful and accessible.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✓ Visual mockups</li>
              <li>✓ Color contrast tools</li>
              <li>✓ Figma/Sketch templates</li>
              <li>✓ Design specifications</li>
            </ul>
            <div className="text-purple-700 font-semibold group-hover:text-purple-800">
              Start Designer Track →
            </div>
          </Link>

          {/* QA Track */}
          <Link
            href="/learn/qa"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border-4 border-green-600 hover:border-green-700 hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-700 mb-3 group-hover:text-green-800">QA Testers</h3>
            <p className="text-gray-700 mb-4">
              Learn through testing scenarios and validation criteria. Ensure quality accessibility in every release.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✓ Test case libraries</li>
              <li>✓ Testing procedures</li>
              <li>✓ Tool tutorials</li>
              <li>✓ Bug report templates</li>
            </ul>
            <div className="text-green-700 font-semibold group-hover:text-green-800">
              Start QA Track →
            </div>
          </Link>
        </div>

        {/* Key Topics */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Key Topics</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Topic 1 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-3 text-blue-700">1. Semantic HTML</h3>
              <p className="text-gray-700 mb-4">
                Using proper HTML elements gives meaning to your content and helps screen readers
                understand your page structure.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Use headings (h1-h6) in correct order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">button</code> for buttons, not <code className="bg-gray-100 px-2 py-1 rounded text-sm">div</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">nav</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">main</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">article</code> for structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-700 mt-1">•</span>
                  <span>Add alt text to images</span>
                </li>
              </ul>
            </div>

            {/* Topic 2 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-3 text-purple-700">2. Keyboard Navigation</h3>
              <p className="text-gray-700 mb-4">
                All functionality must be available from a keyboard. Many users rely on keyboards
                instead of mice.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-700 mt-1">•</span>
                  <span>Ensure all interactive elements are focusable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-700 mt-1">•</span>
                  <span>Provide visible focus indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-700 mt-1">•</span>
                  <span>Support Tab, Enter, Space, and Arrow keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-700 mt-1">•</span>
                  <span>Avoid keyboard traps</span>
                </li>
              </ul>
            </div>

            {/* Topic 3 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-3 text-green-700">3. ARIA Attributes</h3>
              <p className="text-gray-700 mb-4">
                ARIA (Accessible Rich Internet Applications) adds semantic information when HTML alone
                isn't enough.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-700 mt-1">•</span>
                  <span>Use ARIA only when necessary (HTML first!)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-700 mt-1">•</span>
                  <span>Roles: <code className="bg-gray-100 px-2 py-1 rounded text-sm">button</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">dialog</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">menu</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-700 mt-1">•</span>
                  <span>States: <code className="bg-gray-100 px-2 py-1 rounded text-sm">aria-expanded</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">aria-checked</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-700 mt-1">•</span>
                  <span>Properties: <code className="bg-gray-100 px-2 py-1 rounded text-sm">aria-label</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">aria-describedby</code></span>
                </li>
              </ul>
            </div>

            {/* Topic 4 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-3 text-orange-700">4. Focus Management</h3>
              <p className="text-gray-700 mb-4">
                Properly managing focus is critical for keyboard and screen reader users navigating
                dynamic content.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-700 mt-1">•</span>
                  <span>Move focus when opening modals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-700 mt-1">•</span>
                  <span>Return focus after closing dialogs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-700 mt-1">•</span>
                  <span>Handle focus in single-page apps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-700 mt-1">•</span>
                  <span>Announce dynamic content changes</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ARIA Authoring Practices Guide (APG) Widgets */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">ARIA Authoring Practices Guide (APG)</h2>
          <p className="text-lg text-gray-700 mb-6">
            The W3C ARIA Authoring Practices Guide provides patterns and examples for implementing accessible widgets.
            Below are common widget patterns you can test in the playground:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Widget categories */}
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <h4 className="font-bold text-blue-700 mb-2">Disclosure Widgets</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Accordion</li>
                <li>• Dialog (Modal)</li>
                <li>• Disclosure</li>
                <li>• Tooltip</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <h4 className="font-bold text-green-700 mb-2">Navigation Widgets</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Menu & Menubar</li>
                <li>• Tabs</li>
                <li>• Tree View</li>
                <li>• Breadcrumb</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
              <h4 className="font-bold text-purple-700 mb-2">Input Widgets</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Combobox</li>
                <li>• Listbox</li>
                <li>• Radio Group</li>
                <li>• Slider</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
              <h4 className="font-bold text-orange-700 mb-2">Status Widgets</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Alert</li>
                <li>• Progress Bar</li>
                <li>• Feed</li>
                <li>• Toolbar</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-pink-200">
              <h4 className="font-bold text-pink-700 mb-2">Composite Widgets</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Grid</li>
                <li>• Table</li>
                <li>• Carousel</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
              <h4 className="font-bold text-indigo-700 mb-2">Basic Widgets</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Button</li>
                <li>• Link</li>
                <li>• Checkbox</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://www.w3.org/WAI/ARIA/apg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold"
            >
              View Full APG Documentation →
            </a>
          </div>
        </section>

        {/* Common Patterns */}
        <section className="bg-white rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Common Accessible Patterns</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Accessible Button</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code>{`<button type="button" aria-label="Close dialog">
  <span aria-hidden="true">×</span>
</button>`}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Accessible Form Field</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code>{`<label for="email">Email address</label>
<input
  type="email"
  id="email"
  required
  aria-describedby="email-help"
/>
<span id="email-help">We'll never share your email</span>`}</code></pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Accessible Heading Structure</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code>{`<h1>Page Title</h1>
<main>
  <h2>Section 1</h2>
  <h3>Subsection 1.1</h3>
  <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
</main>`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Practice?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Try these concepts in the interactive playground and get real-time feedback.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
          >
            Launch Playground →
          </Link>
        </section>

        {/* Resources */}
        <section className="mt-12 bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Additional Resources</h2>
          <ul className="space-y-3 text-lg">
            <li>
              <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer"
                 className="text-blue-700 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                → WCAG 2.1 Quick Reference
              </a>
            </li>
            <li>
              <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener noreferrer"
                 className="text-blue-700 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                → ARIA Authoring Practices Guide (APG)
              </a>
            </li>
            <li>
              <a href="https://webaim.org/" target="_blank" rel="noopener noreferrer"
                 className="text-blue-700 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                → WebAIM - Web Accessibility In Mind
              </a>
            </li>
            <li>
              <a href="https://www.a11yproject.com/" target="_blank" rel="noopener noreferrer"
                 className="text-blue-700 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                → The A11Y Project
              </a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility" target="_blank" rel="noopener noreferrer"
                 className="text-blue-700 hover:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                → MDN Web Docs - Accessibility
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
