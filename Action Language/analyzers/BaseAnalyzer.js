/**
 * Base Analyzer
 *
 * Abstract base class for all accessibility analyzers.
 * Provides backward compatibility for file-scope analysis while
 * supporting enhanced DocumentModel-based analysis.
 */
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
export class BaseAnalyzer {
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
    createIssue(type, severity, message, location, wcagCriteria, context, options) {
        // Compute confidence based on analysis scope and context
        const confidence = this.computeConfidence(context, options?.elementContext);
        return {
            type,
            severity,
            message,
            location,
            wcagCriteria,
            confidence,
            relatedLocations: options?.relatedLocations,
            elementContext: options?.elementContext,
            fix: options?.fix,
        };
    }
    /**
     * Compute confidence level for an issue based on available context.
     *
     * Confidence levels:
     * - HIGH: Full DocumentModel available, complete context, no false positive risk
     * - MEDIUM: Partial context, some uncertainty
     * - LOW: File-scope only, may have false positives
     */
    computeConfidence(context, elementContext) {
        // HIGH confidence: Full DocumentModel with element context
        if (context.documentModel && elementContext) {
            return {
                level: 'HIGH',
                reason: 'Full document analysis with complete DOM and JavaScript context',
                scope: context.scope,
            };
        }
        // HIGH confidence: DocumentModel available (page/workspace scope)
        if (context.documentModel && context.scope !== 'file') {
            return {
                level: 'HIGH',
                reason: 'Document-scope analysis with HTML, CSS, and JavaScript',
                scope: context.scope,
            };
        }
        // MEDIUM confidence: Some context but not complete
        if (context.documentModel) {
            return {
                level: 'MEDIUM',
                reason: 'Partial document context available',
                scope: context.scope,
            };
        }
        // LOW confidence: File-scope only
        return {
            level: 'LOW',
            reason: 'File-scope analysis only - may have false positives if handler is in another file',
            scope: 'file',
        };
    }
}
//# sourceMappingURL=BaseAnalyzer.js.map