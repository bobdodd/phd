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
  // Try multiple paths to find the analyzer
  const possiblePaths = [
    path.join(__dirname, '../../src'),                    // Relative from extension/src
    path.join(__dirname, '../../../src'),                 // One more level up
    '/Users/bob3/Desktop/phd/Action Language/app/src'    // Absolute fallback
  ];

  for (const basePath of possiblePaths) {
    try {
      const parserPath = path.join(basePath, 'parser');
      const reporterPath = path.join(basePath, 'analyzer/AccessibilityReporter');

      parseAndTransform = require(parserPath).parseAndTransform;
      AccessibilityReporter = require(reporterPath);

      console.log('ActionLanguage A11y: Loaded analyzer from', basePath);
      return true;
    } catch (error) {
      console.log('ActionLanguage A11y: Failed to load from', basePath, '-', error.message);
    }
  }

  console.error('ActionLanguage A11y: Could not find analyzer module in any location');
  return false;
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
      'Check Output panel (ActionLanguage A11y) for details.'
    );
    return;
  }

  // Show activation message
  vscode.window.showInformationMessage('ActionLanguage Accessibility Analyzer is now active');

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
    vscode.commands.registerCommand('actionlanguage-a11y.showReport', showReport),
    vscode.commands.registerCommand('actionlanguage-a11y.showWCAGHelp', showWCAGHelp)
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
  console.log('[A11y] Starting analysis of', path.basename(document.fileName));

  try {
    const tree = parseAndTransform(code);
    console.log('[A11y] Parsed successfully');

    const reporter = new AccessibilityReporter();
    const result = reporter.analyze(tree);
    console.log('[A11y] Found', result.issues.length, 'issues');

    // Convert issues to diagnostics
    const diagnostics = convertToDiagnostics(result, document, config);
    console.log('[A11y] Created', diagnostics.length, 'diagnostics');
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
    console.error('[A11y] Error during analysis:', error);
    outputChannel.appendLine(`Error in ${document.fileName}: ${error.message}`);
    outputChannel.appendLine(error.stack);

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
 * Get the WCAG Understanding page URL for a criterion
 */
function getWCAGUrl(criterion) {
  // Map WCAG 2.1 criterion numbers to their Understanding page slugs
  const wcagUrls = {
    '1.3.1': 'info-and-relationships',
    '2.1.1': 'keyboard',
    '2.1.2': 'no-keyboard-trap',
    '2.1.4': 'character-key-shortcuts',
    '2.4.3': 'focus-order',
    '2.4.7': 'focus-visible',
    '2.5.3': 'label-in-name',
    '4.1.2': 'name-role-value',
    '4.1.3': 'status-messages'
  };

  const slug = wcagUrls[criterion];
  if (slug) {
    return `https://www.w3.org/WAI/WCAG21/Understanding/${slug}.html`;
  }

  // Fallback: try to construct URL from criterion number (may not always work)
  return `https://www.w3.org/WAI/WCAG21/quickref/#${criterion}`;
}

/**
 * Get the human-readable name for a WCAG criterion
 */
function getWCAGName(criterion) {
  const wcagNames = {
    '1.3.1': 'Info and Relationships',
    '2.1.1': 'Keyboard',
    '2.1.2': 'No Keyboard Trap',
    '2.1.4': 'Character Key Shortcuts',
    '2.4.3': 'Focus Order',
    '2.4.7': 'Focus Visible',
    '2.5.3': 'Label in Name',
    '4.1.2': 'Name, Role, Value',
    '4.1.3': 'Status Messages'
  };

  return wcagNames[criterion] || 'Understanding Document';
}

/**
 * Convert analysis issues to VS Code diagnostics
 */
function convertToDiagnostics(result, document, config) {
  const diagnostics = [];
  const minSeverity = config.get('minSeverity', 'info');
  const severityOrder = { error: 0, warning: 1, info: 2 };
  const minLevel = severityOrder[minSeverity] || 2;

  console.log('[A11y] Converting', result.issues.length, 'issues to diagnostics');

  for (const issue of result.issues) {
    try {
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

    // Store the full issue data for code actions (custom property)
    diagnostic._issueData = {
      ...issue,
      // Store document context for generating tailored fixes
      documentUri: document.uri.toString(),
      documentText: document.getText()
    };

    // Add WCAG reference with proper URL (primary criterion only for the code field)
    if (issue.wcag && issue.wcag.length > 0) {
      const primaryCriterion = issue.wcag[0];
      diagnostic.code = {
        value: primaryCriterion,
        target: vscode.Uri.parse(getWCAGUrl(primaryCriterion))
      };
    }

    // Add related information (only suggestion, not WCAG links)
    // WCAG links are available via code actions instead
    const relatedInfo = [];

    // Add suggestion
    if (issue.suggestion) {
      relatedInfo.push(
        new vscode.DiagnosticRelatedInformation(
          new vscode.Location(document.uri, range),
          `Suggestion: ${issue.suggestion}`
        )
      );
    }

    if (relatedInfo.length > 0) {
      diagnostic.relatedInformation = relatedInfo;
    }

    diagnostics.push(diagnostic);
    } catch (error) {
      console.error('[A11y] Error converting issue to diagnostic:', error);
      console.error('[A11y] Issue data:', issue);
    }
  }

  console.log('[A11y] Successfully created', diagnostics.length, 'diagnostics');
  return diagnostics;
}

/**
 * Find the range in the document for an issue
 */
function findIssueRange(document, issue) {
  const text = document.getText();

  // First priority: Use location information from the ActionLanguage tree
  if (issue.location && issue.location.line !== undefined) {
    const lineNumber = issue.location.line - 1; // VS Code uses 0-indexed lines

    // Ensure line number is valid
    if (lineNumber >= 0 && lineNumber < document.lineCount) {
      const line = document.lineAt(lineNumber);

      // Try to find the element or relevant code on this line
      if (issue.element) {
        const elementIndex = line.text.indexOf(issue.element);
        if (elementIndex !== -1) {
          const startPos = new vscode.Position(lineNumber, elementIndex);
          const endPos = new vscode.Position(lineNumber, elementIndex + issue.element.length);
          return new vscode.Range(startPos, endPos);
        }
      }

      // Find first non-whitespace character on the line
      const firstNonWhitespace = line.firstNonWhitespaceCharacterIndex;
      const startPos = new vscode.Position(lineNumber, firstNonWhitespace);
      const endPos = new vscode.Position(lineNumber, Math.min(firstNonWhitespace + 50, line.text.length));
      return new vscode.Range(startPos, endPos);
    }
  }

  // Second priority: Try to find the element mentioned in the issue (avoid matching in comments)
  if (issue.element) {
    const elementPatterns = [
      new RegExp(`\\b${escapeRegExp(issue.element)}\\s*\\.\\s*addEventListener`, 'g'),
      new RegExp(`\\b${escapeRegExp(issue.element)}\\s*\\.\\s*on\\w+\\s*=`, 'g'),
      new RegExp(`\\bconst\\s+${escapeRegExp(issue.element)}\\b`, 'g'),
      new RegExp(`\\blet\\s+${escapeRegExp(issue.element)}\\b`, 'g'),
      new RegExp(`\\bvar\\s+${escapeRegExp(issue.element)}\\b`, 'g')
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

  // Fallback: Default to first line
  return new vscode.Range(0, 0, 0, Math.min(text.indexOf('\n'), 100));
}

/**
 * Escape special characters in regex
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
 * Show detailed WCAG help for a specific issue
 */
async function showWCAGHelp(issueData) {
  if (!issueData || !issueData.wcag || issueData.wcag.length === 0) {
    vscode.window.showWarningMessage('No WCAG criteria found for this issue');
    return;
  }

  // Create webview panel
  const panel = vscode.window.createWebviewPanel(
    'wcagHelp',
    'WCAG Success Criteria',
    vscode.ViewColumn.Beside,
    { enableScripts: true }
  );

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    async message => {
      console.log('[A11y] Received message from webview:', message.command);
      outputChannel.appendLine(`Received message: ${message.command}`);
      switch (message.command) {
        case 'applyFix':
          console.log('[A11y] Applying fix, code length:', message.code?.length);
          outputChannel.appendLine(`Applying fix, code length: ${message.code?.length}`);
          await applyCodeFix(message.code, issueData);
          break;
      }
    },
    undefined,
    []
  );

  panel.webview.html = generateWCAGHelpHTML(issueData);
}

/**
 * Apply a code fix to the active document
 */
async function applyCodeFix(fixCode, issueData) {
  console.log('[A11y] applyCodeFix called');
  outputChannel.appendLine('applyCodeFix called');
  outputChannel.appendLine(`Fix code length: ${fixCode?.length}`);
  outputChannel.appendLine(`Issue message: ${issueData?.message}`);
  outputChannel.appendLine(`Issue location: line ${issueData?.location?.line}`);
  outputChannel.appendLine(`Document URI: ${issueData?.documentUri}`);

  // Get the document from the stored URI
  let document;
  if (issueData.documentUri) {
    const uri = vscode.Uri.parse(issueData.documentUri);
    outputChannel.appendLine(`Parsed URI: ${uri.toString()}`);

    // Try to find the document in open text documents
    document = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === issueData.documentUri);

    if (!document) {
      // Document not open, try to open it
      outputChannel.appendLine('Document not open, attempting to open...');
      try {
        document = await vscode.workspace.openTextDocument(uri);
        outputChannel.appendLine('Document opened successfully');
      } catch (error) {
        const msg = `Could not open document: ${error.message}`;
        console.error('[A11y]', msg);
        outputChannel.appendLine(msg);
        vscode.window.showErrorMessage(msg);
        return;
      }
    }
  } else {
    const msg = 'No document URI found in issue data';
    console.error('[A11y]', msg);
    outputChannel.appendLine(msg);
    vscode.window.showErrorMessage(msg);
    return;
  }

  outputChannel.appendLine(`Working with document: ${document.fileName}`);

  const edit = new vscode.WorkspaceEdit();
  outputChannel.appendLine('Creating workspace edit...');

  // Find the insertion point based on the issue location
  let insertPosition;
  if (issueData.location && issueData.location.line !== undefined) {
    const lineNumber = issueData.location.line - 1; // VS Code uses 0-indexed lines
    const line = document.lineAt(lineNumber);
    const indent = line.text.match(/^\s*/)[0]; // Get current indentation

    // For removal/hide issues, the fix code includes the original line at the end
    // We need to extract just the safety check and insert it BEFORE the problematic line
    if (issueData.message.toLowerCase().includes('remove') || issueData.message.toLowerCase().includes('hidden')) {
      outputChannel.appendLine('Detected removal/hide issue, extracting fix code...');
      // Extract just the focus management code (everything before the last occurrence of the problematic code)
      const lines = fixCode.split('\n');

      // Find where the actual fix starts (after "Your existing" or "Now safe to")
      let fixLines = [];
      let foundFixStart = false;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Now safe to') || lines[i].includes('Now hide')) {
          break; // Stop before the original problematic line
        }
        if (foundFixStart || lines[i].trim().startsWith('//') || lines[i].includes('if (')) {
          foundFixStart = true;
          fixLines.push(lines[i]);
        }
      }

      const cleanedCode = fixLines.join('\n').trim();

      // Indent the fix code to match
      const indentedCode = cleanedCode.split('\n').map((codeLine) => {
        if (codeLine.trim() === '') return codeLine;
        if (codeLine.startsWith('//')) return indent + codeLine;
        return indent + codeLine;
      }).join('\n');

      insertPosition = new vscode.Position(lineNumber, 0);
      outputChannel.appendLine(`Inserting at line ${lineNumber}, code length: ${indentedCode.length}`);
      edit.insert(document.uri, insertPosition, indentedCode + '\n\n');
    }
    // For keyboard handler issues, insert AFTER the problematic line
    else if (issueData.message.toLowerCase().includes('keyboard')) {
      outputChannel.appendLine('Detected keyboard issue, extracting handler code...');
      // Extract just the keyboard handler (skip the "Your existing click handler:" comment)
      const lines = fixCode.split('\n');
      let startIndex = 0;

      // Skip past "Your existing click handler:" section
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Add keyboard handler') || lines[i].includes('keyboard support')) {
          startIndex = i;
          break;
        }
      }

      const keyboardCode = lines.slice(startIndex).join('\n').trim();

      const indentedCode = keyboardCode.split('\n').map((codeLine) => {
        if (codeLine.trim() === '') return codeLine;
        return indent + codeLine;
      }).join('\n');

      insertPosition = new vscode.Position(lineNumber + 1, 0);
      edit.insert(document.uri, insertPosition, '\n' + indentedCode + '\n');
    } else {
      // Default: insert at the issue line
      const indentedCode = fixCode.split('\n').map((codeLine) => {
        if (codeLine.trim() === '') return codeLine;
        return indent + codeLine;
      }).join('\n');

      insertPosition = new vscode.Position(lineNumber, 0);
      edit.insert(document.uri, insertPosition, indentedCode + '\n');
    }
  } else {
    // No location info, ask user where to insert
    vscode.window.showInformationMessage('Place your cursor where you want to insert the fix, then run this command again.');
    return;
  }

  // Apply the edit
  outputChannel.appendLine('Applying workspace edit...');
  const success = await vscode.workspace.applyEdit(edit);
  outputChannel.appendLine(`Edit applied: ${success}`);

  if (success) {
    const msg = '✓ Fix applied successfully!';
    console.log('[A11y]', msg);
    outputChannel.appendLine(msg);
    vscode.window.showInformationMessage(msg);

    // Show the document and move cursor to the inserted code
    if (insertPosition) {
      const editor = await vscode.window.showTextDocument(document, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false
      });
      editor.selection = new vscode.Selection(insertPosition, insertPosition);
      editor.revealRange(new vscode.Range(insertPosition, insertPosition));
      outputChannel.appendLine(`Moved cursor to line ${insertPosition.line}`);
    }
  } else {
    const msg = 'Failed to apply fix';
    console.error('[A11y]', msg);
    outputChannel.appendLine(msg);
    vscode.window.showErrorMessage(msg);
  }
}

