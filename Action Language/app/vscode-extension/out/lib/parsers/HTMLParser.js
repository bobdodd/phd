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
const node_html_parser_1 = require("node-html-parser");
const DOMModel_1 = require("../models/DOMModel");
/**
 * HTML Parser
 *
 * Parses traditional HTML documents and converts them to DOMModel.
 */
class HTMLParser {
    constructor() {
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
    parse(source, sourceFile) {
        this.sourceFile = sourceFile;
        this.elementCounter = 0;
        // Parse HTML with node-html-parser
        const root = (0, node_html_parser_1.parse)(source, {
            comment: true,
            blockTextElements: {
                script: true,
                style: true,
            },
        });
        // Convert to DOMElement tree
        const domRoot = this.convertNode(root);
        return new DOMModel_1.DOMModelImpl(domRoot, sourceFile);
    }
    /**
     * Convert a node-html-parser node to a DOMElement.
     */
    convertNode(node, parent) {
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
            parent,
            location: this.createLocation(0, 0),
            metadata: {
                originalNodeType: node.nodeType,
            },
        };
    }
    /**
     * Convert an element node to a DOMElement.
     */
    convertElement(node, parent) {
        const tagName = node.rawTagName || 'div';
        const attributes = this.extractAttributes(node);
        const element = {
            id: this.generateId(),
            nodeType: 'element',
            tagName: tagName.toLowerCase(),
            attributes,
            children: [],
            parent,
            location: this.createLocation(0, 0), // node-html-parser doesn't provide line numbers by default
            metadata: {
                rawHTML: node.toString().substring(0, 200), // First 200 chars for debugging
            },
        };
        // Convert child nodes
        const childNodes = node.childNodes || [];
        for (const child of childNodes) {
            const childElement = this.convertNode(child, element);
            // Only add non-empty text nodes
            if (childElement.nodeType !== 'text' || (childElement.textContent && childElement.textContent.trim())) {
                element.children.push(childElement);
            }
        }
        return element;
    }
    /**
     * Convert a text node to a DOMElement.
     */
    convertTextNode(node, parent) {
        const text = node.text || '';
        return {
            id: this.generateId(),
            nodeType: 'text',
            tagName: '#text',
            attributes: {},
            children: [],
            parent,
            textContent: text,
            location: this.createLocation(0, 0),
            metadata: {},
        };
    }
    /**
     * Convert a comment node to a DOMElement.
     */
    convertCommentNode(node, parent) {
        return {
            id: this.generateId(),
            nodeType: 'comment',
            tagName: '#comment',
            attributes: {},
            children: [],
            parent,
            textContent: node.text || '',
            location: this.createLocation(0, 0),
            metadata: {},
        };
    }
    /**
     * Extract attributes from an HTML element.
     */
    extractAttributes(node) {
        const attrs = {};
        // node-html-parser provides attributes as an object
        const rawAttrs = node.attributes || {};
        for (const [name, value] of Object.entries(rawAttrs)) {
            // Normalize attribute names to lowercase
            const normalizedName = name.toLowerCase();
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
    }
    /**
     * Create a source location object.
     */
    createLocation(line, column) {
        return {
            file: this.sourceFile,
            line,
            column,
        };
    }
    /**
     * Generate a unique ID for an element.
     */
    generateId() {
        return `dom_${++this.elementCounter}`;
    }
}
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
    const parser = new HTMLParser();
    return parser.parse(source, sourceFile);
}
//# sourceMappingURL=HTMLParser.js.map