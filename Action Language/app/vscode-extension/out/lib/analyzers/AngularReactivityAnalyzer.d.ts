import { Issue } from '../models/BaseModel';
export interface AngularReactivityIssue extends Issue {
    pattern: string;
    directive?: string;
    binding?: string;
    fix: {
        description: string;
        code?: string;
    };
}
export declare class AngularReactivityAnalyzer {
    analyze(source: string, sourceFile: string): AngularReactivityIssue[];
    private analyzeNgModelDirectives;
    private analyzeEventBindings;
    private analyzeVisibilityDirectives;
    private analyzeClassBindings;
    private hasLabelOrAria;
    private hasKeyboardHandler;
    private isVisibilityClass;
}
export declare function analyzeAngularReactivity(source: string, sourceFile: string): AngularReactivityIssue[];
