/**
 * React Hooks Accessibility Analyzer
 *
 * Detects accessibility issues in React Hook patterns:
 * - useEffect cleanup for focus management
 * - useRef focus trap patterns
 * - useContext accessibility state management
 * - useState dynamic ARIA updates
 *
 * WCAG 2.1 Success Criteria:
 * - 2.1.1 Keyboard (Level A): Focus management in effects
 * - 2.4.3 Focus Order (Level A): Focus trap implementation
 * - 4.1.2 Name, Role, Value (Level A): Dynamic ARIA state updates
 * - 4.1.3 Status Messages (Level AA): Screen reader announcements
 *
 * Why this matters:
 * - useEffect without cleanup can leak focus management
 * - useRef-based focus traps need proper keyboard handling
 * - Context state changes may need ARIA live regions
 * - useState for ARIA attributes needs proper updates
 */

import { Issue } from '../models/BaseModel';
import { analyzeReactComponent, HookUsage, RefUsage, ContextUsage } from '../parsers/ReactPatternDetector';
import { parseSource, traverseAST, types as t, NodePath } from '../parsers/BabelParser';

export interface ReactHooksA11yIssue extends Issue {
  /** The hook usage that caused this issue */
  hook?: HookUsage;

  /** The ref usage that caused this issue */
  ref?: RefUsage;

  /** The context usage that caused this issue */
  context?: ContextUsage;

  /** Recommended fix */
  fix: {
    description: string;
    code?: string;
  };
}

/**
 * Analyzer for detecting accessibility issues in React Hooks.
 */
export class ReactHooksA11yAnalyzer {
  /**
   * Analyze React component for hooks accessibility issues.
   *
   * @param source - React component source code
   * @param sourceFile - Filename for error reporting
   * @returns Array of detected issues
   */
  analyze(source: string, sourceFile: string): ReactHooksA11yIssue[] {
    const issues: ReactHooksA11yIssue[] = [];

    try {
      const analysis = analyzeReactComponent(source, sourceFile);

      // Analyze useEffect patterns
      issues.push(...this.analyzeUseEffectPatterns(source, sourceFile, analysis.hooks));

      // Analyze useRef focus patterns
      issues.push(...this.analyzeUseRefFocusPatterns(source, sourceFile, analysis.refs, analysis.hooks));

      // Analyze useContext accessibility patterns
      issues.push(...this.analyzeUseContextPatterns(source, sourceFile, analysis.contexts, analysis.hooks));

      // Analyze useState ARIA patterns
      issues.push(...this.analyzeUseStateAriaPatterns(source, sourceFile, analysis.hooks));

    } catch (error) {
      console.error(`React hooks accessibility analysis failed for ${sourceFile}:`, error);
    }

    return issues;
  }

