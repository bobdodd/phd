/**
 * ARIAAnalyzer - Analyzes ARIA usage patterns in ActionLanguage trees
 *
 * This analyzer detects:
 * - ARIA attribute changes (aria-*, role)
 * - ARIA property assignments
 * - ARIA widget patterns (tabs, dialogs, menus, etc.)
 * - Accessibility issues with ARIA usage
 * - Live region patterns
 */

class ARIAAnalyzer {
  /**
   * Create a new ARIAAnalyzer
   * @param {Object} [options] - Analyzer options
   */
  constructor(options = {}) {
    this.options = {
      detectPatterns: options.detectPatterns ?? true,
      detectIssues: options.detectIssues ?? true,
      validateRoles: options.validateRoles ?? true
    };

    // ARIA attribute registry
    this.ariaAttributes = [];
    this.roleChanges = [];
    this.ariaPropertyAccess = [];

    // Pattern analysis
    this.widgetPatterns = [];
    this.liveRegions = [];
    this.labelPatterns = [];

    // Issues
    this.issues = [];

    // Statistics
    this.stats = {
      totalAriaChanges: 0,
      roleChanges: 0,
      byAttribute: {},
      byElement: {},
      byRole: {}
    };

    // Valid ARIA roles
    this.validRoles = new Set([
      // Widget roles
      'button', 'checkbox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'option', 'progressbar', 'radio', 'scrollbar', 'searchbox',
      'separator', 'slider', 'spinbutton', 'switch', 'tab', 'tabpanel', 'textbox',
      'treeitem',
      // Composite widget roles
      'combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup', 'tablist',
      'tree', 'treegrid',
      // Document structure roles
      'application', 'article', 'blockquote', 'caption', 'cell', 'columnheader',
      'definition', 'deletion', 'directory', 'document', 'emphasis', 'feed',
      'figure', 'generic', 'group', 'heading', 'img', 'insertion', 'list',
      'listitem', 'math', 'meter', 'none', 'note', 'paragraph', 'presentation',
      'row', 'rowgroup', 'rowheader', 'strong', 'subscript', 'superscript',
      'table', 'term', 'time', 'toolbar', 'tooltip',
      // Landmark roles
      'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation',
      'region', 'search',
      // Live region roles
      'alert', 'log', 'marquee', 'status', 'timer',
      // Window roles
      'alertdialog', 'dialog'
    ]);

    // Interactive roles that need keyboard support
    this.interactiveRoles = new Set([
      // Standalone widget roles
      'button', 'checkbox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'option', 'radio', 'scrollbar', 'searchbox', 'slider',
      'spinbutton', 'switch', 'tab', 'textbox', 'treeitem',
      // Composite widget roles
      'combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup', 'tablist',
      'tree', 'treegrid',
      // Special roles
      'application' // Takes over all keyboard handling
    ]);

    // Roles that require specific ARIA attributes (per WAI-ARIA 1.2)
    this.requiredAttributes = {
      // Checkbox and switch
      'checkbox': ['aria-checked'],
      'switch': ['aria-checked'],
      'radio': ['aria-checked'],
      'menuitemcheckbox': ['aria-checked'],
      'menuitemradio': ['aria-checked'],
      // Combobox
      'combobox': ['aria-controls', 'aria-expanded'],
      // Range widgets
      'meter': ['aria-valuenow'],
      'scrollbar': ['aria-controls', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-orientation'],
      'slider': ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      'spinbutton': ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      // Separator (when focusable)
      'separator': ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      // Selection
      'option': ['aria-selected'],
      'tab': ['aria-selected'],
      // Structure
      'heading': ['aria-level'],
      'tabpanel': ['aria-labelledby'],
      // Grid
      'rowheader': ['aria-sort'], // when sortable
      'columnheader': ['aria-sort'] // when sortable
    };

    // ARIA state and property categories
    this.ariaStates = new Set([
      'aria-busy', 'aria-checked', 'aria-current', 'aria-disabled', 'aria-expanded',
      'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-pressed', 'aria-selected'
    ]);

    this.ariaProperties = new Set([
      'aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-colcount',
      'aria-colindex', 'aria-colspan', 'aria-controls', 'aria-describedby',
      'aria-details', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto',
      'aria-haspopup', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby',
      'aria-level', 'aria-live', 'aria-modal', 'aria-multiline', 'aria-multiselectable',
      'aria-orientation', 'aria-owns', 'aria-placeholder', 'aria-posinset',
      'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription',
      'aria-rowcount', 'aria-rowindex', 'aria-rowspan', 'aria-setsize', 'aria-sort',
      'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'
    ]);
  }

  /**
   * Analyze an ActionTree for ARIA patterns
   * @param {ActionTree} tree - The ActionTree to analyze
   * @returns {Object} Analysis results
   */
  analyze(tree) {
    this.reset();

    if (!tree || !tree.root) {
      return this.getResults();
    }

    // First pass: collect all ARIA operations
    this.traverseAction(tree.root, { depth: 0 });

    // Second pass: analyze patterns
    if (this.options.detectPatterns) {
      this.analyzePatterns();
    }

    // Compute statistics
    this.computeStats();

    // Detect issues
    if (this.options.detectIssues) {
      this.detectIssues();
    }

    return this.getResults();
  }

  /**
   * Reset analyzer state
   */
  reset() {
    this.ariaAttributes = [];
    this.roleChanges = [];
    this.ariaPropertyAccess = [];
    this.widgetPatterns = [];
    this.liveRegions = [];
    this.labelPatterns = [];
    this.issues = [];
    this.stats = {
      totalAriaChanges: 0,
      roleChanges: 0,
      byAttribute: {},
      byElement: {},
      byRole: {}
    };
  }

  /**
   * Traverse an action and its children
   * @param {Action} action - The action to traverse
   * @param {Object} context - Current context
   */
  traverseAction(action, context = {}) {
    // Check for ARIA-related patterns
    this.checkForAriaAttribute(action, context);
    this.checkForRoleChange(action, context);
    this.checkForAriaPropertyAssignment(action, context);

    // Update context for children
    const newContext = {
      ...context,
      depth: context.depth + 1,
      parent: action,
      inEventHandler: context.inEventHandler || this.isEventHandler(action),
      eventType: context.eventType || this.getEventType(action)
    };

    // Traverse children
    for (const child of action.children) {
      this.traverseAction(child, newContext);
    }
  }

  /**
   * Check if action is an event handler context
   */
  isEventHandler(action) {
    return action.getAttribute('pattern') === 'eventHandler' ||
           action.getAttribute('pattern') === 'jsxEventHandler' ||
           action.actionType === 'functionExpr' ||
           action.actionType === 'arrowFunction';
  }

  /**
   * Get event type from handler action
   */
  getEventType(action) {
    if (action.getAttribute('pattern') === 'eventHandler') {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args[0]?.actionType === 'literal') {
        return args[0].getAttribute('value');
      }
    }
    return null;
  }

