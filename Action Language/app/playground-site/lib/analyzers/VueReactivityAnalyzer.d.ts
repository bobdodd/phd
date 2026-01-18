import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class VueReactivityAnalyzer extends BaseAnalyzer {
    readonly name = "VueReactivityAnalyzer";
    readonly description = "Detects accessibility issues in Vue-specific reactive patterns (v-model, v-on)";
    analyze(context: AnalyzerContext): Issue[];
    private analyzeVModel;
    private analyzeEventHandlers;
    private analyzeFocusManagement;
}
