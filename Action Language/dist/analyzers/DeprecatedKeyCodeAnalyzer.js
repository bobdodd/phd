"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeprecatedKeyCodeAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class DeprecatedKeyCodeAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'DeprecatedKeyCodeAnalyzer';
        this.description = 'Detects usage of deprecated KeyboardEvent.keyCode and recommends modern alternatives';
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const allHandlers = context.actionLanguageModel.getAllEventHandlers();
        for (const handler of allHandlers) {
            if (handler.event && this.isKeyboardEvent(handler.event)) {
                this.checkHandlerForDeprecatedAPIs(handler, context, issues);
            }
        }
        return issues;
    }
    isKeyboardEvent(eventType) {
        const keyboardEvents = ['keydown', 'keyup', 'keypress'];
        return keyboardEvents.includes(eventType.toLowerCase());
    }
    checkHandlerForDeprecatedAPIs(handler, context, issues) {
        const code = this.getHandlerCode(handler);
        if (!code)
            return;
        if (this.usesKeyCode(code)) {
            this.reportDeprecatedKeyCode(handler, code, context, issues);
        }
        if (this.usesWhich(code)) {
            this.reportDeprecatedWhich(handler, code, context, issues);
        }
        if (this.usesCharCode(code)) {
            this.reportDeprecatedCharCode(handler, code, context, issues);
        }
        if (this.usesNumericKeyComparison(code)) {
            this.reportNumericKeyComparison(handler, code, context, issues);
        }
    }
    usesKeyCode(code) {
        return /\b(e|event|evt)\s*\.\s*keyCode\b/i.test(code);
    }
    usesWhich(code) {
        return /\b(e|event|evt)\s*\.\s*which\b/i.test(code);
    }
    usesCharCode(code) {
        return /\b(e|event|evt)\s*\.\s*charCode\b/i.test(code);
    }
    usesNumericKeyComparison(code) {
        const commonKeyCodes = [9, 13, 27, 32, 37, 38, 39, 40];
        for (const keyCode of commonKeyCodes) {
            const pattern = new RegExp(`[=!]{2,3}\\s*${keyCode}\\b|\\b${keyCode}\\s*[=!]{2,3}`);
            if (pattern.test(code)) {
                return true;
            }
        }
        return false;
    }
    reportDeprecatedKeyCode(handler, code, context, issues) {
        const keyCodeValues = this.extractKeyCodeValues(code);
        const modernAlternative = this.getModernKeyAlternative(keyCodeValues);
        issues.push(this.createIssue('deprecated-keycode', 'warning', `Keyboard event handler uses deprecated event.keyCode. This property has been deprecated since 2016 and may not work in future browsers. Use event.key or event.code instead.`, handler.location, ['2.1.1'], context, {
            fix: {
                description: `Replace event.keyCode with modern event.key:

Deprecated (OLD):
if (e.keyCode === 13) { /* Enter key */ }
if (e.keyCode === 27) { /* Escape key */ }

Modern (NEW):
if (e.key === 'Enter') { /* Enter key */ }
if (e.key === 'Escape') { /* Escape key */ }

${modernAlternative}`,
                code: this.generateModernKeyCodeFix(code),
                location: handler.location
            }
        }));
    }
    reportDeprecatedWhich(handler, code, context, issues) {
        issues.push(this.createIssue('deprecated-which', 'warning', `Keyboard event handler uses deprecated event.which. Use event.key instead for better cross-browser compatibility and readability.`, handler.location, ['2.1.1'], context, {
            fix: {
                description: `Replace event.which with event.key:

Deprecated (OLD):
if (e.which === 13) { /* Enter */ }

Modern (NEW):
if (e.key === 'Enter') { /* Enter */ }`,
                code: this.generateModernKeyCodeFix(code),
                location: handler.location
            }
        }));
    }
    reportDeprecatedCharCode(handler, _code, context, issues) {
        issues.push(this.createIssue('deprecated-charcode', 'info', `Keyboard event handler uses deprecated event.charCode. Use event.key for character input detection.`, handler.location, ['2.1.1'], context, {
            fix: {
                description: `Replace event.charCode with event.key:

Deprecated (OLD):
const char = String.fromCharCode(e.charCode);

Modern (NEW):
const char = e.key; // Already a string`,
                code: `// Use e.key instead of e.charCode
const char = e.key;`,
                location: handler.location
            }
        }));
    }
    reportNumericKeyComparison(handler, code, context, issues) {
        const detectedKeyCodes = this.extractNumericKeyCodes(code);
        const keyNames = detectedKeyCodes.map(kc => this.keyCodeToKeyName(kc)).join(', ');
        issues.push(this.createIssue('numeric-key-comparison', 'info', `Keyboard event handler compares with numeric key codes (${detectedKeyCodes.join(', ')}). While this works, using event.key with string names ('${keyNames}') is more readable and maintainable.`, handler.location, ['2.1.1'], context, {
            fix: {
                description: `Replace numeric key codes with readable key names:

Less Readable (OLD):
if (e.keyCode === 13) { }
if (e.keyCode === 27) { }

More Readable (NEW):
if (e.key === 'Enter') { }
if (e.key === 'Escape') { }

Detected key codes: ${detectedKeyCodes.map(kc => `${kc} = '${this.keyCodeToKeyName(kc)}'`).join(', ')}`,
                code: this.generateModernKeyCodeFix(code),
                location: handler.location
            }
        }));
    }
    extractKeyCodeValues(code) {
        const matches = code.match(/keyCode\s*[=!]{2,3}\s*(\d+)/g);
        if (!matches)
            return [];
        return matches.map(match => {
            const num = match.match(/\d+/);
            return num ? parseInt(num[0], 10) : 0;
        }).filter(n => n > 0);
    }
    extractNumericKeyCodes(code) {
        const keyCodes = new Set();
        const commonKeyCodes = [9, 13, 27, 32, 37, 38, 39, 40];
        for (const keyCode of commonKeyCodes) {
            const pattern = new RegExp(`[=!]{2,3}\\s*${keyCode}\\b|\\b${keyCode}\\s*[=!]{2,3}`);
            if (pattern.test(code)) {
                keyCodes.add(keyCode);
            }
        }
        return Array.from(keyCodes).sort((a, b) => a - b);
    }
    getModernKeyAlternative(keyCodes) {
        if (keyCodes.length === 0)
            return '';
        const suggestions = keyCodes.map(kc => {
            const keyName = this.keyCodeToKeyName(kc);
            return `  ${kc} → '${keyName}'`;
        });
        return `Common key code mappings:\n${suggestions.join('\n')}`;
    }
    keyCodeToKeyName(keyCode) {
        const keyMap = {
            8: 'Backspace',
            9: 'Tab',
            13: 'Enter',
            27: 'Escape',
            32: ' ',
            33: 'PageUp',
            34: 'PageDown',
            35: 'End',
            36: 'Home',
            37: 'ArrowLeft',
            38: 'ArrowUp',
            39: 'ArrowRight',
            40: 'ArrowDown',
            46: 'Delete',
            112: 'F1',
            113: 'F2',
            114: 'F3',
            115: 'F4',
            116: 'F5',
            117: 'F6',
            118: 'F7',
            119: 'F8',
            120: 'F9',
            121: 'F10',
            122: 'F11',
            123: 'F12'
        };
        return keyMap[keyCode] || `Key${keyCode}`;
    }
    generateModernKeyCodeFix(code) {
        let fixed = code;
        const keyCodeReplacements = [
            [/\b(e|event|evt)\.keyCode\s*===\s*13\b/gi, '$1.key === \'Enter\''],
            [/\b(e|event|evt)\.keyCode\s*===\s*27\b/gi, '$1.key === \'Escape\''],
            [/\b(e|event|evt)\.keyCode\s*===\s*32\b/gi, '$1.key === \' \''],
            [/\b(e|event|evt)\.keyCode\s*===\s*9\b/gi, '$1.key === \'Tab\''],
            [/\b(e|event|evt)\.keyCode\s*===\s*37\b/gi, '$1.key === \'ArrowLeft\''],
            [/\b(e|event|evt)\.keyCode\s*===\s*38\b/gi, '$1.key === \'ArrowUp\''],
            [/\b(e|event|evt)\.keyCode\s*===\s*39\b/gi, '$1.key === \'ArrowRight\''],
            [/\b(e|event|evt)\.keyCode\s*===\s*40\b/gi, '$1.key === \'ArrowDown\''],
            [/\b(e|event|evt)\.which\s*===\s*13\b/gi, '$1.key === \'Enter\''],
            [/\b(e|event|evt)\.which\s*===\s*27\b/gi, '$1.key === \'Escape\''],
            [/\b(e|event|evt)\.keyCode\b/gi, '$1.key'],
            [/\b(e|event|evt)\.which\b/gi, '$1.key']
        ];
        for (const [pattern, replacement] of keyCodeReplacements) {
            fixed = fixed.replace(pattern, replacement);
        }
        return fixed;
    }
    getHandlerCode(handler) {
        if (typeof handler.handler === 'string') {
            return handler.handler;
        }
        if (handler.handler && typeof handler.handler.toString === 'function') {
            return handler.handler.toString();
        }
        return '';
    }
}
exports.DeprecatedKeyCodeAnalyzer = DeprecatedKeyCodeAnalyzer;
