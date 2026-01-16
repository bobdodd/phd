/**
 * Integration tests for DocumentModel
 *
 * These tests verify that the multi-model architecture works correctly:
 * - JSX extraction to DOMModel
 * - JavaScript parsing to ActionLanguageModel
 * - Merging models via selector matching
 * - Cross-file handler detection (eliminating false positives)
 */

import { DocumentModelBuilder, SourceCollection } from '../DocumentModel';

describe('DocumentModel Integration', () => {
  let builder: DocumentModelBuilder;

  beforeEach(() => {
    builder = new DocumentModelBuilder();
  });

  describe('JSX DOM Extraction', () => {
    it('should extract DOM structure from JSX component', () => {
      const sources: SourceCollection = {
        html: `
          function MyComponent() {
            return <button id="submit" className="btn">Submit</button>;
          }
        `,
        javascript: [],
        css: [],
        sourceFiles: {
          html: 'MyComponent.tsx',
          javascript: [],
          css: [],
        },
      };

      const model = builder.build(sources, 'file');

      expect(model.dom).toBeDefined();
      const submitButton = model.getElementById('submit');
      expect(submitButton).toBeDefined();
      expect(submitButton!.tagName).toBe('button');
      expect(submitButton!.attributes.id).toBe('submit');
      expect(submitButton!.attributes.class).toBe('btn');
    });

    it('should handle nested JSX structure', () => {
      const sources: SourceCollection = {
        html: `
          function Modal() {
            return (
              <dialog id="modal">
                <header>
                  <h1>Title</h1>
                </header>
                <main>
                  <p>Content</p>
                </main>
                <footer>
                  <button id="close">Close</button>
                </footer>
              </dialog>
            );
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

      const model = builder.build(sources, 'file');

      const modal = model.getElementById('modal');
      expect(modal).toBeDefined();
      expect(modal!.children).toHaveLength(3); // header, main, footer

      const closeButton = model.getElementById('close');
      expect(closeButton).toBeDefined();
      expect(closeButton!.tagName).toBe('button');
    });
  });

  describe('JavaScript-Only Analysis', () => {
    it('should work without DOM when only analyzing JavaScript', () => {
      const sources: SourceCollection = {
        javascript: [
          `
          const button = document.getElementById('submit');
          button.addEventListener('click', handleClick);
        `,
        ],
        css: [],
        sourceFiles: {
          javascript: ['handlers.js'],
          css: [],
        },
      };

      const model = builder.build(sources, 'file');

      expect(model.dom).toBeUndefined();
      expect(model.javascript).toHaveLength(1);
      expect(model.javascript[0].nodes).toHaveLength(1);
      expect(model.javascript[0].nodes[0].event).toBe('click');
    });
  });

  describe('Cross-File Handler Detection', () => {
    it('should link JavaScript handlers to JSX elements by ID', () => {
      const sources: SourceCollection = {
        html: `
          function MyComponent() {
            return <button id="submit">Submit</button>;
          }
        `,
        javascript: [
          `
          document.getElementById('submit').addEventListener('click', handleClick);
          document.getElementById('submit').addEventListener('keydown', handleKeyDown);
        `,
        ],
        css: [],
        sourceFiles: {
          html: 'MyComponent.tsx',
          javascript: ['handlers.js'],
          css: [],
        },
      };

      const model = builder.build(sources, 'page');

      const submitButton = model.getElementById('submit');
      expect(submitButton).toBeDefined();
      expect(submitButton!.jsHandlers).toBeDefined();
      expect(submitButton!.jsHandlers).toHaveLength(2);
      expect(submitButton!.jsHandlers!.map((h) => h.event)).toEqual([
        'click',
        'keydown',
      ]);
    });

    it('should link handlers split across multiple JavaScript files', () => {
      const sources: SourceCollection = {
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

      const model = builder.build(sources, 'page');

      const submitButton = model.getElementById('submit');
      expect(submitButton!.jsHandlers).toHaveLength(2);

      // This is the key test: handlers from different files are merged
      const clickHandler = submitButton!.jsHandlers!.find((h) => h.event === 'click');
      const keyHandler = submitButton!.jsHandlers!.find((h) => h.event === 'keydown');

      expect(clickHandler).toBeDefined();
      expect(keyHandler).toBeDefined();
      expect(clickHandler!.location.file).toBe('click-handlers.js');
      expect(keyHandler!.location.file).toBe('keyboard-handlers.js');
    });

    it('should link handlers via class selector', () => {
      const sources: SourceCollection = {
        html: `
          function NavItem() {
            return <a className="nav-item" href="/">Home</a>;
          }
        `,
        javascript: [
          `document.querySelector('.nav-item').addEventListener('focus', handleFocus);`,
        ],
        css: [],
        sourceFiles: {
          html: 'NavItem.tsx',
          javascript: ['nav.js'],
          css: [],
        },
      };

      const model = builder.build(sources, 'page');

      const navItems = model.querySelectorAll('.nav-item');
      expect(navItems).toHaveLength(1);
      expect(navItems[0].jsHandlers).toHaveLength(1);
      expect(navItems[0].jsHandlers![0].event).toBe('focus');
    });

    it('should link JSX inline handlers to elements', () => {
      const sources: SourceCollection = {
        html: `
          function Button() {
            return <button onClick={handleClick} onKeyDown={handleKeyDown}>Click me</button>;
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

      const model = builder.build(sources, 'page');

      const buttons = model.querySelectorAll('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0].jsHandlers).toHaveLength(2);
      expect(buttons[0].jsHandlers!.map((h) => h.event)).toEqual([
        'click',
        'keydown',
      ]);
    });
  });

  describe('Element Context', () => {
    it('should generate element context with handler information', () => {
      const sources: SourceCollection = {
        html: `
          function App() {
            return (
              <div>
                <button id="submit">Submit</button>
                <button id="cancel">Cancel</button>
              </div>
            );
          }
        `,
        javascript: [
          `
          document.getElementById('submit').addEventListener('click', handleSubmit);
          document.getElementById('submit').addEventListener('keydown', handleKeyDown);
          document.getElementById('cancel').addEventListener('click', handleCancel);
        `,
        ],
        css: [],
        sourceFiles: {
          html: 'App.tsx',
          javascript: ['handlers.js'],
          css: [],
        },
      };

      const model = builder.build(sources, 'page');

      const submitButton = model.getElementById('submit');
      const submitContext = model.getElementContext(submitButton!);

      expect(submitContext.interactive).toBe(true);
      expect(submitContext.hasClickHandler).toBe(true);
      expect(submitContext.hasKeyboardHandler).toBe(true);
      expect(submitContext.focusable).toBe(true); // button is naturally focusable

      const cancelButton = model.getElementById('cancel');
      const cancelContext = model.getElementContext(cancelButton!);

      expect(cancelContext.hasClickHandler).toBe(true);
      expect(cancelContext.hasKeyboardHandler).toBe(false); // Missing!
    });

    it('should detect focusable elements', () => {
      const sources: SourceCollection = {
        html: `
          function Form() {
            return (
              <form>
                <input type="text" id="name" />
                <button id="submit">Submit</button>
                <div tabIndex="0" id="custom">Custom</div>
                <div id="non-focusable">Not focusable</div>
              </form>
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

      const model = builder.build(sources, 'file');

      const nameInput = model.getElementById('name');
      expect(model.getElementContext(nameInput!).focusable).toBe(true);

      const submitButton = model.getElementById('submit');
      expect(model.getElementContext(submitButton!).focusable).toBe(true);

      const customDiv = model.getElementById('custom');
      expect(model.getElementContext(customDiv!).focusable).toBe(true);

      const nonFocusableDiv = model.getElementById('non-focusable');
      expect(model.getElementContext(nonFocusableDiv!).focusable).toBe(false);
    });
  });

  describe('Accessibility Issue Detection', () => {
    it('should detect elements with click but no keyboard handler', () => {
      const sources: SourceCollection = {
        html: `
          function App() {
            return (
              <div>
                <button id="good">Good Button</button>
                <button id="bad">Bad Button</button>
              </div>
            );
          }
        `,
        javascript: [
          `
          // Good: has both click and keyboard
          document.getElementById('good').addEventListener('click', handleClick);
          document.getElementById('good').addEventListener('keydown', handleKeyDown);

          // Bad: only has click
          document.getElementById('bad').addEventListener('click', handleClick);
        `,
        ],
        css: [],
        sourceFiles: {
          html: 'App.tsx',
          javascript: ['handlers.js'],
          css: [],
        },
      };

      const model = builder.build(sources, 'page');
      const issueElements = model.getElementsWithIssues();

      expect(issueElements).toHaveLength(1);
      expect(issueElements[0].element.attributes.id).toBe('bad');
      expect(issueElements[0].hasClickHandler).toBe(true);
      expect(issueElements[0].hasKeyboardHandler).toBe(false);
    });

    it('should not flag false positive when handlers are in separate files', () => {
      const sources: SourceCollection = {
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
          javascript: ['click.js', 'keyboard.js'],
          css: [],
        },
      };

      const model = builder.build(sources, 'page');
      const issueElements = model.getElementsWithIssues();

      // Should be empty - no false positive!
      expect(issueElements).toHaveLength(0);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle a complete React form component', () => {
      const sources: SourceCollection = {
        html: `
          function LoginForm() {
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');

            return (
              <form id="login-form">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={handleEmailChange} />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} />

                <button id="submit" type="submit">Login</button>
                <button id="cancel" type="button">Cancel</button>
              </form>
            );
          }
        `,
        javascript: [
          `
          const form = document.getElementById('login-form');
          form.addEventListener('submit', handleSubmit);

          const submitButton = document.getElementById('submit');
          submitButton.addEventListener('keydown', handleSubmitKeyDown);

          const cancelButton = document.getElementById('cancel');
          cancelButton.addEventListener('click', handleCancel);
        `,
        ],
        css: [],
        sourceFiles: {
          html: 'LoginForm.tsx',
          javascript: ['form-handlers.js'],
          css: [],
        },
      };

      const model = builder.build(sources, 'page');

      // Verify form structure
      const form = model.getElementById('login-form');
      expect(form).toBeDefined();

      // Verify inputs are focusable
      const emailInput = model.getElementById('email');
      const passwordInput = model.getElementById('password');
      expect(model.getElementContext(emailInput!).focusable).toBe(true);
      expect(model.getElementContext(passwordInput!).focusable).toBe(true);

      // Verify submit button has keyboard support
      const submitButton = model.getElementById('submit');
      const submitContext = model.getElementContext(submitButton!);
      expect(submitContext.hasKeyboardHandler).toBe(true);

      // Verify cancel button is missing keyboard support
      const cancelButton = model.getElementById('cancel');
      const cancelContext = model.getElementContext(cancelButton!);
      expect(cancelContext.hasClickHandler).toBe(true);
      expect(cancelContext.hasKeyboardHandler).toBe(false);
    });
  });
});
