/**
 * ForegroundAnalyzer - Instant analysis system (<100ms target)
 *
 * Analyzes currently open files with immediate feedback.
 * Falls back to file-scope when project model not available.
 */

import * as vscode from 'vscode';
import { DocumentModel } from '../lib/models/DocumentModel';
import { ActionLanguageModel } from '../lib/models/ActionLanguageModel';
import { JavaScriptParser } from '../lib/parsers/JavaScriptParser';
import { Issue } from '../lib/analyzers/BaseAnalyzer';
import { AnalysisResult, AnalysisScope, ExtensionConfig } from './types';
import { ProjectModelManager } from './projectModelManager';

// Import analyzers
import { MouseOnlyClickAnalyzer } from '../lib/analyzers/MouseOnlyClickAnalyzer';
import { OrphanedEventHandlerAnalyzer } from '../lib/analyzers/OrphanedEventHandlerAnalyzer';
import { MissingAriaConnectionAnalyzer } from '../lib/analyzers/MissingAriaConnectionAnalyzer';
import { FocusOrderConflictAnalyzer } from '../lib/analyzers/FocusOrderConflictAnalyzer';
import { VisibilityFocusConflictAnalyzer } from '../lib/analyzers/VisibilityFocusConflictAnalyzer';

export class ForegroundAnalyzer {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private projectManager: ProjectModelManager;
  private analyzers: any[]; // TODO: Create proper Analyzer interface

  constructor(
    diagnosticCollection: vscode.DiagnosticCollection,
    projectManager: ProjectModelManager
  ) {
    this.diagnosticCollection = diagnosticCollection;
    this.projectManager = projectManager;

    // Initialize all analyzers (only those with TypeScript definitions)
    this.analyzers = [
      new MouseOnlyClickAnalyzer(),
      new OrphanedEventHandlerAnalyzer(),
      new MissingAriaConnectionAnalyzer(),
      new FocusOrderConflictAnalyzer(),
      new VisibilityFocusConflictAnalyzer()
    ];

    console.log('[ForegroundAnalyzer] Initialized with', this.analyzers.length, 'analyzers');
  }

