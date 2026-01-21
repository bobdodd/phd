import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class PointerTargetAnalyzer extends BaseAnalyzer {
    readonly name = "PointerTargetAnalyzer";
    readonly description = "Detects interactive elements with insufficient touch target size";
    private readonly MIN_TARGET_SIZE_AAA;
    private readonly MIN_TARGET_SIZE_AA;
    private readonly MIN_SPACING;
    private readonly INTERACTIVE_ELEMENTS;
    private readonly INTERACTIVE_INPUT_TYPES;
    private readonly INTERACTIVE_ROLES;
    analyze(context: AnalyzerContext): Issue[];
    private findInteractiveElements;
    private isInteractiveElement;
    private checkTargetSize;
    private checkAdjacentTargetSpacing;
    private extractDimension;
    private isHidden;
    private isLikelySmallTarget;
    private getElementType;
    private getElementIdentifier;
    private areSiblings;
    private isInlineInteractive;
    private hasAdequateSpacing;
}
