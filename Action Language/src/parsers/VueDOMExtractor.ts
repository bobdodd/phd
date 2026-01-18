/**
 * Vue DOM Extractor
 *
 * Extracts DOM structure from Vue Single File Components (.vue).
 * Parses the <template> block and converts it into a DOMModel.
 *
 * Vue-specific features:
 * - Extracts only <template> block content
 * - Preserves Vue directives as attributes (v-on, v-model, @, :, etc.)
 * - Handles dynamic attributes and class bindings
 * - Tracks source locations for error reporting
 */

import { parse as parseHTML, DefaultTreeAdapterMap } from 'parse5';
import { DOMElement, DOMModelImpl } from '../models/DOMModel';
import { SourceLocation } from '../models/BaseModel';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
type TextNode = DefaultTreeAdapterMap['textNode'];

/**
 * Metadata for Vue-specific DOM elements
 */
export interface VueMetadata {
  /** Vue directives found on this element */
  directives?: {
    /** Event handlers: v-on:click, @click, etc. */
    on?: string[];
    /** Two-way bindings: v-model */
    model?: boolean;
    /** Conditional rendering: v-if, v-else-if, v-else */
    conditionals?: string[];
    /** Visibility: v-show */
    show?: boolean;
    /** List rendering: v-for */
    loop?: boolean;
    /** Dynamic bindings: v-bind:attr, :attr */
    bindings?: string[];
  };
}

/**
 * Vue DOM Extractor
 *
 * Parses Vue Single File Components and extracts DOM structure.
 */
export class VueDOMExtractor {
  private elementCounter = 0;

  /**
   * Extract DOM structure from Vue component.
   *
   * @param source - Vue component source code
   * @param sourceFile - Filename for error reporting
   * @returns DOMModel or null if no template found
   *
   * @example
   * ```typescript
   * const extractor = new VueDOMExtractor();
   * const domModel = extractor.extract(`
   *   <template>
   *     <button @click="handleClick">Click me</button>
   *   </template>
   * `, 'Button.vue');
   * ```
   */
  extract(source: string, sourceFile: string): DOMModelImpl | null {
    // Extract template block
    const template = this.extractTemplate(source);

    if (!template.trim()) {
      return null;
    }

    try {
      // Parse template as HTML
      const document = parseHTML(template, {
        sourceCodeLocationInfo: true,
      });

      // Find body element (parse5 wraps content in html > body)
      const html = document.childNodes.find((node: Node) =>
        node.nodeName === 'html'
      ) as Element | undefined;

      if (!html) return null;

      const body = html.childNodes?.find((node: Node) =>
        node.nodeName === 'body'
      ) as Element | undefined;

      if (!body || !body.childNodes || body.childNodes.length === 0) {
        return null;
      }

      // Extract root element (Vue templates must have single root)
      const rootElement = this.findFirstElement(body.childNodes);
      if (!rootElement) return null;

      const domElement = this.convertElement(rootElement, sourceFile);
      return new DOMModelImpl(domElement, sourceFile);

    } catch (error) {
      console.error(`Failed to parse Vue template in ${sourceFile}:`, error);
      return null;
    }
  }

  /**
   * Extract template block from Vue component.
   */
  private extractTemplate(source: string): string {
    // Extract content from <template> tags
    const templateMatch = source.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
    if (templateMatch) {
      return templateMatch[1].trim();
    }

    // If no <template> tag, try removing script/style blocks
    let template = source.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    template = template.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    return template.trim();
  }

  /**
   * Find the first element node in a list of nodes.
   */
  private findFirstElement(nodes: Node[]): Element | null {
    for (const node of nodes) {
      if (this.isElement(node)) {
        return node as Element;
      }
    }
    return null;
  }

