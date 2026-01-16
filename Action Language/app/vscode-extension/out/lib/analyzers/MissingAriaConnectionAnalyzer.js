"use strict";
/**
 * Missing ARIA Connection Analyzer
 *
 * Detects ARIA attributes that reference elements that don't exist.
 * This is only possible with DocumentModel!
 *
 * Common ARIA relationships:
 * - aria-labelledby: References element(s) that label this element
 * - aria-describedby: References element(s) that describe this element
 * - aria-controls: References element(s) that this element controls
 * - aria-owns: References element(s) that this element owns
 * - aria-activedescendant: References the currently active descendant
 *
 * Example issue:
 * ```html
 * <button aria-labelledby="label1">Click me</button>
 * <!-- label1 doesn't exist! -->
 * ```
 *
 * This analyzer REQUIRES DocumentModel to check if referenced elements exist.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingAriaConnectionAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class MissingAriaConnectionAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'missing-aria-connection';
        this.description = 'Detects ARIA attributes that reference non-existent elements';
        // ARIA attributes that reference other elements
        this.ARIA_REFERENCE_ATTRIBUTES = [
            'aria-labelledby',
            'aria-describedby',
            'aria-controls',
            'aria-owns',
            'aria-activedescendant',
        ];
    }
    /**
     * Analyze for missing ARIA connections.
     *
     * REQUIRES DocumentModel.
     */
    analyze(context) {
        if (!this.supportsDocumentModel(context)) {
            return [];
        }
        const issues = [];
        const documentModel = context.documentModel;
        if (!documentModel.dom)
            return issues;
        // Check all elements for ARIA reference attributes
        const allElements = documentModel.getAllElements();
        for (const element of allElements) {
            for (const ariaAttr of this.ARIA_REFERENCE_ATTRIBUTES) {
                const value = element.attributes[ariaAttr];
                if (value) {
                    // ARIA reference attributes can contain multiple IDs separated by spaces
                    const referencedIds = value.split(/\s+/).filter((id) => id);
                    for (const referencedId of referencedIds) {
                        // Check if referenced element exists
                        const referencedElement = documentModel.getElementById(referencedId);
                        if (!referencedElement) {
                            const message = this.createMessage(element.tagName, element.attributes.id, ariaAttr, referencedId);
                            issues.push(this.createIssue('missing-aria-connection', 'error', message, element.location, ['1.3.1', '4.1.2'], // WCAG 1.3.1: Info and Relationships, 4.1.2: Name, Role, Value
                            context, {
                                elementContext: documentModel.getElementContext(element),
                            }));
                        }
                    }
                }
            }
        }
        return issues;
    }
    /**
     * Create human-readable message.
     */
    createMessage(tagName, elementId, ariaAttr, referencedId) {
        const elementDesc = elementId
            ? `<${tagName}> element with id="${elementId}"`
            : `<${tagName}> element`;
        return `${elementDesc} has ${ariaAttr}="${referencedId}" but element with id="${referencedId}" does not exist. ARIA relationships must reference valid elements (WCAG 1.3.1, 4.1.2).`;
    }
}
exports.MissingAriaConnectionAnalyzer = MissingAriaConnectionAnalyzer;
//# sourceMappingURL=MissingAriaConnectionAnalyzer.js.map