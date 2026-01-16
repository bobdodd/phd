"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLParser = void 0;
exports.parseHTML = parseHTML;
const node_html_parser_1 = require("node-html-parser");
const DOMModel_1 = require("../models/DOMModel");
class HTMLParser {
    constructor() {
        this.elementCounter = 0;
        this.sourceFile = '';
    }
    parse(source, sourceFile) {
        this.sourceFile = sourceFile;
        this.elementCounter = 0;
        const root = (0, node_html_parser_1.parse)(source, {
            comment: true,
            blockTextElements: {
                script: true,
                style: true,
            },
        });
        const domRoot = this.convertNode(root);
        return new DOMModel_1.DOMModelImpl(domRoot, sourceFile);
    }
    convertNode(node, parent) {
        if (node.nodeType === node_html_parser_1.NodeType.ELEMENT_NODE) {
            return this.convertElement(node, parent);
        }
        if (node.nodeType === node_html_parser_1.NodeType.TEXT_NODE) {
            return this.convertTextNode(node, parent);
        }
        if (node.nodeType === node_html_parser_1.NodeType.COMMENT_NODE) {
            return this.convertCommentNode(node, parent);
        }
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
            location: this.createLocation(0, 0),
            metadata: {
                rawHTML: node.toString().substring(0, 200),
            },
        };
        const childNodes = node.childNodes || [];
        for (const child of childNodes) {
            const childElement = this.convertNode(child, element);
            if (childElement.nodeType !== 'text' || (childElement.textContent && childElement.textContent.trim())) {
                element.children.push(childElement);
            }
        }
        return element;
    }
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
    extractAttributes(node) {
        const attrs = {};
        const rawAttrs = node.attributes || {};
        for (const [name, value] of Object.entries(rawAttrs)) {
            const normalizedName = name.toLowerCase();
            attrs[normalizedName] = value || 'true';
        }
        if (node.id) {
            attrs['id'] = node.id;
        }
        if (node.classList && node.classList.length > 0) {
            attrs['class'] = node.classList.toString();
        }
        return attrs;
    }
    createLocation(line, column) {
        return {
            file: this.sourceFile,
            line,
            column,
        };
    }
    generateId() {
        return `dom_${++this.elementCounter}`;
    }
}
exports.HTMLParser = HTMLParser;
function parseHTML(source, sourceFile) {
    const parser = new HTMLParser();
    return parser.parse(source, sourceFile);
}
//# sourceMappingURL=HTMLParser.js.map