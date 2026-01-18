# React Analyzer Documentation

## Overview

Paradise now includes a unified React accessibility analyzer that follows the correct Paradise architecture:

- Extends `BaseAnalyzer`
- Accepts `AnalyzerContext` with `actionLanguageModel`
- Works with ActionLanguage nodes extracted by `ReactActionLanguageExtractor`
- Detection is from models, not direct Babel parsing

**Total Analyzers: 16**

- 9 JavaScript-only analyzers
- 6 Multi-model analyzers
- 1 React analyzer (NEW)

## Architecture

### ReactActionLanguageExtractor

Converts React patterns into ActionLanguage nodes:

- **JSX Event Handlers**: `onClick`, `onKeyDown`, etc. → `eventHandler` nodes
- **useEffect Focus Management**: `.focus()` / `.blur()` calls → `focusChange` nodes
- **React Portals**: `ReactDOM.createPortal()` → `portal` nodes
- **Event Propagation**: `stopPropagation()` / `stopImmediatePropagation()` → `eventPropagation` nodes

### React Analyzer

## Analyzer #16: ReactA11yAnalyzer

**Name**: `react-a11y`

**Description**: Unified React accessibility analyzer detecting useEffect focus management, portals, and event propagation issues

**WCAG**: 2.1.1 (Keyboard), 2.4.3 (Focus Order), 4.1.2 (Name, Role, Value)

**What it detects**:

1. **useEffect Focus Management**: `useEffect` with focus management (`.focus()` or `.blur()`) that may lack cleanup functions
2. **React Portals**: `ReactDOM.createPortal()` usage that can break accessibility
3. **Event Propagation**: `event.stopPropagation()` that blocks assistive technology

**Issue Types**:

- `react-useeffect-focus-cleanup` (WARNING)
- `react-portal-accessibility` (WARNING for `document.body`, ERROR for other containers)
- `react-stopPropagation` (WARNING)
- `react-stopImmediatePropagation` (ERROR - critical issue)

**Example Issues**:

### 1. useEffect Focus Management

```javascript
// BAD: No cleanup
useEffect(() => {
  dialogRef.current.focus(); // Focus leak!
}, [isOpen]);

// GOOD: With cleanup
useEffect(() => {
  dialogRef.current.focus();
  return () => {
    // Restore focus to previous element
    previousFocusRef.current?.focus();
  };
}, [isOpen]);
```

### 2. React Portals

```javascript
// PROBLEM: Portal without proper accessibility
return createPortal(
  <div className="modal">
    <h2>Modal Title</h2>
    {children}
  </div>,
  document.body
);

// SOLUTION: Accessible portal pattern
function AccessibleModal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement;
      modalRef.current?.focus();

      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        previouslyFocused?.focus();
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
    </div>,
    document.getElementById('portal-root')
  );
}
```

### 3. Event Propagation

```javascript
// BAD: stopPropagation blocks assistive technology
const handleClick = (event) => {
  event.stopPropagation(); // Blocks accessibility!
  // handler logic
};

// GOOD: Use preventDefault instead
const handleClick = (event) => {
  event.preventDefault(); // Prevents default action, allows propagation
  // handler logic
};

// ACCEPTABLE: Conditional propagation
const handleClick = (event) => {
  const isFromAccessibility =
    event.detail?.fromScreenReader ||
    event.detail?.fromKeyboard;

  if (!isFromAccessibility) {
    event.stopPropagation();
  }
  // handler logic
};
```

---

## Integration

### Playground

React files are automatically detected and parsed with `ReactActionLanguageExtractor`:

```typescript
// Detection criteria:
- filename.endsWith('.jsx') || filename.endsWith('.tsx')
- OR code.includes('React')
- OR code.includes('useState')
- OR code.includes('useEffect')
```

### VS Code Extension

The extension has been rebuilt with the new React analyzer. Install the updated `.vsix` file to get React analysis.

---

## Testing

The React analyzer follows Paradise testing patterns:

1. **Unit tests**: Test each detection method independently with ActionLanguage models
2. **Integration tests**: Test with React code samples
3. **Playground tests**: Verify the analyzer works with other analyzers

---

## Summary

The React analyzer completes Paradise's framework coverage:

- ✅ Vanilla JavaScript
- ✅ Angular (templates and components)
- ✅ Vue (templates and components)
- ✅ Svelte (templates and components)
- ✅ **React (JSX, hooks, portals, event propagation)**

All analyzers follow the same architecture, ensuring consistency and maintainability across the Paradise codebase.
