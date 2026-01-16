/**
 * Code Action Provider
 *
 * Provides quick fixes for Paradise accessibility issues.
 * When users see a squiggly, they can press Ctrl+. (Cmd+. on Mac) to see available fixes.
 */

import * as vscode from 'vscode';
import { Issue, IssueFix } from '../lib/analyzers/BaseAnalyzer';
import { ParadiseHelpProvider } from './helpProvider';

/**
 * Paradise Code Action Provider
 *
 * Converts Paradise issue fixes into VS Code Quick Fix actions.
 */
export class ParadiseCodeActionProvider implements vscode.CodeActionProvider {
  private issues: Map<string, Issue[]> = new Map();
  private helpProvider: ParadiseHelpProvider;

  constructor(helpProvider: ParadiseHelpProvider) {
    this.helpProvider = helpProvider;
  }

  /**
   * Register issues for a document.
   * Called by ForegroundAnalyzer after analysis.
   */
  registerIssues(document: vscode.TextDocument, issues: Issue[]): void {
    this.issues.set(document.uri.toString(), issues);
  }

  /**
   * Clear issues for a document.
   */
  clearIssues(uri: vscode.Uri): void {
    this.issues.delete(uri.toString());
  }

  /**
   * Provide code actions (quick fixes) for a given range.
   */
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] | undefined {
    const actions: vscode.CodeAction[] = [];
    const documentIssues = this.issues.get(document.uri.toString());

    if (!documentIssues) {
      return undefined;
    }

    // Find issues that overlap with the current range
    for (const issue of documentIssues) {
      // Check if issue location overlaps with range
      if (this.issueOverlapsRange(issue, range, document)) {
        // Always add "View Help" action first
        const helpAction = this.createHelpAction(issue);
        actions.push(helpAction);

        // Check if issue has a fix
        if (issue.fix) {
          const action = this.createCodeAction(issue, issue.fix, document);
          if (action) {
            actions.push(action);
          }
        }
      }
    }

    return actions.length > 0 ? actions : undefined;
  }

  /**
   * Check if an issue overlaps with a range.
   */
  private issueOverlapsRange(
    issue: Issue,
    range: vscode.Range,
    document: vscode.TextDocument
  ): boolean {
    // Check primary location
    if (this.locationOverlapsRange(issue.location, range, document)) {
      return true;
    }

    // Check related locations
    if (issue.relatedLocations) {
      for (const location of issue.relatedLocations) {
        if (this.locationOverlapsRange(location, range, document)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if a location overlaps with a range.
   */
  private locationOverlapsRange(
    location: { file: string; line: number; column: number },
    range: vscode.Range,
    document: vscode.TextDocument
  ): boolean {
    // Must be in the same file
    if (location.file !== document.uri.fsPath) {
      return false;
    }

    // Convert location to range (line is 1-based, VS Code is 0-based)
    const locationLine = location.line - 1;

    // Check if location line is within or adjacent to the range
    return (
      locationLine >= range.start.line - 1 &&
      locationLine <= range.end.line + 1
    );
  }

  /**
   * Create a "View Help" code action for an issue.
   */
  private createHelpAction(issue: Issue): vscode.CodeAction {
    const action = new vscode.CodeAction(
      `📖 View Help: ${issue.type}`,
      vscode.CodeActionKind.QuickFix
    );

    // Create a command that will open the help
    action.command = {
      title: 'View Help',
      command: 'paradise.viewHelp',
      arguments: [issue.type]
    };

    action.isPreferred = false; // Help is secondary to actual fixes

    return action;
  }

  /**
   * Create a VS Code CodeAction from an issue fix.
   */
  private createCodeAction(
    issue: Issue,
    fix: IssueFix,
    document: vscode.TextDocument
  ): vscode.CodeAction | undefined {
    try {
      // Create the code action
      const action = new vscode.CodeAction(
        fix.description,
        vscode.CodeActionKind.QuickFix
      );

      // Create workspace edit
      const edit = new vscode.WorkspaceEdit();

      // Determine target location for the fix
      const targetUri = vscode.Uri.file(fix.location.file);

      // Convert fix location to VS Code range (1-based to 0-based)
      const fixLine = fix.location.line - 1;
      const fixColumn = fix.location.column;

      // Insert the fix code after the current line
      const insertPosition = new vscode.Position(fixLine + 1, 0);
      const insertText = '\n' + fix.code + '\n';

      edit.insert(targetUri, insertPosition, insertText);

      action.edit = edit;
      action.diagnostics = []; // Associate with diagnostics if needed
      action.isPreferred = true; // Mark as preferred fix

      return action;
    } catch (error) {
      console.error('[CodeActionProvider] Error creating code action:', error);
      return undefined;
    }
  }
}
