import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class FocusManagementAnalyzer extends BaseAnalyzer {
    readonly name = "focus-management";
    readonly description = "Detects focus management issues that can strand keyboard users";
    analyze(context: AnalyzerContext): Issue[];
    private analyzeWithDocumentModel;
    private analyzeFileScope;
    private detectRemovalWithoutFocusCheck;
    private detectHidingWithoutFocusCheck;
    private detectNonFocusableFocus;
    private detectStandaloneBlur;
    private detectMissingFocusRestoration;
    private hasFocusCheckNearby;
    private hasFocusCallNearby;
    private hasFocusRestorationNearby;
    private isElementFocusable;
    private generateRemovalFix;
    private generateHidingFix;
    private generateFocusableFix;
}
//# sourceMappingURL=FocusManagementAnalyzer.d.ts.map