/**
 * Heading Structure Analyzer
 *
 * Detects accessibility issues in heading hierarchy and structure including:
 * - Empty headings
 * - Skipped heading levels (e.g., h1 followed by h3)
 * - Missing or multiple H1 elements
 * - Improper heading hierarchy
 * - aria-level without role
 * - Heading length issues
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A): Heading hierarchy must be programmatically determinable
 * - 2.4.1 Bypass Blocks (Level A): Headings enable navigation
 * - 2.4.6 Headings and Labels (Level AA): Headings must be descriptive
 * - 2.4.10 Section Headings (Level AAA): Use headings to organize content
 *
 * This analyzer works with DocumentModel to parse heading elements from HTML.
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
/**
 * Analyzer for detecting heading structure accessibility issues.
 */
export declare class HeadingStructureAnalyzer extends BaseAnalyzer {
    readonly name = "HeadingStructureAnalyzer";
    readonly description = "Detects accessibility issues in heading hierarchy and structure";
    private readonly MAX_HEADING_LENGTH;
    private readonly NEAR_LIMIT_THRESHOLD;
    /**
     * Analyze document for heading structure issues.
     */
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Extract all heading elements from the document.
     */
    private extractHeadings;
    /**
     * Analyze H1 presence and uniqueness.
     */
    private analyzeH1;
    /**
     * Analyze heading hierarchy for skipped levels.
     */
    private analyzeHierarchy;
    /**
     * Check for aria-level without role attribute.
     */
    private analyzeAriaLevel;
    /**
     * Get text content from an element.
     */
    private getElementText;
    /**
     * Check if an element is empty (no text content).
     */
    private isElementEmpty;
    /**
     * Check if an element is hidden via CSS.
     */
    private isElementHidden;
}
//# sourceMappingURL=HeadingStructureAnalyzer.d.ts.map