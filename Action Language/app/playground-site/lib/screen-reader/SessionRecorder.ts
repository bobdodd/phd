/**
 * Session Recorder for Virtual Screen Reader
 * Records navigation sessions for replay, export, and training purposes
 */

import { SRMessage, AccessibilityNode, NavigationMode } from './types';

export interface SessionEvent {
  id: string;
  timestamp: number;
  type: 'navigation' | 'announcement' | 'mode-change' | 'activation' | 'speech-toggle' | 'rate-change';
  data: {
    message?: SRMessage;
    nodeId?: string;
    nodeName?: string;
    nodeRole?: string;
    mode?: NavigationMode;
    command?: string;
    speechEnabled?: boolean;
    speechRate?: number;
    // Element identification for replay
    elementSelector?: string; // CSS selector to find element in DOM
    elementIndex?: number; // Index among elements with same selector
  };
}

export interface Session {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  events: SessionEvent[];
  metadata: {
    totalAnnouncements: number;
    totalNavigations: number;
    modesUsed: NavigationMode[];
    elementsVisited: number;
    averageTimePerElement?: number;
  };
}

export class SessionRecorder {
  private session: Session | null = null;
  private isRecording: boolean = false;
  private eventCounter: number = 0;
  private visitedNodes: Set<string> = new Set();

  /**
   * Start recording a new session
   */
  startRecording(htmlContent: string, cssContent: string, jsContent: string): void {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.session = {
      id: sessionId,
      startTime: Date.now(),
      htmlContent,
      cssContent,
      jsContent,
      events: [],
      metadata: {
        totalAnnouncements: 0,
        totalNavigations: 0,
        modesUsed: [],
        elementsVisited: 0
      }
    };

    this.isRecording = true;
    this.eventCounter = 0;
    this.visitedNodes.clear();

    console.log('Session recording started:', sessionId);
  }

  /**
   * Stop recording the current session
   */
  stopRecording(): Session | null {
    if (!this.session) return null;

    this.isRecording = false;
    this.session.endTime = Date.now();
    this.session.duration = this.session.endTime - this.session.startTime;

    // Calculate metadata
    this.session.metadata.elementsVisited = this.visitedNodes.size;
    if (this.session.metadata.totalNavigations > 0 && this.session.duration) {
      this.session.metadata.averageTimePerElement =
        this.session.duration / this.session.metadata.totalNavigations;
    }

    console.log('Session recording stopped:', this.session.id, `(${this.session.duration}ms)`);

    return this.session;
  }

  /**
   * Record a navigation event
   */
  recordNavigation(message: SRMessage, node: AccessibilityNode | null, command?: string): void {
    if (!this.isRecording || !this.session) return;

    // Generate element selector for replay
    let elementSelector: string | undefined;
    let elementIndex: number | undefined;

    if (node?.domElement) {
      elementSelector = this.generateSelector(node.domElement);
      elementIndex = this.getElementIndex(node.domElement, elementSelector);
    }

    const event: SessionEvent = {
      id: `event-${this.eventCounter++}`,
      timestamp: Date.now(),
      type: 'navigation',
      data: {
        message,
        command,
        nodeId: node?.id,
        nodeName: node?.name,
        nodeRole: node?.role,
        elementSelector,
        elementIndex
      }
    };

    this.session.events.push(event);
    this.session.metadata.totalNavigations++;

    if (node) {
      this.visitedNodes.add(node.id);
    }
  }

  /**
   * Generate a CSS selector for an element
   */
  private generateSelector(element: HTMLElement): string {
    // Try ID first
    if (element.id) {
      return `#${element.id}`;
    }

    // Build path from classes and tag
    const tag = element.tagName.toLowerCase();
    const classes = Array.from(element.classList).slice(0, 3).join('.');

    if (classes) {
      return `${tag}.${classes}`;
    }

    // Fallback to tag + role
    const role = element.getAttribute('role');
    if (role) {
      return `${tag}[role="${role}"]`;
    }

    return tag;
  }

  /**
   * Get index of element among elements matching selector
   */
  private getElementIndex(element: HTMLElement, selector: string): number {
    try {
      const matches = Array.from(element.ownerDocument.querySelectorAll(selector));
      return matches.indexOf(element);
    } catch {
      return 0;
    }
  }

  /**
   * Record an announcement (live region, etc.)
   */
  recordAnnouncement(message: SRMessage): void {
    if (!this.isRecording || !this.session) return;

    const event: SessionEvent = {
      id: `event-${this.eventCounter++}`,
      timestamp: Date.now(),
      type: 'announcement',
      data: {
        message
      }
    };

    this.session.events.push(event);
    this.session.metadata.totalAnnouncements++;
  }

  /**
   * Record a mode change
   */
  recordModeChange(newMode: NavigationMode): void {
    if (!this.isRecording || !this.session) return;

    const event: SessionEvent = {
      id: `event-${this.eventCounter++}`,
      timestamp: Date.now(),
      type: 'mode-change',
      data: {
        mode: newMode
      }
    };

    this.session.events.push(event);

    if (!this.session.metadata.modesUsed.includes(newMode)) {
      this.session.metadata.modesUsed.push(newMode);
    }
  }

