"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardNavigationAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class KeyboardNavigationAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'KeyboardNavigationAnalyzer';
        this.description = 'Detects 9 types of keyboard navigation issues including keyboard traps, screen reader conflicts, and missing arrow navigation';
        this.screenReaderKeys = new Set([
            'h', 'b', 'k', 't', 'l', 'f', 'g', 'd', 'e', 'r', 'i', 'm',
            'n', 'p', 'q', 's', 'x', 'c', 'v', 'z', 'o', 'a', 'u',
            '1', '2', '3', '4', '5', '6',
        ]);
        this.arrowNavigationRoles = new Set([
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'tablist',
            'tree',
            'treegrid',
            'grid',
        ]);
        this.modalRoles = new Set(['dialog', 'alertdialog']);
    }
    analyze(context) {
        const issues = [];
        if (context.documentModel && context.documentModel.javascript.length > 0) {
            for (const jsModel of context.documentModel.javascript) {
                issues.push(...this.analyzeKeyboardPatterns(jsModel.nodes, context));
            }
        }
        else if (context.actionLanguageModel) {
            issues.push(...this.analyzeKeyboardPatterns(context.actionLanguageModel.nodes, context));
        }
        return issues;
    }
    analyzeKeyboardPatterns(nodes, context) {
        const issues = [];
        issues.push(...this.detectKeyboardTrap(nodes, context));
        issues.push(...this.detectScreenReaderConflict(nodes, context));
        issues.push(...this.detectDeprecatedKeyCode(nodes, context));
        issues.push(...this.detectTabWithoutShift(nodes, context));
        issues.push(...this.detectMissingEscapeHandler(nodes, context));
        issues.push(...this.detectMissingArrowNavigation(nodes, context));
        issues.push(...this.detectArrowKeysWithoutARIAContext(nodes, context));
        issues.push(...this.detectPreventDefaultOnNavKeys(nodes, context));
        issues.push(...this.detectUndocumentedShortcuts(nodes, context));
        return issues;
    }
    detectKeyboardTrap(nodes, context) {
        const issues = [];
        const tabHandlers = nodes.filter((node) => node.actionType === 'eventHandler' &&
            node.event === 'keydown' &&
            node.metadata?.keysHandled?.includes('Tab') &&
            node.metadata?.callsPreventDefault === true);
        for (const tabHandler of tabHandlers) {
            const hasEscapeHandler = this.hasEscapeHandlerNearby(nodes, tabHandler);
            if (!hasEscapeHandler) {
                const message = `Potential keyboard trap detected. Tab key is intercepted with preventDefault, but no Escape key handler found. Users may become trapped and unable to navigate away. Add an Escape handler or allow Tab to work normally.`;
                const fix = {
                    description: 'Add Escape key handler to allow users to exit',
                    code: `// Add this handler to the same element
element.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    // Allow user to escape the trapped focus
    // Option 1: Close the component
    closeComponent();

    // Option 2: Remove focus trap
    document.body.focus();
  }
});`,
                    location: tabHandler.location,
                };
                issues.push(this.createIssue('potential-keyboard-trap', 'warning', message, tabHandler.location, ['2.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    detectScreenReaderConflict(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'eventHandler' &&
                node.event === 'keydown' &&
                node.metadata?.keysHandled) {
                for (const key of node.metadata.keysHandled) {
                    if (key.length === 1 &&
                        this.screenReaderKeys.has(key.toLowerCase()) &&
                        !node.metadata?.requiresModifier) {
                        const message = `Single-character shortcut "${key}" conflicts with screen reader navigation. Keys like h, k, b, t are used by screen readers to navigate by headings, links, buttons, etc. Use modifier keys (Ctrl, Alt, or Shift) or allow users to remap shortcuts.`;
                        const fix = {
                            description: 'Require modifier key for shortcut',
                            code: `// Instead of checking just the key:
if (event.key === '${key}') { ... }

// Require a modifier key:
if (event.key === '${key}' && (event.ctrlKey || event.altKey)) {
  // Handle shortcut
}

// Or allow remapping:
const userShortcut = getUserShortcutPreference('${key}');
if (event.key === userShortcut.key && event.ctrlKey === userShortcut.ctrl) {
  // Handle shortcut
}`,
                            location: node.location,
                        };
                        issues.push(this.createIssue('screen-reader-conflict', 'warning', message, node.location, ['2.1.4'], context, { fix }));
                    }
                }
            }
        }
        return issues;
    }
    detectDeprecatedKeyCode(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'eventHandler' &&
                (node.event === 'keydown' || node.event === 'keyup' || node.event === 'keypress') &&
                (node.metadata?.usesKeyCode === true || node.metadata?.usesWhich === true)) {
                const property = node.metadata?.usesKeyCode ? 'keyCode' : 'which';
                const message = `Using deprecated event.${property}. This property is deprecated and may not work in future browsers. Use event.key instead for better compatibility and readability.`;
                const fix = {
                    description: `Replace event.${property} with event.key`,
                    code: `// Instead of:
if (event.${property} === 13) { ... }  // Enter key

// Use:
if (event.key === 'Enter') { ... }

// Common replacements:
// 13 → 'Enter'
// 27 → 'Escape'
// 32 → ' ' (space)
// 37 → 'ArrowLeft'
// 38 → 'ArrowUp'
// 39 → 'ArrowRight'
// 40 → 'ArrowDown'
// 9 → 'Tab'`,
                    location: node.location,
                };
                issues.push(this.createIssue('deprecated-keycode', 'info', message, node.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    detectTabWithoutShift(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'eventHandler' &&
                node.event === 'keydown' &&
                node.metadata?.keysHandled?.includes('Tab') &&
                node.metadata?.checksShiftKey !== true) {
                const message = `Tab key handling doesn't check for Shift modifier. Users expect Shift+Tab to navigate backward. Consider handling both Tab (forward) and Shift+Tab (backward) navigation.`;
                const fix = {
                    description: 'Add Shift+Tab handling for backward navigation',
                    code: `// Handle both forward and backward Tab navigation
element.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    if (event.shiftKey) {
      // Shift+Tab: Navigate backward
      event.preventDefault();
      focusPreviousElement();
    } else {
      // Tab: Navigate forward
      event.preventDefault();
      focusNextElement();
    }
  }
});`,
                    location: node.location,
                };
                issues.push(this.createIssue('tab-without-shift', 'info', message, node.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    detectMissingEscapeHandler(nodes, context) {
        const issues = [];
        const modalPatterns = nodes.filter((node) => {
            if (!node.element)
                return false;
            const selector = node.element.selector?.toLowerCase() || '';
            const binding = node.element.binding?.toLowerCase() || '';
            const role = node.metadata?.role;
            return (this.modalRoles.has(role) ||
                selector.includes('modal') ||
                selector.includes('dialog') ||
                binding.includes('modal') ||
                binding.includes('dialog'));
        });
        for (const modalNode of modalPatterns) {
            const hasEscapeHandler = this.hasEscapeHandlerNearby(nodes, modalNode);
            if (!hasEscapeHandler) {
                const message = `Modal or dialog without Escape key handler. Users expect to be able to press Escape to close modals. Add a keydown handler that listens for the Escape key.`;
                const fix = {
                    description: 'Add Escape key handler to close modal',
                    code: `// Add Escape key handler to modal
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// Or in React:
function Modal({ isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // ... rest of modal
}`,
                    location: modalNode.location,
                };
                issues.push(this.createIssue('missing-escape-handler', 'warning', message, modalNode.location, ['2.1.1'], context, { fix }));
            }
        }
        return issues;
    }
    detectMissingArrowNavigation(nodes, context) {
        const issues = [];
        const ariaWidgets = nodes.filter((node) => node.metadata?.role && this.arrowNavigationRoles.has(node.metadata.role));
        for (const widget of ariaWidgets) {
            const hasArrowHandlers = this.hasArrowHandlersNearby(nodes, widget);
            if (!hasArrowHandlers) {
                const role = widget.metadata?.role || 'unknown';
                const message = `ARIA widget with role="${role}" is missing arrow key navigation. According to ARIA Authoring Practices, ${role} widgets require arrow keys for keyboard navigation. Add arrow key handlers to allow proper keyboard interaction.`;
                const fix = {
                    description: `Add arrow key navigation for ${role}`,
                    code: this.generateArrowNavigationCode(role),
                    location: widget.location,
                };
                issues.push(this.createIssue('missing-arrow-navigation', 'info', message, widget.location, ['2.1.1', '4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    hasEscapeHandlerNearby(nodes, targetNode) {
        return nodes.some((node) => node.actionType === 'eventHandler' &&
            node.event === 'keydown' &&
            node.metadata?.keysHandled?.includes('Escape') &&
            Math.abs(node.location.line - targetNode.location.line) <= 10);
    }
    hasArrowHandlersNearby(nodes, targetNode) {
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        return nodes.some((node) => node.actionType === 'eventHandler' &&
            node.event === 'keydown' &&
            node.metadata?.keysHandled?.some((key) => arrowKeys.includes(key)) &&
            Math.abs(node.location.line - targetNode.location.line) <= 20);
    }
    generateArrowNavigationCode(role) {
        switch (role) {
            case 'listbox':
            case 'menu':
            case 'radiogroup':
                return `// Arrow key navigation for ${role}
element.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusNextItem();
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusPreviousItem();
      break;
    case 'Home':
      event.preventDefault();
      focusFirstItem();
      break;
    case 'End':
      event.preventDefault();
      focusLastItem();
      break;
  }
});`;
            case 'tablist':
                return `// Arrow key navigation for tablist
tablist.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowLeft':
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      focusAdjacentTab(direction);
      break;
    case 'Home':
      event.preventDefault();
      focusFirstTab();
      break;
    case 'End':
      event.preventDefault();
      focusLastTab();
      break;
  }
});`;
            case 'tree':
            case 'treegrid':
                return `// Arrow key navigation for ${role}
tree.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusNextNode();
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusPreviousNode();
      break;
    case 'ArrowRight':
      event.preventDefault();
      if (currentNode.isExpandable && !currentNode.isExpanded) {
        expandNode(currentNode);
      } else {
        focusFirstChild();
      }
      break;
    case 'ArrowLeft':
      event.preventDefault();
      if (currentNode.isExpanded) {
        collapseNode(currentNode);
      } else {
        focusParentNode();
      }
      break;
  }
});`;
            case 'grid':
                return `// Arrow key navigation for grid
grid.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      focusNextCell('horizontal');
      break;
    case 'ArrowLeft':
      event.preventDefault();
      focusPreviousCell('horizontal');
      break;
    case 'ArrowDown':
      event.preventDefault();
      focusNextCell('vertical');
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusPreviousCell('vertical');
      break;
    case 'Home':
      event.preventDefault();
      focusFirstCellInRow();
      break;
    case 'End':
      event.preventDefault();
      focusLastCellInRow();
      break;
  }
});`;
            default:
                return `// Arrow key navigation for ${role}
element.addEventListener('keydown', (event) => {
  // Implement arrow key navigation based on ARIA Authoring Practices
  // See: https://www.w3.org/WAI/ARIA/apg/patterns/${role}/
});`;
        }
    }
    detectArrowKeysWithoutARIAContext(nodes, context) {
        const issues = [];
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        for (const node of nodes) {
            if (node.actionType === 'eventHandler' &&
                node.event === 'keydown' &&
                node.metadata?.keysHandled?.some((key) => arrowKeys.includes(key))) {
                const hasARIAWidget = node.metadata?.role && this.arrowNavigationRoles.has(node.metadata.role);
                if (!hasARIAWidget) {
                    const detectedArrows = node.metadata.keysHandled.filter((key) => arrowKeys.includes(key));
                    const message = `Arrow key handler (${detectedArrows.join(', ')}) may conflict with screen reader navigation. Screen readers use arrow keys to navigate content in browse mode. Only use arrow keys within ARIA widgets (role="listbox", "menu", "tree", etc.) or when the element has focus.`;
                    const fix = {
                        description: 'Add ARIA widget role or check if element is focused',
                        code: `// Option 1: Add ARIA role if this is a widget
<div role="listbox" aria-label="Options">
  <!-- Arrow key navigation is expected here -->
</div>

// Option 2: Only handle when element is focused
element.addEventListener('keydown', (event) => {
  // Only handle if this element or its children have focus
  if (!element.contains(document.activeElement)) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    // Your navigation logic
  }
});`,
                        location: node.location,
                    };
                    issues.push(this.createIssue('screen-reader-arrow-conflict', 'warning', message, node.location, ['2.1.1'], context, { fix }));
                }
            }
        }
        return issues;
    }
    detectPreventDefaultOnNavKeys(nodes, context) {
        const issues = [];
        const navigationKeys = ['Space', ' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'];
        for (const node of nodes) {
            if (node.actionType === 'eventHandler' &&
                node.event === 'keydown' &&
                node.metadata?.callsPreventDefault === true &&
                node.metadata?.keysHandled?.some((key) => navigationKeys.includes(key))) {
                const hasARIAWidget = node.metadata?.role && (this.arrowNavigationRoles.has(node.metadata.role) ||
                    this.modalRoles.has(node.metadata.role));
                if (!hasARIAWidget) {
                    const preventedKeys = node.metadata.keysHandled.filter((key) => navigationKeys.includes(key));
                    const message = `preventDefault() called on navigation keys (${preventedKeys.join(', ')}). Preventing default on Space, Enter, or Arrow keys can trap keyboard users by breaking expected browser navigation. Only prevent default within ARIA widgets or when providing equivalent functionality.`;
                    const fix = {
                        description: 'Only preventDefault within ARIA widgets',
                        code: `// Only preventDefault when appropriate
element.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    // Check if this is an ARIA widget
    const role = element.getAttribute('role');
    if (role === 'listbox' || role === 'menu' || role === 'tree') {
      event.preventDefault(); // OK: Standard widget behavior
      // Custom navigation
    }
    // Otherwise, let browser handle it (scrolling, etc.)
  }
});`,
                        location: node.location,
                    };
                    issues.push(this.createIssue('prevent-default-nav-keys', 'warning', message, node.location, ['2.1.1', '2.1.2'], context, { fix }));
                }
            }
        }
        return issues;
    }
    detectUndocumentedShortcuts(nodes, context) {
        const issues = [];
        const shortcutHandlers = nodes.filter((node) => node.actionType === 'eventHandler' &&
            node.event === 'keydown' &&
            node.metadata?.requiresModifier === true &&
            node.metadata?.keysHandled);
        if (shortcutHandlers.length === 0)
            return issues;
        const hasDocumentation = nodes.some((node) => node.metadata?.ariaLabel?.toLowerCase().includes('shortcut') ||
            node.metadata?.ariaLabel?.toLowerCase().includes('keyboard') ||
            node.metadata?.ariaDescription?.toLowerCase().includes('shortcut'));
        if (!hasDocumentation) {
            const message = `Keyboard shortcuts detected (Ctrl/Alt/Meta + keys) but may not be documented. Users need to discover available shortcuts through aria-label, aria-description, help dialog, or visible instructions.`;
            const fix = {
                description: 'Document keyboard shortcuts for users',
                code: `// Option 1: Add aria-description to container
<div role="application"
     aria-label="Text editor"
     aria-description="Keyboard shortcuts: Ctrl+S to save, Ctrl+Z to undo">
  <!-- editor content -->
</div>

// Option 2: Provide help dialog
<button aria-label="Keyboard shortcuts" onclick="showShortcutsDialog()">
  ?
</button>

// Option 3: Visible instructions
<div class="shortcuts-hint">
  Press <kbd>Ctrl+S</kbd> to save, <kbd>Ctrl+Z</kbd> to undo
</div>`,
                location: shortcutHandlers[0].location,
            };
            issues.push(this.createIssue('keyboard-shortcuts-undocumented', 'info', message, shortcutHandlers[0].location, ['2.1.1'], context, { fix }));
        }
        return issues;
    }
}
exports.KeyboardNavigationAnalyzer = KeyboardNavigationAnalyzer;
