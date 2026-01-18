import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class MissingAriaConnectionAnalyzer extends BaseAnalyzer {
    readonly name = "missing-aria-connection";
    readonly description = "Detects ARIA attributes that reference non-existent elements";
    private readonly ARIA_REFERENCE_ATTRIBUTES;
    analyze(context: AnalyzerContext): Issue[];
    private createMessage;
}
