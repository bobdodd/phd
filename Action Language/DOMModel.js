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
var DOMModelImpl = /** @class */ (function () {
    function DOMModelImpl(root, sourceFile) {
        this.type = 'DOM';
        this.version = '1.0.0';
        this.root = root;
        this.sourceFile = sourceFile;
    }
    /**
     * Parse source code into DOM elements.
     * Note: This is implemented by specific parsers (HTMLParser, JSXParser).
     */
    DOMModelImpl.prototype.parse = function (_source) {
        throw new Error('DOMModelImpl.parse() should not be called directly. Use HTMLParser or JSXParser.');
    };
    /**
     * Validate the DOM structure.
     * Checks for:
     * - Missing required attributes (e.g., alt on img)
     * - Invalid ARIA usage
     * - Accessibility issues at the HTML level
     */
    DOMModelImpl.prototype.validate = function () {
        var _this = this;
        var errors = [];
        var warnings = [];
        // Traverse all elements and validate
        this.traverseElements(this.root, function (element) {
            // Check for images without alt text
            if (element.tagName === 'img' && !element.attributes.alt) {
                warnings.push({
                    message: "Image missing alt attribute",
                    location: element.location,
                    code: 'missing-alt-text',
                });
            }
            // Check for buttons without accessible labels
            if (element.tagName === 'button' && !_this.hasAccessibleLabel(element)) {
                warnings.push({
                    message: "Button missing accessible label",
                    location: element.location,
                    code: 'missing-button-label',
                });
            }
            // Check for invalid ARIA attributes
            var ariaAttrs = Object.keys(element.attributes).filter(function (attr) {
                return attr.startsWith('aria-');
            });
            for (var _i = 0, ariaAttrs_1 = ariaAttrs; _i < ariaAttrs_1.length; _i++) {
                var attr = ariaAttrs_1[_i];
                if (!_this.isValidAriaAttribute(attr)) {
                    errors.push({
                        message: "Invalid ARIA attribute: ".concat(attr),
                        location: element.location,
                        code: 'invalid-aria-attribute',
                    });
                }
            }
        });
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
        };
    };
    /**
     * Serialize the DOM back to HTML/JSX.
     * Used for generating fixed code.
     */
    DOMModelImpl.prototype.serialize = function () {
        return this.serializeElement(this.root);
    };
    DOMModelImpl.prototype.serializeElement = function (element, indent) {
        var _this = this;
        if (indent === void 0) { indent = 0; }
        var indentStr = '  '.repeat(indent);
        // Handle text nodes
        if (element.nodeType === 'text') {
            return element.textContent || '';
        }
        // Handle comments
        if (element.nodeType === 'comment') {
            return "".concat(indentStr, "<!-- ").concat(element.textContent, " -->");
        }
        // Serialize attributes
        var attrs = Object.entries(element.attributes)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "".concat(key, "=\"").concat(value, "\"");
        })
            .join(' ');
        var attrsStr = attrs ? " ".concat(attrs) : '';
        // Self-closing tags
        var selfClosing = ['img', 'input', 'br', 'hr', 'meta', 'link'];
        if (selfClosing.includes(element.tagName.toLowerCase()) && element.children.length === 0) {
            return "".concat(indentStr, "<").concat(element.tagName).concat(attrsStr, " />");
        }
        // Elements with children
        var childrenStr = element.children
            .map(function (child) { return _this.serializeElement(child, indent + 1); })
            .join('\n');
        if (element.children.length === 0) {
            return "".concat(indentStr, "<").concat(element.tagName).concat(attrsStr, "></").concat(element.tagName, ">");
        }
        return "".concat(indentStr, "<").concat(element.tagName).concat(attrsStr, ">\n").concat(childrenStr, "\n").concat(indentStr, "</").concat(element.tagName, ">");
    };
    DOMModelImpl.prototype.getElementById = function (id) {
        return this.findElement(this.root, function (el) { return el.attributes.id === id; });
    };
    DOMModelImpl.prototype.querySelector = function (selector) {
        var elements = this.querySelectorAll(selector);
        return elements.length > 0 ? elements[0] : null;
    };
    DOMModelImpl.prototype.querySelectorAll = function (selector) {
        var _this = this;
        var elements = [];
        this.traverseElements(this.root, function (element) {
            if (_this.matchesSelector(element, selector)) {
                elements.push(element);
            }
        });
        return elements;
    };
    DOMModelImpl.prototype.getAllElements = function () {
        var elements = [];
        this.traverseElements(this.root, function (element) {
            elements.push(element);
        });
        return elements;
    };
    DOMModelImpl.prototype.getFocusableElements = function () {
        var _this = this;
        return this.getAllElements().filter(function (el) { return _this.isFocusable(el); });
    };
    DOMModelImpl.prototype.getInteractiveElements = function () {
        return this.getAllElements().filter(function (el) { return el.jsHandlers && el.jsHandlers.length > 0; });
    };
    /**
     * Check if an element matches a CSS selector.
     * Supports: #id, .class, tag, [attr], [attr="value"]
     */
    DOMModelImpl.prototype.matchesSelector = function (element, selector) {
        // ID selector: #submit
        if (selector.startsWith('#')) {
            var id = selector.slice(1);
            return element.attributes.id === id;
        }
        // Class selector: .nav-item
        if (selector.startsWith('.')) {
            var className = selector.slice(1);
            var classes = (element.attributes.class || '').split(/\s+/);
            return classes.includes(className);
        }
        // Attribute selector: [role="button"], [aria-expanded]
        if (selector.startsWith('[') && selector.endsWith(']')) {
            var attrMatch = selector.slice(1, -1);
            if (attrMatch.includes('=')) {
                var _a = attrMatch.split('='), attr = _a[0], valueWithQuotes = _a[1];
                var value = valueWithQuotes.replace(/["']/g, '');
                return element.attributes[attr] === value;
            }
            else {
                return attrMatch in element.attributes;
            }
        }
        // Tag selector: button, div, input
        return element.tagName.toLowerCase() === selector.toLowerCase();
    };
    /**
     * Check if an element is focusable.
     */
    DOMModelImpl.prototype.isFocusable = function (element) {
        // Check explicit tabindex
        if (element.attributes.tabindex !== undefined) {
            var tabIndex = parseInt(element.attributes.tabindex);
            return tabIndex >= 0;
        }
        // Naturally focusable elements
        var focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
        return focusableTags.includes(element.tagName.toLowerCase());
    };
    /**
     * Check if an element has an accessible label.
     */
    DOMModelImpl.prototype.hasAccessibleLabel = function (element) {
        // Check aria-label
        if (element.attributes['aria-label'])
            return true;
        // Check aria-labelledby
        if (element.attributes['aria-labelledby'])
            return true;
        // Check text content
        var hasTextContent = element.children.some(function (child) { var _a; return child.nodeType === 'text' && ((_a = child.textContent) === null || _a === void 0 ? void 0 : _a.trim()); });
        if (hasTextContent)
            return true;
        return false;
    };
    /**
     * Check if an ARIA attribute name is valid.
     */
    DOMModelImpl.prototype.isValidAriaAttribute = function (attr) {
        var validAriaAttrs = [
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
    };
    /**
     * Traverse all elements in the DOM tree (depth-first).
     */
    DOMModelImpl.prototype.traverseElements = function (element, callback) {
        callback(element);
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.traverseElements(child, callback);
        }
    };
    /**
     * Find the first element matching a predicate.
     */
    DOMModelImpl.prototype.findElement = function (element, predicate) {
        if (predicate(element))
            return element;
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var found = this.findElement(child, predicate);
            if (found)
                return found;
        }
        return null;
    };
    return DOMModelImpl;
}());
exports.DOMModelImpl = DOMModelImpl;
//# sourceMappingURL=DOMModel.js.map