'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parse, ParserOptions } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { SvelteActionLanguageExtractor } from '../../../src/parsers/SvelteActionLanguageExtractor';
import { VueActionLanguageExtractor } from '../../../src/parsers/VueActionLanguageExtractor';
import { AngularActionLanguageExtractor } from '../../../src/parsers/AngularActionLanguageExtractor';
import { ReactActionLanguageExtractor } from '../../../src/parsers/ReactActionLanguageExtractor';
import { MouseOnlyClickAnalyzer } from '../../../src/analyzers/MouseOnlyClickAnalyzer';
import { AngularReactivityAnalyzer } from '../../../src/analyzers/AngularReactivityAnalyzer';
import { VueReactivityAnalyzer } from '../../../src/analyzers/VueReactivityAnalyzer';
import { SvelteReactivityAnalyzer } from '../../../src/analyzers/SvelteReactivityAnalyzer';
import { ReactA11yAnalyzer } from '../../../src/analyzers/ReactA11yAnalyzer';
import { FocusManagementAnalyzer } from '../../../src/analyzers/FocusManagementAnalyzer';
import { FocusOrderConflictAnalyzer } from '../../../src/analyzers/FocusOrderConflictAnalyzer';
import { KeyboardNavigationAnalyzer } from '../../../src/analyzers/KeyboardNavigationAnalyzer';
import { ARIASemanticAnalyzer } from '../../../src/analyzers/ARIASemanticAnalyzer';
import { MissingAriaConnectionAnalyzer } from '../../../src/analyzers/MissingAriaConnectionAnalyzer';
import { OrphanedEventHandlerAnalyzer } from '../../../src/analyzers/OrphanedEventHandlerAnalyzer';
import { VisibilityFocusConflictAnalyzer } from '../../../src/analyzers/VisibilityFocusConflictAnalyzer';
import { WidgetPatternAnalyzer } from '../../../src/analyzers/WidgetPatternAnalyzer';
import { HeadingStructureAnalyzer } from '../../../src/analyzers/HeadingStructureAnalyzer';
import { FormLabelAnalyzer } from '../../../src/analyzers/FormLabelAnalyzer';
import { AltTextAnalyzer } from '../../../src/analyzers/AltTextAnalyzer';
import { LandmarkStructureAnalyzer } from '../../../src/analyzers/LandmarkStructureAnalyzer';
import { LinkTextAnalyzer } from '../../../src/analyzers/LinkTextAnalyzer';
import { SingleLetterShortcutAnalyzer } from '../../../src/analyzers/SingleLetterShortcutAnalyzer';
import { AnimationControlAnalyzer } from '../../../src/analyzers/AnimationControlAnalyzer';
import { ModalAccessibilityAnalyzer } from '../../../src/analyzers/ModalAccessibilityAnalyzer';
import { ButtonLabelAnalyzer } from '../../../src/analyzers/ButtonLabelAnalyzer';
import { TableAccessibilityAnalyzer } from '../../../src/analyzers/TableAccessibilityAnalyzer';
import { DeprecatedKeyCodeAnalyzer } from '../../../src/analyzers/DeprecatedKeyCodeAnalyzer';
import { ActionLanguageModelImpl } from '../../../src/models/ActionLanguageModel';
import { HTMLParser } from '../../../src/parsers/HTMLParser';
import { DocumentModel } from '../../../src/models/DocumentModel';
import PreviewModal from './components/PreviewModal';
import { FileManager, PlaygroundFiles } from '../lib/utils/FileManager';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Extend Window type for Monaco
declare global {
  interface Window {
    monaco: any;
  }
}

// File structure
interface CodeFile {
  name: string;
  content: string;
}

interface ExampleFiles {
  html: CodeFile[];
  javascript: CodeFile[];
  css: CodeFile[];
}

interface IssueFix {
  description: string;
  code: string;
  location: {
    file?: string;
    line?: number;
    column?: number;
  };
}

