"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisibilityFocusConflictAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class VisibilityFocusConflictAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'visibility-focus-conflict';
        this.description = 'Detects elements that are focusable but visually hidden';
    }
    analyze(context) {
        if (!this.supportsDocumentModel(context)) {
            return [];
        }
        const issues = [];
        const documentModel = context.documentModel;
        if (!documentModel.dom)
            return issues;
        const focusableElements = documentModel.dom.flatMap((fragment) => fragment.getFocusableElements());
        for (const element of focusableElements) {
            const elementContext = documentModel.getElementContext(element);
            if (element.attributes['aria-hidden'] === 'true') {
                const message = this.createAriaHiddenMessage(element.tagName, element.attributes.id, elementContext);
                issues.push(this.createIssue('aria-hidden-focusable', 'error', message, element.location, ['4.1.2'], context, {
                    elementContext,
                }));
                continue;
            }
            if (elementContext.interactive &&
                element.attributes['aria-hidden'] === 'true') {
                const message = `Interactive element <${element.tagName}> has event handlers but is marked aria-hidden="true". Hidden interactive elements create confusion for assistive technology users (WCAG 4.1.2).`;
                issues.push(this.createIssue('interactive-element-hidden', 'error', message, element.location, ['4.1.2'], context, {
                    elementContext,
                    relatedLocations: elementContext.jsHandlers.map((h) => h.location),
                }));
            }
            if (elementContext.cssRules && elementContext.cssRules.length > 0) {
                const hidingRule = this.findHidingRule(elementContext.cssRules);
                if (hidingRule) {
                    const message = this.createCSSHiddenMessage(element.tagName, element.attributes.id, elementContext, hidingRule);
                    issues.push(this.createIssue('css-hidden-focusable', 'error', message, element.location, ['2.4.7'], context, {
                        elementContext,
                        relatedLocations: [hidingRule.location],
                    }));
                }
            }
        }
        return issues;
    }
    createAriaHiddenMessage(tagName, elementId, elementContext) {
        const elementDesc = elementId
            ? `<${tagName}> element with id="${elementId}"`
            : `<${tagName}> element`;
        const focusReason = this.getFocusReason(elementContext);
        return `${elementDesc} is focusable (${focusReason}) but is marked aria-hidden="true". Hidden elements should not be focusable. Add tabindex="-1" to remove from tab order, or remove aria-hidden if the element should be accessible (WCAG 4.1.2).`;
    }
    getFocusReason(elementContext) {
        const element = elementContext.element;
        const tagName = element.tagName.toLowerCase();
        if (element.attributes.tabindex !== undefined) {
            return `has tabindex="${element.attributes.tabindex}"`;
        }
        const naturallyFocusable = {
            a: 'is a link',
            button: 'is a button',
            input: 'is an input',
            select: 'is a select',
            textarea: 'is a textarea',
        };
        if (naturallyFocusable[tagName]) {
            return naturallyFocusable[tagName];
        }
        return 'is focusable';
    }
    findHidingRule(cssRules) {
        for (const rule of cssRules) {
            const { properties } = rule;
            if (properties.display === 'none')
                return rule;
            if (properties.visibility === 'hidden')
                return rule;
            if (properties.opacity === '0' || properties.opacity === 0)
                return rule;
            if (properties.clip === 'rect(0, 0, 0, 0)')
                return rule;
            if (properties['clip-path'] === 'inset(50%)')
                return rule;
            if ((properties.position === 'absolute' || properties.position === 'fixed') &&
                (properties.left === '-9999px' ||
                    properties.left === '-10000px' ||
                    properties.top === '-9999px')) {
                return rule;
            }
        }
        return null;
    }
    createCSSHiddenMessage(tagName, elementId, elementContext, hidingRule) {
        const elementDesc = elementId
            ? `<${tagName}> element with id="${elementId}"`
            : `<${tagName}> element`;
        const focusReason = this.getFocusReason(elementContext);
        const { properties } = hidingRule;
        let hidingProperty = 'CSS';
        if (properties.display === 'none') {
            hidingProperty = 'display: none';
        }
        else if (properties.visibility === 'hidden') {
            hidingProperty = 'visibility: hidden';
        }
        else if (properties.opacity === '0' || properties.opacity === 0) {
            hidingProperty = 'opacity: 0';
        }
        else if (properties.clip) {
            hidingProperty = 'clip';
        }
        else if (properties['clip-path']) {
            hidingProperty = 'clip-path';
        }
        else if (properties.position && properties.left) {
            hidingProperty = 'off-screen positioning';
        }
        return `${elementDesc} is focusable (${focusReason}) but is hidden by CSS (${hidingProperty} in ${hidingRule.selector}). Hidden elements should not be focusable. Add tabindex="-1" to remove from tab order, or make the element visible when it receives focus (WCAG 2.4.7).`;
    }
}
exports.VisibilityFocusConflictAnalyzer = VisibilityFocusConflictAnalyzer;
//# sourceMappingURL=VisibilityFocusConflictAnalyzer.js.map