import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class FocusOrderConflictAnalyzer extends BaseAnalyzer {
    readonly name = "focus-order-conflict";
    readonly description = "Detects problematic tabindex usage that creates confusing focus order";
    analyze(context: AnalyzerContext): Issue[];
    private getTabIndex;
}
//# sourceMappingURL=FocusOrderConflictAnalyzer.d.ts.map