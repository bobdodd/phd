import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
export declare class AriaStateManagementAnalyzer extends BaseAnalyzer {
    readonly name = "AriaStateManagementAnalyzer";
    readonly description = "Detects ARIA state attributes that are never updated dynamically, causing screen readers to announce incorrect states";
    analyze(context: AnalyzerContext): Issue[];
    private checkExpandedState;
    private checkSelectedState;
    private checkCheckedState;
    private checkLiveRegionAssertiveness;
    private hasAriaAttributeUpdate;
    private codeUpdatesAriaAttribute;
    private getHandlerCode;
}
