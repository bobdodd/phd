import { BaseAnalyzer, AnalyzerContext, Issue } from './BaseAnalyzer';
export declare class AngularReactivityAnalyzer extends BaseAnalyzer {
    readonly name = "AngularReactivityAnalyzer";
    readonly description = "Detects accessibility issues in Angular-specific reactive patterns (ngModel, event bindings)";
    analyze(context: AnalyzerContext): Issue[];
    private analyzeNgModel;
    private analyzeEventBindings;
    private analyzeFocusManagement;
}
