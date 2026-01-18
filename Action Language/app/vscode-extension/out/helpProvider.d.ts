import { Issue } from '../lib/analyzers/BaseAnalyzer';
/**
 * Provides help documentation for Paradise accessibility issues
 */
export declare class ParadiseHelpProvider {
    private docsPath;
    private extensionPath;
    constructor(extensionPath: string);
    /**
     * Show help for a specific issue type with optional fix context
     */
    showHelp(issueType: string, issue?: Issue): Promise<void>;
    /**
     * Show help with fix code in a webview panel
     */
    private showHelpWithFix;
    /**
     * Apply a fix to the document
     */
    private applyFix;
    /**
     * Convert markdown to HTML (simple conversion for basic markdown)
     */
    private markdownToHtml;
    /**
     * Get the HTML content for the webview
     */
    private getWebviewContent;
    /**
     * Escape HTML special characters
     */
    private escapeHtml;
    /**
     * Show the help index
     */
    showHelpIndex(): Promise<void>;
    /**
     * Get inline help text for a tooltip (first paragraph of help file)
     */
    getInlineHelp(issueType: string): string | undefined;
}
//# sourceMappingURL=helpProvider.d.ts.map