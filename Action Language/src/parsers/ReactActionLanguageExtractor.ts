/**
 * React ActionLanguage Extractor
 *
 * This parser extracts ActionLanguage nodes (UI interaction patterns) from
 * React components. It detects:
 * - Event handlers (onClick, onKeyDown, etc.)
 * - Focus management (useEffect with .focus() calls)
 * - Refs (useRef, ref prop assignments)
 * - State changes (useState affecting ARIA or focus)
 * - Portals (ReactDOM.createPortal)
 * - Event propagation (stopPropagation, stopImmediatePropagation)
 *
 * The parser uses Babel to parse React/JSX and converts React-specific
 * patterns into ActionLanguage nodes.
 */

import { parseSource, traverseAST, types as t, NodePath } from './BabelParser';
import { SourceLocation } from '../models/BaseModel';
import {
  ActionLanguageNode,
  ActionLanguageModelImpl,
} from '../models/ActionLanguageModel';

/**
 * React ActionLanguage Extractor
 *
 * Parses React components and extracts ActionLanguage nodes representing
 * UI interaction patterns from React code.
 */
export class ReactActionLanguageExtractor {
  private nodeCounter = 0;

  /**
   * Parse React component into ActionLanguage model.
   *
   * @param source - React component source code
   * @param sourceFile - Filename for error reporting
   * @returns ActionLanguageModel
   *
   * @example
   * ```typescript
   * const extractor = new ReactActionLanguageExtractor();
   * const model = extractor.parse(`
   *   function Button() {
   *     return <button onClick={handleClick}>Click me</button>;
   *   }
   * `, 'Button.tsx');
   * ```
   */
  parse(source: string, sourceFile: string): ActionLanguageModelImpl {
    const nodes: ActionLanguageNode[] = [];

    // Validate input
    if (!source || typeof source !== 'string') {
      return new ActionLanguageModelImpl(nodes, sourceFile);
    }

    try {
      const ast = parseSource(source, sourceFile);

      // Extract event handlers from JSX
      this.extractJSXEventHandlers(ast, nodes, sourceFile);

      // Extract focus management from hooks
      this.extractFocusManagement(ast, nodes, sourceFile);

      // Extract portals
      this.extractPortals(ast, nodes, sourceFile);

      // Extract event propagation issues
      this.extractEventPropagation(ast, nodes, sourceFile);

    } catch (error) {
      console.error(`Failed to parse React component in ${sourceFile}:`, error);
    }

    return new ActionLanguageModelImpl(nodes, sourceFile);
  }

