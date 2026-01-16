# Missing Arrow Navigation

**Issue Type:** `missing-arrow-navigation`
**Severity:** Info
**WCAG:** 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)

## Description

ARIA composite widgets like listboxes, menus, tab lists, trees, and grids require arrow key navigation according to ARIA Authoring Practices. When you assign these ARIA roles to elements but don't implement arrow key handlers, keyboard users cannot navigate through the widget items. This creates a broken, inaccessible interface that violates WCAG keyboard operation requirements.

## The Problem

```javascript
// ❌ Bad: Listbox role without arrow key navigation
<div role="listbox">
  <div role="option">Option 1</div>
  <div role="option">Option 2</div>
  <div role="option">Option 3</div>
</div>

// No JavaScript - user can't navigate between options!

// ❌ Bad: Menu without arrow keys
const menu = document.querySelector('[role="menu"]');
// Only Tab key works - wrong pattern for menus!

// ❌ Bad: Tablist without arrow keys
const tablist = document.querySelector('[role="tablist"]');
const tabs = tablist.querySelectorAll('[role="tab"]');

// Users expect arrow keys, not Tab, to switch tabs

// ❌ Bad: Tree without arrow keys
<div role="tree">
  <div role="treeitem">Item 1</div>
  <div role="treeitem">Item 2</div>
</div>

// No expand/collapse or navigation logic
```

**Why this is a problem:**
- Users expect arrow keys for these ARIA roles
- Violates ARIA Authoring Practices patterns
- Keyboard users cannot navigate widget items
- Screen readers announce role but functionality is missing
- Creates confusion and frustration
- May violate WCAG 2.1.1 (Keyboard) and 4.1.2 (Name, Role, Value)

**ARIA roles requiring arrow navigation:**
- **role="listbox"** - ArrowUp/Down to navigate options
- **role="menu"** - ArrowUp/Down for items, ArrowRight for submenus
- **role="menubar"** - ArrowLeft/Right for top-level, ArrowDown for menus
- **role="radiogroup"** - Arrow keys to select radio buttons
- **role="tablist"** - ArrowLeft/Right to navigate tabs
- **role="tree"** - ArrowUp/Down for items, ArrowLeft/Right for expand/collapse
- **role="treegrid"** - Arrow keys for 2D navigation
- **role="grid"** - Arrow keys for cell navigation

## The Solution

Implement arrow key navigation for all ARIA composite widgets.

```javascript
// ✅ Good: Listbox with arrow navigation
const listbox = document.querySelector('[role="listbox"]');
const options = listbox.querySelectorAll('[role="option"]');
let currentIndex = 0;

listbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    currentIndex = Math.min(currentIndex + 1, options.length - 1);
    updateSelection();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    currentIndex = Math.max(currentIndex - 1, 0);
    updateSelection();
  } else if (event.key === 'Home') {
    event.preventDefault();
    currentIndex = 0;
    updateSelection();
  } else if (event.key === 'End') {
    event.preventDefault();
    currentIndex = options.length - 1;
    updateSelection();
  }
});

function updateSelection() {
  options.forEach((option, index) => {
    option.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
  });
  options[currentIndex].focus();
}

// ✅ Good: Menu with arrow navigation
menu.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    focusNextMenuItem();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    focusPreviousMenuItem();
  }
});

// ✅ Good: Tablist with arrow navigation
tablist.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    selectNextTab();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    selectPreviousTab();
  }
});
```

## Common Patterns

### 1. Listbox (Single Select)

