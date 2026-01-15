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

import { traverseAST, types as t, NodePath } from './BabelParser';
import { ActionLanguageNode } from '../models/ActionLanguageModel';
import { SourceLocation } from '../models/BaseModel';

/**
 * React hook usage information.
 */
export interface HookUsage {
  /** Hook name (useState, useRef, useEffect, etc.) */
  hookName: string;

  /** Variable name for the hook result */
  variableName: string | null;

  /** Arguments passed to the hook */
  arguments: any[];

  /** Source location */
  location: SourceLocation;
}

/**
 * React ref usage information.
 */
export interface RefUsage {
  /** Ref variable name */
  refName: string;

  /** Type of ref usage (creation, assignment, access) */
  type: 'creation' | 'prop' | 'current' | 'forwarded' | 'imperative';

  /** Source location */
  location: SourceLocation;

  /** Additional metadata */
  metadata?: {
    /** For forwarded refs: the component name */
    componentName?: string;
    /** For imperative handle: exposed methods */
    exposedMethods?: string[];
  };
}

/**
 * React synthetic event information.
 */
export interface SyntheticEventUsage {
  /** Event handler parameter name (e, event, etc.) */
  eventParamName: string;

  /** Methods called on the event (preventDefault, stopPropagation, etc.) */
  methodsCalled: string[];

  /** Properties accessed on the event (key, target, currentTarget, etc.) */
  propertiesAccessed: string[];

  /** Source location */
  location: SourceLocation;

  /** Accessibility concerns (e.g., stopPropagation blocks assistive tech) */
  accessibilityConcerns: string[];
}

/**
 * React portal usage information.
 * Portals render children into a DOM node outside the parent component hierarchy.
 */
export interface PortalUsage {
  /** Portal children (JSX content) */
  children: any;

  /** Target container node (DOM reference or selector) */
  container: string | null;

  /** Source location */
  location: SourceLocation;

  /** Accessibility concerns with portals */
  accessibilityConcerns: string[];
}

/**
 * React Pattern Detector
 *
 * Analyzes React code to detect patterns relevant to accessibility analysis.
 */
export class ReactPatternDetector {
  private hooks: HookUsage[] = [];
  private refs: RefUsage[] = [];
  private focusManagement: ActionLanguageNode[] = [];
  private syntheticEvents: SyntheticEventUsage[] = [];
  private portals: PortalUsage[] = [];

