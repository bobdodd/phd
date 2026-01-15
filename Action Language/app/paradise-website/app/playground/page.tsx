'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Example code snippets - now with multi-file support
const EXAMPLES = {
  'cross-file-handlers': {
    title: 'Cross-File Handlers (Multi-Model)',
    description: 'Handlers split across files - eliminates false positives',
    category: 'multi-model',
    files: {
      html: `<button id="submitButton" class="primary-btn">
  Submit Form
</button>`,
      javascript: `// click-handlers.js
document.getElementById('submitButton')
  .addEventListener('click', function() {
    submitForm();
  });

// keyboard-handlers.js (separate file)
document.getElementById('submitButton')
  .addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      submitForm();
    }
  });`,
      css: `.primary-btn {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 5px;
}

.primary-btn:focus {
  outline: 2px solid #818cf8;
  outline-offset: 2px;
}`
    },
    issues: []
  },
  'orphaned-handler': {
    title: 'Orphaned Event Handler',
    description: 'Handler attached to non-existent element (typo)',
    category: 'multi-model',
    files: {
      html: `<button id="submitButton">Submit</button>
<button id="cancelButton">Cancel</button>`,
      javascript: `// Typo: "sumbit" instead of "submit"
document.getElementById('sumbitButton')
  .addEventListener('click', function() {
    console.log('Submit clicked');
  });

// Correct
document.getElementById('cancelButton')
  .addEventListener('click', function() {
    console.log('Cancel clicked');
  });`,
      css: ''
    },
    issues: ['orphaned-handler']
  },
  'missing-aria-target': {
    title: 'Missing ARIA Connection',
    description: 'aria-labelledby points to non-existent element',
    category: 'multi-model',
    files: {
      html: `<button aria-labelledby="submitLabel">
  Submit
</button>

<!-- Missing element with id="submitLabel" -->`,
      javascript: '',
      css: ''
    },
    issues: ['missing-aria-connection']
  },
  'css-hidden-focusable': {
    title: 'CSS Visibility Conflict',
    description: 'Focusable element hidden by CSS',
    category: 'multi-model',
    files: {
      html: `<button id="hiddenButton" tabindex="0">
  Click me
</button>`,
      javascript: `document.getElementById('hiddenButton')
  .addEventListener('click', function() {
    alert('Clicked!');
  });`,
      css: `#hiddenButton {
  display: none;  /* Hidden but still focusable! */
}

/* Alternative conflicts: */
/* visibility: hidden; */
/* opacity: 0; */`
    },
    issues: ['visibility-focus-conflict']
  },
  'focus-order-chaos': {
    title: 'Chaotic Focus Order',
    description: 'Positive tabindex disrupts natural flow',
    category: 'multi-model',
    files: {
      html: `<form>
  <input type="text" placeholder="Name" />
  <button tabindex="10">Submit</button>
  <input type="email" placeholder="Email" tabindex="5" />
  <input type="tel" placeholder="Phone" tabindex="3" />
</form>`,
      javascript: '',
      css: `form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}`
    },
    issues: ['focus-order-conflict']
  },
  'mouse-only-click': {
    title: 'Mouse-Only Click Handler (JS-Only)',
    description: 'Click handler without keyboard support (WCAG 2.1.1)',
    category: 'js-only',
    files: {
      html: '',
      javascript: `const button = document.getElementById('submit');

button.addEventListener('click', function() {
  console.log('Form submitted');
  submitForm();
});

// Missing keyboard handler!`,
      css: ''
    },
    issues: ['mouse-only-click']
  },
  'positive-tabindex': {
    title: 'Positive tabIndex (JS-Only)',
    description: 'Positive tabIndex disrupts natural tab order (WCAG 2.4.3)',
    category: 'js-only',
    files: {
      html: '',
      javascript: `const modal = document.getElementById('modal');

// Bad: positive tabIndex
modal.tabIndex = 5;

const closeBtn = modal.querySelector('.close');
closeBtn.tabIndex = 6;`,
      css: ''
    },
    issues: ['positive-tabindex']
  },
  'static-aria': {
    title: 'Static ARIA State (JS-Only)',
    description: 'ARIA state never updated (WCAG 4.1.2)',
    category: 'js-only',
    files: {
      html: '',
      javascript: `const accordion = document.getElementById('accordion');
const button = accordion.querySelector('button');

// Set aria-expanded but never update it
button.setAttribute('aria-expanded', 'false');

button.addEventListener('click', function() {
  const panel = accordion.querySelector('.panel');
  panel.hidden = !panel.hidden;
  // Forgot to update aria-expanded!
});`,
      css: ''
    },
    issues: ['static-aria-state']
  },
  'accessible-button': {
    title: 'Accessible Button (Good Example)',
    description: 'Proper button with keyboard and mouse support',
    category: 'js-only',
    files: {
      html: '',
      javascript: `const button = document.getElementById('submit');

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
      css: ''
    },
    issues: []
  }
};

export default function Playground() {
  const [selectedExample, setSelectedExample] = useState('cross-file-handlers');
  const [files, setFiles] = useState(EXAMPLES['cross-file-handlers'].files);
  const [activeFileTab, setActiveFileTab] = useState<'html' | 'javascript' | 'css'>('html');
  const [actionLanguage, setActionLanguage] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [activeResultTab, setActiveResultTab] = useState<'issues' | 'actionlanguage' | 'models'>('issues');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze code whenever files change
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeFiles(files);
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [files]);

  const analyzeFiles = (currentFiles: typeof files) => {
    setIsAnalyzing(true);

    try {
      // CREATE: Parse JavaScript to ActionLanguage
      const parsed = parseToActionLanguage(currentFiles.javascript);
      setActionLanguage(parsed);

      // READ: Analyze for issues (multi-model aware)
      const detected = detectIssues(parsed, currentFiles);
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

  const detectIssues = (nodes: any[], currentFiles: typeof files) => {
    const detected: any[] = [];

    // Extract element IDs from HTML
    const htmlElementIds = new Set<string>();
    if (currentFiles.html) {
      const idMatches = currentFiles.html.matchAll(/id=["']([^"']+)["']/g);
      for (const match of idMatches) {
        htmlElementIds.add(match[1]);
      }
    }

    // Orphaned handler detection (Multi-Model)
    if (currentFiles.html && currentFiles.javascript) {
      const getElementMatches = currentFiles.javascript.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g);
      for (const match of getElementMatches) {
        const targetId = match[1];
        if (!htmlElementIds.has(targetId)) {
          // Check for typos
          const suggestions = Array.from(htmlElementIds).filter(id =>
            levenshteinDistance(id, targetId) <= 2
          );

          detected.push({
            type: 'orphaned-handler',
            severity: 'error',
            wcag: ['4.1.2'],
            message: `Handler attached to non-existent element '${targetId}'${suggestions.length > 0 ? `. Did you mean: ${suggestions.join(', ')}?` : ''}`,
            location: 'JavaScript'
          });
        }
      }
    }

    // Missing ARIA connection detection (Multi-Model)
    if (currentFiles.html) {
      const ariaMatches = currentFiles.html.matchAll(/aria-(labelledby|describedby|controls)=["']([^"']+)["']/g);
      for (const match of ariaMatches) {
        const attr = match[1];
        const targetIds = match[2].split(/\s+/);
        for (const targetId of targetIds) {
          if (!htmlElementIds.has(targetId)) {
            detected.push({
              type: 'missing-aria-connection',
              severity: 'error',
              wcag: ['1.3.1', '4.1.2'],
              message: `aria-${attr} references non-existent element '${targetId}'`,
              location: 'HTML'
            });
          }
        }
      }
    }

    // CSS visibility conflict detection (Multi-Model)
    if (currentFiles.css && currentFiles.html) {
      const hiddenSelectors: string[] = [];
      const cssHiddenMatches = currentFiles.css.matchAll(/(#[\w-]+|\.[\w-]+|\w+)\s*\{[^}]*(?:display:\s*none|visibility:\s*hidden|opacity:\s*0)[^}]*\}/g);
      for (const match of cssHiddenMatches) {
        hiddenSelectors.push(match[1]);
      }

      for (const selector of hiddenSelectors) {
        if (selector.startsWith('#')) {
          const id = selector.slice(1);
          const focusableMatch = currentFiles.html.match(new RegExp(`id=["']${id}["'][^>]*(?:tabindex=|<button|<a|<input)`));
          if (focusableMatch) {
            detected.push({
              type: 'visibility-focus-conflict',
              severity: 'error',
              wcag: ['2.4.7'],
              message: `Element '${selector}' is focusable but hidden by CSS`,
              location: 'HTML + CSS'
            });
          }
        }
      }
    }

    // Focus order conflict detection (Multi-Model)
    if (currentFiles.html) {
      const tabindexMatches = Array.from(currentFiles.html.matchAll(/tabindex=["'](\d+)["']/g));
      const positiveTabindices = tabindexMatches
        .map(m => parseInt(m[1]))
        .filter(val => val > 0);

      if (positiveTabindices.length > 0) {
        const sorted = [...positiveTabindices].sort((a, b) => a - b);
        const hasDuplicates = sorted.some((val, idx) => idx > 0 && val === sorted[idx - 1]);
        const nonSequential = sorted.some((val, idx) => idx > 0 && val !== sorted[idx - 1] + 1);

        if (hasDuplicates || nonSequential || positiveTabindices.length > 2) {
          detected.push({
            type: 'focus-order-conflict',
            severity: 'warning',
            wcag: ['2.4.3'],
            message: `Chaotic tabindex values: [${positiveTabindices.join(', ')}]. Use tabindex="0" or "-1" instead.`,
            location: 'HTML'
          });
        }
      }
    }

    // Mouse-only click detection (works with or without HTML)
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
          location: 'JavaScript'
        });
      }
    }

    // Positive tabIndex detection (JS-only)
    const tabIndexChanges = nodes.filter(n => n.actionType === 'tabIndexChange');
    for (const change of tabIndexChanges) {
      if (change.newValue > 0) {
        detected.push({
          type: 'positive-tabindex',
          severity: 'warning',
          wcag: ['2.4.3'],
          message: `Positive tabIndex (${change.newValue}) on '${change.element.binding}' disrupts natural tab order`,
          location: 'JavaScript'
        });
      }
    }

    // Static ARIA state detection (JS-only)
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
          location: 'JavaScript'
        });
      }
    }

    return detected;
  };

  const loadExample = (exampleKey: string) => {
    const example = EXAMPLES[exampleKey as keyof typeof EXAMPLES];
    setFiles(example.files);
    setSelectedExample(exampleKey);

    // Set active tab based on which file has content
    if (example.files.html) setActiveFileTab('html');
    else if (example.files.javascript) setActiveFileTab('javascript');
    else if (example.files.css) setActiveFileTab('css');
  };

  const updateFile = (fileType: 'html' | 'javascript' | 'css', content: string) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: content
    }));
  };

  // Helper: Levenshtein distance for typo detection
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const getLanguageForTab = (tab: 'html' | 'javascript' | 'css'): string => {
    switch (tab) {
      case 'html': return 'html';
      case 'javascript': return 'javascript';
      case 'css': return 'css';
    }
  };

  const hasMultipleFiles = files.html || files.css;
  const currentExample = EXAMPLES[selectedExample as keyof typeof EXAMPLES];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-paradise-green to-paradise-blue text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Interactive Playground</h1>
          <p className="text-xl mb-4">
            See Paradise in action. Edit code and watch real-time multi-model analysis.
          </p>
          {hasMultipleFiles && (
            <div className="bg-white/20 rounded-lg p-4 inline-block">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl">✨</span>
                <span className="font-semibold">Multi-Model Analysis Active</span>
                <span>• HTML + JavaScript + CSS analyzed together</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Playground */}
      <section className="container mx-auto px-6 py-8">
        {/* Example Selector */}
        <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Load Example:</label>
              <select
                value={selectedExample}
                onChange={(e) => loadExample(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-base"
              >
                <optgroup label="Multi-Model Examples (HTML + JS + CSS)">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'multi-model')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
                <optgroup label="JavaScript-Only Examples">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'js-only')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
              </select>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2">Description:</div>
              <p className="text-gray-700">{currentExample.description}</p>
              {currentExample.category === 'multi-model' && (
                <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Multi-Model
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Multi-File Editor */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* File Tabs */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex">
                  <button
                    onClick={() => setActiveFileTab('html')}
                    className={`px-6 py-3 font-semibold text-sm transition-colors border-r border-gray-200 ${
                      activeFileTab === 'html'
                        ? 'bg-white text-paradise-blue border-b-2 border-paradise-blue'
                        : 'text-gray-600 hover:text-paradise-blue hover:bg-gray-100'
                    }`}
                  >
                    📄 index.html
                    {files.html && <span className="ml-2 text-xs">({files.html.split('\n').length} lines)</span>}
                  </button>
                  <button
                    onClick={() => setActiveFileTab('javascript')}
                    className={`px-6 py-3 font-semibold text-sm transition-colors border-r border-gray-200 ${
                      activeFileTab === 'javascript'
                        ? 'bg-white text-paradise-blue border-b-2 border-paradise-blue'
                        : 'text-gray-600 hover:text-paradise-blue hover:bg-gray-100'
                    }`}
                  >
                    ⚡ script.js
                    {files.javascript && <span className="ml-2 text-xs">({files.javascript.split('\n').length} lines)</span>}
                  </button>
                  <button
                    onClick={() => setActiveFileTab('css')}
                    className={`px-6 py-3 font-semibold text-sm transition-colors ${
                      activeFileTab === 'css'
                        ? 'bg-white text-paradise-blue border-b-2 border-paradise-blue'
                        : 'text-gray-600 hover:text-paradise-blue hover:bg-gray-100'
                    }`}
                  >
                    🎨 styles.css
                    {files.css && <span className="ml-2 text-xs">({files.css.split('\n').length} lines)</span>}
                  </button>
                  {isAnalyzing && (
                    <div className="ml-auto px-4 py-3 text-sm text-paradise-blue animate-pulse">
                      Analyzing...
                    </div>
                  )}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="bg-white">
                <MonacoEditor
                  height="500px"
                  language={getLanguageForTab(activeFileTab)}
                  value={files[activeFileTab]}
                  onChange={(value) => updateFile(activeFileTab, value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    readOnly: false
                  }}
                />
              </div>
            </div>

            {/* Model Visualization */}
            {hasMultipleFiles && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  Multi-Model Integration
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                      DOM
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">DOMModel (HTML)</div>
                      <div className="text-xs text-gray-600">
                        Elements: {(files.html.match(/<[a-z]+/gi) || []).length}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-paradise-blue text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                      JS
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">ActionLanguage (JavaScript)</div>
                      <div className="text-xs text-gray-600">
                        Actions: {actionLanguage.length} nodes
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                      CSS
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">CSSModel (Styles)</div>
                      <div className="text-xs text-gray-600">
                        Rules: {(files.css.match(/\{/g) || []).length}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-300">
                    <div className="text-sm font-semibold text-green-800 flex items-center gap-2">
                      <span>→</span>
                      <span>Merged DocumentModel enables zero false positives</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Analysis Results */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              {/* Result Tabs */}
              <div className="flex gap-2 mb-4 border-b">
                <button
                  onClick={() => setActiveResultTab('issues')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeResultTab === 'issues'
                      ? 'text-paradise-orange border-b-2 border-paradise-orange'
                      : 'text-gray-600 hover:text-paradise-orange'
                  }`}
                >
                  🔍 Issues ({issues.length})
                </button>
                <button
                  onClick={() => setActiveResultTab('actionlanguage')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeResultTab === 'actionlanguage'
                      ? 'text-paradise-blue border-b-2 border-paradise-blue'
                      : 'text-gray-600 hover:text-paradise-blue'
                  }`}
                >
                  📊 ActionLanguage ({actionLanguage.length})
                </button>
                {hasMultipleFiles && (
                  <button
                    onClick={() => setActiveResultTab('models')}
                    className={`px-4 py-2 font-semibold transition-colors ${
                      activeResultTab === 'models'
                        ? 'text-paradise-green border-b-2 border-paradise-green'
                        : 'text-gray-600 hover:text-paradise-green'
                    }`}
                  >
                    🔗 Models
                  </button>
                )}
              </div>

              {/* Issues Tab */}
              {activeResultTab === 'issues' && (
                <div className="space-y-4">
                  <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-4 rounded-r">
                    <h3 className="font-bold mb-2">Accessibility Analysis</h3>
                    <p className="text-sm text-gray-700">
                      {hasMultipleFiles ? 'Multi-model analysis across HTML, JavaScript, and CSS:' : 'JavaScript-only analysis:'}
                    </p>
                  </div>

                  {issues.length === 0 ? (
                    <div className="bg-paradise-green/10 border border-paradise-green rounded-lg p-8 text-center">
                      <div className="text-5xl mb-3">✅</div>
                      <div className="font-bold text-paradise-green text-lg mb-2">No Issues Found!</div>
                      <div className="text-sm text-gray-700">
                        This code follows accessibility best practices.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg p-4 border-l-4 ${
                            issue.severity === 'error'
                              ? 'bg-red-50 border-red-500'
                              : 'bg-yellow-50 border-yellow-500'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-sm bg-white px-3 py-1 rounded font-semibold">
                              {issue.type}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              issue.severity === 'error' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                            }`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm font-semibold mb-2">{issue.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>WCAG: {issue.wcag.join(', ')}</span>
                            {issue.location && (
                              <span className="bg-gray-200 px-2 py-1 rounded">{issue.location}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ActionLanguage Tab */}
              {activeResultTab === 'actionlanguage' && (
                <div className="space-y-4">
                  <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-4 rounded-r">
                    <h3 className="font-bold mb-2">ActionLanguage Nodes</h3>
                    <p className="text-sm text-gray-700">
                      JavaScript transformed into {actionLanguage.length} intermediate representation nodes:
                    </p>
                  </div>

                  {actionLanguage.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No ActionLanguage nodes detected. Add JavaScript code with event handlers or ARIA updates.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {actionLanguage.map((node, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-sm bg-paradise-blue/20 text-paradise-blue px-2 py-1 rounded font-semibold">
                              {node.actionType}
                            </span>
                            <span className="text-xs text-gray-500">
                              Line {node.location?.line}
                            </span>
                          </div>
                          <pre className="text-xs bg-white p-3 rounded overflow-x-auto border border-gray-200">
                            {JSON.stringify(node, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Models Tab */}
              {activeResultTab === 'models' && hasMultipleFiles && (
                <div className="space-y-4">
                  <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-4 rounded-r">
                    <h3 className="font-bold mb-2">Model Integration Graph</h3>
                    <p className="text-sm text-gray-700">
                      Visual representation of how models connect:
                    </p>
                  </div>

                  {/* Model Graph Visualization */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <div className="space-y-4">
                      {/* HTML Elements */}
                      {files.html && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-bold text-sm mb-2 text-orange-600">HTML Elements</div>
                          <div className="text-xs space-y-1">
                            {Array.from(files.html.matchAll(/<([a-z]+)[^>]*id=["']([^"']+)["']/gi)).map((match, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="bg-orange-100 px-2 py-1 rounded font-mono">
                                  {match[1]}#{match[2]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* JavaScript Actions */}
                      {actionLanguage.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-bold text-sm mb-2 text-blue-600">JavaScript Actions</div>
                          <div className="text-xs space-y-1">
                            {actionLanguage.map((node, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="bg-blue-100 px-2 py-1 rounded font-mono">
                                  {node.event || node.actionType}
                                </span>
                                <span className="text-gray-600">→ {node.element?.binding || 'element'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CSS Rules */}
                      {files.css && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-bold text-sm mb-2 text-purple-600">CSS Rules</div>
                          <div className="text-xs space-y-1">
                            {Array.from(files.css.matchAll(/(#[\w-]+|\.[\w-]+|\w+)\s*\{/g)).map((match, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="bg-purple-100 px-2 py-1 rounded font-mono">
                                  {match[1]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                        <div className="text-sm font-semibold text-green-800">
                          All models merged into unified DocumentModel
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          Cross-file validation enabled • Zero false positives
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-paradise-blue/10 rounded-lg p-8 border border-paradise-blue/20">
          <h3 className="text-2xl font-bold mb-4 text-paradise-blue">How Multi-Model Analysis Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-2 text-lg">🎯 Phase 1: Parse</div>
              <p className="text-gray-700">
                Each file is parsed into its specialized model: HTML → DOMModel, JavaScript → ActionLanguage, CSS → CSSModel.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2 text-lg">🔗 Phase 2: Merge</div>
              <p className="text-gray-700">
                Models are merged via selectors (ID, class, tag). JavaScript handlers attach to DOM elements, CSS rules connect to both.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2 text-lg">✅ Phase 3: Analyze</div>
              <p className="text-gray-700">
                Analyzers query the unified DocumentModel with complete context, eliminating false positives and detecting cross-file issues.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Use Paradise?</h3>
          <p className="text-lg mb-6">
            Get instant accessibility analysis in VS Code with multi-model support.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/extension"
              className="bg-white text-paradise-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get VS Code Extension
            </a>
            <a
              href="/analyzers"
              className="bg-paradise-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors"
            >
              View All 13 Analyzers
            </a>
            <a
              href="/learn-actionlanguage"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn ActionLanguage
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
