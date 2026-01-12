/**
 * ActionLanguage Accessibility Analyzer - VS Code Extension
 *
 * Provides real-time accessibility analysis for JavaScript files
 */

const vscode = require('vscode');
const path = require('path');

// Import the analyzer (path adjusted for extension location)
let parseAndTransform;
let AccessibilityReporter;

/**
 * Try to load the analyzer module
 */
function loadAnalyzer() {
  try {
    // Try relative path from extension
    const basePath = path.join(__dirname, '../../src');
    parseAndTransform = require(path.join(basePath, 'parser')).parseAndTransform;
    AccessibilityReporter = require(path.join(basePath, 'analyzer/AccessibilityReporter'));
    return true;
  } catch (error) {
    console.error('Failed to load analyzer:', error.message);
    return false;
  }
}

/**
 * Diagnostic collection for accessibility issues
 */
let diagnosticCollection;

/**
 * Debounce timer for analyze-on-type
 */
let analyzeTimer = null;

/**
 * Status bar item
 */
let statusBarItem;

/**
 * Output channel for detailed logs
 */
let outputChannel;

/**
 * Activate the extension
 */
function activate(context) {
  console.log('ActionLanguage Accessibility Analyzer is activating...');

  // Load the analyzer
  if (!loadAnalyzer()) {
    vscode.window.showErrorMessage(
      'ActionLanguage Accessibility: Failed to load analyzer module. ' +
      'Make sure the extension is installed correctly.'
    );
    return;
  }

  // Create diagnostic collection
  diagnosticCollection = vscode.languages.createDiagnosticCollection('actionlanguage-a11y');
  context.subscriptions.push(diagnosticCollection);

  // Create output channel
  outputChannel = vscode.window.createOutputChannel('ActionLanguage A11y');
  context.subscriptions.push(outputChannel);

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'actionlanguage-a11y.showReport';
  context.subscriptions.push(statusBarItem);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('actionlanguage-a11y.analyzeFile', analyzeCurrentFile),
    vscode.commands.registerCommand('actionlanguage-a11y.analyzeWorkspace', analyzeWorkspace),
    vscode.commands.registerCommand('actionlanguage-a11y.showReport', showReport)
  );

  // Register event listeners
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(onDocumentSave),
    vscode.workspace.onDidChangeTextDocument(onDocumentChange),
    vscode.window.onDidChangeActiveTextEditor(onEditorChange),
    vscode.workspace.onDidCloseTextDocument(onDocumentClose)
  );

  // Register code action provider
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      [{ language: 'javascript' }, { language: 'javascriptreact' }],
      new AccessibilityCodeActionProvider(),
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    )
  );

  // Analyze current file if one is open
  if (vscode.window.activeTextEditor) {
    const document = vscode.window.activeTextEditor.document;
    if (isJavaScriptFile(document)) {
      analyzeDocument(document);
    }
  }

  outputChannel.appendLine('ActionLanguage Accessibility Analyzer activated');
}

/**
 * Deactivate the extension
 */
function deactivate() {
  if (analyzeTimer) {
    clearTimeout(analyzeTimer);
  }
  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }
}

/**
 * Check if document is a JavaScript file
 */
function isJavaScriptFile(document) {
  return document.languageId === 'javascript' ||
         document.languageId === 'javascriptreact';
}

/**
 * Check if file should be excluded
 */
function shouldExclude(uri) {
  const config = vscode.workspace.getConfiguration('actionlanguage-a11y');
  const excludePatterns = config.get('excludePatterns', []);

  const relativePath = vscode.workspace.asRelativePath(uri);

  for (const pattern of excludePatterns) {
    // Simple glob matching
    const regex = new RegExp(
      '^' + pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '.') + '$'
    );
    if (regex.test(relativePath)) {
      return true;
    }
  }

  return false;
}

/**
 * Handle document save
 */
function onDocumentSave(document) {
  const config = vscode.workspace.getConfiguration('actionlanguage-a11y');

  if (!config.get('enable', true)) return;
  if (!config.get('analyzeOnSave', true)) return;
  if (!isJavaScriptFile(document)) return;
  if (shouldExclude(document.uri)) return;

  analyzeDocument(document);
}

/**
 * Handle document change
 */
