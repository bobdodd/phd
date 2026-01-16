"use strict";
/**
 * Widget Pattern Analyzer
 *
 * Validates complete implementation of 21 WAI-ARIA Authoring Practices patterns.
 * Ensures ARIA widgets have correct structure, attributes, and keyboard behavior.
 *
 * WCAG Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 * - 2.1.1 Keyboard (Level A)
 * - 4.1.2 Name, Role, Value (Level A)
 *
 * Patterns Validated:
 * 1. Tabs (role="tablist")
 * 2. Dialog/Modal (role="dialog")
 * 3. Accordion/Disclosure (aria-expanded)
 * 4. Combobox (role="combobox")
 * 5. Menu (role="menu")
 * 6. Tree (role="tree")
 * 7. Toolbar (role="toolbar")
 * 8. Grid (role="grid")
 * 9. Listbox (role="listbox")
 * 10. Radiogroup (role="radiogroup")
 * 11. Slider (role="slider")
 * 12. Spinbutton (role="spinbutton")
 * 13. Switch (role="switch")
 * 14. Breadcrumb (navigation breadcrumb)
 * 15. Feed (role="feed")
 * 16. Disclosure (non-button)
 * 17. Carousel (rotation control)
 * 18. Link (role="link" on non-<a>)
 * 19. Meter (role="meter")
 * 20. Progressbar (role="progressbar")
 * 21. Tooltip (role="tooltip")
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetPatternAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class WidgetPatternAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'WidgetPatternAnalyzer';
        this.description = 'Validates complete implementation of 21 WAI-ARIA widget patterns (tabs, dialogs, menus, etc.)';
    }
    analyze(context) {
        const issues = [];
        if (context.documentModel && context.documentModel.javascript.length > 0) {
            // Multi-file analysis (preferred)
            for (const jsModel of context.documentModel.javascript) {
                issues.push(...this.analyzeWidgetPatterns(jsModel.nodes, context));
            }
        }
        else if (context.actionLanguageModel) {
            // File-scope fallback
            issues.push(...this.analyzeWidgetPatterns(context.actionLanguageModel.nodes, context));
        }
        return issues;
    }
    analyzeWidgetPatterns(nodes, context) {
        const issues = [];
        // Track elements by role for pattern validation
        const roleElements = new Map();
        // Collect all role assignments
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange' &&
                node.metadata.attribute === 'role') {
                const role = node.metadata.value;
                if (!roleElements.has(role)) {
                    roleElements.set(role, []);
                }
                roleElements.get(role).push(node);
            }
        }
        // Validate each pattern
        issues.push(...this.validateTabsPattern(roleElements, nodes, context));
        issues.push(...this.validateDialogPattern(roleElements, nodes, context));
        issues.push(...this.validateAccordionPattern(nodes, context));
        issues.push(...this.validateComboboxPattern(roleElements, nodes, context));
        issues.push(...this.validateMenuPattern(roleElements, nodes, context));
        issues.push(...this.validateTreePattern(roleElements, nodes, context));
        issues.push(...this.validateToolbarPattern(roleElements, nodes, context));
        issues.push(...this.validateGridPattern(roleElements, nodes, context));
        issues.push(...this.validateListboxPattern(roleElements, nodes, context));
        issues.push(...this.validateRadiogroupPattern(roleElements, nodes, context));
        issues.push(...this.validateSliderPattern(roleElements, nodes, context));
        issues.push(...this.validateSpinbuttonPattern(roleElements, nodes, context));
        issues.push(...this.validateSwitchPattern(roleElements, nodes, context));
        issues.push(...this.validateBreadcrumbPattern(nodes, context));
        issues.push(...this.validateFeedPattern(roleElements, nodes, context));
        issues.push(...this.validateDisclosurePattern(nodes, context));
        issues.push(...this.validateCarouselPattern(nodes, context));
        issues.push(...this.validateLinkPattern(roleElements, nodes, context));
        issues.push(...this.validateMeterPattern(roleElements, nodes, context));
        issues.push(...this.validateProgressbarPattern(roleElements, nodes, context));
        issues.push(...this.validateTooltipPattern(roleElements, nodes, context));
        return issues;
    }
    // Pattern 1: Tabs
    validateTabsPattern(roleElements, nodes, context) {
        const issues = [];
        const tablists = roleElements.get('tablist') || [];
        for (const tablist of tablists) {
            const elementSelector = tablist.element.selector;
            // Check for tabs within tablist
            const hasTabs = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'role' &&
                n.metadata.value === 'tab');
            if (!hasTabs) {
                const fix = {
                    description: 'Add role="tab" to tab children',
                    code: `<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>`,
                    location: tablist.location,
                };
                issues.push(this.createIssue('incomplete-tabs-pattern', 'warning', `Tablist at ${elementSelector} missing child tabs with role="tab"`, tablist.location, ['4.1.2', '1.3.1'], context, { fix }));
            }
            // Check for arrow key navigation
            const hasArrowNav = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                (n.handler?.body?.includes('ArrowLeft') ||
                    n.handler?.body?.includes('ArrowRight')));
            if (!hasArrowNav) {
                const fix = {
                    description: 'Add arrow key navigation',
                    code: `tablist.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    // Navigate between tabs
    const tabs = tablist.querySelectorAll('[role="tab"]');
    const currentIndex = Array.from(tabs).indexOf(e.target);
    const nextIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;
    if (tabs[nextIndex]) tabs[nextIndex].focus();
  }
});`,
                    location: tablist.location,
                };
                issues.push(this.createIssue('incomplete-tabs-pattern', 'warning', `Tablist at ${elementSelector} missing arrow key navigation`, tablist.location, ['2.1.1', '4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 2: Dialog
    validateDialogPattern(roleElements, nodes, context) {
        const issues = [];
        const dialogs = [
            ...(roleElements.get('dialog') || []),
            ...(roleElements.get('alertdialog') || []),
        ];
        for (const dialog of dialogs) {
            const elementSelector = dialog.element.selector;
            // Check for aria-modal
            const hasAriaModal = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'aria-modal' &&
                n.element.selector === elementSelector);
            if (!hasAriaModal) {
                const fix = {
                    description: 'Add aria-modal="true"',
                    code: `dialog.setAttribute('aria-modal', 'true');`,
                    location: dialog.location,
                };
                issues.push(this.createIssue('incomplete-dialog-pattern', 'error', `Dialog at ${elementSelector} missing aria-modal="true"`, dialog.location, ['4.1.2'], context, { fix }));
            }
            // Check for Escape key handler
            const hasEscapeHandler = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                n.handler?.body?.includes('Escape'));
            if (!hasEscapeHandler) {
                const fix = {
                    description: 'Add Escape key handler to close dialog',
                    code: `dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDialog();
  }
});`,
                    location: dialog.location,
                };
                issues.push(this.createIssue('incomplete-dialog-pattern', 'warning', `Dialog at ${elementSelector} missing Escape key handler`, dialog.location, ['2.1.2'], context, { fix }));
            }
            // Check for focus trap (Tab key management)
            const hasFocusTrap = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                n.handler?.body?.includes('Tab'));
            if (!hasFocusTrap) {
                const fix = {
                    description: 'Add focus trap for Tab key',
                    code: `dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusableElements = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
});`,
                    location: dialog.location,
                };
                issues.push(this.createIssue('incomplete-dialog-pattern', 'error', `Dialog at ${elementSelector} missing focus trap implementation`, dialog.location, ['2.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 3: Accordion/Disclosure
    validateAccordionPattern(nodes, context) {
        const issues = [];
        // Find elements with aria-expanded (accordion pattern)
        const expandedElements = nodes.filter((n) => n.actionType === 'ariaStateChange' &&
            n.metadata.attribute === 'aria-expanded');
        for (const element of expandedElements) {
            const elementSelector = element.element.selector;
            // Check for aria-controls
            const hasAriaControls = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'aria-controls' &&
                n.element.selector === elementSelector);
            if (!hasAriaControls) {
                const fix = {
                    description: 'Add aria-controls to link button with panel',
                    code: `<button aria-expanded="false" aria-controls="panel1">
  Section Header
</button>
<div id="panel1" hidden>
  Panel content
</div>`,
                    location: element.location,
                };
                issues.push(this.createIssue('incomplete-accordion-pattern', 'warning', `Accordion button at ${elementSelector} missing aria-controls attribute`, element.location, ['4.1.2', '1.3.1'], context, { fix }));
            }
            // Check for click/keyboard handler to toggle
            const hasToggleHandler = nodes.some((n) => n.actionType === 'eventHandler' &&
                (n.event === 'click' || n.event === 'keydown') &&
                n.element.selector === elementSelector);
            if (!hasToggleHandler) {
                const fix = {
                    description: 'Add click handler to toggle aria-expanded',
                    code: `button.addEventListener('click', () => {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isExpanded));
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  panel.hidden = isExpanded;
});`,
                    location: element.location,
                };
                issues.push(this.createIssue('incomplete-accordion-pattern', 'warning', `Accordion button at ${elementSelector} missing click handler`, element.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 4: Combobox
    validateComboboxPattern(roleElements, nodes, context) {
        const issues = [];
        const comboboxes = roleElements.get('combobox') || [];
        for (const combobox of comboboxes) {
            const elementSelector = combobox.element.selector;
            // Check for required attributes
            const requiredAttrs = ['aria-expanded', 'aria-controls'];
            for (const attr of requiredAttrs) {
                const hasAttr = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                    n.metadata.attribute === attr &&
                    n.element.selector === elementSelector);
                if (!hasAttr) {
                    const fix = {
                        description: `Add ${attr} attribute`,
                        code: `combobox.setAttribute('${attr}', '${attr === 'aria-expanded' ? 'false' : 'listbox1'}');`,
                        location: combobox.location,
                    };
                    issues.push(this.createIssue('incomplete-combobox-pattern', 'error', `Combobox at ${elementSelector} missing required ${attr}`, combobox.location, ['4.1.2'], context, { fix }));
                }
            }
            // Check for arrow key navigation
            const hasArrowNav = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                n.element.selector === elementSelector &&
                (n.handler?.body?.includes('ArrowDown') ||
                    n.handler?.body?.includes('ArrowUp')));
            if (!hasArrowNav) {
                const fix = {
                    description: 'Add arrow key navigation for options',
                    code: `combobox.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    // Navigate through listbox options
    const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
    const options = listbox.querySelectorAll('[role="option"]');
    // Update aria-activedescendant
  }
});`,
                    location: combobox.location,
                };
                issues.push(this.createIssue('incomplete-combobox-pattern', 'warning', `Combobox at ${elementSelector} missing arrow key navigation`, combobox.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 5: Menu
    validateMenuPattern(roleElements, nodes, context) {
        const issues = [];
        const menus = [
            ...(roleElements.get('menu') || []),
            ...(roleElements.get('menubar') || []),
        ];
        for (const menu of menus) {
            const elementSelector = menu.element.selector;
            // Check for menuitem children
            const hasMenuitems = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'role' &&
                (n.metadata.value === 'menuitem' ||
                    n.metadata.value === 'menuitemcheckbox' ||
                    n.metadata.value === 'menuitemradio'));
            if (!hasMenuitems) {
                const fix = {
                    description: 'Add menuitem children',
                    code: `<div role="menu">
  <div role="menuitem">Menu Item 1</div>
  <div role="menuitem">Menu Item 2</div>
  <div role="menuitem">Menu Item 3</div>
</div>`,
                    location: menu.location,
                };
                issues.push(this.createIssue('incomplete-menu-pattern', 'warning', `Menu at ${elementSelector} missing menuitem children`, menu.location, ['4.1.2', '1.3.1'], context, { fix }));
            }
            // Check for arrow key navigation
            const hasArrowNav = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                (n.handler?.body?.includes('ArrowDown') ||
                    n.handler?.body?.includes('ArrowUp')));
            if (!hasArrowNav) {
                const fix = {
                    description: 'Add arrow key navigation',
                    code: `menu.addEventListener('keydown', (e) => {
  const items = menu.querySelectorAll('[role^="menuitem"]');
  const currentIndex = Array.from(items).indexOf(document.activeElement);

  if (e.key === 'ArrowDown') {
    items[(currentIndex + 1) % items.length]?.focus();
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    items[(currentIndex - 1 + items.length) % items.length]?.focus();
    e.preventDefault();
  }
});`,
                    location: menu.location,
                };
                issues.push(this.createIssue('incomplete-menu-pattern', 'warning', `Menu at ${elementSelector} missing arrow key navigation`, menu.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 6: Tree
    validateTreePattern(roleElements, nodes, context) {
        const issues = [];
        const trees = roleElements.get('tree') || [];
        for (const tree of trees) {
            const elementSelector = tree.element.selector;
            // Check for treeitem children
            const hasTreeitems = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'role' &&
                n.metadata.value === 'treeitem');
            if (!hasTreeitems) {
                const fix = {
                    description: 'Add treeitem children',
                    code: `<div role="tree">
  <div role="treeitem" aria-expanded="false">
    Parent Item
    <div role="group">
      <div role="treeitem">Child Item</div>
    </div>
  </div>
</div>`,
                    location: tree.location,
                };
                issues.push(this.createIssue('incomplete-tree-pattern', 'warning', `Tree at ${elementSelector} missing treeitem children`, tree.location, ['4.1.2', '1.3.1'], context, { fix }));
            }
            // Check for arrow key navigation (all 4 directions)
            const hasArrowNav = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                (n.handler?.body?.includes('ArrowDown') ||
                    n.handler?.body?.includes('ArrowUp') ||
                    n.handler?.body?.includes('ArrowLeft') ||
                    n.handler?.body?.includes('ArrowRight')));
            if (!hasArrowNav) {
                const fix = {
                    description: 'Add 4-direction arrow key navigation',
                    code: `tree.addEventListener('keydown', (e) => {
  const current = document.activeElement;

  if (e.key === 'ArrowDown') {
    // Move to next treeitem
  } else if (e.key === 'ArrowUp') {
    // Move to previous treeitem
  } else if (e.key === 'ArrowRight') {
    // Expand if collapsed, or move to first child
    if (current.getAttribute('aria-expanded') === 'false') {
      current.setAttribute('aria-expanded', 'true');
    }
  } else if (e.key === 'ArrowLeft') {
    // Collapse if expanded, or move to parent
    if (current.getAttribute('aria-expanded') === 'true') {
      current.setAttribute('aria-expanded', 'false');
    }
  }
});`,
                    location: tree.location,
                };
                issues.push(this.createIssue('incomplete-tree-pattern', 'warning', `Tree at ${elementSelector} missing arrow key navigation`, tree.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 7: Toolbar
    validateToolbarPattern(roleElements, nodes, context) {
        const issues = [];
        const toolbars = roleElements.get('toolbar') || [];
        for (const toolbar of toolbars) {
            const elementSelector = toolbar.element.selector;
            // Check for roving tabindex pattern (one item tabindex="0", others "-1")
            const hasRovingTabindex = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'tabindex' &&
                (n.metadata.value === '0' || n.metadata.value === '-1'));
            if (!hasRovingTabindex) {
                const fix = {
                    description: 'Implement roving tabindex pattern',
                    code: `// Set first button to tabindex="0", others to "-1"
const buttons = toolbar.querySelectorAll('button');
buttons[0].setAttribute('tabindex', '0');
for (let i = 1; i < buttons.length; i++) {
  buttons[i].setAttribute('tabindex', '-1');
}`,
                    location: toolbar.location,
                };
                issues.push(this.createIssue('incomplete-toolbar-pattern', 'warning', `Toolbar at ${elementSelector} missing roving tabindex pattern`, toolbar.location, ['2.1.1'], context, { fix }));
            }
            // Check for arrow key navigation
            const hasArrowNav = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                (n.handler?.body?.includes('ArrowLeft') ||
                    n.handler?.body?.includes('ArrowRight')));
            if (!hasArrowNav) {
                const fix = {
                    description: 'Add arrow key navigation',
                    code: `toolbar.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const buttons = toolbar.querySelectorAll('button');
    const currentIndex = Array.from(buttons).indexOf(document.activeElement);
    const nextIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;

    if (buttons[nextIndex]) {
      buttons[currentIndex].setAttribute('tabindex', '-1');
      buttons[nextIndex].setAttribute('tabindex', '0');
      buttons[nextIndex].focus();
    }
  }
});`,
                    location: toolbar.location,
                };
                issues.push(this.createIssue('incomplete-toolbar-pattern', 'warning', `Toolbar at ${elementSelector} missing arrow key navigation`, toolbar.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 8: Grid
    validateGridPattern(roleElements, nodes, context) {
        const issues = [];
        const grids = roleElements.get('grid') || [];
        for (const grid of grids) {
            const elementSelector = grid.element.selector;
            // Check for row children
            const hasRows = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'role' &&
                n.metadata.value === 'row');
            if (!hasRows) {
                const fix = {
                    description: 'Add row children with gridcell',
                    code: `<div role="grid">
  <div role="row">
    <div role="gridcell">Cell 1,1</div>
    <div role="gridcell">Cell 1,2</div>
  </div>
  <div role="row">
    <div role="gridcell">Cell 2,1</div>
    <div role="gridcell">Cell 2,2</div>
  </div>
</div>`,
                    location: grid.location,
                };
                issues.push(this.createIssue('incomplete-grid-pattern', 'warning', `Grid at ${elementSelector} missing row children`, grid.location, ['4.1.2', '1.3.1'], context, { fix }));
            }
            // Check for 2D arrow navigation
            const has2DNavigation = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                n.handler?.body?.includes('Arrow') &&
                (n.handler?.body?.includes('ArrowUp') ||
                    n.handler?.body?.includes('ArrowDown')));
            if (!has2DNavigation) {
                const fix = {
                    description: 'Add 2D arrow key navigation',
                    code: `grid.addEventListener('keydown', (e) => {
  const cell = document.activeElement;
  const row = cell.parentElement;
  const cells = row.querySelectorAll('[role="gridcell"]');
  const rows = grid.querySelectorAll('[role="row"]');

  if (e.key === 'ArrowRight') {
    const nextCell = cell.nextElementSibling;
    if (nextCell) nextCell.focus();
  } else if (e.key === 'ArrowLeft') {
    const prevCell = cell.previousElementSibling;
    if (prevCell) prevCell.focus();
  } else if (e.key === 'ArrowDown') {
    const rowIndex = Array.from(rows).indexOf(row);
    const cellIndex = Array.from(cells).indexOf(cell);
    const nextRow = rows[rowIndex + 1];
    if (nextRow) nextRow.querySelectorAll('[role="gridcell"]')[cellIndex]?.focus();
  } else if (e.key === 'ArrowUp') {
    const rowIndex = Array.from(rows).indexOf(row);
    const cellIndex = Array.from(cells).indexOf(cell);
    const prevRow = rows[rowIndex - 1];
    if (prevRow) prevRow.querySelectorAll('[role="gridcell"]')[cellIndex]?.focus();
  }
});`,
                    location: grid.location,
                };
                issues.push(this.createIssue('incomplete-grid-pattern', 'warning', `Grid at ${elementSelector} missing 2D arrow key navigation`, grid.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 9: Listbox
    validateListboxPattern(roleElements, nodes, context) {
        const issues = [];
        const listboxes = roleElements.get('listbox') || [];
        for (const listbox of listboxes) {
            const elementSelector = listbox.element.selector;
            // Check for option children
            const hasOptions = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'role' &&
                n.metadata.value === 'option');
            if (!hasOptions) {
                const fix = {
                    description: 'Add option children',
                    code: `<div role="listbox">
  <div role="option" aria-selected="false">Option 1</div>
  <div role="option" aria-selected="false">Option 2</div>
  <div role="option" aria-selected="true">Option 3</div>
</div>`,
                    location: listbox.location,
                };
                issues.push(this.createIssue('incomplete-listbox-pattern', 'warning', `Listbox at ${elementSelector} missing option children`, listbox.location, ['4.1.2', '1.3.1'], context, { fix }));
            }
            // Check for arrow key navigation
            const hasArrowNav = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                (n.handler?.body?.includes('ArrowDown') ||
                    n.handler?.body?.includes('ArrowUp')));
            if (!hasArrowNav) {
                const fix = {
                    description: 'Add arrow key navigation',
                    code: `listbox.addEventListener('keydown', (e) => {
  const options = listbox.querySelectorAll('[role="option"]');
  const currentIndex = Array.from(options).indexOf(document.activeElement);

  if (e.key === 'ArrowDown') {
    options[(currentIndex + 1) % options.length]?.focus();
  } else if (e.key === 'ArrowUp') {
    options[(currentIndex - 1 + options.length) % options.length]?.focus();
  }
});`,
                    location: listbox.location,
                };
                issues.push(this.createIssue('incomplete-listbox-pattern', 'warning', `Listbox at ${elementSelector} missing arrow key navigation`, listbox.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 10: Radiogroup
    validateRadiogroupPattern(roleElements, nodes, context) {
        const issues = [];
        const radiogroups = roleElements.get('radiogroup') || [];
        for (const radiogroup of radiogroups) {
            const elementSelector = radiogroup.element.selector;
            // Check for radio children
            const hasRadios = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'role' &&
                n.metadata.value === 'radio');
            if (!hasRadios) {
                const fix = {
                    description: 'Add radio children',
                    code: `<div role="radiogroup" aria-label="Choose option">
  <div role="radio" aria-checked="true">Option 1</div>
  <div role="radio" aria-checked="false">Option 2</div>
  <div role="radio" aria-checked="false">Option 3</div>
</div>`,
                    location: radiogroup.location,
                };
                issues.push(this.createIssue('incomplete-radiogroup-pattern', 'warning', `Radiogroup at ${elementSelector} missing radio children`, radiogroup.location, ['4.1.2', '1.3.1'], context, { fix }));
            }
            // Check for arrow key navigation
            const hasArrowNav = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                (n.handler?.body?.includes('ArrowDown') ||
                    n.handler?.body?.includes('ArrowUp') ||
                    n.handler?.body?.includes('ArrowLeft') ||
                    n.handler?.body?.includes('ArrowRight')));
            if (!hasArrowNav) {
                const fix = {
                    description: 'Add arrow key navigation with auto-check',
                    code: `radiogroup.addEventListener('keydown', (e) => {
  const radios = radiogroup.querySelectorAll('[role="radio"]');
  const currentIndex = Array.from(radios).indexOf(document.activeElement);
  let nextIndex = currentIndex;

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % radios.length;
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + radios.length) % radios.length;
  }

  if (nextIndex !== currentIndex) {
    radios[currentIndex].setAttribute('aria-checked', 'false');
    radios[nextIndex].setAttribute('aria-checked', 'true');
    radios[nextIndex].focus();
  }
});`,
                    location: radiogroup.location,
                };
                issues.push(this.createIssue('incomplete-radiogroup-pattern', 'warning', `Radiogroup at ${elementSelector} missing arrow key navigation`, radiogroup.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 11: Slider
    validateSliderPattern(roleElements, nodes, context) {
        const issues = [];
        const sliders = roleElements.get('slider') || [];
        for (const slider of sliders) {
            const elementSelector = slider.element.selector;
            // Check for required value attributes
            const requiredAttrs = ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'];
            for (const attr of requiredAttrs) {
                const hasAttr = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                    n.metadata.attribute === attr &&
                    n.element.selector === elementSelector);
                if (!hasAttr) {
                    const fix = {
                        description: `Add ${attr} attribute`,
                        code: `slider.setAttribute('${attr}', '${attr === 'aria-valuenow' ? '50' : attr === 'aria-valuemin' ? '0' : '100'}');`,
                        location: slider.location,
                    };
                    issues.push(this.createIssue('incomplete-slider-pattern', 'error', `Slider at ${elementSelector} missing required ${attr}`, slider.location, ['4.1.2'], context, { fix }));
                }
            }
            // Check for arrow key handlers
            const hasArrowKeys = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                n.element.selector === elementSelector &&
                (n.handler?.body?.includes('ArrowLeft') ||
                    n.handler?.body?.includes('ArrowRight') ||
                    n.handler?.body?.includes('ArrowUp') ||
                    n.handler?.body?.includes('ArrowDown')));
            if (!hasArrowKeys) {
                const fix = {
                    description: 'Add arrow key handlers to adjust value',
                    code: `slider.addEventListener('keydown', (e) => {
  let value = parseInt(slider.getAttribute('aria-valuenow'));
  const min = parseInt(slider.getAttribute('aria-valuemin'));
  const max = parseInt(slider.getAttribute('aria-valuemax'));

  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    value = Math.min(max, value + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    value = Math.max(min, value - 1);
  } else if (e.key === 'Home') {
    value = min;
  } else if (e.key === 'End') {
    value = max;
  }

  slider.setAttribute('aria-valuenow', String(value));
  slider.setAttribute('aria-valuetext', value + '%');
});`,
                    location: slider.location,
                };
                issues.push(this.createIssue('incomplete-slider-pattern', 'warning', `Slider at ${elementSelector} missing arrow key handlers`, slider.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 12: Spinbutton
    validateSpinbuttonPattern(roleElements, nodes, context) {
        const issues = [];
        const spinbuttons = roleElements.get('spinbutton') || [];
        for (const spinbutton of spinbuttons) {
            const elementSelector = spinbutton.element.selector;
            // Check for required value attributes
            const requiredAttrs = ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'];
            for (const attr of requiredAttrs) {
                const hasAttr = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                    n.metadata.attribute === attr &&
                    n.element.selector === elementSelector);
                if (!hasAttr) {
                    const fix = {
                        description: `Add ${attr} attribute`,
                        code: `spinbutton.setAttribute('${attr}', '${attr === 'aria-valuenow' ? '10' : attr === 'aria-valuemin' ? '0' : '100'}');`,
                        location: spinbutton.location,
                    };
                    issues.push(this.createIssue('incomplete-spinbutton-pattern', 'error', `Spinbutton at ${elementSelector} missing required ${attr}`, spinbutton.location, ['4.1.2'], context, { fix }));
                }
            }
            // Check for Up/Down arrow key handlers
            const hasUpDownKeys = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                n.element.selector === elementSelector &&
                (n.handler?.body?.includes('ArrowUp') ||
                    n.handler?.body?.includes('ArrowDown')));
            if (!hasUpDownKeys) {
                const fix = {
                    description: 'Add Up/Down arrow key handlers',
                    code: `spinbutton.addEventListener('keydown', (e) => {
  let value = parseInt(spinbutton.getAttribute('aria-valuenow'));
  const min = parseInt(spinbutton.getAttribute('aria-valuemin'));
  const max = parseInt(spinbutton.getAttribute('aria-valuemax'));

  if (e.key === 'ArrowUp') {
    value = Math.min(max, value + 1);
  } else if (e.key === 'ArrowDown') {
    value = Math.max(min, value - 1);
  } else if (e.key === 'PageUp') {
    value = Math.min(max, value + 10);
  } else if (e.key === 'PageDown') {
    value = Math.max(min, value - 10);
  } else if (e.key === 'Home') {
    value = min;
  } else if (e.key === 'End') {
    value = max;
  }

  spinbutton.setAttribute('aria-valuenow', String(value));
});`,
                    location: spinbutton.location,
                };
                issues.push(this.createIssue('incomplete-spinbutton-pattern', 'warning', `Spinbutton at ${elementSelector} missing Up/Down arrow key handlers`, spinbutton.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 13: Switch
    validateSwitchPattern(roleElements, nodes, context) {
        const issues = [];
        const switches = roleElements.get('switch') || [];
        for (const switchElem of switches) {
            const elementSelector = switchElem.element.selector;
            // Check for aria-checked
            const hasAriaChecked = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'aria-checked' &&
                n.element.selector === elementSelector);
            if (!hasAriaChecked) {
                const fix = {
                    description: 'Add aria-checked attribute',
                    code: `switchElem.setAttribute('aria-checked', 'false');`,
                    location: switchElem.location,
                };
                issues.push(this.createIssue('incomplete-switch-pattern', 'error', `Switch at ${elementSelector} missing aria-checked attribute`, switchElem.location, ['4.1.2'], context, { fix }));
            }
            // Check for toggle handler (click or Space/Enter)
            const hasToggleHandler = nodes.some((n) => (n.actionType === 'eventHandler' &&
                (n.event === 'click' ||
                    (n.event === 'keydown' &&
                        (n.handler?.body?.includes('Enter') ||
                            n.handler?.body?.includes(' '))))) &&
                n.element.selector === elementSelector);
            if (!hasToggleHandler) {
                const fix = {
                    description: 'Add toggle handler for click and keyboard',
                    code: `function toggleSwitch() {
  const isChecked = switchElem.getAttribute('aria-checked') === 'true';
  switchElem.setAttribute('aria-checked', String(!isChecked));
}

switchElem.addEventListener('click', toggleSwitch);
switchElem.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    toggleSwitch();
    e.preventDefault();
  }
});`,
                    location: switchElem.location,
                };
                issues.push(this.createIssue('incomplete-switch-pattern', 'warning', `Switch at ${elementSelector} missing toggle handler`, switchElem.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 14: Breadcrumb
    validateBreadcrumbPattern(nodes, context) {
        const issues = [];
        // Look for navigation with breadcrumb-like structure
        // This is a simpler pattern - just check for aria-current="page" on last item
        const navElements = nodes.filter((n) => n.actionType === 'ariaStateChange' &&
            n.metadata.attribute === 'role' &&
            n.metadata.value === 'navigation');
        for (const nav of navElements) {
            // Check if navigation has aria-label="Breadcrumb" (common pattern)
            const hasBreadcrumbLabel = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'aria-label' &&
                n.metadata.value?.toLowerCase().includes('breadcrumb') &&
                n.element.selector === nav.element.selector);
            if (hasBreadcrumbLabel) {
                // Check for aria-current="page" on last item
                const hasAriaCurrent = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                    n.metadata.attribute === 'aria-current' &&
                    n.metadata.value === 'page');
                if (!hasAriaCurrent) {
                    const fix = {
                        description: 'Add aria-current="page" to last breadcrumb item',
                        code: `<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><span aria-current="page">Product Details</span></li>
  </ol>
</nav>`,
                        location: nav.location,
                    };
                    issues.push(this.createIssue('incomplete-breadcrumb-pattern', 'info', `Breadcrumb navigation missing aria-current="page" on last item`, nav.location, ['1.3.1'], context, { fix }));
                }
            }
        }
        return issues;
    }
    // Pattern 15: Feed
    validateFeedPattern(roleElements, nodes, context) {
        const issues = [];
        const feeds = roleElements.get('feed') || [];
        for (const feed of feeds) {
            const elementSelector = feed.element.selector;
            // Check for article children
            const hasArticles = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'role' &&
                n.metadata.value === 'article');
            if (!hasArticles) {
                const fix = {
                    description: 'Add article children',
                    code: `<div role="feed" aria-label="News feed">
  <article aria-posinset="1" aria-setsize="10">
    <h2>Article Title 1</h2>
    <p>Content...</p>
  </article>
  <article aria-posinset="2" aria-setsize="10">
    <h2>Article Title 2</h2>
    <p>Content...</p>
  </article>
</div>`,
                    location: feed.location,
                };
                issues.push(this.createIssue('incomplete-feed-pattern', 'warning', `Feed at ${elementSelector} missing article children`, feed.location, ['4.1.2', '1.3.1'], context, { fix }));
            }
            // Check for aria-setsize on articles (for infinite scroll)
            const hasSetsize = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'aria-setsize');
            if (!hasSetsize) {
                const fix = {
                    description: 'Add aria-posinset and aria-setsize to articles',
                    code: `articles.forEach((article, index) => {
  article.setAttribute('aria-posinset', String(index + 1));
  article.setAttribute('aria-setsize', String(totalArticles));
});`,
                    location: feed.location,
                };
                issues.push(this.createIssue('incomplete-feed-pattern', 'info', `Feed at ${elementSelector} missing aria-posinset/aria-setsize on articles`, feed.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 16: Disclosure (non-button)
    validateDisclosurePattern(nodes, context) {
        const issues = [];
        // Find aria-expanded on non-button elements
        const disclosures = nodes.filter((n) => n.actionType === 'ariaStateChange' &&
            n.metadata.attribute === 'aria-expanded' &&
            !n.element.selector.includes('button'));
        for (const disclosure of disclosures) {
            const elementSelector = disclosure.element.selector;
            // Check for proper role
            const hasButtonRole = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'role' &&
                n.metadata.value === 'button' &&
                n.element.selector === elementSelector);
            if (!hasButtonRole) {
                const fix = {
                    description: 'Add role="button" or use <button> element',
                    code: `// Option 1: Add role="button"
element.setAttribute('role', 'button');

// Option 2 (preferred): Use native button
<button aria-expanded="false">Toggle</button>`,
                    location: disclosure.location,
                };
                issues.push(this.createIssue('incomplete-disclosure-pattern', 'warning', `Element at ${elementSelector} with aria-expanded should be a button or have role="button"`, disclosure.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 17: Carousel
    validateCarouselPattern(nodes, context) {
        const issues = [];
        // Look for carousel patterns (auto-rotation indicators)
        const hasAutoRotation = nodes.some((n) => n.actionType === 'domManipulation' &&
            (n.metadata.method === 'setInterval' ||
                n.metadata.method === 'setTimeout'));
        if (hasAutoRotation) {
            // Check for pause control
            const hasPauseControl = nodes.some((n) => n.actionType === 'eventHandler' &&
                (n.handler?.body?.includes('pause') ||
                    n.handler?.body?.includes('stop') ||
                    n.handler?.body?.includes('clearInterval')));
            if (!hasPauseControl) {
                const firstAutoRotation = nodes.find((n) => n.actionType === 'domManipulation' &&
                    (n.metadata.method === 'setInterval' ||
                        n.metadata.method === 'setTimeout'));
                if (firstAutoRotation) {
                    const fix = {
                        description: 'Add pause/play control for auto-rotating carousel',
                        code: `let intervalId = setInterval(rotateCarousel, 5000);

const pauseButton = document.getElementById('carousel-pause');
pauseButton.addEventListener('click', () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    pauseButton.textContent = 'Play';
    pauseButton.setAttribute('aria-label', 'Play carousel');
  } else {
    intervalId = setInterval(rotateCarousel, 5000);
    pauseButton.textContent = 'Pause';
    pauseButton.setAttribute('aria-label', 'Pause carousel');
  }
});`,
                        location: firstAutoRotation.location,
                    };
                    issues.push(this.createIssue('incomplete-carousel-pattern', 'warning', 'Auto-rotating carousel missing pause/play control', firstAutoRotation.location, ['2.2.2'], context, { fix }));
                }
            }
        }
        return issues;
    }
    // Pattern 18: Link (role="link" on non-<a>)
    validateLinkPattern(roleElements, nodes, context) {
        const issues = [];
        const links = roleElements.get('link') || [];
        for (const link of links) {
            const elementSelector = link.element.selector;
            // Check for click handler
            const hasClickHandler = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'click' &&
                n.element.selector === elementSelector);
            if (!hasClickHandler) {
                const fix = {
                    description: 'Add click handler or use <a> element',
                    code: `// Option 1: Add click handler
element.addEventListener('click', (e) => {
  window.location.href = '/destination';
});

// Option 2 (preferred): Use native <a> element
<a href="/destination">Link text</a>`,
                    location: link.location,
                };
                issues.push(this.createIssue('incomplete-link-pattern', 'warning', `Element with role="link" at ${elementSelector} missing click handler`, link.location, ['2.1.1'], context, { fix }));
            }
            // Check for Enter key handler
            const hasEnterHandler = nodes.some((n) => n.actionType === 'eventHandler' &&
                n.event === 'keydown' &&
                n.handler?.body?.includes('Enter') &&
                n.element.selector === elementSelector);
            if (!hasEnterHandler) {
                const fix = {
                    description: 'Add Enter key handler',
                    code: `element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    window.location.href = element.getAttribute('href');
  }
});`,
                    location: link.location,
                };
                issues.push(this.createIssue('incomplete-link-pattern', 'info', `Element with role="link" at ${elementSelector} missing Enter key handler`, link.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 19: Meter
    validateMeterPattern(roleElements, nodes, context) {
        const issues = [];
        const meters = roleElements.get('meter') || [];
        for (const meter of meters) {
            const elementSelector = meter.element.selector;
            // Check for required value attributes
            const requiredAttrs = ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'];
            for (const attr of requiredAttrs) {
                const hasAttr = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                    n.metadata.attribute === attr &&
                    n.element.selector === elementSelector);
                if (!hasAttr) {
                    const fix = {
                        description: `Add ${attr} attribute`,
                        code: `meter.setAttribute('${attr}', '${attr === 'aria-valuenow' ? '75' : attr === 'aria-valuemin' ? '0' : '100'}');`,
                        location: meter.location,
                    };
                    issues.push(this.createIssue('incomplete-meter-pattern', 'error', `Meter at ${elementSelector} missing required ${attr}`, meter.location, ['4.1.2'], context, { fix }));
                }
            }
        }
        return issues;
    }
    // Pattern 20: Progressbar
    validateProgressbarPattern(roleElements, nodes, context) {
        const issues = [];
        const progressbars = roleElements.get('progressbar') || [];
        for (const progressbar of progressbars) {
            const elementSelector = progressbar.element.selector;
            // Check for aria-valuenow
            const hasValuenow = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'aria-valuenow' &&
                n.element.selector === elementSelector);
            if (!hasValuenow) {
                const fix = {
                    description: 'Add aria-valuenow for determinate progressbar',
                    code: `// For determinate progress (known end):
progressbar.setAttribute('aria-valuenow', '50');
progressbar.setAttribute('aria-valuemin', '0');
progressbar.setAttribute('aria-valuemax', '100');

// For indeterminate progress (unknown end):
// No aria-valuenow needed, just role="progressbar"`,
                    location: progressbar.location,
                };
                issues.push(this.createIssue('incomplete-progressbar-pattern', 'info', `Progressbar at ${elementSelector} missing aria-valuenow (add if progress is determinate)`, progressbar.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    // Pattern 21: Tooltip
    validateTooltipPattern(roleElements, nodes, context) {
        const issues = [];
        const tooltips = roleElements.get('tooltip') || [];
        for (const tooltip of tooltips) {
            const elementSelector = tooltip.element.selector;
            // Check for unique id
            const hasId = nodes.some((n) => n.actionType === 'ariaStateChange' &&
                n.metadata.attribute === 'id' &&
                n.element.selector === elementSelector);
            if (!hasId) {
                const fix = {
                    description: 'Add unique id for aria-describedby reference',
                    code: `tooltip.setAttribute('id', 'tooltip-1');

// Reference from trigger element:
triggerElement.setAttribute('aria-describedby', 'tooltip-1');`,
                    location: tooltip.location,
                };
                issues.push(this.createIssue('incomplete-tooltip-pattern', 'warning', `Tooltip at ${elementSelector} missing unique id for aria-describedby reference`, tooltip.location, ['4.1.2'], context, { fix }));
            }
            // Check for show/hide handlers on trigger
            const hasShowHideHandlers = nodes.some((n) => n.actionType === 'eventHandler' &&
                (n.event === 'mouseenter' ||
                    n.event === 'mouseleave' ||
                    n.event === 'focus' ||
                    n.event === 'blur'));
            if (!hasShowHideHandlers) {
                const fix = {
                    description: 'Add show/hide handlers for hover and focus',
                    code: `const trigger = document.getElementById('trigger');
const tooltip = document.getElementById('tooltip-1');

trigger.addEventListener('mouseenter', () => {
  tooltip.hidden = false;
});

trigger.addEventListener('mouseleave', () => {
  tooltip.hidden = true;
});

trigger.addEventListener('focus', () => {
  tooltip.hidden = false;
});

trigger.addEventListener('blur', () => {
  tooltip.hidden = true;
});`,
                    location: tooltip.location,
                };
                issues.push(this.createIssue('incomplete-tooltip-pattern', 'info', `Tooltip at ${elementSelector} missing show/hide handlers on trigger`, tooltip.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
}
exports.WidgetPatternAnalyzer = WidgetPatternAnalyzer;
//# sourceMappingURL=WidgetPatternAnalyzer.js.map