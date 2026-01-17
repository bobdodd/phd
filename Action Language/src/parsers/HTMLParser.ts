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
  private sourceContent: string = '';
  private lineStarts: number[] = [];
  private tagLocationMap: Map<string, { line: number; column: number }> = new Map();

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
    this.sourceContent = source;
    this.elementCounter = 0;

    // Build line start index for offset-to-line/column conversion
    this.buildLineStarts(source);

    // Build manual tag location map for reliable element location tracking
    this.buildTagLocationMap(source);

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
   * Build an index of line start positions for fast offset-to-line/column conversion.
   */
  private buildLineStarts(source: string): void {
    this.lineStarts = [0]; // Line 1 starts at offset 0
    for (let i = 0; i < source.length; i++) {
      if (source[i] === '\n') {
        this.lineStarts.push(i + 1);
      }
    }
  }

  /**
   * Build a map of tag locations by scanning source manually.
   * This is a fallback for when node-html-parser doesn't provide accurate ranges.
   */
  private buildTagLocationMap(source: string): void {
    const tagRegex = /<(\w+)([^>]*)>/g;
    let match;

    while ((match = tagRegex.exec(source)) !== null) {
      const tagName = match[1].toLowerCase();
      const attributes = match[2];
      const offset = match.index + 1; // Position of tag name (after '<')

      // Extract id if present
      const idMatch = attributes.match(/\bid\s*=\s*["']([^"']+)["']/);
      const id = idMatch ? idMatch[1] : null;

      const location = this.offsetToLineColumn(offset);

      // Create unique key: use id if available, otherwise use offset
      const key = id ? `${tagName}#${id}` : `${tagName}@${offset}`;
      this.tagLocationMap.set(key, location);
    }
  }

  /**
   * Convert character offset to line and column (both 1-indexed for line, 0-indexed for column).
   */
  private offsetToLineColumn(offset: number): { line: number; column: number } {
    // Binary search to find the line
    let left = 0;
    let right = this.lineStarts.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right + 1) / 2);
      if (this.lineStarts[mid] <= offset) {
        left = mid;
      } else {
        right = mid - 1;
      }
    }

    const line = left + 1; // Convert to 1-indexed
    const column = offset - this.lineStarts[left]; // 0-indexed column

    return { line, column };
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
   * Find element location by scanning source for matching tag.
   * Used for elements without IDs where we can't use the simple id-based lookup.
   */
  private findElementLocation(
    tagName: string,
    attributes: Record<string, string>,
    node: NodeHTMLElement
  ): { line: number; column: number } | null {
    // Try to use node-html-parser's range if available
    const nodeWithRange = node as any;
    if (nodeWithRange.range && Array.isArray(nodeWithRange.range) &&
        nodeWithRange.range.length >= 2 && nodeWithRange.range[0] > 0) {
      // range[0] is the start offset in the source
      const startOffset = nodeWithRange.range[0];

      // The range points to the start of the element's content region
      // We need to search backwards to find the actual < character
      const searchStart = Math.max(0, startOffset - 200);
      const searchRegion = this.sourceContent.substring(searchStart, startOffset + 50);

      // Build a regex to find this specific tag
      const classAttr = attributes.class;
      let pattern: RegExp;
      if (classAttr) {
        // Match tag with this class
        pattern = new RegExp(`<${tagName}[^>]*class\\s*=\\s*["'][^"']*${classAttr.split(' ')[0]}[^"']*["'][^>]*>`, 'gi');
      } else {
        // Match any instance of this tag
        pattern = new RegExp(`<${tagName}(?:\\s|>)`, 'gi');
      }

      const match = pattern.exec(searchRegion);
      if (match) {
        const tagOffset = searchStart + match.index + 1; // +1 to skip '<'
        return this.offsetToLineColumn(tagOffset);
      }
    }

    // Try offset-based lookup from our map
    // This works for elements we've seen during the initial scan
    for (const [key, loc] of this.tagLocationMap.entries()) {
      if (key.startsWith(`${tagName}@`)) {
        // Found an offset-based entry for this tag type
        // This is imprecise for multiple elements of same type, but better than nothing
        return loc;
      }
    }

    return null;
  }

  /**
   * Convert an element node to a DOMElement.
   */
  private convertElement(node: NodeHTMLElement, parent?: DOMElement): DOMElement {
    const tagName = node.rawTagName || 'div';
    const attributes = this.extractAttributes(node);

    // Get source location - use manual tag location map as PRIMARY source
    // node-html-parser's range property is unreliable
    let location: SourceLocation;
    const tagNameLower = tagName.toLowerCase();

    // PRIMARY: Use manual tag location map (most reliable)
    const id = attributes.id;
    const key = id ? `${tagNameLower}#${id}` : null;
    const mapLocation = key ? this.tagLocationMap.get(key) : null;

    if (mapLocation) {
      location = this.createLocation(mapLocation.line, mapLocation.column, tagName.length);
    } else {
      // FALLBACK: Try to find element by scanning for matching tag
      // This handles elements without IDs
      const foundLocation = this.findElementLocation(tagNameLower, attributes, node);
      if (foundLocation) {
        location = this.createLocation(foundLocation.line, foundLocation.column, tagName.length);
      } else {
        // Last resort: use (1, 0) which will at least not be (0, 0)
        location = this.createLocation(1, 0);
      }
    }

    const element: DOMElement = {
      id: this.generateId(),
      nodeType: 'element',
      tagName: tagName.toLowerCase(),
      attributes,
      children: [],
      parent,
      location,
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
  private createLocation(line: number, column: number, length?: number): SourceLocation {
    return {
      file: this.sourceFile,
      line,
      column,
      length,
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