function onDocumentChange(event) {
  const config = vscode.workspace.getConfiguration('actionlanguage-a11y');

  if (!config.get('enable', true)) return;
  if (!config.get('analyzeOnType', false)) return;
  if (!isJavaScriptFile(event.document)) return;
  if (shouldExclude(event.document.uri)) return;

  // Debounce analysis
  if (analyzeTimer) {
    clearTimeout(analyzeTimer);
  }

  const delay = config.get('analyzeOnTypeDelay', 1000);
  analyzeTimer = setTimeout(() => {
    analyzeDocument(event.document);
  }, delay);
}

/**
 * Handle editor change
 */
function onEditorChange(editor) {
  if (!editor) {
    statusBarItem.hide();
    return;
  }

  if (isJavaScriptFile(editor.document)) {
    updateStatusBar(editor.document);
  } else {
    statusBarItem.hide();
  }
}

/**
 * Handle document close
 */
function onDocumentClose(document) {
  diagnosticCollection.delete(document.uri);
}

/**
 * Analyze the current file
 */
async function analyzeCurrentFile() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage('No file is currently open');
    return;
  }

  if (!isJavaScriptFile(editor.document)) {
    vscode.window.showWarningMessage('Current file is not a JavaScript file');
    return;
  }

  await analyzeDocument(editor.document);
  vscode.window.showInformationMessage('Accessibility analysis complete');
}

/**
 * Analyze entire workspace
 */
async function analyzeWorkspace() {
  const files = await vscode.workspace.findFiles(
    '**/*.{js,jsx,mjs}',
    '**/node_modules/**'
  );

  if (files.length === 0) {
    vscode.window.showWarningMessage('No JavaScript files found in workspace');
    return;
  }

  const progress = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Analyzing accessibility...',
      cancellable: true
    },
    async (progress, token) => {
      let analyzed = 0;
      let totalIssues = 0;

      for (const file of files) {
        if (token.isCancellationRequested) break;
        if (shouldExclude(file)) continue;

        try {
          const document = await vscode.workspace.openTextDocument(file);
          const result = analyzeDocument(document);
          if (result) {
            totalIssues += result.issues.length;
          }
          analyzed++;

          progress.report({
            message: `${analyzed}/${files.length} files`,
            increment: (100 / files.length)
          });
        } catch (error) {
          outputChannel.appendLine(`Error analyzing ${file.fsPath}: ${error.message}`);
        }
      }

      return { analyzed, totalIssues };
    }
  );

  vscode.window.showInformationMessage(
    `Analyzed ${progress.analyzed} files, found ${progress.totalIssues} accessibility issues`
  );
}

/**
 * Analyze a document and update diagnostics
 */
function analyzeDocument(document) {
  const config = vscode.workspace.getConfiguration('actionlanguage-a11y');

  if (!config.get('enable', true)) {
    return null;
  }

  const code = document.getText();

  try {
    const tree = parseAndTransform(code);
    const reporter = new AccessibilityReporter();
    const result = reporter.analyze(tree);

    // Convert issues to diagnostics
    const diagnostics = convertToDiagnostics(result, document, config);
    diagnosticCollection.set(document.uri, diagnostics);

    // Update status bar
    updateStatusBar(document, result);

    // Log to output channel
    outputChannel.appendLine(
      `Analyzed ${path.basename(document.fileName)}: ` +
      `Grade ${result.grade} (${result.scores.overall}/100), ` +
      `${result.issues.length} issues`
    );

    return result;
  } catch (error) {
    // Parse error - show as diagnostic
    const diagnostic = new vscode.Diagnostic(
      new vscode.Range(0, 0, 0, 1),
      `Parse error: ${error.message}`,
      vscode.DiagnosticSeverity.Error
    );
    diagnostic.source = 'ActionLanguage A11y';
    diagnosticCollection.set(document.uri, [diagnostic]);

    outputChannel.appendLine(`Parse error in ${document.fileName}: ${error.message}`);
    return null;
  }
}

/**
 * Convert analysis issues to VS Code diagnostics
 */
