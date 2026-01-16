/**
 * Unit tests for JavaScriptParser
 *
 * Tests the parser's ability to extract ActionLanguage nodes from:
 * - Vanilla JavaScript event handlers
 * - JSX event handlers (React)
 * - TypeScript code
 * - ARIA updates
 * - Focus management
 */

import { JavaScriptParser } from '../JavaScriptParser';

describe('JavaScriptParser', () => {
  let parser: JavaScriptParser;

  beforeEach(() => {
    parser = new JavaScriptParser();
  });

  describe('Vanilla JavaScript event handlers', () => {
    it('should extract addEventListener with string literal event', () => {
      const source = `
        const button = document.getElementById('submit');
        button.addEventListener('click', handleClick);
      `;

      const model = parser.parse(source, 'test.js');
      const nodes = model.nodes;

      expect(nodes).toHaveLength(1);
      expect(nodes[0].actionType).toBe('eventHandler');
      expect(nodes[0].event).toBe('click');
      expect(nodes[0].element.selector).toBe('#submit');
      expect(nodes[0].metadata.framework).toBe('vanilla');
    });

    it('should extract multiple event handlers', () => {
      const source = `
        const button = document.getElementById('submit');
        button.addEventListener('click', handleClick);
        button.addEventListener('keydown', handleKeyDown);
      `;

      const model = parser.parse(source, 'test.js');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(2);
      expect(nodes[0].event).toBe('click');
      expect(nodes[1].event).toBe('keydown');
    });

    it('should extract querySelector event handler', () => {
      const source = `
        const navItem = document.querySelector('.nav-item');
        navItem.addEventListener('focus', handleFocus);
      `;

      const model = parser.parse(source, 'test.js');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].element.selector).toBe('.nav-item');
    });
  });

  describe('JSX event handlers', () => {
    it('should extract onClick handler from JSX', () => {
      const source = `
        function MyComponent() {
          return <button onClick={handleClick}>Click me</button>;
        }
      `;

      const model = parser.parse(source, 'MyComponent.tsx');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].actionType).toBe('eventHandler');
      expect(nodes[0].event).toBe('click');
      expect(nodes[0].element.selector).toBe('button');
      expect(nodes[0].metadata.framework).toBe('react');
      expect(nodes[0].metadata.synthetic).toBe(true);
    });

    it('should extract onKeyDown handler from JSX', () => {
      const source = `
        function Dialog() {
          return <dialog onKeyDown={handleKeyDown}>Content</dialog>;
        }
      `;

      const model = parser.parse(source, 'Dialog.tsx');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].event).toBe('keydown');
      expect(nodes[0].element.selector).toBe('dialog');
    });

    it('should extract multiple JSX event handlers', () => {
      const source = `
        function Modal() {
          return (
            <div
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
            >
              Content
            </div>
          );
        }
      `;

      const model = parser.parse(source, 'Modal.tsx');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(3);
      expect(nodes.map(n => n.event)).toEqual(['click', 'keydown', 'focus']);
    });
  });

  describe('TypeScript support', () => {
    it('should parse TypeScript with type annotations', () => {
      const source = `
        const button: HTMLButtonElement = document.getElementById('submit') as HTMLButtonElement;
        button.addEventListener('click', (e: MouseEvent) => {
          console.log('clicked');
        });
      `;

      const model = parser.parse(source, 'test.ts');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].event).toBe('click');
    });

    it('should parse TSX with interface props', () => {
      const source = `
        interface Props {
          onClick: () => void;
        }

        function Button({ onClick }: Props) {
          return <button onClick={onClick}>Click me</button>;
        }
      `;

      const model = parser.parse(source, 'Button.tsx');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].event).toBe('click');
    });
  });

  describe('ARIA updates', () => {
    it('should extract setAttribute with aria attribute', () => {
      const source = `
        const button = document.getElementById('toggle');
        button.setAttribute('aria-expanded', 'true');
      `;

      const model = parser.parse(source, 'test.js');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].actionType).toBe('ariaStateChange');
      expect(nodes[0].element.selector).toBe('#toggle');
      expect(nodes[0].metadata.attribute).toBe('aria-expanded');
    });

    it('should not extract non-ARIA setAttribute', () => {
      const source = `
        const div = document.getElementById('container');
        div.setAttribute('class', 'active');
      `;

      const model = parser.parse(source, 'test.js');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(0);
    });
  });

  describe('Focus management', () => {
    it('should extract focus() call', () => {
      const source = `
        const input = document.getElementById('email');
        input.focus();
      `;

      const model = parser.parse(source, 'test.js');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].actionType).toBe('focusChange');
      expect(nodes[0].element.selector).toBe('#email');
      expect(nodes[0].metadata.method).toBe('focus');
    });

    it('should extract blur() call', () => {
      const source = `
        const button = document.getElementById('submit');
        button.blur();
      `;

      const model = parser.parse(source, 'test.js');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].actionType).toBe('focusChange');
      expect(nodes[0].metadata.method).toBe('blur');
    });

    it('should extract ref-based focus in React', () => {
      const source = `
        function Component() {
          const buttonRef = useRef(null);
          buttonRef.current.focus();
        }
      `;

      const model = parser.parse(source, 'Component.tsx');

      const nodes = model.nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].actionType).toBe('focusChange');
      expect(nodes[0].element.selector).toBe('[ref="buttonRef"]');
      expect(nodes[0].element.binding).toBe('buttonRef');
    });
  });

  describe('Source locations', () => {
    it('should preserve source locations', () => {
      const source = `
        const button = document.getElementById('submit');
        button.addEventListener('click', handleClick);
      `;

      const model = parser.parse(source, 'test.js');
      const nodes = model.nodes;

      expect(nodes[0].location.file).toBe('test.js');
      expect(nodes[0].location.line).toBeGreaterThan(0);
      expect(nodes[0].location.column).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty source', () => {
      const model = parser.parse('', 'empty.js');
      const nodes = model.nodes;
      expect(nodes).toHaveLength(0);
    });

    it('should handle source with no event handlers', () => {
      const source = `
        const x = 42;
        console.log(x);
      `;

      const model = parser.parse(source, 'test.js');
      const nodes = model.nodes;
      expect(nodes).toHaveLength(0);
    });

    it('should handle malformed addEventListener (missing arguments)', () => {
      const source = `
        const button = document.getElementById('submit');
        button.addEventListener();
      `;

      const model = parser.parse(source, 'test.js');
      const nodes = model.nodes;
      expect(nodes).toHaveLength(0);
    });
  });
});
