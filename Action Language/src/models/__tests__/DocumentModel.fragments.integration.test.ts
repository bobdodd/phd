/**
 * Integration tests for DocumentModel with multiple disconnected fragments
 *
 * These tests verify that Paradise can handle real-world scenarios where
 * developers work with disconnected component fragments during incremental
 * development, before components are integrated into a complete page tree.
 *
 * Scenarios tested:
 * - Multiple independent component fragments
 * - Cross-fragment ARIA references
 * - Event handlers split across fragments
 * - Merge process with fragment arrays
 * - Analyzer behavior with fragmented trees
 */

import { DocumentModel } from '../DocumentModel';
import { DOMModelImpl, DOMElement } from '../DOMModel';
import { ActionLanguageModelImpl, ActionLanguageNode } from '../ActionLanguageModel';
import { SourceLocation } from '../BaseModel';

/**
 * Helper to create a test DOM element
 */
function createElement(
  id: string,
  tagName: string = 'div',
  attributes: Record<string, string> = {}
): DOMElement {
  const location: SourceLocation = {
    file: 'test.html',
    line: 1,
    column: 0
  };

  return {
    id,
    nodeType: 'element',
    tagName,
    attributes: { id, ...attributes },
    children: [],
    location,
    metadata: {}
  };
}

/**
 * Helper to create a DOM fragment (root with children)
 */
function createFragment(rootId: string, children: DOMElement[]): DOMModelImpl {
  const root = createElement(rootId, 'div');
  root.children = children;

  for (const child of children) {
    child.parent = root;
  }

  return new DOMModelImpl(root, `${rootId}.html`);
}

/**
 * Helper to create an ActionLanguage event handler node
 */
function createEventHandler(
  elementId: string,
  event: string,
  sourceFile: string = 'test.js'
): ActionLanguageNode {
  const location: SourceLocation = {
    file: sourceFile,
    line: 10,
    column: 0
  };

  return {
    id: `handler-${elementId}-${event}`,
    nodeType: 'action',
    actionType: 'eventHandler',
    event,
    element: {
      selector: `#${elementId}`,
      binding: elementId
    },
    handler: {
      type: 'function',
      body: 'console.log("clicked")',
      parameters: []
    },
    location,
    metadata: {}
  };
}

