"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptParser = void 0;
const BabelParser_1 = require("./BabelParser");
const ActionLanguageModel_1 = require("../models/ActionLanguageModel");
class JavaScriptParser {
    constructor() {
        this.nodeCounter = 0;
        this.variableBindings = new Map();
    }
    parse(source, sourceFile) {
        const nodes = [];
        this.variableBindings.clear();
        const ast = (0, BabelParser_1.parseSource)(source, sourceFile);
        (0, BabelParser_1.traverseAST)(ast, {
            VariableDeclarator: (path) => {
                this.collectVariableBinding(path);
            },
        });
        (0, BabelParser_1.traverseAST)(ast, {
            CallExpression: (path) => {
                if (this.isAddEventListener(path.node)) {
                    const node = this.extractEventHandler(path, sourceFile);
                    if (node)
                        nodes.push(node);
                }
                if (this.isSetAttribute(path.node)) {
                    const node = this.extractAriaUpdate(path, sourceFile);
                    if (node)
                        nodes.push(node);
                }
                if (this.isFocusChange(path.node)) {
                    const node = this.extractFocusChange(path, sourceFile);
                    if (node)
                        nodes.push(node);
                }
            },
            JSXAttribute: (path) => {
                if (this.isJSXEventHandler(path.node)) {
                    const node = this.extractJSXEventHandler(path, sourceFile);
                    if (node)
                        nodes.push(node);
                }
            },
        });
        return new ActionLanguageModel_1.ActionLanguageModelImpl(nodes, sourceFile);
    }
    isAddEventListener(node) {
        const { callee } = node;
        return (BabelParser_1.types.isMemberExpression(callee) &&
            BabelParser_1.types.isIdentifier(callee.property) &&
            callee.property.name === 'addEventListener');
    }
    isJSXEventHandler(node) {
        const { name } = node;
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            return name.name.startsWith('on') && name.name.length > 2;
        }
        return false;
    }
    isSetAttribute(node) {
        const { callee } = node;
        return (BabelParser_1.types.isMemberExpression(callee) &&
            BabelParser_1.types.isIdentifier(callee.property) &&
            callee.property.name === 'setAttribute');
    }
    isFocusChange(node) {
        const { callee } = node;
        if (BabelParser_1.types.isMemberExpression(callee) && BabelParser_1.types.isIdentifier(callee.property)) {
            const methodName = callee.property.name;
            return methodName === 'focus' || methodName === 'blur';
        }
        return false;
    }
    extractEventHandler(path, sourceFile) {
        const node = path.node;
        const args = node.arguments;
        if (args.length < 2)
            return null;
        const eventArg = args[0];
        let eventType;
        if (BabelParser_1.types.isStringLiteral(eventArg)) {
            eventType = eventArg.value;
        }
        if (!eventType)
            return null;
        const callee = node.callee;
        const elementRef = this.extractElementReference(callee.object);
        if (!elementRef)
            return null;
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'eventHandler',
            event: eventType,
            element: elementRef,
            handler: args[1],
            location: this.extractLocation(node, sourceFile),
            metadata: {
                framework: 'vanilla',
                synthetic: false,
            },
        };
    }
    extractJSXEventHandler(path, sourceFile) {
        const attr = path.node;
        const name = attr.name;
        if (!BabelParser_1.types.isJSXIdentifier(name))
            return null;
        const eventType = name.name.slice(2).toLowerCase();
        let jsxElement = null;
        path.findParent((p) => {
            if (p.isJSXElement()) {
                jsxElement = p.node;
                return true;
            }
            return false;
        });
        if (!jsxElement)
            return null;
        const tagName = this.getJSXTagName(jsxElement);
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'eventHandler',
            event: eventType,
            element: {
                selector: tagName,
                binding: tagName,
            },
            handler: attr.value,
            location: this.extractLocation(attr, sourceFile),
            metadata: {
                framework: 'react',
                synthetic: true,
            },
        };
    }
    extractAriaUpdate(path, sourceFile) {
        const node = path.node;
        const args = node.arguments;
        if (args.length < 2)
            return null;
        const attrArg = args[0];
        if (!BabelParser_1.types.isStringLiteral(attrArg))
            return null;
        if (!attrArg.value.startsWith('aria-'))
            return null;
        const callee = node.callee;
        const elementRef = this.extractElementReference(callee.object);
        if (!elementRef)
            return null;
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'ariaStateChange',
            element: elementRef,
            location: this.extractLocation(node, sourceFile),
            metadata: {
                attribute: attrArg.value,
                value: args[1],
            },
        };
    }
    extractFocusChange(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        const methodName = callee.property.name;
        const elementRef = this.extractElementReference(callee.object);
        if (!elementRef)
            return null;
        return {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'focusChange',
            element: elementRef,
            timing: 'immediate',
            location: this.extractLocation(node, sourceFile),
            metadata: {
                method: methodName,
            },
        };
    }
    collectVariableBinding(path) {
        const node = path.node;
        const id = node.id;
        const init = node.init;
        if (!BabelParser_1.types.isIdentifier(id) || !init)
            return;
        const variableName = id.name;
        const elementRef = this.extractElementReferenceFromExpression(init);
        if (elementRef) {
            this.variableBindings.set(variableName, elementRef);
        }
    }
    extractElementReference(node) {
        if (BabelParser_1.types.isIdentifier(node)) {
            const binding = this.variableBindings.get(node.name);
            if (binding) {
                return binding;
            }
            return {
                selector: node.name,
                binding: node.name,
            };
        }
        return this.extractElementReferenceFromExpression(node);
    }
    extractElementReferenceFromExpression(node) {
        if (BabelParser_1.types.isMemberExpression(node) &&
            BabelParser_1.types.isIdentifier(node.property) &&
            node.property.name === 'current' &&
            BabelParser_1.types.isIdentifier(node.object)) {
            return {
                selector: `[ref="${node.object.name}"]`,
                binding: node.object.name,
            };
        }
        if (BabelParser_1.types.isCallExpression(node)) {
            const callee = node.callee;
            if (BabelParser_1.types.isMemberExpression(callee) &&
                BabelParser_1.types.isIdentifier(callee.property) &&
                callee.property.name === 'getElementById') {
                const arg = node.arguments[0];
                if (BabelParser_1.types.isStringLiteral(arg)) {
                    return {
                        selector: `#${arg.value}`,
                        binding: arg.value,
                    };
                }
            }
            if (BabelParser_1.types.isMemberExpression(callee) &&
                BabelParser_1.types.isIdentifier(callee.property) &&
                callee.property.name === 'querySelector') {
                const arg = node.arguments[0];
                if (BabelParser_1.types.isStringLiteral(arg)) {
                    return {
                        selector: arg.value,
                        binding: arg.value,
                    };
                }
            }
        }
        return null;
    }
    getJSXTagName(element) {
        const opening = element.openingElement;
        const name = opening.name;
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            return name.name;
        }
        if (BabelParser_1.types.isJSXMemberExpression(name)) {
            return this.getJSXMemberExpressionName(name);
        }
        return 'unknown';
    }
    getJSXMemberExpressionName(expr) {
        const parts = [];
        let current = expr;
        while (BabelParser_1.types.isJSXMemberExpression(current)) {
            if (BabelParser_1.types.isJSXIdentifier(current.property)) {
                parts.unshift(current.property.name);
            }
            current = current.object;
        }
        if (BabelParser_1.types.isJSXIdentifier(current)) {
            parts.unshift(current.name);
        }
        return parts.join('.');
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
        return `action_${++this.nodeCounter}`;
    }
}
exports.JavaScriptParser = JavaScriptParser;
//# sourceMappingURL=JavaScriptParser.js.map