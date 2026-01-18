import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class SvelteReactivityAnalyzer extends BaseAnalyzer {
    readonly name = "SvelteReactivityAnalyzer";
    readonly description = "Detects accessibility issues in Svelte-specific reactive patterns (bind:, on:, class:)";
    analyze(context: AnalyzerContext): Issue[];
    private analyzeBindDirectives;
    private analyzeEventHandlers;
    private analyzeFocusManagement;
}
