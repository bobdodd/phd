"use strict";
/**
 * DOM Model for Paradise Multi-Model Architecture
 *
 * This file defines the DOMModel interface and implementation for representing
 * HTML/XML/JSX structure in Paradise. The DOMModel can be extracted from:
 * - Static HTML files (traditional web apps)
 * - JSX components (React, Next.js, Gatsby)
 * - Vue SFC templates (future)
 * - Angular templates (future)
 *
 * The DOMModel serves as the integration point where JavaScript behaviors
 * (ActionLanguage) and CSS rules are attached to elements for comprehensive
 * accessibility analysis.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMModelImpl = void 0;
/**
 * Concrete implementation of DOMModel.
 */
class DOMModelImpl {
    constructor(root, sourceFile) {
        this.type = 'DOM';
        this.version = '1.0.0';
        this.root = root;
        this.sourceFile = sourceFile;
    }
    /**
     * Parse source code into DOM elements.
     * Note: This is implemented by specific parsers (HTMLParser, JSXParser).
     */
    parse(_source) {
        throw new Error('DOMModelImpl.parse() should not be called directly. Use HTMLParser or JSXParser.');
    }
    /**
     * Validate the DOM structure.
     * Checks for:
     * - Missing required attributes (e.g., alt on img)
     * - Invalid ARIA usage
     * - Accessibility issues at the HTML level
     */
    validate() {
        const errors = [];
        const warnings = [];
        // Traverse all elements and validate
        this.traverseElements(this.root, (element) => {
            // Check for images without alt text
            if (element.tagName === 'img' && !element.attributes.alt) {
                warnings.push({
                    message: `Image missing alt attribute`,
                    location: element.location,
                    code: 'missing-alt-text',
                });
            }
            // Check for buttons without accessible labels
            if (element.tagName === 'button' && !this.hasAccessibleLabel(element)) {
                warnings.push({
                    message: `Button missing accessible label`,
                    location: element.location,
                    code: 'missing-button-label',
                });
            }
            // Check for invalid ARIA attributes
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
    /**
     * Serialize the DOM back to HTML/JSX.
     * Used for generating fixed code.
     */
    serialize() {
        return this.serializeElement(this.root);
    }
    serializeElement(element, indent = 0) {
        const indentStr = '  '.repeat(indent);
        // Handle text nodes
        if (element.nodeType === 'text') {
            return element.textContent || '';
        }
        // Handle comments
        if (element.nodeType === 'comment') {
            return `${indentStr}<!-- ${element.textContent} -->`;
        }
        // Serialize attributes
        const attrs = Object.entries(element.attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        const attrsStr = attrs ? ` ${attrs}` : '';
        // Self-closing tags
        const selfClosing = ['img', 'input', 'br', 'hr', 'meta', 'link'];
        if (selfClosing.includes(element.tagName.toLowerCase()) && element.children.length === 0) {
            return `${indentStr}<${element.tagName}${attrsStr} />`;
        }
        // Elements with children
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
    /**
     * Check if an element matches a CSS selector.
     * Supports: #id, .class, tag, [attr], [attr="value"]
     */
    matchesSelector(element, selector) {
        // ID selector: #submit
        if (selector.startsWith('#')) {
            const id = selector.slice(1);
            return element.attributes.id === id;
        }
        // Class selector: .nav-item
        if (selector.startsWith('.')) {
            const className = selector.slice(1);
            const classes = (element.attributes.class || '').split(/\s+/);
            return classes.includes(className);
        }
        // Attribute selector: [role="button"], [aria-expanded]
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
        // Tag selector: button, div, input
        return element.tagName.toLowerCase() === selector.toLowerCase();
    }
    /**
     * Check if an element is focusable.
     */
    isFocusable(element) {
        // Check explicit tabindex
        if (element.attributes.tabindex !== undefined) {
            const tabIndex = parseInt(element.attributes.tabindex);
            return tabIndex >= 0;
        }
        // Naturally focusable elements
        const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
        return focusableTags.includes(element.tagName.toLowerCase());
    }
    /**
     * Check if an element has an accessible label.
     */
    hasAccessibleLabel(element) {
        // Check aria-label
        if (element.attributes['aria-label'])
            return true;
        // Check aria-labelledby
        if (element.attributes['aria-labelledby'])
            return true;
        // Check text content
        const hasTextContent = element.children.some((child) => child.nodeType === 'text' && child.textContent?.trim());
        if (hasTextContent)
            return true;
        return false;
    }
    /**
     * Check if an ARIA attribute name is valid.
     */
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
    /**
     * Traverse all elements in the DOM tree (depth-first).
     */
    traverseElements(element, callback) {
        callback(element);
        for (const child of element.children) {
            this.traverseElements(child, callback);
        }
    }
    /**
     * Find the first element matching a predicate.
     */
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
