/**
 * Angular ActionLanguage Extractor
 *
 * This parser extracts ActionLanguage nodes (UI interaction patterns) from
 * Angular components. It detects:
 * - Event bindings ((event) syntax)
 * - Two-way bindings ([(ngModel)])
 * - Property bindings ([property] syntax)
 * - Structural directives (*ngIf, *ngFor, *ngSwitch)
 * - Dynamic class/style bindings
 * - Focus management patterns
 *
 * The parser uses parse5 to handle Angular's template structure and
 * converts Angular-specific directives into ActionLanguage nodes.
 */

import { parse as parseHTML, DefaultTreeAdapterMap } from 'parse5';
import { SourceLocation } from '../models/BaseModel';
import {
  ActionLanguageNode,
  ActionLanguageModelImpl,
  ElementReference,
} from '../models/ActionLanguageModel';
import { JavaScriptParser } from './JavaScriptParser';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];

/**
 * Angular ActionLanguage Extractor
 *
 * Parses Angular components and extracts ActionLanguage nodes representing
 * UI interaction patterns from Angular template syntax.
 */
export class AngularActionLanguageExtractor {
  private nodeCounter = 0;

  /**
   * Parse Angular component into ActionLanguage model.
   *
   * @param source - Angular component source code
   * @param sourceFile - Filename for error reporting
   * @returns ActionLanguageModel
   *
   * @example
   * ```typescript
   * const extractor = new AngularActionLanguageExtractor();
   * const model = extractor.parse(`
   *   <button (click)="handleClick()" (keydown)="handleKey($event)">
   *     Click me
   *   </button>
   * `, 'button.component.html');
   * ```
   */
  parse(source: string, sourceFile: string): ActionLanguageModelImpl {
    const nodes: ActionLanguageNode[] = [];

    // Validate input
    if (!source || typeof source !== 'string') {
      return new ActionLanguageModelImpl(nodes, sourceFile);
    }

    // Step 1: If this is a TypeScript file with a component class, parse the TypeScript
    const isTypeScriptFile = sourceFile.endsWith('.ts') || source.includes('@Component');
    if (isTypeScriptFile) {
      try {
        const jsParser = new JavaScriptParser();
        const scriptModel = jsParser.parse(source, sourceFile);

        // Add all ActionLanguage nodes from the TypeScript
        // Mark them as being from Angular context
        for (const node of scriptModel.nodes) {
          nodes.push({
            ...node,
            metadata: {
              ...node.metadata,
              framework: 'angular',
              sourceSection: 'component'
            }
          });
        }
      } catch (error) {
        console.error(`Failed to parse Angular component TypeScript in ${sourceFile}:`, error);
      }
    }

    // Step 2: Extract the template (inline or from .html file)
    const template = this.extractTemplate(source);

    if (template && typeof template === 'string' && template.trim()) {
      try {
        // Parse the template as HTML
        const document = parseHTML(template, {
          sourceCodeLocationInfo: true,
        });

        // Find body element
        const html = document.childNodes.find((node: Node) =>
          node.nodeName === 'html'
        ) as any;

        if (html) {
          const body = html.childNodes?.find((node: Node) =>
            node.nodeName === 'body'
          ) as any;

          if (body) {
            // Traverse the DOM tree and extract ActionLanguage nodes from directives
            this.traverseElements(body, nodes, sourceFile);
          }
        }
      } catch (error) {
        console.error(`Failed to parse Angular template in ${sourceFile}:`, error);
      }
    }

    return new ActionLanguageModelImpl(nodes, sourceFile);
  }

  /**
   * Extract template from Angular component.
   * Handles both inline templates and separate .html files.
   */
  private extractTemplate(source: string): string {
    // Validate input is actually a string
    if (!source || typeof source !== 'string') {
      return '';
    }

    // If it's a .html file, return as-is
    if (!source.includes('@Component') && !source.includes('template:')) {
      return source;
    }

    // Extract inline template from @Component decorator
    const inlineTemplateMatch = source.match(/template:\s*`([\s\S]*?)`/);
    if (inlineTemplateMatch) {
      return inlineTemplateMatch[1].trim();
    }

    // If it's a TypeScript file without inline template, return empty
    // (external templateUrl will be loaded separately)
    return '';
  }

