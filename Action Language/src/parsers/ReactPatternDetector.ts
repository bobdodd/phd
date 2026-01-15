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
import { ActionLanguageNode, ElementReference } from './JavaScriptParser';
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
  type: 'creation' | 'prop' | 'current';

  /** Source location */
  location: SourceLocation;
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

    traverseAST(ast, {
      // Detect hook calls: useState, useRef, useEffect, etc.
      CallExpression: (path: NodePath<t.CallExpression>) => {
        this.detectHook(path, sourceFile);
        this.detectRefFocusManagement(path, sourceFile);
      },

      // Detect ref assignments in JSX: ref={buttonRef}
      JSXAttribute: (path: NodePath<t.JSXAttribute>) => {
        this.detectRefProp(path, sourceFile);
      },
    });
  }

  /**
   * Detect React hook calls.
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
      if (elements.length > 0 && t.isIdentifier(elements[0])) {
        variableName = elements[0].name;
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
} {
  const { parseSource } = require('./BabelParser');
  const ast = parseSource(source, sourceFile);
  const detector = new ReactPatternDetector();
  detector.analyze(ast, sourceFile);

  return {
    hooks: detector.getHooks(),
    refs: detector.getRefs(),
    focusManagement: detector.getFocusManagement(),
  };
}
