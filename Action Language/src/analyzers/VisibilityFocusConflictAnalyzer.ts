/**
 * Visibility-Focus Conflict Analyzer
 *
 * Detects elements that are focusable but visually hidden.
 * This creates confusion - keyboard users can tab to invisible elements!
 *
 * This analyzer requires BOTH DocumentModel (DOM + CSS) to work properly.
 * Currently implements basic detection, will be enhanced when CSSModel is added.
 *
 * Issues detected:
 * 1. Elements with tabindex but aria-hidden="true"
 * 2. Interactive elements with aria-hidden="true"
 * 3. Focusable elements inside hidden containers (future: requires CSSModel)
 *
 * Common mistake:
 * ```html
 * <button aria-hidden="true" tabindex="0">Click me</button>
 * <!-- Button is hidden but still focusable - confusing! -->
 * ```
 *
 * Best practice:
 * - If element is aria-hidden, it should not be focusable
 * - Use tabindex="-1" to remove from tab order
 * - Or remove the element from the DOM entirely when hidden
 *
 * This analyzer REQUIRES DocumentModel (will use CSSModel when available).
 */

import {
  BaseAnalyzer,
  AnalyzerContext,
  Issue,
} from './BaseAnalyzer';
import { ElementContext } from '../models/DocumentModel';

export class VisibilityFocusConflictAnalyzer extends BaseAnalyzer {
  readonly name = 'visibility-focus-conflict';
  readonly description =
    'Detects elements that are focusable but visually hidden';

  /**
   * Analyze for visibility-focus conflicts.
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

    for (const element of focusableElements) {
      const elementContext = documentModel.getElementContext(element);

      // Check 1: aria-hidden="true" but still focusable
      if (element.attributes['aria-hidden'] === 'true') {
        const message = this.createAriaHiddenMessage(
          element.tagName,
          element.attributes.id,
          elementContext
        );

        issues.push(
          this.createIssue(
            'aria-hidden-focusable',
            'error',
            message,
            element.location,
            ['4.1.2'], // WCAG 4.1.2: Name, Role, Value
            {
              elementContext,
            }
          )
        );
        continue;
      }

      // Check 2: Interactive element (has handlers) with aria-hidden
      if (
        elementContext.interactive &&
        element.attributes['aria-hidden'] === 'true'
      ) {
        const message = `Interactive element <${element.tagName}> has event handlers but is marked aria-hidden="true". Hidden interactive elements create confusion for assistive technology users (WCAG 4.1.2).`;

        issues.push(
          this.createIssue(
            'interactive-element-hidden',
            'error',
            message,
            element.location,
            ['4.1.2'],
            {
              elementContext,
              relatedLocations: elementContext.jsHandlers.map((h) => h.location),
            }
          )
        );
      }

      // Future: Check 3: CSS display:none or visibility:hidden but focusable
      // This requires CSSModel to be implemented
      // if (elementContext.cssRules) {
      //   const isHidden = elementContext.cssRules.some(rule =>
      //     rule.properties.display === 'none' ||
      //     rule.properties.visibility === 'hidden' ||
      //     rule.properties.opacity === '0'
      //   );
      //   if (isHidden) {
      //     // Report issue
      //   }
      // }
    }

    return issues;
  }

  /**
   * Create message for aria-hidden focusable element.
   */
  private createAriaHiddenMessage(
    tagName: string,
    elementId: string | undefined,
    elementContext: ElementContext
  ): string {
    const elementDesc = elementId
      ? `<${tagName}> element with id="${elementId}"`
      : `<${tagName}> element`;

    const focusReason = this.getFocusReason(elementContext);

    return `${elementDesc} is focusable (${focusReason}) but is marked aria-hidden="true". Hidden elements should not be focusable. Add tabindex="-1" to remove from tab order, or remove aria-hidden if the element should be accessible (WCAG 4.1.2).`;
  }

  /**
   * Determine why an element is focusable.
   */
  private getFocusReason(elementContext: ElementContext): string {
    const element = elementContext.element;
    const tagName = element.tagName.toLowerCase();

    // Check explicit tabindex
    if (element.attributes.tabindex !== undefined) {
      return `has tabindex="${element.attributes.tabindex}"`;
    }

    // Naturally focusable elements
    const naturallyFocusable: Record<string, string> = {
      a: 'is a link',
      button: 'is a button',
      input: 'is an input',
      select: 'is a select',
      textarea: 'is a textarea',
    };

    if (naturallyFocusable[tagName]) {
      return naturallyFocusable[tagName];
    }

    return 'is focusable';
  }
}
