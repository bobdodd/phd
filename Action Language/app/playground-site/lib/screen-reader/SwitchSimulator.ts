/**
 * Switch Simulator for Educational Switch Technology Demonstration
 * Simulates single switch (auto-scan) and dual switch (step-scan) navigation
 */

export type SwitchMode = 'single' | 'dual';
export type ScanState = 'idle' | 'scanning' | 'paused';

export interface SwitchSettings {
  mode: SwitchMode;
  scanSpeed: number; // milliseconds between elements (500-3000)
  autoRestart: boolean; // restart scan after reaching end
  highlightColor: string;
}

export interface ActionableElement {
  id: string;
  domElement: HTMLElement;
  role: string;
  name: string;
  type: 'focusable' | 'clickable' | 'interactive';
  actionDescription: string;
}

export class SwitchSimulator {
  private actionableElements: ActionableElement[] = [];
  private currentIndex: number = -1;
  private scanState: ScanState = 'idle';
  private settings: SwitchSettings;
  private scanInterval: number | null = null;
  private iframeDocument: Document | null = null;

  private onHighlight?: (element: ActionableElement | null) => void;
  private onActivate?: (element: ActionableElement) => void;
  private onLog?: (message: string, type: 'info' | 'action') => void;

  constructor(
    settings: SwitchSettings,
    onHighlight?: (element: ActionableElement | null) => void,
    onActivate?: (element: ActionableElement) => void,
    onLog?: (message: string, type: 'info' | 'action') => void
  ) {
    this.settings = settings;
    this.onHighlight = onHighlight;
    this.onActivate = onActivate;
    this.onLog = onLog;
  }

  /**
   * Load iframe document and build actionable elements list
   */
  loadDocument(iframeDoc: Document): void {
    this.iframeDocument = iframeDoc;
    this.actionableElements = this.buildActionableElementsList(iframeDoc);
    this.currentIndex = -1;
    this.log(`Found ${this.actionableElements.length} actionable elements`, 'info');
  }

  /**
   * Build list of actionable elements from DOM
   */
  private buildActionableElementsList(doc: Document): ActionableElement[] {
    const elements: ActionableElement[] = [];
    let idCounter = 0;

    // Find all focusable elements
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
      '[role="checkbox"]',
      '[role="radio"]',
      '[role="switch"]',
      '[role="tab"]',
      '[role="menuitem"]',
      '[role="option"]'
    ].join(',');

    const focusableElements = doc.querySelectorAll(focusableSelector);

    focusableElements.forEach((el) => {
      const htmlEl = el as HTMLElement;

      // Skip hidden elements
      if (this.isHidden(htmlEl)) return;

      const role = this.getRole(htmlEl);
      const name = this.getAccessibleName(htmlEl);
      const actionDesc = this.getActionDescription(htmlEl, role);

      elements.push({
        id: `actionable-${idCounter++}`,
        domElement: htmlEl,
        role,
        name,
        type: this.getElementType(htmlEl),
        actionDescription: actionDesc
      });
    });

