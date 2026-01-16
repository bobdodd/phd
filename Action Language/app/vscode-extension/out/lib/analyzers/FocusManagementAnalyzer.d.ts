/**
 * Focus Management Analyzer
 *
 * Detects focus management issues that can leave keyboard users stranded.
 * These are critical WCAG 2.4.3 (Focus Order) and 2.4.7 (Focus Visible) violations.
 *
 * WCAG Success Criteria:
 * - 2.4.3 Focus Order (Level A): Focus order must be logical and consistent
 * - 2.4.7 Focus Visible (Level AA): Keyboard focus indicator must be visible
 *
 * Issues Detected:
 * 1. removal-without-focus-management - element.remove() without focus check
 * 2. hiding-without-focus-management - element hidden without focus check
 * 3. hiding-class-without-focus-management - classList may hide element
 * 4. possibly-non-focusable - .focus() on non-focusable element
 * 5. standalone-blur - .blur() without moving focus
 * 6. focus-restoration-missing - modal closed without focus restoration
 *
 * Why This Matters:
 * - Removing/hiding focused elements can leave keyboard users with no visible focus
 * - Calling .focus() on non-focusable elements silently fails
 * - Calling .blur() without moving focus leaves no focused element
 * - These issues are invisible to mouse users but critical for keyboard users
 */
import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class FocusManagementAnalyzer extends BaseAnalyzer {
    readonly name = "focus-management";
    readonly description = "Detects focus management issues that can strand keyboard users";
    /**
     * Analyze for focus management issues.
     *
     * Works in both file-scope and document-scope:
     * - File-scope: Detects patterns in individual files
     * - Document-scope: Better accuracy with full element context
     */
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Document-scope analysis with full DOM + JS context.
     */
    private analyzeWithDocumentModel;
    /**
     * File-scope analysis (backward compatible).
     */
    private analyzeFileScope;
    /**
     * Detect element.remove() without checking if element has focus.
     *
     * Pattern: element.remove()
     * Problem: If element (or descendant) has focus, focus is lost
     * Fix: Check document.activeElement before removing
     */
    private detectRemovalWithoutFocusCheck;
    /**
     * Detect element hiding without checking if element has focus.
     *
     * Patterns:
     * - element.style.display = 'none'
     * - element.style.visibility = 'hidden'
     * - element.hidden = true
     */
    private detectHidingWithoutFocusCheck;
    /**
     * Detect .focus() called on potentially non-focusable elements.
     *
     * Pattern: element.focus() where element is not naturally focusable
     * Problem: Call silently fails, no focus change occurs
     * Fix: Add tabindex="0" or use naturally focusable element
     */
    private detectNonFocusableFocus;
    /**
     * Detect standalone .blur() calls without moving focus.
     *
     * Pattern: element.blur()
     * Problem: Leaves no focused element, keyboard users lose their place
     * Fix: Move focus to specific element instead
     */
    private detectStandaloneBlur;
    /**
     * Detect modal/dialog close without focus restoration.
     *
     * Pattern: Modal closes but doesn't restore focus to trigger element
     * Problem: Keyboard users lose their place when modal closes
     * Fix: Store previousActiveElement and restore on close
     */
    private detectMissingFocusRestoration;
    /**
     * Check if there's a focus check (document.activeElement) nearby.
     */
    private hasFocusCheckNearby;
    /**
     * Check if there's a .focus() call nearby.
     */
    private hasFocusCallNearby;
    /**
     * Check if there's focus restoration logic nearby.
     */
    private hasFocusRestorationNearby;
    /**
     * Check if an element is focusable.
     */
    private isElementFocusable;
    /**
     * Generate fix for removal without focus check.
     */
    private generateRemovalFix;
    /**
     * Generate fix for hiding without focus check.
     */
    private generateHidingFix;
    /**
     * Generate fix for non-focusable element.
     */
    private generateFocusableFix;
}
//# sourceMappingURL=FocusManagementAnalyzer.d.ts.map