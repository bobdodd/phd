import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class OrphanedEventHandlerAnalyzer extends BaseAnalyzer {
    readonly name = "orphaned-event-handler";
    readonly description = "Detects event handlers that reference non-existent DOM elements";
    analyze(context: AnalyzerContext): Issue[];
    private elementExistsInDOM;
}
//# sourceMappingURL=OrphanedEventHandlerAnalyzer.d.ts.map