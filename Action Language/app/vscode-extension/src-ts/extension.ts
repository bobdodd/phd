/**
 * Paradise Accessibility Analyzer - VS Code Extension
 *
 * Provides real-time accessibility analysis with dual-mode architecture:
 * - Foreground: Instant (<100ms) analysis of open files
 * - Background: Continuous project-wide model building
 */

import * as vscode from 'vscode';
import { ProjectModelManager } from './projectModelManager';
import { ForegroundAnalyzer } from './foregroundAnalyzer';
import { ParadiseCodeActionProvider } from './codeActionProvider';
import { ParadiseHelpProvider } from './helpProvider';
import { ExtensionConfig, AnalysisScope } from './types';

let diagnosticCollection: vscode.DiagnosticCollection;
let projectManager: ProjectModelManager;
let foregroundAnalyzer: ForegroundAnalyzer;
let codeActionProvider: ParadiseCodeActionProvider;
let helpProvider: ParadiseHelpProvider;
let statusBarItem: vscode.StatusBarItem;
let outputChannel: vscode.OutputChannel;

/**
 * Debounce timer for analyze-on-type
 */
let analyzeTimer: NodeJS.Timeout | null = null;

/**
 * Activate the extension
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('Paradise Accessibility Analyzer is activating...');

  // Create output channel
  outputChannel = vscode.window.createOutputChannel('Paradise');
  context.subscriptions.push(outputChannel);
  outputChannel.appendLine('Paradise Accessibility Analyzer starting...');

  // Create diagnostic collection
  diagnosticCollection = vscode.languages.createDiagnosticCollection('paradise');
  context.subscriptions.push(diagnosticCollection);

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(search) Paradise';
  statusBarItem.tooltip = 'Paradise Accessibility Analyzer';
  context.subscriptions.push(statusBarItem);
  statusBarItem.show();

  // Initialize project-wide model manager (background)
  projectManager = new ProjectModelManager(outputChannel);
  context.subscriptions.push({
    dispose: () => projectManager.dispose()
  });

  // Start background analysis for all workspace folders
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const config = getConfig();

    if (config.enableBackgroundAnalysis) {
      for (const folder of workspaceFolders) {
        // Non-blocking: starts background task
        outputChannel.appendLine(`Starting background analysis for: ${folder.name}`);
        projectManager.initialize(folder);
      }
    } else {
      outputChannel.appendLine('Background analysis disabled by configuration');
    }
  } else {
    outputChannel.appendLine('No workspace folders found');
  }

  // Create help provider
  helpProvider = new ParadiseHelpProvider(context.extensionPath);

  // Create code action provider
  codeActionProvider = new ParadiseCodeActionProvider(helpProvider);

  // Register code action provider for JavaScript/TypeScript files
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      [
        { language: 'javascript', scheme: 'file' },
        { language: 'typescript', scheme: 'file' },
        { language: 'javascriptreact', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' }
      ],
      codeActionProvider,
      {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
      }
    )
  );

  // Create foreground analyzer
  foregroundAnalyzer = new ForegroundAnalyzer(diagnosticCollection, projectManager, codeActionProvider);

  // Register callback for when project models are updated
  projectManager.onModelUpdated(async (uri) => {
    // Try to find an open document first
    let document = vscode.workspace.textDocuments.find(doc => doc.uri.fsPath === uri.fsPath);

    // If file is not open, open it invisibly to analyze it
    if (!document) {
      try {
        document = await vscode.workspace.openTextDocument(uri);
      } catch (err) {
        // File might not exist or can't be opened - skip
        return;
      }
    }

    if (document && isSupported(document)) {
      await foregroundAnalyzer.analyzeDocument(document);
    }
  });

  // Analyze currently open documents immediately
  for (const document of vscode.workspace.textDocuments) {
    if (isSupported(document)) {
      // This is fast (uses file-scope initially)
      await foregroundAnalyzer.analyzeDocument(document);
    }
  }

  // Listen for document changes (real-time analysis)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(async event => {
      const config = getConfig();

      if (!config.enable) return;
      if (!config.analyzeOnType) return;
      if (!isSupported(event.document)) return;

      // Debounce to avoid analyzing on every keystroke
      if (analyzeTimer) {
        clearTimeout(analyzeTimer);
      }

      analyzeTimer = setTimeout(async () => {
        await foregroundAnalyzer.analyzeDocument(event.document);
      }, config.analyzeOnTypeDelay);
    })
  );

  // Listen for document save
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async document => {
      const config = getConfig();

      if (!config.enable) return;
      if (!config.analyzeOnSave) return;
      if (!isSupported(document)) return;

      await foregroundAnalyzer.analyzeDocument(document);
    })
  );

  // Listen for document open
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(async document => {
      const config = getConfig();

      if (!config.enable) return;
      if (!isSupported(document)) return;

      await foregroundAnalyzer.analyzeDocument(document);
    })
  );

  // Note: We do NOT clear diagnostics when files close
  // Diagnostics should persist so users can see issues in the Problems panel
  // even for files that aren't currently open

  // Listen for active editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor && isSupported(editor.document)) {
        statusBarItem.show();
      } else {
        statusBarItem.hide();
      }
    })
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('paradise.analyzeFile', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('No file is currently open');
        return;
      }

      if (!isSupported(editor.document)) {
        vscode.window.showWarningMessage('Current file is not supported (must be JS/TS/HTML/CSS)');
        return;
      }

      await foregroundAnalyzer.analyzeDocument(editor.document);
      vscode.window.showInformationMessage('Paradise analysis complete');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('paradise.analyzeWorkspace', async () => {
      await analyzeWorkspace();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('paradise.clearDiagnostics', () => {
      diagnosticCollection.clear();
      vscode.window.showInformationMessage('Paradise diagnostics cleared');
    })
  );

  // Register "View Help" command
  context.subscriptions.push(
    vscode.commands.registerCommand('paradise.viewHelp', async (issueType: string) => {
      await helpProvider.showHelp(issueType);
    })
  );

  // Register "View All Help" command
  context.subscriptions.push(
    vscode.commands.registerCommand('paradise.viewAllHelp', async () => {
      await helpProvider.showHelpIndex();
    })
  );

  outputChannel.appendLine('Paradise Accessibility Analyzer activated successfully!');
  vscode.window.showInformationMessage('Paradise Accessibility Analyzer is now active');

  console.log('Paradise is now active!');
}

/**
 * Deactivate the extension
 */
