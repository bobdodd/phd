/**
 * SemanticAnalyzer - Detects non-semantic HTML usage
 *
 * This analyzer detects:
 * - Non-semantic elements used as buttons/links (WCAG 4.1.2)
 * - createElement('div'/'span') with click handlers or role="button"
 * - Recommends using semantic HTML elements
 */

class SemanticAnalyzer {
  /**
   * Create a new SemanticAnalyzer
   * @param {Object} [options] - Analyzer options
   */
  constructor(options = {}) {
    this.options = {
      detectNonSemanticButtons: options.detectNonSemanticButtons ?? true,
      detectNonSemanticLinks: options.detectNonSemanticLinks ?? true
    };

    // Element creation tracking
    this.createdElements = [];
    this.clickHandlers = [];
    this.roleAssignments = [];

    // Issues
    this.issues = [];

    // Statistics
    this.stats = {
      totalElementsCreated: 0,
      nonSemanticButtons: 0,
      nonSemanticLinks: 0
    };

    // Non-semantic elements that shouldn't be interactive
    this.nonSemanticElements = new Set(['div', 'span', 'p', 'section', 'article']);
  }

  /**
   * Analyze an ActionTree for semantic HTML patterns
   * @param {ActionTree} tree - The ActionTree to analyze
   * @param {Object} [eventAnalyzerData] - Optional EventAnalyzer results for click handlers
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

    // Detect issues
    this.detectIssues();

    // Compute statistics
    this.computeStats();

    return this.getResults();
  }

  /**
   * Reset analyzer state
   */
  reset() {
    this.createdElements = [];
    this.clickHandlers = [];
    this.roleAssignments = [];
    this.issues = [];
    this.stats = {
      totalElementsCreated: 0,
      nonSemanticButtons: 0,
      nonSemanticLinks: 0
    };
  }

