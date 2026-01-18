'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { parse, ParserOptions } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

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
    title: 'React forwardRef + useImperativeHandle',
    description: 'Proper ref forwarding for focus management',
    category: 'react',
    files: {
      html: [],
      javascript: [
        {
          name: 'FocusableInput.tsx',
          content: `import React, { useRef, useImperativeHandle } from 'react';

const FocusableInput = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    blur: () => {
      inputRef.current.blur();
    },
    select: () => {
      inputRef.current.select();
    }
  }));

  return (
    <input
      ref={inputRef}
      type="text"
      aria-label={props.label}
      placeholder={props.placeholder}
    />
  );
});

export default FocusableInput;`
        }
      ],
      css: []
    },
    issues: []
  },
  'react-context-a11y': {
    title: 'React Context for Accessibility State',
    description: 'Managing theme and announcements via Context',
    category: 'react',
    files: {
      html: [],
      javascript: [
        {
          name: 'AccessibilityProvider.tsx',
          content: `import React, { useState, useContext } from 'react';

// Context for theme (dark mode affects a11y)
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Context for screen reader announcements
const AnnouncementContext = React.createContext();

function AccessibilityProvider({ children }) {
  const announce = (message) => {
    // Announce to screen readers
    const liveRegion = document.getElementById('sr-announcements');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  };

  return (
    <AnnouncementContext.Provider value={{ announce }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

// Component using both contexts
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { announce } = useContext(AnnouncementContext);

  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    announce(\`Theme changed to \${newTheme} mode\`);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={\`Toggle theme, current: \${theme}\`}
    >
      Toggle Theme
    </button>
  );
}`
        }
      ],
      css: []
    },
    issues: []
  },
  'react-focus-trap': {
    title: 'React Dialog with Focus Trap',
    description: 'Proper focus management in modal dialog',
    category: 'react',
    files: {
      html: [],
      javascript: [
        {
          name: 'Dialog.tsx',
          content: `import React, { useEffect, useRef, useContext } from 'react';

function Dialog({ isOpen, onClose, title, children }) {
  const dialogRef = useRef();
  const closeButtonRef = useRef();
  const { trapFocus, releaseFocus } = useContext(FocusContext);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      const previouslyFocused = document.activeElement;

      // Focus the close button
      closeButtonRef.current?.focus();

      // Trap focus within dialog
      trapFocus(dialogRef.current);

      return () => {
        // Release focus trap
        releaseFocus();

        // Return focus to trigger
        previouslyFocused?.focus();
      };
    }
  }, [isOpen, trapFocus, releaseFocus]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <h2 id="dialog-title">{title}</h2>
      <div>{children}</div>
      <button ref={closeButtonRef} onClick={onClose}>
        Close
      </button>
    </div>
  );
}`
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

    // Extract element IDs from HTML
    const htmlElementIds = new Set<string>();
    const allHtml = currentFiles.html.map(f => f.content).join('\n');
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

    // Mouse-only click detection (works with or without HTML)
    // This uses proper selector matching to handle cross-file analysis
    // Native interactive elements (<button>, <a>, etc.) don't need explicit keyboard handlers
    const clickHandlers = nodes.filter(n => n.actionType === 'eventHandler' && n.event === 'click');

    // Extract element tags from HTML for tag-aware detection
    const elementTags = new Map<string, string>();
    if (allHtml) {
      // Match elements with id attributes and capture their tag names
      const tagMatches = allHtml.matchAll(/<(\w+)[^>]*id=["']([^"']+)["']/g);
      for (const match of tagMatches) {
        const tagName = match[1].toLowerCase();
        const id = match[2];
        elementTags.set(`#${id}`, tagName);
      }
    }

    // Elements that are natively keyboard accessible
    const nativelyInteractive = new Set(['button', 'a', 'input', 'select', 'textarea', 'summary']);

    for (const click of clickHandlers) {
      // Match handlers by selector (e.g., #submitButton)
      // This correctly handles getElementById calls across multiple files
      const keyboardHandlers = nodes.filter(n =>
        n.actionType === 'eventHandler' &&
        n.element.selector === click.element.selector &&
        (n.event === 'keydown' || n.event === 'keypress' || n.event === 'keyup')
      );

      const hasKeyboard = keyboardHandlers.length > 0;

      // Check if this is a natively interactive element
      const elementTag = elementTags.get(click.element.selector);
      const isNativelyInteractive = elementTag && nativelyInteractive.has(elementTag);

      // Only flag non-interactive elements that lack keyboard handlers
      if (!hasKeyboard && !isNativelyInteractive) {
        detected.push({
          type: 'mouse-only-click',
          severity: 'warning',
          wcag: ['2.1.1'],
          message: elementTag
            ? `Click handler on <${elementTag}> element '${click.element.selector}' without keyboard equivalent. Use <button> or add keyboard handler + role="button" + tabindex="0"`
            : `Click handler on '${click.element.selector}' without keyboard equivalent`,
          location: 'JavaScript'
        });
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

    // Svelte-specific analysis for .svelte files
    for (const jsFile of currentFiles.javascript) {
      if (jsFile.name.endsWith('.svelte')) {
        const source = jsFile.content;

        // 1. bind:value/bind:checked without labels
        const bindValueMatches = source.matchAll(/bind:(value|checked)/g);
        for (const match of bindValueMatches) {
          const surroundingCode = source.substring(Math.max(0, match.index! - 200), match.index! + 200);
          const hasLabel = /(?:aria-label|aria-labelledby|<label[^>]*for=)/i.test(surroundingCode);
          const hasId = /<(?:input|select|textarea)[^>]*id=/i.test(surroundingCode);

          if (!hasLabel && !hasId) {
            detected.push({
              type: 'svelte-bind-no-label',
              severity: 'error',
              wcag: ['4.1.2', '1.3.1'],
              message: `Input with bind:${match[1]} lacks accessible label. Add <label> or aria-label.`,
              location: jsFile.name
            });
          }
        }

        // 2. bind:group without fieldset
        const bindGroupMatches = source.matchAll(/bind:group/g);
        for (const match of bindGroupMatches) {
          const surroundingCode = source.substring(Math.max(0, match.index! - 500), match.index! + 100);
          const hasFieldset = /<fieldset/i.test(surroundingCode);

          if (!hasFieldset) {
            detected.push({
              type: 'svelte-bind-group-no-fieldset',
              severity: 'warning',
              wcag: ['1.3.1'],
              message: 'Radio/checkbox group with bind:group should be wrapped in <fieldset> with <legend>.',
              location: jsFile.name
            });
          }
        }

        // 3. on:click on non-interactive elements without keyboard handler
        const onClickMatches = source.matchAll(/<(div|span|p|li|td|th|section|article|aside|header|footer|main|nav)[^>]*on:click/gi);
        for (const match of onClickMatches) {
          const tagName = match[1];
          const surroundingCode = source.substring(match.index!, match.index! + 300);
          const hasKeydown = /on:keydown/i.test(surroundingCode);
          const hasRole = /role=/i.test(surroundingCode);
          const hasTabindex = /tabindex=/i.test(surroundingCode);

          if (!hasKeydown || !hasRole || !hasTabindex) {
            detected.push({
              type: 'svelte-click-no-keyboard',
              severity: 'error',
              wcag: ['2.1.1', '2.1.2'],
              message: `<${tagName}> with on:click needs on:keydown handler, role, and tabindex for keyboard accessibility.`,
              location: jsFile.name
            });
          }
        }

        // 4. class: directive with visibility keywords without aria-hidden
        const classDirectiveMatches = source.matchAll(/class:(hidden|visible|show|hide|open|closed|collapsed|expanded)/gi);
        for (const match of classDirectiveMatches) {
          const className = match[1];
          const surroundingCode = source.substring(match.index!, match.index! + 200);
          const hasAriaHidden = /aria-hidden=/i.test(surroundingCode);
          const hasAriaExpanded = /aria-expanded=/i.test(surroundingCode);

          if (!hasAriaHidden && !hasAriaExpanded) {
            detected.push({
              type: 'svelte-class-visibility-no-aria',
              severity: 'warning',
              wcag: ['4.1.2', '4.1.3'],
              message: `class:${className} affects visibility but lacks aria-hidden or aria-expanded to communicate state changes.`,
              location: jsFile.name
            });
          }
        }

        // 5. Reactive statements ($:) with focus() without onDestroy cleanup
        const reactiveStatements = source.matchAll(/\$:\s*(?:if\s*\([^)]+\)\s*)?\{[^}]*\.focus\(\)[^}]*\}/g);
        for (const match of reactiveStatements) {
          const hasOnDestroy = /onDestroy\s*\(/i.test(source);
          const hasFocusRestore = /\.focus\(\)/g.test(source) && source.match(/\.focus\(\)/g)!.length > 1;

          if (!hasOnDestroy && !hasFocusRestore) {
            detected.push({
              type: 'svelte-reactive-focus-no-cleanup',
              severity: 'warning',
              wcag: ['2.4.3'],
              message: 'Reactive statement ($:) manages focus without onDestroy cleanup. Store and restore previous focus.',
              location: jsFile.name
            });
          }
        }

        // 6. Store subscriptions ($store) in accessibility contexts without aria-live
        const storeUsageMatches = source.matchAll(/\$(\w*(?:a11y|accessibility|announce|notification|alert|message)\w*)/gi);
        for (const match of storeUsageMatches) {
          const storeName = match[1];
          const hasAriaLive = /aria-live=/i.test(source);
          const hasRole = /role=["'](?:alert|status|log)["']/i.test(source);

          if (!hasAriaLive && !hasRole) {
            detected.push({
              type: 'svelte-store-no-aria-live',
              severity: 'warning',
              wcag: ['4.1.3'],
              message: `Store $${storeName} manages accessibility state but lacks aria-live region for screen reader announcements.`,
              location: jsFile.name
            });
          }
        }

        // 7. Missing role="dialog" and aria-modal on modal patterns
        const modalPatterns = /(?:modal|dialog|overlay|popup)/i;
        if (modalPatterns.test(source) && /\.focus\(\)/.test(source)) {
          const hasRoleDialog = /role=["']dialog["']/i.test(source);
          const hasAriaModal = /aria-modal=/i.test(source);

          if (!hasRoleDialog) {
            detected.push({
              type: 'svelte-modal-no-role',
              severity: 'error',
              wcag: ['4.1.2'],
              message: 'Modal component lacks role="dialog". Add to container element.',
              location: jsFile.name
            });
          }

          if (!hasAriaModal) {
            detected.push({
              type: 'svelte-modal-no-aria-modal',
              severity: 'warning',
              wcag: ['4.1.2'],
              message: 'Modal component should have aria-modal="true" to indicate modal state.',
              location: jsFile.name
            });
          }
        }

        // 8. Missing Escape key handler for modal/dropdown patterns
        if (modalPatterns.test(source) || /dropdown|menu|popover/i.test(source)) {
          const hasEscapeHandler = /(?:key|keyCode)\s*===?\s*["']Escape["']|key\s*===?\s*27/i.test(source);

          if (!hasEscapeHandler) {
            detected.push({
              type: 'svelte-modal-no-escape',
              severity: 'error',
              wcag: ['2.1.2'],
              message: 'Modal/dropdown component missing Escape key handler for closing. Add on:keydown listener.',
              location: jsFile.name
            });
          }
        }

        // 9. Toggle state without aria-expanded
        const toggleStateMatches = source.matchAll(/let\s+(isOpen|isExpanded|isVisible|showMenu|showDropdown)\s*=/g);
        for (const match of toggleStateMatches) {
          const stateName = match[1];
          const hasAriaExpanded = new RegExp(`aria-expanded=\\{${stateName}\\}`, 'i').test(source);

          if (!hasAriaExpanded) {
            detected.push({
              type: 'svelte-toggle-no-aria-expanded',
              severity: 'warning',
              wcag: ['4.1.2'],
              message: `State variable '${stateName}' suggests toggle behavior but lacks aria-expanded attribute.`,
              location: jsFile.name
            });
          }
        }
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
                          className={`rounded-lg p-4 border-l-4 ${
                            issue.severity === 'error'
                              ? 'bg-red-50 border-red-500'
                              : 'bg-yellow-50 border-yellow-500'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-sm bg-white px-3 py-1 rounded font-semibold">
                              {issue.type}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              issue.severity === 'error' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                            }`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm font-semibold mb-2">{issue.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>WCAG: {issue.wcag.join(', ')}</span>
                            {issue.location && (
                              <span className="bg-gray-200 px-2 py-1 rounded">{issue.location}</span>
                            )}
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
    </main>
  );
}
