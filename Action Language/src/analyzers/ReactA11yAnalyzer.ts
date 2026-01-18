/**
 * React Accessibility Analyzer
 *
 * Unified analyzer for React accessibility issues:
 * - useEffect focus management without cleanup
 * - React portals breaking accessibility
 * - event.stopPropagation() blocking assistive technology
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): Focus management and event propagation
 * - 2.4.3 Focus Order (Level A): Focus order and portal tab order
 * - 4.1.2 Name, Role, Value (Level A): ARIA relationships and AT access
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

export class ReactA11yAnalyzer extends BaseAnalyzer {
  readonly name = 'react-a11y';
  readonly description =
    'Detects React accessibility issues: useEffect focus management, portals, and event propagation';

  /**
   * Analyze for all React accessibility issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    // Analyze focus management in useEffect
    issues.push(...this.analyzeFocusManagement(context));

    // Analyze React portals
    issues.push(...this.analyzePortals(context));

    // Analyze event propagation
    issues.push(...this.analyzeEventPropagation(context));

    return issues;
  }

  /**
   * Analyze focus management patterns in useEffect.
   * Detects useEffect with focus changes that lack cleanup functions.
   */
  private analyzeFocusManagement(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const model = context.actionLanguageModel!;

    // Find all focus management actions in useEffect
    const focusActions = model.nodes.filter(
      (node) =>
        node.actionType === 'focusChange' &&
        node.metadata?.framework === 'react' &&
        node.metadata?.hook === 'useEffect'
    );

    for (const focusAction of focusActions) {
      // Only flag if it lacks a cleanup function
      if (focusAction.metadata?.hasCleanup === true) {
        continue; // Has cleanup, no issue
      }

      const message =
        'useEffect contains focus management (.focus() or .blur()) but lacks a cleanup function. ' +
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
          'react-useeffect-focus-cleanup',
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

  /**
   * Analyze React portal accessibility issues.
   */
  private analyzePortals(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const model = context.actionLanguageModel!;

    // Find all portal nodes
    const portals = model.nodes.filter(
      (node) =>
        node.actionType === 'portal' && node.metadata?.framework === 'react'
    );

    for (const portal of portals) {
      const container = portal.metadata?.container || 'unknown';

      // Check if portal is rendering into document.body
      const isBodyPortal =
        container === 'document.body' ||
        container.includes('body') ||
        container === 'document.documentElement';

      const severity = isBodyPortal ? 'warning' : 'error';
      const message = this.createPortalMessage(container, isBodyPortal);
      const fix = this.createPortalFix(container);

      issues.push(
        this.createIssue(
          'react-portal-accessibility',
          severity,
          message,
          portal.location,
          ['2.1.1', '2.4.3', '4.1.2'],
          context,
          { fix }
        )
      );
    }

    return issues;
  }

  /**
   * Analyze event propagation issues (stopPropagation).
   */
  private analyzeEventPropagation(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];
    const model = context.actionLanguageModel!;

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
      const message = this.createPropagationMessage(method);
      const fix = this.createPropagationFix(method, eventParam);

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
   * Create message for portal issue.
   */
  private createPortalMessage(container: string, isBodyPortal: boolean): string {
    const baseMessage =
      `React portal renders content into "${container}" outside the parent component hierarchy.`;

    const concerns = [
      'Focus management: Focus traps may not work correctly',
      'ARIA relationships: aria-labelledby and aria-controls may break',
      'Keyboard navigation: Tab order may not match visual order',
      'Screen readers: Content may be announced out of context',
    ];

    if (isBodyPortal) {
      return `${baseMessage}\n\nPotential accessibility concerns:\n${concerns.map((c) => `- ${c}`).join('\n')}\n\nRecommendation: Use a dedicated portal container with proper ARIA attributes.`;
    } else {
      return `${baseMessage}\n\nCritical accessibility concerns:\n${concerns.map((c) => `- ${c}`).join('\n')}\n\nEnsure the portal container is properly configured for accessibility.`;
    }
  }

  /**
   * Create fix for portal issue.
   */
  private createPortalFix(container: string): IssueFix {
    return {
      description: 'Implement accessible portal pattern',
      code: `// 1. Create a dedicated portal root in your HTML:
// <div id="portal-root" role="presentation"></div>

// 2. For modal dialogs:
function AccessibleModal({ isOpen, onClose, children }) {
  const portalRoot = document.getElementById('portal-root');
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement;
      modalRef.current?.focus();

      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        previouslyFocused?.focus();
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <h2 id="modal-title">{/* Modal title */}</h2>
      {children}
    </div>,
    portalRoot
  );
}`,
      location: { file: container, line: 0, column: 0 },
    };
  }

  /**
   * Create message for stopPropagation issue.
   */
  private createPropagationMessage(method: string): string {
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
   * Create fix for stopPropagation issue.
   */
  private createPropagationFix(method: string, eventParam: string): IssueFix {
    return {
      description: `Replace ${method}() with accessible alternative`,
      code: `// GOOD: Use preventDefault instead of stopPropagation
const handleClick = (${eventParam}) => {
  ${eventParam}.preventDefault(); // Prevents default action, allows propagation
  // Your handler logic
};

// ACCEPTABLE: Conditionally stop propagation
const handleClick = (${eventParam}) => {
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
