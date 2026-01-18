# Deprecated KeyCode

**Issue Type:** `deprecated-keycode`
**Severity:** Info
**WCAG:** 2.1.1 (Keyboard)

## Description

Using `event.keyCode` or `event.which` is deprecated and causes cross-browser compatibility issues. These properties return numeric key codes that are inconsistent across browsers and keyboard layouts. Modern code should use `event.key` or `event.code` which provide standardized, human-readable key names that work reliably across all browsers and keyboard layouts.

## The Problem

```javascript
// ❌ Bad: Using deprecated keyCode
button.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {  // What key is 13?
    handleEnter();
  }
});

// ❌ Bad: Using deprecated which
document.addEventListener('keydown', (event) => {
  if (event.which === 27) {  // What key is 27?
    closeModal();
  }
});

// ❌ Bad: Magic numbers everywhere
input.addEventListener('keydown', (event) => {
  if (event.keyCode === 38) {  // Arrow up?
    previousSuggestion();
  } else if (event.keyCode === 40) {  // Arrow down?
    nextSuggestion();
  } else if (event.keyCode === 9) {  // Tab?
    selectSuggestion();
  }
});

// ❌ Bad: Complex keyCode logic
function handleKeyPress(event) {
  const code = event.keyCode || event.which;

  // Letters A-Z: 65-90
  if (code >= 65 && code <= 90) {
    handleLetterKey(String.fromCharCode(code));
  }
  // Numbers 0-9: 48-57
  else if (code >= 48 && code <= 57) {
    handleNumberKey(code - 48);
  }
  // Arrow keys: 37-40
  else if (code >= 37 && code <= 40) {
    handleArrowKey(code);
  }
}
```

**Why this is a problem:**
- `keyCode` is deprecated and may be removed from browsers
- Numeric codes are not human-readable
- Different browsers may return different codes
- Non-QWERTY keyboards (AZERTY, Dvorak) break completely
- International keyboards don't work correctly
- Harder to maintain (what is code 229?)
- Violates modern JavaScript standards

**Common problematic keyCodes:**
- `13` - Enter
- `27` - Escape
- `32` - Space
- `37-40` - Arrow keys
- `9` - Tab
- `8` - Backspace
- `46` - Delete
- `65-90` - Letters A-Z
- `48-57` - Numbers 0-9
- `112-123` - Function keys F1-F12

## The Solution

Use `event.key` for the character value or `event.code` for the physical key location.

```javascript
// ✅ Good: Using event.key (readable!)
button.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleEnter();
  }
});

// ✅ Good: Using event.key for Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// ✅ Good: Clear, readable arrow key handling
input.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    previousSuggestion();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    nextSuggestion();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    selectSuggestion();
  }
});

// ✅ Good: Simple, readable logic
function handleKeyPress(event) {
  // Check for letters
  if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
    handleLetterKey(event.key.toLowerCase());
  }
  // Check for numbers
  else if (event.key.length === 1 && /[0-9]/.test(event.key)) {
    handleNumberKey(parseInt(event.key, 10));
  }
  // Check for arrow keys
  else if (event.key.startsWith('Arrow')) {
    handleArrowKey(event.key);
  }
}
```

## event.key vs event.code

### Use `event.key` when you care about the CHARACTER

```javascript
// ✅ event.key gives you the character typed
input.addEventListener('keydown', (event) => {
  if (event.key === 'a') {
    // This works for 'a' on QWERTY, AZERTY, Dvorak, etc.
  }
});
```

### Use `event.code` when you care about the PHYSICAL KEY LOCATION

```javascript
// ✅ event.code gives you the physical key position
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyW') {
    // Always the key in the "W" position on QWERTY
    // (which might type "Z" on AZERTY layout)
    moveForward();
  }
});
```

**When to use each:**
- **event.key**: Text input, keyboard shortcuts with characters (Ctrl+S), form validation
- **event.code**: Game controls (WASD), keyboard position-dependent shortcuts

## Migration Guide

### Common keyCode → key Conversions

