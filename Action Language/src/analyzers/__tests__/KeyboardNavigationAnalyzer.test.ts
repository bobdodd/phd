import { KeyboardNavigationAnalyzer } from '../KeyboardNavigationAnalyzer';
import { AnalyzerContext } from '../BaseAnalyzer';
import { ActionLanguageNode } from '../../models/ActionLanguageModel';

describe('KeyboardNavigationAnalyzer', () => {
  let analyzer: KeyboardNavigationAnalyzer;

  beforeEach(() => {
    analyzer = new KeyboardNavigationAnalyzer();
  });

  describe('potential-keyboard-trap', () => {
    it('should detect Tab preventDefault without Escape handler', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: '.focus-trap', binding: 'trap' },
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            keysHandled: ['Tab'],
            callsPreventDefault: true,
            checksShiftKey: true, // Assume shift is checked to focus on keyboard trap only
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('potential-keyboard-trap');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('keyboard trap');
      expect(issues[0].message).toContain('Escape');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain("event.key === 'Escape'");
    });

    it('should not flag Tab preventDefault with Escape handler nearby', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: '.modal', binding: 'modal' },
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: {
            keysHandled: ['Tab'],
            callsPreventDefault: true,
            checksShiftKey: true, // Assume shift is checked
          },
        },
        {
          nodeType: 'action',
          id: '2',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: '.modal', binding: 'modal' },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {
            keysHandled: ['Escape'],
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('screen-reader-conflict', () => {
    it('should detect single-character shortcut "h" without modifier', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'document', binding: '' },
          location: { file: 'test.js', line: 20, column: 5 },
          metadata: {
            keysHandled: ['h'],
            requiresModifier: false,
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('screen-reader-conflict');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('h');
      expect(issues[0].message).toContain('screen reader');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain('ctrlKey');
    });

    it('should detect multiple conflicting keys', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'document', binding: '' },
          location: { file: 'test.js', line: 20, column: 5 },
          metadata: {
            keysHandled: ['h', 'k', 'b'],
            requiresModifier: false,
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(3); // One issue per conflicting key
      expect(issues[0].type).toBe('screen-reader-conflict');
      expect(issues[1].type).toBe('screen-reader-conflict');
      expect(issues[2].type).toBe('screen-reader-conflict');
    });

    it('should not flag single-character shortcut with modifier key', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'document', binding: '' },
          location: { file: 'test.js', line: 20, column: 5 },
          metadata: {
            keysHandled: ['h'],
            requiresModifier: true, // Ctrl+H or similar
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });

    it('should not flag multi-character shortcuts', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'document', binding: '' },
          location: { file: 'test.js', line: 20, column: 5 },
          metadata: {
            keysHandled: ['Enter', 'Escape', 'ArrowDown'],
            requiresModifier: false,
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('deprecated-keycode', () => {
    it('should detect event.keyCode usage', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'input', binding: 'input' },
          location: { file: 'test.js', line: 30, column: 5 },
          metadata: {
            usesKeyCode: true,
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('deprecated-keycode');
      expect(issues[0].severity).toBe('info');
      expect(issues[0].message).toContain('keyCode');
      expect(issues[0].message).toContain('deprecated');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain('event.key');
    });

    it('should detect event.which usage', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keypress',
          element: { selector: 'input', binding: 'input' },
          location: { file: 'test.js', line: 35, column: 5 },
          metadata: {
            usesWhich: true,
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('deprecated-keycode');
      expect(issues[0].message).toContain('which');
    });
  });

  describe('tab-without-shift', () => {
    it('should detect Tab handling without Shift check', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: '.container', binding: 'container' },
          location: { file: 'test.js', line: 40, column: 5 },
          metadata: {
            keysHandled: ['Tab'],
            checksShiftKey: false,
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('tab-without-shift');
      expect(issues[0].severity).toBe('info');
      expect(issues[0].message).toContain('Shift');
      expect(issues[0].message).toContain('backward');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain('event.shiftKey');
    });

    it('should not flag Tab handling with Shift check', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: '.container', binding: 'container' },
          location: { file: 'test.js', line: 40, column: 5 },
          metadata: {
            keysHandled: ['Tab'],
            checksShiftKey: true,
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('missing-escape-handler', () => {
    it('should detect modal without Escape handler', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '#myModal', binding: 'modal' },
          location: { file: 'test.js', line: 50, column: 5 },
          metadata: {
            role: 'dialog',
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('missing-escape-handler');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('Escape');
      expect(issues[0].message).toContain('modal');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain("event.key === 'Escape'");
    });

    it('should detect modal by selector name', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '.modal-container', binding: 'modalContainer' },
          location: { file: 'test.js', line: 55, column: 5 },
          metadata: {},
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('missing-escape-handler');
    });

    it('should not flag modal with Escape handler nearby', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '.modal', binding: 'modal' },
          location: { file: 'test.js', line: 50, column: 5 },
          metadata: {
            role: 'dialog',
          },
        },
        {
          nodeType: 'action',
          id: '2',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: '.modal', binding: 'modal' },
          location: { file: 'test.js', line: 55, column: 5 },
          metadata: {
            keysHandled: ['Escape'],
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('missing-arrow-navigation', () => {
    it('should detect listbox without arrow key handlers', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '[role="listbox"]', binding: 'listbox' },
          location: { file: 'test.js', line: 60, column: 5 },
          metadata: {
            role: 'listbox',
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('missing-arrow-navigation');
      expect(issues[0].severity).toBe('info');
      expect(issues[0].message).toContain('listbox');
      expect(issues[0].message).toContain('arrow key');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain('ArrowDown');
      expect(issues[0].fix?.code).toContain('ArrowUp');
    });

    it('should detect tablist without arrow key handlers', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '[role="tablist"]', binding: 'tablist' },
          location: { file: 'test.js', line: 65, column: 5 },
          metadata: {
            role: 'tablist',
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('missing-arrow-navigation');
      expect(issues[0].message).toContain('tablist');
      expect(issues[0].fix?.code).toContain('ArrowRight');
      expect(issues[0].fix?.code).toContain('ArrowLeft');
    });

    it('should detect tree without arrow key handlers', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '[role="tree"]', binding: 'tree' },
          location: { file: 'test.js', line: 70, column: 5 },
          metadata: {
            role: 'tree',
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('missing-arrow-navigation');
      expect(issues[0].message).toContain('tree');
      expect(issues[0].fix?.code).toContain('expandNode');
      expect(issues[0].fix?.code).toContain('collapseNode');
    });

    it('should not flag widget with arrow handlers nearby', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '[role="listbox"]', binding: 'listbox' },
          location: { file: 'test.js', line: 60, column: 5 },
          metadata: {
            role: 'listbox',
          },
        },
        {
          nodeType: 'action',
          id: '2',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: '[role="listbox"]', binding: 'listbox' },
          location: { file: 'test.js', line: 65, column: 5 },
          metadata: {
            keysHandled: ['ArrowDown', 'ArrowUp'],
          },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('document-scope analysis', () => {
    it('should work with DocumentModel context', () => {
      const jsModel = {
        nodes: [
          {
            nodeType: 'action',
            id: '1',
            actionType: 'eventHandler',
            event: 'keydown',
            element: { selector: 'document', binding: '' },
            location: { file: 'test.js', line: 10, column: 5 },
            metadata: {
              keysHandled: ['h'],
              requiresModifier: false,
            },
          },
        ],
      };

      const context: AnalyzerContext = {
        documentModel: {
          javascript: [jsModel],
          css: [],
        } as any,
        scope: 'page',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('screen-reader-conflict');
    });
  });
});
