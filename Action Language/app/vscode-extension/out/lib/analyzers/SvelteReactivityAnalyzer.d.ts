import { Issue } from '../models/BaseModel';
export interface SvelteReactivityIssue extends Issue {
    pattern: 'bind' | 'on' | 'reactive-statement' | 'class-directive' | 'store';
    directive?: string;
    fix: {
        description: string;
        code?: string;
    };
}
export declare class SvelteReactivityAnalyzer {
    analyze(source: string, sourceFile: string): SvelteReactivityIssue[];
    private analyzeBindDirectives;
    private analyzeEventHandlers;
    private analyzeClassDirectives;
    private analyzeReactiveStatements;
    private analyzeStoreSubscriptions;
    private hasLabelOrAria;
    private isInFieldset;
    private isInteractiveElement;
    private isVisibilityClass;
    private hasAriaExpandedInParent;
    private extractReactiveStatements;
}
export declare function analyzeSvelteReactivity(source: string, sourceFile: string): SvelteReactivityIssue[];
