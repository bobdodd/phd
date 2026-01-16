"use strict";
/**
 * Tests for CSSModel and CSSParser
 *
 * These tests verify CSS parsing, specificity calculation,
 * accessibility impact detection, and element matching.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CSSParser_1 = require("../../parsers/CSSParser");
describe('CSSParser', () => {
    let parser;
    beforeEach(() => {
        parser = new CSSParser_1.CSSParser();
    });
    describe('Basic CSS Parsing', () => {
        it('should parse simple CSS rule', () => {
            const css = `
        .button {
          color: blue;
          background-color: white;
        }
      `;
            const model = parser.parse(css, 'test.css');
            expect(model.rules).toHaveLength(1);
            expect(model.rules[0].selector).toBe('.button');
            expect(model.rules[0].properties.color).toBe('blue');
            expect(model.rules[0].properties['background-color']).toBe('white');
        });
        it('should parse multiple rules', () => {
            const css = `
        .button { color: blue; }
        #submit { background: red; }
        button { padding: 10px; }
      `;
            const model = parser.parse(css, 'test.css');
            expect(model.rules).toHaveLength(3);
            expect(model.rules.map((r) => r.selector)).toEqual([
                '.button',
                '#submit',
                'button',
            ]);
        });
        it('should handle empty CSS', () => {
            const model = parser.parse('', 'empty.css');
            expect(model.rules).toHaveLength(0);
        });
        it('should handle malformed CSS gracefully', () => {
            const css = `
        .button { color: blue
        // Missing closing brace
      `;
            const model = parser.parse(css, 'bad.css');
            // Should not crash, returns empty model
            expect(Array.isArray(model.rules)).toBe(true);
        });
    });
    describe('Specificity Calculation', () => {
        it('should calculate specificity for element selector', () => {
            const css = `button { color: blue; }`;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].specificity).toEqual([0, 0, 0, 1]);
        });
        it('should calculate specificity for class selector', () => {
            const css = `.button { color: blue; }`;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].specificity).toEqual([0, 0, 1, 0]);
        });
        it('should calculate specificity for ID selector', () => {
            const css = `#submit { color: blue; }`;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].specificity).toEqual([0, 1, 0, 0]);
        });
        it('should calculate specificity for combined selectors', () => {
            const css = `button.primary:hover { color: blue; }`;
            const model = parser.parse(css, 'test.css');
            // button (element) + .primary (class) + :hover (pseudo-class)
            expect(model.rules[0].specificity).toEqual([0, 0, 2, 1]);
        });
        it('should calculate specificity for ID + class + element', () => {
            const css = `#submit.primary:focus { color: blue; }`;
            const model = parser.parse(css, 'test.css');
            // #submit (ID) + .primary (class) + :focus (pseudo-class)
            expect(model.rules[0].specificity).toEqual([0, 1, 2, 0]);
        });
    });
    describe('Pseudo-Class Detection', () => {
        it('should detect :focus pseudo-class', () => {
            const css = `button:focus { outline: 2px solid blue; }`;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].pseudoClass).toBe('focus');
            expect(model.rules[0].hasPseudoClass).toBe(true);
        });
        it('should detect :hover pseudo-class', () => {
            const css = `.link:hover { text-decoration: underline; }`;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].pseudoClass).toBe('hover');
        });
        it('should detect :focus-visible pseudo-class', () => {
            const css = `button:focus-visible { outline: 2px solid blue; }`;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].pseudoClass).toBe('focus-visible');
        });
        it('should detect :active pseudo-class', () => {
            const css = `button:active { transform: scale(0.95); }`;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].pseudoClass).toBe('active');
        });
    });
    describe('Accessibility Impact Detection', () => {
        it('should detect focus-affecting properties', () => {
            const css = `
        button:focus {
          outline: 2px solid blue;
          outline-offset: 2px;
        }
      `;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].affectsFocus).toBe(true);
        });
        it('should detect visibility-affecting properties', () => {
            const css = `
        .hidden {
          display: none;
          visibility: hidden;
        }
      `;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].affectsVisibility).toBe(true);
        });
        it('should detect contrast-affecting properties', () => {
            const css = `
        .text {
          color: #333;
          background-color: #fff;
        }
      `;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].affectsContrast).toBe(true);
        });
        it('should detect interaction-affecting properties', () => {
            const css = `
        .disabled {
          pointer-events: none;
          cursor: not-allowed;
        }
      `;
            const model = parser.parse(css, 'test.css');
            expect(model.rules[0].affectsInteraction).toBe(true);
        });
    });
    describe('Element Matching', () => {
        it('should match rules by ID', () => {
            const css = `
        #submit { color: blue; }
        #cancel { color: red; }
      `;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'button',
                attributes: { id: 'submit' },
            };
            const matching = model.getMatchingRules(element);
            expect(matching).toHaveLength(1);
            expect(matching[0].selector).toBe('#submit');
        });
        it('should match rules by class', () => {
            const css = `
        .button { padding: 10px; }
        .primary { background: blue; }
      `;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'button',
                attributes: { class: 'button primary' },
            };
            const matching = model.getMatchingRules(element);
            expect(matching).toHaveLength(2);
            expect(matching.map((r) => r.selector)).toContain('.button');
            expect(matching.map((r) => r.selector)).toContain('.primary');
        });
        it('should match rules by tag name', () => {
            const css = `button { font-size: 16px; }`;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'button',
                attributes: {},
            };
            const matching = model.getMatchingRules(element);
            expect(matching).toHaveLength(1);
            expect(matching[0].selector).toBe('button');
        });
        it('should sort matching rules by specificity', () => {
            const css = `
        button { color: black; }
        .button { color: blue; }
        #submit { color: red; }
      `;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'button',
                attributes: { id: 'submit', class: 'button' },
            };
            const matching = model.getMatchingRules(element);
            // Should be sorted: #submit (highest), .button, button (lowest)
            expect(matching[0].selector).toBe('#submit');
            expect(matching[1].selector).toBe('.button');
            expect(matching[2].selector).toBe('button');
        });
    });
    describe('Visibility Detection', () => {
        it('should detect display:none', () => {
            const css = `.hidden { display: none; }`;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'div',
                attributes: { class: 'hidden' },
            };
            expect(model.isElementHidden(element)).toBe(true);
        });
        it('should detect visibility:hidden', () => {
            const css = `.invisible { visibility: hidden; }`;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'div',
                attributes: { class: 'invisible' },
            };
            expect(model.isElementHidden(element)).toBe(true);
        });
        it('should detect opacity:0', () => {
            const css = `.transparent { opacity: 0; }`;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'div',
                attributes: { class: 'transparent' },
            };
            expect(model.isElementHidden(element)).toBe(true);
        });
        it('should detect off-screen positioning', () => {
            const css = `
        .sr-only {
          position: absolute;
          left: -9999px;
        }
      `;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'span',
                attributes: { class: 'sr-only' },
            };
            expect(model.isElementHidden(element)).toBe(true);
        });
        it('should return false for visible elements', () => {
            const css = `.visible { display: block; }`;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'div',
                attributes: { class: 'visible' },
            };
            expect(model.isElementHidden(element)).toBe(false);
        });
    });
    describe('Focus Styles Detection', () => {
        it('should detect focus styles', () => {
            const css = `
        button:focus { outline: 2px solid blue; }
      `;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'button',
                attributes: {},
            };
            expect(model.hasFocusStyles(element)).toBe(true);
        });
        it('should detect focus-visible styles', () => {
            const css = `
        button:focus-visible { outline: 2px solid blue; }
      `;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'button',
                attributes: {},
            };
            expect(model.hasFocusStyles(element)).toBe(true);
        });
        it('should return false when no focus styles defined', () => {
            const css = `button { color: blue; }`;
            const model = parser.parse(css, 'test.css');
            const element = {
                tagName: 'button',
                attributes: {},
            };
            expect(model.hasFocusStyles(element)).toBe(false);
        });
    });
    describe('Query Methods', () => {
        it('should find rules by selector', () => {
            const css = `
        .button { color: blue; }
        #submit { background: red; }
      `;
            const model = parser.parse(css, 'test.css');
            const buttonRules = model.findBySelector('.button');
            expect(buttonRules).toHaveLength(1);
            expect(buttonRules[0].selector).toBe('.button');
        });
        it('should find focus rules', () => {
            const css = `
        button:focus { outline: 2px solid blue; }
        .link:hover { color: red; }
        input { padding: 10px; }
      `;
            const model = parser.parse(css, 'test.css');
            const focusRules = model.findFocusRules();
            expect(focusRules).toHaveLength(1);
            expect(focusRules[0].selector).toBe('button:focus');
        });
        it('should find visibility rules', () => {
            const css = `
        .hidden { display: none; }
        .visible { color: blue; }
      `;
            const model = parser.parse(css, 'test.css');
            const visibilityRules = model.findVisibilityRules();
            expect(visibilityRules).toHaveLength(1);
            expect(visibilityRules[0].selector).toBe('.hidden');
        });
        it('should find contrast rules', () => {
            const css = `
        .text { color: black; background-color: white; }
        .border { border-color: gray; }
      `;
            const model = parser.parse(css, 'test.css');
            const contrastRules = model.findContrastRules();
            expect(contrastRules).toHaveLength(2);
        });
    });
});
//# sourceMappingURL=CSSModel.test.js.map