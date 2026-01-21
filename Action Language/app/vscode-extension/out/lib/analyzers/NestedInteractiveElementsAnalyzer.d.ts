import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
export declare class NestedInteractiveElementsAnalyzer extends BaseAnalyzer {
    readonly name = "NestedInteractiveElementsAnalyzer";
    readonly description = "Detects nested interactive elements that create focus conflicts and broken keyboard navigation";
    private readonly INTERACTIVE_ELEMENTS;
    private readonly INTERACTIVE_ROLES;
    analyze(context: AnalyzerContext): Issue[];
    private isInteractive;
    private checkForNestedInteractive;
    private reportNestedInteractive;
    private getSeverity;
    private getIssueType;
    private getInteractiveType;
    private getElementName;
    private getSimpleTextContent;
    private getFixDescription;
    private getFixCode;
    private getDescendants;
}
