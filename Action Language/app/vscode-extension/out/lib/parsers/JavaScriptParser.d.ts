/**
 * JavaScript/TypeScript/JSX Parser for ActionLanguage
 *
 * This parser extracts ActionLanguage nodes (UI interaction patterns) from
 * JavaScript, TypeScript, and JSX source code. It detects:
 * - Event handlers (addEventListener, JSX event props)
 * - DOM manipulation (setAttribute, focus, blur)
 * - ARIA updates (setAttribute with aria-*)
 * - Focus changes (element.focus(), ref.current.focus())
 * - Navigation (window.location, history.pushState)
 *
 * The parser uses Babel to handle JSX and TypeScript syntax.
 */
import { ActionLanguageModelImpl } from '../models/ActionLanguageModel';
/**
 * JavaScript/TypeScript/JSX Parser
 *
 * Parses source code and extracts ActionLanguage nodes representing
 * UI interaction patterns.
 */
export declare class JavaScriptParser {
    private nodeCounter;
    private variableBindings;
    /**
     * Parse JavaScript/TypeScript/JSX source code into ActionLanguage model.
     *
     * @param source - Source code to parse
     * @param sourceFile - Filename for error reporting
     * @returns ActionLanguageModel
     *
     * @example
     * ```typescript
     * const parser = new JavaScriptParser();
     * const model = parser.parse(`
     *   const button = document.getElementById('submit');
     *   button.addEventListener('click', handleClick);
     * `, 'handlers.js');
     * ```
     */
    parse(source: string, sourceFile: string): ActionLanguageModelImpl;
    /**
     * Check if a call expression is addEventListener.
     */
    private isAddEventListener;
    /**
     * Check if a JSX attribute is an event handler (starts with "on").
     */
    private isJSXEventHandler;
    /**
     * Check if a call expression is setAttribute.
     */
    private isSetAttribute;
    /**
     * Check if a call expression is a focus change (focus(), blur()).
     */
    private isFocusChange;
    /**
     * Extract event handler from addEventListener call.
     */
    private extractEventHandler;
    /**
     * Extract event handler from JSX attribute (onClick, onKeyDown, etc.).
     */
    private extractJSXEventHandler;
    /**
     * Extract ARIA update from setAttribute call.
     */
    private extractAriaUpdate;
    /**
     * Extract focus change from focus() or blur() call.
     */
    private extractFocusChange;
    /**
     * Collect variable bindings for element references.
     * Example: const button = document.getElementById('submit');
     */
    private collectVariableBinding;
    /**
     * Extract element reference from an AST node.
     *
     * Handles patterns like:
     * - variable: button.addEventListener(...)
     * - getElementById: document.getElementById('submit')
     * - querySelector: document.querySelector('.nav-item')
     * - ref.current: buttonRef.current.focus()
     */
    private extractElementReference;
    /**
     * Extract element reference from an expression.
     * This is the core logic for identifying DOM element selectors.
     */
    private extractElementReferenceFromExpression;
    /**
     * Get the tag name from a JSX element.
     */
    private getJSXTagName;
    /**
     * Get the full name from a JSX member expression (e.g., Foo.Bar.Baz).
     */
    private getJSXMemberExpressionName;
    /**
     * Extract source location from an AST node.
     */
    private extractLocation;
    /**
     * Generate a unique ID for a node.
     */
    private generateId;
}
//# sourceMappingURL=JavaScriptParser.d.ts.map