'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Example code snippets
const EXAMPLES = {
  'mouse-only-click': {
    title: 'Mouse-Only Click Handler',
    description: 'Click handler without keyboard support (WCAG 2.1.1)',
    code: `const button = document.getElementById('submit');

button.addEventListener('click', function() {
  console.log('Form submitted');
  submitForm();
});

// Missing keyboard handler!`,
    issues: ['mouse-only-click']
  },
  'positive-tabindex': {
    title: 'Positive tabIndex',
    description: 'Positive tabIndex disrupts natural tab order (WCAG 2.4.3)',
    code: `const modal = document.getElementById('modal');

// Bad: positive tabIndex
modal.tabIndex = 5;

const closeBtn = modal.querySelector('.close');
closeBtn.tabIndex = 6;`,
    issues: ['positive-tabindex']
  },
  'static-aria': {
    title: 'Static ARIA State',
    description: 'ARIA state never updated (WCAG 4.1.2)',
    code: `const accordion = document.getElementById('accordion');
const button = accordion.querySelector('button');

// Set aria-expanded but never update it
button.setAttribute('aria-expanded', 'false');

button.addEventListener('click', function() {
  const panel = accordion.querySelector('.panel');
  panel.hidden = !panel.hidden;
  // Forgot to update aria-expanded!
});`,
    issues: ['static-aria-state']
  },
  'focus-trap': {
    title: 'Focus Trap Without Escape',
    description: 'Tab trap without Escape key handler (WCAG 2.1.2)',
    code: `const modal = document.getElementById('modal');
const firstBtn = modal.querySelector('button:first-child');
const lastBtn = modal.querySelector('button:last-child');

modal.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstBtn) {
      event.preventDefault();
      lastBtn.focus();
    } else if (!event.shiftKey && document.activeElement === lastBtn) {
      event.preventDefault();
      firstBtn.focus();
    }
  }
  // No handler for the ESC key!
});`,
    issues: ['missing-escape-handler']
  },
  'accessible-button': {
    title: 'Accessible Button (Good)',
    description: 'Proper button with keyboard and mouse support',
    code: `const button = document.getElementById('submit');

// Mouse support
button.addEventListener('click', handleSubmit);

// Keyboard support
button.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleSubmit(event);
  }
});

function handleSubmit(event) {
  console.log('Form submitted');
  submitForm();
}`,
    issues: []
  }
};

