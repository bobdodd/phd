/**
 * Widget Pattern Analyzer
 *
 * Validates complete implementation of 21 WAI-ARIA Authoring Practices patterns.
 * Ensures ARIA widgets have correct structure, attributes, and keyboard behavior.
 *
 * WCAG Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 * - 2.1.1 Keyboard (Level A)
 * - 4.1.2 Name, Role, Value (Level A)
 *
 * Patterns Validated:
 * 1. Tabs (role="tablist")
 * 2. Dialog/Modal (role="dialog")
 * 3. Accordion/Disclosure (aria-expanded)
 * 4. Combobox (role="combobox")
 * 5. Menu (role="menu")
 * 6. Tree (role="tree")
 * 7. Toolbar (role="toolbar")
 * 8. Grid (role="grid")
 * 9. Listbox (role="listbox")
 * 10. Radiogroup (role="radiogroup")
 * 11. Slider (role="slider")
 * 12. Spinbutton (role="spinbutton")
 * 13. Switch (role="switch")
 * 14. Breadcrumb (navigation breadcrumb)
 * 15. Feed (role="feed")
 * 16. Disclosure (non-button)
 * 17. Carousel (rotation control)
 * 18. Link (role="link" on non-<a>)
 * 19. Meter (role="meter")
 * 20. Progressbar (role="progressbar")
 * 21. Tooltip (role="tooltip")
 */
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
//# sourceMappingURL=WidgetPatternAnalyzer.d.ts.map