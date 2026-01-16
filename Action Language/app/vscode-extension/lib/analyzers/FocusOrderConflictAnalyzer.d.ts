/**
 * Focus Order Conflict Analyzer
 *
 * Detects problematic tabindex usage that creates confusing focus order.
 * This analyzer requires DocumentModel to see all focusable elements together.
 *
 * Issues detected:
 * 1. Positive tabindex values (anti-pattern - creates unpredictable order)
 * 2. Multiple elements with same positive tabindex
 * 3. Gaps in tabindex sequence
 * 4. Mixing positive and default focus order
 *
 * Best practice:
 * - Use tabindex="0" to add elements to natural tab order
 * - Use tabindex="-1" to make elements programmatically focusable only
 * - Avoid positive tabindex values (tabindex="1", "2", etc.)
 *
 * Example issue:
 * ```html
 * <button tabindex="2">First visually</button>
 * <button tabindex="1">Second visually</button>
 * <!-- Tab order: Second, First - confusing! -->
 * ```
 *
 * This analyzer REQUIRES DocumentModel to see all elements together.
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class FocusOrderConflictAnalyzer extends BaseAnalyzer {
    readonly name = "focus-order-conflict";
    readonly description = "Detects problematic tabindex usage that creates confusing focus order";
    /**
     * Analyze for focus order conflicts.
     *
     * REQUIRES DocumentModel.
     */
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Get numeric tabindex value from element.
     */
    private getTabIndex;
}
//# sourceMappingURL=FocusOrderConflictAnalyzer.d.ts.map