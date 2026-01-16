/**
 * React stopPropagation Analyzer
 *
 * Detects use of stopPropagation() and stopImmediatePropagation() in React event handlers,
 * which can block assistive technology from receiving events.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): stopPropagation can prevent keyboard events from reaching AT
 * - 4.1.2 Name, Role, Value (Level A): Can interfere with ARIA state updates
 *
 * Why this matters:
 * - Screen readers and other assistive technologies often rely on event bubbling
 * - stopPropagation() can prevent AT from detecting user interactions
 * - Particularly problematic for focus management and ARIA live regions
 */
import { Issue } from '../models/BaseModel';
import { SyntheticEventUsage } from '../parsers/ReactPatternDetector';
export interface ReactStopPropagationIssue extends Issue {
    /** The synthetic event usage that caused this issue */
    syntheticEvent: SyntheticEventUsage;
    /** Recommended fix */
    fix: {
        description: string;
        code?: string;
    };
}
/**
 * Analyzer for detecting stopPropagation accessibility issues in React components.
 */
export declare class ReactStopPropagationAnalyzer {
    /**
     * Analyze React component for stopPropagation issues.
     *
     * @param source - React component source code
     * @param sourceFile - Filename for error reporting
     * @returns Array of detected issues
     *
     * @example
     * ```typescript
     * const analyzer = new ReactStopPropagationAnalyzer();
     * const issues = analyzer.analyze(`
     *   function Modal() {
     *     const handleClick = (e) => {
     *       e.stopPropagation(); // ⚠️ Blocks AT events
     *       closeModal();
     *     };
     *     return <button onClick={handleClick}>Close</button>;
     *   }
     * `, 'Modal.tsx');
     * ```
     */
    analyze(source: string, sourceFile: string): ReactStopPropagationIssue[];
    /**
     * Build a detailed message for the issue.
     */
    private buildMessage;
    /**
     * Build a fix recommendation.
     */
    private buildFix;
    /**
     * Check if a component uses stopPropagation (quick check without full analysis).
     */
    hasStopPropagation(source: string): boolean;
}
/**
 * Convenience function to analyze React component for stopPropagation issues.
 *
 * @param source - React component source code
 * @param sourceFile - Filename for error reporting
 * @returns Array of detected issues
 */
export declare function analyzeReactStopPropagation(source: string, sourceFile: string): ReactStopPropagationIssue[];
//# sourceMappingURL=ReactStopPropagationAnalyzer.d.ts.map