"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSModelImpl = void 0;
class CSSModelImpl {
    constructor(rules, sourceFile) {
        this.type = 'CSS';
        this.version = '1.0.0';
        this.rules = rules;
        this.sourceFile = sourceFile;
    }
    parse(_source) {
        throw new Error('CSSModelImpl.parse() should not be called directly. Use CSSParser.');
    }
    validate() {
        return {
            valid: true,
            errors: [],
            warnings: [],
        };
    }
    serialize() {
        return this.rules
            .map((rule) => this.serializeRule(rule))
            .join('\n\n');
    }
    serializeRule(rule) {
        if (rule.ruleType !== 'style') {
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
        return matching.sort((a, b) => this.compareSpecificity(b.specificity, a.specificity));
    }
    isElementHidden(element) {
        const rules = this.getMatchingRules(element);
        for (const rule of rules) {
            const { properties } = rule;
            if (properties.display === 'none')
                return true;
            if (properties.visibility === 'hidden')
                return true;
            if (properties.opacity === '0' || properties.opacity === 0)
                return true;
            if (properties.clip === 'rect(0, 0, 0, 0)')
                return true;
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
    selectorMatches(selector, element) {
        const baseSelector = selector.split(':')[0].trim();
        if (baseSelector.startsWith('#')) {
            const id = baseSelector.slice(1);
            return element.attributes.id === id;
        }
        if (baseSelector.startsWith('.')) {
            const className = baseSelector.slice(1);
            const classes = (element.attributes.class || '').split(/\s+/);
            return classes.includes(className);
        }
        return element.tagName.toLowerCase() === baseSelector.toLowerCase();
    }
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
exports.CSSModelImpl = CSSModelImpl;
