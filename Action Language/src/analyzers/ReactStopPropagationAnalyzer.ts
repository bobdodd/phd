/**
 * React stopPropagation Analyzer
 *
 * Detects usage of event.stopPropagation() and event.stopImmediatePropagation()
 * which can block assistive technology from receiving events.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): All functionality available via keyboard
 * - 4.1.2 Name, Role, Value (Level A): Assistive tech can access events
 *
 * This analyzer follows Paradise architecture:
 * - Extends BaseAnalyzer
 * - Works with ActionLanguage models
 * - Analyzes patterns extracted by ReactActionLanguageExtractor
 */

import {
  BaseAnalyzer,
  AnalyzerContext,
  Issue,
  IssueFix,
} from './BaseAnalyzer';

export class ReactStopPropagationAnalyzer extends BaseAnalyzer {
  readonly name = 'react-stop-propagation';
  readonly description =
    'Detects event.stopPropagation() usage that can block assistive technology';

  /**
   * Analyze for stopPropagation issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    const model = context.actionLanguageModel;

    // Find all event propagation actions
    const propagationActions = model.nodes.filter(
      (node) =>
        node.actionType === 'eventPropagation' &&
        node.metadata?.framework === 'react'
    );

    for (const action of propagationActions) {
      const method = action.metadata?.method || 'stopPropagation';
      const eventParam = action.metadata?.eventParam || 'event';

      // stopImmediatePropagation is more severe
      const severity = method === 'stopImmediatePropagation' ? 'error' : 'warning';

      const message = this.createMessage(method);
      const fix = this.createFix(method, eventParam);

      issues.push(
        this.createIssue(
          `react-${method}`,
          severity,
          message,
          action.location,
          ['2.1.1', '4.1.2'],
          context,
          { fix }
        )
      );
    }

    return issues;
  }

  /**
   * Create message for stopPropagation issue.
   */
  private createMessage(method: string): string {
    if (method === 'stopImmediatePropagation') {
      return `Event handler calls ${method}(), which immediately stops all event propagation. ` +
        'This is a CRITICAL accessibility issue that can:\n' +
        '- Block screen reader event listeners completely\n' +
        '- Prevent keyboard navigation from working\n' +
        '- Disable browser accessibility features\n' +
        '- Break assistive technology integration\n\n' +
        'stopImmediatePropagation should almost never be used. ' +
        'Use event.preventDefault() instead if you need to prevent default browser behavior.';
    } else {
      return `Event handler calls ${method}(), which prevents parent elements from receiving this event. ` +
        'This can cause accessibility issues:\n' +
        '- Screen reader event listeners on parent elements may not fire\n' +
        '- Keyboard navigation handlers may be blocked\n' +
        '- Global accessibility event handlers may not work\n\n' +
        'Consider these alternatives:\n' +
        '- Use event.preventDefault() to prevent default action without stopping propagation\n' +
        '- Allow events to bubble for accessibility, stop propagation only when absolutely necessary\n' +
        '- Check if the event is from assistive technology before stopping propagation';
    }
  }

  /**
   * Create fix suggestion.
   */
  private createFix(method: string, eventParam: string): IssueFix {
    return {
      description: `Replace ${method}() with accessible alternative`,
      code: `// GOOD: Use preventDefault instead of stopPropagation
const handleClick = (${eventParam}) => {
  ${eventParam}.preventDefault(); // Prevents default action, allows propagation
  // Your handler logic
};

// ACCEPTABLE: Conditionally stop propagation
const handleClick = (${eventParam}) => {
  // Only stop propagation for non-accessibility events
  const isFromAccessibility =
    ${eventParam}.detail?.fromScreenReader ||
    ${eventParam}.detail?.fromKeyboard;

  if (!isFromAccessibility) {
    ${eventParam}.stopPropagation();
  }

  // Your handler logic
};

// BEST: Redesign to avoid needing stopPropagation
// Often you can restructure your component hierarchy to avoid
// needing to stop event propagation at all.`,
      location: { file: '', line: 0, column: 0 },
    };
  }
}