  /**
   * Check for setAttribute with ARIA attributes
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForAriaAttribute(action, context) {
    if (action.actionType !== 'call') return;

    const callee = action.getAttribute('callee') || '';

    // Check for setAttribute('aria-*', value)
    if (callee.endsWith('setAttribute')) {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args.length >= 2) {
        const attrName = args[0].getAttribute('value');
        if (attrName && attrName.startsWith('aria-')) {
          const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
          const elementRef = this.getElementReference(calleeChild);
          const value = args[1].getAttribute('value');

          this.ariaAttributes.push({
            type: 'setAttribute',
            attribute: attrName,
            value: value,
            elementRef: elementRef,
            inEventHandler: context.inEventHandler || false,
            eventType: context.eventType || null,
            isState: this.ariaStates.has(attrName),
            isProperty: this.ariaProperties.has(attrName),
            location: {
              line: action.getAttribute('line'),
              column: action.getAttribute('column')
            },
            actionId: action.id
          });
        }
      }
    }

    // Check for removeAttribute('aria-*')
    if (callee.endsWith('removeAttribute')) {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args.length >= 1) {
        const attrName = args[0].getAttribute('value');
        if (attrName && attrName.startsWith('aria-')) {
          const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
          const elementRef = this.getElementReference(calleeChild);

          this.ariaAttributes.push({
            type: 'removeAttribute',
            attribute: attrName,
            value: null,
            elementRef: elementRef,
            inEventHandler: context.inEventHandler || false,
            eventType: context.eventType || null,
            isState: this.ariaStates.has(attrName),
            isProperty: this.ariaProperties.has(attrName),
            location: {
              line: action.getAttribute('line'),
              column: action.getAttribute('column')
            },
            actionId: action.id
          });
        }
      }
    }

    // Check for getAttribute('aria-*')
    if (callee.endsWith('getAttribute')) {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args.length >= 1) {
        const attrName = args[0].getAttribute('value');
        if (attrName && attrName.startsWith('aria-')) {
          const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
          const elementRef = this.getElementReference(calleeChild);

          this.ariaPropertyAccess.push({
            type: 'getAttribute',
            attribute: attrName,
            elementRef: elementRef,
            inEventHandler: context.inEventHandler || false,
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
   * Check for role attribute changes
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForRoleChange(action, context) {
    if (action.actionType !== 'call') return;

    const callee = action.getAttribute('callee') || '';

    // Check for setAttribute('role', value)
    if (callee.endsWith('setAttribute')) {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args.length >= 2) {
        const attrName = args[0].getAttribute('value');
        if (attrName === 'role') {
          const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
          const elementRef = this.getElementReference(calleeChild);
          const roleValue = args[1].getAttribute('value');

          this.roleChanges.push({
            type: 'setAttribute',
            role: roleValue,
            elementRef: elementRef,
            isValid: this.validRoles.has(roleValue),
            isInteractive: this.interactiveRoles.has(roleValue),
            requiredAttributes: this.requiredAttributes[roleValue] || [],
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

    // Check for removeAttribute('role')
    if (callee.endsWith('removeAttribute')) {
      const args = action.children.filter(c => c.getAttribute('role') === 'argument');
      if (args.length >= 1) {
        const attrName = args[0].getAttribute('value');
        if (attrName === 'role') {
          const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
          const elementRef = this.getElementReference(calleeChild);

          this.roleChanges.push({
            type: 'removeAttribute',
            role: null,
            elementRef: elementRef,
            isValid: true,
            isInteractive: false,
            requiredAttributes: [],
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
   * Check for ARIA property assignments (element.ariaLabel = value)
   * @param {Action} action - The action to check
   * @param {Object} context - Current context
   */
  checkForAriaPropertyAssignment(action, context) {
    if (action.actionType !== 'assign' && action.actionType !== 'assignment') return;

    const leftChild = action.children.find(c => c.getAttribute('role') === 'left');
    if (leftChild?.actionType === 'memberAccess') {
      const property = leftChild.getAttribute('property');

      // Check for ariaLabel, ariaHidden, etc. (IDL attributes)
      if (property && property.startsWith('aria')) {
        const objectChild = leftChild.children.find(c => c.getAttribute('role') === 'object');
        const elementRef = this.getElementReference(objectChild);
        const rightChild = action.children.find(c => c.getAttribute('role') === 'right');
        const value = rightChild?.getAttribute('value');

        // Convert camelCase to kebab-case for attribute name
        const attrName = this.camelToKebab(property);

        this.ariaAttributes.push({
          type: 'propertyAssignment',
          attribute: attrName,
          property: property,
          value: value,
          elementRef: elementRef,
          inEventHandler: context.inEventHandler || false,
          eventType: context.eventType || null,
          isState: this.ariaStates.has(attrName),
          isProperty: this.ariaProperties.has(attrName),
          location: {
            line: action.getAttribute('line'),
            column: action.getAttribute('column')
          },
          actionId: action.id
        });
      }

      // Check for role property assignment
      if (property === 'role') {
        const objectChild = leftChild.children.find(c => c.getAttribute('role') === 'object');
        const elementRef = this.getElementReference(objectChild);
        const rightChild = action.children.find(c => c.getAttribute('role') === 'right');
        const roleValue = rightChild?.getAttribute('value');

        this.roleChanges.push({
          type: 'propertyAssignment',
          role: roleValue,
          elementRef: elementRef,
          isValid: this.validRoles.has(roleValue),
          isInteractive: this.interactiveRoles.has(roleValue),
          requiredAttributes: this.requiredAttributes[roleValue] || [],
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
   * Convert camelCase to kebab-case
   * @param {string} str - camelCase string
   * @returns {string} kebab-case string
   */
  camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Get element reference from action
   * @param {Action} action - The action to extract element reference from
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
   * Analyze detected patterns for ARIA widgets
   */
  analyzePatterns() {
    // Analyze for common ARIA widget patterns
    this.detectTabPattern();
    this.detectDialogPattern();
    this.detectMenuPattern();
    this.detectLiveRegionPattern();
    this.detectLabelPattern();
  }

  /**
   * Detect tab/tablist pattern
   */
  detectTabPattern() {
    const tabRoles = this.roleChanges.filter(r =>
      r.role === 'tab' || r.role === 'tablist' || r.role === 'tabpanel'
    );

    if (tabRoles.length > 0) {
      const tabs = tabRoles.filter(r => r.role === 'tab');
      const tablist = tabRoles.filter(r => r.role === 'tablist');
      const tabpanels = tabRoles.filter(r => r.role === 'tabpanel');

      this.widgetPatterns.push({
        type: 'tabs',
        description: 'Tab widget pattern detected',
        components: {
          tabs: tabs.length,
          tablist: tablist.length,
          tabpanels: tabpanels.length
        },
        hasTablist: tablist.length > 0,
        isComplete: tablist.length > 0 && tabs.length > 0 && tabpanels.length > 0
      });
    }
  }

  /**
   * Detect dialog pattern
   */
  detectDialogPattern() {
    const dialogRoles = this.roleChanges.filter(r =>
      r.role === 'dialog' || r.role === 'alertdialog'
    );

    if (dialogRoles.length > 0) {
      // Check for aria-modal
      const modalAttributes = this.ariaAttributes.filter(a =>
        a.attribute === 'aria-modal'
      );

      // Check for aria-labelledby on dialogs
      const labelledbyAttributes = this.ariaAttributes.filter(a =>
        a.attribute === 'aria-labelledby'
      );

      this.widgetPatterns.push({
        type: 'dialog',
        description: 'Dialog widget pattern detected',
        components: {
          dialogs: dialogRoles.length,
          alertDialogs: dialogRoles.filter(r => r.role === 'alertdialog').length
        },
        hasModal: modalAttributes.some(a => a.value === 'true'),
        hasLabel: labelledbyAttributes.length > 0
      });
    }
  }

  /**
   * Detect menu pattern
   */
  detectMenuPattern() {
    const menuRoles = this.roleChanges.filter(r =>
      r.role === 'menu' || r.role === 'menubar' || r.role === 'menuitem' ||
      r.role === 'menuitemcheckbox' || r.role === 'menuitemradio'
    );

    if (menuRoles.length > 0) {
      const menus = menuRoles.filter(r => r.role === 'menu' || r.role === 'menubar');
      const menuitems = menuRoles.filter(r =>
        r.role === 'menuitem' || r.role === 'menuitemcheckbox' || r.role === 'menuitemradio'
      );

      this.widgetPatterns.push({
        type: 'menu',
        description: 'Menu widget pattern detected',
        components: {
          menus: menus.length,
          menuitems: menuitems.length
        },
        hasMenuContainer: menus.length > 0,
        isComplete: menus.length > 0 && menuitems.length > 0
      });
    }
  }

  /**
   * Detect live region pattern
   */
  detectLiveRegionPattern() {
    // Check for aria-live attributes
    const liveAttributes = this.ariaAttributes.filter(a =>
      a.attribute === 'aria-live'
    );

    // Check for alert/status/log roles
    const liveRoles = this.roleChanges.filter(r =>
      r.role === 'alert' || r.role === 'status' || r.role === 'log' ||
      r.role === 'marquee' || r.role === 'timer'
    );

    if (liveAttributes.length > 0 || liveRoles.length > 0) {
      // Check for aria-atomic
      const atomicAttributes = this.ariaAttributes.filter(a =>
        a.attribute === 'aria-atomic'
      );

      // Check for aria-relevant
      const relevantAttributes = this.ariaAttributes.filter(a =>
        a.attribute === 'aria-relevant'
      );

      this.liveRegions.push({
        type: 'liveRegion',
        description: 'Live region pattern detected',
        liveAttributes: liveAttributes.length,
        liveRoles: liveRoles.length,
        politeness: liveAttributes.map(a => a.value),
        hasAtomic: atomicAttributes.length > 0,
        hasRelevant: relevantAttributes.length > 0
      });
    }
  }

  /**
   * Detect labeling patterns
   */
  detectLabelPattern() {
    const labelAttributes = this.ariaAttributes.filter(a =>
      a.attribute === 'aria-label' || a.attribute === 'aria-labelledby'
    );

    const describedbyAttributes = this.ariaAttributes.filter(a =>
      a.attribute === 'aria-describedby'
    );

    if (labelAttributes.length > 0 || describedbyAttributes.length > 0) {
      this.labelPatterns.push({
        type: 'labeling',
        description: 'ARIA labeling pattern detected',
        ariaLabel: labelAttributes.filter(a => a.attribute === 'aria-label').length,
        ariaLabelledby: labelAttributes.filter(a => a.attribute === 'aria-labelledby').length,
        ariaDescribedby: describedbyAttributes.length
      });
    }
  }

  /**
   * Detect accessibility issues with ARIA usage
   */
  detectIssues() {
    // Issue: Invalid role values
    if (this.options.validateRoles) {
      for (const role of this.roleChanges) {
        if (role.role && !role.isValid) {
          this.issues.push({
            type: 'invalid-role',
            severity: 'error',
            message: `Invalid ARIA role "${role.role}" on "${role.elementRef}"`,
            location: role.location,
            actionId: role.actionId,
            suggestion: 'Use a valid ARIA role from the WAI-ARIA specification'
          });
        }
      }
    }

    // Issue: aria-hidden="true" changes (potential focus trap issue)
    const hiddenChanges = this.ariaAttributes.filter(a =>
      a.attribute === 'aria-hidden' && a.value === 'true'
    );
    for (const change of hiddenChanges) {
      this.issues.push({
        type: 'aria-hidden-true',
        severity: 'info',
        message: `aria-hidden="true" set on "${change.elementRef}" - ensure no focusable descendants`,
        location: change.location,
        actionId: change.actionId,
        suggestion: 'Focusable elements inside aria-hidden="true" containers cannot be reached by assistive technology'
      });
    }

    // Issue: Interactive role without keyboard handler context
    const interactiveRoleChanges = this.roleChanges.filter(r => r.isInteractive && !r.inEventHandler);
    for (const role of interactiveRoleChanges) {
      this.issues.push({
        type: 'interactive-role-static',
        severity: 'warning',
        message: `Interactive role="${role.role}" on "${role.elementRef}" set outside event handler`,
        location: role.location,
        actionId: role.actionId,
        suggestion: 'Ensure interactive ARIA roles have appropriate keyboard event handlers'
      });
    }

    // Issue: aria-expanded without corresponding visibility change detection
    const expandedChanges = this.ariaAttributes.filter(a =>
      a.attribute === 'aria-expanded'
    );
    for (const change of expandedChanges) {
      if (!change.inEventHandler) {
        this.issues.push({
          type: 'aria-expanded-static',
          severity: 'info',
          message: `aria-expanded on "${change.elementRef}" - ensure controlled content visibility matches`,
          location: change.location,
          actionId: change.actionId,
          suggestion: 'aria-expanded should be toggled with corresponding content visibility changes'
        });
      }
    }

    // Issue: Dialog without aria-labelledby or aria-label
    const dialogsWithoutLabels = this.roleChanges.filter(r =>
      (r.role === 'dialog' || r.role === 'alertdialog') && r.role
    );
    const labelledElements = new Set(
      this.ariaAttributes
        .filter(a => a.attribute === 'aria-labelledby' || a.attribute === 'aria-label')
        .map(a => a.elementRef)
    );
    for (const dialog of dialogsWithoutLabels) {
      if (!labelledElements.has(dialog.elementRef)) {
        this.issues.push({
          type: 'dialog-missing-label',
          severity: 'warning',
          message: `Dialog "${dialog.elementRef}" may be missing aria-labelledby or aria-label`,
          location: dialog.location,
          actionId: dialog.actionId,
          suggestion: 'Dialogs should have an accessible name via aria-labelledby or aria-label'
        });
      }
    }

    // Issue: Missing required ARIA attributes for roles
    for (const role of this.roleChanges) {
      if (role.requiredAttributes.length > 0) {
        const elementAriaAttrs = this.ariaAttributes
          .filter(a => a.elementRef === role.elementRef)
          .map(a => a.attribute);

        for (const requiredAttr of role.requiredAttributes) {
          if (!elementAriaAttrs.includes(requiredAttr)) {
            this.issues.push({
              type: 'missing-required-aria',
              severity: 'warning',
              message: `Role "${role.role}" on "${role.elementRef}" may be missing required attribute ${requiredAttr}`,
              location: role.location,
              actionId: role.actionId,
              suggestion: `Add ${requiredAttr} attribute for complete ARIA widget implementation`
            });
          }
        }
      }
    }

    // Issue: aria-live="assertive" usage
    const assertiveLiveRegions = this.ariaAttributes.filter(a =>
      a.attribute === 'aria-live' && a.value === 'assertive'
    );
    for (const region of assertiveLiveRegions) {
      this.issues.push({
        type: 'assertive-live-region',
        severity: 'info',
        message: `aria-live="assertive" on "${region.elementRef}" - use sparingly for critical updates only`,
        location: region.location,
        actionId: region.actionId,
        suggestion: 'Prefer aria-live="polite" unless the announcement is time-sensitive or critical'
      });
    }
  }

  /**
   * Compute statistics
   */
  computeStats() {
    this.stats.totalAriaChanges = this.ariaAttributes.length;
    this.stats.roleChanges = this.roleChanges.length;
    this.stats.ariaPropertyAccess = this.ariaPropertyAccess.length;

    // By attribute
    for (const attr of this.ariaAttributes) {
      const name = attr.attribute;
      this.stats.byAttribute[name] = (this.stats.byAttribute[name] || 0) + 1;
    }

    // By element
    for (const attr of [...this.ariaAttributes, ...this.roleChanges]) {
      const el = attr.elementRef;
      this.stats.byElement[el] = (this.stats.byElement[el] || 0) + 1;
    }

    // By role
    for (const role of this.roleChanges) {
      if (role.role) {
        this.stats.byRole[role.role] = (this.stats.byRole[role.role] || 0) + 1;
      }
    }
  }

  /**
   * Get analysis results
   * @returns {Object}
   */
  getResults() {
    return {
      ariaAttributes: this.ariaAttributes,
      roleChanges: this.roleChanges,
      ariaPropertyAccess: this.ariaPropertyAccess,
      widgetPatterns: this.widgetPatterns,
      liveRegions: this.liveRegions,
      labelPatterns: this.labelPatterns,
      issues: this.issues,
      stats: this.stats,

      // Convenience methods
      hasAriaUsage: () =>
        this.ariaAttributes.length > 0 || this.roleChanges.length > 0,

      getAttributesByName: (name) =>
        this.ariaAttributes.filter(a => a.attribute === name),

      getRolesByName: (role) =>
        this.roleChanges.filter(r => r.role === role),

      getByElement: (ref) =>
        [...this.ariaAttributes, ...this.roleChanges].filter(a => a.elementRef === ref),

      hasLiveRegions: () =>
        this.liveRegions.length > 0,

      hasWidgetPatterns: () =>
        this.widgetPatterns.length > 0,

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
      'ARIA Usage Analysis Summary',
      '===========================',
      '',
      `ARIA attribute changes: ${this.stats.totalAriaChanges}`,
      `Role changes: ${this.stats.roleChanges}`,
      `ARIA property access: ${this.stats.ariaPropertyAccess}`,
      ''
    ];

    if (Object.keys(this.stats.byAttribute).length > 0) {
      lines.push('By Attribute:');
      for (const [attr, count] of Object.entries(this.stats.byAttribute)) {
        lines.push(`  ${attr}: ${count}`);
      }
      lines.push('');
    }

    if (Object.keys(this.stats.byRole).length > 0) {
      lines.push('By Role:');
      for (const [role, count] of Object.entries(this.stats.byRole)) {
        lines.push(`  ${role}: ${count}`);
      }
      lines.push('');
    }

    if (this.widgetPatterns.length > 0) {
      lines.push('Widget Patterns Detected:');
      for (const pattern of this.widgetPatterns) {
        lines.push(`  ${pattern.type}: ${pattern.description}`);
        if (pattern.isComplete !== undefined) {
          lines.push(`    Complete: ${pattern.isComplete ? 'Yes' : 'No'}`);
        }
      }
      lines.push('');
    }

    if (this.liveRegions.length > 0) {
      lines.push('Live Regions:');
      for (const region of this.liveRegions) {
        lines.push(`  ${region.description}`);
        if (region.politeness.length > 0) {
          lines.push(`    Politeness levels: ${region.politeness.join(', ')}`);
        }
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

    if (this.issues.length === 0 && this.ariaAttributes.length > 0) {
      lines.push('[+] No ARIA usage issues detected');
    }

    return lines.join('\n');
  }
}

module.exports = ARIAAnalyzer;
