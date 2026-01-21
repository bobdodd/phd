"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveRegionAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class LiveRegionAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'LiveRegionAnalyzer';
        this.description = 'Detects issues with ARIA live regions that announce dynamic content changes to screen readers';
        this.VALID_LIVE_VALUES = new Set(['polite', 'assertive', 'off']);
        this.IMPLICIT_LIVE_ROLES = new Map([
            ['alert', 'assertive'],
            ['status', 'polite'],
            ['log', 'polite'],
            ['timer', 'off']
        ]);
    }
    analyze(context) {
        const issues = [];
        if (!context.documentModel) {
            return issues;
        }
        if (!context.actionLanguageModel) {
            return issues;
        }
        const allElements = context.documentModel.getAllElements();
        const actionNodes = context.actionLanguageModel.nodes;
        const liveRegionElements = this.findLiveRegionElements(allElements);
        issues.push(...this.detectLiveRegionsWithoutUpdates(liveRegionElements, actionNodes, context));
        issues.push(...this.detectUpdatesWithoutLiveRegion(allElements, actionNodes, context));
        issues.push(...this.detectInvalidLiveRegionValues(liveRegionElements, context));
        issues.push(...this.detectAssertiveOveruse(liveRegionElements, context));
        issues.push(...this.detectLiveRegionsWithoutLabels(liveRegionElements, context));
        return issues;
    }
    findLiveRegionElements(allElements) {
        return allElements.filter(element => {
            if (element.attributes['aria-live']) {
                return true;
            }
            const role = element.attributes.role;
            if (role && this.IMPLICIT_LIVE_ROLES.has(role)) {
                return true;
            }
            return false;
        });
    }
    detectLiveRegionsWithoutUpdates(liveRegionElements, actionNodes, context) {
        const issues = [];
        for (const element of liveRegionElements) {
            const liveValue = this.getLiveValue(element);
            if (liveValue === 'off')
                continue;
            const isUpdated = this.isElementUpdated(element, actionNodes);
            if (!isUpdated) {
                const message = `Element has aria-live="${liveValue}" but content is never updated dynamically. Live regions should only be used when content changes will be announced to screen readers. If this is static content, remove aria-live. If it will be updated, ensure DOM updates (textContent, innerHTML) are implemented.`;
                const fix = {
                    description: 'Add DOM update logic or remove aria-live',
                    code: `// Option 1: If content will be updated, add update logic
const statusRegion = document.getElementById('${element.attributes.id || 'status'}');

// When status changes (e.g., after async operation)
function updateStatus(message) {
  statusRegion.textContent = message;
  // Screen reader announces: "Status: {message}"
}

// Option 2: If content is static, remove aria-live
<div role="status">
  <!-- Remove aria-live="${liveValue}" if this never changes -->
  Static message
</div>`,
                    location: element.location
                };
                issues.push(this.createIssue('live-region-without-updates', 'warning', message, element.location, ['4.1.3'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix
                }));
            }
        }
        return issues;
    }
    detectUpdatesWithoutLiveRegion(allElements, actionNodes, context) {
        const issues = [];
        const updateActions = actionNodes.filter(node => node.actionType === 'domManipulation' &&
            (node.metadata?.property === 'textContent' ||
                node.metadata?.property === 'innerHTML' ||
                node.metadata?.property === 'innerText'));
        for (const action of updateActions) {
            const selector = action.element.selector;
            const elementId = action.element.id;
            if (!selector && !elementId)
                continue;
            const targetElement = allElements.find(el => (elementId && el.attributes.id === elementId) ||
                (selector && (el.attributes.id === selector.replace('#', '') ||
                    el.attributes.class?.includes(selector.replace('.', '')))));
            if (!targetElement)
                continue;
            const hasLiveRegion = this.hasLiveRegionAncestor(targetElement, allElements);
            if (!hasLiveRegion) {
                const property = action.metadata?.property || 'textContent';
                const targetId = elementId || selector;
                const message = `Dynamic content update detected (${property}) but element is not in an ARIA live region. Screen readers won't announce the change. Add aria-live="polite" to this element or a parent container for status messages, or aria-live="assertive" for urgent alerts.`;
                const fix = {
                    description: 'Add aria-live to announce updates',
                    code: `<!-- Add aria-live to the container that updates -->
<div id="${targetId}"
     role="status"
     aria-live="polite"
     aria-atomic="true">
  <!-- Content that updates dynamically -->
</div>

<script>
// Updates will now be announced
document.getElementById('${targetId}').textContent = 'New message';
// Screen reader announces: "Status: New message"
</script>`,
                    location: action.location
                };
                issues.push(this.createIssue('updates-without-live-region', 'error', message, action.location, ['4.1.3'], context, { fix }));
            }
        }
        return issues;
    }
    detectInvalidLiveRegionValues(liveRegionElements, context) {
        const issues = [];
        for (const element of liveRegionElements) {
            const liveValue = element.attributes['aria-live'];
            if (!liveValue)
                continue;
            if (!this.VALID_LIVE_VALUES.has(liveValue)) {
                const message = `Invalid aria-live value: "${liveValue}". Valid values are: "polite" (announce when user is idle), "assertive" (interrupt immediately), or "off" (disable announcements). Invalid values are ignored by browsers.`;
                const fix = {
                    description: 'Use valid aria-live value',
                    code: `<!-- For status messages, confirmations, progress updates -->
<div aria-live="polite" role="status">
  Operation completed successfully
</div>

<!-- For urgent alerts, errors (use sparingly!) -->
<div aria-live="assertive" role="alert">
  Error: Payment failed
</div>

<!-- To disable announcements -->
<div aria-live="off">
  No announcements needed
</div>`,
                    location: element.location
                };
                issues.push(this.createIssue('invalid-live-region-value', 'error', message, element.location, ['4.1.3'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix
                }));
            }
        }
        return issues;
    }
    detectAssertiveOveruse(liveRegionElements, context) {
        const issues = [];
        const assertiveRegions = liveRegionElements.filter(element => {
            const liveValue = this.getLiveValue(element);
            return liveValue === 'assertive';
        });
        if (assertiveRegions.length > 2) {
            const message = `Multiple aria-live="assertive" regions detected (${assertiveRegions.length} total). Assertive live regions interrupt the user immediately and should be rare. Use "assertive" only for critical alerts and errors. Most status messages should use aria-live="polite" instead.`;
            const fix = {
                description: 'Reduce assertive regions, use polite instead',
                code: `<!-- Use "polite" for most status messages -->
<div aria-live="polite" role="status">
  Form saved successfully
</div>

<div aria-live="polite" role="status">
  3 items added to cart
</div>

<!-- Reserve "assertive" for critical alerts only -->
<div aria-live="assertive" role="alert">
  Error: Session expired. Please log in again.
</div>`,
                location: assertiveRegions[0].location
            };
            issues.push(this.createIssue('assertive-overuse', 'warning', message, assertiveRegions[0].location, ['4.1.3'], context, { fix }));
        }
        return issues;
    }
    detectLiveRegionsWithoutLabels(liveRegionElements, context) {
        const issues = [];
        for (const element of liveRegionElements) {
            const liveValue = this.getLiveValue(element);
            if (liveValue === 'off')
                continue;
            const hasLabel = element.attributes['aria-label'] ||
                element.attributes['aria-labelledby'] ||
                element.attributes.role === 'status' ||
                element.attributes.role === 'alert' ||
                element.attributes.role === 'log';
            if (!hasLabel) {
                const message = `Live region has aria-live="${liveValue}" but no accessible label. Screen readers will announce content changes but users won't know what region it is (status, notification, error, etc.). Add role="status" or role="alert", or use aria-label to identify the region.`;
                const fix = {
                    description: 'Add role or aria-label to identify region',
                    code: `<!-- Option 1: Use semantic role (recommended) -->
<div aria-live="polite" role="status">
  <!-- Screen reader: "Status: {content}" -->
</div>

<!-- Option 2: Use aria-label -->
<div aria-live="polite" aria-label="Notification">
  <!-- Screen reader: "Notification: {content}" -->
</div>

<!-- Option 3: For alerts -->
<div aria-live="assertive" role="alert">
  <!-- Screen reader: "Alert: {content}" -->
</div>`,
                    location: element.location
                };
                issues.push(this.createIssue('live-region-label-missing', 'warning', message, element.location, ['4.1.3'], context, {
                    elementContext: context.documentModel?.getElementContext(element),
                    fix
                }));
            }
        }
        return issues;
    }
    getLiveValue(element) {
        if (element.attributes['aria-live']) {
            return element.attributes['aria-live'];
        }
        const role = element.attributes.role;
        if (role && this.IMPLICIT_LIVE_ROLES.has(role)) {
            return this.IMPLICIT_LIVE_ROLES.get(role);
        }
        return 'off';
    }
    isElementUpdated(element, actionNodes) {
        const elementId = element.attributes.id;
        const elementClass = element.attributes.class;
        return actionNodes.some(node => {
            if (node.actionType !== 'domManipulation')
                return false;
            const updatesText = node.metadata?.property === 'textContent' ||
                node.metadata?.property === 'innerHTML' ||
                node.metadata?.property === 'innerText';
            if (!updatesText)
                return false;
            const targetId = node.element.id;
            const selector = node.element.selector;
            return ((targetId && targetId === elementId) ||
                (selector && elementId && selector.includes(elementId)) ||
                (selector && elementClass && selector.includes(elementClass)));
        });
    }
    hasLiveRegionAncestor(element, _allElements) {
        let current = element;
        while (current) {
            if (current.attributes['aria-live']) {
                return true;
            }
            const role = current.attributes.role;
            if (role && this.IMPLICIT_LIVE_ROLES.has(role)) {
                return true;
            }
            current = current.parent;
        }
        return false;
    }
}
exports.LiveRegionAnalyzer = LiveRegionAnalyzer;
