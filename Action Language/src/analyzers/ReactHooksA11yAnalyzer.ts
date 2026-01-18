/**
 * React Hooks Accessibility Analyzer
 *
 * Detects accessibility issues in React Hook patterns:
 * - useEffect cleanup for focus management
 * - useRef focus trap patterns
 * - Event propagation blocking assistive technology
 * - Portal accessibility concerns
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): Focus management in effects
 * - 2.4.3 Focus Order (Level A): Focus trap implementation
 * - 4.1.2 Name, Role, Value (Level A): Dynamic ARIA state updates
 *
 * This analyzer follows Paradise architecture:
 * - Extends BaseAnalyzer
 * - Works with ActionLanguage models (not direct Babel parsing)
 * - Analyzes patterns extracted by ReactActionLanguageExtractor
 */

import {
  BaseAnalyzer,
  AnalyzerContext,
  Issue,
  IssueFix,
} from './BaseAnalyzer';

export class ReactHooksA11yAnalyzer extends BaseAnalyzer {
  readonly name = 'react-hooks-a11y';
  readonly description =
    'Detects accessibility issues in React Hooks patterns (useEffect focus management, useRef patterns)';

  /**
   * Analyze for React Hooks accessibility issues.
   *
   * Works with ActionLanguage models extracted by ReactActionLanguageExtractor.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    // Analyze focus management in useEffect
    issues.push(...this.analyzeFocusManagement(context));

    // Note: Portals are analyzed by ReactPortalAnalyzer
    // Note: Event propagation is analyzed by ReactStopPropagationAnalyzer

    return issues;
  }

  /**
   * Analyze focus management patterns.
   * Detects useEffect with focus changes that lack cleanup functions.
   */
  private analyzeFocusManagement(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const model = context.actionLanguageModel!;

    // Find all focus management actions
    const focusActions = model.nodes.filter(
      (node) =>
        node.actionType === 'focusChange' &&
        node.metadata?.framework === 'react' &&
        node.metadata?.hook === 'useEffect'
    );

    for (const focusAction of focusActions) {
      // In ActionLanguage, we can't easily detect if cleanup exists
      // This is a limitation - we flag all useEffect focus management as potential issues
      // and suggest adding cleanup
      const message =
        'useEffect contains focus management (.focus() or .blur()) but may lack a cleanup function. ' +
        'Focus management in effects should return a cleanup function to prevent focus leaks when the component unmounts or dependencies change.';

      const fix: IssueFix = {
        description: 'Add cleanup function to useEffect',
        code: `useEffect(() => {
  // Your focus management code
  elementRef.current.focus();

  // Add cleanup to restore focus
  return () => {
    // Restore focus to previous element or remove focus
    document.activeElement?.blur();
  };
}, [dependencies]);`,
        location: focusAction.location,
      };

      issues.push(
        this.createIssue(
          'react-hooks-useeffect-focus-cleanup',
          'warning',
          message,
          focusAction.location,
          ['2.1.1', '2.4.3'],
          context,
          { fix }
        )
      );
    }

    return issues;
  }
}
