"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusManagementAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class FocusManagementAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'focus-management';
        this.description = 'Detects focus management issues that can strand keyboard users';
    }
    analyze(context) {
        const issues = [];
        if (context.documentModel) {
            issues.push(...this.analyzeWithDocumentModel(context));
        }
        else if (context.actionLanguageModel) {
            issues.push(...this.analyzeFileScope(context));
        }
        return issues;
    }
    analyzeWithDocumentModel(context) {
        const issues = [];
        const documentModel = context.documentModel;
        for (const jsModel of documentModel.javascript) {
            issues.push(...this.detectRemovalWithoutFocusCheck(jsModel, context));
            issues.push(...this.detectHidingWithoutFocusCheck(jsModel, context));
            issues.push(...this.detectNonFocusableFocus(jsModel, context));
            issues.push(...this.detectStandaloneBlur(jsModel, context));
            issues.push(...this.detectMissingFocusRestoration(jsModel, context));
        }
        return issues;
    }
    analyzeFileScope(context) {
        const issues = [];
        const model = context.actionLanguageModel;
        issues.push(...this.detectRemovalWithoutFocusCheck(model, context));
        issues.push(...this.detectHidingWithoutFocusCheck(model, context));
        issues.push(...this.detectNonFocusableFocus(model, context));
        issues.push(...this.detectStandaloneBlur(model, context));
        issues.push(...this.detectMissingFocusRestoration(model, context));
        return issues;
    }
    detectRemovalWithoutFocusCheck(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            if (node.actionType === 'domManipulation' &&
                node.metadata?.operation === 'remove') {
                const selector = node.element.selector.toLowerCase();
                const binding = node.element.binding?.toLowerCase() || '';
                const looksLikeDialog = node.metadata?.role === 'dialog' ||
                    selector.match(/#[^#]*dialog/i) ||
                    binding.includes('dialog');
                if (looksLikeDialog) {
                    continue;
                }
                const hasFocusCheck = this.hasFocusCheckNearby(nodes, node);
                if (!hasFocusCheck) {
                    const message = `Element removal without focus management. If the removed element (or its children) has focus, keyboard users will lose their place. Check document.activeElement before removing.`;
                    const fix = this.generateRemovalFix(node);
                    issues.push(this.createIssue('removal-without-focus-management', 'warning', message, node.location, ['2.4.3', '2.4.7'], context, { fix }));
                }
            }
        }
        return issues;
    }
    detectHidingWithoutFocusCheck(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            if (node.actionType === 'domManipulation' &&
                (node.metadata?.operation === 'hide' ||
                    node.metadata?.property === 'display' ||
                    node.metadata?.property === 'visibility' ||
                    node.metadata?.property === 'hidden')) {
                const selector = node.element.selector.toLowerCase();
                const binding = node.element.binding?.toLowerCase() || '';
                const looksLikeDialog = node.metadata?.role === 'dialog' ||
                    selector.match(/#[^#]*dialog/i) ||
                    binding.includes('dialog');
                if (looksLikeDialog) {
                    continue;
                }
                const hasFocusCheck = this.hasFocusCheckNearby(nodes, node);
                if (!hasFocusCheck) {
                    const message = `Element hidden without focus management. If the hidden element (or its children) has focus, keyboard users will lose their place. Move focus before hiding.`;
                    const fix = this.generateHidingFix(node);
                    issues.push(this.createIssue('hiding-without-focus-management', 'warning', message, node.location, ['2.4.3', '2.4.7'], context, { fix }));
                }
            }
            if (node.actionType === 'domManipulation' &&
                node.metadata?.operation === 'classList') {
                const message = `classList operation may hide element without focus management. If removing a class that makes the element visible, check for focus first.`;
                issues.push(this.createIssue('hiding-class-without-focus-management', 'info', message, node.location, ['2.4.7'], context, {
                    fix: {
                        description: 'Add focus check before class manipulation',
                        code: `// Check if element or descendants have focus\nif (element.contains(document.activeElement)) {\n  // Move focus to appropriate element\n  someOtherElement.focus();\n}\n// Then manipulate classes\nelement.classList.remove('visible');`,
                        location: node.location,
                    },
                }));
            }
        }
        return issues;
    }
    detectNonFocusableFocus(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            if (node.actionType === 'focusChange' && node.timing === 'immediate') {
                const element = node.element.resolvedElement;
                if (element) {
                    const isFocusable = this.isElementFocusable(element);
                    if (!isFocusable) {
                        const message = `Calling .focus() on non-focusable element <${element.tagName}>. This will silently fail. Add tabindex="0" to make it focusable, or use a naturally focusable element (button, input, a, etc.).`;
                        const fix = this.generateFocusableFix(node, element);
                        issues.push(this.createIssue('possibly-non-focusable', 'warning', message, node.location, ['2.4.3', '4.1.2'], context, { fix }));
                    }
                }
                else {
                    const selector = node.element.selector.toLowerCase();
                    const naturallyFocusableTags = ['button', 'input', 'select', 'textarea', 'a'];
                    const looksNaturallyFocusable = naturallyFocusableTags.some(tag => selector.includes(tag));
                    if (!looksNaturallyFocusable) {
                        const message = `Calling .focus() on element "${node.element.selector}". Verify this element is focusable (has tabindex or is naturally focusable).`;
                        issues.push(this.createIssue('possibly-non-focusable', 'info', message, node.location, ['2.4.3'], context));
                    }
                }
            }
        }
        return issues;
    }
    detectStandaloneBlur(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            if (node.actionType === 'focusChange' && node.metadata?.method === 'blur') {
                const hasFocusNearby = this.hasFocusCallNearby(nodes, node);
                if (!hasFocusNearby) {
                    const message = `.blur() called without moving focus to another element. This leaves no focused element, disorienting keyboard users. Instead of blurring, move focus to a specific element.`;
                    const fix = {
                        description: 'Move focus to specific element instead of blurring',
                        code: `// Instead of:\n// element.blur();\n\n// Do this:\notherElement.focus(); // Move focus explicitly`,
                        location: node.location,
                    };
                    issues.push(this.createIssue('standalone-blur', 'info', message, node.location, ['2.4.7'], context, { fix }));
                }
            }
        }
        return issues;
    }
    detectMissingFocusRestoration(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            if (node.actionType === 'domManipulation' &&
                (node.metadata?.operation === 'hide' || node.metadata?.operation === 'remove')) {
                const selector = node.element.selector.toLowerCase();
                const binding = node.element.binding?.toLowerCase() || '';
                const looksLikeDialogClose = node.metadata?.role === 'dialog' ||
                    selector.match(/#[^#]*dialog/i) ||
                    binding.includes('dialog');
                if (looksLikeDialogClose) {
                    const hasFocusRestoration = this.hasFocusRestorationNearby(nodes, node);
                    if (!hasFocusRestoration) {
                        const message = `Modal/dialog closed without focus restoration. Keyboard users will lose their place when the modal closes. Store document.activeElement before opening and restore it on close.`;
                        const fix = {
                            description: 'Add focus restoration when closing modal',
                            code: `// Store focus before opening modal\nconst previousFocus = document.activeElement;\n\n// ... modal logic ...\n\n// Restore focus when closing\nif (previousFocus instanceof HTMLElement) {\n  previousFocus.focus();\n}`,
                            location: node.location,
                        };
                        issues.push(this.createIssue('focus-restoration-missing', 'warning', message, node.location, ['2.4.3'], context, { fix }));
                    }
                }
            }
        }
        return issues;
    }
    hasFocusCheckNearby(nodes, targetNode) {
        const targetIndex = nodes.indexOf(targetNode);
        const rangeStart = Math.max(0, targetIndex - 5);
        const rangeEnd = Math.min(nodes.length, targetIndex + 5);
        for (let i = rangeStart; i < rangeEnd; i++) {
            const node = nodes[i];
            if (node.metadata?.object === 'document.activeElement' ||
                node.metadata?.property === 'activeElement') {
                return true;
            }
        }
        return false;
    }
    hasFocusCallNearby(nodes, targetNode) {
        const targetIndex = nodes.indexOf(targetNode);
        const rangeStart = Math.max(0, targetIndex - 3);
        const rangeEnd = Math.min(nodes.length, targetIndex + 3);
        for (let i = rangeStart; i < rangeEnd; i++) {
            const node = nodes[i];
            if (node.actionType === 'focusChange' && node.metadata?.method !== 'blur') {
                return true;
            }
        }
        return false;
    }
    hasFocusRestorationNearby(nodes, targetNode) {
        const targetIndex = nodes.indexOf(targetNode);
        const rangeStart = Math.max(0, targetIndex - 10);
        const rangeEnd = Math.min(nodes.length, targetIndex + 10);
        for (let i = rangeStart; i < rangeEnd; i++) {
            const node = nodes[i];
            const binding = node.element?.binding?.toLowerCase() || '';
            const selector = node.element?.selector?.toLowerCase() || '';
            if (binding.includes('previousfocus') ||
                binding.includes('previousactive') ||
                selector.includes('previousfocus') ||
                selector.includes('previousactive') ||
                node.metadata?.variable?.includes('previousFocus')) {
                return true;
            }
        }
        return false;
    }
    isElementFocusable(element) {
        const tabindex = element.attributes.tabindex;
        if (tabindex !== undefined) {
            return parseInt(tabindex) >= 0;
        }
        const focusableTags = ['a', 'button', 'input', 'select', 'textarea', 'iframe'];
        const tagName = element.tagName.toLowerCase();
        if (focusableTags.includes(tagName)) {
            if (tagName === 'a') {
                return element.attributes.href !== undefined;
            }
            return true;
        }
        return false;
    }
    generateRemovalFix(node) {
        const selector = node.element.selector;
        return {
            description: 'Add focus check before removing element',
            code: `// Check if element or its descendants have focus
const element = document.querySelector('${selector}');
if (element && element.contains(document.activeElement)) {
  // Move focus before removing
  // Option 1: Focus a sibling or parent
  const nextFocusable = element.previousElementSibling || element.parentElement;
  if (nextFocusable instanceof HTMLElement) {
    nextFocusable.focus();
  }
  // Option 2: Focus a known fallback element
  // document.getElementById('main-content').focus();
}
element.remove();`,
            location: node.location,
        };
    }
    generateHidingFix(node) {
        const selector = node.element.selector;
        return {
            description: 'Add focus check before hiding element',
            code: `// Check if element or its descendants have focus
const element = document.querySelector('${selector}');
if (element && element.contains(document.activeElement)) {
  // Move focus before hiding
  const nextFocusable = element.previousElementSibling || element.parentElement;
  if (nextFocusable instanceof HTMLElement) {
    nextFocusable.focus();
  }
}
element.style.display = 'none';`,
            location: node.location,
        };
    }
    generateFocusableFix(node, element) {
        const selector = node.element.selector;
        const tagName = element.tagName.toLowerCase();
        return {
            description: `Make <${tagName}> focusable by adding tabindex`,
            code: `// In HTML, add tabindex attribute:
// <${tagName} tabindex="0">...</${tagName}>

// Or in JavaScript:
const element = document.querySelector('${selector}');
element.setAttribute('tabindex', '0');
element.focus();

// Note: Consider using a naturally focusable element instead:
// <button> instead of <div>`,
            location: node.location,
        };
    }
}
exports.FocusManagementAnalyzer = FocusManagementAnalyzer;
