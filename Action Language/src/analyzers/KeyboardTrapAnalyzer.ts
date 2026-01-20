/**
 * Keyboard Trap Analyzer
 *
 * Detects keyboard traps and focus management issues that prevent keyboard-only users
 * from navigating away from elements or sections of the page.
 *
 * Detects:
 * - Modal dialogs without escape key handlers
 * - Focus traps without escape mechanism
 * - Elements with tabindex=-1 that trap focus
 * - Keyboard event handlers that prevent default Tab behavior
 * - Infinite focus loops
 * - Custom widgets that trap focus without proper exit
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.2 No Keyboard Trap (Level A): Users must be able to move focus away from any component
 * - 2.4.3 Focus Order (Level A): Focus must move in a logical order
 *
 * This analyzer works with ActionLanguageModel to detect focus management patterns.
 */

import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * Analyzer for detecting keyboard trap accessibility issues.
 */
export class KeyboardTrapAnalyzer extends BaseAnalyzer {
  readonly name = 'KeyboardTrapAnalyzer';
  readonly description = 'Detects keyboard traps and focus management issues';

  /**
   * Analyze document for keyboard trap issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!this.supportsDocumentModel(context)) {
      return issues;
    }

    // Check for modal dialogs without escape handlers
    const modalIssues = this.checkModalDialogs(context);
    issues.push(...modalIssues);

    // Check for focus trap implementations without escape
    const focusTrapIssues = this.checkFocusTraps(context);
    issues.push(...focusTrapIssues);

    // Check for Tab key preventDefault without proper handling
    const tabPreventIssues = this.checkTabPrevention(context);
    issues.push(...tabPreventIssues);

    // Check for elements that may create focus loops
    const focusLoopIssues = this.checkFocusLoops(context);
    issues.push(...focusLoopIssues);

    return issues;
  }

  /**
   * Check modal dialogs for proper escape key handling.
   */
  private checkModalDialogs(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();

    // Find elements with dialog role or aria-modal
    const dialogElements = allElements.filter(el => {
      const role = el.attributes.role;
      const ariaModal = el.attributes['aria-modal'];
      return role === 'dialog' || role === 'alertdialog' || ariaModal === 'true';
    });

    for (const dialog of dialogElements) {
      // Check if there's an Escape key handler
      const hasEscapeHandler = this.hasEscapeKeyHandler(dialog, context);

      if (!hasEscapeHandler) {
        issues.push(this.createIssue(
          'modal-without-escape',
          'error',
          'Modal dialog lacks Escape key handler. Users must be able to close modals with the Escape key to avoid keyboard traps.',
          dialog.location,
          ['2.1.2'],
          context,
          {
            elementContext: context.documentModel.getElementContext(dialog),
            fix: {
              description: 'Add Escape key handler to close modal',
              code: `// Add this event listener:\ndocument.addEventListener('keydown', (e) => {\n  if (e.key === 'Escape') {\n    closeModal();\n  }\n});`,
              location: dialog.location
            }
          }
        ));
      }

      // Check if modal has proper focus trap implementation
      const hasFocusTrap = this.hasFocusTrapImplementation(dialog, context);
      if (hasFocusTrap && !hasEscapeHandler) {
        issues.push(this.createIssue(
          'focus-trap-without-escape',
          'error',
          'Focus trap detected without Escape key exit. Focus traps must provide a keyboard-accessible way to exit.',
          dialog.location,
          ['2.1.2'],
          context,
          {
            elementContext: context.documentModel.getElementContext(dialog)
          }
        ));
      }
    }

    return issues;
  }

  /**
   * Check for focus trap implementations without escape mechanisms.
   */
  private checkFocusTraps(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    // Look for Tab key handlers that prevent default
    const actions = context.actionLanguageModel.getAllEventHandlers();

    for (const action of actions) {
      // Check for keydown/keypress handlers
      if (action.event === 'keydown' || action.event === 'keypress') {
        const hasTabHandling = this.actionHandlesTabKey(action);
        const preventsDefault = this.actionPreventsDefault(action);

        if (hasTabHandling && preventsDefault) {
          // Check if there's a corresponding Escape handler
          const hasEscapeInSameScope = this.hasEscapeHandlerInScope(action, actions);

          if (!hasEscapeInSameScope) {
            issues.push(this.createIssue(
              'tab-trap-without-escape',
              'error',
              'Tab key handler prevents default behavior without providing Escape key exit. This creates a keyboard trap.',
              action.location,
              ['2.1.2'],
              context,
              {
                fix: {
                  description: 'Add Escape key handler to allow exit',
                  code: `if (event.key === 'Escape') {\n  // Exit focus trap\n  exitTrap();\n}`,
                  location: action.location
                }
              }
            ));
          }
        }
      }
    }

    return issues;
  }

