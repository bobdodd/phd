"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteActionLanguageExtractor = void 0;
exports.parseSvelteActionLanguage = parseSvelteActionLanguage;
const parse5_1 = require("parse5");
const ActionLanguageModel_1 = require("../models/ActionLanguageModel");
class SvelteActionLanguageExtractor {
    constructor() {
        this.nodeCounter = 0;
    }
    parse(source, sourceFile) {
        const nodes = [];
        const template = this.extractTemplate(source);
        if (!template.trim()) {
            return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
        }
        try {
            const document = (0, parse5_1.parse)(template, {
                sourceCodeLocationInfo: true,
            });
            const html = document.childNodes.find((node) => node.nodeName === 'html');
            if (!html) {
                return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
            }
            const body = html.childNodes?.find((node) => node.nodeName === 'body');
            if (!body) {
                return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
            }
            this.traverseElements(body, nodes, sourceFile);
        }
        catch (error) {
            console.error(`Failed to parse Svelte template in ${sourceFile}:`, error);
        }
        return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
    }
    extractTemplate(source) {
        let template = source.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        template = template.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        return template.trim();
    }
    traverseElements(node, nodes, sourceFile) {
        if (!node)
            return;
        if (this.isElement(node)) {
            const element = node;
            const tagName = element.tagName;
            const elementRef = this.getElementReference(element);
            if (element.attrs) {
                for (const attr of element.attrs) {
                    if (attr.name.startsWith('on:')) {
                        const eventType = attr.name.substring(3);
                        const eventNode = this.createEventHandlerNode(eventType, elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(eventNode);
                    }
                    if (attr.name.startsWith('bind:')) {
                        const bindTarget = attr.name.substring(5);
                        const bindNode = this.createBindDirectiveNode(bindTarget, elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(bindNode);
                    }
                    if (attr.name.startsWith('class:')) {
                        const className = attr.name.substring(6);
                        const classNode = this.createClassDirectiveNode(className, elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(classNode);
                    }
                }
            }
        }
        if ('childNodes' in node) {
            const childNodes = node.childNodes;
            if (childNodes) {
                for (const child of childNodes) {
                    this.traverseElements(child, nodes, sourceFile);
                }
            }
        }
    }
    createEventHandlerNode(eventType, elementRef, tagName, directiveName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'eventHandler',
            event: eventType,
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'svelte',
                synthetic: true,
                directive: directiveName,
                tagName,
            },
        };
    }
    createBindDirectiveNode(bindTarget, elementRef, tagName, directiveName, element, sourceFile) {
        let actionType = 'domManipulation';
        if (bindTarget === 'value' || bindTarget === 'checked') {
            actionType = 'ariaStateChange';
        }
        if (bindTarget === 'this') {
            actionType = 'focusChange';
        }
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType,
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'svelte',
                directive: directiveName,
                bindTarget,
                tagName,
            },
        };
    }
    createClassDirectiveNode(className, elementRef, tagName, directiveName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'domManipulation',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'svelte',
                directive: directiveName,
                className,
                tagName,
                affectsVisibility: this.isVisibilityClass(className),
            },
        };
    }
    getElementReference(element) {
        const idAttr = element.attrs?.find(attr => attr.name === 'id');
        if (idAttr) {
            return {
                selector: `#${idAttr.value}`,
                binding: idAttr.value,
            };
        }
        const classAttr = element.attrs?.find(attr => attr.name === 'class');
        if (classAttr) {
            const classes = classAttr.value.split(/\s+/);
            return {
                selector: `.${classes[0]}`,
                binding: classAttr.value,
            };
        }
        return {
            selector: element.tagName,
            binding: element.tagName,
        };
    }
    isVisibilityClass(className) {
        const visibilityKeywords = [
            'hidden',
            'visible',
            'show',
            'hide',
            'open',
            'closed',
            'collapsed',
            'expanded',
        ];
        return visibilityKeywords.some(keyword => className.toLowerCase().includes(keyword));
    }
    isElement(node) {
        return 'tagName' in node;
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
        return `svelte_action_${++this.nodeCounter}`;
    }
}
exports.SvelteActionLanguageExtractor = SvelteActionLanguageExtractor;
function parseSvelteActionLanguage(source, sourceFile) {
    const extractor = new SvelteActionLanguageExtractor();
    return extractor.parse(source, sourceFile);
}
//# sourceMappingURL=SvelteActionLanguageExtractor.js.map