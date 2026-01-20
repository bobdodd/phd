import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class LanguageAttributeAnalyzer extends BaseAnalyzer {
    readonly name = "LanguageAttributeAnalyzer";
    readonly description = "Detects missing or invalid language attributes on HTML elements";
    analyze(context: AnalyzerContext): Issue[];
    private isValidLanguageCode;
    private addLangAttribute;
    private removeLangAttribute;
}
