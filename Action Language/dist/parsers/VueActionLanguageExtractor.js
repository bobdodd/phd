"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueActionLanguageExtractor = void 0;
exports.parseVueActionLanguage = parseVueActionLanguage;
const parse5_1 = require("parse5");
const ActionLanguageModel_1 = require("../models/ActionLanguageModel");
const JavaScriptParser_1 = require("./JavaScriptParser");
class VueActionLanguageExtractor {
    constructor() {
        this.nodeCounter = 0;
    }
    parse(source, sourceFile) {
        const nodes = [];
        const scriptContent = this.extractScript(source);
        if (scriptContent) {
            try {
                const jsParser = new JavaScriptParser_1.JavaScriptParser();
                const scriptModel = jsParser.parse(scriptContent, sourceFile);
                for (const node of scriptModel.nodes) {
                    nodes.push({
                        ...node,
                        metadata: {
                            ...node.metadata,
                            framework: 'vue',
                            sourceSection: 'script'
                        }
                    });
                }
            }
            catch (error) {
                console.error(`Failed to parse Vue script in ${sourceFile}:`, error);
            }
        }
        const template = this.extractTemplate(source);
        if (template.trim()) {
            try {
                const document = (0, parse5_1.parse)(template, {
                    sourceCodeLocationInfo: true,
                });
                const html = document.childNodes.find((node) => node.nodeName === 'html');
                if (html) {
                    const body = html.childNodes?.find((node) => node.nodeName === 'body');
                    if (body) {
                        this.traverseElements(body, nodes, sourceFile);
                    }
                }
            }
            catch (error) {
                console.error(`Failed to parse Vue template in ${sourceFile}:`, error);
            }
        }
        return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
    }
    extractScript(source) {
        const scriptMatch = source.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        return scriptMatch ? scriptMatch[1].trim() : '';
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
    traverseElements(node, nodes, sourceFile) {
        if (!node)
            return;
        if (this.isElement(node)) {
            const element = node;
            const tagName = element.tagName;
            const elementRef = this.getElementReference(element);
            if (element.attrs) {
                for (const attr of element.attrs) {
                    if (attr.name.startsWith('v-on:') || attr.name.startsWith('@')) {
                        const eventType = this.extractEventType(attr.name);
                        const eventNode = this.createEventHandlerNode(eventType, elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(eventNode);
                    }
                    if (attr.name === 'v-model' || attr.name.startsWith('v-model:')) {
                        const bindTarget = attr.name === 'v-model' ? 'value' : attr.name.substring(8);
                        const bindNode = this.createModelDirectiveNode(bindTarget, elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(bindNode);
                    }
                    if (attr.name === 'v-show') {
                        const showNode = this.createShowDirectiveNode(elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(showNode);
                    }
                    if (attr.name === 'v-if') {
                        const ifNode = this.createIfDirectiveNode(elementRef, tagName, attr.name, element, sourceFile);
                        nodes.push(ifNode);
                    }
                    if (attr.name === 'v-bind:class' || attr.name === ':class') {
                        const classNode = this.createClassBindingNode(elementRef, tagName, attr.name, element, sourceFile);
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
    extractEventType(directiveName) {
        if (directiveName.startsWith('@')) {
            return directiveName.substring(1);
        }
        if (directiveName.startsWith('v-on:')) {
            return directiveName.substring(5);
        }
        return directiveName;
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
                framework: 'vue',
                synthetic: true,
                directive: directiveName,
                tagName,
            },
        };
    }
    createModelDirectiveNode(bindTarget, elementRef, tagName, directiveName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'ariaStateChange',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'vue',
                directive: directiveName,
                bindTarget,
                tagName,
                twoWayBinding: true,
            },
        };
    }
    createShowDirectiveNode(elementRef, tagName, directiveName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'domManipulation',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'vue',
                directive: directiveName,
                tagName,
                affectsVisibility: true,
            },
        };
    }
    createIfDirectiveNode(elementRef, tagName, directiveName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'domManipulation',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'vue',
                directive: directiveName,
                tagName,
                affectsVisibility: true,
                conditional: true,
            },
        };
    }
    createClassBindingNode(elementRef, tagName, directiveName, element, sourceFile) {
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'domManipulation',
            element: elementRef,
            location: this.extractLocation(element, sourceFile),
            metadata: {
                framework: 'vue',
                directive: directiveName,
                tagName,
                dynamicClass: true,
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
        return `vue_action_${++this.nodeCounter}`;
    }
}
exports.VueActionLanguageExtractor = VueActionLanguageExtractor;
function parseVueActionLanguage(source, sourceFile) {
    const extractor = new VueActionLanguageExtractor();
    return extractor.parse(source, sourceFile);
}
