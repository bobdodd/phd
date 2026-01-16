/**
 * Base Model Interface for Paradise Multi-Model Architecture
 *
 * This file defines the foundational interfaces for all model types in Paradise.
 * Models represent different aspects of UI code (DOM, ActionLanguage, CSS, etc.)
 * in a unified way that enables cross-model accessibility analysis.
 *
 * Key concepts:
 * - All models share a common interface (Model)
 * - All nodes within models share common properties (ModelNode)
 * - Source locations are preserved for precise error reporting
 * - Models can validate themselves and serialize back to source
 */
/**
 * Represents a location in source code.
 * Used for precise error reporting and navigation.
 */
export interface SourceLocation {
    /** Absolute file path */
    file: string;
    /** Line number (1-indexed) */
    line: number;
    /** Column number (0-indexed) */
    column: number;
    /** Length of the code span (optional) */
    length?: number;
}
/**
 * Base interface for all nodes in any model type.
 * Every node in a model tree (DOM element, ActionLanguage action, CSS rule)
 * implements this interface.
 */
export interface ModelNode {
    /** Unique identifier for this node */
    id: string;
    /** Type of node (element, eventHandler, rule, etc.) */
    nodeType: string;
    /** Source code location where this node was defined */
    location: SourceLocation;
    /** Additional metadata specific to the node type */
    metadata: Record<string, any>;
}
/**
 * Result of model validation.
 * Contains errors (blocking issues) and warnings (suggestions).
 */
export interface ValidationResult {
    /** Whether the model is valid */
    valid: boolean;
    /** Blocking validation errors */
    errors: ValidationError[];
    /** Non-blocking validation warnings */
    warnings: ValidationWarning[];
}
/**
 * A validation error (blocking issue).
 */
export interface ValidationError {
    /** Human-readable error message */
    message: string;
    /** Location of the error in source code */
    location: SourceLocation;
    /** Machine-readable error code */
    code: string;
}
/**
 * A validation warning (non-blocking suggestion).
 */
export interface ValidationWarning {
    /** Human-readable warning message */
    message: string;
    /** Location of the warning in source code */
    location: SourceLocation;
    /** Machine-readable warning code */
    code: string;
}
/**
 * All supported model types in Paradise.
 * - DOM: HTML/XML structure
 * - ActionLanguage: JavaScript/TypeScript UI behaviors
 * - CSS: Styling rules
 * - SwiftUI: Swift UI declarations (future)
 * - Kotlin: Kotlin/Jetpack Compose (future)
 * - AndroidLayout: Android XML layouts (future)
 */
export type ModelType = 'DOM' | 'ActionLanguage' | 'CSS' | 'SwiftUI' | 'Kotlin' | 'AndroidLayout';
/**
 * Base interface that all model types must implement.
 *
 * Models are responsible for:
 * 1. Parsing source code into a structured tree
 * 2. Validating their own structure
 * 3. Serializing back to source code
 */
export interface Model {
    /** The type of this model */
    type: ModelType;
    /** Model schema version (for future compatibility) */
    version: string;
    /** Source file this model was parsed from */
    sourceFile: string;
    /**
     * Parse source code into model nodes.
     * @param source - Source code to parse
     * @returns Array of top-level nodes in the model
     * @throws ParseError if source cannot be parsed
     */
    parse(source: string): ModelNode[];
    /**
     * Validate the model structure.
     * @returns Validation result with errors and warnings
     */
    validate(): ValidationResult;
    /**
     * Serialize the model back to source code.
     * @returns Source code representation of the model
     */
    serialize(): string;
}
/**
 * Error thrown when model parsing fails.
 */
export declare class ParseError extends Error {
    readonly location: SourceLocation;
    readonly code: string;
    constructor(message: string, location: SourceLocation, code: string);
}
/**
 * Error thrown when model validation fails.
 */
export declare class ValidationFailedError extends Error {
    readonly errors: ValidationError[];
    constructor(message: string, errors: ValidationError[]);
}
/**
 * Confidence scoring for issues found in incomplete/fragmented trees.
 *
 * NEW in Sprint 4: Addresses the tree completeness assumption problem.
 * When analyzing sparsely populated trees or disconnected component fragments,
 * Paradise reports confidence levels to avoid false sense of certainty.
 *
 * Confidence Levels:
 * - HIGH (0.9+): Single complete tree, definitive issue
 * - MEDIUM (0.5-0.9): Partial tree or some fragments, likely issue
 * - LOW (0.0-0.5): Many disconnected fragments, uncertain
 */
export interface IssueConfidence {
    /** Confidence level for this issue */
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    /** Human-readable reason for the confidence level */
    reason: string;
    /** Estimated tree completeness (0.0 = empty, 1.0 = complete) */
    treeCompleteness: number;
}
/**
 * Issue structure for analyzer results.
 * Represents a detected accessibility problem with location and confidence info.
 */
export interface Issue {
    /** Issue type identifier (e.g., 'mouse-only-click', 'missing-aria-label') */
    type: string;
    /** Issue severity */
    severity: 'error' | 'warning' | 'info';
    /** Human-readable issue description */
    message: string;
    /** Confidence in this issue (NEW: Sprint 4 confidence scoring) */
    confidence: IssueConfidence;
    /** All relevant source locations (element + handlers) */
    locations: SourceLocation[];
    /** The DOM element involved (if applicable) */
    element?: any;
    /** WCAG success criteria this violates */
    wcagCriteria?: string[];
    /** Suggested fix (if available) */
    fix?: any;
}
//# sourceMappingURL=BaseModel.d.ts.map