import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class SingleLetterShortcutAnalyzer extends BaseAnalyzer {
    readonly name = "SingleLetterShortcutAnalyzer";
    readonly description = "Detects single letter keyboard shortcuts that may interfere with assistive technology";
    analyze(context: AnalyzerContext): Issue[];
    private detectSingleCharacterShortcut;
    private hasDisableMechanism;
    private isOnlyActiveOnFocus;
    private getShortcutAction;
    private getHandlerCode;
}
