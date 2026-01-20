import { AccessibilityNode, SRMessage, NavigationMode } from './types';
import { AccessibilityTreeBuilder } from './AccessibilityTreeBuilder';
import { LiveRegionSimulator } from './LiveRegionSimulator';

/**
 * Virtual Screen Reader Engine
 * Simulates screen reader behavior including navigation and announcements
 */
export class VirtualScreenReader {
  private accessibilityTree: AccessibilityNode[] = [];
  private flatTree: AccessibilityNode[] = [];
  private currentIndex: number = -1;
  private mode: NavigationMode = 'browse';
  private messageIdCounter = 0;
  private liveRegionSimulator: LiveRegionSimulator;

  private onAnnouncement?: (message: SRMessage) => void;
  private onPositionChange?: (node: AccessibilityNode | null, element: HTMLElement | null) => void;

  constructor(
    onAnnouncement?: (message: SRMessage) => void,
    onPositionChange?: (node: AccessibilityNode | null, element: HTMLElement | null) => void
  ) {
    this.onAnnouncement = onAnnouncement;
    this.onPositionChange = onPositionChange;

    // Initialize live region simulator with announcement callback
    this.liveRegionSimulator = new LiveRegionSimulator((messageData) => {
      this.announce(messageData);
    });
  }

  /**
   * Load a document and build the accessibility tree
   */
  loadDocument(document: Document): void {
    const builder = new AccessibilityTreeBuilder();
    this.accessibilityTree = builder.build(document);
    this.flatTree = this.flattenTree(this.accessibilityTree);
    this.currentIndex = -1;

    // Start observing live regions
    this.liveRegionSimulator.observe(document);

    // Announce page load
    this.announce({
      type: 'page-load',
      content: `Page loaded. ${this.flatTree.length} accessible elements found. Use arrow keys to navigate.`,
    });

    // Move to first element
    if (this.flatTree.length > 0) {
      this.moveTo(0);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.liveRegionSimulator.destroy();
  }

  /**
   * Navigate to next element
   */
  nextElement(): void {
    if (this.mode === 'focus') {
      // In focus mode, only navigate to focusable elements
      this.nextFocusable();
    } else {
      // In browse mode, navigate to all elements
      if (this.currentIndex < this.flatTree.length - 1) {
        this.moveTo(this.currentIndex + 1);
      } else {
        this.announce({
          type: 'navigation',
          content: 'End of document',
        });
      }
    }
  }

  /**
   * Navigate to previous element
   */
  previousElement(): void {
    if (this.mode === 'focus') {
      // In focus mode, only navigate to focusable elements
      this.previousFocusable();
    } else {
      // In browse mode, navigate to all elements
      if (this.currentIndex > 0) {
        this.moveTo(this.currentIndex - 1);
      } else {
        this.announce({
          type: 'navigation',
          content: 'Beginning of document',
        });
      }
    }
  }

  /**
   * Navigate to next focusable element
   */
  nextFocusable(): void {
    const found = this.findNext(node => node.isFocusable);
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next focusable element',
      });
    }
  }

  /**
   * Navigate to previous focusable element
   */
  previousFocusable(): void {
    const found = this.findPrevious(node => node.isFocusable);
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No previous focusable element',
      });
    }
  }

  /**
   * Navigate to next heading
   */
  nextHeading(): void {
    const found = this.findNext(node => node.role === 'heading');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next heading',
      });
    }
  }

  /**
   * Navigate to previous heading
   */
  previousHeading(): void {
    const found = this.findPrevious(node => node.role === 'heading');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No previous heading',
      });
    }
  }

  /**
   * Navigate to next link
   */
  nextLink(): void {
    const found = this.findNext(node => node.role === 'link');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next link',
      });
    }
  }

  /**
   * Navigate to previous link
   */
  previousLink(): void {
    const found = this.findPrevious(node => node.role === 'link');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No previous link',
      });
    }
  }

  /**
   * Navigate to next button
   */
  nextButton(): void {
    const found = this.findNext(node => node.role === 'button');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next button',
      });
    }
  }

  /**
   * Navigate to previous button
   */
  previousButton(): void {
    const found = this.findPrevious(node => node.role === 'button');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No previous button',
      });
    }
  }

  /**
   * Navigate to next landmark
   */
  nextLandmark(): void {
    const landmarks = ['navigation', 'main', 'banner', 'contentinfo', 'complementary', 'region', 'search'];
    const found = this.findNext(node => landmarks.includes(node.role));
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next landmark',
      });
    }
  }

  /**
   * Navigate to next form control
   */
  nextFormControl(): void {
    const formRoles = ['textbox', 'checkbox', 'radio', 'combobox', 'listbox', 'slider'];
    const found = this.findNext(node => formRoles.includes(node.role));
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next form control',
      });
    }
  }

  /**
   * Activate the current element (simulate click/Enter)
   */
  activateElement(): void {
    const node = this.getCurrentNode();
    if (!node || !node.domElement) {
      this.announce({
        type: 'error',
        content: 'No element to activate',
      });
      return;
    }

    // Announce activation
    this.announce({
      type: 'navigation',
      content: `Activating ${node.role}: ${node.name}`,
    });

    // Simulate click on the DOM element
    node.domElement.click();

    // For expandable elements, re-announce state after activation
    setTimeout(() => {
      if (node.states.expanded !== undefined) {
        const newState = node.domElement?.getAttribute('aria-expanded') === 'true';
        this.announce({
          type: 'state-change',
          content: `${node.name}, ${newState ? 'expanded' : 'collapsed'}`,
        });
      }
    }, 100);
  }

  /**
   * Toggle between browse and focus mode
   */
  toggleMode(): void {
    this.mode = this.mode === 'browse' ? 'focus' : 'browse';

    if (this.mode === 'focus') {
      // When entering focus mode, move to nearest focusable element
      const currentNode = this.getCurrentNode();
      if (currentNode && !currentNode.isFocusable) {
        // Current element is not focusable, find the next focusable one
        const found = this.findNext(node => node.isFocusable);
        if (!found) {
          // No focusable element forward, try backward
          this.findPrevious(node => node.isFocusable);
        }
      }

      this.announce({
        type: 'announcement',
        content: 'Focus mode. Press Tab or arrow keys to move between focusable elements only.',
      });
    } else {
      this.announce({
        type: 'announcement',
        content: 'Browse mode. Press arrow keys to read all content.',
      });
    }
  }

  /**
   * Get current mode
   */
  getMode(): NavigationMode {
    return this.mode;
  }

  /**
   * Get current node
   */
  getCurrentNode(): AccessibilityNode | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.flatTree.length) {
      return this.flatTree[this.currentIndex];
    }
    return null;
  }

  /**
   * Move to a specific index in the tree
   */
  private moveTo(index: number): void {
    if (index < 0 || index >= this.flatTree.length) return;

    this.currentIndex = index;
    const node = this.flatTree[index];

    // Announce the element
    this.announceNode(node);

    // Notify position change
    if (this.onPositionChange) {
      this.onPositionChange(node, node.domElement);
    }
  }

  /**
   * Find next element matching predicate
   */
  private findNext(predicate: (node: AccessibilityNode) => boolean): boolean {
    for (let i = this.currentIndex + 1; i < this.flatTree.length; i++) {
      if (predicate(this.flatTree[i])) {
        this.moveTo(i);
        return true;
      }
    }
    return false;
  }

  /**
   * Find previous element matching predicate
   */
  private findPrevious(predicate: (node: AccessibilityNode) => boolean): boolean {
    for (let i = this.currentIndex - 1; i >= 0; i--) {
      if (predicate(this.flatTree[i])) {
        this.moveTo(i);
        return true;
      }
    }
    return false;
  }

  /**
   * Announce a node with role-appropriate formatting
   */
  private announceNode(node: AccessibilityNode): void {
    const parts: string[] = [];

    // Format announcement based on role
    switch (node.role) {
      case 'heading':
        parts.push(`Heading level ${node.properties.level || 1}`);
        if (node.name) parts.push(node.name);
        break;

      case 'button':
        parts.push('Button');
        if (node.name) parts.push(node.name);
        if (node.states.pressed !== undefined) {
          parts.push(node.states.pressed ? 'pressed' : 'not pressed');
        }
        if (node.states.expanded !== undefined) {
          parts.push(node.states.expanded ? 'expanded' : 'collapsed');
        }
        break;

      case 'link':
        parts.push('Link');
        if (node.name) parts.push(node.name);
        if (node.states.visited) parts.push('visited');
        break;

      case 'checkbox':
        parts.push('Checkbox');
        parts.push(node.states.checked ? 'checked' : 'not checked');
        if (node.name) parts.push(node.name);
        break;

      case 'radio':
        parts.push('Radio button');
        parts.push(node.states.checked ? 'selected' : 'not selected');
        if (node.name) parts.push(node.name);
        break;

      case 'textbox':
        parts.push('Edit');
        if (node.name) parts.push(node.name);
        if (node.value) parts.push(`"${node.value}"`);
        else parts.push('blank');
        break;

      case 'combobox':
        parts.push('Combo box');
        if (node.name) parts.push(node.name);
        if (node.states.expanded !== undefined) {
          parts.push(node.states.expanded ? 'expanded' : 'collapsed');
        }
        break;

      case 'listitem':
        parts.push('List item');
        if (node.properties.posinset && node.properties.setsize) {
          parts.push(`${node.properties.posinset} of ${node.properties.setsize}`);
        }
        if (node.name) parts.push(node.name);
        break;

      case 'navigation':
        parts.push('Navigation');
        if (node.name) parts.push(node.name);
        break;

      case 'main':
        parts.push('Main');
        if (node.name) parts.push(node.name);
        break;

      case 'banner':
        parts.push('Banner');
        if (node.name) parts.push(node.name);
        break;

      case 'contentinfo':
        parts.push('Content information');
        if (node.name) parts.push(node.name);
        break;

      default:
        if (node.name) {
          parts.push(node.name);
        } else {
          parts.push(node.role);
        }
    }

    // Add description if present
    if (node.description) {
      parts.push(`Description: ${node.description}`);
    }

    // Add disabled state
    if (node.states.disabled) {
      parts.push('disabled');
    }

    const content = parts.join(', ');

    this.announce({
      type: 'navigation',
      content,
      element: node,
    });
  }

  /**
   * Send an announcement
   */
  private announce(messageData: Omit<SRMessage, 'id' | 'timestamp'>): void {
    const message: SRMessage = {
      id: `msg-${this.messageIdCounter++}`,
      timestamp: Date.now(),
      ...messageData,
    };

    if (this.onAnnouncement) {
      this.onAnnouncement(message);
    }
  }

  /**
   * Flatten tree for linear navigation
   */
  private flattenTree(nodes: AccessibilityNode[], result: AccessibilityNode[] = []): AccessibilityNode[] {
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        this.flattenTree(node.children, result);
      }
    }
    return result;
  }
}
