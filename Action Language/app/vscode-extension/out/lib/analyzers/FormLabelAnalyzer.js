"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormLabelAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
/**
 * Analyzer for detecting form labeling accessibility issues.
 */
class FormLabelAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'FormLabelAnalyzer';
        this.description = 'Detects accessibility issues with form input labeling';
    }
    /**
     * Analyze document for form labeling issues.
     */
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context)) {
            return issues;
        }
        const inputs = this.extractFormInputs(context);
        const labels = this.extractLabels(context);
        // Check each input for proper labeling
        for (const input of inputs) {
            if (input.isHidden) {
                continue; // Skip hidden inputs
            }
            // Check if input has any form of label
            const hasAccessibleName = input.hasAriaLabel ||
                input.hasAriaLabelledby ||
                input.hasLabelElement;
            if (!hasAccessibleName) {
                // Check if using placeholder as only label (anti-pattern)
                if (input.hasPlaceholder && input.placeholderText) {
                    issues.push(this.createIssue('placeholder-only-label', 'error', `Form ${input.type} uses placeholder text "${input.placeholderText}" as the only label. Placeholders disappear when typing and are not announced consistently by screen readers. Use a proper <label> element.`, input.element.location, ['3.3.2', '4.1.2'], context, {
                        elementContext: this.getElementContext(context, input.element),
                        fix: {
                            description: 'Add a proper label element',
                            code: input.id
                                ? `<label for="${input.id}">${input.placeholderText}</label>\n${this.getElementHTML(input.element)}`
                                : `<label>\n  ${input.placeholderText}\n  ${this.getElementHTML(input.element)}\n</label>`,
                            location: input.element.location
                        }
                    }));
                }
                else if (input.hasTitle) {
                    // Title attribute exists but is not recommended
                    issues.push(this.createIssue('title-only-label', 'warning', `Form ${input.type} uses title attribute as the only label. While technically accessible, title attributes have poor screen reader support. Use a <label> element instead.`, input.element.location, ['3.3.2', '4.1.2'], context, {
                        elementContext: this.getElementContext(context, input.element),
                        fix: {
                            description: 'Add a proper label element',
                            code: input.id
                                ? `<label for="${input.id}">Label Text</label>\n${this.getElementHTML(input.element)}`
                                : `<label>\n  Label Text\n  ${this.getElementHTML(input.element)}\n</label>`,
                            location: input.element.location
                        }
                    }));
                }
                else {
                    // No label at all
                    issues.push(this.createIssue('missing-form-label', 'error', `Form ${input.type} has no accessible label. Add a <label> element, aria-label, or aria-labelledby attribute.`, input.element.location, ['3.3.2', '4.1.2', '1.3.1'], context, {
                        elementContext: this.getElementContext(context, input.element),
                        fix: {
                            description: 'Add a label element',
                            code: input.id
                                ? `<label for="${input.id}">Label Text</label>\n${this.getElementHTML(input.element)}`
                                : `<label>\n  Label Text\n  ${this.getElementHTML(input.element)}\n</label>`,
                            location: input.element.location
                        }
                    }));
                }
            }
        }
        // Check labels for issues
        for (const label of labels) {
            // Empty labels
            if (label.isEmpty) {
                issues.push(this.createIssue('empty-form-label', 'error', 'Label element is empty. Provide descriptive text for the associated form control.', label.element.location, ['3.3.2', '4.1.2'], context, {
                    elementContext: this.getElementContext(context, label.element),
                    fix: {
                        description: 'Add descriptive label text',
                        code: label.forId
                            ? `<label for="${label.forId}">Label Text</label>`
                            : '<label>Label Text\n  <!-- form input here -->\n</label>',
                        location: label.element.location
                    }
                }));
            }
            // Label with for attribute pointing to non-existent input
            if (label.forId) {
                const targetExists = inputs.some(input => input.id === label.forId);
                if (!targetExists) {
                    issues.push(this.createIssue('broken-label-for', 'error', `Label has for="${label.forId}" but no form input with id="${label.forId}" exists. The label is not associated with any control.`, label.element.location, ['3.3.2', '4.1.2', '1.3.1'], context, {
                        elementContext: this.getElementContext(context, label.element),
                        fix: {
                            description: 'Add matching id to the form input or remove for attribute',
                            code: `<label>${label.text}\n  <input type="text" name="field">\n</label>`,
                            location: label.element.location
                        }
                    }));
                }
            }
        }
        return issues;
    }
    /**
     * Extract all form input elements from the document.
     */
    extractFormInputs(context) {
        const inputs = [];
        if (!context.documentModel?.dom) {
            return inputs;
        }
        // Find all input, textarea, and select elements
        const inputSelectors = ['input', 'textarea', 'select'];
        for (const selector of inputSelectors) {
            const elements = context.documentModel.dom.getAllElements().filter(el => el.name.toLowerCase() === selector);
            for (const element of elements) {
                const type = element.attributes.type?.toLowerCase() || element.name.toLowerCase();
                // Skip button-type inputs (they don't need labels)
                if (type === 'submit' || type === 'button' || type === 'reset' || type === 'image') {
                    continue;
                }
                const id = element.attributes.id;
                const hasAriaLabel = !!element.attributes['aria-label'];
                const hasAriaLabelledby = !!element.attributes['aria-labelledby'];
                const hasTitle = !!element.attributes.title;
                const hasPlaceholder = !!element.attributes.placeholder;
                const placeholderText = element.attributes.placeholder;
                const isHidden = this.isElementHidden(element, context);
                // Check if input has a label element
                const { hasLabel, labelElement } = this.hasLabelElement(element, id, context);
                inputs.push({
                    element,
                    type,
                    id,
                    hasAriaLabel,
                    hasAriaLabelledby,
                    hasTitle,
                    hasPlaceholder,
                    placeholderText,
                    isHidden,
                    hasLabelElement: hasLabel,
                    labelElement
                });
            }
        }
        return inputs;
    }
    /**
     * Extract all label elements from the document.
     */
    extractLabels(context) {
        const labels = [];
        if (!context.documentModel?.dom) {
            return labels;
        }
        const labelElements = context.documentModel.dom.getAllElements().filter(el => el.name.toLowerCase() === 'label');
        for (const element of labelElements) {
            const forId = element.attributes.for;
            const text = this.getElementText(element);
            const isEmpty = text.trim().length === 0;
            labels.push({
                element,
                forId,
                text,
                isEmpty
            });
        }
        return labels;
    }
    /**
     * Check if an input has a label element (either wrapping or via for attribute).
     */
    hasLabelElement(input, inputId, context) {
        if (!context.documentModel?.dom) {
            return { hasLabel: false };
        }
        // Check if wrapped by a label
        let parent = input.parent;
        while (parent) {
            if (parent.name.toLowerCase() === 'label') {
                return { hasLabel: true, labelElement: parent };
            }
            parent = parent.parent;
        }
        // Check if there's a label with for attribute matching this input's id
        if (inputId) {
            const labelElements = context.documentModel.dom.getAllElements().filter(el => el.name.toLowerCase() === 'label' && el.attributes.for === inputId);
            if (labelElements.length > 0) {
                return { hasLabel: true, labelElement: labelElements[0] };
            }
        }
        return { hasLabel: false };
    }
    /**
     * Get text content from an element.
     */
    getElementText(element) {
        let text = '';
        // Get direct text nodes
        for (const child of element.children) {
            if (child.type === 'text') {
                text += child.value || '';
            }
            else if (child.type === 'element') {
                text += this.getElementText(child);
            }
        }
        return text.trim();
    }
    /**
     * Check if an element is hidden via CSS or attributes.
     */
    isElementHidden(element, context) {
        // Check type="hidden"
        if (element.attributes.type === 'hidden') {
            return true;
        }
        // Check aria-hidden
        if (element.attributes['aria-hidden'] === 'true') {
            return true;
        }
        // Check CSS display/visibility (if CSS model available)
        const cssContext = context.documentModel?.getElementContext(element);
        if (cssContext?.computedStyles) {
            const display = cssContext.computedStyles.display;
            const visibility = cssContext.computedStyles.visibility;
            if (display === 'none' || visibility === 'hidden') {
                return true;
            }
        }
        return false;
    }
    /**
     * Get element context for reporting.
     */
    getElementContext(context, element) {
        return context.documentModel?.getElementContext(element);
    }
    /**
     * Get HTML representation of an element (simplified).
     */
    getElementHTML(element) {
        const attrs = Object.entries(element.attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        if (element.children.length === 0) {
            return `<${element.name}${attrs ? ' ' + attrs : ''}>`;
        }
        return `<${element.name}${attrs ? ' ' + attrs : ''}>...</${element.name}>`;
    }
}
exports.FormLabelAnalyzer = FormLabelAnalyzer;
//# sourceMappingURL=FormLabelAnalyzer.js.map