  /**
   * Record element activation
   */
  recordActivation(node: AccessibilityNode | null): void {
    if (!this.isRecording || !this.session) return;

    const event: SessionEvent = {
      id: `event-${this.eventCounter++}`,
      timestamp: Date.now(),
      type: 'activation',
      data: {
        nodeId: node?.id,
        nodeName: node?.name,
        nodeRole: node?.role
      }
    };

    this.session.events.push(event);
  }

  /**
   * Record speech toggle
   */
  recordSpeechToggle(enabled: boolean): void {
    if (!this.isRecording || !this.session) return;

    const event: SessionEvent = {
      id: `event-${this.eventCounter++}`,
      timestamp: Date.now(),
      type: 'speech-toggle',
      data: {
        speechEnabled: enabled
      }
    };

    this.session.events.push(event);
  }

  /**
   * Record speech rate change
   */
  recordRateChange(rate: number): void {
    if (!this.isRecording || !this.session) return;

    const event: SessionEvent = {
      id: `event-${this.eventCounter++}`,
      timestamp: Date.now(),
      type: 'rate-change',
      data: {
        speechRate: rate
      }
    };

    this.session.events.push(event);
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.session;
  }

  /**
   * Check if recording
   */
  isSessionRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Export session as JSON
   */
  exportAsJSON(session: Session): string {
    return JSON.stringify(session, null, 2);
  }

  /**
   * Export session as human-readable text
   */
  exportAsText(session: Session): string {
    const lines: string[] = [];

    lines.push('═══════════════════════════════════════════════════════');
    lines.push('           SCREEN READER SESSION RECORDING');
    lines.push('═══════════════════════════════════════════════════════');
    lines.push('');
    lines.push(`Session ID: ${session.id}`);
    lines.push(`Date: ${new Date(session.startTime).toLocaleString()}`);
    lines.push(`Duration: ${session.duration ? (session.duration / 1000).toFixed(2) : '?'} seconds`);
    lines.push('');
    lines.push('─── STATISTICS ───────────────────────────────────────');
    lines.push(`Total Elements Visited: ${session.metadata.elementsVisited}`);
    lines.push(`Total Navigations: ${session.metadata.totalNavigations}`);
    lines.push(`Total Announcements: ${session.metadata.totalAnnouncements}`);
    lines.push(`Modes Used: ${session.metadata.modesUsed.join(', ')}`);
    if (session.metadata.averageTimePerElement) {
      lines.push(`Average Time per Element: ${(session.metadata.averageTimePerElement / 1000).toFixed(2)}s`);
    }
    lines.push('');
    lines.push('─── EVENT LOG ────────────────────────────────────────');
    lines.push('');

    let previousTimestamp = session.startTime;
    session.events.forEach((event, index) => {
      const elapsed = ((event.timestamp - session.startTime) / 1000).toFixed(2);
      const delta = ((event.timestamp - previousTimestamp) / 1000).toFixed(2);
      previousTimestamp = event.timestamp;

      lines.push(`[${elapsed}s] (+${delta}s) Event #${index + 1}`);
      lines.push(`  Type: ${event.type}`);

      if (event.data.message) {
        lines.push(`  Announcement: "${event.data.message.content}"`);
      }

      if (event.data.nodeName) {
        lines.push(`  Element: ${event.data.nodeName} (${event.data.nodeRole})`);
      }

      if (event.data.mode) {
        lines.push(`  Mode: ${event.data.mode}`);
      }

      if (event.data.command) {
        lines.push(`  Command: ${event.data.command}`);
      }

      if (event.data.speechEnabled !== undefined) {
        lines.push(`  Speech: ${event.data.speechEnabled ? 'ON' : 'OFF'}`);
      }

      if (event.data.speechRate !== undefined) {
        lines.push(`  Rate: ${event.data.speechRate}x`);
      }

      lines.push('');
    });

    lines.push('═══════════════════════════════════════════════════════');
    lines.push('                    END OF SESSION');
    lines.push('═══════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  /**
   * Export session with code files as a complete package
   */
  exportAsPackage(session: Session): {
    json: string;
    text: string;
    html: string;
    css: string;
    js: string;
  } {
    return {
      json: this.exportAsJSON(session),
      text: this.exportAsText(session),
      html: session.htmlContent,
      css: session.cssContent,
      js: session.jsContent
    };
  }

  /**
   * Load session from JSON
   */
  static loadFromJSON(json: string): Session {
    return JSON.parse(json);
  }

  /**
   * Create a downloadable file
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Download session as ZIP (requires JSZip or similar)
   * For now, just download files individually
   */
  downloadSession(session: Session): void {
    const pkg = this.exportAsPackage(session);
    const timestamp = new Date(session.startTime).toISOString().replace(/[:.]/g, '-');
    const baseName = `sr-session-${timestamp}`;

    // Download each file
    SessionRecorder.downloadFile(pkg.json, `${baseName}.json`, 'application/json');
    SessionRecorder.downloadFile(pkg.text, `${baseName}-report.txt`, 'text/plain');
    SessionRecorder.downloadFile(pkg.html, `${baseName}.html`, 'text/html');
    SessionRecorder.downloadFile(pkg.css, `${baseName}.css`, 'text/css');
    SessionRecorder.downloadFile(pkg.js, `${baseName}.js`, 'text/javascript');

    console.log('Session files downloaded:', baseName);
  }
}