export default function Playground() {
  const [code, setCode] = useState(EXAMPLES['mouse-only-click'].code);
  const [selectedExample, setSelectedExample] = useState('mouse-only-click');
  const [actionLanguage, setActionLanguage] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'actionlanguage' | 'issues' | 'crud'>('actionlanguage');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze code whenever it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeCode(code);
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [code]);

  const analyzeCode = (sourceCode: string) => {
    setIsAnalyzing(true);

    try {
      // CREATE: Parse to ActionLanguage (simplified simulation)
      const parsed = parseToActionLanguage(sourceCode);
      setActionLanguage(parsed);

      // READ: Analyze for issues
      const detected = detectIssues(parsed, sourceCode);
      setIssues(detected);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseToActionLanguage = (code: string) => {
    // Simplified parser - in production, use Acorn/Babel
    const nodes: any[] = [];

    // Detect addEventListener with key checks in handler body
    const addEventListenerRegex = /(\w+)\.addEventListener\(['"](\w+)['"],\s*function\([^)]*\)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g;
    let match;
    while ((match = addEventListenerRegex.exec(code)) !== null) {
      const element = match[1];
      const event = match[2];
      const handlerBody = match[3];

      // For keydown handlers, detect which keys are checked
      const keysChecked: string[] = [];
      if (event === 'keydown' || event === 'keypress') {
        const keyCheckRegex = /event\.key\s*===\s*['"](\w+)['"]/g;
        let keyMatch;
        while ((keyMatch = keyCheckRegex.exec(handlerBody)) !== null) {
          keysChecked.push(keyMatch[1]);
        }
      }

      nodes.push({
        id: `node-${nodes.length + 1}`,
        actionType: 'eventHandler',
        event: event,
        element: { binding: element },
        keysChecked: keysChecked.length > 0 ? keysChecked : undefined,
        location: { line: code.substring(0, match.index).split('\n').length, column: 0 }
      });
    }

    // Detect tabIndex
    const tabIndexRegex = /(\w+)\.tabIndex\s*=\s*(\d+)/g;
    while ((match = tabIndexRegex.exec(code)) !== null) {
      nodes.push({
        id: `node-${nodes.length + 1}`,
        actionType: 'tabIndexChange',
        element: { binding: match[1] },
        newValue: parseInt(match[2]),
        location: { line: code.substring(0, match.index).split('\n').length, column: 0 }
      });
    }

    // Detect setAttribute('aria-*')
    const ariaRegex = /(\w+)\.setAttribute\(['"]aria-(\w+)['"]/g;
    while ((match = ariaRegex.exec(code)) !== null) {
      nodes.push({
        id: `node-${nodes.length + 1}`,
        actionType: 'ariaStateChange',
        element: { binding: match[1] },
        attribute: `aria-${match[2]}`,
        location: { line: code.substring(0, match.index).split('\n').length, column: 0 }
      });
    }

    return nodes;
  };

  const detectIssues = (nodes: any[], sourceCode: string) => {
    const detected: any[] = [];

    // Mouse-only click detection
    const clickHandlers = nodes.filter(n => n.actionType === 'eventHandler' && n.event === 'click');
    for (const click of clickHandlers) {
      const hasKeyboard = nodes.some(n =>
        n.actionType === 'eventHandler' &&
        n.element.binding === click.element.binding &&
        (n.event === 'keydown' || n.event === 'keypress')
      );

      if (!hasKeyboard) {
        detected.push({
          type: 'mouse-only-click',
          severity: 'warning',
          wcag: ['2.1.1'],
          message: `Click handler on '${click.element.binding}' without keyboard equivalent`,
          node: click
        });
      }
    }

    // Positive tabIndex detection
    const tabIndexChanges = nodes.filter(n => n.actionType === 'tabIndexChange');
    for (const change of tabIndexChanges) {
      if (change.newValue > 0) {
        detected.push({
          type: 'positive-tabindex',
          severity: 'warning',
          wcag: ['2.4.3'],
          message: `Positive tabIndex (${change.newValue}) on '${change.element.binding}' disrupts natural tab order`,
          node: change
        });
      }
    }

    // Static ARIA state detection
    const ariaChanges = nodes.filter(n => n.actionType === 'ariaStateChange');
    const ariaCounts = new Map();
    for (const change of ariaChanges) {
      const key = `${change.element.binding}-${change.attribute}`;
      ariaCounts.set(key, (ariaCounts.get(key) || 0) + 1);
    }

    for (const change of ariaChanges) {
      const key = `${change.element.binding}-${change.attribute}`;
      if (ariaCounts.get(key) === 1) {
        detected.push({
          type: 'static-aria-state',
          severity: 'warning',
          wcag: ['4.1.2'],
          message: `${change.attribute} on '${change.element.binding}' set once but never updated`,
          node: change
        });
      }
    }

    // Focus trap without escape - analyze ActionLanguage tree
    const keydownHandlers = nodes.filter(n => n.actionType === 'eventHandler' && n.event === 'keydown');
    for (const handler of keydownHandlers) {
      // Check if this handler handles Tab but not Escape
      if (handler.keysChecked && handler.keysChecked.includes('Tab') && !handler.keysChecked.includes('Escape')) {
        detected.push({
          type: 'missing-escape-handler',
          severity: 'error',
          wcag: ['2.1.2'],
          message: `Focus trap on '${handler.element.binding}' handles Tab but missing Escape key handler`,
          node: handler
        });
      }
    }

    return detected;
  };

  const loadExample = (exampleKey: string) => {
    const example = EXAMPLES[exampleKey as keyof typeof EXAMPLES];
    setCode(example.code);
    setSelectedExample(exampleKey);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-paradise-green to-paradise-blue text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Interactive Playground</h1>
          <p className="text-xl">
            See Paradise in action. Edit code and watch ActionLanguage + analysis update in real-time.
          </p>
        </div>
      </section>

      {/* Main Playground */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left: Code Editor */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">JavaScript Code</h2>
                {isAnalyzing && (
                  <span className="text-sm text-paradise-blue animate-pulse">Analyzing...</span>
                )}
              </div>

              {/* Example Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Load Example:</label>
                <select
                  value={selectedExample}
                  onChange={(e) => loadExample(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                  {Object.entries(EXAMPLES).map(([key, ex]) => (
                    <option key={key} value={key}>{ex.title}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-1">
                  {EXAMPLES[selectedExample as keyof typeof EXAMPLES].description}
                </p>
              </div>

              {/* Monaco Editor */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <MonacoEditor
                  height="400px"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>
            </div>

            {/* CRUD Pipeline Visualization */}
            <div className="bg-gradient-to-r from-paradise-green/10 via-paradise-blue/10 to-paradise-orange/10 rounded-lg p-6 border border-paradise-blue/20">
              <h3 className="text-lg font-bold mb-4">CRUD Pipeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-paradise-green text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    C
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">CREATE (Parse)</div>
                    <div className="text-sm text-gray-600">
                      JavaScript → {actionLanguage.length} ActionLanguage nodes
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-paradise-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    R
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">READ (Analyze)</div>
                    <div className="text-sm text-gray-600">
                      {issues.length} issues detected
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-paradise-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    U
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">UPDATE (Fix)</div>
                    <div className="text-sm text-gray-600">
                      Ready to generate fixes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Analysis Results */}
          <div className="space-y-4">

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex gap-2 mb-4 border-b">
                <button
                  onClick={() => setActiveTab('actionlanguage')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === 'actionlanguage'
                      ? 'text-paradise-blue border-b-2 border-paradise-blue'
                      : 'text-gray-600 hover:text-paradise-blue'
                  }`}
                >
                  ActionLanguage ({actionLanguage.length})
                </button>
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === 'issues'
                      ? 'text-paradise-orange border-b-2 border-paradise-orange'
                      : 'text-gray-600 hover:text-paradise-orange'
                  }`}
                >
                  Issues ({issues.length})
                </button>
                <button
                  onClick={() => setActiveTab('crud')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === 'crud'
                      ? 'text-paradise-green border-b-2 border-paradise-green'
                      : 'text-gray-600 hover:text-paradise-green'
                  }`}
                >
                  CRUD Flow
                </button>
              </div>

              {/* ActionLanguage Tab */}
              {activeTab === 'actionlanguage' && (
                <div className="space-y-4">
                  <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-4 rounded-r">
                    <h3 className="font-bold mb-2">CREATE Output</h3>
                    <p className="text-sm text-gray-700">
                      Your JavaScript code transformed into {actionLanguage.length} ActionLanguage nodes:
                    </p>
                  </div>

                  {actionLanguage.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No ActionLanguage nodes detected. Try loading an example above.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {actionLanguage.map((node, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-sm bg-paradise-green/20 px-2 py-1 rounded">
                              {node.actionType}
                            </span>
                            <span className="text-xs text-gray-500">
                              Line {node.location?.line}
                            </span>
                          </div>
                          <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
                            {JSON.stringify(node, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Issues Tab */}
              {activeTab === 'issues' && (
                <div className="space-y-4">
                  <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-4 rounded-r">
                    <h3 className="font-bold mb-2">READ Output</h3>
                    <p className="text-sm text-gray-700">
                      Analyzers detected {issues.length} accessibility {issues.length === 1 ? 'issue' : 'issues'}:
                    </p>
                  </div>

                  {issues.length === 0 ? (
                    <div className="bg-paradise-green/10 border border-paradise-green rounded-lg p-6 text-center">
                      <div className="text-4xl mb-2">✅</div>
                      <div className="font-bold text-paradise-green mb-1">No Issues Found!</div>
                      <div className="text-sm text-gray-700">
                        This code follows accessibility best practices.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {issues.map((issue, idx) => (
                        <div key={idx} className={`rounded-lg p-4 border-l-4 ${
                          issue.severity === 'error'
                            ? 'bg-red-50 border-red-500'
                            : 'bg-yellow-50 border-yellow-500'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                              {issue.type}
                            </span>
                            <span className="text-xs text-gray-600">
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm font-semibold mb-2">{issue.message}</p>
                          <div className="text-xs text-gray-600">
                            WCAG: {issue.wcag.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CRUD Flow Tab */}
              {activeTab === 'crud' && (
                <div className="space-y-4">
                  <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-4 rounded-r">
                    <h3 className="font-bold mb-2">Complete CRUD Pipeline</h3>
                    <p className="text-sm text-gray-700">
                      Watch how your code flows through all stages:
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* CREATE */}
                    <div className="bg-white rounded-lg p-4 border border-paradise-green">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-paradise-green text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                          C
                        </div>
                        <h4 className="font-bold">CREATE (Parse)</h4>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        Source code → ActionLanguage
                      </div>
                      <div className="text-xs bg-gray-50 p-2 rounded">
                        Generated {actionLanguage.length} nodes: {actionLanguage.map(n => n.actionType).join(', ')}
                      </div>
                    </div>

                    {/* READ */}
                    <div className="bg-white rounded-lg p-4 border border-paradise-blue">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-paradise-blue text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                          R
                        </div>
                        <h4 className="font-bold">READ (Analyze)</h4>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        Analyzers query ActionLanguage for patterns
                      </div>
                      <div className="text-xs bg-gray-50 p-2 rounded">
                        Detected {issues.length} issues: {issues.map(i => i.type).join(', ') || 'None'}
                      </div>
                    </div>

                    {/* UPDATE */}
                    <div className="bg-white rounded-lg p-4 border border-paradise-orange">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-paradise-orange text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                          U
                        </div>
                        <h4 className="font-bold">UPDATE (Fix)</h4>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        Fix generators create new ActionLanguage nodes
                      </div>
                      <div className="text-xs bg-gray-50 p-2 rounded">
                        {issues.length > 0 ? `Ready to generate ${issues.length} fixes` : 'No fixes needed'}
                      </div>
                    </div>

                    {/* DELETE */}
                    <div className="bg-white rounded-lg p-4 border border-paradise-purple">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-paradise-purple text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                          D
                        </div>
                        <h4 className="font-bold">DELETE (Optimize)</h4>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        Remove unused code and optimize
                      </div>
                      <div className="text-xs bg-gray-50 p-2 rounded">
                        Clean ActionLanguage ready for code generation
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-paradise-blue/10 rounded-lg p-6 border border-paradise-blue/20">
          <h3 className="text-xl font-bold mb-3 text-paradise-blue">How This Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-2">🎯 Real-Time Analysis</div>
              <p className="text-gray-700">
                As you type, the playground parses your JavaScript to ActionLanguage and runs
                accessibility analyzers—just like the VS Code extension.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2">🔍 Pattern Detection</div>
              <p className="text-gray-700">
                Analyzers query the ActionLanguage tree for accessibility anti-patterns using
                simple tree traversal (no AI needed!).
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2">🌍 Universal</div>
              <p className="text-gray-700">
                These same analyzers work for JavaScript, Objective-C, Kotlin, and any language
                with a CREATE function.
              </p>
            </div>
          </div>
        </div>

        {/* Try Learning */}
        <div className="mt-8 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Want to Learn More?</h3>
          <p className="text-lg mb-6">
            Explore our comprehensive modules to understand ActionLanguage and build your own analyzers.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/learn-actionlanguage" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Learning
            </a>
            <a href="/extension" className="bg-paradise-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors">
              Get VS Code Extension
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