```javascript
// ✅ Complete listbox implementation
class Listbox {
  constructor(listboxElement) {
    this.listbox = listboxElement;
    this.options = Array.from(listboxElement.querySelectorAll('[role="option"]'));
    this.selectedIndex = 0;
    this.typeAheadBuffer = '';
    this.typeAheadTimeout = null;

    this.init();
  }

  init() {
    // Set initial selection
    this.updateSelection();

    // Keyboard navigation
    this.listbox.addEventListener('keydown', (event) => this.handleKeyDown(event));

    // Click selection
    this.options.forEach((option, index) => {
      option.addEventListener('click', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });
    });
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectNext();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectPrevious();
        break;

      case 'Home':
        event.preventDefault();
        this.selectFirst();
        break;

      case 'End':
        event.preventDefault();
        this.selectLast();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateSelected();
        break;

      default:
        // Type-ahead
        if (event.key.length === 1 && /[a-z0-9]/i.test(event.key)) {
          event.preventDefault();
          this.handleTypeAhead(event.key);
        }
    }
  }

  selectNext() {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.options.length - 1);
    this.updateSelection();
  }

  selectPrevious() {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    this.updateSelection();
  }

  selectFirst() {
    this.selectedIndex = 0;
    this.updateSelection();
  }

  selectLast() {
    this.selectedIndex = this.options.length - 1;
    this.updateSelection();
  }

  updateSelection() {
    this.options.forEach((option, index) => {
      const isSelected = index === this.selectedIndex;
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      option.tabIndex = isSelected ? 0 : -1;
    });

    this.options[this.selectedIndex].focus();
    this.options[this.selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  activateSelected() {
    const selectedOption = this.options[this.selectedIndex];
    selectedOption.click();
  }

  handleTypeAhead(char) {
    clearTimeout(this.typeAheadTimeout);
    this.typeAheadBuffer += char.toLowerCase();

    // Find matching option
    const match = this.options.findIndex((option) =>
      option.textContent.toLowerCase().startsWith(this.typeAheadBuffer)
    );

    if (match !== -1) {
      this.selectedIndex = match;
      this.updateSelection();
    }

    // Clear buffer after 500ms
    this.typeAheadTimeout = setTimeout(() => {
      this.typeAheadBuffer = '';
    }, 500);
  }
}

// Usage
const listbox = new Listbox(document.getElementById('my-listbox'));
```

### 2. Menu with Submenus

```javascript
// ✅ Menu with arrow navigation and submenu support
class Menu {
  constructor(menuElement) {
    this.menu = menuElement;
    this.menuItems = Array.from(menuElement.querySelectorAll('[role="menuitem"]'));
    this.currentIndex = 0;

    this.init();
  }

  init() {
    this.menu.addEventListener('keydown', (event) => this.handleKeyDown(event));

    // Set initial focus
    this.menuItems[0].tabIndex = 0;
    this.menuItems.slice(1).forEach(item => item.tabIndex = -1);
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNext();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPrevious();
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.openSubmenu();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this.closeSubmenu();
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirst();
        break;

      case 'End':
        event.preventDefault();
        this.focusLast();
        break;

      case 'Escape':
        event.preventDefault();
        this.closeMenu();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateCurrent();
        break;
    }
  }

  focusNext() {
    this.currentIndex = (this.currentIndex + 1) % this.menuItems.length;
    this.updateFocus();
  }

  focusPrevious() {
    this.currentIndex =
      (this.currentIndex - 1 + this.menuItems.length) % this.menuItems.length;
    this.updateFocus();
  }

  focusFirst() {
    this.currentIndex = 0;
    this.updateFocus();
  }

  focusLast() {
    this.currentIndex = this.menuItems.length - 1;
    this.updateFocus();
  }

  updateFocus() {
    this.menuItems.forEach((item, index) => {
      item.tabIndex = index === this.currentIndex ? 0 : -1;
    });
    this.menuItems[this.currentIndex].focus();
  }

  openSubmenu() {
    const currentItem = this.menuItems[this.currentIndex];
    const submenu = currentItem.querySelector('[role="menu"]');

    if (submenu) {
      submenu.hidden = false;
      currentItem.setAttribute('aria-expanded', 'true');

      // Focus first item in submenu
      const firstSubmenuItem = submenu.querySelector('[role="menuitem"]');
      firstSubmenuItem?.focus();
    }
  }

  closeSubmenu() {
    // Implementation for closing submenu and returning focus
  }

  closeMenu() {
    // Close menu and return focus to trigger
  }

  activateCurrent() {
    this.menuItems[this.currentIndex].click();
  }
}
```

### 3. Tablist

```javascript
// ✅ Tablist with arrow navigation
class Tabs {
  constructor(tablistElement) {
    this.tablist = tablistElement;
    this.tabs = Array.from(tablistElement.querySelectorAll('[role="tab"]'));
    this.panels = this.tabs.map(tab =>
      document.getElementById(tab.getAttribute('aria-controls'))
    );
    this.currentIndex = 0;

    this.init();
  }

  init() {
    // Set initial tab
    this.selectTab(0);

    // Keyboard navigation
    this.tablist.addEventListener('keydown', (event) => this.handleKeyDown(event));

    // Click handlers
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.selectTab(index));
    });
  }

  handleKeyDown(event) {
    let handled = true;

    switch (event.key) {
      case 'ArrowRight':
        this.selectNext();
        break;

      case 'ArrowLeft':
        this.selectPrevious();
        break;

      case 'Home':
        this.selectTab(0);
        break;

      case 'End':
        this.selectTab(this.tabs.length - 1);
        break;

      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  selectNext() {
    this.currentIndex = (this.currentIndex + 1) % this.tabs.length;
    this.selectTab(this.currentIndex);
  }

  selectPrevious() {
    this.currentIndex =
      (this.currentIndex - 1 + this.tabs.length) % this.tabs.length;
    this.selectTab(this.currentIndex);
  }

  selectTab(index) {
    this.currentIndex = index;

    // Update ARIA states
    this.tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.tabIndex = isSelected ? 0 : -1;
    });

    // Show/hide panels
    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });

    // Focus selected tab
    this.tabs[index].focus();
  }
}

// Usage
const tabs = new Tabs(document.getElementById('my-tabs'));
```

