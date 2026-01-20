import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class KeyboardTrapAnalyzer extends BaseAnalyzer {
    readonly name = "KeyboardTrapAnalyzer";
    readonly description = "Detects keyboard traps and focus management issues";
    analyze(context: AnalyzerContext): Issue[];
    private checkModalDialogs;
    private checkFocusTraps;
    private checkTabPrevention;
    private checkFocusLoops;
    private hasEscapeKeyHandler;
    private hasFocusTrapImplementation;
    private actionHandlesTabKey;
    private actionPreventsDefault;
    private hasEscapeHandlerInScope;
    private getActionCode;
}
