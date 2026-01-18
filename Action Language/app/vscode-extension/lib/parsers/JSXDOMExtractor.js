"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSXDOMExtractor = void 0;
exports.extractJSXDOM = extractJSXDOM;
const BabelParser_1 = require("./BabelParser");
const DOMModel_1 = require("../models/DOMModel");
class JSXDOMExtractor {
    constructor() {
        this.elementCounter = 0;
    }
    extract(source, sourceFile) {
        const ast = (0, BabelParser_1.parseSource)(source, sourceFile);
        let rootElement = null;
        (0, BabelParser_1.traverseAST)(ast, {
            ReturnStatement: (path) => {
                const argument = path.node.argument;
                if (!argument)
                    return;
                const element = this.extractJSXElement(argument, sourceFile);
                if (element && !rootElement) {
                    rootElement = element;
                }
            },
            ArrowFunctionExpression: (path) => {
                const body = path.node.body;
                if (BabelParser_1.types.isJSXElement(body) || BabelParser_1.types.isJSXFragment(body)) {
                    const element = this.extractJSXElement(body, sourceFile);
                    if (element && !rootElement) {
                        rootElement = element;
                    }
                }
            },
        });
        if (!rootElement) {
            return null;
        }
        return new DOMModel_1.DOMModelImpl(rootElement, sourceFile);
    }
    extractJSXElement(node, sourceFile, parent) {
        if (BabelParser_1.types.isJSXElement(node)) {
            return this.convertJSXElement(node, sourceFile, parent);
        }
        if (BabelParser_1.types.isJSXFragment(node)) {
            return this.convertJSXFragment(node, sourceFile, parent);
        }
        if (BabelParser_1.types.isConditionalExpression(node)) {
            return this.extractJSXElement(node.consequent, sourceFile, parent);
        }
        if (BabelParser_1.types.isLogicalExpression(node)) {
            return this.extractJSXElement(node.right, sourceFile, parent);
        }
        if (BabelParser_1.types.isParenthesizedExpression(node)) {
            return this.extractJSXElement(node.expression, sourceFile, parent);
        }
        return null;
    }
    convertJSXElement(node, sourceFile, parent) {
        const opening = node.openingElement;
        const tagName = this.getTagName(opening.name);
        const attributes = this.extractAttributes(opening.attributes);
        const element = {
            id: this.generateId(),
            nodeType: 'element',
            tagName,
            attributes,
            children: [],
            parent,
            location: this.extractLocation(node, sourceFile),
            metadata: {
                isReactComponent: this.isReactComponent(tagName),
                selfClosing: opening.selfClosing || false,
            },
        };
        for (const child of node.children) {
            const childElement = this.convertJSXChild(child, sourceFile, element);
            if (childElement) {
                element.children.push(childElement);
            }
        }
        return element;
    }
    convertJSXFragment(node, sourceFile, parent) {
        const element = {
            id: this.generateId(),
            nodeType: 'element',
            tagName: 'Fragment',
            attributes: {},
            children: [],
            parent,
            location: this.extractLocation(node, sourceFile),
            metadata: {
                isFragment: true,
            },
        };
        for (const child of node.children) {
            const childElement = this.convertJSXChild(child, sourceFile, element);
            if (childElement) {
                element.children.push(childElement);
            }
        }
        return element;
    }
    convertJSXChild(child, sourceFile, parent) {
        if (BabelParser_1.types.isJSXText(child)) {
            const text = child.value.trim();
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
                location: this.extractLocation(child, sourceFile),
                metadata: {},
            };
        }
        if (BabelParser_1.types.isJSXElement(child)) {
            return this.convertJSXElement(child, sourceFile, parent);
        }
        if (BabelParser_1.types.isJSXFragment(child)) {
            return this.convertJSXFragment(child, sourceFile, parent);
        }
        if (BabelParser_1.types.isJSXExpressionContainer(child)) {
            const expr = child.expression;
            if (BabelParser_1.types.isJSXEmptyExpression(expr))
                return null;
            return this.extractJSXElement(expr, sourceFile, parent);
        }
        return null;
    }
    getTagName(name) {
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            return name.name;
        }
        if (BabelParser_1.types.isJSXMemberExpression(name)) {
            return this.getJSXMemberExpressionName(name);
        }
        if (BabelParser_1.types.isJSXNamespacedName(name)) {
            return `${name.namespace.name}:${name.name.name}`;
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
    extractAttributes(attributes) {
        const attrs = {};
        for (const attr of attributes) {
            if (BabelParser_1.types.isJSXSpreadAttribute(attr))
                continue;
            const name = this.getAttributeName(attr.name);
            const value = this.getAttributeValue(attr.value);
            if (name && value !== null) {
                attrs[name] = value;
            }
        }
        return attrs;
    }
    getAttributeName(name) {
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            const jsxName = name.name;
            if (jsxName === 'className')
                return 'class';
            if (jsxName === 'htmlFor')
                return 'for';
            if (jsxName === 'tabIndex')
                return 'tabindex';
            return jsxName;
        }
        return `${name.namespace.name}:${name.name.name}`;
    }
    getAttributeValue(value) {
        if (!value)
            return 'true';
        if (BabelParser_1.types.isStringLiteral(value)) {
            return value.value;
        }
        if (BabelParser_1.types.isJSXExpressionContainer(value)) {
            const expr = value.expression;
            if (BabelParser_1.types.isStringLiteral(expr)) {
                return expr.value;
            }
            if (BabelParser_1.types.isBooleanLiteral(expr)) {
                return expr.value.toString();
            }
            if (BabelParser_1.types.isNumericLiteral(expr)) {
                return expr.value.toString();
            }
            return '{expression}';
        }
        return null;
    }
    isReactComponent(tagName) {
        return /^[A-Z]/.test(tagName);
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
        return `dom_${++this.elementCounter}`;
    }
}
exports.JSXDOMExtractor = JSXDOMExtractor;
function extractJSXDOM(source, sourceFile) {
    const extractor = new JSXDOMExtractor();
    return extractor.extract(source, sourceFile);
}
