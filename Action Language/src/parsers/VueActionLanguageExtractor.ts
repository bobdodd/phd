/**
 * Vue ActionLanguage Extractor
 *
 * This parser extracts ActionLanguage nodes (UI interaction patterns) from
 * Vue components. It detects:
 * - Event handlers (v-on: directives and @ shorthand)
 * - Two-way bindings (v-model directive)
 * - Attribute bindings (v-bind: directives and : shorthand)
 * - Conditional rendering (v-if, v-show)
 * - Focus management patterns
 *
 * The parser uses parse5 to handle Vue's template structure and
 * converts Vue-specific directives into ActionLanguage nodes.
 */

import { parse as parseHTML, DefaultTreeAdapterMap } from 'parse5';
import { SourceLocation } from '../models/BaseModel';
import {
  ActionLanguageNode,
  ActionLanguageModelImpl,
  ElementReference,
} from '../models/ActionLanguageModel';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];

/**
 * Vue ActionLanguage Extractor
 *
 * Parses Vue components and extracts ActionLanguage nodes representing
 * UI interaction patterns from Vue directives.
 */
export class VueActionLanguageExtractor {
  private nodeCounter = 0;

  /**
   * Parse Vue component into ActionLanguage model.
   *
   * @param source - Vue component source code
   * @param sourceFile - Filename for error reporting
   * @returns ActionLanguageModel
   *
   * @example
   * ```typescript
   * const extractor = new VueActionLanguageExtractor();
   * const model = extractor.parse(`
   *   <template>
   *     <button @click="handleClick" @keydown="handleKey">
   *       Click me
   *     </button>
   *   </template>
   * `, 'Button.vue');
   * ```
   */
  parse(source: string, sourceFile: string): ActionLanguageModelImpl {
    const nodes: ActionLanguageNode[] = [];

    // Extract the template block
    const template = this.extractTemplate(source);

    if (!template.trim()) {
      return new ActionLanguageModelImpl(nodes, sourceFile);
    }

    try {
      // Parse the template as HTML
      const document = parseHTML(template, {
        sourceCodeLocationInfo: true,
      });

      // Find body element
      const html = document.childNodes.find((node: Node) =>
        node.nodeName === 'html'
      ) as any;

      if (!html) {
        return new ActionLanguageModelImpl(nodes, sourceFile);
      }

      const body = html.childNodes?.find((node: Node) =>
        node.nodeName === 'body'
      ) as any;

      if (!body) {
        return new ActionLanguageModelImpl(nodes, sourceFile);
      }

      // Traverse the DOM tree and extract ActionLanguage nodes
      this.traverseElements(body, nodes, sourceFile);

    } catch (error) {
      console.error(`Failed to parse Vue template in ${sourceFile}:`, error);
    }

    return new ActionLanguageModelImpl(nodes, sourceFile);
  }

