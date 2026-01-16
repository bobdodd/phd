/**
 * React Pattern Detector
 *
 * This module detects React-specific patterns that affect accessibility:
 * - Hooks: useState, useRef, useEffect
 * - Refs: ref={buttonRef}, buttonRef.current.focus()
 * - State management: ARIA state controlled by useState
 * - Effects: Focus management in useEffect
 * - Conditional rendering: {isOpen && <Dialog />}
 *
 * These patterns are important for accessibility analysis because they
 * represent dynamic behaviors that can't be detected by static HTML analysis.
 */
import { types as t } from './BabelParser';
import { ActionLanguageNode } from '../models/ActionLanguageModel';
import { SourceLocation } from '../models/BaseModel';
/**
 * React hook usage information.
 */
export interface HookUsage {
    /** Hook name (useState, useRef, useEffect, etc.) */
    hookName: string;
    /** Variable name for the hook result */
    variableName: string | null;
    /** Arguments passed to the hook */
    arguments: any[];
    /** Source location */
    location: SourceLocation;
}
/**
 * React ref usage information.
 */
export interface RefUsage {
    /** Ref variable name */
    refName: string;
    /** Type of ref usage (creation, assignment, access) */
    type: 'creation' | 'prop' | 'current' | 'forwarded' | 'imperative';
    /** Source location */
    location: SourceLocation;
    /** Additional metadata */
    metadata?: {
        /** For forwarded refs: the component name */
        componentName?: string;
        /** For imperative handle: exposed methods */
        exposedMethods?: string[];
    };
}
/**
 * React synthetic event information.
 */
export interface SyntheticEventUsage {
    /** Event handler parameter name (e, event, etc.) */
    eventParamName: string;
    /** Methods called on the event (preventDefault, stopPropagation, etc.) */
    methodsCalled: string[];
    /** Properties accessed on the event (key, target, currentTarget, etc.) */
    propertiesAccessed: string[];
    /** Source location */
    location: SourceLocation;
    /** Accessibility concerns (e.g., stopPropagation blocks assistive tech) */
    accessibilityConcerns: string[];
}
/**
 * React portal usage information.
 * Portals render children into a DOM node outside the parent component hierarchy.
 */
export interface PortalUsage {
    /** Portal children (JSX content) */
    children: any;
    /** Target container node (DOM reference or selector) */
    container: string | null;
    /** Source location */
    location: SourceLocation;
    /** Accessibility concerns with portals */
    accessibilityConcerns: string[];
}
/**
 * React context usage information.
 * Context provides a way to pass data through the component tree without props.
 */
export interface ContextUsage {
    /** Context variable name */
    contextName: string;
    /** Type of context usage */
    type: 'provider' | 'consumer' | 'useContext';
    /** Source location */
    location: SourceLocation;
    /** Additional metadata */
    metadata?: {
        /** For providers: the value being provided */
        providedValue?: any;
        /** For consumers: properties accessed from context */
        accessedProperties?: string[];
        /** Whether context appears to manage accessibility state */
        isAccessibilityRelated?: boolean;
    };
}
/**
 * React Pattern Detector
 *
 * Analyzes React code to detect patterns relevant to accessibility analysis.
 */
