import { AccessibilityNode, ARIAStates, ARIAProperties } from './types';

/**
 * Builds an accessibility tree from a DOM document
 * This mirrors what a real screen reader does when parsing a page
 */
export class AccessibilityTreeBuilder {
  private nodeIdCounter = 0;

  /**
   * Build the accessibility tree from an iframe document
   */
  build(document: Document): AccessibilityNode[] {
    this.nodeIdCounter = 0;
    const tree: AccessibilityNode[] = [];

    // Start from the body element
    const bodyElement = document.body;
    if (!bodyElement) return tree;

    // Recursively build tree
    const bodyNode = this.buildNode(bodyElement, null);
    if (bodyNode) {
      tree.push(bodyNode);
    }

    // Flatten tree for navigation (add treeIndex)
    this.flattenTree(tree);

    return tree;
  }

  /**
   * Build a single accessibility node from a DOM element
   */
  private buildNode(element: Element, parent: AccessibilityNode | null): AccessibilityNode | null {
    const htmlElement = element as HTMLElement;

    // Check if element is hidden from accessibility tree
    if (this.isHidden(htmlElement)) {
      return null;
    }

    // Compute role
    const role = this.computeRole(htmlElement);

    // Some elements have no role and should not be in the tree
    if (!role || role === 'none' || role === 'presentation') {
      // But we should still process their children
      return this.processChildren(htmlElement, parent);
    }

    // For generic role, check if there's meaningful text content
    // If it's just a container with no direct text, skip it
    if (role === 'generic') {
      const hasDirectText = this.hasDirectTextContent(htmlElement);
      if (!hasDirectText) {
        // No direct text, just process children
        return this.processChildren(htmlElement, parent);
      }
    }

    // Build the node
    const node: AccessibilityNode = {
      id: `node-${this.nodeIdCounter++}`,
      domElement: htmlElement,
      role,
      name: this.computeAccessibleName(htmlElement, role),
      description: this.computeAccessibleDescription(htmlElement),
      value: this.computeValue(htmlElement, role),
      states: this.computeStates(htmlElement, role),
      properties: this.computeProperties(htmlElement, role),
      children: [],
      parent: parent || undefined,
      isHidden: false,
      isFocusable: this.isFocusable(htmlElement),
      hasClickHandler: this.hasClickHandler(htmlElement),
      tagName: htmlElement.tagName.toLowerCase()
    };

    // Process children
    for (const child of Array.from(htmlElement.children)) {
      const childNode = this.buildNode(child, node);
      if (childNode) {
        node.children.push(childNode);
      }
    }

    return node;
  }

  /**
   * Check if element has direct text content (not just whitespace)
   */
  private hasDirectTextContent(element: HTMLElement): boolean {
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text && text.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Process children without creating a node for the current element
   */
  private processChildren(element: HTMLElement, parent: AccessibilityNode | null): AccessibilityNode | null {
    // If there's exactly one child that creates a node, return it
    // Otherwise return null (multiple children would need special handling)
    for (const child of Array.from(element.children)) {
      const childNode = this.buildNode(child, parent);
      if (childNode) {
        return childNode;
      }
    }
    return null;
  }

  /**
   * Check if element is hidden from accessibility tree
   */
  private isHidden(element: HTMLElement): boolean {
    // aria-hidden="true"
    if (element.getAttribute('aria-hidden') === 'true') {
      return true;
    }

    // CSS visibility
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return true;
    }

    return false;
  }

