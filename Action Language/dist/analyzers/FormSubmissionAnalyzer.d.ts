import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
export declare class FormSubmissionAnalyzer extends BaseAnalyzer {
    readonly name = "FormSubmissionAnalyzer";
    readonly description = "Detects forms with broken submission mechanisms that prevent keyboard users from submitting";
    analyze(context: AnalyzerContext): Issue[];
    private checkFormSubmission;
    private getFormElements;
    private findSubmitButtons;
    private isHiddenOrDisabled;
    private hasFormSubmitHandler;
    private findClickHandlersOnNonSubmitElements;
    private preventsEnterKey;
    private codesPreventsEnter;
    private getHandlerCode;
}
