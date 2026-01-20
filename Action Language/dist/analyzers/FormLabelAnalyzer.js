"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormLabelAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class FormLabelAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'FormLabelAnalyzer';
        this.description = 'Detects accessibility issues with form input labeling';
    }
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context)) {
            return issues;
        }
        const inputs = this.extractFormInputs(context);
        const labels = this.extractLabels(context);
        for (const input of inputs) {
            if (input.isHidden) {
                continue;
            }
            const hasAccessibleName = input.hasAriaLabel ||
                input.hasAriaLabelledby ||
                input.hasLabelElement;
            if (!hasAccessibleName) {
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
        for (const label of labels) {
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
    extractFormInputs(context) {
        const inputs = [];
        if (!context.documentModel?.dom) {
            return inputs;
        }
        const allElements = context.documentModel.getAllElements();
        const inputSelectors = ['input', 'textarea', 'select'];
        for (const selector of inputSelectors) {
            const elements = allElements.filter(el => el.tagName.toLowerCase() === selector);
            for (const element of elements) {
                const type = element.attributes.type?.toLowerCase() || element.tagName.toLowerCase();
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
    extractLabels(context) {
        const labels = [];
        if (!context.documentModel?.dom) {
            return labels;
        }
        const allElements = context.documentModel.getAllElements();
        const labelElements = allElements.filter(el => el.tagName.toLowerCase() === 'label');
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
    hasLabelElement(input, inputId, context) {
        if (!context.documentModel?.dom) {
            return { hasLabel: false };
        }
        let parent = input.parent;
        while (parent) {
            if (parent.tagName.toLowerCase() === 'label') {
                return { hasLabel: true, labelElement: parent };
            }
            parent = parent.parent;
        }
        if (inputId) {
            const allElements = context.documentModel.getAllElements();
            const labelElements = allElements.filter(el => el.tagName.toLowerCase() === 'label' && el.attributes.for === inputId);
            if (labelElements.length > 0) {
                return { hasLabel: true, labelElement: labelElements[0] };
            }
        }
        return { hasLabel: false };
    }
    getElementText(element) {
        let text = '';
        for (const child of element.children) {
            if (child.nodeType === 'text') {
                text += child.textContent || '';
            }
            else if (child.nodeType === 'element') {
                text += this.getElementText(child);
            }
        }
        return text.trim();
    }
    isElementHidden(element, context) {
        if (element.attributes.type === 'hidden') {
            return true;
        }
        if (element.attributes['aria-hidden'] === 'true') {
            return true;
        }
        const elementContext = context.documentModel?.getElementContext(element);
        if (elementContext) {
            for (const cssRule of elementContext.cssRules) {
                if (cssRule.property === 'display' && cssRule.value === 'none') {
                    return true;
                }
                if (cssRule.property === 'visibility' && cssRule.value === 'hidden') {
                    return true;
                }
            }
        }
        return false;
    }
    getElementContext(context, element) {
        return context.documentModel?.getElementContext(element);
    }
    getElementHTML(element) {
        const attrs = Object.entries(element.attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        if (element.children.length === 0) {
            return `<${element.tagName}${attrs ? ' ' + attrs : ''}>`;
        }
        return `<${element.tagName}${attrs ? ' ' + attrs : ''}>...</${element.tagName}>`;
    }
}
exports.FormLabelAnalyzer = FormLabelAnalyzer;
