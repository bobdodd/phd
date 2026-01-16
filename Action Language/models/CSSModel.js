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
/**
 * Concrete implementation of CSSModel.
 */
export class CSSModelImpl {
    constructor(rules, sourceFile) {
        this.type = 'CSS';
        this.version = '1.0.0';
        this.rules = rules;
        this.sourceFile = sourceFile;
    }
    /**
     * Parse CSS source into rules.
     * Note: This is implemented by CSSParser.
     */
    parse(_source) {
        throw new Error('CSSModelImpl.parse() should not be called directly. Use CSSParser.');
    }
    /**
     * Validate CSS rules.
     * Currently minimal validation - could be enhanced.
     */
    validate() {
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
    serialize() {
        return this.rules
            .map((rule) => this.serializeRule(rule))
            .join('\n\n');
    }
    serializeRule(rule) {
        if (rule.ruleType !== 'style') {
            // For now, only handle style rules
            return `/* ${rule.ruleType} rule: ${rule.selector} */`;
        }
        const properties = Object.entries(rule.properties)
            .map(([key, value]) => `  ${key}: ${value};`)
            .join('\n');
        return `${rule.selector} {\n${properties}\n}`;
    }
    findBySelector(selector) {
        return this.rules.filter((rule) => rule.selector === selector);
    }
    findFocusRules() {
        return this.rules.filter((rule) => rule.affectsFocus);
    }
    findVisibilityRules() {
        return this.rules.filter((rule) => rule.affectsVisibility);
    }
    findContrastRules() {
        return this.rules.filter((rule) => rule.affectsContrast);
    }
    getMatchingRules(element) {
        const matching = this.rules.filter((rule) => this.selectorMatches(rule.selector, element));
        // Sort by specificity (highest first)
        return matching.sort((a, b) => this.compareSpecificity(b.specificity, a.specificity));
    }
    isElementHidden(element) {
        const rules = this.getMatchingRules(element);
        for (const rule of rules) {
            const { properties } = rule;
            // Check for display: none
            if (properties.display === 'none')
                return true;
            // Check for visibility: hidden
            if (properties.visibility === 'hidden')
                return true;
            // Check for opacity: 0
            if (properties.opacity === '0' || properties.opacity === 0)
                return true;
            // Check for clip/clip-path hiding
            if (properties.clip === 'rect(0, 0, 0, 0)')
                return true;
            // Check for position off-screen
            if ((properties.position === 'absolute' || properties.position === 'fixed') &&
                (properties.left === '-9999px' || properties.left === -9999)) {
                return true;
            }
        }
        return false;
    }
    hasFocusStyles(element) {
        const rules = this.rules.filter((rule) => rule.pseudoClass === 'focus' || rule.pseudoClass === 'focus-visible');
        return rules.some((rule) => this.selectorMatches(rule.selector, element));
    }
    /**
     * Check if a selector matches an element.
     * Simplified matching - handles basic selectors.
     */
    selectorMatches(selector, element) {
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
    compareSpecificity(a, b) {
        for (let i = 0; i < 4; i++) {
            if (a[i] > b[i])
                return 1;
            if (a[i] < b[i])
                return -1;
        }
        return 0;
    }
}
//# sourceMappingURL=CSSModel.js.map