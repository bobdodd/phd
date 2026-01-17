"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingAriaConnectionAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class MissingAriaConnectionAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'missing-aria-connection';
        this.description = 'Detects ARIA attributes that reference non-existent elements';
        this.ARIA_REFERENCE_ATTRIBUTES = [
            'aria-labelledby',
            'aria-describedby',
            'aria-controls',
            'aria-owns',
            'aria-activedescendant',
        ];
    }
    analyze(context) {
        if (!this.supportsDocumentModel(context)) {
            return [];
        }
        const issues = [];
        const documentModel = context.documentModel;
        if (!documentModel.dom)
            return issues;
        const allElements = documentModel.getAllElements();
        for (const element of allElements) {
            for (const ariaAttr of this.ARIA_REFERENCE_ATTRIBUTES) {
                const value = element.attributes[ariaAttr];
                if (value) {
                    const referencedIds = value.split(/\s+/).filter((id) => id);
                    for (const referencedId of referencedIds) {
                        const referencedElement = documentModel.getElementById(referencedId);
                        if (!referencedElement) {
                            const message = this.createMessage(element.tagName, element.attributes.id, ariaAttr, referencedId);
                            issues.push(this.createIssue('missing-aria-connection', 'error', message, element.location, ['1.3.1', '4.1.2'], context, {
                                elementContext: documentModel.getElementContext(element),
                            }));
                        }
                    }
                }
            }
        }
        return issues;
    }
    createMessage(tagName, elementId, ariaAttr, referencedId) {
        const elementDesc = elementId
            ? `<${tagName}> element with id="${elementId}"`
            : `<${tagName}> element`;
        return `${elementDesc} has ${ariaAttr}="${referencedId}" but element with id="${referencedId}" does not exist. ARIA relationships must reference valid elements (WCAG 1.3.1, 4.1.2).`;
    }
}
exports.MissingAriaConnectionAnalyzer = MissingAriaConnectionAnalyzer;
//# sourceMappingURL=MissingAriaConnectionAnalyzer.js.map