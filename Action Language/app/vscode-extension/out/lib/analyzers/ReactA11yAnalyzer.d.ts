import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class ReactA11yAnalyzer extends BaseAnalyzer {
    readonly name = "react-a11y";
    readonly description = "Detects React accessibility issues: useEffect focus management, portals, and event propagation";
    analyze(context: AnalyzerContext): Issue[];
    private analyzeFocusManagement;
    private analyzePortals;
    private analyzeEventPropagation;
    private createPortalMessage;
    private createPortalFix;
    private createPropagationMessage;
    private createPropagationFix;
}