export function deactivate() {
  if (analyzeTimer) {
    clearTimeout(analyzeTimer);
  }

  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }

  if (projectManager) {
    projectManager.dispose();
  }

  console.log('Paradise deactivated');
}

/**
 * Check if document is supported for analysis
 */
function isSupported(document: vscode.TextDocument): boolean {
  const supportedLanguages = [
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact'
    // Note: HTML and CSS analysis is not yet implemented in foreground analyzer
    // They are only analyzed as part of DocumentModel in background analysis
  ];

  return supportedLanguages.includes(document.languageId);
}

/**
 * Get extension configuration
 */
function getConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration('paradise');

  // Map extension analysis modes to core types
  const rawMode = config.get<string>('analysisMode', 'smart');
  let analysisMode: AnalysisScope;
  if (rawMode === 'project') {
    analysisMode = 'page';  // 'project' maps to 'page' in core
  } else if (rawMode === 'smart') {
    analysisMode = 'workspace';  // 'smart' maps to 'workspace' in core
  } else {
    analysisMode = rawMode as AnalysisScope;  // 'file', 'workspace', 'page' pass through
  }

  return {
    enable: config.get('enable', true),
    analysisMode: analysisMode,
    enableBackgroundAnalysis: config.get('enableBackgroundAnalysis', true),
    includePatterns: config.get('includePatterns', [
      '**/*.html',
      '**/*.js',
      '**/*.ts',
      '**/*.jsx',
      '**/*.tsx',
      '**/*.css'
    ]),
    excludePatterns: config.get('excludePatterns', [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**'
    ]),
    maxProjectFiles: config.get('maxProjectFiles', 1000),
    diagnosticPlacement: config.get('diagnosticPlacement', 'both'),
    analyzeOnSave: config.get('analyzeOnSave', true),
    analyzeOnType: config.get('analyzeOnType', false),
    analyzeOnTypeDelay: config.get('analyzeOnTypeDelay', 500),
    minSeverity: config.get('minSeverity', 'info')
  };
}

/**
 * Analyze entire workspace
 */
async function analyzeWorkspace() {
  const config = getConfig();

  const files = await vscode.workspace.findFiles(
    `**/*.{js,jsx,ts,tsx,html,css}`,
    `{${config.excludePatterns.join(',')}}`
  );

  if (files.length === 0) {
    vscode.window.showWarningMessage('No files found in workspace');
    return;
  }

  if (files.length > config.maxProjectFiles) {
    const proceed = await vscode.window.showWarningMessage(
      `Found ${files.length} files, which exceeds the limit of ${config.maxProjectFiles}. This may impact performance. Continue?`,
      'Yes', 'No'
    );

    if (proceed !== 'Yes') {
      return;
    }
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Analyzing accessibility...',
      cancellable: true
    },
    async (progress, token) => {
      let analyzed = 0;
      let totalIssues = 0;

      for (const file of files) {
        if (token.isCancellationRequested) {
          break;
        }

        try {
          const document = await vscode.workspace.openTextDocument(file);

          if (isSupported(document)) {
            await foregroundAnalyzer.analyzeDocument(document);

            // Count diagnostics
            const diagnostics = diagnosticCollection.get(document.uri);
            if (diagnostics) {
              totalIssues += diagnostics.length;
            }

            analyzed++;

            progress.report({
              message: `${analyzed}/${files.length} files`,
              increment: (100 / files.length)
            });
          }
        } catch (error) {
          outputChannel.appendLine(`Error analyzing ${file.fsPath}: ${error}`);
        }
      }

      vscode.window.showInformationMessage(
        `Analyzed ${analyzed} files, found ${totalIssues} accessibility issues`
      );
    }
  );
}
