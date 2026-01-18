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
        this.sourceContent = '';
        this.lineStarts = [];
        this.tagLocationMap = new Map();
    }
    parse(source, sourceFile) {
        this.sourceFile = sourceFile;
        this.sourceContent = source;
        this.elementCounter = 0;
        this.buildLineStarts(source);
        this.buildTagLocationMap(source);
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
    buildLineStarts(source) {
        this.lineStarts = [0];
        for (let i = 0; i < source.length; i++) {
            if (source[i] === '\n') {
                this.lineStarts.push(i + 1);
            }
        }
    }
    buildTagLocationMap(source) {
        const tagRegex = /<(\w+)([^>]*)>/g;
        let match;
        while ((match = tagRegex.exec(source)) !== null) {
            const tagName = match[1].toLowerCase();
            const attributes = match[2];
            const offset = match.index + 1;
            const idMatch = attributes.match(/\bid\s*=\s*["']([^"']+)["']/);
            const id = idMatch ? idMatch[1] : null;
            const location = this.offsetToLineColumn(offset);
            const key = id ? `${tagName}#${id}` : `${tagName}@${offset}`;
            this.tagLocationMap.set(key, location);
        }
    }
    offsetToLineColumn(offset) {
        let left = 0;
        let right = this.lineStarts.length - 1;
        while (left < right) {
            const mid = Math.floor((left + right + 1) / 2);
            if (this.lineStarts[mid] <= offset) {
                left = mid;
            }
            else {
                right = mid - 1;
            }
        }
        const line = left + 1;
        const column = offset - this.lineStarts[left];
        return { line, column };
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
    findElementLocation(tagName, attributes, node) {
        const nodeWithRange = node;
        if (nodeWithRange.range && Array.isArray(nodeWithRange.range) &&
            nodeWithRange.range.length >= 2 && nodeWithRange.range[0] > 0) {
            const startOffset = nodeWithRange.range[0];
            const searchStart = Math.max(0, startOffset - 200);
            const searchRegion = this.sourceContent.substring(searchStart, startOffset + 50);
            const classAttr = attributes.class;
            let pattern;
            if (classAttr) {
                pattern = new RegExp(`<${tagName}[^>]*class\\s*=\\s*["'][^"']*${classAttr.split(' ')[0]}[^"']*["'][^>]*>`, 'gi');
            }
            else {
                pattern = new RegExp(`<${tagName}(?:\\s|>)`, 'gi');
            }
            const match = pattern.exec(searchRegion);
            if (match) {
                const tagOffset = searchStart + match.index + 1;
                return this.offsetToLineColumn(tagOffset);
            }
        }
        for (const [key, loc] of this.tagLocationMap.entries()) {
            if (key.startsWith(`${tagName}@`)) {
                return loc;
            }
        }
        return null;
    }
    convertElement(node, parent) {
        const tagName = node.rawTagName || 'div';
        const attributes = this.extractAttributes(node);
        let location;
        const tagNameLower = tagName.toLowerCase();
        const id = attributes.id;
        const key = id ? `${tagNameLower}#${id}` : null;
        const mapLocation = key ? this.tagLocationMap.get(key) : null;
        if (mapLocation) {
            location = this.createLocation(mapLocation.line, mapLocation.column, tagName.length);
        }
        else {
            const foundLocation = this.findElementLocation(tagNameLower, attributes, node);
            if (foundLocation) {
                location = this.createLocation(foundLocation.line, foundLocation.column, tagName.length);
            }
            else {
                location = this.createLocation(1, 0);
            }
        }
        const element = {
            id: this.generateId(),
            nodeType: 'element',
            tagName: tagName.toLowerCase(),
            attributes,
            children: [],
            parent,
            location,
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
    createLocation(line, column, length) {
        return {
            file: this.sourceFile,
            line,
            column,
            length,
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