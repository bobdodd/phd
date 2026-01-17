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
        console.log(`[HTMLParser] parse() called for ${sourceFile.split('/').pop()}, source length: ${source.length}`);
        this.sourceFile = sourceFile;
        this.sourceContent = source;
        this.elementCounter = 0;
        this.buildLineStarts(source);
        console.log(`[HTMLParser] Built ${this.lineStarts.length} line starts`);
        this.buildTagLocationMap(source);
        console.log(`[HTMLParser] Built tag location map with ${this.tagLocationMap.size} entries`);
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
    convertElement(node, parent) {
        const tagName = node.rawTagName || 'div';
        const attributes = this.extractAttributes(node);
        let location;
        const nodeWithRange = node;
        if (tagName === 'button') {
            const descriptor = Object.getOwnPropertyDescriptor(nodeWithRange, 'range');
            console.log(`[HTMLParser] Button element:`, {
                hasRange: !!nodeWithRange.range,
                range: nodeWithRange.range,
                rangeDescriptor: descriptor,
                lineStartsLength: this.lineStarts.length,
                sourceContentLength: this.sourceContent.length
            });
        }
        if (nodeWithRange.range && Array.isArray(nodeWithRange.range) && nodeWithRange.range.length >= 2 && nodeWithRange.range[0] >= 0) {
            const startOffset = nodeWithRange.range[0];
            const tagStartMatch = this.sourceContent.substring(startOffset, startOffset + 100).match(/<(\w+)/);
            const tagNameStart = tagStartMatch ? startOffset + tagStartMatch.index + 1 : startOffset;
            const tagLocation = this.offsetToLineColumn(tagNameStart);
            location = this.createLocation(tagLocation.line, tagLocation.column, tagName.length);
            if (tagName === 'button') {
                console.log(`[HTMLParser] Button at offset ${startOffset}: line ${tagLocation.line}, column ${tagLocation.column}`);
            }
        }
        else {
            const id = attributes.id;
            const key = id ? `${tagName}#${id}` : null;
            const mapLocation = key ? this.tagLocationMap.get(key) : null;
            if (mapLocation) {
                location = this.createLocation(mapLocation.line, mapLocation.column, tagName.length);
                console.log(`[HTMLParser] Using map location for ${tagName}${id ? '#' + id : ''}: line ${mapLocation.line}, column ${mapLocation.column}`);
            }
            else {
                console.log(`[HTMLParser] No location found for ${tagName}${id ? '#' + id : ''}, using fallback (1, 0)`);
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