  /**
   * Analyze React code and detect patterns.
   *
   * @param ast - Babel AST to analyze
   * @param sourceFile - Filename for error reporting
   */
  analyze(ast: t.File, sourceFile: string): void {
    this.hooks = [];
    this.refs = [];
    this.focusManagement = [];
    this.syntheticEvents = [];
    this.portals = [];

    traverseAST(ast, {
      // Detect hook calls: useState, useRef, useEffect, etc.
      CallExpression: (path: NodePath<t.CallExpression>) => {
        this.detectHook(path, sourceFile);
        this.detectRefFocusManagement(path, sourceFile);
        this.detectPortal(path, sourceFile);
        this.detectForwardRef(path, sourceFile);
      },

      // Detect ref assignments in JSX: ref={buttonRef}
      JSXAttribute: (path: NodePath<t.JSXAttribute>) => {
        this.detectRefProp(path, sourceFile);
      },

      // Detect event handler functions to analyze synthetic event usage
      ArrowFunctionExpression: (path: NodePath<t.ArrowFunctionExpression>) => {
        this.detectSyntheticEventUsage(path, sourceFile);
      },

      FunctionExpression: (path: NodePath<t.FunctionExpression>) => {
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
  private detectHook(path: NodePath<t.CallExpression>, sourceFile: string): void {
    const node = path.node;
    const callee = node.callee;

    // Check if callee is a hook (starts with "use")
    if (!t.isIdentifier(callee)) return;
    if (!callee.name.startsWith('use')) return;

    const hookName = callee.name;

    // Try to extract variable name from parent declaration
    let variableName: string | null = null;
    const parent = path.parent;

    if (t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) {
      variableName = parent.id.name;
    } else if (t.isVariableDeclarator(parent) && t.isArrayPattern(parent.id)) {
      // Handle array destructuring: const [state, setState] = useState()
      const elements = parent.id.elements;
      if (elements.length > 0 && elements[0] && t.isIdentifier(elements[0])) {
        variableName = elements[0].name;
      }
    } else if (t.isVariableDeclarator(parent) && t.isObjectPattern(parent.id)) {
      // Handle object destructuring: const { data, loading } = useFetch()
      const properties = parent.id.properties;
      if (properties.length > 0 && t.isObjectProperty(properties[0])) {
        const prop = properties[0];
        if (t.isIdentifier(prop.value)) {
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
  private detectRefFocusManagement(
    path: NodePath<t.CallExpression>,
    sourceFile: string
  ): void {
    const node = path.node;
    const callee = node.callee;

    // Check for pattern: ref.current.focus() or ref.current.blur()
    if (!t.isMemberExpression(callee)) return;
    if (!t.isIdentifier(callee.property)) return;

    const methodName = callee.property.name;
    if (methodName !== 'focus' && methodName !== 'blur') return;

    // Check if object is ref.current
    const object = callee.object;
    if (!t.isMemberExpression(object)) return;
    if (!t.isIdentifier(object.property)) return;
    if (object.property.name !== 'current') return;
    if (!t.isIdentifier(object.object)) return;

    const refName = object.object.name;

    // Record ref usage
    this.refs.push({
      refName,
      type: 'current',
      location: this.extractLocation(node, sourceFile),
    });

    // Record focus management action
    const focusNode: ActionLanguageNode = {
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
  private detectRefProp(path: NodePath<t.JSXAttribute>, sourceFile: string): void {
    const attr = path.node;
    const name = attr.name;

    if (!t.isJSXIdentifier(name)) return;
    if (name.name !== 'ref') return;

    const value = attr.value;
    if (!value) return;

    let refName: string | null = null;

    // Handle ref={buttonRef}
    if (t.isJSXExpressionContainer(value)) {
      const expression = value.expression;
      if (t.isIdentifier(expression)) {
        refName = expression.name;
      }
    }

    if (!refName) return;

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
  private detectSyntheticEventUsage(
    path: NodePath<t.ArrowFunctionExpression | t.FunctionExpression>,
    sourceFile: string
  ): void {
    const func = path.node;
    const params = func.params;

    // Check if this is likely an event handler (first param named e, event, evt, etc.)
    if (params.length === 0) return;
    const firstParam = params[0];
    if (!t.isIdentifier(firstParam)) return;

    const paramName = firstParam.name;
    const isEventParam = /^(e|event|evt|ev)$/i.test(paramName);
    if (!isEventParam) return;

    const methodsCalled: Set<string> = new Set();
    const propertiesAccessed: Set<string> = new Set();
    const accessibilityConcerns: string[] = [];

    // Traverse the function body to find event method calls and property access
    path.traverse({
      CallExpression(innerPath: NodePath<t.CallExpression>) {
        const callee = innerPath.node.callee;

        // Detect: e.preventDefault(), e.stopPropagation(), etc.
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object) &&
          callee.object.name === paramName &&
          t.isIdentifier(callee.property)
        ) {
          const methodName = callee.property.name;
          methodsCalled.add(methodName);

          // Flag accessibility concerns
          if (methodName === 'stopPropagation') {
            accessibilityConcerns.push(
              'stopPropagation() can prevent assistive technology from receiving events'
            );
          }
          if (methodName === 'stopImmediatePropagation') {
            accessibilityConcerns.push(
              'stopImmediatePropagation() can block accessibility event listeners'
            );
          }
        }
      },

      MemberExpression(innerPath: NodePath<t.MemberExpression>) {
        const node = innerPath.node;

        // Detect: e.target, e.key, e.currentTarget, etc.
        if (
          t.isIdentifier(node.object) &&
          node.object.name === paramName &&
          t.isIdentifier(node.property)
        ) {
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
  private detectPortal(path: NodePath<t.CallExpression>, sourceFile: string): void {
    const node = path.node;
    const callee = node.callee;

    // Detect: ReactDOM.createPortal(children, container)
    if (
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.object) &&
      callee.object.name === 'ReactDOM' &&
      t.isIdentifier(callee.property) &&
      callee.property.name === 'createPortal'
    ) {
      const args = node.arguments;
      if (args.length < 2) return;

      const children = args[0];
      let container: string | null = null;
      const accessibilityConcerns: string[] = [];

      // Try to extract container identifier
      const containerArg = args[1];
      if (t.isIdentifier(containerArg)) {
        container = containerArg.name;
      } else if (t.isStringLiteral(containerArg)) {
        container = containerArg.value;
      } else if (
        t.isCallExpression(containerArg) &&
        t.isMemberExpression(containerArg.callee) &&
        t.isIdentifier(containerArg.callee.property)
      ) {
        // Handle: document.getElementById('portal-root')
        if (containerArg.callee.property.name === 'getElementById') {
          const idArg = containerArg.arguments[0];
          if (t.isStringLiteral(idArg)) {
            container = `#${idArg.value}`;
          }
        } else if (containerArg.callee.property.name === 'querySelector') {
          const selectorArg = containerArg.arguments[0];
          if (t.isStringLiteral(selectorArg)) {
            container = selectorArg.value;
          }
        }
      }

      // Flag accessibility concerns
      accessibilityConcerns.push(
        'Portal renders content outside parent component hierarchy - may break focus management'
      );
      accessibilityConcerns.push(
        'ARIA relationships (aria-labelledby, aria-controls) may not work across portal boundary'
      );
      accessibilityConcerns.push(
        'Keyboard navigation order may not match visual order'
      );

      this.portals.push({
        children,
        container,
        location: this.extractLocation(node, sourceFile),
        accessibilityConcerns,
      });
    }

    // Also detect: createPortal from react-dom import
    // import { createPortal } from 'react-dom'
    if (t.isIdentifier(callee) && callee.name === 'createPortal') {
      const args = node.arguments;
      if (args.length < 2) return;

      const children = args[0];
      let container: string | null = null;
      const accessibilityConcerns: string[] = [];

      const containerArg = args[1];
      if (t.isIdentifier(containerArg)) {
        container = containerArg.name;
      } else if (t.isStringLiteral(containerArg)) {
        container = containerArg.value;
      } else if (
        t.isCallExpression(containerArg) &&
        t.isMemberExpression(containerArg.callee) &&
        t.isIdentifier(containerArg.callee.property)
      ) {
        // Handle: document.getElementById('portal-root')
        if (containerArg.callee.property.name === 'getElementById') {
          const idArg = containerArg.arguments[0];
          if (t.isStringLiteral(idArg)) {
            container = `#${idArg.value}`;
          }
        } else if (containerArg.callee.property.name === 'querySelector') {
          const selectorArg = containerArg.arguments[0];
          if (t.isStringLiteral(selectorArg)) {
            container = selectorArg.value;
          }
        }
      }

      accessibilityConcerns.push(
        'Portal renders content outside parent component hierarchy - may break focus management'
      );
      accessibilityConcerns.push(
        'ARIA relationships may not work across portal boundary'
      );
      accessibilityConcerns.push(
        'Keyboard navigation order may not match visual order'
      );

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
  private detectForwardRef(path: NodePath<t.CallExpression>, sourceFile: string): void {
    const node = path.node;
    const callee = node.callee;

    // Detect: React.forwardRef(...) or forwardRef(...)
    const isForwardRef =
      (t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object) &&
        callee.object.name === 'React' &&
        t.isIdentifier(callee.property) &&
        callee.property.name === 'forwardRef') ||
      (t.isIdentifier(callee) && callee.name === 'forwardRef');

    if (!isForwardRef) return;

    const args = node.arguments;
    if (args.length === 0) return;

    const componentArg = args[0];

    // Extract component name from parent declaration
    let componentName: string | undefined;
    const parent = path.parent;
    if (t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) {
      componentName = parent.id.name;
    }

    // Check if the forwarded component function has a ref parameter
    if (
      t.isArrowFunctionExpression(componentArg) ||
      t.isFunctionExpression(componentArg)
    ) {
      const params = componentArg.params;
      if (params.length >= 2) {
        const refParam = params[1];
        if (t.isIdentifier(refParam)) {
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
  private detectUseImperativeHandle(
    component: t.ArrowFunctionExpression | t.FunctionExpression,
    refParamName: string,
    sourceFile: string
  ): void {
    // Traverse the component function body to find useImperativeHandle calls
    if (!t.isBlockStatement(component.body)) return;

    for (const statement of component.body.body) {
      if (
        t.isExpressionStatement(statement) &&
        t.isCallExpression(statement.expression)
      ) {
        const call = statement.expression;
        const callee = call.callee;

        if (t.isIdentifier(callee) && callee.name === 'useImperativeHandle') {
          const args = call.arguments;
          if (args.length >= 2) {
            // First arg should be the ref
            const refArg = args[0];
            if (t.isIdentifier(refArg) && refArg.name === refParamName) {
              // Second arg is the function that returns exposed methods
              const methodsArg = args[1];
              const exposedMethods: string[] = [];

              // Try to extract method names from arrow function
              if (t.isArrowFunctionExpression(methodsArg)) {
                const returnValue = methodsArg.body;
                if (t.isObjectExpression(returnValue)) {
                  for (const prop of returnValue.properties) {
                    if (
                      t.isObjectProperty(prop) &&
                      t.isIdentifier(prop.key)
                    ) {
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
   * Get detected hooks.
   */
  getHooks(): HookUsage[] {
    return this.hooks;
  }

  /**
   * Get detected refs.
   */
  getRefs(): RefUsage[] {
    return this.refs;
  }

  /**
   * Get forwarded refs (from forwardRef).
   */
  getForwardedRefs(): RefUsage[] {
    return this.refs.filter((r) => r.type === 'forwarded');
  }

  /**
   * Get imperative handle refs (from useImperativeHandle).
   */
  getImperativeRefs(): RefUsage[] {
    return this.refs.filter((r) => r.type === 'imperative');
  }

  /**
   * Check if component uses ref forwarding.
   */
  usesRefForwarding(): boolean {
    return this.refs.some((r) => r.type === 'forwarded');
  }

  /**
   * Check if component uses useImperativeHandle.
   */
  usesImperativeHandle(): boolean {
    return this.refs.some((r) => r.type === 'imperative');
  }

  /**
   * Get detected focus management actions.
   */
  getFocusManagement(): ActionLanguageNode[] {
    return this.focusManagement;
  }

  /**
   * Check if a specific hook is used.
   */
  hasHook(hookName: string): boolean {
    return this.hooks.some((h) => h.hookName === hookName);
  }

  /**
   * Get all useState hooks.
   */
  getStateHooks(): HookUsage[] {
    return this.hooks.filter((h) => h.hookName === 'useState');
  }

  /**
   * Get all useRef hooks.
   */
  getRefHooks(): HookUsage[] {
    return this.hooks.filter((h) => h.hookName === 'useRef');
  }

  /**
   * Get all useEffect hooks.
   */
  getEffectHooks(): HookUsage[] {
    return this.hooks.filter((h) => h.hookName === 'useEffect');
  }

  /**
   * Get all useCallback hooks.
   * Useful for detecting memoized event handlers.
   */
  getCallbackHooks(): HookUsage[] {
    return this.hooks.filter((h) => h.hookName === 'useCallback');
  }

  /**
   * Get all useMemo hooks.
   * Useful for detecting memoized accessibility calculations.
   */
  getMemoHooks(): HookUsage[] {
    return this.hooks.filter((h) => h.hookName === 'useMemo');
  }

  /**
   * Get all custom hooks (hooks not from React standard library).
   */
  getCustomHooks(): HookUsage[] {
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
  hasAccessibilityHooks(): boolean {
    const a11yKeywords = ['aria', 'focus', 'keyboard', 'accessible', 'a11y'];
    return this.hooks.some((h) =>
      a11yKeywords.some((keyword) => h.hookName.toLowerCase().includes(keyword))
    );
  }

  /**
   * Get detected synthetic events.
   */
  getSyntheticEvents(): SyntheticEventUsage[] {
    return this.syntheticEvents;
  }

  /**
   * Get synthetic events with accessibility concerns.
   */
  getProblematicSyntheticEvents(): SyntheticEventUsage[] {
    return this.syntheticEvents.filter((e) => e.accessibilityConcerns.length > 0);
  }

  /**
   * Check if any event handlers use stopPropagation (potential accessibility issue).
   */
  usesStopPropagation(): boolean {
    return this.syntheticEvents.some((e) =>
      e.methodsCalled.includes('stopPropagation') ||
      e.methodsCalled.includes('stopImmediatePropagation')
    );
  }

  /**
   * Get detected portals.
   */
  getPortals(): PortalUsage[] {
    return this.portals;
  }

  /**
   * Check if component uses any portals.
   */
  usesPortals(): boolean {
    return this.portals.length > 0;
  }

  /**
   * Get portals with accessibility concerns.
   * (All portals have potential accessibility concerns by nature)
   */
  getProblematicPortals(): PortalUsage[] {
    return this.portals.filter((p) => p.accessibilityConcerns.length > 0);
  }

  /**
   * Extract source location from an AST node.
   */
  private extractLocation(node: t.Node, sourceFile: string): SourceLocation {
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
  private generateId(): string {
    return `react_pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

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
export function analyzeReactComponent(
  source: string,
  sourceFile: string
): {
  hooks: HookUsage[];
  refs: RefUsage[];
  focusManagement: ActionLanguageNode[];
  syntheticEvents: SyntheticEventUsage[];
  portals: PortalUsage[];
} {
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
  };
}
