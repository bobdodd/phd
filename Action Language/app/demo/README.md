# Accessibility Analysis Demo Project

An interactive educational web application demonstrating accessible and inaccessible patterns, designed to showcase the capabilities of the ActionLanguage accessibility analysis tool.

## Overview

This demo project provides **side-by-side comparisons** of accessible (good) and inaccessible (bad) implementations across 10 different web patterns. Each page demonstrates:

- ✅ **Accessible Implementation** - Following WAI-ARIA Authoring Practices and WCAG 2.1 guidelines
- ❌ **Inaccessible Implementation** - Common mistakes and violations that the analyzer detects

## Quick Start

### View the Demo

1. Open `index.html` in your browser
2. Navigate to any demo page
3. Try both accessible and inaccessible versions with:
   - **Keyboard only** (Tab, Enter, Space, Arrow keys)
   - **Screen reader** (NVDA, JAWS, or VoiceOver)

### Run the Analyzer

Analyze any demo page:

```bash
# From the project root
node src/cli.js demo/pages/buttons.html

# Or using the VS Code extension
# Open demo/pages/buttons.html in VS Code
# Yellow squiggles will appear on inaccessible code
```

Analyze the entire demo:

```bash
# Analyze all demo pages
for file in demo/pages/*.html; do
  node src/cli.js "$file"
done
```

## Structure

```
demo/
├── index.html                    # Landing page with overview
├── pages/
│   ├── buttons.html              # Interactive buttons
│   ├── forms.html                # Form controls
│   ├── navigation.html           # Navigation patterns
│   ├── tabs.html                 # Tab widgets
│   ├── modals.html               # Modal dialogs
│   ├── disclosure.html           # Accordions
│   ├── keyboard-shortcuts.html   # Keyboard shortcuts
│   ├── focus-management.html     # Focus management
│   ├── aria-live.html            # Live regions
│   └── complex-widgets.html      # Advanced patterns
├── css/
│   └── demo.css                  # Shared styling
├── js/
│   ├── accessible/               # Good implementations
│   └── inaccessible/             # Bad implementations
└── README.md                     # This file
```

## Demo Pages

### 1. Interactive Buttons ([buttons.html](pages/buttons.html))

**What it demonstrates:**
- Native `<button>` elements vs. div-based buttons
- Click handlers with and without keyboard support
- Proper ARIA roles (role="button")
- Focus management and visible focus indicators

**Issues detected:**
- `mouse-only-click` - Click handler without keyboard support
- `missing-keyboard-handler` - No Enter/Space key handling
- `missing-aria-role` - Interactive element without proper role
- `not-focusable` - Missing tabindex="0"

**WCAG Criteria:** 2.1.1 (Keyboard), 2.4.7 (Focus Visible), 4.1.2 (Name, Role, Value)

### 2. Form Controls ([forms.html](pages/forms.html))

**What it demonstrates:**
- Proper label associations vs. placeholder-as-label
- Required field indicators (aria-required)
- Error message associations (aria-describedby)
- Live region announcements for validation errors

**Issues detected:**
- `missing-label` - Input without associated label
- `placeholder-as-label` - Anti-pattern
- `missing-aria-required` - Required field without indicator
- `missing-error-association` - Errors not linked to inputs
- `missing-aria-live` - Dynamic updates without announcements

**WCAG Criteria:** 1.3.1 (Info and Relationships), 3.3.2 (Labels), 4.1.2 (Name, Role, Value)

### 3. Navigation Patterns ([navigation.html](pages/navigation.html))

**What it demonstrates:**
- Semantic `<nav>` elements vs. div-based navigation
- Skip links for keyboard users
- Dropdown menus with keyboard support
- ARIA menu roles and states

**Issues detected:**
- `missing-navigation-landmark` - No nav element or role
- `no-skip-links` - Missing keyboard shortcuts
- `mouse-dependent-dropdown` - Hover-only menus
- `missing-aria-menu-roles` - Dropdown without proper ARIA

**WCAG Criteria:** 2.1.1 (Keyboard), 2.4.1 (Bypass Blocks), 4.1.2 (Name, Role, Value)

### 4. Tab Widget ([tabs.html](pages/tabs.html))

**What it demonstrates:**
- Complete WAI-ARIA tab pattern
- Arrow key navigation (Left/Right, Home/End)
- Proper ARIA roles (tablist, tab, tabpanel)
- aria-selected state management
- aria-controls associations

