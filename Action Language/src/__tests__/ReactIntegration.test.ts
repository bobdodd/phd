/**
 * Comprehensive Integration Tests for React Accessibility Analysis
 *
 * Tests multiple analyzers working together on complete React components
 * to ensure all detection systems integrate correctly.
 */

import { ReactPortalAnalyzer } from '../analyzers/ReactPortalAnalyzer';
import { ReactStopPropagationAnalyzer } from '../analyzers/ReactStopPropagationAnalyzer';
import { analyzeReactComponent } from '../parsers/ReactPatternDetector';

describe('React Accessibility Integration Tests', () => {
  describe('Modal Component with Multiple Patterns', () => {
    it('should detect portal, focus management, and keyboard issues in modal', () => {
      const code = `
        import React, { useEffect, useRef, useContext } from 'react';
        import ReactDOM from 'react-dom';

        function Modal({ isOpen, onClose }) {
          const closeButtonRef = useRef();
          const { announce } = useContext(AccessibilityContext);

          useEffect(() => {
            if (isOpen) {
              // Focus management
              closeButtonRef.current.focus();

              // Announce to screen readers
              announce('Modal opened');

              return () => {
                announce('Modal closed');
              };
            }
          }, [isOpen]);

          const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
              onClose();
            }
            // ISSUE: Using stopPropagation
            e.stopPropagation();
          };

          if (!isOpen) return null;

          return ReactDOM.createPortal(
            <div
              role="dialog"
              aria-modal="true"
              onKeyDown={handleKeyDown}
            >
              <h2>Modal Title</h2>
              <button ref={closeButtonRef} onClick={onClose}>
                Close
              </button>
            </div>,
            document.getElementById('modal-root')
          );
        }
      `;

      // Analyze with ReactPatternDetector
      const analysis = analyzeReactComponent(code, 'Modal.tsx');

      // Should detect portal
      expect(analysis.portals).toHaveLength(1);
      expect(analysis.portals[0].container).toBe('#modal-root');

      // Should detect accessibility context usage
      expect(analysis.contexts).toHaveLength(1);
      expect(analysis.contexts[0].contextName).toBe('AccessibilityContext');
      expect(analysis.contexts[0].metadata?.isAccessibilityRelated).toBe(true);
      expect(analysis.contexts[0].metadata?.accessedProperties).toContain('announce');

      // Should detect ref-based focus management
      expect(analysis.focusManagement).toHaveLength(1);
      expect(analysis.focusManagement[0].actionType).toBe('focusChange');

      // Should detect stopPropagation issue
      expect(analysis.syntheticEvents).toHaveLength(1);
      expect(analysis.syntheticEvents[0].methodsCalled).toContain('stopPropagation');
      expect(analysis.syntheticEvents[0].accessibilityConcerns).toHaveLength(1);

      // Run analyzers
      const portalAnalyzer = new ReactPortalAnalyzer();
      const portalIssues = portalAnalyzer.analyze(code, 'Modal.tsx');
      expect(portalIssues).toHaveLength(1);
      expect(portalIssues[0].wcagCriteria).toContain('2.1.1'); // Keyboard
      expect(portalIssues[0].wcagCriteria).toContain('2.4.3'); // Focus Order

      const stopPropAnalyzer = new ReactStopPropagationAnalyzer();
      const stopPropIssues = stopPropAnalyzer.analyze(code, 'Modal.tsx');
      expect(stopPropIssues).toHaveLength(1);
      expect(stopPropIssues[0].severity).toBe('warning');
      expect(stopPropIssues[0].wcagCriteria).toContain('2.1.1'); // Keyboard
    });
  });

  describe('Accessible Dialog with ForwardRef', () => {
    it('should detect ref forwarding and imperative handle for focus control', () => {
      const code = `
        import React, { useRef, useImperativeHandle } from 'react';

        const Dialog = React.forwardRef((props, ref) => {
          const dialogRef = useRef();
          const closeButtonRef = useRef();

          useImperativeHandle(ref, () => ({
            open: () => {
              dialogRef.current.showModal();
              closeButtonRef.current.focus();
            },
            close: () => {
              dialogRef.current.close();
            },
            focus: () => {
              closeButtonRef.current.focus();
            }
          }));

          return (
            <dialog ref={dialogRef} role="dialog" aria-modal="true">
              <h2>{props.title}</h2>
              <button ref={closeButtonRef} onClick={props.onClose}>
                Close
              </button>
            </dialog>
          );
        });
      `;

      const analysis = analyzeReactComponent(code, 'Dialog.tsx');

      // Should detect forwardRef
      const forwardedRefs = analysis.refs.filter((r) => r.type === 'forwarded');
      expect(forwardedRefs).toHaveLength(1);
      expect(forwardedRefs[0].refName).toBe('ref');
      expect(forwardedRefs[0].metadata?.componentName).toBe('Dialog');

      // Should detect useImperativeHandle with exposed methods
      const imperativeRefs = analysis.refs.filter((r) => r.type === 'imperative');
      expect(imperativeRefs).toHaveLength(1);
      expect(imperativeRefs[0].metadata?.exposedMethods).toContain('open');
      expect(imperativeRefs[0].metadata?.exposedMethods).toContain('close');
      expect(imperativeRefs[0].metadata?.exposedMethods).toContain('focus');

      // Should detect focus management
      expect(analysis.focusManagement.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Provider with Context', () => {
    it('should detect context provider and consumer for theme accessibility', () => {
      const code = `
        import React, { useState, useContext } from 'react';

        function ThemeProvider({ children }) {
          const [theme, setTheme] = useState('light');

          return (
            <ThemeContext.Provider value={{ theme, setTheme }}>
              {children}
            </ThemeContext.Provider>
          );
        }

        function ThemedButton() {
          const { theme, setTheme } = useContext(ThemeContext);
          const { focusMode } = useContext(KeyboardContext);

          const handleClick = () => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          };

          return (
            <button
              onClick={handleClick}
              className={\`btn \${theme} \${focusMode ? 'focus-visible' : ''}\`}
              aria-label={\`Toggle theme, current: \${theme}\`}
            >
              Toggle Theme
            </button>
          );
        }
      `;

      const analysis = analyzeReactComponent(code, 'ThemeProvider.tsx');

      // Should detect provider
      const providers = analysis.contexts.filter((c) => c.type === 'provider');
      expect(providers).toHaveLength(1);
      expect(providers[0].contextName).toBe('ThemeContext');
      expect(providers[0].metadata?.isAccessibilityRelated).toBe(true);

      // Should detect consumers
      const consumers = analysis.contexts.filter((c) => c.type === 'useContext');
      expect(consumers).toHaveLength(2);

      const themeConsumer = consumers.find((c) => c.contextName === 'ThemeContext');
      expect(themeConsumer).toBeDefined();
      expect(themeConsumer?.metadata?.accessedProperties).toContain('theme');
      expect(themeConsumer?.metadata?.accessedProperties).toContain('setTheme');
      expect(themeConsumer?.metadata?.isAccessibilityRelated).toBe(true);

      const keyboardConsumer = consumers.find((c) => c.contextName === 'KeyboardContext');
      expect(keyboardConsumer).toBeDefined();
      expect(keyboardConsumer?.metadata?.accessedProperties).toContain('focusMode');
      expect(keyboardConsumer?.metadata?.isAccessibilityRelated).toBe(true);
    });
  });

  describe('Tooltip with Portal and stopPropagation', () => {
    it('should detect multiple accessibility issues in tooltip', () => {
      const code = `
        import { createPortal } from 'react-dom';

        function Tooltip({ content, targetElement }) {
          const handleMouseEnter = (e) => {
            e.stopPropagation();
            showTooltip();
          };

          const handleMouseLeave = (e) => {
            e.stopImmediatePropagation();
            hideTooltip();
          };

          return createPortal(
            <div
              role="tooltip"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {content}
            </div>,
            targetElement
          );
        }
      `;

      const analysis = analyzeReactComponent(code, 'Tooltip.tsx');

      // Should detect portal
      expect(analysis.portals).toHaveLength(1);
      expect(analysis.portals[0].container).toBe('targetElement');

      // Should detect both stopPropagation and stopImmediatePropagation
      expect(analysis.syntheticEvents).toHaveLength(2);

      const stopPropEvent = analysis.syntheticEvents.find((e) =>
        e.methodsCalled.includes('stopPropagation')
      );
      expect(stopPropEvent).toBeDefined();

      const stopImmediateEvent = analysis.syntheticEvents.find((e) =>
        e.methodsCalled.includes('stopImmediatePropagation')
      );
      expect(stopImmediateEvent).toBeDefined();

      // Run analyzers
      const portalAnalyzer = new ReactPortalAnalyzer();
      const portalIssues = portalAnalyzer.analyze(code, 'Tooltip.tsx');
      expect(portalIssues).toHaveLength(1);

      const stopPropAnalyzer = new ReactStopPropagationAnalyzer();
      const stopPropIssues = stopPropAnalyzer.analyze(code, 'Tooltip.tsx');
      expect(stopPropIssues).toHaveLength(2);

      // stopImmediatePropagation should be error severity
      const immediateIssue = stopPropIssues.find((i) =>
        i.syntheticEvent.methodsCalled.includes('stopImmediatePropagation')
      );
      expect(immediateIssue?.severity).toBe('error');

      // stopPropagation should be warning severity
      const regularIssue = stopPropIssues.find((i) =>
        i.syntheticEvent.methodsCalled.includes('stopPropagation') &&
        !i.syntheticEvent.methodsCalled.includes('stopImmediatePropagation')
      );
      expect(regularIssue?.severity).toBe('warning');
    });
  });

  describe('Dropdown Menu with Focus Management', () => {
    it('should track focus management across refs and context', () => {
      const code = `
        import React, { useRef, useEffect, useContext } from 'react';

        function Dropdown({ isOpen, onClose }) {
          const menuRef = useRef();
          const firstItemRef = useRef();
          const { trapFocus, releaseFocus } = useContext(FocusContext);

          useEffect(() => {
            if (isOpen) {
              trapFocus(menuRef.current);
              firstItemRef.current.focus();

              return () => {
                releaseFocus();
              };
            }
          }, [isOpen]);

          const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
              onClose();
            } else if (e.key === 'ArrowDown') {
              // Navigate to next item
              e.preventDefault();
            } else if (e.key === 'ArrowUp') {
              // Navigate to previous item
              e.preventDefault();
            }
          };

          return (
            <ul
              ref={menuRef}
              role="menu"
              onKeyDown={handleKeyDown}
            >
              <li role="menuitem" ref={firstItemRef} tabIndex={0}>
                Item 1
              </li>
              <li role="menuitem" tabIndex={-1}>
                Item 2
              </li>
            </ul>
          );
        }
      `;

      const analysis = analyzeReactComponent(code, 'Dropdown.tsx');

      // Should detect multiple useRef hooks
      const refHooks = analysis.hooks.filter((h) => h.hookName === 'useRef');
      expect(refHooks.length).toBeGreaterThanOrEqual(2);

      // Should detect focus management
      expect(analysis.focusManagement.length).toBeGreaterThan(0);
      const focusActions = analysis.focusManagement.filter(
        (f) => f.actionType === 'focusChange'
      );
      expect(focusActions.length).toBeGreaterThan(0);

      // Should detect FocusContext usage
      const focusContext = analysis.contexts.find(
        (c) => c.contextName === 'FocusContext'
      );
      expect(focusContext).toBeDefined();
      expect(focusContext?.metadata?.isAccessibilityRelated).toBe(true);
      expect(focusContext?.metadata?.accessedProperties).toContain('trapFocus');
      expect(focusContext?.metadata?.accessedProperties).toContain('releaseFocus');

      // Should detect preventDefault (not stopPropagation)
      expect(analysis.syntheticEvents.length).toBeGreaterThan(0);
      const preventDefaultEvents = analysis.syntheticEvents.filter((e) =>
        e.methodsCalled.includes('preventDefault')
      );
      expect(preventDefaultEvents.length).toBeGreaterThan(0);

      // Should NOT have stopPropagation issues
      const stopPropAnalyzer = new ReactStopPropagationAnalyzer();
      const stopPropIssues = stopPropAnalyzer.analyze(code, 'Dropdown.tsx');
      expect(stopPropIssues).toHaveLength(0); // No issues - preventDefault is fine
    });
  });

  describe('Accessible Form with Multiple Hooks', () => {
    it('should detect state management and focus patterns', () => {
      const code = `
        import React, { useState, useRef, useCallback, useMemo } from 'react';

        function AccessibleForm({ onSubmit }) {
          const [formData, setFormData] = useState({ name: '', email: '' });
          const [errors, setErrors] = useState({});
          const firstErrorRef = useRef();

          const validateForm = useCallback(() => {
            const newErrors = {};
            if (!formData.name) newErrors.name = 'Name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            return newErrors;
          }, [formData]);

          const hasErrors = useMemo(() => {
            return Object.keys(errors).length > 0;
          }, [errors]);

          const handleSubmit = (e) => {
            e.preventDefault();

            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
              setErrors(validationErrors);
              // Focus first error
              firstErrorRef.current?.focus();
            } else {
              onSubmit(formData);
            }
          };

          return (
            <form onSubmit={handleSubmit} aria-label="Contact form">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  ref={errors.name ? firstErrorRef : null}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span id="name-error" role="alert">{errors.name}</span>
                )}
              </div>
              <button type="submit">Submit</button>
            </form>
          );
        }
      `;

      const analysis = analyzeReactComponent(code, 'AccessibleForm.tsx');

      // Should detect useState
      const stateHooks = analysis.hooks.filter((h) => h.hookName === 'useState');
      expect(stateHooks.length).toBeGreaterThanOrEqual(2);

      // Should detect useCallback
      const callbackHooks = analysis.hooks.filter((h) => h.hookName === 'useCallback');
      expect(callbackHooks).toHaveLength(1);

      // Should detect useMemo
      const memoHooks = analysis.hooks.filter((h) => h.hookName === 'useMemo');
      expect(memoHooks).toHaveLength(1);

      // Should detect useRef
      const refHooks = analysis.hooks.filter((h) => h.hookName === 'useRef');
      expect(refHooks.length).toBeGreaterThan(0);

      // Should detect preventDefault (form submission)
      const preventDefaultEvents = analysis.syntheticEvents.filter((e) =>
        e.methodsCalled.includes('preventDefault')
      );
      expect(preventDefaultEvents.length).toBeGreaterThan(0);

      // Should NOT have stopPropagation issues
      const stopPropAnalyzer = new ReactStopPropagationAnalyzer();
      const issues = stopPropAnalyzer.analyze(code, 'AccessibleForm.tsx');
      expect(issues).toHaveLength(0);
    });
  });

  describe('Announcement System with Context', () => {
    it('should detect announcement context for screen readers', () => {
      const code = `
        import React, { useContext } from 'react';

        function NotificationButton() {
          const { announce } = useContext(AnnouncementContext);
          const { notificationQueue } = useContext(NotificationContext);
          const { ariaLive } = useContext(AriaContext);

          const handleClick = (e) => {
            announce('Form submitted successfully', 'polite');
            // ISSUE: stopPropagation
            e.stopPropagation();
          };

          return (
            <button
              onClick={handleClick}
              aria-live={ariaLive}
            >
              Submit
            </button>
          );
        }
      `;

      const analysis = analyzeReactComponent(code, 'NotificationButton.tsx');

      // Should detect multiple accessibility contexts
      const a11yContexts = analysis.contexts.filter(
        (c) => c.metadata?.isAccessibilityRelated
      );
      expect(a11yContexts.length).toBe(3);

      // Verify specific contexts
      const announcementContext = analysis.contexts.find(
        (c) => c.contextName === 'AnnouncementContext'
      );
      expect(announcementContext).toBeDefined();
      expect(announcementContext?.metadata?.accessedProperties).toContain('announce');

      const notificationContext = analysis.contexts.find(
        (c) => c.contextName === 'NotificationContext'
      );
      expect(notificationContext).toBeDefined();

      const ariaContext = analysis.contexts.find(
        (c) => c.contextName === 'AriaContext'
      );
      expect(ariaContext).toBeDefined();
      expect(ariaContext?.metadata?.accessedProperties).toContain('ariaLive');

      // Should detect stopPropagation issue
      const stopPropAnalyzer = new ReactStopPropagationAnalyzer();
      const issues = stopPropAnalyzer.analyze(code, 'NotificationButton.tsx');
      expect(issues).toHaveLength(1);
    });
  });

  describe('Complex Component with All Patterns', () => {
    it('should handle component using all React patterns together', () => {
      const code = `
        import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
        import { createPortal } from 'react-dom';

        const AccessibleModal = React.forwardRef((props, ref) => {
          const [isVisible, setIsVisible] = useState(false);
          const modalRef = useRef();
          const { theme } = useContext(ThemeContext);
          const { announce } = useContext(AccessibilityContext);
          const { trapFocus } = useContext(FocusContext);

          useImperativeHandle(ref, () => ({
            show: () => setIsVisible(true),
            hide: () => setIsVisible(false),
            focus: () => modalRef.current?.focus()
          }));

          useEffect(() => {
            if (isVisible) {
              modalRef.current.focus();
              trapFocus(modalRef.current);
              announce('Modal opened');
            }
          }, [isVisible]);

          const handleKeyDown = useCallback((e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setIsVisible(false);
            }
            // ISSUE: stopPropagation
            e.stopPropagation();
          }, []);

          if (!isVisible) return null;

          return createPortal(
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              onKeyDown={handleKeyDown}
              className={\`modal \${theme}\`}
            >
              <h2>{props.title}</h2>
              {props.children}
            </div>,
            document.body
          );
        });
      `;

      const analysis = analyzeReactComponent(code, 'AccessibleModal.tsx');

      // Should detect useState
      expect(analysis.hooks.some((h) => h.hookName === 'useState')).toBe(true);

      // Should detect useEffect
      expect(analysis.hooks.some((h) => h.hookName === 'useEffect')).toBe(true);

      // Should detect useRef
      expect(analysis.hooks.some((h) => h.hookName === 'useRef')).toBe(true);

      // Should detect useContext (multiple)
      const contextHooks = analysis.hooks.filter((h) => h.hookName === 'useContext');
      expect(contextHooks.length).toBeGreaterThanOrEqual(3);

      // Should detect useCallback
      expect(analysis.hooks.some((h) => h.hookName === 'useCallback')).toBe(true);

      // Should detect forwardRef
      const forwardedRefs = analysis.refs.filter((r) => r.type === 'forwarded');
      expect(forwardedRefs).toHaveLength(1);

      // Should detect useImperativeHandle
      const imperativeRefs = analysis.refs.filter((r) => r.type === 'imperative');
      expect(imperativeRefs).toHaveLength(1);

      // Should detect context usage
      expect(analysis.contexts.length).toBeGreaterThanOrEqual(3);
      const a11yContexts = analysis.contexts.filter(
        (c) => c.metadata?.isAccessibilityRelated
      );
      expect(a11yContexts.length).toBeGreaterThanOrEqual(3);

      // Should detect portal
      expect(analysis.portals).toHaveLength(1);
      expect(analysis.portals[0].container).toBe('document.body');

      // Should detect focus management
      expect(analysis.focusManagement.length).toBeGreaterThan(0);

      // Should detect stopPropagation
      expect(analysis.syntheticEvents.length).toBeGreaterThan(0);
      const stopPropEvents = analysis.syntheticEvents.filter((e) =>
        e.methodsCalled.includes('stopPropagation')
      );
      expect(stopPropEvents.length).toBeGreaterThan(0);

      // Run all analyzers
      const portalAnalyzer = new ReactPortalAnalyzer();
      const portalIssues = portalAnalyzer.analyze(code, 'AccessibleModal.tsx');
      expect(portalIssues).toHaveLength(1);
      expect(portalIssues[0].wcagCriteria).toEqual(['2.1.1', '2.4.3', '1.3.2', '4.1.2']);

      const stopPropAnalyzer = new ReactStopPropagationAnalyzer();
      const stopPropIssues = stopPropAnalyzer.analyze(code, 'AccessibleModal.tsx');
      expect(stopPropIssues).toHaveLength(1);
      expect(stopPropIssues[0].severity).toBe('warning');
    });
  });
});
