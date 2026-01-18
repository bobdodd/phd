/**
 * Svelte DOM Extractor
 *
 * This module extracts a virtual DOM structure from Svelte components (.svelte files).
 * It converts Svelte template markup into DOMElement nodes that can be used for
 * cross-reference analysis with JavaScript behaviors and CSS rules.
 *
 * Svelte Component Structure:
 * - <script> block: Component logic, imports, exports (props)
 * - Template block: HTML markup with Svelte directives
 * - <style> block: Scoped CSS styles
 *
 * Unlike JSX extraction, this extractor:
 * - Handles Svelte's three-block structure (script, template, style)
 * - Parses Svelte directives (bind:, on:, use:, transition:, etc.)
 * - Extracts reactive declarations ($:)
 * - Preserves source locations for error reporting
 * - Builds a virtual DOM tree from the template block
 */

import { parse as parseHTML, DefaultTreeAdapterMap } from 'parse5';
import { DOMElement, DOMModelImpl } from '../models/DOMModel';
import { SourceLocation } from '../models/BaseModel';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
type TextNode = DefaultTreeAdapterMap['textNode'];

/**
 * Svelte-specific metadata attached to DOMElements
 */
export interface SvelteMetadata {
  /** Is this a Svelte component (PascalCase)? */
  isSvelteComponent?: boolean;

  /** Svelte directives on this element */
  directives?: {
    bind?: string[];      // bind:value, bind:checked, etc.
    on?: string[];        // on:click, on:keydown, etc.
    use?: string[];       // use:action
    transition?: string;  // transition:fade
    animate?: string;     // animate:flip
    class?: string[];     // class:active={isActive}
  };

  /** Reactive statements referencing this element */
  reactiveRefs?: string[];

  /** Is this element in a conditional block (#if, #each, #await)? */
  inConditional?: {
    type: 'if' | 'each' | 'await';
    condition?: string;
  };
}

/**
 * Svelte DOM Extractor
 *
 * Extracts virtual DOM structure from Svelte components.
 */
export class SvelteDOMExtractor {
  private elementCounter = 0;

  /**
   * Extract DOM structure from Svelte source code.
   *
   * @param source - Svelte component source code
   * @param sourceFile - Filename for error reporting
   * @returns DOMModel representing the Svelte template structure
   *
   * @example
   * ```typescript
   * const extractor = new SvelteDOMExtractor();
   * const domModel = extractor.extract(`
   *   <script>
   *     let count = 0;
   *   </script>
   *
   *   <button on:click={() => count++}>
   *     Count: {count}
   *   </button>
   * `, 'Counter.svelte');
   * ```
   */
  extract(source: string, sourceFile: string): DOMModelImpl | null {
    // Extract the template block (everything outside <script> and <style>)
    const template = this.extractTemplate(source);

    if (!template.trim()) {
      return null;
    }

    try {
      // Parse the template as HTML (Svelte templates are HTML + directives)
      const document = parseHTML(template, {
        sourceCodeLocationInfo: true,
      });

      // Find the root element (skip <!DOCTYPE> and comments)
      const rootElement = this.findRootElement(document, sourceFile);

      if (!rootElement) {
        return null;
      }

      return new DOMModelImpl(rootElement, sourceFile);
    } catch (error) {
      console.error(`Failed to parse Svelte template in ${sourceFile}:`, error);
      return null;
    }
  }

  /**
   * Extract template block from Svelte component.
   * Removes <script> and <style> blocks, leaving only the template markup.
   */
  private extractTemplate(source: string): string {
    // Remove <script> blocks (including <script context="module">)
    let template = source.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remove <style> blocks (including <style global>)
    template = template.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    return template.trim();
  }

  /**
   * Find the root element in the parsed HTML document.
   */
  private findRootElement(document: any, sourceFile: string): DOMElement | null {
    const html = document.childNodes.find((node: Node) =>
      node.nodeName === 'html'
    );

    if (!html) return null;

    const body = html.childNodes?.find((node: Node) =>
      node.nodeName === 'body'
    );

    if (!body || !body.childNodes || body.childNodes.length === 0) {
      return null;
    }

    // Get the first element child (skip text nodes with only whitespace)
    const firstElement = body.childNodes.find((node: Node) =>
      this.isElement(node)
    );

    if (!firstElement || !this.isElement(firstElement)) {
      return null;
    }

    return this.convertElement(firstElement as Element, sourceFile);
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
    const directives = this.extractSvelteDirectives(node);

    const element: DOMElement = {
      id: this.generateId(),
      nodeType: 'element',
      tagName,
      attributes,
      children: [],
      parent,
      location: this.extractLocation(node, sourceFile),
      metadata: {
        isSvelteComponent: this.isSvelteComponent(tagName),
        directives,
      } as SvelteMetadata,
    };

    // Process children
    if (node.childNodes) {
      for (const child of node.childNodes) {
        const childElement = this.convertChild(child, sourceFile, element);
        if (childElement) {
          element.children.push(childElement);
        }
      }
    }

    return element;
  }

