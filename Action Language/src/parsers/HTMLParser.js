"use strict";
/**
 * HTML Parser for Traditional HTML Files
 *
 * This module parses traditional HTML files (not JSX) and converts them into
 * DOMModel structures for Paradise accessibility analysis.
 *
 * Unlike JSXDOMExtractor which handles React JSX, this parser handles:
 * - Standard HTML5 documents
 * - Legacy HTML documents
 * - HTML fragments
 * - Server-rendered HTML
 * - Static HTML pages
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLParser = void 0;
exports.parseHTML = parseHTML;
var node_html_parser_1 = require("node-html-parser");
var DOMModel_1 = require("../models/DOMModel");
/**
 * HTML Parser
 *
 * Parses traditional HTML documents and converts them to DOMModel.
 */
var HTMLParser = /** @class */ (function () {
    function HTMLParser() {
        this.elementCounter = 0;
        this.sourceFile = '';
    }
    /**
     * Parse HTML source code and return a DOMModel.
     *
     * @param source - HTML source code
     * @param sourceFile - Filename for error reporting
     * @returns DOMModel representing the HTML structure
     *
     * @example
     * ```typescript
     * const parser = new HTMLParser();
     * const domModel = parser.parse(`
     *   <!DOCTYPE html>
     *   <html>
     *     <body>
     *       <button id="submit">Click me</button>
     *     </body>
     *   </html>
     * `, 'index.html');
     * ```
     */
    HTMLParser.prototype.parse = function (source, sourceFile) {
        this.sourceFile = sourceFile;
        this.elementCounter = 0;
        // Parse HTML with node-html-parser
        var root = (0, node_html_parser_1.parse)(source, {
            comment: true,
            blockTextElements: {
                script: true,
                style: true,
            },
        });
        // Convert to DOMElement tree
        var domRoot = this.convertNode(root);
        return new DOMModel_1.DOMModelImpl(domRoot, sourceFile);
    };
    /**
     * Convert a node-html-parser node to a DOMElement.
     */
    HTMLParser.prototype.convertNode = function (node, parent) {
        // Handle element nodes
        if (node.nodeType === node_html_parser_1.NodeType.ELEMENT_NODE) {
            return this.convertElement(node, parent);
        }
        // Handle text nodes
        if (node.nodeType === node_html_parser_1.NodeType.TEXT_NODE) {
            return this.convertTextNode(node, parent);
        }
        // Handle comment nodes
        if (node.nodeType === node_html_parser_1.NodeType.COMMENT_NODE) {
            return this.convertCommentNode(node, parent);
        }
        // Fallback: create an unknown element
        return {
            id: this.generateId(),
            nodeType: 'element',
            tagName: 'unknown',
            attributes: {},
            children: [],
            parent: parent,
            location: this.createLocation(0, 0),
            metadata: {
                originalNodeType: node.nodeType,
            },
        };
    };
    /**
     * Convert an element node to a DOMElement.
     */
    HTMLParser.prototype.convertElement = function (node, parent) {
        var tagName = node.rawTagName || 'div';
        var attributes = this.extractAttributes(node);
        var element = {
            id: this.generateId(),
            nodeType: 'element',
            tagName: tagName.toLowerCase(),
            attributes: attributes,
            children: [],
            parent: parent,
            location: this.createLocation(0, 0), // node-html-parser doesn't provide line numbers by default
            metadata: {
                rawHTML: node.toString().substring(0, 200), // First 200 chars for debugging
            },
        };
        // Convert child nodes
        var childNodes = node.childNodes || [];
        for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
            var child = childNodes_1[_i];
            var childElement = this.convertNode(child, element);
            // Only add non-empty text nodes
            if (childElement.nodeType !== 'text' || (childElement.textContent && childElement.textContent.trim())) {
                element.children.push(childElement);
            }
        }
        return element;
    };
    /**
     * Convert a text node to a DOMElement.
     */
    HTMLParser.prototype.convertTextNode = function (node, parent) {
        var text = node.text || '';
        return {
            id: this.generateId(),
            nodeType: 'text',
            tagName: '#text',
            attributes: {},
            children: [],
            parent: parent,
            textContent: text,
            location: this.createLocation(0, 0),
            metadata: {},
        };
    };
    /**
     * Convert a comment node to a DOMElement.
     */
    HTMLParser.prototype.convertCommentNode = function (node, parent) {
        return {
            id: this.generateId(),
            nodeType: 'comment',
            tagName: '#comment',
            attributes: {},
            children: [],
            parent: parent,
            textContent: node.text || '',
            location: this.createLocation(0, 0),
            metadata: {},
        };
    };
    /**
     * Extract attributes from an HTML element.
     */
    HTMLParser.prototype.extractAttributes = function (node) {
        var attrs = {};
        // node-html-parser provides attributes as an object
        var rawAttrs = node.attributes || {};
        for (var _i = 0, _a = Object.entries(rawAttrs); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], value = _b[1];
            // Normalize attribute names to lowercase
            var normalizedName = name_1.toLowerCase();
            // Store the attribute value
            attrs[normalizedName] = value || 'true'; // Boolean attributes
        }
        // Also extract id and class if available
        if (node.id) {
            attrs['id'] = node.id;
        }
        if (node.classList && node.classList.length > 0) {
            attrs['class'] = node.classList.toString();
        }
        return attrs;
    };
    /**
     * Create a source location object.
     */
    HTMLParser.prototype.createLocation = function (line, column) {
        return {
            file: this.sourceFile,
            line: line,
            column: column,
        };
    };
    /**
     * Generate a unique ID for an element.
     */
    HTMLParser.prototype.generateId = function () {
        return "dom_".concat(++this.elementCounter);
    };
    return HTMLParser;
}());
exports.HTMLParser = HTMLParser;
/**
 * Parse HTML source and return a DOMModel.
 *
 * @param source - HTML source code
 * @param sourceFile - Filename for error reporting
 * @returns DOMModel representing the HTML structure
 *
 * @example
 * ```typescript
 * const domModel = parseHTML(`
 *   <div class="container">
 *     <button id="submit">Click me</button>
 *   </div>
 * `, 'page.html');
 *
 * const button = domModel.getElementById('submit');
 * ```
 */
function parseHTML(source, sourceFile) {
    var parser = new HTMLParser();
    return parser.parse(source, sourceFile);
}
//# sourceMappingURL=HTMLParser.js.map