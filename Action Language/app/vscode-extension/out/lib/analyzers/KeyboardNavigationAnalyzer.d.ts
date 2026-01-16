import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
/**
 * KeyboardNavigationAnalyzer
 *
 * Detects 7 types of keyboard navigation issues:
 * 1. potential-keyboard-trap - Focus trapped without Escape handler
 * 2. screen-reader-conflict - Single-character shortcuts conflict with screen readers
 * 3. screen-reader-arrow-conflict - Arrow keys interfere with browse mode
 * 4. deprecated-keycode - Using event.keyCode instead of event.key
 * 5. tab-without-shift - Tab key without Shift consideration
 * 6. missing-escape-handler - Modal/dialog without Escape key
 * 7. missing-arrow-navigation - ARIA widget without arrow key handlers
 *
 * WCAG: 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap), 2.1.4 (Character Key Shortcuts), 4.1.2
 */
export declare class KeyboardNavigationAnalyzer extends BaseAnalyzer {
    readonly name = "KeyboardNavigationAnalyzer";
    readonly description = "Detects 7 types of keyboard navigation issues including keyboard traps, screen reader conflicts, and missing arrow navigation";
    private readonly screenReaderKeys;
    private readonly arrowNavigationRoles;
    private readonly modalRoles;
    analyze(context: AnalyzerContext): Issue[];
    private analyzeKeyboardPatterns;
    /**
     * Detect potential keyboard traps.
     *
     * Pattern: Tab key preventDefault without Escape handler
     * Problem: Users can't exit focus trap with keyboard
     * WCAG: 2.1.2 (No Keyboard Trap)
     */
    private detectKeyboardTrap;
    /**
     * Detect single-character keyboard shortcuts that conflict with screen readers.
     *
     * Pattern: Single letter key handler (e.g., 'h', 'k', 'b')
     * Problem: Conflicts with screen reader navigation keys
     * WCAG: 2.1.4 (Character Key Shortcuts)
     */
    private detectScreenReaderConflict;
    /**
     * Detect deprecated keyCode usage.
     *
     * Pattern: event.keyCode or event.which
     * Problem: Deprecated, should use event.key
     * WCAG: 4.1.2 (future-proofing)
     */
    private detectDeprecatedKeyCode;
    /**
     * Detect Tab key handling without Shift consideration.
     *
     * Pattern: if (event.key === 'Tab') without checking event.shiftKey
     * Problem: May miss backward navigation (Shift+Tab)
     */
    private detectTabWithoutShift;
    /**
     * Detect modals/dialogs without Escape key handlers.
     *
     * Pattern: Modal/dialog role without Escape handler
     * Problem: Users expect Escape to close modals
     * WCAG: 2.1.1 (Keyboard)
     */
    private detectMissingEscapeHandler;
    /**
     * Detect ARIA widgets without arrow key navigation.
     *
     * Pattern: Element with ARIA role requiring arrow keys, but no arrow handlers
     * Problem: Screen reader users expect arrow keys to work in these widgets
     * WCAG: 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)
     */
    private detectMissingArrowNavigation;
    private hasEscapeHandlerNearby;
    private hasArrowHandlersNearby;
    private generateArrowNavigationCode;
}
//# sourceMappingURL=KeyboardNavigationAnalyzer.d.ts.map