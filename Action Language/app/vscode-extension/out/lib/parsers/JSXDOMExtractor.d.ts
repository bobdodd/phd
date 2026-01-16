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
import { DOMModelImpl } from '../models/DOMModel';
/**
 * JSX DOM Extractor
 *
 * Extracts virtual DOM structure from JSX/TSX components.
 */
export declare class JSXDOMExtractor {
    private elementCounter;
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
    extract(source: string, sourceFile: string): DOMModelImpl | null;
    /**
     * Extract a DOM element from a JSX node.
     */
    private extractJSXElement;
    /**
     * Convert a JSX element to a DOMElement.
     */
    private convertJSXElement;
    /**
     * Convert a JSX fragment to a DOMElement.
     * Fragments are represented as a wrapper element.
     */
    private convertJSXFragment;
    /**
     * Convert a JSX child node to a DOMElement.
     */
    private convertJSXChild;
    /**
     * Get the tag name from a JSX identifier or member expression.
     */
    private getTagName;
    /**
     * Get the full name from a JSX member expression.
     */
    private getJSXMemberExpressionName;
    /**
     * Extract attributes from JSX opening element.
     */
    private extractAttributes;
    /**
     * Get attribute name from JSX identifier or namespaced name.
     * Normalizes React JSX attribute names to HTML attribute names.
     */
    private getAttributeName;
    /**
     * Get attribute value from JSX attribute value.
     */
    private getAttributeValue;
    /**
     * Check if a tag name represents a React component.
     * React components start with uppercase letters.
     */
    private isReactComponent;
    /**
     * Extract source location from an AST node.
     */
    private extractLocation;
    /**
     * Generate a unique ID for an element.
     */
    private generateId;
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
export declare function extractJSXDOM(source: string, sourceFile: string): DOMModelImpl | null;
//# sourceMappingURL=JSXDOMExtractor.d.ts.map