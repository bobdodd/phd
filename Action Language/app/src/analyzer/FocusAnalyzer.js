/**
 * FocusAnalyzer - Analyzes focus management patterns in ActionLanguage trees
 *
 * This analyzer detects:
 * - .focus() and .blur() calls
 * - tabIndex/tabindex manipulation
 * - document.activeElement access
 * - Focus trap patterns
 * - Focus return patterns (e.g., after dialog close)
 * - Visibility changes that may affect focus (display, visibility, hidden, remove)
 * - Potential accessibility issues with focus management
 */

class FocusAnalyzer {
  /**
   * Create a new FocusAnalyzer
   * @param {Object} [options] - Analyzer options
   */
  constructor(options = {}) {
    this.options = {
      detectTraps: options.detectTraps ?? true,
      detectReturnPatterns: options.detectReturnPatterns ?? true,
      detectVisibilityChanges: options.detectVisibilityChanges ?? true
    };

    // Focus operations registry
    this.focusOperations = [];
    this.blurOperations = [];
    this.tabIndexChanges = [];
    this.activeElementAccess = [];

    // Visibility changes registry
    this.visibilityChanges = [];
    this.elementRemovals = [];
    this.classListChanges = [];

    // Pattern analysis
    this.focusInHandlers = []; // Focus calls inside event handlers
    this.potentialTraps = [];
    this.potentialReturns = [];

    // Issues
    this.issues = [];

    // Statistics
    this.stats = {
      totalFocusCalls: 0,
      totalBlurCalls: 0,
      tabIndexChanges: 0,
      focusInEventHandlers: 0,
      visibilityChanges: 0,
      elementRemovals: 0,
      byElement: {}
    };
  }

  /**
   * Analyze an ActionTree for focus management patterns
   * @param {ActionTree} tree - The ActionTree to analyze
   * @returns {Object} Analysis results
   */
  analyze(tree) {
    this.reset();

    if (!tree || !tree.root) {
      return this.getResults();
    }

    // First pass: collect all focus operations
    this.traverseAction(tree.root, { depth: 0 });

    // Second pass: analyze patterns
    this.analyzePatterns();

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
    this.focusOperations = [];
    this.blurOperations = [];
    this.tabIndexChanges = [];
    this.activeElementAccess = [];
    this.visibilityChanges = [];
    this.elementRemovals = [];
    this.classListChanges = [];
    this.focusInHandlers = [];
    this.potentialTraps = [];
    this.potentialReturns = [];
    this.issues = [];
    this.stats = {
      totalFocusCalls: 0,
      totalBlurCalls: 0,
      tabIndexChanges: 0,
      focusInEventHandlers: 0,
      visibilityChanges: 0,
      elementRemovals: 0,
      byElement: {}
    };
  }

  /**
   * Traverse an action and its children
   * @param {Action} action - The action to traverse
   * @param {Object} context - Current context
   */
  traverseAction(action, context = {}) {
    // Check for focus-related patterns
    this.checkForFocusOperation(action, context);
    this.checkForTabIndexChange(action, context);
    this.checkForActiveElementAccess(action, context);
    this.checkForVisibilityChange(action, context);
    this.checkForElementRemoval(action, context);
    this.checkForClassListChange(action, context);

    // Update context for children
    const newContext = {
      ...context,
      depth: context.depth + 1,
      parent: action,
      inEventHandler: context.inEventHandler || this.isEventHandler(action),
      eventType: context.eventType || this.getEventType(action),
      handlerAction: context.inEventHandler ? context.handlerAction : (this.isEventHandler(action) ? action : null)
    };

    // Traverse children
    for (const child of action.children) {
      this.traverseAction(child, newContext);
    }
  }

  /**
   * Check if action is an event handler context
   * @param {Action} action - The action to check
   * @returns {boolean}
   */
  isEventHandler(action) {
    return action.getAttribute('pattern') === 'eventHandler' ||
           action.getAttribute('pattern') === 'jsxEventHandler' ||
           action.actionType === 'functionExpr' ||
           action.actionType === 'arrowFunction';
  }