  /**
   * Extract event handlers from JSX attributes.
   * Converts JSX event props (onClick, onKeyDown) into ActionLanguage eventHandler nodes.
   */
  private extractJSXEventHandlers(
    ast: t.File,
    nodes: ActionLanguageNode[],
    sourceFile: string
  ): void {
    traverseAST(ast, {
      JSXElement: (path: NodePath<t.JSXElement>) => {
        const opening = path.node.openingElement;
        const tagName = this.getJSXElementName(opening.name);

        // Extract element ID or create selector
        let elementId: string | undefined;
        let elementSelector = tagName;

        for (const attr of opening.attributes) {
          if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
            if (attr.name.name === 'id' && t.isStringLiteral(attr.value)) {
              elementId = attr.value.value;
              elementSelector = `#${elementId}`;
            }
          }
        }

        // Extract event handlers (onClick, onKeyDown, etc.)
        for (const attr of opening.attributes) {
          if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
            const attrName = attr.name.name;

            // Check if it's an event handler (starts with "on")
            if (attrName.startsWith('on') && attrName.length > 2) {
              const eventType = attrName.slice(2).toLowerCase(); // onClick -> click

              const node: ActionLanguageNode = {
                id: this.generateId(),
                nodeType: 'action',
                actionType: 'eventHandler',
                event: eventType,
                element: {
                  selector: elementSelector,
                  ...(elementId && { id: elementId }),
                },
                timing: 'immediate',
                location: this.extractLocation(attr, sourceFile),
                metadata: {
                  framework: 'react',
                  tagName,
                  handlerType: 'jsx-prop',
                },
              };

              nodes.push(node);
            }
          }
        }
      },
    });
  }

  /**
   * Extract focus management from useEffect hooks.
   * Converts useEffect with .focus()/.blur() into ActionLanguage focusChange nodes.
   */
  private extractFocusManagement(
    ast: t.File,
    nodes: ActionLanguageNode[],
    sourceFile: string
  ): void {
    traverseAST(ast, {
      CallExpression: (path: NodePath<t.CallExpression>) => {
        const node = path.node;
        const callee = node.callee;

        // Check for useEffect hook
        if (t.isIdentifier(callee) && callee.name === 'useEffect') {
          // Check if the effect function contains focus management
          const effectFn = node.arguments[0];
          if (!t.isArrowFunctionExpression(effectFn) && !t.isFunctionExpression(effectFn)) {
            return;
          }

          // Look for .focus() or .blur() calls within the effect (recursively)
          let hasFocusManagement = false;
          let refName: string | undefined;

          const effectBody = effectFn.body;

          // Recursively search for focus/blur calls in the entire effect body
          const searchFocusCalls = (node: any): void => {
            if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
              const call = node;
              // Check for regular member expression: ref.current.focus()
              if (t.isMemberExpression(call.callee) && t.isIdentifier(call.callee.property)) {
                const methodName = call.callee.property.name;
                if (methodName === 'focus' || methodName === 'blur') {
                  hasFocusManagement = true;

                  // Try to extract ref name from ref.current.focus()
                  if (t.isMemberExpression(call.callee.object) &&
                      t.isIdentifier(call.callee.object.property) &&
                      call.callee.object.property.name === 'current' &&
                      t.isIdentifier(call.callee.object.object)) {
                    refName = call.callee.object.object.name;
                  }
                }
              }
              // Check for optional chaining: ref.current?.focus()
              else if (t.isOptionalMemberExpression(call.callee) && t.isIdentifier(call.callee.property)) {
                const methodName = call.callee.property.name;
                if (methodName === 'focus' || methodName === 'blur') {
                  hasFocusManagement = true;

                  // Try to extract ref name from ref.current?.focus()
                  if (t.isOptionalMemberExpression(call.callee.object) &&
                      t.isIdentifier(call.callee.object.property) &&
                      call.callee.object.property.name === 'current' &&
                      t.isIdentifier(call.callee.object.object)) {
                    refName = call.callee.object.object.name;
                  }
                  // Also check for non-optional ref.current in optional chain
                  else if (t.isMemberExpression(call.callee.object) &&
                      t.isIdentifier(call.callee.object.property) &&
                      call.callee.object.property.name === 'current' &&
                      t.isIdentifier(call.callee.object.object)) {
                    refName = call.callee.object.object.name;
                  }
                }
              }
            }

            // Recursively traverse child nodes
            for (const key in node) {
              if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                  for (const child of node[key]) {
                    if (child && typeof child === 'object') {
                      searchFocusCalls(child);
                    }
                  }
                } else {
                  searchFocusCalls(node[key]);
                }
              }
            }
          };

          if (effectBody) {
            searchFocusCalls(effectBody);
          }

          // Check if useEffect has a cleanup function (return statement)
          let hasCleanup = false;
          if (effectBody) {
            // Recursively search for return statements in the effect body
            const searchForReturn = (node: any): boolean => {
              if (t.isReturnStatement(node)) {
                // Check if it's returning a function (cleanup function)
                if (node.argument &&
                    (t.isArrowFunctionExpression(node.argument) ||
                     t.isFunctionExpression(node.argument))) {
                  return true;
                }
              }

              // Recursively check child nodes
              for (const key in node) {
                if (node[key] && typeof node[key] === 'object') {
                  if (Array.isArray(node[key])) {
                    for (const child of node[key]) {
                      if (child && typeof child === 'object' && searchForReturn(child)) {
                        return true;
                      }
                    }
                  } else if (searchForReturn(node[key])) {
                    return true;
                  }
                }
              }
              return false;
            };

            hasCleanup = searchForReturn(effectBody);
          }

          // Extract ALL focus management in useEffect, let analyzer decide if it's an issue
          if (hasFocusManagement) {
            const focusNode: ActionLanguageNode = {
              id: `action_${++this.nodeCounter}`,
              nodeType: 'action',
              actionType: 'focusChange',
              element: {
                selector: refName ? `[ref="${refName}"]` : 'unknown',
                ...(refName && { binding: refName }),
              },
              timing: 'deferred',
              location: this.extractLocation(node, sourceFile),
              metadata: {
                framework: 'react',
                hook: 'useEffect',
                refName,
                hasCleanup,
              },
            };

            nodes.push(focusNode);
          }
        }
      },
    });
  }

  /**
   * Extract React portals.
   * Converts ReactDOM.createPortal into ActionLanguage portal nodes.
   */
  private extractPortals(
    ast: t.File,
    nodes: ActionLanguageNode[],
    sourceFile: string
  ): void {
    traverseAST(ast, {
      CallExpression: (path: NodePath<t.CallExpression>) => {
        const node = path.node;
        const callee = node.callee;

        // Check for ReactDOM.createPortal or createPortal
        const isPortal =
          (t.isMemberExpression(callee) &&
            t.isIdentifier(callee.object) &&
            callee.object.name === 'ReactDOM' &&
            t.isIdentifier(callee.property) &&
            callee.property.name === 'createPortal') ||
          (t.isIdentifier(callee) && callee.name === 'createPortal');

        if (isPortal && node.arguments.length >= 2) {
          const containerArg = node.arguments[1];
          let container = 'unknown';

          if (t.isIdentifier(containerArg)) {
            container = containerArg.name;
          } else if (t.isStringLiteral(containerArg)) {
            container = containerArg.value;
          } else if (t.isMemberExpression(containerArg)) {
            if (t.isIdentifier(containerArg.object) && t.isIdentifier(containerArg.property)) {
              container = `${containerArg.object.name}.${containerArg.property.name}`;
            }
          }

          const portalNode: ActionLanguageNode = {
            id: this.generateId(),
            nodeType: 'action',
            actionType: 'portal',
            element: {
              selector: container,
            },
            timing: 'immediate',
            location: this.extractLocation(node, sourceFile),
            metadata: {
              framework: 'react',
              container,
            },
          };

          nodes.push(portalNode);
        }
      },
    });
  }

  /**
   * Extract event propagation issues.
   * Detects stopPropagation and stopImmediatePropagation calls.
   */
  private extractEventPropagation(
    ast: t.File,
    nodes: ActionLanguageNode[],
    sourceFile: string
  ): void {
    traverseAST(ast, {
      ArrowFunctionExpression: (path: NodePath<t.ArrowFunctionExpression>) => {
        this.checkEventPropagationInFunction(path, nodes, sourceFile);
      },
      FunctionExpression: (path: NodePath<t.FunctionExpression>) => {
        this.checkEventPropagationInFunction(path, nodes, sourceFile);
      },
    });
  }

  /**
   * Check for event propagation issues in a function.
   */
  private checkEventPropagationInFunction(
    path: NodePath<t.ArrowFunctionExpression | t.FunctionExpression>,
    nodes: ActionLanguageNode[],
    sourceFile: string
  ): void {
    const func = path.node;
    const params = func.params;

    // Check if this is likely an event handler (first param named e, event, etc.)
    if (params.length === 0) return;
    const firstParam = params[0];
    if (!t.isIdentifier(firstParam)) return;

    const paramName = firstParam.name;
    const isEventParam = /^(e|event|evt|ev)$/i.test(paramName);
    if (!isEventParam) return;

    // Capture 'this' context before nested traversal
    const self = this;

    // Look for stopPropagation calls
    path.traverse({
      CallExpression(innerPath: NodePath<t.CallExpression>) {
        const callee = innerPath.node.callee;

        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object) &&
          callee.object.name === paramName &&
          t.isIdentifier(callee.property)
        ) {
          const methodName = callee.property.name;
          if (methodName === 'stopPropagation' || methodName === 'stopImmediatePropagation') {
            const propagationNode: ActionLanguageNode = {
              id: `react_action_${++self.nodeCounter}`,
              nodeType: 'action',
              actionType: 'eventPropagation',
              element: {
                selector: 'unknown',
              },
              timing: 'immediate',
              location: self.extractLocation(innerPath.node, sourceFile),
              metadata: {
                framework: 'react',
                method: methodName,
                eventParam: paramName,
              },
            };

            nodes.push(propagationNode);
          }
        }
      },
    });
  }

  /**
   * Get JSX element name as a string.
   */
  private getJSXElementName(name: t.JSXElement['openingElement']['name']): string {
    if (t.isJSXIdentifier(name)) {
      return name.name;
    } else if (t.isJSXMemberExpression(name)) {
      // For things like <Foo.Bar>
      const parts: string[] = [];
      let current: any = name;
      while (current) {
        if (t.isJSXIdentifier(current.property)) {
          parts.unshift(current.property.name);
        }
        if (t.isJSXIdentifier(current.object)) {
          parts.unshift(current.object.name);
          break;
        } else if (t.isJSXMemberExpression(current.object)) {
          current = current.object;
        } else {
          break;
        }
      }
      return parts.join('.');
    } else if (t.isJSXNamespacedName(name)) {
      return `${name.namespace.name}:${name.name.name}`;
    }
    return 'unknown';
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
   * Generate a unique ID for an ActionLanguage node.
   */
  private generateId(): string {
    return `react_action_${++this.nodeCounter}`;
  }
}

/**
 * Parse React component into ActionLanguage model.
 *
 * @param source - React component source code
 * @param sourceFile - Filename for error reporting
 * @returns ActionLanguageModel
 *
 * @example
 * ```typescript
 * const model = extractReactActionLanguage(`
 *   function Button() {
 *     return <button onClick={handleClick}>Click me</button>;
 *   }
 * `, 'Button.tsx');
 * ```
 */
export function extractReactActionLanguage(
  source: string,
  sourceFile: string
): ActionLanguageModelImpl {
  const extractor = new ReactActionLanguageExtractor();
  return extractor.parse(source, sourceFile);
}
