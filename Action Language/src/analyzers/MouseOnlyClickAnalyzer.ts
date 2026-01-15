/**
 * Mouse-Only Click Handler Analyzer
 *
 * Detects interactive elements that have click handlers but no keyboard handlers.
 * This is a WCAG 2.1.1 violation - all functionality must be keyboard accessible.
 *
 * This analyzer benefits greatly from DocumentModel:
 * - File-scope: May flag false positives when keyboard handler is in a different file
 * - Document-scope: Accurately detects issues by merging handlers from all files
 *
 * Example issue:
 * ```html
 * <!-- HTML file -->
 * <button id="submit">Submit</button>
 * ```
 *
 * ```javascript
 * // click.js
 * document.getElementById('submit').addEventListener('click', handleClick);
 *
 * // keyboard.js (separate file!)
 * document.getElementById('submit').addEventListener('keydown', handleKeyDown);
 * ```
 *
 * File-scope: FALSE POSITIVE (only sees click.js)
 * Document-scope: NO ISSUE (merges both files correctly)
 */

import {
  BaseAnalyzer,
  AnalyzerContext,
  Issue,
  IssueFix,
} from './BaseAnalyzer';
import { ActionLanguageNode } from '../models/ActionLanguageModel';
import { ElementContext } from '../models/DocumentModel';

export class MouseOnlyClickAnalyzer extends BaseAnalyzer {
  readonly name = 'mouse-only-click';
  readonly description =
    'Detects click handlers without corresponding keyboard handlers';

  /**
   * Analyze for mouse-only click handlers.
   *
   * Prefers DocumentModel for accuracy, falls back to file-scope if unavailable.
   */
  analyze(context: AnalyzerContext): Issue[] {
    // Prefer document-scope analysis (no false positives!)
    if (this.supportsDocumentModel(context)) {
      return this.analyzeWithDocumentModel(context);
    }

    // Fall back to file-scope analysis (may have false positives)
    if (context.actionLanguageModel) {
      return this.analyzeFileScope(context);
    }

    return [];
  }

  /**
   * Document-scope analysis: Accurate, no false positives.
   *
   * Checks all interactive elements in the DOM to see if they have:
   * - A click handler
   * - But NO keyboard handler (keydown/keypress/keyup)
   */
  private analyzeWithDocumentModel(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const documentModel = context.documentModel!;

    if (!documentModel.dom) return issues;

    // Get all interactive elements
    const interactiveElements = documentModel.getInteractiveElements();

    for (const elementContext of interactiveElements) {
      // Check if element has click handler but no keyboard handler
      if (
        elementContext.hasClickHandler &&
        !elementContext.hasKeyboardHandler
      ) {
        const element = elementContext.element;

        // Find the click handler location
        const clickHandler = elementContext.jsHandlers.find(
          (h) => h.actionType === 'eventHandler' && h.event === 'click'
        );

        if (!clickHandler) continue;

        // Create issue with both element location and handler location
        const message = this.createMessage(element.tagName, element.attributes.id);
        const fix = this.generateFix(elementContext, clickHandler);

        issues.push(
          this.createIssue(
            'mouse-only-click',
            'error',
            message,
            element.location,
            ['2.1.1'], // WCAG 2.1.1: Keyboard
            {
              relatedLocations: [clickHandler.location],
              elementContext,
              fix,
            }
          )
        );
      }
    }

    return issues;
  }

  /**
   * File-scope analysis: Legacy fallback, may have false positives.
   *
   * Analyzes a single ActionLanguageModel without DOM context.
   * Cannot detect if keyboard handler exists in another file!
   *
   * Strategy:
   * 1. Find all click event handlers
   * 2. For each click handler, check if same element has keyboard handler
   * 3. Flag as issue if no keyboard handler found
   *
   * Limitation: If keyboard handler is in a different file, this will
   * create a false positive. Use document-scope analysis to avoid this.
   */
  private analyzeFileScope(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const model = context.actionLanguageModel!;

    // Get all click event handlers
    const clickHandlers = model.findEventHandlers('click');

    for (const clickHandler of clickHandlers) {
      const selector = clickHandler.element.selector;

      // Check if same element has keyboard handler in this file
      const hasKeyboardHandler = this.hasKeyboardHandlerForSelector(
        model,
        selector
      );

      if (!hasKeyboardHandler) {
        const message = `Element with selector "${selector}" has click handler but no keyboard handler (file-scope analysis - may be false positive if handler is in another file)`;

        issues.push(
          this.createIssue(
            'mouse-only-click',
            'warning', // Warning instead of error (might be false positive)
            message,
            clickHandler.location,
            ['2.1.1'],
            {
              fix: this.generateFileScopeFix(clickHandler),
            }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Check if a selector has a keyboard handler in the given model.
   */
  private hasKeyboardHandlerForSelector(
    model: ActionLanguageNode[] | { findBySelector: (s: string) => ActionLanguageNode[] },
    selector: string
  ): boolean {
    // Get all handlers for this selector
    const handlers = Array.isArray(model)
      ? model.filter((n) => n.element.selector === selector)
      : model.findBySelector(selector);

    // Check if any are keyboard handlers
    const keyboardEvents = ['keydown', 'keypress', 'keyup'];
    return handlers.some(
      (h) =>
        h.actionType === 'eventHandler' &&
        h.event &&
        keyboardEvents.includes(h.event)
    );
  }

  /**
   * Create human-readable message.
   */
  private createMessage(tagName: string, id?: string): string {
    const elementDesc = id
      ? `<${tagName}> element with id="${id}"`
      : `<${tagName}> element`;

    return `${elementDesc} has click handler but no keyboard handler. All interactive elements must be keyboard accessible (WCAG 2.1.1).`;
  }

  /**
   * Generate fix for document-scope issue.
   */
  private generateFix(
    elementContext: ElementContext,
    clickHandler: ActionLanguageNode
  ): IssueFix {
    const element = elementContext.element;
    const tagName = element.tagName.toLowerCase();

    // Determine appropriate keyboard handler based on element type
    let keyboardCode = '';

    if (tagName === 'button' || element.attributes.role === 'button') {
      // For buttons, handle Enter and Space
      keyboardCode = `
${this.getElementSelector(element)}.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    // Call the same handler as click
    // TODO: Extract click handler logic here
  }
});`.trim();
    } else {
      // Generic keyboard handler
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

  /**
   * Generate fix for file-scope issue.
   */
  private generateFileScopeFix(clickHandler: ActionLanguageNode): IssueFix {
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

  /**
   * Get JavaScript selector code for an element.
   */
  private getElementSelector(element: { tagName: string; attributes: Record<string, string> }): string {
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
