import Navigation from '../components/Navigation';

export default function AnalyzersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-paradise-blue/5 to-paradise-purple/5">
      <Navigation />

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-paradise-blue to-paradise-purple bg-clip-text text-transparent">
            Production Analyzers
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Five powerful analyzers leveraging multi-model architecture to detect accessibility issues
            with zero false positives.
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-paradise-blue/20">
              <div className="text-4xl font-bold text-paradise-blue mb-2">5</div>
              <div className="text-gray-600 font-medium">Production Analyzers</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-green-500/20">
              <div className="text-4xl font-bold text-green-600 mb-2">0</div>
              <div className="text-gray-600 font-medium">False Positives</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-purple-500/20">
              <div className="text-4xl font-bold text-purple-600 mb-2">95</div>
              <div className="text-gray-600 font-medium">Tests Passing</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-teal-500/20">
              <div className="text-4xl font-bold text-teal-600 mb-2">88%</div>
              <div className="text-gray-600 font-medium">Fewer False Positives</div>
            </div>
          </div>
        </div>

        {/* Analyzer 1: MouseOnlyClickAnalyzer */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-paradise-blue">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-paradise-blue rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">MouseOnlyClickAnalyzer</h2>
                <p className="text-lg text-gray-600">
                  Detects interactive elements with click handlers but no keyboard support
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">Example Issue</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
{`// click-handlers.js
button.addEventListener('click', () => {
  submitForm();
});

// ✗ Missing keyboard handler!
// Should also have:
button.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    submitForm();
  }
});`}
                  </pre>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">How Multi-Model Helps</h3>
                <p className="text-gray-700">
                  Traditional analyzers produce false positives when click and keyboard handlers are in separate files.
                  Paradise analyzes all files together, seeing the complete picture and eliminating these false alarms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analyzer 2: OrphanedEventHandlerAnalyzer */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-red-500">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">OrphanedEventHandlerAnalyzer</h2>
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
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Wrong selector patterns (class vs ID)
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

                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Suggestions</h3>
                <p className="text-gray-700 mb-2">
                  Paradise uses edit distance algorithms to suggest corrections:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900 font-mono">
                    Did you mean 'submitButton' instead of 'sumbitButton'?<br />
                    Edit distance: 1 character (high confidence)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyzer 3: MissingAriaConnectionAnalyzer */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-pink-500">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-pink-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">MissingAriaConnectionAnalyzer</h2>
                <p className="text-lg text-gray-600">
                  Validates ARIA relationship attributes point to actual elements
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What It Detects</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    aria-labelledby pointing to missing element
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    aria-describedby with non-existent target
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    aria-controls referencing removed elements
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    aria-owns, aria-activedescendant, aria-flowto broken links
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Validated Attributes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-activedescendant', 'aria-flowto', 'aria-errormessage'].map(attr => (
                    <div key={attr} className="bg-pink-50 border border-pink-200 rounded px-3 py-1">
                      <span className="font-mono text-xs text-pink-800">{attr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Example Issue</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
{`<button aria-labelledby="submitLabel">
  Submit
</button>

<!-- ✗ No element with id="submitLabel" -->

<!-- Should have: -->
<span id="submitLabel" class="sr-only">
  Submit the form
</span>`}
                  </pre>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">Impact on Users</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-gray-700">
                    <strong className="text-yellow-800">Screen reader hears:</strong> "Submit, button"<br />
                    <strong className="text-green-700">Should hear:</strong> "Submit the form, button"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyzer 4: VisibilityFocusConflictAnalyzer */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-teal-500">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-teal-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">VisibilityFocusConflictAnalyzer</h2>
                <p className="text-lg text-gray-600">
                  Detects focusable elements hidden by CSS (display:none, visibility:hidden, opacity:0)
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What It Detects</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Elements with tabindex but hidden by CSS
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Native focusable elements (button, input) with display:none
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Interactive elements hidden by opacity:0
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Allows legitimate screen-reader-only content
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">WCAG Criteria</h3>
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    <span className="font-mono text-sm text-red-800">2.4.7 Focus Visible (Level AA)</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    <span className="font-mono text-sm text-red-800">2.4.3 Focus Order (Level A)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Example Issue</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
{`<!-- HTML -->
<button class="hidden" tabindex="0">
  Close
</button>

/* CSS */
.hidden {
  display: none;
}

/* ✗ Button is focusable but invisible
   User tabs to nothing! */`}
                  </pre>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">Requires Multi-Model</h3>
                <p className="text-gray-700">
                  This analyzer is <strong>impossible</strong> without multi-model architecture. It requires
                  cross-referencing DOM focusability (HTML) with CSS visibility rules. Single-file analyzers
                  cannot detect this issue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analyzer 5: FocusOrderConflictAnalyzer */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-purple-500">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">FocusOrderConflictAnalyzer</h2>
                <p className="text-lg text-gray-600">
                  Detects problematic tabindex patterns that create confusing navigation
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What It Detects</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Non-sequential tabindex values (1, 3, 2 instead of 1, 2, 3)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Duplicate positive tabindex values
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Large gaps in sequence (1, 2, 100)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Backward focus flow (visual order ≠ tab order)
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">WCAG Criteria</h3>
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    <span className="font-mono text-sm text-red-800">2.4.3 Focus Order (Level A)</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    <span className="font-mono text-sm text-red-800">2.4.7 Focus Visible (Level AA)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Example Issue</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
{`<input placeholder="Name" tabindex="1">
<input placeholder="Email" tabindex="3">
<input placeholder="Phone" tabindex="2">
<button tabindex="4">Submit</button>

/* ✗ Focus order: Name → Email → Phone
   But user expects: Name → Phone → Email
   (backwards!) */`}
                  </pre>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">Best Practice</h3>
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <p className="text-gray-700">
                    <strong className="text-green-700">Recommendation:</strong> Don't use positive tabindex values.
                    Use natural DOM order instead. If custom order is needed, restructure your HTML.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple p-6">
              <h2 className="text-3xl font-bold text-white text-center">Analyzer Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Analyzer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Requires Multi-Model</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">False Positive Reduction</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Primary WCAG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">MouseOnlyClick</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Recommended</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">88-93%</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.1.1</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">OrphanedHandler</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Required</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">100%</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.1.1</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">MissingAriaConnection</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Required</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">100%</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">1.3.1, 4.1.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">VisibilityFocusConflict</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Required</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">N/A (impossible without)</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.4.7</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">FocusOrderConflict</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Optional</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">N/A (single file)</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">2.4.3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Try It */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple rounded-2xl shadow-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">See Analyzers in Action</h2>
            <p className="text-lg opacity-95 mb-8">
              Try our interactive demos to see how each analyzer detects issues and eliminates false positives.
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
