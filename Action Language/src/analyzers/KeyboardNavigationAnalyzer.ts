import { BaseAnalyzer, AnalyzerContext, Issue, IssueFix } from './BaseAnalyzer';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * KeyboardNavigationAnalyzer
 *
 * Detects 7 types of keyboard navigation issues:
 * 1. potential-keyboard-trap - Focus trapped without Escape handler
 * 2. screen-reader-conflict - Single-character shortcuts conflict with screen readers
 * 3. screen-reader-arrow-conflict - Arrow keys interfere with browse mode
 * 4. deprecated-keycode - Using event.keyCode instead of event.key
 * 5. tab-without-shift - Tab key without Shift consideration
 * 6. missing-escape-handler - Modal/dialog without Escape key
 * 7. missing-arrow-navigation - ARIA widget without arrow key handlers
 *
 * WCAG: 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap), 2.1.4 (Character Key Shortcuts), 4.1.2
 */
export class KeyboardNavigationAnalyzer extends BaseAnalyzer {
  readonly name = 'KeyboardNavigationAnalyzer';
  readonly description = 'Detects 7 types of keyboard navigation issues including keyboard traps, screen reader conflicts, and missing arrow navigation';
  // Screen reader navigation keys that should not be used as single-character shortcuts
  private readonly screenReaderKeys = new Set([
    'h', 'b', 'k', 't', 'l', 'f', 'g', 'd', 'e', 'r', 'i', 'm',
    'n', 'p', 'q', 's', 'x', 'c', 'v', 'z', 'o', 'a', 'u',
    '1', '2', '3', '4', '5', '6',
  ]);

  // ARIA roles that require arrow key navigation
  private readonly arrowNavigationRoles = new Set([
    'listbox',
    'menu',
    'menubar',
    'radiogroup',
    'tablist',
    'tree',
    'treegrid',
    'grid',
  ]);

  // Interactive ARIA roles that should be in modals/dialogs
  private readonly modalRoles = new Set(['dialog', 'alertdialog']);

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Document-scope analysis (preferred)
    if (context.documentModel && context.documentModel.javascript.length > 0) {
      for (const jsModel of context.documentModel.javascript) {
        issues.push(...this.analyzeKeyboardPatterns(jsModel.nodes, context));
      }
    }
    // File-scope fallback
    else if (context.actionLanguageModel) {
      issues.push(
        ...this.analyzeKeyboardPatterns(context.actionLanguageModel.nodes, context)
      );
    }

