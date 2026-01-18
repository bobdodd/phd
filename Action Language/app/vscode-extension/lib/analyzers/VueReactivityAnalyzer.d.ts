import { Issue } from '../models/BaseModel';
export interface VueReactivityIssue extends Issue {
    pattern: 'v-model' | 'v-on' | 'v-show' | 'v-if' | 'v-bind:class' | 'ref';
    directive?: string;
    fix: {
        description: string;
        code?: string;
    };
}
export declare class VueReactivityAnalyzer {
    analyze(source: string, sourceFile: string): VueReactivityIssue[];
    private analyzeModelDirectives;
    private analyzeEventHandlers;
    private analyzeVisibilityDirectives;
    private analyzeClassBindings;
    private analyzeRefFocusManagement;
    private hasLabelOrAria;
    private isInteractiveElement;
    private hasAriaExpandedInParent;
}
export declare function analyzeVueReactivity(source: string, sourceFile: string): VueReactivityIssue[];
//# sourceMappingURL=VueReactivityAnalyzer.d.ts.map