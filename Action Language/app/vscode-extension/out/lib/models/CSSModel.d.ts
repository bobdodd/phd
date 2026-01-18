import { Model, ModelNode, ValidationResult } from './BaseModel';
export type CSSPropertyValue = string | number;
export interface CSSProperties {
    [property: string]: CSSPropertyValue;
}
export type CSSRuleType = 'style' | 'media' | 'keyframes' | 'import' | 'font-face';
export interface CSSRule extends ModelNode {
    nodeType: 'cssRule';
    ruleType: CSSRuleType;
    selector: string;
    properties: CSSProperties;
    specificity: [number, number, number, number];
    mediaQuery?: string;
    affectsFocus: boolean;
    affectsVisibility: boolean;
    affectsContrast: boolean;
    affectsInteraction: boolean;
    hasPseudoClass: boolean;
    pseudoClass?: 'hover' | 'focus' | 'active' | 'focus-visible' | 'focus-within' | 'disabled' | 'checked';
}
export interface CSSModel extends Model {
    type: 'CSS';
    rules: CSSRule[];
    findBySelector(selector: string): CSSRule[];
    findFocusRules(): CSSRule[];
    findVisibilityRules(): CSSRule[];
    findContrastRules(): CSSRule[];
    getMatchingRules(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): CSSRule[];
    isElementHidden(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): boolean;
    hasFocusStyles(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): boolean;
}
export declare class CSSModelImpl implements CSSModel {
    type: 'CSS';
    version: string;
    sourceFile: string;
    rules: CSSRule[];
    constructor(rules: CSSRule[], sourceFile: string);
    parse(_source: string): ModelNode[];
    validate(): ValidationResult;
    serialize(): string;
    private serializeRule;
    findBySelector(selector: string): CSSRule[];
    findFocusRules(): CSSRule[];
    findVisibilityRules(): CSSRule[];
    findContrastRules(): CSSRule[];
    getMatchingRules(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): CSSRule[];
    isElementHidden(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): boolean;
    hasFocusStyles(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): boolean;
    private selectorMatches;
    private compareSpecificity;
}