function convertToDiagnostics(result, document, config) {
  const diagnostics = [];
  const minSeverity = config.get('minSeverity', 'info');
  const severityOrder = { error: 0, warning: 1, info: 2 };
  const minLevel = severityOrder[minSeverity] || 2;

  for (const issue of result.issues) {
    const issueLevel = severityOrder[issue.severity] || 2;
    if (issueLevel > minLevel) continue;

    // Try to find the relevant line in the document
    const range = findIssueRange(document, issue);

    // Map severity to VS Code severity
    let severity;
    switch (issue.severity) {
      case 'error':
        severity = vscode.DiagnosticSeverity.Error;
        break;
      case 'warning':
        severity = vscode.DiagnosticSeverity.Warning;
        break;
      default:
        severity = vscode.DiagnosticSeverity.Information;
    }

    const diagnostic = new vscode.Diagnostic(range, issue.message, severity);
    diagnostic.source = 'ActionLanguage A11y';
    diagnostic.code = issue.category;

    // Add related information if available
    if (issue.wcag && issue.wcag.length > 0) {
      diagnostic.code = {
        value: issue.wcag[0],
        target: vscode.Uri.parse(`https://www.w3.org/WAI/WCAG21/Understanding/${issue.wcag[0].toLowerCase().replace(/\./g, '')}.html`)
      };
    }

    // Add suggestion as related information
    if (issue.suggestion) {
      diagnostic.relatedInformation = [
        new vscode.DiagnosticRelatedInformation(
          new vscode.Location(document.uri, range),
          `Suggestion: ${issue.suggestion}`
        )
      ];
    }

    diagnostics.push(diagnostic);
  }

  return diagnostics;
}

/**
 * Find the range in the document for an issue
 */
function findIssueRange(document, issue) {
  const text = document.getText();

  // Try to find the element mentioned in the issue
  if (issue.element) {
    const elementPatterns = [
      new RegExp(`\\b${issue.element}\\s*\\.\\s*addEventListener`, 'g'),
      new RegExp(`\\b${issue.element}\\s*\\.\\s*on\\w+\\s*=`, 'g'),
      new RegExp(`\\bconst\\s+${issue.element}\\b`, 'g'),
      new RegExp(`\\blet\\s+${issue.element}\\b`, 'g'),
      new RegExp(`\\bvar\\s+${issue.element}\\b`, 'g'),
      new RegExp(`\\b${issue.element}\\b`, 'g')
    ];

    for (const pattern of elementPatterns) {
      const match = pattern.exec(text);
      if (match) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        return new vscode.Range(startPos, endPos);
      }
    }
  }

  // Try to find keywords from the issue message
  const keywords = ['addEventListener', 'onclick', 'click', 'keydown', 'keypress',
                    'setAttribute', 'aria-', 'role', 'tabindex', 'focus'];

  for (const keyword of keywords) {
    if (issue.message.toLowerCase().includes(keyword.toLowerCase())) {
      const index = text.indexOf(keyword);
      if (index !== -1) {
        const startPos = document.positionAt(index);
        const endPos = document.positionAt(index + keyword.length);
        return new vscode.Range(startPos, endPos);
      }
    }
  }

  // Default to first line
  return new vscode.Range(0, 0, 0, Math.min(text.indexOf('\n'), 100));
}

/**
 * Update status bar with analysis result
 */
function updateStatusBar(document, result) {
  if (!result) {
    // Try to get cached result
    const diagnostics = diagnosticCollection.get(document.uri);
    if (diagnostics && diagnostics.length > 0) {
      const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
      const warnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;

      statusBarItem.text = `$(warning) A11y: ${errors}E ${warnings}W`;
      statusBarItem.tooltip = `${errors} errors, ${warnings} warnings`;
      statusBarItem.backgroundColor = errors > 0
        ? new vscode.ThemeColor('statusBarItem.errorBackground')
        : warnings > 0
          ? new vscode.ThemeColor('statusBarItem.warningBackground')
          : undefined;
    } else {
      statusBarItem.text = '$(pass) A11y: OK';
      statusBarItem.tooltip = 'No accessibility issues';
      statusBarItem.backgroundColor = undefined;
    }
  } else {
    const gradeColors = {
      'A': '$(pass)',
      'B': '$(pass)',
      'C': '$(warning)',
      'D': '$(warning)',
      'F': '$(error)'
    };

    const icon = gradeColors[result.grade] || '$(info)';
    statusBarItem.text = `${icon} A11y: ${result.grade}`;
    statusBarItem.tooltip = `Accessibility Grade: ${result.grade} (${result.scores.overall}/100)\n` +
                           `Keyboard: ${result.scores.keyboard}%\n` +
                           `ARIA: ${result.scores.aria}%\n` +
                           `Focus: ${result.scores.focus}%\n` +
                           `Widgets: ${result.scores.widgets}%\n` +
                           `Issues: ${result.issues.length}`;

    statusBarItem.backgroundColor = result.grade === 'F' || result.grade === 'D'
      ? new vscode.ThemeColor('statusBarItem.errorBackground')
      : result.grade === 'C'
        ? new vscode.ThemeColor('statusBarItem.warningBackground')
        : undefined;
  }

  statusBarItem.show();
}

