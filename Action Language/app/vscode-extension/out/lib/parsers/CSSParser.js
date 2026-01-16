"use strict";
/**
 * CSS Parser for Paradise
 *
 * Parses CSS stylesheets and extracts rules with accessibility impact.
 * Uses css-tree for robust CSS parsing.
 *
 * Key features:
 * - Parses CSS to AST and transforms to CSSModel
 * - Calculates selector specificity
 * - Identifies accessibility-relevant properties
 * - Detects pseudo-classes (:focus, :hover, etc.)
 * - Handles @media queries
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSParser = void 0;
const csstree = __importStar(require("css-tree"));
const CSSModel_1 = require("../models/CSSModel");
/**
 * CSS Parser
 *
 * Parses CSS stylesheets into CSSModel.
 */
class CSSParser {
    constructor() {
        this.ruleCounter = 0;
    }
    /**
     * Parse CSS source into CSSModel.
     *
     * @param source - CSS source code
     * @param sourceFile - Filename for error reporting
     * @returns CSSModel
     *
     * @example
     * ```typescript
     * const parser = new CSSParser();
     * const model = parser.parse(`
     *   .button:focus {
     *     outline: 2px solid blue;
     *   }
     * `, 'styles.css');
     * ```
     */
    parse(source, sourceFile) {
        const rules = [];
        try {
            const ast = csstree.parse(source, {
                positions: true,
                filename: sourceFile,
            });
            // Walk the AST and extract rules
            csstree.walk(ast, {
                visit: 'Rule',
                enter: (node) => {
                    const rule = this.extractRule(node, sourceFile);
                    if (rule) {
                        rules.push(rule);
                    }
                },
            });
        }
        catch (error) {
            console.error(`CSS parsing error in ${sourceFile}:`, error);
            // Return empty model on parse error
        }
        return new CSSModel_1.CSSModelImpl(rules, sourceFile);
    }
    /**
     * Extract a CSS rule from AST node.
     */
    extractRule(node, sourceFile) {
        if (!node.prelude || !node.block)
            return null;
        // Extract selector
        const selector = csstree.generate(node.prelude);
        // Extract properties
        const properties = this.extractProperties(node.block);
        // Calculate specificity
        const specificity = this.calculateSpecificity(selector);
        // Detect pseudo-classes
        const pseudoClass = this.detectPseudoClass(selector);
        // Analyze accessibility impact
        const impact = this.analyzeAccessibilityImpact(properties, pseudoClass);
        return {
            id: this.generateId(),
            nodeType: 'cssRule',
            ruleType: 'style',
            selector,
            properties,
            specificity,
            location: this.extractLocation(node, sourceFile),
            metadata: {
                pseudoClass,
            },
            ...impact,
        };
    }
    /**
     * Extract properties from CSS block.
     */
    extractProperties(block) {
        const properties = {};
        if (!block.children)
            return properties;
        block.children.forEach((child) => {
            if (child.type === 'Declaration') {
                const property = child.property;
                const value = csstree.generate(child.value);
                properties[property] = value;
            }
        });
        return properties;
    }
    /**
     * Calculate CSS selector specificity.
     * Returns [inline, id, class, element] where higher is more specific.
     *
     * Examples:
     * - "button" → [0, 0, 0, 1]
     * - ".btn" → [0, 0, 1, 0]
     * - "#submit" → [0, 1, 0, 0]
     * - "button.btn:focus" → [0, 0, 2, 1]
     * - "#submit.primary:hover" → [0, 1, 2, 0]
     */
    calculateSpecificity(selector) {
        let inline = 0;
        let id = 0;
        let classLike = 0; // classes, attributes, pseudo-classes
        let element = 0;
        // Remove spaces and normalize
        const normalized = selector.replace(/\s+/g, '');
        // Count IDs (#)
        id = (normalized.match(/#[a-zA-Z][\w-]*/g) || []).length;
        // Count classes (.)
        classLike += (normalized.match(/\.[a-zA-Z][\w-]*/g) || []).length;
        // Count attributes ([...])
        classLike += (normalized.match(/\[[^\]]+\]/g) || []).length;
        // Count pseudo-classes (:hover, :focus, but not ::before)
        const pseudoClasses = normalized.match(/:[^:][a-zA-Z-]+/g) || [];
        classLike += pseudoClasses.length;
        // Count elements (tags)
        // Remove IDs, classes, and pseudo-elements first
        const withoutIdClassPseudo = normalized
            .replace(/#[a-zA-Z][\w-]*/g, '')
            .replace(/\.[a-zA-Z][\w-]*/g, '')
            .replace(/:[^:][a-zA-Z-]+/g, '')
            .replace(/::[a-zA-Z-]+/g, '')
            .replace(/\[[^\]]+\]/g, '');
        // Count remaining tag names
        const elements = withoutIdClassPseudo.match(/[a-zA-Z][\w-]*/g) || [];
        element = elements.length;
        return [inline, id, classLike, element];
    }
    /**
     * Detect pseudo-class in selector.
     */
    detectPseudoClass(selector) {
        if (selector.includes(':focus-visible'))
            return 'focus-visible';
        if (selector.includes(':focus-within'))
            return 'focus-within';
        if (selector.includes(':focus'))
            return 'focus';
        if (selector.includes(':hover'))
            return 'hover';
        if (selector.includes(':active'))
            return 'active';
        if (selector.includes(':disabled'))
            return 'disabled';
        if (selector.includes(':checked'))
            return 'checked';
        return undefined;
    }
    /**
     * Analyze accessibility impact of CSS properties.
     */
    analyzeAccessibilityImpact(properties, pseudoClass) {
        const focusProperties = [
            'outline',
            'outline-width',
            'outline-style',
            'outline-color',
            'outline-offset',
            'border',
            'box-shadow',
        ];
        const visibilityProperties = [
            'display',
            'visibility',
            'opacity',
            'clip',
            'clip-path',
            'position',
            'left',
            'right',
            'top',
            'bottom',
            'width',
            'height',
            'overflow',
            'z-index',
        ];
        const contrastProperties = [
            'color',
            'background',
            'background-color',
            'border-color',
            'text-shadow',
        ];
        const interactionProperties = [
            'pointer-events',
            'cursor',
            'user-select',
            'touch-action',
        ];
        const propertyKeys = Object.keys(properties);
        return {
            affectsFocus: pseudoClass === 'focus' ||
                pseudoClass === 'focus-visible' ||
                propertyKeys.some((key) => focusProperties.includes(key)),
            affectsVisibility: propertyKeys.some((key) => visibilityProperties.includes(key)),
            affectsContrast: propertyKeys.some((key) => contrastProperties.includes(key)),
            affectsInteraction: propertyKeys.some((key) => interactionProperties.includes(key)),
            hasPseudoClass: pseudoClass !== undefined,
            pseudoClass,
        };
    }
    /**
     * Extract source location from CSS AST node.
     */
    extractLocation(node, sourceFile) {
        if (node.loc) {
            return {
                file: sourceFile,
                line: node.loc.start.line,
                column: node.loc.start.column,
                length: node.loc.end.offset - node.loc.start.offset,
            };
        }
        return {
            file: sourceFile,
            line: 0,
            column: 0,
        };
    }
    /**
     * Generate unique ID for a rule.
     */
    generateId() {
        return `css_rule_${++this.ruleCounter}`;
    }
}
exports.CSSParser = CSSParser;
//# sourceMappingURL=CSSParser.js.map