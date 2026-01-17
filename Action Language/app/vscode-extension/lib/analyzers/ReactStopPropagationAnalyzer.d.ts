import { Issue } from '../models/BaseModel';
import { SyntheticEventUsage } from '../parsers/ReactPatternDetector';
export interface ReactStopPropagationIssue extends Issue {
    syntheticEvent: SyntheticEventUsage;
    fix: {
        description: string;
        code?: string;
    };
}
export declare class ReactStopPropagationAnalyzer {
    analyze(source: string, sourceFile: string): ReactStopPropagationIssue[];
    private buildMessage;
    private buildFix;
    hasStopPropagation(source: string): boolean;
}
export declare function analyzeReactStopPropagation(source: string, sourceFile: string): ReactStopPropagationIssue[];
//# sourceMappingURL=ReactStopPropagationAnalyzer.d.ts.map