    return issues;
  }

  private analyzeKeyboardPatterns(
    nodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Detect keyboard traps
    issues.push(...this.detectKeyboardTrap(nodes, context));

    // Detect screen reader conflicts
    issues.push(...this.detectScreenReaderConflict(nodes, context));

    // Detect deprecated keyCode usage
    issues.push(...this.detectDeprecatedKeyCode(nodes, context));

    // Detect Tab without Shift consideration
    issues.push(...this.detectTabWithoutShift(nodes, context));

    // Detect missing Escape handlers in modals
    issues.push(...this.detectMissingEscapeHandler(nodes, context));

    // Detect missing arrow navigation in ARIA widgets
    issues.push(...this.detectMissingArrowNavigation(nodes, context));

    return issues;
  }

  /**
   * Detect potential keyboard traps.
   *
   * Pattern: Tab key preventDefault without Escape handler
   * Problem: Users can't exit focus trap with keyboard
   * WCAG: 2.1.2 (No Keyboard Trap)
   */
  private detectKeyboardTrap(
    nodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Find Tab key handlers that call preventDefault
    const tabHandlers = nodes.filter(
      (node) =>
        node.actionType === 'eventHandler' &&
        node.event === 'keydown' &&
        node.metadata?.keysHandled?.includes('Tab') &&
        node.metadata?.callsPreventDefault === true
    );

    for (const tabHandler of tabHandlers) {
      // Check if there's an Escape handler nearby
      const hasEscapeHandler = this.hasEscapeHandlerNearby(nodes, tabHandler);

      if (!hasEscapeHandler) {
        const message = `Potential keyboard trap detected. Tab key is intercepted with preventDefault, but no Escape key handler found. Users may become trapped and unable to navigate away. Add an Escape handler or allow Tab to work normally.`;

        const fix: IssueFix = {
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

        issues.push(
          this.createIssue(
            'potential-keyboard-trap',
            'warning',
            message,
            tabHandler.location,
            ['2.1.2'],
            context,
            { fix }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Detect single-character keyboard shortcuts that conflict with screen readers.
   *
   * Pattern: Single letter key handler (e.g., 'h', 'k', 'b')
   * Problem: Conflicts with screen reader navigation keys
   * WCAG: 2.1.4 (Character Key Shortcuts)
   */
  private detectScreenReaderConflict(
    nodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    for (const node of nodes) {
      if (
        node.actionType === 'eventHandler' &&
        node.event === 'keydown' &&
        node.metadata?.keysHandled
      ) {
        for (const key of node.metadata.keysHandled) {
          // Check if it's a single character that conflicts with screen readers
          if (
            key.length === 1 &&
            this.screenReaderKeys.has(key.toLowerCase()) &&
            !node.metadata?.requiresModifier // No Ctrl/Alt/Shift required
          ) {
            const message = `Single-character shortcut "${key}" conflicts with screen reader navigation. Keys like h, k, b, t are used by screen readers to navigate by headings, links, buttons, etc. Use modifier keys (Ctrl, Alt, or Shift) or allow users to remap shortcuts.`;

            const fix: IssueFix = {
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

            issues.push(
              this.createIssue(
                'screen-reader-conflict',
                'warning',
                message,
                node.location,
                ['2.1.4'],
                context,
                { fix }
              )
            );
          }
        }
      }
    }

    return issues;
  }

  /**
   * Detect deprecated keyCode usage.
   *
   * Pattern: event.keyCode or event.which
   * Problem: Deprecated, should use event.key
   * WCAG: 4.1.2 (future-proofing)
   */
  private detectDeprecatedKeyCode(
    nodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    for (const node of nodes) {
      if (
        node.actionType === 'eventHandler' &&
        (node.event === 'keydown' || node.event === 'keyup' || node.event === 'keypress') &&
        (node.metadata?.usesKeyCode === true || node.metadata?.usesWhich === true)
      ) {
        const property = node.metadata?.usesKeyCode ? 'keyCode' : 'which';
        const message = `Using deprecated event.${property}. This property is deprecated and may not work in future browsers. Use event.key instead for better compatibility and readability.`;

        const fix: IssueFix = {
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

        issues.push(
          this.createIssue(
            'deprecated-keycode',
            'info',
            message,
            node.location,
            ['4.1.2'],
            context,
            { fix }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Detect Tab key handling without Shift consideration.
   *
   * Pattern: if (event.key === 'Tab') without checking event.shiftKey
   * Problem: May miss backward navigation (Shift+Tab)
   */
  private detectTabWithoutShift(
    nodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    for (const node of nodes) {
      if (
        node.actionType === 'eventHandler' &&
        node.event === 'keydown' &&
        node.metadata?.keysHandled?.includes('Tab') &&
        node.metadata?.checksShiftKey !== true
      ) {
        const message = `Tab key handling doesn't check for Shift modifier. Users expect Shift+Tab to navigate backward. Consider handling both Tab (forward) and Shift+Tab (backward) navigation.`;

        const fix: IssueFix = {
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

        issues.push(
          this.createIssue(
            'tab-without-shift',
            'info',
            message,
            node.location,
            ['2.1.1'],
            context,
            { fix }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Detect modals/dialogs without Escape key handlers.
   *
   * Pattern: Modal/dialog role without Escape handler
   * Problem: Users expect Escape to close modals
   * WCAG: 2.1.1 (Keyboard)
   */
  private detectMissingEscapeHandler(
    nodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Look for modal/dialog indicators in DOM manipulations or roles
    const modalPatterns = nodes.filter((node) => {
      const selector = node.element.selector?.toLowerCase() || '';
      const binding = node.element.binding?.toLowerCase() || '';
      const role = node.metadata?.role;

      return (
        this.modalRoles.has(role) ||
        selector.includes('modal') ||
        selector.includes('dialog') ||
        binding.includes('modal') ||
        binding.includes('dialog')
      );
    });

    for (const modalNode of modalPatterns) {
      // Check if there's an Escape handler for this modal
      const hasEscapeHandler = this.hasEscapeHandlerNearby(nodes, modalNode);

      if (!hasEscapeHandler) {
        const message = `Modal or dialog without Escape key handler. Users expect to be able to press Escape to close modals. Add a keydown handler that listens for the Escape key.`;

        const fix: IssueFix = {
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

        issues.push(
          this.createIssue(
            'missing-escape-handler',
            'warning',
            message,
            modalNode.location,
            ['2.1.1'],
            context,
            { fix }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Detect ARIA widgets without arrow key navigation.
   *
   * Pattern: Element with ARIA role requiring arrow keys, but no arrow handlers
   * Problem: Screen reader users expect arrow keys to work in these widgets
   * WCAG: 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)
   */
  private detectMissingArrowNavigation(
    nodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Look for ARIA roles that require arrow navigation
    const ariaWidgets = nodes.filter(
      (node) =>
        node.metadata?.role && this.arrowNavigationRoles.has(node.metadata.role)
    );

    for (const widget of ariaWidgets) {
      // Check if there are arrow key handlers for this widget
      const hasArrowHandlers = this.hasArrowHandlersNearby(nodes, widget);

      if (!hasArrowHandlers) {
        const role = widget.metadata?.role || 'unknown';
        const message = `ARIA widget with role="${role}" is missing arrow key navigation. According to ARIA Authoring Practices, ${role} widgets require arrow keys for keyboard navigation. Add arrow key handlers to allow proper keyboard interaction.`;

        const fix: IssueFix = {
          description: `Add arrow key navigation for ${role}`,
          code: this.generateArrowNavigationCode(role),
          location: widget.location,
        };

        issues.push(
          this.createIssue(
            'missing-arrow-navigation',
            'info',
            message,
            widget.location,
            ['2.1.1', '4.1.2'],
            context,
            { fix }
          )
        );
      }
    }

    return issues;
  }

  // Helper methods

  private hasEscapeHandlerNearby(
    nodes: ActionLanguageNode[],
    targetNode: ActionLanguageNode
  ): boolean {
    // Look for Escape key handler within 10 lines
    return nodes.some(
      (node) =>
        node.actionType === 'eventHandler' &&
        node.event === 'keydown' &&
        node.metadata?.keysHandled?.includes('Escape') &&
        Math.abs(node.location.line - targetNode.location.line) <= 10
    );
  }

  private hasArrowHandlersNearby(
    nodes: ActionLanguageNode[],
    targetNode: ActionLanguageNode
  ): boolean {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    return nodes.some(
      (node) =>
        node.actionType === 'eventHandler' &&
        node.event === 'keydown' &&
        node.metadata?.keysHandled?.some((key: string) => arrowKeys.includes(key)) &&
        Math.abs(node.location.line - targetNode.location.line) <= 20
    );
  }

  private generateArrowNavigationCode(role: string): string {
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
}
