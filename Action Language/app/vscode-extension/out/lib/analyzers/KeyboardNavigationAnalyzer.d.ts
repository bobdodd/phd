import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class KeyboardNavigationAnalyzer extends BaseAnalyzer {
    readonly name = "KeyboardNavigationAnalyzer";
    readonly description = "Detects 7 types of keyboard navigation issues including keyboard traps, screen reader conflicts, and missing arrow navigation";
    private readonly screenReaderKeys;
    private readonly arrowNavigationRoles;
    private readonly modalRoles;
    analyze(context: AnalyzerContext): Issue[];
    private analyzeKeyboardPatterns;
    private detectKeyboardTrap;
    private detectScreenReaderConflict;
    private detectDeprecatedKeyCode;
    private detectTabWithoutShift;
    private detectMissingEscapeHandler;
    private detectMissingArrowNavigation;
    private hasEscapeHandlerNearby;
    private hasArrowHandlersNearby;
    private generateArrowNavigationCode;
}
