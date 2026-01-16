"use strict";
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
exports.ParadiseHelpProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * Provides help documentation for Paradise accessibility issues
 */
class ParadiseHelpProvider {
    constructor(extensionPath) {
        // Help docs are packaged with the extension
        this.docsPath = path.join(extensionPath, 'docs', 'issues');
    }
    /**
     * Show help for a specific issue type
     */
    async showHelp(issueType) {
        const helpFilePath = path.join(this.docsPath, `${issueType}.md`);
        // Check if help file exists
        if (!fs.existsSync(helpFilePath)) {
            vscode.window.showWarningMessage(`Help documentation for "${issueType}" is not yet available.`, 'View All Help').then(selection => {
                if (selection === 'View All Help') {
                    this.showHelpIndex();
                }
            });
            return;
        }
        // Open the markdown file in VS Code
        const document = await vscode.workspace.openTextDocument(helpFilePath);
        await vscode.window.showTextDocument(document, {
            preview: true,
            viewColumn: vscode.ViewColumn.Beside
        });
        // Optionally, show it as markdown preview
        await vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(helpFilePath));
    }
    /**
     * Show the help index
     */
    async showHelpIndex() {
        const indexPath = path.join(this.docsPath, 'README.md');
        if (!fs.existsSync(indexPath)) {
            vscode.window.showErrorMessage('Paradise help documentation not found.');
            return;
        }
        const document = await vscode.workspace.openTextDocument(indexPath);
        await vscode.window.showTextDocument(document, {
            preview: true,
            viewColumn: vscode.ViewColumn.Beside
        });
        await vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(indexPath));
    }
    /**
     * Get inline help text for a tooltip (first paragraph of help file)
     */
    getInlineHelp(issueType) {
        const helpFilePath = path.join(this.docsPath, `${issueType}.md`);
        if (!fs.existsSync(helpFilePath)) {
            return undefined;
        }
        try {
            const content = fs.readFileSync(helpFilePath, 'utf-8');
            // Extract the description section (after the header, before "Why This Matters")
            const descriptionMatch = content.match(/## Description\n\n([\s\S]*?)\n\n## Why This Matters/);
            if (descriptionMatch) {
                return descriptionMatch[1].trim();
            }
            // Fallback: get first paragraph after title
            const lines = content.split('\n');
            const paragraphs = [];
            let inParagraph = false;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                // Skip front matter and title
                if (line.startsWith('#') || line.startsWith('**')) {
                    continue;
                }
                if (line.length > 0) {
                    if (!inParagraph) {
                        inParagraph = true;
                    }
                    paragraphs.push(line);
                }
                else if (inParagraph) {
                    break; // End of first paragraph
                }
            }
            return paragraphs.join(' ');
        }
        catch (error) {
            console.error(`[HelpProvider] Error reading help file: ${helpFilePath}`, error);
            return undefined;
        }
    }
}
exports.ParadiseHelpProvider = ParadiseHelpProvider;
//# sourceMappingURL=helpProvider.js.map