"use strict";
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
class CSSParser {
    constructor() {
        this.ruleCounter = 0;
    }
    parse(source, sourceFile) {
        const rules = [];
        try {
            const ast = csstree.parse(source, {
                positions: true,
                filename: sourceFile,
            });
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
        }
        return new CSSModel_1.CSSModelImpl(rules, sourceFile);
    }
    extractRule(node, sourceFile) {
        if (!node.prelude || !node.block)
            return null;
        const selector = csstree.generate(node.prelude);
        const properties = this.extractProperties(node.block);
        const specificity = this.calculateSpecificity(selector);
        const pseudoClass = this.detectPseudoClass(selector);
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
    calculateSpecificity(selector) {
        let inline = 0;
        let id = 0;
        let classLike = 0;
        let element = 0;
        const normalized = selector.replace(/\s+/g, '');
        id = (normalized.match(/#[a-zA-Z][\w-]*/g) || []).length;
        classLike += (normalized.match(/\.[a-zA-Z][\w-]*/g) || []).length;
        classLike += (normalized.match(/\[[^\]]+\]/g) || []).length;
        const pseudoClasses = normalized.match(/:[^:][a-zA-Z-]+/g) || [];
        classLike += pseudoClasses.length;
        const withoutIdClassPseudo = normalized
            .replace(/#[a-zA-Z][\w-]*/g, '')
            .replace(/\.[a-zA-Z][\w-]*/g, '')
            .replace(/:[^:][a-zA-Z-]+/g, '')
            .replace(/::[a-zA-Z-]+/g, '')
            .replace(/\[[^\]]+\]/g, '');
        const elements = withoutIdClassPseudo.match(/[a-zA-Z][\w-]*/g) || [];
        element = elements.length;
        return [inline, id, classLike, element];
    }
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
    generateId() {
        return `css_rule_${++this.ruleCounter}`;
    }
}
exports.CSSParser = CSSParser;
