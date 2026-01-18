"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactPortalAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class ReactPortalAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'react-portal';
        this.description = 'Detects accessibility issues with React portals (focus management, ARIA relationships, keyboard navigation)';
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const model = context.actionLanguageModel;
        const portals = model.nodes.filter((node) => node.actionType === 'portal' && node.metadata?.framework === 'react');
        for (const portal of portals) {
            const container = portal.metadata?.container || 'unknown';
            const isBodyPortal = container === 'document.body' ||
                container.includes('body') ||
                container === 'document.documentElement';
            const severity = isBodyPortal ? 'warning' : 'error';
            const message = this.createPortalMessage(container, isBodyPortal);
            const fix = this.createPortalFix(container);
            issues.push(this.createIssue('react-portal-accessibility', severity, message, portal.location, ['2.1.1', '2.4.3', '4.1.2'], context, { fix }));
        }
        return issues;
    }
    createPortalMessage(container, isBodyPortal) {
        const baseMessage = `React portal renders content into "${container}" outside the parent component hierarchy.`;
        const concerns = [
            'Focus management: Focus traps may not work correctly',
            'ARIA relationships: aria-labelledby and aria-controls may break',
            'Keyboard navigation: Tab order may not match visual order',
            'Screen readers: Content may be announced out of context',
        ];
        if (isBodyPortal) {
            return `${baseMessage}\n\nPotential accessibility concerns:\n${concerns.map((c) => `- ${c}`).join('\n')}\n\nRecommendation: Use a dedicated portal container with proper ARIA attributes.`;
        }
        else {
            return `${baseMessage}\n\nCritical accessibility concerns:\n${concerns.map((c) => `- ${c}`).join('\n')}\n\nEnsure the portal container is properly configured for accessibility.`;
        }
    }
    createPortalFix(container) {
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
exports.ReactPortalAnalyzer = ReactPortalAnalyzer;
