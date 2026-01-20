import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class LinkTextAnalyzer extends BaseAnalyzer {
    readonly name = "LinkTextAnalyzer";
    readonly description = "Detects accessibility issues with link text quality and descriptiveness";
    private readonly MAX_LINK_LENGTH;
    analyze(context: AnalyzerContext): Issue[];
    private extractLinks;
    private checkImageOnly;
    private getTextContent;
    private hasAccessibleName;
    private isElementHidden;
    private isGenericLinkText;
    private isUrlText;
    private findDuplicateLinkText;
}
