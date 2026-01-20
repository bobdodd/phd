import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class ModalAccessibilityAnalyzer extends BaseAnalyzer {
    readonly name = "ModalAccessibilityAnalyzer";
    readonly description = "Detects accessibility issues with modal dialogs and focus management";
    analyze(context: AnalyzerContext): Issue[];
    private findModalElements;
    private checkModalStructure;
    private checkModalARIA;
    private checkModalCloseButton;
    private checkEscapeHandler;
    private checkFocusTrap;
    private checkFocusManagement;
    private hasEscapeKeyHandler;
    private hasFocusTrapPattern;
    private hasFocusManagementPattern;
    private getHandlerCode;
    private findDescendants;
    private getTextContent;
    private addRoleAttribute;
    private addAriaAttribute;
}
