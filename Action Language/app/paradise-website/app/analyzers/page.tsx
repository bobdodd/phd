export default function AnalyzersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Paradise Analyzers
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            From JavaScript-only analysis to multi-model architecture: The complete evolution of
            accessibility detection in Paradise.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">

        {/* Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-paradise-blue/20">
              <div className="text-4xl font-bold text-paradise-blue mb-2">35</div>
              <div className="text-gray-600 font-medium">Total Analyzers</div>
              <div className="text-xs text-gray-500 mt-1">Behavioral + Structural + Framework</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-green-500/20">
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Issue Types</div>
              <div className="text-xs text-gray-500 mt-1">Comprehensive Coverage</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-purple-500/20">
              <div className="text-4xl font-bold text-purple-600 mb-2">95</div>
              <div className="text-gray-600 font-medium">Tests Passing</div>
              <div className="text-xs text-gray-500 mt-1">100% Pass Rate</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-teal-500/20">
              <div className="text-4xl font-bold text-teal-600 mb-2">88%</div>
              <div className="text-gray-600 font-medium">False Positive Reduction</div>
              <div className="text-xs text-gray-500 mt-1">vs Traditional</div>
            </div>
          </div>
        </div>

        {/* Phase 1: JavaScript-Only Analyzers */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple rounded-2xl shadow-xl p-8 text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 text-center">Phase 1: JavaScript-Only Analysis</h2>
            <p className="text-lg text-center opacity-95 max-w-3xl mx-auto">
              Paradise began with 9 analyzers that examine JavaScript in isolation using ActionLanguage.
              These analyzers detect many real issues but have limitations when code spans multiple files.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* JS-Only Analyzer Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900">StaticAriaAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects ARIA attributes (aria-expanded, aria-checked, aria-pressed) that are set initially
                but never updated when state changes.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 4.1.2 | <strong>Scope:</strong> JavaScript-only
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900">FocusManagementAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects 6 types of focus management issues: element removal/hiding without focus checks,
                non-focusable element targeting, standalone blur calls, and modal close without focus restoration.
                Critical for modals, tabs, and dynamic content.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">
                <strong>WCAG:</strong> 2.4.3, 2.4.7, 4.1.2 | <strong>Scope:</strong> JavaScript-only
              </div>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium text-paradise-blue hover:text-paradise-purple">
                  View 6 Issue Types
                </summary>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li>removal-without-focus-management</li>
                  <li>hiding-without-focus-management</li>
                  <li>hiding-class-without-focus-management</li>
                  <li>possibly-non-focusable</li>
                  <li>standalone-blur</li>
                  <li>focus-restoration-missing</li>
                </ul>
              </details>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900">KeyboardNavigationAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects 9 types of keyboard navigation issues: keyboard traps without Escape, single-key shortcuts conflicting with screen readers,
                arrow keys without ARIA context, deprecated keyCode usage, Tab without Shift handling, missing Escape handlers,
                missing arrow navigation, preventDefault on nav keys, and undocumented shortcuts. Critical for keyboard and screen reader users.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">
                <strong>WCAG:</strong> 2.1.1, 2.1.2, 2.1.4, 4.1.2 | <strong>Scope:</strong> JavaScript-only
              </div>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium text-paradise-blue hover:text-paradise-purple">
                  View 9 Issue Types
                </summary>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li>potential-keyboard-trap - Tab trap without Escape</li>
                  <li>screen-reader-conflict - Single-key shortcuts (h, k, j)</li>
                  <li>screen-reader-arrow-conflict - Arrow keys without ARIA widget</li>
                  <li>deprecated-keycode - Using event.keyCode</li>
                  <li>tab-without-shift - Tab without Shift+Tab support</li>
                  <li>missing-escape-handler - Modal without Escape key</li>
                  <li>missing-arrow-navigation - ARIA widget without arrow keys</li>
                  <li>prevent-default-nav-keys - preventDefault on Space/Enter/Arrow</li>
                  <li>keyboard-shortcuts-undocumented - Shortcuts without docs</li>
                </ul>
              </details>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900">MissingLabelAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects form inputs created dynamically without associated labels, aria-label, or
                aria-labelledby attributes.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 1.3.1, 4.1.2 | <strong>Scope:</strong> JavaScript-only
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  5
                </div>
                <h3 className="text-xl font-bold text-gray-900">MissingAltTextAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects images created or manipulated without alt text or proper ARIA labeling. Essential
                for screen reader users.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 1.1.1 | <strong>Scope:</strong> JavaScript-only
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  6
                </div>
                <h3 className="text-xl font-bold text-gray-900">TabIndexAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects inappropriate tabindex usage: positive values on divs, removing focusability from
                interactive elements.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.4.3 | <strong>Scope:</strong> JavaScript-only
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  7
                </div>
                <h3 className="text-xl font-bold text-gray-900">RedundantRoleAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects ARIA roles that duplicate native semantics (role="button" on button elements,
                role="textbox" on inputs).
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 4.1.2 | <strong>Scope:</strong> JavaScript-only
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  8
                </div>
                <h3 className="text-xl font-bold text-gray-900">ContextChangeAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects unexpected context changes on focus/input: automatic navigation, unsolicited
                form submission, popup windows.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 3.2.1, 3.2.2 | <strong>Scope:</strong> JavaScript-only
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-paradise-blue hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-paradise-blue/10 rounded-lg flex items-center justify-center text-paradise-blue font-bold">
                  9
                </div>
                <h3 className="text-xl font-bold text-gray-900">FormValidationAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects form validation without accessible error announcements, aria-invalid, or
                aria-describedby connections.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 3.3.1, 3.3.3 | <strong>Scope:</strong> JavaScript-only
              </div>
            </div>
          </div>

          {/* Limitations */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              Limitations of JavaScript-Only Analysis
            </h3>
            <div className="space-y-3 text-gray-800">
              <p className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-xl">❌</span>
                <span><strong>False Positives:</strong> Cannot see handlers split across multiple files
                (click in one file, keyboard in another)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-xl">❌</span>
                <span><strong>Missing Context:</strong> Cannot validate references to HTML elements
                (getElementById, querySelector)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-xl">❌</span>
                <span><strong>No CSS Awareness:</strong> Cannot detect conflicts between CSS visibility
                and focusability</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-xl">❌</span>
                <span><strong>Incomplete ARIA Validation:</strong> Cannot verify aria-labelledby,
                aria-describedby point to real elements</span>
              </p>
              <div className="mt-6 pt-6 border-t-2 border-yellow-300">
                <p className="text-lg font-semibold text-yellow-900">
                  <span className="text-2xl">📊</span> These limitations affect <strong>88% of real-world projects</strong> where
                  code is organized across multiple files for maintainability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transition Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">The Solution: Multi-Model Architecture</h2>
            <p className="text-lg opacity-95 max-w-3xl mx-auto mb-6">
              To eliminate these limitations, Paradise evolved to analyze HTML, JavaScript, and CSS together.
              This unlocks new detections and eliminates false positives.
            </p>
            <div className="inline-block bg-white/20 backdrop-blur rounded-lg px-6 py-3">
              <span className="text-2xl font-bold">JavaScript-only → Multi-model = 88% fewer false positives</span>
            </div>
          </div>
        </div>

        {/* Phase 2: Multi-Model Architecture */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-xl p-8 text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 text-center">Phase 2: Multi-Model Analyzers</h2>
            <p className="text-lg text-center opacity-95 max-w-3xl mx-auto">
              Five powerful analyzers that leverage the complete codebase context. Some enhance existing
              detection, others enable entirely new capabilities.
            </p>
          </div>

          {/* Multi-Model Analyzer 1: MouseOnlyClickAnalyzer */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-paradise-blue mb-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-paradise-blue rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                10
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">MouseOnlyClickAnalyzer</h2>
                <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  ENHANCED with Multi-Model
                </div>
                <p className="text-lg text-gray-600">
                  Detects interactive elements with click handlers but no keyboard support - now with zero
                  false positives
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What It Detects</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Elements with click handlers but no keyboard handlers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Interactive divs/spans without role or keyboard support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Buttons/links with only mouse event handlers
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">WCAG Criteria</h3>
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    <span className="font-mono text-sm text-red-800">2.1.1 Keyboard (Level A)</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    <span className="font-mono text-sm text-red-800">2.1.3 Keyboard (No Exception) (Level AAA)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Model Advantage</h3>
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                  <p className="text-green-900 font-semibold mb-2">✅ Eliminates False Positives</p>
                  <p className="text-gray-700 text-sm">
                    Traditional analyzers report errors when click and keyboard handlers are in separate files.
                    Paradise analyzes all files together, seeing the complete picture.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
{`// click-handlers.js
button.addEventListener('click', submitForm);

// keyboard-handlers.js
button.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitForm();
});

// ✅ Paradise sees BOTH files
// ❌ Old analyzer: false positive`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Model Analyzer 2-5 continue with same detailed format... */}
          {/* For brevity, I'll summarize the remaining 4 */}

          {/* Analyzer 2: OrphanedEventHandlerAnalyzer */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-red-500 mb-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                11
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">OrphanedEventHandlerAnalyzer</h2>
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  NEW - Requires Multi-Model
                </div>
                <p className="text-lg text-gray-600">
                  Detects JavaScript handlers attached to non-existent elements (typos, removed elements)
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What It Detects</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Handlers targeting elements that don't exist in HTML
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Typos in element IDs or selectors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    References to removed/renamed elements
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">WCAG Criteria</h3>
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    <span className="font-mono text-sm text-red-800">2.1.1 Keyboard (Level A)</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    <span className="font-mono text-sm text-red-800">4.1.2 Name, Role, Value (Level A)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Example Issue</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
{`<!-- HTML: id="submitButton" -->
<button id="submitButton">Submit</button>

// JavaScript: Typo!
const btn = document.getElementById('sumbitButton');
//                                    ^ missing 'b'
btn.addEventListener('click', handler);
// ✗ Handler never attaches (btn is null)`}
                  </pre>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900 font-mono">
                    💡 Did you mean 'submitButton'?<br />
                    Edit distance: 1 character
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analyzers 3-5 with similar detail... */}
          <div className="space-y-12">
            {/* Analyzer 11 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-pink-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">12</div>
                <div>
                  <h3 className="text-2xl font-bold">MissingAriaConnectionAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">NEW - Requires Multi-Model</div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">Validates ARIA relationship attributes (aria-labelledby, aria-describedby, aria-controls) point to actual elements</p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 1.3.1, 4.1.2 | <strong>Impact:</strong> Screen readers can't announce proper labels
              </div>
            </div>

            {/* Analyzer 12 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-teal-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">13</div>
                <div>
                  <h3 className="text-2xl font-bold">VisibilityFocusConflictAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">NEW - Requires Multi-Model</div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">Detects focusable elements hidden by CSS (display:none, visibility:hidden, opacity:0)</p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.4.7, 2.4.3 | <strong>Impact:</strong> Keyboard users tab to "nothing"
              </div>
            </div>

            {/* Analyzer 13 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-purple-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">14</div>
                <div>
                  <h3 className="text-2xl font-bold">FocusOrderConflictAnalyzer</h3>
                  <div className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">ENHANCED with Multi-Model</div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">Detects problematic tabindex patterns that create confusing navigation (non-sequential, duplicates, gaps)</p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.4.3, 2.4.7 | <strong>Impact:</strong> Chaotic focus flow confuses users
              </div>
            </div>

            {/* Analyzer 14 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">15</div>
                <div>
                  <h3 className="text-2xl font-bold">ARIASemanticAnalyzer</h3>
                  <div className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">NEW - Phase 2</div>
                </div>
              </div>
              <p className="text-gray-700 mb-2">
                Validates ARIA semantics - detects invalid roles, interactive roles without handlers, static aria-expanded,
                missing required attributes, overuse of assertive live regions, and aria-label issues
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-3">
                <strong>WCAG:</strong> 4.1.2, 4.1.3, 2.5.3, 2.1.1 | <strong>Impact:</strong> Broken ARIA implementation confuses screen readers
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-red-50 text-red-800 px-2 py-1 rounded">✓ invalid-role</div>
                <div className="bg-red-50 text-red-800 px-2 py-1 rounded">✓ interactive-role-static</div>
                <div className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded">✓ aria-expanded-static</div>
                <div className="bg-red-50 text-red-800 px-2 py-1 rounded">✓ dialog-missing-label</div>
                <div className="bg-red-50 text-red-800 px-2 py-1 rounded">✓ missing-required-aria</div>
                <div className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded">✓ assertive-live-region</div>
                <div className="bg-red-50 text-red-800 px-2 py-1 rounded">✓ aria-hidden-true</div>
                <div className="bg-blue-50 text-blue-800 px-2 py-1 rounded">✓ aria-label-overuse</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3: React-Specific Analyzers */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-react-blue to-react-cyan rounded-2xl shadow-xl p-8 text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 text-center">Phase 3: React Framework Analysis</h2>
            <p className="text-lg text-center opacity-95 max-w-3xl mx-auto">
              Unified React analyzer detecting accessibility issues in React patterns: useEffect focus management, portals, and event propagation.
              Follows Paradise architecture using ReactActionLanguageExtractor.
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            {/* Analyzer 16: ReactA11yAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-react-blue">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-react-blue rounded-lg flex items-center justify-center text-white text-xl font-bold">16</div>
                <div>
                  <h3 className="text-2xl font-bold">ReactA11yAnalyzer</h3>
                  <div className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">NEW - Unified React Analyzer</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Unified analyzer for all React accessibility issues: useEffect focus management, portals, and event propagation.
              </p>

              <div className="space-y-3">
                {/* useEffect Focus Management */}
                <div className="bg-blue-50 rounded p-3">
                  <h4 className="font-semibold text-blue-900 mb-2">1. useEffect Focus Management</h4>
                  <p className="text-sm text-gray-700 mb-2">Detects useEffect with .focus() or .blur() that lack cleanup functions.</p>
                  <div className="text-xs text-gray-600">
                    <strong>Issue:</strong> <code>react-useeffect-focus-cleanup</code> (WARNING)
                  </div>
                </div>

                {/* React Portals */}
                <div className="bg-cyan-50 rounded p-3">
                  <h4 className="font-semibold text-cyan-900 mb-2">2. React Portals</h4>
                  <p className="text-sm text-gray-700 mb-2">Detects ReactDOM.createPortal() that breaks focus management and ARIA.</p>
                  <div className="text-xs text-gray-600">
                    <strong>Issue:</strong> <code>react-portal-accessibility</code> (WARNING/ERROR)
                  </div>
                </div>

                {/* Event Propagation */}
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">3. Event Propagation</h4>
                  <p className="text-sm text-gray-700 mb-2">Detects stopPropagation() that blocks assistive technology.</p>
                  <div className="text-xs text-gray-600">
                    <strong>Issues:</strong> <code>react-stopPropagation</code> (WARNING), <code>react-stopImmediatePropagation</code> (ERROR)
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mt-4">
                <strong>WCAG:</strong> 2.1.1, 2.4.3, 4.1.2 | <strong>Impact:</strong> Focus leaks, broken ARIA, blocked AT
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4: Structural HTML Analyzers */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 text-center">Phase 4: Structural HTML Analysis</h2>
            <p className="text-lg text-center opacity-95 max-w-3xl mx-auto">
              New analyzers based on auto_a11y_python touchpoints, validating document structure and semantic HTML.
              These detect common WCAG failures in heading hierarchy, page structure, and HTML semantics.
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-6">
            {/* Analyzer 14: HeadingStructureAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-orange-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">14</div>
                <div>
                  <h3 className="text-2xl font-bold">HeadingStructureAnalyzer</h3>
                  <div className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">NEW - Phase 4 (From auto_a11y_python)</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Validates heading hierarchy and structure to ensure proper document outline for screen reader navigation.
                Detects empty headings, skipped levels, missing/multiple H1, and ARIA heading pattern issues.
              </p>

              <div className="space-y-3 mb-4">
                {/* H1 Validation */}
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">H1 Presence & Uniqueness</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">no-h1-on-page</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">multiple-h1-headings</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">page-doesnt-start-with-h1</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">no-headings-on-page</div>
                  </div>
                </div>

                {/* Hierarchy Validation */}
                <div className="bg-orange-50 rounded p-3">
                  <h4 className="font-semibold text-orange-900 mb-2">Hierarchy & Content</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">heading-levels-skipped</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">empty-heading</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">hidden-heading</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">heading-too-long</div>
                  </div>
                </div>

                {/* ARIA Patterns */}
                <div className="bg-purple-50 rounded p-3">
                  <h4 className="font-semibold text-purple-900 mb-2">ARIA Heading Patterns</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">aria-level-without-role</div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">heading-near-length-limit</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 1.3.1, 2.4.1, 2.4.6, 2.4.10, 4.1.2 | <strong>Impact:</strong> Screen readers rely on headings for navigation
              </div>
            </div>
            {/* Analyzer 15: FormLabelAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">15</div>
                <div>
                  <h3 className="text-2xl font-bold">FormLabelAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Detects form labeling issues to ensure all form inputs have proper accessible labels for screen readers.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Label Detection</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">missing-form-label</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">placeholder-only-label</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">empty-form-label</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">broken-label-for</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">title-only-label</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 1.3.1, 3.3.2, 4.1.2 | <strong>Impact:</strong> Screen readers need proper labels
              </div>
            </div>

            {/* Analyzer 16: AltTextAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">16</div>
                <div>
                  <h3 className="text-2xl font-bold">AltTextAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Validates image alt text quality and detects common mistakes like HTML tags, URLs, or file paths in alt text.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Alt Text Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">missing-alt-attribute</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">alt-only-whitespace</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">alt-contains-html</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">alt-contains-url</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">alt-contains-filepath</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">alt-ends-with-extension</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">alt-too-long</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">alt-generic</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 1.1.1 | <strong>Impact:</strong> Images must have text alternatives
              </div>
            </div>

            {/* Analyzer 17: LandmarkStructureAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">17</div>
                <div>
                  <h3 className="text-2xl font-bold">LandmarkStructureAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Validates landmark regions and page structure for proper navigation. Detects missing main landmark, duplicate landmarks without labels.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Landmark Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">missing-main-landmark</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">multiple-main-without-labels</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">redundant-landmark-role</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">unlabeled-landmark</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">section-without-label</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">main-nested-in-landmark</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 1.3.1, 2.4.1, 4.1.2 | <strong>Impact:</strong> Landmarks enable page navigation
              </div>
            </div>

            {/* Analyzer 18: LinkTextAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">18</div>
                <div>
                  <h3 className="text-2xl font-bold">LinkTextAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Detects link text quality issues including generic text, empty links, and duplicate link text pointing to different destinations.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Link Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">empty-link-text</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">link-image-no-alt</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">generic-link-text</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">link-url-as-text</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">duplicate-link-text</div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">link-text-too-long</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.4.4, 2.4.9, 4.1.2 | <strong>Impact:</strong> Links must have descriptive, unique text
              </div>
            </div>

            {/* Analyzer 19: SingleLetterShortcutAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">19</div>
                <div>
                  <h3 className="text-2xl font-bold">SingleLetterShortcutAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Detects keyboard shortcuts using single characters without modifier keys. These can interfere with screen readers and speech input software.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-yellow-50 rounded p-3">
                  <h4 className="font-semibold text-yellow-900 mb-2">Shortcut Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">single-letter-shortcut</div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">single-letter-shortcut-focus-only</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.1.4 | <strong>Impact:</strong> Single character shortcuts must have turn-off, remap, or focus-only mechanism
              </div>
            </div>

            {/* Analyzer 20: LanguageAttributeAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">20</div>
                <div>
                  <h3 className="text-2xl font-bold">LanguageAttributeAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Validates language attributes on HTML elements. Detects missing or invalid lang attributes on the html element and checks for empty or invalid language codes on other elements.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Language Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">missing-html-lang</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">empty-html-lang</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">empty-lang-attribute</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">invalid-html-lang</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">invalid-lang-attribute</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 3.1.1, 3.1.2 | <strong>Impact:</strong> Screen readers need valid language codes to pronounce content correctly
              </div>
            </div>

            {/* Analyzer 21: AnimationControlAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">21</div>
                <div>
                  <h3 className="text-2xl font-bold">AnimationControlAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Detects animations and auto-playing media without proper user controls. Checks for CSS animations, JavaScript animations, and video/audio autoplay without pause mechanisms.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Auto-Play Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">auto-play-audio-no-controls</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">auto-play-video-no-controls</div>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded p-3">
                  <h4 className="font-semibold text-yellow-900 mb-2">Animation Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">animation-no-reduced-motion</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">looping-video-no-controls</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">infinite-animation-no-controls</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">setinterval-animation-no-controls</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded p-3">
                  <h4 className="font-semibold text-blue-900 mb-2">Motion Preference Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">raf-no-reduced-motion</div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">parallax-no-reduced-motion</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.2.2, 2.3.3, 1.4.2 | <strong>Impact:</strong> Users must be able to pause/stop animations; respect prefers-reduced-motion for accessibility
              </div>
            </div>

            {/* Analyzer 22: ModalAccessibilityAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">22</div>
                <div>
                  <h3 className="text-2xl font-bold">ModalAccessibilityAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Detects accessibility issues with modal dialogs. Verifies proper ARIA roles, focus management, escape handling, and focus traps for keyboard users.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Critical Modal Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">modal-missing-role</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">modal-missing-label</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">modal-no-escape-handler</div>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded p-3">
                  <h4 className="font-semibold text-yellow-900 mb-2">Modal Best Practices</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">modal-missing-aria-modal</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">modal-no-close-button</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">modal-no-focus-trap</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">modal-no-focus-management</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.1.2, 2.4.3, 4.1.2 | <strong>Impact:</strong> Critical for keyboard/screen reader users to escape modals and maintain focus context
              </div>
            </div>

            {/* Analyzer 23: ButtonLabelAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">23</div>
                <div>
                  <h3 className="text-2xl font-bold">ButtonLabelAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Detects buttons without accessible labels. Verifies all button elements have proper text content, aria-label, or aria-labelledby for screen readers.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Button Label Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">button-empty-label</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">button-icon-no-label</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">button-nested-interactive</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">button-image-no-alt</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 4.1.2 (Name, Role, Value), 1.1.1 (Non-text Content) | <strong>Impact:</strong> Critical - screen reader users cannot interact with unlabeled buttons
              </div>
            </div>

            {/* Analyzer 24: TableAccessibilityAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">24</div>
                <div>
                  <h3 className="text-2xl font-bold">TableAccessibilityAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Detects accessibility issues with data tables. Verifies proper use of table headers, scope attributes, captions, and complex table associations for screen reader navigation.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-red-50 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">Critical Table Issues</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">table-no-headers</div>
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded">table-invalid-headers</div>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded p-3">
                  <h4 className="font-semibold text-yellow-900 mb-2">Table Best Practices</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">table-no-caption</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">table-header-no-scope</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">table-complex-no-headers</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded p-3">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">table-no-structure</div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">table-layout-missing-role</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 1.3.1 (Info and Relationships) | <strong>Impact:</strong> High - screen readers need table structure to navigate data relationships
              </div>
            </div>

            {/* Analyzer 25: DeprecatedKeyCodeAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">25</div>
                <div>
                  <h3 className="text-2xl font-bold">DeprecatedKeyCodeAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Detects usage of deprecated keyboard event properties (keyCode, which, charCode). Recommends modern event.key and event.code alternatives for better maintainability.
              </p>

              <div className="space-y-3 mb-4">
                <div className="bg-yellow-50 rounded p-3">
                  <h4 className="font-semibold text-yellow-900 mb-2">Deprecated APIs</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">deprecated-keycode</div>
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">deprecated-which</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded p-3">
                  <h4 className="font-semibold text-blue-900 mb-2">Code Quality</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">numeric-key-comparison</div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">deprecated-charcode</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.1.1 (Keyboard) | <strong>Impact:</strong> Low - still works but deprecated since 2016, use event.key for modern code
              </div>
            </div>

            {/* AriaStateManagementAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">AriaStateManagementAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Detects ARIA state attributes (aria-expanded, aria-checked, aria-pressed, aria-selected) that are set
                initially but never updated when state changes. Critical for dynamic widgets like accordions, tabs, and toggles.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 4.1.2 (Name, Role, Value) | <strong>Issue Types:</strong> 1 (aria-state-static)
              </div>
            </div>

            {/* FormSubmissionAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">FormSubmissionAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Detects forms submitted via JavaScript without proper validation, error handling, or success feedback.
                Ensures forms use native submit buttons and provide accessible feedback for all submission outcomes.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 3.3.1 (Error Identification), 3.3.3 (Error Suggestion) | <strong>Issue Types:</strong> 4
              </div>
            </div>

            {/* KeyboardTrapAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">KeyboardTrapAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Detects potential keyboard traps where Tab key is intercepted without providing an escape mechanism
                (Escape key or documented exit method). Critical for modals, dialogs, and custom focus management.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.1.2 (No Keyboard Trap) | <strong>Issue Types:</strong> 2 (keyboard-trap, modal-keyboard-trap)
              </div>
            </div>

            {/* MouseOnlyClickAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">MouseOnlyClickAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Detects click handlers on non-interactive elements without keyboard equivalents. Ensures all
                clickable elements respond to Enter and Space keys. Critical for keyboard-only users.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 2.1.1 (Keyboard) | <strong>Issue Types:</strong> 1 (mouse-only-click)
              </div>
            </div>

            {/* NestedInteractiveElementsAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">NestedInteractiveElementsAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Detects nested interactive elements (button inside button, link inside button, etc.) which cause
                unpredictable behavior and confuse screen readers. Validates proper interactive element nesting.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 4.1.2 (Name, Role, Value) | <strong>Issue Types:</strong> 3 (nested-buttons, nested-links, nested-interactive)
              </div>
            </div>

            {/* OrphanedEventHandlerAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">OrphanedEventHandlerAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Detects event handlers that target elements by selector but the target element doesn't exist in the DOM.
                Identifies broken interactions and helps prevent runtime errors in accessibility features.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 4.1.2 (Name, Role, Value) | <strong>Issue Types:</strong> 2 (orphaned-click-handler, orphaned-keyboard-handler)
              </div>
            </div>

            {/* WidgetPatternAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">WidgetPatternAnalyzer</h3>
                  <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">✓ IMPLEMENTED</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Validates 21 WAI-ARIA widget patterns (tabs, accordion, dialog, combobox, menu, tree, etc.). Checks for
                required ARIA attributes, keyboard navigation, and focus management. Comprehensive pattern validation
                for complex interactive widgets.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                <strong>WCAG:</strong> 4.1.2 (Name, Role, Value) | <strong>Issue Types:</strong> 21+ widget patterns
              </div>
            </div>
          </div>

          {/* Framework-Specific Analyzers */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-purple-900 mb-3">Framework-Specific Analyzers</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <strong className="text-purple-900">AngularReactivityAnalyzer</strong>
                <p className="text-xs mt-1">Detects Angular change detection issues affecting accessibility updates</p>
              </div>
              <div>
                <strong className="text-purple-900">SvelteReactivityAnalyzer</strong>
                <p className="text-xs mt-1">Validates Svelte reactive statements update ARIA attributes correctly</p>
              </div>
              <div>
                <strong className="text-purple-900">VueReactivityAnalyzer</strong>
                <p className="text-xs mt-1">Checks Vue reactivity system properly updates accessibility state</p>
              </div>
            </div>
          </div>

        </div>

        {/* Phase 5: Production Hardening & Edge Cases (Sprint 14) */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-xl p-8 text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 text-center">Phase 5: Production Hardening & Edge Cases</h2>
            <p className="text-lg text-center opacity-95 max-w-3xl mx-auto">
              Sprint 14 adds 6 advanced analyzers covering color contrast, live regions, autocomplete,
              orientation locks, timing requirements, and touch target sizes. These analyzers catch
              production-critical issues often missed by other tools.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* ColorContrastAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Sprint 14</div>
                <h3 className="text-2xl font-bold">ColorContrastAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Calculates color contrast ratios between text and backgrounds. Detects insufficient contrast
                that makes text difficult to read for users with low vision or color blindness. Validates
                against WCAG Level AA (4.5:1) and AAA (7:1) requirements.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">
                <strong>WCAG:</strong> 1.4.3 (Contrast Minimum) | <strong>Issue Types:</strong> 2
              </div>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium text-green-600 hover:text-green-700">
                  View Issue Types
                </summary>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li><strong>insufficient-contrast-ratio</strong> (error/warning) - Text contrast below WCAG thresholds</li>
                  <li><strong>insufficient-contrast-large-text</strong> (warning) - Large text with insufficient contrast</li>
                </ul>
              </details>
            </div>

            {/* LiveRegionAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Sprint 14</div>
                <h3 className="text-2xl font-bold">LiveRegionAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects ARIA live regions that are never updated, dynamic content updates without live regions,
                incorrect politeness levels, and excessive update frequency. Critical for status messages,
                notifications, and dynamic content announcements.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">
                <strong>WCAG:</strong> 4.1.3 (Status Messages) | <strong>Issue Types:</strong> 5
              </div>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium text-green-600 hover:text-green-700">
                  View Issue Types
                </summary>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li><strong>live-region-never-updated</strong> (warning) - aria-live set but content never changes</li>
                  <li><strong>updates-without-live-region</strong> (warning) - Dynamic updates not in live region</li>
                  <li><strong>incorrect-politeness</strong> (info) - Wrong aria-live politeness level</li>
                  <li><strong>redundant-role-alert</strong> (info) - Using both role="alert" and aria-live</li>
                  <li><strong>invalid-live-region-role</strong> (error) - Invalid role for live region</li>
                </ul>
              </details>
            </div>

            {/* AutocompleteAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Sprint 14</div>
                <h3 className="text-2xl font-bold">AutocompleteAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects missing or incorrect autocomplete attributes on form inputs. Validates against 53
                autocomplete tokens from HTML spec. Critical for form usability, especially on mobile devices
                and with assistive technologies. Enables password managers and autofill features.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">
                <strong>WCAG:</strong> 1.3.5 (Identify Input Purpose) | <strong>Issue Types:</strong> 3
              </div>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium text-green-600 hover:text-green-700">
                  View Issue Types
                </summary>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li><strong>missing-autocomplete</strong> (warning) - Input collects personal data without autocomplete</li>
                  <li><strong>invalid-autocomplete-value</strong> (error) - Invalid autocomplete token used</li>
                  <li><strong>autocomplete-off-discouraged</strong> (info) - autocomplete="off" on personal data fields</li>
                </ul>
              </details>
            </div>

            {/* OrientationLockAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Sprint 14</div>
                <h3 className="text-2xl font-bold">OrientationLockAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects Screen Orientation API usage that locks device orientation, preventing users from
                viewing content in their preferred orientation. Catches matchMedia-based content blocking.
                Essential for mobile accessibility and users with mounted devices.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">
                <strong>WCAG:</strong> 1.3.4 (Orientation) | <strong>Issue Types:</strong> 3
              </div>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium text-green-600 hover:text-green-700">
                  View Issue Types
                </summary>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li><strong>screen-orientation-lock</strong> (error) - Uses Screen Orientation API to lock</li>
                  <li><strong>matchmedia-orientation-restriction</strong> (warning) - JavaScript blocks content by orientation</li>
                  <li><strong>css-orientation-lock</strong> (planned) - CSS hides content in one orientation</li>
                </ul>
              </details>
            </div>

            {/* TimeoutAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Sprint 14</div>
                <h3 className="text-2xl font-bold">TimeoutAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects setTimeout/setInterval usage that creates time limits without user control. Identifies
                session timeouts, automatic redirects, countdown timers without extension mechanisms. Validates
                against WCAG 20-hour threshold. Critical for users who need more time to complete tasks.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">
                <strong>WCAG:</strong> 2.2.1 (Timing Adjustable) | <strong>Issue Types:</strong> 4
              </div>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium text-green-600 hover:text-green-700">
                  View Issue Types
                </summary>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li><strong>session-timeout-no-warning</strong> (error/warning) - Session expires without warning</li>
                  <li><strong>automatic-redirect-no-control</strong> (warning) - Redirect without user control</li>
                  <li><strong>countdown-timer-no-extension</strong> (warning) - Timer without extension ability</li>
                  <li><strong>inactivity-timeout-too-short</strong> (info) - Inactivity timeout under 20 hours</li>
                </ul>
              </details>
            </div>

            {/* PointerTargetAnalyzer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Sprint 14</div>
                <h3 className="text-2xl font-bold">PointerTargetAnalyzer</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Detects interactive elements with insufficient touch target size. Validates against WCAG Level AA
                (24×24px) and AAA (44×44px) requirements. Checks spacing between adjacent targets. Critical for
                mobile users and those with motor disabilities, tremors, or limited dexterity.
              </p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">
                <strong>WCAG:</strong> 2.5.5 (Level AAA), 2.5.8 (Level AA) | <strong>Issue Types:</strong> 3
              </div>
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium text-green-600 hover:text-green-700">
                  View Issue Types
                </summary>
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li><strong>touch-target-too-small</strong> (error/warning/info) - Target smaller than 24×24px or 44×44px</li>
                  <li><strong>adjacent-targets-too-close</strong> (warning) - Interactive elements without spacing</li>
                  <li><strong>inline-link-insufficient-target</strong> (info) - Inline links without adequate spacing</li>
                </ul>
              </details>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple p-6">
              <h2 className="text-3xl font-bold text-white text-center">Complete Analyzer Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Analyzer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phase</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Requires Multi-Model</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Primary WCAG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">StaticAriaAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      FocusManagementAnalyzer
                      <span className="block text-xs text-gray-500 mt-1">(6 issue types)</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.4.3, 2.4.7, 4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">3</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      KeyboardNavigationAnalyzer
                      <span className="block text-xs text-gray-500 mt-1">(9 issue types)</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.1.1, 2.1.2, 2.1.4, 4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">MissingLabelAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.3.1, 4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">MissingAltTextAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.1.1</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">TabIndexAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.4.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">7</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">RedundantRoleAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">8</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">ContextChangeAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">3.2.1, 3.2.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">9</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">FormValidationAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-paradise-blue/10 text-paradise-blue px-2 py-1 rounded">Phase 1</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">3.3.1, 3.3.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">10</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">MouseOnlyClickAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Phase 2</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Recommended</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.1.1</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">11</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">OrphanedEventHandlerAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Phase 2</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Required</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.1.1, 4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">12</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">MissingAriaConnectionAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Phase 2</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Required</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.3.1, 4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">13</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">VisibilityFocusConflictAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Phase 2</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Required</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.4.7, 2.4.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">14</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">FocusOrderConflictAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Phase 2</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Optional</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.4.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">15</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ARIASemanticAnalyzer
                      <span className="block text-xs text-gray-500 mt-1">(8 issue types)</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Phase 2</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2, 4.1.3, 2.5.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-cyan-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">16</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ReactA11yAnalyzer
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-react-cyan text-white">UNIFIED</span>
                      <span className="block text-xs text-gray-500 mt-1">(3 detection types: useEffect focus, portals, event propagation)</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-react-blue/20 text-react-blue px-2 py-1 rounded">Phase 3</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.1.1, 2.4.3, 4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">17</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">AriaStateManagementAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2, 4.1.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">18</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">FormSubmissionAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">3.3.1, 3.3.4</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">19</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">KeyboardTrapAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">20</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">NestedInteractiveElementsAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">21</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">WidgetPatternAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">22</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">HeadingStructureAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.3.1, 2.4.6</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">23</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">LandmarkAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.3.1</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">24</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">TableAccessibilityAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.3.1</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">25</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">LinkAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.4.4</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">26</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">LanguageAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">3.1.1, 3.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-orange-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">27</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">AngularReactivityAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2, 4.1.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-orange-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">28</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">VueReactivityAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2, 4.1.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-orange-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">29</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">SvelteReactivityAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded">Phase 4</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.2, 4.1.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">30</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">ColorContrastAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Sprint 14</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.4.3, 1.4.6</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">31</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">LiveRegionAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Sprint 14</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">4.1.3</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">32</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">AutocompleteAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Sprint 14</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.3.5</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">33</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">OrientationLockAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Sprint 14</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.3.4</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">34</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">TimeoutAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Sprint 14</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.2.1</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">35</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">PointerTargetAnalyzer</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded">Sprint 14</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.5.5, 2.5.8</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple rounded-2xl shadow-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Experience All 35 Analyzers</h2>
            <p className="text-lg opacity-95 mb-8">
              Try Paradise's complete analyzer suite - from behavioral to structural to framework-specific analysis - and see how
              multi-model analysis catches real accessibility issues across HTML, CSS, JavaScript, and ARIA.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/playground"
                className="bg-white text-paradise-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Interactive Playground
              </a>
              <a
                href="/examples"
                className="bg-white/20 backdrop-blur text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                View Examples
              </a>
              <a
                href="/architecture"
                className="bg-white/20 backdrop-blur text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Learn Architecture
              </a>
            </div>
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
