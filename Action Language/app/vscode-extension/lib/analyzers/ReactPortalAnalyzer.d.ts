import { Issue } from '../models/BaseModel';
import { PortalUsage } from '../parsers/ReactPatternDetector';
export interface ReactPortalIssue extends Issue {
    portal: PortalUsage;
    fix: {
        description: string;
        code?: string;
    };
}
export declare class ReactPortalAnalyzer {
    analyze(source: string, sourceFile: string): ReactPortalIssue[];
    private buildMessage;
    private buildFix;
    hasPortal(source: string): boolean;
}
export declare function analyzeReactPortals(source: string, sourceFile: string): ReactPortalIssue[];
//# sourceMappingURL=ReactPortalAnalyzer.d.ts.map