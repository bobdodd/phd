"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleLetterShortcutAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class SingleLetterShortcutAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'SingleLetterShortcutAnalyzer';
        this.description = 'Detects single letter keyboard shortcuts that may interfere with assistive technology';
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const handlers = context.actionLanguageModel.getAllEventHandlers();
        for (const handler of handlers) {
            if (handler.event === 'keydown' || handler.event === 'keypress') {
                const code = this.getHandlerCode(handler);
                const singleCharCheck = this.detectSingleCharacterShortcut(code);
                if (singleCharCheck.isSingleChar && !singleCharCheck.hasModifier) {
                    const hasDisableMechanism = this.hasDisableMechanism(code);
                    const isOnlyOnFocus = this.isOnlyActiveOnFocus(handler);
                    if (!hasDisableMechanism && !isOnlyOnFocus) {
                        issues.push(this.createIssue('single-letter-shortcut', 'warning', `Keyboard shortcut uses single character '${singleCharCheck.character}' without modifier keys. This can interfere with screen readers and speech input. Consider requiring Ctrl/Alt/Meta keys or providing a way to disable shortcuts.`, handler.location, ['2.1.4'], context, {
                            fix: {
                                description: 'Require modifier key for shortcut',
                                code: `// Check for modifier key:
if (event.key === '${singleCharCheck.character}' && (event.ctrlKey || event.metaKey)) {
  // Execute shortcut
  ${this.getShortcutAction(code)}
}`,
                                location: handler.location
                            }
                        }));
                    }
                    else if (isOnlyOnFocus) {
                        issues.push(this.createIssue('single-letter-shortcut-focus-only', 'info', `Keyboard shortcut uses single character '${singleCharCheck.character}'. While this is only active on focus (which is allowed), consider adding a mechanism to remap or disable it for users who may have conflicts.`, handler.location, ['2.1.4'], context));
                    }
                }
            }
        }
        return issues;
    }
    detectSingleCharacterShortcut(code) {
        const keyPatterns = [
            /event\.key\s*===?\s*['"]([a-zA-Z0-9\.,;!?\/\-\+=\*])['"]/,
            /event\.key\s*===?\s*['"]([A-Z])['"]/,
            /e\.key\s*===?\s*['"]([a-zA-Z0-9\.,;!?\/\-\+=\*])['"]/,
            /key\s*===?\s*['"]([a-zA-Z0-9\.,;!?\/\-\+=\*])['"]/,
        ];
        for (const pattern of keyPatterns) {
            const match = code.match(pattern);
            if (match) {
                const hasModifier = code.includes('ctrlKey') ||
                    code.includes('metaKey') ||
                    code.includes('altKey') ||
                    code.includes('shiftKey && ') ||
                    code.includes('&& event.ctrlKey') ||
                    code.includes('&& event.metaKey') ||
                    code.includes('&& event.altKey');
                return {
                    isSingleChar: true,
                    character: match[1],
                    hasModifier
                };
            }
        }
        const keyCodePattern = /(?:event\.keyCode|e\.keyCode|keyCode)\s*===?\s*(\d+)/;
        const keyCodeMatch = code.match(keyCodePattern);
        if (keyCodeMatch) {
            const keyCode = parseInt(keyCodeMatch[1], 10);
            if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90)) {
                const hasModifier = code.includes('ctrlKey') ||
                    code.includes('metaKey') ||
                    code.includes('altKey');
                let character = '';
                if (keyCode >= 48 && keyCode <= 57) {
                    character = String.fromCharCode(keyCode);
                }
                else if (keyCode >= 65 && keyCode <= 90) {
                    character = String.fromCharCode(keyCode).toLowerCase();
                }
                return {
                    isSingleChar: true,
                    character,
                    hasModifier
                };
            }
        }
        return { isSingleChar: false, hasModifier: false };
    }
    hasDisableMechanism(code) {
        const disableMechanismPatterns = [
            /if\s*\(\s*shortcutsEnabled/i,
            /if\s*\(\s*!disableShortcuts/i,
            /if\s*\(\s*settings\.shortcuts/i,
            /if\s*\(\s*!shortcutDisabled/i,
            /if\s*\(\s*enableShortcuts/i,
            /shortcutEnabled\s*&&/i,
            /!shortcutDisabled\s*&&/i,
        ];
        for (const pattern of disableMechanismPatterns) {
            if (pattern.test(code)) {
                return true;
            }
        }
        return false;
    }
    isOnlyActiveOnFocus(handler) {
        const code = this.getHandlerCode(handler);
        const isGlobal = code.includes('document.addEventListener') ||
            code.includes('window.addEventListener') ||
            code.includes('document.onkeydown') ||
            code.includes('window.onkeydown') ||
            code.includes('document.onkeypress') ||
            code.includes('window.onkeypress');
        if (isGlobal) {
            return false;
        }
        return true;
    }
    getShortcutAction(code) {
        const lines = code.split('\n');
        const actionLines = [];
        let inKeyCheck = false;
        for (const line of lines) {
            if (line.includes('key') || line.includes('keyCode')) {
                inKeyCheck = true;
                continue;
            }
            if (inKeyCheck && line.trim() && !line.includes('}')) {
                actionLines.push(line.trim());
            }
            if (line.includes('}')) {
                break;
            }
        }
        return actionLines.join('\n') || '// Your shortcut action here';
    }
    getHandlerCode(handler) {
        if (handler.handler) {
            return String(handler.handler);
        }
        return '';
    }
}
exports.SingleLetterShortcutAnalyzer = SingleLetterShortcutAnalyzer;
