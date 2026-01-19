'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// File structure
interface CodeFile {
  name: string;
  content: string;
}

// Starter code examples - empty files
const STARTER_FILES = {
  html: [{
    name: 'index.html',
    content: ''
  }],
  javascript: [{
    name: 'main.js',
    content: ''
  }],
  css: [{
    name: 'styles.css',
    content: ''
  }]
};

type FileType = 'html' | 'javascript' | 'css';

// Sample examples organized by category
const SAMPLE_CATEGORIES = {
  'widget-patterns': {
    name: 'ARIA Widget Patterns',
    description: 'Complete APG widget implementations',
    examples: [
      { name: 'Accordion', file: 'accordion.html', category: 'Disclosure Widgets' },
      { name: 'Dialog (Modal)', file: 'dialog.html', category: 'Disclosure Widgets' },
      { name: 'Disclosure', file: 'disclosure.html', category: 'Disclosure Widgets' },
      { name: 'Combobox', file: 'combobox.html', category: 'Input Widgets' },
      { name: 'Listbox', file: 'listbox.html', category: 'Input Widgets' },
      { name: 'Menu', file: 'menu.html', category: 'Navigation Widgets' },
      { name: 'Toolbar', file: 'toolbar.html', category: 'Navigation Widgets' },
      { name: 'Tree View', file: 'tree.html', category: 'Navigation Widgets' },
      { name: 'Link Pattern', file: 'link-comprehensive.html', category: 'Basics' }
    ]
  },
  'analyzer-demos': {
    name: 'Analyzer Demonstrations',
    description: 'Examples showing what each analyzer detects',
    examples: [
      { name: 'Cross-File Analysis', file: 'cross-file-demo.html', type: 'good' },
      { name: 'CSS Hidden Elements', file: 'css-hidden-demo.html', type: 'errors' },
      { name: 'Focus Order Conflicts', file: 'focus-order-demo.html', type: 'errors' },
      { name: 'Missing ARIA Connections', file: 'missing-aria-demo.html', type: 'errors' },
      { name: 'Orphaned Event Handlers', file: 'orphaned-handler-demo.html', type: 'errors' },
      { name: 'ARIA Semantics', file: 'aria-semantics-demo.html', type: 'good' }
    ]
  },
  'common-patterns': {
    name: 'Common Accessible Patterns',
    description: 'Standard UI patterns with best practices',
    examples: [
      { name: 'Buttons', file: 'buttons.html', type: 'good' },
      { name: 'Forms', file: 'forms.html', type: 'good' },
      { name: 'Modals', file: 'modals.html', type: 'good' },
      { name: 'Tabs', file: 'tabs.html', type: 'good' },
      { name: 'Focus Management', file: 'focus-management.html', type: 'good' },
      { name: 'ARIA Live Regions', file: 'aria-live.html', type: 'good' }
    ]
  }
};

