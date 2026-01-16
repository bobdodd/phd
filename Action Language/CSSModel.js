"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSModelImpl = void 0;
/**
 * Concrete implementation of CSSModel.
 */
var CSSModelImpl = /** @class */ (function () {
    function CSSModelImpl(rules, sourceFile) {
        this.type = 'CSS';
        this.version = '1.0.0';
        this.rules = rules;
        this.sourceFile = sourceFile;
    }
    /**
     * Parse CSS source into rules.
     * Note: This is implemented by CSSParser.
     */
    CSSModelImpl.prototype.parse = function (_source) {
        throw new Error('CSSModelImpl.parse() should not be called directly. Use CSSParser.');
    };
    /**
     * Validate CSS rules.
     * Currently minimal validation - could be enhanced.
     */
    CSSModelImpl.prototype.validate = function () {
        return {
            valid: true,
            errors: [],
            warnings: [],
        };
    };
    /**
     * Serialize back to CSS.
     * Useful for generating fixed stylesheets.
     */
    CSSModelImpl.prototype.serialize = function () {
        var _this = this;
        return this.rules
            .map(function (rule) { return _this.serializeRule(rule); })
            .join('\n\n');
    };
    CSSModelImpl.prototype.serializeRule = function (rule) {
        if (rule.ruleType !== 'style') {
            // For now, only handle style rules
            return "/* ".concat(rule.ruleType, " rule: ").concat(rule.selector, " */");
        }
        var properties = Object.entries(rule.properties)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "  ".concat(key, ": ").concat(value, ";");
        })
            .join('\n');
        return "".concat(rule.selector, " {\n").concat(properties, "\n}");
    };
    CSSModelImpl.prototype.findBySelector = function (selector) {
        return this.rules.filter(function (rule) { return rule.selector === selector; });
    };
    CSSModelImpl.prototype.findFocusRules = function () {
        return this.rules.filter(function (rule) { return rule.affectsFocus; });
    };
    CSSModelImpl.prototype.findVisibilityRules = function () {
        return this.rules.filter(function (rule) { return rule.affectsVisibility; });
    };
    CSSModelImpl.prototype.findContrastRules = function () {
        return this.rules.filter(function (rule) { return rule.affectsContrast; });
    };
    CSSModelImpl.prototype.getMatchingRules = function (element) {
        var _this = this;
        var matching = this.rules.filter(function (rule) {
            return _this.selectorMatches(rule.selector, element);
        });
        // Sort by specificity (highest first)
        return matching.sort(function (a, b) { return _this.compareSpecificity(b.specificity, a.specificity); });
    };
    CSSModelImpl.prototype.isElementHidden = function (element) {
        var rules = this.getMatchingRules(element);
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            var properties = rule.properties;
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
    };
    CSSModelImpl.prototype.hasFocusStyles = function (element) {
        var _this = this;
        var rules = this.rules.filter(function (rule) {
            return rule.pseudoClass === 'focus' || rule.pseudoClass === 'focus-visible';
        });
        return rules.some(function (rule) { return _this.selectorMatches(rule.selector, element); });
    };
    /**
     * Check if a selector matches an element.
     * Simplified matching - handles basic selectors.
     */
    CSSModelImpl.prototype.selectorMatches = function (selector, element) {
        // Remove pseudo-classes for matching
        var baseSelector = selector.split(':')[0].trim();
        // ID selector: #submit
        if (baseSelector.startsWith('#')) {
            var id = baseSelector.slice(1);
            return element.attributes.id === id;
        }
        // Class selector: .button
        if (baseSelector.startsWith('.')) {
            var className = baseSelector.slice(1);
            var classes = (element.attributes.class || '').split(/\s+/);
            return classes.includes(className);
        }
        // Tag selector: button
        return element.tagName.toLowerCase() === baseSelector.toLowerCase();
    };
    /**
     * Compare specificity values.
     * Returns: 1 if a > b, -1 if a < b, 0 if equal
     */
    CSSModelImpl.prototype.compareSpecificity = function (a, b) {
        for (var i = 0; i < 4; i++) {
            if (a[i] > b[i])
                return 1;
            if (a[i] < b[i])
                return -1;
        }
        return 0;
    };
    return CSSModelImpl;
}());
exports.CSSModelImpl = CSSModelImpl;
//# sourceMappingURL=CSSModel.js.map