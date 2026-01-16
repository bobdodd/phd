/**
 * HTML Parser for Traditional HTML Files
 *
 * This module parses traditional HTML files (not JSX) and converts them into
 * DOMModel structures for Paradise accessibility analysis.
 *
 * Unlike JSXDOMExtractor which handles React JSX, this parser handles:
 * - Standard HTML5 documents
 * - Legacy HTML documents
 * - HTML fragments
 * - Server-rendered HTML
 * - Static HTML pages
 */

import { parse, HTMLElement as NodeHTMLElement, Node as NodeHTMLNode, NodeType } from 'node-html-parser';
import { DOMElement, DOMModelImpl } from '../models/DOMModel';
import { SourceLocation } from '../models/BaseModel';

/**
 * HTML Parser
 *
 * Parses traditional HTML documents and converts them to DOMModel.
 */
export class HTMLParser {
  private elementCounter = 0;
  private sourceFile: string = '';

  /**
   * Parse HTML source code and return a DOMModel.
   *
   * @param source - HTML source code
   * @param sourceFile - Filename for error reporting
   * @returns DOMModel representing the HTML structure
   *
   * @example
   * ```typescript
   * const parser = new HTMLParser();
   * const domModel = parser.parse(`
   *   <!DOCTYPE html>
   *   <html>
   *     <body>
   *       <button id="submit">Click me</button>
   *     </body>
   *   </html>
   * `, 'index.html');
   * ```
   */
  parse(source: string, sourceFile: string): DOMModelImpl {
    this.sourceFile = sourceFile;
    this.elementCounter = 0;

    // Parse HTML with node-html-parser
    const root = parse(source, {
      comment: true,
      blockTextElements: {
        script: true,
        style: true,
      },
    });

    // Convert to DOMElement tree
    const domRoot = this.convertNode(root as NodeHTMLElement);

    return new DOMModelImpl(domRoot, sourceFile);
  }

  /**
   * Convert a node-html-parser node to a DOMElement.
   */
  private convertNode(node: NodeHTMLNode, parent?: DOMElement): DOMElement {
    // Handle element nodes
    if (node.nodeType === NodeType.ELEMENT_NODE) {
      return this.convertElement(node as NodeHTMLElement, parent);
    }

    // Handle text nodes
    if (node.nodeType === NodeType.TEXT_NODE) {
      return this.convertTextNode(node, parent);
    }

    // Handle comment nodes
    if (node.nodeType === NodeType.COMMENT_NODE) {
      return this.convertCommentNode(node, parent);
    }

    // Fallback: create an unknown element
    return {
      id: this.generateId(),
      nodeType: 'element',
      tagName: 'unknown',
      attributes: {},
      children: [],
      parent,
      location: this.createLocation(0, 0),
      metadata: {
        originalNodeType: node.nodeType,
      },
    };
  }

  /**
   * Convert an element node to a DOMElement.
   */
  private convertElement(node: NodeHTMLElement, parent?: DOMElement): DOMElement {
    const tagName = node.rawTagName || 'div';
    const attributes = this.extractAttributes(node);

    const element: DOMElement = {
      id: this.generateId(),
      nodeType: 'element',
      tagName: tagName.toLowerCase(),
      attributes,
      children: [],
      parent,
      location: this.createLocation(0, 0), // node-html-parser doesn't provide line numbers by default
      metadata: {
        rawHTML: node.toString().substring(0, 200), // First 200 chars for debugging
      },
    };

    // Convert child nodes
    const childNodes = node.childNodes || [];
    for (const child of childNodes) {
      const childElement = this.convertNode(child, element);
      // Only add non-empty text nodes
      if (childElement.nodeType !== 'text' || (childElement.textContent && childElement.textContent.trim())) {
        element.children.push(childElement);
      }
    }

    return element;
  }

  /**
   * Convert a text node to a DOMElement.
   */
  private convertTextNode(node: NodeHTMLNode, parent?: DOMElement): DOMElement {
    const text = node.text || '';

    return {
      id: this.generateId(),
      nodeType: 'text',
      tagName: '#text',
      attributes: {},
      children: [],
      parent,
      textContent: text,
      location: this.createLocation(0, 0),
      metadata: {},
    };
  }

  /**
   * Convert a comment node to a DOMElement.
   */
  private convertCommentNode(node: NodeHTMLNode, parent?: DOMElement): DOMElement {
    return {
      id: this.generateId(),
      nodeType: 'comment',
      tagName: '#comment',
      attributes: {},
      children: [],
      parent,
      textContent: node.text || '',
      location: this.createLocation(0, 0),
      metadata: {},
    };
  }

  /**
   * Extract attributes from an HTML element.
   */
  private extractAttributes(node: NodeHTMLElement): Record<string, string> {
    const attrs: Record<string, string> = {};

    // node-html-parser provides attributes as an object
    const rawAttrs = node.attributes || {};

    for (const [name, value] of Object.entries(rawAttrs)) {
      // Normalize attribute names to lowercase
      const normalizedName = name.toLowerCase();

      // Store the attribute value
      attrs[normalizedName] = value || 'true'; // Boolean attributes
    }

    // Also extract id and class if available
    if (node.id) {
      attrs['id'] = node.id;
    }

    if (node.classList && node.classList.length > 0) {
      attrs['class'] = node.classList.toString();
    }

    return attrs;
  }

  /**
   * Create a source location object.
   */
  private createLocation(line: number, column: number): SourceLocation {
    return {
      file: this.sourceFile,
      line,
      column,
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
 * Parse HTML source and return a DOMModel.
 *
 * @param source - HTML source code
 * @param sourceFile - Filename for error reporting
 * @returns DOMModel representing the HTML structure
 *
 * @example
 * ```typescript
 * const domModel = parseHTML(`
 *   <div class="container">
 *     <button id="submit">Click me</button>
 *   </div>
 * `, 'page.html');
 *
 * const button = domModel.getElementById('submit');
 * ```
 */
export function parseHTML(source: string, sourceFile: string): DOMModelImpl {
  const parser = new HTMLParser();
  return parser.parse(source, sourceFile);
}