/**
 * Generate HTML for the WCAG help webview
 */
function generateWCAGHelpHTML(issueData) {
  const wcagDetails = {
    '1.3.1': {
      level: 'A',
      title: 'Info and Relationships',
      definition: 'Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.',
      why: 'Screen readers and other assistive technologies need semantic information to convey meaning to users.',
      examples: ['Use proper ARIA roles and attributes', 'Ensure form labels are programmatically associated']
    },
    '2.1.1': {
      level: 'A',
      title: 'Keyboard',
      definition: 'All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.',
      why: 'Many users cannot use a mouse and rely entirely on keyboard navigation.',
      examples: ['Add keydown handler for Enter/Space keys', 'Ensure all interactive elements are keyboard accessible']
    },
    '2.1.2': {
      level: 'A',
      title: 'No Keyboard Trap',
      definition: 'If keyboard focus can be moved to a component, focus can be moved away from that component using only a keyboard interface.',
      why: 'Users must be able to navigate through all parts of a page without getting trapped.',
      examples: ['Provide Escape key to exit modals', 'Ensure focus can move freely through all interactive elements']
    },
    '2.1.4': {
      level: 'A',
      title: 'Character Key Shortcuts',
      definition: 'If a keyboard shortcut is implemented using only printable characters, it can be turned off, remapped, or is only active when the relevant component has focus.',
      why: 'Single-key shortcuts can conflict with screen reader commands and assistive technology.',
      examples: ['Avoid single-character shortcuts', 'Check for conflicts with JAWS, NVDA screen reader keys']
    },
    '2.4.3': {
      level: 'A',
      title: 'Focus Order',
      definition: 'If a Web page can be navigated sequentially, focusable components receive focus in an order that preserves meaning and operability.',
      why: 'Logical focus order helps users understand the page structure and navigate efficiently.',
      examples: ['Maintain DOM order for keyboard navigation', 'Move focus to logical next element when removing elements', 'Avoid positive tabindex values']
    },
    '2.4.7': {
      level: 'AA',
      title: 'Focus Visible',
      definition: 'Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.',
      why: 'Users need to see where keyboard focus is to know which element will respond to keyboard input.',
      examples: ['Ensure focus indicator remains visible', 'Move focus to another element before hiding/removing focused element', 'Don\'t set outline: none without providing alternative']
    },
    '2.5.3': {
      level: 'A',
      title: 'Label in Name',
      definition: 'For user interface components with labels that include text or images of text, the name contains the text that is presented visually.',
      why: 'Voice input users need the accessible name to match the visible label to activate controls.',
      examples: ['Match accessible name to visible label', 'Include visible text in aria-label']
    },
    '4.1.2': {
      level: 'A',
      title: 'Name, Role, Value',
      definition: 'For all user interface components, the name and role can be programmatically determined; states, properties, and values can be programmatically set; and notification of changes is available to user agents, including assistive technologies.',
      why: 'Assistive technologies need semantic information to convey the purpose and state of UI components.',
      examples: ['Add appropriate ARIA roles', 'Provide accessible names with aria-label or aria-labelledby', 'Update ARIA states when component state changes']
    },
    '4.1.3': {
      level: 'AA',
      title: 'Status Messages',
      definition: 'Status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus.',
      why: 'Users need to be informed of important changes without disrupting their current task.',
      examples: ['Use role="status" or aria-live for notifications', 'Announce dynamic content changes to screen readers']
    }
  };

  const criteriaHTML = issueData.wcag.map(criterion => {
    const details = wcagDetails[criterion];
    if (!details) return '';

    return `
      <div class="criterion">
        <h2>
          <span class="criterion-number">${criterion}</span>
          ${details.title}
          <span class="level-badge level-${details.level}">${details.level}</span>
        </h2>

        <div class="section">
          <h3>Definition</h3>
          <p>${details.definition}</p>
        </div>

        <div class="section">
          <h3>Why This Matters</h3>
          <p>${details.why}</p>
        </div>

        <div class="section">
          <h3>Common Solutions</h3>
          <ul>
            ${details.examples.map(ex => `<li>${ex}</li>`).join('')}
          </ul>
        </div>

        <div class="wcag-link-container">
          <a href="${getWCAGUrl(criterion)}" class="wcag-link">
            📖 Read Full Understanding Document
          </a>
        </div>
      </div>
    `;
  }).join('');

  // Helper function to wrap code in a copyable container with apply button
  const wrapCodeWithCopyButton = (code, showApplyButton = false) => {
    const buttons = showApplyButton ? `
  <div class="button-group">
    <button class="apply-button" onclick="applyFix(this)" aria-label="Apply this fix to your code">
      ⚡ Apply Fix
    </button>
    <button class="copy-button" onclick="copyCode(this)" aria-label="Copy code to clipboard">
      📋 Copy
    </button>
  </div>` : `
  <div class="button-group">
    <button class="copy-button" onclick="copyCode(this)" aria-label="Copy code to clipboard">
      📋 Copy
    </button>
  </div>`;

    return `
<div class="code-container">
  ${buttons}
  <pre><code>${code}</code></pre>
</div>`;
  };

  // Generate context-specific fix example based on issue type and actual user code
  let fixExample = '';
  const message = issueData.message.toLowerCase();

  // Extract context from user's code
  let elementName = issueData.element || 'element';
  let actualCode = '';

  // Try to find the actual problematic code around the issue location
  if (issueData.documentText && issueData.location) {
    const lines = issueData.documentText.split('\n');
    const lineIndex = issueData.location.line - 1;
    if (lineIndex >= 0 && lineIndex < lines.length) {
      actualCode = lines[lineIndex].trim();

      // Try to extract element name from the actual code
      const elementMatch = actualCode.match(/(\w+)\.(remove|classList|style|setAttribute)/);
      if (elementMatch) {
        elementName = elementMatch[1];
      }
    }
  }

  if (message.includes('remove') && message.includes('focus')) {
    // Tailored fix for element removal
    const isClassListRemove = actualCode.includes('classList.remove');
    const isElementRemove = actualCode.includes('.remove()');

    if (isClassListRemove) {
      // Extract the class name being removed
      const classMatch = actualCode.match(/classList\.remove\(['"](\w+)['"]\)/);
      const className = classMatch ? classMatch[1] : 'active';

      const codeToFix = `// Before removing the class, check focus
if (${elementName}.classList.contains('${className}') &&
    ${elementName}.contains(document.activeElement)) {
  // Move focus to next logical element
  const nextElement = ${elementName}.nextElementSibling ||
                      ${elementName}.previousElementSibling;
  if (nextElement) {
    nextElement.focus();
  }
}

// Now safe to remove the class
${actualCode}`;

      fixExample = `
<h3>Tailored Fix for Your Code</h3>
<p>Based on your code: <code>${escapeHtml(actualCode)}</code></p>
${wrapCodeWithCopyButton(codeToFix, true)}`;
    } else if (isElementRemove) {
      const codeToFix = `// Before removing element, check and move focus
if (${elementName}.contains(document.activeElement)) {
  // Move focus to a logical location
  const nextElement = ${elementName}.nextElementSibling ||
                      ${elementName}.previousElementSibling;

  if (nextElement) {
    nextElement.focus();
  }
}

// Now safe to remove
${actualCode}`;

      fixExample = `
<h3>Tailored Fix for Your Code</h3>
<p>Based on your code: <code>${escapeHtml(actualCode)}</code></p>
${wrapCodeWithCopyButton(codeToFix, true)}`;
    } else {
      // Generic removal fix
      const codeToFix = `// Before removing an element, check and move focus
if (${elementName}.contains(document.activeElement)) {
  const nextElement = ${elementName}.nextElementSibling ||
                      ${elementName}.previousElementSibling;
  if (nextElement) {
    nextElement.focus();
  }
}

${elementName}.remove();`;

      fixExample = `
<h3>Example Fix</h3>
${wrapCodeWithCopyButton(codeToFix)}`;
    }
  } else if (message.includes('click') && message.includes('keyboard')) {
    // Tailored fix for keyboard handler
    const hasActualCode = actualCode.includes('addEventListener');

    if (hasActualCode) {
      const codeToFix = `// Your existing click handler:
${actualCode}

// Add keyboard handler for accessibility
${elementName}.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent page scroll on Space
    // Trigger the same action as your click handler
    ${elementName}.click(); // Or call your handler function directly
  }
});

// Make element keyboard-focusable if needed
${elementName}.setAttribute('tabindex', '0');
${elementName}.setAttribute('role', 'button');`;

      fixExample = `
<h3>Tailored Fix for Your Code</h3>
<p>Based on your code: <code>${escapeHtml(actualCode)}</code></p>
${wrapCodeWithCopyButton(codeToFix, true)}`;
    } else {
      const codeToFix = `// Add keyboard support to click handlers
${elementName}.addEventListener('click', handleAction);

// Add keyboard handler for Enter and Space
${elementName}.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevent scrolling on Space
    handleAction(event);
  }
});

// Make element focusable if it's not naturally focusable
${elementName}.setAttribute('tabindex', '0');
${elementName}.setAttribute('role', 'button');`;

      fixExample = `
<h3>Example Fix</h3>
${wrapCodeWithCopyButton(codeToFix, true)}`;
    }
  } else if (message.includes('hidden') || message.includes('display')) {
    // Tailored fix for hiding elements
    if (actualCode) {
      const codeToFix = `// Before hiding, check and move focus
if (${elementName}.contains(document.activeElement)) {
  // Move focus to next logical element
  const nextElement = ${elementName}.nextElementSibling ||
                      ${elementName}.previousElementSibling;
  if (nextElement) {
    nextElement.focus();
  }
}

// Now safe to hide
${actualCode}`;

      fixExample = `
<h3>Tailored Fix for Your Code</h3>
<p>Based on your code: <code>${escapeHtml(actualCode)}</code></p>
${wrapCodeWithCopyButton(codeToFix, true)}`;
    } else {
      const codeToFix = `// Before hiding an element, manage focus
if (${elementName}.contains(document.activeElement)) {
  const nextFocusable = ${elementName}.nextElementSibling ||
                        ${elementName}.previousElementSibling;
  if (nextFocusable) {
    nextFocusable.focus();
  }
}

// Now hide the element
${elementName}.style.display = 'none';`;

      fixExample = `
<h3>Example Fix</h3>
${wrapCodeWithCopyButton(codeToFix, true)}`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WCAG Success Criteria Help</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 20px;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 {
      color: var(--vscode-foreground);
      border-bottom: 2px solid var(--vscode-textSeparator-foreground);
      padding-bottom: 10px;
    }
    .issue-context {
      background: var(--vscode-input-background);
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      border-left: 4px solid #f97316;
    }
    .issue-context p {
      margin: 0;
      font-weight: 500;
    }
    .criterion {
      margin: 30px 0;
      padding: 20px;
      background: var(--vscode-input-background);
      border-radius: 8px;
      border-left: 4px solid #0078d4;
    }
    .criterion h2 {
      margin-top: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .criterion-number {
      font-family: var(--vscode-editor-font-family);
      background: #0066cc;
      color: #ffffff;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .level-badge {
      font-size: 0.75em;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    .level-A {
      background: #16a34a;
      color: #ffffff;
    }
    .level-AA {
      background: #ca8a04;
      color: #000000;
    }
    .level-AAA {
      background: #dc2626;
      color: #ffffff;
    }
    .section {
      margin: 15px 0;
    }
    .section h3 {
      color: var(--vscode-foreground);
      font-size: 1em;
      margin: 10px 0 5px 0;
      font-weight: 600;
    }
    .section ul {
      margin: 5px 0;
      padding-left: 25px;
    }
    .section li {
      margin: 5px 0;
    }
    .wcag-link-container {
      margin-top: 15px;
    }
    .wcag-link {
      display: inline-block;
      padding: 8px 16px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .wcag-link:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .code-container {
      margin: 15px 0;
    }
    .code-container .button-group {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .code-container pre {
      margin: 0;
    }
    .copy-button, .apply-button {
      padding: 6px 12px;
      border: 1px solid var(--vscode-button-border);
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85em;
      font-family: var(--vscode-font-family);
      transition: opacity 0.2s, background 0.2s;
      white-space: nowrap;
    }
    .copy-button {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      opacity: 0.8;
    }
    .copy-button:hover {
      opacity: 1;
      background: var(--vscode-button-secondaryHoverBackground);
    }
    .copy-button:active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    .copy-button.copied {
      background: #16a34a;
      color: #ffffff;
      opacity: 1;
    }
    .apply-button {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      font-weight: 600;
    }
    .apply-button:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .apply-button:active {
      background: var(--vscode-button-background);
      opacity: 0.8;
    }
    .apply-button.applied {
      background: #16a34a;
      color: #ffffff;
    }
    .apply-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    pre {
      background: var(--vscode-textCodeBlock-background);
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      font-family: var(--vscode-editor-font-family);
      font-size: 0.9em;
      line-height: 1.4;
    }
    code {
      color: var(--vscode-textPreformat-foreground);
    }
    .testing-section {
      background: var(--vscode-input-background);
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .testing-section h3 {
      margin-top: 0;
      color: var(--vscode-foreground);
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>📋 WCAG Success Criteria</h1>

  <div class="issue-context">
    <p><strong>Issue:</strong> ${escapeHtml(issueData.message)}</p>
  </div>

  <p>This issue violates the following WCAG 2.1 success criteria:</p>

  ${criteriaHTML}

  ${fixExample}

  <div class="testing-section">
    <h3>🧪 Testing Checklist</h3>
    <ul>
      <li>Navigate using only keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys)</li>
      <li>Verify focus indicator is always visible</li>
      <li>Test with screen reader (NVDA, JAWS, or VoiceOver)</li>
      <li>Check that focus order makes logical sense</li>
      <li>Ensure no keyboard traps - can exit all components</li>
      <li>Verify dynamic content changes are announced</li>
    </ul>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--vscode-textSeparator-foreground); opacity: 0.7; font-size: 0.9em;">
    <p>Generated by ActionLanguage Accessibility Analyzer |
    <a href="https://www.w3.org/WAI/WCAG21/quickref/">WCAG 2.1 Quick Reference</a></p>
  </div>

  <script>
    // Get VS Code API for sending messages to extension
    const vscode = acquireVsCodeApi();

    function copyCode(button) {
      // Get the code block - button is in button-group, which is in code-container
      const buttonGroup = button.parentElement;
      const codeContainer = buttonGroup.parentElement;
      const codeBlock = codeContainer.querySelector('code');
      const codeText = codeBlock.textContent;

      // Copy to clipboard
      navigator.clipboard.writeText(codeText).then(() => {
        // Update button text and style
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.classList.add('copied');

        // Reset after 2 seconds
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        button.textContent = '✗ Failed';
        setTimeout(() => {
          button.textContent = '📋 Copy';
        }, 2000);
      });
    }

    function applyFix(button) {
      // Get the code block - button is in button-group, which is in code-container
      const buttonGroup = button.parentElement;
      const codeContainer = buttonGroup.parentElement;
      const codeBlock = codeContainer.querySelector('code');
      const codeText = codeBlock.textContent;

      // Update button to show it's applying
      const originalText = button.textContent;
      button.textContent = '⏳ Applying...';
      button.disabled = true;

      // Send message to extension to apply the fix
      vscode.postMessage({
        command: 'applyFix',
        code: codeText
      });

      // Update button to show success
      setTimeout(() => {
        button.textContent = '✓ Applied!';
        button.classList.add('applied');

        // Reset after 3 seconds
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('applied');
          button.disabled = false;
        }, 3000);
      }, 500);
    }
  </script>
</body>
</html>`;
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

      // Add "Show detailed help" action if multiple WCAG criteria
      if (diagnostic._issueData && diagnostic._issueData.wcag && diagnostic._issueData.wcag.length > 0) {
        const detailedHelpAction = new vscode.CodeAction(
          '📖 Show detailed WCAG help',
          vscode.CodeActionKind.QuickFix
        );
        detailedHelpAction.diagnostics = [diagnostic];
        detailedHelpAction.command = {
          command: 'actionlanguage-a11y.showWCAGHelp',
          title: 'Show detailed WCAG help',
          arguments: [diagnostic._issueData]
        };
        actions.push(detailedHelpAction);
      }

      // Add "View WCAG X.X.X" actions for each criterion
      if (diagnostic._issueData && diagnostic._issueData.wcag) {
        for (const criterion of diagnostic._issueData.wcag) {
          const wcagUrl = getWCAGUrl(criterion);
          const wcagName = getWCAGName(criterion);

          const viewWcagAction = new vscode.CodeAction(
            `View WCAG ${criterion}: ${wcagName}`,
            vscode.CodeActionKind.QuickFix
          );
          viewWcagAction.diagnostics = [diagnostic];
          viewWcagAction.command = {
            command: 'vscode.open',
            title: `Open WCAG ${criterion} documentation`,
            arguments: [vscode.Uri.parse(wcagUrl)]
          };
          actions.push(viewWcagAction);
        }
      }
    }

    return actions;
  }
}

module.exports = {
  activate,
  deactivate
};
