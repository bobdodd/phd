# Screen Reader Conflict

**Issue Type:** `screen-reader-conflict`
**Severity:** Warning
**WCAG:** 2.1.1 (Keyboard), 2.1.4 (Character Key Shortcuts)

## Description

Single-character keyboard shortcuts (like `h`, `k`, `b`, `t`) conflict with screen reader navigation keys. Screen readers use these keys to navigate by headings, links, buttons, tables, and other landmarks. When web applications intercept these keys, they break screen reader navigation, creating a frustrating and inaccessible experience for blind users.

## The Problem

```javascript
// ❌ Bad: Single letter 'h' conflicts with "next heading" navigation
document.addEventListener('keydown', (event) => {
  if (event.key === 'h') {
    openHelpMenu();
  }
});

// ❌ Bad: 'k' and 'j' conflict with JAWS/NVDA line navigation
document.addEventListener('keydown', (event) => {
  if (event.key === 'k') {
    previousItem();
  } else if (event.key === 'j') {
    nextItem();
  }
});

// ❌ Bad: Letter 'b' conflicts with "next button" navigation
const searchInput = document.getElementById('search');
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'b') {
    toggleBookmark();
  }
});

// ❌ Bad: Multiple single-character shortcuts
const shortcuts = {
  'h': goHome,
  't': newTab,
  'l': openLink,
  'f': focusSearch,
  'k': scrollUp,
  'j': scrollDown
};

document.addEventListener('keydown', (event) => {
  if (shortcuts[event.key]) {
    shortcuts[event.key]();
  }
});
```

**Why this is a problem:**
- Breaks screen reader navigation completely
- Blind users cannot navigate by headings (h), links (k), buttons (b), etc.
- Violates WCAG 2.1.4 (Character Key Shortcuts) - Level A
- No way to disable or remap shortcuts
- Particularly harmful in forms mode where screen readers expect keys to work

**Screen reader keys that should NEVER be used alone:**
- **h**: Next heading
- **k**: Next link (NVDA/JAWS)
- **b**: Next button
- **t**: Next table
- **l**: Next list
- **f**: Next form field
- **g**: Next graphic
- **d**: Next landmark
- **e**: Next edit field
- **r**: Next region
- **i**: Next list item
- **m**: Next frame
- **n**: Skip past block of links
- **p**: Next paragraph
- **q**: Next blockquote
- **s**: Next same element
- **x**: Next checkbox
- **c**: Next combo box
- **v**: Next visited link
- **z**: Next non-visited link
- **o**: Next "other" control
- **a**: Next anchor
- **u**: Next unvisited link
- **1-6**: Next heading level 1-6

## The Solution

Always use modifier keys (Ctrl, Alt, Shift, Meta/Cmd) with keyboard shortcuts to avoid conflicts.

```javascript
// ✅ Good: Use Ctrl+H instead of H
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'h' && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    openHelpMenu();
  }
});

// ✅ Good: Use Alt+K/J for navigation (like Gmail)
document.addEventListener('keydown', (event) => {
  if (event.altKey && !event.ctrlKey && !event.shiftKey) {
    if (event.key === 'k') {
      event.preventDefault();
      previousItem();
    } else if (event.key === 'j') {
      event.preventDefault();
      nextItem();
    }
  }
});

// ✅ Good: Provide alternative with slash key (non-conflicting)
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.shiftKey) {
    // '/' is commonly used for search and doesn't conflict
    event.preventDefault();
    focusSearch();
  }
});

// ✅ Good: Use function keys (F1-F12) which don't conflict
document.addEventListener('keydown', (event) => {
  if (event.key === 'F1') {
    event.preventDefault();
    openHelpMenu();
  }
});
```

## Common Patterns

### 1. Application-Wide Shortcuts with Modifiers

```javascript
// ✅ Complete shortcut system with modifiers
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map([
      ['ctrl+h', this.openHelp],
      ['ctrl+k', this.openSearch],
      ['ctrl+/', this.showShortcuts],
      ['alt+n', this.newDocument],
      ['alt+s', this.saveDocument]
    ]);

    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('keydown', (event) => {
      const key = this.getShortcutKey(event);
      const handler = this.shortcuts.get(key);

      if (handler) {
        event.preventDefault();
        handler.call(this);
      }
    });
  }

  getShortcutKey(event) {
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    if (event.metaKey) modifiers.push('meta');

    return modifiers.length > 0
      ? `${modifiers.join('+')}+${event.key.toLowerCase()}`
      : event.key.toLowerCase();
  }

  openHelp() {
    console.log('Opening help...');
  }

  openSearch() {
    console.log('Opening search...');
  }

  showShortcuts() {
    console.log('Showing shortcuts...');
  }

  newDocument() {
    console.log('New document...');
  }

  saveDocument() {
    console.log('Saving document...');
  }
}

const shortcuts = new KeyboardShortcuts();
```

### 2. Context-Sensitive Shortcuts (Non-Conflicting Keys)

