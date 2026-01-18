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
import { HookUsage, RefUsage, ContextUsage } from '../parsers/ReactPatternDetector';
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
export declare class ReactHooksA11yAnalyzer {
    /**
     * Analyze React component for hooks accessibility issues.
     *
     * @param source - React component source code
     * @param sourceFile - Filename for error reporting
     * @returns Array of detected issues
     */
    analyze(source: string, sourceFile: string): ReactHooksA11yIssue[];
    /**
     * Analyze useEffect patterns for focus management issues.
     */
    private analyzeUseEffectPatterns;
    /**
     * Analyze useRef patterns for focus trap issues.
     */
    private analyzeUseRefFocusPatterns;
    /**
     * Analyze useContext patterns for accessibility state management.
     */
    private analyzeUseContextPatterns;
    /**
     * Analyze useState patterns for ARIA attribute management.
     */
    private analyzeUseStateAriaPatterns;
    private containsFocusManagement;
    private hasCleanupFunction;
    private containsEventListener;
    private hasFocusTrapPattern;
    private hasKeyboardHandlerForRef;
    private hasAriaForRef;
    private managesAccessibilityState;
    private hasAriaLiveRegion;
    private isUsedForAriaAttribute;
    private hasProperAriaUpdates;
    private isToggleState;
    private buildUseEffectCleanupFix;
    private buildEventListenerCleanupFix;
    private buildFocusTrapFix;
    private buildFocusAriaFix;
    private buildAriaLiveRegionFix;
    private buildAriaStateFix;
    private buildAriaExpandedFix;
}
/**
 * Convenience function to analyze React component for hooks accessibility issues.
 */
export declare function analyzeReactHooksA11y(source: string, sourceFile: string): ReactHooksA11yIssue[];
//# sourceMappingURL=ReactHooksA11yAnalyzer.d.ts.map