  /**
   * Check for Tab key preventDefault that may trap focus.
   */
  private checkTabPrevention(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    const actions = context.actionLanguageModel.getAllEventHandlers();

    for (const action of actions) {
      if (action.event === 'keydown' || action.event === 'keypress') {
        // Check for preventDefault on Tab key
        const code = this.getActionCode(action);

        // Pattern: e.preventDefault() when Tab key is pressed
        const hasTabPrevent =
          (code.includes('key') && code.includes('Tab')) &&
          (code.includes('preventDefault') || code.includes('return false'));

        if (hasTabPrevent) {
          // Check if this is part of a proper focus trap implementation
          const isProperFocusTrap =
            code.includes('querySelectorAll') ||
            code.includes('focusable') ||
            code.includes('tabbable');

          if (isProperFocusTrap) {
            // Check for Escape key handling
            const hasEscape =
              code.includes('Escape') ||
              code.includes('Esc') ||
              this.hasEscapeHandlerInScope(action, actions);

            if (!hasEscape) {
              issues.push(this.createIssue(
                'focus-trap-missing-escape',
                'error',
                'Focus trap implementation prevents Tab but does not handle Escape key. Provide an exit mechanism.',
                action.location,
                ['2.1.2'],
                context,
                {
                  fix: {
                    description: 'Add Escape key handler',
                    code: `if (event.key === 'Escape') {\n  restoreFocus();\n  closeContainer();\n}`,
                    location: action.location
                  }
                }
              ));
            }
          } else {
            // Tab preventDefault without proper focus management
            issues.push(this.createIssue(
              'tab-prevented-without-management',
              'warning',
              'Tab key default behavior is prevented without implementing focus management. This may create a keyboard trap.',
              action.location,
              ['2.1.2'],
              context
            ));
          }
        }
      }
    }

    return issues;
  }

  /**
   * Check for elements that may create focus loops.
   */
  private checkFocusLoops(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    const actions = context.actionLanguageModel.getAllEventHandlers();

    // Look for blur handlers that immediately re-focus
    for (const action of actions) {
      if (action.event === 'blur') {
        const code = this.getActionCode(action);

        // Check if blur handler calls focus()
        if (code.includes('.focus()')) {
          // Check if it's conditional or immediate
          const isConditional =
            code.includes('if') ||
            code.includes('?') ||
            code.includes('&&') ||
            code.includes('setTimeout');

          if (!isConditional) {
            issues.push(this.createIssue(
              'blur-refocus-loop',
              'error',
              'Blur handler immediately calls focus(), creating an infinite focus loop that traps keyboard users.',
              action.location,
              ['2.1.2', '2.4.3'],
              context,
              {
                fix: {
                  description: 'Make focus restoration conditional or remove it',
                  code: '// Only restore focus if needed:\nif (shouldRestoreFocus) {\n  element.focus();\n}',
                  location: action.location
                }
              }
            ));
          }
        }
      }
    }

    return issues;
  }

  /**
   * Check if element has Escape key handler.
   */
  private hasEscapeKeyHandler(element: DOMElement, context: AnalyzerContext): boolean {
    if (!context.actionLanguageModel) {
      return false;
    }

    // Get all actions for this element
    const elementContext = context.documentModel?.getElementContext(element);
    if (!elementContext?.jsHandlers) {
      return false;
    }

    // Check if any keydown/keypress handler checks for Escape
    for (const action of elementContext.jsHandlers) {
      if (action.event === 'keydown' || action.event === 'keypress') {
        const code = this.getActionCode(action);
        if (code.includes('Escape') || code.includes('Esc')) {
          return true;
        }
      }
    }

    // Also check document-level handlers (common pattern for modals)
    const allActions = context.actionLanguageModel.getAllEventHandlers();
    for (const action of allActions) {
      if ((action.event === 'keydown' || action.event === 'keypress')) {
        const code = this.getActionCode(action);
        // Check if it handles Escape and references closing/hiding
        if ((code.includes('Escape') || code.includes('Esc')) &&
            (code.includes('close') || code.includes('hide') || code.includes('dismiss'))) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if element has focus trap implementation.
   */
  private hasFocusTrapImplementation(element: DOMElement, context: AnalyzerContext): boolean {
    if (!context.actionLanguageModel) {
      return false;
    }

    const elementContext = context.documentModel?.getElementContext(element);
    if (!elementContext?.jsHandlers) {
      return false;
    }

    // Check for Tab key handling with focus management
    for (const action of elementContext.jsHandlers) {
      if (action.event === 'keydown') {
        const code = this.getActionCode(action);

        // Common focus trap patterns
        const hasFocusTrapPattern =
          (code.includes('Tab') && code.includes('preventDefault')) ||
          (code.includes('focusable') || code.includes('tabbable')) ||
          (code.includes('firstFocusable') && code.includes('lastFocusable'));

        if (hasFocusTrapPattern) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if action handles Tab key.
   */
  private actionHandlesTabKey(action: ActionLanguageNode): boolean {
    const code = this.getActionCode(action);
    return code.includes('Tab') ||
           (code.includes('key') && code.includes('9')) ||
           (code.includes('keyCode') && code.includes('9'));
  }

  /**
   * Check if action prevents default behavior.
   */
  private actionPreventsDefault(action: ActionLanguageNode): boolean {
    const code = this.getActionCode(action);
    return code.includes('preventDefault') || code.includes('return false');
  }

  /**
   * Check if there's an Escape handler in the same scope.
   */
  private hasEscapeHandlerInScope(action: ActionLanguageNode, allActions: ActionLanguageNode[]): boolean {
    // Look for Escape handlers on the same element or in nearby code
    const actionLocation = action.location;

    for (const otherAction of allActions) {
      // Check if in same file and nearby
      if (otherAction.location.file === actionLocation.file) {
        const code = this.getActionCode(otherAction);
        if (code.includes('Escape') || code.includes('Esc')) {
          // Within reasonable proximity (100 lines)
          if (Math.abs((otherAction.location.line || 0) - (actionLocation.line || 0)) < 100) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Get code content from action.
   */
  private getActionCode(action: ActionLanguageNode): string {
    // Get the handler if available
    if (action.handler) {
      return String(action.handler);
    }

    return '';
  }
}
