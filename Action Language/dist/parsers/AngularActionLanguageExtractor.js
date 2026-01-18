"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularActionLanguageExtractor = void 0;
exports.parseAngularActionLanguage = parseAngularActionLanguage;
const parse5_1 = require("parse5");
const ActionLanguageModel_1 = require("../models/ActionLanguageModel");
class AngularActionLanguageExtractor {
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
            console.error(`Failed to parse Angular template in ${sourceFile}:`, error);
        }
        return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
    }
    extractTemplate(source) {
        if (!source.includes('@Component') && !source.includes('template:')) {
            return source;
        }
        const inlineTemplateMatch = source.match(/template:\s*`([^`]*)`/s);
        if (inlineTemplateMatch) {
            return inlineTemplateMatch[1].trim();
        }
        return '';
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
                    if (attr.name.startsWith('(') && attr.name.endsWith(')')) {
                        const eventType = attr.name.slice(1, -1);
                        const eventNode = this.createEventBindingNode(eventType, elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(eventNode);
                    }
                    if (attr.name.startsWith('[(') && attr.name.endsWith(')]')) {
                        const bindTarget = attr.name.slice(2, -2);
                        const bindNode = this.createTwoWayBindingNode(bindTarget, elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(bindNode);
                    }
                    if (attr.name === '*ngif' || attr.name === '*ngIf') {
                        const ifNode = this.createNgIfNode(elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(ifNode);
                    }
                    if (attr.name === '[hidden]') {
                        const hiddenNode = this.createHiddenBindingNode(elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(hiddenNode);
                    }
                    if (attr.name.startsWith('[class.')) {
                        const className = attr.name.slice(7, -1);
                        const classNode = this.createClassBindingNode(className, elementRef, tagName, attr.name, element, sourceFile);
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
    createEventBindingNode(eventType, elementRef, tagName, bindingName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'eventHandler',
            event: eventType,
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'angular',
                synthetic: true,
                binding: bindingName,
                tagName,
            },
        };
    }
    createTwoWayBindingNode(bindTarget, elementRef, tagName, bindingName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'ariaStateChange',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'angular',
                binding: bindingName,
                bindTarget,
                tagName,
                twoWayBinding: true,
            },
        };
    }
    createNgIfNode(elementRef, tagName, directiveName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'domManipulation',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'angular',
                directive: directiveName,
                tagName,
                affectsVisibility: true,
                conditional: true,
            },
        };
    }
    createHiddenBindingNode(elementRef, tagName, bindingName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'domManipulation',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'angular',
                binding: bindingName,
                tagName,
                affectsVisibility: true,
            },
        };
    }
    createClassBindingNode(className, elementRef, tagName, bindingName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'domManipulation',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'angular',
                binding: bindingName,
                className,
                tagName,
                dynamicClass: true,
                affectsVisibility: this.isVisibilityClass(className),
            },
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
        return `angular_action_${++this.nodeCounter}`;
    }
}
exports.AngularActionLanguageExtractor = AngularActionLanguageExtractor;
function parseAngularActionLanguage(source, sourceFile) {
    const extractor = new AngularActionLanguageExtractor();
    return extractor.parse(source, sourceFile);
}
//# sourceMappingURL=AngularActionLanguageExtractor.js.map