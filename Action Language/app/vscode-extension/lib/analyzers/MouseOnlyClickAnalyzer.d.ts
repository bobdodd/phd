/**
 * Mouse-Only Click Handler Analyzer
 *
 * Detects interactive elements that have click handlers but no keyboard handlers.
 * This is a WCAG 2.1.1 violation - all functionality must be keyboard accessible.
 *
 * This analyzer benefits greatly from DocumentModel:
 * - File-scope: May flag false positives when keyboard handler is in a different file
 * - Document-scope: Accurately detects issues by merging handlers from all files
 *
 * Example issue:
 * ```html
 * <!-- HTML file -->
 * <button id="submit">Submit</button>
 * ```
 *
 * ```javascript
 * // click.js
 * document.getElementById('submit').addEventListener('click', handleClick);
 *
 * // keyboard.js (separate file!)
 * document.getElementById('submit').addEventListener('keydown', handleKeyDown);
 * ```
 *
 * File-scope: FALSE POSITIVE (only sees click.js)
 * Document-scope: NO ISSUE (merges both files correctly)
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class MouseOnlyClickAnalyzer extends BaseAnalyzer {
    readonly name = "mouse-only-click";
    readonly description = "Detects click handlers without corresponding keyboard handlers";
    /**
     * Analyze for mouse-only click handlers.
     *
     * Prefers DocumentModel for accuracy, falls back to file-scope if unavailable.
     */
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Document-scope analysis: Accurate, no false positives.
     *
     * Checks all interactive elements in the DOM to see if they have:
     * - A click handler
     * - But NO keyboard handler (keydown/keypress/keyup)
     */
    private analyzeWithDocumentModel;
    /**
     * File-scope analysis: Legacy fallback, may have false positives.
     *
     * Analyzes a single ActionLanguageModel without DOM context.
     * Cannot detect if keyboard handler exists in another file!
     *
     * Strategy:
     * 1. Find all click event handlers
     * 2. For each click handler, check if same element has keyboard handler
     * 3. Flag as issue if no keyboard handler found
     *
     * Limitation: If keyboard handler is in a different file, this will
     * create a false positive. Use document-scope analysis to avoid this.
     */
    private analyzeFileScope;
    /**
     * Check if a selector has a keyboard handler in the given model.
     */
    private hasKeyboardHandlerForSelector;
    /**
     * Create human-readable message.
     */
    private createMessage;
    /**
     * Generate fix for document-scope issue.
     */
    private generateFix;
    /**
     * Generate fix for file-scope issue.
     */
    private generateFileScopeFix;
    /**
     * Get JavaScript selector code for an element.
     */
    private getElementSelector;
}
//# sourceMappingURL=MouseOnlyClickAnalyzer.d.ts.map