/**
 * Code Action Provider
 *
 * Provides quick fixes for Paradise accessibility issues.
 * When users see a squiggly, they can press Ctrl+. (Cmd+. on Mac) to see available fixes.
 */
import * as vscode from 'vscode';
import { Issue } from '../lib/analyzers/BaseAnalyzer';
/**
 * Paradise Code Action Provider
 *
 * Converts Paradise issue fixes into VS Code Quick Fix actions.
 */
export declare class ParadiseCodeActionProvider implements vscode.CodeActionProvider {
    private issues;
    /**
     * Register issues for a document.
     * Called by ForegroundAnalyzer after analysis.
     */
    registerIssues(document: vscode.TextDocument, issues: Issue[]): void;
    /**
     * Clear issues for a document.
     */
    clearIssues(uri: vscode.Uri): void;
    /**
     * Provide code actions (quick fixes) for a given range.
     */
    provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] | undefined;
    /**
     * Check if an issue overlaps with a range.
     */
    private issueOverlapsRange;
    /**
     * Check if a location overlaps with a range.
     */
    private locationOverlapsRange;
    /**
     * Create a VS Code CodeAction from an issue fix.
     */
    private createCodeAction;
}
//# sourceMappingURL=codeActionProvider.d.ts.map