"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueDOMExtractor = void 0;
exports.extractVueDOM = extractVueDOM;
const parse5_1 = require("parse5");
const DOMModel_1 = require("../models/DOMModel");
class VueDOMExtractor {
    constructor() {
        this.elementCounter = 0;
    }
    extract(source, sourceFile) {
        const template = this.extractTemplate(source);
        if (!template.trim()) {
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
            console.error(`Failed to parse Vue template in ${sourceFile}:`, error);
            return null;
        }
    }
    extractTemplate(source) {
        const templateMatch = source.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
        if (templateMatch) {
            return templateMatch[1].trim();
        }
        let template = source.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        template = template.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        return template.trim();
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
        const vueMetadata = this.extractVueMetadata(node);
        const element = {
            id: this.generateId(),
            nodeType: 'element',
            tagName,
            attributes,
            children: [],
            parent,
            location: this.extractLocation(node, sourceFile),
            metadata: vueMetadata,
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
    extractVueMetadata(element) {
        const metadata = {
            directives: {},
        };
        if (!element.attrs)
            return metadata;
        for (const attr of element.attrs) {
            const name = attr.name;
            if (name.startsWith('v-on:') || name.startsWith('@')) {
                if (!metadata.directives.on) {
                    metadata.directives.on = [];
                }
                const eventType = name.startsWith('@') ? name.substring(1) : name.substring(5);
                metadata.directives.on.push(eventType);
            }
            if (name === 'v-model' || name.startsWith('v-model:')) {
                metadata.directives.model = true;
            }
            if (name === 'v-if' || name === 'v-else-if' || name === 'v-else') {
                if (!metadata.directives.conditionals) {
                    metadata.directives.conditionals = [];
                }
                metadata.directives.conditionals.push(name);
            }
            if (name === 'v-show') {
                metadata.directives.show = true;
            }
            if (name === 'v-for') {
                metadata.directives.loop = true;
            }
            if (name.startsWith('v-bind:') || (name.startsWith(':') && name.length > 1)) {
                if (!metadata.directives.bindings) {
                    metadata.directives.bindings = [];
                }
                const bindTarget = name.startsWith(':') ? name.substring(1) : name.substring(7);
                metadata.directives.bindings.push(bindTarget);
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
        return `vue_dom_${++this.elementCounter}`;
    }
}
exports.VueDOMExtractor = VueDOMExtractor;
function extractVueDOM(source, sourceFile) {
    const extractor = new VueDOMExtractor();
    return extractor.extract(source, sourceFile);
}
