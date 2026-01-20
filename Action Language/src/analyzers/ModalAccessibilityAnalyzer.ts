import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * ModalAccessibilityAnalyzer
 *
 * Detects accessibility issues with modal dialogs and overlays.
 *
 * WCAG Success Criteria:
 * - 2.1.2 No Keyboard Trap (Level A) - Users must be able to escape modals
 * - 2.4.3 Focus Order (Level A) - Focus must be managed when opening/closing modals
 * - 4.1.2 Name, Role, Value (Level A) - Modals must have proper roles and labels
 *
 * Issues Detected:
 * - modal-missing-role: Modal lacks role="dialog" or role="alertdialog"
 * - modal-missing-aria-modal: Modal lacks aria-modal="true"
 * - modal-missing-label: Modal lacks aria-labelledby or aria-label
 * - modal-no-close-button: Modal has no visible close button
 * - modal-no-escape-handler: Modal cannot be closed with Escape key
 * - modal-no-focus-trap: Modal doesn't trap focus within itself
 * - modal-no-focus-management: Modal doesn't manage focus on open/close
 *
 * Related WCAG:
 * - 2.1.2 No Keyboard Trap
 * - 2.4.3 Focus Order
 * - 4.1.2 Name, Role, Value
 */
export class ModalAccessibilityAnalyzer extends BaseAnalyzer {
  readonly name = 'ModalAccessibilityAnalyzer';
  readonly description = 'Detects accessibility issues with modal dialogs and focus management';

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!this.supportsDocumentModel(context) || !context.documentModel) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();

    // Find potential modal elements
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

  /**
   * Find elements that appear to be modals
   */
  private findModalElements(elements: DOMElement[], context: AnalyzerContext): DOMElement[] {
    const modals: DOMElement[] = [];

    for (const element of elements) {
      // Check for explicit dialog role
      if (element.attributes.role === 'dialog' || element.attributes.role === 'alertdialog') {
        modals.push(element);
        continue;
      }

      // Check for common modal patterns (class names, IDs)
      const className = element.attributes.class || '';
      const id = element.attributes.id || '';

      const modalPatterns = [
        /modal/i,
        /dialog/i,
        /overlay/i,
        /popup/i,
        /lightbox/i
      ];

      const isLikelyModal = modalPatterns.some(pattern =>
        pattern.test(className) || pattern.test(id)
      );

      if (isLikelyModal) {
        // Check if this element has show/hide behavior in JavaScript
        const elementContext = context.documentModel?.getElementContext(element);
        if (elementContext?.jsHandlers && elementContext.jsHandlers.length > 0) {
          modals.push(element);
        }
      }
    }

    return modals;
  }

  /**
   * Check modal structure and role
   */
  private checkModalStructure(modal: DOMElement, context: AnalyzerContext, issues: Issue[]): void {
    const hasDialogRole = modal.attributes.role === 'dialog' ||
                          modal.attributes.role === 'alertdialog';

    if (!hasDialogRole) {
      issues.push(
        this.createIssue(
          'modal-missing-role',
          'error',
          `Element appears to be a modal but lacks role="dialog" or role="alertdialog". Screen readers need this to announce it properly.`,
          modal.location,
          ['4.1.2'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(modal),
            fix: {
              description: 'Add role="dialog" to modal element',
              code: this.addRoleAttribute(modal, 'dialog'),
              location: modal.location
            }
          }
        )
      );
    }
  }

  /**
   * Check ARIA attributes on modal
   */
  private checkModalARIA(modal: DOMElement, context: AnalyzerContext, issues: Issue[]): void {
    // Check aria-modal
    const hasAriaModal = modal.attributes['aria-modal'] === 'true';

    if (!hasAriaModal) {
      issues.push(
        this.createIssue(
          'modal-missing-aria-modal',
          'warning',
          `Modal lacks aria-modal="true". This tells screen readers that content behind the modal is inert.`,
          modal.location,
          ['4.1.2'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(modal),
            fix: {
              description: 'Add aria-modal="true" to modal',
              code: this.addAriaAttribute(modal, 'aria-modal', 'true'),
              location: modal.location
            }
          }
        )
      );
    }

    // Check aria-labelledby or aria-label
    const hasLabel = modal.attributes['aria-labelledby'] || modal.attributes['aria-label'];

    if (!hasLabel) {
      issues.push(
        this.createIssue(
          'modal-missing-label',
          'error',
          `Modal lacks aria-labelledby or aria-label. Screen readers need a descriptive label to announce the modal's purpose.`,
          modal.location,
          ['4.1.2'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(modal),
            fix: {
              description: 'Add aria-label to modal',
              code: this.addAriaAttribute(modal, 'aria-label', 'Dialog'),
              location: modal.location
            }
          }
        )
      );
    }
  }

  /**
   * Check for close button
   */
  private checkModalCloseButton(modal: DOMElement, context: AnalyzerContext, issues: Issue[]): void {
    if (!context.documentModel) return;

    // Find all buttons within the modal
    const allElements = context.documentModel.getAllElements();
    const modalButtons = this.findDescendants(modal, allElements).filter(el =>
      el.tagName.toLowerCase() === 'button' ||
      (el.tagName.toLowerCase() === 'div' && el.attributes.role === 'button')
    );

    // Check if any button appears to be a close button
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

      return closePatterns.some(pattern =>
        pattern.test(className) ||
        pattern.test(ariaLabel) ||
        pattern.test(textContent)
      );
    });

    if (!hasCloseButton) {
      issues.push(
        this.createIssue(
          'modal-no-close-button',
          'warning',
          `Modal lacks a visible close button. Users need a clear way to dismiss the modal besides pressing Escape.`,
          modal.location,
          ['2.1.2'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(modal)
          }
        )
      );
    }
  }

  /**
   * Check for Escape key handler
   */
  private checkEscapeHandler(modal: DOMElement, context: AnalyzerContext, issues: Issue[]): void {
    if (!context.actionLanguageModel) return;

    const elementContext = context.documentModel?.getElementContext(modal);

    // Check for Escape handlers on the modal or document level
    const hasEscapeHandler = this.hasEscapeKeyHandler(modal, context);

    if (!hasEscapeHandler) {
      issues.push(
        this.createIssue(
          'modal-no-escape-handler',
          'error',
          `Modal cannot be closed with Escape key. This violates WCAG 2.1.2 (No Keyboard Trap) - users must be able to exit the modal using keyboard alone.`,
          modal.location,
          ['2.1.2'],
          context,
          {
            elementContext
          }
        )
      );
    }
  }

  /**
   * Check for focus trap implementation
   */
  private checkFocusTrap(modal: DOMElement, context: AnalyzerContext, issues: Issue[]): void {
    if (!context.actionLanguageModel) return;

    const elementContext = context.documentModel?.getElementContext(modal);

    // Check for Tab key handling (focus trap pattern)
    const hasFocusTrap = this.hasFocusTrapPattern(modal, context);

    if (!hasFocusTrap) {
      issues.push(
        this.createIssue(
          'modal-no-focus-trap',
          'warning',
          `Modal lacks focus trap implementation. Focus should cycle within the modal when Tab is pressed at the last focusable element.`,
          modal.location,
          ['2.4.3', '2.1.2'],
          context,
          {
            elementContext
          }
        )
      );
    }
  }

  /**
   * Check for focus management on open/close
   */
  private checkFocusManagement(modal: DOMElement, context: AnalyzerContext, issues: Issue[]): void {
    if (!context.actionLanguageModel) return;

    const elementContext = context.documentModel?.getElementContext(modal);

    // Check for .focus() calls when modal is shown/hidden
    const hasFocusManagement = this.hasFocusManagementPattern(modal, context);

    if (!hasFocusManagement) {
      issues.push(
        this.createIssue(
          'modal-no-focus-management',
          'warning',
          `Modal lacks focus management. Focus should move to the modal when opened, and return to the trigger element when closed.`,
          modal.location,
          ['2.4.3'],
          context,
          {
            elementContext
          }
        )
      );
    }
  }

  /**
   * Check if element has Escape key handler
   */
  private hasEscapeKeyHandler(modal: DOMElement, context: AnalyzerContext): boolean {
    if (!context.actionLanguageModel) return false;

    // Check modal's own handlers
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

    // Check document-level handlers (common pattern for modals)
    const allHandlers = context.actionLanguageModel.getAllEventHandlers();
    for (const handler of allHandlers) {
      if (handler.event === 'keydown' || handler.event === 'keypress') {
        const code = this.getHandlerCode(handler);
        // Check if it's an Escape handler that closes/hides something
        if ((code.includes('Escape') || code.includes('Esc') || code.includes('27')) &&
            (code.includes('close') || code.includes('hide') || code.includes('dismiss') ||
             code.includes('remove') || code.includes('style.display'))) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check for focus trap pattern
   */
  private hasFocusTrapPattern(_modal: DOMElement, context: AnalyzerContext): boolean {
    if (!context.actionLanguageModel) return false;

    const allHandlers = context.actionLanguageModel.getAllEventHandlers();

    for (const handler of allHandlers) {
      if (handler.event === 'keydown') {
        const code = this.getHandlerCode(handler);

        // Look for Tab key handling with focus management
        const hasFocusTrapPattern =
          (code.includes('Tab') || code.includes('key') && code.includes('9')) &&
          (code.includes('querySelector') || code.includes('querySelectorAll')) &&
          (code.includes('focus') || code.includes('focusable'));

        if (hasFocusTrapPattern) return true;
      }
    }

    return false;
  }

  /**
   * Check for focus management pattern
   */
  private hasFocusManagementPattern(_modal: DOMElement, context: AnalyzerContext): boolean {
    if (!context.actionLanguageModel) return false;

    const elementContext = context.documentModel?.getElementContext(_modal);
    if (!elementContext?.jsHandlers) return false;

    // Look for .focus() calls in handlers
    for (const handler of elementContext.jsHandlers) {
      const code = this.getHandlerCode(handler);
      if (code.includes('.focus()')) {
        return true;
      }
    }

    // Also check for show/open handlers that move focus
    const allHandlers = context.actionLanguageModel.getAllEventHandlers();
    for (const handler of allHandlers) {
      const code = this.getHandlerCode(handler);

      // Check for patterns that open modal and move focus
      if ((code.includes('show') || code.includes('open')) && code.includes('.focus()')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get handler code as string
   */
  private getHandlerCode(handler: ActionLanguageNode): string {
    if (typeof handler.handler === 'string') {
      return handler.handler;
    }
    if (handler.handler && typeof handler.handler === 'object') {
      return JSON.stringify(handler.handler);
    }
    return '';
  }

  /**
   * Find descendant elements
   */
  private findDescendants(parent: DOMElement, allElements: DOMElement[]): DOMElement[] {
    const descendants: DOMElement[] = [];

    // Simple implementation: check if element is a child in the tree
    // This is a simplified version - full implementation would need proper tree traversal
    for (const element of allElements) {
      if (element !== parent && element.location.file === parent.location.file) {
        // Check if element is likely within the parent based on location
        if (element.location.line > parent.location.line) {
          descendants.push(element);
        }
      }
    }

    return descendants;
  }

  /**
   * Get text content of element (simplified)
   */
  private getTextContent(_element: DOMElement, _allElements: DOMElement[]): string {
    // In a full implementation, this would walk the DOM tree and collect text
    // For now, return empty string as a placeholder
    return '';
  }

  /**
   * Add role attribute to element
   */
  private addRoleAttribute(element: DOMElement, role: string): string {
    const attrs = { ...element.attributes, role };
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<${element.tagName} ${attrString}>`;
  }

  /**
   * Add ARIA attribute to element
   */
  private addAriaAttribute(element: DOMElement, ariaKey: string, ariaValue: string): string {
    const attrs = { ...element.attributes, [ariaKey]: ariaValue };
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<${element.tagName} ${attrString}>`;
  }
}
