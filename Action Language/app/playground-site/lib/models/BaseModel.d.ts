export interface SourceLocation {
    file: string;
    line: number;
    column: number;
    length?: number;
}
export interface ModelNode {
    id: string;
    nodeType: string;
    location: SourceLocation;
    metadata: Record<string, any>;
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}
export interface ValidationError {
    message: string;
    location: SourceLocation;
    code: string;
}
export interface ValidationWarning {
    message: string;
    location: SourceLocation;
    code: string;
}
export type ModelType = 'DOM' | 'ActionLanguage' | 'CSS' | 'SwiftUI' | 'Kotlin' | 'AndroidLayout';
export interface Model {
    type: ModelType;
    version: string;
    sourceFile: string;
    parse(source: string): ModelNode[];
    validate(): ValidationResult;
    serialize(): string;
}
export declare class ParseError extends Error {
    readonly location: SourceLocation;
    readonly code: string;
    constructor(message: string, location: SourceLocation, code: string);
}
export declare class ValidationFailedError extends Error {
    readonly errors: ValidationError[];
    constructor(message: string, errors: ValidationError[]);
}
export interface IssueConfidence {
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
    treeCompleteness: number;
}
export interface Issue {
    type: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    confidence: IssueConfidence;
    locations: SourceLocation[];
    element?: any;
    wcagCriteria?: string[];
    fix?: any;
}
