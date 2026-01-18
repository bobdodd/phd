import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class HeadingStructureAnalyzer extends BaseAnalyzer {
    readonly name = "HeadingStructureAnalyzer";
    readonly description = "Detects accessibility issues in heading hierarchy and structure";
    private readonly MAX_HEADING_LENGTH;
    private readonly NEAR_LIMIT_THRESHOLD;
    analyze(context: AnalyzerContext): Issue[];
    private extractHeadings;
    private analyzeH1;
    private analyzeHierarchy;
    private analyzeAriaLevel;
    private getElementText;
    private isElementEmpty;
    private isElementHidden;
}
