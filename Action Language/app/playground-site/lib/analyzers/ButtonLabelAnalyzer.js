"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonLabelAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class ButtonLabelAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'ButtonLabelAnalyzer';
        this.description = 'Detects buttons without accessible labels or proper labeling';
    }
    analyze(context) {
        const issues = [];
        if (!context.documentModel || !context.documentModel.dom) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const buttonElements = this.findButtonElements(allElements);
        for (const button of buttonElements) {
            this.checkButtonLabel(button, allElements, context, issues);
        }
        return issues;
    }
    findButtonElements(elements) {
        return elements.filter(el => {
            if (el.tagName === 'button') {
                return true;
            }
            if (el.tagName === 'input') {
                const type = el.attributes.type?.toLowerCase();
                return type === 'button' || type === 'submit' || type === 'reset' || type === 'image';
            }
            if (el.attributes.role === 'button') {
                return true;
            }
            return false;
        });
    }
    checkButtonLabel(button, allElements, context, issues) {
        const accessibleName = this.getAccessibleName(button, allElements);
        if (!accessibleName || accessibleName.trim().length === 0) {
            this.reportEmptyButton(button, context, issues);
            return;
        }
        if (this.isIconOnlyButton(button, allElements)) {
            this.checkIconOnlyButtonLabel(button, context, issues);
        }
        this.checkNestedInteractiveElements(button, allElements, context, issues);
        if (button.tagName === 'input' && button.attributes.type === 'image') {
            this.checkImageButtonAltText(button, context, issues);
        }
    }
    getAccessibleName(button, allElements) {
        if (button.attributes['aria-labelledby']) {
            const ids = button.attributes['aria-labelledby'].split(/\s+/);
            const labelTexts = ids.map(id => {
                const labelElement = allElements.find(el => el.attributes.id === id);
                return labelElement ? this.getTextContent(labelElement, allElements) : '';
            });
            const combined = labelTexts.join(' ').trim();
            if (combined)
                return combined;
        }
        if (button.attributes['aria-label']) {
            return button.attributes['aria-label'].trim();
        }
        if (button.tagName === 'input') {
            if (button.attributes.value) {
                return button.attributes.value.trim();
            }
            if (button.attributes.type === 'submit')
                return 'Submit';
            if (button.attributes.type === 'reset')
                return 'Reset';
        }
        if (button.tagName === 'button') {
            const textContent = this.getTextContent(button, allElements);
            if (textContent.trim())
                return textContent.trim();
        }
        if (button.attributes.title) {
            return button.attributes.title.trim();
        }
        return '';
    }
    getTextContent(element, allElements) {
        let text = '';
        if (element.textContent) {
            text += element.textContent;
        }
        const children = this.getChildElements(element, allElements);
        for (const child of children) {
            if (this.isHidden(child))
                continue;
            if (child.tagName === 'img') {
                if (child.attributes.alt) {
                    text += ' ' + child.attributes.alt;
                }
                continue;
            }
            text += ' ' + this.getTextContent(child, allElements);
        }
        return text.trim();
    }
    getChildElements(parent, allElements) {
        return allElements.filter(el => el.parent === parent);
    }
    isHidden(element) {
        if (element.attributes['aria-hidden'] === 'true') {
            return true;
        }
        const style = element.attributes.style || '';
        if (style.includes('display: none') ||
            style.includes('display:none') ||
            style.includes('visibility: hidden') ||
            style.includes('visibility:hidden')) {
            return true;
        }
        return false;
    }
    isIconOnlyButton(button, allElements) {
        const textContent = this.getTextContent(button, allElements);
        if (textContent.trim().length > 0) {
            return false;
        }
        const children = this.getChildElements(button, allElements);
        for (const child of children) {
            if (child.tagName === 'img') {
                return true;
            }
            if (child.tagName === 'svg') {
                return true;
            }
            const className = child.attributes.class || '';
            if (/icon/i.test(className) ||
                /fa-/i.test(className) ||
                /material-icons/i.test(className) ||
                /glyphicon/i.test(className)) {
                return true;
            }
            if (child.tagName === 'i') {
                return true;
            }
        }
        return false;
    }
    reportEmptyButton(button, context, issues) {
        const buttonType = button.tagName === 'input'
            ? `input type="${button.attributes.type}"`
            : button.tagName;
        issues.push(this.createIssue('button-empty-label', 'error', `Button has no accessible label. Add text content, aria-label, or aria-labelledby to describe the button's purpose.`, button.location, ['4.1.2'], context, {
            elementContext: context.documentModel?.getElementContext(button),
            fix: {
                description: `Add an accessible label to the ${buttonType} button using one of these methods:
1. Add text content: <button>Click me</button>
2. Add aria-label: <button aria-label="Submit form">...</button>
3. Add aria-labelledby: <button aria-labelledby="label-id">...</button>
4. For input buttons: <input type="button" value="Click me">`,
                code: this.generateButtonLabelFix(button),
                location: button.location
            }
        }));
    }
    checkIconOnlyButtonLabel(button, context, issues) {
        if (!button.attributes['aria-label'] && !button.attributes['aria-labelledby']) {
            issues.push(this.createIssue('button-icon-no-label', 'error', `Icon-only button has no accessible label. Screen reader users cannot determine the button's purpose. Add aria-label or aria-labelledby.`, button.location, ['4.1.2'], context, {
                elementContext: context.documentModel?.getElementContext(button),
                fix: {
                    description: `Add aria-label to describe the icon button's purpose:
Example: <button aria-label="Close dialog"><i class="icon-close"></i></button>`,
                    code: this.generateIconButtonLabelFix(button),
                    location: button.location
                }
            }));
        }
    }
    checkNestedInteractiveElements(button, allElements, context, issues) {
        const children = this.getChildElements(button, allElements);
        const nestedInteractive = [];
        for (const child of children) {
            if (this.isInteractiveElement(child)) {
                nestedInteractive.push(child);
            }
            const grandchildren = this.getChildElements(child, allElements);
            for (const grandchild of grandchildren) {
                if (this.isInteractiveElement(grandchild)) {
                    nestedInteractive.push(grandchild);
                }
            }
        }
        if (nestedInteractive.length > 0) {
            const nestedTags = nestedInteractive.map(el => el.tagName).join(', ');
            issues.push(this.createIssue('button-nested-interactive', 'error', `Button contains nested interactive elements (${nestedTags}). This creates confusing keyboard navigation and ambiguous activation behavior. Remove nested interactive elements.`, button.location, ['4.1.2'], context, {
                elementContext: context.documentModel?.getElementContext(button),
                fix: {
                    description: `Remove or replace nested interactive elements with non-interactive alternatives:
- Replace nested buttons with <span> elements
- Move nested links outside the button
- Use CSS for styling instead of interactive elements`,
                    code: `<!-- Instead of nested interactive elements, structure it properly -->
<!-- BAD: -->
<!-- <button>Submit <a href="#">Learn more</a></button> -->

<!-- GOOD: -->
<!-- <button>Submit</button> <a href="#">Learn more</a> -->`,
                    location: button.location
                }
            }));
        }
    }
    isInteractiveElement(element) {
        const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
        if (interactiveTags.includes(element.tagName)) {
            return true;
        }
        const interactiveRoles = [
            'button', 'link', 'checkbox', 'radio', 'switch',
            'slider', 'spinbutton', 'tab', 'menuitem', 'option'
        ];
        if (element.attributes.role && interactiveRoles.includes(element.attributes.role)) {
            return true;
        }
        return false;
    }
    checkImageButtonAltText(button, context, issues) {
        if (!button.attributes.alt || button.attributes.alt.trim().length === 0) {
            issues.push(this.createIssue('button-image-no-alt', 'error', `Image button has no alt text. Add alt attribute to describe the button's purpose.`, button.location, ['4.1.2', '1.1.1'], context, {
                elementContext: context.documentModel?.getElementContext(button),
                fix: {
                    description: `Add alt attribute to the image button:
Example: <input type="image" src="submit.png" alt="Submit form">`,
                    code: `<input type="image" src="${button.attributes.src || 'image.png'}" alt="[Describe button purpose]">`,
                    location: button.location
                }
            }));
        }
    }
    generateButtonLabelFix(button) {
        if (button.tagName === 'input') {
            const type = button.attributes.type || 'button';
            return `<input type="${type}" value="[Button label]" ${this.getOtherAttributes(button)}>`;
        }
        return `<button aria-label="[Describe button purpose]" ${this.getOtherAttributes(button)}>\n  [Button content]\n</button>`;
    }
    generateIconButtonLabelFix(button) {
        if (button.tagName === 'input') {
            const type = button.attributes.type || 'button';
            return `<input type="${type}" aria-label="[Describe icon button purpose]" ${this.getOtherAttributes(button)}>`;
        }
        return `<button aria-label="[Describe icon button purpose]" ${this.getOtherAttributes(button)}>\n  <!-- Icon content -->\n</button>`;
    }
    getOtherAttributes(element) {
        const excludeAttrs = ['aria-label', 'aria-labelledby', 'value', 'alt'];
        const attrs = [];
        for (const [key, value] of Object.entries(element.attributes)) {
            if (!excludeAttrs.includes(key) && key !== 'type') {
                attrs.push(`${key}="${value}"`);
            }
        }
        return attrs.join(' ');
    }
}
exports.ButtonLabelAnalyzer = ButtonLabelAnalyzer;
