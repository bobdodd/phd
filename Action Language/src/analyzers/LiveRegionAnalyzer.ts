import { BaseAnalyzer, AnalyzerContext, Issue, IssueFix } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';
import { ActionLanguageNode } from '../models/ActionLanguageModel';

/**
 * LiveRegionAnalyzer
 *
 * Detects issues with ARIA live regions that announce dynamic content changes to screen readers.
 *
 * Issue Types (5):
 * 1. live-region-without-updates - aria-live set but content never updated
 * 2. updates-without-live-region - Content updated but no aria-live attribute
 * 3. invalid-live-region-value - aria-live with invalid value (not 'polite'/'assertive'/'off')
 * 4. assertive-overuse - Too many aria-live="assertive" regions (interrupts user)
 * 5. live-region-label-missing - Live region without accessible label
 *
 * WCAG: 4.1.3 (Status Messages) Level AA
 *
 * Key Concepts:
 * - aria-live="polite": Announces when user is idle (most common)
 * - aria-live="assertive": Interrupts immediately (errors/alerts only)
 * - aria-live="off": No announcements (default)
 * - role="status": Implicit polite live region
 * - role="alert": Implicit assertive live region
 *
 * Priority: MEDIUM IMPACT
 * Target: Ensures dynamic content changes are announced to screen readers
 */
export class LiveRegionAnalyzer extends BaseAnalyzer {
  readonly name = 'LiveRegionAnalyzer';
  readonly description = 'Detects issues with ARIA live regions that announce dynamic content changes to screen readers';

  private readonly VALID_LIVE_VALUES = new Set(['polite', 'assertive', 'off']);

