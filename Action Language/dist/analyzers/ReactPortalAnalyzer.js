"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactPortalAnalyzer = void 0;
exports.analyzeReactPortals = analyzeReactPortals;
const ReactPatternDetector_1 = require("../parsers/ReactPatternDetector");
class ReactPortalAnalyzer {
    analyze(source, sourceFile) {
        const issues = [];
        try {
            const analysis = (0, ReactPatternDetector_1.analyzeReactComponent)(source, sourceFile);
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
        }
        catch (error) {
            console.error(`React portal analysis failed for ${sourceFile}:`, error);
        }
        return issues;
    }
    buildMessage(portal) {
        const containerInfo = portal.container
            ? ` into container "${portal.container}"`
            : ' into external container';
        let message = `Portal renders content${containerInfo}, which can cause accessibility issues:\n`;
        message += '- Keyboard navigation order may not match visual layout\n';
        message += '- ARIA relationships may not work across portal boundary\n';
        message += '- Focus management requires manual implementation\n';
        message += '- Screen readers may announce content out of visual context';
        return message;
    }
    buildFix(_portal) {
        return {
            description: 'Ensure portal content is accessible by implementing proper focus management, ARIA live regions for announcements, and testing with keyboard navigation and screen readers.',
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
    hasPortal(source) {
        return source.includes('createPortal');
    }
}
exports.ReactPortalAnalyzer = ReactPortalAnalyzer;
function analyzeReactPortals(source, sourceFile) {
    const analyzer = new ReactPortalAnalyzer();
    return analyzer.analyze(source, sourceFile);
}
//# sourceMappingURL=ReactPortalAnalyzer.js.map