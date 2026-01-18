import { DOMModel, DOMElement } from './DOMModel';
import { ActionLanguageModel, ActionLanguageNode } from './ActionLanguageModel';
import { CSSModel } from './CSSModel';
export type AnalysisScope = 'file' | 'workspace' | 'page';
export interface ElementContext {
    element: DOMElement;
    jsHandlers: ActionLanguageNode[];
    cssRules: any[];
    focusable: boolean;
    interactive: boolean;
    hasClickHandler: boolean;
    hasKeyboardHandler: boolean;
    role: string | null;
    label: string | null;
}
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
    merge(): void;
    private buildSelectors;
    getElementContext(element: DOMElement): ElementContext;
    private isFocusable;
    private getRole;
    private getLabel;
    getInteractiveElements(): ElementContext[];
    getElementsWithIssues(): ElementContext[];
    getFragmentCount(): number;
    getTreeCompleteness(): number;
    getElementById(id: string): DOMElement | null;
    querySelector(selector: string): DOMElement | null;
    querySelectorAll(selector: string): DOMElement[];
    getAllElements(): DOMElement[];
    isFragmentComplete(fragmentId: string): boolean;
}
export interface SourceCollection {
    html?: string;
    javascript: string[];
    css: string[];
    sourceFiles: {
        html?: string;
        javascript: string[];
        css: string[];
    };
}
export declare class DocumentModelBuilder {
    build(sources: SourceCollection, scope: AnalysisScope): DocumentModel;
}
