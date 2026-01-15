/**
 * Tests for React Context detection
 */

import { analyzeReactComponent, ContextUsage } from '../ReactPatternDetector';

describe('ReactPatternDetector - Context', () => {
  describe('useContext detection', () => {
    it('should detect useContext hook', () => {
      const code = `
        import { useContext } from 'react';
        import { ThemeContext } from './contexts';

        function MyComponent() {
          const theme = useContext(ThemeContext);
          return <div>Theme: {theme}</div>;
        }
      `;

      const result = analyzeReactComponent(code, 'MyComponent.tsx');

      const contexts = result.contexts.filter((c) => c.type === 'useContext');
      expect(contexts).toHaveLength(1);
      expect(contexts[0].contextName).toBe('ThemeContext');
      expect(contexts[0].metadata?.isAccessibilityRelated).toBe(true); // "theme" is a11y keyword
    });

    it('should detect useContext with destructuring', () => {
      const code = `
        function Component() {
          const { theme, setTheme } = useContext(ThemeContext);
          return <button onClick={() => setTheme('dark')}>Toggle</button>;
        }
      `;

      const result = analyzeReactComponent(code, 'Component.tsx');

      const contexts = result.contexts.filter((c) => c.type === 'useContext');
      expect(contexts).toHaveLength(1);
      expect(contexts[0].metadata?.accessedProperties).toContain('theme');
      expect(contexts[0].metadata?.accessedProperties).toContain('setTheme');
    });

    it('should identify accessibility-related contexts', () => {
      const code = `
        const { announce } = useContext(AccessibilityContext);
        const { focusManager } = useContext(FocusContext);
        const { keyboardMode } = useContext(KeyboardContext);
        const { ariaLabel } = useContext(AriaContext);
      `;

      const result = analyzeReactComponent(code, 'test.tsx');

      const a11yContexts = result.contexts.filter(
        (c) => c.metadata?.isAccessibilityRelated
      );
      expect(a11yContexts).toHaveLength(4);
      expect(a11yContexts.map((c) => c.contextName)).toEqual([
        'AccessibilityContext',
        'FocusContext',
        'KeyboardContext',
        'AriaContext',
      ]);
    });

    it('should not identify non-accessibility contexts', () => {
      const code = `
        const user = useContext(UserContext);
        const data = useContext(DataContext);
      `;

      const result = analyzeReactComponent(code, 'test.tsx');

      const nonA11yContexts = result.contexts.filter(
        (c) => !c.metadata?.isAccessibilityRelated
      );
      expect(nonA11yContexts).toHaveLength(2);
    });
  });

  describe('Context.Provider detection', () => {
    it('should detect Context.Provider in JSX', () => {
      const code = `
        function App() {
          const [theme, setTheme] = useState('light');

          return (
            <ThemeContext.Provider value={{ theme, setTheme }}>
              <Main />
            </ThemeContext.Provider>
          );
        }
      `;

      const result = analyzeReactComponent(code, 'App.tsx');

      const providers = result.contexts.filter((c) => c.type === 'provider');
      expect(providers).toHaveLength(1);
      expect(providers[0].contextName).toBe('ThemeContext');
      expect(providers[0].metadata?.isAccessibilityRelated).toBe(true);
    });

    it('should detect multiple providers', () => {
      const code = `
        function App() {
          return (
            <ThemeContext.Provider value={theme}>
              <FocusContext.Provider value={focusManager}>
                <AccessibilityContext.Provider value={a11yState}>
                  <Main />
                </AccessibilityContext.Provider>
              </FocusContext.Provider>
            </ThemeContext.Provider>
          );
        }
      `;

      const result = analyzeReactComponent(code, 'App.tsx');

      const providers = result.contexts.filter((c) => c.type === 'provider');
      expect(providers).toHaveLength(3);
      expect(providers.map((p) => p.contextName)).toEqual([
        'ThemeContext',
        'FocusContext',
        'AccessibilityContext',
      ]);
      // All three should be identified as a11y-related
      expect(providers.every((p) => p.metadata?.isAccessibilityRelated)).toBe(true);
    });
  });

  describe('Context.Consumer detection', () => {
    it('should detect Context.Consumer in JSX', () => {
      const code = `
        function Component() {
          return (
            <ThemeContext.Consumer>
              {(theme) => <div>Theme: {theme}</div>}
            </ThemeContext.Consumer>
          );
        }
      `;

      const result = analyzeReactComponent(code, 'Component.tsx');

      const consumers = result.contexts.filter((c) => c.type === 'consumer');
      expect(consumers).toHaveLength(1);
      expect(consumers[0].contextName).toBe('ThemeContext');
    });

    it('should detect multiple consumers', () => {
      const code = `
        function Component() {
          return (
            <ThemeContext.Consumer>
              {(theme) => (
                <FocusContext.Consumer>
                  {(focus) => <div>Content</div>}
                </FocusContext.Consumer>
              )}
            </ThemeContext.Consumer>
          );
        }
      `;

      const result = analyzeReactComponent(code, 'Component.tsx');

      const consumers = result.contexts.filter((c) => c.type === 'consumer');
      expect(consumers).toHaveLength(2);
      expect(consumers.map((c) => c.contextName)).toEqual([
        'ThemeContext',
        'FocusContext',
      ]);
    });
  });

  describe('helper methods', () => {
    it('usesContext should return true when context is used', () => {
      const code = `
        function Component() {
          const theme = useContext(ThemeContext);
          return <div />;
        }
      `;

      const { parseSource } = require('../BabelParser');
      const { ReactPatternDetector } = require('../ReactPatternDetector');

      const ast = parseSource(code, 'Component.tsx');
      const detector = new ReactPatternDetector();
      detector.analyze(ast, 'Component.tsx');

      expect(detector.usesContext()).toBe(true);
    });

    it('usesAccessibilityContext should return true for a11y contexts', () => {
      const code = `
        function Component() {
          const { announce } = useContext(AccessibilityContext);
          return <div />;
        }
      `;

      const { parseSource } = require('../BabelParser');
      const { ReactPatternDetector } = require('../ReactPatternDetector');

      const ast = parseSource(code, 'Component.tsx');
      const detector = new ReactPatternDetector();
      detector.analyze(ast, 'Component.tsx');

      expect(detector.usesAccessibilityContext()).toBe(true);
    });

    it('should separate providers and consumers', () => {
      const code = `
        function App() {
          const theme = useContext(ThemeContext);

          return (
            <FocusContext.Provider value={focus}>
              <AccessibilityContext.Consumer>
                {(a11y) => <div />}
              </AccessibilityContext.Consumer>
            </FocusContext.Provider>
          );
        }
      `;

      const { parseSource } = require('../BabelParser');
      const { ReactPatternDetector } = require('../ReactPatternDetector');

      const ast = parseSource(code, 'App.tsx');
      const detector = new ReactPatternDetector();
      detector.analyze(ast, 'App.tsx');

      const providers = detector.getContextProviders();
      const consumers = detector.getContextConsumers();

      expect(providers).toHaveLength(1);
      expect(providers[0].contextName).toBe('FocusContext');

      expect(consumers).toHaveLength(2); // useContext + Consumer
      const consumerNames = consumers.map((c: ContextUsage) => c.contextName);
      expect(consumerNames).toContain('ThemeContext');
      expect(consumerNames).toContain('AccessibilityContext');
    });
  });

  describe('accessibility implications', () => {
    it('should track theme context for dark mode detection', () => {
      const code = `
        function ThemedButton() {
          const { theme } = useContext(ThemeContext);

          return (
            <button
              className={theme === 'dark' ? 'dark-button' : 'light-button'}
              aria-label="Submit"
            >
              Submit
            </button>
          );
        }
      `;

      const result = analyzeReactComponent(code, 'ThemedButton.tsx');

      const themeContexts = result.contexts.filter(
        (c) => c.contextName === 'ThemeContext'
      );
      expect(themeContexts).toHaveLength(1);
      expect(themeContexts[0].metadata?.isAccessibilityRelated).toBe(true);
      expect(themeContexts[0].metadata?.accessedProperties).toContain('theme');
    });

    it('should track announcement context for screen readers', () => {
      const code = `
        function NotificationButton() {
          const { announce } = useContext(AnnouncementContext);

          const handleClick = () => {
            announce('Form submitted successfully');
          };

          return <button onClick={handleClick}>Submit</button>;
        }
      `;

      const result = analyzeReactComponent(code, 'NotificationButton.tsx');

      const contexts = result.contexts.filter(
        (c) => c.contextName === 'AnnouncementContext'
      );
      expect(contexts).toHaveLength(1);
      expect(contexts[0].metadata?.isAccessibilityRelated).toBe(true);
      expect(contexts[0].metadata?.accessedProperties).toContain('announce');
    });

    it('should track focus management context', () => {
      const code = `
        function Dialog() {
          const { trapFocus, releaseFocus } = useContext(FocusContext);

          useEffect(() => {
            trapFocus(dialogRef.current);
            return () => releaseFocus();
          }, []);

          return <div ref={dialogRef} role="dialog">Dialog</div>;
        }
      `;

      const result = analyzeReactComponent(code, 'Dialog.tsx');

      const focusContexts = result.contexts.filter(
        (c) => c.contextName === 'FocusContext'
      );
      expect(focusContexts).toHaveLength(1);
      expect(focusContexts[0].metadata?.isAccessibilityRelated).toBe(true);
      expect(focusContexts[0].metadata?.accessedProperties).toContain('trapFocus');
      expect(focusContexts[0].metadata?.accessedProperties).toContain('releaseFocus');
    });

    it('should track keyboard navigation context', () => {
      const code = `
        function Navigation() {
          const { keyboardMode, setKeyboardMode } = useContext(KeyboardContext);

          useEffect(() => {
            const handler = (e) => {
              if (e.key === 'Tab') {
                setKeyboardMode(true);
              }
            };
            window.addEventListener('keydown', handler);
            return () => window.removeEventListener('keydown', handler);
          }, []);

          return <nav aria-label="Main" className={keyboardMode ? 'keyboard-mode' : ''}>
            <a href="/">Home</a>
          </nav>;
        }
      `;

      const result = analyzeReactComponent(code, 'Navigation.tsx');

      const keyboardContexts = result.contexts.filter(
        (c) => c.contextName === 'KeyboardContext'
      );
      expect(keyboardContexts).toHaveLength(1);
      expect(keyboardContexts[0].metadata?.isAccessibilityRelated).toBe(true);
      expect(keyboardContexts[0].metadata?.accessedProperties).toContain('keyboardMode');
      expect(keyboardContexts[0].metadata?.accessedProperties).toContain(
        'setKeyboardMode'
      );
    });
  });
});
