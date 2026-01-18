"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactA11yAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class ReactA11yAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'react-a11y';
        this.description = 'Detects React accessibility issues: useEffect focus management, portals, and event propagation';
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        issues.push(...this.analyzeFocusManagement(context));
        issues.push(...this.analyzePortals(context));
        issues.push(...this.analyzeEventPropagation(context));
        return issues;
    }
    analyzeFocusManagement(context) {
        const issues = [];
        const model = context.actionLanguageModel;
        const focusActions = model.nodes.filter((node) => node.actionType === 'focusChange' &&
            node.metadata?.framework === 'react' &&
            node.metadata?.hook === 'useEffect');
        for (const focusAction of focusActions) {
            if (focusAction.metadata?.hasCleanup === true) {
                continue;
            }
            const message = 'useEffect contains focus management (.focus() or .blur()) but lacks a cleanup function. ' +
                'Focus management in effects should return a cleanup function to prevent focus leaks when the component unmounts or dependencies change.';
            const fix = {
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
            issues.push(this.createIssue('react-useeffect-focus-cleanup', 'warning', message, focusAction.location, ['2.1.1', '2.4.3'], context, { fix }));
        }
        return issues;
    }
    analyzePortals(context) {
        const issues = [];
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
    analyzeEventPropagation(context) {
        const issues = [];
        const model = context.actionLanguageModel;
        const propagationActions = model.nodes.filter((node) => node.actionType === 'eventPropagation' &&
            node.metadata?.framework === 'react');
        for (const action of propagationActions) {
            const method = action.metadata?.method || 'stopPropagation';
            const eventParam = action.metadata?.eventParam || 'event';
            const severity = method === 'stopImmediatePropagation' ? 'error' : 'warning';
            const message = this.createPropagationMessage(method);
            const fix = this.createPropagationFix(method, eventParam);
            issues.push(this.createIssue(`react-${method}`, severity, message, action.location, ['2.1.1', '4.1.2'], context, { fix }));
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
    createPropagationMessage(method) {
        if (method === 'stopImmediatePropagation') {
            return `Event handler calls ${method}(), which immediately stops all event propagation. ` +
                'This is a CRITICAL accessibility issue that can:\n' +
                '- Block screen reader event listeners completely\n' +
                '- Prevent keyboard navigation from working\n' +
                '- Disable browser accessibility features\n' +
                '- Break assistive technology integration\n\n' +
                'stopImmediatePropagation should almost never be used. ' +
                'Use event.preventDefault() instead if you need to prevent default browser behavior.';
        }
        else {
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
    createPropagationFix(method, eventParam) {
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
exports.ReactA11yAnalyzer = ReactA11yAnalyzer;
