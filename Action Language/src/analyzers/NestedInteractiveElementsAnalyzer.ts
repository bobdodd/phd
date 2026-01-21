import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * NestedInteractiveElementsAnalyzer - Detects nested interactive elements
 *
 * Implements WCAG 2.1.1 (Keyboard) Level A
 *
 * Detects:
 * - Buttons nested inside links (or vice versa)
 * - Links nested inside other links
 * - Buttons nested inside other buttons
 * - Interactive elements nested inside form labels
 * - Interactive elements with interactive children
 *
 * Priority: MEDIUM IMPACT
 * Target: Prevents focus conflicts and broken keyboard navigation
 */
export class NestedInteractiveElementsAnalyzer extends BaseAnalyzer {
  readonly name = 'NestedInteractiveElementsAnalyzer';
  readonly description = 'Detects nested interactive elements that create focus conflicts and broken keyboard navigation';

  // Interactive elements that should not be nested
  private readonly INTERACTIVE_ELEMENTS = new Set([
    'a',
    'button',
    'input',
    'select',
    'textarea',
    'audio',
    'video',
    'details',
    'embed',
    'iframe',
    'label'
  ]);

  // Interactive ARIA roles
  private readonly INTERACTIVE_ROLES = new Set([
    'button',
    'link',
    'checkbox',
    'radio',
    'textbox',
    'searchbox',
    'combobox',
    'listbox',
    'option',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'tab',
    'switch',
    'slider',
    'spinbutton',
    'gridcell'
  ]);

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel || !context.documentModel.dom) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();

    for (const element of allElements) {
      if (this.isInteractive(element)) {
        this.checkForNestedInteractive(element, allElements, context, issues);
      }
    }

    return issues;
  }

  /**
   * Check if element is interactive
   */
  private isInteractive(element: DOMElement): boolean {
    // Check tag name
    if (this.INTERACTIVE_ELEMENTS.has(element.tagName)) {
      // Special cases
      if (element.tagName === 'a' && !element.attributes.href) {
        return false; // <a> without href is not interactive
      }
      if (element.tagName === 'input' && element.attributes.type === 'hidden') {
        return false; // Hidden inputs are not interactive
      }
      return true;
    }

    // Check ARIA role
    const role = element.attributes.role;
    if (role && this.INTERACTIVE_ROLES.has(role)) {
      return true;
    }

    // Check if element has click/keyboard handlers (from ActionLanguage)
    const elementContext = element.metadata?.elementContext;
    if (elementContext?.jsHandlers && elementContext.jsHandlers.length > 0) {
      return true;
    }

    return false;
  }

  /**
   * Check for nested interactive elements
   */
  private checkForNestedInteractive(
    element: DOMElement,
    allElements: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const descendants = this.getDescendants(element, allElements);

    for (const descendant of descendants) {
      if (this.isInteractive(descendant)) {
        this.reportNestedInteractive(element, descendant, context, issues);
      }
    }
  }

  /**
   * Report nested interactive element issue
   */
  private reportNestedInteractive(
    parent: DOMElement,
    child: DOMElement,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const parentType = this.getInteractiveType(parent);
    const childType = this.getInteractiveType(child);

    // Determine severity based on combination
    const severity = this.getSeverity(parent, child);

    // Determine specific issue type
    const issueType = this.getIssueType(parent, child);

    const parentName = this.getElementName(parent);
    const childName = this.getElementName(child);

    issues.push(
      this.createIssue(
        issueType,
        severity,
        `${parentType} contains nested ${childType}. ${parentName} contains ${childName}. Nested interactive elements create focus conflicts and confuse screen readers. Only the outer element will be keyboard accessible. Move the inner interactive element outside or remove its interactive behavior.`,
        parent.location,
        ['2.1.1'],
        context,
        {
          elementContext: context.documentModel?.getElementContext(parent),
          fix: {
            description: this.getFixDescription(parent, child),
            code: this.getFixCode(parent, child),
            location: parent.location
          }
        }
      )
    );
  }

  /**
   * Get severity based on element combination
   */
  private getSeverity(parent: DOMElement, child: DOMElement): 'error' | 'warning' {
    // Button inside link or link inside button = ERROR (most common mistake)
    if (
      (parent.tagName === 'a' && (child.tagName === 'button' || child.attributes.role === 'button')) ||
      (parent.tagName === 'button' && (child.tagName === 'a' || child.attributes.role === 'link'))
    ) {
      return 'error';
    }

    // Link inside link = ERROR
    if (parent.tagName === 'a' && child.tagName === 'a') {
      return 'error';
    }

    // Button inside button = ERROR
    if (parent.tagName === 'button' && child.tagName === 'button') {
      return 'error';
    }

    // Interactive inside label = WARNING
    if (parent.tagName === 'label') {
      return 'warning';
    }

    // Other combinations = WARNING
    return 'warning';
  }

  /**
   * Get specific issue type
   */
  private getIssueType(parent: DOMElement, child: DOMElement): string {
    if (parent.tagName === 'a' && child.tagName === 'button') {
      return 'button-inside-link';
    }
    if (parent.tagName === 'button' && child.tagName === 'a') {
      return 'link-inside-button';
    }
    if (parent.tagName === 'a' && child.tagName === 'a') {
      return 'nested-links';
    }
    if (parent.tagName === 'button' && child.tagName === 'button') {
      return 'nested-buttons';
    }
    if (parent.tagName === 'label') {
      return 'interactive-inside-label';
    }
    return 'nested-interactive-elements';
  }

  /**
   * Get interactive type for display
   */
  private getInteractiveType(element: DOMElement): string {
    const role = element.attributes.role;

    if (element.tagName === 'a') return 'Link';
    if (element.tagName === 'button') return 'Button';
    if (element.tagName === 'input') return 'Input';
    if (element.tagName === 'select') return 'Select';
    if (element.tagName === 'textarea') return 'Textarea';
    if (element.tagName === 'label') return 'Label';

    if (role === 'button') return 'Button (ARIA)';
    if (role === 'link') return 'Link (ARIA)';
    if (role === 'checkbox') return 'Checkbox (ARIA)';
    if (role === 'radio') return 'Radio (ARIA)';

    if (role) return `${role} (ARIA)`;

    return 'Interactive element';
  }

  /**
   * Get element name for display
   */
  private getElementName(element: DOMElement): string {
    // Try to get text content or accessible name
    const ariaLabel = element.attributes['aria-label'];
    if (ariaLabel) return `"${ariaLabel}"`;

    // Try to get text content (simplified)
    const textContent = this.getSimpleTextContent(element);
    if (textContent && textContent.length < 50) {
      return `"${textContent}"`;
    }

    // Try to get href for links
    if (element.tagName === 'a' && element.attributes.href) {
      return `href="${element.attributes.href}"`;
    }

    // Try to get id or class
    if (element.attributes.id) {
      return `id="${element.attributes.id}"`;
    }
    if (element.attributes.class) {
      const firstClass = element.attributes.class.split(' ')[0];
      return `class="${firstClass}"`;
    }

    return 'element';
  }

  /**
   * Get simple text content (first few words)
   */
  private getSimpleTextContent(element: DOMElement): string {
    // Use textContent if available
    if (element.textContent) {
      return element.textContent.trim().substring(0, 50);
    }

    // Check first child's textContent
    if (element.children && element.children.length > 0) {
      const firstChild = element.children[0];
      if (firstChild.textContent) {
        return firstChild.textContent.trim().substring(0, 50);
      }
    }

    return '';
  }

  /**
   * Get fix description
   */
  private getFixDescription(parent: DOMElement, child: DOMElement): string {
    if (parent.tagName === 'a' && child.tagName === 'button') {
      return `Remove the nested button or restructure:

Option 1: Use only the link (remove button)
<a href="/action">Action Text</a>

Option 2: Use only the button (remove link)
<button onclick="location.href='/action'">Action Text</button>

Option 3: Separate them (recommended)
<div>
  <a href="/action">Link Text</a>
  <button>Button Text</button>
</div>`;
    }

    if (parent.tagName === 'button' && child.tagName === 'a') {
      return `Remove the nested link or restructure:

Option 1: Use only the button
<button onclick="handleAction()">Action Text</button>

Option 2: Use only the link
<a href="/action">Action Text</a>

Option 3: Separate them (recommended)
<div>
  <button>Button Text</button>
  <a href="/link">Link Text</a>
</div>`;
    }

    if (parent.tagName === 'a' && child.tagName === 'a') {
      return `Remove nested link:

Bad (nested):
<a href="/parent">
  Parent link
  <a href="/child">Child link</a>
</a>

Good (separate):
<div>
  <a href="/parent">Parent link</a>
  <a href="/child">Child link</a>
</div>`;
    }

    if (parent.tagName === 'label') {
      return `Move interactive element outside label:

Bad (button inside label):
<label>
  Name:
  <input type="text" name="name">
  <button>Clear</button>
</label>

Good (separate):
<div>
  <label>
    Name:
    <input type="text" name="name">
  </label>
  <button>Clear</button>
</div>`;
    }

    return `Restructure to avoid nesting interactive elements. Each interactive element should be a separate, non-nested element.`;
  }

  /**
   * Get fix code
   */
  private getFixCode(parent: DOMElement, child: DOMElement): string {
    if (parent.tagName === 'a' && child.tagName === 'button') {
      return `<!-- Option 1: Use only the link -->
<a href="/action">Action Text</a>

<!-- Option 2: Use only the button with navigation -->
<button onclick="location.href='/action'">Action Text</button>`;
    }

    if (parent.tagName === 'button' && child.tagName === 'a') {
      return `<!-- Option 1: Use only the button -->
<button onclick="handleAction()">Action Text</button>

<!-- Option 2: Use only the link -->
<a href="/action">Action Text</a>`;
    }

    return `<!-- Separate the interactive elements -->
<div>
  <!-- First interactive element -->
  <!-- Second interactive element -->
</div>`;
  }

  /**
   * Get descendants of an element
   */
  private getDescendants(element: DOMElement, _allElements: DOMElement[]): DOMElement[] {
    const descendants: DOMElement[] = [];

    // Walk the DOM tree to find all descendants
    if (element.children) {
      for (const child of element.children) {
        descendants.push(child);
        descendants.push(...this.getDescendants(child, _allElements));
      }
    }

    return descendants;
  }
}
