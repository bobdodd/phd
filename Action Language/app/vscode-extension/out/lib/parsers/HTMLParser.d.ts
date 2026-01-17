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
import { DOMModelImpl } from '../models/DOMModel';
/**
 * HTML Parser
 *
 * Parses traditional HTML documents and converts them to DOMModel.
 */
export declare class HTMLParser {
    private elementCounter;
    private sourceFile;
    private sourceContent;
    private lineStarts;
    private tagLocationMap;
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
    parse(source: string, sourceFile: string): DOMModelImpl;
    /**
     * Build an index of line start positions for fast offset-to-line/column conversion.
     */
    private buildLineStarts;
    /**
     * Build a map of tag locations by scanning source manually.
     * This is a fallback for when node-html-parser doesn't provide accurate ranges.
     */
    private buildTagLocationMap;
    /**
     * Convert character offset to line and column (both 1-indexed for line, 0-indexed for column).
     */
    private offsetToLineColumn;
    /**
     * Find element location by scanning source for matching tag.
     * Used for elements without IDs where we can't use the simple id-based lookup.
     */
    private findElementLocation;
    /**
     * Convert a node-html-parser node to a DOMElement.
     */
    private convertNode;
    /**
     * Convert an element node to a DOMElement.
     */
    private convertElement;
    /**
     * Convert a text node to a DOMElement.
     */
    private convertTextNode;
    /**
     * Convert a comment node to a DOMElement.
     */
    private convertCommentNode;
    /**
     * Extract attributes from an HTML element.
     */
    private extractAttributes;
    /**
     * Create a source location object.
     */
    private createLocation;
    /**
     * Generate a unique ID for an element.
     */
    private generateId;
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
export declare function parseHTML(source: string, sourceFile: string): DOMModelImpl;
//# sourceMappingURL=HTMLParser.d.ts.map