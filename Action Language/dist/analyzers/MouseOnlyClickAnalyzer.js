"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseOnlyClickAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class MouseOnlyClickAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'mouse-only-click';
        this.description = 'Detects click handlers without corresponding keyboard handlers';
    }
    analyze(context) {
        if (this.supportsDocumentModel(context)) {
            return this.analyzeWithDocumentModel(context);
        }
        if (context.actionLanguageModel) {
            return this.analyzeFileScope(context);
        }
        return [];
    }
    analyzeWithDocumentModel(context) {
        const issues = [];
        const documentModel = context.documentModel;
        if (!documentModel.dom)
            return issues;
        const interactiveElements = documentModel.getInteractiveElements();
        for (const elementContext of interactiveElements) {
            if (this.hasNativeKeyboardSupport(elementContext.element)) {
                continue;
            }
            if (elementContext.hasClickHandler &&
                !elementContext.hasKeyboardHandler) {
                const element = elementContext.element;
                const clickHandler = elementContext.jsHandlers.find((h) => h.actionType === 'eventHandler' && h.event === 'click');
                if (!clickHandler)
                    continue;
                const message = this.createMessage(element.tagName, element.attributes.id);
                const fix = this.generateFix(elementContext, clickHandler);
                issues.push(this.createIssue('mouse-only-click', 'error', message, element.location, ['2.1.1'], context, {
                    relatedLocations: [clickHandler.location],
                    elementContext,
                    fix,
                }));
            }
        }
        return issues;
    }
    analyzeFileScope(context) {
        const issues = [];
        const model = context.actionLanguageModel;
        const clickHandlers = model.findEventHandlers('click');
        for (const clickHandler of clickHandlers) {
            const selector = clickHandler.element.selector;
            const hasKeyboardHandler = this.hasKeyboardHandlerForSelector(model, selector);
            if (!hasKeyboardHandler) {
                const message = `Element with selector "${selector}" has click handler but no keyboard handler (file-scope analysis - may be false positive if handler is in another file)`;
                issues.push(this.createIssue('mouse-only-click', 'warning', message, clickHandler.location, ['2.1.1'], context, {
                    fix: this.generateFileScopeFix(clickHandler),
                }));
            }
        }
        return issues;
    }
    hasNativeKeyboardSupport(element) {
        const tagName = element.tagName.toLowerCase();
        const nativeInteractive = [
            'button',
            'a',
            'input',
            'select',
            'textarea',
            'summary',
        ];
        if (nativeInteractive.includes(tagName)) {
            return true;
        }
        const role = element.attributes.role;
        const rolesWithNativeKeyboard = [
            'button',
            'link',
            'menuitem',
            'menuitemcheckbox',
            'menuitemradio',
            'option',
            'radio',
            'switch',
            'tab',
        ];
        if (role && rolesWithNativeKeyboard.includes(role)) {
            return true;
        }
        return false;
    }
    hasKeyboardHandlerForSelector(model, selector) {
        const handlers = Array.isArray(model)
            ? model.filter((n) => n.element.selector === selector)
            : model.findBySelector(selector);
        const keyboardEvents = ['keydown', 'keypress', 'keyup'];
        return handlers.some((h) => h.actionType === 'eventHandler' &&
            h.event &&
            keyboardEvents.includes(h.event));
    }
    createMessage(tagName, id) {
        const elementDesc = id
            ? `<${tagName}> element with id="${id}"`
            : `<${tagName}> element`;
        return `${elementDesc} has click handler but no keyboard handler. All interactive elements must be keyboard accessible (WCAG 2.1.1).`;
    }
    generateFix(elementContext, clickHandler) {
        const element = elementContext.element;
        const tagName = element.tagName.toLowerCase();
        let keyboardCode = '';
        if (tagName === 'button' || element.attributes.role === 'button') {
            keyboardCode = `
${this.getElementSelector(element)}.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    // Call the same handler as click
    // TODO: Extract click handler logic here
  }
});`.trim();
        }
        else {
            keyboardCode = `
${this.getElementSelector(element)}.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    // Call the same handler as click
    // TODO: Extract click handler logic here
  }
});`.trim();
        }
        return {
            description: `Add keyboard event handler for ${tagName}`,
            code: keyboardCode,
            location: clickHandler.location,
        };
    }
    generateFileScopeFix(clickHandler) {
        const selector = clickHandler.element.selector;
        const keyboardCode = `
// Add keyboard handler for ${selector}
document.querySelector('${selector}').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    // Call the same handler as click
    // TODO: Extract click handler logic here
  }
});`.trim();
        return {
            description: `Add keyboard handler for ${selector}`,
            code: keyboardCode,
            location: clickHandler.location,
        };
    }
    getElementSelector(element) {
        if (element.attributes.id) {
            return `document.getElementById('${element.attributes.id}')`;
        }
        if (element.attributes.class) {
            const classes = element.attributes.class.split(/\s+/);
            return `document.querySelector('.${classes[0]}')`;
        }
        return `document.querySelector('${element.tagName.toLowerCase()}')`;
    }
}
exports.MouseOnlyClickAnalyzer = MouseOnlyClickAnalyzer;
//# sourceMappingURL=MouseOnlyClickAnalyzer.js.map