  /**
   * Extract template block from Vue component.
   * Removes <script> and <style> blocks, extracts only <template> content.
   */
  private extractTemplate(source: string): string {
    // Extract content from <template> tags
    const templateMatch = source.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
    if (templateMatch) {
      return templateMatch[1].trim();
    }

    // If no <template> tag, assume the whole source is template
    // (for .html files or inline templates)
    let template = source.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    template = template.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    return template.trim();
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

      // Extract directives from attributes
      if (element.attrs) {
        for (const attr of element.attrs) {
          // v-on:click or @click
          if (attr.name.startsWith('v-on:') || attr.name.startsWith('@')) {
            const eventType = this.extractEventType(attr.name);
            const eventNode = this.createEventHandlerNode(
              eventType,
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(eventNode);
          }

          // v-model (two-way binding)
          if (attr.name === 'v-model' || attr.name.startsWith('v-model:')) {
            const bindTarget = attr.name === 'v-model' ? 'value' : attr.name.substring(8);
            const bindNode = this.createModelDirectiveNode(
              bindTarget,
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(bindNode);
          }

          // v-show (visibility manipulation)
          if (attr.name === 'v-show') {
            const showNode = this.createShowDirectiveNode(
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(showNode);
          }

          // v-if (conditional rendering)
          if (attr.name === 'v-if') {
            const ifNode = this.createIfDirectiveNode(
              elementRef,
              tagName,
              attr.name,
              element,
              sourceFile
            );
            nodes.push(ifNode);
          }

          // v-bind:class or :class (dynamic class binding)
          if (attr.name === 'v-bind:class' || attr.name === ':class') {
            const classNode = this.createClassBindingNode(
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
   * Extract event type from Vue event directive.
   * Handles both v-on:click and @click formats.
   */
  private extractEventType(directiveName: string): string {
    if (directiveName.startsWith('@')) {
      // @click -> click
      return directiveName.substring(1);
    }
    if (directiveName.startsWith('v-on:')) {
      // v-on:click -> click
      return directiveName.substring(5);
    }
    return directiveName;
  }

  /**
   * Create an ActionLanguage node for a Vue event handler (v-on: or @ directive).
   */
  private createEventHandlerNode(
    eventType: string,
    elementRef: ElementReference,
    tagName: string,
    directiveName: string,
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
        framework: 'vue',
        synthetic: true,
        directive: directiveName,
        tagName,
      },
    };
  }

  /**
   * Create an ActionLanguage node for a Vue v-model directive.
   * Two-way bindings can trigger ARIA state changes or focus changes.
   */
  private createModelDirectiveNode(
    bindTarget: string,
    elementRef: ElementReference,
    tagName: string,
    directiveName: string,
    element: Element,
    sourceFile: string
  ): ActionLanguageNode {
    // v-model affects ARIA state for form inputs
    return {
      id: this.generateId(),
      nodeType: 'action',
      actionType: 'ariaStateChange',
      element: elementRef,
      location: this.extractLocation(element, sourceFile),
      metadata: {
        framework: 'vue',
        directive: directiveName,
        bindTarget,
        tagName,
        twoWayBinding: true,
      },
    };
  }

  /**
   * Create an ActionLanguage node for a Vue v-show directive.
   * v-show affects visibility, which impacts ARIA.
   */
  private createShowDirectiveNode(
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
        framework: 'vue',
        directive: directiveName,
        tagName,
        affectsVisibility: true,
      },
    };
  }

  /**
   * Create an ActionLanguage node for a Vue v-if directive.
   * v-if affects DOM presence, which impacts ARIA.
   */
  private createIfDirectiveNode(
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
        framework: 'vue',
        directive: directiveName,
        tagName,
        affectsVisibility: true,
        conditional: true,
      },
    };
  }

  /**
   * Create an ActionLanguage node for a Vue class binding (:class).
   * Class bindings can affect visibility, which impacts ARIA.
   */
  private createClassBindingNode(
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
        framework: 'vue',
        directive: directiveName,
        tagName,
        dynamicClass: true,
      },
    };
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
    return `vue_action_${++this.nodeCounter}`;
  }
}

/**
 * Parse Vue component into ActionLanguage model.
 *
 * @param source - Vue component source code
 * @param sourceFile - Filename for error reporting
 * @returns ActionLanguageModel
 *
 * @example
 * ```typescript
 * const model = parseVueActionLanguage(`
 *   <template>
 *     <button @click="toggle" :aria-expanded="isOpen">
 *       Toggle
 *     </button>
 *     <div v-show="isOpen">
 *       Content
 *     </div>
 *   </template>
 * `, 'Dropdown.vue');
 *
 * // Find all event handlers
 * const eventHandlers = model.findEventHandlers('click');
 * ```
 */
export function parseVueActionLanguage(
  source: string,
  sourceFile: string
): ActionLanguageModelImpl {
  const extractor = new VueActionLanguageExtractor();
  return extractor.parse(source, sourceFile);
}
