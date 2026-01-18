import { BaseAnalyzer, AnalyzerContext, Issue, IssueFix } from './BaseAnalyzer';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * ARIASemanticAnalyzer
 *
 * Detects 8 types of ARIA semantic issues:
 * 1. invalid-role - Using a role that doesn't exist in ARIA spec
 * 2. interactive-role-static - Interactive role without event handler
 * 3. aria-expanded-static - aria-expanded set but never updated
 * 4. dialog-missing-label - Dialog without aria-label/aria-labelledby
 * 5. missing-required-aria - Role requires specific ARIA attributes
 * 6. assertive-live-region - aria-live="assertive" overuse
 * 7. aria-hidden-true - aria-hidden on interactive elements
 * 8. aria-label-overuse - aria-label overriding visible text
 *
 * WCAG: 4.1.2, 4.1.3, 2.5.3, 2.1.1
 */
export class ARIASemanticAnalyzer extends BaseAnalyzer {
  readonly name = 'ARIASemanticAnalyzer';
  readonly description = 'Detects 8 types of ARIA semantic issues including invalid roles, missing required attributes, and static aria-expanded values';

  // ARIA 1.2 valid roles
  private readonly validRoles = new Set([
    // Widget roles
    'alert', 'alertdialog', 'button', 'checkbox', 'dialog', 'gridcell',
    'link', 'log', 'marquee', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
    'option', 'progressbar', 'radio', 'scrollbar', 'searchbox', 'slider',
    'spinbutton', 'status', 'switch', 'tab', 'tabpanel', 'textbox',
    'timer', 'tooltip', 'treeitem',
    // Composite widget roles
    'combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup',
    'tablist', 'tree', 'treegrid',
    // Document structure roles
    'application', 'article', 'cell', 'columnheader', 'definition',
    'directory', 'document', 'feed', 'figure', 'group', 'heading',
    'img', 'list', 'listitem', 'math', 'none', 'note', 'presentation',
    'row', 'rowgroup', 'rowheader', 'separator', 'table', 'term',
    'toolbar',
    // Landmark roles
    'banner', 'complementary', 'contentinfo', 'form', 'main',
    'navigation', 'region', 'search'
  ]);

  // Interactive roles that require event handlers
  private readonly interactiveRoles = new Set([
    'button', 'link', 'checkbox', 'radio', 'switch', 'tab',
    'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option',
    'slider', 'spinbutton', 'textbox', 'searchbox', 'combobox'
  ]);

