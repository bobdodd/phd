import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class AutocompleteAnalyzer extends BaseAnalyzer {
    readonly name = "AutocompleteAnalyzer";
    readonly description = "Detects missing or incorrect autocomplete attributes on form inputs";
    private readonly VALID_AUTOCOMPLETE_TOKENS;
    private readonly FIELD_PATTERNS;
    analyze(context: AnalyzerContext): Issue[];
    private detectMissingAutocomplete;
    private validateAutocompleteValue;
    private detectAutocompleteOff;
    private shouldHaveAutocomplete;
    private suggestAutocompleteValue;
    private getFieldIdentifier;
}
