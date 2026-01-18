"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteDOMExtractor = void 0;
exports.extractSvelteDOM = extractSvelteDOM;
const parse5_1 = require("parse5");
const DOMModel_1 = require("../models/DOMModel");
class SvelteDOMExtractor {
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
            const rootElement = this.findRootElement(document, sourceFile);
            if (!rootElement) {
                return null;
            }
            return new DOMModel_1.DOMModelImpl(rootElement, sourceFile);
        }
        catch (error) {
            console.error(`Failed to parse Svelte template in ${sourceFile}:`, error);
            return null;
        }
    }
    extractTemplate(source) {
        let template = source.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        template = template.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        return template.trim();
    }
    findRootElement(document, sourceFile) {
        const html = document.childNodes.find((node) => node.nodeName === 'html');
        if (!html)
            return null;
        const body = html.childNodes?.find((node) => node.nodeName === 'body');
        if (!body || !body.childNodes || body.childNodes.length === 0) {
            return null;
        }
        const firstElement = body.childNodes.find((node) => this.isElement(node));
        if (!firstElement || !this.isElement(firstElement)) {
            return null;
        }
        return this.convertElement(firstElement, sourceFile);
    }
    convertElement(node, sourceFile, parent) {
        const tagName = node.tagName;
        const attributes = this.extractAttributes(node);
        const directives = this.extractSvelteDirectives(node);
        const element = {
            id: this.generateId(),
            nodeType: 'element',
            tagName,
            attributes,
            children: [],
            parent,
            location: this.extractLocation(node, sourceFile),
            metadata: {
                isSvelteComponent: this.isSvelteComponent(tagName),
                directives,
            },
        };
        if (node.childNodes) {
            for (const child of node.childNodes) {
                const childElement = this.convertChild(child, sourceFile, element);
                if (childElement) {
                    element.children.push(childElement);
                }
            }
        }
        return element;
    }
    convertChild(node, sourceFile, parent) {
        if (this.isElement(node)) {
            return this.convertElement(node, sourceFile, parent);
        }
        if (this.isTextNode(node)) {
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
        return null;
    }
    extractAttributes(node) {
        const attrs = {};
        if (!node.attrs)
            return attrs;
        for (const attr of node.attrs) {
            if (this.isSvelteDirective(attr.name)) {
                continue;
            }
            attrs[attr.name] = attr.value;
        }
        return attrs;
    }
    extractSvelteDirectives(node) {
        const directives = {};
        if (!node.attrs)
            return directives;
        for (const attr of node.attrs) {
            const name = attr.name;
            if (name.startsWith('bind:')) {
                if (!directives.bind)
                    directives.bind = [];
                directives.bind.push(name.substring(5));
            }
            else if (name.startsWith('on:')) {
                if (!directives.on)
                    directives.on = [];
                directives.on.push(name.substring(3));
            }
            else if (name.startsWith('use:')) {
                if (!directives.use)
                    directives.use = [];
                directives.use.push(name.substring(4));
            }
            else if (name.startsWith('transition:')) {
                directives.transition = name.substring(11);
            }
            else if (name.startsWith('animate:')) {
                directives.animate = name.substring(8);
            }
            else if (name.startsWith('class:')) {
                if (!directives.class)
                    directives.class = [];
                directives.class.push(name.substring(6));
            }
        }
        return Object.keys(directives).length > 0 ? directives : undefined;
    }
    isSvelteDirective(attrName) {
        return (attrName.startsWith('bind:') ||
            attrName.startsWith('on:') ||
            attrName.startsWith('use:') ||
            attrName.startsWith('transition:') ||
            attrName.startsWith('animate:') ||
            attrName.startsWith('class:'));
    }
    isSvelteComponent(tagName) {
        return /^[A-Z]/.test(tagName);
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
        return `svelte_dom_${++this.elementCounter}`;
    }
}
exports.SvelteDOMExtractor = SvelteDOMExtractor;
function extractSvelteDOM(source, sourceFile) {
    const extractor = new SvelteDOMExtractor();
    return extractor.extract(source, sourceFile);
}
//# sourceMappingURL=SvelteDOMExtractor.js.map