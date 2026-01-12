/**
 * EventAnalyzer - Discovers and catalogs event handlers in ActionLanguage trees
 *
 * This analyzer finds all event handlers registered in JavaScript code, including:
 * - addEventListener calls
 * - Direct property assignments (onclick, onfocus, etc.)
 * - setAttribute with event attributes
 * - removeEventListener calls (for tracking removals)
 *
 * The analyzer produces a registry of event handlers that can be used for
 * accessibility analysis (keyboard handling, focus management, etc.)
 */

class EventAnalyzer {
  /**
   * Create a new EventAnalyzer
   * @param {Object} [options] - Analyzer options
   * @param {boolean} [options.trackRemovals=true] - Track removeEventListener calls
   * @param {boolean} [options.includeInlineHandlers=true] - Include setAttribute onclick etc.
   */
  constructor(options = {}) {
    this.options = {
      trackRemovals: options.trackRemovals ?? true,
      includeInlineHandlers: options.includeInlineHandlers ?? true
    };

    // Event handler registry
    this.handlers = [];
    // Removal registry
    this.removals = [];
    // Statistics
    this.stats = {
      totalHandlers: 0,
      byEventType: {},
      byElement: {},
      byPattern: {}
    };
  }

  /**
   * Analyze an ActionTree for event handlers
   * @param {ActionTree} tree - The ActionTree to analyze
   * @returns {Object} Analysis results
   */
  analyze(tree) {
    // Reset state
    this.handlers = [];
    this.removals = [];
    this.stats = {
      totalHandlers: 0,
      byEventType: {},
      byElement: {},
      byPattern: {}
    };

    if (!tree || !tree.root) {
      return this.getResults();
    }

    // Traverse the tree
    this.traverseAction(tree.root);

    // Compute statistics
    this.computeStats();

    return this.getResults();
  }

  /**
   * Traverse an action and its children
   * @param {Action} action - The action to traverse
   * @param {Object} [context] - Current context (parent info, scope, etc.)
   */
  traverseAction(action, context = {}) {
    // Check for event handler patterns
    this.checkForEventHandler(action, context);

    // Traverse children
    for (const child of action.children) {
      this.traverseAction(child, {
        ...context,
        parent: action
      });
    }
  }

  /**
   * Check if an action represents an event handler registration
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForEventHandler(action, context) {
    // Pattern 1: addEventListener (marked by transformer)
    if (action.getAttribute('pattern') === 'eventHandler') {
      this.extractAddEventListener(action, context);
      return;
    }

    // Pattern 2: removeEventListener
    if (this.options.trackRemovals && action.actionType === 'call') {
      const callee = action.getAttribute('callee') || '';
      if (callee.endsWith('removeEventListener')) {
        this.extractRemoveEventListener(action, context);
        return;
      }
    }

    // Pattern 3: Direct property assignment (element.onclick = handler)
    if (action.actionType === 'assign' || action.actionType === 'assignment') {
      this.checkPropertyAssignment(action, context);
      return;
    }

    // Pattern 4: setAttribute with event attribute
    if (this.options.includeInlineHandlers && action.actionType === 'call') {
      const callee = action.getAttribute('callee') || '';
      if (callee.endsWith('setAttribute')) {
        this.checkSetAttribute(action, context);
        return;
      }
    }

    // Pattern 5: jQuery .on() method
    if (action.actionType === 'call') {
      const callee = action.getAttribute('callee') || '';
      if (callee === 'on' || callee.endsWith('.on')) {
        this.checkjQueryOn(action, context);
        return;
      }
    }

    // Pattern 6: jQuery shorthand methods (.click(), .focus(), .keydown(), etc.)
    if (action.actionType === 'call') {
      this.checkjQueryShorthand(action, context);
    }

    // Pattern 7: React JSX event handler (onClick, onKeyDown, etc.)
    if (action.actionType === 'jsxAttribute' && action.getAttribute('pattern') === 'jsxEventHandler') {
      this.extractJSXEventHandler(action, context);
    }
  }

  /**
   * Extract event handler info from addEventListener call
   * @param {Action} action - The call action
   * @param {Object} context - Current context
   */
  extractAddEventListener(action, context) {
    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');

    // Get element reference
    const elementRef = this.getElementReference(calleeChild);

    // Get event type (first argument)
    const eventType = this.getArgumentValue(args[0]);

    // Get handler (second argument)
    const handler = args[1];

    // Get options (third argument, if present)
    const optionsArg = args[2];
    const options = this.extractEventOptions(optionsArg);

    // Build handler entry
    const entry = {
      type: 'addEventListener',
      elementRef: elementRef,
      eventType: eventType,
      handler: handler ? {
        actionId: handler.id,
        actionType: handler.actionType,
        isInline: handler.actionType === 'functionExpr' || handler.actionType === 'arrowFunction',
        name: handler.getAttribute('name') || null
      } : null,
      options: options,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column'),
        sourceStart: action.getAttribute('sourceStart'),
        sourceEnd: action.getAttribute('sourceEnd')
      },
      actionId: action.id
    };

