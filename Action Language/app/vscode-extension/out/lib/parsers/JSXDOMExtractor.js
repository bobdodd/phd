"use strict";
/**
 * JSX DOM Extractor
 *
 * This module extracts a virtual DOM structure from JSX components.
 * It converts JSX elements into DOMElement nodes that can be used for
 * cross-reference analysis with JavaScript behaviors and CSS rules.
 *
 * Unlike static HTML parsing, this extractor:
 * - Handles React components (<MyComponent>)
 * - Extracts JSX attributes as DOM attributes
 * - Preserves source locations for error reporting
 * - Builds a virtual DOM tree from component render functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSXDOMExtractor = void 0;
exports.extractJSXDOM = extractJSXDOM;
const BabelParser_1 = require("./BabelParser");
const DOMModel_1 = require("../models/DOMModel");
/**
 * JSX DOM Extractor
 *
 * Extracts virtual DOM structure from JSX/TSX components.
 */
class JSXDOMExtractor {
    constructor() {
        this.elementCounter = 0;
    }
    /**
     * Extract DOM structure from JSX source code.
     *
     * @param source - JSX/TSX source code
     * @param sourceFile - Filename for error reporting
     * @returns DOMModel representing the JSX structure
     *
     * @example
     * ```typescript
     * const extractor = new JSXDOMExtractor();
     * const domModel = extractor.extract(`
     *   function MyComponent() {
     *     return <button id="submit">Click me</button>;
     *   }
     * `, 'MyComponent.tsx');
     * ```
     */
    extract(source, sourceFile) {
        const ast = (0, BabelParser_1.parseSource)(source, sourceFile);
        let rootElement = null;
        // Find JSX return statements in function components
        (0, BabelParser_1.traverseAST)(ast, {
            // Handle function component returns
            ReturnStatement: (path) => {
                const argument = path.node.argument;
                if (!argument)
                    return;
                // Extract JSX from return statement
                const element = this.extractJSXElement(argument, sourceFile);
                if (element && !rootElement) {
                    rootElement = element;
                }
            },
            // Handle arrow function component returns
            ArrowFunctionExpression: (path) => {
                const body = path.node.body;
                // Handle implicit return: () => <div>...</div>
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
    /**
     * Extract a DOM element from a JSX node.
     */
    extractJSXElement(node, sourceFile, parent) {
        // Handle JSX elements
        if (BabelParser_1.types.isJSXElement(node)) {
            return this.convertJSXElement(node, sourceFile, parent);
        }
        // Handle JSX fragments: <></>
        if (BabelParser_1.types.isJSXFragment(node)) {
            return this.convertJSXFragment(node, sourceFile, parent);
        }
        // Handle expressions that might contain JSX
        if (BabelParser_1.types.isConditionalExpression(node)) {
            // Handle: condition ? <div>A</div> : <div>B</div>
            // For now, extract the consequent (true branch)
            return this.extractJSXElement(node.consequent, sourceFile, parent);
        }
        if (BabelParser_1.types.isLogicalExpression(node)) {
            // Handle: isOpen && <Dialog />
            return this.extractJSXElement(node.right, sourceFile, parent);
        }
        if (BabelParser_1.types.isParenthesizedExpression(node)) {
            return this.extractJSXElement(node.expression, sourceFile, parent);
        }
        return null;
    }
    /**
     * Convert a JSX element to a DOMElement.
     */
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
        // Extract children
        for (const child of node.children) {
            const childElement = this.convertJSXChild(child, sourceFile, element);
            if (childElement) {
                element.children.push(childElement);
            }
        }
        return element;
    }
    /**
     * Convert a JSX fragment to a DOMElement.
     * Fragments are represented as a wrapper element.
     */
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
        // Extract children
        for (const child of node.children) {
            const childElement = this.convertJSXChild(child, sourceFile, element);
            if (childElement) {
                element.children.push(childElement);
            }
        }
        return element;
    }
    /**
     * Convert a JSX child node to a DOMElement.
     */
    convertJSXChild(child, sourceFile, parent) {
        // Handle JSX text
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
        // Handle JSX elements
        if (BabelParser_1.types.isJSXElement(child)) {
            return this.convertJSXElement(child, sourceFile, parent);
        }
        // Handle JSX fragments
        if (BabelParser_1.types.isJSXFragment(child)) {
            return this.convertJSXFragment(child, sourceFile, parent);
        }
        // Handle JSX expressions: {variable}, {condition && <div />}
        if (BabelParser_1.types.isJSXExpressionContainer(child)) {
            const expr = child.expression;
            // Skip empty expressions and comments
            if (BabelParser_1.types.isJSXEmptyExpression(expr))
                return null;
            // Try to extract JSX from the expression
            return this.extractJSXElement(expr, sourceFile, parent);
        }
        return null;
    }
    /**
     * Get the tag name from a JSX identifier or member expression.
     */
    getTagName(name) {
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            return name.name;
        }
        if (BabelParser_1.types.isJSXMemberExpression(name)) {
            // Handle Foo.Bar → "Foo.Bar"
            return this.getJSXMemberExpressionName(name);
        }
        if (BabelParser_1.types.isJSXNamespacedName(name)) {
            // Handle svg:path → "svg:path"
            return `${name.namespace.name}:${name.name.name}`;
        }
        return 'unknown';
    }
    /**
     * Get the full name from a JSX member expression.
     */
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
    /**
     * Extract attributes from JSX opening element.
     */
    extractAttributes(attributes) {
        const attrs = {};
        for (const attr of attributes) {
            // Skip spread attributes for now
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
    /**
     * Get attribute name from JSX identifier or namespaced name.
     * Normalizes React JSX attribute names to HTML attribute names.
     */
    getAttributeName(name) {
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            // Normalize React JSX attributes to HTML attributes
            const jsxName = name.name;
            // className -> class
            if (jsxName === 'className')
                return 'class';
            // htmlFor -> for
            if (jsxName === 'htmlFor')
                return 'for';
            // tabIndex -> tabindex
            if (jsxName === 'tabIndex')
                return 'tabindex';
            // Remove 'on' prefix from event handlers (onClick -> click)
            // But don't convert them here - they're handled separately
            return jsxName;
        }
        // Handle namespaced attributes: xml:lang
        return `${name.namespace.name}:${name.name.name}`;
    }
    /**
     * Get attribute value from JSX attribute value.
     */
    getAttributeValue(value) {
        if (!value)
            return 'true'; // Boolean attributes
        if (BabelParser_1.types.isStringLiteral(value)) {
            return value.value;
        }
        if (BabelParser_1.types.isJSXExpressionContainer(value)) {
            const expr = value.expression;
            // String literal in expression: attr={"value"}
            if (BabelParser_1.types.isStringLiteral(expr)) {
                return expr.value;
            }
            // Boolean literal: attr={true}
            if (BabelParser_1.types.isBooleanLiteral(expr)) {
                return expr.value.toString();
            }
            // Numeric literal: tabindex={0}
            if (BabelParser_1.types.isNumericLiteral(expr)) {
                return expr.value.toString();
            }
            // For complex expressions, return placeholder
            return '{expression}';
        }
        return null;
    }
    /**
     * Check if a tag name represents a React component.
     * React components start with uppercase letters.
     */
    isReactComponent(tagName) {
        return /^[A-Z]/.test(tagName);
    }
    /**
     * Extract source location from an AST node.
     */
    extractLocation(node, sourceFile) {
        const loc = node.loc;
        return {
            file: sourceFile,
            line: loc?.start.line || 0,
            column: loc?.start.column || 0,
            length: node.end && node.start ? node.end - node.start : undefined,
        };
    }
    /**
     * Generate a unique ID for an element.
     */
    generateId() {
        return `dom_${++this.elementCounter}`;
    }
}
exports.JSXDOMExtractor = JSXDOMExtractor;
/**
 * Extract virtual DOM from JSX source code.
 *
 * @param source - JSX/TSX source code
 * @param sourceFile - Filename for error reporting
 * @returns DOMModel or null if no JSX found
 *
 * @example
 * ```typescript
 * const domModel = extractJSXDOM(`
 *   function Button() {
 *     return <button id="submit">Click me</button>;
 *   }
 * `, 'Button.tsx');
 *
 * const button = domModel?.getElementById('submit');
 * ```
 */
function extractJSXDOM(source, sourceFile) {
    const extractor = new JSXDOMExtractor();
    return extractor.extract(source, sourceFile);
}
//# sourceMappingURL=JSXDOMExtractor.js.map