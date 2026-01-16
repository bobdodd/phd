/**
 * React Portal Analyzer
 *
 * Detects use of React portals (ReactDOM.createPortal) and flags potential
 * accessibility issues that arise from rendering content outside the parent
 * component's DOM hierarchy.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): Portals can break keyboard navigation order
 * - 2.4.3 Focus Order (Level A): Focus order may not match visual order
 * - 1.3.2 Meaningful Sequence (Level A): Reading order may be disrupted
 * - 4.1.2 Name, Role, Value (Level A): ARIA relationships may break across boundaries
 *
 * Why this matters:
 * - Portals render content in a different part of the DOM tree
 * - Keyboard tab order follows DOM order, not visual order
 * - ARIA relationships (aria-labelledby, aria-controls) don't cross portal boundaries well
 * - Focus management becomes complex (focus traps, returning focus)
 * - Screen readers may announce portals out of visual context
 */
import { Issue } from '../models/BaseModel';
import { PortalUsage } from '../parsers/ReactPatternDetector';
export interface ReactPortalIssue extends Issue {
    /** The portal usage that caused this issue */
    portal: PortalUsage;
    /** Recommended fix */
    fix: {
        description: string;
        code?: string;
    };
}
/**
 * Analyzer for detecting portal accessibility issues in React components.
 */
export declare class ReactPortalAnalyzer {
    /**
     * Analyze React component for portal accessibility issues.
     *
     * @param source - React component source code
     * @param sourceFile - Filename for error reporting
     * @returns Array of detected issues
     *
     * @example
     * ```typescript
     * const analyzer = new ReactPortalAnalyzer();
     * const issues = analyzer.analyze(`
     *   function Modal() {
     *     return ReactDOM.createPortal(
     *       <div role="dialog">
     *         <button>Close</button>
     *       </div>,
     *       document.getElementById('modal-root')
     *     );
     *   }
     * `, 'Modal.tsx');
     * ```
     */
    analyze(source: string, sourceFile: string): ReactPortalIssue[];
    /**
     * Build a detailed message for the portal issue.
     */
    private buildMessage;
    /**
     * Build a fix recommendation.
     */
    private buildFix;
    /**
     * Check if a component uses portals (quick check without full analysis).
     */
    hasPortal(source: string): boolean;
}
/**
 * Convenience function to analyze React component for portal issues.
 *
 * @param source - React component source code
 * @param sourceFile - Filename for error reporting
 * @returns Array of detected issues
 */
export declare function analyzeReactPortals(source: string, sourceFile: string): ReactPortalIssue[];
//# sourceMappingURL=ReactPortalAnalyzer.d.ts.map