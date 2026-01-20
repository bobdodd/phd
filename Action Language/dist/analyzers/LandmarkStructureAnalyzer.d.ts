import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class LandmarkStructureAnalyzer extends BaseAnalyzer {
    readonly name = "LandmarkStructureAnalyzer";
    readonly description = "Detects accessibility issues with landmark regions and page structure";
    analyze(context: AnalyzerContext): Issue[];
    private extractLandmarks;
    private getImplicitRole;
    private isNestedInSectioningContent;
    private getAccessibleName;
    private getElementText;
    private groupLandmarksByType;
    private getLandmarkTypeName;
    private checkLandmarkNesting;
    private isElementHidden;
    private getElementContext;
    private getElementHTML;
    private getElementHTMLWithoutRole;
}
