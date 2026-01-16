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

import { parseSource, traverseAST, types as t, NodePath } from './BabelParser';
import { SourceLocation } from '../models/BaseModel';
import {
  ActionLanguageNode,
  ActionLanguageModelImpl,
  ElementReference,
} from '../models/ActionLanguageModel';

/**
 * JavaScript/TypeScript/JSX Parser
 *
 * Parses source code and extracts ActionLanguage nodes representing
 * UI interaction patterns.
 */
export class JavaScriptParser {
  private nodeCounter = 0;
  private variableBindings: Map<string, ElementReference> = new Map();

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
  parse(source: string, sourceFile: string): ActionLanguageModelImpl {
    const nodes: ActionLanguageNode[] = [];
    this.variableBindings.clear();
    const ast = parseSource(source, sourceFile);

    // First pass: collect variable bindings
    traverseAST(ast, {
      VariableDeclarator: (path: NodePath<t.VariableDeclarator>) => {
        this.collectVariableBinding(path);
      },
    });

    // Second pass: extract action patterns
    traverseAST(ast, {
      // Extract patterns from function calls
      CallExpression: (path: NodePath<t.CallExpression>) => {
        // Check for addEventListener
        if (this.isAddEventListener(path.node)) {
          const node = this.extractEventHandler(path, sourceFile);
          if (node) nodes.push(node);
        }

        // Check for setAttribute with ARIA
        if (this.isSetAttribute(path.node)) {
          const node = this.extractAriaUpdate(path, sourceFile);
          if (node) nodes.push(node);
        }

        // Check for focus/blur
        if (this.isFocusChange(path.node)) {
          const node = this.extractFocusChange(path, sourceFile);
          if (node) nodes.push(node);
        }
      },

      // Extract event handlers from JSX (onClick, onKeyDown, etc.)
      JSXAttribute: (path: NodePath<t.JSXAttribute>) => {
        if (this.isJSXEventHandler(path.node)) {
          const node = this.extractJSXEventHandler(path, sourceFile);
          if (node) nodes.push(node);
        }
      },
    });

    return new ActionLanguageModelImpl(nodes, sourceFile);
  }

