import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class ReactStopPropagationAnalyzer extends BaseAnalyzer {
    readonly name = "react-stop-propagation";
    readonly description = "Detects event.stopPropagation() usage that can block assistive technology";
    analyze(context: AnalyzerContext): Issue[];
    private createMessage;
    private createFix;
}
