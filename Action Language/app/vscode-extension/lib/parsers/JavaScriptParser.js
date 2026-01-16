"use strict";
/**
 * JavaScript/TypeScript/JSX Parser for ActionLanguage
 *
 * This parser extracts ActionLanguage nodes (UI interaction patterns) from
 * JavaScript, TypeScript, and JSX source code. It detects:
 * - Event handlers (addEventListener, JSX event props)
 * - DOM manipulation (setAttribute, focus, blur)
 * - ARIA updates (setAttribute with aria-*)
 * - Focus changes (element.focus(), ref.current.focus())
 * - Navigation (window.location, history.pushState)
 *
 * The parser uses Babel to handle JSX and TypeScript syntax.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptParser = void 0;
const BabelParser_1 = require("./BabelParser");
const ActionLanguageModel_1 = require("../models/ActionLanguageModel");
/**
 * JavaScript/TypeScript/JSX Parser
 *
 * Parses source code and extracts ActionLanguage nodes representing
 * UI interaction patterns.
 */
class JavaScriptParser {
    constructor() {
        this.nodeCounter = 0;
        this.variableBindings = new Map();
    }
    /**
     * Parse JavaScript/TypeScript/JSX source code into ActionLanguage model.
     *
     * @param source - Source code to parse
     * @param sourceFile - Filename for error reporting
     * @returns ActionLanguageModel
     *
     * @example
     * ```typescript
     * const parser = new JavaScriptParser();
     * const model = parser.parse(`
     *   const button = document.getElementById('submit');
     *   button.addEventListener('click', handleClick);
     * `, 'handlers.js');
     * ```
     */
    parse(source, sourceFile) {
        const nodes = [];
        this.variableBindings.clear();
        const ast = (0, BabelParser_1.parseSource)(source, sourceFile);
        // First pass: collect variable bindings
        (0, BabelParser_1.traverseAST)(ast, {
            VariableDeclarator: (path) => {
                this.collectVariableBinding(path);
            },
        });
        // Second pass: extract action patterns
        (0, BabelParser_1.traverseAST)(ast, {
            // Extract patterns from function calls
            CallExpression: (path) => {
                // Check for addEventListener
                if (this.isAddEventListener(path.node)) {
                    const node = this.extractEventHandler(path, sourceFile);
                    if (node)
                        nodes.push(node);
                }
                // Check for setAttribute with ARIA
                if (this.isSetAttribute(path.node)) {
                    const node = this.extractAriaUpdate(path, sourceFile);
                    if (node)
                        nodes.push(node);
                }
                // Check for focus/blur
                if (this.isFocusChange(path.node)) {
                    const node = this.extractFocusChange(path, sourceFile);
                    if (node)
                        nodes.push(node);
                }
            },
            // Extract event handlers from JSX (onClick, onKeyDown, etc.)
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
    /**
     * Check if a call expression is addEventListener.
     */
    isAddEventListener(node) {
        const { callee } = node;
        return (BabelParser_1.types.isMemberExpression(callee) &&
            BabelParser_1.types.isIdentifier(callee.property) &&
            callee.property.name === 'addEventListener');
    }
    /**
     * Check if a JSX attribute is an event handler (starts with "on").
     */
    isJSXEventHandler(node) {
        const { name } = node;
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            return name.name.startsWith('on') && name.name.length > 2;
        }
        return false;
    }
    /**
     * Check if a call expression is setAttribute.
     */
    isSetAttribute(node) {
        const { callee } = node;
        return (BabelParser_1.types.isMemberExpression(callee) &&
            BabelParser_1.types.isIdentifier(callee.property) &&
            callee.property.name === 'setAttribute');
    }
    /**
     * Check if a call expression is a focus change (focus(), blur()).
     */
    isFocusChange(node) {
        const { callee } = node;
        if (BabelParser_1.types.isMemberExpression(callee) && BabelParser_1.types.isIdentifier(callee.property)) {
            const methodName = callee.property.name;
            return methodName === 'focus' || methodName === 'blur';
        }
        return false;
    }
    /**
     * Extract event handler from addEventListener call.
     */
    extractEventHandler(path, sourceFile) {
        const node = path.node;
        const args = node.arguments;
        if (args.length < 2)
            return null;
        // Extract event type (first argument)
        const eventArg = args[0];
        let eventType;
        if (BabelParser_1.types.isStringLiteral(eventArg)) {
            eventType = eventArg.value;
        }
        if (!eventType)
            return null;
        // Extract element reference
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
            handler: args[1], // Store handler function/reference
            location: this.extractLocation(node, sourceFile),
            metadata: {
                framework: 'vanilla',
                synthetic: false,
            },
        };
    }
    /**
     * Extract event handler from JSX attribute (onClick, onKeyDown, etc.).
     */
    extractJSXEventHandler(path, sourceFile) {
        const attr = path.node;
        const name = attr.name;
        if (!BabelParser_1.types.isJSXIdentifier(name))
            return null;
        // Convert React event name to standard event name
        // onClick -> click, onKeyDown -> keydown
        const eventType = name.name.slice(2).toLowerCase();
        // Find the parent JSX element
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
    /**
     * Extract ARIA update from setAttribute call.
     */
    extractAriaUpdate(path, sourceFile) {
        const node = path.node;
        const args = node.arguments;
        if (args.length < 2)
            return null;
        // Check if first argument is an ARIA attribute
        const attrArg = args[0];
        if (!BabelParser_1.types.isStringLiteral(attrArg))
            return null;
        if (!attrArg.value.startsWith('aria-'))
            return null;
        // Extract element reference
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
    /**
     * Extract focus change from focus() or blur() call.
     */
    extractFocusChange(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        const methodName = callee.property.name;
        // Extract element reference
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
    /**
     * Collect variable bindings for element references.
     * Example: const button = document.getElementById('submit');
     */
    collectVariableBinding(path) {
        const node = path.node;
        const id = node.id;
        const init = node.init;
        // Only handle identifier bindings (not destructuring)
        if (!BabelParser_1.types.isIdentifier(id) || !init)
            return;
        const variableName = id.name;
        const elementRef = this.extractElementReferenceFromExpression(init);
        if (elementRef) {
            this.variableBindings.set(variableName, elementRef);
        }
    }
    /**
     * Extract element reference from an AST node.
     *
     * Handles patterns like:
     * - variable: button.addEventListener(...)
     * - getElementById: document.getElementById('submit')
     * - querySelector: document.querySelector('.nav-item')
     * - ref.current: buttonRef.current.focus()
     */
    extractElementReference(node) {
        // Handle variable reference: button.addEventListener(...)
        // Check if variable was bound to an element selector
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
    /**
     * Extract element reference from an expression.
     * This is the core logic for identifying DOM element selectors.
     */
    extractElementReferenceFromExpression(node) {
        // Handle ref.current: buttonRef.current.focus()
        if (BabelParser_1.types.isMemberExpression(node) &&
            BabelParser_1.types.isIdentifier(node.property) &&
            node.property.name === 'current' &&
            BabelParser_1.types.isIdentifier(node.object)) {
            return {
                selector: `[ref="${node.object.name}"]`,
                binding: node.object.name,
            };
        }
        // Handle document.getElementById('id')
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
            // Handle document.querySelector('.class')
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
    /**
     * Get the tag name from a JSX element.
     */
    getJSXTagName(element) {
        const opening = element.openingElement;
        const name = opening.name;
        if (BabelParser_1.types.isJSXIdentifier(name)) {
            return name.name;
        }
        if (BabelParser_1.types.isJSXMemberExpression(name)) {
            // Handle cases like <Foo.Bar>
            return this.getJSXMemberExpressionName(name);
        }
        return 'unknown';
    }
    /**
     * Get the full name from a JSX member expression (e.g., Foo.Bar.Baz).
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
     * Generate a unique ID for a node.
     */
    generateId() {
        return `action_${++this.nodeCounter}`;
    }
}
exports.JavaScriptParser = JavaScriptParser;
//# sourceMappingURL=JavaScriptParser.js.map