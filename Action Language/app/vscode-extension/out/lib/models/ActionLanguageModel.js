"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionLanguageModelImpl = void 0;
class ActionLanguageModelImpl {
    constructor(nodes, sourceFile) {
        this.type = 'ActionLanguage';
        this.version = '1.0.0';
        this.nodes = nodes;
        this.sourceFile = sourceFile;
    }
    parse(_source) {
        throw new Error('ActionLanguageModelImpl.parse() should not be called directly. Use JavaScriptParser.');
    }
    validate() {
        return {
            valid: true,
            errors: [],
            warnings: [],
        };
    }
    serialize() {
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
exports.ActionLanguageModelImpl = ActionLanguageModelImpl;
