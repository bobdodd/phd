import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class ARIASemanticAnalyzer extends BaseAnalyzer {
    readonly name = "ARIASemanticAnalyzer";
    readonly description = "Detects 8 types of ARIA semantic issues including invalid roles, missing required attributes, and static aria-expanded values";
    private readonly validRoles;
    private readonly interactiveRoles;
    private readonly requiredAttributes;
    analyze(context: AnalyzerContext): Issue[];
    private detectInvalidRole;
    private detectInteractiveRoleStatic;
    private detectAriaExpandedStatic;
    private detectDialogMissingLabel;
    private detectMissingRequiredAria;
    private detectAssertiveLiveRegion;
    private detectAriaHiddenTrue;
    private detectAriaLabelOveruse;
    private getElementKey;
    private getSimilarRoles;
    private getExpectedHandlers;
}
//# sourceMappingURL=ARIASemanticAnalyzer.d.ts.map