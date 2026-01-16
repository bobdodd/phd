/**
 * Provides help documentation for Paradise accessibility issues
 */
export declare class ParadiseHelpProvider {
    private docsPath;
    constructor(extensionPath: string);
    /**
     * Show help for a specific issue type
     */
    showHelp(issueType: string): Promise<void>;
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