/**
 * Show detailed accessibility report
 */
async function showReport() {
  const editor = vscode.window.activeTextEditor;

  if (!editor || !isJavaScriptFile(editor.document)) {
    vscode.window.showWarningMessage('Open a JavaScript file to see the accessibility report');
    return;
  }

  const code = editor.document.getText();

  try {
    const tree = parseAndTransform(code);
    const reporter = new AccessibilityReporter();
    const result = reporter.analyze(tree);

    // Create webview panel
    const panel = vscode.window.createWebviewPanel(
      'a11yReport',
      `A11y Report: ${path.basename(editor.document.fileName)}`,
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );

    panel.webview.html = generateReportHTML(result, editor.document.fileName);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to generate report: ${error.message}`);
  }
}

/**
 * Generate HTML for the report webview
 */
function generateReportHTML(result, filename) {
  const gradeColor = {
    'A': '#22c55e',
    'B': '#84cc16',
    'C': '#eab308',
    'D': '#f97316',
    'F': '#ef4444'
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Report</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 20px;
      line-height: 1.6;
    }
    h1, h2, h3 { margin-top: 20px; }
    .grade {
      display: inline-block;
      font-size: 48px;
      font-weight: bold;
      color: ${gradeColor[result.grade]};
      border: 4px solid ${gradeColor[result.grade]};
      border-radius: 50%;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
    .scores {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .score-card {
      background: var(--vscode-editor-inactiveSelectionBackground);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .score-value {
      font-size: 24px;
      font-weight: bold;
    }
    .score-label { opacity: 0.8; }
    .issue {
      padding: 10px 15px;
      margin: 10px 0;
      border-left: 4px solid;
      background: var(--vscode-editor-inactiveSelectionBackground);
      border-radius: 0 4px 4px 0;
    }
    .issue-error { border-color: #ef4444; }
    .issue-warning { border-color: #f97316; }
    .issue-info { border-color: #3b82f6; }
    .issue-message { font-weight: 500; }
    .issue-suggestion {
      opacity: 0.8;
      font-size: 0.9em;
      margin-top: 5px;
    }
    .issue-meta {
      opacity: 0.6;
      font-size: 0.8em;
      margin-top: 5px;
    }
    .no-issues {
      color: #22c55e;
      padding: 20px;
      text-align: center;
      background: var(--vscode-editor-inactiveSelectionBackground);
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>Accessibility Report</h1>
  <p style="opacity: 0.7">${path.basename(filename)}</p>

  <div style="display: flex; align-items: center; gap: 20px; margin: 20px 0;">
    <div class="grade">${result.grade}</div>
    <div>
      <div style="font-size: 24px; font-weight: bold;">${result.scores.overall}/100</div>
      <div style="opacity: 0.7;">Overall Score</div>
    </div>
  </div>

  <h2>Category Scores</h2>
  <div class="scores">
    <div class="score-card">
      <div class="score-value">${result.scores.keyboard}%</div>
      <div class="score-label">Keyboard</div>
    </div>
    <div class="score-card">
      <div class="score-value">${result.scores.aria}%</div>
      <div class="score-label">ARIA</div>
    </div>
    <div class="score-card">
      <div class="score-value">${result.scores.focus}%</div>
      <div class="score-label">Focus</div>
    </div>
    <div class="score-card">
      <div class="score-value">${result.scores.widgets}%</div>
      <div class="score-label">Widgets</div>
    </div>
  </div>

  <h2>Issues (${result.issues.length})</h2>
  ${result.issues.length === 0
    ? '<div class="no-issues">No accessibility issues found!</div>'
    : result.issues.map(issue => `
      <div class="issue issue-${issue.severity}">
        <div class="issue-message">${escapeHtml(issue.message)}</div>
        ${issue.suggestion ? `<div class="issue-suggestion">💡 ${escapeHtml(issue.suggestion)}</div>` : ''}
        ${issue.wcag ? `<div class="issue-meta">WCAG: ${issue.wcag.join(', ')}</div>` : ''}
      </div>
    `).join('')}

  <h2>Statistics</h2>
  <div class="scores">
    <div class="score-card">
      <div class="score-value">${result.statistics?.events?.totalHandlers || 0}</div>
      <div class="score-label">Event Handlers</div>
    </div>
    <div class="score-card">
      <div class="score-value">${result.statistics?.events?.keyboardHandlers || 0}</div>
      <div class="score-label">Keyboard Handlers</div>
    </div>
    <div class="score-card">
      <div class="score-value">${result.statistics?.aria?.rolesUsed?.length || 0}</div>
      <div class="score-label">ARIA Roles</div>
    </div>
    <div class="score-card">
      <div class="score-value">${result.statistics?.focus?.focusManagementCalls || 0}</div>
      <div class="score-label">Focus Calls</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Code action provider for quick fixes
 */
class AccessibilityCodeActionProvider {
  provideCodeActions(document, range, context) {
    const diagnostics = context.diagnostics.filter(
      d => d.source === 'ActionLanguage A11y'
    );

    if (diagnostics.length === 0) return [];

    const actions = [];

    for (const diagnostic of diagnostics) {
      // Add keyboard handler fix
      if (diagnostic.message.includes('click handler but no keyboard handler')) {
        const fix = new vscode.CodeAction(
          'Add keyboard handler for Enter/Space',
          vscode.CodeActionKind.QuickFix
        );
        fix.diagnostics = [diagnostic];
        fix.edit = new vscode.WorkspaceEdit();

        // Find the click handler and add keyboard handler after it
        const lineText = document.lineAt(diagnostic.range.start.line).text;
        const insertPosition = new vscode.Position(diagnostic.range.start.line + 1, 0);

        // Extract element name from the line or diagnostic
        const elementMatch = lineText.match(/(\w+)\.addEventListener\(['"]click/);
        const element = elementMatch ? elementMatch[1] : 'element';

        const keyboardCode = `\n// Keyboard accessibility handler\n${element}.addEventListener('keydown', function(event) {\n  if (event.key === 'Enter' || event.key === ' ') {\n    event.preventDefault();\n    // Trigger the same action as click\n  }\n});\n`;

        fix.edit.insert(document.uri, insertPosition, keyboardCode);
        actions.push(fix);
      }

      // Add ARIA role fix
      if (diagnostic.message.includes('role')) {
        const fix = new vscode.CodeAction(
          'Add ARIA role attribute',
          vscode.CodeActionKind.QuickFix
        );
        fix.diagnostics = [diagnostic];
        fix.edit = new vscode.WorkspaceEdit();

        const lineText = document.lineAt(diagnostic.range.start.line).text;
        const elementMatch = lineText.match(/(\w+)\./);
        const element = elementMatch ? elementMatch[1] : 'element';

        const insertPosition = new vscode.Position(diagnostic.range.start.line, 0);
        const roleCode = `${element}.setAttribute('role', 'button');\n`;

        fix.edit.insert(document.uri, insertPosition, roleCode);
        actions.push(fix);
      }

      // Add tabindex fix
      if (diagnostic.message.includes('tabindex') || diagnostic.message.includes('focusable')) {
        const fix = new vscode.CodeAction(
          'Add tabindex="0" for keyboard focus',
          vscode.CodeActionKind.QuickFix
        );
        fix.diagnostics = [diagnostic];
        fix.edit = new vscode.WorkspaceEdit();

        const lineText = document.lineAt(diagnostic.range.start.line).text;
        const elementMatch = lineText.match(/(\w+)\./);
        const element = elementMatch ? elementMatch[1] : 'element';

        const insertPosition = new vscode.Position(diagnostic.range.start.line, 0);
        const tabindexCode = `${element}.setAttribute('tabindex', '0');\n`;

        fix.edit.insert(document.uri, insertPosition, tabindexCode);
        actions.push(fix);
      }

      // Learn more action
      if (diagnostic.code && typeof diagnostic.code === 'object' && diagnostic.code.target) {
        const learnMore = new vscode.CodeAction(
          'Learn more about this WCAG criterion',
          vscode.CodeActionKind.QuickFix
        );
        learnMore.diagnostics = [diagnostic];
        learnMore.command = {
          command: 'vscode.open',
          title: 'Open WCAG documentation',
          arguments: [diagnostic.code.target]
        };
        actions.push(learnMore);
      }
    }

    return actions;
  }
}

module.exports = {
  activate,
  deactivate
};
