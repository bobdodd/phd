/**
 * Visibility-Focus Conflict Analyzer
 *
 * Detects elements that are focusable but visually hidden.
 * This creates confusion - keyboard users can tab to invisible elements!
 *
 * This analyzer requires BOTH DocumentModel (DOM + CSS) to work properly.
 * Currently implements basic detection, will be enhanced when CSSModel is added.
 *
 * Issues detected:
 * 1. Elements with tabindex but aria-hidden="true"
 * 2. Interactive elements with aria-hidden="true"
 * 3. Focusable elements inside hidden containers (future: requires CSSModel)
 *
 * Common mistake:
 * ```html
 * <button aria-hidden="true" tabindex="0">Click me</button>
 * <!-- Button is hidden but still focusable - confusing! -->
 * ```
 *
 * Best practice:
 * - If element is aria-hidden, it should not be focusable
 * - Use tabindex="-1" to remove from tab order
 * - Or remove the element from the DOM entirely when hidden
 *
 * This analyzer REQUIRES DocumentModel (will use CSSModel when available).
 */
import { BaseAnalyzer, } from './BaseAnalyzer';
export class VisibilityFocusConflictAnalyzer extends BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'visibility-focus-conflict';
        this.description = 'Detects elements that are focusable but visually hidden';
    }
    /**
     * Analyze for visibility-focus conflicts.
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
        // Get all focusable elements
        const focusableElements = documentModel.dom.flatMap((fragment) => fragment.getFocusableElements());
        for (const element of focusableElements) {
            const elementContext = documentModel.getElementContext(element);
            // Check 1: aria-hidden="true" but still focusable
            if (element.attributes['aria-hidden'] === 'true') {
                const message = this.createAriaHiddenMessage(element.tagName, element.attributes.id, elementContext);
                issues.push(this.createIssue('aria-hidden-focusable', 'error', message, element.location, ['4.1.2'], // WCAG 4.1.2: Name, Role, Value
                context, {
                    elementContext,
                }));
                continue;
            }
            // Check 2: Interactive element (has handlers) with aria-hidden
            if (elementContext.interactive &&
                element.attributes['aria-hidden'] === 'true') {
                const message = `Interactive element <${element.tagName}> has event handlers but is marked aria-hidden="true". Hidden interactive elements create confusion for assistive technology users (WCAG 4.1.2).`;
                issues.push(this.createIssue('interactive-element-hidden', 'error', message, element.location, ['4.1.2'], context, {
                    elementContext,
                    relatedLocations: elementContext.jsHandlers.map((h) => h.location),
                }));
            }
            // Check 3: CSS display:none or visibility:hidden but focusable
            if (elementContext.cssRules && elementContext.cssRules.length > 0) {
                const hidingRule = this.findHidingRule(elementContext.cssRules);
                if (hidingRule) {
                    const message = this.createCSSHiddenMessage(element.tagName, element.attributes.id, elementContext, hidingRule);
                    issues.push(this.createIssue('css-hidden-focusable', 'error', message, element.location, ['2.4.7'], // WCAG 2.4.7: Focus Visible
                    context, {
                        elementContext,
                        relatedLocations: [hidingRule.location],
                    }));
                }
            }
        }
        return issues;
    }
    /**
     * Create message for aria-hidden focusable element.
     */
    createAriaHiddenMessage(tagName, elementId, elementContext) {
        const elementDesc = elementId
            ? `<${tagName}> element with id="${elementId}"`
            : `<${tagName}> element`;
        const focusReason = this.getFocusReason(elementContext);
        return `${elementDesc} is focusable (${focusReason}) but is marked aria-hidden="true". Hidden elements should not be focusable. Add tabindex="-1" to remove from tab order, or remove aria-hidden if the element should be accessible (WCAG 4.1.2).`;
    }
    /**
     * Determine why an element is focusable.
     */
    getFocusReason(elementContext) {
        const element = elementContext.element;
        const tagName = element.tagName.toLowerCase();
        // Check explicit tabindex
        if (element.attributes.tabindex !== undefined) {
            return `has tabindex="${element.attributes.tabindex}"`;
        }
        // Naturally focusable elements
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
    /**
     * Find CSS rule that hides the element.
     */
    findHidingRule(cssRules) {
        for (const rule of cssRules) {
            const { properties } = rule;
            // Check for display: none
            if (properties.display === 'none')
                return rule;
            // Check for visibility: hidden
            if (properties.visibility === 'hidden')
                return rule;
            // Check for opacity: 0
            if (properties.opacity === '0' || properties.opacity === 0)
                return rule;
            // Check for clip/clip-path hiding
            if (properties.clip === 'rect(0, 0, 0, 0)')
                return rule;
            if (properties['clip-path'] === 'inset(50%)')
                return rule;
            // Check for position off-screen
            if ((properties.position === 'absolute' || properties.position === 'fixed') &&
                (properties.left === '-9999px' ||
                    properties.left === '-10000px' ||
                    properties.top === '-9999px')) {
                return rule;
            }
        }
        return null;
    }
    /**
     * Create message for CSS-hidden focusable element.
     */
    createCSSHiddenMessage(tagName, elementId, elementContext, hidingRule) {
        const elementDesc = elementId
            ? `<${tagName}> element with id="${elementId}"`
            : `<${tagName}> element`;
        const focusReason = this.getFocusReason(elementContext);
        // Identify which CSS property hides the element
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
//# sourceMappingURL=VisibilityFocusConflictAnalyzer.js.map