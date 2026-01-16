"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionLanguageModelImpl = void 0;
/**
 * Concrete implementation of ActionLanguageModel.
 */
var ActionLanguageModelImpl = /** @class */ (function () {
    function ActionLanguageModelImpl(nodes, sourceFile) {
        this.type = 'ActionLanguage';
        this.version = '1.0.0';
        this.nodes = nodes;
        this.sourceFile = sourceFile;
    }
    /**
     * Parse source code into ActionLanguage nodes.
     * Note: This is implemented by JavaScriptParser.
     */
    ActionLanguageModelImpl.prototype.parse = function (_source) {
        throw new Error('ActionLanguageModelImpl.parse() should not be called directly. Use JavaScriptParser.');
    };
    /**
     * Validate the ActionLanguage nodes.
     * Checks for:
     * - Orphaned event handlers (no matching DOM element)
     * - Missing keyboard handlers for click handlers
     * - Invalid ARIA state changes
     */
    ActionLanguageModelImpl.prototype.validate = function () {
        // Validation is performed by analyzers, not at the model level
        return {
            valid: true,
            errors: [],
            warnings: [],
        };
    };
    /**
     * Serialize the ActionLanguage nodes back to source code.
     * Used for generating fixed code.
     */
    ActionLanguageModelImpl.prototype.serialize = function () {
        // Serialization is complex and not implemented yet
        // Would require converting ActionLanguage back to JavaScript AST
        throw new Error('ActionLanguageModel serialization not yet implemented');
    };
    ActionLanguageModelImpl.prototype.findBySelector = function (selector) {
        return this.nodes.filter(function (node) { return node.element.selector === selector; });
    };
    ActionLanguageModelImpl.prototype.findByElementBinding = function (binding) {
        return this.nodes.filter(function (node) { return node.element.binding === binding; });
    };
    ActionLanguageModelImpl.prototype.findByActionType = function (actionType) {
        return this.nodes.filter(function (node) { return node.actionType === actionType; });
    };
    ActionLanguageModelImpl.prototype.findEventHandlers = function (event) {
        return this.nodes.filter(function (node) { return node.actionType === 'eventHandler' && node.event === event; });
    };
    ActionLanguageModelImpl.prototype.getAllEventHandlers = function () {
        return this.findByActionType('eventHandler');
    };
    ActionLanguageModelImpl.prototype.getAllFocusActions = function () {
        return this.findByActionType('focusChange');
    };
    ActionLanguageModelImpl.prototype.getAllAriaActions = function () {
        return this.findByActionType('ariaStateChange');
    };
    return ActionLanguageModelImpl;
}());
exports.ActionLanguageModelImpl = ActionLanguageModelImpl;
//# sourceMappingURL=ActionLanguageModel.js.map