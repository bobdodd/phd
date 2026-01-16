/**
 * Orphaned Event Handler Analyzer
 *
 * Detects JavaScript event handlers that reference DOM elements that don't exist.
 * This is only possible with DocumentModel - file-scope analysis cannot detect this!
 *
 * Common causes:
 * - Typo in element ID
 * - Element was removed but handler wasn't
 * - Handler added before element creation
 * - Wrong selector used
 *
 * Example issue:
 * ```html
 * <!-- HTML file -->
 * <button id="submit">Submit</button>
 * ```
 *
 * ```javascript
 * // handlers.js - TYPO in ID!
 * document.getElementById('sumbit').addEventListener('click', handleClick);
 * //                      ^^^^^^ should be 'submit'
 * ```
 *
 * This analyzer REQUIRES DocumentModel - cannot work in file-scope mode.
 */

import {
  BaseAnalyzer,
  AnalyzerContext,
  Issue,
} from './BaseAnalyzer';

export class OrphanedEventHandlerAnalyzer extends BaseAnalyzer {
  readonly name = 'orphaned-event-handler';
  readonly description =
    'Detects event handlers that reference non-existent DOM elements';

  /**
   * Analyze for orphaned event handlers.
   *
   * REQUIRES DocumentModel - cannot detect orphaned handlers without DOM.
   */
  analyze(context: AnalyzerContext): Issue[] {
    // This analyzer REQUIRES DocumentModel
    if (!this.supportsDocumentModel(context)) {
      return [];
    }

    const issues: Issue[] = [];
    const documentModel = context.documentModel!;

    // Check all JavaScript models for handlers
    for (const jsModel of documentModel.javascript) {
      const handlers = jsModel.getAllEventHandlers();

      for (const handler of handlers) {
        // Check if the element exists in the DOM
        const exists = this.elementExistsInDOM(
          handler.element.selector,
          documentModel
        );

        if (!exists) {
          const message = `Event handler references element "${handler.element.selector}" which does not exist in the DOM. Check for typos or ensure element is created before attaching handlers.`;

          issues.push(
            this.createIssue(
              'orphaned-event-handler',
              'error',
              message,
              handler.location,
              ['4.1.2'], // WCAG 4.1.2: Name, Role, Value (element must exist)
              context,
              {
                elementContext: undefined, // No element context (element doesn't exist!)
              }
            )
          );
        }
      }
    }

    return issues;
  }

  /**
   * Check if an element with the given selector exists in the DOM.
   */
  private elementExistsInDOM(
    selector: string,
    documentModel: { getElementById: (id: string) => any; querySelector: (s: string) => any; querySelectorAll: (s: string) => any[] }
  ): boolean {
    // Special case: Global objects that are always available
    // These are not DOM elements but global JavaScript objects
    const globalObjects = ['document', 'window', 'navigator', 'location', 'history', 'screen'];
    if (globalObjects.includes(selector)) {
      return true;
    }

    // Try different selector types
    if (selector.startsWith('#')) {
      // ID selector
      const id = selector.slice(1);
      const element = documentModel.getElementById(id);
      return element !== null;
    }

    if (selector.startsWith('.')) {
      // Class selector
      const elements = documentModel.querySelectorAll(selector);
      return elements.length > 0;
    }

    if (selector.startsWith('[')) {
      // Attribute selector
      const elements = documentModel.querySelectorAll(selector);
      return elements.length > 0;
    }

    // Tag selector
    const elements = documentModel.querySelectorAll(selector);
    return elements.length > 0;
  }
}
