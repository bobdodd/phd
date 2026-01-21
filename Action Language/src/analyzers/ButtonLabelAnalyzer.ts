import { BaseAnalyzer, Issue, AnalyzerContext } from './BaseAnalyzer';
import { DOMElement } from '../models/DOMModel';

/**
 * ButtonLabelAnalyzer - Detects buttons without accessible labels
 *
 * Implements WCAG 4.1.2 (Name, Role, Value) Level A
 *
 * Detects:
 * - Buttons with no text content or accessible name
 * - Icon-only buttons without aria-label or aria-labelledby
 * - Empty button elements
 * - Buttons with only whitespace
 * - Nested interactive elements in buttons
 * - Buttons with images but no alt text
 *
 * Priority: HIGH IMPACT
 * Target: Ensures all buttons have accessible labels for screen readers
 */
export class ButtonLabelAnalyzer extends BaseAnalyzer {
  readonly name = 'ButtonLabelAnalyzer';
  readonly description = 'Detects buttons without accessible labels or proper labeling';

  analyze(context: AnalyzerContext): Issue[] {
    const issues: Issue[] = [];

    if (!context.documentModel || !context.documentModel.dom) {
      return issues;
    }

    const allElements = context.documentModel.getAllElements();
    const buttonElements = this.findButtonElements(allElements);

    for (const button of buttonElements) {
      this.checkButtonLabel(button, allElements, context, issues);
    }

    return issues;
  }

  /**
   * Find all button elements (native buttons and ARIA buttons)
   */
  private findButtonElements(elements: DOMElement[]): DOMElement[] {
    return elements.filter(el => {
      // Native <button> elements
      if (el.tagName === 'button') {
        return true;
      }

      // <input type="button|submit|reset">
      if (el.tagName === 'input') {
        const type = el.attributes.type?.toLowerCase();
        return type === 'button' || type === 'submit' || type === 'reset' || type === 'image';
      }

      // Elements with role="button"
      if (el.attributes.role === 'button') {
        return true;
      }

      return false;
    });
  }

  /**
   * Check if a button has an accessible label
   */
  private checkButtonLabel(
    button: DOMElement,
    allElements: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const accessibleName = this.getAccessibleName(button, allElements);

    // Empty button - no text, no label, no description
    if (!accessibleName || accessibleName.trim().length === 0) {
      this.reportEmptyButton(button, context, issues);
      return;
    }

    // Check for icon-only buttons without proper labeling
    if (this.isIconOnlyButton(button, allElements)) {
      this.checkIconOnlyButtonLabel(button, context, issues);
    }

    // Check for nested interactive elements
    this.checkNestedInteractiveElements(button, allElements, context, issues);

    // Check for image buttons without alt text
    if (button.tagName === 'input' && button.attributes.type === 'image') {
      this.checkImageButtonAltText(button, context, issues);
    }
  }

  /**
   * Get accessible name for button following W3C algorithm
   */
  private getAccessibleName(button: DOMElement, allElements: DOMElement[]): string {
    // 1. aria-labelledby (highest priority)
    if (button.attributes['aria-labelledby']) {
      const ids = button.attributes['aria-labelledby'].split(/\s+/);
      const labelTexts = ids.map(id => {
        const labelElement = allElements.find(el => el.attributes.id === id);
        return labelElement ? this.getTextContent(labelElement, allElements) : '';
      });
      const combined = labelTexts.join(' ').trim();
      if (combined) return combined;
    }

    // 2. aria-label
    if (button.attributes['aria-label']) {
      return button.attributes['aria-label'].trim();
    }

    // 3. For input buttons, check value attribute
    if (button.tagName === 'input') {
      if (button.attributes.value) {
        return button.attributes.value.trim();
      }
      // Default values for submit/reset buttons
      if (button.attributes.type === 'submit') return 'Submit';
      if (button.attributes.type === 'reset') return 'Reset';
    }

    // 4. Text content (for <button> elements)
    if (button.tagName === 'button') {
      const textContent = this.getTextContent(button, allElements);
      if (textContent.trim()) return textContent.trim();
    }

    // 5. title attribute (last resort)
    if (button.attributes.title) {
      return button.attributes.title.trim();
    }

    return '';
  }