```javascript
// ✅ Use non-conflicting keys like ?, /, Escape, arrows
class ModalDialog {
  constructor(dialogElement) {
    this.dialog = dialogElement;
    this.setupKeyboard();
  }

  setupKeyboard() {
    this.dialog.addEventListener('keydown', (event) => {
      // Escape to close (standard, non-conflicting)
      if (event.key === 'Escape') {
        this.close();
      }

      // ? to show help (non-conflicting, common pattern)
      else if (event.key === '?' && !event.ctrlKey && !event.altKey) {
        this.showHelp();
      }

      // Arrow keys for navigation (non-conflicting in focused elements)
      else if (event.key === 'ArrowDown' && event.target.matches('[role="listbox"]')) {
        event.preventDefault();
        this.focusNextOption();
      }
      else if (event.key === 'ArrowUp' && event.target.matches('[role="listbox"]')) {
        event.preventDefault();
        this.focusPreviousOption();
      }
    });
  }

  close() {
    this.dialog.close();
  }

  showHelp() {
    console.log('Showing dialog help...');
  }

  focusNextOption() {
    // Implementation
  }

  focusPreviousOption() {
    // Implementation
  }
}
```

### 3. Vim-Style Navigation with Disable Option

```javascript
// ✅ Vim-style shortcuts (j/k) with CLEAR disable mechanism
class VimNavigationList {
  constructor(listElement) {
    this.list = listElement;
    this.vimModeEnabled = false; // DISABLED by default
    this.setupToggle();
    this.setupNavigation();
  }

  setupToggle() {
    // CLEAR toggle with visible UI
    const toggle = document.getElementById('vim-mode-toggle');
    toggle.addEventListener('change', (event) => {
      this.vimModeEnabled = event.target.checked;

      // CRITICAL: Inform screen reader users
      const status = document.getElementById('vim-mode-status');
      status.textContent = this.vimModeEnabled
        ? 'Vim mode enabled. Press Ctrl+M to disable.'
        : 'Vim mode disabled. Standard screen reader keys active.';

      // Announce change
      this.announceVimMode();
    });
  }

  setupNavigation() {
    this.list.addEventListener('keydown', (event) => {
      // Only process if vim mode is explicitly enabled
      if (!this.vimModeEnabled) return;

      // Require Ctrl modifier to avoid conflicts
      if (!event.ctrlKey) return;

      if (event.key === 'j') {
        event.preventDefault();
        this.focusNext();
      } else if (event.key === 'k') {
        event.preventDefault();
        this.focusPrevious();
      } else if (event.key === 'm') {
        // Ctrl+M to toggle vim mode
        event.preventDefault();
        this.vimModeEnabled = false;
        this.announceVimMode();
      }
    });
  }

  announceVimMode() {
    const announcement = document.getElementById('vim-mode-announcement');
    announcement.textContent = this.vimModeEnabled
      ? 'Vim navigation enabled'
      : 'Vim navigation disabled';
  }

  focusNext() {
    // Implementation
  }

  focusPrevious() {
    // Implementation
  }
}
```

### 4. Safe Non-Conflicting Keys

```javascript
// ✅ Keys that are generally safe to use without modifiers
const safeShortcuts = {
  // Special keys (generally safe)
  'Escape': closeDialog,
  'Enter': submitForm,
  'Tab': focusNext,  // But handle with care
  ' ': toggleCheckbox,  // Space is safe in many contexts

  // Punctuation (safe)
  '?': showHelp,
  '/': focusSearch,
  '.': nextPage,
  ',': previousPage,

  // Function keys (safe, but may conflict with browser)
  'F1': openHelp,
  'F5': refresh,  // Browser default
  'F11': fullscreen,  // Browser default

  // Number keys in specific contexts (generally safe)
  '1': filterByCategory1,  // When not in text input
  '2': filterByCategory2,

  // Arrow keys (safe in focused contexts)
  'ArrowUp': previousItem,
  'ArrowDown': nextItem,
  'ArrowLeft': previousPage,
  'ArrowRight': nextPage
};
```

## React Example

```typescript
// ✅ React component with safe keyboard shortcuts
import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  handler: () => void;
}

function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;

      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        ctrlMatch &&
        altMatch &&
        shiftMatch &&
        metaMatch
      ) {
        event.preventDefault();
        shortcut.handler();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Usage in component
function DocumentEditor() {
  const shortcuts: ShortcutConfig[] = [
    {
      key: 's',
      ctrl: true,  // Ctrl+S
      handler: () => {
        console.log('Save document');
      }
    },
    {
      key: 'k',
      ctrl: true,  // Ctrl+K
      handler: () => {
        console.log('Insert link');
      }
    },
    {
      key: '/',
      // No modifiers - safe key
      handler: () => {
        console.log('Focus search');
      }
    }
  ];

  useKeyboardShortcuts(shortcuts);

  return (
    <div>
      <h1>Document Editor</h1>
      <p>Press Ctrl+S to save, Ctrl+K for link, / for search</p>
      {/* Content */}
    </div>
  );
}
```

## Testing

### Manual Testing

