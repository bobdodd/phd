import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class VisibilityFocusConflictAnalyzer extends BaseAnalyzer {
    readonly name = "visibility-focus-conflict";
    readonly description = "Detects elements that are focusable but visually hidden";
    analyze(context: AnalyzerContext): Issue[];
    private createAriaHiddenMessage;
    private getFocusReason;
    private findHidingRule;
    private createCSSHiddenMessage;
}
//# sourceMappingURL=VisibilityFocusConflictAnalyzer.d.ts.map