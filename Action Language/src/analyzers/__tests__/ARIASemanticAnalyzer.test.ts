import { ARIASemanticAnalyzer } from '../ARIASemanticAnalyzer';
import { AnalyzerContext } from '../BaseAnalyzer';
import { ActionLanguageNode } from '../../models/ActionLanguageModel';

describe('ARIASemanticAnalyzer', () => {
  let analyzer: ARIASemanticAnalyzer;

  beforeEach(() => {
    analyzer = new ARIASemanticAnalyzer();
  });

  function createContext(nodes: ActionLanguageNode[]): AnalyzerContext {
    return {
      actionLanguageModel: {
        type: 'ActionLanguage',
        version: '1.0.0',
        sourceFile: 'test.js',
        nodes,
        parse: () => [],
        validate: () => ({ valid: true, errors: [], warnings: [] }),
        serialize: () => '',
        findBySelector: () => [],
        findByElementBinding: () => [],
        findByActionType: () => [],
        findEventHandlers: () => [],
        getAllEventHandlers: () => [],
        getAllFocusActions: () => [],
        getAllAriaActions: () => []
      },
      scope: 'file'
    };
  }

  describe('invalid-role', () => {
    it('should detect invalid ARIA role value', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div', binding: 'myDiv' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'invalidrole'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('invalid-role');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('invalidrole');
      expect(issues[0].wcagCriteria).toContain('4.1.2');
    });

    it('should not flag valid ARIA roles', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myButton', binding: 'myButton' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'button'
          }
        },
        // Add click handler to satisfy interactive-role-static detector
        {
          id: '2',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'click',
          element: { selector: 'div#myButton', binding: 'myButton' },
          handler: { type: 'function', body: 'handleClick()' },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {}
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('interactive-role-static', () => {
    it('should detect button role without event handler', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myButton', binding: 'myButton' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'button'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('interactive-role-static');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('button');
      expect(issues[0].wcagCriteria).toContain('2.1.1');
    });

    it('should not flag button role with click handler', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myButton', binding: 'myButton' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'button'
          }
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'click',
          element: { selector: 'div#myButton', binding: 'myButton' },
          handler: { type: 'function', body: 'handleClick()' },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {}
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('aria-expanded-static', () => {
    it('should detect aria-expanded set but never updated', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#toggle', binding: 'toggleBtn' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'aria-expanded',
            value: 'false'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('aria-expanded-static');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('aria-expanded');
      expect(issues[0].wcagCriteria).toContain('4.1.2');
    });

    it('should not flag aria-expanded when updated', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#toggle', binding: 'toggleBtn' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'aria-expanded',
            value: 'false'
          }
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#toggle', binding: 'toggleBtn' },
          timing: 'conditional',
          location: { file: 'test.js', line: 20, column: 5 },
          metadata: {
            attribute: 'aria-expanded',
            value: 'true'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('dialog-missing-label', () => {
    it('should detect dialog role without accessible label', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myDialog', binding: 'myDialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'dialog'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('dialog-missing-label');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('dialog');
      expect(issues[0].wcagCriteria).toContain('4.1.2');
    });

    it('should not flag dialog with aria-labelledby', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myDialog', binding: 'myDialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'dialog'
          }
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myDialog', binding: 'myDialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: {
            attribute: 'aria-labelledby',
            value: 'dialogTitle'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('missing-required-aria', () => {
    it('should detect checkbox without aria-checked', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myCheckbox', binding: 'myCheckbox' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'checkbox'
          }
        },
        // Add click handler to avoid interactive-role-static issue
        {
          id: '2',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'click',
          element: { selector: 'div#myCheckbox', binding: 'myCheckbox' },
          handler: { type: 'function', body: 'toggleCheckbox()' },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {}
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('missing-required-aria');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('checkbox');
      expect(issues[0].message).toContain('aria-checked');
      expect(issues[0].wcagCriteria).toContain('4.1.2');
    });

    it('should not flag checkbox with aria-checked', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myCheckbox', binding: 'myCheckbox' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'checkbox'
          }
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#myCheckbox', binding: 'myCheckbox' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: {
            attribute: 'aria-checked',
            value: 'false'
          }
        },
        // Add click handler to avoid interactive-role-static issue
        {
          id: '3',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'click',
          element: { selector: 'div#myCheckbox', binding: 'myCheckbox' },
          handler: { type: 'function', body: 'toggleCheckbox()' },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {}
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('assertive-live-region', () => {
    it('should detect aria-live="assertive"', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#notification', binding: 'notification' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'aria-live',
            value: 'assertive'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('assertive-live-region');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('assertive');
      expect(issues[0].wcagCriteria).toContain('4.1.3');
    });

    it('should not flag aria-live="polite"', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#notification', binding: 'notification' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'aria-live',
            value: 'polite'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('aria-hidden-true', () => {
    it('should detect aria-hidden="true" on focusable element', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#myButton', binding: 'myButton' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'aria-hidden',
            value: 'true'
          }
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'focusChange',
          element: { selector: 'button#myButton', binding: 'myButton' },
          timing: 'immediate',
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {}
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('aria-hidden-true');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('aria-hidden="true"');
      expect(issues[0].wcagCriteria).toContain('4.1.2');
    });

    it('should not flag aria-hidden="true" on non-interactive element', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#decorative', binding: 'decorative' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'aria-hidden',
            value: 'true'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('aria-label-overuse', () => {
    it('should detect aria-label on interactive element with visible text', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#myButton', binding: 'myButton' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'aria-label',
            value: 'Click me',
            hasVisibleText: true
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('aria-label-overuse');
      expect(issues[0].severity).toBe('info');
      expect(issues[0].message).toContain('aria-label');
      expect(issues[0].wcagCriteria).toContain('2.5.3');
    });

    it('should not flag aria-label on icon-only button', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#closeBtn', binding: 'closeBtn' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'aria-label',
            value: 'Close dialog',
            hasVisibleText: false
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty nodes array', () => {
      const context = createContext([]);
      const issues = analyzer.analyze(context);
      expect(issues).toHaveLength(0);
    });

    it('should handle missing actionLanguageModel', () => {
      const issues = analyzer.analyze({ scope: 'file' });
      expect(issues).toHaveLength(0);
    });

    it('should handle multiple issues in single context', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#div1', binding: 'div1' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            attribute: 'role',
            value: 'invalidrole'
          }
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#div2', binding: 'div2' },
          timing: 'immediate',
          location: { file: 'test.js', line: 20, column: 5 },
          metadata: {
            attribute: 'aria-live',
            value: 'assertive'
          }
        }
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThanOrEqual(2);
      expect(issues.map(i => i.type)).toContain('invalid-role');
      expect(issues.map(i => i.type)).toContain('assertive-live-region');
    });
  });
});
