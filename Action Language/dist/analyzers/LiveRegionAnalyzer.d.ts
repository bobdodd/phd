import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class LiveRegionAnalyzer extends BaseAnalyzer {
    readonly name = "LiveRegionAnalyzer";
    readonly description = "Detects issues with ARIA live regions that announce dynamic content changes to screen readers";
    private readonly VALID_LIVE_VALUES;
    private readonly IMPLICIT_LIVE_ROLES;
    analyze(context: AnalyzerContext): Issue[];
    private findLiveRegionElements;
    private detectLiveRegionsWithoutUpdates;
    private detectUpdatesWithoutLiveRegion;
    private detectInvalidLiveRegionValues;
    private detectAssertiveOveruse;
    private detectLiveRegionsWithoutLabels;
    private getLiveValue;
    private isElementUpdated;
    private hasLiveRegionAncestor;
}
