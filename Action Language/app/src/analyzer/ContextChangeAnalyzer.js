/**
 * ContextChangeAnalyzer - Detects unexpected context changes
 *
 * This analyzer detects:
 * - Form submission on input/change events (WCAG 3.2.2)
 * - Navigation on input/change/focus events (WCAG 3.2.1, 3.2.2)
 * - Unexpected context changes that disorient users
 */

class ContextChangeAnalyzer {
  /**
   * Create a new ContextChangeAnalyzer
   * @param {Object} [options] - Analyzer options
   */
  constructor(options = {}) {
    this.options = {
      detectFormSubmit: options.detectFormSubmit ?? true,
      detectNavigation: options.detectNavigation ?? true
    };

    // Context change detections
    this.formSubmissions = [];
    this.navigationChanges = [];

    // Issues
    this.issues = [];

    // Statistics
    this.stats = {
      totalFormSubmits: 0,
      totalNavigations: 0,
      byEventType: {}
    };
  }

  /**
   * Analyze an ActionTree for context change patterns
   * @param {ActionTree} tree - The ActionTree to analyze
   * @param {Object} [eventAnalyzerData] - Optional EventAnalyzer results
   * @returns {Object} Analysis results
   */
  analyze(tree, eventAnalyzerData = null) {
    this.reset();

    // Store EventAnalyzer data for cross-referencing
    this.eventAnalyzerData = eventAnalyzerData;

    if (!tree || !tree.root) {
      return this.getResults();
    }

    // Traverse the tree
    this.traverseAction(tree.root, { depth: 0 });

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
    this.formSubmissions = [];
    this.navigationChanges = [];
    this.issues = [];
    this.stats = {
      totalFormSubmits: 0,
      totalNavigations: 0,
      byEventType: {}
    };
  }

  /**
   * Traverse an action and its children
   * @param {Action} action - The action to traverse
   * @param {Object} context - Current context
   */
  traverseAction(action, context = {}) {
    // Check for context change patterns
    this.checkForFormSubmit(action, context);
    this.checkForNavigation(action, context);

    // Update context for children
    const newContext = {
      ...context,
      depth: context.depth + 1,
      parent: action,
      inInputHandler: context.inInputHandler || this.isInputChangeHandler(action),
      inFocusHandler: context.inFocusHandler || this.isFocusHandler(action),
      currentHandler: this.isEventHandler(action) ? action : context.currentHandler
    };

    // Traverse children
    for (const child of action.children) {
      this.traverseAction(child, newContext);
    }
  }

  /**
   * Check if action is an input/change event handler
   */
  isInputChangeHandler(action) {
    if (action.actionType !== 'call') return false;

    let method = action.getAttribute('method');
    // Check for method calls like element.addEventListener()
    if (!method && action.children[0] && action.children[0].actionType === 'memberAccess') {
      method = action.children[0].getAttribute('property');
    }

    if (method !== 'addEventListener') return false;

    // Check event type (filter for literal arguments)
    const args = action.children.filter(c => c.actionType === 'literal');
    if (args.length < 1) return false;

    const eventType = this.getArgumentValue(args[0]);
    return eventType === 'input' || eventType === 'change';
  }

  /**
   * Check if action is a focus event handler
   */
  isFocusHandler(action) {
    if (action.actionType !== 'call') return false;

    let method = action.getAttribute('method');
    // Check for method calls like element.addEventListener()
    if (!method && action.children[0] && action.children[0].actionType === 'memberAccess') {
      method = action.children[0].getAttribute('property');
    }

    if (method !== 'addEventListener') return false;

    const args = action.children.filter(c => c.actionType === 'literal');
    if (args.length < 1) return false;

    const eventType = this.getArgumentValue(args[0]);
    return eventType === 'focus' || eventType === 'focusin';
  }