  /**
   * Analyze a document (must be fast: <100ms target)
   */
  async analyzeDocument(document: vscode.TextDocument): Promise<void> {
    const startTime = Date.now();

    try {
      // Step 1: Try to get project-wide model (may not be ready yet)
      const projectModel = this.projectManager.getDocumentModel(document);

      // Debug logging
      const fileName = document.fileName.split('/').pop();
      if (projectModel) {
        console.log(`[ForegroundAnalyzer] ✓ Using document-scope for ${fileName}`);
      } else {
        console.log(`[ForegroundAnalyzer] ⚠ Using file-scope for ${fileName} (no DocumentModel found)`);
      }

      // Step 2: Analyze with best available model
      const result = projectModel
        ? await this.analyzeWithProjectModel(document, projectModel)
        : await this.analyzeFileScope(document);

      // Step 3: Publish diagnostics immediately
      const diagnostics = this.convertToDiagnostics(result.issues, document);
      this.diagnosticCollection.set(document.uri, diagnostics);

      const duration = Date.now() - startTime;
      console.log(`[ForegroundAnalyzer] Analyzed ${document.fileName} in ${duration}ms (${result.analysisScope} scope, ${result.issues.length} issues)`);

      // Warn if analysis took too long
      if (duration > 100) {
        console.warn(`[ForegroundAnalyzer] Analysis took ${duration}ms, exceeding 100ms target`);
      }
    } catch (error) {
      console.error('[ForegroundAnalyzer] Error analyzing document:', error);

      // Show parse error as diagnostic
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(0, 0, 0, 1),
        `Paradise analysis error: ${error instanceof Error ? error.message : String(error)}`,
        vscode.DiagnosticSeverity.Error
      );
      diagnostic.source = 'Paradise';
      this.diagnosticCollection.set(document.uri, [diagnostic]);
    }
  }

  /**
   * Analyze with project-wide DocumentModel
   */
  private async analyzeWithProjectModel(
    document: vscode.TextDocument,
    projectModel: DocumentModel
  ): Promise<AnalysisResult> {
    const startTime = Date.now();

    // Run all analyzers with project-wide context
    const allIssues: Issue[] = [];

    for (const analyzer of this.analyzers) {
      try {
        const issues = analyzer.analyze({
          documentModel: projectModel,
          scope: 'page' as AnalysisScope
        });
        allIssues.push(...issues);
      } catch (error) {
        console.error(`[ForegroundAnalyzer] Analyzer ${analyzer.constructor.name} failed:`, error);
      }
    }

    // Filter issues relevant to this document
    const relevantIssues = this.filterIssuesForDocument(allIssues, document);

    return {
      issues: relevantIssues,
      documentModel: projectModel,
      analysisScope: 'project',
      duration: Date.now() - startTime
    };
  }

  /**
   * Analyze with file-scope only (fallback)
   */
  private async analyzeFileScope(document: vscode.TextDocument): Promise<AnalysisResult> {
    const startTime = Date.now();

    // Parse just this file to ActionLanguage
    const content = document.getText();
    const parser = new JavaScriptParser();
    const model = parser.parse(content, document.uri.fsPath);

    // Run analyzers with file-scope context
    const allIssues: Issue[] = [];

    for (const analyzer of this.analyzers) {
      try {
        const issues = analyzer.analyze({
          actionLanguageModel: model,
          scope: 'file' as AnalysisScope
        });
        allIssues.push(...issues);
      } catch (error) {
        console.error(`[ForegroundAnalyzer] Analyzer ${analyzer.constructor.name} failed:`, error);
      }
    }

    return {
      issues: allIssues,
      analysisScope: 'file',
      duration: Date.now() - startTime
    };
  }

  /**
   * Filter issues relevant to a specific document
   */
  private filterIssuesForDocument(issues: Issue[], document: vscode.TextDocument): Issue[] {
    return issues.filter(issue => {
      // Include issues where:
      // 1. Primary location is in this document
      const primaryInDoc = issue.location.file === document.uri.fsPath;

      // 2. Related locations include this document
      const relatedInDoc = issue.relatedLocations?.some(
        loc => loc.file === document.uri.fsPath
      );

      return primaryInDoc || relatedInDoc;
    });
  }

  /**
   * Convert issues to VS Code diagnostics
   */
  private convertToDiagnostics(issues: Issue[], document: vscode.TextDocument): vscode.Diagnostic[] {
    const config = vscode.workspace.getConfiguration('paradise');
    const diagnosticPlacement = config.get<string>('diagnosticPlacement', 'both');
    const minSeverity = config.get<string>('minSeverity', 'info');

    const diagnostics: vscode.Diagnostic[] = [];

    for (const issue of issues) {
      // Filter by severity
      if (!this.meetsMinSeverity(issue.severity, minSeverity)) {
        continue;
      }

      // Primary location
      if (issue.location.file === document.uri.fsPath) {
        if (diagnosticPlacement === 'both' || diagnosticPlacement === 'primary' || diagnosticPlacement === 'all') {
          diagnostics.push(this.createDiagnostic(issue, issue.location, true, document));
        }
      }

      // Related locations (e.g., JS event handlers in other files)
      if (diagnosticPlacement === 'both' || diagnosticPlacement === 'all') {
        for (const location of issue.relatedLocations || []) {
          if (location.file === document.uri.fsPath) {
            diagnostics.push(this.createDiagnostic(issue, location, false, document));
          }
        }
      }
    }

    return diagnostics;
  }

  /**
   * Check if issue severity meets minimum threshold
   */
  private meetsMinSeverity(issueSeverity: string, minSeverity: string): boolean {
    const severityLevels = { error: 3, warning: 2, info: 1 };
    return severityLevels[issueSeverity as keyof typeof severityLevels] >=
           severityLevels[minSeverity as keyof typeof severityLevels];
  }

  /**
   * Create a VS Code diagnostic from an issue
   */
  private createDiagnostic(
    issue: Issue,
    location: { file: string; line: number; column: number; length?: number },
    isPrimary: boolean,
    document: vscode.TextDocument
  ): vscode.Diagnostic {
    const range = new vscode.Range(
      location.line - 1,
      location.column,
      location.line - 1,
      location.column + (location.length || 0)
    );

    // Build message with confidence indicator
    const confidenceIndicator = this.getConfidenceIndicator(issue.confidence);
    const baseMessage = isPrimary
      ? issue.message
      : `${issue.message} (related location)`;

    const message = `${baseMessage}\n\n${confidenceIndicator}`;

    const diagnostic = new vscode.Diagnostic(
      range,
      message,
      this.severityFromIssue(issue)
    );

    diagnostic.source = 'Paradise';
    diagnostic.code = issue.type;

    // Add related information for other locations
    if (isPrimary && issue.relatedLocations && issue.relatedLocations.length > 0) {
      diagnostic.relatedInformation = issue.relatedLocations
        .filter(loc => loc.file !== document.uri.fsPath)
        .map(loc => {
          try {
            return new vscode.DiagnosticRelatedInformation(
              new vscode.Location(
                vscode.Uri.file(loc.file),
                new vscode.Position(loc.line - 1, loc.column)
              ),
              'Related code'
            );
          } catch (error) {
            console.error('[ForegroundAnalyzer] Error creating related information:', error);
            return null;
          }
        })
        .filter(info => info !== null) as vscode.DiagnosticRelatedInformation[];
    }

    return diagnostic;
  }

  /**
   * Get confidence indicator text for display in diagnostics
   */
  private getConfidenceIndicator(confidence: any): string {
    const level = confidence.level;
    const reason = confidence.reason;
    const scope = confidence.scope;

    const emoji = level === 'HIGH' ? '✓' : level === 'MEDIUM' ? '◐' : '⚠';

    return `${emoji} Confidence: ${level} (${scope}-scope)\n${reason}`;
  }

  /**
   * Convert issue severity to VS Code severity
   */
  private severityFromIssue(issue: Issue): vscode.DiagnosticSeverity {
    switch (issue.severity) {
      case 'error':
        return vscode.DiagnosticSeverity.Error;
      case 'warning':
        return vscode.DiagnosticSeverity.Warning;
      case 'info':
        return vscode.DiagnosticSeverity.Information;
      default:
        return vscode.DiagnosticSeverity.Warning;
    }
  }

  /**
   * Clear diagnostics for a document
   */
  clearDiagnostics(uri: vscode.Uri): void {
    this.diagnosticCollection.delete(uri);
  }
}
