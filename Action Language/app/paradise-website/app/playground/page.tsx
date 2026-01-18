'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { parse, ParserOptions } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { SvelteActionLanguageExtractor } from '../../../../src/parsers/SvelteActionLanguageExtractor';
import { VueActionLanguageExtractor } from '../../../../src/parsers/VueActionLanguageExtractor';
import { AngularActionLanguageExtractor } from '../../../../src/parsers/AngularActionLanguageExtractor';
import { ReactActionLanguageExtractor } from '../../../../src/parsers/ReactActionLanguageExtractor';
import { MouseOnlyClickAnalyzer } from '../../../../src/analyzers/MouseOnlyClickAnalyzer';
import { AngularReactivityAnalyzer } from '../../../../src/analyzers/AngularReactivityAnalyzer';
import { VueReactivityAnalyzer } from '../../../../src/analyzers/VueReactivityAnalyzer';
import { SvelteReactivityAnalyzer } from '../../../../src/analyzers/SvelteReactivityAnalyzer';
import { ReactA11yAnalyzer } from '../../../../src/analyzers/ReactA11yAnalyzer';
import { FocusManagementAnalyzer } from '../../../../src/analyzers/FocusManagementAnalyzer';
import { FocusOrderConflictAnalyzer } from '../../../../src/analyzers/FocusOrderConflictAnalyzer';
import { KeyboardNavigationAnalyzer } from '../../../../src/analyzers/KeyboardNavigationAnalyzer';
import { ARIASemanticAnalyzer } from '../../../../src/analyzers/ARIASemanticAnalyzer';
import { MissingAriaConnectionAnalyzer } from '../../../../src/analyzers/MissingAriaConnectionAnalyzer';
import { OrphanedEventHandlerAnalyzer } from '../../../../src/analyzers/OrphanedEventHandlerAnalyzer';
import { VisibilityFocusConflictAnalyzer } from '../../../../src/analyzers/VisibilityFocusConflictAnalyzer';
import { WidgetPatternAnalyzer } from '../../../../src/analyzers/WidgetPatternAnalyzer';
import { HeadingStructureAnalyzer } from '../../../../src/analyzers/HeadingStructureAnalyzer';
import { ActionLanguageModelImpl } from '../../../../src/models/ActionLanguageModel';
import { HTMLParser } from '../../../../src/parsers/HTMLParser';
import { DocumentModel } from '../../../../src/models/DocumentModel';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Extend Window type for Monaco
declare global {
  interface Window {
    monaco: any;
  }
}

// File structure for multi-file support
interface CodeFile {
  name: string;
  content: string;
}

interface ExampleFiles {
  html: CodeFile[];
  javascript: CodeFile[];
  css: CodeFile[];
}

