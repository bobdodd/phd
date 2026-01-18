/**
 * React Portal Accessibility Analyzer
 *
 * Detects accessibility issues with React portals (ReactDOM.createPortal).
 * Portals render content outside the parent component's DOM hierarchy, which
 * can create accessibility problems.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): Focus management across portal boundaries
 * - 2.4.3 Focus Order (Level A): Tab order matches visual order
 * - 4.1.2 Name, Role, Value (Level A): ARIA relationships work across portals
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

export class ReactPortalAnalyzer extends BaseAnalyzer {
  readonly name = 'react-portal';
  readonly description =
    'Detects accessibility issues with React portals (focus management, ARIA relationships, keyboard navigation)';

  /**
   * Analyze for React portal accessibility issues.
   */
  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    const model = context.actionLanguageModel;

    // Find all portal nodes
    const portals = model.nodes.filter(
      (node) =>
        node.actionType === 'portal' && node.metadata?.framework === 'react'
    );

    for (const portal of portals) {
      const container = portal.metadata?.container || 'unknown';

      // Check if portal is rendering into document.body or similar
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
   * Create fix suggestion for portal issue.
   */
  private createPortalFix(container: string): IssueFix {
    return {
      description: 'Implement accessible portal pattern',
      code: `// 1. Create a dedicated portal root in your HTML:
// <div id="portal-root" role="presentation"></div>

// 2. For modal dialogs:
function AccessibleModal({ isOpen, onClose, children }) {
  const portalRoot = document.getElementById('portal-root');

  useEffect(() => {
    if (isOpen) {
      // Save the currently focused element
      const previouslyFocused = document.activeElement;

      // Focus the modal
      modalRef.current?.focus();

      // Add keyboard handler for Escape
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        // Restore focus when closing
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
}
