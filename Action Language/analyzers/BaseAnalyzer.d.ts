/**
 * Base Analyzer
 *
 * Abstract base class for all accessibility analyzers.
 * Provides backward compatibility for file-scope analysis while
 * supporting enhanced DocumentModel-based analysis.
 */
import { DocumentModel, ElementContext } from '../models/DocumentModel';
import { ActionLanguageModel } from '../models/ActionLanguageModel';
import { SourceLocation } from '../models/BaseModel';
/**
 * Analysis scope determines what context is available.
 */
export type AnalysisScope = 'file' | 'workspace' | 'page';
/**
 * Analyzer context provides all available models and scope.
 */
export interface AnalyzerContext {
    /** Document model (if page/workspace analysis available) */
    documentModel?: DocumentModel;
    /** Single ActionLanguage model (legacy file-scope fallback) */
    actionLanguageModel?: ActionLanguageModel;
    /** Analysis scope */
    scope: AnalysisScope;
}
/**
 * Issue severity levels.
 */
export type IssueSeverity = 'error' | 'warning' | 'info';
/**
 * Confidence level for an issue.
 */
export interface IssueConfidence {
    /** Confidence level for this issue */
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    /** Human-readable reason for the confidence level */
    reason: string;
    /** Analysis scope used (affects confidence) */
    scope: 'file' | 'page' | 'workspace';
}
/**
 * Accessibility issue detected by an analyzer.
 */
export interface Issue {
    /** Issue type identifier */
    type: string;
    /** Issue severity */
    severity: IssueSeverity;
    /** WCAG criteria violated (e.g., ['2.1.1', '4.1.2']) */
    wcagCriteria: string[];
    /** Human-readable message */
    message: string;
    /** Confidence in this issue - HIGH means no false positive risk */
    confidence: IssueConfidence;
    /** Primary location of the issue */
    location: SourceLocation;
    /** Related locations (e.g., missing keyboard handler location) */
    relatedLocations?: SourceLocation[];
    /** Element context (if available from DocumentModel) */
    elementContext?: ElementContext;
    /** Suggested fix (optional) */
    fix?: IssueFix;
}
/**
 * Suggested fix for an issue.
 */
export interface IssueFix {
    /** Description of the fix */
    description: string;
    /** Code to insert/replace */
    code: string;
    /** Location to apply the fix */
    location: SourceLocation;
}
/**
 * Base class for all analyzers.
 *
 * Analyzers can operate in two modes:
 * 1. File-scope: Analyze a single ActionLanguageModel (legacy, may have false positives)
 * 2. Document-scope: Analyze DocumentModel with full context (accurate, eliminates false positives)
 *
 * Analyzers should prefer DocumentModel when available, falling back to
 * file-scope analysis for backward compatibility.
 */
export declare abstract class BaseAnalyzer {
    /** Analyzer name */
    abstract readonly name: string;
    /** Analyzer description */
    abstract readonly description: string;
    /**
     * Analyze the provided context and return issues.
     *
     * @param context - Analysis context with models and scope
     * @returns Array of accessibility issues
     */
    abstract analyze(context: AnalyzerContext): Issue[];
    /**
     * Check if DocumentModel is available and has DOM.
     * When true, analyzers should use document-scope analysis for accuracy.
     *
     * @param context - Analysis context
     * @returns True if DocumentModel with DOM is available
     */
    protected supportsDocumentModel(context: AnalyzerContext): boolean;
    /**
     * Check if only file-scope analysis is available.
     * When true, analyzers should use legacy analysis (may have false positives).
     *
     * @param context - Analysis context
     * @returns True if only file-scope analysis is available
     */
    protected isFileScopeOnly(context: AnalyzerContext): boolean;
    /**
     * Get all interactive elements from DocumentModel.
     * Helper method for analyzers that need to check all interactive elements.
     *
     * @param context - Analysis context
     * @returns Array of element contexts, or empty array if no DocumentModel
     */
    protected getInteractiveElements(context: AnalyzerContext): ElementContext[];
    /**
     * Get all elements with accessibility issues.
     * Helper method for analyzers.
     *
     * @param context - Analysis context
     * @returns Array of element contexts with issues
     */
    protected getElementsWithIssues(context: AnalyzerContext): ElementContext[];
    /**
     * Create an issue object with confidence scoring.
     * Helper method for consistent issue creation.
     *
     * @param type - Issue type
     * @param severity - Issue severity
     * @param message - Issue message
     * @param location - Primary location
     * @param wcagCriteria - WCAG criteria violated
     * @param context - Analysis context (for confidence scoring)
     * @param options - Additional options
     * @returns Issue object
     */
    protected createIssue(type: string, severity: IssueSeverity, message: string, location: SourceLocation, wcagCriteria: string[], context: AnalyzerContext, options?: {
        relatedLocations?: SourceLocation[];
        elementContext?: ElementContext;
        fix?: IssueFix;
    }): Issue;
    /**
     * Compute confidence level for an issue based on available context.
     *
     * Confidence levels:
     * - HIGH: Full DocumentModel available, complete context, no false positive risk
     * - MEDIUM: Partial context, some uncertainty
     * - LOW: File-scope only, may have false positives
     */
    private computeConfidence;
}
//# sourceMappingURL=BaseAnalyzer.d.ts.map