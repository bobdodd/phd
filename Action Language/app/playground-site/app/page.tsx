'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Starter code examples
const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test Accessibility</title>
</head>
<body>
  <h1>Welcome to Paradise Playground</h1>

  <!-- Try editing this code to test accessibility -->
  <div onclick="handleClick()">Click me</div>

  <button>Submit</button>
</body>
</html>`;

const STARTER_JS = `// Add your JavaScript here
function handleClick() {
  console.log('Button clicked!');
}`;

const STARTER_CSS = `/* Add your CSS here */
body {
  font-family: system-ui, sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #1e40af;
}`;

type FileType = 'html' | 'javascript' | 'css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<FileType>('html');
  const [htmlCode, setHtmlCode] = useState(STARTER_HTML);
  const [jsCode, setJsCode] = useState(STARTER_JS);
  const [cssCode, setCssCode] = useState(STARTER_CSS);
  const [analyzing, setAnalyzing] = useState(false);
  const [issuesFound, setIssuesFound] = useState<number>(0);

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'javascript': return jsCode;
      case 'css': return cssCode;
    }
  };

  const updateCurrentCode = (value: string | undefined) => {
    if (value === undefined) return;
    switch (activeTab) {
      case 'html': setHtmlCode(value); break;
      case 'javascript': setJsCode(value); break;
      case 'css': setCssCode(value); break;
    }
  };

  const getLanguage = () => {
    switch (activeTab) {
      case 'html': return 'html';
      case 'javascript': return 'javascript';
      case 'css': return 'css';
    }
  };

  const analyzeCode = () => {
    setAnalyzing(true);
    // Placeholder - will implement full analysis
    setTimeout(() => {
      setAnalyzing(false);
      setIssuesFound(Math.floor(Math.random() * 5));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Test Your Code for Accessibility
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Write HTML, JavaScript, and CSS below. Get instant feedback with 15+ specialized analyzers.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={analyzeCode}
                disabled={analyzing}
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Code'}
              </button>
              <Link
                href="/learn/"
                className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
              >
                Learn Accessibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Playground */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* File Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50" role="tablist" aria-label="Code editor tabs">
                <button
                  role="tab"
                  aria-selected={activeTab === 'html'}
                  aria-controls="editor-panel"
                  onClick={() => setActiveTab('html')}
                  className={`px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                    activeTab === 'html'
                      ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  HTML
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'javascript'}
                  aria-controls="editor-panel"
                  onClick={() => setActiveTab('javascript')}
                  className={`px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                    activeTab === 'javascript'
                      ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'css'}
                  aria-controls="editor-panel"
                  onClick={() => setActiveTab('css')}
                  className={`px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                    activeTab === 'css'
                      ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  CSS
                </button>
              </div>

              {/* Monaco Editor */}
              <div id="editor-panel" role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
                <MonacoEditor
                  height="600px"
                  language={getLanguage()}
                  value={getCurrentCode()}
                  onChange={updateCurrentCode}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Panel - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Analysis Results</h2>

              {issuesFound === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
                  <p className="text-gray-600">
                    Click "Analyze Code" to check for accessibility issues
                  </p>
                </div>
              ) : (
                <div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4" role="alert">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3" aria-hidden="true">⚠️</span>
                      <div>
                        <p className="font-semibold text-red-900">{issuesFound} Issue{issuesFound !== 1 ? 's' : ''} Found</p>
                        <p className="text-sm text-red-700">Click each issue to jump to location</p>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder issues */}
                  <div className="space-y-3">
                    <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded cursor-pointer hover:bg-orange-100 transition-colors">
                      <div className="font-semibold text-orange-900">Mouse-Only Click Handler</div>
                      <div className="text-sm text-orange-700 mt-1">Line 12: div requires keyboard handler</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3 text-gray-900">Active Analyzers</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
                    <span className="text-gray-700">Keyboard Nav</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
                    <span className="text-gray-700">ARIA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
                    <span className="text-gray-700">Focus Mgmt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
                    <span className="text-gray-700">Headings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></span>
                    <span className="text-gray-700">Widget Patterns</span>
                  </div>
                  <div className="text-gray-500 text-xs flex items-center">
                    +10 more...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 mt-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Use Paradise Playground?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Real-Time Analysis</h3>
              <p className="text-gray-600">
                Get instant feedback as you code with 15+ specialized analyzers
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">📚</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Learn by Doing</h3>
              <p className="text-gray-600">
                Comprehensive docs for each issue with fix suggestions and examples
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">WCAG Compliant</h3>
              <p className="text-gray-600">
                Ensure your code meets WCAG 2.1 Level A and AA criteria
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
