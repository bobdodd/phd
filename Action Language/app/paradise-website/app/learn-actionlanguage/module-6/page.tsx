export default function Module6() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-green via-paradise-orange to-paradise-purple text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white text-paradise-green w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl">
              6
            </div>
            <div>
              <h1 className="text-5xl font-bold">
                Building VS Code Extensions
              </h1>
              <p className="text-xl text-white/90 mt-2">
                Integrate your analyzers into VS Code
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-3xl">
            <p className="text-lg">
              <strong>Time:</strong> 60+ minutes • <strong>Level:</strong> Advanced
            </p>
            <p className="text-lg mt-2">
              Learn how to create VS Code extensions that use Paradise analyzers to provide
              real-time accessibility feedback with inline diagnostics and one-click fixes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Quick Navigation */}
          <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue/20 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-paradise-blue">Module Contents</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <a href="#vscode-basics" className="text-paradise-blue hover:underline">→ VS Code Extension Basics</a>
              <a href="#paradise-extension" className="text-paradise-blue hover:underline">→ Paradise Extension Architecture</a>
              <a href="#integration" className="text-paradise-blue hover:underline">→ Integrating Your Analyzers</a>
              <a href="#diagnostics" className="text-paradise-blue hover:underline">→ Creating Diagnostics</a>
              <a href="#code-actions" className="text-paradise-blue hover:underline">→ One-Click Fixes (Code Actions)</a>
              <a href="#complete-example" className="text-paradise-blue hover:underline">→ Complete Example</a>
              <a href="#publishing" className="text-paradise-blue hover:underline">→ Publishing Your Extension</a>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg mb-12">
              <h3 className="text-2xl font-semibold text-paradise-green mb-3 mt-0">What You'll Build</h3>
              <p className="text-gray-700 mb-0">
                In this module, you'll create a VS Code extension that integrates your custom analyzers
                from Module 5 into the editor. Users will see real-time squiggly underlines for issues,
                hover for details, and click to apply fixes—just like the official Paradise extension.
              </p>
            </div>

            {/* VS Code Basics */}
            <section id="vscode-basics">
              <h2 className="text-3xl font-bold mt-12 mb-6">VS Code Extension Basics</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                VS Code extensions are Node.js applications that use the VS Code Extension API.
                Let's start with the minimal structure:
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Extension Structure</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Project Structure:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`my-paradise-extension/
├── package.json              # Extension manifest
├── src/
│   ├── extension.js         # Main entry point
│   ├── analyzers/           # Your custom analyzers
│   │   ├── MyAnalyzer.js
│   │   └── index.js
│   ├── diagnostics.js       # Diagnostic provider
│   ├── codeActions.js       # Fix provider
│   └── paradise/            # Paradise core
│       ├── parser.js        # CREATE function
│       └── utils.js
└── .vscodeignore`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">package.json</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Extension Manifest:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  "name": "my-paradise-extension",
  "displayName": "Paradise Custom Analyzers",
  "description": "Accessibility analysis with custom rules",
  "version": "1.0.0",
  "publisher": "your-name",
  "engines": {
    "vscode": "^1.80.0"
  },
  "categories": ["Linters"],
  "activationEvents": [
    "onLanguage:javascript",
    "onLanguage:typescript",
    "onLanguage:javascriptreact",
    "onLanguage:typescriptreact"
  ],
  "main": "./src/extension.js",
  "contributes": {
    "configuration": {
      "title": "Paradise Custom",
      "properties": {
        "paradise.enable": {
          "type": "boolean",
          "default": true,
          "description": "Enable Paradise analysis"
        },
        "paradise.analyzers": {
          "type": "array",
          "default": ["PositiveTabIndexAnalyzer"],
          "description": "Enabled custom analyzers"
        }
      }
    }
  }
}`}</code></pre>
              </div>
            </section>

            {/* Paradise Extension Architecture */}
            <section id="paradise-extension">
              <h2 className="text-3xl font-bold mt-12 mb-6">Paradise Extension Architecture</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The Paradise VS Code extension follows a clean architecture with separation of concerns:
              </p>

              <div className="bg-gradient-to-r from-paradise-green/10 to-paradise-blue/10 rounded-lg p-8 my-8 border border-paradise-blue/20">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-paradise-green text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Document Change Listener</h4>
                      <p className="text-gray-700 text-sm">
                        Watches for file edits, triggers analysis on save or after typing delay
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-paradise-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Parser (CREATE)</h4>
                      <p className="text-gray-700 text-sm">
                        Transforms source code to ActionLanguage using Babel/Acorn/etc.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-paradise-orange text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Analyzer Engine (READ)</h4>
                      <p className="text-gray-700 text-sm">
                        Runs all enabled analyzers, collects issues
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-paradise-purple text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Diagnostic Provider</h4>
                      <p className="text-gray-700 text-sm">
                        Converts issues to VS Code diagnostics (squiggly underlines)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Code Action Provider</h4>
                      <p className="text-gray-700 text-sm">
                        Provides "Apply Fix" buttons that modify the document
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Integration */}
            <section id="integration">
              <h2 className="text-3xl font-bold mt-12 mb-6">Integrating Your Analyzers</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Let's integrate the PositiveTabIndexAnalyzer from Module 5 into a VS Code extension.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 1: Main Extension File</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">src/extension.js:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const vscode = require('vscode');
const { createParser } = require('./paradise/parser');
const { createDiagnosticsProvider } = require('./diagnostics');
const { createCodeActionProvider } = require('./codeActions');
const analyzers = require('./analyzers');

let diagnosticCollection;

/**
 * Extension activation - called when extension loads
 */
function activate(context) {
  console.log('Paradise Custom extension activated');

  // Create diagnostic collection
  diagnosticCollection = vscode.languages.createDiagnosticCollection('paradise');
  context.subscriptions.push(diagnosticCollection);

  // Initialize analyzers
  const analyzerInstances = [
    new analyzers.PositiveTabIndexAnalyzer(),
    new analyzers.DuplicateListenerAnalyzer(),
    // Add more custom analyzers here
  ];

  // Create parser (CREATE function)
  const parser = createParser();

  // Create diagnostic provider
  const diagnosticsProvider = createDiagnosticsProvider(
    parser,
    analyzerInstances,
    diagnosticCollection
  );

  // Listen for document changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      // Debounce analysis (run 500ms after typing stops)
      clearTimeout(diagnosticsProvider.debounceTimer);
      diagnosticsProvider.debounceTimer = setTimeout(() => {
        diagnosticsProvider.analyze(event.document);
      }, 500);
    })
  );

  // Listen for document open
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(document => {
      diagnosticsProvider.analyze(document);
    })
  );

  // Analyze currently open documents
  vscode.workspace.textDocuments.forEach(document => {
    diagnosticsProvider.analyze(document);
  });

  // Register code action provider (for fixes)
  const codeActionProvider = createCodeActionProvider(
    parser,
    analyzerInstances
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
      codeActionProvider,
      {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
      }
    )
  );

  console.log('Paradise Custom extension ready');
}

/**
 * Extension deactivation
 */
function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.clear();
    diagnosticCollection.dispose();
  }
}

module.exports = {
  activate,
  deactivate
};`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 2: Parser Integration</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">src/paradise/parser.js:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const acorn = require('acorn');
const jsx = require('acorn-jsx');