  // Roles that have implicit aria-live behavior
  private readonly IMPLICIT_LIVE_ROLES = new Map<string, string>([
    ['alert', 'assertive'],
    ['status', 'polite'],
    ['log', 'polite'],
    ['timer', 'off']
  ]);

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel) {
      return issues;
    }

    if (!context.actionLanguageModel) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();
    const actionNodes = context.actionLanguageModel.nodes;

    // Find all elements with aria-live or implicit live regions
    const liveRegionElements = this.findLiveRegionElements(allElements);

    // Detect live regions that are never updated
    issues.push(...this.detectLiveRegionsWithoutUpdates(liveRegionElements, actionNodes, context));

    // Detect content updates without live regions
    issues.push(...this.detectUpdatesWithoutLiveRegion(allElements, actionNodes, context));

    // Detect invalid aria-live values
    issues.push(...this.detectInvalidLiveRegionValues(liveRegionElements, context));

    // Detect overuse of aria-live="assertive"
    issues.push(...this.detectAssertiveOveruse(liveRegionElements, context));

    // Detect live regions without labels
    issues.push(...this.detectLiveRegionsWithoutLabels(liveRegionElements, context));

    return issues;
  }

  /**
   * Find all elements with aria-live attribute or implicit live region roles
   */
  private findLiveRegionElements(allElements: DOMElement[]): DOMElement[] {
    return allElements.filter(element => {
      // Explicit aria-live attribute
      if (element.attributes['aria-live']) {
        return true;
      }

      // Implicit live region roles
      const role = element.attributes.role;
      if (role && this.IMPLICIT_LIVE_ROLES.has(role)) {
        return true;
      }

      return false;
    });
  }

  /**
   * Detect live regions that have aria-live attribute but content is never updated.
   *
   * Pattern: Element has aria-live but no DOM updates in JavaScript
   * Problem: Misleading - suggests content will update but never does
   * WCAG: 4.1.3 (Status Messages)
   */
  private detectLiveRegionsWithoutUpdates(
    liveRegionElements: DOMElement[],
    actionNodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    for (const element of liveRegionElements) {
      const liveValue = this.getLiveValue(element);

      // Skip aria-live="off" - explicitly disabled
      if (liveValue === 'off') continue;

      // Check if this element or its children are ever updated
      const isUpdated = this.isElementUpdated(element, actionNodes);

      if (!isUpdated) {
        const message = `Element has aria-live="${liveValue}" but content is never updated dynamically. Live regions should only be used when content changes will be announced to screen readers. If this is static content, remove aria-live. If it will be updated, ensure DOM updates (textContent, innerHTML) are implemented.`;

        const fix: IssueFix = {
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

        issues.push(
          this.createIssue(
            'live-region-without-updates',
            'warning',
            message,
            element.location,
            ['4.1.3'],
            context,
            {
              elementContext: context.documentModel?.getElementContext(element),
              fix
            }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Detect DOM content updates without aria-live regions.
   *
   * Pattern: textContent/innerHTML updated but no aria-live on element
   * Problem: Screen readers don't announce dynamic changes
   * WCAG: 4.1.3 (Status Messages)
   */
  private detectUpdatesWithoutLiveRegion(
    allElements: DOMElement[],
    actionNodes: ActionLanguageNode[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    // Find all DOM manipulation actions (textContent, innerHTML, etc.)
    const updateActions = actionNodes.filter(node =>
      node.actionType === 'domManipulation' &&
      (node.metadata?.property === 'textContent' ||
       node.metadata?.property === 'innerHTML' ||
       node.metadata?.property === 'innerText')
    );

    for (const action of updateActions) {
      const selector = action.element.selector;
      const elementId = action.element.id;

      if (!selector && !elementId) continue;

      // Find the target element
      const targetElement = allElements.find(el =>
        (elementId && el.attributes.id === elementId) ||
        (selector && (
          el.attributes.id === selector.replace('#', '') ||
          el.attributes.class?.includes(selector.replace('.', ''))
        ))
      );

      if (!targetElement) continue;

      // Check if element or any ancestor has aria-live
      const hasLiveRegion = this.hasLiveRegionAncestor(targetElement, allElements);

      if (!hasLiveRegion) {
        const property = action.metadata?.property || 'textContent';
        const targetId = elementId || selector;
        const message = `Dynamic content update detected (${property}) but element is not in an ARIA live region. Screen readers won't announce the change. Add aria-live="polite" to this element or a parent container for status messages, or aria-live="assertive" for urgent alerts.`;

        const fix: IssueFix = {
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

        issues.push(
          this.createIssue(
            'updates-without-live-region',
            'error',
            message,
            action.location,
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
   * Detect invalid aria-live values.
   *
   * Pattern: aria-live with value other than 'polite', 'assertive', 'off'
   * Problem: Invalid value is ignored by browsers
   * WCAG: 4.1.3 (Status Messages)
   */
  private detectInvalidLiveRegionValues(
    liveRegionElements: DOMElement[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    for (const element of liveRegionElements) {
      const liveValue = element.attributes['aria-live'];

      // Skip implicit live regions (no explicit aria-live)
      if (!liveValue) continue;

      if (!this.VALID_LIVE_VALUES.has(liveValue)) {
        const message = `Invalid aria-live value: "${liveValue}". Valid values are: "polite" (announce when user is idle), "assertive" (interrupt immediately), or "off" (disable announcements). Invalid values are ignored by browsers.`;

        const fix: IssueFix = {
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

        issues.push(
          this.createIssue(
            'invalid-live-region-value',
            'error',
            message,
            element.location,
            ['4.1.3'],
            context,
            {
              elementContext: context.documentModel?.getElementContext(element),
              fix
            }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Detect overuse of aria-live="assertive".
   *
   * Pattern: Multiple aria-live="assertive" regions on the page
   * Problem: Assertive interrupts user - should be rare (errors/alerts only)
   * WCAG: 4.1.3 (Status Messages)
   */
  private detectAssertiveOveruse(
    liveRegionElements: DOMElement[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    const assertiveRegions = liveRegionElements.filter(element => {
      const liveValue = this.getLiveValue(element);
      return liveValue === 'assertive';
    });

    // Warn if more than 2 assertive regions
    if (assertiveRegions.length > 2) {
      const message = `Multiple aria-live="assertive" regions detected (${assertiveRegions.length} total). Assertive live regions interrupt the user immediately and should be rare. Use "assertive" only for critical alerts and errors. Most status messages should use aria-live="polite" instead.`;

      const fix: IssueFix = {
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

      issues.push(
        this.createIssue(
          'assertive-overuse',
          'warning',
          message,
          assertiveRegions[0].location,
          ['4.1.3'],
          context,
          { fix }
        )
      );
    }

    return issues;
  }

  /**
   * Detect live regions without accessible labels.
   *
   * Pattern: aria-live region without aria-label or role
   * Problem: Screen reader announces content but user doesn't know what region it is
   * WCAG: 4.1.3 (Status Messages)
   */
  private detectLiveRegionsWithoutLabels(
    liveRegionElements: DOMElement[],
    context: AnalyzerContext
  ): Issue[] {
    const issues: Issue[] = [];

    for (const element of liveRegionElements) {
      const liveValue = this.getLiveValue(element);

      // Skip aria-live="off"
      if (liveValue === 'off') continue;

      // Check if element has accessible name
      const hasLabel =
        element.attributes['aria-label'] ||
        element.attributes['aria-labelledby'] ||
        element.attributes.role === 'status' ||
        element.attributes.role === 'alert' ||
        element.attributes.role === 'log';

      if (!hasLabel) {
        const message = `Live region has aria-live="${liveValue}" but no accessible label. Screen readers will announce content changes but users won't know what region it is (status, notification, error, etc.). Add role="status" or role="alert", or use aria-label to identify the region.`;

        const fix: IssueFix = {
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

        issues.push(
          this.createIssue(
            'live-region-label-missing',
            'warning',
            message,
            element.location,
            ['4.1.3'],
            context,
            {
              elementContext: context.documentModel?.getElementContext(element),
              fix
            }
          )
        );
      }
    }

    return issues;
  }

  /**
   * Get effective aria-live value (explicit or implicit from role)
   */
  private getLiveValue(element: DOMElement): string {
    // Explicit aria-live takes precedence
    if (element.attributes['aria-live']) {
      return element.attributes['aria-live'];
    }

    // Check implicit live region roles
    const role = element.attributes.role;
    if (role && this.IMPLICIT_LIVE_ROLES.has(role)) {
      return this.IMPLICIT_LIVE_ROLES.get(role)!;
    }

    return 'off';
  }

  /**
   * Check if element is updated in action nodes
   */
  private isElementUpdated(element: DOMElement, actionNodes: ActionLanguageNode[]): boolean {
    const elementId = element.attributes.id;
    const elementClass = element.attributes.class;

    return actionNodes.some(node => {
      if (node.actionType !== 'domManipulation') return false;

      // Check if this action updates text content
      const updatesText =
        node.metadata?.property === 'textContent' ||
        node.metadata?.property === 'innerHTML' ||
        node.metadata?.property === 'innerText';

      if (!updatesText) return false;

      // Check if this action targets our element
      const targetId = node.element.id;
      const selector = node.element.selector;

      return (
        (targetId && targetId === elementId) ||
        (selector && elementId && selector.includes(elementId)) ||
        (selector && elementClass && selector.includes(elementClass))
      );
    });
  }

  /**
   * Check if element or any ancestor has aria-live
   */
  private hasLiveRegionAncestor(element: DOMElement, _allElements: DOMElement[]): boolean {
    let current: DOMElement | undefined = element;

    while (current) {
      // Check if current element has aria-live
      if (current.attributes['aria-live']) {
        return true;
      }

      // Check if current element has implicit live region role
      const role = current.attributes.role;
      if (role && this.IMPLICIT_LIVE_ROLES.has(role)) {
        return true;
      }

      current = current.parent;
    }

    return false;
  }
}
