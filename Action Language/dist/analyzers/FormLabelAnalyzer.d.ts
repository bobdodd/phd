import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class FormLabelAnalyzer extends BaseAnalyzer {
    readonly name = "FormLabelAnalyzer";
    readonly description = "Detects accessibility issues with form input labeling";
    analyze(context: AnalyzerContext): Issue[];
    private extractFormInputs;
    private extractLabels;
    private hasLabelElement;
    private getElementText;
    private isElementHidden;
    private getElementContext;
    private getElementHTML;
}