  /**
   * Analyze useEffect patterns for focus management issues.
   */
  private analyzeUseEffectPatterns(
    source: string,
    sourceFile: string,
    hooks: HookUsage[]
  ): ReactHooksA11yIssue[] {
    const issues: ReactHooksA11yIssue[] = [];
    const ast = parseSource(source, sourceFile);

    // Find useEffect calls
    const useEffectHooks = hooks.filter(h => h.hookName === 'useEffect');

    for (const hook of useEffectHooks) {
      // Check if useEffect contains focus management without cleanup
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

      // Check for event listeners without cleanup
      const hasEventListener = this.containsEventListener(source, hook);
      const hasEventCleanup = hasCleanup; // Same cleanup check

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

  /**
   * Analyze useRef patterns for focus trap issues.
   */
  private analyzeUseRefFocusPatterns(
    source: string,
    _sourceFile: string,
    refs: RefUsage[],
    _hooks: HookUsage[]
  ): ReactHooksA11yIssue[] {
    const issues: ReactHooksA11yIssue[] = [];

    // Check if refs are used for focus management
    const focusRefs = refs.filter(ref =>
      ref.type === 'current' &&
      (source.includes(`${ref.refName}.current.focus()`) ||
       source.includes(`${ref.refName}.current.blur()`))
    );

    for (const ref of focusRefs) {
      // Check if there's a focus trap pattern
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

      // Check for refs used in focus management without ARIA
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

  /**
   * Analyze useContext patterns for accessibility state management.
   */
  private analyzeUseContextPatterns(
    source: string,
    _sourceFile: string,
    _contexts: ContextUsage[],
    hooks: HookUsage[]
  ): ReactHooksA11yIssue[] {
    const issues: ReactHooksA11yIssue[] = [];

    // Find useContext hooks that might manage accessibility state
    const useContextHooks = hooks.filter(h => h.hookName === 'useContext');

    for (const hook of useContextHooks) {
      // Check if context appears to manage accessibility state
      const contextName = hook.variableName || 'context';
      const managesA11yState = this.managesAccessibilityState(source, contextName);

      if (managesA11yState) {
        // Check if changes are announced to screen readers
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

  /**
   * Analyze useState patterns for ARIA attribute management.
   */
  private analyzeUseStateAriaPatterns(
    source: string,
    _sourceFile: string,
    hooks: HookUsage[]
  ): ReactHooksA11yIssue[] {
    const issues: ReactHooksA11yIssue[] = [];

    // Find useState hooks that manage ARIA-related state
    const useStateHooks = hooks.filter(h => h.hookName === 'useState');

    for (const hook of useStateHooks) {
      const stateName = hook.variableName;
      if (!stateName) continue;

      // Check if state is used for ARIA attributes
      const usedForAria = this.isUsedForAriaAttribute(source, stateName);

      if (usedForAria) {
        // Check if state changes trigger re-renders properly
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

      // Check for expanded/collapsed state without aria-expanded
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

  // Helper methods for pattern detection

  private containsFocusManagement(source: string, _hook: HookUsage): boolean {
    // Check if hook's source region contains .focus() or .blur()
    return source.includes('.focus()') || source.includes('.blur()');
  }

  private hasCleanupFunction(ast: t.File, _hook: HookUsage): boolean {
    let hasCleanup = false;

    traverseAST(ast, {
      CallExpression: (path: NodePath<t.CallExpression>) => {
        const node = path.node;
        if (t.isIdentifier(node.callee) && node.callee.name === 'useEffect') {
          // Check if first argument (effect function) returns a function
          const effectFn = node.arguments[0];
          if (t.isArrowFunctionExpression(effectFn) || t.isFunctionExpression(effectFn)) {
            const body = effectFn.body;

            // Check for return statement with function
            if (t.isBlockStatement(body)) {
              for (const statement of body.body) {
                if (t.isReturnStatement(statement) && statement.argument) {
                  if (t.isArrowFunctionExpression(statement.argument) ||
                      t.isFunctionExpression(statement.argument)) {
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

  private containsEventListener(source: string, _hook: HookUsage): boolean {
    return source.includes('addEventListener');
  }

  private hasFocusTrapPattern(source: string, refName: string): boolean {
    // Look for patterns like querySelectorAll, firstChild, lastChild
    return source.includes(`${refName}.current.querySelectorAll`) ||
           source.includes('firstChild') ||
           source.includes('lastChild') ||
           source.includes('focusable');
  }

  private hasKeyboardHandlerForRef(source: string, _refName: string): boolean {
    return (source.includes('onKeyDown') || source.includes('onKeyPress')) &&
           (source.includes('Tab') || source.includes('Escape'));
  }

  private hasAriaForRef(source: string, _refName: string): boolean {
    return source.includes('aria-label') ||
           source.includes('aria-labelledby') ||
           source.includes('aria-describedby');
  }

  private managesAccessibilityState(source: string, contextName: string): boolean {
    return source.includes(`${contextName}.`) &&
           (source.includes('aria-') ||
            source.includes('focus') ||
            source.includes('announce') ||
            source.includes('alert'));
  }

  private hasAriaLiveRegion(source: string): boolean {
    return source.includes('aria-live') || source.includes('role="status"') || source.includes('role="alert"');
  }

  private isUsedForAriaAttribute(source: string, stateName: string): boolean {
    return source.includes(`aria-`) && source.includes(stateName);
  }

  private hasProperAriaUpdates(source: string, stateName: string): boolean {
    // Check if setter function is called (setState pattern)
    const setterName = `set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}`;
    return source.includes(setterName);
  }

  private isToggleState(stateName: string): boolean {
    const togglePatterns = ['isOpen', 'isExpanded', 'isVisible', 'isShown', 'show', 'open', 'expanded', 'visible'];
    return togglePatterns.some(pattern =>
      stateName.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  // Fix builders

  private buildUseEffectCleanupFix(): { description: string; code: string } {
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

  private buildEventListenerCleanupFix(): { description: string; code: string } {
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

  private buildFocusTrapFix(): { description: string; code: string } {
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

  private buildFocusAriaFix(): { description: string; code: string } {
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

  private buildAriaLiveRegionFix(): { description: string; code: string } {
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

  private buildAriaStateFix(): { description: string; code: string } {
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

  private buildAriaExpandedFix(stateName: string): { description: string; code: string } {
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

/**
 * Convenience function to analyze React component for hooks accessibility issues.
 */
export function analyzeReactHooksA11y(
  source: string,
  sourceFile: string
): ReactHooksA11yIssue[] {
  const analyzer = new ReactHooksA11yAnalyzer();
  return analyzer.analyze(source, sourceFile);
}
