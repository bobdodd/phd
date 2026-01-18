"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMModelImpl = void 0;
class DOMModelImpl {
    constructor(root, sourceFile) {
        this.type = 'DOM';
        this.version = '1.0.0';
        this.root = root;
        this.sourceFile = sourceFile;
    }
    parse(_source) {
        throw new Error('DOMModelImpl.parse() should not be called directly. Use HTMLParser or JSXParser.');
    }
    validate() {
        const errors = [];
        const warnings = [];
        this.traverseElements(this.root, (element) => {
            if (element.tagName === 'img' && !element.attributes.alt) {
                warnings.push({
                    message: `Image missing alt attribute`,
                    location: element.location,
                    code: 'missing-alt-text',
                });
            }
            if (element.tagName === 'button' && !this.hasAccessibleLabel(element)) {
                warnings.push({
                    message: `Button missing accessible label`,
                    location: element.location,
                    code: 'missing-button-label',
                });
            }
            const ariaAttrs = Object.keys(element.attributes).filter((attr) => attr.startsWith('aria-'));
            for (const attr of ariaAttrs) {
                if (!this.isValidAriaAttribute(attr)) {
                    errors.push({
                        message: `Invalid ARIA attribute: ${attr}`,
                        location: element.location,
                        code: 'invalid-aria-attribute',
                    });
                }
            }
        });
        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
    serialize() {
        return this.serializeElement(this.root);
    }
    serializeElement(element, indent = 0) {
        const indentStr = '  '.repeat(indent);
        if (element.nodeType === 'text') {
            return element.textContent || '';
        }
        if (element.nodeType === 'comment') {
            return `${indentStr}<!-- ${element.textContent} -->`;
        }
        const attrs = Object.entries(element.attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        const attrsStr = attrs ? ` ${attrs}` : '';
        const selfClosing = ['img', 'input', 'br', 'hr', 'meta', 'link'];
        if (selfClosing.includes(element.tagName.toLowerCase()) && element.children.length === 0) {
            return `${indentStr}<${element.tagName}${attrsStr} />`;
        }
        const childrenStr = element.children
            .map((child) => this.serializeElement(child, indent + 1))
            .join('\n');
        if (element.children.length === 0) {
            return `${indentStr}<${element.tagName}${attrsStr}></${element.tagName}>`;
        }
        return `${indentStr}<${element.tagName}${attrsStr}>\n${childrenStr}\n${indentStr}</${element.tagName}>`;
    }
    getElementById(id) {
        return this.findElement(this.root, (el) => el.attributes.id === id);
    }
    querySelector(selector) {
        const elements = this.querySelectorAll(selector);
        return elements.length > 0 ? elements[0] : null;
    }
    querySelectorAll(selector) {
        const elements = [];
        this.traverseElements(this.root, (element) => {
            if (this.matchesSelector(element, selector)) {
                elements.push(element);
            }
        });
        return elements;
    }
    getAllElements() {
        const elements = [];
        this.traverseElements(this.root, (element) => {
            elements.push(element);
        });
        return elements;
    }
    getFocusableElements() {
        return this.getAllElements().filter((el) => this.isFocusable(el));
    }
    getInteractiveElements() {
        return this.getAllElements().filter((el) => el.jsHandlers && el.jsHandlers.length > 0);
    }
    matchesSelector(element, selector) {
        if (selector.startsWith('#')) {
            const id = selector.slice(1);
            return element.attributes.id === id;
        }
        if (selector.startsWith('.')) {
            const className = selector.slice(1);
            const classes = (element.attributes.class || '').split(/\s+/);
            return classes.includes(className);
        }
        if (selector.startsWith('[') && selector.endsWith(']')) {
            const attrMatch = selector.slice(1, -1);
            if (attrMatch.includes('=')) {
                const [attr, valueWithQuotes] = attrMatch.split('=');
                const value = valueWithQuotes.replace(/["']/g, '');
                return element.attributes[attr] === value;
            }
            else {
                return attrMatch in element.attributes;
            }
        }
        return element.tagName.toLowerCase() === selector.toLowerCase();
    }
    isFocusable(element) {
        if (element.attributes.tabindex !== undefined) {
            const tabIndex = parseInt(element.attributes.tabindex);
            return tabIndex >= 0;
        }
        const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
        return focusableTags.includes(element.tagName.toLowerCase());
    }
    hasAccessibleLabel(element) {
        if (element.attributes['aria-label'])
            return true;
        if (element.attributes['aria-labelledby'])
            return true;
        const hasTextContent = element.children.some((child) => child.nodeType === 'text' && child.textContent?.trim());
        if (hasTextContent)
            return true;
        return false;
    }
    isValidAriaAttribute(attr) {
        const validAriaAttrs = [
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
            'aria-expanded',
            'aria-hidden',
            'aria-live',
            'aria-controls',
            'aria-haspopup',
            'aria-selected',
            'aria-checked',
            'aria-disabled',
            'aria-readonly',
            'aria-required',
            'aria-invalid',
            'aria-multiselectable',
            'aria-orientation',
            'aria-valuemin',
            'aria-valuemax',
            'aria-valuenow',
            'aria-valuetext',
            'aria-pressed',
            'aria-modal',
            'aria-current',
            'aria-atomic',
            'aria-relevant',
            'aria-busy',
        ];
        return validAriaAttrs.includes(attr);
    }
    traverseElements(element, callback) {
        callback(element);
        for (const child of element.children) {
            this.traverseElements(child, callback);
        }
    }
    findElement(element, predicate) {
        if (predicate(element))
            return element;
        for (const child of element.children) {
            const found = this.findElement(child, predicate);
            if (found)
                return found;
        }
        return null;
    }
}
exports.DOMModelImpl = DOMModelImpl;