interface Issue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  wcag: string[];
  message: string;
  location: string;
  line?: number;
  column?: number;
  length?: number;
  fix?: IssueFix;
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
  'analyzer-examples': {
    name: 'Analyzer Detection Examples',
    description: 'Examples containing intentional accessibility issues to demonstrate what each analyzer detects',
    examples: [
      { name: 'Cross-File Analysis', file: 'cross-file-demo.html', type: 'demo', description: 'Shows how cross-file analysis eliminates false positives' },
      { name: 'Orphaned Event Handlers', file: 'orphaned-handler-demo.html', type: 'demo', description: 'Contains handlers attached to non-existent elements' },
      { name: 'Broken ARIA Connections', file: 'missing-aria-demo.html', type: 'demo', description: 'Contains missing aria-labelledby and aria-describedby targets' },
      { name: 'CSS Visibility Conflicts', file: 'css-hidden-demo.html', type: 'demo', description: 'Contains focusable elements hidden by CSS' },
      { name: 'Focus Order Problems', file: 'focus-order-demo.html', type: 'demo', description: 'Contains problematic tabindex patterns' },
      { name: 'ARIA Semantic Issues', file: 'aria-semantics-demo.html', type: 'demo', description: 'Contains invalid roles and missing required attributes' },
      { name: 'Performance Benchmarks', file: 'performance.html', type: 'demo', description: 'Performance metrics and scalability data' }
    ]
  },
  'pattern-comparisons': {
    name: 'Accessible vs Inaccessible Patterns',
    description: 'Side-by-side comparisons showing correct and incorrect implementations of common patterns',
    examples: [
      { name: 'Interactive Buttons', file: 'buttons.html', type: 'comparison', description: 'Accessible and inaccessible button implementations' },
      { name: 'Form Controls', file: 'forms.html', type: 'comparison', description: 'Form labeling and validation patterns' },
      { name: 'Navigation Patterns', file: 'navigation.html', type: 'comparison', description: 'Menus, landmarks, and skip links' },
      { name: 'Tab Widgets', file: 'tabs.html', type: 'comparison', description: 'Tab panel implementations with keyboard navigation' },
      { name: 'Modal Dialogs', file: 'modals.html', type: 'comparison', description: 'Focus management in modal dialogs' },
      { name: 'Accordions', file: 'disclosure.html', type: 'comparison', description: 'Disclosure widget implementations' },
      { name: 'Keyboard Shortcuts', file: 'keyboard-shortcuts.html', type: 'comparison', description: 'Proper handling of keyboard shortcuts' },
      { name: 'Focus Management', file: 'focus-management.html', type: 'comparison', description: 'Focus handling during content changes' },
      { name: 'Live Regions', file: 'aria-live.html', type: 'comparison', description: 'Dynamic content announcements' },
      { name: 'Complex Widgets', file: 'complex-widgets.html', type: 'comparison', description: 'Advanced widget patterns' }
    ]
  },
  'widget-patterns': {
    name: 'ARIA Widget Pattern Reference',
    description: 'Accessible implementations following ARIA Authoring Practices Guide patterns',
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
  }
};

