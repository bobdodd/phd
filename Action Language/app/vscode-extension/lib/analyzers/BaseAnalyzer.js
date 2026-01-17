"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAnalyzer = void 0;
class BaseAnalyzer {
    supportsDocumentModel(context) {
        return (context.documentModel !== undefined &&
            context.documentModel.dom !== undefined);
    }
    isFileScopeOnly(context) {
        return (context.scope === 'file' ||
            context.actionLanguageModel !== undefined &&
                context.documentModel === undefined);
    }
    getInteractiveElements(context) {
        if (!context.documentModel || !context.documentModel.dom) {
            return [];
        }
        return context.documentModel.getInteractiveElements();
    }
    getElementsWithIssues(context) {
        if (!context.documentModel || !context.documentModel.dom) {
            return [];
        }
        return context.documentModel.getElementsWithIssues();
    }
    createIssue(type, severity, message, location, wcagCriteria, context, options) {
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
    computeConfidence(context, elementContext) {
        if (context.documentModel && elementContext) {
            return {
                level: 'HIGH',
                reason: 'Full document analysis with complete DOM and JavaScript context',
                scope: context.scope,
            };
        }
        if (context.documentModel && context.scope !== 'file') {
            return {
                level: 'HIGH',
                reason: 'Document-scope analysis with HTML, CSS, and JavaScript',
                scope: context.scope,
            };
        }
        if (context.documentModel) {
            return {
                level: 'MEDIUM',
                reason: 'Partial document context available',
                scope: context.scope,
            };
        }
        return {
            level: 'LOW',
            reason: 'File-scope analysis only - may have false positives if handler is in another file',
            scope: 'file',
        };
    }
}
exports.BaseAnalyzer = BaseAnalyzer;
//# sourceMappingURL=BaseAnalyzer.js.map