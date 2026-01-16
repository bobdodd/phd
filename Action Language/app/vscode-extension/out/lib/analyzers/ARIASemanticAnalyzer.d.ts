import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
/**
 * ARIASemanticAnalyzer
 *
 * Detects 8 types of ARIA semantic issues:
 * 1. invalid-role - Using a role that doesn't exist in ARIA spec
 * 2. interactive-role-static - Interactive role without event handler
 * 3. aria-expanded-static - aria-expanded set but never updated
 * 4. dialog-missing-label - Dialog without aria-label/aria-labelledby
 * 5. missing-required-aria - Role requires specific ARIA attributes
 * 6. assertive-live-region - aria-live="assertive" overuse
 * 7. aria-hidden-true - aria-hidden on interactive elements
 * 8. aria-label-overuse - aria-label overriding visible text
 *
 * WCAG: 4.1.2, 4.1.3, 2.5.3, 2.1.1
 */
export declare class ARIASemanticAnalyzer extends BaseAnalyzer {
    readonly name = "ARIASemanticAnalyzer";
    readonly description = "Detects 8 types of ARIA semantic issues including invalid roles, missing required attributes, and static aria-expanded values";
    private readonly validRoles;
    private readonly interactiveRoles;
    private readonly requiredAttributes;
    analyze(context: AnalyzerContext): Issue[];
    /**
     * Issue 1: invalid-role
     * Detects usage of roles that don't exist in ARIA spec
     */
    private detectInvalidRole;
    /**
     * Issue 2: interactive-role-static
     * Detects interactive roles without event handlers
     */
    private detectInteractiveRoleStatic;
    /**
     * Issue 3: aria-expanded-static
     * Detects aria-expanded that is set but never updated
     */
    private detectAriaExpandedStatic;
    /**
     * Issue 4: dialog-missing-label
     * Detects dialog/alertdialog without accessible label
     */
    private detectDialogMissingLabel;
    /**
     * Issue 5: missing-required-aria
     * Detects roles missing required ARIA attributes
     */
    private detectMissingRequiredAria;
    /**
     * Issue 6: assertive-live-region
     * Detects aria-live="assertive" which should be used sparingly
     */
    private detectAssertiveLiveRegion;
    /**
     * Issue 7: aria-hidden-true
     * Detects aria-hidden="true" on focusable/interactive elements
     */
    private detectAriaHiddenTrue;
    /**
     * Issue 8: aria-label-overuse
     * Detects aria-label potentially overriding visible text
     */
    private detectAriaLabelOveruse;
    private getElementKey;
    private getSimilarRoles;
    private getExpectedHandlers;
}
//# sourceMappingURL=ARIASemanticAnalyzer.d.ts.map