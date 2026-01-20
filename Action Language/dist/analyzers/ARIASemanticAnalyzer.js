"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARIASemanticAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class ARIASemanticAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'ARIASemanticAnalyzer';
        this.description = 'Detects 8 types of ARIA semantic issues including invalid roles, missing required attributes, and static aria-expanded values';
        this.validRoles = new Set([
            'alert', 'alertdialog', 'button', 'checkbox', 'dialog', 'gridcell',
            'link', 'log', 'marquee', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
            'option', 'progressbar', 'radio', 'scrollbar', 'searchbox', 'slider',
            'spinbutton', 'status', 'switch', 'tab', 'tabpanel', 'textbox',
            'timer', 'tooltip', 'treeitem',
            'combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup',
            'tablist', 'tree', 'treegrid',
            'application', 'article', 'cell', 'columnheader', 'definition',
            'directory', 'document', 'feed', 'figure', 'group', 'heading',
            'img', 'list', 'listitem', 'math', 'none', 'note', 'presentation',
            'row', 'rowgroup', 'rowheader', 'separator', 'table', 'term',
            'toolbar',
            'banner', 'complementary', 'contentinfo', 'form', 'main',
            'navigation', 'region', 'search'
        ]);
        this.interactiveRoles = new Set([
            'button', 'link', 'checkbox', 'radio', 'switch', 'tab',
            'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option',
            'slider', 'spinbutton', 'textbox', 'searchbox', 'combobox'
        ]);
        this.requiredAttributes = new Map([
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
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const nodes = context.actionLanguageModel.nodes;
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
    detectInvalidRole(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange' &&
                node.metadata.attribute === 'role') {
                const role = node.metadata.value;
                if (role && typeof role === 'string' && !this.validRoles.has(role)) {
                    const similarRoles = this.getSimilarRoles(role);
                    const suggestion = similarRoles.length > 0
                        ? ` Did you mean: ${similarRoles.join(', ')}?`
                        : '';
                    const fix = {
                        description: similarRoles.length > 0
                            ? `Replace "${role}" with valid role "${similarRoles[0]}"`
                            : `Remove invalid role "${role}"`,
                        code: similarRoles.length > 0
                            ? `element.setAttribute('role', '${similarRoles[0]}');`
                            : `element.removeAttribute('role');`,
                        location: node.location
                    };
                    issues.push(this.createIssue('invalid-role', 'error', `Invalid ARIA role "${role}" does not exist in ARIA 1.2 specification.${suggestion}`, node.location, ['4.1.2'], context, { fix }));
                }
            }
        }
        return issues;
    }
    detectInteractiveRoleStatic(nodes, context) {
        const issues = [];
        const elementsWithRoles = new Map();
        const elementsWithHandlers = new Set();
        for (const node of nodes) {
            const elementKey = this.getElementKey(node.element);
            if (!elementKey)
                continue;
            if (node.actionType === 'ariaStateChange' &&
                node.metadata.attribute === 'role' &&
                this.interactiveRoles.has(node.metadata.value)) {
                elementsWithRoles.set(elementKey, { node, role: node.metadata.value });
            }
            if (node.actionType === 'eventHandler') {
                elementsWithHandlers.add(elementKey);
            }
        }
        for (const [elementKey, { node, role }] of elementsWithRoles) {
            if (!elementsWithHandlers.has(elementKey)) {
                const expectedEvents = this.getExpectedHandlers(role);
                const fix = {
                    description: `Add ${expectedEvents[0]} event handler`,
                    code: `element.addEventListener('${expectedEvents[0]}', (event) => {
  // Handle ${role} interaction
  console.log('${role} activated');
});`,
                    location: node.location
                };
                issues.push(this.createIssue('interactive-role-static', 'error', `Element with role="${role}" requires event handler(s). Expected: ${expectedEvents.join(', ')}`, node.location, ['2.1.1', '4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    detectAriaExpandedStatic(nodes, context) {
        const issues = [];
        const expandedInitialSets = new Map();
        const expandedUpdates = new Set();
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange' &&
                node.metadata.attribute === 'aria-expanded') {
                const elementKey = this.getElementKey(node.element);
                if (!elementKey)
                    continue;
                if (node.timing === 'immediate' && !expandedInitialSets.has(elementKey)) {
                    expandedInitialSets.set(elementKey, node);
                }
                else {
                    expandedUpdates.add(elementKey);
                }
            }
        }
        for (const [elementKey, node] of expandedInitialSets) {
            if (!expandedUpdates.has(elementKey)) {
                const fix = {
                    description: 'Make aria-expanded dynamic',
                    code: `// Update aria-expanded when toggling
element.addEventListener('click', () => {
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', !isExpanded);
});`,
                    location: node.location
                };
                issues.push(this.createIssue('aria-expanded-static', 'warning', `aria-expanded is set to "${node.metadata.value}" but never updated. It should be dynamic to reflect collapsible state changes.`, node.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    detectDialogMissingLabel(nodes, context) {
        const issues = [];
        const dialogElements = new Map();
        const elementsWithLabels = new Set();
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange') {
                const elementKey = this.getElementKey(node.element);
                if (!elementKey)
                    continue;
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
        for (const [elementKey, node] of dialogElements) {
            if (!elementsWithLabels.has(elementKey)) {
                const role = node.metadata.value;
                const fix = {
                    description: 'Add accessible label to dialog',
                    code: `// Option 1: Use aria-labelledby pointing to title element
element.setAttribute('aria-labelledby', 'dialog-title');

// Option 2: Use aria-label with descriptive text
element.setAttribute('aria-label', 'Confirmation Dialog');`,
                    location: node.location
                };
                issues.push(this.createIssue('dialog-missing-label', 'error', `Element with role="${role}" must have an accessible label using aria-labelledby or aria-label`, node.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    detectMissingRequiredAria(nodes, context) {
        const issues = [];
        const elementsWithRoles = new Map();
        const elementAttributes = new Map();
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange') {
                const elementKey = this.getElementKey(node.element);
                if (!elementKey)
                    continue;
                if (node.metadata.attribute === 'role') {
                    const role = node.metadata.value;
                    const required = this.requiredAttributes.get(role);
                    if (required) {
                        elementsWithRoles.set(elementKey, { node, role, requiredAttrs: required });
                    }
                }
                else if (node.metadata.attribute) {
                    if (!elementAttributes.has(elementKey)) {
                        elementAttributes.set(elementKey, new Set());
                    }
                    elementAttributes.get(elementKey).add(node.metadata.attribute);
                }
            }
        }
        for (const [elementKey, { node, role, requiredAttrs }] of elementsWithRoles) {
            const elementAttrs = elementAttributes.get(elementKey) || new Set();
            const missing = requiredAttrs.filter(attr => !elementAttrs.has(attr));
            if (missing.length > 0) {
                const fix = {
                    description: `Add required ARIA attributes for role="${role}"`,
                    code: missing.map(attr => {
                        if (attr === 'aria-checked')
                            return `element.setAttribute('${attr}', 'false');`;
                        if (attr === 'aria-selected')
                            return `element.setAttribute('${attr}', 'false');`;
                        if (attr === 'aria-valuenow')
                            return `element.setAttribute('${attr}', '0');`;
                        if (attr === 'aria-valuemin')
                            return `element.setAttribute('${attr}', '0');`;
                        if (attr === 'aria-valuemax')
                            return `element.setAttribute('${attr}', '100');`;
                        if (attr === 'aria-expanded')
                            return `element.setAttribute('${attr}', 'false');`;
                        if (attr === 'aria-controls')
                            return `element.setAttribute('${attr}', 'controlled-element-id');`;
                        return `element.setAttribute('${attr}', 'value');`;
                    }).join('\n'),
                    location: node.location
                };
                issues.push(this.createIssue('missing-required-aria', 'error', `Element with role="${role}" is missing required ARIA attributes: ${missing.join(', ')}`, node.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    detectAssertiveLiveRegion(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange' &&
                node.metadata.attribute === 'aria-live' &&
                node.metadata.value === 'assertive') {
                const fix = {
                    description: 'Change to polite live region',
                    code: `element.setAttribute('aria-live', 'polite');`,
                    location: node.location
                };
                issues.push(this.createIssue('assertive-live-region', 'warning', 'aria-live="assertive" interrupts screen readers immediately. Use "polite" unless truly urgent.', node.location, ['4.1.3'], context, { fix }));
            }
        }
        return issues;
    }
    detectAriaHiddenTrue(nodes, context) {
        const issues = [];
        const hiddenElements = new Map();
        const interactiveElements = new Set();
        for (const node of nodes) {
            const elementKey = this.getElementKey(node.element);
            if (!elementKey)
                continue;
            if (node.actionType === 'ariaStateChange' &&
                node.metadata.attribute === 'aria-hidden' &&
                node.metadata.value === 'true') {
                hiddenElements.set(elementKey, node);
            }
            if (node.actionType === 'eventHandler' || node.actionType === 'focusChange') {
                interactiveElements.add(elementKey);
            }
        }
        for (const [elementKey, node] of hiddenElements) {
            if (interactiveElements.has(elementKey)) {
                const fix = {
                    description: 'Remove aria-hidden or make element non-interactive',
                    code: `// Option 1: Remove aria-hidden to make element accessible
element.removeAttribute('aria-hidden');

// Option 2: If element should be hidden, also remove from tab order
// element.setAttribute('tabindex', '-1');
// element.inert = true;`,
                    location: node.location
                };
                issues.push(this.createIssue('aria-hidden-true', 'error', 'aria-hidden="true" on focusable/interactive element hides it from screen readers but keeps it keyboard-accessible, causing confusion', node.location, ['4.1.2'], context, { fix }));
            }
        }
        return issues;
    }
    detectAriaLabelOveruse(nodes, context) {
        const issues = [];
        for (const node of nodes) {
            if (node.actionType === 'ariaStateChange' &&
                node.metadata.attribute === 'aria-label' &&
                node.metadata.hasVisibleText === true) {
                const fix = {
                    description: 'Use aria-labelledby or remove aria-label',
                    code: `// Option 1: Replace with aria-labelledby pointing to visible text
element.setAttribute('aria-labelledby', 'visible-text-id');
element.removeAttribute('aria-label');

// Option 2: Remove aria-label and let visible text serve as label
element.removeAttribute('aria-label');`,
                    location: node.location
                };
                issues.push(this.createIssue('aria-label-overuse', 'info', 'aria-label on element with visible text may create mismatches between visual and screen reader experiences. Consider aria-labelledby or letting visible text be the label.', node.location, ['2.5.3'], context, { fix }));
            }
        }
        return issues;
    }
    getElementKey(element) {
        if (!element)
            return '';
        return element.binding || element.selector || '';
    }
    getSimilarRoles(role) {
        const similar = [];
        const roleLower = role.toLowerCase();
        for (const validRole of this.validRoles) {
            if (validRole.includes(roleLower) || roleLower.includes(validRole)) {
                similar.push(validRole);
            }
        }
        return similar.slice(0, 3);
    }
    getExpectedHandlers(role) {
        const handlerMap = {
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
exports.ARIASemanticAnalyzer = ARIASemanticAnalyzer;
