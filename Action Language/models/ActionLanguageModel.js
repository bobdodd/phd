/**
 * ActionLanguage Model for Paradise Multi-Model Architecture
 *
 * This file defines the ActionLanguageModel interface for representing
 * UI interaction behaviors extracted from JavaScript/TypeScript code.
 *
 * ActionLanguage captures:
 * - Event handlers (click, keydown, focus, etc.)
 * - DOM manipulation (setAttribute, classList, etc.)
 * - Focus management (focus(), blur())
 * - ARIA state changes
 * - Navigation (location.href, history.pushState)
 *
 * These behaviors are extracted from source code and linked to DOM elements
 * during the DocumentModel merge process.
 */
/**
 * Concrete implementation of ActionLanguageModel.
 */
export class ActionLanguageModelImpl {
    constructor(nodes, sourceFile) {
        this.type = 'ActionLanguage';
        this.version = '1.0.0';
        this.nodes = nodes;
        this.sourceFile = sourceFile;
    }
    /**
     * Parse source code into ActionLanguage nodes.
     * Note: This is implemented by JavaScriptParser.
     */
    parse(_source) {
        throw new Error('ActionLanguageModelImpl.parse() should not be called directly. Use JavaScriptParser.');
    }
    /**
     * Validate the ActionLanguage nodes.
     * Checks for:
     * - Orphaned event handlers (no matching DOM element)
     * - Missing keyboard handlers for click handlers
     * - Invalid ARIA state changes
     */
    validate() {
        // Validation is performed by analyzers, not at the model level
        return {
            valid: true,
            errors: [],
            warnings: [],
        };
    }
    /**
     * Serialize the ActionLanguage nodes back to source code.
     * Used for generating fixed code.
     */
    serialize() {
        // Serialization is complex and not implemented yet
        // Would require converting ActionLanguage back to JavaScript AST
        throw new Error('ActionLanguageModel serialization not yet implemented');
    }
    findBySelector(selector) {
        return this.nodes.filter((node) => node.element.selector === selector);
    }
    findByElementBinding(binding) {
        return this.nodes.filter((node) => node.element.binding === binding);
    }
    findByActionType(actionType) {
        return this.nodes.filter((node) => node.actionType === actionType);
    }
    findEventHandlers(event) {
        return this.nodes.filter((node) => node.actionType === 'eventHandler' && node.event === event);
    }
    getAllEventHandlers() {
        return this.findByActionType('eventHandler');
    }
    getAllFocusActions() {
        return this.findByActionType('focusChange');
    }
    getAllAriaActions() {
        return this.findByActionType('ariaStateChange');
    }
}
//# sourceMappingURL=ActionLanguageModel.js.map