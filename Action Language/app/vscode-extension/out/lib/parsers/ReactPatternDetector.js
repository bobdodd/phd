"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactPatternDetector = void 0;
exports.analyzeReactComponent = analyzeReactComponent;
const BabelParser_1 = require("./BabelParser");
class ReactPatternDetector {
    constructor() {
        this.hooks = [];
        this.refs = [];
        this.focusManagement = [];
        this.syntheticEvents = [];
        this.portals = [];
        this.contexts = [];
    }
    analyze(ast, sourceFile) {
        this.hooks = [];
        this.refs = [];
        this.focusManagement = [];
        this.syntheticEvents = [];
        this.portals = [];
        this.contexts = [];
        (0, BabelParser_1.traverseAST)(ast, {
            CallExpression: (path) => {
                this.detectHook(path, sourceFile);
                this.detectRefFocusManagement(path, sourceFile);
                this.detectPortal(path, sourceFile);
                this.detectForwardRef(path, sourceFile);
                this.detectContext(path, sourceFile);
            },
            JSXAttribute: (path) => {
                this.detectRefProp(path, sourceFile);
            },
            JSXElement: (path) => {
                this.detectContextProvider(path, sourceFile);
            },
            ArrowFunctionExpression: (path) => {
                this.detectSyntheticEventUsage(path, sourceFile);
            },
            FunctionExpression: (path) => {
                this.detectSyntheticEventUsage(path, sourceFile);
            },
        });
    }
    detectHook(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        if (!BabelParser_1.types.isIdentifier(callee))
            return;
        if (!callee.name.startsWith('use'))
            return;
        const hookName = callee.name;
        let variableName = null;
        const parent = path.parent;
        if (BabelParser_1.types.isVariableDeclarator(parent) && BabelParser_1.types.isIdentifier(parent.id)) {
            variableName = parent.id.name;
        }
        else if (BabelParser_1.types.isVariableDeclarator(parent) && BabelParser_1.types.isArrayPattern(parent.id)) {
            const elements = parent.id.elements;
            if (elements.length > 0 && elements[0] && BabelParser_1.types.isIdentifier(elements[0])) {
                variableName = elements[0].name;
            }
        }
        else if (BabelParser_1.types.isVariableDeclarator(parent) && BabelParser_1.types.isObjectPattern(parent.id)) {
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
    detectRefFocusManagement(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
        if (!BabelParser_1.types.isMemberExpression(callee))
            return;
        if (!BabelParser_1.types.isIdentifier(callee.property))
            return;
        const methodName = callee.property.name;
        if (methodName !== 'focus' && methodName !== 'blur')
            return;
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
        this.refs.push({
            refName,
            type: 'current',
            location: this.extractLocation(node, sourceFile),
        });
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
    detectSyntheticEventUsage(path, sourceFile) {
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
        const methodsCalled = new Set();
        const propertiesAccessed = new Set();
        const accessibilityConcerns = [];
        path.traverse({
            CallExpression(innerPath) {
                const callee = innerPath.node.callee;
                if (BabelParser_1.types.isMemberExpression(callee) &&
                    BabelParser_1.types.isIdentifier(callee.object) &&
                    callee.object.name === paramName &&
                    BabelParser_1.types.isIdentifier(callee.property)) {
                    const methodName = callee.property.name;
                    methodsCalled.add(methodName);
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
                if (BabelParser_1.types.isIdentifier(node.object) &&
                    node.object.name === paramName &&
                    BabelParser_1.types.isIdentifier(node.property)) {
                    const propName = node.property.name;
                    propertiesAccessed.add(propName);
                    if (propName === 'key' || propName === 'keyCode' || propName === 'which') {
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
    detectPortal(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
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
            const containerArg = args[1];
            if (BabelParser_1.types.isIdentifier(containerArg)) {
                container = containerArg.name;
            }
            else if (BabelParser_1.types.isStringLiteral(containerArg)) {
                container = containerArg.value;
            }
            else if (BabelParser_1.types.isMemberExpression(containerArg)) {
                if (BabelParser_1.types.isIdentifier(containerArg.object) &&
                    BabelParser_1.types.isIdentifier(containerArg.property)) {
                    container = `${containerArg.object.name}.${containerArg.property.name}`;
                }
            }
            else if (BabelParser_1.types.isCallExpression(containerArg) &&
                BabelParser_1.types.isMemberExpression(containerArg.callee) &&
                BabelParser_1.types.isIdentifier(containerArg.callee.property)) {
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
            accessibilityConcerns.push('ARIA relationships (aria-labelledby, aria-controls) may not work across portal boundary');
            accessibilityConcerns.push('Keyboard navigation order may not match visual order');
            this.portals.push({
                children,
                container,
                location: this.extractLocation(node, sourceFile),
                accessibilityConcerns,
            });
        }
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
                if (BabelParser_1.types.isIdentifier(containerArg.object) &&
                    BabelParser_1.types.isIdentifier(containerArg.property)) {
                    container = `${containerArg.object.name}.${containerArg.property.name}`;
                }
            }
            else if (BabelParser_1.types.isCallExpression(containerArg) &&
                BabelParser_1.types.isMemberExpression(containerArg.callee) &&
                BabelParser_1.types.isIdentifier(containerArg.callee.property)) {
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
    detectForwardRef(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
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
        let componentName;
        const parent = path.parent;
        if (BabelParser_1.types.isVariableDeclarator(parent) && BabelParser_1.types.isIdentifier(parent.id)) {
            componentName = parent.id.name;
        }
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
                    this.detectUseImperativeHandle(componentArg, refParam.name, sourceFile);
                }
            }
        }
    }
    detectUseImperativeHandle(component, refParamName, sourceFile) {
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
                        const refArg = args[0];
                        if (BabelParser_1.types.isIdentifier(refArg) && refArg.name === refParamName) {
                            const methodsArg = args[1];
                            const exposedMethods = [];
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
    detectContext(path, sourceFile) {
        const node = path.node;
        const callee = node.callee;
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
            const isAccessibilityRelated = this.isAccessibilityRelatedContext(contextName);
            const accessedProperties = [];
            const parent = path.parent;
            if (BabelParser_1.types.isVariableDeclarator(parent)) {
                if (BabelParser_1.types.isObjectPattern(parent.id)) {
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
    detectContextProvider(path, sourceFile) {
        const opening = path.node.openingElement;
        const name = opening.name;
        if (BabelParser_1.types.isJSXMemberExpression(name)) {
            if (BabelParser_1.types.isJSXIdentifier(name.object) &&
                BabelParser_1.types.isJSXIdentifier(name.property) &&
                name.property.name === 'Provider') {
                const contextName = name.object.name;
                const isAccessibilityRelated = this.isAccessibilityRelatedContext(contextName);
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
    getHooks() {
        return this.hooks;
    }
    getRefs() {
        return this.refs;
    }
    getForwardedRefs() {
        return this.refs.filter((r) => r.type === 'forwarded');
    }
    getImperativeRefs() {
        return this.refs.filter((r) => r.type === 'imperative');
    }
    usesRefForwarding() {
        return this.refs.some((r) => r.type === 'forwarded');
    }
    usesImperativeHandle() {
        return this.refs.some((r) => r.type === 'imperative');
    }
    getFocusManagement() {
        return this.focusManagement;
    }
    hasHook(hookName) {
        return this.hooks.some((h) => h.hookName === hookName);
    }
    getStateHooks() {
        return this.hooks.filter((h) => h.hookName === 'useState');
    }
    getRefHooks() {
        return this.hooks.filter((h) => h.hookName === 'useRef');
    }
    getEffectHooks() {
        return this.hooks.filter((h) => h.hookName === 'useEffect');
    }
    getCallbackHooks() {
        return this.hooks.filter((h) => h.hookName === 'useCallback');
    }
    getMemoHooks() {
        return this.hooks.filter((h) => h.hookName === 'useMemo');
    }
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
    hasAccessibilityHooks() {
        const a11yKeywords = ['aria', 'focus', 'keyboard', 'accessible', 'a11y'];
        return this.hooks.some((h) => a11yKeywords.some((keyword) => h.hookName.toLowerCase().includes(keyword)));
    }
    getSyntheticEvents() {
        return this.syntheticEvents;
    }
    getProblematicSyntheticEvents() {
        return this.syntheticEvents.filter((e) => e.accessibilityConcerns.length > 0);
    }
    usesStopPropagation() {
        return this.syntheticEvents.some((e) => e.methodsCalled.includes('stopPropagation') ||
            e.methodsCalled.includes('stopImmediatePropagation'));
    }
    getPortals() {
        return this.portals;
    }
    usesPortals() {
        return this.portals.length > 0;
    }
    getProblematicPortals() {
        return this.portals.filter((p) => p.accessibilityConcerns.length > 0);
    }
    getContexts() {
        return this.contexts;
    }
    getContextProviders() {
        return this.contexts.filter((c) => c.type === 'provider');
    }
    getContextConsumers() {
        return this.contexts.filter((c) => c.type === 'useContext' || c.type === 'consumer');
    }
    getAccessibilityContexts() {
        return this.contexts.filter((c) => c.metadata?.isAccessibilityRelated);
    }
    usesContext() {
        return this.contexts.length > 0;
    }
    usesAccessibilityContext() {
        return this.contexts.some((c) => c.metadata?.isAccessibilityRelated);
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
        return `react_pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.ReactPatternDetector = ReactPatternDetector;
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
