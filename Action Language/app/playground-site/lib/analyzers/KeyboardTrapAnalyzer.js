"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardTrapAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class KeyboardTrapAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'KeyboardTrapAnalyzer';
        this.description = 'Detects keyboard traps and focus management issues';
    }
    analyze(context) {
        const issues = [];
        if (!this.supportsDocumentModel(context)) {
            return issues;
        }
        const modalIssues = this.checkModalDialogs(context);
        issues.push(...modalIssues);
        const focusTrapIssues = this.checkFocusTraps(context);
        issues.push(...focusTrapIssues);
        const tabPreventIssues = this.checkTabPrevention(context);
        issues.push(...tabPreventIssues);
        const focusLoopIssues = this.checkFocusLoops(context);
        issues.push(...focusLoopIssues);
        return issues;
    }
    checkModalDialogs(context) {
        const issues = [];
        if (!context.documentModel) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const dialogElements = allElements.filter(el => {
            const role = el.attributes.role;
            const ariaModal = el.attributes['aria-modal'];
            return role === 'dialog' || role === 'alertdialog' || ariaModal === 'true';
        });
        for (const dialog of dialogElements) {
            const hasEscapeHandler = this.hasEscapeKeyHandler(dialog, context);
            if (!hasEscapeHandler) {
                issues.push(this.createIssue('modal-without-escape', 'error', 'Modal dialog lacks Escape key handler. Users must be able to close modals with the Escape key to avoid keyboard traps.', dialog.location, ['2.1.2'], context, {
                    elementContext: context.documentModel.getElementContext(dialog),
                    fix: {
                        description: 'Add Escape key handler to close modal',
                        code: `// Add this event listener:\ndocument.addEventListener('keydown', (e) => {\n  if (e.key === 'Escape') {\n    closeModal();\n  }\n});`,
                        location: dialog.location
                    }
                }));
            }
            const hasFocusTrap = this.hasFocusTrapImplementation(dialog, context);
            if (hasFocusTrap && !hasEscapeHandler) {
                issues.push(this.createIssue('focus-trap-without-escape', 'error', 'Focus trap detected without Escape key exit. Focus traps must provide a keyboard-accessible way to exit.', dialog.location, ['2.1.2'], context, {
                    elementContext: context.documentModel.getElementContext(dialog)
                }));
            }
        }
        return issues;
    }
    checkFocusTraps(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const actions = context.actionLanguageModel.getAllEventHandlers();
        for (const action of actions) {
            if (action.event === 'keydown' || action.event === 'keypress') {
                const hasTabHandling = this.actionHandlesTabKey(action);
                const preventsDefault = this.actionPreventsDefault(action);
                if (hasTabHandling && preventsDefault) {
                    const hasEscapeInSameScope = this.hasEscapeHandlerInScope(action, actions);
                    if (!hasEscapeInSameScope) {
                        issues.push(this.createIssue('tab-trap-without-escape', 'error', 'Tab key handler prevents default behavior without providing Escape key exit. This creates a keyboard trap.', action.location, ['2.1.2'], context, {
                            fix: {
                                description: 'Add Escape key handler to allow exit',
                                code: `if (event.key === 'Escape') {\n  // Exit focus trap\n  exitTrap();\n}`,
                                location: action.location
                            }
                        }));
                    }
                }
            }
        }
        return issues;
    }
    checkTabPrevention(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const actions = context.actionLanguageModel.getAllEventHandlers();
        for (const action of actions) {
            if (action.event === 'keydown' || action.event === 'keypress') {
                const code = this.getActionCode(action);
                const hasTabPrevent = (code.includes('key') && code.includes('Tab')) &&
                    (code.includes('preventDefault') || code.includes('return false'));
                if (hasTabPrevent) {
                    const isProperFocusTrap = code.includes('querySelectorAll') ||
                        code.includes('focusable') ||
                        code.includes('tabbable');
                    if (isProperFocusTrap) {
                        const hasEscape = code.includes('Escape') ||
                            code.includes('Esc') ||
                            this.hasEscapeHandlerInScope(action, actions);
                        if (!hasEscape) {
                            issues.push(this.createIssue('focus-trap-missing-escape', 'error', 'Focus trap implementation prevents Tab but does not handle Escape key. Provide an exit mechanism.', action.location, ['2.1.2'], context, {
                                fix: {
                                    description: 'Add Escape key handler',
                                    code: `if (event.key === 'Escape') {\n  restoreFocus();\n  closeContainer();\n}`,
                                    location: action.location
                                }
                            }));
                        }
                    }
                    else {
                        issues.push(this.createIssue('tab-prevented-without-management', 'warning', 'Tab key default behavior is prevented without implementing focus management. This may create a keyboard trap.', action.location, ['2.1.2'], context));
                    }
                }
            }
        }
        return issues;
    }
    checkFocusLoops(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const actions = context.actionLanguageModel.getAllEventHandlers();
        for (const action of actions) {
            if (action.event === 'blur') {
                const code = this.getActionCode(action);
                if (code.includes('.focus()')) {
                    const isConditional = code.includes('if') ||
                        code.includes('?') ||
                        code.includes('&&') ||
                        code.includes('setTimeout');
                    if (!isConditional) {
                        issues.push(this.createIssue('blur-refocus-loop', 'error', 'Blur handler immediately calls focus(), creating an infinite focus loop that traps keyboard users.', action.location, ['2.1.2', '2.4.3'], context, {
                            fix: {
                                description: 'Make focus restoration conditional or remove it',
                                code: '// Only restore focus if needed:\nif (shouldRestoreFocus) {\n  element.focus();\n}',
                                location: action.location
                            }
                        }));
                    }
                }
            }
        }
        return issues;
    }
    hasEscapeKeyHandler(element, context) {
        if (!context.actionLanguageModel) {
            return false;
        }
        const elementContext = context.documentModel?.getElementContext(element);
        if (!elementContext?.jsHandlers) {
            return false;
        }
        for (const action of elementContext.jsHandlers) {
            if (action.event === 'keydown' || action.event === 'keypress') {
                const code = this.getActionCode(action);
                if (code.includes('Escape') || code.includes('Esc')) {
                    return true;
                }
            }
        }
        const allActions = context.actionLanguageModel.getAllEventHandlers();
        for (const action of allActions) {
            if ((action.event === 'keydown' || action.event === 'keypress')) {
                const code = this.getActionCode(action);
                if ((code.includes('Escape') || code.includes('Esc')) &&
                    (code.includes('close') || code.includes('hide') || code.includes('dismiss'))) {
                    return true;
                }
            }
        }
        return false;
    }
    hasFocusTrapImplementation(element, context) {
        if (!context.actionLanguageModel) {
            return false;
        }
        const elementContext = context.documentModel?.getElementContext(element);
        if (!elementContext?.jsHandlers) {
            return false;
        }
        for (const action of elementContext.jsHandlers) {
            if (action.event === 'keydown') {
                const code = this.getActionCode(action);
                const hasFocusTrapPattern = (code.includes('Tab') && code.includes('preventDefault')) ||
                    (code.includes('focusable') || code.includes('tabbable')) ||
                    (code.includes('firstFocusable') && code.includes('lastFocusable'));
                if (hasFocusTrapPattern) {
                    return true;
                }
            }
        }
        return false;
    }
    actionHandlesTabKey(action) {
        const code = this.getActionCode(action);
        return code.includes('Tab') ||
            (code.includes('key') && code.includes('9')) ||
            (code.includes('keyCode') && code.includes('9'));
    }
    actionPreventsDefault(action) {
        const code = this.getActionCode(action);
        return code.includes('preventDefault') || code.includes('return false');
    }
    hasEscapeHandlerInScope(action, allActions) {
        const actionLocation = action.location;
        for (const otherAction of allActions) {
            if (otherAction.location.file === actionLocation.file) {
                const code = this.getActionCode(otherAction);
                if (code.includes('Escape') || code.includes('Esc')) {
                    if (Math.abs((otherAction.location.line || 0) - (actionLocation.line || 0)) < 100) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    getActionCode(action) {
        if (action.handler) {
            return String(action.handler);
        }
        return '';
    }
}
exports.KeyboardTrapAnalyzer = KeyboardTrapAnalyzer;