  /**
   * Traverse an action and its children
   * @param {Action} action - The action to traverse
   * @param {Object} context - Current context
   */
  traverseAction(action, context = {}) {
    // Check for semantic patterns
    this.checkForElementCreation(action, context);
    this.checkForRoleAssignment(action, context);

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
   * Check for createElement calls
   */
  checkForElementCreation(action, context) {
    if (action.actionType !== 'call') return;

    let method = action.getAttribute('method');

    // Check for method calls like document.createElement()
    if (!method && action.children[0] && action.children[0].actionType === 'memberAccess') {
      method = action.children[0].getAttribute('property');
    }

    if (method !== 'createElement') return;

    // Get the element type argument
    const args = action.children.filter(c => c.actionType === 'literal');
    if (args.length < 1) return;

    const elementType = this.getArgumentValue(args[0]);

    if (this.nonSemanticElements.has(elementType)) {
      // Track this non-semantic element creation
      const element = {
        type: elementType,
        location: action.location,
        actionId: action.id,
        hasClickHandler: false, // Will be determined later
        hasButtonRole: false, // Will be determined later
        hasLinkRole: false
      };

      this.createdElements.push(element);
    }
  }

  /**
   * Check for role assignments (setAttribute('role', 'button'))
   */
  checkForRoleAssignment(action, context) {
    if (action.actionType !== 'call') return;

    let method = action.getAttribute('method');

    // Check for method calls like element.setAttribute()
    if (!method && action.children[0] && action.children[0].actionType === 'memberAccess') {
      method = action.children[0].getAttribute('property');
    }

    if (method !== 'setAttribute') return;

    // Get arguments: attribute name, value (filter for literal arguments)
    const args = action.children.filter(c => c.actionType === 'literal');
    if (args.length < 2) return;

    const attrName = this.getArgumentValue(args[0]);
    const attrValue = this.getArgumentValue(args[1]);

    if (attrName === 'role' && (attrValue === 'button' || attrValue === 'link')) {
      this.roleAssignments.push({
        role: attrValue,
        location: action.location,
        actionId: action.id
      });
    }
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
   * Detect semantic HTML issues
   */
  detectIssues() {
    // Use EventAnalyzer data if available to find click handlers
    if (this.eventAnalyzerData && this.eventAnalyzerData.handlers) {
      // Find elements with click handlers
      const clickHandlers = this.eventAnalyzerData.handlers.filter(h => h.eventType === 'click');

      // Check if any click handlers are on non-semantic elements
      for (const handler of clickHandlers) {
        // Simple heuristic: if element ref suggests it's created in code
        // (More sophisticated: track variable assignments and cross-reference)
        if (handler.elementRef && handler.elementRef !== 'unknown') {
          this.issues.push({
            type: 'non-semantic-button',
            severity: 'info',
            message: `Element "${handler.elementRef}" has click handler - consider using <button> element for better semantics and accessibility`,
            elementRef: handler.elementRef,
            wcag: ['4.1.2'],
            suggestion: 'Use document.createElement("button") instead of non-semantic elements for interactive controls'
          });
        }
      }
    }

    // Check for role="button" or role="link" assignments
    // These suggest the developer is trying to make a non-semantic element interactive
    if (this.options.detectNonSemanticButtons) {
      for (const roleAssignment of this.roleAssignments) {
        if (roleAssignment.role === 'button') {
          this.issues.push({
            type: 'non-semantic-button',
            severity: 'info',
            message: `Element assigned role="button" - consider using <button> element instead`,
            role: roleAssignment.role,
            location: roleAssignment.location,
            actionId: roleAssignment.actionId,
            wcag: ['4.1.2'],
            suggestion: 'Native <button> elements provide better browser support, keyboard handling, and semantics than role="button" on non-semantic elements'
          });
        }
      }
    }

    if (this.options.detectNonSemanticLinks) {
      for (const roleAssignment of this.roleAssignments) {
        if (roleAssignment.role === 'link') {
          this.issues.push({
            type: 'non-semantic-link',
            severity: 'info',
            message: `Element assigned role="link" - consider using <a> element instead`,
            role: roleAssignment.role,
            location: roleAssignment.location,
            actionId: roleAssignment.actionId,
            wcag: ['4.1.2'],
            suggestion: 'Native <a> elements provide better browser support, keyboard handling, and semantics than role="link" on non-semantic elements'
          });
        }
      }
    }

    // For created elements, check if they later get roles or click handlers
    // (This would require more sophisticated tracking of variable assignments)
    for (const element of this.createdElements) {
      // Basic detection: if we see div/span created, suggest semantic alternatives
      // More sophisticated version would track the variable and see if it gets click handlers
      if (['div', 'span'].includes(element.type)) {
        // Only report if we have evidence it's used interactively
        // For now, we rely on EventAnalyzer integration and role assignments above
      }
    }
  }

  /**
   * Compute statistics
   */
  computeStats() {
    this.stats.totalElementsCreated = this.createdElements.length;
    this.stats.nonSemanticButtons = this.issues.filter(i => i.type === 'non-semantic-button').length;
    this.stats.nonSemanticLinks = this.issues.filter(i => i.type === 'non-semantic-link').length;
  }

  /**
   * Get analysis results
   */
  getResults() {
    return {
      createdElements: this.createdElements,
      roleAssignments: this.roleAssignments,
      issues: this.issues,
      stats: this.stats,

      // Convenience methods
      hasNonSemanticButtons: () =>
        this.issues.some(i => i.type === 'non-semantic-button'),

      hasNonSemanticLinks: () =>
        this.issues.some(i => i.type === 'non-semantic-link'),

      getIssuesBySeverity: (severity) =>
        this.issues.filter(i => i.severity === severity)
    };
  }

  /**
   * Generate a summary report
   */
  getSummary() {
    return `Semantic HTML Analysis Summary
====================================

Elements Created: ${this.stats.totalElementsCreated}
Non-semantic Buttons: ${this.stats.nonSemanticButtons}
Non-semantic Links: ${this.stats.nonSemanticLinks}
Issues Found: ${this.issues.length}

${this.issues.length > 0 ? '\nIssues:\n' + this.issues.map(i => `- ${i.type}: ${i.message}`).join('\n') : 'No issues found.'}
`;
  }
}

module.exports = SemanticAnalyzer;