  /**
   * Convert a parse5 Element to a DOMElement.
   */
  private convertElement(
    node: Element,
    sourceFile: string,
    parent?: DOMElement
  ): DOMElement {
    const tagName = node.tagName;
    const attributes = this.extractAttributes(node);
    const vueMetadata = this.extractVueMetadata(node);

    const element: DOMElement = {
      id: this.generateId(),
      nodeType: 'element',
      tagName,
      attributes,
      children: [],
      parent,
      location: this.extractLocation(node, sourceFile),
      metadata: vueMetadata,
    };

    // Process child nodes
    if (node.childNodes) {
      for (const child of node.childNodes) {
        if (this.isElement(child)) {
          const childElement = this.convertElement(child as Element, sourceFile, element);
          element.children.push(childElement);
        } else if (this.isTextNode(child)) {
          const textElement = this.convertTextNode(child as TextNode, sourceFile, element);
          if (textElement) {
            element.children.push(textElement);
          }
        }
      }
    }

    return element;
  }

  /**
   * Convert a text node to a DOMElement.
   */
  private convertTextNode(
    node: TextNode,
    sourceFile: string,
    parent: DOMElement
  ): DOMElement | null {
    const text = node.value.trim();
    if (!text) return null;

    return {
      id: this.generateId(),
      nodeType: 'text',
      tagName: '#text',
      attributes: {},
      children: [],
      parent,
      textContent: text,
      location: this.extractLocation(node, sourceFile),
      metadata: {},
    };
  }

  /**
   * Extract attributes from a parse5 Element.
   * Normalizes Vue directive names.
   */
  private extractAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};

    if (!element.attrs) return attrs;

    for (const attr of element.attrs) {
      // Preserve Vue directives as-is
      attrs[attr.name] = attr.value || 'true';
    }

    return attrs;
  }

  /**
   * Extract Vue-specific metadata from element attributes.
   */
  private extractVueMetadata(element: Element): VueMetadata {
    const metadata: VueMetadata = {
      directives: {},
    };

    if (!element.attrs) return metadata;

    for (const attr of element.attrs) {
      const name = attr.name;

      // v-on:event or @event
      if (name.startsWith('v-on:') || name.startsWith('@')) {
        if (!metadata.directives!.on) {
          metadata.directives!.on = [];
        }
        const eventType = name.startsWith('@') ? name.substring(1) : name.substring(5);
        metadata.directives!.on.push(eventType);
      }

      // v-model
      if (name === 'v-model' || name.startsWith('v-model:')) {
        metadata.directives!.model = true;
      }

      // v-if, v-else-if, v-else
      if (name === 'v-if' || name === 'v-else-if' || name === 'v-else') {
        if (!metadata.directives!.conditionals) {
          metadata.directives!.conditionals = [];
        }
        metadata.directives!.conditionals.push(name);
      }

      // v-show
      if (name === 'v-show') {
        metadata.directives!.show = true;
      }

      // v-for
      if (name === 'v-for') {
        metadata.directives!.loop = true;
      }

      // v-bind:attr or :attr
      if (name.startsWith('v-bind:') || (name.startsWith(':') && name.length > 1)) {
        if (!metadata.directives!.bindings) {
          metadata.directives!.bindings = [];
        }
        const bindTarget = name.startsWith(':') ? name.substring(1) : name.substring(7);
        metadata.directives!.bindings.push(bindTarget);
      }
    }

    return metadata;
  }

  /**
   * Check if a node is an Element.
   */
  private isElement(node: Node): boolean {
    return 'tagName' in node;
  }

  /**
   * Check if a node is a Text node.
   */
  private isTextNode(node: Node): boolean {
    return node.nodeName === '#text';
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
   * Generate a unique ID for an element.
   */
  private generateId(): string {
    return `vue_dom_${++this.elementCounter}`;
  }
}

/**
 * Extract DOM structure from Vue component.
 *
 * @param source - Vue component source code
 * @param sourceFile - Filename for error reporting
 * @returns DOMModel or null if no template found
 *
 * @example
 * ```typescript
 * const domModel = extractVueDOM(`
 *   <template>
 *     <div id="app">
 *       <button @click="increment">Count: {{ count }}</button>
 *     </div>
 *   </template>
 * `, 'Counter.vue');
 *
 * const button = domModel?.querySelector('button');
 * ```
 */
export function extractVueDOM(source: string, sourceFile: string): DOMModelImpl | null {
  const extractor = new VueDOMExtractor();
  return extractor.extract(source, sourceFile);
}