1. **Enable Screen Reader:**
   - Windows: NVDA or JAWS
   - Mac: VoiceOver (Cmd+F5)
   - Linux: Orca

2. **Test Navigation Keys:**
   - Press `h` - should move to next heading
   - Press `k` - should move to next link
   - Press `b` - should move to next button
   - Press `t` - should move to next table
   - Verify your shortcuts DON'T intercept these

3. **Test Your Shortcuts:**
   - Try your keyboard shortcuts with screen reader running
   - Verify they work WITH modifiers (Ctrl+H, Alt+K, etc.)
   - Verify screen reader navigation still works

4. **Test in Forms Mode:**
   - Tab to input field
   - Press single letters - should type normally
   - Verify shortcuts don't fire in form fields (unless intended)

### Automated Testing

```javascript
describe('Keyboard shortcuts with screen reader compatibility', () => {
  it('should require modifier keys for letter shortcuts', () => {
    const handler = jest.fn();
    const shortcuts = new KeyboardShortcuts();
    shortcuts.register('ctrl+h', handler);

    // Single 'h' should NOT trigger
    const hEvent = new KeyboardEvent('keydown', { key: 'h' });
    document.dispatchEvent(hEvent);
    expect(handler).not.toHaveBeenCalled();

    // Ctrl+H should trigger
    const ctrlHEvent = new KeyboardEvent('keydown', {
      key: 'h',
      ctrlKey: true
    });
    document.dispatchEvent(ctrlHEvent);
    expect(handler).toHaveBeenCalled();
  });

  it('should not intercept screen reader navigation keys', () => {
    const screenReaderKeys = ['h', 'k', 'b', 't', 'l', 'f'];
    const handler = jest.fn();

    document.addEventListener('keydown', (event) => {
      if (screenReaderKeys.includes(event.key)) {
        handler();
      }
    });

    for (const key of screenReaderKeys) {
      const event = new KeyboardEvent('keydown', { key });
      const defaultPrevented = !document.dispatchEvent(event);
      expect(defaultPrevented).toBe(false); // Should NOT prevent default
    }
  });

  it('should allow safe punctuation keys without modifiers', () => {
    const shortcuts = new KeyboardShortcuts();
    const handler = jest.fn();

    // '/' is safe for search
    shortcuts.register('/', handler);

    const slashEvent = new KeyboardEvent('keydown', { key: '/' });
    document.dispatchEvent(slashEvent);
    expect(handler).toHaveBeenCalled();
  });
});
```

## Quick Fix

Paradise can automatically suggest fixes:

```javascript
// Before (Paradise detects this)
document.addEventListener('keydown', (event) => {
  if (event.key === 'h') {
    openHelpMenu();
  }
});

// After (Paradise suggests)
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'h' && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    openHelpMenu();
  }
});
```

## Best Practices

1. **Always Use Modifiers for Letters:** Never use single letters (a-z) without Ctrl/Alt/Meta
2. **Document Shortcuts Clearly:** Provide accessible shortcuts list (? key is common)
3. **Allow Customization:** Let users remap shortcuts
4. **Provide Disable Option:** Allow users to turn off custom shortcuts
5. **Test with Screen Readers:** Always verify with NVDA, JAWS, or VoiceOver
6. **Respect Context:** Don't intercept keys in text inputs unless necessary
7. **Use Standard Patterns:** Follow OS/browser conventions (Ctrl+S, Ctrl+C, etc.)
8. **Announce Changes:** Use aria-live to announce shortcut mode changes

## Platform Conventions

### Windows/Linux
- **Ctrl+[key]** for primary shortcuts
- **Alt+[key]** for menu access
- **Shift+[key]** for reverse actions

### macOS
- **Cmd+[key]** for primary shortcuts (use `event.metaKey`)
- **Ctrl+[key]** for secondary shortcuts
- **Option+[key]** for alternate actions

### Web Standards
- **Ctrl+S** - Save
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo
- **Ctrl+F** - Find
- **Ctrl+K** - Insert link
- **/** - Focus search (emerging standard)
- **?** - Show shortcuts (emerging standard)

## Related Issues

- [potential-keyboard-trap](./potential-keyboard-trap.md) - Tab intercepted without Escape
- [tab-without-shift](./tab-without-shift.md) - Tab without Shift+Tab handling
- [missing-arrow-navigation](./missing-arrow-navigation.md) - ARIA widgets need arrow keys

## Additional Resources

- [WCAG 2.1.4: Character Key Shortcuts](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts)
- [WebAIM: Keyboard Accessibility](https://webaim.org/articles/keyboard/)
- [Screen Reader Keyboard Shortcuts (Deque)](https://dequeuniversity.com/screenreaders/)
- [NVDA Keyboard Shortcuts](https://www.nvaccess.org/files/nvda/documentation/userGuide.html#Commands)
- [JAWS Keyboard Shortcuts](https://www.freedomscientific.com/training/jaws/hotkeys/)
- [VoiceOver Keyboard Shortcuts](https://www.apple.com/voiceover/info/guide/_1131.html)