/**
 * Create parser (CREATE function)
 */
function createParser() {
  const parser = acorn.Parser.extend(jsx());

  return {
    /**
     * Parse JavaScript/TypeScript to ActionLanguage
     */
    parse(code, language = 'javascript') {
      try {
        // Parse to AST
        const ast = parser.parse(code, {
          sourceType: 'module',
          ecmaVersion: 'latest',
          locations: true
        });

        // Transform AST to ActionLanguage
        const actionTree = transformAST(ast);

        return { success: true, actionTree };
      } catch (error) {
        return { success: false, error };
      }
    }
  };
}

/**
 * Transform AST to ActionLanguage (simplified)
 */
function transformAST(ast) {
  const actionTree = [];

  // Walk AST and extract ActionLanguage nodes
  walk(ast, {
    // Event listeners
    CallExpression(node) {
      if (node.callee.property?.name === 'addEventListener') {
        actionTree.push({
          actionType: 'eventHandler',
          event: node.arguments[0]?.value,
          element: extractElement(node.callee.object),
          handler: extractHandler(node.arguments[1]),
          location: node.loc
        });
      }
    },

    // Tab index changes
    AssignmentExpression(node) {
      if (node.left.property?.name === 'tabIndex') {
        actionTree.push({
          actionType: 'tabIndexChange',
          element: extractElement(node.left.object),
          newValue: node.right.value,
          location: node.loc
        });
      }
    },

    // Add more transformations as needed
  });

  return actionTree;
}