| keyCode | event.key | Description |
|---------|-----------|-------------|
| 8 | `'Backspace'` | Backspace |
| 9 | `'Tab'` | Tab |
| 13 | `'Enter'` | Enter/Return |
| 27 | `'Escape'` | Escape |
| 32 | `' '` | Space (literal space character) |
| 33 | `'PageUp'` | Page Up |
| 34 | `'PageDown'` | Page Down |
| 35 | `'End'` | End |
| 36 | `'Home'` | Home |
| 37 | `'ArrowLeft'` | Left Arrow |
| 38 | `'ArrowUp'` | Up Arrow |
| 39 | `'ArrowRight'` | Right Arrow |
| 40 | `'ArrowDown'` | Down Arrow |
| 46 | `'Delete'` | Delete |
| 112-123 | `'F1'`-`'F12'` | Function keys |
| 65-90 | `'a'`-`'z'` | Letters (lowercase in event.key) |
| 48-57 | `'0'`-`'9'` | Number keys |

### Automated Migration with Regex

```bash
# Find all keyCode usage
grep -r "\.keyCode" src/

# Find all which usage
grep -r "\.which" src/

# Common replacements (use with caution, review manually!)
sed -i 's/event\.keyCode === 13/event.key === "Enter"/g' file.js
sed -i 's/event\.keyCode === 27/event.key === "Escape"/g' file.js
sed -i 's/event\.keyCode === 32/event.key === " "/g' file.js
```

## Common Patterns

### 1. Keyboard Shortcuts

```javascript
// ❌ Bad: keyCode
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.keyCode === 83) {  // Ctrl+S
    event.preventDefault();
    saveDocument();
  }
});

// ✅ Good: event.key
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    saveDocument();
  }
});
```

### 2. Form Navigation

```javascript
// ❌ Bad: keyCode
form.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault();
    submitForm();
  }
});

// ✅ Good: event.key
form.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitForm();
  }
});
```

### 3. Modal/Dialog Escape

```javascript
// ❌ Bad: keyCode
modal.addEventListener('keydown', (event) => {
  if (event.keyCode === 27) {
    closeModal();
  }
});

// ✅ Good: event.key
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});
```

### 4. Arrow Key Navigation

```javascript
// ❌ Bad: keyCode with magic numbers
listbox.addEventListener('keydown', (event) => {
  if (event.keyCode === 38) {  // Up
    previousItem();
  } else if (event.keyCode === 40) {  // Down
    nextItem();
  } else if (event.keyCode === 36) {  // Home
    firstItem();
  } else if (event.keyCode === 35) {  // End
    lastItem();
  }
});

// ✅ Good: event.key with readable names
listbox.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      previousItem();
      break;
    case 'ArrowDown':
      event.preventDefault();
      nextItem();
      break;
    case 'Home':
      event.preventDefault();
      firstItem();
      break;
    case 'End':
      event.preventDefault();
      lastItem();
      break;
  }
});
```

### 5. Character Input Validation

```javascript
// ❌ Bad: keyCode ranges
input.addEventListener('keydown', (event) => {
  // Only allow letters (65-90) and numbers (48-57)
  if (!((event.keyCode >= 65 && event.keyCode <= 90) ||
        (event.keyCode >= 48 && event.keyCode <= 57))) {
    event.preventDefault();
  }
});

// ✅ Good: event.key with regex
input.addEventListener('keydown', (event) => {
  // Only allow letters and numbers
  if (event.key.length === 1 && !/[a-z0-9]/i.test(event.key)) {
    event.preventDefault();
  }
});

// ✅ Even better: Use input event and validate value
input.addEventListener('input', (event) => {
  // Validate the entire input value
  if (!/^[a-z0-9]*$/i.test(input.value)) {
    input.value = input.value.replace(/[^a-z0-9]/gi, '');
  }
});
```

### 6. Game Controls

```javascript
// ❌ Bad: keyCode for game controls
const keys = {};
document.addEventListener('keydown', (event) => {
  keys[event.keyCode] = true;
});

function gameLoop() {
  if (keys[87]) moveUp();     // W
  if (keys[65]) moveLeft();   // A
  if (keys[83]) moveDown();   // S
  if (keys[68]) moveRight();  // D
}

// ✅ Good: event.code for physical position
const keys = {};
document.addEventListener('keydown', (event) => {
  keys[event.code] = true;
});

function gameLoop() {
  if (keys['KeyW']) moveUp();
  if (keys['KeyA']) moveLeft();
  if (keys['KeyS']) moveDown();
  if (keys['KeyD']) moveRight();
}
```

