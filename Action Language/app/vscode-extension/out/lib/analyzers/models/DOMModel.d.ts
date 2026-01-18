/**
 * DOM Model for Paradise Multi-Model Architecture
 *
 * This file defines the DOMModel interface and implementation for representing
 * HTML/XML/JSX structure in Paradise. The DOMModel can be extracted from:
 * - Static HTML files (traditional web apps)
 * - JSX components (React, Next.js, Gatsby)
 * - Vue SFC templates (future)
 * - Angular templates (future)
 *
 * The DOMModel serves as the integration point where JavaScript behaviors
 * (ActionLanguage) and CSS rules are attached to elements for comprehensive
 * accessibility analysis.
 */
import { Model, ModelNode, ValidationResult } from './BaseModel';
/**
 * Represents a single element in the DOM tree.
 *
 * This can represent:
 * - HTML elements: <button>, <div>, <input>
 * - JSX elements: <MyComponent>, <dialog>
 * - Text nodes
 * - Comments
 */
export interface DOMElement extends ModelNode {
    nodeType: 'element' | 'text' | 'comment';
    /** Tag name (e.g., "button", "div", "MyComponent") */
    tagName: string;
    /** Element attributes (id, class, role, aria-*, etc.) */
    attributes: Record<string, string>;
    /** Child elements */
    children: DOMElement[];
    /** Parent element (undefined for root) */
    parent?: DOMElement;
    /** Text content (for text nodes) */
    textContent?: string;
    /** JavaScript event handlers attached to this element */
    jsHandlers?: any[];
    /** CSS rules that apply to this element */
    cssRules?: any[];
    /** Computed accessibility properties */
    a11y?: {
        /** Is this element focusable? */
        focusable: boolean;
        /** Is this element interactive (has handlers)? */
        interactive: boolean;
        /** ARIA role (explicit or implicit) */
        role: string | null;
        /** ARIA label (computed from aria-label, aria-labelledby, or content) */
        label: string | null;
        /** Tab index value */
        tabIndex: number | null;
    };
}
/**
 * DOM Model interface.
 *
 * Represents the structure of a document (HTML page, JSX component, etc.)
 * and provides methods for querying elements.
 */
export interface DOMModel extends Model {
    type: 'DOM';
    /** Root element of the DOM tree */
    root: DOMElement;
    /**
     * Find element by ID.
     * @param id - Element ID to search for
     * @returns Element with matching ID, or null if not found
     */
    getElementById(id: string): DOMElement | null;
    /**
     * Query elements by CSS selector.
     * @param selector - CSS selector (supports #id, .class, tag, [attr])
     * @returns First matching element, or null if not found
     */
    querySelector(selector: string): DOMElement | null;
    /**
     * Query all elements matching a CSS selector.
     * @param selector - CSS selector
     * @returns Array of matching elements
     */
    querySelectorAll(selector: string): DOMElement[];
    /**
     * Get all elements in the DOM tree (depth-first traversal).
     * @returns Array of all elements
     */
    getAllElements(): DOMElement[];
    /**
     * Get all focusable elements in the DOM tree.
     * @returns Array of focusable elements
     */
    getFocusableElements(): DOMElement[];
    /**
     * Get all interactive elements (elements with event handlers).
     * @returns Array of interactive elements
     */
    getInteractiveElements(): DOMElement[];
}
/**
 * Concrete implementation of DOMModel.
 */
export declare class DOMModelImpl implements DOMModel {
    type: 'DOM';
    version: string;
    sourceFile: string;
    root: DOMElement;
    constructor(root: DOMElement, sourceFile: string);
    /**
     * Parse source code into DOM elements.
     * Note: This is implemented by specific parsers (HTMLParser, JSXParser).
     */
    parse(_source: string): ModelNode[];
    /**
     * Validate the DOM structure.
     * Checks for:
     * - Missing required attributes (e.g., alt on img)
     * - Invalid ARIA usage
     * - Accessibility issues at the HTML level
     */
    validate(): ValidationResult;
    /**
     * Serialize the DOM back to HTML/JSX.
     * Used for generating fixed code.
     */
    serialize(): string;
    private serializeElement;
    getElementById(id: string): DOMElement | null;
    querySelector(selector: string): DOMElement | null;
    querySelectorAll(selector: string): DOMElement[];
    getAllElements(): DOMElement[];
    getFocusableElements(): DOMElement[];
    getInteractiveElements(): DOMElement[];
    /**
     * Check if an element matches a CSS selector.
     * Supports: #id, .class, tag, [attr], [attr="value"]
     */
    private matchesSelector;
    /**
     * Check if an element is focusable.
     */
    private isFocusable;
    /**
     * Check if an element has an accessible label.
     */
    private hasAccessibleLabel;
    /**
     * Check if an ARIA attribute name is valid.
     */
    private isValidAriaAttribute;
    /**
     * Traverse all elements in the DOM tree (depth-first).
     */
    private traverseElements;
    /**
     * Find the first element matching a predicate.
     */
    private findElement;
}
