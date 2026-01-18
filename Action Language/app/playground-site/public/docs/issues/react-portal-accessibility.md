# react-portal-accessibility

**Severity:** Warning
**WCAG Criteria:** [2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap), [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)

## Description

React Portals render components outside the normal DOM hierarchy, often used for modals, tooltips, and dropdowns. This can create accessibility issues if focus management, ARIA relationships, and keyboard navigation aren't properly handled across the portal boundary.

## Why This Matters

- **Focus Management**: Portals break the DOM tree, so focus can become trapped or lost
- **Screen Readers**: Portals can disconnect content from its context
- **Keyboard Navigation**: Users need to navigate into and out of portals
- **ARIA Relationships**: `aria-labelledby`, `aria-describedby` may break across portals

## The Problem

### Pattern 1: Modal Without Focus Trap

```jsx
// ❌ BAD: Portal modal without focus management
function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root')
  );
}

// User can Tab out of modal to background content!
```

### Pattern 2: Missing ARIA Attributes

```jsx
// ❌ BAD: Portal dialog without proper ARIA
function Dialog({ children }) {
  return ReactDOM.createPortal(
    <div className="dialog">
      <h2>Title</h2>
      {children}
    </div>,
    document.getElementById('dialog-root')
  );
}

// Missing: role="dialog", aria-modal, aria-labelledby
```

### Pattern 3: No Focus Restoration

```jsx
// ❌ BAD: Focus not restored when portal closes
function Tooltip({ trigger, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>{trigger}</button>
      {isOpen && ReactDOM.createPortal(
        <div className="tooltip">{content}</div>,
        document.body
      )}
    </>
  );
}

// When tooltip closes, focus is lost!
```

## The Solution

### Solution 1: Proper Focus Trap

```jsx
// ✅ GOOD: Focus trap with react-focus-lock
import FocusLock from 'react-focus-lock';

function Modal({ isOpen, onClose, children }) {
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store what had focus before opening
      previousFocus.current = document.activeElement;
    } else if (previousFocus.current) {
      // Restore focus when closing
      previousFocus.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <FocusLock returnFocus>
      <div
        role="dialog"
        aria-modal="true"
        className="modal"
      >
        <button onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </FocusLock>,
    document.getElementById('modal-root')
  );
}
```

### Solution 2: Complete Dialog Pattern

```jsx
// ✅ GOOD: Accessible dialog with all ARIA attributes
function Dialog({ isOpen, onClose, title, children }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Focus first focusable element
      const firstFocusable = dialogRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <FocusLock returnFocus>
      <div className="modal-overlay" onClick={onClose}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="dialog"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id={titleId}>{title}</h2>
          {children}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </FocusLock>,
    document.getElementById('dialog-root')
  );
}
```

### Solution 3: Tooltip with Focus Management

```jsx
// ✅ GOOD: Accessible tooltip
function Tooltip({ trigger, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const tooltipId = useId();

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsOpen(false);
        }}
        aria-describedby={isOpen ? tooltipId : undefined}
      >
        {trigger}
      </button>
      {isOpen && ReactDOM.createPortal(
        <div
          id={tooltipId}
          role="tooltip"
          className="tooltip"
        >
          {content}
          <button
            onClick={() => {
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Close tooltip"
          >
            ×
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
```

## Common Scenarios

### Scenario 1: Dropdown Menu Portal

```jsx
// ✅ GOOD: Accessible dropdown with portal
function Dropdown({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuId = useId();

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        {trigger}
      </button>
      {isOpen && ReactDOM.createPortal(
        <FocusLock returnFocus>
          <ul
            id={menuId}
            role="menu"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
                buttonRef.current?.focus();
              }
            }}
          >
            {items.map((item, i) => (
              <li key={i} role="none">
                <button role="menuitem">{item}</button>
              </li>
            ))}
          </ul>
        </FocusLock>,
        document.body
      )}
    </>
  );
}
```

### Scenario 2: Toast Notifications

```jsx
// ✅ GOOD: Accessible toast portal
function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  return ReactDOM.createPortal(
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="toast-container"
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          role="status"
          className="toast"
        >
          {toast.message}
          <button
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    document.getElementById('toast-root')
  );
}
```

### Scenario 3: Date Picker Portal

```jsx
// ✅ GOOD: Accessible date picker
function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsOpen(false);
        }}
        aria-label="Select date"
        aria-haspopup="dialog"
      />
      {isOpen && ReactDOM.createPortal(
        <FocusLock returnFocus>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose date"
          >
            <Calendar
              value={value}
              onChange={(date) => {
                onChange(date);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
            />
            <button onClick={() => {
              setIsOpen(false);
              inputRef.current?.focus();
            }}>
              Cancel
            </button>
          </div>
        </FocusLock>,
        document.getElementById('picker-root')
      )}
    </>
  );
}
```

## How Paradise Detects This

Paradise checks for:
1. `ReactDOM.createPortal()` usage without focus management
2. Portal dialogs missing `role="dialog"` or `aria-modal`
3. Portals without keyboard event handlers (Escape, Tab)
4. Missing ARIA relationships across portal boundaries

## Testing

### Manual Testing

1. **Tab Navigation**: Can you Tab into the portal? Can you Tab out?
2. **Escape Key**: Does Escape close the portal and restore focus?
3. **Focus Trap**: Can you Tab to background content when modal is open?
4. **Focus Restoration**: Does focus return to trigger element when closing?

### React DevTools

Look for:
- `Portal` components in the tree
- Elements rendered outside parent hierarchy

### Screen Reader Testing

- **NVDA/JAWS**: Navigate to portal, check if relationships are maintained
- **VoiceOver**: Check if portal content is announced with context

## Recommended Libraries

### react-focus-lock
```bash
npm install react-focus-lock
```

Automatically traps focus within a component:

```jsx
import FocusLock from 'react-focus-lock';

<FocusLock returnFocus>
  <YourPortalContent />
</FocusLock>
```

### react-aria
```bash
npm install react-aria
```

Complete accessible components including Dialog, Modal, Popover:

```jsx
import { useDialog } from 'react-aria';

function MyDialog(props) {
  const { dialogProps } = useDialog(props, ref);
  return <div {...dialogProps}>{props.children}</div>;
}
```

### @reach/dialog
```bash
npm install @reach/dialog
```

Pre-built accessible dialog component:

```jsx
import { Dialog } from '@reach/dialog';

<Dialog isOpen={isOpen} onDismiss={close}>
  <p>Content</p>
</Dialog>
```

## Related Issues

- `potential-keyboard-trap`: Focus cannot escape
- `mouse-only-click`: No keyboard access to trigger
- `missing-aria-connection`: ARIA references broken across portal

## Additional Resources

- [React Docs: Portals](https://react.dev/reference/react-dom/createPortal)
- [ARIA Authoring Practices: Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [react-focus-lock Documentation](https://github.com/theKashey/react-focus-lock)

---

**Detected by:** Paradise Accessibility Analyzer
**Confidence:** HIGH for React/JSX files
**Auto-fix:** Not available (requires architectural changes)