  /**
   * Check if action is any event handler
   */
  isEventHandler(action) {
    if (action.actionType !== 'call') return false;
    let method = action.getAttribute('method');
    // Check for method calls like element.addEventListener()
    if (!method && action.children[0] && action.children[0].actionType === 'memberAccess') {
      method = action.children[0].getAttribute('property');
    }
    return method === 'addEventListener';
  }

  /**
   * Check for form.submit() calls
   */
  checkForFormSubmit(action, context) {
    if (action.actionType !== 'call') return;

    let method = action.getAttribute('method');
    // Check for method calls like form.submit()
    if (!method && action.children[0] && action.children[0].actionType === 'memberAccess') {
      method = action.children[0].getAttribute('property');
    }

    if (method !== 'submit') return;

    // Get the object being called (should be a form)
    const calleeChild = action.children[0];
    if (!calleeChild) return;

    const objectRef = this.getObjectReference(calleeChild);

    // Record form submission
    const submission = {
      formRef: objectRef,
      inInputHandler: context.inInputHandler || false,
      inChangeHandler: context.inInputHandler || false, // input/change share same flag
      location: action.location,
      actionId: action.id
    };

    this.formSubmissions.push(submission);
  }

  /**
   * Check for navigation changes (window.location, location.assign, etc.)
   */
  checkForNavigation(action, context) {
    let isNavigation = false;
    let navigationType = null;

    // Pattern 1: window.location = value or location.href = value (propertySet)
    if (action.actionType === 'propertySet') {
      const property = action.getAttribute('property');
      if (property === 'location' || property === 'href') {
        isNavigation = true;
        navigationType = `${property} assignment`;
      }
    }

    // Pattern 1b: window.location = value (assign action)
    if (action.actionType === 'assign') {
      const leftSide = action.children[0];
      if (leftSide && leftSide.actionType === 'memberAccess') {
        const property = leftSide.getAttribute('property');
        if (property === 'location' || property === 'href') {
          isNavigation = true;
          navigationType = `${property} assignment`;
        }
      }
    }

    // Pattern 2: location.assign(), location.replace(), location.reload()
    if (action.actionType === 'call') {
      let method = action.getAttribute('method');
      // Check for method calls like location.assign()
      if (!method && action.children[0] && action.children[0].actionType === 'memberAccess') {
        method = action.children[0].getAttribute('property');
      }

      if (['assign', 'replace', 'reload'].includes(method)) {
        const calleeChild = action.children[0];
        if (calleeChild) {
          const objectRef = this.getObjectReference(calleeChild);
          if (objectRef === 'location' || objectRef === 'window.location' || objectRef.includes('location')) {
            isNavigation = true;
            navigationType = `location.${method}()`;
          }
        }
      }
    }

    if (isNavigation) {
      const navigation = {
        type: navigationType,
        inInputHandler: context.inInputHandler || false,
        inChangeHandler: context.inInputHandler || false,
        inFocusHandler: context.inFocusHandler || false,
        location: action.location,
        actionId: action.id
      };

      this.navigationChanges.push(navigation);
    }
  }

  /**
   * Get object reference from callee
   */
  getObjectReference(calleeAction) {
    if (calleeAction.actionType === 'memberAccess') {
      // The object is stored as a child with role='object'
      const objectChild = calleeAction.children.find(c => c.getAttribute('role') === 'object');
      if (objectChild) {
        if (objectChild.actionType === 'identifier') {
          return objectChild.getAttribute('name') || 'unknown';
        }
        // For nested member access like window.location
        if (objectChild.actionType === 'memberAccess') {
          return this.getObjectReference(objectChild);
        }
      }
      // Fallback: just return the property name
      return calleeAction.getAttribute('property') || 'unknown';
    }

    if (calleeAction.actionType === 'identifier') {
      return calleeAction.getAttribute('name') || 'unknown';
    }

    return 'unknown';
  }

  /**
   * Get argument value
   */
  getArgumentValue(argAction) {
    if (argAction.actionType === 'literal') {
      return argAction.getAttribute('value');
    }
    return null;
  }