### 4. Tree View

```javascript
// ✅ Tree with expand/collapse and navigation
class TreeView {
  constructor(treeElement) {
    this.tree = treeElement;
    this.treeItems = Array.from(treeElement.querySelectorAll('[role="treeitem"]'));
    this.currentIndex = 0;

    this.init();
  }

  init() {
    this.tree.addEventListener('keydown', (event) => this.handleKeyDown(event));

    // Set initial focus
    this.treeItems[0].tabIndex = 0;
    this.treeItems.slice(1).forEach(item => item.tabIndex = -1);
  }

  handleKeyDown(event) {
    const currentItem = this.treeItems[this.currentIndex];

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNext();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPrevious();
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (this.isExpandable(currentItem)) {
          if (this.isExpanded(currentItem)) {
            this.focusFirstChild(currentItem);
          } else {
            this.expand(currentItem);
          }
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (this.isExpanded(currentItem)) {
          this.collapse(currentItem);
        } else {
          this.focusParent(currentItem);
        }
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirst();
        break;

      case 'End':
        event.preventDefault();
        this.focusLast();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleExpand(currentItem);
        break;
    }
  }

  focusNext() {
    // Find next visible treeitem
    this.currentIndex = Math.min(this.currentIndex + 1, this.treeItems.length - 1);
    this.updateFocus();
  }

  focusPrevious() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
    this.updateFocus();
  }

  updateFocus() {
    this.treeItems.forEach((item, index) => {
      item.tabIndex = index === this.currentIndex ? 0 : -1;
    });
    this.treeItems[this.currentIndex].focus();
  }

  isExpandable(item) {
    return item.getAttribute('aria-expanded') !== null;
  }

  isExpanded(item) {
    return item.getAttribute('aria-expanded') === 'true';
  }

  expand(item) {
    item.setAttribute('aria-expanded', 'true');
    const group = item.querySelector('[role="group"]');
    if (group) group.hidden = false;
  }

  collapse(item) {
    item.setAttribute('aria-expanded', 'false');
    const group = item.querySelector('[role="group"]');
    if (group) group.hidden = true;
  }

  toggleExpand(item) {
    if (this.isExpandable(item)) {
      if (this.isExpanded(item)) {
        this.collapse(item);
      } else {
        this.expand(item);
      }
    }
  }

  focusFirstChild(item) {
    // Implementation
  }

  focusParent(item) {
    // Implementation
  }

  focusFirst() {
    this.currentIndex = 0;
    this.updateFocus();
  }

  focusLast() {
    this.currentIndex = this.treeItems.length - 1;
    this.updateFocus();
  }
}
```

### 5. Grid

