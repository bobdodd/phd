import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class MouseOnlyClickAnalyzer extends BaseAnalyzer {
    readonly name = "mouse-only-click";
    readonly description = "Detects click handlers without corresponding keyboard handlers";
    analyze(context: AnalyzerContext): Issue[];
    private analyzeWithDocumentModel;
    private analyzeFileScope;
    private hasKeyboardHandlerForSelector;
    private createMessage;
    private generateFix;
    private generateFileScopeFix;
    private getElementSelector;
}
//# sourceMappingURL=MouseOnlyClickAnalyzer.d.ts.map