  /**
   * Compute the ARIA role (explicit or implicit)
   */
  private computeRole(element: HTMLElement): string {
    // Explicit ARIA role
    const explicitRole = element.getAttribute('role');
    if (explicitRole) {
      return explicitRole;
    }

    // Implicit roles based on HTML element
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'button':
        return 'button';
      case 'a':
        return element.hasAttribute('href') ? 'link' : 'generic';
      case 'input':
        return this.getInputRole(element as HTMLInputElement);
      case 'textarea':
        return 'textbox';
      case 'select':
        return element.hasAttribute('multiple') ? 'listbox' : 'combobox';
      case 'nav':
        return 'navigation';
      case 'main':
        return 'main';
      case 'header':
        return 'banner';
      case 'footer':
        return 'contentinfo';
      case 'aside':
        return 'complementary';
      case 'section':
        return 'region';
      case 'article':
        return 'article';
      case 'form':
        return 'form';
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return 'heading';
      case 'ul':
      case 'ol':
        return 'list';
      case 'li':
        return 'listitem';
      case 'table':
        return 'table';
      case 'tr':
        return 'row';
      case 'td':
        return 'cell';
      case 'th':
        return 'columnheader';
      case 'img':
        return element.getAttribute('alt') === '' ? 'presentation' : 'img';
      case 'dialog':
        return 'dialog';
      default:
        return 'generic';
    }
  }

  /**
   * Get role for input elements based on type
   */
  private getInputRole(input: HTMLInputElement): string {
    const type = input.type.toLowerCase();

    switch (type) {
      case 'button':
      case 'submit':
      case 'reset':
        return 'button';
      case 'checkbox':
        return 'checkbox';
      case 'radio':
        return 'radio';
      case 'range':
        return 'slider';
      case 'text':
      case 'email':
      case 'password':
      case 'search':
      case 'tel':
      case 'url':
        return 'textbox';
      default:
        return 'textbox';
    }
  }

  /**
   * Compute accessible name using W3C algorithm
   */
  private computeAccessibleName(element: HTMLElement, role: string): string {
    // 1. aria-labelledby
    const labelledby = element.getAttribute('aria-labelledby');
    if (labelledby) {
      const ids = labelledby.split(/\s+/);
      const names = ids.map(id => {
        const refElement = element.ownerDocument.getElementById(id);
        return refElement ? refElement.textContent?.trim() || '' : '';
      });
      const name = names.join(' ').trim();
      if (name) return name;
    }

    // 2. aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel.trim();
    }

    // 3. Native label (for form controls)
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const label = this.findLabelFor(element);
      if (label) {
        return label.textContent?.trim() || '';
      }
    }

    // 4. alt attribute (for images)
    if (element.tagName.toLowerCase() === 'img') {
      const alt = element.getAttribute('alt');
      if (alt !== null) {
        return alt.trim();
      }
    }

    // 5. Text content (for most elements including paragraphs, divs, spans)
    if (role === 'button' || role === 'link' || role === 'heading' || role === 'generic' ||
        role === 'listitem' || role === 'cell' || role === 'row' || role === 'article' ||
        role === 'region' || role === 'navigation' || role === 'main' || role === 'complementary') {
      return element.textContent?.trim() || '';
    }

    // 6. placeholder (for inputs)
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const placeholder = element.getAttribute('placeholder');
      if (placeholder) {
        return placeholder.trim();
      }
    }

    // 7. title attribute (last resort)
    const title = element.getAttribute('title');
    if (title) {
      return title.trim();
    }

    return '';
  }

  /**
   * Find label element for a form control
   */
  private findLabelFor(element: HTMLInputElement | HTMLTextAreaElement): HTMLLabelElement | null {
    // Check if element is inside a label
    let parent = element.parentElement;
    while (parent) {
      if (parent.tagName.toLowerCase() === 'label') {
        return parent as HTMLLabelElement;
      }
      parent = parent.parentElement;
    }

    // Check for label with matching 'for' attribute
    const id = element.id;
    if (id) {
      const label = element.ownerDocument.querySelector(`label[for="${id}"]`);
      return label as HTMLLabelElement | null;
    }

    return null;
  }

  /**
   * Compute accessible description
   */
  private computeAccessibleDescription(element: HTMLElement): string | undefined {
    const describedby = element.getAttribute('aria-describedby');
    if (describedby) {
      const ids = describedby.split(/\s+/);
      const descriptions = ids.map(id => {
        const refElement = element.ownerDocument.getElementById(id);
        return refElement ? refElement.textContent?.trim() || '' : '';
      });
      const description = descriptions.join(' ').trim();
      if (description) return description;
    }

    return undefined;
  }

  /**
   * Compute current value for the element
   */
  private computeValue(element: HTMLElement, role: string): string | undefined {
    if (element instanceof HTMLInputElement) {
      if (role === 'textbox') {
        return element.value;
      }
      if (role === 'slider') {
        return element.value;
      }
    }

    if (element instanceof HTMLTextAreaElement) {
      return element.value;
    }

    if (element instanceof HTMLSelectElement) {
      return element.value;
    }

    return undefined;
  }

  /**
   * Compute ARIA states
   */
  private computeStates(element: HTMLElement, role: string): ARIAStates {
    const states: ARIAStates = {};

    // checked (for checkboxes, radio buttons)
    if (role === 'checkbox' || role === 'radio') {
      const ariaChecked = element.getAttribute('aria-checked');
      if (ariaChecked) {
        states.checked = ariaChecked === 'true' ? true : ariaChecked === 'mixed' ? 'mixed' : false;
      } else if (element instanceof HTMLInputElement) {
        states.checked = element.checked;
      }
    }

    // disabled
    const ariaDisabled = element.getAttribute('aria-disabled');
    if (ariaDisabled === 'true') {
      states.disabled = true;
    } else if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
      states.disabled = element.disabled;
    }

    // expanded
    const ariaExpanded = element.getAttribute('aria-expanded');
    if (ariaExpanded) {
      states.expanded = ariaExpanded === 'true';
    }

    // selected
    const ariaSelected = element.getAttribute('aria-selected');
    if (ariaSelected) {
      states.selected = ariaSelected === 'true';
    }

    // pressed (for toggle buttons)
    const ariaPressed = element.getAttribute('aria-pressed');
    if (ariaPressed) {
      states.pressed = ariaPressed === 'true' ? true : ariaPressed === 'mixed' ? 'mixed' : false;
    }

    return states;
  }

  /**
   * Compute ARIA properties
   */
  private computeProperties(element: HTMLElement, role: string): ARIAProperties {
    const properties: ARIAProperties = {};

    // level (for headings)
    if (role === 'heading') {
      const ariaLevel = element.getAttribute('aria-level');
      if (ariaLevel) {
        properties.level = parseInt(ariaLevel, 10);
      } else {
        const tagName = element.tagName.toLowerCase();
        const match = tagName.match(/^h(\d)$/);
        if (match) {
          properties.level = parseInt(match[1], 10);
        }
      }
    }

    // posinset and setsize (for items in a set)
    const posinset = element.getAttribute('aria-posinset');
    if (posinset) {
      properties.posinset = parseInt(posinset, 10);
    }

    const setsize = element.getAttribute('aria-setsize');
    if (setsize) {
      properties.setsize = parseInt(setsize, 10);
    }

    // valuemin, valuemax, valuenow (for sliders, progress bars)
    if (role === 'slider' || role === 'progressbar') {
      const valuemin = element.getAttribute('aria-valuemin');
      if (valuemin) properties.valuemin = parseFloat(valuemin);

      const valuemax = element.getAttribute('aria-valuemax');
      if (valuemax) properties.valuemax = parseFloat(valuemax);

      const valuenow = element.getAttribute('aria-valuenow');
      if (valuenow) properties.valuenow = parseFloat(valuenow);

      const valuetext = element.getAttribute('aria-valuetext');
      if (valuetext) properties.valuetext = valuetext;
    }

    return properties;
  }

  /**
   * Check if element is focusable
   */
  private isFocusable(element: HTMLElement): boolean {
    // Check tabindex
    const tabindex = element.getAttribute('tabindex');
    if (tabindex !== null) {
      const tabindexNum = parseInt(tabindex, 10);
      return tabindexNum >= 0;
    }

    // Natively focusable elements
    const tagName = element.tagName.toLowerCase();
    const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];

    if (focusableTags.includes(tagName)) {
      // Check if disabled
      if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
        return !element.disabled;
      }
      // Links need href to be focusable
      if (tagName === 'a') {
        return element.hasAttribute('href');
      }
      return true;
    }

    return false;
  }

  /**
   * Check if element has click handlers
   */
  private hasClickHandler(element: HTMLElement): boolean {
    // Check for onclick attribute
    if (element.hasAttribute('onclick')) {
      return true;
    }

    // Note: We can't reliably detect addEventListener click handlers
    // from the DOM alone, would need AST analysis
    return false;
  }

  /**
   * Flatten tree for navigation by adding treeIndex to each node
   */
  private flattenTree(nodes: AccessibilityNode[], flatList: AccessibilityNode[] = []): AccessibilityNode[] {
    for (const node of nodes) {
      node.treeIndex = flatList.length;
      flatList.push(node);

      if (node.children.length > 0) {
        this.flattenTree(node.children, flatList);
      }
    }

    return flatList;
  }
}
