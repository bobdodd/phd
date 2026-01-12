/**
 * KeyboardAnalyzer - Analyzes keyboard navigation patterns in ActionLanguage trees
 *
 * This analyzer detects:
 * - Keyboard event handlers (keydown, keyup, keypress)
 * - Key-specific handling (Tab, Enter, Space, Arrows, Escape, etc.)
 * - Keyboard navigation patterns (arrow navigation, type-ahead)
 * - Keyboard traps (intentional and accidental)
 * - Mouse-only interactions (click without keyboard equivalent)
 * - Screen reader keyboard conflicts (single-letter keys, quick navigation)
 * - WCAG keyboard accessibility issues
 */

class KeyboardAnalyzer {
  /**
   * Create a new KeyboardAnalyzer
   * @param {Object} [options] - Analyzer options
   */
  constructor(options = {}) {
    this.options = {
      detectTraps: options.detectTraps ?? true,
      detectMouseOnly: options.detectMouseOnly ?? true,
      detectPatterns: options.detectPatterns ?? true,
      detectScreenReaderConflicts: options.detectScreenReaderConflicts ?? true
    };

    // Keyboard handler registry
    this.keyboardHandlers = [];
    this.keyChecks = [];
    this.preventDefaultCalls = [];
    this.modifierChecks = []; // Track modifier key checks (ctrlKey, altKey, etc.)

    // Mouse handlers for comparison
    this.mouseHandlers = [];

    // Pattern analysis
    this.navigationPatterns = [];
    this.trapPatterns = [];
    this.keyboardShortcuts = [];
    this.screenReaderConflicts = [];

    // Issues
    this.issues = [];

    // Statistics
    this.stats = {
      totalKeyboardHandlers: 0,
      totalMouseHandlers: 0,
      keyboardOnlyElements: 0,
      mouseOnlyElements: 0,
      screenReaderConflicts: 0,
      byKey: {},
      byElement: {},
      byEventType: {}
    };

    // Key categories for analysis
    this.navigationKeys = new Set([
      'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Home', 'End', 'PageUp', 'PageDown'
    ]);

    this.activationKeys = new Set(['Enter', 'Space', ' ']);

    this.dismissKeys = new Set(['Escape', 'Esc']);

    this.modifierKeys = new Set(['Control', 'Alt', 'Shift', 'Meta']);

    // Interactive elements that need keyboard support
    this.interactiveElements = new Set([
      'button', 'a', 'input', 'select', 'textarea', 'details', 'summary'
    ]);

    // Screen reader quick navigation keys (used in browse/virtual cursor mode)
    // These single-letter keys are used in browse mode by:
    // - NVDA (Windows): Most comprehensive single-letter navigation
    // - JAWS (Windows): Similar to NVDA with some unique keys
    // - VoiceOver (macOS): Quick Nav mode (VO+Q to toggle)
    // - TalkBack (Android): Uses Alt+key combinations when keyboard connected
    //   (TalkBack Alt shortcuts are less likely to conflict with web apps)
    //
    // Key: [letter, 'element type navigated to']
    // Shift+letter navigates to previous element of that type
    this.screenReaderQuickNavKeys = new Map([
      // === Headings (NVDA, JAWS, VoiceOver) ===
      ['h', 'heading'],
      ['H', 'heading (previous)'],
      ['1', 'heading level 1'],
      ['2', 'heading level 2'],
      ['3', 'heading level 3'],
      ['4', 'heading level 4'],
      ['5', 'heading level 5'],
      ['6', 'heading level 6'],

      // === Interactive elements (NVDA, JAWS, VoiceOver) ===
      ['b', 'button'],
      ['B', 'button (previous)'],
      ['k', 'link'],               // NVDA, VoiceOver
      ['K', 'link (previous)'],
      ['u', 'unvisited link'],     // NVDA, JAWS
      ['U', 'unvisited link (previous)'],
      ['v', 'visited link'],       // NVDA, JAWS
      ['V', 'visited link (previous)'],
      ['a', 'anchor/link'],        // JAWS
      ['A', 'anchor/link (previous)'],
      ['y', 'clickable element'],  // JAWS
      ['Y', 'clickable element (previous)'],

      // === Form controls (NVDA, JAWS, VoiceOver) ===
      ['f', 'form field'],
      ['F', 'form field (previous)'],
      ['e', 'edit field'],
      ['E', 'edit field (previous)'],
      ['x', 'checkbox'],
      ['X', 'checkbox (previous)'],
      ['r', 'radio button'],
      ['R', 'radio button (previous)'],
      ['c', 'combobox'],
      ['C', 'combobox (previous)'],

      // === Structural elements (NVDA, JAWS) ===
      ['d', 'landmark'],
      ['D', 'landmark (previous)'],
      ['z', 'landmark'],           // Alternative landmark key
      ['Z', 'landmark (previous)'],
      ['t', 'table'],
      ['T', 'table (previous)'],
      ['l', 'list'],
      ['L', 'list (previous)'],
      ['i', 'list item'],
      ['I', 'list item (previous)'],
      ['p', 'paragraph'],          // JAWS
      ['P', 'paragraph (previous)'],

      // === Other elements (NVDA, JAWS) ===
      ['g', 'graphic/image'],
      ['G', 'graphic/image (previous)'],
      ['m', 'frame'],
      ['M', 'frame (previous)'],
      ['n', 'non-link text'],
      ['N', 'non-link text (previous)'],
      ['o', 'embedded object'],
      ['O', 'embedded object (previous)'],
      ['q', 'blockquote'],
      ['Q', 'blockquote (previous)'],
      ['s', 'separator'],
      ['S', 'separator (previous)'],
      ['w', 'ARIA widget'],        // NVDA
      ['W', 'ARIA widget (previous)']
    ]);

    // Arrow keys are used for reading in browse mode (all screen readers)
    // Custom arrow key handling may interfere with:
    // - NVDA/JAWS: Virtual cursor navigation
    // - VoiceOver: Quick Nav arrow navigation
    // - TalkBack: Explore by touch linear navigation
    this.screenReaderReadingKeys = new Set([
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Up', 'Down', 'Left', 'Right'
    ]);
  }

