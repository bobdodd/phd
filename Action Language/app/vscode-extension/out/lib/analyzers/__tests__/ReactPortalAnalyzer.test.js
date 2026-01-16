"use strict";
/**
 * Tests for ReactPortalAnalyzer
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ReactPortalAnalyzer_1 = require("../ReactPortalAnalyzer");
describe('ReactPortalAnalyzer', () => {
    let analyzer;
    beforeEach(() => {
        analyzer = new ReactPortalAnalyzer_1.ReactPortalAnalyzer();
    });
    describe('portal detection', () => {
        it('should detect ReactDOM.createPortal()', () => {
            const code = `
        import ReactDOM from 'react-dom';

        function Modal() {
          return ReactDOM.createPortal(
            <div role="dialog">
              <h2>Modal Title</h2>
              <button>Close</button>
            </div>,
            document.getElementById('modal-root')
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Modal.tsx');
            expect(issues).toHaveLength(1);
            expect(issues[0].type).toBe('react-portal-accessibility');
            expect(issues[0].severity).toBe('warning');
            expect(issues[0].message).toContain('Keyboard navigation order');
            expect(issues[0].message).toContain('ARIA relationships');
            expect(issues[0].wcagCriteria).toContain('2.1.1');
            expect(issues[0].wcagCriteria).toContain('2.4.3');
            expect(issues[0].wcagCriteria).toContain('1.3.2');
            expect(issues[0].wcagCriteria).toContain('4.1.2');
        });
        it('should detect createPortal from named import', () => {
            const code = `
        import { createPortal } from 'react-dom';

        function Tooltip({ children, target }) {
          return createPortal(
            <div className="tooltip">{children}</div>,
            target
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Tooltip.tsx');
            expect(issues).toHaveLength(1);
            expect(issues[0].type).toBe('react-portal-accessibility');
        });
        it('should detect portal with getElementById container', () => {
            const code = `
        function Overlay() {
          return ReactDOM.createPortal(
            <div>Overlay content</div>,
            document.getElementById('overlay-root')
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Overlay.tsx');
            expect(issues).toHaveLength(1);
            expect(issues[0].portal.container).toBe('#overlay-root');
        });
        it('should detect portal with querySelector container', () => {
            const code = `
        function Sidebar() {
          return ReactDOM.createPortal(
            <aside>Sidebar</aside>,
            document.querySelector('.sidebar-container')
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Sidebar.tsx');
            expect(issues).toHaveLength(1);
            expect(issues[0].portal.container).toBe('.sidebar-container');
        });
        it('should detect portal with variable container', () => {
            const code = `
        function Dialog() {
          const container = document.body;
          return ReactDOM.createPortal(
            <div role="dialog">Dialog</div>,
            container
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Dialog.tsx');
            expect(issues).toHaveLength(1);
            expect(issues[0].portal.container).toBe('container');
        });
        it('should provide comprehensive fix recommendations', () => {
            const code = `
        function Modal() {
          return ReactDOM.createPortal(
            <div>Modal</div>,
            document.getElementById('modal-root')
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Modal.tsx');
            expect(issues).toHaveLength(1);
            expect(issues[0].fix).toBeDefined();
            expect(issues[0].fix.description).toContain('focus management');
            expect(issues[0].fix.code).toContain('role="dialog"');
            expect(issues[0].fix.code).toContain('aria-modal="true"');
            expect(issues[0].fix.code).toContain('aria-labelledby');
            expect(issues[0].fix.code).toContain('focus trap');
            expect(issues[0].fix.code).toContain('Escape');
        });
        it('should not flag components without portals', () => {
            const code = `
        function RegularComponent() {
          return (
            <div role="dialog">
              <button>Close</button>
            </div>
          );
        }
      `;
            const issues = analyzer.analyze(code, 'RegularComponent.tsx');
            expect(issues).toHaveLength(0);
        });
        it('should handle multiple portals in a component', () => {
            const code = `
        function MultiPortal() {
          return (
            <>
              {ReactDOM.createPortal(
                <div>Portal 1</div>,
                document.getElementById('portal-1')
              )}
              {createPortal(
                <div>Portal 2</div>,
                document.getElementById('portal-2')
              )}
            </>
          );
        }
      `;
            const issues = analyzer.analyze(code, 'MultiPortal.tsx');
            expect(issues).toHaveLength(2);
            expect(issues[0].portal.container).toBe('#portal-1');
            expect(issues[1].portal.container).toBe('#portal-2');
        });
    });
    describe('hasPortal quick check', () => {
        it('should return true if code contains createPortal', () => {
            const code = 'const portal = createPortal(<div />, container);';
            expect(analyzer.hasPortal(code)).toBe(true);
        });
        it('should return false if code does not contain createPortal', () => {
            const code = 'const element = <div>Hello</div>;';
            expect(analyzer.hasPortal(code)).toBe(false);
        });
    });
    describe('confidence scoring', () => {
        it('should report HIGH confidence for detected portals', () => {
            const code = `
        function Modal() {
          return ReactDOM.createPortal(
            <div>Modal</div>,
            document.body
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Modal.tsx');
            expect(issues[0].confidence.level).toBe('HIGH');
            expect(issues[0].confidence.treeCompleteness).toBe(1.0);
        });
    });
    describe('error handling', () => {
        it('should handle invalid syntax gracefully', () => {
            const code = 'const invalid = {{{';
            const issues = analyzer.analyze(code, 'invalid.tsx');
            // Should return empty array, not throw
            expect(issues).toEqual([]);
        });
        it('should handle non-React code gracefully', () => {
            const code = `
        const notReact = () => {
          console.log('hello');
        };
      `;
            const issues = analyzer.analyze(code, 'notReact.ts');
            expect(issues).toEqual([]);
        });
    });
    describe('accessibility concerns', () => {
        it('should flag all standard portal accessibility concerns', () => {
            const code = `
        function Portal() {
          return ReactDOM.createPortal(
            <div>Content</div>,
            document.body
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Portal.tsx');
            expect(issues).toHaveLength(1);
            expect(issues[0].portal.accessibilityConcerns).toContain('Portal renders content outside parent component hierarchy - may break focus management');
            expect(issues[0].portal.accessibilityConcerns).toContain('ARIA relationships (aria-labelledby, aria-controls) may not work across portal boundary');
            expect(issues[0].portal.accessibilityConcerns).toContain('Keyboard navigation order may not match visual order');
        });
        it('should provide specific guidance in message', () => {
            const code = `
        function Modal() {
          return ReactDOM.createPortal(
            <div>Modal</div>,
            document.getElementById('root')
          );
        }
      `;
            const issues = analyzer.analyze(code, 'Modal.tsx');
            expect(issues[0].message).toContain('Keyboard navigation order');
            expect(issues[0].message).toContain('ARIA relationships');
            expect(issues[0].message).toContain('Focus management');
            expect(issues[0].message).toContain('Screen readers');
        });
    });
});
//# sourceMappingURL=ReactPortalAnalyzer.test.js.map