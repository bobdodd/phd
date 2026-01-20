"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalAccessibilityAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class ModalAccessibilityAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'ModalAccessibilityAnalyzer';
        this.description = 'Detects accessibility issues with modal dialogs and focus management';
    }
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context) || !context.documentModel) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const modalElements = this.findModalElements(allElements, context);
        for (const modal of modalElements) {
            this.checkModalStructure(modal, context, issues);
            this.checkModalARIA(modal, context, issues);
            this.checkModalCloseButton(modal, context, issues);
            this.checkEscapeHandler(modal, context, issues);
            this.checkFocusTrap(modal, context, issues);
            this.checkFocusManagement(modal, context, issues);
        }
        return issues;
    }
    findModalElements(elements, context) {
        const modals = [];
        for (const element of elements) {
            if (element.attributes.role === 'dialog' || element.attributes.role === 'alertdialog') {
                modals.push(element);
                continue;
            }
            const className = element.attributes.class || '';
            const id = element.attributes.id || '';
            const modalPatterns = [
                /modal/i,
                /dialog/i,
                /overlay/i,
                /popup/i,
                /lightbox/i
            ];
            const isLikelyModal = modalPatterns.some(pattern => pattern.test(className) || pattern.test(id));
            if (isLikelyModal) {
                const elementContext = context.documentModel?.getElementContext(element);
                if (elementContext?.jsHandlers && elementContext.jsHandlers.length > 0) {
                    modals.push(element);
                }
            }
        }
        return modals;
    }
    checkModalStructure(modal, context, issues) {
        const hasDialogRole = modal.attributes.role === 'dialog' ||
            modal.attributes.role === 'alertdialog';
        if (!hasDialogRole) {
            issues.push(this.createIssue('modal-missing-role', 'error', `Element appears to be a modal but lacks role="dialog" or role="alertdialog". Screen readers need this to announce it properly.`, modal.location, ['4.1.2'], context, {
                elementContext: context.documentModel?.getElementContext(modal),
                fix: {
                    description: 'Add role="dialog" to modal element',
                    code: this.addRoleAttribute(modal, 'dialog'),
                    location: modal.location
                }
            }));
        }
    }
    checkModalARIA(modal, context, issues) {
        const hasAriaModal = modal.attributes['aria-modal'] === 'true';
        if (!hasAriaModal) {
            issues.push(this.createIssue('modal-missing-aria-modal', 'warning', `Modal lacks aria-modal="true". This tells screen readers that content behind the modal is inert.`, modal.location, ['4.1.2'], context, {
                elementContext: context.documentModel?.getElementContext(modal),
                fix: {
                    description: 'Add aria-modal="true" to modal',
                    code: this.addAriaAttribute(modal, 'aria-modal', 'true'),
                    location: modal.location
                }
            }));
        }
        const hasLabel = modal.attributes['aria-labelledby'] || modal.attributes['aria-label'];
        if (!hasLabel) {
            issues.push(this.createIssue('modal-missing-label', 'error', `Modal lacks aria-labelledby or aria-label. Screen readers need a descriptive label to announce the modal's purpose.`, modal.location, ['4.1.2'], context, {
                elementContext: context.documentModel?.getElementContext(modal),
                fix: {
                    description: 'Add aria-label to modal',
                    code: this.addAriaAttribute(modal, 'aria-label', 'Dialog'),
                    location: modal.location
                }
            }));
        }
    }
    checkModalCloseButton(modal, context, issues) {
        if (!context.documentModel)
            return;
        const allElements = context.documentModel.getAllElements();
        const modalButtons = this.findDescendants(modal, allElements).filter(el => el.tagName.toLowerCase() === 'button' ||
            (el.tagName.toLowerCase() === 'div' && el.attributes.role === 'button'));
        const hasCloseButton = modalButtons.some(button => {
            const className = button.attributes.class || '';
            const ariaLabel = button.attributes['aria-label'] || '';
            const textContent = this.getTextContent(button, allElements);
            const closePatterns = [
                /close/i,
                /dismiss/i,
                /cancel/i,
                /×/,
                /✕/
            ];
            return closePatterns.some(pattern => pattern.test(className) ||
                pattern.test(ariaLabel) ||
                pattern.test(textContent));
        });
        if (!hasCloseButton) {
            issues.push(this.createIssue('modal-no-close-button', 'warning', `Modal lacks a visible close button. Users need a clear way to dismiss the modal besides pressing Escape.`, modal.location, ['2.1.2'], context, {
                elementContext: context.documentModel?.getElementContext(modal)
            }));
        }
    }
    checkEscapeHandler(modal, context, issues) {
        if (!context.actionLanguageModel)
            return;
        const elementContext = context.documentModel?.getElementContext(modal);
        const hasEscapeHandler = this.hasEscapeKeyHandler(modal, context);
        if (!hasEscapeHandler) {
            issues.push(this.createIssue('modal-no-escape-handler', 'error', `Modal cannot be closed with Escape key. This violates WCAG 2.1.2 (No Keyboard Trap) - users must be able to exit the modal using keyboard alone.`, modal.location, ['2.1.2'], context, {
                elementContext
            }));
        }
    }
    checkFocusTrap(modal, context, issues) {
        if (!context.actionLanguageModel)
            return;
        const elementContext = context.documentModel?.getElementContext(modal);
        const hasFocusTrap = this.hasFocusTrapPattern(modal, context);
        if (!hasFocusTrap) {
            issues.push(this.createIssue('modal-no-focus-trap', 'warning', `Modal lacks focus trap implementation. Focus should cycle within the modal when Tab is pressed at the last focusable element.`, modal.location, ['2.4.3', '2.1.2'], context, {
                elementContext
            }));
        }
    }
    checkFocusManagement(modal, context, issues) {
        if (!context.actionLanguageModel)
            return;
        const elementContext = context.documentModel?.getElementContext(modal);
        const hasFocusManagement = this.hasFocusManagementPattern(modal, context);
        if (!hasFocusManagement) {
            issues.push(this.createIssue('modal-no-focus-management', 'warning', `Modal lacks focus management. Focus should move to the modal when opened, and return to the trigger element when closed.`, modal.location, ['2.4.3'], context, {
                elementContext
            }));
        }
    }
    hasEscapeKeyHandler(modal, context) {
        if (!context.actionLanguageModel)
            return false;
        const elementContext = context.documentModel?.getElementContext(modal);
        if (elementContext?.jsHandlers) {
            for (const handler of elementContext.jsHandlers) {
                if (handler.event === 'keydown' || handler.event === 'keypress') {
                    const code = this.getHandlerCode(handler);
                    if (code.includes('Escape') || code.includes('Esc') || code.includes('key') && code.includes('27')) {
                        return true;
                    }
                }
            }
        }
        const allHandlers = context.actionLanguageModel.getAllEventHandlers();
        for (const handler of allHandlers) {
            if (handler.event === 'keydown' || handler.event === 'keypress') {
                const code = this.getHandlerCode(handler);
                if ((code.includes('Escape') || code.includes('Esc') || code.includes('27')) &&
                    (code.includes('close') || code.includes('hide') || code.includes('dismiss') ||
                        code.includes('remove') || code.includes('style.display'))) {
                    return true;
                }
            }
        }
        return false;
    }
    hasFocusTrapPattern(_modal, context) {
        if (!context.actionLanguageModel)
            return false;
        const allHandlers = context.actionLanguageModel.getAllEventHandlers();
        for (const handler of allHandlers) {
            if (handler.event === 'keydown') {
                const code = this.getHandlerCode(handler);
                const hasFocusTrapPattern = (code.includes('Tab') || code.includes('key') && code.includes('9')) &&
                    (code.includes('querySelector') || code.includes('querySelectorAll')) &&
                    (code.includes('focus') || code.includes('focusable'));
                if (hasFocusTrapPattern)
                    return true;
            }
        }
        return false;
    }
    hasFocusManagementPattern(_modal, context) {
        if (!context.actionLanguageModel)
            return false;
        const elementContext = context.documentModel?.getElementContext(_modal);
        if (!elementContext?.jsHandlers)
            return false;
        for (const handler of elementContext.jsHandlers) {
            const code = this.getHandlerCode(handler);
            if (code.includes('.focus()')) {
                return true;
            }
        }
        const allHandlers = context.actionLanguageModel.getAllEventHandlers();
        for (const handler of allHandlers) {
            const code = this.getHandlerCode(handler);
            if ((code.includes('show') || code.includes('open')) && code.includes('.focus()')) {
                return true;
            }
        }
        return false;
    }
    getHandlerCode(handler) {
        if (typeof handler.handler === 'string') {
            return handler.handler;
        }
        if (handler.handler && typeof handler.handler === 'object') {
            return JSON.stringify(handler.handler);
        }
        return '';
    }
    findDescendants(parent, allElements) {
        const descendants = [];
        for (const element of allElements) {
            if (element !== parent && element.location.file === parent.location.file) {
                if (element.location.line > parent.location.line) {
                    descendants.push(element);
                }
            }
        }
        return descendants;
    }
    getTextContent(_element, _allElements) {
        return '';
    }
    addRoleAttribute(element, role) {
        const attrs = { ...element.attributes, role };
        const attrString = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        return `<${element.tagName} ${attrString}>`;
    }
    addAriaAttribute(element, ariaKey, ariaValue) {
        const attrs = { ...element.attributes, [ariaKey]: ariaValue };
        const attrString = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        return `<${element.tagName} ${attrString}>`;
    }
}
exports.ModalAccessibilityAnalyzer = ModalAccessibilityAnalyzer;
