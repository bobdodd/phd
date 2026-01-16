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

import {
  Model,
  ModelNode,
  ValidationResult,
} from './BaseModel';

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
export type CSSRuleType =
  | 'style'      // Normal style rule
  | 'media'      // @media query
  | 'keyframes'  // @keyframes animation
  | 'import'     // @import
  | 'font-face'; // @font-face

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

  // Accessibility impact flags (computed during parsing)

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
    attributes: { id?: string; class?: string; [key: string]: string | undefined };
  }): CSSRule[];

  /**
   * Check if any rules hide the element.
   * @param element - DOM element
   * @returns True if element is hidden by CSS
   */
  isElementHidden(element: {
    tagName: string;
    attributes: { id?: string; class?: string; [key: string]: string | undefined };
  }): boolean;

  /**
   * Check if element has focus styles defined.
   * @param element - DOM element
   * @returns True if :focus styles are defined
   */
  hasFocusStyles(element: {
    tagName: string;
    attributes: { id?: string; class?: string; [key: string]: string | undefined };
  }): boolean;
}

/**
 * Concrete implementation of CSSModel.
 */
export class CSSModelImpl implements CSSModel {
  type: 'CSS' = 'CSS';
  version = '1.0.0';
  sourceFile: string;
  rules: CSSRule[];

  constructor(rules: CSSRule[], sourceFile: string) {
    this.rules = rules;
    this.sourceFile = sourceFile;
  }

  /**
   * Parse CSS source into rules.
   * Note: This is implemented by CSSParser.
   */
  parse(_source: string): ModelNode[] {
    throw new Error(
      'CSSModelImpl.parse() should not be called directly. Use CSSParser.'
    );
  }

  /**
   * Validate CSS rules.
   * Currently minimal validation - could be enhanced.
   */
  validate(): ValidationResult {
    return {
      valid: true,
      errors: [],
      warnings: [],
    };
  }

  /**
   * Serialize back to CSS.
   * Useful for generating fixed stylesheets.
   */
  serialize(): string {
    return this.rules
      .map((rule) => this.serializeRule(rule))
      .join('\n\n');
  }

  private serializeRule(rule: CSSRule): string {
    if (rule.ruleType !== 'style') {
      // For now, only handle style rules
      return `/* ${rule.ruleType} rule: ${rule.selector} */`;
    }

    const properties = Object.entries(rule.properties)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');

    return `${rule.selector} {\n${properties}\n}`;
  }

  findBySelector(selector: string): CSSRule[] {
    return this.rules.filter((rule) => rule.selector === selector);
  }

  findFocusRules(): CSSRule[] {
    return this.rules.filter((rule) => rule.affectsFocus);
  }

  findVisibilityRules(): CSSRule[] {
    return this.rules.filter((rule) => rule.affectsVisibility);
  }

  findContrastRules(): CSSRule[] {
    return this.rules.filter((rule) => rule.affectsContrast);
  }

  getMatchingRules(element: {
    tagName: string;
    attributes: { id?: string; class?: string; [key: string]: string | undefined };
  }): CSSRule[] {
    const matching = this.rules.filter((rule) =>
      this.selectorMatches(rule.selector, element)
    );

    // Sort by specificity (highest first)
    return matching.sort((a, b) => this.compareSpecificity(b.specificity, a.specificity));
  }

  isElementHidden(element: {
    tagName: string;
    attributes: { id?: string; class?: string; [key: string]: string | undefined };
  }): boolean {
    const rules = this.getMatchingRules(element);

    for (const rule of rules) {
      const { properties } = rule;

      // Check for display: none
      if (properties.display === 'none') return true;

      // Check for visibility: hidden
      if (properties.visibility === 'hidden') return true;

      // Check for opacity: 0
      if (properties.opacity === '0' || properties.opacity === 0) return true;

      // Check for clip/clip-path hiding
      if (properties.clip === 'rect(0, 0, 0, 0)') return true;

      // Check for position off-screen
      if (
        (properties.position === 'absolute' || properties.position === 'fixed') &&
        (properties.left === '-9999px' || properties.left === -9999)
      ) {
        return true;
      }
    }

    return false;
  }

  hasFocusStyles(element: {
    tagName: string;
    attributes: { id?: string; class?: string; [key: string]: string | undefined };
  }): boolean {
    const rules = this.rules.filter((rule) =>
      rule.pseudoClass === 'focus' || rule.pseudoClass === 'focus-visible'
    );

    return rules.some((rule) => this.selectorMatches(rule.selector, element));
  }

  /**
   * Check if a selector matches an element.
   * Simplified matching - handles basic selectors.
   */
  private selectorMatches(
    selector: string,
    element: { tagName: string; attributes: { id?: string; class?: string } }
  ): boolean {
    // Remove pseudo-classes for matching
    const baseSelector = selector.split(':')[0].trim();

    // ID selector: #submit
    if (baseSelector.startsWith('#')) {
      const id = baseSelector.slice(1);
      return element.attributes.id === id;
    }

    // Class selector: .button
    if (baseSelector.startsWith('.')) {
      const className = baseSelector.slice(1);
      const classes = (element.attributes.class || '').split(/\s+/);
      return classes.includes(className);
    }

    // Tag selector: button
    return element.tagName.toLowerCase() === baseSelector.toLowerCase();
  }

  /**
   * Compare specificity values.
   * Returns: 1 if a > b, -1 if a < b, 0 if equal
   */
  private compareSpecificity(
    a: [number, number, number, number],
    b: [number, number, number, number]
  ): number {
    for (let i = 0; i < 4; i++) {
      if (a[i] > b[i]) return 1;
      if (a[i] < b[i]) return -1;
    }
    return 0;
  }
}
