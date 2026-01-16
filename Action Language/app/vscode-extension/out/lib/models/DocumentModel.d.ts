/**
 * Document Model - Integration Layer
 *
 * This is the central integration layer that merges all models together:
 * - DOMModel: HTML/JSX structure
 * - ActionLanguageModel: JavaScript behaviors
 * - CSSModel: Styling rules (future)
 *
 * The DocumentModel:
 * 1. Takes all three models as input
 * 2. Resolves element references via CSS selectors
 * 3. Attaches JavaScript handlers to DOM elements
 * 4. Attaches CSS rules to DOM elements
 * 5. Generates element context for accessibility analysis
 *
 * This enables cross-file analysis and eliminates false positives
 * when handlers are split across multiple files.
 */
import { DOMModel, DOMElement } from './DOMModel';
import { ActionLanguageModel, ActionLanguageNode } from './ActionLanguageModel';
import { CSSModel } from './CSSModel';
/**
 * Analysis scope determines what files are included.
 */
export type AnalysisScope = 'file' | 'workspace' | 'page';
/**
 * Element context for accessibility analysis.
 * Combines information from all models for a single element.
 */
export interface ElementContext {
    /** The DOM element */
    element: DOMElement;
    /** JavaScript event handlers attached to this element */
    jsHandlers: ActionLanguageNode[];
    /** CSS rules that apply to this element (future) */
    cssRules: any[];
    /** Is this element focusable? */
    focusable: boolean;
    /** Is this element interactive (has handlers)? */
    interactive: boolean;
    /** Does this element have a click handler? */
    hasClickHandler: boolean;
    /** Does this element have a keyboard handler? */
    hasKeyboardHandler: boolean;
    /** ARIA role (explicit or implicit) */
    role: string | null;
    /** ARIA label (computed) */
    label: string | null;
}
/**
 * Document Model - Integration Layer
 *
 * Merges DOMModel, ActionLanguageModel, and CSSModel to enable
 * comprehensive accessibility analysis.
 *
 * UPDATED: Now supports multiple DOM fragments for confidence scoring.
 * - dom?: DOMModel[] (was dom?: DOMModel) - supports disconnected fragments
 * - Tracks tree completeness for confidence scoring
 * - Handles incomplete/sparse trees during development
 */
export declare class DocumentModel {
    scope: AnalysisScope;
    dom?: DOMModel[];
    javascript: ActionLanguageModel[];
    css: CSSModel[];
    constructor(options: {
        scope: AnalysisScope;
        dom?: DOMModel | DOMModel[];
        javascript: ActionLanguageModel[];
        css?: CSSModel[];
    });
    /**
     * Merge all models and resolve cross-references.
     * This is the key integration step that links JavaScript behaviors
     * and CSS rules to DOM elements via CSS selectors.
     *
     * UPDATED: Now iterates over all DOM fragments.
     */
    merge(): void;
    /**
     * Build CSS selectors for an element.
     * Returns all possible selectors that could match this element:
     * - ID selector (#submit)
     * - Class selectors (.btn, .primary)
     * - Tag selector (button)
     * - Role selector ([role="button"])
     */
    private buildSelectors;
    /**
     * Get element context for accessibility analysis.
     * Combines information from all models for a single element.
     */
    getElementContext(element: DOMElement): ElementContext;
    /**
     * Check if an element is focusable.
     */
    private isFocusable;
    /**
     * Get the ARIA role (explicit or implicit).
     */
    private getRole;
    /**
     * Get the accessible label for an element.
     */
    private getLabel;
    /**
     * Get all interactive elements in the document.
     * UPDATED: Works with multiple fragments.
     */
    getInteractiveElements(): ElementContext[];
    /**
     * Get all elements with accessibility issues.
     * This is a convenience method for analyzers.
     */
    getElementsWithIssues(): ElementContext[];
    /**
     * NEW: Get the number of DOM fragments.
     * Used for confidence scoring - more fragments means lower confidence.
     */
    getFragmentCount(): number;
    /**
     * NEW: Calculate tree completeness score (0.0 to 1.0).
     *
     * Completeness heuristics:
     * - Single fragment: Higher completeness (0.7 base)
     * - Multiple fragments: Lower completeness (0.3 base)
     * - Resolved references: Increase completeness
     * - Unresolved references: Decrease completeness
     *
     * Returns:
     * - 1.0: Complete single tree with all references resolved
     * - 0.5-0.9: Partial tree or some fragments
     * - 0.0-0.5: Many disconnected fragments
     */
    getTreeCompleteness(): number;
    /**
     * Query element by ID across all fragments.
     * Convenience method for backward compatibility and easier testing.
     *
     * @param id - Element ID to search for
     * @returns First matching element or null
     */
    getElementById(id: string): DOMElement | null;
    /**
     * Query first matching element by selector across all fragments.
     * Matches DOM API: returns single element or null.
     *
     * @param selector - CSS selector
     * @returns First matching element or null
     */
    querySelector(selector: string): DOMElement | null;
    /**
     * Query all matching elements by selector across all fragments.
     * Matches DOM API: returns array of all matching elements.
     *
     * @param selector - CSS selector
     * @returns Array of matching elements
     */
    querySelectorAll(selector: string): DOMElement[];
    /**
     * Get all elements across all fragments.
     * Convenience method for analyzers.
     *
     * @returns Array of all elements
     */
    getAllElements(): DOMElement[];
    /**
     * NEW: Check if a specific fragment is complete.
     * A fragment is considered complete if it has a clear root element
     * and all internal references resolve within the fragment.
     *
     * @param fragmentId - Index of the fragment to check
     * @returns true if fragment appears complete
     */
    isFragmentComplete(fragmentId: string): boolean;
}
/**
 * Source collection for building a DocumentModel.
 */
export interface SourceCollection {
    /** HTML/JSX source (optional for JS-only analysis) */
    html?: string;
    /** JavaScript/TypeScript source files */
    javascript: string[];
    /** CSS source files (future) */
    css: string[];
    /** Source file paths for error reporting */
    sourceFiles: {
        html?: string;
        javascript: string[];
        css: string[];
    };
}
/**
 * Document Model Builder
 *
 * Builds a DocumentModel from source code files.
 */
export declare class DocumentModelBuilder {
    /**
     * Build a DocumentModel from source files.
     *
     * @param sources - Source code files
     * @param scope - Analysis scope
     * @returns DocumentModel with merged models
     *
     * @example
     * ```typescript
     * const sources = {
     *   html: '<button id="submit">Submit</button>',
     *   javascript: ['document.getElementById("submit").addEventListener("click", handler);'],
     *   css: [],
     *   sourceFiles: {
     *     html: 'index.html',
     *     javascript: ['handlers.js'],
     *     css: []
     *   }
     * };
     *
     * const builder = new DocumentModelBuilder();
     * const documentModel = builder.build(sources, 'page');
     *
     * // Now analyze for accessibility issues
     * const issues = documentModel.getElementsWithIssues();
     * ```
     */
    build(sources: SourceCollection, scope: AnalysisScope): DocumentModel;
}
//# sourceMappingURL=DocumentModel.d.ts.map