export default function Home() {
  const [files, setFiles] = useState(STARTER_FILES);
  const [activeTab, setActiveTab] = useState<FileType>('html');
  const [activeFileIndex, setActiveFileIndex] = useState({ html: 0, javascript: 0, css: 0 });
  const [analyzing, setAnalyzing] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number | null>(null);
  const [showSamplesModal, setShowSamplesModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('analyzer-examples');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpContent, setHelpContent] = useState<{ type: string; title: string; content: string } | null>(null);
  const [showFixModal, setShowFixModal] = useState(false);
  const [selectedFix, setSelectedFix] = useState<IssueFix | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSRInitialState, setPreviewSRInitialState] = useState(false);
  const [previewSwitchInitialState, setPreviewSwitchInitialState] = useState(false);

  // Save/Load state
  const [savedProjects, setSavedProjects] = useState<{ key: string; metadata?: PlaygroundFiles['metadata'] }[]>([]);

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

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

  // Auto-analyze code whenever files change
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeFiles(files);
    }, 500); // Debounce for real-time analysis

    return () => clearTimeout(timer);
  }, [files]);

  // Update decorations when selected issue changes
  useEffect(() => {
    updateEditorDecorations(issues);
  }, [selectedIssueIndex, activeTab, activeFileIndex]);

  const analyzeFiles = (currentFiles: ExampleFiles) => {
    setAnalyzing(true);

    try {
      // Parse each JavaScript file separately
      const allParsedNodes: any[] = [];

      for (const jsFile of currentFiles.javascript) {
        const parsed = parseToActionLanguage(jsFile.content, jsFile.name);
        allParsedNodes.push(...parsed);
      }

      // Detect issues across all files
      const detected = detectIssues(allParsedNodes, currentFiles);
      setIssues(detected);

      // Update decorations in Monaco editor
      updateEditorDecorations(detected);
    } catch (error) {
      console.error('Analysis error:', error);
      setIssues([]);
    } finally {
      setAnalyzing(false);
    }
  };

  const parseToActionLanguage = (code: string, filename: string = 'playground.js') => {
    // Handle React files
    if (filename.endsWith('.jsx') || filename.endsWith('.tsx') || code.includes('React') || code.includes('useState')) {
      const extractor = new ReactActionLanguageExtractor();
      const model = extractor.parse(code, filename);
      return model.nodes;
    }

    // Handle Svelte files
    if (filename.endsWith('.svelte')) {
      const extractor = new SvelteActionLanguageExtractor();
      const model = extractor.parse(code, filename);
      return model.nodes;
    }

    // Handle Vue files
    if (filename.endsWith('.vue')) {
      const extractor = new VueActionLanguageExtractor();
      const model = extractor.parse(code, filename);
      return model.nodes;
    }

    // Handle Angular files
    if (filename.endsWith('.html') || filename.endsWith('.component.ts')) {
      const extractor = new AngularActionLanguageExtractor();
      const model = extractor.parse(code, filename);
      return model.nodes;
    }

    const nodes: any[] = [];
    const variableBindings = new Map<string, { selector: string; binding: string }>();
    let nodeCounter = 0;

    const BABEL_CONFIG: ParserOptions = {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        ['decorators', { decoratorsBeforeExport: true }],
        'classProperties',
        'objectRestSpread',
        'optionalChaining',
        'nullishCoalescingOperator',
      ],
      ranges: true,
      tokens: false,
    };

    try {
      const ast = parse(code, {
        ...BABEL_CONFIG,
        sourceFilename: filename,
      });

      // Collect variable bindings
      traverse(ast, {
        VariableDeclarator(path: any) {
          const node = path.node;
          const id = node.id;
          const init = node.init;

          if (!t.isIdentifier(id) || !init) return;

          if (t.isCallExpression(init) &&
              t.isMemberExpression(init.callee) &&
              t.isIdentifier(init.callee.object, { name: 'document' })) {

            const methodName = t.isIdentifier(init.callee.property) ? init.callee.property.name : null;

            if (methodName === 'getElementById' && init.arguments.length > 0 && t.isStringLiteral(init.arguments[0])) {
              variableBindings.set(id.name, {
                selector: `#${init.arguments[0].value}`,
                binding: 'id'
              });
            } else if ((methodName === 'querySelector' || methodName === 'querySelectorAll') &&
                       init.arguments.length > 0 && t.isStringLiteral(init.arguments[0])) {
              variableBindings.set(id.name, {
                selector: init.arguments[0].value,
                binding: 'selector'
              });
            }
          }
        },

        CallExpression(path: any) {
          const node = path.node;
          const callee = node.callee;

          if (!t.isMemberExpression(callee)) return;
          if (!t.isIdentifier(callee.property, { name: 'addEventListener' })) return;

          let selector = null;
          let variableName = null;

          // Check if it's element.addEventListener(...)
          if (t.isCallExpression(callee.object) && t.isMemberExpression(callee.object.callee)) {
            const method = callee.object.callee;
            if (t.isIdentifier(method.object, { name: 'document' })) {
              const methodName = t.isIdentifier(method.property) ? method.property.name : null;

              if (methodName === 'getElementById' && callee.object.arguments.length > 0 && t.isStringLiteral(callee.object.arguments[0])) {
                selector = `#${callee.object.arguments[0].value}`;
              } else if ((methodName === 'querySelector' || methodName === 'querySelectorAll') &&
                         callee.object.arguments.length > 0 && t.isStringLiteral(callee.object.arguments[0])) {
                selector = callee.object.arguments[0].value;
              }
            }
          } else if (t.isIdentifier(callee.object)) {
            variableName = callee.object.name;
            const binding = variableBindings.get(variableName);
            if (binding) {
              selector = binding.selector;
            }
          }

          if (!selector) return;
          if (node.arguments.length < 2) return;
          if (!t.isStringLiteral(node.arguments[0])) return;

          const eventType = node.arguments[0].value;

          nodes.push({
            nodeId: `node-${nodeCounter++}`,
            type: 'interaction',
            selector: selector,
            action: eventType,
            location: {
              file: filename,
              line: node.loc?.start.line,
              column: node.loc?.start.column
            }
          });
        }
      });
    } catch (error) {
      console.error('Parse error:', error);
    }

    return nodes;
  };

  const detectIssues = (nodes: any[], currentFiles: ExampleFiles) => {
    const detected: Issue[] = [];

    // Create ActionLanguage model
    const actionLanguageModel = new ActionLanguageModelImpl(nodes, 'playground.js');

    // Initialize analyzers
    const analyzers = [
      new MouseOnlyClickAnalyzer(),
      new FocusManagementAnalyzer(),
      new FocusOrderConflictAnalyzer(),
      new KeyboardNavigationAnalyzer(),
      new ARIASemanticAnalyzer(),
      new MissingAriaConnectionAnalyzer(),
      new OrphanedEventHandlerAnalyzer(),
      new VisibilityFocusConflictAnalyzer(),
      new WidgetPatternAnalyzer(),
      new ReactA11yAnalyzer(),
      new SingleLetterShortcutAnalyzer(),
    ];

    // Run all analyzers
    for (const analyzer of analyzers) {
      try {
        const analyzerIssues = analyzer.analyze({
          actionLanguageModel,
          scope: 'file'
        });

        for (const issue of analyzerIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'JavaScript',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10, // Default length for squiggle
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }
      } catch (error) {
        console.error(`Analyzer error (${analyzer.name}):`, error);
      }
    }

    // Run HeadingStructureAnalyzer if there's HTML
    const allHtml = currentFiles.html.map(f => f.content).join('\n');
    if (allHtml.trim().length > 0) {
      try {
        const htmlParser = new HTMLParser();
        const domModel = htmlParser.parse(allHtml, 'playground.html');
        const documentModel = new DocumentModel({
          scope: 'file',
          dom: domModel,
          javascript: []
        });

        const headingAnalyzer = new HeadingStructureAnalyzer();
        const headingIssues = headingAnalyzer.analyze({
          documentModel,
          scope: 'file'
        });

        for (const issue of headingIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run FormLabelAnalyzer
        const formLabelAnalyzer = new FormLabelAnalyzer();
        const formLabelIssues = formLabelAnalyzer.analyze({
          documentModel,
          scope: 'file'
        });

        for (const issue of formLabelIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run AltTextAnalyzer
        const altTextAnalyzer = new AltTextAnalyzer();
        const altTextIssues = altTextAnalyzer.analyze({
          documentModel,
          scope: 'file'
        });

        for (const issue of altTextIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run LandmarkStructureAnalyzer
        const landmarkAnalyzer = new LandmarkStructureAnalyzer();
        const landmarkIssues = landmarkAnalyzer.analyze({
          documentModel,
          scope: 'file'
        });

        for (const issue of landmarkIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location.file || 'HTML',
            line: issue.location.line,
            column: issue.location.column,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run LinkTextAnalyzer
        const linkTextAnalyzer = new LinkTextAnalyzer();
        const linkTextIssues = linkTextAnalyzer.analyze({
          documentModel,
          scope: 'file'
        });

        for (const issue of linkTextIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run LanguageAttributeAnalyzer
        const languageAnalyzer = new LanguageAttributeAnalyzer();
        const languageIssues = languageAnalyzer.analyze({
          documentModel,
          scope: 'file'
        });

        for (const issue of languageIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run AnimationControlAnalyzer (needs both DocumentModel and ActionLanguageModel)
        const animationAnalyzer = new AnimationControlAnalyzer();
        const animationIssues = animationAnalyzer.analyze({
          documentModel,
          actionLanguageModel,
          scope: 'file'
        });

        for (const issue of animationIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run ModalAccessibilityAnalyzer (needs both DocumentModel and ActionLanguageModel)
        const modalAnalyzer = new ModalAccessibilityAnalyzer();
        const modalIssues = modalAnalyzer.analyze({
          documentModel,
          actionLanguageModel,
          scope: 'file'
        });

        for (const issue of modalIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run ButtonLabelAnalyzer (needs both DocumentModel and ActionLanguageModel)
        const buttonAnalyzer = new ButtonLabelAnalyzer();
        const buttonIssues = buttonAnalyzer.analyze({
          documentModel,
          actionLanguageModel,
          scope: 'file'
        });

        for (const issue of buttonIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run TableAccessibilityAnalyzer (needs DocumentModel)
        const tableAnalyzer = new TableAccessibilityAnalyzer();
        const tableIssues = tableAnalyzer.analyze({
          documentModel,
          actionLanguageModel,
          scope: 'file'
        });

        for (const issue of tableIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }

        // Run DeprecatedKeyCodeAnalyzer (needs ActionLanguageModel)
        const keyCodeAnalyzer = new DeprecatedKeyCodeAnalyzer();
        const keyCodeIssues = keyCodeAnalyzer.analyze({
          documentModel,
          actionLanguageModel,
          scope: 'file'
        });

        for (const issue of keyCodeIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'JavaScript',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10,
            fix: issue.fix ? {
              description: issue.fix.description,
              code: issue.fix.code,
              location: {
                file: issue.fix.location?.file,
                line: issue.fix.location?.line,
                column: issue.fix.location?.column
              }
            } : undefined
          });
        }
      } catch (error) {
        console.error('HTML Analyzer error:', error);
      }
    }

    // Run framework-specific analyzers if patterns detected
    const allJs = currentFiles.javascript.map(f => f.content).join('\n');
    const allContent = allHtml + '\n' + allJs;

    // Angular
    if (allContent.includes('[(ngModel)]') || allContent.includes('*ngIf') || allContent.includes('*ngFor')) {
      try {
        const angularExtractor = new AngularActionLanguageExtractor();
        const angularModel = angularExtractor.parse(allContent, 'playground.html');
        const angularAnalyzer = new AngularReactivityAnalyzer();
        const angularIssues = angularAnalyzer.analyze({
          actionLanguageModel: angularModel,
          scope: 'file'
        });

        for (const issue of angularIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: 'Angular',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10
          });
        }
      } catch (error) {
        console.error('AngularReactivityAnalyzer error:', error);
      }
    }

    // Vue
    if (allContent.includes('v-model') || allContent.includes('v-if') || allContent.includes('v-for')) {
      try {
        const vueExtractor = new VueActionLanguageExtractor();
        const vueModel = vueExtractor.parse(allContent, 'playground.vue');
        const vueAnalyzer = new VueReactivityAnalyzer();
        const vueIssues = vueAnalyzer.analyze({
          actionLanguageModel: vueModel,
          scope: 'file'
        });

        for (const issue of vueIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: 'Vue',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10
          });
        }
      } catch (error) {
        console.error('VueReactivityAnalyzer error:', error);
      }
    }

    // Svelte
    if (allContent.includes('bind:') || allContent.includes('{#if') || allContent.includes('{#each')) {
      try {
        const svelteExtractor = new SvelteActionLanguageExtractor();
        const svelteModel = svelteExtractor.parse(allContent, 'playground.svelte');
        const svelteAnalyzer = new SvelteReactivityAnalyzer();
        const svelteIssues = svelteAnalyzer.analyze({
          actionLanguageModel: svelteModel,
          scope: 'file'
        });

        for (const issue of svelteIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: 'Svelte',
            line: issue.location?.line,
            column: issue.location?.column,
            length: 10
          });
        }
      } catch (error) {
        console.error('SvelteReactivityAnalyzer error:', error);
      }
    }

    return detected;
  };

  const updateEditorDecorations = (detectedIssues: Issue[]) => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    // Clear previous decorations
    if (decorationsRef.current.length > 0) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }

    // Get current file location
    const currentLocation = activeTab === 'html' ? 'HTML' : activeTab === 'javascript' ? 'JavaScript' : 'CSS';

    // Filter issues for current file - match by file type rather than exact filename
    const fileIssues = detectedIssues.filter(issue => {
      const loc = issue.location || '';

      // For HTML tab, match HTML location or .html files
      if (currentLocation === 'HTML' && (loc === 'HTML' || loc.includes('.html'))) {
        return true;
      }

      // For JavaScript tab, match JavaScript location or .js/.jsx/.ts/.tsx files
      if (currentLocation === 'JavaScript' && (
        loc === 'JavaScript' ||
        loc.includes('.js') ||
        loc.includes('.jsx') ||
        loc.includes('.ts') ||
        loc.includes('.tsx')
      )) {
        return true;
      }

      // For CSS tab, match CSS location or .css files
      if (currentLocation === 'CSS' && (loc === 'CSS' || loc.includes('.css'))) {
        return true;
      }

      return false;
    });

    // Create new decorations
    const newDecorations = fileIssues.map((issue) => {
      // Find the index of this issue in the full issues array
      const fullArrayIndex = detectedIssues.findIndex(i =>
        i.line === issue.line &&
        i.column === issue.column &&
        i.type === issue.type &&
        i.message === issue.message
      );
      const isSelected = selectedIssueIndex === fullArrayIndex;
      const line = issue.line || 1;
      const column = issue.column || 1;
      const length = issue.length || 10;

      return {
        range: new monaco.Range(line, column, line, column + length),
        options: {
          isWholeLine: false,
          className: isSelected ? 'paradise-squiggle-selected' : 'paradise-squiggle-error',
          glyphMarginClassName: issue.severity === 'error' ? 'paradise-glyph-error' : 'paradise-glyph-warning',
          hoverMessage: { value: `**${issue.type}**: ${issue.message}` },
          inlineClassName: isSelected ? 'paradise-inline-selected' : 'paradise-inline-error'
        }
      };
    });

    // Apply decorations
    decorationsRef.current = editor.deltaDecorations([], newDecorations);
  };

  const clearAll = () => {
    setFiles(STARTER_FILES);
    setActiveFileIndex({ html: 0, javascript: 0, css: 0 });
    setIssues([]);
    setSelectedIssueIndex(null);
  };

  // Load saved projects list when component mounts
  useEffect(() => {
    setSavedProjects(FileManager.getSavedProjects());
  }, []);

  // Simple save - auto-generate name with timestamp
  const quickSave = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const key = `playground-${timestamp}`;
    const playgroundFiles: PlaygroundFiles = {
      html: files.html.map(f => f.content).join('\n'),
      css: files.css.map(f => f.content).join('\n'),
      js: files.javascript.map(f => f.content).join('\n'),
      metadata: {
        title: `Sample ${timestamp}`,
        created: Date.now()
      }
    };

    try {
      FileManager.saveToLocalStorage(key, playgroundFiles);
      alert('Sample saved!');
      setSavedProjects(FileManager.getSavedProjects());
    } catch (error) {
      alert(`Failed to save: ${error}`);
    }
  };

  // Simple load - show browser prompt to select
  const quickLoad = () => {
    const projects = FileManager.getSavedProjects();

    if (projects.length === 0) {
      alert('No saved samples found');
      return;
    }

    // Create selection prompt
    const projectList = projects.map((p, i) =>
      `${i + 1}. ${p.metadata?.title || 'Untitled'} (${p.metadata?.modified ? new Date(p.metadata.modified).toLocaleString() : 'no date'})`
    ).join('\n');

    const selection = prompt(`Select sample to load (1-${projects.length}):\n\n${projectList}`);

    if (!selection) return;

    const index = parseInt(selection) - 1;
    if (isNaN(index) || index < 0 || index >= projects.length) {
      alert('Invalid selection');
      return;
    }

    const playgroundFiles = FileManager.loadFromLocalStorage(projects[index].key);
    if (!playgroundFiles) {
      alert('Failed to load sample');
      return;
    }

    setFiles({
      html: [{ name: 'index.html', content: playgroundFiles.html }],
      javascript: [{ name: 'main.js', content: playgroundFiles.js }],
      css: [{ name: 'styles.css', content: playgroundFiles.css }]
    });

    setActiveTab('html');
    setActiveFileIndex({ html: 0, javascript: 0, css: 0 });
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

      // Extract inline styles and external CSS
      const styleElements = doc.querySelectorAll('style');
      const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');
      let cssContent = '';

      // Get inline styles
      styleElements.forEach(style => {
        cssContent += style.textContent + '\n\n';
      });

      // Load external CSS files
      for (const link of Array.from(linkElements)) {
        const href = link.getAttribute('href');
        if (href) {
          try {
            let cssUrl = href;

            if (categoryKey === 'widget-patterns') {
              // Replace ../../css/ with /demo-content/widget-patterns/css/
              cssUrl = href.replace(/^\.\.\/\.\.\//g, '/demo-content/widget-patterns/');
            } else {
              // For other categories, resolve normally relative to the HTML file
              cssUrl = new URL(href, window.location.origin + filePath).pathname;
            }

            console.log('Fetching external CSS:', cssUrl);
            const cssResponse = await fetch(cssUrl);

            if (cssResponse.ok) {
              const externalCssContent = await cssResponse.text();
              console.log('Loaded external CSS, length:', externalCssContent.length, 'chars');
              cssContent += `/* From: ${href} */\n${externalCssContent}\n\n`;
            } else {
              console.warn('Failed to fetch CSS:', cssUrl, 'Status:', cssResponse.status);
            }
          } catch (err) {
            console.error('Exception loading external CSS:', href, err);
          }
        }
      }

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

      // Remove scripts, styles, and link elements from HTML for cleaner view
      styleElements.forEach(el => el.remove());
      scriptElements.forEach(el => el.remove());
      linkElements.forEach(el => el.remove());

      // Only use body content (not full document with head)
      const htmlContent = doc.body ? doc.body.innerHTML : doc.documentElement.outerHTML;

      // Load into playground
      setFiles({
        html: [{ name: exampleFile, content: htmlContent }],
        javascript: jsContent ? [{ name: 'script.js', content: jsContent }] : [{ name: 'main.js', content: '' }],
        css: cssContent ? [{ name: 'styles.css', content: cssContent }] : [{ name: 'styles.css', content: '' }]
      });

      setActiveTab('html');
      setActiveFileIndex({ html: 0, javascript: 0, css: 0 });
      setShowSamplesModal(false);
      // Issues will be automatically analyzed by the useEffect

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
        } else if (showFixModal) {
          setShowFixModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showSamplesModal, showHelpModal, showFixModal]);

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
            <div className="flex gap-4 flex-wrap items-center">
              {analyzing && (
                <div className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              )}
              <button
                onClick={() => {
                  setPreviewSRInitialState(false);
                  setPreviewSwitchInitialState(false);
                  setShowPreviewModal(true);
                }}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 flex items-center gap-2"
              >
                <span>▶</span> Preview
              </button>
              <button
                onClick={() => {
                  setPreviewSRInitialState(true);
                  setPreviewSwitchInitialState(false);
                  setShowPreviewModal(true);
                }}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 flex items-center gap-2"
              >
                <span>🔊</span> Screen Reader
              </button>
              <button
                onClick={() => {
                  setPreviewSRInitialState(false);
                  setPreviewSwitchInitialState(true);
                  setShowPreviewModal(true);
                }}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 flex items-center gap-2"
              >
                <span>🎛️</span> Switches
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
                <div className="flex items-center gap-2 mr-4">
                  <button
                    onClick={quickSave}
                    className="px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                    title="Save current code as a sample"
                  >
                    Save
                  </button>
                  <button
                    onClick={quickLoad}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    title="Load a saved sample"
                  >
                    Load
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                    title="Clear all files and reset to empty state"
                  >
                    Clear All
                  </button>
                </div>
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
                  key={`${activeTab}-${activeFileIndex[activeTab]}`}
                  height="600px"
                  language={getLanguage()}
                  value={currentFile.content}
                  onChange={(value) => updateFile(value || '')}
                  theme="vs-light"
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    monacoRef.current = monaco;

                    // Define custom CSS classes for squiggles
                    const style = document.createElement('style');
                    style.innerHTML = `
                      .paradise-squiggle-error {
                        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 3' enable-background='new 0 0 6 3' height='3' width='6'%3E%3Cg fill='%23dc2626'%3E%3Cpolygon points='5.5,0 2.5,3 1.1,3 4.1,0'/%3E%3Cpolygon points='4,0 6,2 6,0.6 5.4,0'/%3E%3Cpolygon points='0,2 1,3 2.4,3 0,0.6'/%3E%3C/g%3E%3C/svg%3E") repeat-x bottom left;
                        padding-bottom: 3px;
                      }
                      .paradise-squiggle-selected {
                        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 3' enable-background='new 0 0 6 3' height='3' width='6'%3E%3Cg fill='%23eab308'%3E%3Cpolygon points='5.5,0 2.5,3 1.1,3 4.1,0'/%3E%3Cpolygon points='4,0 6,2 6,0.6 5.4,0'/%3E%3Cpolygon points='0,2 1,3 2.4,3 0,0.6'/%3E%3C/g%3E%3C/svg%3E") repeat-x bottom left;
                        padding-bottom: 3px;
                      }
                      .paradise-inline-error {
                        background-color: rgba(220, 38, 38, 0.1);
                      }
                      .paradise-inline-selected {
                        background-color: rgba(234, 179, 8, 0.2);
                      }
                      .paradise-glyph-error::before {
                        content: "●";
                        color: #dc2626;
                      }
                      .paradise-glyph-warning::before {
                        content: "●";
                        color: #f59e0b;
                      }
                    `;
                    document.head.appendChild(style);

                    // Update decorations when mounted
                    updateEditorDecorations(issues);
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    padding: { top: 16, bottom: 16 },
                    glyphMargin: true,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Panel - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Analysis Results</h2>

              {issues.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4" aria-hidden="true">
                    {analyzing ? '⏳' : '✅'}
                  </div>
                  <p className="text-gray-600">
                    {analyzing ? 'Analyzing code...' : 'No accessibility issues found!'}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4" role="alert">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3" aria-hidden="true">⚠️</span>
                      <div>
                        <p className="font-semibold text-red-900">{issues.length} Issue{issues.length !== 1 ? 's' : ''} Found</p>
                        <p className="text-sm text-red-700">Click each issue to highlight in code</p>
                      </div>
                    </div>
                  </div>

                  {/* Real issues */}
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`border-l-4 p-4 rounded cursor-pointer transition-all ${
                          selectedIssueIndex === index
                            ? 'border-yellow-500 bg-yellow-100'
                            : issue.severity === 'error'
                            ? 'border-red-500 bg-red-50 hover:bg-red-100'
                            : issue.severity === 'warning'
                            ? 'border-orange-500 bg-orange-50 hover:bg-orange-100'
                            : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                        }`}
                        onClick={() => {
                          setSelectedIssueIndex(index);

                          // Switch to the correct tab based on issue location
                          const loc = issue.location || '';
                          if (loc === 'HTML' || loc.includes('.html')) {
                            setActiveTab('html');
                          } else if (loc === 'JavaScript' || loc.includes('.js') || loc.includes('.jsx') || loc.includes('.ts') || loc.includes('.tsx')) {
                            setActiveTab('javascript');
                          } else if (loc === 'CSS' || loc.includes('.css')) {
                            setActiveTab('css');
                          }

                          // Wait for tab switch and editor re-render before updating decorations and jumping
                          setTimeout(() => {
                            updateEditorDecorations(issues);
                            if (issue.line && editorRef.current) {
                              editorRef.current.revealLineInCenter(issue.line);
                              editorRef.current.setPosition({ lineNumber: issue.line, column: issue.column || 1 });
                            }
                          }, 200);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className={`font-semibold ${
                              selectedIssueIndex === index
                                ? 'text-yellow-900'
                                : issue.severity === 'error'
                                ? 'text-red-900'
                                : issue.severity === 'warning'
                                ? 'text-orange-900'
                                : 'text-blue-900'
                            }`}>
                              {issue.type}
                            </div>
                            <div className={`text-sm mt-1 ${
                              selectedIssueIndex === index
                                ? 'text-yellow-700'
                                : issue.severity === 'error'
                                ? 'text-red-700'
                                : issue.severity === 'warning'
                                ? 'text-orange-700'
                                : 'text-blue-700'
                            }`}>
                              {issue.location}
                              {issue.line && `:${issue.line}`}
                              {issue.column && `:${issue.column}`}
                              {' - '}
                              {issue.message}
                            </div>
                            {issue.wcag.length > 0 && (
                              <div className="text-xs mt-1 text-gray-600">
                                WCAG: {issue.wcag.join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {issue.fix && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFix(issue.fix!);
                                  setShowFixModal(true);
                                }}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 flex-shrink-0"
                                title="View suggested fix"
                              >
                                ⚡ Fix
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showHelp(issue.type.toLowerCase().replace(/\s+/g, '-'));
                              }}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                              title="View help for this issue"
                            >
                              ? Help
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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

      {/* Fix Modal */}
      {showFixModal && selectedFix && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFixModal(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowFixModal(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fix-modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-900 text-white px-8 py-6 flex items-center justify-between">
              <div>
                <h2 id="fix-modal-title" className="text-3xl font-bold mb-2">Suggested Fix</h2>
                <p className="text-green-100">Apply this fix to resolve the issue</p>
              </div>
              <button
                onClick={() => setShowFixModal(false)}
                className="text-white/80 hover:text-white text-4xl leading-none px-3 focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Close fix modal"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedFix.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Code to Add</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  <code>{selectedFix.code}</code>
                </pre>
              </div>

              {selectedFix.location && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Location</h4>
                  <p className="text-sm text-blue-800">
                    {selectedFix.location.file && `File: ${selectedFix.location.file}`}
                    {selectedFix.location.line && ` • Line: ${selectedFix.location.line}`}
                    {selectedFix.location.column && ` • Column: ${selectedFix.location.column}`}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowFixModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Apply the fix to the editor
                  if (selectedFix && editorRef.current) {
                    const currentContent = currentFile.content;
                    const fixLocation = selectedFix.location;

                    // If we have a specific line, try to insert at that location
                    if (fixLocation.line) {
                      const lines = currentContent.split('\n');
                      const targetLine = fixLocation.line - 1; // Convert to 0-indexed

                      if (targetLine >= 0 && targetLine < lines.length) {
                        // Insert the fix code after the target line
                        lines.splice(targetLine + 1, 0, selectedFix.code);
                        const newContent = lines.join('\n');
                        updateFile(newContent);

                        // Jump to the inserted code
                        setTimeout(() => {
                          if (editorRef.current) {
                            editorRef.current.revealLineInCenter(targetLine + 2);
                            editorRef.current.setPosition({
                              lineNumber: targetLine + 2,
                              column: 1
                            });
                          }
                        }, 100);
                      }
                    } else {
                      // If no specific line, append to the end
                      const newContent = currentContent + '\n\n' + selectedFix.code;
                      updateFile(newContent);
                    }
                  }

                  setShowFixModal(false);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
              >
                Apply Fix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal with Screen Reader and Switch Simulator */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        htmlContent={files.html.map(f => f.content).join('\n')}
        cssContent={files.css.map(f => f.content).join('\n')}
        jsContent={files.javascript.map(f => f.content).join('\n')}
        initialScreenReaderEnabled={previewSRInitialState}
        initialSwitchSimulatorEnabled={previewSwitchInitialState}
      />
    </div>
  );
}
