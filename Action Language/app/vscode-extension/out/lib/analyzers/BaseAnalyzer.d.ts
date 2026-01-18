import { DocumentModel, ElementContext } from '../models/DocumentModel';
import { ActionLanguageModel } from '../models/ActionLanguageModel';
import { SourceLocation } from '../models/BaseModel';
export type AnalysisScope = 'file' | 'workspace' | 'page';
export interface AnalyzerContext {
    documentModel?: DocumentModel;
    actionLanguageModel?: ActionLanguageModel;
    scope: AnalysisScope;
}
export type IssueSeverity = 'error' | 'warning' | 'info';
export interface IssueConfidence {
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
    scope: 'file' | 'page' | 'workspace';
}
export interface Issue {
    type: string;
    severity: IssueSeverity;
    wcagCriteria: string[];
    message: string;
    confidence: IssueConfidence;
    location: SourceLocation;
    relatedLocations?: SourceLocation[];
    elementContext?: ElementContext;
    fix?: IssueFix;
}
export interface IssueFix {
    description: string;
    code: string;
    location: SourceLocation;
}
export declare abstract class BaseAnalyzer {
    abstract readonly name: string;
    abstract readonly description: string;
    abstract analyze(context: AnalyzerContext): Issue[];
    protected supportsDocumentModel(context: AnalyzerContext): boolean;
    protected isFileScopeOnly(context: AnalyzerContext): boolean;
    protected getInteractiveElements(context: AnalyzerContext): ElementContext[];
    protected getElementsWithIssues(context: AnalyzerContext): ElementContext[];
    protected createIssue(type: string, severity: IssueSeverity, message: string, location: SourceLocation, wcagCriteria: string[], context: AnalyzerContext, options?: {
        relatedLocations?: SourceLocation[];
        elementContext?: ElementContext;
        fix?: IssueFix;
    }): Issue;
    private computeConfidence;
}