export default function Home() {
  const [files, setFiles] = useState(STARTER_FILES);
  const [activeTab, setActiveTab] = useState<FileType>('html');
  const [activeFileIndex, setActiveFileIndex] = useState({ html: 0, javascript: 0, css: 0 });
  const [analyzing, setAnalyzing] = useState(false);
  const [issuesFound, setIssuesFound] = useState<number>(0);
  const [showSamplesModal, setShowSamplesModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('widget-patterns');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpContent, setHelpContent] = useState<{ type: string; title: string; content: string } | null>(null);

  const currentFileArray = files[activeTab];
  const currentFile = currentFileArray[activeFileIndex[activeTab]];

  const updateFile = (content: string) => {
    const newFiles = { ...files };
    newFiles[activeTab][activeFileIndex[activeTab]].content = content;
    setFiles(newFiles);
  };

  const addFile = (fileType: FileType) => {
    const newFiles = { ...files };
    const extension = fileType === 'javascript' ? 'js' : fileType === 'html' ? 'html' : 'css';
    const baseName = fileType === 'javascript' ? 'script' : fileType === 'html' ? 'page' : 'style';
    const newFileName = `${baseName}-${newFiles[fileType].length + 1}.${extension}`;

    newFiles[fileType].push({
      name: newFileName,
      content: fileType === 'html'
        ? '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>New Page</title>\n</head>\n<body>\n  \n</body>\n</html>'
        : fileType === 'javascript'
        ? '// Add JavaScript here\n'
        : '/* Add CSS here */\n'
    });

    setFiles(newFiles);
    setActiveFileIndex({ ...activeFileIndex, [fileType]: newFiles[fileType].length - 1 });
  };

  const removeFile = (fileType: FileType, index: number) => {
    if (files[fileType].length <= 1) return; // Keep at least one file

    const newFiles = { ...files };
    newFiles[fileType].splice(index, 1);
    setFiles(newFiles);

    // Adjust active index if needed
    if (activeFileIndex[fileType] >= newFiles[fileType].length) {
      setActiveFileIndex({ ...activeFileIndex, [fileType]: newFiles[fileType].length - 1 });
    }
  };

  const renameFile = (fileType: FileType, index: number, newName: string) => {
    const newFiles = { ...files };
    newFiles[fileType][index].name = newName;
    setFiles(newFiles);
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

  const clearAll = () => {
    setFiles(STARTER_FILES);
    setActiveFileIndex({ html: 0, javascript: 0, css: 0 });
    setIssuesFound(0);
  };

  const showHelp = async (issueType: string) => {
    try {
      const response = await fetch(`/docs/issues/${issueType}.md`);
      if (!response.ok) {
        alert('Help documentation not found for this issue.');
        return;
      }

      const content = await response.text();

      // Extract title from markdown (first # heading)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : issueType;

      setHelpContent({ type: issueType, title, content });
      setShowHelpModal(true);
    } catch (error) {
      console.error('Error loading help:', error);
      alert('Failed to load help documentation.');
    }
  };

  const loadSample = async (categoryKey: string, exampleFile: string) => {
    try {
      // Determine the correct path based on category
      let filePath = '';
      let basePath = '';
      if (categoryKey === 'widget-patterns') {
        // Map file to correct subdirectory
        if (exampleFile.includes('accordion') || exampleFile.includes('dialog') || exampleFile.includes('disclosure')) {
          basePath = '/demo-content/widget-patterns/disclosure-widgets/';
          filePath = basePath + exampleFile;
        } else if (exampleFile.includes('combobox') || exampleFile.includes('listbox')) {
          basePath = '/demo-content/widget-patterns/input-widgets/';
          filePath = basePath + exampleFile;
        } else if (exampleFile.includes('menu') || exampleFile.includes('toolbar') || exampleFile.includes('tree')) {
          basePath = '/demo-content/widget-patterns/navigation-widgets/';
          filePath = basePath + exampleFile;
        } else if (exampleFile.includes('link')) {
          basePath = '/demo-content/widget-patterns/basics/';
          filePath = basePath + exampleFile;
        }
      } else {
        basePath = '/demo-content/pages/';
        filePath = basePath + exampleFile;
      }

      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Failed to load example');

      const content = await response.text();

      // Parse HTML to extract different sections
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      // Extract inline styles
      const styleElements = doc.querySelectorAll('style');
      let cssContent = '';
      styleElements.forEach(style => {
        cssContent += style.textContent + '\n\n';
      });

      // Extract both inline and external scripts
      const scriptElements = doc.querySelectorAll('script');
      let jsContent = '';
      const externalScripts: string[] = [];

      scriptElements.forEach(script => {
        if (script.src) {
          // External script - store the src path
          // Note: script.src returns absolute URL, we need the relative attribute
          const srcAttr = script.getAttribute('src');
          if (srcAttr) {
            externalScripts.push(srcAttr);
            console.log('Found external script:', srcAttr);
          }
        } else if (script.textContent) {
          // Inline script
          jsContent += script.textContent + '\n\n';
        }
      });

      // Fetch only accessible/complete external scripts (filter out incomplete/inaccessible versions)
      console.log(`Found ${externalScripts.length} external scripts to load`);
      for (const src of externalScripts) {
        // Skip inaccessible/incomplete versions - only load the working implementations
        if (src.includes('/inaccessible/') || src.includes('-incomplete.js')) {
          console.log('Skipping inaccessible/incomplete version:', src);
          continue;
        }

        try {
          // For widget-patterns, we need to fix the path
          // Original: ../../js/accessible/accordion-complete.js
          // Should resolve to: /demo-content/widget-patterns/js/accessible/accordion-complete.js
          let scriptUrl = src;

          if (categoryKey === 'widget-patterns') {
            // Replace ../../ with /demo-content/widget-patterns/
            scriptUrl = src.replace(/^\.\.\/\.\.\//g, '/demo-content/widget-patterns/');
          } else {
            // For other categories, resolve normally relative to the HTML file
            scriptUrl = new URL(src, window.location.origin + filePath).pathname;
          }

          console.log('Fetching accessible script:', scriptUrl);
          const scriptResponse = await fetch(scriptUrl);

          if (scriptResponse.ok) {
            const scriptContent = await scriptResponse.text();
            console.log('Loaded accessible script, length:', scriptContent.length, 'chars');
            jsContent += `// From: ${src}\n${scriptContent}\n\n`;
          } else {
            console.error('Failed to fetch script:', scriptUrl, 'Status:', scriptResponse.status);
          }
        } catch (err) {
          console.error('Exception loading external script:', src, err);
        }
      }

      console.log('Total JS content length after loading all scripts:', jsContent.length);

      // Remove scripts and styles from HTML for cleaner view
      styleElements.forEach(el => el.remove());
      scriptElements.forEach(el => el.remove());

      const htmlContent = doc.documentElement.outerHTML;

      // Load into playground
      setFiles({
        html: [{ name: exampleFile, content: htmlContent }],
        javascript: jsContent ? [{ name: 'script.js', content: jsContent }] : [{ name: 'main.js', content: '' }],
        css: cssContent ? [{ name: 'styles.css', content: cssContent }] : [{ name: 'styles.css', content: '' }]
      });

      setActiveTab('html');
      setActiveFileIndex({ html: 0, javascript: 0, css: 0 });
      setShowSamplesModal(false);
      setIssuesFound(0);

    } catch (error) {
      console.error('Error loading sample:', error);
      alert('Failed to load example. Please try another one.');
    }
  };

  const hasMultipleFiles = files.html.length > 1 || files.javascript.length > 1 || files.css.length > 1;

  // Keyboard support for modals - close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSamplesModal) {
          setShowSamplesModal(false);
        } else if (showHelpModal) {
          setShowHelpModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showSamplesModal, showHelpModal]);

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
            {hasMultipleFiles && (
              <div className="bg-white/20 rounded-lg p-4 inline-block mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">✨</span>
                  <span className="font-semibold">Multi-File Analysis Active</span>
                  <span>• Analyzing across {files.html.length + files.javascript.length + files.css.length} files</span>
                </div>
              </div>
            )}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={analyzeCode}
                disabled={analyzing}
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Code'}
              </button>
              <button
                onClick={() => setShowSamplesModal(true)}
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
              >
                View Samples
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
              {/* File Type Tabs */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50" role="tablist" aria-label="Code editor tabs">
                <div className="flex">
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
                    HTML ({files.html.length})
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
                    JavaScript ({files.javascript.length})
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
                    CSS ({files.css.length})
                  </button>
                </div>
                <button
                  onClick={clearAll}
                  className="mr-4 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  title="Clear all files and reset to empty state"
                >
                  Clear All
                </button>
              </div>

              {/* File Tabs within selected type */}
              <div className="flex items-center bg-gray-100 border-b border-gray-200 overflow-x-auto">
                <div className="flex items-center flex-1">
                  {currentFileArray.map((file, index) => (
                    <div key={index} className="flex items-center group">
                      <button
                        onClick={() => setActiveFileIndex({ ...activeFileIndex, [activeTab]: index })}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeFileIndex[activeTab] === index
                            ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                            : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                        }`}
                      >
                        {file.name}
                      </button>
                      {currentFileArray.length > 1 && (
                        <button
                          onClick={() => removeFile(activeTab, index)}
                          className="px-2 py-2 text-xs text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove file"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addFile(activeTab)}
                    className="px-4 py-2 text-sm text-blue-700 hover:bg-white/50 transition-colors ml-2 font-semibold"
                    title="Add new file"
                  >
                    + Add File
                  </button>
                </div>
              </div>

              {/* File name editor */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <input
                  type="text"
                  value={currentFile.name}
                  onChange={(e) => renameFile(activeTab, activeFileIndex[activeTab], e.target.value)}
                  className="text-xs text-gray-600 font-mono bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  style={{ width: `${Math.max(currentFile.name.length, 10)}ch` }}
                />
                <div className="text-xs text-gray-400">
                  {getLanguage().toUpperCase()}
                </div>
              </div>

              {/* Monaco Editor */}
              <div id="editor-panel" role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
                <MonacoEditor
                  height="600px"
                  language={getLanguage()}
                  value={currentFile.content}
                  onChange={(value) => updateFile(value || '')}
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
                    <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-orange-900">Mouse-Only Click Handler</div>
                          <div className="text-sm text-orange-700 mt-1">index.html:12 - div requires keyboard handler</div>
                        </div>
                        <button
                          onClick={() => showHelp('mouse-only-click')}
                          className="ml-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                          title="View help for this issue"
                        >
                          ? Help
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* File Count Info */}
              {hasMultipleFiles && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-3 text-gray-900">Files Being Analyzed</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">HTML Files</span>
                      <span className="font-semibold text-blue-700">{files.html.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">JavaScript Files</span>
                      <span className="font-semibold text-blue-700">{files.javascript.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">CSS Files</span>
                      <span className="font-semibold text-blue-700">{files.css.length}</span>
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
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Multi-File Support</h3>
              <p className="text-gray-600">
                Analyze multiple HTML, JS, and CSS files together for cross-file issues
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Samples Modal */}
      {showSamplesModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSamplesModal(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowSamplesModal(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="samples-modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-8 py-6 flex items-center justify-between">
              <div>
                <h2 id="samples-modal-title" className="text-3xl font-bold mb-2">Code Samples</h2>
                <p className="text-blue-100">Load examples to explore accessibility patterns and common issues</p>
              </div>
              <button
                onClick={() => setShowSamplesModal(false)}
                className="text-white/80 hover:text-white text-4xl leading-none px-3 focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Close samples modal"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Category Sidebar */}
              <div className="w-72 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Categories</h3>
                <div className="space-y-2">
                  {Object.entries(SAMPLE_CATEGORIES).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        selectedCategory === key
                          ? 'bg-blue-700 text-white font-semibold'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{category.name}</div>
                      <div className={`text-sm mt-1 ${selectedCategory === key ? 'text-blue-100' : 'text-gray-500'}`}>
                        {category.examples.length} examples
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Examples List */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {SAMPLE_CATEGORIES[selectedCategory as keyof typeof SAMPLE_CATEGORIES].name}
                  </h3>
                  <p className="text-gray-600">
                    {SAMPLE_CATEGORIES[selectedCategory as keyof typeof SAMPLE_CATEGORIES].description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {SAMPLE_CATEGORIES[selectedCategory as keyof typeof SAMPLE_CATEGORIES].examples.map((example, index) => (
                    <button
                      key={index}
                      className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onClick={() => loadSample(selectedCategory, example.file)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg text-gray-900 group-hover:text-blue-700">
                          {example.name}
                        </h4>
                        {(example as any).type && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            (example as any).type === 'good'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {(example as any).type === 'good' ? '✓ Good Practice' : '✗ Has Errors'}
                          </span>
                        )}
                        {(example as any).category && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                            {(example as any).category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{example.file}</p>
                        <span className="text-blue-700 text-sm font-semibold group-hover:underline">
                          Load →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Click any example to load it into the playground
              </p>
              <button
                onClick={() => setShowSamplesModal(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && helpContent && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowHelpModal(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowHelpModal(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-8 py-6 flex items-center justify-between">
              <div>
                <h2 id="help-modal-title" className="text-3xl font-bold mb-2">{helpContent.title}</h2>
                <p className="text-blue-100">Accessibility Issue Documentation</p>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-white/80 hover:text-white text-4xl leading-none px-3 focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Close help modal"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-8 overflow-y-auto prose prose-blue max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-gray-900" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="mb-4 ml-6 list-disc text-gray-700" {...props} />,
                  ol: ({ node, ...props }) => <ol className="mb-4 ml-6 list-decimal text-gray-700" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                    ) : (
                      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4" {...props} />
                    ),
                  pre: ({ node, ...props }) => <pre className="bg-gray-900 rounded-lg overflow-hidden my-4" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600" {...props} />
                  ),
                  strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                }}
              >
                {helpContent.content}
              </ReactMarkdown>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Learn more in our <Link href="/learn/" className="text-blue-600 hover:underline">accessibility guide</Link>
              </p>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
