# react-stop-propagation

**Severity:** Info
**WCAG Criteria:** [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

Using `event.stopPropagation()` in React event handlers can interfere with accessibility features that rely on event bubbling, such as keyboard navigation, focus management, and screen reader interactions. This is especially problematic in complex components where parent elements need to handle events.

## Why This Matters

- **Keyboard Navigation**: May block keyboard event handlers on parent elements
- **Screen Readers**: Can prevent screen reader shortcuts from working
- **Focus Management**: May interfere with focus trap implementations
- **Component Composition**: Breaks event delegation patterns

## The Problem

### Pattern 1: Blocking Parent Click Handlers

```jsx
// ❌ BAD: Child blocks parent's click handler
function Card({ onClick, children }) {
  return (
    <div onClick={onClick} className="card">
      <button onClick={(e) => {
        e.stopPropagation(); // Blocks card's onClick!
        console.log('Button clicked');
      }}>
        Delete
      </button>
      {children}
    </div>
  );
}

// Parent's onClick never fires when button is clicked
<Card onClick={() => console.log('Card clicked')}>
  Content
</Card>
```

### Pattern 2: Blocking Keyboard Events

```jsx
// ❌ BAD: Blocks parent keyboard handlers
function Input({ onEscape }) {
  return (
    <div onKeyDown={(e) => {
      if (e.key === 'Escape') onEscape();
    }}>
      <input
        onKeyDown={(e) => {
          e.stopPropagation(); // Blocks parent's Escape handler!
          // Handle other keys...
        }}
      />
    </div>
  );
}
```

### Pattern 3: Breaking Focus Traps

```jsx
// ❌ BAD: Interferes with focus trap
function Modal({ children }) {
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          // Focus trap logic
        }
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
        {/* Child events blocked, focus trap broken */}
      </div>
    </div>
  );
}
```

## The Solution

### Solution 1: Check Event Target

Instead of stopping propagation, check if the event target is the element you care about:

```jsx
// ✅ GOOD: Only handle events on specific target
function Card({ onClick, children }) {
  const handleClick = (e) => {
    // Only fire if clicking the card itself, not children
    if (e.target === e.currentTarget) {
      onClick(e);
    }
  };

  return (
    <div onClick={handleClick} className="card">
      <button onClick={() => console.log('Button clicked')}>
        Delete
      </button>
      {children}
    </div>
  );
}
```

### Solution 2: Use Specific Event Handlers

```jsx
// ✅ GOOD: Specific handlers for each element
function Input({ onEscape, value, onChange }) {
  return (
    <div>
      <input
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onEscape(); // Don't stop propagation
          }
          // Handle other keys specific to input
        }}
      />
    </div>
  );
}
```

### Solution 3: Conditional Propagation

Only stop propagation when absolutely necessary:

```jsx
// ✅ GOOD: Only stop propagation for specific keys
function Dropdown({ isOpen, onClose }) {
  return (
    <div
      onKeyDown={(e) => {
        // Only stop propagation for keys we handle
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.stopPropagation();
          // Handle arrow key navigation
        }
        // Let Escape bubble up for modal/dialog handlers
      }}
    >
      {/* Dropdown content */}
    </div>
  );
}
```

## Common Scenarios

### Scenario 1: Nested Interactive Elements

```jsx
// ❌ BAD: Stop propagation in nested buttons
function ListItem({ item, onItemClick, onDelete }) {
  return (
    <li onClick={() => onItemClick(item)}>
      {item.name}
      <button onClick={(e) => {
        e.stopPropagation(); // Blocks onItemClick
        onDelete(item.id);
      }}>
        Delete
      </button>
    </li>
  );
}

// ✅ GOOD: Use data attributes or refs
function ListItem({ item, onItemClick, onDelete }) {
  const itemRef = useRef(null);

  return (
    <li
      ref={itemRef}
      onClick={(e) => {
        // Only fire if clicking the li directly
        if (e.target === itemRef.current) {
          onItemClick(item);
        }
      }}
    >
      {item.name}
      <button onClick={() => onDelete(item.id)}>
        Delete
      </button>
    </li>
  );
}
```

### Scenario 2: Modal with Clickable Content

```jsx
// ❌ BAD: Stops all click events from bubbling
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Too broad!
      >
        {children}
      </div>
    </div>
  );
}

// ✅ GOOD: Check if clicking overlay directly
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        // Only close if clicking overlay, not content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}
```

### Scenario 3: Drag and Drop

```jsx
// ❌ BAD: Stops propagation unconditionally
function DraggableItem({ children }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation(); // Blocks parent drag handlers
        // Drag logic
      }}
    >
      {children}
    </div>
  );
}

// ✅ GOOD: Let events bubble unless necessary
function DraggableItem({ children, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        // Don't stop propagation
        onDragStart?.(e);
        // Drag logic
      }}
    >
      {children}
    </div>
  );
}
```

## When stopPropagation IS Appropriate

There are legitimate cases for `stopPropagation()`:

### 1. Preventing Duplicate Actions

```jsx
// ✅ OK: Prevent form submission when clicking inside form
function FormWithButton() {
  return (
    <form onSubmit={handleSubmit}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          // Do something else, don't submit form
        }}
      >
        Cancel
      </button>
    </form>
  );
}
```

### 2. Complex Widget Interactions

```jsx
// ✅ OK: Stop propagation in complex tree/grid widgets
function TreeNode({ node, children }) {
  return (
    <div
      onClick={(e) => {
        // Stop propagation to prevent parent nodes from toggling
        e.stopPropagation();
        toggleNode(node);
      }}
    >
      {node.label}
      <div className="children">{children}</div>
    </div>
  );
}
```

### 3. Context Menus

```jsx
// ✅ OK: Prevent default context menu
function CustomContextMenu() {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        showCustomMenu();
      }}
    >
      Right-click me
    </div>
  );
}
```

## How Paradise Detects This

Paradise looks for:
1. `event.stopPropagation()` or `e.stopPropagation()` in event handlers
2. Usage in contexts where it might block keyboard navigation
3. Patterns that could interfere with accessibility features

This is flagged as **Info** level because it's not always wrong, but worth reviewing.

## Testing

### Manual Testing

1. **Test Keyboard Navigation**: Ensure all keyboard shortcuts work
2. **Test Screen Reader**: Check if screen reader shortcuts function
3. **Test Focus Management**: Verify focus traps and Tab navigation work
4. **Test Event Delegation**: Ensure parent handlers fire when expected

### Automated Testing

```jsx
// Test that events bubble correctly
test('button click does not block parent handler', () => {
  const parentHandler = jest.fn();
  const childHandler = jest.fn();

  render(
    <div onClick={parentHandler}>
      <button onClick={childHandler}>Click</button>
    </div>
  );

  fireEvent.click(screen.getByText('Click'));

  expect(childHandler).toHaveBeenCalled();
  expect(parentHandler).toHaveBeenCalled(); // Should also be called
});
```

## Alternatives to stopPropagation()

### 1. Event Target Checking

```jsx
onClick={(e) => {
  if (e.target === e.currentTarget) {
    // Handle event
  }
}}
```

### 2. Conditional Handling

```jsx
onClick={(e) => {
  if (shouldHandle(e)) {
    // Handle event
  }
}}
```

### 3. Separate Handlers

```jsx
// Different handlers for different elements
<div>
  <button onClick={handleButton}>Button</button>
  <div onClick={handleDiv}>Div</div>
</div>
```

## Related Issues

- `mouse-only-click`: No keyboard equivalent
- `potential-keyboard-trap`: Focus cannot escape
- `react-portal-accessibility`: Portal event handling issues

## Additional Resources

- [React Docs: Event System](https://react.dev/learn/responding-to-events)
- [MDN: Event.stopPropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation)
- [Event Delegation Pattern](https://javascript.info/event-delegation)

---

**Detected by:** Paradise Accessibility Analyzer
**Confidence:** MEDIUM (pattern detection)
**Severity:** Info (review recommended, not always a problem)
