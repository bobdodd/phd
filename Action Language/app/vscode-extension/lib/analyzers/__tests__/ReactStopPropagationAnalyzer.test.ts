/**
 * Tests for ReactStopPropagationAnalyzer
 */

import { ReactStopPropagationAnalyzer } from '../ReactStopPropagationAnalyzer';

describe('ReactStopPropagationAnalyzer', () => {
  let analyzer: ReactStopPropagationAnalyzer;

  beforeEach(() => {
    analyzer = new ReactStopPropagationAnalyzer();
  });

  describe('stopPropagation detection', () => {
    it('should detect stopPropagation() in event handler', () => {
      const code = `
        function Modal() {
          const handleClick = (e) => {
            e.stopPropagation();
            closeModal();
          };
          return <button onClick={handleClick}>Close</button>;
        }
      `;

      const issues = analyzer.analyze(code, 'Modal.tsx');

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('react-stop-propagation');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('stopPropagation()');
      expect(issues[0].wcagCriteria).toContain('2.1.1');
      expect(issues[0].wcagCriteria).toContain('4.1.2');
    });

    it('should detect stopImmediatePropagation() as more severe', () => {
      const code = `
        function Dialog() {
          const handleKeyDown = (event) => {
            event.stopImmediatePropagation();
            if (event.key === 'Escape') {
              closeDialog();
            }
          };
          return <div onKeyDown={handleKeyDown}>Dialog</div>;
        }
      `;

      const issues = analyzer.analyze(code, 'Dialog.tsx');

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('react-stop-propagation');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('stopImmediatePropagation()');
      expect(issues[0].message).toContain('ALL subsequent listeners');
    });

    it('should provide fix recommendations', () => {
      const code = `
        const Button = () => {
          return (
            <button onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}>
              Click
            </button>
          );
        };
      `;

      const issues = analyzer.analyze(code, 'Button.tsx');

      expect(issues).toHaveLength(1);
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix.description).toContain('Remove stopPropagation()');
      expect(issues[0].fix.code).toContain('preventDefault()');
    });

    it('should not flag components without stopPropagation', () => {
      const code = `
        function GoodButton() {
          const handleClick = (e) => {
            e.preventDefault(); // OK - only prevents default
            submitForm();
          };
          return <button onClick={handleClick}>Submit</button>;
        }
      `;

      const issues = analyzer.analyze(code, 'GoodButton.tsx');

      expect(issues).toHaveLength(0);
    });

    it('should handle multiple event handlers with stopPropagation', () => {
      const code = `
        function ComplexComponent() {
          const handleClick = (e) => e.stopPropagation();
          const handleKeyDown = (event) => event.stopPropagation();

          return (
            <div onClick={handleClick} onKeyDown={handleKeyDown}>
              Content
            </div>
          );
        }
      `;

      const issues = analyzer.analyze(code, 'ComplexComponent.tsx');

      expect(issues).toHaveLength(2);
      expect(issues[0].syntheticEvent.eventParamName).toBe('e');
      expect(issues[1].syntheticEvent.eventParamName).toBe('event');
    });
  });

  describe('hasStopPropagation quick check', () => {
    it('should return true if code contains stopPropagation', () => {
      const code = 'const handler = (e) => e.stopPropagation();';
      expect(analyzer.hasStopPropagation(code)).toBe(true);
    });

    it('should return true if code contains stopImmediatePropagation', () => {
      const code = 'e.stopImmediatePropagation();';
      expect(analyzer.hasStopPropagation(code)).toBe(true);
    });

    it('should return false if code does not contain stopPropagation', () => {
      const code = 'const handler = (e) => e.preventDefault();';
      expect(analyzer.hasStopPropagation(code)).toBe(false);
    });
  });

  describe('confidence scoring', () => {
    it('should report HIGH confidence for detected issues', () => {
      const code = `
        const handler = (e) => {
          e.stopPropagation();
        };
      `;

      const issues = analyzer.analyze(code, 'test.tsx');

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
});