  // Roles that require specific ARIA attributes
  private readonly requiredAttributes: Map<string, string[]> = new Map([
    ['checkbox', ['aria-checked']],
    ['radio', ['aria-checked']],
    ['switch', ['aria-checked']],
    ['slider', ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']],
    ['spinbutton', ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']],
    ['combobox', ['aria-expanded', 'aria-controls']],
    ['tab', ['aria-selected']],
    ['scrollbar', ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']],
    ['separator', ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']],
    ['progressbar', ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']],
  ]);

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.actionLanguageModel) {
      return issues;
    }

    const nodes = context.actionLanguageModel.nodes;

    // Detect all issue types
    issues.push(...this.detectInvalidRole(nodes, context));
    issues.push(...this.detectInteractiveRoleStatic(nodes, context));
    issues.push(...this.detectAriaExpandedStatic(nodes, context));
    issues.push(...this.detectDialogMissingLabel(nodes, context));
    issues.push(...this.detectMissingRequiredAria(nodes, context));
    issues.push(...this.detectAssertiveLiveRegion(nodes, context));
    issues.push(...this.detectAriaHiddenTrue(nodes, context));
    issues.push(...this.detectAriaLabelOveruse(nodes, context));

    return issues;
  }

  /**
   * Issue 1: invalid-role
   * Detects usage of roles that don't exist in ARIA spec
   */
  private detectInvalidRole(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    for (const node of nodes) {
      if (node.actionType === 'ariaStateChange' &&
          node.metadata.attribute === 'role') {
        const role = node.metadata.value;

        if (role && typeof role === 'string' && !this.validRoles.has(role)) {
          const similarRoles = this.getSimilarRoles(role);
          const suggestion = similarRoles.length > 0
            ? ` Did you mean: ${similarRoles.join(', ')}?`
            : '';

          const fix: IssueFix = {
            description: similarRoles.length > 0
              ? `Replace "${role}" with valid role "${similarRoles[0]}"`
              : `Remove invalid role "${role}"`,
            code: similarRoles.length > 0
              ? `element.setAttribute('role', '${similarRoles[0]}');`
              : `element.removeAttribute('role');`,
            location: node.location
          };

          issues.push(
            this.createIssue(
              'invalid-role',
              'error',
              `Invalid ARIA role "${role}" does not exist in ARIA 1.2 specification.${suggestion}`,
              node.location,
              ['4.1.2'],
              context,
              { fix }
            )
          );
        }
      }
    }

    return issues;
  }

  /**
   * Issue 2: interactive-role-static
   * Detects interactive roles without event handlers
   */
  private detectInteractiveRoleStatic(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Track elements with interactive roles
    const elementsWithRoles = new Map<string, { node: ActionLanguageNode; role: string }>();

    // Track elements with event handlers
    const elementsWithHandlers = new Set<string>();

    // First pass: collect roles and handlers
    for (const node of nodes) {
      const elementKey = this.getElementKey(node.element);

      if (node.actionType === 'ariaStateChange' &&
          node.metadata.attribute === 'role' &&
          this.interactiveRoles.has(node.metadata.value)) {
        elementsWithRoles.set(elementKey, { node, role: node.metadata.value });
      }

      if (node.actionType === 'eventHandler') {
        elementsWithHandlers.add(elementKey);
      }
    }

    // Second pass: check for missing handlers
    for (const [elementKey, { node, role }] of elementsWithRoles) {
      if (!elementsWithHandlers.has(elementKey)) {
        const expectedEvents = this.getExpectedHandlers(role);

        const fix: IssueFix = {
          description: `Add ${expectedEvents[0]} event handler`,
          code: `element.addEventListener('${expectedEvents[0]}', (event) => {
  // Handle ${role} interaction
  console.log('${role} activated');
});`,
          location: node.location
        };

        issues.push(
          this.createIssue(
            'interactive-role-static',
            'error',
            `Element with role="${role}" requires event handler(s). Expected: ${expectedEvents.join(', ')}`,
            node.location,
            ['2.1.1', '4.1.2'],
            context,
            { fix }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Issue 3: aria-expanded-static
   * Detects aria-expanded that is set but never updated
   */
  private detectAriaExpandedStatic(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Track aria-expanded initial sets and updates
    const expandedInitialSets = new Map<string, ActionLanguageNode>();
    const expandedUpdates = new Set<string>();

    for (const node of nodes) {
      if (node.actionType === 'ariaStateChange' &&
          node.metadata.attribute === 'aria-expanded') {
        const elementKey = this.getElementKey(node.element);

        // Track initial set (usually 'immediate' timing)
        if (node.timing === 'immediate' && !expandedInitialSets.has(elementKey)) {
          expandedInitialSets.set(elementKey, node);
        } else {
          // Any subsequent update marks element as dynamic
          expandedUpdates.add(elementKey);
        }
      }
    }

    // Check for elements with initial set but no updates
    for (const [elementKey, node] of expandedInitialSets) {
      if (!expandedUpdates.has(elementKey)) {
        const fix: IssueFix = {
          description: 'Make aria-expanded dynamic',
          code: `// Update aria-expanded when toggling
element.addEventListener('click', () => {
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', !isExpanded);
});`,
          location: node.location
        };

        issues.push(
          this.createIssue(
            'aria-expanded-static',
            'warning',
            `aria-expanded is set to "${node.metadata.value}" but never updated. It should be dynamic to reflect collapsible state changes.`,
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
   * Issue 4: dialog-missing-label
   * Detects dialog/alertdialog without accessible label
   */
  private detectDialogMissingLabel(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Track dialog roles and their labels
    const dialogElements = new Map<string, ActionLanguageNode>();
    const elementsWithLabels = new Set<string>();

    for (const node of nodes) {
      if (node.actionType === 'ariaStateChange') {
        const elementKey = this.getElementKey(node.element);

        if (node.metadata.attribute === 'role' &&
            (node.metadata.value === 'dialog' || node.metadata.value === 'alertdialog')) {
          dialogElements.set(elementKey, node);
        }

        if (node.metadata.attribute === 'aria-label' ||
            node.metadata.attribute === 'aria-labelledby') {
          elementsWithLabels.add(elementKey);
        }
      }
    }

    // Check for dialogs without labels
    for (const [elementKey, node] of dialogElements) {
      if (!elementsWithLabels.has(elementKey)) {
        const role = node.metadata.value;

        const fix: IssueFix = {
          description: 'Add accessible label to dialog',
          code: `// Option 1: Use aria-labelledby pointing to title element
element.setAttribute('aria-labelledby', 'dialog-title');

// Option 2: Use aria-label with descriptive text
element.setAttribute('aria-label', 'Confirmation Dialog');`,
          location: node.location
        };

        issues.push(
          this.createIssue(
            'dialog-missing-label',
            'error',
            `Element with role="${role}" must have an accessible label using aria-labelledby or aria-label`,
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
   * Issue 5: missing-required-aria
   * Detects roles missing required ARIA attributes
   */
  private detectMissingRequiredAria(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Track elements with roles that require attributes
    const elementsWithRoles = new Map<string, { node: ActionLanguageNode; role: string; requiredAttrs: string[] }>();

    // Track which ARIA attributes each element has
    const elementAttributes = new Map<string, Set<string>>();

    // First pass: collect roles and attributes
    for (const node of nodes) {
      if (node.actionType === 'ariaStateChange') {
        const elementKey = this.getElementKey(node.element);

        if (node.metadata.attribute === 'role') {
          const role = node.metadata.value;
          const required = this.requiredAttributes.get(role);

          if (required) {
            elementsWithRoles.set(elementKey, { node, role, requiredAttrs: required });
          }
        } else if (node.metadata.attribute) {
          // Track ARIA attributes
          if (!elementAttributes.has(elementKey)) {
            elementAttributes.set(elementKey, new Set());
          }
          elementAttributes.get(elementKey)!.add(node.metadata.attribute);
        }
      }
    }

    // Second pass: check for missing required attributes
    for (const [elementKey, { node, role, requiredAttrs }] of elementsWithRoles) {
      const elementAttrs = elementAttributes.get(elementKey) || new Set();
      const missing = requiredAttrs.filter(attr => !elementAttrs.has(attr));

      if (missing.length > 0) {
        const fix: IssueFix = {
          description: `Add required ARIA attributes for role="${role}"`,
          code: missing.map(attr => {
            // Provide sensible default values
            if (attr === 'aria-checked') return `element.setAttribute('${attr}', 'false');`;
            if (attr === 'aria-selected') return `element.setAttribute('${attr}', 'false');`;
            if (attr === 'aria-valuenow') return `element.setAttribute('${attr}', '0');`;
            if (attr === 'aria-valuemin') return `element.setAttribute('${attr}', '0');`;
            if (attr === 'aria-valuemax') return `element.setAttribute('${attr}', '100');`;
            if (attr === 'aria-expanded') return `element.setAttribute('${attr}', 'false');`;
            if (attr === 'aria-controls') return `element.setAttribute('${attr}', 'controlled-element-id');`;
            return `element.setAttribute('${attr}', 'value');`;
          }).join('\n'),
          location: node.location
        };

        issues.push(
          this.createIssue(
            'missing-required-aria',
            'error',
            `Element with role="${role}" is missing required ARIA attributes: ${missing.join(', ')}`,
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
   * Issue 6: assertive-live-region
   * Detects aria-live="assertive" which should be used sparingly
   */
  private detectAssertiveLiveRegion(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    for (const node of nodes) {
      if (node.actionType === 'ariaStateChange' &&
          node.metadata.attribute === 'aria-live' &&
          node.metadata.value === 'assertive') {

        const fix: IssueFix = {
          description: 'Change to polite live region',
          code: `element.setAttribute('aria-live', 'polite');`,
          location: node.location
        };

        issues.push(
          this.createIssue(
            'assertive-live-region',
            'warning',
            'aria-live="assertive" interrupts screen readers immediately. Use "polite" unless truly urgent.',
            node.location,
            ['4.1.3'],
            context,
            { fix }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Issue 7: aria-hidden-true
   * Detects aria-hidden="true" on focusable/interactive elements
   */
  private detectAriaHiddenTrue(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    // Track elements with aria-hidden="true"
    const hiddenElements = new Map<string, ActionLanguageNode>();

    // Track focusable/interactive elements
    const interactiveElements = new Set<string>();

    for (const node of nodes) {
      const elementKey = this.getElementKey(node.element);

      if (node.actionType === 'ariaStateChange' &&
          node.metadata.attribute === 'aria-hidden' &&
          node.metadata.value === 'true') {
        hiddenElements.set(elementKey, node);
      }

      if (node.actionType === 'eventHandler' || node.actionType === 'focusChange') {
        interactiveElements.add(elementKey);
      }
    }

    // Check for hidden interactive elements
    for (const [elementKey, node] of hiddenElements) {
      if (interactiveElements.has(elementKey)) {
        const fix: IssueFix = {
          description: 'Remove aria-hidden or make element non-interactive',
          code: `// Option 1: Remove aria-hidden to make element accessible
element.removeAttribute('aria-hidden');

// Option 2: If element should be hidden, also remove from tab order
// element.setAttribute('tabindex', '-1');
// element.inert = true;`,
          location: node.location
        };

        issues.push(
          this.createIssue(
            'aria-hidden-true',
            'error',
            'aria-hidden="true" on focusable/interactive element hides it from screen readers but keeps it keyboard-accessible, causing confusion',
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
   * Issue 8: aria-label-overuse
   * Detects aria-label potentially overriding visible text
   */
  private detectAriaLabelOveruse(nodes: ActionLanguageNode[], context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    for (const node of nodes) {
      if (node.actionType === 'ariaStateChange' &&
          node.metadata.attribute === 'aria-label' &&
          node.metadata.hasVisibleText === true) {

        const fix: IssueFix = {
          description: 'Use aria-labelledby or remove aria-label',
          code: `// Option 1: Replace with aria-labelledby pointing to visible text
element.setAttribute('aria-labelledby', 'visible-text-id');
element.removeAttribute('aria-label');

// Option 2: Remove aria-label and let visible text serve as label
element.removeAttribute('aria-label');`,
          location: node.location
        };

        issues.push(
          this.createIssue(
            'aria-label-overuse',
            'info',
            'aria-label on element with visible text may create mismatches between visual and screen reader experiences. Consider aria-labelledby or letting visible text be the label.',
            node.location,
            ['2.5.3'],
            context,
            { fix }
          )
        );
      }
    }

    return issues;
  }

  // Helper methods

  private getElementKey(element: { selector: string; binding?: string }): string {
    return element.binding || element.selector;
  }

  private getSimilarRoles(role: string): string[] {
    const similar: string[] = [];
    const roleLower = role.toLowerCase();

    for (const validRole of this.validRoles) {
      if (validRole.includes(roleLower) || roleLower.includes(validRole)) {
        similar.push(validRole);
      }
    }

    return similar.slice(0, 3); // Max 3 suggestions
  }

  private getExpectedHandlers(role: string): string[] {
    const handlerMap: Record<string, string[]> = {
      'button': ['click', 'keydown'],
      'link': ['click', 'keydown'],
      'checkbox': ['click', 'change', 'keydown'],
      'radio': ['click', 'change', 'keydown'],
      'switch': ['click', 'change', 'keydown'],
      'tab': ['click', 'keydown'],
      'menuitem': ['click', 'keydown'],
      'option': ['click', 'change'],
      'slider': ['input', 'keydown', 'mousedown'],
      'spinbutton': ['input', 'keydown'],
      'textbox': ['input', 'keydown'],
      'searchbox': ['input', 'keydown', 'submit'],
      'combobox': ['click', 'keydown', 'input']
    };

    return handlerMap[role] || ['click', 'keydown'];
  }
}