  /**
   * Get event type from handler action
   * @param {Action} action - The action to check
   * @returns {string|null}
   */
  getEventType(action) {
    if (action.getAttribute('pattern') === 'eventHandler') {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args[0]?.actionType === 'literal') {
        return args[0].getAttribute('value');
      }
    }
    if (action.getAttribute('pattern') === 'jsxEventHandler') {
      return action.getAttribute('eventType');
    }
    return null;
  }

  /**
   * Check for focus() or blur() calls
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForFocusOperation(action, context) {
    if (action.getAttribute('pattern') !== 'focusOp') {
      return;
    }

    const callee = action.getAttribute('callee') || '';
    // Check for both "element.focus" and just "focus" (when called on complex expressions)
    const isFocus = callee.endsWith('.focus') || callee === 'focus';
    const isBlur = callee.endsWith('.blur') || callee === 'blur';

    if (!isFocus && !isBlur) return;

    // Get element reference
    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const elementRef = this.getElementReference(calleeChild);

    const entry = {
      type: isFocus ? 'focus' : 'blur',
      elementRef: elementRef,
      inEventHandler: context.inEventHandler || false,
      eventType: context.eventType || null,
      handlerActionId: context.handlerAction?.id || null,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id,
      depth: context.depth
    };

    if (isFocus) {
      this.focusOperations.push(entry);
      if (context.inEventHandler) {
        this.focusInHandlers.push(entry);
      }
    } else {
      this.blurOperations.push(entry);
    }
  }

  /**
   * Check for tabIndex/tabindex changes
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForTabIndexChange(action, context) {
    // Property assignment: element.tabIndex = value
    if (action.actionType === 'assign' || action.actionType === 'assignment') {
      const leftChild = action.children.find(c => c.getAttribute('role') === 'left');
      if (leftChild?.actionType === 'memberAccess') {
        const property = leftChild.getAttribute('property');
        if (property === 'tabIndex' || property === 'tabindex') {
          const rightChild = action.children.find(c => c.getAttribute('role') === 'right');
          this.recordTabIndexChange(leftChild, rightChild, action, context);
          return;
        }
      }
    }

    // setAttribute('tabindex', value)
    if (action.actionType === 'call') {
      const callee = action.getAttribute('callee') || '';
      if (callee.endsWith('setAttribute')) {
        const args = action.children.filter(c => c.getAttribute('role') === 'argument');
        if (args.length >= 2) {
          const attrName = args[0].getAttribute('value');
          if (attrName === 'tabindex' || attrName === 'tabIndex') {
            const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
            this.recordTabIndexChange(calleeChild, args[1], action, context);
          }
        }
      }
    }
  }

  /**
   * Record a tabIndex change
   */
  recordTabIndexChange(elementAction, valueAction, action, context) {
    const elementRef = this.getElementReference(elementAction);
    let value = null;

    if (valueAction?.actionType === 'literal') {
      value = valueAction.getAttribute('value');
      // Convert to number if possible
      if (typeof value === 'string' && !isNaN(parseInt(value))) {
        value = parseInt(value);
      }
    } else if (valueAction?.actionType === 'unaryOp' || valueAction?.actionType === 'unary') {
      // Handle negative numbers like -1
      const operator = valueAction.getAttribute('operator');
      const argChild = valueAction.children.find(c => c.getAttribute('role') === 'argument') || valueAction.children[0];
      if (operator === '-' && argChild?.actionType === 'literal') {
        const numValue = argChild.getAttribute('value');
        if (!isNaN(parseInt(numValue))) {
          value = -parseInt(numValue);
        }
      }
    }

    this.tabIndexChanges.push({
      elementRef: elementRef,
      value: value,
      inEventHandler: context.inEventHandler || false,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id
    });
  }

  /**
   * Check for document.activeElement access
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForActiveElementAccess(action, context) {
    if (action.actionType === 'memberAccess') {
      const property = action.getAttribute('property');
      if (property === 'activeElement') {
        const objectChild = action.children.find(c => c.getAttribute('role') === 'object');
        const objectName = objectChild?.getAttribute('name');

        if (objectName === 'document') {
          this.activeElementAccess.push({
            inEventHandler: context.inEventHandler || false,
            eventType: context.eventType || null,
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

  /**
   * Get element reference from member access
   * @param {Action} action - The member access action
   * @returns {string}
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
   * Check for visibility changes (display, visibility, hidden)
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForVisibilityChange(action, context) {
    if (!this.options.detectVisibilityChanges) return;

    // Check for style.display or style.visibility assignments
    if (action.actionType === 'assign' || action.actionType === 'assignment') {
      const leftChild = action.children.find(c => c.getAttribute('role') === 'left');

      if (leftChild?.actionType === 'memberAccess') {
        const property = leftChild.getAttribute('property');

        // Check for style.display or style.visibility
        if (property === 'display' || property === 'visibility') {
          const objectChild = leftChild.children.find(c => c.getAttribute('role') === 'object');
          if (objectChild?.actionType === 'memberAccess' && objectChild.getAttribute('property') === 'style') {
            const rightChild = action.children.find(c => c.getAttribute('role') === 'right');
            const value = rightChild?.getAttribute('value');

            // Get the element being modified
            const styleObject = objectChild.children.find(c => c.getAttribute('role') === 'object');
            const elementRef = this.getElementReference(styleObject);

            // Determine if this hides or shows the element
            const hidesElement = this.isHidingValue(property, value);

            this.visibilityChanges.push({
              type: property,
              property: `style.${property}`,
              value: value,
              hidesElement: hidesElement,
              elementRef: elementRef,
              inEventHandler: context.inEventHandler || false,
              eventType: context.eventType || null,
              location: {
                line: action.getAttribute('line'),
                column: action.getAttribute('column')
              },
              actionId: action.id
            });
            return;
          }
        }

        // Check for element.hidden property
        if (property === 'hidden') {
          const objectChild = leftChild.children.find(c => c.getAttribute('role') === 'object');
          const elementRef = this.getElementReference(objectChild);
          const rightChild = action.children.find(c => c.getAttribute('role') === 'right');
          const value = rightChild?.getAttribute('value');

          this.visibilityChanges.push({
            type: 'hidden',
            property: 'hidden',
            value: value,
            hidesElement: value === 'true' || value === true,
            elementRef: elementRef,
            inEventHandler: context.inEventHandler || false,
            eventType: context.eventType || null,
            location: {
              line: action.getAttribute('line'),
              column: action.getAttribute('column')
            },
            actionId: action.id
          });
          return;
        }
      }
    }

    // Check for setAttribute('hidden', ...) or removeAttribute('hidden')
    if (action.actionType === 'call') {
      const callee = action.getAttribute('callee') || '';

      if (callee.endsWith('setAttribute')) {
        const args = action.children.filter(c => c.getAttribute('role') === 'argument');
        if (args.length >= 1) {
          const attrName = args[0].getAttribute('value');
          if (attrName === 'hidden') {
            const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
            const objectChild = calleeChild?.children.find(c => c.getAttribute('role') === 'object');
            const elementRef = this.getElementReference(objectChild);

            this.visibilityChanges.push({
              type: 'hidden-attribute',
              property: 'setAttribute("hidden")',
              value: args[1]?.getAttribute('value') ?? '',
              hidesElement: true,
              elementRef: elementRef,
              inEventHandler: context.inEventHandler || false,
              eventType: context.eventType || null,
              location: {
                line: action.getAttribute('line'),
                column: action.getAttribute('column')
              },
              actionId: action.id
            });
          }
        }
      }

      if (callee.endsWith('removeAttribute')) {
        const args = action.children.filter(c => c.getAttribute('role') === 'argument');
        if (args.length >= 1) {
          const attrName = args[0].getAttribute('value');
          if (attrName === 'hidden') {
            const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
            const objectChild = calleeChild?.children.find(c => c.getAttribute('role') === 'object');
            const elementRef = this.getElementReference(objectChild);

            this.visibilityChanges.push({
              type: 'hidden-attribute',
              property: 'removeAttribute("hidden")',
              value: null,
              hidesElement: false,
              elementRef: elementRef,
              inEventHandler: context.inEventHandler || false,
              eventType: context.eventType || null,
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
   * Check if a CSS value hides an element
   * @param {string} property - The CSS property (display or visibility)
   * @param {string} value - The CSS value
   * @returns {boolean}
   */
  isHidingValue(property, value) {
    if (property === 'display') {
      return value === 'none';
    }
    if (property === 'visibility') {
      return value === 'hidden' || value === 'collapse';
    }
    return false;
  }

  /**
   * Check for element removal (remove(), removeChild())
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForElementRemoval(action, context) {
    if (!this.options.detectVisibilityChanges) return;

    if (action.actionType === 'call') {
      const callee = action.getAttribute('callee') || '';

      // Check for element.remove()
      if (callee.endsWith('.remove') && !callee.includes('Attribute') && !callee.includes('EventListener') && !callee.includes('Class')) {
        const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
        const objectChild = calleeChild?.children.find(c => c.getAttribute('role') === 'object');
        const elementRef = this.getElementReference(objectChild);

        this.elementRemovals.push({
          type: 'remove',
          method: 'remove()',
          elementRef: elementRef,
          inEventHandler: context.inEventHandler || false,
          eventType: context.eventType || null,
          location: {
            line: action.getAttribute('line'),
            column: action.getAttribute('column')
          },
          actionId: action.id
        });
        return;
      }

      // Check for parent.removeChild(element)
      if (callee.endsWith('.removeChild') || callee === 'removeChild') {
        const args = action.children.filter(c => c.getAttribute('role') === 'argument');
        const elementRef = args.length > 0 ? this.getElementReference(args[0]) : 'unknown';

        this.elementRemovals.push({
          type: 'removeChild',
          method: 'removeChild()',
          elementRef: elementRef,
          inEventHandler: context.inEventHandler || false,
          eventType: context.eventType || null,
          location: {
            line: action.getAttribute('line'),
            column: action.getAttribute('column')
          },
          actionId: action.id
        });
      }
    }
  }

  /**
   * Check for classList changes that may hide elements
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForClassListChange(action, context) {
    if (!this.options.detectVisibilityChanges) return;

    if (action.actionType === 'call') {
      const callee = action.getAttribute('callee') || '';

      // Check for classList.add(), classList.remove(), classList.toggle()
      const classListMethods = ['classList.add', 'classList.remove', 'classList.toggle', 'classList.replace'];
      const matchedMethod = classListMethods.find(m => callee.endsWith(m) || callee.includes(`.${m}`));

      if (matchedMethod) {
        const args = action.children.filter(c => c.getAttribute('role') === 'argument');
        const className = args[0]?.getAttribute('value');

        // Get element reference from callee
        const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
        let elementRef = 'unknown';
        if (calleeChild?.actionType === 'memberAccess') {
          const objectChild = calleeChild.children.find(c => c.getAttribute('role') === 'object');
          if (objectChild?.actionType === 'memberAccess') {
            // element.classList.add - need to go up one more level
            const elementObject = objectChild.children.find(c => c.getAttribute('role') === 'object');
            elementRef = this.getElementReference(elementObject);
          }
        }

        // Determine method type
        const method = matchedMethod.split('.').pop();

        // Check if this might be a visibility-related class
        const mayHideElement = this.isPotentialHidingClass(className, method);

        this.classListChanges.push({
          type: 'classList',
          method: method,
          className: className,
          mayHideElement: mayHideElement,
          elementRef: elementRef,
          inEventHandler: context.inEventHandler || false,
          eventType: context.eventType || null,
          location: {
            line: action.getAttribute('line'),
            column: action.getAttribute('column')
          },
          actionId: action.id
        });
      }
    }
  }

  /**
   * Check if a class name might be used for hiding elements
   * @param {string} className - The class name
   * @param {string} method - The classList method (add, remove, toggle)
   * @returns {boolean}
   */
  isPotentialHidingClass(className, method) {
    if (!className) return false;

    const hidingClassPatterns = [
      'hidden', 'hide', 'invisible', 'visually-hidden', 'sr-only',
      'd-none', 'display-none', 'is-hidden', 'is-invisible',
      'collapse', 'collapsed', 'closed', 'inactive'
    ];

    const lowerClassName = className.toLowerCase();
    const isHidingClass = hidingClassPatterns.some(pattern =>
      lowerClassName === pattern ||
      lowerClassName.includes(pattern) ||
      lowerClassName.startsWith(pattern) ||
      lowerClassName.endsWith(pattern)
    );

    // Adding a hiding class hides; removing shows
    if (method === 'add') return isHidingClass;
    if (method === 'remove') return false; // Removing any class shows
    if (method === 'toggle') return isHidingClass; // Could go either way

    return false;
  }

  /**
   * Analyze detected patterns for focus traps, returns, etc.
   */
  analyzePatterns() {
    if (!this.options.detectTraps && !this.options.detectReturnPatterns) {
      return;
    }

    // Look for focus trap patterns:
    // - Focus/blur handlers that call focus() (redirecting focus)
    // - keydown handlers with focus() (keyboard trap)
    for (const focusOp of this.focusInHandlers) {
      if (focusOp.eventType === 'focus' || focusOp.eventType === 'focusin') {
        this.potentialTraps.push({
          type: 'focus-redirect',
          description: 'Focus event handler calls focus() - may be intentional trap or focus redirect',
          focusOperation: focusOp,
          severity: 'info'
        });
      }

      if (focusOp.eventType === 'keydown' || focusOp.eventType === 'keyup') {
        this.potentialTraps.push({
          type: 'keyboard-focus',
          description: 'Keyboard handler manages focus - check for proper trap behavior',
          focusOperation: focusOp,
          severity: 'info'
        });
      }
    }

    // Look for focus return patterns:
    // - Saving activeElement before opening modal
    // - Calling focus() in close handlers
    if (this.activeElementAccess.length > 0) {
      this.potentialReturns.push({
        type: 'activeElement-save',
        description: 'Code accesses document.activeElement - may be saving focus for later return',
        accessCount: this.activeElementAccess.length,
        locations: this.activeElementAccess.map(a => a.location)
      });
    }

    // Check for focus in click handlers (common pattern for dialogs)
    const clickFocusOps = this.focusInHandlers.filter(f => f.eventType === 'click');
    if (clickFocusOps.length > 0) {
      this.potentialReturns.push({
        type: 'click-focus',
        description: 'Click handlers move focus - may be dialog/modal opening',
        operations: clickFocusOps.length
      });
    }
  }

  /**
   * Detect potential accessibility issues
   */
  detectIssues() {
    // Issue: Focus called on potentially non-focusable elements
    for (const op of this.focusOperations) {
      // Elements that might not be focusable without tabindex
      const potentiallyNonFocusable = ['div', 'span', 'section', 'article', 'header', 'footer', 'main', 'aside'];
      const ref = op.elementRef.toLowerCase();

      if (potentiallyNonFocusable.some(tag => ref === tag || ref.startsWith(tag + '.'))) {
        // Check if there's a corresponding tabIndex change
        const hasTabIndex = this.tabIndexChanges.some(t =>
          t.elementRef.toLowerCase() === ref ||
          t.elementRef.toLowerCase().includes(ref)
        );

        if (!hasTabIndex) {
          this.issues.push({
            type: 'possibly-non-focusable',
            severity: 'warning',
            message: `focus() called on "${op.elementRef}" which may not be focusable without tabindex`,
            location: op.location,
            actionId: op.actionId,
            suggestion: 'Ensure element has tabindex="-1" or is natively focusable'
          });
        }
      }
    }

    // Issue: tabindex > 0 (disrupts natural tab order)
    for (const change of this.tabIndexChanges) {
      if (typeof change.value === 'number' && change.value > 0) {
        this.issues.push({
          type: 'positive-tabindex',
          severity: 'warning',
          message: `tabindex="${change.value}" on "${change.elementRef}" disrupts natural tab order`,
          location: change.location,
          actionId: change.actionId,
          suggestion: 'Use tabindex="0" to add to natural tab order, or tabindex="-1" for programmatic focus only'
        });
      }
    }

    // Issue: blur() without context (may cause focus loss)
    for (const op of this.blurOperations) {
      if (!op.inEventHandler) {
        this.issues.push({
          type: 'standalone-blur',
          severity: 'info',
          message: `blur() called on "${op.elementRef}" outside event handler - ensure focus moves appropriately`,
          location: op.location,
          actionId: op.actionId,
          suggestion: 'Consider where focus should move after blur'
        });
      }
    }

    // Issue: Focus operations without corresponding keyboard handlers (from EventAnalyzer)
    // This would require integration with EventAnalyzer results

    // Issue: Hiding elements without moving focus first
    for (const change of this.visibilityChanges) {
      if (change.hidesElement) {
        // Check if there's a blur or focus call in the same handler
        const hasFocusMove = this.focusOperations.some(f =>
          f.inEventHandler === change.inEventHandler &&
          f.eventType === change.eventType
        ) || this.blurOperations.some(b =>
          b.inEventHandler === change.inEventHandler &&
          b.eventType === change.eventType
        );

        if (!hasFocusMove) {
          this.issues.push({
            type: 'hiding-without-focus-management',
            severity: 'warning',
            message: `Element "${change.elementRef}" is hidden via ${change.property} without explicit focus management`,
            location: change.location,
            actionId: change.actionId,
            suggestion: 'Move focus to another element before hiding, or check if element had focus'
          });
        }
      }
    }

    // Issue: Removing elements without focus consideration
    for (const removal of this.elementRemovals) {
      // Check if there's a focus operation in the same handler
      const hasFocusMove = this.focusOperations.some(f =>
        f.inEventHandler === removal.inEventHandler &&
        f.eventType === removal.eventType
      );

      if (!hasFocusMove) {
        this.issues.push({
          type: 'removal-without-focus-management',
          severity: 'warning',
          message: `Element "${removal.elementRef}" is removed via ${removal.method} without explicit focus management`,
          location: removal.location,
          actionId: removal.actionId,
          suggestion: 'If removed element could have focus, move focus before removal'
        });
      }
    }

    // Issue: classList change with hiding class without focus handling
    for (const change of this.classListChanges) {
      if (change.mayHideElement && change.method === 'add') {
        const hasFocusMove = this.focusOperations.some(f =>
          f.inEventHandler === change.inEventHandler &&
          f.eventType === change.eventType
        );

        if (!hasFocusMove) {
          this.issues.push({
            type: 'hiding-class-without-focus-management',
            severity: 'info',
            message: `Element "${change.elementRef}" has hiding class "${change.className}" added without explicit focus management`,
            location: change.location,
            actionId: change.actionId,
            suggestion: 'Consider moving focus if this class hides the element'
          });
        }
      }
    }
  }

  /**
   * Compute statistics
   */
  computeStats() {
    this.stats.totalFocusCalls = this.focusOperations.length;
    this.stats.totalBlurCalls = this.blurOperations.length;
    this.stats.tabIndexChanges = this.tabIndexChanges.length;
    this.stats.focusInEventHandlers = this.focusInHandlers.length;
    this.stats.activeElementAccess = this.activeElementAccess.length;
    this.stats.visibilityChanges = this.visibilityChanges.length;
    this.stats.elementRemovals = this.elementRemovals.length;
    this.stats.classListChanges = this.classListChanges.length;

    // Count hiding operations
    this.stats.hidingOperations = this.visibilityChanges.filter(v => v.hidesElement).length +
      this.elementRemovals.length +
      this.classListChanges.filter(c => c.mayHideElement).length;

    // By element
    for (const op of [...this.focusOperations, ...this.blurOperations]) {
      const el = op.elementRef;
      this.stats.byElement[el] = (this.stats.byElement[el] || 0) + 1;
    }
  }

  /**
   * Get analysis results
   * @returns {Object}
   */
  getResults() {
    return {
      focusOperations: this.focusOperations,
      blurOperations: this.blurOperations,
      tabIndexChanges: this.tabIndexChanges,
      activeElementAccess: this.activeElementAccess,
      visibilityChanges: this.visibilityChanges,
      elementRemovals: this.elementRemovals,
      classListChanges: this.classListChanges,
      focusInHandlers: this.focusInHandlers,
      patterns: {
        traps: this.potentialTraps,
        returns: this.potentialReturns
      },
      issues: this.issues,
      stats: this.stats,

      // Convenience methods
      hasFocusManagement: () =>
        this.focusOperations.length > 0 || this.tabIndexChanges.length > 0,

      hasVisibilityChanges: () =>
        this.visibilityChanges.length > 0 || this.elementRemovals.length > 0 || this.classListChanges.length > 0,

      getHidingOperations: () =>
        [...this.visibilityChanges.filter(v => v.hidesElement),
         ...this.elementRemovals,
         ...this.classListChanges.filter(c => c.mayHideElement)],

      getFocusByElement: (ref) =>
        this.focusOperations.filter(f => f.elementRef === ref),

      getVisibilityByElement: (ref) =>
        this.visibilityChanges.filter(v => v.elementRef === ref),

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
      'Focus Management Analysis Summary',
      '==================================',
      '',
      `Focus calls: ${this.stats.totalFocusCalls}`,
      `Blur calls: ${this.stats.totalBlurCalls}`,
      `tabIndex changes: ${this.stats.tabIndexChanges}`,
      `activeElement access: ${this.stats.activeElementAccess}`,
      `Focus in event handlers: ${this.stats.focusInEventHandlers}`,
      ''
    ];

    // Visibility section
    if (this.stats.visibilityChanges > 0 || this.stats.elementRemovals > 0 || this.stats.classListChanges > 0) {
      lines.push('Visibility Changes:');
      if (this.stats.visibilityChanges > 0) {
        lines.push(`  Style/property changes: ${this.stats.visibilityChanges}`);
      }
      if (this.stats.elementRemovals > 0) {
        lines.push(`  Element removals: ${this.stats.elementRemovals}`);
      }
      if (this.stats.classListChanges > 0) {
        lines.push(`  classList changes: ${this.stats.classListChanges}`);
      }
      lines.push(`  Total hiding operations: ${this.stats.hidingOperations}`);
      lines.push('');
    }

    if (Object.keys(this.stats.byElement).length > 0) {
      lines.push('Focus/Blur by Element:');
      for (const [el, count] of Object.entries(this.stats.byElement)) {
        lines.push(`  ${el}: ${count}`);
      }
      lines.push('');
    }

    if (this.potentialTraps.length > 0) {
      lines.push('Potential Focus Patterns:');
      for (const trap of this.potentialTraps) {
        lines.push(`  [${trap.severity}] ${trap.type}: ${trap.description}`);
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

    if (this.issues.length === 0 && this.focusOperations.length > 0) {
      lines.push('[+] No focus management issues detected');
    }

    return lines.join('\n');
  }
}

module.exports = FocusAnalyzer;
