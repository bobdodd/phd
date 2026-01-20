import { SRMessage } from './types';

/**
 * Simulates ARIA Live Region monitoring and announcements
 * Watches for content changes in elements with aria-live attributes
 */
export class LiveRegionSimulator {
  private observers: MutationObserver[] = [];
  private onAnnouncement?: (message: Omit<SRMessage, 'id' | 'timestamp'>) => void;
  private messageIdCounter = 0;

  constructor(onAnnouncement?: (message: Omit<SRMessage, 'id' | 'timestamp'>) => void) {
    this.onAnnouncement = onAnnouncement;
  }

  /**
   * Start observing live regions in the document
   */
  observe(document: Document): void {
    // Clean up any existing observers
    this.disconnect();

    // Find all elements with aria-live attribute
    const liveRegions = document.querySelectorAll('[aria-live]');

    liveRegions.forEach((region) => {
      this.observeRegion(region as HTMLElement);
    });

    // Also observe elements with role="status", "alert", or "log" (implicit live regions)
    const implicitLiveRoles = ['status', 'alert', 'log', 'timer'];
    implicitLiveRoles.forEach((role) => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach((element) => {
        if (!element.hasAttribute('aria-live')) {
          // Add implicit aria-live behavior
          this.observeRegion(element as HTMLElement, this.getImplicitPoliteness(role));
        }
      });
    });
  }

  /**
   * Observe a single live region
   */
  private observeRegion(region: HTMLElement, overridePoliteness?: 'polite' | 'assertive'): void {
    // Get politeness level
    const ariaLive = overridePoliteness || region.getAttribute('aria-live');
    const politeness = this.normalizePoliteness(ariaLive);

    if (politeness === 'off') {
      // aria-live="off" means don't announce
      return;
    }

    // Get atomic setting (whether to announce entire region or just changes)
    const atomic = region.getAttribute('aria-atomic') === 'true';

    // Get relevant setting (what types of changes to announce)
    const relevant = region.getAttribute('aria-relevant') || 'additions text';
    const relevantTypes = relevant.split(' ');

    // Create mutation observer
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        let shouldAnnounce = false;
        let content = '';

        // Check if this mutation type is relevant
        if (mutation.type === 'characterData' && relevantTypes.includes('text')) {
          shouldAnnounce = true;
          content = atomic ? region.textContent?.trim() || '' : mutation.target.textContent?.trim() || '';
        } else if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0 && relevantTypes.includes('additions')) {
            shouldAnnounce = true;
          } else if (mutation.removedNodes.length > 0 && relevantTypes.includes('removals')) {
            shouldAnnounce = true;
          }
          content = atomic ? region.textContent?.trim() || '' : this.getChangedContent(mutation);
        } else if (mutation.type === 'attributes' && relevantTypes.includes('attributes')) {
          // Attribute changes might affect text content
          shouldAnnounce = true;
          content = region.textContent?.trim() || '';
        }

        if (shouldAnnounce && content) {
          this.announce({
            type: politeness === 'assertive' ? 'announcement' : 'state-change',
            content,
            politeness,
          });
        }
      }
    });

    // Configure observer options based on relevant attribute
    const observerConfig: MutationObserverInit = {
      childList: relevantTypes.includes('additions') || relevantTypes.includes('removals'),
      characterData: relevantTypes.includes('text'),
      subtree: true,
      characterDataOldValue: false,
    };

    if (relevantTypes.includes('attributes')) {
      observerConfig.attributes = true;
    }

    observer.observe(region, observerConfig);
    this.observers.push(observer);
  }

  /**
   * Get content from mutation
   */
  private getChangedContent(mutation: MutationRecord): string {
    const contents: string[] = [];

    // Get text from added nodes
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) contents.push(text);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const text = (node as Element).textContent?.trim();
        if (text) contents.push(text);
      }
    });

    return contents.join(' ');
  }

  /**
   * Normalize politeness value
   */
  private normalizePoliteness(value: string | null): 'off' | 'polite' | 'assertive' {
    if (!value) return 'off';

    const normalized = value.toLowerCase();
    if (normalized === 'assertive') return 'assertive';
    if (normalized === 'polite') return 'polite';
    return 'off';
  }

  /**
   * Get implicit politeness for role-based live regions
   */
  private getImplicitPoliteness(role: string): 'polite' | 'assertive' {
    switch (role) {
      case 'alert':
        return 'assertive';
      case 'status':
      case 'log':
      case 'timer':
      default:
        return 'polite';
    }
  }

  /**
   * Send an announcement
   */
  private announce(messageData: Omit<SRMessage, 'id' | 'timestamp'>): void {
    if (this.onAnnouncement) {
      this.onAnnouncement(messageData);
    }
  }

  /**
   * Stop observing all live regions
   */
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.disconnect();
    this.onAnnouncement = undefined;
  }
}