describe('DocumentModel Multiple Fragments Integration', () => {
  describe('Basic Fragment Support', () => {
    it('should handle two independent component fragments', () => {
      // Fragment 1: Button component
      const button = createElement('submit-btn', 'button', { class: 'primary' });
      const fragment1 = createFragment('button-component', [button]);

      // Fragment 2: Dialog component
      const dialog = createElement('confirm-dialog', 'dialog', { role: 'dialog' });
      const fragment2 = createFragment('dialog-component', [dialog]);

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment1, fragment2],
        javascript: [],
        css: []
      });

      expect(model.getFragmentCount()).toBe(2);
      expect(model.dom).toHaveLength(2);

      // Verify both fragments are accessible
      const allElements1 = model.dom![0].getAllElements();
      const allElements2 = model.dom![1].getAllElements();

      expect(allElements1.some(el => el.id === 'submit-btn')).toBe(true);
      expect(allElements2.some(el => el.id === 'confirm-dialog')).toBe(true);
    });

    it('should handle single fragment (backward compatibility)', () => {
      const button = createElement('submit-btn', 'button');
      const fragment = createFragment('app', [button]);

      const model = new DocumentModel({
        scope: 'page',
        dom: fragment,  // Single fragment, not array
        javascript: [],
        css: []
      });

      expect(model.getFragmentCount()).toBe(1);
      expect(model.dom).toHaveLength(1);
    });

    it('should handle empty fragment array', () => {
      const model = new DocumentModel({
        scope: 'page',
        dom: [],
        javascript: [],
        css: []
      });

      expect(model.getFragmentCount()).toBe(0);
    });
  });

  describe('Cross-Fragment ARIA References', () => {
    it('should resolve ARIA references across fragments', () => {
      // Fragment 1: Label
      const label = createElement('submit-label', 'span');
      label.textContent = 'Submit Form';
      const fragment1 = createFragment('label-component', [label]);

      // Fragment 2: Button referencing label in Fragment 1
      const button = createElement('submit-btn', 'button', {
        'aria-labelledby': 'submit-label'
      });
      const fragment2 = createFragment('button-component', [button]);

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment1, fragment2],
        javascript: [],
        css: []
      });

      // Reference should resolve across fragments
      const completeness = model.getTreeCompleteness();
      // Base 0.8 (2 fragments) + 0.3 (resolved) = 1.0 (capped)
      expect(completeness).toBe(1.0);
    });

    it('should detect unresolved ARIA references in fragments', () => {
      // Fragment: Button referencing non-existent label
      const button = createElement('submit-btn', 'button', {
        'aria-labelledby': 'nonexistent-label'
      });
      const fragment = createFragment('button-component', [button]);

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment],
        javascript: [],
        css: []
      });

      // Reference should be unresolved
      const completeness = model.getTreeCompleteness();
      expect(completeness).toBe(0.7);  // Base only, no boost
    });

    it('should handle aria-controls across fragments', () => {
      // Fragment 1: Panel
      const panel = createElement('settings-panel', 'div', { role: 'region' });
      const fragment1 = createFragment('panel-component', [panel]);

      // Fragment 2: Toggle button controlling panel
      const toggle = createElement('toggle-settings', 'button', {
        'aria-controls': 'settings-panel',
        'aria-expanded': 'false'
      });
      const fragment2 = createFragment('toggle-component', [toggle]);

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment1, fragment2],
        javascript: [],
        css: []
      });

      const completeness = model.getTreeCompleteness();
      expect(completeness).toBe(1.0);
    });

    it('should handle multiple ARIA references in one element', () => {
      // Fragment 1: Label and description
      const label = createElement('field-label', 'label');
      const description = createElement('field-desc', 'p');
      const fragment1 = createFragment('labels', [label, description]);

      // Fragment 2: Input field
      const input = createElement('username', 'input', {
        'aria-labelledby': 'field-label',
        'aria-describedby': 'field-desc'
      });
      const fragment2 = createFragment('input-component', [input]);

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment1, fragment2],
        javascript: [],
        css: []
      });

      const completeness = model.getTreeCompleteness();
      // Both references resolve
      expect(completeness).toBe(1.0);
    });
  });

  describe('Event Handler Merging Across Fragments', () => {
    it('should attach handlers to elements across fragments', () => {
      // Fragment 1: Button element
      const button = createElement('submit-btn', 'button');
      const fragment = createFragment('button-component', [button]);

      // JavaScript: Event handler for button
      const handler = createEventHandler('submit-btn', 'click', 'handlers.js');
      const jsModel = new ActionLanguageModelImpl([handler], 'handlers.js');

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment],
        javascript: [jsModel],
        css: []
      });

      // Merge should attach handler to button
      model.merge();

      const buttonElement = model.dom![0].getElementById('submit-btn');
      expect(buttonElement).not.toBeNull();
      expect(buttonElement!.jsHandlers).toHaveLength(1);
      expect(buttonElement!.jsHandlers![0].event).toBe('click');
    });

    it('should attach handlers from multiple JS files to same element', () => {
      // Fragment: Button
      const button = createElement('submit-btn', 'button');
      const fragment = createFragment('button-component', [button]);

      // JavaScript 1: Click handler
      const clickHandler = createEventHandler('submit-btn', 'click', 'click.js');
      const jsModel1 = new ActionLanguageModelImpl([clickHandler], 'click.js');

      // JavaScript 2: Keyboard handler
      const keyHandler = createEventHandler('submit-btn', 'keydown', 'keyboard.js');
      const jsModel2 = new ActionLanguageModelImpl([keyHandler], 'keyboard.js');

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment],
        javascript: [jsModel1, jsModel2],
        css: []
      });

      model.merge();

      const buttonElement = model.dom![0].getElementById('submit-btn');
      expect(buttonElement!.jsHandlers).toHaveLength(2);

      const events = buttonElement!.jsHandlers!.map(h => h.event);
      expect(events).toContain('click');
      expect(events).toContain('keydown');
    });

    it('should handle handlers in first fragment, element in second fragment', () => {
      // Fragment 1: Container (no button yet)
      const container = createElement('container', 'div');
      const fragment1 = createFragment('container-component', [container]);

      // Fragment 2: Button (element exists here)
      const button = createElement('submit-btn', 'button');
      const fragment2 = createFragment('button-component', [button]);

      // JavaScript: Handler referencing button
      const handler = createEventHandler('submit-btn', 'click');
      const jsModel = new ActionLanguageModelImpl([handler], 'handlers.js');

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment1, fragment2],
        javascript: [jsModel],
        css: []
      });

      model.merge();

      // Handler should attach to button in fragment 2
      const buttonElement = model.dom![1].getElementById('submit-btn');
      expect(buttonElement!.jsHandlers).toHaveLength(1);
    });

    it('should not attach handler if element missing in all fragments', () => {
      // Fragment 1: Only has a div
      const div = createElement('container', 'div');
      const fragment1 = createFragment('container', [div]);

      // JavaScript: Handler for non-existent button
      const handler = createEventHandler('nonexistent-btn', 'click');
      const jsModel = new ActionLanguageModelImpl([handler], 'handlers.js');

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment1],
        javascript: [jsModel],
        css: []
      });

      model.merge();

      // Handler should not be attached anywhere
      const allElements = model.dom![0].getAllElements();
      for (const element of allElements) {
        expect(element.jsHandlers || []).toHaveLength(0);
      }
    });
  });

  describe('Interactive Elements Across Fragments', () => {
    it('should find interactive elements from all fragments', () => {
      // Fragment 1: Button with handler
      const button1 = createElement('btn1', 'button');
      const fragment1 = createFragment('comp1', [button1]);

      // Fragment 2: Button with handler
      const button2 = createElement('btn2', 'button');
      const fragment2 = createFragment('comp2', [button2]);

      // Handlers for both buttons
      const handler1 = createEventHandler('btn1', 'click');
      const handler2 = createEventHandler('btn2', 'click');
      const jsModel = new ActionLanguageModelImpl([handler1, handler2], 'handlers.js');

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment1, fragment2],
        javascript: [jsModel],
        css: []
      });

      model.merge();

      const interactive = model.getInteractiveElements();
      expect(interactive).toHaveLength(2);

      const ids = interactive.map(ctx => ctx.element.id);
      expect(ids).toContain('btn1');
      expect(ids).toContain('btn2');
    });

    it('should return empty array when no handlers attached and element not naturally focusable', () => {
      // Use div instead of button (button is naturally focusable)
      const div = createElement('div1', 'div');
      const fragment = createFragment('comp', [div]);

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment],
        javascript: [],
        css: []
      });

      model.merge();

      const interactive = model.getInteractiveElements();
      expect(interactive).toHaveLength(0);
    });
  });

  describe('Real-World Component Fragment Scenarios', () => {
    it('should handle typical React component development scenario', () => {
      // Developer is building multiple components in isolation

      // Component 1: Modal dialog
      const modalOverlay = createElement('modal-overlay', 'div', { class: 'overlay' });
      const modalDialog = createElement('modal-dialog', 'dialog', {
        role: 'dialog',
        'aria-labelledby': 'modal-title',
        'aria-describedby': 'modal-desc'
      });
      const modalTitle = createElement('modal-title', 'h2');
      const modalDesc = createElement('modal-desc', 'p');
      const closeBtn = createElement('modal-close', 'button', {
        'aria-label': 'Close'
      });

      modalDialog.children = [modalTitle, modalDesc, closeBtn];
      modalOverlay.children = [modalDialog];

      const modalFragment = createFragment('modal-component', [modalOverlay]);

      // Component 2: Trigger button (not yet connected to modal)
      const openBtn = createElement('open-modal-btn', 'button', {
        'aria-controls': 'modal-dialog'
      });
      const triggerFragment = createFragment('trigger-component', [openBtn]);

      // Handlers for both components
      const openHandler = createEventHandler('open-modal-btn', 'click', 'modal.js');
      const closeHandler = createEventHandler('modal-close', 'click', 'modal.js');
      const escapeHandler = createEventHandler('modal-dialog', 'keydown', 'modal.js');

      const jsModel = new ActionLanguageModelImpl(
        [openHandler, closeHandler, escapeHandler],
        'modal.js'
      );

      const model = new DocumentModel({
        scope: 'page',
        dom: [modalFragment, triggerFragment],
        javascript: [jsModel],
        css: []
      });

      model.merge();

      // Verify structure
      expect(model.getFragmentCount()).toBe(2);

      // Verify ARIA references resolve
      const modalDialogElement = model.dom![0].getElementById('modal-dialog');
      const modalTitleElement = model.dom![0].getElementById('modal-title');
      const modalDescElement = model.dom![0].getElementById('modal-desc');

      expect(modalDialogElement).not.toBeNull();
      expect(modalTitleElement).not.toBeNull();
      expect(modalDescElement).not.toBeNull();

      // Verify handlers attached
      const openBtnElement = model.dom![1].getElementById('open-modal-btn');
      const closeBtnElement = model.dom![0].getElementById('modal-close');

      expect(openBtnElement!.jsHandlers).toHaveLength(1);
      expect(closeBtnElement!.jsHandlers).toHaveLength(1);
      expect(modalDialogElement!.jsHandlers).toHaveLength(1);

      // Verify interactive elements
      const interactive = model.getInteractiveElements();
      expect(interactive.length).toBeGreaterThanOrEqual(3);

      // Verify completeness
      const completeness = model.getTreeCompleteness();
      expect(completeness).toBeGreaterThan(0.8);  // Should be high due to resolved references
    });

    it('should handle early development with many disconnected fragments', () => {
      // Developer has created many component files, not yet integrated

      const fragments = [
        createFragment('header', [createElement('header', 'header')]),
        createFragment('nav', [createElement('nav', 'nav')]),
        createFragment('sidebar', [createElement('sidebar', 'aside')]),
        createFragment('content', [createElement('main', 'main')]),
        createFragment('footer', [createElement('footer', 'footer')]),
        createFragment('button1', [createElement('btn1', 'button')]),
        createFragment('button2', [createElement('btn2', 'button')]),
        createFragment('dialog', [createElement('dialog', 'dialog')])
      ];

      const model = new DocumentModel({
        scope: 'page',
        dom: fragments,
        javascript: [],
        css: []
      });

      // Many fragments = low completeness
      expect(model.getFragmentCount()).toBe(8);
      const completeness = model.getTreeCompleteness();
      expect(completeness).toBeLessThanOrEqual(0.3);  // Should be LOW confidence
    });

    it('should show improving confidence as fragments merge', () => {
      // Scenario 1: Many disconnected fragments (9 fragments)
      const fragments1 = Array.from({ length: 9 }, (_, i) =>
        createFragment(`comp${i}`, [createElement(`elem${i}`, 'div')])
      );

      const model1 = new DocumentModel({
        scope: 'page',
        dom: fragments1,
        javascript: [],
        css: []
      });

      const completeness1 = model1.getTreeCompleteness();
      // Base = max(0.3, 1.0 - (9 * 0.1)) = max(0.3, 0.1) = 0.3

      // Scenario 2: Fewer fragments (3 fragments)
      const fragments2 = Array.from({ length: 3 }, (_, i) =>
        createFragment(`comp${i}`, [createElement(`elem${i}`, 'div')])
      );

      const model2 = new DocumentModel({
        scope: 'page',
        dom: fragments2,
        javascript: [],
        css: []
      });

      const completeness2 = model2.getTreeCompleteness();
      // Base = max(0.3, 1.0 - (3 * 0.1)) = max(0.3, 0.7) = 0.7

      // Scenario 3: Single integrated tree
      const fragment3 = createFragment('app', [
        createElement('elem1', 'div'),
        createElement('elem2', 'div'),
        createElement('elem3', 'div')
      ]);

      const model3 = new DocumentModel({
        scope: 'page',
        dom: [fragment3],
        javascript: [],
        css: []
      });

      const completeness3 = model3.getTreeCompleteness();
      // Base = 0.7 (single fragment)

      // Completeness should improve as fragments merge
      expect(completeness1).toBe(0.3);  // Many fragments
      expect(completeness2).toBe(0.7);  // Fewer fragments
      expect(completeness3).toBe(0.7);  // Single fragment
      expect(completeness1).toBeLessThan(completeness2);
      expect(completeness2).toBeLessThanOrEqual(completeness3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty fragments', () => {
      const emptyFragment = createFragment('empty', []);

      const model = new DocumentModel({
        scope: 'page',
        dom: [emptyFragment],
        javascript: [],
        css: []
      });

      expect(model.getFragmentCount()).toBe(1);
      const allElements = model.dom![0].getAllElements();
      expect(allElements.length).toBeGreaterThanOrEqual(1);  // At least root
    });

    it('should handle mix of empty and non-empty fragments', () => {
      const empty = createFragment('empty', []);
      const nonEmpty = createFragment('app', [createElement('btn', 'button')]);

      const model = new DocumentModel({
        scope: 'page',
        dom: [empty, nonEmpty],
        javascript: [],
        css: []
      });

      expect(model.getFragmentCount()).toBe(2);
    });

    it('should handle deeply nested fragment structure', () => {
      const child3 = createElement('child3', 'span');
      const child2 = createElement('child2', 'div');
      child2.children = [child3];
      child3.parent = child2;

      const child1 = createElement('child1', 'div');
      child1.children = [child2];
      child2.parent = child1;

      const fragment = createFragment('root', [child1]);

      const model = new DocumentModel({
        scope: 'page',
        dom: [fragment],
        javascript: [],
        css: []
      });

      const allElements = model.dom![0].getAllElements();
      expect(allElements.some(el => el.id === 'child3')).toBe(true);
    });
  });
});
