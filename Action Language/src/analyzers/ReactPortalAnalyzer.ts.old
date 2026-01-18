/**
 * React Portal Analyzer
 *
 * Detects use of React portals (ReactDOM.createPortal) and flags potential
 * accessibility issues that arise from rendering content outside the parent
 * component's DOM hierarchy.
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): Portals can break keyboard navigation order
 * - 2.4.3 Focus Order (Level A): Focus order may not match visual order
 * - 1.3.2 Meaningful Sequence (Level A): Reading order may be disrupted
 * - 4.1.2 Name, Role, Value (Level A): ARIA relationships may break across boundaries
 *
 * Why this matters:
 * - Portals render content in a different part of the DOM tree
 * - Keyboard tab order follows DOM order, not visual order
 * - ARIA relationships (aria-labelledby, aria-controls) don't cross portal boundaries well
 * - Focus management becomes complex (focus traps, returning focus)
 * - Screen readers may announce portals out of visual context
 */

import { Issue } from '../models/BaseModel';
import { analyzeReactComponent, PortalUsage } from '../parsers/ReactPatternDetector';

export interface ReactPortalIssue extends Issue {
  /** The portal usage that caused this issue */
  portal: PortalUsage;

  /** Recommended fix */
  fix: {
    description: string;
    code?: string;
  };
}

/**
 * Analyzer for detecting portal accessibility issues in React components.
 */
export class ReactPortalAnalyzer {
  /**
   * Analyze React component for portal accessibility issues.
   *
   * @param source - React component source code
   * @param sourceFile - Filename for error reporting
   * @returns Array of detected issues
   *
   * @example
   * ```typescript
   * const analyzer = new ReactPortalAnalyzer();
   * const issues = analyzer.analyze(`
   *   function Modal() {
   *     return ReactDOM.createPortal(
   *       <div role="dialog">
   *         <button>Close</button>
   *       </div>,
   *       document.getElementById('modal-root')
   *     );
   *   }
   * `, 'Modal.tsx');
   * ```
   */
  analyze(source: string, sourceFile: string): ReactPortalIssue[] {
    const issues: ReactPortalIssue[] = [];

    try {
      const analysis = analyzeReactComponent(source, sourceFile);
      const portals = analysis.portals;

      for (const portal of portals) {
        const message = this.buildMessage(portal);
        const fix = this.buildFix(portal);

        issues.push({
          type: 'react-portal-accessibility',
          severity: 'warning',
          message,
          confidence: {
            level: 'HIGH',
            reason: 'Portal detected - accessibility concerns depend on implementation',
            treeCompleteness: 1.0,
          },
          locations: [portal.location],
          wcagCriteria: ['2.1.1', '2.4.3', '1.3.2', '4.1.2'],
          portal,
          fix,
        });
      }
    } catch (error) {
      console.error(`React portal analysis failed for ${sourceFile}:`, error);
    }

    return issues;
  }

  /**
   * Build a detailed message for the portal issue.
   */
  private buildMessage(portal: PortalUsage): string {
    const containerInfo = portal.container
      ? ` into container "${portal.container}"`
      : ' into external container';

    let message = `Portal renders content${containerInfo}, which can cause accessibility issues:\n`;

    // Add specific concerns
    message += '- Keyboard navigation order may not match visual layout\n';
    message += '- ARIA relationships may not work across portal boundary\n';
    message += '- Focus management requires manual implementation\n';
    message += '- Screen readers may announce content out of visual context';

    return message;
  }

  /**
   * Build a fix recommendation.
   */
  private buildFix(_portal: PortalUsage): { description: string; code?: string } {
    return {
      description:
        'Ensure portal content is accessible by implementing proper focus management, ARIA live regions for announcements, and testing with keyboard navigation and screen readers.',
      code: `// Portal accessibility checklist:
// 1. Focus Management
//    - Trap focus within modal/dialog portals
//    - Return focus to trigger element on close
//    - Set initial focus to appropriate element

const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    const previouslyFocused = document.activeElement;
    modalRef.current?.focus();

    return () => {
      // Return focus when closing
      (previouslyFocused as HTMLElement)?.focus();
    };
  }
}, [isOpen]);

// 2. ARIA Attributes
//    - Add role="dialog" or role="alertdialog"
//    - Add aria-modal="true"
//    - Add aria-labelledby pointing to title
//    - Add aria-describedby for description

<div
  ref={modalRef}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  tabIndex={-1}
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal content...</p>
</div>

// 3. Keyboard Handling
//    - Handle Escape key to close
//    - Implement focus trap
//    - Ensure all interactive elements are reachable

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal();
  }
  // Add focus trap logic here
};

// 4. Screen Reader Announcements
//    - Use aria-live for dynamic content
//    - Announce modal opening/closing

<div aria-live="polite" aria-atomic="true">
  {isOpen && "Modal opened"}
</div>`,
    };
  }

  /**
   * Check if a component uses portals (quick check without full analysis).
   */
  hasPortal(source: string): boolean {
    return source.includes('createPortal');
  }
}

/**
 * Convenience function to analyze React component for portal issues.
 *
 * @param source - React component source code
 * @param sourceFile - Filename for error reporting
 * @returns Array of detected issues
 */
export function analyzeReactPortals(
  source: string,
  sourceFile: string
): ReactPortalIssue[] {
  const analyzer = new ReactPortalAnalyzer();
  return analyzer.analyze(source, sourceFile);
}
