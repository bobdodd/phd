/**
 * ForegroundAnalyzer - Instant analysis system (<100ms target)
 *
 * Analyzes currently open files with immediate feedback.
 * Falls back to file-scope when project model not available.
 */
import * as vscode from 'vscode';
import { ProjectModelManager } from './projectModelManager';
import { ParadiseCodeActionProvider } from './codeActionProvider';
export declare class ForegroundAnalyzer {
    private diagnosticCollection;
    private projectManager;
    private analyzers;
    private codeActionProvider;
    constructor(diagnosticCollection: vscode.DiagnosticCollection, projectManager: ProjectModelManager, codeActionProvider: ParadiseCodeActionProvider);
    /**
     * Analyze a document (must be fast: <100ms target)
     */
    analyzeDocument(document: vscode.TextDocument): Promise<void>;
    /**
     * Analyze with project-wide DocumentModel
     */
    private analyzeWithProjectModel;
    /**
     * Analyze with file-scope only (fallback)
     */
    private analyzeFileScope;
    /**
     * Filter issues relevant to a specific document
     */
    private filterIssuesForDocument;
    /**
     * Convert issues to VS Code diagnostics
     */
    private convertToDiagnostics;
    /**
     * Check if issue severity meets minimum threshold
     */
    private meetsMinSeverity;
    /**
     * Create a VS Code diagnostic from an issue
     */
    private createDiagnostic;
    /**
     * Get WCAG criteria information with links
     */
    private getWCAGInfo;
    /**
     * Convert WCAG criterion number to URL slug
     */
    private getCriterionSlug;
    /**
     * Get confidence indicator text for display in diagnostics
     */
    private getConfidenceIndicator;
    /**
     * Convert issue severity to VS Code severity
     */
    private severityFromIssue;
    /**
     * Clear diagnostics for a document
     */
    clearDiagnostics(uri: vscode.Uri): void;
}
//# sourceMappingURL=foregroundAnalyzer.d.ts.map