    return elements;
  }

  /**
   * Start scanning
   */
  startScan(): void {
    if (this.scanState === 'scanning') return;

    if (this.actionableElements.length === 0) {
      this.log('No actionable elements found', 'info');
      return;
    }

    this.scanState = 'scanning';
    this.currentIndex = -1;
    this.log('Scan started', 'info');

    if (this.settings.mode === 'single') {
      // Auto-scan mode: automatically advance
      this.scanInterval = window.setInterval(() => {
        this.moveToNext();
      }, this.settings.scanSpeed);
    } else {
      // Dual switch: manual step, start at first element
      this.moveToNext();
    }
  }

  /**
   * Stop scanning
   */
  stopScan(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    this.scanState = 'idle';
    this.currentIndex = -1;
    this.log('Scan stopped', 'info');

    // Clear highlight
    if (this.onHighlight) {
      this.onHighlight(null);
    }
  }

  /**
   * Move to next element
   */
  moveToNext(): void {
    if (this.actionableElements.length === 0) return;

    this.currentIndex++;

    // Wrap around or stop
    if (this.currentIndex >= this.actionableElements.length) {
      if (this.settings.autoRestart) {
        this.currentIndex = 0;
      } else {
        this.stopScan();
        return;
      }
    }

    const element = this.actionableElements[this.currentIndex];

    // Highlight element
    if (this.onHighlight) {
      this.onHighlight(element);
    }

    this.log(`Highlighting: ${element.role} "${element.name}"`, 'info');
  }

  /**
   * Activate current element
   */
  activateCurrentElement(): void {
    if (this.currentIndex < 0 || this.currentIndex >= this.actionableElements.length) {
      return;
    }

    const element = this.actionableElements[this.currentIndex];

    this.log(`ACTIVATED: ${element.role} "${element.name}"`, 'action');

    // Trigger the element's action
    if (element.domElement) {
      // Focus the element
      element.domElement.focus();

      // Click the element (simulates activation)
      element.domElement.click();

      this.log(`${element.actionDescription}`, 'action');
    }

    // Notify callback
    if (this.onActivate) {
      this.onActivate(element);
    }

    // In single switch mode, stop scanning after activation
    if (this.settings.mode === 'single') {
      this.stopScan();
    }
  }

  /**
   * Handle switch press based on mode
   */
  handleSwitchPress(switchNumber: 1 | 2): void {
    if (this.settings.mode === 'single') {
      // Single switch: any press activates
      if (this.scanState === 'scanning') {
        this.activateCurrentElement();
      } else {
        this.startScan();
      }
    } else {
      // Dual switch: switch 1 = step, switch 2 = activate
      if (switchNumber === 1) {
        if (this.scanState !== 'scanning') {
          this.startScan();
        } else {
          this.moveToNext();
        }
      } else if (switchNumber === 2) {
        this.activateCurrentElement();
      }
    }
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<SwitchSettings>): void {
    const oldMode = this.settings.mode;
    this.settings = { ...this.settings, ...newSettings };

    // If mode changed while scanning, restart
    if (newSettings.mode && newSettings.mode !== oldMode && this.scanState === 'scanning') {
      this.stopScan();
      this.startScan();
    }

    // If scan speed changed and we're scanning in single mode, restart with new speed
    if (newSettings.scanSpeed && this.scanState === 'scanning' && this.settings.mode === 'single') {
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
        this.scanInterval = window.setInterval(() => {
          this.moveToNext();
        }, this.settings.scanSpeed);
      }
    }
  }

  /**
   * Get current state
   */
  getState(): { scanState: ScanState; currentIndex: number; totalElements: number; mode: SwitchMode } {
    return {
      scanState: this.scanState,
      currentIndex: this.currentIndex,
      totalElements: this.actionableElements.length,
      mode: this.settings.mode
    };
  }

  /**
   * Get current element
   */
  getCurrentElement(): ActionableElement | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.actionableElements.length) {
      return null;
    }
    return this.actionableElements[this.currentIndex];
  }

  /**
   * Helper: Check if element is hidden
   */
  private isHidden(element: HTMLElement): boolean {
    if (element.getAttribute('aria-hidden') === 'true') return true;

    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return true;

    return false;
  }

  /**
   * Helper: Get element role
   */
  private getRole(element: HTMLElement): string {
    return element.getAttribute('role') || element.tagName.toLowerCase();
  }

  /**
   * Helper: Get accessible name (simplified)
   */
  private getAccessibleName(element: HTMLElement): string {
    // Try aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    // Try text content
    const textContent = element.textContent?.trim();
    if (textContent && textContent.length < 50) return textContent;

    // Try alt for images
    if (element.tagName === 'IMG') {
      return (element as HTMLImageElement).alt || 'Image';
    }

    // Try value for inputs
    if (element.tagName === 'INPUT') {
      return (element as HTMLInputElement).value || (element as HTMLInputElement).placeholder || 'Input';
    }

    return element.tagName.toLowerCase();
  }

  /**
   * Helper: Get action description
   */
  private getActionDescription(element: HTMLElement, role: string): string {
    switch (role) {
      case 'button':
        return 'Click button';
      case 'link':
      case 'a':
        return 'Follow link';
      case 'checkbox':
        return 'Toggle checkbox';
      case 'radio':
        return 'Select radio';
      case 'input':
      case 'textarea':
        return 'Focus input';
      default:
        return 'Activate element';
    }
  }

  /**
   * Helper: Get element type
   */
  private getElementType(element: HTMLElement): 'focusable' | 'clickable' | 'interactive' {
    if (element.hasAttribute('tabindex')) return 'focusable';
    if ((element as any).onclick || element.getAttribute('onclick')) return 'clickable';
    return 'interactive';
  }

  /**
   * Helper: Log message
   */
  private log(message: string, type: 'info' | 'action'): void {
    if (this.onLog) {
      this.onLog(message, type);
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stopScan();
    this.actionableElements = [];
    this.iframeDocument = null;
  }
}
