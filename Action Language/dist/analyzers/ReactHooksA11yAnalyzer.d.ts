import { Issue } from '../models/BaseModel';
import { HookUsage, RefUsage, ContextUsage } from '../parsers/ReactPatternDetector';
export interface ReactHooksA11yIssue extends Issue {
    hook?: HookUsage;
    ref?: RefUsage;
    context?: ContextUsage;
    fix: {
        description: string;
        code?: string;
    };
}
export declare class ReactHooksA11yAnalyzer {
    analyze(source: string, sourceFile: string): ReactHooksA11yIssue[];
    private analyzeUseEffectPatterns;
    private analyzeUseRefFocusPatterns;
    private analyzeUseContextPatterns;
    private analyzeUseStateAriaPatterns;
    private containsFocusManagement;
    private hasCleanupFunction;
    private containsEventListener;
    private hasFocusTrapPattern;
    private hasKeyboardHandlerForRef;
    private hasAriaForRef;
    private managesAccessibilityState;
    private hasAriaLiveRegion;
    private isUsedForAriaAttribute;
    private hasProperAriaUpdates;
    private isToggleState;
    private buildUseEffectCleanupFix;
    private buildEventListenerCleanupFix;
    private buildFocusTrapFix;
    private buildFocusAriaFix;
    private buildAriaLiveRegionFix;
    private buildAriaStateFix;
    private buildAriaExpandedFix;
}
export declare function analyzeReactHooksA11y(source: string, sourceFile: string): ReactHooksA11yIssue[];
//# sourceMappingURL=ReactHooksA11yAnalyzer.d.ts.map