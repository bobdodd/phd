"use strict";
/**
 * React Pattern Detector
 *
 * This module detects React-specific patterns that affect accessibility:
 * - Hooks: useState, useRef, useEffect
 * - Refs: ref={buttonRef}, buttonRef.current.focus()
 * - State management: ARIA state controlled by useState
 * - Effects: Focus management in useEffect
 * - Conditional rendering: {isOpen && <Dialog />}
 *
 * These patterns are important for accessibility analysis because they
 * represent dynamic behaviors that can't be detected by static HTML analysis.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactPatternDetector = void 0;
exports.analyzeReactComponent = analyzeReactComponent;
const BabelParser_1 = require("./BabelParser");
/**
 * React Pattern Detector
 *
 * Analyzes React code to detect patterns relevant to accessibility analysis.
 */
class ReactPatternDetector {
    constructor() {
        this.hooks = [];
        this.refs = [];
        this.focusManagement = [];
        this.syntheticEvents = [];
        this.portals = [];
        this.contexts = [];
    }
    /**
     * Analyze React code and detect patterns.
     *
     * @param ast - Babel AST to analyze
     * @param sourceFile - Filename for error reporting
     */
    analyze(ast, sourceFile) {
        this.hooks = [];
        this.refs = [];
        this.focusManagement = [];
        this.syntheticEvents = [];
        this.portals = [];
        this.contexts = [];
        (0, BabelParser_1.traverseAST)(ast, {
            // Detect hook calls: useState, useRef, useEffect, etc.
            CallExpression: (path) => {
                this.detectHook(path, sourceFile);
                this.detectRefFocusManagement(path, sourceFile);
                this.detectPortal(path, sourceFile);
                this.detectForwardRef(path, sourceFile);
                this.detectContext(path, sourceFile);
            },
            // Detect ref assignments in JSX: ref={buttonRef}
            JSXAttribute: (path) => {
                this.detectRefProp(path, sourceFile);
            },
            // Detect Context.Provider in JSX
            JSXElement: (path) => {
                this.detectContextProvider(path, sourceFile);
            },
            // Detect event handler functions to analyze synthetic event usage
            ArrowFunctionExpression: (path) => {
                this.detectSyntheticEventUsage(path, sourceFile);
            },
            FunctionExpression: (path) => {
                this.detectSyntheticEventUsage(path, sourceFile);
            },
        });
    }
    /**
     * Detect React hook calls.
     * Enhanced to support:
     * - All standard hooks (useState, useEffect, useRef, useCallback, useMemo, etc.)
     * - Custom hooks (any function starting with "use")
     * - Array and object destructuring patterns
     */
    detectHook(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        // Check if callee is a hook (starts with "use")
        if (!BabelParser_1.types.isIdentifier(callee))
            return;
        if (!callee.name.startsWith('use'))
            return;
        const hookName = callee.name;
        // Try to extract variable name from parent declaration
        let variableName = null;
        const parent = path.parent;
        if (BabelParser_1.types.isVariableDeclarator(parent) && BabelParser_1.types.isIdentifier(parent.id)) {
            variableName = parent.id.name;
        }
        else if (BabelParser_1.types.isVariableDeclarator(parent) && BabelParser_1.types.isArrayPattern(parent.id)) {
            // Handle array destructuring: const [state, setState] = useState()
            const elements = parent.id.elements;
            if (elements.length > 0 && elements[0] && BabelParser_1.types.isIdentifier(elements[0])) {
                variableName = elements[0].name;
            }
        }
        else if (BabelParser_1.types.isVariableDeclarator(parent) && BabelParser_1.types.isObjectPattern(parent.id)) {
            // Handle object destructuring: const { data, loading } = useFetch()
            const properties = parent.id.properties;
            if (properties.length > 0 && BabelParser_1.types.isObjectProperty(properties[0])) {
                const prop = properties[0];
                if (BabelParser_1.types.isIdentifier(prop.value)) {
                    variableName = prop.value.name;
                }
            }
        }
        this.hooks.push({
            hookName,
            variableName,
            arguments: node.arguments,
            location: this.extractLocation(node, sourceFile),
        });
    }
    /**
     * Detect ref-based focus management: buttonRef.current.focus()
     */
    detectRefFocusManagement(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        // Check for pattern: ref.current.focus() or ref.current.blur()
        if (!BabelParser_1.types.isMemberExpression(callee))
            return;
        if (!BabelParser_1.types.isIdentifier(callee.property))
            return;
        const methodName = callee.property.name;
        if (methodName !== 'focus' && methodName !== 'blur')
            return;
        // Check if object is ref.current
        const object = callee.object;
        if (!BabelParser_1.types.isMemberExpression(object))
            return;
        if (!BabelParser_1.types.isIdentifier(object.property))
            return;
        if (object.property.name !== 'current')
            return;
        if (!BabelParser_1.types.isIdentifier(object.object))
            return;
        const refName = object.object.name;
        // Record ref usage
        this.refs.push({
            refName,
            type: 'current',
            location: this.extractLocation(node, sourceFile),
        });
        // Record focus management action
        const focusNode = {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'focusChange',
            element: {
                selector: `[ref="${refName}"]`,
                binding: refName,
            },
            timing: 'immediate',
            location: this.extractLocation(node, sourceFile),
            metadata: {
                method: methodName,
                framework: 'react',
                refBased: true,
            },
        };
        this.focusManagement.push(focusNode);
    }
    /**
     * Detect ref prop in JSX: <button ref={buttonRef}>
     */
    detectRefProp(path, sourceFile) {
        const attr = path.node;
        const name = attr.name;
        if (!BabelParser_1.types.isJSXIdentifier(name))
            return;
        if (name.name !== 'ref')
            return;
        const value = attr.value;
        if (!value)
            return;
        let refName = null;
        // Handle ref={buttonRef}
        if (BabelParser_1.types.isJSXExpressionContainer(value)) {
            const expression = value.expression;
            if (BabelParser_1.types.isIdentifier(expression)) {
                refName = expression.name;
            }
        }
        if (!refName)
            return;
        this.refs.push({
            refName,
            type: 'prop',
            location: this.extractLocation(attr, sourceFile),
        });
    }
    /**
     * Detect synthetic event usage in event handlers.
     * Tracks methods like preventDefault, stopPropagation, and property access.
     */
    detectSyntheticEventUsage(path, sourceFile) {
        const func = path.node;
        const params = func.params;
        // Check if this is likely an event handler (first param named e, event, evt, etc.)
        if (params.length === 0)
            return;
        const firstParam = params[0];
        if (!BabelParser_1.types.isIdentifier(firstParam))
            return;
        const paramName = firstParam.name;
        const isEventParam = /^(e|event|evt|ev)$/i.test(paramName);
        if (!isEventParam)
            return;
        const methodsCalled = new Set();
        const propertiesAccessed = new Set();
        const accessibilityConcerns = [];
        // Traverse the function body to find event method calls and property access
        path.traverse({
            CallExpression(innerPath) {
                const callee = innerPath.node.callee;
                // Detect: e.preventDefault(), e.stopPropagation(), etc.
                if (BabelParser_1.types.isMemberExpression(callee) &&
                    BabelParser_1.types.isIdentifier(callee.object) &&
                    callee.object.name === paramName &&
                    BabelParser_1.types.isIdentifier(callee.property)) {
                    const methodName = callee.property.name;
                    methodsCalled.add(methodName);
                    // Flag accessibility concerns
                    if (methodName === 'stopPropagation') {
                        accessibilityConcerns.push('stopPropagation() can prevent assistive technology from receiving events');
                    }
                    if (methodName === 'stopImmediatePropagation') {
                        accessibilityConcerns.push('stopImmediatePropagation() can block accessibility event listeners');
                    }
                }
            },
            MemberExpression(innerPath) {
                const node = innerPath.node;
                // Detect: e.target, e.key, e.currentTarget, etc.
                if (BabelParser_1.types.isIdentifier(node.object) &&
                    node.object.name === paramName &&
                    BabelParser_1.types.isIdentifier(node.property)) {
                    const propName = node.property.name;
                    propertiesAccessed.add(propName);
                    // Track keyboard event properties
                    if (propName === 'key' || propName === 'keyCode' || propName === 'which') {
                        // Good: checking keyboard events for accessibility
                    }
                }
            },
        });
        if (methodsCalled.size > 0 || propertiesAccessed.size > 0) {
            this.syntheticEvents.push({
                eventParamName: paramName,
                methodsCalled: Array.from(methodsCalled),
                propertiesAccessed: Array.from(propertiesAccessed),
                location: this.extractLocation(func, sourceFile),
                accessibilityConcerns,
            });
        }
    }
    /**
     * Detect React portals: ReactDOM.createPortal(children, container)
     *
     * Portals can create accessibility issues because they render content
     * outside the parent component's DOM hierarchy, which can break:
     * - Focus management (focus trap patterns)
     * - ARIA relationships (aria-labelledby, aria-controls crossing boundaries)
     * - Keyboard navigation (tab order disconnected from visual order)
     * - Screen reader context (announced out of visual context)
     */
    detectPortal(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        // Detect: ReactDOM.createPortal(children, container)
        if (BabelParser_1.types.isMemberExpression(callee) &&
            BabelParser_1.types.isIdentifier(callee.object) &&
            callee.object.name === 'ReactDOM' &&
            BabelParser_1.types.isIdentifier(callee.property) &&
            callee.property.name === 'createPortal') {
            const args = node.arguments;
            if (args.length < 2)
                return;
            const children = args[0];
            let container = null;
            const accessibilityConcerns = [];
            // Try to extract container identifier
            const containerArg = args[1];
            if (BabelParser_1.types.isIdentifier(containerArg)) {
                container = containerArg.name;
            }
            else if (BabelParser_1.types.isStringLiteral(containerArg)) {
                container = containerArg.value;
            }
            else if (BabelParser_1.types.isMemberExpression(containerArg)) {
                // Handle: document.body, document.documentElement, etc.
                if (BabelParser_1.types.isIdentifier(containerArg.object) &&
                    BabelParser_1.types.isIdentifier(containerArg.property)) {
                    container = `${containerArg.object.name}.${containerArg.property.name}`;
                }
            }
            else if (BabelParser_1.types.isCallExpression(containerArg) &&
                BabelParser_1.types.isMemberExpression(containerArg.callee) &&
                BabelParser_1.types.isIdentifier(containerArg.callee.property)) {
                // Handle: document.getElementById('portal-root')
                if (containerArg.callee.property.name === 'getElementById') {
                    const idArg = containerArg.arguments[0];
                    if (BabelParser_1.types.isStringLiteral(idArg)) {
                        container = `#${idArg.value}`;
                    }
                }
                else if (containerArg.callee.property.name === 'querySelector') {
                    const selectorArg = containerArg.arguments[0];
                    if (BabelParser_1.types.isStringLiteral(selectorArg)) {
                        container = selectorArg.value;
                    }
                }
            }
            // Flag accessibility concerns
            accessibilityConcerns.push('Portal renders content outside parent component hierarchy - may break focus management');
            accessibilityConcerns.push('ARIA relationships (aria-labelledby, aria-controls) may not work across portal boundary');
            accessibilityConcerns.push('Keyboard navigation order may not match visual order');
            this.portals.push({
                children,
                container,
                location: this.extractLocation(node, sourceFile),
                accessibilityConcerns,
            });
        }
        // Also detect: createPortal from react-dom import
        // import { createPortal } from 'react-dom'
        if (BabelParser_1.types.isIdentifier(callee) && callee.name === 'createPortal') {
            const args = node.arguments;
            if (args.length < 2)
                return;
            const children = args[0];
            let container = null;
            const accessibilityConcerns = [];
            const containerArg = args[1];
            if (BabelParser_1.types.isIdentifier(containerArg)) {
                container = containerArg.name;
            }
            else if (BabelParser_1.types.isStringLiteral(containerArg)) {
                container = containerArg.value;
            }
            else if (BabelParser_1.types.isMemberExpression(containerArg)) {
                // Handle: document.body, document.documentElement, etc.
                if (BabelParser_1.types.isIdentifier(containerArg.object) &&
                    BabelParser_1.types.isIdentifier(containerArg.property)) {
                    container = `${containerArg.object.name}.${containerArg.property.name}`;
                }
            }
            else if (BabelParser_1.types.isCallExpression(containerArg) &&
                BabelParser_1.types.isMemberExpression(containerArg.callee) &&
                BabelParser_1.types.isIdentifier(containerArg.callee.property)) {
                // Handle: document.getElementById('portal-root')
                if (containerArg.callee.property.name === 'getElementById') {
                    const idArg = containerArg.arguments[0];
                    if (BabelParser_1.types.isStringLiteral(idArg)) {
                        container = `#${idArg.value}`;
                    }
                }
                else if (containerArg.callee.property.name === 'querySelector') {
                    const selectorArg = containerArg.arguments[0];
                    if (BabelParser_1.types.isStringLiteral(selectorArg)) {
                        container = selectorArg.value;
                    }
                }
            }
            accessibilityConcerns.push('Portal renders content outside parent component hierarchy - may break focus management');
            accessibilityConcerns.push('ARIA relationships may not work across portal boundary');
            accessibilityConcerns.push('Keyboard navigation order may not match visual order');
            this.portals.push({
                children,
                container,
                location: this.extractLocation(node, sourceFile),
                accessibilityConcerns,
            });
        }
    }
    /**
     * Detect React.forwardRef() for ref forwarding between components.
     *
     * forwardRef allows parent components to pass refs to child components,
     * which is important for accessibility patterns like focus management.
     *
     * Example:
     * const Button = React.forwardRef((props, ref) => (
     *   <button ref={ref}>Click</button>
     * ));
     */
    detectForwardRef(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        // Detect: React.forwardRef(...) or forwardRef(...)
        const isForwardRef = (BabelParser_1.types.isMemberExpression(callee) &&
            BabelParser_1.types.isIdentifier(callee.object) &&
            callee.object.name === 'React' &&
            BabelParser_1.types.isIdentifier(callee.property) &&
            callee.property.name === 'forwardRef') ||
            (BabelParser_1.types.isIdentifier(callee) && callee.name === 'forwardRef');
        if (!isForwardRef)
            return;
        const args = node.arguments;
        if (args.length === 0)
            return;
        const componentArg = args[0];
        // Extract component name from parent declaration
        let componentName;
        const parent = path.parent;
        if (BabelParser_1.types.isVariableDeclarator(parent) && BabelParser_1.types.isIdentifier(parent.id)) {
            componentName = parent.id.name;
        }
        // Check if the forwarded component function has a ref parameter
        if (BabelParser_1.types.isArrowFunctionExpression(componentArg) ||
            BabelParser_1.types.isFunctionExpression(componentArg)) {
            const params = componentArg.params;
            if (params.length >= 2) {
                const refParam = params[1];
                if (BabelParser_1.types.isIdentifier(refParam)) {
                    this.refs.push({
                        refName: refParam.name,
                        type: 'forwarded',
                        location: this.extractLocation(node, sourceFile),
                        metadata: {
                            componentName,
                        },
                    });
                    // Also check for useImperativeHandle inside the component
                    this.detectUseImperativeHandle(componentArg, refParam.name, sourceFile);
                }
            }
        }
    }
    /**
     * Detect useImperativeHandle hook for customizing ref behavior.
     *
     * useImperativeHandle allows components to customize what values are exposed
     * to parent components via refs, which is important for encapsulating focus
     * management and other accessibility behaviors.
     *
     * Example:
     * useImperativeHandle(ref, () => ({
     *   focus: () => inputRef.current.focus(),
     *   blur: () => inputRef.current.blur()
     * }));
     */
    detectUseImperativeHandle(component, refParamName, sourceFile) {
        // Traverse the component function body to find useImperativeHandle calls
        if (!BabelParser_1.types.isBlockStatement(component.body))
            return;
        for (const statement of component.body.body) {
            if (BabelParser_1.types.isExpressionStatement(statement) &&
                BabelParser_1.types.isCallExpression(statement.expression)) {
                const call = statement.expression;
                const callee = call.callee;
                if (BabelParser_1.types.isIdentifier(callee) && callee.name === 'useImperativeHandle') {
                    const args = call.arguments;
                    if (args.length >= 2) {
                        // First arg should be the ref
                        const refArg = args[0];
                        if (BabelParser_1.types.isIdentifier(refArg) && refArg.name === refParamName) {
                            // Second arg is the function that returns exposed methods
                            const methodsArg = args[1];
                            const exposedMethods = [];
                            // Try to extract method names from arrow function
                            if (BabelParser_1.types.isArrowFunctionExpression(methodsArg)) {
                                const returnValue = methodsArg.body;
                                if (BabelParser_1.types.isObjectExpression(returnValue)) {
                                    for (const prop of returnValue.properties) {
                                        if (BabelParser_1.types.isObjectProperty(prop) &&
                                            BabelParser_1.types.isIdentifier(prop.key)) {
                                            exposedMethods.push(prop.key.name);
                                        }
                                    }
                                }
                            }
                            this.refs.push({
                                refName: refParamName,
                                type: 'imperative',
                                location: this.extractLocation(call, sourceFile),
                                metadata: {
                                    exposedMethods: exposedMethods.length > 0 ? exposedMethods : undefined,
                                },
                            });
                        }
                    }
                }
            }
        }
    }
    /**
     * Detect useContext() hook for consuming context.
     *
     * Context is often used for managing global accessibility state like:
     * - Theme preferences (dark mode, high contrast)
     * - Focus management state
     * - Announcement/notification state for screen readers
     * - Keyboard navigation mode
     *
     * Example:
     * const { theme, setTheme } = useContext(ThemeContext);
     * const { announce } = useContext(AccessibilityContext);
     */
    detectContext(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        // Detect: useContext(SomeContext)
        if (BabelParser_1.types.isIdentifier(callee) && callee.name === 'useContext') {
            const args = node.arguments;
            if (args.length === 0)
                return;
            const contextArg = args[0];
            let contextName;
            if (BabelParser_1.types.isIdentifier(contextArg)) {
                contextName = contextArg.name;
            }
            if (!contextName)
                return;
            // Check if context name suggests accessibility usage
            const isAccessibilityRelated = this.isAccessibilityRelatedContext(contextName);
            // Try to extract accessed properties from parent destructuring
            const accessedProperties = [];
            const parent = path.parent;
            if (BabelParser_1.types.isVariableDeclarator(parent)) {
                if (BabelParser_1.types.isObjectPattern(parent.id)) {
                    // const { theme, setTheme } = useContext(ThemeContext)
                    for (const prop of parent.id.properties) {
                        if (BabelParser_1.types.isObjectProperty(prop) && BabelParser_1.types.isIdentifier(prop.key)) {
                            accessedProperties.push(prop.key.name);
                        }
                    }
                }
            }
            this.contexts.push({
                contextName,
                type: 'useContext',
                location: this.extractLocation(node, sourceFile),
                metadata: {
                    accessedProperties: accessedProperties.length > 0 ? accessedProperties : undefined,
                    isAccessibilityRelated,
                },
            });
        }
    }
    /**
     * Detect Context.Provider in JSX.
     *
     * Providers supply context values to child components.
     *
     * Example:
     * <ThemeContext.Provider value={{ theme: 'dark' }}>
     *   <App />
     * </ThemeContext.Provider>
     */
    detectContextProvider(path, sourceFile) {
        const opening = path.node.openingElement;
        const name = opening.name;
        // Check for pattern: SomeContext.Provider
        if (BabelParser_1.types.isJSXMemberExpression(name)) {
            if (BabelParser_1.types.isJSXIdentifier(name.object) &&
                BabelParser_1.types.isJSXIdentifier(name.property) &&
                name.property.name === 'Provider') {
                const contextName = name.object.name;
                const isAccessibilityRelated = this.isAccessibilityRelatedContext(contextName);
                // Try to extract the value prop
                let providedValue;
                for (const attr of opening.attributes) {
                    if (BabelParser_1.types.isJSXAttribute(attr) &&
                        BabelParser_1.types.isJSXIdentifier(attr.name) &&
                        attr.name.name === 'value') {
                        providedValue = attr.value;
                        break;
                    }
                }
                this.contexts.push({
                    contextName,
                    type: 'provider',
                    location: this.extractLocation(path.node, sourceFile),
                    metadata: {
                        providedValue,
                        isAccessibilityRelated,
                    },
                });
            }
        }
        // Also check for pattern: <SomeContext.Consumer>
        if (BabelParser_1.types.isJSXMemberExpression(name)) {
            if (BabelParser_1.types.isJSXIdentifier(name.object) &&
                BabelParser_1.types.isJSXIdentifier(name.property) &&
                name.property.name === 'Consumer') {
                const contextName = name.object.name;
                const isAccessibilityRelated = this.isAccessibilityRelatedContext(contextName);
                this.contexts.push({
                    contextName,
                    type: 'consumer',
                    location: this.extractLocation(path.node, sourceFile),
                    metadata: {
                        isAccessibilityRelated,
                    },
                });
            }
        }
    }
    /**
     * Check if a context name suggests accessibility-related usage.
     */
    isAccessibilityRelatedContext(contextName) {
        const a11yKeywords = [
            'accessibility',
            'a11y',
            'theme',
            'focus',
            'keyboard',
            'announce',
            'notification',
            'alert',
            'aria',
            'screen',
            'reader',
        ];
        const lowerName = contextName.toLowerCase();
        return a11yKeywords.some((keyword) => lowerName.includes(keyword));
    }
    /**
     * Get detected hooks.
     */
    getHooks() {
        return this.hooks;
    }
    /**
     * Get detected refs.
     */
    getRefs() {
        return this.refs;
    }
    /**
     * Get forwarded refs (from forwardRef).
     */
    getForwardedRefs() {
        return this.refs.filter((r) => r.type === 'forwarded');
    }
    /**
     * Get imperative handle refs (from useImperativeHandle).
     */
    getImperativeRefs() {
        return this.refs.filter((r) => r.type === 'imperative');
    }
    /**
     * Check if component uses ref forwarding.
     */
    usesRefForwarding() {
        return this.refs.some((r) => r.type === 'forwarded');
    }
    /**
     * Check if component uses useImperativeHandle.
     */
    usesImperativeHandle() {
        return this.refs.some((r) => r.type === 'imperative');
    }
    /**
     * Get detected focus management actions.
     */
    getFocusManagement() {
        return this.focusManagement;
    }
    /**
     * Check if a specific hook is used.
     */
    hasHook(hookName) {
        return this.hooks.some((h) => h.hookName === hookName);
    }
    /**
     * Get all useState hooks.
     */
    getStateHooks() {
        return this.hooks.filter((h) => h.hookName === 'useState');
    }
    /**
     * Get all useRef hooks.
     */
    getRefHooks() {
        return this.hooks.filter((h) => h.hookName === 'useRef');
    }
    /**
     * Get all useEffect hooks.
     */
    getEffectHooks() {
        return this.hooks.filter((h) => h.hookName === 'useEffect');
    }
    /**
     * Get all useCallback hooks.
     * Useful for detecting memoized event handlers.
     */
    getCallbackHooks() {
        return this.hooks.filter((h) => h.hookName === 'useCallback');
    }
    /**
     * Get all useMemo hooks.
     * Useful for detecting memoized accessibility calculations.
     */
    getMemoHooks() {
        return this.hooks.filter((h) => h.hookName === 'useMemo');
    }
    /**
     * Get all custom hooks (hooks not from React standard library).
     */
    getCustomHooks() {
        const standardHooks = new Set([
            'useState',
            'useEffect',
            'useRef',
            'useCallback',
            'useMemo',
            'useContext',
            'useReducer',
            'useLayoutEffect',
            'useImperativeHandle',
            'useDebugValue',
            'useDeferredValue',
            'useTransition',
            'useId',
            'useSyncExternalStore',
            'useInsertionEffect',
        ]);
        return this.hooks.filter((h) => !standardHooks.has(h.hookName));
    }
    /**
     * Check if component uses any accessibility-related hooks.
     * Includes custom hooks that might manage accessibility state.
     */
    hasAccessibilityHooks() {
        const a11yKeywords = ['aria', 'focus', 'keyboard', 'accessible', 'a11y'];
        return this.hooks.some((h) => a11yKeywords.some((keyword) => h.hookName.toLowerCase().includes(keyword)));
    }
    /**
     * Get detected synthetic events.
     */
    getSyntheticEvents() {
        return this.syntheticEvents;
    }
    /**
     * Get synthetic events with accessibility concerns.
     */
    getProblematicSyntheticEvents() {
        return this.syntheticEvents.filter((e) => e.accessibilityConcerns.length > 0);
    }
    /**
     * Check if any event handlers use stopPropagation (potential accessibility issue).
     */
    usesStopPropagation() {
        return this.syntheticEvents.some((e) => e.methodsCalled.includes('stopPropagation') ||
            e.methodsCalled.includes('stopImmediatePropagation'));
    }
    /**
     * Get detected portals.
     */
    getPortals() {
        return this.portals;
    }
    /**
     * Check if component uses any portals.
     */
    usesPortals() {
        return this.portals.length > 0;
    }
    /**
     * Get portals with accessibility concerns.
     * (All portals have potential accessibility concerns by nature)
     */
    getProblematicPortals() {
        return this.portals.filter((p) => p.accessibilityConcerns.length > 0);
    }
    /**
     * Get detected contexts.
     */
    getContexts() {
        return this.contexts;
    }
    /**
     * Get context providers.
     */
    getContextProviders() {
        return this.contexts.filter((c) => c.type === 'provider');
    }
    /**
     * Get context consumers (useContext + Context.Consumer).
     */
    getContextConsumers() {
        return this.contexts.filter((c) => c.type === 'useContext' || c.type === 'consumer');
    }
    /**
     * Get accessibility-related contexts.
     */
    getAccessibilityContexts() {
        return this.contexts.filter((c) => c.metadata?.isAccessibilityRelated);
    }
    /**
     * Check if component uses context.
     */
    usesContext() {
        return this.contexts.length > 0;
    }
    /**
     * Check if component uses accessibility-related context.
     */
    usesAccessibilityContext() {
        return this.contexts.some((c) => c.metadata?.isAccessibilityRelated);
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
     * Generate a unique ID.
     */
    generateId() {
        return `react_pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.ReactPatternDetector = ReactPatternDetector;
/**
 * Analyze React component for accessibility-relevant patterns.
 *
 * @param source - React component source code
 * @param sourceFile - Filename for error reporting
 * @returns Pattern detection results
 *
 * @example
 * ```typescript
 * const results = analyzeReactComponent(`
 *   function Dialog() {
 *     const [isOpen, setIsOpen] = useState(false);
 *     const closeButtonRef = useRef(null);
 *
 *     useEffect(() => {
 *       if (isOpen) {
 *         closeButtonRef.current.focus();
 *       }
 *     }, [isOpen]);
 *
 *     return (
 *       <dialog open={isOpen}>
 *         <button ref={closeButtonRef} onClick={() => setIsOpen(false)}>
 *           Close
 *         </button>
 *       </dialog>
 *     );
 *   }
 * `, 'Dialog.tsx');
 *
 * console.log(results.hooks); // [{ hookName: 'useState', ... }, { hookName: 'useRef', ... }]
 * console.log(results.refs); // [{ refName: 'closeButtonRef', type: 'prop', ... }]
 * ```
 */
function analyzeReactComponent(source, sourceFile) {
    const { parseSource } = require('./BabelParser');
    const ast = parseSource(source, sourceFile);
    const detector = new ReactPatternDetector();
    detector.analyze(ast, sourceFile);
    return {
        hooks: detector.getHooks(),
        refs: detector.getRefs(),
        focusManagement: detector.getFocusManagement(),
        syntheticEvents: detector.getSyntheticEvents(),
        portals: detector.getPortals(),
        contexts: detector.getContexts(),
    };
}
//# sourceMappingURL=ReactPatternDetector.js.map