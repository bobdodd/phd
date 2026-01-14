/**
 * TimingAnalyzer - Detects timing-related accessibility issues
 *
 * This analyzer detects:
 * - setTimeout with major actions without warnings (WCAG 2.2.1)
 * - setInterval without clearInterval (WCAG 2.2.2)
 * - Auto-updating content without user control
 */

class TimingAnalyzer {
  /**
   * Create a new TimingAnalyzer
   * @param {Object} [options] - Analyzer options
   */
  constructor(options = {}) {
    this.options = {
      detectTimeouts: options.detectTimeouts ?? true,
      detectIntervals: options.detectIntervals ?? true,
      significantDelay: options.significantDelay ?? 5000 // 5 seconds
    };

    // Timing detections
    this.timeouts = [];
    this.intervals = [];
    this.clearTimeouts = [];
    this.clearIntervals = [];

    // Issues
    this.issues = [];

    // Statistics
    this.stats = {
      totalTimeouts: 0,
      totalIntervals: 0,
      clearedTimeouts: 0,
      clearedIntervals: 0,
      unclearedIntervals: 0
    };
  }

  /**
   * Analyze an ActionTree for timing patterns
   * @param {ActionTree} tree - The ActionTree to analyze
   * @returns {Object} Analysis results
   */
  analyze(tree) {
    this.reset();

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
    this.timeouts = [];
    this.intervals = [];
    this.clearTimeouts = [];
    this.clearIntervals = [];
    this.issues = [];
    this.stats = {
      totalTimeouts: 0,
      totalIntervals: 0,
      clearedTimeouts: 0,
      clearedIntervals: 0,
      unclearedIntervals: 0
    };
  }

  /**
   * Traverse an action and its children
   * @param {Action} action - The action to traverse
   * @param {Object} context - Current context
   */
  traverseAction(action, context = {}) {
    // Check for timing patterns
    this.checkForSetTimeout(action, context);
    this.checkForSetInterval(action, context);
    this.checkForClearTimeout(action, context);
    this.checkForClearInterval(action, context);

    // Update context for children
    const newContext = {
      ...context,
      depth: context.depth + 1,
      parent: action
    };

    // Traverse children
    for (const child of action.children) {
      this.traverseAction(child, newContext);
    }
  }

  /**
   * Check for setTimeout calls
   */
  checkForSetTimeout(action, context) {
    if (action.actionType !== 'call') return;

    const method = action.getAttribute('method');
    const callee = action.getAttribute('callee');

    if (method !== 'setTimeout' && callee !== 'setTimeout') return;

    // Get arguments: callback, delay
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');
    if (args.length < 2) return;

    // Get delay value
    const delay = this.getArgumentValue(args[1]);

    // Get callback and check for significant actions
    const callback = args[0];
    const hasNavigation = this.containsNavigation(callback);
    const hasMajorDOMChange = this.containsMajorDOMChange(callback);

    const timeout = {
      delay: delay,
      hasNavigation: hasNavigation,
      hasMajorDOMChange: hasMajorDOMChange,
      location: action.location,
      actionId: action.id
    };

    this.timeouts.push(timeout);
  }

  /**
   * Check for setInterval calls
   */
  checkForSetInterval(action, context) {
    if (action.actionType !== 'call') return;

    const method = action.getAttribute('method');
    const callee = action.getAttribute('callee');

    if (method !== 'setInterval' && callee !== 'setInterval') return;

    // Get arguments: callback, interval
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');
    if (args.length < 2) return;

    // Get interval value
    const interval = this.getArgumentValue(args[1]);

    const intervalEntry = {
      interval: interval,
      location: action.location,
      actionId: action.id
    };

    this.intervals.push(intervalEntry);
  }

  /**
   * Check for clearTimeout calls
   */
  checkForClearTimeout(action, context) {
    if (action.actionType !== 'call') return;

    const method = action.getAttribute('method');
    const callee = action.getAttribute('callee');

    if (method !== 'clearTimeout' && callee !== 'clearTimeout') return;

    this.clearTimeouts.push({
      location: action.location,
      actionId: action.id
    });
  }

  /**
   * Check for clearInterval calls
   */
  checkForClearInterval(action, context) {
    if (action.actionType !== 'call') return;

    const method = action.getAttribute('method');
    const callee = action.getAttribute('callee');

    if (method !== 'clearInterval' && callee !== 'clearInterval') return;

    this.clearIntervals.push({
      location: action.location,
      actionId: action.id
    });
  }

