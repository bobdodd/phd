# incomplete-tabs-pattern

**Severity:** Warning
**WCAG Criteria:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value), [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships), [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)

## Description

This issue occurs when a tabs widget doesn't follow the complete WAI-ARIA Authoring Practices pattern. A properly implemented tabs pattern requires specific ARIA attributes, keyboard navigation, and structural relationships between tablist, tabs, and tabpanels.

## Why This Matters

- **Screen Reader Users**: Need proper roles and ARIA attributes to understand the tab interface structure
- **Keyboard Users**: Expect arrow key navigation between tabs, Tab key to move to panel content
- **Consistency**: Users expect standard tab behavior across all websites
- **WCAG Compliance**: Required for WCAG 2.1 Level A compliance (4.1.2, 1.3.1, 2.1.1)

## The Problem

An incomplete tabs pattern might be missing:
- Child elements with `role="tab"`
- Arrow key navigation (Left/Right arrows to navigate tabs)
- Home/End key support (jump to first/last tab)
- `aria-selected` state on tabs
- `aria-controls` linking tabs to panels
- `role="tabpanel"` on panel elements
- `aria-labelledby` on panels

```javascript
// ❌ BAD: Incomplete tabs pattern
const tablist = document.querySelector('[role="tablist"]');
// Missing: tabs with role="tab"
// Missing: arrow key navigation
```

## The Solution

Implement the complete WAI-ARIA tabs pattern:

```html
<!-- HTML Structure -->
<div role="tablist" aria-label="Sample Tabs">
  <button role="tab" aria-selected="true" aria-controls="panel1" id="tab1">
    Tab 1
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel2" id="tab2" tabindex="-1">
    Tab 2
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel3" id="tab3" tabindex="-1">
    Tab 3
  </button>
</div>

<div role="tabpanel" id="panel1" aria-labelledby="tab1">
  <h2>Panel 1 Content</h2>
  <p>Content for the first tab...</p>
</div>

<div role="tabpanel" id="panel2" aria-labelledby="tab2" hidden>
  <h2>Panel 2 Content</h2>
  <p>Content for the second tab...</p>
</div>

<div role="tabpanel" id="panel3" aria-labelledby="tab3" hidden>
  <h2>Panel 3 Content</h2>
  <p>Content for the third tab...</p>
</div>
```

```javascript
// ✅ GOOD: Complete tabs implementation
const tablist = document.querySelector('[role="tablist"]');
const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

// Arrow key navigation
tablist.addEventListener('keydown', (event) => {
  const currentTab = document.activeElement;
  const currentIndex = tabs.indexOf(currentTab);

  let newIndex;

  if (event.key === 'ArrowRight') {
    newIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === 'ArrowLeft') {
    newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === 'Home') {
    newIndex = 0;
  } else if (event.key === 'End') {
    newIndex = tabs.length - 1;
  } else {
    return; // Not a navigation key
  }

  event.preventDefault();
  switchTab(tabs[newIndex]);
});

// Click handler
tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab));
});

function switchTab(newTab) {
  const newIndex = tabs.indexOf(newTab);

  // Update tabs
  tabs.forEach((tab, index) => {
    if (index === newIndex) {
      tab.setAttribute('aria-selected', 'true');
      tab.removeAttribute('tabindex');
      tab.focus();
    } else {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    }
  });

  // Update panels
  panels.forEach((panel, index) => {
    if (index === newIndex) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  });
}
```

## Required Components

### 1. Tablist Container
- `role="tablist"`
- Optional: `aria-label` or `aria-labelledby` for accessible name

### 2. Tab Buttons
- `role="tab"`
- `aria-selected="true"` for active tab, `"false"` for others
- `aria-controls="panel-id"` linking to panel
- `id` attribute for panel's `aria-labelledby`
- Roving tabindex: active tab has no tabindex or `tabindex="0"`, others have `tabindex="-1"`

### 3. Tab Panels
- `role="tabpanel"`
- `aria-labelledby="tab-id"` linking to tab
- `hidden` attribute on inactive panels

### 4. Keyboard Navigation
- **Arrow Left/Right**: Navigate between tabs
- **Home**: Move to first tab
- **End**: Move to last tab
- **Tab**: Move focus into the active tabpanel
- **Shift+Tab**: Move focus out of tabpanel back to tabs

## Common Patterns

### Pattern 1: Automatic Activation
Tabs activate as soon as they receive focus (recommended for small content):

```javascript
tablist.addEventListener('keydown', (event) => {
  // Navigation code here...

  // Automatically activate the focused tab
  switchTab(tabs[newIndex]);
});
```

### Pattern 2: Manual Activation
Tabs must be activated with Enter/Space (recommended for large/loading content):

```javascript
tablist.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    switchTab(document.activeElement);
    return;
  }

  // Navigation code here...

  // Just focus, don't activate
  tabs[newIndex].focus();
});
```

## Quick Fix

Paradise can scaffold a complete tabs pattern for you:

1. Place your cursor on the `role="tablist"` line
2. Press `Ctrl+.` (Windows/Linux) or `Cmd+.` (Mac)
3. Select "Complete tabs pattern with child tabs and navigation"

## Related Issues

- `missing-aria-connection`: `aria-controls` or `aria-labelledby` pointing to non-existent element
- `focus-order-conflict`: Incorrect tabindex values disrupting keyboard flow
- `missing-keyboard-handler`: No keyboard navigation implemented

## Additional Resources

- [WAI-ARIA: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [MDN: ARIA Tabs Role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role)
- [Inclusive Components: Tabbed Interfaces](https://inclusive-components.design/tabbed-interfaces/)

## Testing

### Manual Testing

1. **Tab Key**: Press Tab to focus first tab, Tab again to enter panel content
2. **Arrow Keys**: Use Left/Right arrows to move between tabs
3. **Home/End**: Jump to first/last tab
4. **Screen Reader**: Announces "tab 1 of 3, selected" for active tab

### Screen Reader Testing

- **NVDA/JAWS (Windows)**: Tab to tablist, arrows to navigate, announces tab number and state
- **VoiceOver (Mac)**: VO+Right Arrow to tabs, announces "tab 2 of 3"
- **TalkBack (Android)**: Swipe through tabs, announces role and state

## Examples

### Real-World Example: Settings Panel

```javascript
// Complete tabs implementation for settings
const settingsTabs = {
  init() {
    this.tablist = document.querySelector('[role="tablist"]');
    this.tabs = Array.from(this.tablist.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

    this.setupKeyboardNav();
    this.setupClickHandlers();
    this.activateTab(0); // Activate first tab
  },

  setupKeyboardNav() {
    this.tablist.addEventListener('keydown', (e) => {
      const current = this.tabs.indexOf(document.activeElement);
      let target;

      switch(e.key) {
        case 'ArrowRight':
          target = (current + 1) % this.tabs.length;
          break;
        case 'ArrowLeft':
          target = (current - 1 + this.tabs.length) % this.tabs.length;
          break;
        case 'Home':
          target = 0;
          break;
        case 'End':
          target = this.tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      this.activateTab(target);
    });
  },

  setupClickHandlers() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.activateTab(index));
    });
  },

  activateTab(index) {
    // Update tabs
    this.tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    // Update panels
    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });

    // Focus new tab
    this.tabs[index].focus();
  }
};

// Initialize on page load
settingsTabs.init();
```

---

**Detected by:** Paradise Widget Pattern Analyzer
**Confidence:** HIGH when analyzing with full document context
**Auto-fix:** Available via Quick Fix (Ctrl+. / Cmd+.)