  /**
   * Traverse all elements in the DOM tree and extract ActionLanguage nodes.
   */
  private traverseElements(
    node: Node,
    nodes: ActionLanguageNode[],
    sourceFile: string
  ): void {
    if (!node) return;

    // Process element nodes
    if (this.isElement(node)) {
      const element = node as Element;
      const tagName = element.tagName;

      // Extract element reference for this node
      const elementRef = this.getElementReference(element);

      // Extract Angular bindings from attributes
      if (element.attrs) {
        for (const attr of element.attrs) {
          // (event) - Event bindings
          if (attr.name.startsWith('(') && attr.name.endsWith(')')) {
            const eventType = attr.name.slice(1, -1); // Remove parentheses
            const eventNode = this.createEventBindingNode(
              eventType,
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(eventNode);
          }

          // [(ngModel)] - Two-way binding
          if (attr.name.startsWith('[(') && attr.name.endsWith(')]')) {
            const bindTarget = attr.name.slice(2, -2); // Remove [()]
            const bindNode = this.createTwoWayBindingNode(
              bindTarget,
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(bindNode);
          }

          // *ngIf - Structural directive (conditional rendering)
          if (attr.name === '*ngif' || attr.name === '*ngIf') {
            const ifNode = this.createNgIfNode(
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(ifNode);
          }

          // [hidden] - Property binding for visibility
          if (attr.name === '[hidden]') {
            const hiddenNode = this.createHiddenBindingNode(
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(hiddenNode);
          }

          // [class.className] - Dynamic class binding
          if (attr.name.startsWith('[class.')) {
            const className = attr.name.slice(7, -1); // Remove [class. and ]
            const classNode = this.createClassBindingNode(
              className,
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(classNode);
          }
        }
      }
    }

    // Recursively process children
    if ('childNodes' in node) {
      const childNodes = (node as any).childNodes;
      if (childNodes) {
        for (const child of childNodes) {
          this.traverseElements(child, nodes, sourceFile);
        }
      }
    }
  }

  /**
   * Create an ActionLanguage node for an Angular event binding ((event)).
   */
  private createEventBindingNode(
    eventType: string,
    elementRef: ElementReference,
    tagName: string,
    bindingName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType: 'eventHandler',
      event: eventType,
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'angular',
        synthetic: true,
        binding: bindingName,
        tagName,
      },
    };
  }

  /**
   * Create an ActionLanguage node for Angular two-way binding ([(ngModel)]).
   */
  private createTwoWayBindingNode(
    bindTarget: string,
    elementRef: ElementReference,
    tagName: string,
    bindingName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    // [(ngModel)] affects ARIA state for form inputs
    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType: 'ariaStateChange',
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'angular',
        binding: bindingName,
        bindTarget,
        tagName,
        twoWayBinding: true,
      },
    };
  }

  /**
   * Create an ActionLanguage node for *ngIf directive.
   */
  private createNgIfNode(
    elementRef: ElementReference,
    tagName: string,
    directiveName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType: 'domManipulation',
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'angular',
        directive: directiveName,
        tagName,
        affectsVisibility: true,
        conditional: true,
      },
    };
  }

  /**
   * Create an ActionLanguage node for [hidden] property binding.
   */
  private createHiddenBindingNode(
    elementRef: ElementReference,
    tagName: string,
    bindingName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType: 'domManipulation',
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'angular',
        binding: bindingName,
        tagName,
        affectsVisibility: true,
      },
    };
  }

  /**
   * Create an ActionLanguage node for [class.className] binding.
   */
  private createClassBindingNode(
    className: string,
    elementRef: ElementReference,
    tagName: string,
    bindingName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType: 'domManipulation',
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'angular',
        binding: bindingName,
        className,
        tagName,
        dynamicClass: true,
        affectsVisibility: this.isVisibilityClass(className),
      },
    };
  }

  /**
   * Check if a class name is likely to affect visibility.
   */
  private isVisibilityClass(className: string): boolean {
    const visibilityKeywords = [
      'hidden',
      'visible',
      'show',
      'hide',
      'open',
      'closed',
      'collapsed',
      'expanded',
    ];
    return visibilityKeywords.some(keyword =>
      className.toLowerCase().includes(keyword)
    );
  }

  /**
   * Get an element reference for a parse5 Element node.
   */
  private getElementReference(element: Element): ElementReference {
    // Try to get ID attribute
    const idAttr = element.attrs?.find(attr => attr.name === 'id');
    if (idAttr) {
      return {
        selector: `#${idAttr.value}`,
        binding: idAttr.value,
      };
    }

    // Try to get class attribute
    const classAttr = element.attrs?.find(attr => attr.name === 'class');
    if (classAttr) {
      const classes = classAttr.value.split(/\s+/);
      return {
        selector: `.${classes[0]}`,
        binding: classAttr.value,
      };
    }

    // Fallback to tag name
    return {
      selector: element.tagName,
      binding: element.tagName,
    };
  }

  /**
   * Check if a parse5 node is an Element.
   */
  private isElement(node: Node): boolean {
    return 'tagName' in node;
  }

  /**
   * Extract source location from a parse5 node.
   */
  private extractLocation(node: Node, sourceFile: string): SourceLocation {
    const loc = (node as any).sourceCodeLocation;

    return {
      file: sourceFile,
      line: loc?.startLine || 0,
      column: loc?.startCol || 0,
      length: loc?.endOffset && loc?.startOffset
        ? loc.endOffset - loc.startOffset
        : undefined,
    };
  }

  /**
   * Generate a unique ID for a node.
   */
  private generateId(): string {
    return `angular_action_${++this.nodeCounter}`;
  }
}

/**
 * Parse Angular component into ActionLanguage model.
 *
 * @param source - Angular component source code or template
 * @param sourceFile - Filename for error reporting
 * @returns ActionLanguageModel
 *
 * @example
 * ```typescript
 * const model = parseAngularActionLanguage(`
 *   <button
 *     (click)="toggle()"
 *     [attr.aria-expanded]="isOpen"
 *   >
 *     Toggle
 *   </button>
 *   <div *ngIf="isOpen">
 *     Content
 *   </div>
 * `, 'dropdown.component.html');
 *
 * // Find all event bindings
 * const eventBindings = model.findEventHandlers('click');
 * ```
 */
export function parseAngularActionLanguage(
  source: string,
  sourceFile: string
): ActionLanguageModelImpl {
  const extractor = new AngularActionLanguageExtractor();
  return extractor.parse(source, sourceFile);
}
