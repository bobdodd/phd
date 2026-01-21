import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';

/**
 * DeprecatedKeyCodeAnalyzer - Detects usage of deprecated KeyboardEvent.keyCode
 *
 * Implements WCAG 2.1.1 (Keyboard) Level A
 *
 * Detects:
 * - Use of event.keyCode (deprecated since 2016)
 * - Use of event.which (deprecated)
 * - Use of event.charCode (deprecated)
 * - Recommends modern event.key or event.code alternatives
 *
 * Priority: LOW IMPACT (still works but deprecated)
 * Target: Modernize keyboard event handling for long-term maintainability
 */
export class DeprecatedKeyCodeAnalyzer extends BaseAnalyzer {
  readonly name = 'DeprecatedKeyCodeAnalyzer';
  readonly description = 'Detects usage of deprecated KeyboardEvent.keyCode and recommends modern alternatives';

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    // Check all event handlers for deprecated keyboard event properties
    const allHandlers = context.actionLanguageModel.getAllEventHandlers();

    for (const handler of allHandlers) {
      // Only check keyboard events
      if (handler.event && this.isKeyboardEvent(handler.event)) {
        this.checkHandlerForDeprecatedAPIs(handler, context, issues);
      }
    }

    return issues;
  }

  /**
   * Check if event type is a keyboard event
   */
  private isKeyboardEvent(eventType: string): boolean {
    const keyboardEvents = ['keydown', 'keyup', 'keypress'];
    return keyboardEvents.includes(eventType.toLowerCase());
  }

  /**
   * Check handler code for deprecated keyboard APIs
   */
  private checkHandlerForDeprecatedAPIs(
    handler: any,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const code = this.getHandlerCode(handler);
    if (!code) return;

    // Check for event.keyCode usage
    if (this.usesKeyCode(code)) {
      this.reportDeprecatedKeyCode(handler, code, context, issues);
    }

    // Check for event.which usage
    if (this.usesWhich(code)) {
      this.reportDeprecatedWhich(handler, code, context, issues);
    }

    // Check for event.charCode usage
    if (this.usesCharCode(code)) {
      this.reportDeprecatedCharCode(handler, code, context, issues);
    }

    // Check for numeric key code comparisons (e.g., === 13, === 27)
    if (this.usesNumericKeyComparison(code)) {
      this.reportNumericKeyComparison(handler, code, context, issues);
    }
  }

  /**
   * Check if code uses event.keyCode
   */
  private usesKeyCode(code: string): boolean {
    // Match patterns like: e.keyCode, event.keyCode, evt.keyCode
    return /\b(e|event|evt)\s*\.\s*keyCode\b/i.test(code);
  }

  /**
   * Check if code uses event.which
   */
  private usesWhich(code: string): boolean {
    // Match patterns like: e.which, event.which
    return /\b(e|event|evt)\s*\.\s*which\b/i.test(code);
  }

  /**
   * Check if code uses event.charCode
   */
  private usesCharCode(code: string): boolean {
    // Match patterns like: e.charCode, event.charCode
    return /\b(e|event|evt)\s*\.\s*charCode\b/i.test(code);
  }

  /**
   * Check if code compares with numeric key codes
   */
  private usesNumericKeyComparison(code: string): boolean {
    // Common key codes: 13 (Enter), 27 (Escape), 32 (Space), 9 (Tab), arrow keys (37-40)
    // Match patterns like: === 13, == 27, !== 32
    const commonKeyCodes = [9, 13, 27, 32, 37, 38, 39, 40];

    for (const keyCode of commonKeyCodes) {
      const pattern = new RegExp(`[=!]{2,3}\\s*${keyCode}\\b|\\b${keyCode}\\s*[=!]{2,3}`);
      if (pattern.test(code)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Report deprecated keyCode usage
   */
  private reportDeprecatedKeyCode(
    handler: any,
    code: string,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const keyCodeValues = this.extractKeyCodeValues(code);
    const modernAlternative = this.getModernKeyAlternative(keyCodeValues);

    issues.push(
      this.createIssue(
        'deprecated-keycode',
        'warning',
        `Keyboard event handler uses deprecated event.keyCode. This property has been deprecated since 2016 and may not work in future browsers. Use event.key or event.code instead.`,
        handler.location,
        ['2.1.1'],
        context,
        {
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
        }
      )
    );
  }

  /**
   * Report deprecated which usage
   */
  private reportDeprecatedWhich(
    handler: any,
    code: string,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    issues.push(
      this.createIssue(
        'deprecated-which',
        'warning',
        `Keyboard event handler uses deprecated event.which. Use event.key instead for better cross-browser compatibility and readability.`,
        handler.location,
        ['2.1.1'],
        context,
        {
          fix: {
            description: `Replace event.which with event.key:

Deprecated (OLD):
if (e.which === 13) { /* Enter */ }

Modern (NEW):
if (e.key === 'Enter') { /* Enter */ }`,
            code: this.generateModernKeyCodeFix(code),
            location: handler.location
          }
        }
      )
    );
  }

  /**
   * Report deprecated charCode usage
   */
  private reportDeprecatedCharCode(
    handler: any,
    _code: string,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    issues.push(
      this.createIssue(
        'deprecated-charcode',
        'info',
        `Keyboard event handler uses deprecated event.charCode. Use event.key for character input detection.`,
        handler.location,
        ['2.1.1'],
        context,
        {
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
        }
      )
    );
  }

  /**
   * Report numeric key code comparison
   */
  private reportNumericKeyComparison(
    handler: any,
    code: string,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const detectedKeyCodes = this.extractNumericKeyCodes(code);
    const keyNames = detectedKeyCodes.map(kc => this.keyCodeToKeyName(kc)).join(', ');

    issues.push(
      this.createIssue(
        'numeric-key-comparison',
        'info',
        `Keyboard event handler compares with numeric key codes (${detectedKeyCodes.join(', ')}). While this works, using event.key with string names ('${keyNames}') is more readable and maintainable.`,
        handler.location,
        ['2.1.1'],
        context,
        {
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
        }
      )
    );
  }

  /**
   * Extract keyCode values from code
   */
  private extractKeyCodeValues(code: string): number[] {
    const matches = code.match(/keyCode\s*[=!]{2,3}\s*(\d+)/g);
    if (!matches) return [];

    return matches.map(match => {
      const num = match.match(/\d+/);
      return num ? parseInt(num[0], 10) : 0;
    }).filter(n => n > 0);
  }

  /**
   * Extract numeric key codes from comparisons
   */
  private extractNumericKeyCodes(code: string): number[] {
    const keyCodes = new Set<number>();
    const commonKeyCodes = [9, 13, 27, 32, 37, 38, 39, 40];

    for (const keyCode of commonKeyCodes) {
      const pattern = new RegExp(`[=!]{2,3}\\s*${keyCode}\\b|\\b${keyCode}\\s*[=!]{2,3}`);
      if (pattern.test(code)) {
        keyCodes.add(keyCode);
      }
    }

    return Array.from(keyCodes).sort((a, b) => a - b);
  }

  /**
   * Get modern key alternative suggestion
   */
  private getModernKeyAlternative(keyCodes: number[]): string {
    if (keyCodes.length === 0) return '';

    const suggestions = keyCodes.map(kc => {
      const keyName = this.keyCodeToKeyName(kc);
      return `  ${kc} → '${keyName}'`;
    });

    return `Common key code mappings:\n${suggestions.join('\n')}`;
  }

  /**
   * Convert key code to modern key name
   */
  private keyCodeToKeyName(keyCode: number): string {
    const keyMap: Record<number, string> = {
      8: 'Backspace',
      9: 'Tab',
      13: 'Enter',
      27: 'Escape',
      32: ' ', // Space
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

  /**
   * Generate modern keyCode fix
   */
  private generateModernKeyCodeFix(code: string): string {
    let fixed = code;

    // Replace keyCode patterns
    const keyCodeReplacements: Array<[RegExp, string]> = [
      [/\b(e|event|evt)\.keyCode\s*===\s*13\b/gi, '$1.key === \'Enter\''],
      [/\b(e|event|evt)\.keyCode\s*===\s*27\b/gi, '$1.key === \'Escape\''],
      [/\b(e|event|evt)\.keyCode\s*===\s*32\b/gi, '$1.key === \' \''],
      [/\b(e|event|evt)\.keyCode\s*===\s*9\b/gi, '$1.key === \'Tab\''],
      [/\b(e|event|evt)\.keyCode\s*===\s*37\b/gi, '$1.key === \'ArrowLeft\''],
      [/\b(e|event|evt)\.keyCode\s*===\s*38\b/gi, '$1.key === \'ArrowUp\''],
      [/\b(e|event|evt)\.keyCode\s*===\s*39\b/gi, '$1.key === \'ArrowRight\''],
      [/\b(e|event|evt)\.keyCode\s*===\s*40\b/gi, '$1.key === \'ArrowDown\''],

      // Replace which patterns
      [/\b(e|event|evt)\.which\s*===\s*13\b/gi, '$1.key === \'Enter\''],
      [/\b(e|event|evt)\.which\s*===\s*27\b/gi, '$1.key === \'Escape\''],

      // General keyCode/which to key
      [/\b(e|event|evt)\.keyCode\b/gi, '$1.key'],
      [/\b(e|event|evt)\.which\b/gi, '$1.key']
    ];

    for (const [pattern, replacement] of keyCodeReplacements) {
      fixed = fixed.replace(pattern, replacement);
    }

    return fixed;
  }

  /**
   * Get handler code as string
   */
  private getHandlerCode(handler: any): string {
    if (typeof handler.handler === 'string') {
      return handler.handler;
    }

    if (handler.handler && typeof handler.handler.toString === 'function') {
      return handler.handler.toString();
    }

    return '';
  }
}