function walk(node, visitors) {
  // Simple AST walker (use a proper library like estree-walker in production)
  const type = node.type;
  if (visitors[type]) {
    visitors[type](node);
  }

  for (const key in node) {
    const child = node[key];
    if (child && typeof child === 'object') {
      if (Array.isArray(child)) {
        child.forEach(c => walk(c, visitors));
      } else if (child.type) {
        walk(child, visitors);
      }
    }
  }
}

function extractElement(node) {
  if (node.type === 'Identifier') {
    return { binding: node.name };
  }
  // Handle more cases
  return { binding: 'unknown' };
}

function extractHandler(node) {
  return {
    actionType: 'functionExpression',
    body: []  // Simplified
  };
}

module.exports = { createParser };`}</code></pre>
              </div>
            </section>

            {/* Diagnostics */}
            <section id="diagnostics">
              <h2 className="text-3xl font-bold mt-12 mb-6">Creating Diagnostics</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Diagnostics are the squiggly underlines users see in the editor. Let's create a
                provider that converts analyzer issues to VS Code diagnostics.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">src/diagnostics.js:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const vscode = require('vscode');

/**
 * Create diagnostics provider
 */
function createDiagnosticsProvider(parser, analyzers, diagnosticCollection) {
  return {
    debounceTimer: null,

    /**
     * Analyze a document and create diagnostics
     */
    analyze(document) {
      // Only analyze JavaScript/TypeScript files
      if (!this.isSupported(document.languageId)) {
        return;
      }

      const code = document.getText();

      // CREATE: Parse to ActionLanguage
      const parseResult = parser.parse(code, document.languageId);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error);
        return;
      }

      const { actionTree } = parseResult;

      // READ: Run all analyzers
      const allIssues = [];
      for (const analyzer of analyzers) {
        const issues = analyzer.analyze(actionTree);
        allIssues.push(...issues);
      }

      // Convert issues to VS Code diagnostics
      const diagnostics = allIssues.map(issue =>
        this.issueToDiagnostic(issue, document)
      );

      // Update diagnostic collection
      diagnosticCollection.set(document.uri, diagnostics);
    },

    /**
     * Convert Paradise issue to VS Code diagnostic
     */
    issueToDiagnostic(issue, document) {
      // Get location from ActionLanguage node
      const location = issue.node.location || { start: { line: 0, column: 0 } };

      // Convert to VS Code range
      const startPos = new vscode.Position(
        location.start.line - 1,
        location.start.column
      );
      const endPos = location.end
        ? new vscode.Position(location.end.line - 1, location.end.column)
        : startPos.translate(0, 10);  // Default 10 char underline

      const range = new vscode.Range(startPos, endPos);

      // Convert severity
      const severity = this.getSeverity(issue.severity);

      // Create diagnostic
      const diagnostic = new vscode.Diagnostic(
        range,
        issue.message,
        severity
      );

      // Add metadata
      diagnostic.code = issue.type;
      diagnostic.source = 'paradise';

      // Add WCAG information
      if (issue.wcag && issue.wcag.length > 0) {
        diagnostic.relatedInformation = issue.wcag.map(criterion =>
          new vscode.DiagnosticRelatedInformation(
            new vscode.Location(document.uri, range),
            \`WCAG \${criterion}: \${this.getWCAGName(criterion)}\`
          )
        );
      }

      // Store issue for code actions
      diagnostic.issue = issue;

      return diagnostic;
    },

    /**
     * Convert severity string to VS Code severity
     */
    getSeverity(severityStr) {
      switch (severityStr) {
        case 'error':
          return vscode.DiagnosticSeverity.Error;
        case 'warning':
          return vscode.DiagnosticSeverity.Warning;
        case 'info':
          return vscode.DiagnosticSeverity.Information;
        default:
          return vscode.DiagnosticSeverity.Hint;
      }
    },

    /**
     * Get WCAG criterion name
     */
    getWCAGName(criterion) {
      const names = {
        '2.1.1': 'Keyboard',
        '2.4.3': 'Focus Order',
        '4.1.2': 'Name, Role, Value'
        // Add more mappings
      };
      return names[criterion] || criterion;
    },

    /**
     * Check if language is supported
     */
    isSupported(languageId) {
      return ['javascript', 'typescript', 'javascriptreact', 'typescriptreact']
        .includes(languageId);
    }
  };
}

module.exports = { createDiagnosticsProvider };`}</code></pre>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">Real-Time Feedback</p>
                <p className="text-gray-700 mb-0">
                  With this diagnostic provider, users see squiggly underlines appear as they type,
                  hover for details, and see WCAG criteria links—all powered by your custom analyzers!
                </p>
              </div>
            </section>

            {/* Code Actions */}
            <section id="code-actions">
              <h2 className="text-3xl font-bold mt-12 mb-6">One-Click Fixes (Code Actions)</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Code actions are the "Apply Fix" buttons users see in the lightbulb menu. Let's create
                a provider that generates fixes using your UPDATE operations.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">src/codeActions.js:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const vscode = require('vscode');
