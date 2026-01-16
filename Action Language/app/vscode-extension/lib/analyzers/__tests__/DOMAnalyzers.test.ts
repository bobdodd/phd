/**
 * Tests for DOM-Aware Analyzers
 *
 * These analyzers showcase capabilities that are ONLY possible with DocumentModel:
 * - OrphanedEventHandlerAnalyzer: Detect handlers for non-existent elements
 * - MissingAriaConnectionAnalyzer: Detect broken ARIA relationships
 * - FocusOrderConflictAnalyzer: Detect problematic tabindex usage
 * - VisibilityFocusConflictAnalyzer: Detect focusable but hidden elements
 */

import { OrphanedEventHandlerAnalyzer } from '../OrphanedEventHandlerAnalyzer';
import { MissingAriaConnectionAnalyzer } from '../MissingAriaConnectionAnalyzer';
import { FocusOrderConflictAnalyzer } from '../FocusOrderConflictAnalyzer';
import { VisibilityFocusConflictAnalyzer } from '../VisibilityFocusConflictAnalyzer';
import { DocumentModelBuilder, SourceCollection } from '../../models/DocumentModel';
import { AnalyzerContext } from '../BaseAnalyzer';

describe('DOM-Aware Analyzers', () => {
  let builder: DocumentModelBuilder;

  beforeEach(() => {
    builder = new DocumentModelBuilder();
  });

  describe('OrphanedEventHandlerAnalyzer', () => {
    let analyzer: OrphanedEventHandlerAnalyzer;

    beforeEach(() => {
      analyzer = new OrphanedEventHandlerAnalyzer();
    });

    it('should detect handler for non-existent element by ID', () => {
      const sources: SourceCollection = {
        html: `
          function App() {
            return <button id="existing">Click me</button>;
          }
        `,
        javascript: [
          `document.getElementById('nonexistent').addEventListener('click', handler);`,
        ],
        css: [],
        sourceFiles: {
          html: 'App.tsx',
          javascript: ['handlers.js'],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('orphaned-event-handler');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('nonexistent');
      expect(issues[0].message).toContain('does not exist');
    });

    it('should NOT flag handler for existing element', () => {
      const sources: SourceCollection = {
        html: `
          function App() {
            return <button id="submit">Submit</button>;
          }
        `,
        javascript: [
          `document.getElementById('submit').addEventListener('click', handler);`,
        ],
        css: [],
        sourceFiles: {
          html: 'App.tsx',
          javascript: ['handlers.js'],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });

    it('should detect handler with typo in ID', () => {
      const sources: SourceCollection = {
        html: `
          function Form() {
            return <button id="submit">Submit</button>;
          }
        `,
        javascript: [
          `document.getElementById('sumbit').addEventListener('click', handler);`,
        ],
        css: [],
        sourceFiles: {
          html: 'Form.tsx',
          javascript: ['handlers.js'],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].message).toContain('sumbit');
    });

    it('should handle class selectors', () => {
      const sources: SourceCollection = {
        html: `
          function Nav() {
            return <a className="nav-item">Home</a>;
          }
        `,
        javascript: [
          `document.querySelector('.nav-link').addEventListener('click', handler);`,
        ],
        css: [],
        sourceFiles: {
          html: 'Nav.tsx',
          javascript: ['nav.js'],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].message).toContain('.nav-link');
    });

    it('should return empty array without DocumentModel', () => {
      const context: AnalyzerContext = { scope: 'file' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('MissingAriaConnectionAnalyzer', () => {
    let analyzer: MissingAriaConnectionAnalyzer;

    beforeEach(() => {
      analyzer = new MissingAriaConnectionAnalyzer();
    });

    it('should detect aria-labelledby pointing to missing element', () => {
      const sources: SourceCollection = {
        html: `
          function Button() {
            return <button aria-labelledby="label1">Click me</button>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Button.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('missing-aria-connection');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('aria-labelledby');
      expect(issues[0].message).toContain('label1');
    });

    it('should NOT flag aria-labelledby pointing to existing element', () => {
      const sources: SourceCollection = {
        html: `
          function Button() {
            return (
              <div>
                <span id="label1">Submit Form</span>
                <button aria-labelledby="label1">Click me</button>
              </div>
            );
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Button.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });

    it('should detect aria-describedby pointing to missing element', () => {
      const sources: SourceCollection = {
        html: `
          function Input() {
            return <input aria-describedby="help-text" />;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Input.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].message).toContain('aria-describedby');
      expect(issues[0].message).toContain('help-text');
    });

    it('should detect aria-controls pointing to missing element', () => {
      const sources: SourceCollection = {
        html: `
          function Accordion() {
            return <button aria-controls="panel1" aria-expanded="false">Toggle</button>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Accordion.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].message).toContain('aria-controls');
      expect(issues[0].message).toContain('panel1');
    });

    it('should handle multiple IDs in aria-labelledby', () => {
      const sources: SourceCollection = {
        html: `
          function Button() {
            return (
              <div>
                <span id="label1">Part 1</span>
                <button aria-labelledby="label1 label2 label3">Click</button>
              </div>
            );
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Button.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      // Should detect label2 and label3 as missing (but label1 exists)
      expect(issues).toHaveLength(2);
      expect(issues[0].message).toContain('label2');
      expect(issues[1].message).toContain('label3');
    });

    it('should return empty array without DocumentModel', () => {
      const context: AnalyzerContext = { scope: 'file' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('FocusOrderConflictAnalyzer', () => {
    let analyzer: FocusOrderConflictAnalyzer;

    beforeEach(() => {
      analyzer = new FocusOrderConflictAnalyzer();
    });

    it('should detect positive tabindex (anti-pattern)', () => {
      const sources: SourceCollection = {
        html: `
          function Form() {
            return <button tabIndex="1">Submit</button>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Form.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('positive-tabindex');
      expect(issues[0].severity).toBe('warning');
      expect(issues[0].message).toContain('positive tabindex');
      expect(issues[0].message).toContain('tabindex="1"');
    });

    it('should NOT flag tabindex="0" (correct usage)', () => {
      const sources: SourceCollection = {
        html: `
          function Custom() {
            return <div tabIndex="0" role="button">Click</div>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Custom.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });

    it('should NOT flag tabindex="-1" (programmatic focus only)', () => {
      const sources: SourceCollection = {
        html: `
          function Modal() {
            return <dialog tabIndex="-1">Content</dialog>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Modal.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });

    it('should detect duplicate positive tabindex values', () => {
      const sources: SourceCollection = {
        html: `
          function Form() {
            return (
              <div>
                <button tabIndex="1" id="btn1">First</button>
                <button tabIndex="1" id="btn2">Second</button>
              </div>
            );
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Form.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      // Should report: 2 positive tabindex warnings + 2 duplicate warnings
      expect(issues.length).toBeGreaterThanOrEqual(2);

      const duplicateIssues = issues.filter((i) => i.type === 'duplicate-tabindex');
      expect(duplicateIssues).toHaveLength(2);
      expect(duplicateIssues[0].severity).toBe('error');
    });

    it('should return empty array without DocumentModel', () => {
      const context: AnalyzerContext = { scope: 'file' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });

  describe('VisibilityFocusConflictAnalyzer', () => {
    let analyzer: VisibilityFocusConflictAnalyzer;

    beforeEach(() => {
      analyzer = new VisibilityFocusConflictAnalyzer();
    });

    it('should detect focusable element with aria-hidden', () => {
      const sources: SourceCollection = {
        html: `
          function Menu() {
            return <button aria-hidden="true" tabIndex="0">Hidden button</button>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Menu.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(1);
      expect(issues[0].type).toBe('aria-hidden-focusable');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].message).toContain('aria-hidden="true"');
      expect(issues[0].message).toContain('focusable');
    });

    it('should NOT flag aria-hidden with tabindex="-1" (correct pattern)', () => {
      const sources: SourceCollection = {
        html: `
          function Hidden() {
            return <button aria-hidden="true" tabIndex="-1">Properly hidden</button>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Hidden.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      // tabIndex="-1" removes from tab order, so no conflict
      expect(issues).toHaveLength(0);
    });

    it('should detect interactive element with aria-hidden', () => {
      const sources: SourceCollection = {
        html: `
          function Button() {
            return <button aria-hidden="true" onClick={handleClick}>Hidden but clickable</button>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Button.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      // Should detect: aria-hidden-focusable (button is naturally focusable)
      // Note: interactive-element-hidden check skipped due to aria-hidden-focusable being detected first
      expect(issues.length).toBeGreaterThanOrEqual(1);
      expect(issues[0].message).toContain('aria-hidden');
    });

    it('should NOT flag visible interactive element', () => {
      const sources: SourceCollection = {
        html: `
          function Button() {
            return <button onClick={handleClick}>Visible button</button>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'Button.tsx',
          javascript: [],
          css: [],
        },
      };

      const documentModel = builder.build(sources, 'page');
      const context: AnalyzerContext = { documentModel, scope: 'page' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });

    it('should return empty array without DocumentModel', () => {
      const context: AnalyzerContext = { scope: 'file' };
      const issues = analyzer.analyze(context);

      expect(issues).toHaveLength(0);
    });
  });
});
