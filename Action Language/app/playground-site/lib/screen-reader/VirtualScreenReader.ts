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
   * Navigate to next table
   */
  nextTable(): void {
    const found = this.findNext(node => node.role === 'table' || node.role === 'grid');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next table',
      });
    }
  }

  /**
   * Navigate to previous table
   */
  previousTable(): void {
    const found = this.findPrevious(node => node.role === 'table' || node.role === 'grid');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No previous table',
      });
    }
  }

  /**
   * Navigate to next list
   */
  nextList(): void {
    const found = this.findNext(node => node.role === 'list');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next list',
      });
    }
  }

  /**
   * Navigate to previous list
   */
  previousList(): void {
    const found = this.findPrevious(node => node.role === 'list');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No previous list',
      });
    }
  }

  /**
   * Navigate to next graphic/image
   */
  nextGraphic(): void {
    const found = this.findNext(node => node.role === 'img' || node.role === 'graphic');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next graphic',
      });
    }
  }

  /**
   * Navigate to previous graphic/image
   */
  previousGraphic(): void {
    const found = this.findPrevious(node => node.role === 'img' || node.role === 'graphic');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No previous graphic',
      });
    }
  }

  /**
   * Navigate to next region
   */
  nextRegion(): void {
    const found = this.findNext(node => node.role === 'region');
    if (!found) {
      this.announce({
        type: 'navigation',
        content: 'No next region',
      });
    }
  }

  /**
   * Get associated row and column headers for a table cell
   */
  private getTableHeaders(node: AccessibilityNode): { columnHeader?: string; rowHeader?: string } {
    if (!node.domElement || (node.role !== 'cell' && node.role !== 'gridcell')) {
      return {};
    }

    const result: { columnHeader?: string; rowHeader?: string } = {};
    const cell = node.domElement;

    // Check for explicit headers attribute
    const headersAttr = cell.getAttribute('headers');
    if (headersAttr) {
      const headerIds = headersAttr.split(/\s+/);
      const headerTexts = headerIds
        .map(id => cell.ownerDocument.getElementById(id)?.textContent?.trim())
        .filter(text => text);
      if (headerTexts.length > 0) {
        result.columnHeader = headerTexts.join(', ');
        return result;
      }
    }

    // Find parent row and table
    const row = cell.closest('tr, [role="row"]') as HTMLElement | null;
    if (!row) return result;

    const table = row.closest('table, [role="table"], [role="grid"]') as HTMLElement | null;
    if (!table) return result;

    // Get column index
    const cells = Array.from(row.querySelectorAll('td, th, [role="cell"], [role="gridcell"], [role="columnheader"]'));
    const colIndex = cells.indexOf(cell);
    if (colIndex < 0) return result;

    // Find column header (first row)
    const firstRow = table.querySelector('tr, [role="row"]');
    if (firstRow) {
      const headerCells = Array.from(firstRow.querySelectorAll('th, [role="columnheader"]'));
      if (headerCells.length > colIndex) {
        result.columnHeader = headerCells[colIndex].textContent?.trim();
      }
    }

    // Find row header (first cell in current row)
    const rowHeaderCell = row.querySelector('th, [role="rowheader"]');
    if (rowHeaderCell && rowHeaderCell !== cell) {
      result.rowHeader = rowHeaderCell.textContent?.trim();
    }

    return result;
  }

  /**
   * Get table information for current cell
   */
  getTableContext(): { row: number; col: number; rowCount: number; colCount: number } | null {
    const node = this.getCurrentNode();
    if (!node || !node.domElement) return null;

    // Check if we're in a table cell
    if (node.role !== 'cell' && node.role !== 'columnheader' && node.role !== 'rowheader') {
      return null;
    }

    const cell = node.domElement;

    // Find parent row
    let row = cell.closest('tr, [role="row"]') as HTMLElement | null;
    if (!row) return null;

    // Find parent table
    let table = row.closest('table, [role="table"], [role="grid"]') as HTMLElement | null;
    if (!table) return null;

    // Count rows and columns
    const rows = table.querySelectorAll('tr, [role="row"]');
    const rowIndex = Array.from(rows).indexOf(row) + 1;
    const rowCount = rows.length;

    // Count cells in current row
    const cells = row.querySelectorAll('td, th, [role="cell"], [role="columnheader"], [role="rowheader"]');
    const colIndex = Array.from(cells).indexOf(cell) + 1;

    // Get max column count from any row
    let maxCols = 0;
    rows.forEach(r => {
      const cellCount = r.querySelectorAll('td, th, [role="cell"], [role="columnheader"], [role="rowheader"]').length;
      if (cellCount > maxCols) maxCols = cellCount;
    });

    return {
      row: rowIndex,
      col: colIndex,
      rowCount: rowCount,
      colCount: maxCols
    };
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

    const previousNode = this.getCurrentNode();
    this.currentIndex = index;
    const node = this.flatTree[index];

    // Check for landmark entry/exit
    this.checkLandmarkTransition(previousNode, node);

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
        // Announce if this button controls another element (common in accordions)
        if (node.properties.controls) {
          parts.push('controls content');
        }
        // Announce if this button has a popup
        if (node.properties.haspopup) {
          if (typeof node.properties.haspopup === 'string') {
            parts.push(`has ${node.properties.haspopup} popup`);
          } else {
            parts.push('has popup');
          }
        }
        break;

      case 'link':
        parts.push('Link');
        if (node.name) parts.push(node.name);
        if (node.states.current) {
          if (typeof node.states.current === 'string') {
            parts.push(`current ${node.states.current}`);
          } else {
            parts.push('current');
          }
        }
        if (node.states.visited) parts.push('visited');
        break;

      case 'checkbox':
        parts.push('Checkbox');
        parts.push(node.states.checked ? 'checked' : 'not checked');
        if (node.name) parts.push(node.name);
        if (node.states.required) {
          parts.push('required');
        }
        if (node.states.invalid) {
          parts.push('invalid entry');
        }
        break;

      case 'switch':
        parts.push('Switch');
        if (node.name) parts.push(node.name);
        parts.push(node.states.checked ? 'on' : 'off');
        break;

      case 'radio':
        parts.push('Radio button');
        parts.push(node.states.checked ? 'selected' : 'not selected');
        if (node.name) parts.push(node.name);
        // Announce position in radio group if possible
        if (node.properties.posinset && node.properties.setsize) {
          parts.push(`${node.properties.posinset} of ${node.properties.setsize}`);
        } else if (node.domElement instanceof HTMLInputElement) {
          // Find other radio buttons with same name
          const radioName = node.domElement.name;
          if (radioName) {
            const radioGroup = Array.from(
              node.domElement.ownerDocument.querySelectorAll(`input[type="radio"][name="${radioName}"]`)
            );
            const position = radioGroup.indexOf(node.domElement) + 1;
            if (position > 0 && radioGroup.length > 1) {
              parts.push(`${position} of ${radioGroup.length}`);
            }
          }
        }
        break;

      case 'textbox':
        parts.push(node.properties.multiline ? 'Edit multiline' : 'Edit');
        if (node.name) parts.push(node.name);
        if (node.value) parts.push(`"${node.value}"`);
        else parts.push('blank');
        // Announce autocomplete
        if (node.properties.autocomplete) {
          parts.push(`autocomplete ${node.properties.autocomplete}`);
        }
        // Announce readonly state
        if (node.states.readonly) {
          parts.push('read only');
        }
        // Announce required state
        if (node.states.required) {
          parts.push('required');
        }
        // Announce invalid state
        if (node.states.invalid) {
          if (typeof node.states.invalid === 'string') {
            parts.push(`invalid ${node.states.invalid}`);
          } else {
            parts.push('invalid entry');
          }
        }
        break;

      case 'searchbox':
        parts.push('Search');
        if (node.name) parts.push(node.name);
        if (node.value) parts.push(`"${node.value}"`);
        else parts.push('blank');
        if (node.properties.multiline) {
          parts.push('multiline');
        }
        break;

      case 'combobox':
        parts.push('Combo box');
        if (node.name) parts.push(node.name);
        if (node.value) {
          parts.push(node.value);
        }
        if (node.states.expanded !== undefined) {
          parts.push(node.states.expanded ? 'expanded' : 'collapsed');
        }
        if (node.properties.haspopup) {
          if (typeof node.properties.haspopup === 'string') {
            parts.push(`has ${node.properties.haspopup} popup`);
          } else {
            parts.push('has popup');
          }
        }
        if (node.states.required) {
          parts.push('required');
        }
        if (node.states.invalid) {
          parts.push('invalid entry');
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

      case 'table':
      case 'grid':
        parts.push(node.role === 'grid' ? 'Grid' : 'Table');
        if (node.name) parts.push(node.name);
        // Count rows and columns if possible
        if (node.domElement) {
          const rows = node.domElement.querySelectorAll('tr, [role="row"]').length;
          if (rows > 0) {
            parts.push(`${rows} rows`);
          }
          // Announce caption if present
          const caption = node.domElement.querySelector('caption');
          if (caption && caption.textContent?.trim()) {
            parts.push(`Caption: ${caption.textContent.trim()}`);
          }
        }
        break;

      case 'cell':
      case 'gridcell':
        parts.push(node.role === 'gridcell' ? 'Grid cell' : 'Cell');
        // Announce row and column headers first
        const headers = this.getTableHeaders(node);
        if (headers.columnHeader) {
          parts.push(`Column: ${headers.columnHeader}`);
        }
        if (headers.rowHeader) {
          parts.push(`Row: ${headers.rowHeader}`);
        }
        if (node.name) parts.push(node.name);
        // Add table position info
        const tableContext = this.getTableContext();
        if (tableContext) {
          parts.push(`Row ${tableContext.row} of ${tableContext.rowCount}, Column ${tableContext.col} of ${tableContext.colCount}`);
        }
        break;

      case 'columnheader':
        parts.push('Column header');
        if (node.name) parts.push(node.name);
        break;

      case 'rowheader':
        parts.push('Row header');
        if (node.name) parts.push(node.name);
        break;

      case 'row':
        parts.push('Row');
        if (node.name) parts.push(node.name);
        break;

      case 'list':
        parts.push('List');
        if (node.name) parts.push(node.name);
        // Count items if possible
        if (node.children.length > 0) {
          const itemCount = node.children.filter(child => child.role === 'listitem').length;
          if (itemCount > 0) {
            parts.push(`${itemCount} items`);
          }
        }
        break;

      case 'listbox':
        parts.push('Listbox');
        if (node.name) parts.push(node.name);
        if (node.properties.multiselectable) {
          parts.push('multiselectable');
        }
        if (node.properties.orientation) {
          parts.push(node.properties.orientation);
        }
        // Count options if possible
        if (node.children.length > 0) {
          const optionCount = node.children.filter(child => child.role === 'option').length;
          if (optionCount > 0) {
            parts.push(`${optionCount} options`);
          }
        }
        break;

      case 'option':
        parts.push('Option');
        if (node.name) parts.push(node.name);
        if (node.states.selected !== undefined) {
          parts.push(node.states.selected ? 'selected' : 'not selected');
        }
        // Announce position in listbox
        if (node.properties.posinset && node.properties.setsize) {
          parts.push(`${node.properties.posinset} of ${node.properties.setsize}`);
        } else if (node.parent && node.parent.role === 'listbox') {
          const options = node.parent.children.filter(child => child.role === 'option');
          const position = options.indexOf(node) + 1;
          if (position > 0) {
            parts.push(`${position} of ${options.length}`);
          }
        }
        break;

      case 'tab':
        parts.push('Tab');
        if (node.name) parts.push(node.name);
        if (node.states.selected !== undefined) {
          parts.push(node.states.selected ? 'selected' : 'not selected');
        }
        // Announce position in tablist
        if (node.properties.posinset && node.properties.setsize) {
          parts.push(`${node.properties.posinset} of ${node.properties.setsize}`);
        } else if (node.parent && node.parent.role === 'tablist') {
          // Calculate position if not explicitly set
          const tabs = node.parent.children.filter(child => child.role === 'tab');
          const position = tabs.indexOf(node) + 1;
          if (position > 0) {
            parts.push(`${position} of ${tabs.length}`);
          }
        }
        break;

      case 'tabpanel':
        parts.push('Tab panel');
        if (node.name) parts.push(node.name);
        break;

      case 'tablist':
        parts.push('Tab list');
        if (node.name) parts.push(node.name);
        break;

      case 'menu':
        parts.push('Menu');
        if (node.name) parts.push(node.name);
        break;

      case 'menuitem':
        parts.push('Menu item');
        if (node.name) parts.push(node.name);
        break;

      case 'menuitemcheckbox':
        parts.push('Menu item checkbox');
        parts.push(node.states.checked ? 'checked' : 'not checked');
        if (node.name) parts.push(node.name);
        break;

      case 'menuitemradio':
        parts.push('Menu item radio');
        parts.push(node.states.checked ? 'selected' : 'not selected');
        if (node.name) parts.push(node.name);
        break;

      case 'tree':
        parts.push('Tree');
        if (node.name) parts.push(node.name);
        break;

      case 'treeitem':
        parts.push('Tree item');
        if (node.name) parts.push(node.name);
        if (node.states.expanded !== undefined) {
          parts.push(node.states.expanded ? 'expanded' : 'collapsed');
        }
        if (node.properties.level) {
          parts.push(`Level ${node.properties.level}`);
        }
        if (node.properties.posinset && node.properties.setsize) {
          parts.push(`${node.properties.posinset} of ${node.properties.setsize}`);
        }
        break;

      case 'dialog':
        parts.push('Dialog');
        if (node.name) parts.push(node.name);
        if (node.properties.modal) {
          parts.push('modal');
        }
        break;

      case 'alertdialog':
        parts.push('Alert dialog');
        if (node.name) parts.push(node.name);
        break;

      case 'alert':
        parts.push('Alert');
        if (node.name) parts.push(node.name);
        break;

      case 'status':
        parts.push('Status');
        if (node.name) parts.push(node.name);
        break;

      case 'progressbar':
        parts.push('Progress bar');
        if (node.name) parts.push(node.name);
        if (node.properties.valuenow !== undefined && node.properties.valuemax !== undefined) {
          const percent = Math.round((node.properties.valuenow / node.properties.valuemax) * 100);
          parts.push(`${percent}%`);
        } else if (node.properties.valuetext) {
          parts.push(node.properties.valuetext);
        }
        break;

      case 'slider':
        parts.push('Slider');
        if (node.name) parts.push(node.name);
        if (node.properties.valuenow !== undefined) {
          parts.push(`${node.properties.valuenow}`);
        }
        if (node.properties.valuemin !== undefined && node.properties.valuemax !== undefined) {
          parts.push(`Min ${node.properties.valuemin}, Max ${node.properties.valuemax}`);
        }
        if (node.properties.orientation) {
          parts.push(node.properties.orientation);
        }
        break;

      case 'spinbutton':
        parts.push('Spin button');
        if (node.name) parts.push(node.name);
        if (node.properties.valuenow !== undefined) {
          parts.push(`${node.properties.valuenow}`);
        } else if (node.value) {
          parts.push(node.value);
        }
        if (node.properties.valuemin !== undefined && node.properties.valuemax !== undefined) {
          parts.push(`Min ${node.properties.valuemin}, Max ${node.properties.valuemax}`);
        }
        break;

      case 'img':
      case 'graphic':
        parts.push('Image');
        if (node.name) parts.push(node.name);
        break;

      case 'region':
        parts.push('Region');
        if (node.name) parts.push(node.name);
        break;

      case 'article':
        parts.push('Article');
        if (node.name) parts.push(node.name);
        break;

      case 'complementary':
        parts.push('Complementary');
        if (node.name) parts.push(node.name);
        break;

      case 'search':
        parts.push('Search');
        if (node.name) parts.push(node.name);
        break;

      case 'form':
        parts.push('Form');
        if (node.name) parts.push(node.name);
        break;

      case 'toolbar':
        parts.push('Toolbar');
        if (node.name) parts.push(node.name);
        if (node.properties.orientation) {
          parts.push(node.properties.orientation);
        }
        break;

      case 'group':
        parts.push('Group');
        if (node.name) parts.push(node.name);
        break;

      case 'radiogroup':
        parts.push('Radio group');
        if (node.name) parts.push(node.name);
        // Count radio buttons in group
        if (node.children.length > 0) {
          const radioCount = node.children.filter(child => child.role === 'radio').length;
          if (radioCount > 0) {
            parts.push(`${radioCount} items`);
          }
        }
        break;

      case 'separator':
        parts.push('Separator');
        if (node.properties.orientation) {
          parts.push(node.properties.orientation);
        }
        break;

      case 'feed':
        parts.push('Feed');
        if (node.name) parts.push(node.name);
        break;

      case 'figure':
        parts.push('Figure');
        if (node.name) parts.push(node.name);
        break;

      case 'term':
        parts.push('Term');
        if (node.name) parts.push(node.name);
        break;

      case 'definition':
        parts.push('Definition');
        if (node.name) parts.push(node.name);
        break;

      case 'abbr':
        parts.push('Abbreviation');
        if (node.name) parts.push(node.name);
        if (node.properties.expansion) {
          parts.push(`Expansion: ${node.properties.expansion}`);
        }
        break;

      case 'blockquote':
        parts.push('Blockquote');
        if (node.name) parts.push(node.name);
        if (node.properties.cite) {
          parts.push(`Citation: ${node.properties.cite}`);
        }
        break;

      case 'code':
        parts.push('Code');
        if (node.name) parts.push(node.name);
        break;

      case 'preformatted':
        parts.push('Preformatted text');
        if (node.name) parts.push(node.name);
        break;

      case 'time':
        parts.push('Time');
        if (node.name) parts.push(node.name);
        if (node.properties.datetime) {
          parts.push(`Date time: ${node.properties.datetime}`);
        }
        break;

      case 'math':
        parts.push('Math');
        if (node.name) parts.push(node.name);
        break;

      case 'directory':
        parts.push('Directory');
        if (node.name) parts.push(node.name);
        break;

      case 'mark':
        parts.push('Highlighted');
        if (node.name) parts.push(node.name);
        break;

      case 'meter':
        parts.push('Meter');
        if (node.name) parts.push(node.name);
        if (node.properties.valuenow !== undefined && node.properties.valuemax !== undefined && node.properties.valuemin !== undefined) {
          // Calculate percentage
          const range = node.properties.valuemax - node.properties.valuemin;
          const percent = Math.round(((node.properties.valuenow - node.properties.valuemin) / range) * 100);
          parts.push(`${percent}%`);

          // Determine state relative to thresholds
          if (node.properties.optimum !== undefined) {
            if (node.properties.low !== undefined && node.properties.valuenow < node.properties.low) {
              parts.push('low');
            } else if (node.properties.high !== undefined && node.properties.valuenow > node.properties.high) {
              parts.push('high');
            } else {
              parts.push('optimal');
            }
          }
        }
        break;

      case 'group':
        // For details elements, announce as disclosure
        if (node.tagName === 'details') {
          parts.push('Details');
          if (node.name) parts.push(node.name);
          if (node.states.expanded !== undefined) {
            parts.push(node.states.expanded ? 'expanded' : 'collapsed');
          }
        } else {
          parts.push('Group');
          if (node.name) parts.push(node.name);
        }
        break;

      case 'kbd':
        parts.push('Keyboard input');
        if (node.name) parts.push(node.name);
        break;

      case 'samp':
        parts.push('Sample output');
        if (node.name) parts.push(node.name);
        break;

      case 'var':
        parts.push('Variable');
        if (node.name) parts.push(node.name);
        break;

      case 'insertion':
        parts.push('Inserted');
        if (node.name) parts.push(node.name);
        if (node.properties.datetime) {
          parts.push(`on ${node.properties.datetime}`);
        }
        if (node.properties.cite) {
          parts.push(`Citation: ${node.properties.cite}`);
        }
        break;

      case 'deletion':
        parts.push('Deleted');
        if (node.name) parts.push(node.name);
        if (node.properties.datetime) {
          parts.push(`on ${node.properties.datetime}`);
        }
        if (node.properties.cite) {
          parts.push(`Citation: ${node.properties.cite}`);
        }
        break;

      case 'quote':
        parts.push('Inline quote');
        if (node.name) parts.push(node.name);
        if (node.properties.cite) {
          parts.push(`Citation: ${node.properties.cite}`);
        }
        break;

      case 'cite':
        parts.push('Citation');
        if (node.name) parts.push(node.name);
        break;

      case 'legend':
        parts.push('Legend');
        if (node.name) parts.push(node.name);
        break;

      case 'caption':
        parts.push('Caption');
        if (node.name) parts.push(node.name);
        break;

      case 'rowgroup':
        // For thead, tbody, tfoot
        if (node.tagName === 'thead') {
          parts.push('Table header');
        } else if (node.tagName === 'tbody') {
          parts.push('Table body');
        } else if (node.tagName === 'tfoot') {
          parts.push('Table footer');
        } else {
          parts.push('Row group');
        }
        if (node.name) parts.push(node.name);
        break;

      case 'strong':
        parts.push('Important');
        if (node.name) parts.push(node.name);
        break;

      case 'emphasis':
        parts.push('Emphasis');
        if (node.name) parts.push(node.name);
        break;

      case 'subscript':
        parts.push('Subscript');
        if (node.name) parts.push(node.name);
        break;

      case 'superscript':
        parts.push('Superscript');
        if (node.name) parts.push(node.name);
        break;

      case 'iframe':
        parts.push('Frame');
        if (node.name) parts.push(node.name);
        break;

      case 'object':
        parts.push('Embedded object');
        if (node.name) parts.push(node.name);
        break;

      case 'audio':
        parts.push('Audio');
        if (node.name) parts.push(node.name);
        break;

      case 'video':
        parts.push('Video');
        if (node.name) parts.push(node.name);
        break;

      default:
        // For group role, check if it's a special element
        if (node.role === 'group') {
          if (node.tagName === 'fieldset') {
            parts.push('Fieldset');
            if (node.name) parts.push(node.name);
          } else if (node.tagName === 'optgroup') {
            parts.push('Option group');
            if (node.name) parts.push(node.name);
          } else if (node.tagName === 'address') {
            parts.push('Contact information');
            if (node.name) parts.push(node.name);
          } else {
            parts.push('Group');
            if (node.name) parts.push(node.name);
          }
        } else if (node.name) {
          parts.push(node.name);
        } else {
          parts.push(node.role);
        }
    }

    // Add description if present
    if (node.description) {
      parts.push(`Description: ${node.description}`);
    }

    // Add error message if invalid and errormessage is present
    if (node.states.invalid && node.properties.errormessage && node.domElement) {
      const errorElement = node.domElement.ownerDocument.getElementById(node.properties.errormessage);
      if (errorElement) {
        const errorText = errorElement.textContent?.trim();
        if (errorText) {
          parts.push(`Error: ${errorText}`);
        }
      }
    }

    // Add disabled state
    if (node.states.disabled) {
      parts.push('disabled');
    }

    // Add busy state
    if (node.states.busy) {
      parts.push('busy');
    }

    // Add grabbed state (drag and drop)
    if (node.states.grabbed !== undefined) {
      parts.push(node.states.grabbed ? 'grabbed' : 'not grabbed');
    }

    // Add keyboard shortcuts if present
    if (node.properties.keyshortcuts) {
      parts.push(`Shortcut: ${node.properties.keyshortcuts}`);
    }

    // Add custom role description if present (overrides default role announcement)
    if (node.properties.roledescription) {
      // Insert roledescription at the beginning instead of role
      parts.unshift(node.properties.roledescription);
    }

    // Add placeholder if present and no value
    if (node.properties.placeholder && !node.value) {
      parts.push(`Placeholder: ${node.properties.placeholder}`);
    }

    // Add details reference if present
    if (node.properties.details && node.domElement) {
      const detailsElement = node.domElement.ownerDocument.getElementById(node.properties.details);
      if (detailsElement) {
        parts.push('Additional details available');
      }
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
   * Check for landmark entry/exit and announce
   */
  private checkLandmarkTransition(previousNode: AccessibilityNode | null, currentNode: AccessibilityNode): void {
    const landmarkRoles = ['navigation', 'main', 'banner', 'contentinfo', 'complementary', 'region', 'search', 'form'];

    // Find landmark ancestors for both nodes
    const previousLandmark = this.findLandmarkAncestor(previousNode);
    const currentLandmark = this.findLandmarkAncestor(currentNode);

    // Exiting a landmark
    if (previousLandmark && previousLandmark !== currentLandmark) {
      this.announce({
        type: 'announcement',
        content: `Exiting ${previousLandmark.role}${previousLandmark.name ? ': ' + previousLandmark.name : ''}`,
        politeness: 'polite',
      });
    }

    // Entering a landmark
    if (currentLandmark && currentLandmark !== previousLandmark) {
      this.announce({
        type: 'announcement',
        content: `Entering ${currentLandmark.role}${currentLandmark.name ? ': ' + currentLandmark.name : ''}`,
        politeness: 'polite',
      });
    }
  }

  /**
   * Find the nearest landmark ancestor
   */
  private findLandmarkAncestor(node: AccessibilityNode | null): AccessibilityNode | null {
    if (!node) return null;

    const landmarkRoles = ['navigation', 'main', 'banner', 'contentinfo', 'complementary', 'region', 'search', 'form'];

    // Check if current node is a landmark
    if (landmarkRoles.includes(node.role)) {
      return node;
    }

    // Traverse up the tree
    let current = node.parent;
    while (current) {
      if (landmarkRoles.includes(current.role)) {
        return current;
      }
      current = current.parent;
    }

    return null;
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