  /**
   * Analyze an ActionTree for keyboard navigation patterns
   * @param {ActionTree} tree - The ActionTree to analyze
   * @returns {Object} Analysis results
   */
  analyze(tree) {
    this.reset();

    if (!tree || !tree.root) {
      return this.getResults();
    }

    // First pass: collect all keyboard and mouse handlers
    this.traverseAction(tree.root, { depth: 0 });

    // Second pass: analyze patterns
    if (this.options.detectPatterns) {
      this.analyzePatterns();
    }

    // Compute statistics
    this.computeStats();

    // Detect issues
    this.detectIssues();

    return this.getResults();
  }

  /**
   * Reset analyzer state
   */
  reset() {
    this.keyboardHandlers = [];
    this.keyChecks = [];
    this.preventDefaultCalls = [];
    this.modifierChecks = [];
    this.mouseHandlers = [];
    this.navigationPatterns = [];
    this.trapPatterns = [];
    this.keyboardShortcuts = [];
    this.screenReaderConflicts = [];
    this.issues = [];
    this.stats = {
      totalKeyboardHandlers: 0,
      totalMouseHandlers: 0,
      keyboardOnlyElements: 0,
      mouseOnlyElements: 0,
      screenReaderConflicts: 0,
      byKey: {},
      byElement: {},
      byEventType: {}
    };
  }

  /**
   * Traverse an action and its children
   * @param {Action} action - The action to traverse
   * @param {Object} context - Current context
   */
  traverseAction(action, context = {}) {
    // Check for keyboard-related patterns
    this.checkForKeyboardHandler(action, context);
    this.checkForMouseHandler(action, context);
    this.checkForKeyCheck(action, context);
    this.checkForPreventDefault(action, context);
    this.checkForModifierCheck(action, context);

    // Update context for children
    const newContext = {
      ...context,
      depth: context.depth + 1,
      parent: action,
      inKeyboardHandler: context.inKeyboardHandler || this.isKeyboardHandler(action),
      inMouseHandler: context.inMouseHandler || this.isMouseHandler(action),
      currentHandler: this.isKeyboardHandler(action) ? action : context.currentHandler
    };

    // Traverse children
    for (const child of action.children) {
      this.traverseAction(child, newContext);
    }
  }

