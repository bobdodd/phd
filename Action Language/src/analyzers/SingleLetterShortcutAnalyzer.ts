/**
 * Single Letter Shortcut Analyzer
 *
 * Detects keyboard shortcuts using single letters, punctuation, or numbers without modifier keys.
 * These can interfere with screen reader and speech input software.
 *
 * Detects:
 * - Single character keypress/keydown handlers (a-z, 0-9, punctuation)
 * - Shortcuts without Ctrl/Alt/Meta modifier checks
 * - Suggests requiring modifiers or providing a way to turn off shortcuts
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.4 Character Key Shortcuts (Level A): If a keyboard shortcut uses only letter, punctuation,
 *   number, or symbol characters, then at least one of the following is true:
 *   1. Turn off: A mechanism is available to turn the shortcut off
 *   2. Remap: A mechanism is available to remap the shortcut to include modifier keys
 *   3. Active only on focus: The keyboard shortcut is only active when the component has focus
 *
 * This analyzer works with ActionLanguageModel to detect keyboard event handlers.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * Analyzer for detecting single letter shortcut accessibility issues.
 */
export class SingleLetterShortcutAnalyzer extends BaseAnalyzer {
  readonly name = 'SingleLetterShortcutAnalyzer';
  readonly description = 'Detects single letter keyboard shortcuts that may interfere with assistive technology';

  /**
   * Analyze document for single letter shortcut issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    const handlers = context.actionLanguageModel.getAllEventHandlers();

    for (const handler of handlers) {
      // Check keydown and keypress events
      if (handler.event === 'keydown' || handler.event === 'keypress') {
        const code = this.getHandlerCode(handler);

        // Check if this is a single character shortcut
        const singleCharCheck = this.detectSingleCharacterShortcut(code);

        if (singleCharCheck.isSingleChar && !singleCharCheck.hasModifier) {
          // Check if there's a mechanism to disable it
          const hasDisableMechanism = this.hasDisableMechanism(code);

          // Check if it only fires when element has focus
          const isOnlyOnFocus = this.isOnlyActiveOnFocus(handler);

          if (!hasDisableMechanism && !isOnlyOnFocus) {
            issues.push(this.createIssue(
              'single-letter-shortcut',
              'warning',
              `Keyboard shortcut uses single character '${singleCharCheck.character}' without modifier keys. This can interfere with screen readers and speech input. Consider requiring Ctrl/Alt/Meta keys or providing a way to disable shortcuts.`,
              handler.location,
              ['2.1.4'],
              context,
              {
                fix: {
                  description: 'Require modifier key for shortcut',
                  code: `// Check for modifier key:
if (event.key === '${singleCharCheck.character}' && (event.ctrlKey || event.metaKey)) {
  // Execute shortcut
  ${this.getShortcutAction(code)}
}`,
                  location: handler.location
                }
              }
            ));
          } else if (isOnlyOnFocus) {
            // Still provide info about best practices
            issues.push(this.createIssue(
              'single-letter-shortcut-focus-only',
              'info',
              `Keyboard shortcut uses single character '${singleCharCheck.character}'. While this is only active on focus (which is allowed), consider adding a mechanism to remap or disable it for users who may have conflicts.`,
              handler.location,
              ['2.1.4'],
              context
            ));
          }
        }
      }
    }

    return issues;
  }

  /**
   * Detect if code checks for single character keys.
   */
  private detectSingleCharacterShortcut(code: string): {
    isSingleChar: boolean;
    character?: string;
    hasModifier: boolean;
  } {
    // Patterns for single character checks
    // event.key === 'a', event.key == 's', event.keyCode === 65, etc.

    // Check for key property comparisons
    const keyPatterns = [
      /event\.key\s*===?\s*['"]([a-zA-Z0-9\.,;!?\/\-\+=\*])['"]/, // Single char
      /event\.key\s*===?\s*['"]([A-Z])['"]/, // Capital letters (Shift+letter but still single char)
      /e\.key\s*===?\s*['"]([a-zA-Z0-9\.,;!?\/\-\+=\*])['"]/, // Short variable name
      /key\s*===?\s*['"]([a-zA-Z0-9\.,;!?\/\-\+=\*])['"]/, // Direct key variable
    ];

    for (const pattern of keyPatterns) {
      const match = code.match(pattern);
      if (match) {
        // Check if modifier keys are required
        const hasModifier =
          code.includes('ctrlKey') ||
          code.includes('metaKey') ||
          code.includes('altKey') ||
          code.includes('shiftKey && ') || // Shift must be explicitly required, not just checked
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

    // Check for keyCode comparisons (legacy)
    // A-Z: 65-90, a-z: 65-90, 0-9: 48-57
    const keyCodePattern = /(?:event\.keyCode|e\.keyCode|keyCode)\s*===?\s*(\d+)/;
    const keyCodeMatch = code.match(keyCodePattern);

    if (keyCodeMatch) {
      const keyCode = parseInt(keyCodeMatch[1], 10);

      // A-Z or 0-9 key codes
      if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90)) {
        const hasModifier =
          code.includes('ctrlKey') ||
          code.includes('metaKey') ||
          code.includes('altKey');

        let character = '';
        if (keyCode >= 48 && keyCode <= 57) {
          character = String.fromCharCode(keyCode); // 0-9
        } else if (keyCode >= 65 && keyCode <= 90) {
          character = String.fromCharCode(keyCode).toLowerCase(); // A-Z to a-z
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

  /**
   * Check if there's a mechanism to disable shortcuts.
   */
  private hasDisableMechanism(code: string): boolean {
    // Look for common patterns:
    // - if (shortcutsEnabled)
    // - if (!disableShortcuts)
    // - if (settings.shortcuts)

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

  /**
   * Check if shortcut is only active when component has focus.
   */
  private isOnlyActiveOnFocus(handler: ActionLanguageNode): boolean {
    // If the handler is on a specific focusable element (not document/window), it's only active on focus
    const code = this.getHandlerCode(handler);

    // Check if attached to document or window (global)
    const isGlobal =
      code.includes('document.addEventListener') ||
      code.includes('window.addEventListener') ||
      code.includes('document.onkeydown') ||
      code.includes('window.onkeydown') ||
      code.includes('document.onkeypress') ||
      code.includes('window.onkeypress');

    if (isGlobal) {
      return false; // Global shortcuts are always active
    }

    // If handler is on a specific element, check if that element is focusable
    // Note: handler.element is an ElementReference, need to find the actual DOMElement
    // For now, if it's not global, assume it's element-specific

    // Default: assume it's element-specific (focus-only)
    return true;
  }

  /**
   * Extract the action performed by the shortcut.
   */
  private getShortcutAction(code: string): string {
    // Try to extract the main action (very simplified)
    // Look for function calls after the key check

    const lines = code.split('\n');
    const actionLines: string[] = [];

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

  /**
   * Get handler code as string.
   */
  private getHandlerCode(handler: ActionLanguageNode): string {
    if (handler.handler) {
      return String(handler.handler);
    }
    return '';
  }
}
