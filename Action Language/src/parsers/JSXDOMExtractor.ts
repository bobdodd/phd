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

import { parseSource, traverseAST, types as t, NodePath } from './BabelParser';
import { DOMElement, DOMModelImpl } from '../models/DOMModel';
import { SourceLocation } from '../models/BaseModel';

/**
 * JSX DOM Extractor
 *
 * Extracts virtual DOM structure from JSX/TSX components.
 */
export class JSXDOMExtractor {
  private elementCounter = 0;

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
  extract(source: string, sourceFile: string): DOMModelImpl | null {
    const ast = parseSource(source, sourceFile);
    let rootElement: DOMElement | null = null;

    // Find JSX return statements in function components
    traverseAST(ast, {
      // Handle function component returns
      ReturnStatement: (path: NodePath<t.ReturnStatement>) => {
        const argument = path.node.argument;
        if (!argument) return;

        // Extract JSX from return statement
        const element = this.extractJSXElement(argument, sourceFile);
        if (element && !rootElement) {
          rootElement = element;
        }
      },

      // Handle arrow function component returns
      ArrowFunctionExpression: (path: NodePath<t.ArrowFunctionExpression>) => {
        const body = path.node.body;

        // Handle implicit return: () => <div>...</div>
        if (t.isJSXElement(body) || t.isJSXFragment(body)) {
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

    return new DOMModelImpl(rootElement, sourceFile);
  }

  /**
   * Extract a DOM element from a JSX node.
   */
  private extractJSXElement(
    node: t.Expression | t.JSXElement | t.JSXFragment,
    sourceFile: string,
    parent?: DOMElement
  ): DOMElement | null {
    // Handle JSX elements
    if (t.isJSXElement(node)) {
      return this.convertJSXElement(node, sourceFile, parent);
    }

    // Handle JSX fragments: <></>
    if (t.isJSXFragment(node)) {
      return this.convertJSXFragment(node, sourceFile, parent);
    }

    // Handle expressions that might contain JSX
    if (t.isConditionalExpression(node)) {
      // Handle: condition ? <div>A</div> : <div>B</div>
      // For now, extract the consequent (true branch)
      return this.extractJSXElement(node.consequent, sourceFile, parent);
    }

    if (t.isLogicalExpression(node)) {
      // Handle: isOpen && <Dialog />
      return this.extractJSXElement(node.right, sourceFile, parent);
    }

    if (t.isParenthesizedExpression(node)) {
      return this.extractJSXElement(node.expression, sourceFile, parent);
    }

    return null;
  }

  /**
   * Convert a JSX element to a DOMElement.
   */
  private convertJSXElement(
    node: t.JSXElement,
    sourceFile: string,
    parent?: DOMElement
  ): DOMElement {
    const opening = node.openingElement;
    const tagName = this.getTagName(opening.name);
    const attributes = this.extractAttributes(opening.attributes);

    const element: DOMElement = {
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
  private convertJSXFragment(
    node: t.JSXFragment,
    sourceFile: string,
    parent?: DOMElement
  ): DOMElement {
    const element: DOMElement = {
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
  private convertJSXChild(
    child: t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment,
    sourceFile: string,
    parent: DOMElement
  ): DOMElement | null {
    // Handle JSX text
    if (t.isJSXText(child)) {
      const text = child.value.trim();
      if (!text) return null;

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
    if (t.isJSXElement(child)) {
      return this.convertJSXElement(child, sourceFile, parent);
    }

    // Handle JSX fragments
    if (t.isJSXFragment(child)) {
      return this.convertJSXFragment(child, sourceFile, parent);
    }

    // Handle JSX expressions: {variable}, {condition && <div />}
    if (t.isJSXExpressionContainer(child)) {
      const expr = child.expression;

      // Skip empty expressions and comments
      if (t.isJSXEmptyExpression(expr)) return null;

      // Try to extract JSX from the expression
      return this.extractJSXElement(expr as any, sourceFile, parent);
    }

    return null;
  }

  /**
   * Get the tag name from a JSX identifier or member expression.
   */
  private getTagName(name: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName): string {
    if (t.isJSXIdentifier(name)) {
      return name.name;
    }

    if (t.isJSXMemberExpression(name)) {
      // Handle Foo.Bar → "Foo.Bar"
      return this.getJSXMemberExpressionName(name);
    }

    if (t.isJSXNamespacedName(name)) {
      // Handle svg:path → "svg:path"
      return `${name.namespace.name}:${name.name.name}`;
    }

    return 'unknown';
  }

  /**
   * Get the full name from a JSX member expression.
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
   * Extract attributes from JSX opening element.
   */
  private extractAttributes(
    attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>
  ): Record<string, string> {
    const attrs: Record<string, string> = {};

    for (const attr of attributes) {
      // Skip spread attributes for now
      if (t.isJSXSpreadAttribute(attr)) continue;

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
  private getAttributeName(name: t.JSXIdentifier | t.JSXNamespacedName): string {
    if (t.isJSXIdentifier(name)) {
      // Normalize React JSX attributes to HTML attributes
      const jsxName = name.name;

      // className -> class
      if (jsxName === 'className') return 'class';

      // htmlFor -> for
      if (jsxName === 'htmlFor') return 'for';

      // tabIndex -> tabindex
      if (jsxName === 'tabIndex') return 'tabindex';

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
  private getAttributeValue(
    value: t.JSXAttribute['value']
  ): string | null {
    if (!value) return 'true'; // Boolean attributes

    if (t.isStringLiteral(value)) {
      return value.value;
    }

    if (t.isJSXExpressionContainer(value)) {
      const expr = value.expression;

      // String literal in expression: attr={"value"}
      if (t.isStringLiteral(expr)) {
        return expr.value;
      }

      // Boolean literal: attr={true}
      if (t.isBooleanLiteral(expr)) {
        return expr.value.toString();
      }

      // Numeric literal: tabindex={0}
      if (t.isNumericLiteral(expr)) {
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
  private isReactComponent(tagName: string): boolean {
    return /^[A-Z]/.test(tagName);
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
   * Generate a unique ID for an element.
   */
  private generateId(): string {
    return `dom_${++this.elementCounter}`;
  }
}

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
export function extractJSXDOM(source: string, sourceFile: string): DOMModelImpl | null {
  const extractor = new JSXDOMExtractor();
  return extractor.extract(source, sourceFile);
}
