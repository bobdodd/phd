import { CSSModelImpl } from '../models/CSSModel';
export declare class CSSParser {
    private ruleCounter;
    parse(source: string, sourceFile: string): CSSModelImpl;
    private extractRule;
    private extractProperties;
    private calculateSpecificity;
    private detectPseudoClass;
    private analyzeAccessibilityImpact;
    private extractLocation;
    private generateId;
}
//# sourceMappingURL=CSSParser.d.ts.map