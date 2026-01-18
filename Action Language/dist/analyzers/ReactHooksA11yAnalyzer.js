"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactHooksA11yAnalyzer = void 0;
exports.analyzeReactHooksA11y = analyzeReactHooksA11y;
const ReactPatternDetector_1 = require("../parsers/ReactPatternDetector");
const BabelParser_1 = require("../parsers/BabelParser");
class ReactHooksA11yAnalyzer {
    analyze(source, sourceFile) {
        const issues = [];
        try {
            const analysis = (0, ReactPatternDetector_1.analyzeReactComponent)(source, sourceFile);
            issues.push(...this.analyzeUseEffectPatterns(source, sourceFile, analysis.hooks));
            issues.push(...this.analyzeUseRefFocusPatterns(source, sourceFile, analysis.refs, analysis.hooks));
            issues.push(...this.analyzeUseContextPatterns(source, sourceFile, analysis.contexts, analysis.hooks));
            issues.push(...this.analyzeUseStateAriaPatterns(source, sourceFile, analysis.hooks));
        }
        catch (error) {
            console.error(`React hooks accessibility analysis failed for ${sourceFile}:`, error);
        }
        return issues;
    }
    analyzeUseEffectPatterns(source, sourceFile, hooks) {
        const issues = [];
        const ast = (0, BabelParser_1.parseSource)(source, sourceFile);
        const useEffectHooks = hooks.filter(h => h.hookName === 'useEffect');
        for (const hook of useEffectHooks) {
            const hasFocusManagement = this.containsFocusManagement(source, hook);
            const hasCleanup = this.hasCleanupFunction(ast, hook);
            if (hasFocusManagement && !hasCleanup) {
                issues.push({
                    type: 'react-hooks-useeffect-focus-cleanup',
                    severity: 'warning',
                    message: `useEffect contains focus management (.focus() or .blur()) but lacks a cleanup function. This can cause focus leaks when the component unmounts or dependencies change.

Recommended: Return a cleanup function that restores focus to the previous element.`,
                    confidence: {
                        level: 'HIGH',
                        reason: 'useEffect with focus management detected without cleanup',
                        treeCompleteness: 1.0,
                    },
                    locations: [hook.location],
                    wcagCriteria: ['2.1.1', '2.4.3'],
                    hook,
                    fix: this.buildUseEffectCleanupFix(),
                });
            }
            const hasEventListener = this.containsEventListener(source, hook);
            const hasEventCleanup = hasCleanup;
            if (hasEventListener && !hasEventCleanup) {
                issues.push({
                    type: 'react-hooks-useeffect-listener-cleanup',
                    severity: 'error',
                    message: `useEffect adds event listener (addEventListener) but lacks a cleanup function. This causes memory leaks and can interfere with keyboard navigation.

Recommended: Return a cleanup function that removes the event listener.`,
                    confidence: {
                        level: 'HIGH',
                        reason: 'useEffect with addEventListener detected without cleanup',
                        treeCompleteness: 1.0,
                    },
                    locations: [hook.location],
                    wcagCriteria: ['2.1.1'],
                    hook,
                    fix: this.buildEventListenerCleanupFix(),
                });
            }
        }
        return issues;
    }
    analyzeUseRefFocusPatterns(source, _sourceFile, refs, _hooks) {
        const issues = [];
        const focusRefs = refs.filter(ref => ref.type === 'current' &&
            (source.includes(`${ref.refName}.current.focus()`) ||
                source.includes(`${ref.refName}.current.blur()`)));
        for (const ref of focusRefs) {
            const hasFocusTrap = this.hasFocusTrapPattern(source, ref.refName);
            const hasKeyboardHandler = this.hasKeyboardHandlerForRef(source, ref.refName);
            if (hasFocusTrap && !hasKeyboardHandler) {
                issues.push({
                    type: 'react-hooks-useref-focus-trap',
                    severity: 'error',
                    message: `Ref "${ref.refName}" appears to implement a focus trap but lacks keyboard event handlers (Tab, Escape). Focus traps must allow keyboard users to navigate and exit.

Recommended: Add keyboard handlers for Tab (cycle focus) and Escape (exit trap).`,
                    confidence: {
                        level: 'MEDIUM',
                        reason: 'Focus trap pattern detected without keyboard handlers',
                        treeCompleteness: 0.8,
                    },
                    locations: [ref.location],
                    wcagCriteria: ['2.1.1', '2.1.2', '2.4.3'],
                    ref,
                    fix: this.buildFocusTrapFix(),
                });
            }
            const lacksAriaLabel = !this.hasAriaForRef(source, ref.refName);
            if (lacksAriaLabel && ref.type === 'current') {
                issues.push({
                    type: 'react-hooks-useref-focus-aria',
                    severity: 'warning',
                    message: `Ref "${ref.refName}" is used for focus management but the target element may lack ARIA labels. Elements that receive programmatic focus should have accessible names.

Recommended: Add aria-label or aria-labelledby to the element.`,
                    confidence: {
                        level: 'MEDIUM',
                        reason: 'Programmatic focus detected without clear ARIA labeling',
                        treeCompleteness: 0.7,
                    },
                    locations: [ref.location],
                    wcagCriteria: ['4.1.2'],
                    ref,
                    fix: this.buildFocusAriaFix(),
                });
            }
        }
        return issues;
    }
    analyzeUseContextPatterns(source, _sourceFile, _contexts, hooks) {
        const issues = [];
        const useContextHooks = hooks.filter(h => h.hookName === 'useContext');
        for (const hook of useContextHooks) {
            const contextName = hook.variableName || 'context';
            const managesA11yState = this.managesAccessibilityState(source, contextName);
            if (managesA11yState) {
                const hasLiveRegion = this.hasAriaLiveRegion(source);
                if (!hasLiveRegion) {
                    issues.push({
                        type: 'react-hooks-usecontext-announcements',
                        severity: 'warning',
                        message: `Context "${contextName}" appears to manage accessibility state but lacks ARIA live region announcements. Dynamic state changes should be announced to screen reader users.

Recommended: Add an aria-live region to announce important state changes.`,
                        confidence: {
                            level: 'MEDIUM',
                            reason: 'Accessibility state management detected without live regions',
                            treeCompleteness: 0.7,
                        },
                        locations: [hook.location],
                        wcagCriteria: ['4.1.3'],
                        hook,
                        fix: this.buildAriaLiveRegionFix(),
                    });
                }
            }
        }
        return issues;
    }
    analyzeUseStateAriaPatterns(source, _sourceFile, hooks) {
        const issues = [];
        const useStateHooks = hooks.filter(h => h.hookName === 'useState');
        for (const hook of useStateHooks) {
            const stateName = hook.variableName;
            if (!stateName)
                continue;
            const usedForAria = this.isUsedForAriaAttribute(source, stateName);
            if (usedForAria) {
                const hasProperUpdates = this.hasProperAriaUpdates(source, stateName);
                if (!hasProperUpdates) {
                    issues.push({
                        type: 'react-hooks-usestate-aria-updates',
                        severity: 'warning',
                        message: `State "${stateName}" is used for ARIA attributes but may not update properly. Ensure ARIA attributes reflect the current state synchronously.

Recommended: Verify that setter functions trigger re-renders and ARIA attributes update immediately.`,
                        confidence: {
                            level: 'LOW',
                            reason: 'ARIA state management pattern detected, validation needed',
                            treeCompleteness: 0.6,
                        },
                        locations: [hook.location],
                        wcagCriteria: ['4.1.2'],
                        hook,
                        fix: this.buildAriaStateFix(),
                    });
                }
            }
            if (this.isToggleState(stateName)) {
                const hasAriaExpanded = source.includes('aria-expanded');
                if (!hasAriaExpanded) {
                    issues.push({
                        type: 'react-hooks-usestate-aria-expanded',
                        severity: 'warning',
                        message: `State "${stateName}" appears to manage toggle/expanded state but the component may lack aria-expanded attribute. Expandable elements should communicate their state to assistive technologies.

Recommended: Add aria-expanded={${stateName}} to the toggle button.`,
                        confidence: {
                            level: 'MEDIUM',
                            reason: 'Toggle state detected without aria-expanded',
                            treeCompleteness: 0.7,
                        },
                        locations: [hook.location],
                        wcagCriteria: ['4.1.2'],
                        hook,
                        fix: this.buildAriaExpandedFix(stateName),
                    });
                }
            }
        }
        return issues;
    }
    containsFocusManagement(source, _hook) {
        return source.includes('.focus()') || source.includes('.blur()');
    }
    hasCleanupFunction(ast, _hook) {
        let hasCleanup = false;
        (0, BabelParser_1.traverseAST)(ast, {
            CallExpression: (path) => {
                const node = path.node;
                if (BabelParser_1.types.isIdentifier(node.callee) && node.callee.name === 'useEffect') {
                    const effectFn = node.arguments[0];
                    if (BabelParser_1.types.isArrowFunctionExpression(effectFn) || BabelParser_1.types.isFunctionExpression(effectFn)) {
                        const body = effectFn.body;
                        if (BabelParser_1.types.isBlockStatement(body)) {
                            for (const statement of body.body) {
                                if (BabelParser_1.types.isReturnStatement(statement) && statement.argument) {
                                    if (BabelParser_1.types.isArrowFunctionExpression(statement.argument) ||
                                        BabelParser_1.types.isFunctionExpression(statement.argument)) {
                                        hasCleanup = true;
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });
        return hasCleanup;
    }
    containsEventListener(source, _hook) {
        return source.includes('addEventListener');
    }
    hasFocusTrapPattern(source, refName) {
        return source.includes(`${refName}.current.querySelectorAll`) ||
            source.includes('firstChild') ||
            source.includes('lastChild') ||
            source.includes('focusable');
    }
    hasKeyboardHandlerForRef(source, _refName) {
        return (source.includes('onKeyDown') || source.includes('onKeyPress')) &&
            (source.includes('Tab') || source.includes('Escape'));
    }
    hasAriaForRef(source, _refName) {
        return source.includes('aria-label') ||
            source.includes('aria-labelledby') ||
            source.includes('aria-describedby');
    }
    managesAccessibilityState(source, contextName) {
        return source.includes(`${contextName}.`) &&
            (source.includes('aria-') ||
                source.includes('focus') ||
                source.includes('announce') ||
                source.includes('alert'));
    }
    hasAriaLiveRegion(source) {
        return source.includes('aria-live') || source.includes('role="status"') || source.includes('role="alert"');
    }
    isUsedForAriaAttribute(source, stateName) {
        return source.includes(`aria-`) && source.includes(stateName);
    }
    hasProperAriaUpdates(source, stateName) {
        const setterName = `set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}`;
        return source.includes(setterName);
    }
    isToggleState(stateName) {
        const togglePatterns = ['isOpen', 'isExpanded', 'isVisible', 'isShown', 'show', 'open', 'expanded', 'visible'];
        return togglePatterns.some(pattern => stateName.toLowerCase().includes(pattern.toLowerCase()));
    }
    buildUseEffectCleanupFix() {
        return {
            description: 'Add a cleanup function to useEffect that restores focus to the previous element.',
            code: `useEffect(() => {
  // Store the previously focused element
  const previouslyFocused = document.activeElement as HTMLElement;

  // Your focus management code
  myRef.current?.focus();

  // Cleanup: restore focus when unmounting or dependencies change
  return () => {
    previouslyFocused?.focus();
  };
}, [dependencies]);`,
        };
    }
    buildEventListenerCleanupFix() {
        return {
            description: 'Add a cleanup function to useEffect that removes the event listener.',
            code: `useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  // Add event listener
  document.addEventListener('keydown', handleKeyDown);

  // Cleanup: remove event listener
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [closeModal]);`,
        };
    }
    buildFocusTrapFix() {
        return {
            description: 'Implement proper focus trap with keyboard navigation support.',
            code: `const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!isOpen) return;

  const modal = modalRef.current;
  if (!modal) return;

  // Get all focusable elements
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  // Focus first element
  firstElement?.focus();

  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle Tab key for focus trap
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }

    // Handle Escape key to exit
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  modal.addEventListener('keydown', handleKeyDown);

  return () => {
    modal.removeEventListener('keydown', handleKeyDown);
  };
}, [isOpen, closeModal]);`,
        };
    }
    buildFocusAriaFix() {
        return {
            description: 'Add ARIA label to element that receives programmatic focus.',
            code: `<div
  ref={myRef}
  tabIndex={-1}
  aria-label="Dialog"
  aria-describedby="dialog-description"
>
  {/* Content */}
</div>`,
        };
    }
    buildAriaLiveRegionFix() {
        return {
            description: 'Add ARIA live region to announce state changes to screen readers.',
            code: `// Add to your component
const [announcement, setAnnouncement] = useState('');

// Update announcement when state changes
useEffect(() => {
  if (importantStateChange) {
    setAnnouncement('Your important state change message');

    // Clear after announcement
    const timer = setTimeout(() => setAnnouncement(''), 1000);
    return () => clearTimeout(timer);
  }
}, [importantStateChange]);

// In JSX
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {announcement}
</div>`,
        };
    }
    buildAriaStateFix() {
        return {
            description: 'Ensure ARIA attributes update synchronously with state changes.',
            code: `const [isExpanded, setIsExpanded] = useState(false);

// ARIA attribute directly reflects state
<button
  aria-expanded={isExpanded}
  aria-controls="panel-id"
  onClick={() => setIsExpanded(!isExpanded)}
>
  Toggle Panel
</button>

<div id="panel-id" hidden={!isExpanded}>
  {/* Panel content */}
</div>`,
        };
    }
    buildAriaExpandedFix(stateName) {
        return {
            description: 'Add aria-expanded attribute to communicate toggle state.',
            code: `<button
  aria-expanded={${stateName}}
  aria-controls="content-id"
  onClick={() => set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}(!${stateName})}
>
  Toggle
</button>

<div id="content-id" hidden={!${stateName}}>
  {/* Expandable content */}
</div>`,
        };
    }
}
exports.ReactHooksA11yAnalyzer = ReactHooksA11yAnalyzer;
function analyzeReactHooksA11y(source, sourceFile) {
    const analyzer = new ReactHooksA11yAnalyzer();
    return analyzer.analyze(source, sourceFile);
}
//# sourceMappingURL=ReactHooksA11yAnalyzer.js.map