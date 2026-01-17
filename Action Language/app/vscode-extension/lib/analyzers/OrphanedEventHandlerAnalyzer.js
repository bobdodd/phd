"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrphanedEventHandlerAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class OrphanedEventHandlerAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'orphaned-event-handler';
        this.description = 'Detects event handlers that reference non-existent DOM elements';
    }
    analyze(context) {
        if (!this.supportsDocumentModel(context)) {
            return [];
        }
        const issues = [];
        const documentModel = context.documentModel;
        for (const jsModel of documentModel.javascript) {
            const handlers = jsModel.getAllEventHandlers();
            for (const handler of handlers) {
                const exists = this.elementExistsInDOM(handler.element.selector, documentModel);
                if (!exists) {
                    const message = `Event handler references element "${handler.element.selector}" which does not exist in the DOM. Check for typos or ensure element is created before attaching handlers.`;
                    issues.push(this.createIssue('orphaned-event-handler', 'error', message, handler.location, ['4.1.2'], context, {
                        elementContext: undefined,
                    }));
                }
            }
        }
        return issues;
    }
    elementExistsInDOM(selector, documentModel) {
        const globalObjects = ['document', 'window', 'navigator', 'location', 'history', 'screen'];
        if (globalObjects.includes(selector)) {
            return true;
        }
        if (selector.startsWith('#')) {
            const id = selector.slice(1);
            const element = documentModel.getElementById(id);
            return element !== null;
        }
        if (selector.startsWith('.')) {
            const elements = documentModel.querySelectorAll(selector);
            return elements.length > 0;
        }
        if (selector.startsWith('[')) {
            const elements = documentModel.querySelectorAll(selector);
            return elements.length > 0;
        }
        const elements = documentModel.querySelectorAll(selector);
        return elements.length > 0;
    }
}
exports.OrphanedEventHandlerAnalyzer = OrphanedEventHandlerAnalyzer;
//# sourceMappingURL=OrphanedEventHandlerAnalyzer.js.map