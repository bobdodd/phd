/**
 * Tests for FocusManagementAnalyzer
 *
 * Tests detection of 6 focus management issue types:
 * 1. removal-without-focus-management
 * 2. hiding-without-focus-management
 * 3. hiding-class-without-focus-management
 * 4. possibly-non-focusable
 * 5. standalone-blur
 * 6. focus-restoration-missing
 */

import { FocusManagementAnalyzer } from '../FocusManagementAnalyzer';
import { AnalyzerContext } from '../BaseAnalyzer';
import { ActionLanguageNode } from '../../models/ActionLanguageModel';
import { DOMElement } from '../../models/DOMModel';

describe('FocusManagementAnalyzer', () => {
  let analyzer: FocusManagementAnalyzer;

  beforeEach(() => {
    analyzer = new FocusManagementAnalyzer();
  });

  describe('removal-without-focus-management', () => {
    it('should detect element.remove() without focus check', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '.modal', binding: 'modal' },
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { operation: 'remove' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('removal-without-focus-management');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].wcagCriteria).toContain('2.4.3');
      expect(issues[0].wcagCriteria).toContain('2.4.7');
      expect(issues[0].message).toContain('focus management');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain('document.activeElement');
    });

    it('should not flag removal with focus check nearby', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: 'document.activeElement', binding: '' },
          location: { file: 'test.js', line: 9, column: 5 },
          metadata: { property: 'activeElement' },
        },
        {
          nodeType: 'action',
          id: '2',
          actionType: 'domManipulation',
          element: { selector: '.modal', binding: 'modal' },
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { operation: 'remove' },
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

  describe('hiding-without-focus-management', () => {
    it('should detect element hiding without focus check', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '#menu', binding: 'menu' },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: { operation: 'hide', property: 'display' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('hiding-without-focus-management');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('hidden without focus management');
      expect(issues[0].fix).toBeDefined();
    });

    it('should detect visibility:hidden without focus check', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '.dropdown', binding: 'dropdown' },
          location: { file: 'test.js', line: 20, column: 5 },
          metadata: { property: 'visibility' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('hiding-without-focus-management');
    });

    it('should not flag hiding with focus check nearby', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: 'document.activeElement', binding: '' },
          location: { file: 'test.js', line: 19, column: 5 },
          metadata: { object: 'document.activeElement' },
        },
        {
          nodeType: 'action',
          id: '2',
          actionType: 'domManipulation',
          element: { selector: '.menu', binding: 'menu' },
          location: { file: 'test.js', line: 20, column: 5 },
          metadata: { property: 'display' },
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

  describe('hiding-class-without-focus-management', () => {
    it('should detect classList operations that may hide element', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '.sidebar', binding: 'sidebar' },
          location: { file: 'test.js', line: 25, column: 5 },
          metadata: { operation: 'classList' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('hiding-class-without-focus-management');
      expect(issues[0].severity).toBe('info');
      expect(issues[0].message).toContain('classList');
      expect(issues[0].message).toContain('may hide');
    });
  });

  describe('possibly-non-focusable', () => {
    it('should detect .focus() on non-focusable element with DOM context', () => {
      const divElement: DOMElement = {
        nodeType: 'element',
        id: 'elem1',
        tagName: 'div',
        attributes: {}, // No tabindex
        children: [],
        location: { file: 'test.html', line: 5, column: 1 },
        metadata: {},
      };

      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'focusChange',
          element: {
            selector: '.container',
            binding: 'container',
            resolvedElement: divElement,
          },
          timing: 'immediate',
          location: { file: 'test.js', line: 30, column: 5 },
          metadata: { method: 'focus' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('possibly-non-focusable');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('non-focusable');
      expect(issues[0].message).toContain('div');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain('tabindex');
    });

    it('should not flag .focus() on button (naturally focusable)', () => {
      const buttonElement: DOMElement = {
        nodeType: 'element',
        id: 'elem2',
        tagName: 'button',
        attributes: {},
        children: [],
        location: { file: 'test.html', line: 10, column: 1 },
        metadata: {},
      };

      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'focusChange',
          element: {
            selector: 'button',
            binding: 'button',
            resolvedElement: buttonElement,
          },
          timing: 'immediate',
          location: { file: 'test.js', line: 35, column: 5 },
          metadata: { method: 'focus' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });

    it('should not flag .focus() on element with tabindex', () => {
      const divWithTabindex: DOMElement = {
        nodeType: 'element',
        id: 'elem3',
        tagName: 'div',
        attributes: { tabindex: '0' },
        children: [],
        location: { file: 'test.html', line: 15, column: 1 },
        metadata: {},
      };

      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'focusChange',
          element: {
            selector: '.focusable-div',
            binding: 'focusableDiv',
            resolvedElement: divWithTabindex,
          },
          timing: 'immediate',
          location: { file: 'test.js', line: 40, column: 5 },
          metadata: { method: 'focus' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });

    it('should flag .focus() as info when element not in DOM', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'focusChange',
          element: {
            selector: '.unknown',
            binding: 'unknown',
            // resolvedElement undefined - not in DOM
          },
          timing: 'immediate',
          location: { file: 'test.js', line: 45, column: 5 },
          metadata: { method: 'focus' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe('info');
      expect(issues[0].message).toContain('Verify');
    });
  });

  describe('standalone-blur', () => {
    it('should detect .blur() without .focus() nearby', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'focusChange',
          element: { selector: 'input', binding: 'input' },
          location: { file: 'test.js', line: 50, column: 5 },
          metadata: { method: 'blur' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('standalone-blur');
      expect(issues[0].severity).toBe('info');
      expect(issues[0].message).toContain('.blur()');
      expect(issues[0].message).toContain('without moving focus');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain('otherElement.focus()');
    });

    it('should not flag .blur() with .focus() nearby', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'focusChange',
          element: { selector: 'input', binding: 'input' },
          location: { file: 'test.js', line: 50, column: 5 },
          metadata: { method: 'blur' },
        },
        {
          nodeType: 'action',
          id: '2',
          actionType: 'focusChange',
          element: { selector: 'button', binding: 'button' },
          location: { file: 'test.js', line: 51, column: 5 },
          timing: 'immediate',
          metadata: { method: 'focus' },
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

  describe('focus-restoration-missing', () => {
    it('should detect modal close without focus restoration', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '.modal', binding: 'modal' },
          location: { file: 'test.js', line: 60, column: 5 },
          metadata: { operation: 'hide', role: 'dialog' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('focus-restoration-missing');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('Modal/dialog');
      expect(issues[0].message).toContain('focus restoration');
      expect(issues[0].fix).toBeDefined();
      expect(issues[0].fix?.code).toContain('previousFocus');
    });

    it('should detect dialog close by selector name', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: { selector: '#myDialog', binding: 'dialog' },
          location: { file: 'test.js', line: 65, column: 5 },
          metadata: { operation: 'remove' },
        },
      ];

      const context: AnalyzerContext = {
        actionLanguageModel: { nodes } as any,
        scope: 'file',
      };

      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('focus-restoration-missing');
    });

    it('should not flag modal close with focus restoration', () => {
      const nodes: ActionLanguageNode[] = [
        {
          nodeType: 'action',
          id: '1',
          actionType: 'domManipulation',
          element: {
            selector: 'previousFocus',
            binding: 'previousFocus',
          },
          location: { file: 'test.js', line: 59, column: 5 },
          metadata: { variable: 'previousFocus' },
        },
        {
          nodeType: 'action',
          id: '2',
          actionType: 'domManipulation',
          element: { selector: '.modal', binding: 'modal' },
          location: { file: 'test.js', line: 60, column: 5 },
          metadata: { operation: 'hide', role: 'dialog' },
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
            actionType: 'domManipulation',
            element: { selector: '.modal', binding: 'modal' },
            location: { file: 'test.js', line: 10, column: 5 },
            metadata: { operation: 'remove' },
          },
        ],
      };

      const context: AnalyzerContext = {
        documentModel: {
          javascript: [jsModel as any],
          dom: [],
        } as any,
        scope: 'page',
      };

      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].confidence?.level).toBeDefined();
    });
  });
});
