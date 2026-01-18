import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class WidgetPatternAnalyzer extends BaseAnalyzer {
    readonly name = "WidgetPatternAnalyzer";
    readonly description = "Validates complete implementation of 21 WAI-ARIA widget patterns (tabs, dialogs, menus, etc.)";
    analyze(context: AnalyzerContext): Issue[];
    private analyzeWidgetPatterns;
    private validateTabsPattern;
    private validateDialogPattern;
    private validateAccordionPattern;
    private validateComboboxPattern;
    private validateMenuPattern;
    private validateTreePattern;
    private validateToolbarPattern;
    private validateGridPattern;
    private validateListboxPattern;
    private validateRadiogroupPattern;
    private validateSliderPattern;
    private validateSpinbuttonPattern;
    private validateSwitchPattern;
    private validateBreadcrumbPattern;
    private validateFeedPattern;
    private validateDisclosurePattern;
    private validateCarouselPattern;
    private validateLinkPattern;
    private validateMeterPattern;
    private validateProgressbarPattern;
    private validateTooltipPattern;
}
