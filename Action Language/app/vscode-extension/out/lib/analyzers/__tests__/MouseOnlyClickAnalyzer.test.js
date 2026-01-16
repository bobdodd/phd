"use strict";
/**
 * Tests for MouseOnlyClickAnalyzer
 *
 * These tests verify:
 * 1. Document-scope analysis (accurate, no false positives)
 * 2. File-scope analysis (legacy fallback)
 * 3. False positive elimination when handlers are in separate files
 */
Object.defineProperty(exports, "__esModule", { value: true });
const MouseOnlyClickAnalyzer_1 = require("../MouseOnlyClickAnalyzer");
const DocumentModel_1 = require("../../models/DocumentModel");
const JavaScriptParser_1 = require("../../parsers/JavaScriptParser");
describe('MouseOnlyClickAnalyzer', () => {
    let analyzer;
    let builder;
    beforeEach(() => {
        analyzer = new MouseOnlyClickAnalyzer_1.MouseOnlyClickAnalyzer();
        builder = new DocumentModel_1.DocumentModelBuilder();
    });
    describe('Document-Scope Analysis (Accurate)', () => {
        it('should detect button with click but no keyboard handler', () => {
            const sources = {
                html: `
          function App() {
            return <button id="submit">Submit</button>;
          }
        `,
                javascript: [
                    `document.getElementById('submit').addEventListener('click', handleClick);`,
                ],
                css: [],
                sourceFiles: {
                    html: 'App.tsx',
                    javascript: ['handlers.js'],
                    css: [],
                },
            };
            const documentModel = builder.build(sources, 'page');
            const context = {
                documentModel,
                scope: 'page',
            };
            const issues = analyzer.analyze(context);
            expect(issues).toHaveLength(1);
            expect(issues[0].type).toBe('mouse-only-click');
            expect(issues[0].severity).toBe('error');
            expect(issues[0].wcagCriteria).toContain('2.1.1');
            expect(issues[0].message).toContain('has click handler but no keyboard handler');
        });
        it('should NOT flag false positive when handlers are in separate files', () => {
            const sources = {
                html: `
          function Button() {
            return <button id="submit">Submit</button>;
          }
        `,
                javascript: [
                    `document.getElementById('submit').addEventListener('click', handleClick);`,
                    `document.getElementById('submit').addEventListener('keydown', handleKeyDown);`,
                ],
                css: [],
                sourceFiles: {
                    html: 'Button.tsx',
                    javascript: ['click-handlers.js', 'keyboard-handlers.js'],
                    css: [],
                },
            };
            const documentModel = builder.build(sources, 'page');
            const context = {
                documentModel,
                scope: 'page',
            };
            const issues = analyzer.analyze(context);
            // Should be NO issues - both handlers present!
            expect(issues).toHaveLength(0);
        });
        it('should detect div with click handler and no keyboard handler', () => {
            const sources = {
                html: `
          function CustomButton() {
            return <div id="custom-button" role="button">Click me</div>;
          }
        `,
                javascript: [
                    `
          const btn = document.getElementById('custom-button');
          btn.addEventListener('click', handleClick);
        `,
                ],
                css: [],
                sourceFiles: {
                    html: 'CustomButton.tsx',
                    javascript: ['handlers.js'],
                    css: [],
                },
            };
            const documentModel = builder.build(sources, 'page');
            const context = {
                documentModel,
                scope: 'page',
            };
            const issues = analyzer.analyze(context);
            expect(issues).toHaveLength(1);
            expect(issues[0].type).toBe('mouse-only-click');
            expect(issues[0].elementContext?.element.tagName).toBe('div');
        });
        it('should NOT flag element with both click and keyboard handlers', () => {
            const sources = {
                html: `
          function GoodButton() {
            return <button id="good">Good Button</button>;
          }
        `,
                javascript: [
                    `
          const btn = document.getElementById('good');
          btn.addEventListener('click', handleClick);
          btn.addEventListener('keydown', handleKeyDown);
        `,
                ],
                css: [],
                sourceFiles: {
                    html: 'GoodButton.tsx',
                    javascript: ['handlers.js'],
                    css: [],
                },
            };
            const documentModel = builder.build(sources, 'page');
            const context = {
                documentModel,
                scope: 'page',
            };
            const issues = analyzer.analyze(context);
            expect(issues).toHaveLength(0);
        });
        it('should handle JSX inline handlers correctly', () => {
            const sources = {
                html: `
          function BadButton() {
            return <button onClick={handleClick}>Bad</button>;
          }
        `,
                javascript: [],
                css: [],
                sourceFiles: {
                    html: 'BadButton.tsx',
                    javascript: [],
                    css: [],
                },
            };
            const documentModel = builder.build(sources, 'page');
            const context = {
                documentModel,
                scope: 'page',
            };
            const issues = analyzer.analyze(context);
            expect(issues).toHaveLength(1);
            expect(issues[0].type).toBe('mouse-only-click');
        });
        it('should NOT flag JSX with both inline handlers', () => {
            const sources = {
                html: `
          function GoodButton() {
            return <button onClick={handleClick} onKeyDown={handleKeyDown}>Good</button>;
          }
        `,
                javascript: [],
                css: [],
                sourceFiles: {
                    html: 'GoodButton.tsx',
                    javascript: [],
                    css: [],
                },
            };
            const documentModel = builder.build(sources, 'page');
            const context = {
                documentModel,
                scope: 'page',
            };
            const issues = analyzer.analyze(context);
            expect(issues).toHaveLength(0);
        });
        it('should include fix suggestion', () => {
            const sources = {
                html: `
          function App() {
            return <button id="submit">Submit</button>;
          }
        `,
                javascript: [
                    `document.getElementById('submit').addEventListener('click', handleClick);`,
                ],
                css: [],
                sourceFiles: {
                    html: 'App.tsx',
                    javascript: ['handlers.js'],
                    css: [],
                },
            };
            const documentModel = builder.build(sources, 'page');
            const context = {
                documentModel,
                scope: 'page',
            };
            const issues = analyzer.analyze(context);
            expect(issues[0].fix).toBeDefined();
            expect(issues[0].fix.description).toContain('keyboard');
            expect(issues[0].fix.code).toContain('keydown');
            expect(issues[0].fix.code).toContain('getElementById');
        });
    });
    describe('File-Scope Analysis (Legacy Fallback)', () => {
        it('should detect click handler without keyboard in single file', () => {
            const source = `
        const button = document.getElementById('submit');
        button.addEventListener('click', handleClick);
      `;
            const parser = new JavaScriptParser_1.JavaScriptParser();
            const model = parser.parse(source, 'test.js');
            const context = {
                actionLanguageModel: model,
                scope: 'file',
            };
            const issues = analyzer.analyze(context);
            expect(issues).toHaveLength(1);
            expect(issues[0].type).toBe('mouse-only-click');
            expect(issues[0].severity).toBe('warning'); // Warning in file-scope
            expect(issues[0].message).toContain('file-scope analysis');
        });
        it('should NOT flag when both handlers in same file', () => {
            const source = `
        const button = document.getElementById('submit');
        button.addEventListener('click', handleClick);
        button.addEventListener('keydown', handleKeyDown);
      `;
            const parser = new JavaScriptParser_1.JavaScriptParser();
            const model = parser.parse(source, 'test.js');
            const context = {
                actionLanguageModel: model,
                scope: 'file',
            };
            const issues = analyzer.analyze(context);
            expect(issues).toHaveLength(0);
        });
        it('should include fix suggestion in file-scope', () => {
            const source = `
        const button = document.getElementById('submit');
        button.addEventListener('click', handleClick);
      `;
            const parser = new JavaScriptParser_1.JavaScriptParser();
            const model = parser.parse(source, 'test.js');
            const context = {
                actionLanguageModel: model,
                scope: 'file',
            };
            const issues = analyzer.analyze(context);
            expect(issues[0].fix).toBeDefined();
            expect(issues[0].fix.code).toContain('keydown');
            expect(issues[0].fix.code).toContain('querySelector');
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty context', () => {
            const context = {
                scope: 'file',
            };
            const issues = analyzer.analyze(context);
            expect(issues).toHaveLength(0);
        });
        it('should handle document model without DOM', () => {
            const sources = {
                javascript: [
                    `const btn = document.getElementById('submit');
           btn.addEventListener('click', handleClick);`,
                ],
                css: [],
                sourceFiles: {
                    javascript: ['test.js'],
                    css: [],
                },
            };
            const documentModel = builder.build(sources, 'file');
            const context = {
                documentModel,
                scope: 'file',
            };
            const issues = analyzer.analyze(context);
            // Should handle gracefully (no crash)
            expect(Array.isArray(issues)).toBe(true);
        });
    });
});
//# sourceMappingURL=MouseOnlyClickAnalyzer.test.js.map