import { WidgetPatternAnalyzer } from '../WidgetPatternAnalyzer';
import { AnalyzerContext } from '../BaseAnalyzer';
import { ActionLanguageNode } from '../../models/ActionLanguageModel';

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
      getAllAriaActions: () => [],
    },
    scope: 'file',
  };
}

describe('WidgetPatternAnalyzer', () => {
  let analyzer: WidgetPatternAnalyzer;

  beforeEach(() => {
    analyzer = new WidgetPatternAnalyzer();
  });

  // Pattern 1: Tabs
  describe('Tabs Pattern', () => {
    it('should detect incomplete tabs pattern - missing tab children', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#tablist', binding: 'tablist' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'tablist' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(2); // Missing tabs + missing arrow nav
      expect(issues[0].type).toBe('incomplete-tabs-pattern');
      expect(issues[0].message).toContain('missing child tabs');
    });

    it('should detect incomplete tabs pattern - missing arrow navigation', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#tablist', binding: 'tablist' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'tablist' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button.tab1', binding: 'tab1' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'role', value: 'tab' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const arrowNavIssue = issues.find((i) => i.message.includes('arrow key'));
      expect(arrowNavIssue).toBeDefined();
    });

    it('should not flag complete tabs pattern', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#tablist', binding: 'tablist' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'tablist' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button.tab1', binding: 'tab1' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'role', value: 'tab' },
        },
        {
          id: '3',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'div#tablist', binding: 'tablist' },
          handler: {
            type: 'function',
            body: 'if (e.key === "ArrowLeft" || e.key === "ArrowRight") { /* navigate */ }',
          },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {},
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  // Pattern 2: Dialog
  describe('Dialog Pattern', () => {
    it('should detect incomplete dialog - missing aria-modal', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#dialog', binding: 'dialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'dialog' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const ariaModalIssue = issues.find((i) => i.message.includes('aria-modal'));
      expect(ariaModalIssue).toBeDefined();
      expect(ariaModalIssue?.severity).toBe('error');
    });

    it('should detect incomplete dialog - missing Escape handler', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#dialog', binding: 'dialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'dialog' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#dialog', binding: 'dialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'aria-modal', value: 'true' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const escapeIssue = issues.find((i) => i.message.includes('Escape'));
      expect(escapeIssue).toBeDefined();
    });

    it('should detect incomplete dialog - missing focus trap', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#dialog', binding: 'dialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'dialog' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#dialog', binding: 'dialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'aria-modal', value: 'true' },
        },
        {
          id: '3',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'div#dialog', binding: 'dialog' },
          handler: { type: 'function', body: 'if (e.key === "Escape") closeDialog();' },
          location: { file: 'test.js', line: 12, column: 5 },
          metadata: {},
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const focusTrapIssue = issues.find((i) => i.message.includes('focus trap'));
      expect(focusTrapIssue).toBeDefined();
      expect(focusTrapIssue?.severity).toBe('error');
    });

    it('should not flag complete dialog pattern', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#dialog', binding: 'dialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'dialog' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#dialog', binding: 'dialog' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'aria-modal', value: 'true' },
        },
        {
          id: '3',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'div#dialog', binding: 'dialog' },
          handler: { type: 'function', body: 'if (e.key === "Escape") closeDialog();' },
          location: { file: 'test.js', line: 12, column: 5 },
          metadata: {},
        },
        {
          id: '4',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'div#dialog', binding: 'dialog' },
          handler: { type: 'function', body: 'if (e.key === "Tab") { /* trap focus */ }' },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {},
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  // Pattern 3: Accordion
  describe('Accordion Pattern', () => {
    it('should detect incomplete accordion - missing aria-controls', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#accordion-header', binding: 'header' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'aria-expanded', value: 'false' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const controlsIssue = issues.find((i) => i.message.includes('aria-controls'));
      expect(controlsIssue).toBeDefined();
    });

    it('should detect incomplete accordion - missing click handler', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#accordion-header', binding: 'header' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'aria-expanded', value: 'false' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#accordion-header', binding: 'header' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'aria-controls', value: 'panel1' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const handlerIssue = issues.find((i) => i.message.includes('click handler'));
      expect(handlerIssue).toBeDefined();
    });

    it('should not flag complete accordion pattern', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#accordion-header', binding: 'header' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'aria-expanded', value: 'false' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#accordion-header', binding: 'header' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'aria-controls', value: 'panel1' },
        },
        {
          id: '3',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'click',
          element: { selector: 'button#accordion-header', binding: 'header' },
          handler: { type: 'function', body: 'togglePanel();' },
          location: { file: 'test.js', line: 12, column: 5 },
          metadata: {},
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  // Pattern 4: Combobox
  describe('Combobox Pattern', () => {
    it('should detect incomplete combobox - missing required attributes', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'input#combobox', binding: 'combobox' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'combobox' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const expandedIssue = issues.find((i) => i.message.includes('aria-expanded'));
      const controlsIssue = issues.find((i) => i.message.includes('aria-controls'));
      expect(expandedIssue).toBeDefined();
      expect(controlsIssue).toBeDefined();
    });

    it('should detect incomplete combobox - missing arrow navigation', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'input#combobox', binding: 'combobox' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'combobox' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'input#combobox', binding: 'combobox' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'aria-expanded', value: 'false' },
        },
        {
          id: '3',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'input#combobox', binding: 'combobox' },
          timing: 'immediate',
          location: { file: 'test.js', line: 12, column: 5 },
          metadata: { attribute: 'aria-controls', value: 'listbox1' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const arrowIssue = issues.find((i) => i.message.includes('arrow key'));
      expect(arrowIssue).toBeDefined();
    });
  });

  // Pattern 5: Menu
  describe('Menu Pattern', () => {
    it('should detect incomplete menu - missing menuitem children', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#menu', binding: 'menu' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'menu' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const menuitemIssue = issues.find((i) => i.message.includes('menuitem'));
      expect(menuitemIssue).toBeDefined();
    });
  });

  // Pattern 11: Slider
  describe('Slider Pattern', () => {
    it('should detect incomplete slider - missing value attributes', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#slider', binding: 'slider' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'slider' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const valuenowIssue = issues.find((i) => i.message.includes('aria-valuenow'));
      const valueminIssue = issues.find((i) => i.message.includes('aria-valuemin'));
      const valuemaxIssue = issues.find((i) => i.message.includes('aria-valuemax'));
      expect(valuenowIssue).toBeDefined();
      expect(valueminIssue).toBeDefined();
      expect(valuemaxIssue).toBeDefined();
    });

    it('should not flag complete slider pattern', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#slider', binding: 'slider' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'slider' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#slider', binding: 'slider' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'aria-valuenow', value: '50' },
        },
        {
          id: '3',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#slider', binding: 'slider' },
          timing: 'immediate',
          location: { file: 'test.js', line: 12, column: 5 },
          metadata: { attribute: 'aria-valuemin', value: '0' },
        },
        {
          id: '4',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#slider', binding: 'slider' },
          timing: 'immediate',
          location: { file: 'test.js', line: 13, column: 5 },
          metadata: { attribute: 'aria-valuemax', value: '100' },
        },
        {
          id: '5',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'keydown',
          element: { selector: 'div#slider', binding: 'slider' },
          handler: {
            type: 'function',
            body: 'if (e.key === "ArrowLeft" || e.key === "ArrowRight") { /* adjust value */ }',
          },
          location: { file: 'test.js', line: 14, column: 5 },
          metadata: {},
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  // Pattern 13: Switch
  describe('Switch Pattern', () => {
    it('should detect incomplete switch - missing aria-checked', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#switch', binding: 'switchElem' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'switch' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const checkedIssue = issues.find((i) => i.message.includes('aria-checked'));
      expect(checkedIssue).toBeDefined();
      expect(checkedIssue?.severity).toBe('error');
    });

    it('should not flag complete switch pattern', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#switch', binding: 'switchElem' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'switch' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'button#switch', binding: 'switchElem' },
          timing: 'immediate',
          location: { file: 'test.js', line: 11, column: 5 },
          metadata: { attribute: 'aria-checked', value: 'false' },
        },
        {
          id: '3',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'click',
          element: { selector: 'button#switch', binding: 'switchElem' },
          handler: { type: 'function', body: 'toggleSwitch();' },
          location: { file: 'test.js', line: 12, column: 5 },
          metadata: {},
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  // Pattern 17: Carousel
  describe('Carousel Pattern', () => {
    it('should detect carousel without pause control', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'domManipulation',
          element: { selector: 'div#carousel', binding: 'carousel' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { method: 'setInterval' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const pauseIssue = issues.find((i) =>
        i.message.includes('pause/play control')
      );
      expect(pauseIssue).toBeDefined();
    });

    it('should not flag carousel with pause control', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'domManipulation',
          element: { selector: 'div#carousel', binding: 'carousel' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { method: 'setInterval' },
        },
        {
          id: '2',
          nodeType: 'action',
          actionType: 'eventHandler',
          event: 'click',
          element: { selector: 'button#pause', binding: 'pauseBtn' },
          handler: { type: 'function', body: 'clearInterval(intervalId);' },
          location: { file: 'test.js', line: 15, column: 5 },
          metadata: {},
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  // Pattern 18: Link
  describe('Link Pattern', () => {
    it('should detect role="link" without click handler', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'span.link', binding: 'link' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'link' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const clickIssue = issues.find((i) => i.message.includes('click handler'));
      expect(clickIssue).toBeDefined();
    });
  });

  // Pattern 20: Progressbar
  describe('Progressbar Pattern', () => {
    it('should flag progressbar without aria-valuenow as info', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div#progress', binding: 'progress' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'progressbar' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const valuenowIssue = issues.find((i) =>
        i.message.includes('aria-valuenow')
      );
      expect(valuenowIssue).toBeDefined();
      expect(valuenowIssue?.severity).toBe('info');
    });
  });

  // Pattern 21: Tooltip
  describe('Tooltip Pattern', () => {
    it('should detect tooltip without unique id', () => {
      const nodes: ActionLanguageNode[] = [
        {
          id: '1',
          nodeType: 'action',
          actionType: 'ariaStateChange',
          element: { selector: 'div.tooltip', binding: 'tooltip' },
          timing: 'immediate',
          location: { file: 'test.js', line: 10, column: 5 },
          metadata: { attribute: 'role', value: 'tooltip' },
        },
      ];

      const context = createContext(nodes);
      const issues = analyzer.analyze(context);

      expect(issues.length).toBeGreaterThan(0);
      const idIssue = issues.find((i) => i.message.includes('unique id'));
      expect(idIssue).toBeDefined();
    });
  });
});
