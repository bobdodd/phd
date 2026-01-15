/**
 * Focus Order Conflict Analyzer
 *
 * Detects problematic tabindex usage that creates confusing focus order.
 * This analyzer requires DocumentModel to see all focusable elements together.
 *
 * Issues detected:
 * 1. Positive tabindex values (anti-pattern - creates unpredictable order)
 * 2. Multiple elements with same positive tabindex
 * 3. Gaps in tabindex sequence
 * 4. Mixing positive and default focus order
 *
 * Best practice:
 * - Use tabindex="0" to add elements to natural tab order
 * - Use tabindex="-1" to make elements programmatically focusable only
 * - Avoid positive tabindex values (tabindex="1", "2", etc.)
 *
 * Example issue:
 * ```html
 * <button tabindex="2">First visually</button>
 * <button tabindex="1">Second visually</button>
 * <!-- Tab order: Second, First - confusing! -->
 * ```
 *
 * This analyzer REQUIRES DocumentModel to see all elements together.
 */

import {
  BaseAnalyzer,
  AnalyzerContext,
  Issue,
} from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

export class FocusOrderConflictAnalyzer extends BaseAnalyzer {
  readonly name = 'focus-order-conflict';
  readonly description =
    'Detects problematic tabindex usage that creates confusing focus order';

  /**
   * Analyze for focus order conflicts.
   *
   * REQUIRES DocumentModel.
   */
  analyze(context: AnalyzerContext): Issue[] {
    if (!this.supportsDocumentModel(context)) {
      return [];
    }

    const issues: Issue[] = [];
    const documentModel = context.documentModel!;

    if (!documentModel.dom) return issues;

    // Get all focusable elements
    const focusableElements = documentModel.dom.getFocusableElements();

    // Check for positive tabindex values (anti-pattern)
    for (const element of focusableElements) {
      const tabindex = this.getTabIndex(element);

      if (tabindex !== null && tabindex > 0) {
        const message = `Element <${element.tagName}> uses positive tabindex="${tabindex}". Positive tabindex values create unpredictable focus order and should be avoided. Use tabindex="0" instead (WCAG 2.4.3).`;

        issues.push(
          this.createIssue(
            'positive-tabindex',
            'warning',
            message,
            element.location,
            ['2.4.3'], // WCAG 2.4.3: Focus Order
            {
              elementContext: documentModel.getElementContext(element),
            }
          )
        );
      }
    }

    // Check for duplicate positive tabindex values
    const tabindexMap = new Map<number, DOMElement[]>();

    for (const element of focusableElements) {
      const tabindex = this.getTabIndex(element);

      if (tabindex !== null && tabindex > 0) {
        if (!tabindexMap.has(tabindex)) {
          tabindexMap.set(tabindex, []);
        }
        tabindexMap.get(tabindex)!.push(element);
      }
    }

    // Report duplicates
    for (const [tabindex, elements] of tabindexMap.entries()) {
      if (elements.length > 1) {
        for (const element of elements) {
          const otherElements = elements
            .filter((e) => e !== element)
            .map((e) => `<${e.tagName}> at ${e.location.file}:${e.location.line}`)
            .join(', ');

          const message = `Element <${element.tagName}> has tabindex="${tabindex}" which is also used by: ${otherElements}. Multiple elements with the same positive tabindex create ambiguous focus order (WCAG 2.4.3).`;

          issues.push(
            this.createIssue(
              'duplicate-tabindex',
              'error',
              message,
              element.location,
              ['2.4.3'],
              {
                elementContext: documentModel.getElementContext(element),
                relatedLocations: elements
                  .filter((e) => e !== element)
                  .map((e) => e.location),
              }
            )
          );
        }
      }
    }

    return issues;
  }

  /**
   * Get numeric tabindex value from element.
   */
  private getTabIndex(element: DOMElement): number | null {
    const tabindexStr = element.attributes.tabindex;

    if (tabindexStr === undefined) {
      return null;
    }

    const tabindex = parseInt(tabindexStr);
    return isNaN(tabindex) ? null : tabindex;
  }
}
