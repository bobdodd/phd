"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactActionLanguageExtractor = void 0;
exports.extractReactActionLanguage = extractReactActionLanguage;
const BabelParser_1 = require("./BabelParser");
const ActionLanguageModel_1 = require("../models/ActionLanguageModel");
class ReactActionLanguageExtractor {
    constructor() {
        this.nodeCounter = 0;
    }
    parse(source, sourceFile) {
        const nodes = [];
        if (!source || typeof source !== 'string') {
            return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
        }
        try {
            const ast = (0, BabelParser_1.parseSource)(source, sourceFile);
            this.extractJSXEventHandlers(ast, nodes, sourceFile);
            this.extractFocusManagement(ast, nodes, sourceFile);
            this.extractPortals(ast, nodes, sourceFile);
            this.extractEventPropagation(ast, nodes, sourceFile);
        }
        catch (error) {
            console.error(`Failed to parse React component in ${sourceFile}:`, error);
        }
        return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
    }
    extractJSXEventHandlers(ast, nodes, sourceFile) {
        (0, BabelParser_1.traverseAST)(ast, {
            JSXElement: (path) => {
                const opening = path.node.openingElement;
                const tagName = this.getJSXElementName(opening.name);
                let elementId;
                let elementSelector = tagName;
                for (const attr of opening.attributes) {
                    if (BabelParser_1.types.isJSXAttribute(attr) && BabelParser_1.types.isJSXIdentifier(attr.name)) {
                        if (attr.name.name === 'id' && BabelParser_1.types.isStringLiteral(attr.value)) {
                            elementId = attr.value.value;
                            elementSelector = `#${elementId}`;
                        }
                    }
                }
                for (const attr of opening.attributes) {
                    if (BabelParser_1.types.isJSXAttribute(attr) && BabelParser_1.types.isJSXIdentifier(attr.name)) {
                        const attrName = attr.name.name;
                        if (attrName.startsWith('on') && attrName.length > 2) {
                            const eventType = attrName.slice(2).toLowerCase();
                            const node = {
                                id: this.generateId(),
                                nodeType: 'action',
                                actionType: 'eventHandler',
                                event: eventType,
                                element: {
                                    selector: elementSelector,
                                    ...(elementId && { id: elementId }),
                                },
                                timing: 'immediate',
                                location: this.extractLocation(attr, sourceFile),
                                metadata: {
                                    framework: 'react',
                                    tagName,
                                    handlerType: 'jsx-prop',
                                },
                            };
                            nodes.push(node);
                        }
                    }
                }
            },
        });
    }
    extractFocusManagement(ast, nodes, sourceFile) {
        (0, BabelParser_1.traverseAST)(ast, {
            CallExpression: (path) => {
                const node = path.node;
                const callee = node.callee;
                if (BabelParser_1.types.isIdentifier(callee) && callee.name === 'useEffect') {
                    const effectFn = node.arguments[0];
                    if (!BabelParser_1.types.isArrowFunctionExpression(effectFn) && !BabelParser_1.types.isFunctionExpression(effectFn)) {
                        return;
                    }
                    let hasFocusManagement = false;
                    let refName;
                    const effectBody = effectFn.body;
                    const searchFocusCalls = (node) => {
                        if (BabelParser_1.types.isCallExpression(node) || BabelParser_1.types.isOptionalCallExpression(node)) {
                            const call = node;
                            if (BabelParser_1.types.isMemberExpression(call.callee) && BabelParser_1.types.isIdentifier(call.callee.property)) {
                                const methodName = call.callee.property.name;
                                if (methodName === 'focus' || methodName === 'blur') {
                                    hasFocusManagement = true;
                                    if (BabelParser_1.types.isMemberExpression(call.callee.object) &&
                                        BabelParser_1.types.isIdentifier(call.callee.object.property) &&
                                        call.callee.object.property.name === 'current' &&
                                        BabelParser_1.types.isIdentifier(call.callee.object.object)) {
                                        refName = call.callee.object.object.name;
                                    }
                                }
                            }
                            else if (BabelParser_1.types.isOptionalMemberExpression(call.callee) && BabelParser_1.types.isIdentifier(call.callee.property)) {
                                const methodName = call.callee.property.name;
                                if (methodName === 'focus' || methodName === 'blur') {
                                    hasFocusManagement = true;
                                    if (BabelParser_1.types.isOptionalMemberExpression(call.callee.object) &&
                                        BabelParser_1.types.isIdentifier(call.callee.object.property) &&
                                        call.callee.object.property.name === 'current' &&
                                        BabelParser_1.types.isIdentifier(call.callee.object.object)) {
                                        refName = call.callee.object.object.name;
                                    }
                                    else if (BabelParser_1.types.isMemberExpression(call.callee.object) &&
                                        BabelParser_1.types.isIdentifier(call.callee.object.property) &&
                                        call.callee.object.property.name === 'current' &&
                                        BabelParser_1.types.isIdentifier(call.callee.object.object)) {
                                        refName = call.callee.object.object.name;
                                    }
                                }
                            }
                        }
                        for (const key in node) {
                            if (node[key] && typeof node[key] === 'object') {
                                if (Array.isArray(node[key])) {
                                    for (const child of node[key]) {
                                        if (child && typeof child === 'object') {
                                            searchFocusCalls(child);
                                        }
                                    }
                                }
                                else {
                                    searchFocusCalls(node[key]);
                                }
                            }
                        }
                    };
                    if (effectBody) {
                        searchFocusCalls(effectBody);
                    }
                    let hasCleanup = false;
                    if (effectBody) {
                        const searchForReturn = (node) => {
                            if (BabelParser_1.types.isReturnStatement(node)) {
                                if (node.argument &&
                                    (BabelParser_1.types.isArrowFunctionExpression(node.argument) ||
                                        BabelParser_1.types.isFunctionExpression(node.argument))) {
                                    return true;
                                }
                            }
                            for (const key in node) {
                                if (node[key] && typeof node[key] === 'object') {
                                    if (Array.isArray(node[key])) {
                                        for (const child of node[key]) {
                                            if (child && typeof child === 'object' && searchForReturn(child)) {
                                                return true;
                                            }
                                        }
                                    }
                                    else if (searchForReturn(node[key])) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };
                        hasCleanup = searchForReturn(effectBody);
                    }
                    if (hasFocusManagement) {
                        const focusNode = {
                            id: `action_${++this.nodeCounter}`,
                            nodeType: 'action',
                            actionType: 'focusChange',
                            element: {
                                selector: refName ? `[ref="${refName}"]` : 'unknown',
                                ...(refName && { binding: refName }),
                            },
                            timing: 'deferred',
                            location: this.extractLocation(node, sourceFile),
                            metadata: {
                                framework: 'react',
                                hook: 'useEffect',
                                refName,
                                hasCleanup,
                            },
                        };
                        nodes.push(focusNode);
                    }
                }
            },
        });
    }
    extractPortals(ast, nodes, sourceFile) {
        (0, BabelParser_1.traverseAST)(ast, {
            CallExpression: (path) => {
                const node = path.node;
                const callee = node.callee;
                const isPortal = (BabelParser_1.types.isMemberExpression(callee) &&
                    BabelParser_1.types.isIdentifier(callee.object) &&
                    callee.object.name === 'ReactDOM' &&
                    BabelParser_1.types.isIdentifier(callee.property) &&
                    callee.property.name === 'createPortal') ||
                    (BabelParser_1.types.isIdentifier(callee) && callee.name === 'createPortal');
                if (isPortal && node.arguments.length >= 2) {
                    const containerArg = node.arguments[1];
                    let container = 'unknown';
                    if (BabelParser_1.types.isIdentifier(containerArg)) {
                        container = containerArg.name;
                    }
                    else if (BabelParser_1.types.isStringLiteral(containerArg)) {
                        container = containerArg.value;
                    }
                    else if (BabelParser_1.types.isMemberExpression(containerArg)) {
                        if (BabelParser_1.types.isIdentifier(containerArg.object) && BabelParser_1.types.isIdentifier(containerArg.property)) {
                            container = `${containerArg.object.name}.${containerArg.property.name}`;
                        }
                    }
                    const portalNode = {
                        id: this.generateId(),
                        nodeType: 'action',
                        actionType: 'portal',
                        element: {
                            selector: container,
                        },
                        timing: 'immediate',
                        location: this.extractLocation(node, sourceFile),
                        metadata: {
                            framework: 'react',
                            container,
                        },
                    };
                    nodes.push(portalNode);
                }
            },
        });
    }
    extractEventPropagation(ast, nodes, sourceFile) {
        (0, BabelParser_1.traverseAST)(ast, {
            ArrowFunctionExpression: (path) => {
                this.checkEventPropagationInFunction(path, nodes, sourceFile);
            },
            FunctionExpression: (path) => {
                this.checkEventPropagationInFunction(path, nodes, sourceFile);
            },
        });
    }
    checkEventPropagationInFunction(path, nodes, sourceFile) {
        const func = path.node;
        const params = func.params;
        if (params.length === 0)
            return;
        const firstParam = params[0];
        if (!BabelParser_1.types.isIdentifier(firstParam))
            return;
        const paramName = firstParam.name;
        const isEventParam = /^(e|event|evt|ev)$/i.test(paramName);
        if (!isEventParam)
            return;
        const self = this;
        path.traverse({
            CallExpression(innerPath) {
                const callee = innerPath.node.callee;
                if (BabelParser_1.types.isMemberExpression(callee) &&
                    BabelParser_1.types.isIdentifier(callee.object) &&
                    callee.object.name === paramName &&
                    BabelParser_1.types.isIdentifier(callee.property)) {
                    const methodName = callee.property.name;
                    if (methodName === 'stopPropagation' || methodName === 'stopImmediatePropagation') {
                        const propagationNode = {
                            id: `react_action_${++self.nodeCounter}`,
                            nodeType: 'action',
                            actionType: 'eventPropagation',
                            element: {
                                selector: 'unknown',
                            },
                            timing: 'immediate',
                            location: self.extractLocation(innerPath.node, sourceFile),
                            metadata: {
                                framework: 'react',
                                method: methodName,
                                eventParam: paramName,
                            },
                        };
                        nodes.push(propagationNode);
                    }
                }
            },
        });
    }
    getJSXElementName(name) {
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            return name.name;
        }
        else if (BabelParser_1.types.isJSXMemberExpression(name)) {
            const parts = [];
            let current = name;
            while (current) {
                if (BabelParser_1.types.isJSXIdentifier(current.property)) {
                    parts.unshift(current.property.name);
                }
                if (BabelParser_1.types.isJSXIdentifier(current.object)) {
                    parts.unshift(current.object.name);
                    break;
                }
                else if (BabelParser_1.types.isJSXMemberExpression(current.object)) {
                    current = current.object;
                }
                else {
                    break;
                }
            }
            return parts.join('.');
        }
        else if (BabelParser_1.types.isJSXNamespacedName(name)) {
            return `${name.namespace.name}:${name.name.name}`;
        }
        return 'unknown';
    }
    extractLocation(node, sourceFile) {
        const loc = node.loc;
        return {
            file: sourceFile,
            line: loc?.start.line || 0,
            column: loc?.start.column || 0,
            length: node.end && node.start ? node.end - node.start : undefined,
        };
    }
    generateId() {
        return `react_action_${++this.nodeCounter}`;
    }
}
exports.ReactActionLanguageExtractor = ReactActionLanguageExtractor;
function extractReactActionLanguage(source, sourceFile) {
    const extractor = new ReactActionLanguageExtractor();
    return extractor.parse(source, sourceFile);
}
