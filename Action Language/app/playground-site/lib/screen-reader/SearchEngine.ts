import { AccessibilityNode } from './types';

/**
 * Search engine for finding elements in the accessibility tree
 */
export class SearchEngine {
  /**
   * Search for elements by text content
   */
  searchByText(nodes: AccessibilityNode[], query: string): AccessibilityNode[] {
    const results: AccessibilityNode[] = [];
    const lowerQuery = query.toLowerCase();

    const searchNode = (node: AccessibilityNode) => {
      // Search in accessible name
      if (node.name && node.name.toLowerCase().includes(lowerQuery)) {
        results.push(node);
      }

      // Search in description
      if (node.description && node.description.toLowerCase().includes(lowerQuery)) {
        if (!results.includes(node)) {
          results.push(node);
        }
      }

      // Search in value
      if (node.value && node.value.toLowerCase().includes(lowerQuery)) {
        if (!results.includes(node)) {
          results.push(node);
        }
      }

      // Recursively search children
      node.children.forEach(searchNode);
    };

    nodes.forEach(searchNode);
    return results;
  }

  /**
   * Search for elements by role
   */
  searchByRole(nodes: AccessibilityNode[], role: string): AccessibilityNode[] {
    const results: AccessibilityNode[] = [];
    const lowerRole = role.toLowerCase();

    const searchNode = (node: AccessibilityNode) => {
      if (node.role.toLowerCase() === lowerRole) {
        results.push(node);
      }
      node.children.forEach(searchNode);
    };

    nodes.forEach(searchNode);
    return results;
  }

  /**
   * Search for elements by attribute
   */
  searchByAttribute(nodes: AccessibilityNode[], attribute: string, value?: string): AccessibilityNode[] {
    const results: AccessibilityNode[] = [];

    const searchNode = (node: AccessibilityNode) => {
      if (!node.domElement) {
        node.children.forEach(searchNode);
        return;
      }

      if (value !== undefined) {
        // Search for specific attribute value
        if (node.domElement.getAttribute(attribute) === value) {
          results.push(node);
        }
      } else {
        // Search for attribute existence
        if (node.domElement.hasAttribute(attribute)) {
          results.push(node);
        }
      }

      node.children.forEach(searchNode);
    };

    nodes.forEach(searchNode);
    return results;
  }

  /**
   * Find all headings grouped by level
   */
  getHeadingOutline(nodes: AccessibilityNode[]): Map<number, AccessibilityNode[]> {
    const outline = new Map<number, AccessibilityNode[]>();

    const collectHeadings = (node: AccessibilityNode) => {
      if (node.role === 'heading' && node.properties.level) {
        const level = node.properties.level;
        if (!outline.has(level)) {
          outline.set(level, []);
        }
        outline.get(level)!.push(node);
      }
      node.children.forEach(collectHeadings);
    };

    nodes.forEach(collectHeadings);
    return outline;
  }

  /**
   * Find all landmarks in the document
   */
  getLandmarks(nodes: AccessibilityNode[]): AccessibilityNode[] {
    const landmarks = ['navigation', 'main', 'banner', 'contentinfo', 'complementary', 'region', 'search', 'form'];
    return this.searchByRole(nodes, '').filter(node => landmarks.includes(node.role));
  }

  /**
   * Find all form controls
   */
  getFormControls(nodes: AccessibilityNode[]): AccessibilityNode[] {
    const formRoles = ['textbox', 'checkbox', 'radio', 'combobox', 'listbox', 'slider', 'spinbutton', 'searchbox', 'button'];
    const results: AccessibilityNode[] = [];

    const collectControls = (node: AccessibilityNode) => {
      if (formRoles.includes(node.role)) {
        results.push(node);
      }
      node.children.forEach(collectControls);
    };

    nodes.forEach(collectControls);
    return results;
  }

  /**
   * Find all interactive elements
   */
  getInteractiveElements(nodes: AccessibilityNode[]): AccessibilityNode[] {
    const results: AccessibilityNode[] = [];

    const collectInteractive = (node: AccessibilityNode) => {
      if (node.isFocusable || node.hasClickHandler || node.role === 'link' || node.role === 'button') {
        results.push(node);
      }
      node.children.forEach(collectInteractive);
    };

    nodes.forEach(collectInteractive);
    return results;
  }

  /**
   * Count elements by role
   */
  getRoleStatistics(nodes: AccessibilityNode[]): Map<string, number> {
    const stats = new Map<string, number>();

    const countRoles = (node: AccessibilityNode) => {
      const count = stats.get(node.role) || 0;
      stats.set(node.role, count + 1);
      node.children.forEach(countRoles);
    };

    nodes.forEach(countRoles);
    return stats;
  }
}
