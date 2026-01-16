"use strict";
/**
 * Focus Management Analyzer
 *
 * Detects focus management issues that can leave keyboard users stranded.
 * These are critical WCAG 2.4.3 (Focus Order) and 2.4.7 (Focus Visible) violations.
 *
 * WCAG Success Criteria:
 * - 2.4.3 Focus Order (Level A): Focus order must be logical and consistent
 * - 2.4.7 Focus Visible (Level AA): Keyboard focus indicator must be visible
 *
 * Issues Detected:
 * 1. removal-without-focus-management - element.remove() without focus check
 * 2. hiding-without-focus-management - element hidden without focus check
 * 3. hiding-class-without-focus-management - classList may hide element
 * 4. possibly-non-focusable - .focus() on non-focusable element
 * 5. standalone-blur - .blur() without moving focus
 * 6. focus-restoration-missing - modal closed without focus restoration
 *
 * Why This Matters:
 * - Removing/hiding focused elements can leave keyboard users with no visible focus
 * - Calling .focus() on non-focusable elements silently fails
 * - Calling .blur() without moving focus leaves no focused element
 * - These issues are invisible to mouse users but critical for keyboard users
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusManagementAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class FocusManagementAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'focus-management';
        this.description = 'Detects focus management issues that can strand keyboard users';
    }
    /**
     * Analyze for focus management issues.
     *
     * Works in both file-scope and document-scope:
     * - File-scope: Detects patterns in individual files
     * - Document-scope: Better accuracy with full element context
     */
    analyze(context) {
        const issues = [];
        if (context.documentModel) {
            // Document-scope: Analyze with full context
            issues.push(...this.analyzeWithDocumentModel(context));
        }
        else if (context.actionLanguageModel) {
            // File-scope: Analyze individual file
            issues.push(...this.analyzeFileScope(context));
        }
        return issues;
    }
    /**
     * Document-scope analysis with full DOM + JS context.
     */
    analyzeWithDocumentModel(context) {
        const issues = [];
        const documentModel = context.documentModel;
        // Analyze all JavaScript models
        for (const jsModel of documentModel.javascript) {
            // Check for element removal without focus management
            issues.push(...this.detectRemovalWithoutFocusCheck(jsModel, context));
            // Check for element hiding without focus management
            issues.push(...this.detectHidingWithoutFocusCheck(jsModel, context));
            // Check for .focus() on potentially non-focusable elements
            issues.push(...this.detectNonFocusableFocus(jsModel, context));
            // Check for standalone .blur() calls
            issues.push(...this.detectStandaloneBlur(jsModel, context));
            // Check for modal close without focus restoration
            issues.push(...this.detectMissingFocusRestoration(jsModel, context));
        }
        return issues;
    }
    /**
     * File-scope analysis (backward compatible).
     */
    analyzeFileScope(context) {
        const issues = [];
        const model = context.actionLanguageModel;
        // Check for removal patterns
        issues.push(...this.detectRemovalWithoutFocusCheck(model, context));
        // Check for hiding patterns
        issues.push(...this.detectHidingWithoutFocusCheck(model, context));
        // Check for .focus() calls
        issues.push(...this.detectNonFocusableFocus(model, context));
        // Check for .blur() calls
        issues.push(...this.detectStandaloneBlur(model, context));
        // Check for modal/dialog close without focus restoration
        issues.push(...this.detectMissingFocusRestoration(model, context));
        return issues;
    }
    /**
     * Detect element.remove() without checking if element has focus.
     *
     * Pattern: element.remove()
     * Problem: If element (or descendant) has focus, focus is lost
     * Fix: Check document.activeElement before removing
     */
    detectRemovalWithoutFocusCheck(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            // Look for domManipulation actions that remove elements
            if (node.actionType === 'domManipulation' &&
                node.metadata?.operation === 'remove') {
                // Skip if this looks like a dialog - will be handled by detectMissingFocusRestoration
                const selector = node.element.selector.toLowerCase();
                const binding = node.element.binding?.toLowerCase() || '';
                const looksLikeDialog = node.metadata?.role === 'dialog' ||
                    selector.match(/#[^#]*dialog/i) ||
                    binding.includes('dialog');
                if (looksLikeDialog) {
                    continue; // Will be handled by focus restoration detector
                }
                // Check if there's a focus check nearby
                const hasFocusCheck = this.hasFocusCheckNearby(nodes, node);
                if (!hasFocusCheck) {
                    const message = `Element removal without focus management. If the removed element (or its children) has focus, keyboard users will lose their place. Check document.activeElement before removing.`;
                    const fix = this.generateRemovalFix(node);
                    issues.push(this.createIssue('removal-without-focus-management', 'warning', message, node.location, ['2.4.3', '2.4.7'], // WCAG 2.4.3: Focus Order, 2.4.7: Focus Visible
                    context, { fix }));
                }
            }
        }
        return issues;
    }
    /**
     * Detect element hiding without checking if element has focus.
     *
     * Patterns:
     * - element.style.display = 'none'
     * - element.style.visibility = 'hidden'
     * - element.hidden = true
     */
    detectHidingWithoutFocusCheck(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            // Look for domManipulation actions that hide elements
            if (node.actionType === 'domManipulation' &&
                (node.metadata?.operation === 'hide' ||
                    node.metadata?.property === 'display' ||
                    node.metadata?.property === 'visibility' ||
                    node.metadata?.property === 'hidden')) {
                // Skip if this looks like a dialog - will be handled by detectMissingFocusRestoration
                const selector = node.element.selector.toLowerCase();
                const binding = node.element.binding?.toLowerCase() || '';
                const looksLikeDialog = node.metadata?.role === 'dialog' ||
                    selector.match(/#[^#]*dialog/i) ||
                    binding.includes('dialog');
                if (looksLikeDialog) {
                    continue; // Will be handled by focus restoration detector
                }
                // Check if there's a focus check nearby
                const hasFocusCheck = this.hasFocusCheckNearby(nodes, node);
                if (!hasFocusCheck) {
                    const message = `Element hidden without focus management. If the hidden element (or its children) has focus, keyboard users will lose their place. Move focus before hiding.`;
                    const fix = this.generateHidingFix(node);
                    issues.push(this.createIssue('hiding-without-focus-management', 'warning', message, node.location, ['2.4.3', '2.4.7'], context, { fix }));
                }
            }
            // Check for classList operations that might hide
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
    /**
     * Detect .focus() called on potentially non-focusable elements.
     *
     * Pattern: element.focus() where element is not naturally focusable
     * Problem: Call silently fails, no focus change occurs
     * Fix: Add tabindex="0" or use naturally focusable element
     */
    detectNonFocusableFocus(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            // Look for focus changes
            if (node.actionType === 'focusChange' && node.timing === 'immediate') {
                // Check if element is focusable
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
                    // Element not in DOM, check selector for hints
                    const selector = node.element.selector.toLowerCase();
                    const naturallyFocusableTags = ['button', 'input', 'select', 'textarea', 'a'];
                    // Skip if selector suggests naturally focusable element
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
    /**
     * Detect standalone .blur() calls without moving focus.
     *
     * Pattern: element.blur()
     * Problem: Leaves no focused element, keyboard users lose their place
     * Fix: Move focus to specific element instead
     */
    detectStandaloneBlur(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        for (const node of nodes) {
            // Look for blur actions
            if (node.actionType === 'focusChange' && node.metadata?.method === 'blur') {
                // Check if there's a focus call nearby (within a few nodes)
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
    /**
     * Detect modal/dialog close without focus restoration.
     *
     * Pattern: Modal closes but doesn't restore focus to trigger element
     * Problem: Keyboard users lose their place when modal closes
     * Fix: Store previousActiveElement and restore on close
     */
    detectMissingFocusRestoration(model, context) {
        const issues = [];
        const nodes = Array.isArray(model) ? model : model.nodes;
        // Look for patterns that suggest modal/dialog close
        for (const node of nodes) {
            if (node.actionType === 'domManipulation' &&
                (node.metadata?.operation === 'hide' || node.metadata?.operation === 'remove')) {
                // Check if this looks like a dialog close (stricter than general modal)
                // Only trigger for explicit dialog patterns or role
                const selector = node.element.selector.toLowerCase();
                const binding = node.element.binding?.toLowerCase() || '';
                const looksLikeDialogClose = node.metadata?.role === 'dialog' || // Explicit dialog role
                    selector.match(/#[^#]*dialog/i) || // ID contains "dialog"
                    binding.includes('dialog'); // Variable named "dialog"
                if (looksLikeDialogClose) {
                    // Check if there's focus restoration logic
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
    /**
     * Check if there's a focus check (document.activeElement) nearby.
     */
    hasFocusCheckNearby(nodes, targetNode) {
        // Look for document.activeElement access within 5 nodes
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
    /**
     * Check if there's a .focus() call nearby.
     */
    hasFocusCallNearby(nodes, targetNode) {
        // Look for .focus() within 3 nodes
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
    /**
     * Check if there's focus restoration logic nearby.
     */
    hasFocusRestorationNearby(nodes, targetNode) {
        // Look for previousFocus, previousActiveElement, or similar pattern
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
    /**
     * Check if an element is focusable.
     */
    isElementFocusable(element) {
        // Check explicit tabindex
        const tabindex = element.attributes.tabindex;
        if (tabindex !== undefined) {
            return parseInt(tabindex) >= 0;
        }
        // Check naturally focusable elements
        const focusableTags = ['a', 'button', 'input', 'select', 'textarea', 'iframe'];
        const tagName = element.tagName.toLowerCase();
        if (focusableTags.includes(tagName)) {
            // <a> requires href to be focusable
            if (tagName === 'a') {
                return element.attributes.href !== undefined;
            }
            return true;
        }
        return false;
    }
    /**
     * Generate fix for removal without focus check.
     */
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
    /**
     * Generate fix for hiding without focus check.
     */
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
    /**
     * Generate fix for non-focusable element.
     */
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
//# sourceMappingURL=FocusManagementAnalyzer.js.map