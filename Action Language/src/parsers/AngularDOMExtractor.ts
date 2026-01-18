/**
 * Angular DOM Extractor
 *
 * Extracts DOM structure from Angular component templates.
 * Parses template HTML and converts it into a DOMModel.
 *
 * Angular-specific features:
 * - Extracts both inline templates and separate .html files
 * - Preserves Angular bindings as attributes ((event), [property], [(ngModel)])
 * - Handles structural directives (*ngIf, *ngFor, *ngSwitch)
 * - Tracks source locations for error reporting
 */

import { parse as parseHTML, DefaultTreeAdapterMap } from 'parse5';
import { DOMElement, DOMModelImpl } from '../models/DOMModel';
import { SourceLocation } from '../models/BaseModel';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
type TextNode = DefaultTreeAdapterMap['textNode'];

/**
 * Metadata for Angular-specific DOM elements
 */
export interface AngularMetadata {
  /** Angular bindings found on this element */
  bindings?: {
    /** Event bindings: (click), (keydown), etc. */
    events?: string[];
    /** Property bindings: [property], [attr.aria-label], etc. */
    properties?: string[];
    /** Two-way bindings: [(ngModel)] */
    twoWay?: string[];
    /** Structural directives: *ngIf, *ngFor, *ngSwitch */
    structural?: string[];
    /** Dynamic class bindings: [class.hidden] */
    classes?: string[];
  };
}

/**
 * Angular DOM Extractor
 *
 * Parses Angular component templates and extracts DOM structure.
 */
export class AngularDOMExtractor {
  private elementCounter = 0;

  /**
   * Extract DOM structure from Angular component template.
   *
   * @param source - Angular component source code or template HTML
   * @param sourceFile - Filename for error reporting
   * @returns DOMModel or null if no template found
   *
   * @example
   * ```typescript
   * const extractor = new AngularDOMExtractor();
   * const domModel = extractor.extract(`
   *   <button (click)="handleClick()">Click me</button>
   * `, 'button.component.html');
   * ```
   */
  extract(source: string, sourceFile: string): DOMModelImpl | null {
    // Extract template
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

      // Extract root element
      const rootElement = this.findFirstElement(body.childNodes);
      if (!rootElement) return null;

      const domElement = this.convertElement(rootElement, sourceFile);
      return new DOMModelImpl(domElement, sourceFile);

    } catch (error) {
      console.error(`Failed to parse Angular template in ${sourceFile}:`, error);
      return null;
    }
  }

  /**
   * Extract template from Angular component.
   */
  private extractTemplate(source: string): string {
    // If it's a .html file, return as-is
    if (!source.includes('@Component') && !source.includes('template:')) {
      return source;
    }

    // Extract inline template from @Component decorator
    const inlineTemplateMatch = source.match(/template:\s*`([^`]*)`/s);
    if (inlineTemplateMatch) {
      return inlineTemplateMatch[1].trim();
    }

    // If it's a TypeScript file without inline template, return empty
    return '';
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
    const angularMetadata = this.extractAngularMetadata(node);

    const element: DOMElement = {
      id: this.generateId(),
      nodeType: 'element',
      tagName,
      attributes,
      children: [],
      parent,
      location: this.extractLocation(node, sourceFile),
      metadata: angularMetadata,
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
   */
  private extractAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};

    if (!element.attrs) return attrs;

    for (const attr of element.attrs) {
      // Preserve Angular bindings as-is
      attrs[attr.name] = attr.value || 'true';
    }

    return attrs;
  }

  /**
   * Extract Angular-specific metadata from element attributes.
   */
  private extractAngularMetadata(element: Element): AngularMetadata {
    const metadata: AngularMetadata = {
      bindings: {},
    };

    if (!element.attrs) return metadata;

    for (const attr of element.attrs) {
      const name = attr.name;

      // (event) - Event bindings
      if (name.startsWith('(') && name.endsWith(')')) {
        if (!metadata.bindings!.events) {
          metadata.bindings!.events = [];
        }
        const eventType = name.slice(1, -1);
        metadata.bindings!.events.push(eventType);
      }

      // [property] - Property bindings
      if (name.startsWith('[') && name.endsWith(']') && !name.startsWith('[(')) {
        if (!metadata.bindings!.properties) {
          metadata.bindings!.properties = [];
        }
        const propName = name.slice(1, -1);
        metadata.bindings!.properties.push(propName);
      }

      // [(ngModel)] - Two-way bindings
      if (name.startsWith('[(') && name.endsWith(')]')) {
        if (!metadata.bindings!.twoWay) {
          metadata.bindings!.twoWay = [];
        }
        const bindTarget = name.slice(2, -2);
        metadata.bindings!.twoWay.push(bindTarget);
      }

      // *ngIf, *ngFor, etc. - Structural directives
      if (name.startsWith('*ng')) {
        if (!metadata.bindings!.structural) {
          metadata.bindings!.structural = [];
        }
        metadata.bindings!.structural.push(name);
      }

      // [class.className] - Dynamic class bindings
      if (name.startsWith('[class.')) {
        if (!metadata.bindings!.classes) {
          metadata.bindings!.classes = [];
        }
        const className = name.slice(7, -1);
        metadata.bindings!.classes.push(className);
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
    return `angular_dom_${++this.elementCounter}`;
  }
}

/**
 * Extract DOM structure from Angular component template.
 *
 * @param source - Angular component source code or template HTML
 * @param sourceFile - Filename for error reporting
 * @returns DOMModel or null if no template found
 *
 * @example
 * ```typescript
 * const domModel = extractAngularDOM(`
 *   <div class="container">
 *     <button (click)="increment()">Count: {{ count }}</button>
 *   </div>
 * `, 'counter.component.html');
 *
 * const button = domModel?.querySelector('button');
 * ```
 */
export function extractAngularDOM(source: string, sourceFile: string): DOMModelImpl | null {
  const extractor = new AngularDOMExtractor();
  return extractor.extract(source, sourceFile);
}