const fixGenerators = require('./fixGenerators');

/**
 * Create code action provider
 */
function createCodeActionProvider(parser, analyzers) {
  return {
    /**
     * Provide code actions for diagnostics
     */
    provideCodeActions(document, range, context) {
      const codeActions = [];

      // Get diagnostics at current position
      const diagnostics = context.diagnostics.filter(
        d => d.source === 'paradise'
      );

      for (const diagnostic of diagnostics) {
        const issue = diagnostic.issue;
        if (!issue) continue;

        // Get fix generator for this issue type
        const fixer = fixGenerators.getFixGenerator(issue.type);
        if (!fixer) continue;

        // Create code action
        const action = new vscode.CodeAction(
          \`Fix: \${issue.message}\`,
          vscode.CodeActionKind.QuickFix
        );

        action.diagnostics = [diagnostic];
        action.isPreferred = true;

        // Generate the fix
        action.edit = this.createWorkspaceEdit(
          document,
          issue,
          fixer,
          parser
        );

        codeActions.push(action);
      }

      return codeActions;
    },

    /**
     * Create workspace edit for a fix
     */
    createWorkspaceEdit(document, issue, fixer, parser) {
      const edit = new vscode.WorkspaceEdit();

      // Parse current document to ActionLanguage
      const code = document.getText();
      const parseResult = parser.parse(code, document.languageId);

      if (!parseResult.success) {
        return edit;
      }

      // UPDATE: Generate fix nodes
      const fixNodes = fixer.generateFix(issue, parseResult.actionTree);

      // GENERATE: Transform fix back to source code
      const fixCode = this.generateCode(fixNodes, document.languageId);

      // Create text edit
      const location = issue.node.location;
      if (location) {
        const range = new vscode.Range(
          new vscode.Position(location.start.line - 1, location.start.column),
          new vscode.Position(location.end.line - 1, location.end.column)
        );

        edit.replace(document.uri, range, fixCode);
      }

      return edit;
    },

    /**
     * GENERATE: Transform ActionLanguage back to source code
     */
    generateCode(actionNodes, language) {
      // This is the GENERATE step - transform ActionLanguage back to source

      if (language === 'javascript' || language === 'typescript') {
        return this.generateJavaScript(actionNodes);
      }

      // Add more languages here
      return '';
    },

    /**
     * Generate JavaScript code from ActionLanguage nodes
     */
    generateJavaScript(nodes) {
      let code = '';

      for (const node of nodes) {
        switch (node.actionType) {
          case 'eventHandler':
            code += \`\\n\${node.element.binding}.addEventListener('\${node.event}', function(event) {\\n\`;
            code += this.generateBody(node.handler.body);
            code += \`});\\n\`;
            break;

          case 'tabIndexChange':
            code += \`\${node.element.binding}.tabIndex = \${node.newValue};\\n\`;
            break;

          // Add more node types
        }
      }

      return code;
    },

    generateBody(bodyNodes) {
      let code = '';
      for (const node of bodyNodes) {
        if (node.actionType === 'preventDefault') {
          code += '  event.preventDefault();\\n';
        }
        // Handle more action types
      }
      return code;
    }
  };
}

module.exports = { createCodeActionProvider };`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Fix Generators</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">src/fixGenerators/index.js:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const PositiveTabIndexFixer = require('./PositiveTabIndexFixer');
const MouseOnlyClickFixer = require('./MouseOnlyClickFixer');

// Map issue types to fix generators
const fixers = {
  'positive-tabindex': new PositiveTabIndexFixer(),
  'mouse-only-click': new MouseOnlyClickFixer(),
  // Add more fixers
};

/**
 * Get fix generator for issue type
 */
function getFixGenerator(issueType) {
  return fixers[issueType];
}

module.exports = { getFixGenerator };`}</code></pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">src/fixGenerators/PositiveTabIndexFixer.js:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`/**
 * Fix generator for positive-tabindex issues
 */
class PositiveTabIndexFixer {
  /**
   * Generate fix: Change positive tabIndex to 0
   */
  generateFix(issue, actionTree) {
    const node = issue.node;

    // CREATE new ActionLanguage node with tabIndex=0
    return [{
      ...node,
      newValue: 0,  // Change from positive to 0
      metadata: {
        ...node.metadata,
        fixedBy: 'PositiveTabIndexFixer'
      }
    }];
  }
}

module.exports = PositiveTabIndexFixer;`}</code></pre>
              </div>
            </section>

            {/* Complete Example */}
            <section id="complete-example">
              <h2 className="text-3xl font-bold mt-12 mb-6">Complete Example: End-to-End</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Let's see the complete flow from user typing code to applying a fix:
              </p>

              <div className="space-y-6 my-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gray-600">
                  <h4 className="font-semibold text-lg mb-3">1. User Types Code</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`const button = document.getElementById('btn');
button.tabIndex = 5;  // User types this`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-semibold text-lg mb-3">2. Extension Parses (CREATE)</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`{
  actionType: "tabIndexChange",
  element: { binding: "button" },
  newValue: 5,
  location: { start: { line: 2, column: 0 } }
}`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
                  <h4 className="font-semibold text-lg mb-3">3. Analyzer Detects Issue (READ)</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`{
  type: "positive-tabindex",
  severity: "warning",
  message: "Positive tabIndex value (5) disrupts natural tab order",
  wcag: ["2.4.3"]
}`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-purple">
                  <h4 className="font-semibold text-lg mb-3">4. VS Code Shows Diagnostic</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Yellow squiggly underline appears under <code className="bg-gray-100 px-2 py-1 rounded">button.tabIndex = 5</code>
                  </p>
                  <p className="text-xs text-gray-600">
                    Hover shows: "Positive tabIndex value (5) disrupts natural tab order (WCAG 2.4.3)"
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
                  <h4 className="font-semibold text-lg mb-3">5. User Clicks "Apply Fix"</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Lightbulb appears, user clicks "Fix: Positive tabIndex value..."
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-semibold text-lg mb-3">6. Fix Generator Creates Fix (UPDATE)</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`{
  actionType: "tabIndexChange",
  element: { binding: "button" },
  newValue: 0  // Changed from 5 to 0!
}`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gray-600">
                  <h4 className="font-semibold text-lg mb-3">7. Code Generator Produces Code (GENERATE)</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`const button = document.getElementById('btn');
button.tabIndex = 0;  // Fixed!`}</code></pre>
                </div>

                <div className="bg-paradise-green/10 rounded-lg p-6 border border-paradise-green">
                  <h4 className="font-semibold text-lg mb-3">✅ Result: Issue Fixed</h4>
                  <p className="text-sm text-gray-700">
                    The diagnostic disappears, code is fixed, user moves on. All powered by
                    CRUD operations on ActionLanguage!
                  </p>
                </div>
              </div>
            </section>

            {/* Publishing */}
            <section id="publishing">
              <h2 className="text-3xl font-bold mt-12 mb-6">Publishing Your Extension</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Once your extension is working, you can publish it to the VS Code Marketplace
                for others to use.
              </p>

              <div className="space-y-6 my-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
                  <h4 className="font-semibold text-lg mb-3">Step 1: Install vsce</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto"><code>{`npm install -g @vscode/vsce`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-semibold text-lg mb-3">Step 2: Package Extension</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto"><code>{`vsce package
# Creates: my-paradise-extension-1.0.0.vsix`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
                  <h4 className="font-semibold text-lg mb-3">Step 3: Test Locally</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto"><code>{`code --install-extension my-paradise-extension-1.0.0.vsix`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-purple">
                  <h4 className="font-semibold text-lg mb-3">Step 4: Publish to Marketplace</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto"><code>{`vsce publish
# Requires Azure DevOps Personal Access Token`}</code></pre>
                  <p className="text-sm text-gray-600 mt-3">
                    Get a PAT from: https://dev.azure.com/your-org/_usersSettings/tokens
                  </p>
                </div>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">Share Your Analyzers</p>
                <p className="text-gray-700 mb-0">
                  Publishing your extension lets teams worldwide benefit from your custom analyzers.
                  Your detections work universally across JavaScript, TypeScript, and future languages
                  thanks to ActionLanguage!
                </p>
              </div>
            </section>

            {/* Real Paradise Extension */}
            <section id="real-extension">
              <h2 className="text-3xl font-bold mt-12 mb-6">The Real Paradise Extension</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The official Paradise VS Code extension follows this exact architecture. Let's look
                at key excerpts from the actual implementation:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">From the real vscode-extension/src/extension.js:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Real Paradise extension excerpts

// Initialize analyzers (lines 50-59)
const analyzers = [
  new KeyboardAnalyzer(),
  new FocusAnalyzer(),
  new ARIAAnalyzer(),
  new WidgetPatternValidator(),
  new ContextChangeAnalyzer(),
  new TimingAnalyzer(),
  new SemanticAnalyzer(),
  new AccessibilityReporter()
];

// Document change listener with debounce (lines 120-135)
context.subscriptions.push(
  vscode.workspace.onDidSaveTextDocument(document => {
    analyzeDocument(document);
  })
);

// Diagnostic creation (lines 200-230)
function createDiagnostic(issue, document) {
  const range = new vscode.Range(
    new vscode.Position(issue.line - 1, issue.column),
    new vscode.Position(issue.line - 1, issue.column + issue.length)
  );

  const severity = getSeverity(issue.severity);
  const diagnostic = new vscode.Diagnostic(range, issue.message, severity);

  diagnostic.code = issue.type;
  diagnostic.source = 'paradise';

  return diagnostic;
}

// Code actions with 23+ tailored fixes (lines 1100-1700+)
function provideTailoredFix(issue, document) {
  if (issue.type === 'mouse-only-click') {
    return generateKeyboardHandlerFix(issue, document);
  } else if (issue.type === 'positive-tabindex') {
    return generateTabIndexFix(issue, document);
  }
  // ... 20+ more fix generators
}`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                The real extension has:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>✅ 9 production analyzers</li>
                <li>✅ 35+ issue detections</li>
                <li>✅ 23+ tailored fix generators</li>
                <li>✅ WCAG documentation with links</li>
                <li>✅ Before/after code examples</li>
                <li>✅ Scoring system</li>
                <li>✅ Settings/configuration</li>
              </ul>
            </section>

            {/* Module Complete */}
            <div className="bg-gradient-to-r from-paradise-green via-paradise-orange to-paradise-purple text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-3">Module 6 Complete! 🎉</h3>
              <p className="text-lg mb-6">
                You now know how to build VS Code extensions that integrate Paradise analyzers,
                provide real-time feedback with diagnostics, and offer one-click fixes with code
                actions. You can extend Paradise for your team's needs and publish extensions to
                the marketplace!
              </p>
              <div className="flex gap-4">
                <a href="/playground" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Try the Playground
                </a>
                <a href="/extension" className="bg-paradise-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors">
                  Get VS Code Extension
                </a>
                <a href="/learn-actionlanguage" className="bg-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors border-2 border-white">
                  Back to Overview
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