## React Example

```typescript
// ✅ React component with modern keyboard handling
import { KeyboardEvent } from 'react';

interface ComboboxProps {
  options: string[];
  onSelect: (option: string) => void;
}

function Combobox({ options, onSelect }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Modern event.key usage
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setIsOpen(true);
        setSelectedIndex(prev =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          onSelect(options[selectedIndex]);
          setIsOpen(false);
        }
        break;

      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;

      case 'Home':
        event.preventDefault();
        setSelectedIndex(0);
        break;

      case 'End':
        event.preventDefault();
        setSelectedIndex(options.length - 1);
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown} role="combobox" aria-expanded={isOpen}>
      {/* Combobox implementation */}
    </div>
  );
}
```

## Testing

### Manual Testing

1. **Test on Different Keyboards:**
   - QWERTY keyboard
   - AZERTY keyboard (French)
   - QWERTZ keyboard (German)
   - Dvorak layout
   - Verify shortcuts work on all layouts

2. **Test with Accessibility Tools:**
   - Use keyboard-only navigation
   - Verify all keys work as expected
   - Check for phantom key presses

3. **Cross-Browser Testing:**
   - Chrome
   - Firefox
   - Safari
   - Edge
   - Verify consistent behavior

### Automated Testing

```javascript
describe('Modern keyboard handling', () => {
  it('should use event.key instead of keyCode', () => {
    const handler = jest.fn();

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handler();
      }
    });

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13  // Deprecated but still present
    });

    document.dispatchEvent(enterEvent);
    expect(handler).toHaveBeenCalled();
  });

  it('should handle arrow keys with event.key', () => {
    const handlers = {
      up: jest.fn(),
      down: jest.fn(),
      left: jest.fn(),
      right: jest.fn()
    };

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp': handlers.up(); break;
        case 'ArrowDown': handlers.down(); break;
        case 'ArrowLeft': handlers.left(); break;
        case 'ArrowRight': handlers.right(); break;
      }
    });

    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const handlerKeys = ['up', 'down', 'left', 'right'];

    arrowKeys.forEach((key, index) => {
      const event = new KeyboardEvent('keydown', { key });
      document.dispatchEvent(event);
      expect(handlers[handlerKeys[index]]).toHaveBeenCalled();
    });
  });
});
```

## Quick Fix

Paradise can automatically migrate keyCode to event.key:

```javascript
// Before (Paradise detects this)
if (event.keyCode === 13) {
  handleEnter();
}

// After (Paradise suggests)
if (event.key === 'Enter') {
  handleEnter();
}
```

## Browser Support

`event.key` is supported in all modern browsers:
- ✅ Chrome 51+
- ✅ Firefox 23+
- ✅ Safari 10.1+
- ✅ Edge 12+
- ✅ Opera 38+

For legacy browser support (IE11), use a polyfill or fallback:

```javascript
function getKey(event) {
  // Modern browsers
  if (event.key !== undefined) {
    return event.key;
  }

  // Fallback for IE11
  const keyCodeMap = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    27: 'Escape',
    32: ' ',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    // ... add more as needed
  };

  return keyCodeMap[event.keyCode] || String.fromCharCode(event.keyCode);
}

// Usage
document.addEventListener('keydown', (event) => {
  const key = getKey(event);
  if (key === 'Enter') {
    handleEnter();
  }
});
```

## Related Issues

- [screen-reader-conflict](./screen-reader-conflict.md) - Single-character shortcuts
- [tab-without-shift](./tab-without-shift.md) - Tab key handling
- [missing-arrow-navigation](./missing-arrow-navigation.md) - Arrow key navigation

## Additional Resources

- [MDN: KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
- [MDN: KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
- [W3C: UI Events KeyboardEvent key Values](https://www.w3.org/TR/uievents-key/)
- [Keyboard Event Viewer](https://w3c.github.io/uievents/tools/key-event-viewer.html) - Test tool
- [Can I Use: KeyboardEvent.key](https://caniuse.com/keyboardevent-key)
