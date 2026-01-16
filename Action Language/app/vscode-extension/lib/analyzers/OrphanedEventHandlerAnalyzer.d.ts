/**
 * Orphaned Event Handler Analyzer
 *
 * Detects JavaScript event handlers that reference DOM elements that don't exist.
 * This is only possible with DocumentModel - file-scope analysis cannot detect this!
 *
 * Common causes:
 * - Typo in element ID
 * - Element was removed but handler wasn't
 * - Handler added before element creation
 * - Wrong selector used
 *
 * Example issue:
 * ```html
 * <!-- HTML file -->
 * <button id="submit">Submit</button>
 * ```
 *
 * ```javascript
 * // handlers.js - TYPO in ID!
 * document.getElementById('sumbit').addEventListener('click', handleClick);
 * //                      ^^^^^^ should be 'submit'
 * ```
 *
 * This analyzer REQUIRES DocumentModel - cannot work in file-scope mode.
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class OrphanedEventHandlerAnalyzer extends BaseAnalyzer {
    readonly name = "orphaned-event-handler";
    readonly description = "Detects event handlers that reference non-existent DOM elements";
    /**
     * Analyze for orphaned event handlers.
     *
     * REQUIRES DocumentModel - cannot detect orphaned handlers without DOM.
     */
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Check if an element with the given selector exists in the DOM.
     */
    private elementExistsInDOM;
}
//# sourceMappingURL=OrphanedEventHandlerAnalyzer.d.ts.map