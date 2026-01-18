/**
 * Tests for ReactHooksA11yAnalyzer
 */

import { ReactHooksA11yAnalyzer } from '../ReactHooksA11yAnalyzer';

describe('ReactHooksA11yAnalyzer', () => {
  let analyzer: ReactHooksA11yAnalyzer;

  beforeEach(() => {
    analyzer = new ReactHooksA11yAnalyzer();
  });

  describe('useEffect focus management', () => {
    it('should detect useEffect with focus() but no cleanup', () => {
      const source = `
        function MyComponent() {
          const myRef = useRef(null);

          useEffect(() => {
            myRef.current.focus();
          }, []);

          return <div ref={myRef}>Hello</div>;
        }
      `;

      const issues = analyzer.analyze(source, 'MyComponent.tsx');

      // Should detect focus cleanup issue (and possibly ARIA warning)
      expect(issues.length).toBeGreaterThanOrEqual(1);
      const focusIssue = issues.find(i => i.type === 'react-hooks-useeffect-focus-cleanup');
      expect(focusIssue).toBeDefined();
      expect(focusIssue?.severity).toBe('warning');
      expect(focusIssue?.message).toContain('lacks a cleanup function');
      expect(focusIssue?.wcagCriteria).toContain('2.1.1');
    });

    it('should not flag useEffect with proper cleanup', () => {
      const source = `
        function MyComponent() {
          const myRef = useRef(null);

          useEffect(() => {
            const prev = document.activeElement;
            myRef.current.focus();

            return () => {
              prev.focus();
            };
          }, []);

          return <div ref={myRef} aria-label="Content">Hello</div>;
        }
      `;

      const issues = analyzer.analyze(source, 'MyComponent.tsx');

      // Should not detect useEffect cleanup issue (has cleanup and ARIA)
      expect(issues.filter(i => i.type === 'react-hooks-useeffect-focus-cleanup')).toHaveLength(0);
    });

    it('should detect useEffect with addEventListener but no cleanup', () => {
      const source = `
        function MyComponent() {
          useEffect(() => {
            document.addEventListener('keydown', handleKeyDown);
          }, []);

          return <div>Hello</div>;
        }
      `;

      const issues = analyzer.analyze(source, 'MyComponent.tsx');

      expect(issues.some(i => i.type === 'react-hooks-useeffect-listener-cleanup')).toBe(true);
      const issue = issues.find(i => i.type === 'react-hooks-useeffect-listener-cleanup');
      expect(issue?.severity).toBe('error');
      expect(issue?.message).toContain('cleanup function');
    });
  });

  describe('useRef focus trap patterns', () => {
    it('should detect focus trap without keyboard handlers', () => {
      const source = `
        function Modal() {
          const modalRef = useRef(null);

          useEffect(() => {
            modalRef.current.focus();
            const focusable = modalRef.current.querySelectorAll('button, a');
          }, []);

          return <div ref={modalRef}>Modal content</div>;
        }
      `;

      const issues = analyzer.analyze(source, 'Modal.tsx');

      expect(issues.some(i => i.type === 'react-hooks-useref-focus-trap')).toBe(true);
      const issue = issues.find(i => i.type === 'react-hooks-useref-focus-trap');
      expect(issue?.severity).toBe('error');
      expect(issue?.message).toContain('keyboard event handlers');
      expect(issue?.wcagCriteria).toContain('2.1.1');
    });

    it('should not flag focus trap with proper keyboard handling', () => {
      const source = `
        function Modal() {
          const modalRef = useRef(null);

          useEffect(() => {
            const handleKeyDown = (e) => {
              if (e.key === 'Tab') {
                // Tab handling
              }
              if (e.key === 'Escape') {
                closeModal();
              }
            };

            const modal = modalRef.current;
            modal.addEventListener('keydown', handleKeyDown);
            const focusable = modal.querySelectorAll('button, a');
            focusable[0].focus();

            return () => modal.removeEventListener('keydown', handleKeyDown);
          }, []);

          return <div ref={modalRef} onKeyDown={handleKeyDown}>Modal</div>;
        }
      `;

      const issues = analyzer.analyze(source, 'Modal.tsx');

      expect(issues.some(i => i.type === 'react-hooks-useref-focus-trap')).toBe(false);
    });

    it('should warn about programmatic focus without ARIA', () => {
      const source = `
        function Component() {
          const ref = useRef(null);

          useEffect(() => {
            ref.current.focus();
          }, []);

          return <div ref={ref}>Content</div>;
        }
      `;

      const issues = analyzer.analyze(source, 'Component.tsx');

      expect(issues.some(i => i.type === 'react-hooks-useref-focus-aria')).toBe(true);
      const issue = issues.find(i => i.type === 'react-hooks-useref-focus-aria');
      expect(issue?.message).toContain('ARIA label');
      expect(issue?.wcagCriteria).toContain('4.1.2');
    });
  });

  describe('useContext accessibility patterns', () => {
    it('should detect accessibility context without live regions', () => {
      const source = `
        function Component() {
          const a11yContext = useContext(AccessibilityContext);

          return (
            <div aria-label={a11yContext.label}>
              {a11yContext.message}
            </div>
          );
        }
      `;

      const issues = analyzer.analyze(source, 'Component.tsx');

      expect(issues.some(i => i.type === 'react-hooks-usecontext-announcements')).toBe(true);
      const issue = issues.find(i => i.type === 'react-hooks-usecontext-announcements');
      expect(issue?.message).toContain('ARIA live region');
      expect(issue?.wcagCriteria).toContain('4.1.3');
    });

    it('should not flag context with aria-live region', () => {
      const source = `
        function Component() {
          const a11yContext = useContext(AccessibilityContext);

          return (
            <>
              <div aria-label={a11yContext.label}>Content</div>
              <div aria-live="polite">{a11yContext.announcement}</div>
            </>
          );
        }
      `;

      const issues = analyzer.analyze(source, 'Component.tsx');

      expect(issues.some(i => i.type === 'react-hooks-usecontext-announcements')).toBe(false);
    });
  });

  describe('useState ARIA patterns', () => {
    it('should warn about toggle state without aria-expanded', () => {
      const source = `
        function Dropdown() {
          const [isOpen, setIsOpen] = useState(false);

          return (
            <button onClick={() => setIsOpen(!isOpen)}>
              Toggle
            </button>
          );
        }
      `;

      const issues = analyzer.analyze(source, 'Dropdown.tsx');

      expect(issues.some(i => i.type === 'react-hooks-usestate-aria-expanded')).toBe(true);
      const issue = issues.find(i => i.type === 'react-hooks-usestate-aria-expanded');
      expect(issue?.message).toContain('aria-expanded');
      expect(issue?.wcagCriteria).toContain('4.1.2');
    });

    it('should not flag toggle state with aria-expanded', () => {
      const source = `
        function Dropdown() {
          const [isOpen, setIsOpen] = useState(false);

          return (
            <button
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              Toggle
            </button>
          );
        }
      `;

      const issues = analyzer.analyze(source, 'Dropdown.tsx');

      expect(issues.some(i => i.type === 'react-hooks-usestate-aria-expanded')).toBe(false);
    });

    it('should detect state used for ARIA without proper updates', () => {
      const source = `
        function Component() {
          const [label] = useState('');

          return <div aria-label={label}>Content</div>;
        }
      `;

      const issues = analyzer.analyze(source, 'Component.tsx');

      // This should produce a warning about ARIA state updates (no setter defined)
      expect(issues.some(i => i.type === 'react-hooks-usestate-aria-updates')).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple hooks in one component', () => {
      const source = `
        function ComplexModal() {
          const [isOpen, setIsOpen] = useState(false);
          const modalRef = useRef(null);
          const a11yContext = useContext(AccessibilityContext);

          useEffect(() => {
            if (isOpen) {
              modalRef.current.focus();
            }
          }, [isOpen]);

          return (
            <div ref={modalRef} aria-label={a11yContext.label}>
              <button onClick={() => setIsOpen(!isOpen)}>
                Toggle
              </button>
            </div>
          );
        }
      `;

      const issues = analyzer.analyze(source, 'ComplexModal.tsx');

      // Should detect multiple issues:
      // - useEffect focus without cleanup
      // - Toggle state without aria-expanded
      // - Context without live region
      expect(issues.length).toBeGreaterThan(0);
    });

    it('should handle Navigation component from paradise-website', () => {
      const source = `
        function Dropdown({ title, links }) {
          const [isOpen, setIsOpen] = useState(false);

          const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          };

          return (
            <div>
              <button
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
              >
                {title}
              </button>
              {isOpen && (
                <div>{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
              )}
            </div>
          );
        }
      `;

      const issues = analyzer.analyze(source, 'Dropdown.tsx');

      // This is a well-implemented dropdown with proper ARIA
      // Should have minimal or no issues
      expect(issues.filter(i => i.severity === 'error')).toHaveLength(0);
    });
  });
});
