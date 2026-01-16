/**
 * CSS Parser for Paradise
 *
 * Parses CSS stylesheets and extracts rules with accessibility impact.
 * Uses css-tree for robust CSS parsing.
 *
 * Key features:
 * - Parses CSS to AST and transforms to CSSModel
 * - Calculates selector specificity
 * - Identifies accessibility-relevant properties
 * - Detects pseudo-classes (:focus, :hover, etc.)
 * - Handles @media queries
 */
import { CSSModelImpl } from '../models/CSSModel';
/**
 * CSS Parser
 *
 * Parses CSS stylesheets into CSSModel.
 */
export declare class CSSParser {
    private ruleCounter;
    /**
     * Parse CSS source into CSSModel.
     *
     * @param source - CSS source code
     * @param sourceFile - Filename for error reporting
     * @returns CSSModel
     *
     * @example
     * ```typescript
     * const parser = new CSSParser();
     * const model = parser.parse(`
     *   .button:focus {
     *     outline: 2px solid blue;
     *   }
     * `, 'styles.css');
     * ```
     */
    parse(source: string, sourceFile: string): CSSModelImpl;
    /**
     * Extract a CSS rule from AST node.
     */
    private extractRule;
    /**
     * Extract properties from CSS block.
     */
    private extractProperties;
    /**
     * Calculate CSS selector specificity.
     * Returns [inline, id, class, element] where higher is more specific.
     *
     * Examples:
     * - "button" → [0, 0, 0, 1]
     * - ".btn" → [0, 0, 1, 0]
     * - "#submit" → [0, 1, 0, 0]
     * - "button.btn:focus" → [0, 0, 2, 1]
     * - "#submit.primary:hover" → [0, 1, 2, 0]
     */
    private calculateSpecificity;
    /**
     * Detect pseudo-class in selector.
     */
    private detectPseudoClass;
    /**
     * Analyze accessibility impact of CSS properties.
     */
    private analyzeAccessibilityImpact;
    /**
     * Extract source location from CSS AST node.
     */
    private extractLocation;
    /**
     * Generate unique ID for a rule.
     */
    private generateId;
}
//# sourceMappingURL=CSSParser.d.ts.map