  /**
   * Detect context change issues
   */
  detectIssues() {
    // Issue: Form submit on input/change
    if (this.options.detectFormSubmit) {
      for (const submission of this.formSubmissions) {
        if (submission.inInputHandler || submission.inChangeHandler) {
          this.issues.push({
            type: 'unexpected-form-submit',
            severity: 'warning',
            message: `Form submission in input/change handler - unexpected context change that may disorient users`,
            formRef: submission.formRef,
            location: submission.location,
            actionId: submission.actionId,
            wcag: ['3.2.2'],
            suggestion: 'Form submission should be triggered by explicit user action (button click), not automatically on input/change'
          });
        }
      }
    }

    // Issue: Navigation on input/change/focus
    if (this.options.detectNavigation) {
      for (const navigation of this.navigationChanges) {
        if (navigation.inInputHandler || navigation.inChangeHandler) {
          this.issues.push({
            type: 'unexpected-navigation',
            severity: 'warning',
            message: `Navigation (${navigation.type}) in input/change handler - unexpected context change`,
            navigationType: navigation.type,
            location: navigation.location,
            actionId: navigation.actionId,
            wcag: ['3.2.2'],
            suggestion: 'Navigation should be triggered by explicit user action (button/link click), not automatically on input/change'
          });
        } else if (navigation.inFocusHandler) {
          this.issues.push({
            type: 'unexpected-navigation',
            severity: 'warning',
            message: `Navigation (${navigation.type}) in focus handler - unexpected context change`,
            navigationType: navigation.type,
            location: navigation.location,
            actionId: navigation.actionId,
            wcag: ['3.2.1'],
            suggestion: 'Navigation should not occur automatically when an element receives focus'
          });
        }
      }
    }
  }

  /**
   * Compute statistics
   */
  computeStats() {
    this.stats.totalFormSubmits = this.formSubmissions.length;
    this.stats.totalNavigations = this.navigationChanges.length;

    // By event type
    for (const submission of this.formSubmissions) {
      if (submission.inInputHandler) {
        this.stats.byEventType['input'] = (this.stats.byEventType['input'] || 0) + 1;
      }
      if (submission.inChangeHandler) {
        this.stats.byEventType['change'] = (this.stats.byEventType['change'] || 0) + 1;
      }
    }

    for (const navigation of this.navigationChanges) {
      if (navigation.inInputHandler) {
        this.stats.byEventType['input'] = (this.stats.byEventType['input'] || 0) + 1;
      }
      if (navigation.inChangeHandler) {
        this.stats.byEventType['change'] = (this.stats.byEventType['change'] || 0) + 1;
      }
      if (navigation.inFocusHandler) {
        this.stats.byEventType['focus'] = (this.stats.byEventType['focus'] || 0) + 1;
      }
    }
  }

  /**
   * Get analysis results
   */
  getResults() {
    return {
      formSubmissions: this.formSubmissions,
      navigationChanges: this.navigationChanges,
      issues: this.issues,
      stats: this.stats,

      // Convenience methods
      hasFormSubmitIssues: () =>
        this.formSubmissions.some(s => s.inInputHandler || s.inChangeHandler),

      hasNavigationIssues: () =>
        this.navigationChanges.some(n => n.inInputHandler || n.inChangeHandler || n.inFocusHandler),

      getIssuesBySeverity: (severity) =>
        this.issues.filter(i => i.severity === severity)
    };
  }

  /**
   * Generate a summary report
   */
  getSummary() {
    return `Context Change Analysis Summary
====================================

Form Submissions: ${this.stats.totalFormSubmits}
Navigation Changes: ${this.stats.totalNavigations}
Issues Found: ${this.issues.length}

${this.issues.length > 0 ? '\nIssues:\n' + this.issues.map(i => `- ${i.type}: ${i.message}`).join('\n') : 'No issues found.'}
`;
  }
}

module.exports = ContextChangeAnalyzer;
