/**
 * Visibility-Focus Conflict Analyzer
 *
 * Detects elements that are focusable but visually hidden.
 * This creates confusion - keyboard users can tab to invisible elements!
 *
 * This analyzer requires BOTH DocumentModel (DOM + CSS) to work properly.
 * Currently implements basic detection, will be enhanced when CSSModel is added.
 *
 * Issues detected:
 * 1. Elements with tabindex but aria-hidden="true"
 * 2. Interactive elements with aria-hidden="true"
 * 3. Focusable elements inside hidden containers (future: requires CSSModel)
 *
 * Common mistake:
 * ```html
 * <button aria-hidden="true" tabindex="0">Click me</button>
 * <!-- Button is hidden but still focusable - confusing! -->
 * ```
 *
 * Best practice:
 * - If element is aria-hidden, it should not be focusable
 * - Use tabindex="-1" to remove from tab order
 * - Or remove the element from the DOM entirely when hidden
 *
 * This analyzer REQUIRES DocumentModel (will use CSSModel when available).
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class VisibilityFocusConflictAnalyzer extends BaseAnalyzer {
    readonly name = "visibility-focus-conflict";
    readonly description = "Detects elements that are focusable but visually hidden";
    /**
     * Analyze for visibility-focus conflicts.
     *
     * REQUIRES DocumentModel.
     */
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Create message for aria-hidden focusable element.
     */
    private createAriaHiddenMessage;
    /**
     * Determine why an element is focusable.
     */
    private getFocusReason;
    /**
     * Find CSS rule that hides the element.
     */
    private findHidingRule;
    /**
     * Create message for CSS-hidden focusable element.
     */
    private createCSSHiddenMessage;
}
//# sourceMappingURL=VisibilityFocusConflictAnalyzer.d.ts.map