```javascript
// ✅ Grid with 2D arrow navigation
class Grid {
  constructor(gridElement) {
    this.grid = gridElement;
    this.rows = Array.from(gridElement.querySelectorAll('[role="row"]'));
    this.currentRow = 0;
    this.currentCol = 0;

    this.init();
  }

  init() {
    this.grid.addEventListener('keydown', (event) => this.handleKeyDown(event));

    // Set initial focus
    this.updateFocus();
  }

  handleKeyDown(event) {
    let handled = true;

    switch (event.key) {
      case 'ArrowDown':
        this.moveDown();
        break;

      case 'ArrowUp':
        this.moveUp();
        break;

      case 'ArrowRight':
        this.moveRight();
        break;

      case 'ArrowLeft':
        this.moveLeft();
        break;

      case 'Home':
        if (event.ctrlKey) {
          this.moveToStart();
        } else {
          this.moveToRowStart();
        }
        break;

      case 'End':
        if (event.ctrlKey) {
          this.moveToEnd();
        } else {
          this.moveToRowEnd();
        }
        break;

      case 'PageDown':
        this.movePageDown();
        break;

      case 'PageUp':
        this.movePageUp();
        break;

      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  moveDown() {
    if (this.currentRow < this.rows.length - 1) {
      this.currentRow++;
      this.updateFocus();
    }
  }

  moveUp() {
    if (this.currentRow > 0) {
      this.currentRow--;
      this.updateFocus();
    }
  }

  moveRight() {
    const cells = this.getCellsInRow(this.currentRow);
    if (this.currentCol < cells.length - 1) {
      this.currentCol++;
      this.updateFocus();
    }
  }

  moveLeft() {
    if (this.currentCol > 0) {
      this.currentCol--;
      this.updateFocus();
    }
  }

  moveToRowStart() {
    this.currentCol = 0;
    this.updateFocus();
  }

  moveToRowEnd() {
    const cells = this.getCellsInRow(this.currentRow);
    this.currentCol = cells.length - 1;
    this.updateFocus();
  }

  moveToStart() {
    this.currentRow = 0;
    this.currentCol = 0;
    this.updateFocus();
  }

  moveToEnd() {
    this.currentRow = this.rows.length - 1;
    const cells = this.getCellsInRow(this.currentRow);
    this.currentCol = cells.length - 1;
    this.updateFocus();
  }

  movePageDown() {
    this.currentRow = Math.min(this.currentRow + 10, this.rows.length - 1);
    this.updateFocus();
  }

  movePageUp() {
    this.currentRow = Math.max(this.currentRow - 10, 0);
    this.updateFocus();
  }

  getCellsInRow(rowIndex) {
    return Array.from(
      this.rows[rowIndex].querySelectorAll('[role="gridcell"], [role="columnheader"]')
    );
  }

  updateFocus() {
    const cells = this.getCellsInRow(this.currentRow);
    const currentCell = cells[this.currentCol];

    // Update tabindex
    this.rows.forEach(row => {
      const rowCells = this.getCellsInRow(this.rows.indexOf(row));
      rowCells.forEach(cell => cell.tabIndex = -1);
    });

    currentCell.tabIndex = 0;
    currentCell.focus();
  }
}
```

## React Example

```typescript
// ✅ React Listbox with arrow navigation
import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ListboxProps {
  options: string[];
  onSelect: (option: string) => void;
}

function Listbox({ options, onSelect }: ListboxProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listboxRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Focus selected option
    optionRefs.current[selectedIndex]?.focus();
  }, [selectedIndex]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, options.length - 1));
        break;

      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;

      case 'Home':
        event.preventDefault();
        setSelectedIndex(0);
        break;

      case 'End':
        event.preventDefault();
        setSelectedIndex(options.length - 1);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(options[selectedIndex]);
        break;
    }
  };

  return (
    <div
      ref={listboxRef}
      role="listbox"
      aria-label="Options"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {options.map((option, index) => (
        <div
          key={option}
          ref={el => optionRefs.current[index] = el}
          role="option"
          aria-selected={index === selectedIndex}
          tabIndex={index === selectedIndex ? 0 : -1}
          onClick={() => {
            setSelectedIndex(index);
            onSelect(option);
          }}
        >
          {option}
        </div>
      ))}
    </div>
  );
}
```

## Testing

### Manual Testing

1. **Test Arrow Keys:**
   - ArrowDown moves to next item
   - ArrowUp moves to previous item
   - ArrowRight/Left work for horizontal widgets (tabs, menubar)

2. **Test Home/End:**
   - Home moves to first item
   - End moves to last item

3. **Test with Screen Reader:**
   - NVDA/JAWS/VoiceOver
   - Verify role is announced
   - Verify arrow keys work as expected
   - Verify selection changes are announced

### Automated Testing

```javascript
describe('Arrow navigation', () => {
  it('should navigate listbox with arrow keys', () => {
    const listbox = new Listbox(document.getElementById('listbox'));

    // ArrowDown
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    listbox.listbox.dispatchEvent(downEvent);

    expect(listbox.selectedIndex).toBe(1);

    // ArrowUp
    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    listbox.listbox.dispatchEvent(upEvent);

    expect(listbox.selectedIndex).toBe(0);
  });
});
```

## Quick Fix

Paradise cannot automatically add arrow navigation (too complex), but provides guidance:

```javascript
// Before (Paradise detects missing arrow navigation)
<div role="listbox">
  <div role="option">Option 1</div>
</div>

// After (Paradise suggests pattern)
// See "Common Patterns" section for full implementation
```

## Related Issues

- [tab-without-shift](./tab-without-shift.md) - Tab key handling
- [screen-reader-arrow-conflict](./screen-reader-arrow-conflict.md) - Arrow keys in browse mode

## Additional Resources

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
- [Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)
- [Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
