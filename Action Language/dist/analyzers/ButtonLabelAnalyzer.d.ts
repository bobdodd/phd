import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
export declare class ButtonLabelAnalyzer extends BaseAnalyzer {
    readonly name = "ButtonLabelAnalyzer";
    readonly description = "Detects buttons without accessible labels or proper labeling";
    analyze(context: AnalyzerContext): Issue[];
    private findButtonElements;
    private checkButtonLabel;
    private getAccessibleName;
    private getTextContent;
    private getChildElements;
    private isHidden;
    private isIconOnlyButton;
    private reportEmptyButton;
    private checkIconOnlyButtonLabel;
    private checkNestedInteractiveElements;
    private isInteractiveElement;
    private checkImageButtonAltText;
    private generateButtonLabelFix;
    private generateIconButtonLabelFix;
    private getOtherAttributes;
}
