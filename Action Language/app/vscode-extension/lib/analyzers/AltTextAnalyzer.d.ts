import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class AltTextAnalyzer extends BaseAnalyzer {
    readonly name = "AltTextAnalyzer";
    readonly description = "Detects accessibility issues with image alt text";
    private readonly MAX_ALT_LENGTH;
    private readonly GENERIC_ALT_TERMS;
    private readonly URL_PATTERN;
    private readonly FILE_PATH_PATTERN;
    private readonly FILE_EXTENSION_PATTERN;
    private readonly HTML_TAG_PATTERN;
    analyze(context: AnalyzerContext): Issue[];
    private extractImages;
    private isElementHidden;
    private getElementContext;
    private getElementHTML;
}