  /**
   * Check if action tree contains navigation
   */
  containsNavigation(action) {
    if (!action) return false;

    // Check current action
    if (action.actionType === 'propertySet') {
      const property = action.getAttribute('property');
      if (property === 'location' || property === 'href') {
        return true;
      }
    }

    // Check for assignment to location/href (window.location = ...)
    if (action.actionType === 'assign') {
      const leftSide = action.children[0];
      if (leftSide && leftSide.actionType === 'memberAccess') {
        const property = leftSide.getAttribute('property');
        if (property === 'location' || property === 'href') {
          return true;
        }
      }
    }

    if (action.actionType === 'call') {
      const method = action.getAttribute('method');
      if (['assign', 'replace', 'reload'].includes(method)) {
        return true;
      }

      // Check for method calls like location.assign()
      const callee = action.children[0];
      if (callee && callee.actionType === 'memberAccess') {
        const calleeMethod = callee.getAttribute('property');
        if (['assign', 'replace', 'reload'].includes(calleeMethod)) {
          return true;
        }
      }
    }

    // Check children
    for (const child of action.children || []) {
      if (this.containsNavigation(child)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if action tree contains major DOM changes
   */
  containsMajorDOMChange(action) {
    if (!action) return false;

    // Check current action
    if (action.actionType === 'call') {
      const method = action.getAttribute('method');
      // Major DOM manipulation methods
      if (['remove', 'removeChild', 'replaceChild', 'replaceWith'].includes(method)) {
        return true;
      }

      // Check for method calls like element.remove()
      const callee = action.children[0];
      if (callee && callee.actionType === 'memberAccess') {
        const calleeMethod = callee.getAttribute('property');
        if (['remove', 'removeChild', 'replaceChild', 'replaceWith'].includes(calleeMethod)) {
          return true;
        }
      }
    }

    if (action.actionType === 'propertySet') {
      const property = action.getAttribute('property');
      // innerHTML, textContent changes
      if (['innerHTML', 'outerHTML', 'textContent'].includes(property)) {
        return true;
      }
    }

    // Check for assignment to DOM properties (element.innerHTML = ...)
    if (action.actionType === 'assign') {
      const leftSide = action.children[0];
      if (leftSide && leftSide.actionType === 'memberAccess') {
        const property = leftSide.getAttribute('property');
        if (['innerHTML', 'outerHTML', 'textContent'].includes(property)) {
          return true;
        }
      }
    }

    // Check children
    for (const child of action.children || []) {
      if (this.containsMajorDOMChange(child)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get argument value
   */
  getArgumentValue(argAction) {
    if (!argAction) return null;

    if (argAction.actionType === 'literal') {
      return argAction.getAttribute('value');
    }

    return null;
  }

  /**
   * Detect timing issues
   */
  detectIssues() {
    // Issue: Timeout without warning (significant delay with major action)
    if (this.options.detectTimeouts) {
      for (const timeout of this.timeouts) {
        const delay = typeof timeout.delay === 'number' ? timeout.delay : parseInt(timeout.delay) || 0;

        if (delay >= this.options.significantDelay) {
          if (timeout.hasNavigation || timeout.hasMajorDOMChange) {
            this.issues.push({
              type: 'unannounced-timeout',
              severity: 'warning',
              message: `setTimeout with ${delay}ms delay performs ${timeout.hasNavigation ? 'navigation' : 'major DOM changes'} - users may be surprised`,
              delay: delay,
              hasNavigation: timeout.hasNavigation,
              hasMajorDOMChange: timeout.hasMajorDOMChange,
              location: timeout.location,
              actionId: timeout.actionId,
              wcag: ['2.2.1'],
              suggestion: 'Provide a visible warning before automatic actions, allow users to extend or disable the timeout, or use explicit user action instead'
            });
          }
        }
      }
    }

    // Issue: setInterval without clearInterval
    if (this.options.detectIntervals) {
      // Simple heuristic: if there are intervals but no clearInterval calls
      if (this.intervals.length > 0 && this.clearIntervals.length === 0) {
        for (const interval of this.intervals) {
          this.issues.push({
            type: 'uncontrolled-auto-update',
            severity: 'warning',
            message: `setInterval without clearInterval - auto-updating content cannot be paused or stopped by user`,
            interval: interval.interval,
            location: interval.location,
            actionId: interval.actionId,
            wcag: ['2.2.2'],
            suggestion: 'Provide pause/stop controls for auto-updating content, and use clearInterval to stop updates when requested'
          });
        }
      }
      // More sophisticated: check if specific intervals are never cleared
      // (Would require tracking interval ID variables, which is complex)
    }
  }

  /**
   * Compute statistics
   */
  computeStats() {
    this.stats.totalTimeouts = this.timeouts.length;
    this.stats.totalIntervals = this.intervals.length;
    this.stats.clearedTimeouts = this.clearTimeouts.length;
    this.stats.clearedIntervals = this.clearIntervals.length;
    this.stats.unclearedIntervals = Math.max(0, this.intervals.length - this.clearIntervals.length);
  }

  /**
   * Get analysis results
   */
  getResults() {
    return {
      timeouts: this.timeouts,
      intervals: this.intervals,
      clearTimeouts: this.clearTimeouts,
      clearIntervals: this.clearIntervals,
      issues: this.issues,
      stats: this.stats,

      // Convenience methods
      hasTimeoutIssues: () =>
        this.timeouts.some(t => t.hasNavigation || t.hasMajorDOMChange),

      hasUnclearedIntervals: () =>
        this.intervals.length > 0 && this.clearIntervals.length === 0,

      getIssuesBySeverity: (severity) =>
        this.issues.filter(i => i.severity === severity)
    };
  }

  /**
   * Generate a summary report
   */
  getSummary() {
    return `Timing Analysis Summary
====================================

Timeouts: ${this.stats.totalTimeouts}
Intervals: ${this.stats.totalIntervals}
clearTimeout calls: ${this.stats.clearedTimeouts}
clearInterval calls: ${this.stats.clearedIntervals}
Uncleared intervals: ${this.stats.unclearedIntervals}
Issues Found: ${this.issues.length}

${this.issues.length > 0 ? '\nIssues:\n' + this.issues.map(i => `- ${i.type}: ${i.message}`).join('\n') : 'No issues found.'}
`;
  }
}

module.exports = TimingAnalyzer;
