/**
 * Missing ARIA Connection Analyzer
 *
 * Detects ARIA attributes that reference elements that don't exist.
 * This is only possible with DocumentModel!
 *
 * Common ARIA relationships:
 * - aria-labelledby: References element(s) that label this element
 * - aria-describedby: References element(s) that describe this element
 * - aria-controls: References element(s) that this element controls
 * - aria-owns: References element(s) that this element owns
 * - aria-activedescendant: References the currently active descendant
 *
 * Example issue:
 * ```html
 * <button aria-labelledby="label1">Click me</button>
 * <!-- label1 doesn't exist! -->
 * ```
 *
 * This analyzer REQUIRES DocumentModel to check if referenced elements exist.
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class MissingAriaConnectionAnalyzer extends BaseAnalyzer {
    readonly name = "missing-aria-connection";
    readonly description = "Detects ARIA attributes that reference non-existent elements";
    private readonly ARIA_REFERENCE_ATTRIBUTES;
    /**
     * Analyze for missing ARIA connections.
     *
     * REQUIRES DocumentModel.
     */
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Create human-readable message.
     */
    private createMessage;
}
//# sourceMappingURL=MissingAriaConnectionAnalyzer.d.ts.map