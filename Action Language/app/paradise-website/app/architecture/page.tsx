import Navigation from '../components/Navigation';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-paradise-blue/5 to-paradise-purple/5">
      <Navigation />

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-paradise-blue to-paradise-purple bg-clip-text text-transparent">
            Multi-Model Architecture
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Paradise analyzes HTML, JavaScript, and CSS together to eliminate false positives
            and provide accurate, context-aware accessibility analysis.
          </p>
        </div>

        {/* Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Architecture Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Traditional accessibility analyzers examine JavaScript files in isolation, leading to false positives
              when event handlers are split across multiple files. Paradise solves this with a <strong>multi-model
              architecture</strong> that understands your entire codebase.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-3">❌ Traditional Approach</h3>
                <ul className="space-y-2 text-red-800">
                  <li>• Analyzes one file at a time</li>
                  <li>• Cannot see cross-file relationships</li>
                  <li>• Produces false positives</li>
                  <li>• Misses HTML-side issues</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ Paradise Approach</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Analyzes all related files together</li>
                  <li>• Understands cross-file relationships</li>
                  <li>• Zero false positives</li>
                  <li>• Detects HTML + CSS + JS issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Three Models */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Three Models</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* DOMModel */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-paradise-blue/30 hover:border-paradise-blue hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-paradise-blue rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">DOMModel</h3>
              <p className="text-gray-700 mb-4">
                Parses HTML to create a complete DOM tree with all elements, attributes, IDs, classes, and ARIA relationships.
              </p>
              <div className="bg-gray-50 rounded p-3 text-sm font-mono text-gray-700">
                &lt;button id="submit"<br />
                &nbsp;&nbsp;aria-label="Submit"&gt;<br />
                &nbsp;&nbsp;Submit<br />
                &lt;/button&gt;
              </div>
            </div>

            {/* ActionLanguageModel */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-paradise-purple/30 hover:border-paradise-purple hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-paradise-purple rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ActionLanguageModel</h3>
              <p className="text-gray-700 mb-4">
                Parses JavaScript to extract event handlers, ARIA updates, focus changes, and DOM manipulations.
              </p>
              <div className="bg-gray-50 rounded p-3 text-sm font-mono text-gray-700">
                document<br />
                &nbsp;&nbsp;.getElementById('submit')<br />
                &nbsp;&nbsp;.addEventListener(<br />
                &nbsp;&nbsp;&nbsp;&nbsp;'click', handler<br />
                &nbsp;&nbsp;);
              </div>
            </div>

            {/* CSSModel */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-teal-400/30 hover:border-teal-400 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">CSSModel</h3>
              <p className="text-gray-700 mb-4">
                Parses CSS to detect styles affecting visibility, focus indicators, contrast, and interaction.
              </p>
              <div className="bg-gray-50 rounded p-3 text-sm font-mono text-gray-700">
                .hidden {'{'}<br />
                &nbsp;&nbsp;display: none;<br />
                {'}'}<br />
                button:focus {'{'}<br />
                &nbsp;&nbsp;outline: 2px solid;<br />
                {'}'}
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How Models Merge</h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-paradise-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Parse Each Source File</h3>
                  <p className="text-gray-700 mb-4">
                    Paradise parses HTML, JavaScript, and CSS files separately using specialized parsers:
                    parse5 for HTML, Acorn for JavaScript, css-tree for CSS.
                  </p>
                  <div className="bg-gray-50 rounded p-4 border border-gray-200">
                    <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
HTML: index.html → DOMModel (150 elements)<br />
JS: handlers.js → ActionLanguageModel (23 event handlers)<br />
CSS: styles.css → CSSModel (412 rules)
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-paradise-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Build Selector Index</h3>
                  <p className="text-gray-700 mb-4">
                    Create an index of all element IDs, classes, and selectors for fast O(1) lookup.
                  </p>
                  <div className="bg-gray-50 rounded p-4 border border-gray-200">
                    <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
Index: {'{'}<br />
&nbsp;&nbsp;'#submit': DOMElement(button),<br />
&nbsp;&nbsp;'.nav-item': [DOMElement(a), DOMElement(a), ...],<br />
&nbsp;&nbsp;'button': [DOMElement(button), DOMElement(button), ...]<br />
{'}'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-paradise-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cross-Reference via Selectors</h3>
                  <p className="text-gray-700 mb-4">
                    For each DOM element, find all JavaScript handlers and CSS rules that target it.
                  </p>
                  <div className="bg-gray-50 rounded p-4 border border-gray-200">
                    <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
Button#submit:<br />
&nbsp;&nbsp;jsHandlers: [<br />
&nbsp;&nbsp;&nbsp;&nbsp;{'{'} event: 'click', file: 'click-handlers.js:42' {'}'},<br />
&nbsp;&nbsp;&nbsp;&nbsp;{'{'} event: 'keydown', file: 'keyboard-handlers.js:18' {'}'}<br />
&nbsp;&nbsp;],<br />
&nbsp;&nbsp;cssRules: [<br />
&nbsp;&nbsp;&nbsp;&nbsp;{'{'} selector: 'button:focus', properties: {'{'} outline: '2px solid' {'}'} {'}'}<br />
&nbsp;&nbsp;]
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-paradise-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Element Context</h3>
                  <p className="text-gray-700 mb-4">
                    Create a unified view of each element with all its related behaviors and styles.
                  </p>
                  <div className="bg-gray-50 rounded p-4 border border-gray-200">
                    <pre className="text-sm font-mono text-gray-700 overflow-x-auto">
ElementContext {'{'}<br />
&nbsp;&nbsp;focusable: true,<br />
&nbsp;&nbsp;interactive: true,<br />
&nbsp;&nbsp;hasClickHandler: true,<br />
&nbsp;&nbsp;hasKeyboardHandler: true,<br />
&nbsp;&nbsp;hasFocusStyles: true,<br />
&nbsp;&nbsp;cssHidden: false<br />
{'}'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Architecture Benefits</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900">Zero False Positives</h3>
              </div>
              <p className="text-gray-700">
                By analyzing all files together, Paradise sees the complete picture. Handlers split across files
                are correctly recognized, eliminating false positives that plague traditional analyzers.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-gray-900">Deeper Detection</h3>
              </div>
              <p className="text-gray-700">
                Multi-model analysis enables detection of issues impossible with single-file analysis: orphaned
                handlers, broken ARIA connections, CSS visibility conflicts.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-gray-900">Fast Performance</h3>
              </div>
              <p className="text-gray-700">
                Intelligent caching and incremental parsing keep analysis fast. Small projects analyze in &lt;100ms,
                large projects in &lt;2s with background processing.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  📈
                </div>
                <h3 className="text-xl font-bold text-gray-900">Scalable</h3>
              </div>
              <p className="text-gray-700">
                Designed for real-world projects. Handles codebases from 10 files to 1000+ files efficiently.
                Incremental updates keep subsequent analyses fast.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Specifications</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Parsers Used</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-paradise-blue">▸</span>
                    <strong>HTML:</strong> parse5 (complete HTML5 support)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-paradise-blue">▸</span>
                    <strong>JavaScript:</strong> Acorn (fast ES2020+ parser)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-paradise-blue">▸</span>
                    <strong>CSS:</strong> css-tree (full CSS3 support)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Targets</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-paradise-blue">▸</span>
                    <strong>Small projects:</strong> &lt;100ms (real-time)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-paradise-blue">▸</span>
                    <strong>Medium projects:</strong> &lt;500ms (responsive)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-paradise-blue">▸</span>
                    <strong>Large projects:</strong> &lt;2s (background)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple rounded-2xl shadow-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Experience the Difference</h2>
            <p className="text-lg opacity-95 mb-8">
              Try Paradise's multi-model architecture and see how it eliminates false positives while
              catching issues other analyzers miss.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/playground"
                className="bg-white text-paradise-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Try Interactive Playground
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