**Issues detected:**
- `missing-tablist-role` - Tab container without role
- `missing-tab-role` - Tabs without proper role
- `missing-aria-selected` - No state indicator
- `missing-aria-controls` - No tab-panel association
- `incomplete-tabs-pattern` - WidgetPatternValidator failure
- `mouse-only-click` - No keyboard navigation

**WCAG Criteria:** 2.1.1 (Keyboard), 2.4.3 (Focus Order), 4.1.2 (Name, Role, Value)

### 5. Modal Dialogs ([modals.html](pages/modals.html))

**What it demonstrates:**
- role="dialog" and aria-modal="true"
- Focus trap implementation (Tab cycling)
- Escape key to close
- Focus restoration to trigger element
- Backdrop click handling

**Issues detected:**
- `keyboard-trap-detected` - Focus trapped without Escape
- `missing-dialog-role` - Modal without role="dialog"
- `no-focus-restoration` - Focus not returned on close
- `missing-aria-modal` - No aria-modal attribute
- `incomplete-dialog-pattern` - WidgetPatternValidator failure

**WCAG Criteria:** 2.1.2 (No Keyboard Trap), 2.4.3 (Focus Order), 4.1.2 (Name, Role, Value)

### 6. Accordions ([disclosure.html](pages/disclosure.html))

**What it demonstrates:**
- Button-based accordion headers
- aria-expanded state management
- aria-controls linking headers to panels
- Keyboard navigation between sections

**Issues detected:**
- `aria-expanded-without-visibility-change` - State not synchronized
- `missing-aria-controls` - No panel association
- `click-only-disclosure` - No keyboard support
- `incomplete-accordion-pattern` - Pattern validation failure

**WCAG Criteria:** 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)

### 7. Keyboard Shortcuts ([keyboard-shortcuts.html](pages/keyboard-shortcuts.html))

**What it demonstrates:**
- Modifier-based shortcuts (Ctrl+S) vs. single-character
- Configuration UI for remapping shortcuts
- Conflicts with screen reader quick navigation keys
- Proper Escape key handling

**Issues detected:**
- `screen-reader-conflict` - Single-key shortcuts conflict with NVDA/JAWS
- `single-char-shortcut` - WCAG 2.1.4 violation
- `arrow-key-conflict-detected` - Interferes with browse mode

**WCAG Criteria:** 2.1.4 (Character Key Shortcuts)

### 8. Focus Management ([focus-management.html](pages/focus-management.html))

**What it demonstrates:**
- Checking document.activeElement before removing elements
- Moving focus before hiding elements
- Focus restoration patterns for modals
- Visible focus indicators

**Issues detected:**
- `removal-without-focus-management` - element.remove() without focus check
- `hiding-focused-element` - style.display='none' on focused element
- `standalone-blur` - Calling blur() without focus management
- `positive-tabindex` - Disrupts natural tab order
- `focus-on-non-focusable-element` - .focus() on non-focusable element

**WCAG Criteria:** 2.4.3 (Focus Order), 2.4.7 (Focus Visible)

### 9. Live Regions ([aria-live.html](pages/aria-live.html))

**What it demonstrates:**
- role="alert" for important messages
- role="status" for status updates
- aria-live="polite" for non-urgent updates
- Proper loading indicators with aria-busy

**Issues detected:**
- `missing-aria-live` - Dynamic content without live region
- `assertive-live-region` - Overly aggressive aria-live="assertive"
- `aria-busy-without-indication` - Loading state without visual indicator
- `status-message-not-announced` - WCAG 4.1.3 violation

**WCAG Criteria:** 4.1.3 (Status Messages)

### 10. Complex Widgets ([complex-widgets.html](pages/complex-widgets.html))

**What it demonstrates:**
- Tree view with arrow navigation
- Grid with cell navigation
- Combobox with autocomplete
- Slider with arrow keys
- Toolbar with roving tabindex

**Issues detected:**
- Multiple widget pattern validation failures
- Missing keyboard navigation for each pattern
- Incomplete ARIA attribute sets
- Focus management issues

**WCAG Criteria:** 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)

## What You'll Learn

Each demo page teaches:

1. **Proper Implementation** - How to build accessible widgets following WAI-ARIA Authoring Practices
2. **Common Mistakes** - Real-world accessibility violations and anti-patterns
3. **Screen Reader Interaction** - How assistive technologies interact with your code
4. **Keyboard Navigation** - Required key combinations for each widget type
5. **WCAG Mapping** - Which success criteria apply to each pattern