    this.handlers.push(entry);
  }

  /**
   * Extract removeEventListener info
   * @param {Action} action - The call action
   * @param {Object} context - Current context
   */
  extractRemoveEventListener(action, context) {
    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');

    const entry = {
      type: 'removeEventListener',
      elementRef: this.getElementReference(calleeChild),
      eventType: this.getArgumentValue(args[0]),
      handler: args[1] ? {
        actionId: args[1].id,
        actionType: args[1].actionType,
        name: args[1].getAttribute('name') || null
      } : null,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id
    };

    this.removals.push(entry);
  }

  /**
   * Check for direct property assignment (onclick, onfocus, etc.)
   * @param {Action} action - The assignment action
   * @param {Object} context - Current context
   */
  checkPropertyAssignment(action, context) {
    const leftChild = action.children.find(c => c.getAttribute('role') === 'left');
    const rightChild = action.children.find(c => c.getAttribute('role') === 'right');

    if (!leftChild || leftChild.actionType !== 'memberAccess') {
      return;
    }

    const property = leftChild.getAttribute('property') || '';

    // Check if it's an event property (starts with 'on')
    if (!property.startsWith('on')) {
      return;
    }

    // Extract event type (remove 'on' prefix)
    const eventType = property.slice(2).toLowerCase();

    // Get element reference
    const elementRef = this.getElementReference(leftChild);

    const entry = {
      type: 'propertyAssignment',
      elementRef: elementRef,
      eventType: eventType,
      property: property,
      handler: rightChild ? {
        actionId: rightChild.id,
        actionType: rightChild.actionType,
        isInline: rightChild.actionType === 'functionExpr' || rightChild.actionType === 'arrowFunction',
        name: rightChild.getAttribute('name') || null
      } : null,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id
    };

    this.handlers.push(entry);
  }

  /**
   * Check for setAttribute with event attribute
   * @param {Action} action - The call action
   * @param {Object} context - Current context
   */
  checkSetAttribute(action, context) {
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');

    if (args.length < 2) {
      return;
    }

    const attrName = this.getArgumentValue(args[0]);

    // Check if it's an event attribute
    if (!attrName || !attrName.startsWith('on')) {
      return;
    }

    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const elementRef = this.getElementReference(calleeChild);
    const eventType = attrName.slice(2).toLowerCase();

    const entry = {
      type: 'setAttribute',
      elementRef: elementRef,
      eventType: eventType,
      attribute: attrName,
      handler: {
        actionId: args[1].id,
        actionType: args[1].actionType,
        value: this.getArgumentValue(args[1])
      },
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id
    };

    this.handlers.push(entry);
  }

  /**
   * Check for jQuery .on() pattern
   * @param {Action} action - The call action
   * @param {Object} context - Current context
   */
  checkjQueryOn(action, context) {
    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');

    if (args.length < 2) return;

    // Get jQuery selector from the $() call
    const elementRef = this.getjQuerySelector(calleeChild);

    // First arg is event type(s)
    const eventTypes = this.getArgumentValue(args[0]);

    // Check if this is delegated event (3 args: eventType, selector, handler)
    // or direct event (2 args: eventType, handler)
    let handler, delegateSelector;

    if (args.length >= 3 && args[1].actionType === 'literal') {
      // Delegated: .on('click', '.child', handler)
      delegateSelector = this.getArgumentValue(args[1]);
      handler = args[2];
    } else {
      // Direct: .on('click', handler)
      handler = args[1];
    }

    // jQuery can bind multiple events with space-separated string
    const events = eventTypes ? eventTypes.split(/\s+/) : ['unknown'];

    for (const eventType of events) {
      const entry = {
        type: 'jQueryOn',
        elementRef: elementRef,
        eventType: eventType,
        delegateSelector: delegateSelector || null,
        handler: handler ? {
          actionId: handler.id,
          actionType: handler.actionType,
          isInline: handler.actionType === 'functionExpr' || handler.actionType === 'arrowFunction',
          name: handler.getAttribute('name') || null
        } : null,
        location: {
          line: action.getAttribute('line'),
          column: action.getAttribute('column')
        },
        actionId: action.id
      };

      this.handlers.push(entry);
    }
  }

  /**
   * Check for jQuery shorthand methods (.click(), .focus(), etc.)
   * @param {Action} action - The call action
   * @param {Object} context - Current context
   */
  checkjQueryShorthand(action, context) {
    const callee = action.getAttribute('callee') || '';

    // jQuery event shorthand methods
    const jQueryEventMethods = [
      'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave',
      'keydown', 'keyup', 'keypress',
      'focus', 'blur', 'focusin', 'focusout',
      'change', 'select', 'submit',
      'scroll', 'resize',
      'load', 'unload', 'ready',
      'hover'
    ];

    // Check if callee ends with a jQuery event method
    const method = jQueryEventMethods.find(m => callee === m || callee.endsWith('.' + m));
    if (!method) return;

    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');

    // Must have at least one argument (the handler)
    if (args.length === 0) return;

    // Check if this looks like a jQuery chain (callee object is a $() call)
    if (!this.isjQueryChain(calleeChild)) return;

    const elementRef = this.getjQuerySelector(calleeChild);
    const handler = args[0];

    const entry = {
      type: 'jQueryShorthand',
      elementRef: elementRef,
      eventType: method,
      method: method,
      handler: handler ? {
        actionId: handler.id,
        actionType: handler.actionType,
        isInline: handler.actionType === 'functionExpr' || handler.actionType === 'arrowFunction',
        name: handler.getAttribute('name') || null
      } : null,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id
    };

    this.handlers.push(entry);
  }

  /**
   * Check if a callee looks like a jQuery chain
   * @param {Action} callee - The callee action
   * @returns {boolean}
   */
  isjQueryChain(callee) {
    if (!callee) return false;

    if (callee.actionType === 'memberAccess') {
      const objectChild = callee.children.find(c => c.getAttribute('role') === 'object');
      if (objectChild?.actionType === 'call') {
        const innerCallee = objectChild.getAttribute('callee');
        return innerCallee === '$' || innerCallee === 'jQuery';
      }
      // Could be chained jQuery methods
      return this.isjQueryChain(objectChild);
    }

    return false;
  }

  /**
   * Get jQuery selector from a $() call chain
   * @param {Action} callee - The callee action (memberAccess)
   * @returns {string} The jQuery selector
   */
  getjQuerySelector(callee) {
    if (!callee) return 'unknown';

    if (callee.actionType === 'memberAccess') {
      const objectChild = callee.children.find(c => c.getAttribute('role') === 'object');

      if (objectChild?.actionType === 'call') {
        const innerCallee = objectChild.getAttribute('callee');
        if (innerCallee === '$' || innerCallee === 'jQuery') {
          // Get the selector argument
          const args = objectChild.children.filter(c => c.getAttribute('role') === 'argument');
          if (args.length > 0) {
            return this.getArgumentValue(args[0]) || '$()';
          }
        }
      }

      // Recurse for chained methods
      return this.getjQuerySelector(objectChild);
    }

    return 'unknown';
  }

  /**
   * Extract React JSX event handler
   * @param {Action} action - The jsxAttribute action
   * @param {Object} context - Current context
   */
  extractJSXEventHandler(action, context) {
    const name = action.getAttribute('name') || '';
    const eventType = action.getAttribute('eventType') || name.slice(2).toLowerCase();

    // Get the handler (value child)
    const valueChild = action.children.find(c => c.getAttribute('role') === 'value');

    // Try to get the element tag name from context
    let elementRef = 'JSXElement';
    if (context.parent?.actionType === 'jsxElement') {
      elementRef = context.parent.getAttribute('tagName') || 'JSXElement';
    }

    const entry = {
      type: 'jsxEventHandler',
      elementRef: elementRef,
      eventType: eventType,
      attribute: name,
      handler: valueChild ? {
        actionId: valueChild.id,
        actionType: valueChild.actionType,
        isInline: valueChild.actionType === 'arrowFunction' || valueChild.actionType === 'functionExpr',
        name: valueChild.getAttribute('name') || null
      } : null,
      location: {
        line: action.getAttribute('line'),
        column: action.getAttribute('column')
      },
      actionId: action.id
    };

    this.handlers.push(entry);
  }

  /**
   * Get element reference from a member access or callee
   * @param {Action} action - The member access action
   * @returns {string} Element reference string
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

    // Handle chained access (e.g., document.getElementById('btn'))
    if (action.actionType === 'call') {
      const callee = action.getAttribute('callee');
      if (callee) {
        // Try to get a meaningful reference
        if (callee.includes('getElementById')) {
          const args = action.children.filter(c => c.getAttribute('role') === 'argument');
          const id = this.getArgumentValue(args[0]);
          return id ? `#${id}` : callee;
        }
        if (callee.includes('querySelector')) {
          const args = action.children.filter(c => c.getAttribute('role') === 'argument');
          return this.getArgumentValue(args[0]) || callee;
        }
        return callee;
      }
    }

    return 'unknown';
  }

  /**
   * Get the value of an argument action
   * @param {Action} arg - The argument action
   * @returns {*} The argument value
   */
  getArgumentValue(arg) {
    if (!arg) return null;

    if (arg.actionType === 'literal') {
      return arg.getAttribute('value');
    }

    if (arg.actionType === 'identifier') {
      return arg.getAttribute('name');
    }

    return null;
  }

  /**
   * Extract event listener options from third argument
   * @param {Action} optionsArg - The options argument
   * @returns {Object|null} Extracted options
   */
  extractEventOptions(optionsArg) {
    if (!optionsArg) return null;

    // Boolean (capture flag)
    if (optionsArg.actionType === 'literal') {
      const value = optionsArg.getAttribute('value');
      if (value === true || value === 'true') {
        return { capture: true };
      }
      return null;
    }

    // Object options
    if (optionsArg.actionType === 'object') {
      const options = {};
      for (const prop of optionsArg.children) {
        if (prop.actionType === 'property') {
          const key = prop.getAttribute('key');
          const valueChild = prop.children.find(c => c.getAttribute('role') === 'value');
          if (key && valueChild) {
            options[key] = this.getArgumentValue(valueChild);
          }
        }
      }
      return Object.keys(options).length > 0 ? options : null;
    }

    return null;
  }

  /**
   * Compute statistics from collected handlers
   */
  computeStats() {
    this.stats.totalHandlers = this.handlers.length;

    for (const handler of this.handlers) {
      // By event type
      const eventType = handler.eventType || 'unknown';
      this.stats.byEventType[eventType] = (this.stats.byEventType[eventType] || 0) + 1;

      // By element
      const element = handler.elementRef || 'unknown';
      this.stats.byElement[element] = (this.stats.byElement[element] || 0) + 1;

      // By pattern
      const pattern = handler.type;
      this.stats.byPattern[pattern] = (this.stats.byPattern[pattern] || 0) + 1;
    }
  }

  /**
   * Get analysis results
   * @returns {Object} Analysis results
   */
  getResults() {
    return {
      handlers: this.handlers,
      removals: this.removals,
      stats: this.stats,
      // Convenience accessors
      getHandlersByEventType: (type) =>
        this.handlers.filter(h => h.eventType === type),
      getHandlersByElement: (ref) =>
        this.handlers.filter(h => h.elementRef === ref),
      hasKeyboardHandlers: () =>
        this.handlers.some(h =>
          ['keydown', 'keyup', 'keypress'].includes(h.eventType)
        ),
      hasClickHandlers: () =>
        this.handlers.some(h => h.eventType === 'click'),
      hasFocusHandlers: () =>
        this.handlers.some(h =>
          ['focus', 'blur', 'focusin', 'focusout'].includes(h.eventType)
        )
    };
  }

  /**
   * Generate a summary report
   * @returns {string} Human-readable summary
   */
  getSummary() {
    const lines = [
      'Event Handler Analysis Summary',
      '==============================',
      '',
      `Total handlers found: ${this.stats.totalHandlers}`,
      ''
    ];

    if (Object.keys(this.stats.byEventType).length > 0) {
      lines.push('By Event Type:');
      for (const [type, count] of Object.entries(this.stats.byEventType)) {
        lines.push(`  ${type}: ${count}`);
      }
      lines.push('');
    }

    if (Object.keys(this.stats.byPattern).length > 0) {
      lines.push('By Registration Pattern:');
      for (const [pattern, count] of Object.entries(this.stats.byPattern)) {
        lines.push(`  ${pattern}: ${count}`);
      }
      lines.push('');
    }

    if (this.removals.length > 0) {
      lines.push(`Event Listeners Removed: ${this.removals.length}`);
      lines.push('');
    }

    // Accessibility insights
    lines.push('Accessibility Insights:');
    const results = this.getResults();

    if (results.hasClickHandlers() && !results.hasKeyboardHandlers()) {
      lines.push('  [!] Click handlers found without keyboard equivalents');
    }

    if (results.hasKeyboardHandlers()) {
      lines.push('  [+] Keyboard handlers present');
    }

    if (results.hasFocusHandlers()) {
      lines.push('  [+] Focus management handlers present');
    }

    return lines.join('\n');
  }
}

module.exports = EventAnalyzer;
