"use strict";
/**
 * Base Analyzer
 *
 * Abstract base class for all accessibility analyzers.
 * Provides backward compatibility for file-scope analysis while
 * supporting enhanced DocumentModel-based analysis.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAnalyzer = void 0;
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
class BaseAnalyzer {
    /**
     * Check if DocumentModel is available and has DOM.
     * When true, analyzers should use document-scope analysis for accuracy.
     *
     * @param context - Analysis context
     * @returns True if DocumentModel with DOM is available
     */
    supportsDocumentModel(context) {
        return (context.documentModel !== undefined &&
            context.documentModel.dom !== undefined);
    }
    /**
     * Check if only file-scope analysis is available.
     * When true, analyzers should use legacy analysis (may have false positives).
     *
     * @param context - Analysis context
     * @returns True if only file-scope analysis is available
     */
    isFileScopeOnly(context) {
        return (context.scope === 'file' ||
            context.actionLanguageModel !== undefined &&
                context.documentModel === undefined);
    }
    /**
     * Get all interactive elements from DocumentModel.
     * Helper method for analyzers that need to check all interactive elements.
     *
     * @param context - Analysis context
     * @returns Array of element contexts, or empty array if no DocumentModel
     */
    getInteractiveElements(context) {
        if (!context.documentModel || !context.documentModel.dom) {
            return [];
        }
        return context.documentModel.getInteractiveElements();
    }
    /**
     * Get all elements with accessibility issues.
     * Helper method for analyzers.
     *
     * @param context - Analysis context
     * @returns Array of element contexts with issues
     */
    getElementsWithIssues(context) {
        if (!context.documentModel || !context.documentModel.dom) {
            return [];
        }
        return context.documentModel.getElementsWithIssues();
    }
    /**
     * Create an issue object.
     * Helper method for consistent issue creation.
     *
     * @param type - Issue type
     * @param severity - Issue severity
     * @param message - Issue message
     * @param location - Primary location
     * @param wcagCriteria - WCAG criteria violated
     * @param options - Additional options
     * @returns Issue object
     */
    createIssue(type, severity, message, location, wcagCriteria, options) {
        return {
            type,
            severity,
            message,
            location,
            wcagCriteria,
            relatedLocations: options?.relatedLocations,
            elementContext: options?.elementContext,
            fix: options?.fix,
        };
    }
}
exports.BaseAnalyzer = BaseAnalyzer;
//# sourceMappingURL=BaseAnalyzer.js.map