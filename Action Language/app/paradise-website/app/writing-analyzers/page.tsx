export default function WritingAnalyzersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Writing Analyzers for Paradise
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            Complete guide for developers and contributors who want to add new accessibility analyzers
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">

          {/* Table of Contents */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border-2 border-paradise-blue/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-0">Table of Contents</h2>
            <ol className="space-y-2">
              <li><a href="#introduction" className="text-paradise-blue hover:text-paradise-purple">Introduction</a></li>
              <li><a href="#architecture" className="text-paradise-blue hover:text-paradise-purple">Analyzer Architecture</a></li>
              <li><a href="#getting-started" className="text-paradise-blue hover:text-paradise-purple">Getting Started</a></li>
              <li><a href="#dual-mode" className="text-paradise-blue hover:text-paradise-purple">Dual-Mode Analysis Pattern</a></li>
              <li><a href="#documentmodel" className="text-paradise-blue hover:text-paradise-purple">Using DocumentModel</a></li>
              <li><a href="#actionlanguage" className="text-paradise-blue hover:text-paradise-purple">Using ActionLanguageModel</a></li>
              <li><a href="#confidence" className="text-paradise-blue hover:text-paradise-purple">Confidence Scoring</a></li>
              <li><a href="#testing" className="text-paradise-blue hover:text-paradise-purple">Testing Your Analyzer</a></li>
              <li><a href="#best-practices" className="text-paradise-blue hover:text-paradise-purple">Best Practices</a></li>
              <li><a href="#complete-example" className="text-paradise-blue hover:text-paradise-purple">Complete Example</a></li>
            </ol>
          </div>

          {/* Introduction */}
          <div id="introduction" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Paradise analyzers detect accessibility issues in web applications. Each analyzer extends the <code>BaseAnalyzer</code> class
              and implements a specific accessibility check (e.g., missing keyboard handlers, invalid ARIA attributes).
            </p>

            <div className="bg-blue-50 border-l-4 border-paradise-blue p-6 my-6 rounded-r-lg">
              <h3 className="text-xl font-bold text-paradise-blue mb-3">Key Characteristics</h3>
              <ul className="space-y-2">
                <li><strong>Dual-mode</strong>: Work with both file-scope (ActionLanguageModel) and document-scope (DocumentModel)</li>
                <li><strong>Zero false positives</strong>: Document-scope analysis sees complete context across files</li>
                <li><strong>Backward compatible</strong>: File-scope fallback ensures broad compatibility</li>
                <li><strong>Confidence-scored</strong>: Issues tagged with HIGH/MEDIUM/LOW confidence</li>
              </ul>
            </div>
          </div>

          {/* Analyzer Architecture */}
          <div id="architecture" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Analyzer Architecture</h2>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Base Components</h3>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';

export class MyAnalyzer extends BaseAnalyzer {
  readonly name = 'my-analyzer';
  readonly description = 'Detects my specific accessibility issue';

  analyze(context: AnalyzerContext): Issue[] {
    // Your analysis logic here
  }
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Analysis Context</h3>
            <p className="text-gray-700 mb-4">
              The <code>AnalyzerContext</code> provides access to available models:
            </p>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`interface AnalyzerContext {
  /** Full DocumentModel (HTML + JS + CSS) - preferred */
  documentModel?: DocumentModel;

  /** Single JS file model - fallback */
  actionLanguageModel?: ActionLanguageModel;

  /** Scope: 'file' | 'page' | 'workspace' */
  scope: AnalysisScope;
}`}
              </pre>
            </div>
          </div>

          {/* Getting Started */}
          <div id="getting-started" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Getting Started</h2>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Create Analyzer File</h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <code className="text-sm text-gray-800">touch src/analyzers/MyAccessibilityAnalyzer.ts</code>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Implement Basic Structure</h3>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';

export class MyAccessibilityAnalyzer extends BaseAnalyzer {
  readonly name = 'my-accessibility-check';
  readonly description = 'Checks for my specific accessibility issue';

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    // TODO: Add analysis logic
    return issues;
  }
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Register in Extension</h3>
            <p className="text-gray-700 mb-4">
              Add to <code>app/vscode-extension/src-ts/foregroundAnalyzer.ts</code>:
            </p>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`import { MyAccessibilityAnalyzer } from '../lib/analyzers/MyAccessibilityAnalyzer';

// In constructor:
this.analyzers = [
  // ... existing analyzers
  new MyAccessibilityAnalyzer(),
];`}
              </pre>
            </div>
          </div>

          {/* Dual-Mode Analysis Pattern */}
          <div id="dual-mode" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Dual-Mode Analysis Pattern</h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6 rounded-r-lg">
              <p className="text-gray-800 font-semibold mb-2">💡 Best Practice</p>
              <p className="text-gray-700">
                Implement both document-scope and file-scope analysis for maximum accuracy and compatibility.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Pattern Structure</h3>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`analyze(context: AnalyzerContext): Issue[] {
  // Prefer document-scope (zero false positives)
  if (this.supportsDocumentModel(context)) {
    return this.analyzeWithDocumentModel(context);
  }

  // Fall back to file-scope (legacy, may have false positives)
  if (context.actionLanguageModel) {
    return this.analyzeFileScope(context);
  }

  return [];
}

private analyzeWithDocumentModel(context: AnalyzerContext): Issue[] {
  // Analysis with full context
}

private analyzeFileScope(context: AnalyzerContext): Issue[] {
  // Limited analysis on single file
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">When to Use Each Mode</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-paradise-blue text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Mode</th>
                    <th className="px-6 py-3 text-left">Use When</th>
                    <th className="px-6 py-3 text-left">Confidence</th>
                    <th className="px-6 py-3 text-left">False Positives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-semibold">Document-scope</td>
                    <td className="px-6 py-4">HTML + JS + CSS available</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">HIGH</span></td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Zero</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">File-scope</td>
                    <td className="px-6 py-4">Only single JS file available</td>
                    <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">MEDIUM</span></td>
                    <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Possible</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Using DocumentModel */}
          <div id="documentmodel" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Using DocumentModel</h2>
            <p className="text-gray-700 mb-4">
              DocumentModel provides integrated access to HTML elements with their JavaScript handlers and CSS rules.
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Getting Interactive Elements</h3>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`private analyzeWithDocumentModel(context: AnalyzerContext): Issue[] {
  const issues: Issue[] = [];
  const documentModel = context.documentModel!;

  if (!documentModel.dom) return issues;

  // Get all interactive elements (buttons, links, clickable divs, etc.)
  const interactiveElements = documentModel.getInteractiveElements();

  for (const elementContext of interactiveElements) {
    if (this.hasIssue(elementContext)) {
      issues.push(this.createIssue(elementContext, context));
    }
  }

  return issues;
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">ElementContext Properties</h3>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-paradise-blue/20">
              <ul className="space-y-3">
                <li><code className="text-paradise-blue">element</code>: The DOM element</li>
                <li><code className="text-paradise-blue">jsHandlers</code>: JavaScript event handlers attached to this element</li>
                <li><code className="text-paradise-blue">cssRules</code>: CSS rules applied to this element</li>
                <li><code className="text-paradise-blue">focusable</code>: Is this element focusable?</li>
                <li><code className="text-paradise-blue">interactive</code>: Is this element interactive?</li>
                <li><code className="text-paradise-blue">hasClickHandler</code>: Does it have a click handler?</li>
                <li><code className="text-paradise-blue">hasKeyboardHandler</code>: Does it have a keyboard handler?</li>
                <li><code className="text-paradise-blue">role</code>: ARIA role (explicit or implicit)</li>
                <li><code className="text-paradise-blue">label</code>: ARIA label (computed)</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Common Checks</h3>

            <h4 className="text-xl font-bold text-gray-700 mb-3">Check for Missing Keyboard Handlers</h4>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`for (const ctx of interactiveElements) {
  // Skip native interactive elements (they have built-in keyboard support)
  if (this.hasNativeKeyboardSupport(ctx.element)) {
    continue;
  }

  if (ctx.hasClickHandler && !ctx.hasKeyboardHandler) {
    issues.push(
      this.createIssue(
        'missing-keyboard-handler',
        'error',
        'Click handler without keyboard alternative',
        ctx.element.location,
        ['2.1.1'], // WCAG 2.1.1: Keyboard
        context,
        { elementContext: ctx }
      )
    );
  }
}`}
              </pre>
            </div>

            <h4 className="text-xl font-bold text-gray-700 mb-3">Check for Hidden Focusable Elements</h4>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`for (const ctx of interactiveElements) {
  // Check if element is hidden by CSS
  const isHidden = ctx.cssRules.some(rule =>
    rule.properties.some(prop =>
      (prop.property === 'display' && prop.value === 'none') ||
      (prop.property === 'visibility' && prop.value === 'hidden')
    )
  );

  if (ctx.focusable && isHidden) {
    issues.push(
      this.createIssue(
        'hidden-focusable',
        'warning',
        'Focusable element is hidden by CSS',
        ctx.element.location,
        ['2.4.3'], // WCAG 2.4.3: Focus Order
        context
      )
    );
  }
}`}
              </pre>
            </div>
          </div>

          {/* Best Practices */}
          <div id="best-practices" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices</h2>

            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ 1. Always Implement Both Modes</h3>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <pre className="text-sm text-gray-800">
{`analyze(context) {
  if (this.supportsDocumentModel(context)) {
    return this.analyzeWithDocumentModel(context);
  }
  if (context.actionLanguageModel) {
    return this.analyzeFileScope(context);
  }
  return [];
}`}
                  </pre>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ 2. Skip Native Interactive Elements</h3>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <pre className="text-sm text-gray-800">
{`if (this.hasNativeKeyboardSupport(element)) {
  continue; // Skip <button>, <a>, etc.
}`}
                  </pre>
                </div>
                <p className="text-gray-700 text-sm">
                  Prevents false positives on elements like <code>&lt;button&gt;</code> that have built-in keyboard support.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ 3. Provide Helpful Messages</h3>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <pre className="text-sm text-gray-800">
{`// Good: Specific and actionable
'<button> element with id="submit" has click handler but no keyboard handler.
All interactive elements must be keyboard accessible (WCAG 2.1.1).'

// Bad: Vague
'Missing keyboard handler'`}
                  </pre>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ 4. Use Correct WCAG Criteria</h3>
                <p className="text-gray-700 mb-3">Map to specific WCAG 2.1 success criteria:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><code>2.1.1</code> - Keyboard</li>
                  <li><code>2.1.2</code> - No Keyboard Trap</li>
                  <li><code>2.4.3</code> - Focus Order</li>
                  <li><code>2.4.7</code> - Focus Visible</li>
                  <li><code>4.1.2</code> - Name, Role, Value</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">✅ 5. Optimize Performance</h3>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <pre className="text-sm text-gray-800">
{`// Good: Only check relevant elements
const interactiveElements = documentModel.getInteractiveElements();

// Bad: Checks every element including <p>, <span>, etc.
const allElements = documentModel.getAllElements();`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Example */}
          <div id="complete-example" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Example</h2>
            <p className="text-gray-700 mb-4">
              Here's a complete analyzer that checks for orphaned event handlers:
            </p>
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
{`/**
 * Orphaned Event Handler Analyzer
 * Detects JavaScript handlers attached to non-existent elements
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';

export class OrphanedEventHandlerAnalyzer extends BaseAnalyzer {
  readonly name = 'orphaned-event-handler';
  readonly description = 'Detects event handlers attached to non-existent elements';

  analyze(context: AnalyzerContext): Issue[] {
    // Document-scope only - file-scope can't detect this issue
    if (this.supportsDocumentModel(context)) {
      return this.analyzeWithDocumentModel(context);
    }
    return [];
  }

  private analyzeWithDocumentModel(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const documentModel = context.documentModel!;

    if (!documentModel.dom || !documentModel.actionLanguage) {
      return issues;
    }

    // Get all event handlers from JavaScript
    const allHandlers: ActionLanguageNode[] = [];
    for (const model of documentModel.actionLanguage) {
      allHandlers.push(...model.findAllEventHandlers());
    }

    for (const handler of allHandlers) {
      const selector = handler.element.selector;
      const matchingElements = documentModel.querySelectorAll(selector);

      if (matchingElements.length === 0) {
        // Handler attached to non-existent element!
        issues.push(
          this.createIssue(
            'orphaned-event-handler',
            'warning',
            \`Event handler attached to selector "\${selector}" but no matching element exists in DOM.\`,
            handler.location,
            [], // Not a WCAG violation, but still an issue
            context
          )
        );
      }
    }

    return issues;
  }
}`}
              </pre>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-paradise-blue/10 rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Resources</h2>
            <ul className="space-y-3">
              <li>
                <a href="/architecture" className="text-paradise-blue hover:text-paradise-purple font-semibold">
                  → Multi-Model Architecture Documentation
                </a>
              </li>
              <li>
                <a href="/analyzers" className="text-paradise-blue hover:text-paradise-purple font-semibold">
                  → Existing Analyzer Reference
                </a>
              </li>
              <li>
                <a href="https://www.w3.org/WAI/WCAG21/Understanding/" target="_blank" rel="noopener noreferrer" className="text-paradise-blue hover:text-paradise-purple font-semibold">
                  → WCAG 2.1 Understanding Docs ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/bobdodd/phd" target="_blank" rel="noopener noreferrer" className="text-paradise-blue hover:text-paradise-purple font-semibold">
                  → GitHub Repository ↗
                </a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple rounded-2xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
            <p className="text-lg opacity-95 mb-8">
              Start building your first analyzer and help make the web more accessible for everyone.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://github.com/bobdodd/phd"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-paradise-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View on GitHub
              </a>
              <a
                href="/playground"
                className="bg-white/20 backdrop-blur text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Try Playground
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
