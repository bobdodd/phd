"use strict";
/**
 * Tests for React ref forwarding and useImperativeHandle detection
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ReactPatternDetector_1 = require("../ReactPatternDetector");
describe('ReactPatternDetector - Ref Forwarding', () => {
    describe('forwardRef detection', () => {
        it('should detect React.forwardRef with component name', () => {
            const code = `
        import React from 'react';

        const Button = React.forwardRef((props, ref) => {
          return <button ref={ref}>Click me</button>;
        });
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'Button.tsx');
            const forwardedRefs = result.refs.filter((r) => r.type === 'forwarded');
            expect(forwardedRefs).toHaveLength(1);
            expect(forwardedRefs[0].refName).toBe('ref');
            expect(forwardedRefs[0].metadata?.componentName).toBe('Button');
        });
        it('should detect forwardRef from named import', () => {
            const code = `
        import { forwardRef } from 'react';

        const Input = forwardRef((props, ref) => {
          return <input ref={ref} type="text" />;
        });
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'Input.tsx');
            const forwardedRefs = result.refs.filter((r) => r.type === 'forwarded');
            expect(forwardedRefs).toHaveLength(1);
            expect(forwardedRefs[0].refName).toBe('ref');
            expect(forwardedRefs[0].metadata?.componentName).toBe('Input');
        });
        it('should detect forwardRef with arrow function', () => {
            const code = `
        const FocusableDiv = React.forwardRef((props, divRef) => (
          <div ref={divRef} tabIndex={0}>
            Focusable
          </div>
        ));
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'FocusableDiv.tsx');
            const forwardedRefs = result.refs.filter((r) => r.type === 'forwarded');
            expect(forwardedRefs).toHaveLength(1);
            expect(forwardedRefs[0].refName).toBe('divRef');
        });
        it('should detect forwardRef with function expression', () => {
            const code = `
        const TextArea = React.forwardRef(function TextArea(props, ref) {
          return <textarea ref={ref} />;
        });
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'TextArea.tsx');
            const forwardedRefs = result.refs.filter((r) => r.type === 'forwarded');
            expect(forwardedRefs).toHaveLength(1);
            expect(forwardedRefs[0].refName).toBe('ref');
        });
        it('should handle components without forwardRef', () => {
            const code = `
        function RegularButton(props) {
          return <button>Click</button>;
        }
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'RegularButton.tsx');
            const forwardedRefs = result.refs.filter((r) => r.type === 'forwarded');
            expect(forwardedRefs).toHaveLength(0);
        });
    });
    describe('useImperativeHandle detection', () => {
        it('should detect useImperativeHandle with exposed methods', () => {
            const code = `
        import React, { useImperativeHandle, useRef } from 'react';

        const FancyInput = React.forwardRef((props, ref) => {
          const inputRef = useRef();

          useImperativeHandle(ref, () => ({
            focus: () => {
              inputRef.current.focus();
            },
            blur: () => {
              inputRef.current.blur();
            }
          }));

          return <input ref={inputRef} />;
        });
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'FancyInput.tsx');
            const imperativeRefs = result.refs.filter((r) => r.type === 'imperative');
            expect(imperativeRefs).toHaveLength(1);
            expect(imperativeRefs[0].refName).toBe('ref');
            expect(imperativeRefs[0].metadata?.exposedMethods).toContain('focus');
            expect(imperativeRefs[0].metadata?.exposedMethods).toContain('blur');
        });
        it('should detect useImperativeHandle with single method', () => {
            const code = `
        const CustomComponent = React.forwardRef((props, ref) => {
          useImperativeHandle(ref, () => ({
            scrollToTop: () => {
              window.scrollTo(0, 0);
            }
          }));

          return <div>Content</div>;
        });
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'CustomComponent.tsx');
            const imperativeRefs = result.refs.filter((r) => r.type === 'imperative');
            expect(imperativeRefs).toHaveLength(1);
            expect(imperativeRefs[0].metadata?.exposedMethods).toContain('scrollToTop');
        });
        it('should handle forwardRef without useImperativeHandle', () => {
            const code = `
        const SimpleButton = React.forwardRef((props, ref) => {
          return <button ref={ref}>Click</button>;
        });
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'SimpleButton.tsx');
            const imperativeRefs = result.refs.filter((r) => r.type === 'imperative');
            expect(imperativeRefs).toHaveLength(0);
            const forwardedRefs = result.refs.filter((r) => r.type === 'forwarded');
            expect(forwardedRefs).toHaveLength(1);
        });
    });
    describe('helper methods', () => {
        it('usesRefForwarding should return true when forwardRef is used', () => {
            const code = `
        const Button = React.forwardRef((props, ref) => (
          <button ref={ref}>Click</button>
        ));
      `;
            const { parseSource } = require('../BabelParser');
            const { ReactPatternDetector } = require('../ReactPatternDetector');
            const ast = parseSource(code, 'Button.tsx');
            const detector = new ReactPatternDetector();
            detector.analyze(ast, 'Button.tsx');
            expect(detector.usesRefForwarding()).toBe(true);
        });
        it('usesImperativeHandle should return true when useImperativeHandle is used', () => {
            const code = `
        const Input = React.forwardRef((props, ref) => {
          useImperativeHandle(ref, () => ({
            focus: () => {}
          }));
          return <input />;
        });
      `;
            const { parseSource } = require('../BabelParser');
            const { ReactPatternDetector } = require('../ReactPatternDetector');
            const ast = parseSource(code, 'Input.tsx');
            const detector = new ReactPatternDetector();
            detector.analyze(ast, 'Input.tsx');
            expect(detector.usesImperativeHandle()).toBe(true);
        });
        it('should return forwarded refs separately', () => {
            const code = `
        const ComponentA = React.forwardRef((props, ref) => (
          <div ref={ref} />
        ));

        const ComponentB = React.forwardRef((props, anotherRef) => (
          <span ref={anotherRef} />
        ));
      `;
            const { parseSource } = require('../BabelParser');
            const { ReactPatternDetector } = require('../ReactPatternDetector');
            const ast = parseSource(code, 'Components.tsx');
            const detector = new ReactPatternDetector();
            detector.analyze(ast, 'Components.tsx');
            const forwardedRefs = detector.getForwardedRefs();
            expect(forwardedRefs).toHaveLength(2);
            expect(forwardedRefs[0].refName).toBe('ref');
            expect(forwardedRefs[1].refName).toBe('anotherRef');
        });
    });
    describe('accessibility implications', () => {
        it('should track ref forwarding for focus management analysis', () => {
            const code = `
        const Dialog = React.forwardRef((props, ref) => {
          const closeButtonRef = useRef();

          useEffect(() => {
            // Focus close button when dialog opens
            closeButtonRef.current.focus();
          }, []);

          return (
            <div ref={ref} role="dialog">
              <button ref={closeButtonRef}>Close</button>
            </div>
          );
        });
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'Dialog.tsx');
            // Should detect ref forwarding
            const forwardedRefs = result.refs.filter((r) => r.type === 'forwarded');
            expect(forwardedRefs).toHaveLength(1);
            // Should also detect focus management
            expect(result.focusManagement).toHaveLength(1);
            expect(result.focusManagement[0].actionType).toBe('focusChange');
        });
        it('should detect imperative focus control patterns', () => {
            const code = `
        const AccessibleInput = React.forwardRef((props, ref) => {
          const inputRef = useRef();

          useImperativeHandle(ref, () => ({
            focus: () => inputRef.current.focus(),
            blur: () => inputRef.current.blur(),
            select: () => inputRef.current.select()
          }));

          return <input ref={inputRef} aria-label="Search" />;
        });
      `;
            const result = (0, ReactPatternDetector_1.analyzeReactComponent)(code, 'AccessibleInput.tsx');
            const imperativeRefs = result.refs.filter((r) => r.type === 'imperative');
            expect(imperativeRefs).toHaveLength(1);
            expect(imperativeRefs[0].metadata?.exposedMethods).toContain('focus');
            expect(imperativeRefs[0].metadata?.exposedMethods).toContain('blur');
            expect(imperativeRefs[0].metadata?.exposedMethods).toContain('select');
        });
    });
});
//# sourceMappingURL=ReactPatternDetector.refForwarding.test.js.map