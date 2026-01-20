/**
 * Form Label Analyzer
 *
 * Detects accessibility issues with form input labeling including:
 * - Form inputs without labels
 * - Empty label elements
 * - Placeholder-only labels (anti-pattern)
 * - Unlabeled form fields
 * - Inputs with id but no matching label
 * - Labels with for attribute pointing to non-existent inputs
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A): Form labels must be programmatically associated
 * - 3.3.2 Labels or Instructions (Level A): Labels or instructions provided for user input
 * - 4.1.2 Name, Role, Value (Level A): Form elements must have accessible names
 *
 * This analyzer works with DocumentModel to parse form elements from HTML.
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
/**
 * Analyzer for detecting form labeling accessibility issues.
 */
export declare class FormLabelAnalyzer extends BaseAnalyzer {
    readonly name = "FormLabelAnalyzer";
    readonly description = "Detects accessibility issues with form input labeling";
    /**
     * Analyze document for form labeling issues.
     */
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Extract all form input elements from the document.
     */
    private extractFormInputs;
    /**
     * Extract all label elements from the document.
     */
    private extractLabels;
    /**
     * Check if an input has a label element (either wrapping or via for attribute).
     */
    private hasLabelElement;
    /**
     * Get text content from an element.
     */
    private getElementText;
    /**
     * Check if an element is hidden via CSS or attributes.
     */
    private isElementHidden;
    /**
     * Get element context for reporting.
     */
    private getElementContext;
    /**
     * Get HTML representation of an element (simplified).
     */
    private getElementHTML;
}
//# sourceMappingURL=FormLabelAnalyzer.d.ts.map