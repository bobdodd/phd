import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class ReactPortalAnalyzer extends BaseAnalyzer {
    readonly name = "react-portal";
    readonly description = "Detects accessibility issues with React portals (focus management, ARIA relationships, keyboard navigation)";
    analyze(context: AnalyzerContext): Issue[];
    private createPortalMessage;
    private createPortalFix;
}
