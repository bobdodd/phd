/**
 * CSS Model for Paradise Multi-Model Architecture
 *
 * This file defines the CSSModel interface for representing CSS rules
 * and their impact on accessibility.
 *
 * CSSModel captures:
 * - Selectors and their specificity
 * - Properties that affect accessibility (display, visibility, opacity, outline, etc.)
 * - Focus-related styles (:focus, :focus-visible)
 * - Interactive states (:hover, :active, pointer-events)
 * - Color and contrast properties
 *
 * These rules are linked to DOM elements during the DocumentModel merge process
 * to enable comprehensive visibility and focus analysis.
 */
import { Model, ModelNode, ValidationResult } from './BaseModel';
/**
 * CSS property value
 */
export type CSSPropertyValue = string | number;
/**
 * CSS properties as key-value pairs
 */
export interface CSSProperties {
    [property: string]: CSSPropertyValue;
}
/**
 * CSS rule types
 */
export type CSSRuleType = 'style' | 'media' | 'keyframes' | 'import' | 'font-face';
/**
 * Represents a single CSS rule.
 */
export interface CSSRule extends ModelNode {
    nodeType: 'cssRule';
    /** Rule type */
    ruleType: CSSRuleType;
    /** CSS selector (e.g., ".button", "#submit:focus") */
    selector: string;
    /** CSS properties */
    properties: CSSProperties;
    /** Selector specificity [inline, id, class, element] */
    specificity: [number, number, number, number];
    /** Media query condition (if inside @media) */
    mediaQuery?: string;
    /** Affects focus appearance (:focus, outline, etc.) */
    affectsFocus: boolean;
    /** Affects visibility (display, visibility, opacity, clip) */
    affectsVisibility: boolean;
    /** Affects color/contrast (color, background-color, etc.) */
    affectsContrast: boolean;
    /** Affects interactivity (pointer-events, cursor, user-select) */
    affectsInteraction: boolean;
    /** Contains pseudo-class that affects state (:hover, :active, :focus) */
    hasPseudoClass: boolean;
    /** Pseudo-class type if present */
    pseudoClass?: 'hover' | 'focus' | 'active' | 'focus-visible' | 'focus-within' | 'disabled' | 'checked';
}
/**
 * CSS Model interface.
 *
 * Represents a collection of CSS rules from a stylesheet.
 */
export interface CSSModel extends Model {
    type: 'CSS';
    /** All CSS rules in this model */
    rules: CSSRule[];
    /**
     * Find rules by selector.
     * @param selector - CSS selector to match
     * @returns Matching CSS rules
     */
    findBySelector(selector: string): CSSRule[];
    /**
     * Find rules that affect focus.
     * @returns CSS rules that modify focus appearance
     */
    findFocusRules(): CSSRule[];
    /**
     * Find rules that affect visibility.
     * @returns CSS rules that hide or show elements
     */
    findVisibilityRules(): CSSRule[];
    /**
     * Find rules that affect contrast.
     * @returns CSS rules that modify colors
     */
    findContrastRules(): CSSRule[];
    /**
     * Get matching rules for a DOM element.
     * Considers selector specificity and cascade order.
     *
     * @param element - DOM element with tagName, id, class
     * @returns CSS rules that apply to this element, sorted by specificity
     */
    getMatchingRules(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): CSSRule[];
    /**
     * Check if any rules hide the element.
     * @param element - DOM element
     * @returns True if element is hidden by CSS
     */
    isElementHidden(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): boolean;
    /**
     * Check if element has focus styles defined.
     * @param element - DOM element
     * @returns True if :focus styles are defined
     */
    hasFocusStyles(element: {
        tagName: string;
        attributes: {
            id?: string;
            class?: string;
            [key: string]: string | undefined;
        };
    }): boolean;
}
/**
 * Concrete implementation of CSSModel.
 */
export declare class CSSModelImpl implements CSSModel {
    type: 'CSS';
    version: string;
    sourceFile: string;
    rules: CSSRule[];
    constructor(rules: CSSRule[], sourceFile: string);
    /**
     * Parse CSS source into rules.
     * Note: This is implemented by CSSParser.
     */
    parse(_source: string): ModelNode[];
    /**
     * Validate CSS rules.
     * Currently minimal validation - could be enhanced.
     */
    validate(): ValidationResult;
    /**
     * Serialize back to CSS.
     * Useful for generating fixed stylesheets.
     */
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
    /**
     * Check if a selector matches an element.
     * Simplified matching - handles basic selectors.
     */
    private selectorMatches;
    /**
     * Compare specificity values.
     * Returns: 1 if a > b, -1 if a < b, 0 if equal
     */
    private compareSpecificity;
}
//# sourceMappingURL=CSSModel.d.ts.map