  /**
   * Convert a parse5 child node to a DOMElement.
   */
  private convertChild(
    node: Node,
    sourceFile: string,
    parent: DOMElement
  ): DOMElement | null {
    if (this.isElement(node)) {
      return this.convertElement(node as Element, sourceFile, parent);
    }

    if (this.isTextNode(node)) {
      const text = (node as TextNode).value.trim();
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

    return null;
  }

  /**
   * Extract standard HTML attributes from a parse5 Element.
   */
  private extractAttributes(node: Element): Record<string, string> {
    const attrs: Record<string, string> = {};

    if (!node.attrs) return attrs;

    for (const attr of node.attrs) {
      // Skip Svelte directives (they're handled separately)
      if (this.isSvelteDirective(attr.name)) {
        continue;
      }

      attrs[attr.name] = attr.value;
    }

    return attrs;
  }

  /**
   * Extract Svelte-specific directives from element attributes.
   */
  private extractSvelteDirectives(node: Element): SvelteMetadata['directives'] {
    const directives: SvelteMetadata['directives'] = {};

    if (!node.attrs) return directives;

    for (const attr of node.attrs) {
      const name = attr.name;

      // bind: directives (bind:value, bind:checked, etc.)
      if (name.startsWith('bind:')) {
        if (!directives.bind) directives.bind = [];
        directives.bind.push(name.substring(5)); // Remove 'bind:' prefix
      }

      // on: directives (on:click, on:keydown, etc.)
      else if (name.startsWith('on:')) {
        if (!directives.on) directives.on = [];
        directives.on.push(name.substring(3)); // Remove 'on:' prefix
      }

      // use: directives (use:action)
      else if (name.startsWith('use:')) {
        if (!directives.use) directives.use = [];
        directives.use.push(name.substring(4)); // Remove 'use:' prefix
      }

      // transition: directives
      else if (name.startsWith('transition:')) {
        directives.transition = name.substring(11); // Remove 'transition:' prefix
      }

      // animate: directives
      else if (name.startsWith('animate:')) {
        directives.animate = name.substring(8); // Remove 'animate:' prefix
      }

      // class: directives (class:active={isActive})
      else if (name.startsWith('class:')) {
        if (!directives.class) directives.class = [];
        directives.class.push(name.substring(6)); // Remove 'class:' prefix
      }
    }

    return Object.keys(directives).length > 0 ? directives : undefined;
  }

  /**
   * Check if an attribute name is a Svelte directive.
   */
  private isSvelteDirective(attrName: string): boolean {
    return (
      attrName.startsWith('bind:') ||
      attrName.startsWith('on:') ||
      attrName.startsWith('use:') ||
      attrName.startsWith('transition:') ||
      attrName.startsWith('animate:') ||
      attrName.startsWith('class:')
    );
  }

  /**
   * Check if a tag name represents a Svelte component.
   * Svelte components use PascalCase naming.
   */
  private isSvelteComponent(tagName: string): boolean {
    return /^[A-Z]/.test(tagName);
  }

  /**
   * Check if a parse5 node is an Element.
   */
  private isElement(node: Node): boolean {
    return 'tagName' in node;
  }

  /**
   * Check if a parse5 node is a TextNode.
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
    return `svelte_dom_${++this.elementCounter}`;
  }
}

/**
 * Extract virtual DOM from Svelte source code.
 *
 * @param source - Svelte component source code
 * @param sourceFile - Filename for error reporting
 * @returns DOMModel or null if no template found
 *
 * @example
 * ```typescript
 * const domModel = extractSvelteDOM(`
 *   <script>
 *     let name = 'world';
 *   </script>
 *
 *   <button on:click={() => alert('Hello')}>
 *     Hello {name}!
 *   </button>
 * `, 'Greeting.svelte');
 *
 * const button = domModel?.getElementsByTagName('button')[0];
 * ```
 */
export function extractSvelteDOM(source: string, sourceFile: string): DOMModelImpl | null {
  const extractor = new SvelteDOMExtractor();
  return extractor.extract(source, sourceFile);
}