  /**
   * Check if action is a keyboard event handler
   */
  isKeyboardHandler(action) {
    if (action.getAttribute('pattern') === 'eventHandler') {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args[0]?.actionType === 'literal') {
        const eventType = args[0].getAttribute('value');
        return ['keydown', 'keyup', 'keypress'].includes(eventType);
      }
    }
    return false;
  }

  /**
   * Check if action is a mouse event handler
   */
  isMouseHandler(action) {
    if (action.getAttribute('pattern') === 'eventHandler') {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args[0]?.actionType === 'literal') {
        const eventType = args[0].getAttribute('value');
        return ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'].includes(eventType);
      }
    }
    return false;
  }

  /**
   * Check for keyboard event handlers
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForKeyboardHandler(action, context) {
    if (action.getAttribute('pattern') !== 'eventHandler') return;

    const args = action.children.filter(c => c.getAttribute('role') === 'argument');
    if (args.length < 1) return;

    const eventType = args[0]?.getAttribute('value');
    if (!['keydown', 'keyup', 'keypress'].includes(eventType)) return;

    // Get element reference
    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const elementRef = this.getElementReference(calleeChild);

    this.keyboardHandlers.push({
      type: 'addEventListener',
      eventType: eventType,
      elementRef: elementRef,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id,
      handlerActionId: action.id
    });
  }

  /**
   * Check for mouse event handlers
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForMouseHandler(action, context) {
    if (action.getAttribute('pattern') !== 'eventHandler') return;

    const args = action.children.filter(c => c.getAttribute('role') === 'argument');
    if (args.length < 1) return;

    const eventType = args[0]?.getAttribute('value');
    const mouseEvents = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'contextmenu'];
    if (!mouseEvents.includes(eventType)) return;

    // Get element reference
    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const elementRef = this.getElementReference(calleeChild);

    this.mouseHandlers.push({
      type: 'addEventListener',
      eventType: eventType,
      elementRef: elementRef,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id
    });
  }

  /**
   * Check for key property checks (e.key, e.keyCode, e.which)
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForKeyCheck(action, context) {
    // Only check from binary operations to avoid duplicates
    if ((action.actionType === 'binaryOp' || action.actionType === 'binary') && context.inKeyboardHandler) {
      const operator = action.getAttribute('operator');
      if (['===', '==', '!==', '!='].includes(operator)) {
        const leftChild = action.children.find(c => c.getAttribute('role') === 'left');
        const rightChild = action.children.find(c => c.getAttribute('role') === 'right');

        // Check if left is a key property access
        if (leftChild?.actionType === 'memberAccess') {
          const property = leftChild.getAttribute('property');
          if (['key', 'keyCode', 'which', 'code'].includes(property)) {
            const keyValue = rightChild?.getAttribute('value');
            if (keyValue !== undefined) {
              // Avoid duplicates
              const exists = this.keyChecks.some(k =>
                k.key === keyValue && k.actionId === action.id
              );
              if (!exists) {
                this.keyChecks.push({
                  property: property,
                  key: keyValue,
                  operator: operator,
                  isNegated: operator === '!==' || operator === '!=',
                  inKeyboardHandler: true,
                  location: {
                    line: action.getAttribute('line'),
                    column: action.getAttribute('column')
                  },
                  actionId: action.id
                });
              }
            }
          }
        }
      }
    }

    // Check for switch statement cases
    if (action.actionType === 'case' && context.inKeyboardHandler) {
      // The case value is the first child with role 'test'
      const testChild = action.children.find(c => c.getAttribute('role') === 'test');
      if (testChild?.actionType === 'literal') {
        const keyValue = testChild.getAttribute('value');
        if (keyValue !== undefined) {
          // Check if this case is testing a key value (heuristic: single character or known key name)
          const isLikelyKey = this.isLikelyKeyValue(keyValue);
          if (isLikelyKey) {
            this.keyChecks.push({
              property: 'key', // Assume key property for switch cases
              key: keyValue,
              operator: '===',
              isNegated: false,
              inKeyboardHandler: true,
              location: {
                line: action.getAttribute('line'),
                column: action.getAttribute('column')
              },
              actionId: action.id
            });
          }
        }
      }
    }
  }

  /**
   * Check if a value looks like a key value
   */
  isLikelyKeyValue(value) {
    if (typeof value !== 'string') {
      // Check for numeric keyCodes
      return typeof value === 'number' && [
        8, 9, 13, 27, 32, 35, 36, 37, 38, 39, 40, 46 // Common keyCodes
      ].includes(value);
    }

    // Known key names
    const knownKeys = [
      'Tab', 'Enter', 'Escape', 'Esc', 'Space', ' ',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Up', 'Down', 'Left', 'Right',
      'Home', 'End', 'PageUp', 'PageDown',
      'Backspace', 'Delete', 'Insert'
    ];

    if (knownKeys.includes(value)) return true;

    // Single character (letter or number)
    if (value.length === 1) return true;

    // F-keys
    if (/^F\d+$/.test(value)) return true;

    return false;
  }

  /**
   * Extract key value from a comparison
   */
  extractKeyValue(binaryAction, keyAccessAction) {
    const children = binaryAction.children;
    for (const child of children) {
      if (child !== keyAccessAction && child.actionType === 'literal') {
        return child.getAttribute('value');
      }
      // Check right child specifically
      if (child.getAttribute('role') === 'right' && child.actionType === 'literal') {
        return child.getAttribute('value');
      }
    }
    return null;
  }

  /**
   * Check for preventDefault calls
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForPreventDefault(action, context) {
    if (action.actionType !== 'call') return;

    const callee = action.getAttribute('callee') || '';
    if (callee.endsWith('preventDefault') || callee === 'preventDefault') {
      this.preventDefaultCalls.push({
        inKeyboardHandler: context.inKeyboardHandler || false,
        inMouseHandler: context.inMouseHandler || false,
        location: {
          line: action.getAttribute('line'),
          column: action.getAttribute('column')
        },
        actionId: action.id
      });
    }
  }

  /**
   * Check for modifier key checks (ctrlKey, altKey, shiftKey, metaKey)
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForModifierCheck(action, context) {
    if (!context.inKeyboardHandler) return;

    // Check for memberAccess to modifier properties
    if (action.actionType === 'memberAccess') {
      const property = action.getAttribute('property');
      if (['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].includes(property)) {
        // Track the modifier check with its parent context
        this.modifierChecks.push({
          modifier: property,
          location: {
            line: action.getAttribute('line'),
            column: action.getAttribute('column')
          },
          actionId: action.id,
          // Track the parent to determine if this is in a conditional
          parentActionId: context.parent?.id
        });
      }
    }
  }

  /**
   * Get element reference from action
   */
  getElementReference(action) {
    if (!action) return 'unknown';

    if (action.actionType === 'identifier') {
      return action.getAttribute('name') || 'unknown';
    }

    if (action.actionType === 'memberAccess') {
      const objectChild = action.children.find(c => c.getAttribute('role') === 'object');
      return this.getElementReference(objectChild);
    }

    if (action.actionType === 'call') {
      const callee = action.getAttribute('callee');
      if (callee?.includes('getElementById')) {
        const args = action.children.filter(c => c.getAttribute('role') === 'argument');
        const id = args[0]?.getAttribute('value');
        return id ? `#${id}` : callee;
      }
      if (callee?.includes('querySelector')) {
        const args = action.children.filter(c => c.getAttribute('role') === 'argument');
        return args[0]?.getAttribute('value') || callee;
      }
      return callee || 'unknown';
    }

    return 'unknown';
  }

  /**
   * Analyze detected patterns
   */
  analyzePatterns() {
    this.detectNavigationPatterns();
    this.detectTrapPatterns();
    this.detectShortcutPatterns();
  }

  /**
   * Detect keyboard navigation patterns
   */
  detectNavigationPatterns() {
    // Arrow key navigation pattern
    const arrowKeys = this.keyChecks.filter(k =>
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Up', 'Down', 'Left', 'Right'].includes(k.key) ||
      [38, 40, 37, 39].includes(k.key) // keyCode values
    );

    if (arrowKeys.length > 0) {
      const hasVertical = arrowKeys.some(k =>
        ['ArrowUp', 'ArrowDown', 'Up', 'Down'].includes(k.key) || [38, 40].includes(k.key)
      );
      const hasHorizontal = arrowKeys.some(k =>
        ['ArrowLeft', 'ArrowRight', 'Left', 'Right'].includes(k.key) || [37, 39].includes(k.key)
      );

      this.navigationPatterns.push({
        type: 'arrow-navigation',
        description: 'Arrow key navigation detected',
        directions: {
          vertical: hasVertical,
          horizontal: hasHorizontal,
          bidirectional: hasVertical && hasHorizontal
        },
        keyCount: arrowKeys.length
      });
    }

    // Tab navigation handling
    const tabKeys = this.keyChecks.filter(k =>
      k.key === 'Tab' || k.key === 9
    );

    if (tabKeys.length > 0) {
      this.navigationPatterns.push({
        type: 'tab-handling',
        description: 'Tab key handling detected',
        count: tabKeys.length,
        hasPreventDefault: this.preventDefaultCalls.some(p => p.inKeyboardHandler)
      });
    }

    // Home/End navigation
    const homeEndKeys = this.keyChecks.filter(k =>
      ['Home', 'End'].includes(k.key) || [36, 35].includes(k.key)
    );

    if (homeEndKeys.length > 0) {
      this.navigationPatterns.push({
        type: 'home-end-navigation',
        description: 'Home/End key navigation detected',
        count: homeEndKeys.length
      });
    }

    // Enter/Space activation
    const activationKeys = this.keyChecks.filter(k =>
      ['Enter', 'Space', ' '].includes(k.key) || [13, 32].includes(k.key)
    );

    if (activationKeys.length > 0) {
      this.navigationPatterns.push({
        type: 'activation-keys',
        description: 'Enter/Space activation handling detected',
        hasEnter: activationKeys.some(k => k.key === 'Enter' || k.key === 13),
        hasSpace: activationKeys.some(k => ['Space', ' '].includes(k.key) || k.key === 32)
      });
    }

    // Escape dismissal
    const escapeKeys = this.keyChecks.filter(k =>
      ['Escape', 'Esc'].includes(k.key) || k.key === 27
    );

    if (escapeKeys.length > 0) {
      this.navigationPatterns.push({
        type: 'escape-dismissal',
        description: 'Escape key handling detected',
        count: escapeKeys.length
      });
    }
  }

  /**
   * Detect potential keyboard trap patterns
   */
  detectTrapPatterns() {
    if (!this.options.detectTraps) return;

    // Check for Tab handling with preventDefault (potential trap)
    const tabHandling = this.keyChecks.filter(k =>
      k.key === 'Tab' || k.key === 9
    );

    const hasPreventDefault = this.preventDefaultCalls.some(p => p.inKeyboardHandler);

    if (tabHandling.length > 0 && hasPreventDefault) {
      // Check if Escape is also handled (indicates intentional trap like dialog)
      const hasEscape = this.keyChecks.some(k =>
        ['Escape', 'Esc'].includes(k.key) || k.key === 27
      );

      this.trapPatterns.push({
        type: hasEscape ? 'intentional-trap' : 'potential-trap',
        description: hasEscape
          ? 'Focus trap with Escape handling (likely intentional, e.g., dialog)'
          : 'Tab handling with preventDefault - potential keyboard trap',
        hasEscapeHandler: hasEscape,
        severity: hasEscape ? 'info' : 'warning'
      });
    }

    // Check for focus handler that calls focus (focus redirect)
    // This would need FocusAnalyzer integration
  }

  /**
   * Detect keyboard shortcut patterns
   */
  detectShortcutPatterns() {
    // Look for modifier key combinations
    const modifierChecks = this.keyChecks.filter(k =>
      k.property === 'ctrlKey' || k.property === 'altKey' ||
      k.property === 'shiftKey' || k.property === 'metaKey'
    );

    // This is a simplified detection - full detection would require
    // analyzing combinations of checks
    if (modifierChecks.length > 0) {
      this.keyboardShortcuts.push({
        type: 'modifier-combination',
        description: 'Keyboard shortcut with modifier key detected',
        modifiers: [...new Set(modifierChecks.map(k => k.property))]
      });
    }

    // Check for letter/number key checks (potential shortcuts)
    const letterKeys = this.keyChecks.filter(k =>
      typeof k.key === 'string' && k.key.length === 1 && /[a-zA-Z0-9]/.test(k.key)
    );

    if (letterKeys.length > 0) {
      this.keyboardShortcuts.push({
        type: 'letter-keys',
        description: 'Letter/number key handling detected (possible shortcuts or type-ahead)',
        keys: [...new Set(letterKeys.map(k => k.key))]
      });
    }
  }

  /**
   * Detect accessibility issues
   */
  detectIssues() {
    // Issue: Mouse handler without keyboard equivalent
    if (this.options.detectMouseOnly) {
      const mouseElements = new Set(this.mouseHandlers.map(h => h.elementRef));
      const keyboardElements = new Set(this.keyboardHandlers.map(h => h.elementRef));

      for (const element of mouseElements) {
        if (!keyboardElements.has(element) && element !== 'document' && element !== 'window') {
          // Check if it's a click handler (most important for accessibility)
          const hasClick = this.mouseHandlers.some(h =>
            h.elementRef === element && h.eventType === 'click'
          );

          if (hasClick) {
            this.issues.push({
              type: 'mouse-only-click',
              severity: 'warning',
              message: `Element "${element}" has click handler but no keyboard handler`,
              elementRef: element,
              suggestion: 'Add keydown handler for Enter/Space to ensure keyboard accessibility'
            });
          }
        }
      }
    }

    // Issue: Potential keyboard trap without escape
    for (const trap of this.trapPatterns) {
      if (trap.type === 'potential-trap') {
        this.issues.push({
          type: 'potential-keyboard-trap',
          severity: 'warning',
          message: 'Tab key handling with preventDefault detected without Escape handler',
          suggestion: 'Ensure users can exit the component using Escape key or other means'
        });
      }
    }

    // Issue: Using deprecated keyCode instead of key
    const keyCodeChecks = this.keyChecks.filter(k => k.property === 'keyCode' || k.property === 'which');
    if (keyCodeChecks.length > 0) {
      this.issues.push({
        type: 'deprecated-keycode',
        severity: 'info',
        message: `Using deprecated ${keyCodeChecks[0].property} property (${keyCodeChecks.length} occurrences)`,
        suggestion: 'Consider using event.key instead for better readability and compatibility'
      });
    }

    // Issue: Tab handling without Shift+Tab consideration
    const tabChecks = this.keyChecks.filter(k => k.key === 'Tab' || k.key === 9);
    if (tabChecks.length > 0) {
      const hasShiftCheck = this.keyChecks.some(k =>
        k.property === 'shiftKey' || k.key === 'shiftKey'
      );

      // Look for shiftKey in binary operations
      // This is a simplified check
      if (!hasShiftCheck && tabChecks.length === 1) {
        this.issues.push({
          type: 'tab-without-shift',
          severity: 'info',
          message: 'Tab key handling detected - ensure Shift+Tab is also handled for reverse navigation',
          suggestion: 'Check event.shiftKey to handle both forward and backward tab navigation'
        });
      }
    }

    // Issue: Keyboard handlers without visible focus indication
    // This would require CSS analysis which is beyond our scope

    // Issue: Arrow navigation without wrap-around
    // This would require more complex pattern analysis

    // Issue: Screen reader keyboard conflicts
    if (this.options.detectScreenReaderConflicts) {
      this.detectScreenReaderConflicts();
    }
  }

  /**
   * Detect keyboard shortcuts that conflict with screen reader quick navigation keys
   */
  detectScreenReaderConflicts() {
    // Find single-letter/number key handlers without modifier key requirements
    for (const keyCheck of this.keyChecks) {
      const keyValue = String(keyCheck.key);

      // Check if this is a single character key
      if (keyValue.length !== 1) continue;

      // Check if this is a screen reader quick nav key
      const navFunction = this.screenReaderQuickNavKeys.get(keyValue);
      if (!navFunction) continue;

      // Check if there's an associated modifier key check
      // We need to determine if this key check requires a modifier
      const hasModifierRequirement = this.hasAssociatedModifierCheck(keyCheck);

      if (!hasModifierRequirement) {
        this.screenReaderConflicts.push({
          key: keyValue,
          screenReaderFunction: navFunction,
          location: keyCheck.location,
          actionId: keyCheck.actionId,
          severity: 'warning'
        });

        this.issues.push({
          type: 'screen-reader-conflict',
          severity: 'warning',
          message: `Single-letter key "${keyValue}" without modifier conflicts with screen reader quick navigation (${navFunction})`,
          key: keyValue,
          screenReaderFunction: navFunction,
          suggestion: 'Require a modifier key (Ctrl, Alt, Meta) or only activate in application mode (role="application")'
        });
      }
    }

    // Check for number keys (1-6 conflict with heading level navigation)
    for (const keyCheck of this.keyChecks) {
      const keyValue = String(keyCheck.key);

      if (/^[1-6]$/.test(keyValue)) {
        const navFunction = this.screenReaderQuickNavKeys.get(keyValue);
        const hasModifierRequirement = this.hasAssociatedModifierCheck(keyCheck);

        if (!hasModifierRequirement && navFunction) {
          // Check if not already added
          const alreadyAdded = this.screenReaderConflicts.some(
            c => c.key === keyValue && c.actionId === keyCheck.actionId
          );

          if (!alreadyAdded) {
            this.screenReaderConflicts.push({
              key: keyValue,
              screenReaderFunction: navFunction,
              location: keyCheck.location,
              actionId: keyCheck.actionId,
              severity: 'warning'
            });

            this.issues.push({
              type: 'screen-reader-conflict',
              severity: 'warning',
              message: `Number key "${keyValue}" without modifier conflicts with screen reader heading navigation (${navFunction})`,
              key: keyValue,
              screenReaderFunction: navFunction,
              suggestion: 'Require a modifier key (Ctrl, Alt, Meta) for shortcuts using number keys'
            });
          }
        }
      }
    }

    // Check for arrow keys used in custom navigation (potential browse mode conflict)
    const arrowKeyChecks = this.keyChecks.filter(k =>
      this.screenReaderReadingKeys.has(String(k.key))
    );

    if (arrowKeyChecks.length > 0) {
      // Arrow keys in browse mode are used for reading - custom handling may interfere
      // This is informational, as arrow keys are commonly customized in widgets
      const hasRoleApplication = false; // Would need to check ARIA attributes

      if (!hasRoleApplication) {
        this.issues.push({
          type: 'screen-reader-arrow-conflict',
          severity: 'info',
          message: `Arrow key handling detected - may interfere with screen reader browse mode navigation`,
          keys: [...new Set(arrowKeyChecks.map(k => k.key))],
          suggestion: 'Ensure the component uses role="application" or is in a form control for custom arrow key behavior'
        });
      }
    }

    // Update stats
    this.stats.screenReaderConflicts = this.screenReaderConflicts.length;
  }

  /**
   * Check if a key check has an associated modifier key requirement
   * @param {Object} keyCheck - The key check to analyze
   * @returns {boolean}
   */
  hasAssociatedModifierCheck(keyCheck) {
    // Look for modifier checks near this key check
    // A modifier check that shares a nearby context indicates the key requires a modifier

    // Check if there are any modifier checks in the same keyboard handler
    if (this.modifierChecks.length === 0) return false;

    // Simple heuristic: if there are any ctrlKey, altKey, or metaKey checks
    // in the same handler, assume modifier combinations are being used
    // (shiftKey alone is not sufficient as it's used for Shift+letter)
    const meaningfulModifiers = this.modifierChecks.filter(m =>
      m.modifier === 'ctrlKey' || m.modifier === 'altKey' || m.modifier === 'metaKey'
    );

    return meaningfulModifiers.length > 0;
  }

  /**
   * Compute statistics
   */
  computeStats() {
    this.stats.totalKeyboardHandlers = this.keyboardHandlers.length;
    this.stats.totalMouseHandlers = this.mouseHandlers.length;

    // By key
    for (const check of this.keyChecks) {
      const key = String(check.key);
      this.stats.byKey[key] = (this.stats.byKey[key] || 0) + 1;
    }

    // By element
    for (const handler of [...this.keyboardHandlers, ...this.mouseHandlers]) {
      const el = handler.elementRef;
      this.stats.byElement[el] = (this.stats.byElement[el] || 0) + 1;
    }

    // By event type
    for (const handler of this.keyboardHandlers) {
      const type = handler.eventType;
      this.stats.byEventType[type] = (this.stats.byEventType[type] || 0) + 1;
    }

    // Mouse-only vs keyboard elements
    const mouseElements = new Set(this.mouseHandlers.map(h => h.elementRef));
    const keyboardElements = new Set(this.keyboardHandlers.map(h => h.elementRef));

    this.stats.mouseOnlyElements = [...mouseElements].filter(e =>
      !keyboardElements.has(e) && e !== 'document' && e !== 'window'
    ).length;

    this.stats.keyboardOnlyElements = [...keyboardElements].filter(e =>
      !mouseElements.has(e) && e !== 'document' && e !== 'window'
    ).length;
  }

  /**
   * Get analysis results
   * @returns {Object}
   */
  getResults() {
    return {
      keyboardHandlers: this.keyboardHandlers,
      mouseHandlers: this.mouseHandlers,
      keyChecks: this.keyChecks,
      preventDefaultCalls: this.preventDefaultCalls,
      modifierChecks: this.modifierChecks,
      navigationPatterns: this.navigationPatterns,
      trapPatterns: this.trapPatterns,
      keyboardShortcuts: this.keyboardShortcuts,
      screenReaderConflicts: this.screenReaderConflicts,
      issues: this.issues,
      stats: this.stats,

      // Convenience methods
      hasKeyboardHandlers: () => this.keyboardHandlers.length > 0,

      hasMouseHandlers: () => this.mouseHandlers.length > 0,

      getHandlersByElement: (ref) =>
        this.keyboardHandlers.filter(h => h.elementRef === ref),

      getKeyChecks: (key) =>
        this.keyChecks.filter(k => k.key === key),

      hasNavigationPattern: (type) =>
        this.navigationPatterns.some(p => p.type === type),

      hasArrowNavigation: () =>
        this.navigationPatterns.some(p => p.type === 'arrow-navigation'),

      hasEscapeHandler: () =>
        this.keyChecks.some(k => ['Escape', 'Esc'].includes(k.key) || k.key === 27),

      hasTrapPattern: () =>
        this.trapPatterns.length > 0,

      hasScreenReaderConflicts: () =>
        this.screenReaderConflicts.length > 0,

      getScreenReaderConflicts: () =>
        this.screenReaderConflicts,

      getScreenReaderConflictsByKey: (key) =>
        this.screenReaderConflicts.filter(c => c.key === key),

      getMouseOnlyElements: () => {
        const mouseElements = new Set(this.mouseHandlers.map(h => h.elementRef));
        const keyboardElements = new Set(this.keyboardHandlers.map(h => h.elementRef));
        return [...mouseElements].filter(e =>
          !keyboardElements.has(e) && e !== 'document' && e !== 'window'
        );
      },

      getIssuesBySeverity: (severity) =>
        this.issues.filter(i => i.severity === severity),

      hasWarnings: () =>
        this.issues.some(i => i.severity === 'warning'),

      hasErrors: () =>
        this.issues.some(i => i.severity === 'error')
    };
  }

  /**
   * Generate a summary report
   * @returns {string}
   */
  getSummary() {
    const lines = [
      'Keyboard Navigation Analysis Summary',
      '====================================',
      '',
      `Keyboard handlers: ${this.stats.totalKeyboardHandlers}`,
      `Mouse handlers: ${this.stats.totalMouseHandlers}`,
      `Key checks: ${this.keyChecks.length}`,
      `preventDefault calls: ${this.preventDefaultCalls.length}`,
      ''
    ];

    if (Object.keys(this.stats.byKey).length > 0) {
      lines.push('Keys Handled:');
      for (const [key, count] of Object.entries(this.stats.byKey)) {
        lines.push(`  ${key}: ${count}`);
      }
      lines.push('');
    }

    if (Object.keys(this.stats.byEventType).length > 0) {
      lines.push('By Event Type:');
      for (const [type, count] of Object.entries(this.stats.byEventType)) {
        lines.push(`  ${type}: ${count}`);
      }
      lines.push('');
    }

    if (this.navigationPatterns.length > 0) {
      lines.push('Navigation Patterns Detected:');
      for (const pattern of this.navigationPatterns) {
        lines.push(`  ${pattern.type}: ${pattern.description}`);
      }
      lines.push('');
    }

    if (this.trapPatterns.length > 0) {
      lines.push('Trap Patterns:');
      for (const trap of this.trapPatterns) {
        lines.push(`  [${trap.severity}] ${trap.description}`);
      }
      lines.push('');
    }

    if (this.keyboardShortcuts.length > 0) {
      lines.push('Keyboard Shortcuts:');
      for (const shortcut of this.keyboardShortcuts) {
        lines.push(`  ${shortcut.description}`);
      }
      lines.push('');
    }

    if (this.stats.mouseOnlyElements > 0) {
      lines.push(`Mouse-only elements: ${this.stats.mouseOnlyElements}`);
      lines.push('');
    }

    if (this.screenReaderConflicts.length > 0) {
      lines.push('Screen Reader Conflicts:');
      for (const conflict of this.screenReaderConflicts) {
        lines.push(`  Key "${conflict.key}" conflicts with: ${conflict.screenReaderFunction}`);
      }
      lines.push('');
    }

    if (this.issues.length > 0) {
      lines.push('Issues Detected:');
      for (const issue of this.issues) {
        lines.push(`  [${issue.severity}] ${issue.message}`);
        if (issue.suggestion) {
          lines.push(`    Suggestion: ${issue.suggestion}`);
        }
      }
      lines.push('');
    }

    if (this.issues.length === 0 && this.keyboardHandlers.length > 0) {
      lines.push('[+] No keyboard accessibility issues detected');
    }

    return lines.join('\n');
  }
}

module.exports = KeyboardAnalyzer;
