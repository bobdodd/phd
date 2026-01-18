"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularDOMExtractor = void 0;
exports.extractAngularDOM = extractAngularDOM;
const parse5_1 = require("parse5");
const DOMModel_1 = require("../models/DOMModel");
class AngularDOMExtractor {
    constructor() {
        this.elementCounter = 0;
    }
    extract(source, sourceFile) {
        if (!source || typeof source !== 'string') {
            return null;
        }
        const template = this.extractTemplate(source);
        if (!template || !template.trim()) {
            return null;
        }
        try {
            const document = (0, parse5_1.parse)(template, {
                sourceCodeLocationInfo: true,
            });
            const html = document.childNodes.find((node) => node.nodeName === 'html');
            if (!html)
                return null;
            const body = html.childNodes?.find((node) => node.nodeName === 'body');
            if (!body || !body.childNodes || body.childNodes.length === 0) {
                return null;
            }
            const rootElement = this.findFirstElement(body.childNodes);
            if (!rootElement)
                return null;
            const domElement = this.convertElement(rootElement, sourceFile);
            return new DOMModel_1.DOMModelImpl(domElement, sourceFile);
        }
        catch (error) {
            console.error(`Failed to parse Angular template in ${sourceFile}:`, error);
            return null;
        }
    }
    extractTemplate(source) {
        if (!source || typeof source !== 'string') {
            return '';
        }
        if (!source.includes('@Component') && !source.includes('template:')) {
            return source;
        }
        const inlineTemplateMatch = source.match(/template:\s*`([^`]*)`/s);
        if (inlineTemplateMatch) {
            return inlineTemplateMatch[1].trim();
        }
        return '';
    }
    findFirstElement(nodes) {
        for (const node of nodes) {
            if (this.isElement(node)) {
                return node;
            }
        }
        return null;
    }
    convertElement(node, sourceFile, parent) {
        const tagName = node.tagName;
        const attributes = this.extractAttributes(node);
        const angularMetadata = this.extractAngularMetadata(node);
        const element = {
            id: this.generateId(),
            nodeType: 'element',
            tagName,
            attributes,
            children: [],
            parent,
            location: this.extractLocation(node, sourceFile),
            metadata: angularMetadata,
        };
        if (node.childNodes) {
            for (const child of node.childNodes) {
                if (this.isElement(child)) {
                    const childElement = this.convertElement(child, sourceFile, element);
                    element.children.push(childElement);
                }
                else if (this.isTextNode(child)) {
                    const textElement = this.convertTextNode(child, sourceFile, element);
                    if (textElement) {
                        element.children.push(textElement);
                    }
                }
            }
        }
        return element;
    }
    convertTextNode(node, sourceFile, parent) {
        const text = node.value.trim();
        if (!text)
            return null;
        return {
            id: this.generateId(),
            nodeType: 'text',
            tagName: '#text',
            attributes: {},
            children: [],
            parent,
            textContent: text,
            location: this.extractLocation(node, sourceFile),
            metadata: {},
        };
    }
    extractAttributes(element) {
        const attrs = {};
        if (!element.attrs)
            return attrs;
        for (const attr of element.attrs) {
            attrs[attr.name] = attr.value || 'true';
        }
        return attrs;
    }
    extractAngularMetadata(element) {
        const metadata = {
            bindings: {},
        };
        if (!element.attrs)
            return metadata;
        for (const attr of element.attrs) {
            const name = attr.name;
            if (name.startsWith('(') && name.endsWith(')')) {
                if (!metadata.bindings.events) {
                    metadata.bindings.events = [];
                }
                const eventType = name.slice(1, -1);
                metadata.bindings.events.push(eventType);
            }
            if (name.startsWith('[') && name.endsWith(']') && !name.startsWith('[(')) {
                if (!metadata.bindings.properties) {
                    metadata.bindings.properties = [];
                }
                const propName = name.slice(1, -1);
                metadata.bindings.properties.push(propName);
            }
            if (name.startsWith('[(') && name.endsWith(')]')) {
                if (!metadata.bindings.twoWay) {
                    metadata.bindings.twoWay = [];
                }
                const bindTarget = name.slice(2, -2);
                metadata.bindings.twoWay.push(bindTarget);
            }
            if (name.startsWith('*ng')) {
                if (!metadata.bindings.structural) {
                    metadata.bindings.structural = [];
                }
                metadata.bindings.structural.push(name);
            }
            if (name.startsWith('[class.')) {
                if (!metadata.bindings.classes) {
                    metadata.bindings.classes = [];
                }
                const className = name.slice(7, -1);
                metadata.bindings.classes.push(className);
            }
        }
        return metadata;
    }
    isElement(node) {
        return 'tagName' in node;
    }
    isTextNode(node) {
        return node.nodeName === '#text';
    }
    extractLocation(node, sourceFile) {
        const loc = node.sourceCodeLocation;
        return {
            file: sourceFile,
            line: loc?.startLine || 0,
            column: loc?.startCol || 0,
            length: loc?.endOffset && loc?.startOffset
                ? loc.endOffset - loc.startOffset
                : undefined,
        };
    }
    generateId() {
        return `angular_dom_${++this.elementCounter}`;
    }
}
exports.AngularDOMExtractor = AngularDOMExtractor;
function extractAngularDOM(source, sourceFile) {
    const extractor = new AngularDOMExtractor();
    return extractor.extract(source, sourceFile);
}
