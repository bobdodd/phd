"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AriaStateManagementAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class AriaStateManagementAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'AriaStateManagementAnalyzer';
        this.description = 'Detects ARIA state attributes that are never updated dynamically, causing screen readers to announce incorrect states';
    }
    analyze(context) {
        const issues = [];
        if (!context.documentModel || !context.documentModel.dom) {
            return issues;
        }
        if (!context.actionLanguageModel) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        this.checkExpandedState(allElements, context, issues);
        this.checkSelectedState(allElements, context, issues);
        this.checkCheckedState(allElements, context, issues);
        this.checkLiveRegionAssertiveness(allElements, context, issues);
        return issues;
    }
    checkExpandedState(allElements, context, issues) {
        const expandableElements = allElements.filter(el => el.attributes['aria-expanded'] !== undefined);
        for (const element of expandableElements) {
            const hasUpdateMechanism = this.hasAriaAttributeUpdate(element, 'aria-expanded', context);
            if (!hasUpdateMechanism) {
                const currentValue = element.attributes['aria-expanded'];
                issues.push(this.createIssue('aria-expanded-never-updated', 'warning', `Element has aria-expanded="${currentValue}" but no JavaScript code updates this attribute. Screen readers will always announce the same state even when the element's expansion state changes visually. Add setAttribute('aria-expanded', ...) in your toggle handler.`, element.location, ['4.1.2'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix: {
                        description: `Update aria-expanded when toggling visibility:

Example for accordion/disclosure:
button.addEventListener('click', () => {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !isExpanded);
  // Toggle content visibility
  content.hidden = isExpanded;
});`,
                        code: `// Update aria-expanded dynamically
element.addEventListener('click', () => {
  const expanded = element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', String(!expanded));
});`,
                        location: element.location
                    }
                }));
            }
        }
    }
    checkSelectedState(allElements, context, issues) {
        const selectableElements = allElements.filter(el => el.attributes['aria-selected'] !== undefined);
        if (selectableElements.length === 0)
            return;
        const hasAnyUpdate = selectableElements.some(el => this.hasAriaAttributeUpdate(el, 'aria-selected', context));
        if (!hasAnyUpdate) {
            const firstElement = selectableElements[0];
            const role = firstElement.attributes.role || 'element';
            issues.push(this.createIssue('aria-selected-never-updated', 'warning', `Found ${selectableElements.length} element(s) with aria-selected but no JavaScript updates this attribute. For ${role}s, you must update aria-selected="true" on the active item and aria-selected="false" on others when selection changes.`, firstElement.location, ['4.1.2'], context, {
                elementContext: context.documentModel?.getElementContext(firstElement),
                fix: {
                    description: `Update aria-selected when selection changes:

Example for tabs:
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove selection from all tabs
    tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
    // Set current tab as selected
    tab.setAttribute('aria-selected', 'true');
  });
});`,
                    code: `// Update aria-selected dynamically
element.addEventListener('click', () => {
  // Clear previous selection
  siblings.forEach(el => el.setAttribute('aria-selected', 'false'));
  // Set new selection
  element.setAttribute('aria-selected', 'true');
});`,
                    location: firstElement.location
                }
            }));
        }
    }
    checkCheckedState(allElements, context, issues) {
        const checkableElements = allElements.filter(el => el.attributes['aria-checked'] !== undefined);
        for (const element of checkableElements) {
            const hasUpdateMechanism = this.hasAriaAttributeUpdate(element, 'aria-checked', context);
            if (!hasUpdateMechanism) {
                const currentValue = element.attributes['aria-checked'];
                const role = element.attributes.role || 'element';
                issues.push(this.createIssue('aria-checked-never-updated', 'warning', `Custom ${role} has aria-checked="${currentValue}" but no JavaScript updates this attribute. Screen readers will always announce "${currentValue}" even when the checked state changes visually. Add setAttribute('aria-checked', ...) in your click handler.`, element.location, ['4.1.2'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix: {
                        description: `Update aria-checked when toggling:

Example for custom checkbox:
checkbox.addEventListener('click', () => {
  const checked = checkbox.getAttribute('aria-checked') === 'true';
  checkbox.setAttribute('aria-checked', String(!checked));
});

For tristate checkbox, use 'true', 'false', or 'mixed'.`,
                        code: `// Update aria-checked dynamically
element.addEventListener('click', () => {
  const checked = element.getAttribute('aria-checked') === 'true';
  element.setAttribute('aria-checked', String(!checked));
});`,
                        location: element.location
                    }
                }));
            }
        }
    }
    checkLiveRegionAssertiveness(allElements, context, issues) {
        const assertiveRegions = allElements.filter(el => el.attributes['aria-live'] === 'assertive');
        if (assertiveRegions.length === 0)
            return;
        if (assertiveRegions.length > 2) {
            const firstRegion = assertiveRegions[0];
            issues.push(this.createIssue('aria-live-assertive-overuse', 'info', `Found ${assertiveRegions.length} aria-live="assertive" regions. Assertive announcements interrupt screen readers immediately and should be reserved for critical alerts (errors, warnings). Use aria-live="polite" for most status updates.`, firstRegion.location, ['4.1.2'], context, {
                elementContext: context.documentModel?.getElementContext(firstRegion),
                fix: {
                    description: `Use aria-live="polite" for non-critical updates:

Assertive (interrupts immediately):
- Critical errors
- Time-sensitive alerts
- Security warnings

Polite (waits for user to pause):
- Success messages
- Form validation feedback
- Progress updates
- General status messages`,
                    code: `<!-- Use polite for most updates -->
<div aria-live="polite" aria-atomic="true">
  <!-- Status updates -->
</div>

<!-- Reserve assertive for critical alerts only -->
<div aria-live="assertive" role="alert">
  <!-- Critical error messages only -->
</div>`,
                    location: firstRegion.location
                }
            }));
        }
        else {
            for (const region of assertiveRegions) {
                issues.push(this.createIssue('aria-live-assertive-usage', 'info', `aria-live="assertive" interrupts screen readers immediately. Verify this is truly critical (errors, time-sensitive alerts). For non-critical updates (success messages, status updates), use aria-live="polite" instead.`, region.location, ['4.1.2'], context, {
                    elementContext: context.documentModel?.getElementContext(region),
                    fix: {
                        description: `Consider using aria-live="polite" unless this is a critical alert:

Change to polite if this is:
- A success/confirmation message
- Form validation feedback
- Progress indicator
- General status update

Keep assertive only if this is:
- A critical error that requires immediate attention
- A time-sensitive warning
- A security alert`,
                        code: `<!-- Change to polite for most cases -->
<div aria-live="polite" aria-atomic="true">
  <!-- Non-critical updates -->
</div>`,
                        location: region.location
                    }
                }));
            }
        }
    }
    hasAriaAttributeUpdate(element, ariaAttribute, context) {
        if (!context.actionLanguageModel)
            return false;
        const elementContext = context.documentModel?.getElementContext(element);
        if (!elementContext?.jsHandlers)
            return false;
        for (const handler of elementContext.jsHandlers) {
            const code = this.getHandlerCode(handler);
            if (this.codeUpdatesAriaAttribute(code, ariaAttribute)) {
                return true;
            }
        }
        const allHandlers = context.actionLanguageModel.getAllEventHandlers();
        for (const handler of allHandlers) {
            const code = this.getHandlerCode(handler);
            if (this.codeUpdatesAriaAttribute(code, ariaAttribute)) {
                const elementId = element.attributes.id;
                const elementClass = element.attributes.class;
                if (elementId && code.includes(elementId)) {
                    return true;
                }
                if (elementClass && code.includes(elementClass)) {
                    return true;
                }
                return true;
            }
        }
        return false;
    }
    codeUpdatesAriaAttribute(code, ariaAttribute) {
        const setAttributePattern = new RegExp(`setAttribute\\s*\\(\\s*['"\`]${ariaAttribute}['"\`]`, 'i');
        if (setAttributePattern.test(code))
            return true;
        if (ariaAttribute === 'aria-expanded' && /\.ariaExpanded\s*=/i.test(code)) {
            return true;
        }
        if (ariaAttribute === 'aria-selected' && /\.ariaSelected\s*=/i.test(code)) {
            return true;
        }
        if (ariaAttribute === 'aria-checked' && /\.ariaChecked\s*=/i.test(code)) {
            return true;
        }
        return false;
    }
    getHandlerCode(handler) {
        if (typeof handler.handler === 'string') {
            return handler.handler;
        }
        if (handler.handler && typeof handler.handler.toString === 'function') {
            return handler.handler.toString();
        }
        return '';
    }
}
exports.AriaStateManagementAnalyzer = AriaStateManagementAnalyzer;