## Coverage

The demo showcases detection of:

- **50+ accessibility issue types**
- **13 WCAG 2.1 success criteria**
- **21 WAI-ARIA widget patterns**
- **5 analyzer categories** (Event, Keyboard, Focus, ARIA, Widget)

### WCAG 2.1 Success Criteria Covered

- **1.3.1** Info and Relationships (Level A)
- **2.1.1** Keyboard (Level A)
- **2.1.2** No Keyboard Trap (Level A)
- **2.1.4** Character Key Shortcuts (Level A)
- **2.4.3** Focus Order (Level A)
- **2.4.7** Focus Visible (Level AA)
- **2.5.3** Label in Name (Level A)
- **3.2.1** On Focus (Level A)
- **3.2.2** On Input (Level A)
- **4.1.2** Name, Role, Value (Level A)
- **4.1.3** Status Messages (Level AA)

### Analyzer Components Demonstrated

| Component | What It Detects | Demo Pages |
|-----------|-----------------|------------|
| **EventAnalyzer** | Event handler registration patterns (addEventListener, jQuery, React) | All pages |
| **KeyboardAnalyzer** | Keyboard navigation, shortcuts, screen reader conflicts | Buttons, Tabs, Modals, Keyboard Shortcuts |
| **FocusAnalyzer** | Focus management, visibility changes, element removal | Focus Management, Modals, Tabs |
| **ARIAAnalyzer** | ARIA roles, attributes, states, and relationships | All pages with widgets |
| **WidgetPatternValidator** | WAI-ARIA APG pattern compliance (21 patterns) | Tabs, Modals, Disclosure, Complex Widgets |

## Testing Workflow

### 1. Manual Testing

For each demo page:

1. **Keyboard Only Test:**
   - Close your eyes or disconnect your mouse
   - Navigate using Tab, Shift+Tab, Enter, Space, Arrow keys
   - Notice which version works and which doesn't

2. **Screen Reader Test:**
   - Windows: NVDA (free) or JAWS
   - Mac: VoiceOver (built-in)
   - Linux: Orca
   - Listen to how each version is announced

3. **Visual Inspection:**
   - Look for focus indicators
   - Check ARIA attributes in DevTools
   - Inspect state changes

### 2. Automated Testing

Run the analyzer:

```bash
# Single page
node src/cli.js demo/pages/buttons.html

# Expected output:
# Grade: A (good) or F (bad)
# Issues: List of detected problems
# WCAG: Mapped success criteria
```

### 3. VS Code Extension Testing

1. Open a demo page in VS Code
2. Yellow squiggles appear on inaccessible code
3. Hover to see issue description
4. Click lightbulb for "Show detailed WCAG help"
5. Click "Apply Fix" to automatically insert corrections

### 4. Compare Results

For each page, compare:
- **Expected Issues** (listed on the page) vs. **Detected Issues** (from analyzer)
- **Accessible Grade** (should be A or B) vs. **Inaccessible Grade** (should be D or F)
- **Manual Testing** (your experience) vs. **Automated Detection**

## Educational Use

### For Learners

1. Start with `buttons.html` - the simplest pattern
2. Progress through increasingly complex widgets
3. Try implementing your own accessible version before looking at the code
4. Use the analyzer to check your work

### For Instructors

- Use in web accessibility courses
- Assign students to fix the inaccessible versions
- Run analyzer before and after to measure improvement
- Create additional demo pages for specific scenarios

### For Developers

- Reference implementation for WAI-ARIA patterns
- Copy accessible code into your projects
- Test your own code against the analyzer
- Use VS Code extension for real-time feedback

## Browser Compatibility

Tested in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Screen readers tested:
- NVDA 2023+ (Windows)
- JAWS 2023+ (Windows)
- VoiceOver (macOS built-in)

## Contributing

To add a new demo page:

1. Create HTML file in `demo/pages/`
2. Create two JS files in `demo/js/accessible/` and `demo/js/inaccessible/`
3. Follow the template structure from existing pages
4. Update `index.html` to link to the new page
5. Test with the analyzer

## License

This demo project is part of the ActionLanguage accessibility analysis tool research project.

## Resources

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Inclusive Components](https://inclusive-components.design/)

---

**Questions or Issues?** Check the analyzer documentation or open an issue in the repository.