  /**
   * Check if a call expression is addEventListener.
   */
  private isAddEventListener(node: t.CallExpression): boolean {
    const { callee } = node;
    return (
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.property) &&
      callee.property.name === 'addEventListener'
    );
  }

  /**
   * Check if a JSX attribute is an event handler (starts with "on").
   */
  private isJSXEventHandler(node: t.JSXAttribute): boolean {
    const { name } = node;
    if (t.isJSXIdentifier(name)) {
      return name.name.startsWith('on') && name.name.length > 2;
    }
    return false;
  }

  /**
   * Check if a call expression is setAttribute.
   */
  private isSetAttribute(node: t.CallExpression): boolean {
    const { callee } = node;
    return (
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.property) &&
      callee.property.name === 'setAttribute'
    );
  }

  /**
   * Check if a call expression is a focus change (focus(), blur()).
   */
  private isFocusChange(node: t.CallExpression): boolean {
    const { callee } = node;
    if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
      const methodName = callee.property.name;
      return methodName === 'focus' || methodName === 'blur';
    }
    return false;
  }

  /**
   * Extract event handler from addEventListener call.
   */
  private extractEventHandler(
    path: NodePath<t.CallExpression>,
    sourceFile: string
  ): ActionLanguageNode | null {
    const node = path.node;
    const args = node.arguments;

    if (args.length < 2) return null;

    // Extract event type (first argument)
    const eventArg = args[0];
    let eventType: string | undefined;
    if (t.isStringLiteral(eventArg)) {
      eventType = eventArg.value;
    }

    if (!eventType) return null;

    // Extract element reference
    const callee = node.callee as t.MemberExpression;
    const elementRef = this.extractElementReference(callee.object);

    if (!elementRef) return null;

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
  private extractJSXEventHandler(
    path: NodePath<t.JSXAttribute>,
    sourceFile: string
  ): ActionLanguageNode | null {
    const attr = path.node;
    const name = attr.name;

    if (!t.isJSXIdentifier(name)) return null;

    // Convert React event name to standard event name
    // onClick -> click, onKeyDown -> keydown
    const eventType = name.name.slice(2).toLowerCase();

    // Find the parent JSX element
    let jsxElement: t.JSXElement | null = null;
    path.findParent((p) => {
      if (p.isJSXElement()) {
        jsxElement = p.node as t.JSXElement;
        return true;
      }
      return false;
    });

    if (!jsxElement) return null;

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
  private extractAriaUpdate(
    path: NodePath<t.CallExpression>,
    sourceFile: string
  ): ActionLanguageNode | null {
    const node = path.node;
    const args = node.arguments;

    if (args.length < 2) return null;

    // Check if first argument is an ARIA attribute
    const attrArg = args[0];
    if (!t.isStringLiteral(attrArg)) return null;
    if (!attrArg.value.startsWith('aria-')) return null;

    // Extract element reference
    const callee = node.callee as t.MemberExpression;
    const elementRef = this.extractElementReference(callee.object);

    if (!elementRef) return null;

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
  private extractFocusChange(
    path: NodePath<t.CallExpression>,
    sourceFile: string
  ): ActionLanguageNode | null {
    const node = path.node;
    const callee = node.callee as t.MemberExpression;
    const methodName = (callee.property as t.Identifier).name;

    // Extract element reference
    const elementRef = this.extractElementReference(callee.object);

    if (!elementRef) return null;

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
  private collectVariableBinding(path: NodePath<t.VariableDeclarator>): void {
    const node = path.node;
    const id = node.id;
    const init = node.init;

    // Only handle identifier bindings (not destructuring)
    if (!t.isIdentifier(id) || !init) return;

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
  private extractElementReference(node: t.Expression): ElementReference | null {
    // Handle variable reference: button.addEventListener(...)
    // Check if variable was bound to an element selector
    if (t.isIdentifier(node)) {
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
  private extractElementReferenceFromExpression(node: t.Expression): ElementReference | null {
    // Handle ref.current: buttonRef.current.focus()
    if (
      t.isMemberExpression(node) &&
      t.isIdentifier(node.property) &&
      node.property.name === 'current' &&
      t.isIdentifier(node.object)
    ) {
      return {
        selector: `[ref="${node.object.name}"]`,
        binding: node.object.name,
      };
    }

    // Handle document.getElementById('id')
    if (t.isCallExpression(node)) {
      const callee = node.callee;
      if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.property) &&
        callee.property.name === 'getElementById'
      ) {
        const arg = node.arguments[0];
        if (t.isStringLiteral(arg)) {
          return {
            selector: `#${arg.value}`,
            binding: arg.value,
          };
        }
      }

      // Handle document.querySelector('.class')
      if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.property) &&
        callee.property.name === 'querySelector'
      ) {
        const arg = node.arguments[0];
        if (t.isStringLiteral(arg)) {
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
  private getJSXTagName(element: t.JSXElement): string {
    const opening = element.openingElement;
    const name = opening.name;

    if (t.isJSXIdentifier(name)) {
      return name.name;
    }

    if (t.isJSXMemberExpression(name)) {
      // Handle cases like <Foo.Bar>
      return this.getJSXMemberExpressionName(name);
    }

    return 'unknown';
  }

  /**
   * Get the full name from a JSX member expression (e.g., Foo.Bar.Baz).
   */
  private getJSXMemberExpressionName(expr: t.JSXMemberExpression): string {
    const parts: string[] = [];

    let current: t.JSXMemberExpression | t.JSXIdentifier = expr;
    while (t.isJSXMemberExpression(current)) {
      if (t.isJSXIdentifier(current.property)) {
        parts.unshift(current.property.name);
      }
      current = current.object;
    }

    if (t.isJSXIdentifier(current)) {
      parts.unshift(current.name);
    }

    return parts.join('.');
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
   * Generate a unique ID for a node.
   */
  private generateId(): string {
    return `action_${++this.nodeCounter}`;
  }
}