export declare class ReactPatternDetector {
    private hooks;
    private refs;
    private focusManagement;
    private syntheticEvents;
    private portals;
    private contexts;
    /**
     * Analyze React code and detect patterns.
     *
     * @param ast - Babel AST to analyze
     * @param sourceFile - Filename for error reporting
     */
    analyze(ast: t.File, sourceFile: string): void;
    /**
     * Detect React hook calls.
     * Enhanced to support:
     * - All standard hooks (useState, useEffect, useRef, useCallback, useMemo, etc.)
     * - Custom hooks (any function starting with "use")
     * - Array and object destructuring patterns
     */
    private detectHook;
    /**
     * Detect ref-based focus management: buttonRef.current.focus()
     */
    private detectRefFocusManagement;
    /**
     * Detect ref prop in JSX: <button ref={buttonRef}>
     */
    private detectRefProp;
    /**
     * Detect synthetic event usage in event handlers.
     * Tracks methods like preventDefault, stopPropagation, and property access.
     */
    private detectSyntheticEventUsage;
    /**
     * Detect React portals: ReactDOM.createPortal(children, container)
     *
     * Portals can create accessibility issues because they render content
     * outside the parent component's DOM hierarchy, which can break:
     * - Focus management (focus trap patterns)
     * - ARIA relationships (aria-labelledby, aria-controls crossing boundaries)
     * - Keyboard navigation (tab order disconnected from visual order)
     * - Screen reader context (announced out of visual context)
     */
    private detectPortal;
    /**
     * Detect React.forwardRef() for ref forwarding between components.
     *
     * forwardRef allows parent components to pass refs to child components,
     * which is important for accessibility patterns like focus management.
     *
     * Example:
     * const Button = React.forwardRef((props, ref) => (
     *   <button ref={ref}>Click</button>
     * ));
     */
    private detectForwardRef;
    /**
     * Detect useImperativeHandle hook for customizing ref behavior.
     *
     * useImperativeHandle allows components to customize what values are exposed
     * to parent components via refs, which is important for encapsulating focus
     * management and other accessibility behaviors.
     *
     * Example:
     * useImperativeHandle(ref, () => ({
     *   focus: () => inputRef.current.focus(),
     *   blur: () => inputRef.current.blur()
     * }));
     */
    private detectUseImperativeHandle;
    /**
     * Detect useContext() hook for consuming context.
     *
     * Context is often used for managing global accessibility state like:
     * - Theme preferences (dark mode, high contrast)
     * - Focus management state
     * - Announcement/notification state for screen readers
     * - Keyboard navigation mode
     *
     * Example:
     * const { theme, setTheme } = useContext(ThemeContext);
     * const { announce } = useContext(AccessibilityContext);
     */
    private detectContext;
    /**
     * Detect Context.Provider in JSX.
     *
     * Providers supply context values to child components.
     *
     * Example:
     * <ThemeContext.Provider value={{ theme: 'dark' }}>
     *   <App />
     * </ThemeContext.Provider>
     */
    private detectContextProvider;
    /**
     * Check if a context name suggests accessibility-related usage.
     */
    private isAccessibilityRelatedContext;
    /**
     * Get detected hooks.
     */
    getHooks(): HookUsage[];
    /**
     * Get detected refs.
     */
    getRefs(): RefUsage[];
    /**
     * Get forwarded refs (from forwardRef).
     */
    getForwardedRefs(): RefUsage[];
    /**
     * Get imperative handle refs (from useImperativeHandle).
     */
    getImperativeRefs(): RefUsage[];
    /**
     * Check if component uses ref forwarding.
     */
    usesRefForwarding(): boolean;
    /**
     * Check if component uses useImperativeHandle.
     */
    usesImperativeHandle(): boolean;
    /**
     * Get detected focus management actions.
     */
    getFocusManagement(): ActionLanguageNode[];
    /**
     * Check if a specific hook is used.
     */
    hasHook(hookName: string): boolean;
    /**
     * Get all useState hooks.
     */
    getStateHooks(): HookUsage[];
    /**
     * Get all useRef hooks.
     */
    getRefHooks(): HookUsage[];
    /**
     * Get all useEffect hooks.
     */
    getEffectHooks(): HookUsage[];
    /**
     * Get all useCallback hooks.
     * Useful for detecting memoized event handlers.
     */
    getCallbackHooks(): HookUsage[];
    /**
     * Get all useMemo hooks.
     * Useful for detecting memoized accessibility calculations.
     */
    getMemoHooks(): HookUsage[];
    /**
     * Get all custom hooks (hooks not from React standard library).
     */
    getCustomHooks(): HookUsage[];
    /**
     * Check if component uses any accessibility-related hooks.
     * Includes custom hooks that might manage accessibility state.
     */
    hasAccessibilityHooks(): boolean;
    /**
     * Get detected synthetic events.
     */
    getSyntheticEvents(): SyntheticEventUsage[];
    /**
     * Get synthetic events with accessibility concerns.
     */
    getProblematicSyntheticEvents(): SyntheticEventUsage[];
    /**
     * Check if any event handlers use stopPropagation (potential accessibility issue).
     */
    usesStopPropagation(): boolean;
    /**
     * Get detected portals.
     */
    getPortals(): PortalUsage[];
    /**
     * Check if component uses any portals.
     */
    usesPortals(): boolean;
    /**
     * Get portals with accessibility concerns.
     * (All portals have potential accessibility concerns by nature)
     */
    getProblematicPortals(): PortalUsage[];
    /**
     * Get detected contexts.
     */
    getContexts(): ContextUsage[];
    /**
     * Get context providers.
     */
    getContextProviders(): ContextUsage[];
    /**
     * Get context consumers (useContext + Context.Consumer).
     */
    getContextConsumers(): ContextUsage[];
    /**
     * Get accessibility-related contexts.
     */
    getAccessibilityContexts(): ContextUsage[];
    /**
     * Check if component uses context.
     */
    usesContext(): boolean;
    /**
     * Check if component uses accessibility-related context.
     */
    usesAccessibilityContext(): boolean;
    /**
     * Extract source location from an AST node.
     */
    private extractLocation;
    /**
     * Generate a unique ID.
     */
    private generateId;
}
/**
 * Analyze React component for accessibility-relevant patterns.
 *
 * @param source - React component source code
 * @param sourceFile - Filename for error reporting
 * @returns Pattern detection results
 *
 * @example
 * ```typescript
 * const results = analyzeReactComponent(`
 *   function Dialog() {
 *     const [isOpen, setIsOpen] = useState(false);
 *     const closeButtonRef = useRef(null);
 *
 *     useEffect(() => {
 *       if (isOpen) {
 *         closeButtonRef.current.focus();
 *       }
 *     }, [isOpen]);
 *
 *     return (
 *       <dialog open={isOpen}>
 *         <button ref={closeButtonRef} onClick={() => setIsOpen(false)}>
 *           Close
 *         </button>
 *       </dialog>
 *     );
 *   }
 * `, 'Dialog.tsx');
 *
 * console.log(results.hooks); // [{ hookName: 'useState', ... }, { hookName: 'useRef', ... }]
 * console.log(results.refs); // [{ refName: 'closeButtonRef', type: 'prop', ... }]
 * ```
 */
export declare function analyzeReactComponent(source: string, sourceFile: string): {
    hooks: HookUsage[];
    refs: RefUsage[];
    focusManagement: ActionLanguageNode[];
    syntheticEvents: SyntheticEventUsage[];
    portals: PortalUsage[];
    contexts: ContextUsage[];
};
//# sourceMappingURL=ReactPatternDetector.d.ts.map