// Example code snippets - now with multi-file support
const EXAMPLES: Record<string, {
  title: string;
  description: string;
  category: string;
  files: ExampleFiles;
  issues: string[];
}> = {
  'cross-file-handlers': {
    title: 'Cross-File Handlers (Multi-Model)',
    description: 'Handlers split across files - eliminates false positives',
    category: 'multi-model',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<!-- Native button: keyboard accessible without explicit handler -->
<button id="submitButton">Submit Form</button>

<!-- Custom div: requires explicit keyboard handler -->
<div id="customButton" role="button" tabindex="0">Custom Button</div>`
        }
      ],
      javascript: [
        {
          name: 'click-handlers.js',
          content: `// Native button: OK with just click handler
document.getElementById('submitButton')
  .addEventListener('click', function() {
    submitForm();
  });

// Custom div: needs keyboard handler too
document.getElementById('customButton')
  .addEventListener('click', function() {
    customAction();
  });`
        },
        {
          name: 'keyboard-handlers.js',
          content: `// Keyboard handler for custom div button
document.getElementById('customButton')
  .addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      customAction();
    }
  });`
        }
      ],
      css: []
    },
    issues: []
  },
  'orphaned-handler': {
    title: 'Orphaned Event Handler',
    description: 'Handler attached to non-existent element (typo)',
    category: 'multi-model',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<button id="submitButton">Submit</button>
<button id="cancelButton">Cancel</button>`
        }
      ],
      javascript: [
        {
          name: 'handlers.js',
          content: `// Typo: "sumbit" instead of "submit"
document.getElementById('sumbitButton')
  .addEventListener('click', function() {
    console.log('Submit clicked');
  });

// Correct
document.getElementById('cancelButton')
  .addEventListener('click', function() {
    console.log('Cancel clicked');
  });`
        }
      ],
      css: []
    },
    issues: ['orphaned-handler']
  },
  'missing-aria-target': {
    title: 'Missing ARIA Connection',
    description: 'aria-labelledby points to non-existent element',
    category: 'multi-model',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<button aria-labelledby="submitLabel">
  Submit
</button>

<!-- Missing element with id="submitLabel" -->`
        }
      ],
      javascript: [],
      css: []
    },
    issues: ['missing-aria-connection']
  },
  'css-hidden-focusable': {
    title: 'CSS Visibility Conflict',
    description: 'Focusable element hidden by CSS',
    category: 'multi-model',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<button id="hiddenButton" tabindex="0">
  Click me
</button>`
        }
      ],
      javascript: [
        {
          name: 'handlers.js',
          content: `document.getElementById('hiddenButton')
  .addEventListener('click', function() {
    alert('Clicked!');
  });`
        }
      ],
      css: [
        {
          name: 'styles.css',
          content: `#hiddenButton {
  display: none;  /* Hidden but still focusable! */
}`
        }
      ]
    },
    issues: ['visibility-focus-conflict']
  },
  'focus-order-conflict': {
    title: 'Focus Order Conflict',
    description: 'Chaotic tabindex disrupts natural flow',
    category: 'multi-model',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<button tabindex="3">First</button>
<button tabindex="1">Second</button>
<button tabindex="2">Third</button>`
        }
      ],
      javascript: [],
      css: []
    },
    issues: ['focus-order-conflict']
  },
  'mouse-only-click': {
    title: 'Mouse-Only Click Handler (Non-Interactive Element)',
    description: 'Div with click handler needs keyboard support',
    category: 'multi-model',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<!-- Non-interactive element used as button - BAD! -->
<div id="customButton">Click Me</div>

<!-- Should use <button> or add keyboard handler + ARIA -->`
        }
      ],
      javascript: [
        {
          name: 'handlers.js',
          content: `const customBtn = document.getElementById('customButton');

// Only mouse support - no keyboard!
// Flagged as error because <div> is not natively interactive
customBtn.addEventListener('click', function() {
  console.log('Clicked');
});

// CORRECT approach would be:
// 1. Use <button> instead of <div>, OR
// 2. Add keyboard handler + role="button" + tabindex="0"`
        }
      ],
      css: []
    },
    issues: ['mouse-only-click']
  },
  'positive-tabindex': {
    title: 'Positive tabIndex (JS-Only)',
    description: 'Positive tabIndex disrupts natural tab order',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'app.js',
          content: `const modal = document.getElementById('modal');

// Bad: positive tabIndex
modal.tabIndex = 5;

const closeBtn = modal.querySelector('.close');
closeBtn.tabIndex = 6;`
        }
      ],
      css: []
    },
    issues: ['positive-tabindex']
  },
  'static-aria': {
    title: 'Static ARIA State (JS-Only)',
    description: 'ARIA state never updated (WCAG 4.1.2)',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'accordion.js',
          content: `const accordion = document.getElementById('accordion');
const button = accordion.querySelector('button');

// Set aria-expanded but never update it
button.setAttribute('aria-expanded', 'false');

button.addEventListener('click', function() {
  const panel = accordion.querySelector('.panel');
  panel.hidden = !panel.hidden;
  // Forgot to update aria-expanded!
});`
        }
      ],
      css: []
    },
    issues: ['static-aria-state']
  },
  'accessible-button': {
    title: 'Accessible Button (Good Example)',
    description: 'Proper button with keyboard and mouse support',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'button.js',
          content: `const button = document.getElementById('submit');

// Mouse support
button.addEventListener('click', handleSubmit);

// Keyboard support
button.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleSubmit(event);
  }
});

function handleSubmit(event) {
  console.log('Form submitted');
  submitForm();
}`
        }
      ],
      css: []
    },
    issues: []
  },
  'react-portal-issue': {
    title: 'React Portal with stopPropagation',
    description: 'Portal + stopPropagation = multiple a11y issues',
    category: 'react',
    files: {
      html: [],
      javascript: [
        {
          name: 'Modal.tsx',
          content: `import React from 'react';
import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // ISSUE: stopPropagation blocks AT
    e.stopPropagation();
  };

  if (!isOpen) return null;

  // ISSUE: Portal breaks focus management
  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <h2>Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>,
    document.getElementById('modal-root')
  );
}`
        }
      ],
      css: []
    },
    issues: ['react-portal-accessibility', 'react-stop-propagation']
  },
  'react-ref-forwarding': {
    title: 'React Auto-Focus (Missing Cleanup)',
    description: 'useEffect focus management without cleanup function',
    category: 'react',
    files: {
      html: [],
      javascript: [
        {
          name: 'SearchInput.tsx',
          content: `import React, { useEffect, useRef } from 'react';

function SearchInput({ isVisible }) {
  const inputRef = useRef();

  useEffect(() => {
    if (isVisible) {
      // ISSUE: Focus without cleanup - where does focus go when hidden?
      inputRef.current?.focus();
    }
    // Missing: return () => { previousFocus?.focus(); }
  }, [isVisible]);

  return (
    <input
      ref={inputRef}
      type="search"
      placeholder="Search..."
      aria-label="Search"
    />
  );
}

export default SearchInput;`
        }
      ],
      css: []
    },
    issues: []
  },
  'react-context-a11y': {
    title: 'React Portal Notification (Missing A11y)',
    description: 'Portal rendered without proper focus management',
    category: 'react',
    files: {
      html: [],
      javascript: [
        {
          name: 'Notification.tsx',
          content: `import React from 'react';
import ReactDOM from 'react-dom';

function Notification({ message, onClose }) {
  // ISSUE: Portal without focus management or ARIA
  return ReactDOM.createPortal(
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>,
    document.body
  );
}

export default Notification;`
        }
      ],
      css: []
    },
    issues: []
  },
  'react-focus-trap': {
    title: 'React Modal (stopImmediatePropagation)',
    description: 'Modal that blocks ALL event propagation including accessibility',
    category: 'react',
    files: {
      html: [],
      javascript: [
        {
          name: 'Modal.tsx',
          content: `import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
  const handleBackdropClick = (e) => {
    // CRITICAL ISSUE: stopImmediatePropagation blocks accessibility!
    e.stopImmediatePropagation();

    // Close modal if clicking backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">{title}</h2>
        <div>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;`
        }
      ],
      css: []
    },
    issues: []
  },
  'react-hooks-combo': {
    title: 'React Hooks Combination',
    description: 'useState, useEffect, useCallback, useMemo',
    category: 'react',
    files: {
      html: [],
      javascript: [
        {
          name: 'AccessibleForm.tsx',
          content: `import React, { useState, useCallback, useMemo, useRef } from 'react';

function AccessibleForm({ onSubmit }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const firstErrorRef = useRef();

  // useCallback: Memoize validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name required';
    if (!formData.email) newErrors.email = 'Email required';
    return newErrors;
  }, [formData]);

  // useMemo: Compute derived state
  const hasErrors = useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error field
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" role="alert">{errors.name}</span>
        )}
      </div>
      <button type="submit" disabled={hasErrors}>
        Submit
      </button>
    </form>
  );
}`
        }
      ],
      css: []
    },
    issues: []
  },
  'keyboard-trap': {
    title: 'Keyboard Trap (KeyboardNavigationAnalyzer)',
    description: 'Tab trapped without Escape handler',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'modal.js',
          content: `// ❌ Bad: Tab key trapped without Escape
const modal = document.getElementById('modal');

modal.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    // Trap focus within modal
    focusNextElement();
  }
  // Missing: Escape key handler!
});

function focusNextElement() {
  const focusable = modal.querySelectorAll('button, input');
  // Trap implementation
}`
        }
      ],
      css: []
    },
    issues: ['potential-keyboard-trap']
  },
  'screen-reader-keys': {
    title: 'Screen Reader Conflict (KeyboardNavigationAnalyzer)',
    description: 'Single-letter shortcuts conflict with screen readers',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'shortcuts.js',
          content: `// ❌ Bad: Single-letter shortcuts without modifiers
document.addEventListener('keydown', function(e) {
  // Conflicts with NVDA heading navigation (h key)
  if (e.key === 'h') {
    goToHomepage();
  }

  // Conflicts with JAWS button navigation (b key)
  if (e.key === 'b') {
    goBack();
  }

  // Use Ctrl+H or Alt+H instead!
});`
        }
      ],
      css: []
    },
    issues: ['screen-reader-conflict']
  },
  'deprecated-keycode': {
    title: 'Deprecated keyCode (KeyboardNavigationAnalyzer)',
    description: 'Using event.keyCode instead of event.key',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'old-keyboard.js',
          content: `// ❌ Bad: Using deprecated keyCode
const input = document.getElementById('search');

input.addEventListener('keydown', function(e) {
  // DEPRECATED: keyCode is obsolete
  if (e.keyCode === 13) {  // Enter key
    submitSearch();
  }

  if (e.keyCode === 27) {  // Escape key
    clearSearch();
  }

  // Use e.key === 'Enter' instead!
});`
        }
      ],
      css: []
    },
    issues: ['deprecated-keycode']
  },
  'tab-shift-missing': {
    title: 'Tab Without Shift (KeyboardNavigationAnalyzer)',
    description: 'Tab handler missing Shift+Tab support',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'tab-handler.js',
          content: `// ❌ Bad: Only handles forward Tab, not Shift+Tab
const menu = document.getElementById('menu');

menu.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    focusNextItem();
  }
  // Missing: e.shiftKey check for reverse navigation!
});

function focusNextItem() {
  // Only goes forward
}`
        }
      ],
      css: []
    },
    issues: ['tab-without-shift']
  },
  'missing-escape': {
    title: 'Missing Escape Handler (KeyboardNavigationAnalyzer)',
    description: 'Modal without Escape key to close',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'dialog.js',
          content: `// ❌ Bad: Dialog without Escape handler
const dialog = document.querySelector('[role="dialog"]');
const closeBtn = dialog.querySelector('.close');

// Only mouse close
closeBtn.addEventListener('click', function() {
  closeDialog();
});

// Missing: Escape key handler!
// dialog.addEventListener('keydown', e => {
//   if (e.key === 'Escape') closeDialog();
// });`
        }
      ],
      css: []
    },
    issues: ['missing-escape-handler']
  },
  'missing-arrow-nav': {
    title: 'Missing Arrow Navigation (KeyboardNavigationAnalyzer)',
    description: 'ARIA listbox without arrow key support',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'listbox.js',
          content: `// ❌ Bad: role="listbox" without arrow keys
const listbox = document.querySelector('[role="listbox"]');
const options = listbox.querySelectorAll('[role="option"]');

// Only click handlers
options.forEach(option => {
  option.addEventListener('click', function() {
    selectOption(option);
  });
});

// Missing: ArrowUp/ArrowDown handlers for keyboard navigation!`
        }
      ],
      css: []
    },
    issues: ['missing-arrow-navigation']
  },
  'arrow-browse-conflict': {
    title: 'Arrow Keys Conflict (KeyboardNavigationAnalyzer)',
    description: 'Global arrow handlers break screen reader browse mode',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'scroll.js',
          content: `// ❌ Bad: Global arrow handlers interfere with browse mode
document.addEventListener('keydown', function(e) {
  // Prevents screen readers from using arrows to read!
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    scrollToNextSection();
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    scrollToPreviousSection();
  }

  // Only use arrow keys in interactive widgets!
});`
        }
      ],
      css: []
    },
    issues: ['screen-reader-arrow-conflict']
  },
  'focus-removal': {
    title: 'Removal Without Focus Check (FocusManagementAnalyzer)',
    description: 'Element removed without checking if focused',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'remove.js',
          content: `// ❌ Bad: Remove element without focus management
const notification = document.getElementById('notification');

function closeNotification() {
  // What if notification has focus?
  notification.remove();
  // Focus is lost! Should move to trigger element.
}

// ✅ Good approach:
// if (notification.contains(document.activeElement)) {
//   triggerButton.focus();
// }
// notification.remove();`
        }
      ],
      css: []
    },
    issues: ['removal-without-focus-management']
  },
  'focus-hiding': {
    title: 'Hiding Without Focus Check (FocusManagementAnalyzer)',
    description: 'Element hidden without checking focus',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'hide.js',
          content: `// ❌ Bad: Hide element without focus management
const panel = document.getElementById('panel');

function hidePanel() {
  // What if panel or its children have focus?
  panel.style.display = 'none';
  // Focus trapped on hidden element!
}

// ✅ Good approach:
// if (panel.contains(document.activeElement)) {
//   panelToggle.focus();
// }
// panel.style.display = 'none';`
        }
      ],
      css: []
    },
    issues: ['hiding-without-focus-management']
  },
  'focus-class-toggle': {
    title: 'Class Toggle Focus Issue (FocusManagementAnalyzer)',
    description: 'classList operation may hide element with focus',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'toggle.js',
          content: `// ❌ Potentially Bad: Class toggle may hide focused element
const dropdown = document.getElementById('dropdown');

function toggleDropdown() {
  // If 'hidden' class sets display:none and dropdown has focus...
  dropdown.classList.toggle('hidden');
  // Focus may be trapped!
}

// Check CSS: does .hidden set display:none or visibility:hidden?`
        }
      ],
      css: []
    },
    issues: ['hiding-class-without-focus-management']
  },
  'non-focusable-focus': {
    title: 'Focusing Non-Focusable (FocusManagementAnalyzer)',
    description: 'Attempting to focus element that may not be focusable',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'focus-div.js',
          content: `// ❌ Bad: Trying to focus a non-focusable element
const content = document.getElementById('content');

function showContent() {
  content.hidden = false;
  content.focus();  // DIVs aren't natively focusable!
}

// ✅ Good: Add tabindex="-1" first
// content.setAttribute('tabindex', '-1');
// content.focus();`
        }
      ],
      css: []
    },
    issues: ['possibly-non-focusable']
  },
  'standalone-blur': {
    title: 'Standalone Blur (FocusManagementAnalyzer)',
    description: 'Removing focus without moving it elsewhere',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'blur.js',
          content: `// ❌ Bad: Blur without explicit focus move
const input = document.getElementById('search');

function clearSearch() {
  input.value = '';
  input.blur();  // Where does focus go? Unknown!
}

// ✅ Good: Move focus explicitly
// const clearButton = document.getElementById('clear');
// clearButton.focus();`
        }
      ],
      css: []
    },
    issues: ['standalone-blur']
  },
  'focus-restoration-missing': {
    title: 'Focus Restoration Missing (FocusManagementAnalyzer)',
    description: 'Modal closes without restoring focus to trigger',
    category: 'js-only',
    files: {
      html: [],
      javascript: [
        {
          name: 'modal-close.js',
          content: `// ❌ Bad: Close modal without restoring focus
const modal = document.getElementById('modal');
const closeBtn = modal.querySelector('.close');

closeBtn.addEventListener('click', function() {
  modal.hidden = true;
  // Focus lost! Should return to trigger button.
});

// ✅ Good: Store and restore focus
// const openButton = document.activeElement;
// modal.hidden = true;
// openButton.focus();`
        }
      ],
      css: []
    },
    issues: ['focus-restoration-missing']
  },
  'svelte-bind-no-label': {
    title: 'Svelte bind: Without Label',
    description: 'Svelte two-way binding without accessible labels',
    category: 'svelte',
    files: {
      html: [],
      javascript: [
        {
          name: 'LoginForm.svelte',
          content: `<script>
  let email = '';
  let password = '';
  let rememberMe = false;

  function handleLogin() {
    console.log('Logging in...', { email, password, rememberMe });
  }
</script>

<!-- ❌ Bad: bind:value without labels -->
<div class="login-form">
  <input
    type="email"
    bind:value={email}
    placeholder="Email"
  />

  <input
    type="password"
    bind:value={password}
    placeholder="Password"
  />

  <label>
    <input
      type="checkbox"
      bind:checked={rememberMe}
    />
    Remember me
  </label>

  <button on:click={handleLogin}>
    Log in
  </button>
</div>

<!-- ✅ Good: Proper labels -->
<!--
<div class="login-form">
  <label for="email-input">Email</label>
  <input
    id="email-input"
    type="email"
    bind:value={email}
    aria-required="true"
  />

  <label for="password-input">Password</label>
  <input
    id="password-input"
    type="password"
    bind:value={password}
    aria-required="true"
  />

  <label>
    <input
      type="checkbox"
      bind:checked={rememberMe}
    />
    Remember me
  </label>

  <button on:click={handleLogin}>
    Log in
  </button>
</div>
-->`
        }
      ],
      css: []
    },
    issues: [
      'svelte-bind-no-label: Input with bind:value lacks accessible label',
      'Placeholder text is not a replacement for labels',
      'Missing aria-required for required fields'
    ]
  },
  'svelte-click-keyboard': {
    title: 'Svelte on:click Without Keyboard',
    description: 'Non-interactive element with on:click needs keyboard handler',
    category: 'svelte',
    files: {
      html: [],
      javascript: [
        {
          name: 'Counter.svelte',
          content: `<script>
  let count = 0;

  function increment() {
    count++;
  }

  function reset() {
    count = 0;
  }
</script>

<!-- ❌ Bad: on:click on div without keyboard support -->
<div class="counter-widget">
  <div class="counter" on:click={increment}>
    <span class="count">{count}</span>
    <span class="label">Clicks</span>
  </div>

  <div class="reset-button" on:click={reset}>
    Reset
  </div>
</div>

<style>
  .counter, .reset-button {
    cursor: pointer;
    padding: 20px;
    border: 1px solid #ccc;
  }
</style>

<!-- ✅ Good: Proper keyboard support -->
<!--
<script>
  let count = 0;

  function increment() {
    count++;
  }

  function handleCounterKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      increment();
    }
  }

  function reset() {
    count = 0;
  }

  function handleResetKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      reset();
    }
  }
</script>

<div class="counter-widget">
  <div
    class="counter"
    role="button"
    tabindex="0"
    aria-label="Increment counter"
    on:click={increment}
    on:keydown={handleCounterKeydown}
  >
    <span class="count" aria-live="polite">{count}</span>
    <span class="label">Clicks</span>
  </div>

  <button class="reset-button" on:click={reset}>
    Reset
  </button>
</div>
-->`
        }
      ],
      css: []
    },
    issues: [
      'svelte-click-no-keyboard: on:click on div without keyboard handler',
      'Non-interactive element needs role and tabindex',
      'Missing keyboard event handler (on:keydown)'
    ]
  },
  'svelte-class-visibility': {
    title: 'Svelte class: Visibility Without ARIA',
    description: 'Conditional class affecting visibility without ARIA communication',
    category: 'svelte',
    files: {
      html: [],
      javascript: [
        {
          name: 'Dropdown.svelte',
          content: `<script>
  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
  }
</script>

<!-- ❌ Bad: class:hidden without ARIA -->
<div class="dropdown">
  <button on:click={toggleMenu}>
    Toggle Menu
  </button>

  <nav class:hidden={!isOpen}>
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</div>

<style>
  .hidden {
    display: none;
  }
</style>

<!-- ✅ Good: Proper ARIA communication -->
<!--
<script>
  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function handleToggleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    } else if (event.key === 'Escape' && isOpen) {
      isOpen = false;
    }
  }
</script>

<div class="dropdown">
  <button
    aria-expanded={isOpen}
    aria-controls="main-nav"
    on:click={toggleMenu}
    on:keydown={handleToggleKeydown}
  >
    Toggle Menu
  </button>

  <nav
    id="main-nav"
    class:hidden={!isOpen}
    aria-hidden={!isOpen}
  >
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</div>

<style>
  .hidden {
    display: none;
  }
</style>
-->`
        }
      ],
      css: []
    },
    issues: [
      'svelte-class-visibility-no-aria: class:hidden affects visibility without ARIA',
      'Missing aria-expanded on toggle button',
      'Missing aria-hidden to match visibility state'
    ]
  },
  'svelte-reactive-focus': {
    title: 'Svelte Reactive Focus Without Cleanup',
    description: 'Reactive statement manages focus without cleanup',
    category: 'svelte',
    files: {
      html: [],
      javascript: [
        {
          name: 'Modal.svelte',
          content: `<script>
  let isModalOpen = false;
  let modalElement;

  // ❌ Bad: Reactive focus without cleanup
  $: if (isModalOpen && modalElement) {
    modalElement.focus();
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<button on:click={openModal}>
  Open Modal
</button>

{#if isModalOpen}
  <div
    bind:this={modalElement}
    class="modal"
    tabindex="-1"
  >
    <h2>Modal Title</h2>
    <p>Modal content goes here...</p>

    <button on:click={closeModal}>
      Close
    </button>
  </div>
{/if}

<!-- ✅ Good: Proper focus management with cleanup -->
<!--
<script>
  import { onDestroy } from 'svelte';

  let isModalOpen = false;
  let modalElement;
  let previousFocus;

  $: if (isModalOpen && modalElement) {
    // Store previous focus before moving
    previousFocus = document.activeElement;
    modalElement.focus();
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    // Restore focus when closing
    if (previousFocus) {
      previousFocus.focus();
    }
  }

  function handleModalKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

<button on:click={openModal} aria-haspopup="dialog">
  Open Modal
</button>

{#if isModalOpen}
  <div
    bind:this={modalElement}
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    on:keydown={handleModalKeydown}
  >
    <h2 id="modal-title">Modal Title</h2>
    <p>Modal content goes here...</p>

    <button on:click={closeModal}>
      Close
    </button>
  </div>
{/if}
-->`
        }
      ],
      css: []
    },
    issues: [
      'svelte-reactive-focus-no-cleanup: Reactive statement manages focus without cleanup',
      'Missing focus restoration on modal close',
      'Missing role="dialog" and aria-modal',
      'Missing Escape key handler'
    ]
  },
  'vue-model-no-label': {
    title: 'Vue v-model Without Label',
    description: 'Vue two-way binding without accessible labels',
    category: 'vue',
    files: {
      html: [],
      javascript: [
        {
          name: 'LoginForm.vue',
          content: `<template>
  <!-- ❌ Bad: v-model without labels -->
  <div class="login-form">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>

  <!-- ✅ Good: Properly labeled inputs -->
  <!--
  <div class="login-form">
    <label for="email-input">Email</label>
    <input
      id="email-input"
      v-model="email"
      type="email"
      placeholder="your@email.com"
    />

    <label for="password-input">Password</label>
    <input
      id="password-input"
      v-model="password"
      type="password"
      placeholder="Your password"
    />

    <button @click="login">Login</button>
  </div>
  -->
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const login = () => {
  console.log('Login with:', email.value, password.value);
};
</script>`
        }
      ],
      css: []
    },
    issues: [
      'vue-model-no-label: Input with v-model lacks accessible label',
      'Screen readers cannot identify the purpose of these form inputs',
      'Users with cognitive disabilities cannot see persistent labels'
    ]
  },
  'vue-click-no-keyboard': {
    title: 'Vue @click Without Keyboard',
    description: 'Non-interactive element with @click needs keyboard handler',
    category: 'vue',
    files: {
      html: [],
      javascript: [
        {
          name: 'Card.vue',
          content: `<template>
  <!-- ❌ Bad: @click on div without keyboard handler -->
  <div class="card" @click="openDetails">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>

  <!-- ✅ Good: Proper button or interactive div with keyboard handler -->
  <!--
  <div
    class="card"
    role="button"
    tabindex="0"
    @click="openDetails"
    @keydown="handleKeydown"
  >
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
  -->
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
  description: String
});

const openDetails = () => {
  console.log('Opening details for:', props.title);
};

const handleKeydown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openDetails();
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 1rem;
  cursor: pointer;
}
</style>`
        }
      ],
      css: []
    },
    issues: [
      'vue-click-no-keyboard: Non-interactive element with @click lacks keyboard handler',
      'Keyboard-only users cannot interact with this element',
      'Missing role="button" and tabindex="0"'
    ]
  },
  'vue-visibility-no-aria': {
    title: 'Vue v-show Visibility Without ARIA',
    description: 'v-show directive affecting visibility without ARIA communication',
    category: 'vue',
    files: {
      html: [],
      javascript: [
        {
          name: 'Dropdown.vue',
          content: `<template>
  <!-- ❌ Bad: v-show without aria-hidden -->
  <div class="dropdown">
    <button @click="toggle">
      {{ isOpen ? 'Hide' : 'Show' }} Menu
    </button>

    <div v-show="isOpen" class="dropdown-menu">
      <ul>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
      </ul>
    </div>
  </div>

  <!-- ✅ Good: aria-expanded and aria-hidden -->
  <!--
  <div class="dropdown">
    <button
      @click="toggle"
      :aria-expanded="isOpen"
    >
      {{ isOpen ? 'Hide' : 'Show' }} Menu
    </button>

    <div
      v-show="isOpen"
      :aria-hidden="!isOpen"
      class="dropdown-menu"
    >
      <ul>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
      </ul>
    </div>
  </div>
  -->
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.dropdown-menu {
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  padding: 0.5rem;
}
</style>`
        }
      ],
      css: []
    },
    issues: [
      'vue-visibility-no-aria: v-show directive affects visibility but lacks ARIA communication',
      'Screen readers are not informed about the visibility state change',
      'Add aria-hidden that matches v-show condition'
    ]
  },

  // ====== Angular Examples ======
  'angular-ngmodel-no-label': {
    title: 'Angular [(ngModel)] Without Label',
    description: 'Input with [(ngModel)] lacks accessible label',
    category: 'angular',
    files: {
      html: [],
      javascript: [
        {
          name: 'login.component.html',
          content: `<!-- ❌ Bad: [(ngModel)] without label -->
<div class="login-form">
  <input [(ngModel)]="username" placeholder="Username" />
  <input [(ngModel)]="password" type="password" placeholder="Password" />
  <button (click)="login()">Login</button>
</div>

<!-- ✅ Good: Proper labels -->
<!--
<div class="login-form">
  <label for="username-input">Username</label>
  <input id="username-input" [(ngModel)]="username" />

  <label for="password-input">Password</label>
  <input id="password-input" [(ngModel)]="password" type="password" />

  <button (click)="login()">Login</button>
</div>

<!-- OR with aria-label -->
<div class="login-form">
  <input [(ngModel)]="username" aria-label="Username" placeholder="Username" />
  <input [(ngModel)]="password" type="password" aria-label="Password" placeholder="Password" />
  <button (click)="login()">Login</button>
</div>
-->`
        }
      ],
      css: []
    },
    issues: [
      'angular-ngmodel-no-label: Input with [(ngModel)] lacks accessible label',
      'Screen readers cannot identify the purpose of these form inputs',
      'Users with cognitive disabilities cannot see persistent labels'
    ]
  },
  'angular-click-no-keyboard': {
    title: 'Angular (click) Without Keyboard',
    description: 'Non-interactive element with (click) needs keyboard handler',
    category: 'angular',
    files: {
      html: [],
      javascript: [
        {
          name: 'card.component.html',
          content: `<!-- ❌ Bad: (click) on div without keyboard handler -->
<div class="card" (click)="openDetails()">
  <h3>{{ title }}</h3>
  <p>{{ description }}</p>
</div>

<!-- ✅ Good: Proper button or interactive div with keyboard handler -->
<!--
<button class="card" (click)="openDetails()">
  <h3>{{ title }}</h3>
  <p>{{ description }}</p>
</button>

<!-- OR make div interactive -->
<div
  class="card"
  (click)="openDetails()"
  (keydown)="handleKeydown($event)"
  tabindex="0"
  role="button"
  [attr.aria-label]="'Open details for ' + title"
>
  <h3>{{ title }}</h3>
  <p>{{ description }}</p>
</div>
-->`
        }
      ],
      css: []
    },
    issues: [
      'angular-click-no-keyboard: Non-interactive element with (click) lacks keyboard handler',
      'Keyboard-only users cannot interact with this element',
      'Missing role="button" and tabindex="0"'
    ]
  },
  'angular-visibility-no-aria': {
    title: 'Angular *ngIf Visibility Without ARIA',
    description: '*ngIf directive affecting visibility without ARIA communication',
    category: 'angular',
    files: {
      html: [],
      javascript: [
        {
          name: 'dropdown.component.html',
          content: `<!-- ❌ Bad: *ngIf without aria-expanded -->
<div class="dropdown">
  <button (click)="toggle()">
    {{ isOpen ? 'Hide' : 'Show' }} Menu
  </button>

  <div *ngIf="isOpen" class="dropdown-menu">
    <ul>
      <li>Menu Item 1</li>
      <li>Menu Item 2</li>
      <li>Menu Item 3</li>
    </ul>
  </div>
</div>

<!-- ✅ Good: aria-expanded and role -->
<!--
<div class="dropdown">
  <button
    (click)="toggle()"
    [attr.aria-expanded]="isOpen"
    aria-controls="dropdown-menu"
  >
    {{ isOpen ? 'Hide' : 'Show' }} Menu
  </button>

  <div
    *ngIf="isOpen"
    id="dropdown-menu"
    class="dropdown-menu"
    role="region"
    aria-live="polite"
  >
    <ul>
      <li>Menu Item 1</li>
      <li>Menu Item 2</li>
      <li>Menu Item 3</li>
    </ul>
  </div>
</div>
-->`
        }
      ],
      css: []
    },
    issues: [
      'angular-visibility-no-aria: *ngIf directive affects visibility but lacks ARIA communication',
      'Screen readers are not informed about the visibility state change',
      'Add aria-expanded and aria-live for proper announcement'
    ]
  },

  // ====== Structural HTML Examples ======
  'heading-hierarchy-issues': {
    title: 'Heading Hierarchy: Skipped Levels',
    description: 'Fragment-level analysis: skipped heading levels (WCAG 1.3.1)',
    category: 'structural-html',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<!-- Fragment scope: file-level analysis only -->
<h2>Section Title</h2>

<!-- Skipped level: H2 to H4 (missing H3) -->
<h4>Subsection</h4>

<h3>Another Subsection</h3>

<!-- Another skip: H3 to H6 -->
<h6>Deep Nested Item</h6>`
        }
      ],
      javascript: [],
      css: []
    },
    issues: ['heading-levels-skipped']
  },
  'empty-hidden-headings': {
    title: 'Empty & Hidden Headings',
    description: 'Headings with no content or hidden by CSS (WCAG 2.4.6, 1.3.1)',
    category: 'structural-html',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<h1>Page Title</h1>

<!-- Empty heading: no text content -->
<h2></h2>

<!-- Empty heading: whitespace only -->
<h2>   </h2>

<!-- Hidden with inline style -->
<h2 style="display:none">Hidden Section</h2>

<!-- Hidden via CSS class -->
<h2 class="hidden">Another Hidden Section</h2>

<h2>Visible Section</h2>`
        }
      ],
      javascript: [],
      css: [
        {
          name: 'styles.css',
          content: `.hidden {
  display: none;
}`
        }
      ]
    },
    issues: ['empty-heading', 'hidden-heading']
  },
  'aria-heading-patterns': {
    title: 'ARIA Heading Patterns',
    description: 'aria-level without role and long headings (WCAG 4.1.2, 2.4.6)',
    category: 'structural-html',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<h1>Document Structure Examples</h1>

<!-- Missing role="heading" -->
<div aria-level="2">
  This element has aria-level but no role
</div>

<!-- Heading exceeds 60 characters -->
<h2>This is an extremely long heading that exceeds the recommended character limit and makes it difficult for users to scan and understand the content quickly</h2>

<!-- Near the 60 character limit (shows info message) -->
<h2>This heading is approaching the length limit soon</h2>

<h2>Short Heading</h2>`
        }
      ],
      javascript: [],
      css: []
    },
    issues: ['aria-level-without-role', 'heading-too-long', 'heading-near-length-limit']
  },
  'multiple-h1-headings': {
    title: 'Multiple H1 Headings',
    description: 'Page contains multiple H1 elements (WCAG 1.3.1)',
    category: 'structural-html',
    files: {
      html: [
        {
          name: 'index.html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Example Page</title>
</head>
<body>
  <!-- First H1: Main page title -->
  <h1>Welcome to Our Website</h1>

  <h2>About Us</h2>
  <p>Information about our company.</p>

  <!-- Second H1: Should be H2 -->
  <h1>Our Services</h1>
  <p>Details about what we offer.</p>

  <!-- Third H1: Should be H2 -->
  <h1>Contact Information</h1>
  <p>Get in touch with us.</p>
</body>
</html>`
        }
      ],
      javascript: [],
      css: []
    },
    issues: ['multiple-h1-headings']
  }
};

