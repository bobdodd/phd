"use strict";
/**
 * Code Action Provider
 *
 * Provides quick fixes for Paradise accessibility issues.
 * When users see a squiggly, they can press Ctrl+. (Cmd+. on Mac) to see available fixes.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParadiseCodeActionProvider = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Paradise Code Action Provider
 *
 * Converts Paradise issue fixes into VS Code Quick Fix actions.
 */
class ParadiseCodeActionProvider {
    constructor(helpProvider) {
        this.issues = new Map();
        this.helpProvider = helpProvider;
    }
    /**
     * Register issues for a document.
     * Called by ForegroundAnalyzer after analysis.
     */
    registerIssues(document, issues) {
        this.issues.set(document.uri.toString(), issues);
    }
    /**
     * Clear issues for a document.
     */
    clearIssues(uri) {
        this.issues.delete(uri.toString());
    }
    /**
     * Provide code actions (quick fixes) for a given range.
     */
    provideCodeActions(document, range, context, token) {
        const actions = [];
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
    issueOverlapsRange(issue, range, document) {
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
    locationOverlapsRange(location, range, document) {
        // Must be in the same file
        if (location.file !== document.uri.fsPath) {
            return false;
        }
        // Convert location to range (line is 1-based, VS Code is 0-based)
        const locationLine = location.line - 1;
        // Check if location line is within or adjacent to the range
        return (locationLine >= range.start.line - 1 &&
            locationLine <= range.end.line + 1);
    }
    /**
     * Create a "View Help" code action for an issue.
     */
    createHelpAction(issue) {
        const action = new vscode.CodeAction(`📖 View Help: ${issue.type}`, vscode.CodeActionKind.QuickFix);
        // Create a command that will open the help, passing the full issue
        action.command = {
            title: 'View Help',
            command: 'paradise.viewHelp',
            arguments: [issue.type, issue] // Pass full issue for fix context
        };
        action.isPreferred = false; // Help is secondary to actual fixes
        return action;
    }
    /**
     * Create a VS Code CodeAction from an issue fix.
     */
    createCodeAction(issue, fix, document) {
        try {
            // Create the code action
            const action = new vscode.CodeAction(fix.description, vscode.CodeActionKind.QuickFix);
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
        }
        catch (error) {
            console.error('[CodeActionProvider] Error creating code action:', error);
            return undefined;
        }
    }
}
exports.ParadiseCodeActionProvider = ParadiseCodeActionProvider;
//# sourceMappingURL=codeActionProvider.js.map