  /**
   * Get text content from element and its children
   */
  private getTextContent(element: DOMElement, allElements: DOMElement[]): string {
    let text = '';

    // Add element's own text
    if (element.textContent) {
      text += element.textContent;
    }

    // Add children's text (recursively)
    const children = this.getChildElements(element, allElements);
    for (const child of children) {
      // Skip hidden elements
      if (this.isHidden(child)) continue;

      // For img elements, use alt text
      if (child.tagName === 'img') {
        if (child.attributes.alt) {
          text += ' ' + child.attributes.alt;
        }
        continue;
      }

      // For other elements, recurse
      text += ' ' + this.getTextContent(child, allElements);
    }

    return text.trim();
  }

  /**
   * Get child elements
   */
  private getChildElements(parent: DOMElement, allElements: DOMElement[]): DOMElement[] {
    return allElements.filter(el => el.parent === parent);
  }

  /**
   * Check if element is hidden from assistive tech
   */
  private isHidden(element: DOMElement): boolean {
    // aria-hidden="true"
    if (element.attributes['aria-hidden'] === 'true') {
      return true;
    }

    // Common CSS hiding patterns (would need CSS model for complete check)
    const style = element.attributes.style || '';
    if (
      style.includes('display: none') ||
      style.includes('display:none') ||
      style.includes('visibility: hidden') ||
      style.includes('visibility:hidden')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Check if button is icon-only (contains only icon/image, no text)
   */
  private isIconOnlyButton(button: DOMElement, allElements: DOMElement[]): boolean {
    const textContent = this.getTextContent(button, allElements);

    // If there's meaningful text, it's not icon-only
    if (textContent.trim().length > 0) {
      return false;
    }

    // Check if it has icon indicators
    const children = this.getChildElements(button, allElements);

    for (const child of children) {
      // Has <img> element
      if (child.tagName === 'img') {
        return true;
      }

      // Has <svg> element
      if (child.tagName === 'svg') {
        return true;
      }

      // Has icon class (common patterns)
      const className = child.attributes.class || '';
      if (
        /icon/i.test(className) ||
        /fa-/i.test(className) || // Font Awesome
        /material-icons/i.test(className) || // Material Icons
        /glyphicon/i.test(className) // Bootstrap Glyphicons
      ) {
        return true;
      }

      // Has <i> element (commonly used for icons)
      if (child.tagName === 'i') {
        return true;
      }
    }

    return false;
  }

  /**
   * Report empty button issue
   */
  private reportEmptyButton(
    button: DOMElement,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const buttonType = button.tagName === 'input'
      ? `input type="${button.attributes.type}"`
      : button.tagName;

    issues.push(
      this.createIssue(
        'button-empty-label',
        'error',
        `Button has no accessible label. Add text content, aria-label, or aria-labelledby to describe the button's purpose.`,
        button.location,
        ['4.1.2'],
        context,
        {
          elementContext: context.documentModel?.getElementContext(button),
          fix: {
            description: `Add an accessible label to the ${buttonType} button using one of these methods:
1. Add text content: <button>Click me</button>
2. Add aria-label: <button aria-label="Submit form">...</button>
3. Add aria-labelledby: <button aria-labelledby="label-id">...</button>
4. For input buttons: <input type="button" value="Click me">`,
            code: this.generateButtonLabelFix(button),
            location: button.location
          }
        }
      )
    );
  }

  /**
   * Check icon-only button labeling
   */
  private checkIconOnlyButtonLabel(
    button: DOMElement,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    // Icon-only buttons MUST have aria-label or aria-labelledby
    if (!button.attributes['aria-label'] && !button.attributes['aria-labelledby']) {
      issues.push(
        this.createIssue(
          'button-icon-no-label',
          'error',
          `Icon-only button has no accessible label. Screen reader users cannot determine the button's purpose. Add aria-label or aria-labelledby.`,
          button.location,
          ['4.1.2'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(button),
            fix: {
              description: `Add aria-label to describe the icon button's purpose:
Example: <button aria-label="Close dialog"><i class="icon-close"></i></button>`,
              code: this.generateIconButtonLabelFix(button),
              location: button.location
            }
          }
        )
      );
    }
  }

  /**
   * Check for nested interactive elements in button
   */
  private checkNestedInteractiveElements(
    button: DOMElement,
    allElements: DOMElement[],
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    const children = this.getChildElements(button, allElements);
    const nestedInteractive: DOMElement[] = [];

    for (const child of children) {
      if (this.isInteractiveElement(child)) {
        nestedInteractive.push(child);
      }

      // Check grandchildren recursively
      const grandchildren = this.getChildElements(child, allElements);
      for (const grandchild of grandchildren) {
        if (this.isInteractiveElement(grandchild)) {
          nestedInteractive.push(grandchild);
        }
      }
    }

    if (nestedInteractive.length > 0) {
      const nestedTags = nestedInteractive.map(el => el.tagName).join(', ');

      issues.push(
        this.createIssue(
          'button-nested-interactive',
          'error',
          `Button contains nested interactive elements (${nestedTags}). This creates confusing keyboard navigation and ambiguous activation behavior. Remove nested interactive elements.`,
          button.location,
          ['4.1.2'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(button),
            fix: {
              description: `Remove or replace nested interactive elements with non-interactive alternatives:
- Replace nested buttons with <span> elements
- Move nested links outside the button
- Use CSS for styling instead of interactive elements`,
              code: `<!-- Instead of nested interactive elements, structure it properly -->
<!-- BAD: -->
<!-- <button>Submit <a href="#">Learn more</a></button> -->

<!-- GOOD: -->
<!-- <button>Submit</button> <a href="#">Learn more</a> -->`,
              location: button.location
            }
          }
        )
      );
    }
  }

  /**
   * Check if element is interactive
   */
  private isInteractiveElement(element: DOMElement): boolean {
    // Native interactive elements
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    if (interactiveTags.includes(element.tagName)) {
      return true;
    }

    // ARIA interactive roles
    const interactiveRoles = [
      'button', 'link', 'checkbox', 'radio', 'switch',
      'slider', 'spinbutton', 'tab', 'menuitem', 'option'
    ];
    if (element.attributes.role && interactiveRoles.includes(element.attributes.role)) {
      return true;
    }

    return false;
  }

  /**
   * Check image button alt text
   */
  private checkImageButtonAltText(
    button: DOMElement,
    context: AnalyzerContext,
    issues: Issue[]
  ): void {
    // <input type="image"> must have alt attribute
    if (!button.attributes.alt || button.attributes.alt.trim().length === 0) {
      issues.push(
        this.createIssue(
          'button-image-no-alt',
          'error',
          `Image button has no alt text. Add alt attribute to describe the button's purpose.`,
          button.location,
          ['4.1.2', '1.1.1'],
          context,
          {
            elementContext: context.documentModel?.getElementContext(button),
            fix: {
              description: `Add alt attribute to the image button:
Example: <input type="image" src="submit.png" alt="Submit form">`,
              code: `<input type="image" src="${button.attributes.src || 'image.png'}" alt="[Describe button purpose]">`,
              location: button.location
            }
          }
        )
      );
    }
  }

  /**
   * Generate fix for empty button
   */
  private generateButtonLabelFix(button: DOMElement): string {
    if (button.tagName === 'input') {
      const type = button.attributes.type || 'button';
      return `<input type="${type}" value="[Button label]" ${this.getOtherAttributes(button)}>`;
    }

    return `<button aria-label="[Describe button purpose]" ${this.getOtherAttributes(button)}>\n  [Button content]\n</button>`;
  }

  /**
   * Generate fix for icon-only button
   */
  private generateIconButtonLabelFix(button: DOMElement): string {
    if (button.tagName === 'input') {
      const type = button.attributes.type || 'button';
      return `<input type="${type}" aria-label="[Describe icon button purpose]" ${this.getOtherAttributes(button)}>`;
    }

    return `<button aria-label="[Describe icon button purpose]" ${this.getOtherAttributes(button)}>\n  <!-- Icon content -->\n</button>`;
  }

  /**
   * Get other attributes (excluding specific ones we're fixing)
   */
  private getOtherAttributes(element: DOMElement): string {
    const excludeAttrs = ['aria-label', 'aria-labelledby', 'value', 'alt'];
    const attrs: string[] = [];

    for (const [key, value] of Object.entries(element.attributes)) {
      if (!excludeAttrs.includes(key) && key !== 'type') {
        attrs.push(`${key}="${value}"`);
      }
    }

    return attrs.join(' ');
  }
}