export default function Playground() {
  const [selectedExample, setSelectedExample] = useState('cross-file-handlers');
  const [files, setFiles] = useState<ExampleFiles>(EXAMPLES['cross-file-handlers'].files);
  const [activeFileTab, setActiveFileTab] = useState<'html' | 'javascript' | 'css'>('javascript');
  const [activeFileIndex, setActiveFileIndex] = useState<Record<'html' | 'javascript' | 'css', number>>({
    html: 0,
    javascript: 0,
    css: 0
  });
  const [actionLanguage, setActionLanguage] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [activeResultTab, setActiveResultTab] = useState<'issues' | 'actionlanguage' | 'models'>('issues');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [monacoEditor, setMonacoEditor] = useState<any>(null);
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number | null>(null);
  const [selectedDocIssue, setSelectedDocIssue] = useState<any>(null);
  const [docContent, setDocContent] = useState<string>('');

  // Analyze code whenever files change
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeFiles(files);
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [files]);

  const analyzeFiles = (currentFiles: ExampleFiles) => {
    setIsAnalyzing(true);

    try {
      // Parse each JavaScript file separately (preserves file names for better error reporting)
      const allParsedNodes: any[] = [];

      for (const jsFile of currentFiles.javascript) {
        const parsed = parseToActionLanguage(jsFile.content, jsFile.name);
        allParsedNodes.push(...parsed);
      }

      setActionLanguage(allParsedNodes);

      // READ: Analyze for issues across all files (multi-model aware)
      const detected = detectIssues(allParsedNodes, currentFiles);
      setIssues(detected);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Real Babel-based parser for ActionLanguage extraction
   * This uses proper AST traversal instead of regex patterns
   */
  const parseToActionLanguage = (code: string, filename: string = 'playground.js') => {
    // Handle React files: use the real ReactActionLanguageExtractor
    if (filename.endsWith('.jsx') || filename.endsWith('.tsx') || code.includes('React') || code.includes('useState') || code.includes('useEffect')) {
      const extractor = new ReactActionLanguageExtractor();
      const model = extractor.parse(code, filename);
      return model.nodes;
    }

    // Handle Svelte files: use the real SvelteActionLanguageExtractor
    if (filename.endsWith('.svelte')) {
      const extractor = new SvelteActionLanguageExtractor();
      const model = extractor.parse(code, filename);
      return model.nodes;
    }

    // Handle Vue files: use the real VueActionLanguageExtractor
    if (filename.endsWith('.vue')) {
      const extractor = new VueActionLanguageExtractor();
      const model = extractor.parse(code, filename);
      return model.nodes;
    }

    // Handle Angular files: use the real AngularActionLanguageExtractor
    if (filename.endsWith('.html') || filename.endsWith('.component.ts')) {
      const extractor = new AngularActionLanguageExtractor();
      const model = extractor.parse(code, filename);
      return model.nodes;
    }

    const nodes: any[] = [];
    const variableBindings = new Map<string, { selector: string; binding: string }>();
    let nodeCounter = 0;

    const BABEL_CONFIG: ParserOptions = {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        ['decorators', { decoratorsBeforeExport: true }],
        'classProperties',
        'objectRestSpread',
        'optionalChaining',
        'nullishCoalescingOperator',
      ],
      ranges: true,
      tokens: false,
    };

    try {
      const ast = parse(code, {
        ...BABEL_CONFIG,
        sourceFilename: filename,
      });

      // First pass: collect variable bindings to element selectors
      // Example: const button = document.getElementById('submit');
      traverse(ast, {
        VariableDeclarator(path: any) {
          const node = path.node;
          const id = node.id;
          const init = node.init;

          if (t.isIdentifier(id) && init) {
            const variableName = id.name;
            const elementRef = extractElementReferenceFromExpression(init);
            if (elementRef) {
              variableBindings.set(variableName, elementRef);
            }
          }
        }
      });

      // Second pass: extract action patterns
      traverse(ast, {
        CallExpression(path: any) {
          const node = path.node;

          // Extract addEventListener calls
          if (isAddEventListener(node)) {
            const eventNode = extractEventHandler(node);
            if (eventNode) nodes.push(eventNode);
          }

          // Extract setAttribute with ARIA
          if (isSetAttribute(node)) {
            const ariaNode = extractAriaUpdate(node);
            if (ariaNode) nodes.push(ariaNode);
          }

          // Extract focus/blur calls
          if (isFocusChange(node)) {
            const focusNode = extractFocusChange(node);
            if (focusNode) nodes.push(focusNode);
          }
        },

        JSXAttribute(path: any) {
          const node = path.node;
          if (isJSXEventHandler(node)) {
            const eventNode = extractJSXEventHandler(path, node);
            if (eventNode) nodes.push(eventNode);
          }
        }
      });

    } catch (error: any) {
      console.error(`Parse error in ${filename}:`, error);
      console.error('Error message:', error.message);
      console.error('Error location:', error.loc);
      console.error('Code that failed to parse:', code);
      // Return empty nodes on parse error
      return [];
    }

    console.log(`Parsed ${nodes.length} nodes from ${filename}`);
    return nodes;

    // Helper functions for AST analysis

    function isAddEventListener(node: any): boolean {
      const callee = node.callee;
      return (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.property) &&
        callee.property.name === 'addEventListener'
      );
    }

    function isJSXEventHandler(node: any): boolean {
      const name = node.name;
      if (t.isJSXIdentifier(name)) {
        return name.name.startsWith('on') && name.name.length > 2;
      }
      return false;
    }

    function isSetAttribute(node: any): boolean {
      const callee = node.callee;
      return (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.property) &&
        callee.property.name === 'setAttribute'
      );
    }

    function isFocusChange(node: any): boolean {
      const callee = node.callee;
      if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
        const methodName = callee.property.name;
        return methodName === 'focus' || methodName === 'blur';
      }
      return false;
    }

    function extractEventHandler(node: any): any {
      const args = node.arguments;
      if (args.length < 2) return null;

      // Extract event type
      const eventArg = args[0];
      let eventType: string | undefined;
      if (t.isStringLiteral(eventArg)) {
        eventType = eventArg.value;
      }
      if (!eventType) return null;

      // Extract element reference
      const callee = node.callee;
      const elementRef = extractElementReference(callee.object);
      if (!elementRef) {
        console.warn('Failed to extract element reference from addEventListener:', callee.object);
        return null;
      }

      // Extract keys checked in handler for keyboard events
      // TODO: Re-enable key detection after fixing traverse nesting issue
      const keysChecked: string[] = [];
      // if (eventType === 'keydown' || eventType === 'keypress' || eventType === 'keyup') {
      //   const handler = args[1];
      //   if (t.isFunctionExpression(handler) || t.isArrowFunctionExpression(handler)) {
      //     traverse(handler, {
      //       BinaryExpression(keyPath: any) {
      //         const keyNode = keyPath.node;
      //         // Detect: e.key === 'Enter' or event.key === 'Space'
      //         if (
      //           (keyNode.operator === '===' || keyNode.operator === '==') &&
      //           t.isMemberExpression(keyNode.left) &&
      //           t.isIdentifier(keyNode.left.property) &&
      //           keyNode.left.property.name === 'key' &&
      //           t.isStringLiteral(keyNode.right)
      //         ) {
      //           keysChecked.push(keyNode.right.value);
      //         }
      //       }
      //     });
      //   }
      // }

      return {
        id: `action_${++nodeCounter}`,
        actionType: 'eventHandler',
        event: eventType,
        element: elementRef,
        keysChecked: keysChecked.length > 0 ? keysChecked : undefined,
        location: {
          file: filename,
          line: node.loc?.start.line || 0,
          column: node.loc?.start.column || 0
        },
        metadata: {
          framework: 'vanilla',
          synthetic: false
        }
      };
    }

    function extractJSXEventHandler(path: any, node: any): any {
      const name = node.name;
      if (!t.isJSXIdentifier(name)) return null;

      // Convert React event name to standard: onClick -> click
      const eventType = name.name.slice(2).toLowerCase();

      // Find parent JSX element
      let jsxElement: any = null;
      path.findParent((p: any) => {
        if (p.isJSXElement()) {
          jsxElement = p.node;
          return true;
        }
        return false;
      });

      if (!jsxElement) return null;

      const tagName = getJSXTagName(jsxElement);

      return {
        id: `action_${++nodeCounter}`,
        actionType: 'eventHandler',
        event: eventType,
        element: {
          selector: tagName,
          binding: tagName
        },
        location: {
          file: filename,
          line: node.loc?.start.line || 0,
          column: node.loc?.start.column || 0
        },
        metadata: {
          framework: 'react',
          synthetic: true
        }
      };
    }

    function extractAriaUpdate(node: any): any {
      const args = node.arguments;
      if (args.length < 2) return null;

      const attrArg = args[0];
      if (!t.isStringLiteral(attrArg)) return null;
      if (!attrArg.value.startsWith('aria-')) return null;

      const callee = node.callee;
      const elementRef = extractElementReference(callee.object);
      if (!elementRef) return null;

      return {
        id: `action_${++nodeCounter}`,
        actionType: 'ariaStateChange',
        element: elementRef,
        attribute: attrArg.value,
        location: {
          file: filename,
          line: node.loc?.start.line || 0,
          column: node.loc?.start.column || 0
        }
      };
    }

    function extractFocusChange(node: any): any {
      const callee = node.callee;
      const methodName = callee.property.name;
      const elementRef = extractElementReference(callee.object);
      if (!elementRef) return null;

      return {
        id: `action_${++nodeCounter}`,
        actionType: 'focusChange',
        element: elementRef,
        timing: 'immediate',
        location: {
          file: filename,
          line: node.loc?.start.line || 0,
          column: node.loc?.start.column || 0
        },
        metadata: { method: methodName }
      };
    }

    function extractElementReference(node: any): { selector: string; binding: string } | null {
      // Handle variable reference: button.addEventListener(...)
      if (t.isIdentifier(node)) {
        const binding = variableBindings.get(node.name);
        if (binding) {
          return binding;
        }
        return {
          selector: node.name,
          binding: node.name
        };
      }

      return extractElementReferenceFromExpression(node);
    }

    function extractElementReferenceFromExpression(node: any): { selector: string; binding: string } | null {
      // Handle ref.current: buttonRef.current.focus()
      if (
        t.isMemberExpression(node) &&
        t.isIdentifier(node.property) &&
        node.property.name === 'current' &&
        t.isIdentifier(node.object)
      ) {
        return {
          selector: `[ref="${node.object.name}"]`,
          binding: node.object.name
        };
      }

      // Handle document.getElementById('id')
      if (t.isCallExpression(node)) {
        const callee = node.callee;
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.property) &&
          callee.property.name === 'getElementById'
        ) {
          const arg = node.arguments[0];
          if (t.isStringLiteral(arg)) {
            return {
              selector: `#${arg.value}`,
              binding: arg.value
            };
          }
        }

        // Handle document.querySelector('.class')
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.property) &&
          callee.property.name === 'querySelector'
        ) {
          const arg = node.arguments[0];
          if (t.isStringLiteral(arg)) {
            return {
              selector: arg.value,
              binding: arg.value
            };
          }
        }
      }

      return null;
    }

    function getJSXTagName(element: any): string {
      const opening = element.openingElement;
      const name = opening.name;

      if (t.isJSXIdentifier(name)) {
        return name.name;
      }

      if (t.isJSXMemberExpression(name)) {
        return getJSXMemberExpressionName(name);
      }

      return 'unknown';
    }

    function getJSXMemberExpressionName(expr: any): string {
      const parts: string[] = [];
      let current = expr;

      while (t.isJSXMemberExpression(current)) {
        if (t.isJSXIdentifier(current.property)) {
          parts.unshift(current.property.name);
        }
        current = current.object;
      }

      if (t.isJSXIdentifier(current)) {
        parts.unshift(current.name);
      }

      return parts.join('.');
    }
  };

  const detectIssues = (nodes: any[], currentFiles: ExampleFiles) => {
    const detected: any[] = [];

    // Create ActionLanguage model for analyzers that need it
    const actionLanguageModel = new ActionLanguageModelImpl(nodes, 'playground.js');

    // Initialize all analyzers
    const analyzers = [
      new MouseOnlyClickAnalyzer(),
      new FocusManagementAnalyzer(),
      new FocusOrderConflictAnalyzer(),
      new KeyboardNavigationAnalyzer(),
      new ARIASemanticAnalyzer(),
      new MissingAriaConnectionAnalyzer(),
      new OrphanedEventHandlerAnalyzer(),
      new VisibilityFocusConflictAnalyzer(),
      new WidgetPatternAnalyzer(),
      new ReactA11yAnalyzer(),
    ];

    // Run all ActionLanguage-based analyzers
    for (const analyzer of analyzers) {
      try {
        const analyzerIssues = analyzer.analyze({
          actionLanguageModel,
          scope: 'file'
        });

        // Convert real issues to playground format
        for (const issue of analyzerIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'JavaScript',
            line: issue.location?.line,
            column: issue.location?.column
          });
        }
      } catch (error) {
        console.error(`Analyzer error (${analyzer.name}):`, error);
      }
    }

    // Run HeadingStructureAnalyzer if there's HTML content
    const allHtml = currentFiles.html.map(f => f.content).join('\n');
    if (allHtml.trim().length > 0) {
      try {
        const htmlParser = new HTMLParser();
        const domModel = htmlParser.parse(allHtml, 'playground.html');

        // Wrap DOMModel in DocumentModel for the analyzer
        const documentModel = new DocumentModel({
          scope: 'file',
          dom: domModel,
          javascript: []
        });

        const headingAnalyzer = new HeadingStructureAnalyzer();
        const headingIssues = headingAnalyzer.analyze({
          documentModel,
          scope: 'file'
        });

        for (const issue of headingIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column
          });
        }
      } catch (error) {
        console.error('HeadingStructureAnalyzer error:', error);
      }
    }

    // Run framework-specific analyzers only if patterns detected (prevents hang on non-framework content)
    const allJs = currentFiles.javascript.map(f => f.content).join('\n');
    const allContent = allHtml + '\n' + allJs;

    // Angular analyzer - only if Angular patterns found
    if (allContent.includes('[(ngModel)]') || allContent.includes('*ngIf') || allContent.includes('*ngFor')) {
      try {
        const angularExtractor = new AngularActionLanguageExtractor();
        const angularModel = angularExtractor.parse(allContent, 'component.html');
        const angularAnalyzer = new AngularReactivityAnalyzer();
        const angularIssues = angularAnalyzer.analyze({
          actionLanguageModel: angularModel,
          scope: 'file'
        });

        for (const issue of angularIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column
          });
        }
      } catch (error) {
        console.error('AngularReactivityAnalyzer error:', error);
      }
    }

    // Vue analyzer - only if Vue patterns found
    if (allContent.includes('v-model') || allContent.includes('v-if') || allContent.includes('v-for') || allContent.includes('@click')) {
      try {
        const vueExtractor = new VueActionLanguageExtractor();
        const vueModel = vueExtractor.parse(allContent, 'component.vue');
        const vueAnalyzer = new VueReactivityAnalyzer();
        const vueIssues = vueAnalyzer.analyze({
          actionLanguageModel: vueModel,
          scope: 'file'
        });

        for (const issue of vueIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column
          });
        }
      } catch (error) {
        console.error('VueReactivityAnalyzer error:', error);
      }
    }

    // Svelte analyzer - only if Svelte patterns found
    if (allContent.includes('bind:') || allContent.includes('on:') || allContent.includes('{#if') || allContent.includes('{#each')) {
      try {
        const svelteExtractor = new SvelteActionLanguageExtractor();
        const svelteModel = svelteExtractor.parse(allContent, 'component.svelte');
        const svelteAnalyzer = new SvelteReactivityAnalyzer();
        const svelteIssues = svelteAnalyzer.analyze({
          actionLanguageModel: svelteModel,
          scope: 'file'
        });

        for (const issue of svelteIssues) {
          detected.push({
            type: issue.type,
            severity: issue.severity,
            wcag: issue.wcagCriteria || [],
            message: issue.message,
            location: issue.location?.file || 'HTML',
            line: issue.location?.line,
            column: issue.location?.column
          });
        }
      } catch (error) {
        console.error('SvelteReactivityAnalyzer error:', error);
      }
    }

    // Extract element IDs from HTML
    const htmlElementIds = new Set<string>();
    if (allHtml) {
      const idMatches = allHtml.matchAll(/id=["']([^"']+)["']/g);
      for (const match of idMatches) {
        htmlElementIds.add(match[1]);
      }
    }

    // Orphaned handler detection (Multi-Model)
    // Check if any handlers reference non-existent elements
    for (const node of nodes) {
      if (node.actionType === 'eventHandler' && node.element) {
        const selector = node.element.selector;
        // Check if it's an ID selector
        if (selector.startsWith('#')) {
          const targetId = selector.slice(1);
          if (!htmlElementIds.has(targetId)) {
            // Check for typos
            const suggestions = Array.from(htmlElementIds).filter(id =>
              levenshteinDistance(id, targetId) <= 2
            );

            detected.push({
              type: 'orphaned-handler',
              severity: 'error',
              wcag: ['4.1.2'],
              message: `Handler attached to non-existent element '${targetId}'${suggestions.length > 0 ? `. Did you mean: ${suggestions.join(', ')}?` : ''}`,
              location: 'JavaScript'
            });
          }
        }
      }
    }

    // Missing ARIA connection detection (Multi-Model)
    if (allHtml) {
      const ariaMatches = allHtml.matchAll(/aria-(labelledby|describedby|controls)=["']([^"']+)["']/g);
      for (const match of ariaMatches) {
        const attr = match[1];
        const targetIds = match[2].split(/\s+/);
        for (const targetId of targetIds) {
          if (!htmlElementIds.has(targetId)) {
            detected.push({
              type: 'missing-aria-connection',
              severity: 'error',
              wcag: ['1.3.1', '4.1.2'],
              message: `aria-${attr} references non-existent element '${targetId}'`,
              location: 'HTML'
            });
          }
        }
      }
    }

    // CSS visibility conflict detection (Multi-Model)
    const allCss = currentFiles.css.map(f => f.content).join('\n');
    if (allCss && allHtml) {
      const hiddenSelectors: string[] = [];
      const cssHiddenMatches = allCss.matchAll(/(#[\w-]+|\.[\w-]+|\w+)\s*\{[^}]*(?:display:\s*none|visibility:\s*hidden|opacity:\s*0)[^}]*\}/g);
      for (const match of cssHiddenMatches) {
        hiddenSelectors.push(match[1]);
      }

      for (const selector of hiddenSelectors) {
        if (selector.startsWith('#')) {
          const id = selector.slice(1);
          const focusableMatch = allHtml.match(new RegExp(`id=["']${id}["'][^>]*(?:tabindex=|<button|<a|<input)`));
          if (focusableMatch) {
            detected.push({
              type: 'visibility-focus-conflict',
              severity: 'error',
              wcag: ['2.4.7'],
              message: `Element '${selector}' is focusable but hidden by CSS`,
              location: 'HTML + CSS'
            });
          }
        }
      }
    }

    // Focus order conflict detection (Multi-Model)
    if (allHtml) {
      const tabindexMatches = Array.from(allHtml.matchAll(/tabindex=["'](\d+)["']/g));
      const positiveTabindices = tabindexMatches
        .map(m => parseInt(m[1]))
        .filter(val => val > 0);

      if (positiveTabindices.length > 0) {
        const sorted = [...positiveTabindices].sort((a, b) => a - b);
        const hasDuplicates = sorted.some((val, idx) => idx > 0 && val === sorted[idx - 1]);
        const nonSequential = sorted.some((val, idx) => idx > 0 && val !== sorted[idx - 1] + 1);

        if (hasDuplicates || nonSequential || positiveTabindices.length > 2) {
          detected.push({
            type: 'focus-order-conflict',
            severity: 'warning',
            wcag: ['2.4.3'],
            message: `Chaotic tabindex values: [${positiveTabindices.join(', ')}]. Use tabindex="0" or "-1" instead.`,
            location: 'HTML'
          });
        }
      }
    }


    // Positive tabIndex detection (JS-only)
    const tabIndexChanges = nodes.filter(n => n.actionType === 'tabIndexChange');
    for (const change of tabIndexChanges) {
      if (change.newValue > 0) {
        detected.push({
          type: 'positive-tabindex',
          severity: 'warning',
          wcag: ['2.4.3'],
          message: `Positive tabIndex (${change.newValue}) on '${change.element.binding}' disrupts natural tab order`,
          location: 'JavaScript'
        });
      }
    }

    // Static ARIA state detection (JS-only)
    const ariaChanges = nodes.filter(n => n.actionType === 'ariaStateChange');
    const ariaCounts = new Map();
    for (const change of ariaChanges) {
      const key = `${change.element.binding}-${change.attribute}`;
      ariaCounts.set(key, (ariaCounts.get(key) || 0) + 1);
    }

    for (const change of ariaChanges) {
      const key = `${change.element.binding}-${change.attribute}`;
      if (ariaCounts.get(key) === 1) {
        detected.push({
          type: 'static-aria-state',
          severity: 'warning',
          wcag: ['4.1.2'],
          message: `${change.attribute} on '${change.element.binding}' set once but never updated`,
          location: 'JavaScript'
        });
      }
    }


    return detected;
  };

  const loadExample = (exampleKey: string) => {
    const example = EXAMPLES[exampleKey as keyof typeof EXAMPLES];
    setFiles(example.files);
    setSelectedExample(exampleKey);

    // Set active tab based on which file type has content
    if (example.files.html.length > 0) setActiveFileTab('html');
    else if (example.files.javascript.length > 0) setActiveFileTab('javascript');
    else if (example.files.css.length > 0) setActiveFileTab('css');

    // Reset file indices
    setActiveFileIndex({
      html: 0,
      javascript: 0,
      css: 0
    });
  };

  const updateFile = (fileType: 'html' | 'javascript' | 'css', content: string) => {
    const index = activeFileIndex[fileType];
    setFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].map((file, i) =>
        i === index ? { ...file, content } : file
      )
    }));
  };

  const jumpToIssue = (issue: any, issueIndex: number) => {
    if (!monacoEditor || !issue.line) return;

    // Switch to the appropriate file tab based on issue location
    if (issue.location === 'HTML' || issue.location?.includes('HTML')) {
      setActiveFileTab('html');
    } else if (issue.location === 'JavaScript' || issue.location?.includes('JavaScript')) {
      setActiveFileTab('javascript');
    } else if (issue.location === 'CSS' || issue.location?.includes('CSS')) {
      setActiveFileTab('css');
    }

    // Highlight the selected issue
    setSelectedIssueIndex(issueIndex);

    // Give React time to switch tabs before jumping
    setTimeout(() => {
      if (!monacoEditor) return;

      // Jump to the line
      monacoEditor.revealLineInCenter(issue.line);

      // Set cursor position
      monacoEditor.setPosition({
        lineNumber: issue.line,
        column: issue.column || 1
      });

      // Highlight the line with a decoration
      const decorations = monacoEditor.deltaDecorations([], [
        {
          range: new window.monaco.Range(issue.line, 1, issue.line, 1000),
          options: {
            isWholeLine: true,
            className: 'bg-red-100',
            glyphMarginClassName: 'text-red-500'
          }
        }
      ]);

      // Focus the editor
      monacoEditor.focus();

      // Clear decoration after 3 seconds
      setTimeout(() => {
        monacoEditor.deltaDecorations(decorations, []);
      }, 3000);
    }, 100);
  };

  const showDocumentation = async (issue: any) => {
    setSelectedDocIssue(issue);

    try {
      const response = await fetch(`/docs/issues/${issue.type}.md`);
      if (response.ok) {
        const content = await response.text();
        setDocContent(content);
      } else {
        setDocContent(`# Documentation Not Available\n\nDocumentation for **${issue.type}** is not yet available.`);
      }
    } catch (error) {
      console.error('Error loading documentation:', error);
      setDocContent(`# Error Loading Documentation\n\nCould not load documentation for **${issue.type}**.`);
    }
  };

  const closeDocumentation = () => {
    setSelectedDocIssue(null);
    setDocContent('');
  };

  const addFile = (fileType: 'html' | 'javascript' | 'css') => {
    setFiles(prev => {
      const fileCount = prev[fileType].length + 1;
      let defaultName = '';
      let defaultContent = '';

      switch (fileType) {
        case 'html':
          defaultName = `page${fileCount}.html`;
          defaultContent = `<!-- New HTML file -->\n<div id="element${fileCount}">Content</div>`;
          break;
        case 'javascript':
          defaultName = `script${fileCount}.js`;
          defaultContent = `// New JavaScript file\nconst element${fileCount} = document.getElementById('element${fileCount}');\n\nelement${fileCount}.addEventListener('click', function() {\n  console.log('Clicked');\n});`;
          break;
        case 'css':
          defaultName = `styles${fileCount}.css`;
          defaultContent = `/* New CSS file */\n.element${fileCount} {\n  padding: 10px;\n}`;
          break;
      }

      const newFiles = {
        ...prev,
        [fileType]: [...prev[fileType], { name: defaultName, content: defaultContent }]
      };

      // Switch to the new file
      setActiveFileIndex(idx => ({ ...idx, [fileType]: newFiles[fileType].length - 1 }));

      return newFiles;
    });
  };

  const removeFile = (fileType: 'html' | 'javascript' | 'css', index: number) => {
    setFiles(prev => {
      // Don't allow removing if it's the only file of this type
      if (prev[fileType].length <= 1) {
        return prev;
      }

      const newFiles = {
        ...prev,
        [fileType]: prev[fileType].filter((_, i) => i !== index)
      };

      // Adjust active index if needed
      setActiveFileIndex(idx => ({
        ...idx,
        [fileType]: Math.min(idx[fileType], newFiles[fileType].length - 1)
      }));

      return newFiles;
    });
  };

  const renameFile = (fileType: 'html' | 'javascript' | 'css', index: number, newName: string) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].map((file, i) =>
        i === index ? { ...file, name: newName } : file
      )
    }));
  };

  // Helper: Levenshtein distance for typo detection
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const getLanguageForTab = (tab: 'html' | 'javascript' | 'css'): string => {
    switch (tab) {
      case 'html': return 'html';
      case 'javascript': return 'javascript';
      case 'css': return 'css';
    }
  };

  const hasMultipleFiles = files.html.length > 0 || files.css.length > 0;
  const currentExample = EXAMPLES[selectedExample as keyof typeof EXAMPLES];
  const currentFileArray = files[activeFileTab];
  const currentFile = currentFileArray[activeFileIndex[activeFileTab]];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-paradise-green to-paradise-blue text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Interactive Playground</h1>
          <p className="text-xl mb-4">
            See Paradise in action. Edit code and watch real-time multi-model analysis.
          </p>
          {hasMultipleFiles && (
            <div className="bg-white/20 rounded-lg p-4 inline-block">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl">✨</span>
                <span className="font-semibold">Multi-Model Analysis Active</span>
                <span>• HTML + JavaScript + CSS analyzed together</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Playground */}
      <section className="container mx-auto px-6 py-8">
        {/* Example Selector */}
        <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Load Example:</label>
              <select
                value={selectedExample}
                onChange={(e) => loadExample(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-base"
              >
                <optgroup label="Multi-Model Examples (HTML + JS + CSS)">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'multi-model')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
                <optgroup label="React Examples (JSX/TSX)">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'react')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
                <optgroup label="Svelte Examples (.svelte)">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'svelte')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
                <optgroup label="Vue Examples (.vue)">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'vue')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
                <optgroup label="Angular Examples (.html)">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'angular')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
                <optgroup label="Structural HTML Examples">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'structural-html')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
                <optgroup label="JavaScript-Only Examples">
                  {Object.entries(EXAMPLES)
                    .filter(([_, ex]) => ex.category === 'js-only')
                    .map(([key, ex]) => (
                      <option key={key} value={key}>{ex.title}</option>
                    ))}
                </optgroup>
              </select>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2">Description:</div>
              <p className="text-gray-700">{currentExample.description}</p>
              {currentExample.category === 'multi-model' && (
                <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Multi-Model
                </span>
              )}
              {currentExample.category === 'react' && (
                <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                  ⚛️ React
                </span>
              )}
              {currentExample.category === 'svelte' && (
                <span className="inline-block mt-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                  ⚡ Svelte
                </span>
              )}
              {currentExample.category === 'vue' && (
                <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  🟢 Vue
                </span>
              )}
              {currentExample.category === 'angular' && (
                <span className="inline-block mt-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                  🅰️ Angular
                </span>
              )}
              {currentExample.category === 'structural-html' && (
                <span className="inline-block mt-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                  📄 Structural HTML
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold mb-2">Actions:</div>
              <button
                onClick={() => {
                  setFiles({ html: [], javascript: [], css: [] });
                  setActiveFileTab('javascript');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                title="Clear all files and start fresh"
              >
                🗑️ Clear All
              </button>
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-200">
                <div className="font-semibold mb-1">💡 Tip:</div>
                Click file type tabs to add files. Hover over file tabs to remove them.
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Multi-File Editor */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* File Type Tabs */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex">
                  <button
                    onClick={() => {
                      if (files.html.length === 0) {
                        addFile('html');
                      }
                      setActiveFileTab('html');
                    }}
                    className={`px-6 py-3 font-semibold text-sm transition-colors border-r border-gray-200 ${
                      activeFileTab === 'html'
                        ? 'bg-white text-paradise-blue border-b-2 border-paradise-blue'
                        : 'text-gray-600 hover:text-paradise-blue hover:bg-gray-100'
                    }`}
                  >
                    📄 HTML
                    {files.html.length > 0 ? (
                      <span className="ml-2 text-xs">({files.html.length} file{files.html.length > 1 ? 's' : ''})</span>
                    ) : (
                      <span className="ml-2 text-xs text-gray-400">(click to add)</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (files.javascript.length === 0) {
                        addFile('javascript');
                      }
                      setActiveFileTab('javascript');
                    }}
                    className={`px-6 py-3 font-semibold text-sm transition-colors border-r border-gray-200 ${
                      activeFileTab === 'javascript'
                        ? 'bg-white text-paradise-blue border-b-2 border-paradise-blue'
                        : 'text-gray-600 hover:text-paradise-blue hover:bg-gray-100'
                    }`}
                  >
                    ⚡ JavaScript
                    {files.javascript.length > 0 ? (
                      <span className="ml-2 text-xs">({files.javascript.length} file{files.javascript.length > 1 ? 's' : ''})</span>
                    ) : (
                      <span className="ml-2 text-xs text-gray-400">(click to add)</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (files.css.length === 0) {
                        addFile('css');
                      }
                      setActiveFileTab('css');
                    }}
                    className={`px-6 py-3 font-semibold text-sm transition-colors ${
                      activeFileTab === 'css'
                        ? 'bg-white text-paradise-blue border-b-2 border-paradise-blue'
                        : 'text-gray-600 hover:text-paradise-blue hover:bg-gray-100'
                    }`}
                  >
                    🎨 CSS
                    {files.css.length > 0 ? (
                      <span className="ml-2 text-xs">({files.css.length} file{files.css.length > 1 ? 's' : ''})</span>
                    ) : (
                      <span className="ml-2 text-xs text-gray-400">(click to add)</span>
                    )}
                  </button>
                  {isAnalyzing && (
                    <div className="ml-auto px-4 py-3 text-sm text-paradise-blue animate-pulse">
                      Analyzing...
                    </div>
                  )}
                </div>
              </div>

              {/* Individual File Tabs with Add/Remove */}
              {currentFileArray.length > 0 && (
                <div className="border-b border-gray-200 bg-gray-100">
                  <div className="flex overflow-x-auto items-center">
                    {currentFileArray.map((file, index) => (
                      <div key={index} className="flex items-center group">
                        <button
                          onClick={() => setActiveFileIndex(prev => ({ ...prev, [activeFileTab]: index }))}
                          className={`px-4 py-2 text-sm font-mono whitespace-nowrap transition-colors ${
                            activeFileIndex[activeFileTab] === index
                              ? 'bg-white text-paradise-blue border-b-2 border-paradise-blue'
                              : 'text-gray-600 hover:text-paradise-blue hover:bg-gray-50'
                          }`}
                        >
                          {file.name}
                        </button>
                        {currentFileArray.length > 1 && (
                          <button
                            onClick={() => removeFile(activeFileTab, index)}
                            className="px-2 py-2 text-xs text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addFile(activeFileTab)}
                      className="px-4 py-2 text-sm text-paradise-blue hover:bg-white/50 transition-colors ml-2 font-semibold"
                      title="Add new file"
                    >
                      + Add File
                    </button>
                  </div>
                </div>
              )}

              {/* Monaco Editor */}
              {currentFile ? (
                <div className="bg-white">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <input
                      type="text"
                      value={currentFile.name}
                      onChange={(e) => renameFile(activeFileTab, activeFileIndex[activeFileTab], e.target.value)}
                      className="text-xs text-gray-600 font-mono bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-paradise-blue rounded px-2 py-1"
                      style={{ width: `${Math.max(currentFile.name.length, 10)}ch` }}
                    />
                    <div className="text-xs text-gray-400">
                      {getLanguageForTab(activeFileTab).toUpperCase()}
                    </div>
                  </div>
                  <MonacoEditor
                    height="500px"
                    language={getLanguageForTab(activeFileTab)}
                    value={currentFile.content}
                    onChange={(value) => updateFile(activeFileTab, value || '')}
                    onMount={(editor) => setMonacoEditor(editor)}
                    theme="vs-light"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: 'on',
                      readOnly: false
                    }}
                  />
                </div>
              ) : (
                <div className="bg-white p-12 text-center text-gray-500">
                  <p className="text-lg mb-4">No files yet</p>
                  <button
                    onClick={() => addFile(activeFileTab)}
                    className="px-6 py-3 bg-paradise-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
                  >
                    + Add {activeFileTab.toUpperCase()} File
                  </button>
                </div>
              )}
            </div>

            {/* Model Visualization */}
            {hasMultipleFiles && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  Multi-Model Integration
                </h3>
                <div className="space-y-3">
                  {files.html.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                        DOM
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">DOMModel (HTML)</div>
                        <div className="text-xs text-gray-600">
                          {files.html.length} file{files.html.length > 1 ? 's' : ''} • Elements: {files.html.reduce((acc, f) => acc + (f.content.match(/<[a-z]+/gi) || []).length, 0)}
                        </div>
                      </div>
                    </div>
                  )}

                  {files.javascript.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-paradise-blue text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                        JS
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">ActionLanguage (JavaScript)</div>
                        <div className="text-xs text-gray-600">
                          {files.javascript.length} file{files.javascript.length > 1 ? 's' : ''} • Actions: {actionLanguage.length} nodes
                        </div>
                      </div>
                    </div>
                  )}

                  {files.css.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
                        CSS
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">CSSModel (Styles)</div>
                        <div className="text-xs text-gray-600">
                          {files.css.length} file{files.css.length > 1 ? 's' : ''} • Rules: {files.css.reduce((acc, f) => acc + (f.content.match(/\{/g) || []).length, 0)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-green-300">
                    <div className="text-sm font-semibold text-green-800 flex items-center gap-2">
                      <span>→</span>
                      <span>Merged DocumentModel enables cross-file analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Analysis Results */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              {/* Result Tabs */}
              <div className="flex gap-2 mb-4 border-b">
                <button
                  onClick={() => setActiveResultTab('issues')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeResultTab === 'issues'
                      ? 'text-paradise-orange border-b-2 border-paradise-orange'
                      : 'text-gray-600 hover:text-paradise-orange'
                  }`}
                >
                  🔍 Issues ({issues.length})
                </button>
                <button
                  onClick={() => setActiveResultTab('actionlanguage')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeResultTab === 'actionlanguage'
                      ? 'text-paradise-blue border-b-2 border-paradise-blue'
                      : 'text-gray-600 hover:text-paradise-blue'
                  }`}
                >
                  📊 ActionLanguage ({actionLanguage.length})
                </button>
                {hasMultipleFiles && (
                  <button
                    onClick={() => setActiveResultTab('models')}
                    className={`px-4 py-2 font-semibold transition-colors ${
                      activeResultTab === 'models'
                        ? 'text-paradise-green border-b-2 border-paradise-green'
                        : 'text-gray-600 hover:text-paradise-green'
                    }`}
                  >
                    🔗 Models
                  </button>
                )}
              </div>

              {/* Issues Tab */}
              {activeResultTab === 'issues' && (
                <div className="space-y-4">
                  <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-4 rounded-r">
                    <h3 className="font-bold mb-2">Accessibility Analysis</h3>
                    <p className="text-sm text-gray-700">
                      {hasMultipleFiles ? 'Multi-model analysis across HTML, JavaScript, and CSS:' : 'JavaScript-only analysis:'}
                    </p>
                  </div>

                  {issues.length === 0 ? (
                    <div className="bg-paradise-green/10 border border-paradise-green rounded-lg p-8 text-center">
                      <div className="text-5xl mb-3">✅</div>
                      <div className="font-bold text-paradise-green text-lg mb-2">No Issues Found!</div>
                      <div className="text-sm text-gray-700">
                        This code follows accessibility best practices.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {issues.map((issue, idx) => (
                        <div
                          key={idx}
                          onClick={() => jumpToIssue(issue, idx)}
                          className={`rounded-lg p-4 border-l-4 transition-all ${
                            issue.severity === 'error'
                              ? 'bg-red-50 border-red-500'
                              : 'bg-yellow-50 border-yellow-500'
                          } ${
                            issue.line
                              ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'
                              : ''
                          } ${
                            selectedIssueIndex === idx
                              ? 'ring-2 ring-blue-500 shadow-lg'
                              : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-sm bg-white px-3 py-1 rounded font-semibold">
                              {issue.type}
                            </span>
                            <div className="flex items-center gap-2">
                              {issue.line && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                                  Line {issue.line}
                                </span>
                              )}
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                issue.severity === 'error' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                              }`}>
                                {issue.severity.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm font-semibold mb-2">{issue.message}</p>
                          <div className="flex items-center justify-between gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-4">
                              <span>WCAG: {issue.wcag.join(', ')}</span>
                              {issue.location && (
                                <span className="bg-gray-200 px-2 py-1 rounded">{issue.location}</span>
                              )}
                              {issue.line && (
                                <span className="text-blue-600 font-semibold">Click to jump →</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDocumentation(issue);
                              }}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded font-semibold transition-colors"
                            >
                              📖 View Docs
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ActionLanguage Tab */}
              {activeResultTab === 'actionlanguage' && (
                <div className="space-y-4">
                  <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-4 rounded-r">
                    <h3 className="font-bold mb-2">ActionLanguage Nodes</h3>
                    <p className="text-sm text-gray-700">
                      JavaScript transformed into {actionLanguage.length} intermediate representation nodes:
                    </p>
                  </div>

                  {actionLanguage.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No ActionLanguage nodes detected. Add JavaScript code with event handlers or ARIA updates.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {actionLanguage.map((node, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-sm bg-paradise-blue/20 text-paradise-blue px-2 py-1 rounded font-semibold">
                              {node.actionType}
                            </span>
                            <span className="text-xs text-gray-500">
                              Line {node.location?.line}
                            </span>
                          </div>
                          <pre className="text-xs bg-white p-3 rounded overflow-x-auto border border-gray-200">
                            {JSON.stringify(node, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Models Tab */}
              {activeResultTab === 'models' && hasMultipleFiles && (
                <div className="space-y-4">
                  <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-4 rounded-r">
                    <h3 className="font-bold mb-2">Model Integration Graph</h3>
                    <p className="text-sm text-gray-700">
                      Visual representation of how models connect:
                    </p>
                  </div>

                  {/* Model Graph Visualization */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <div className="space-y-4">
                      {/* HTML Elements */}
                      {files.html.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-bold text-sm mb-2 text-orange-600">HTML Elements ({files.html.length} file{files.html.length > 1 ? 's' : ''})</div>
                          <div className="text-xs space-y-1">
                            {files.html.map((file, i) => (
                              <div key={i}>
                                <div className="font-mono text-xs text-gray-500 mb-1">{file.name}:</div>
                                {Array.from(file.content.matchAll(/<([a-z]+)[^>]*id=["']([^"']+)["']/gi)).map((match, j) => (
                                  <div key={j} className="flex items-center gap-2 ml-4">
                                    <span className="bg-orange-100 px-2 py-1 rounded font-mono">
                                      {match[1]}#{match[2]}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* JavaScript Actions */}
                      {actionLanguage.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-bold text-sm mb-2 text-blue-600">JavaScript Actions ({files.javascript.length} file{files.javascript.length > 1 ? 's' : ''})</div>
                          <div className="text-xs space-y-1">
                            {actionLanguage.map((node, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="bg-blue-100 px-2 py-1 rounded font-mono">
                                  {node.event || node.actionType}
                                </span>
                                <span className="text-gray-600">→ {node.element?.binding || 'element'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CSS Rules */}
                      {files.css.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-bold text-sm mb-2 text-purple-600">CSS Rules ({files.css.length} file{files.css.length > 1 ? 's' : ''})</div>
                          <div className="text-xs space-y-1">
                            {files.css.map((file, i) => (
                              <div key={i}>
                                <div className="font-mono text-xs text-gray-500 mb-1">{file.name}:</div>
                                {Array.from(file.content.matchAll(/(#[\w-]+|\.[\w-]+|\w+)\s*\{/g)).map((match, j) => (
                                  <div key={j} className="flex items-center gap-2 ml-4">
                                    <span className="bg-purple-100 px-2 py-1 rounded font-mono">
                                      {match[1]}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                        <div className="text-sm font-semibold text-green-800">
                          All models merged into unified DocumentModel
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          Cross-file validation enabled • Zero false positives
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-paradise-blue/10 rounded-lg p-8 border border-paradise-blue/20">
          <h3 className="text-2xl font-bold mb-4 text-paradise-blue">How Multi-Model Analysis Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-2 text-lg">🎯 Phase 1: Parse</div>
              <p className="text-gray-700">
                Each file is parsed into its specialized model: HTML → DOMModel, JavaScript → ActionLanguage, CSS → CSSModel.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2 text-lg">🔗 Phase 2: Merge</div>
              <p className="text-gray-700">
                Models are merged via selectors (ID, class, tag). JavaScript handlers attach to DOM elements, CSS rules connect to both.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2 text-lg">✅ Phase 3: Analyze</div>
              <p className="text-gray-700">
                Analyzers query the unified DocumentModel with complete context, eliminating false positives and detecting cross-file issues.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Use Paradise?</h3>
          <p className="text-lg mb-6">
            Get instant accessibility analysis in VS Code with multi-model support.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/extension"
              className="bg-white text-paradise-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get VS Code Extension
            </a>
            <a
              href="/analyzers"
              className="bg-paradise-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors"
            >
              View All 13 Analyzers
            </a>
            <a
              href="/learn-actionlanguage"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn ActionLanguage
            </a>
          </div>
        </div>
      </section>

      {/* Documentation Modal */}
      {selectedDocIssue && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeDocumentation}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-paradise-purple text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedDocIssue.type}</h2>
                <p className="text-purple-100 text-sm">{selectedDocIssue.message}</p>
              </div>
              <button
                onClick={closeDocumentation}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Close documentation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-gray-900" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    code: ({node, inline, ...props}: any) =>
                      inline ? (
                        <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                      ) : (
                        <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props} />
                      ),
                    pre: ({node, ...props}) => <pre className="mb-4 rounded-lg overflow-hidden" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-paradise-purple pl-4 italic text-gray-600 my-4" {...props} />,
                    a: ({node, ...props}) => <a className="text-paradise-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                    hr: ({node, ...props}) => <hr className="my-8 border-gray-300" {...props} />,
                  }}
                >
                  {docContent}
                </ReactMarkdown>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex items-center justify-between border-t">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className={`px-3 py-1 rounded font-semibold ${
                  selectedDocIssue.severity === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedDocIssue.severity.toUpperCase()}
                </span>
                <span>WCAG: {selectedDocIssue.wcag.join(', ')}</span>
              </div>
              <button
                onClick={closeDocumentation}
                className="bg-paradise-purple text-white px-6 py-2 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
