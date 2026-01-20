/**
 * Session Replay for Virtual Screen Reader
 * Replays recorded sessions with timing, controls, and visual feedback
 */

import { Session, SessionEvent } from './SessionRecorder';

export type ReplayState = 'idle' | 'playing' | 'paused' | 'finished';

export interface ReplayOptions {
  playbackSpeed: number; // 0.5, 1.0, 2.0, etc.
  autoStart?: boolean;
}

export class SessionReplay {
  private session: Session | null = null;
  private state: ReplayState = 'idle';
  private currentEventIndex: number = 0;
  private playbackSpeed: number = 1.0;
  private startTime: number = 0;
  private pausedAt: number = 0;
  private timeoutId: number | null = null;
  private iframeDocument: Document | null = null;

  private onStateChange?: (state: ReplayState) => void;
  private onEventPlayed?: (event: SessionEvent, index: number, total: number) => void;
  private onProgress?: (progress: number) => void; // 0-100
  private onElementHighlight?: (element: HTMLElement | null) => void;

  constructor(
    onStateChange?: (state: ReplayState) => void,
    onEventPlayed?: (event: SessionEvent, index: number, total: number) => void,
    onProgress?: (progress: number) => void,
    onElementHighlight?: (element: HTMLElement | null) => void
  ) {
    this.onStateChange = onStateChange;
    this.onEventPlayed = onEventPlayed;
    this.onProgress = onProgress;
    this.onElementHighlight = onElementHighlight;
  }

  /**
   * Set the iframe document for element highlighting
   */
  setIframeDocument(doc: Document): void {
    this.iframeDocument = doc;
  }

  /**
   * Load a session for replay
   */
  loadSession(session: Session): void {
    this.session = session;
    this.currentEventIndex = 0;
    this.state = 'idle';
    this.startTime = 0;
    this.pausedAt = 0;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.notifyStateChange('idle');
    this.updateProgress();
  }

  /**
   * Start or resume playback
   */
  play(): void {
    if (!this.session) {
      console.error('No session loaded');
      return;
    }

    if (this.state === 'finished') {
      // Restart from beginning
      this.currentEventIndex = 0;
      this.pausedAt = 0;
    }

    this.state = 'playing';

    if (this.pausedAt > 0) {
      // Resuming from pause
      this.startTime = Date.now() - this.pausedAt;
    } else {
      // Starting fresh
      this.startTime = Date.now();
    }

    this.notifyStateChange('playing');
    this.scheduleNextEvent();
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (this.state !== 'playing') return;

    this.state = 'paused';
    this.pausedAt = Date.now() - this.startTime;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.notifyStateChange('paused');
  }

  /**
   * Stop playback and reset to beginning
   */
  stop(): void {
    this.state = 'idle';
    this.currentEventIndex = 0;
    this.pausedAt = 0;
    this.startTime = 0;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.notifyStateChange('idle');
    this.updateProgress();
  }

  /**
   * Skip to specific event
   */
  seekToEvent(eventIndex: number): void {
    if (!this.session) return;

    if (eventIndex < 0 || eventIndex >= this.session.events.length) {
      console.error('Invalid event index:', eventIndex);
      return;
    }

    const wasPlaying = this.state === 'playing';

    if (wasPlaying) {
      this.pause();
    }

    this.currentEventIndex = eventIndex;

    // Calculate the elapsed time up to this event
    const event = this.session.events[eventIndex];
    this.pausedAt = event.timestamp - this.session.startTime;

    // Play this event immediately (for visual feedback)
    this.playEvent(event, eventIndex);

    this.updateProgress();

    if (wasPlaying) {
      this.play();
    }
  }

  /**
   * Skip forward by one event
   */
  stepForward(): void {
    if (!this.session) return;

    if (this.currentEventIndex < this.session.events.length - 1) {
      this.seekToEvent(this.currentEventIndex + 1);
    }
  }

  /**
   * Skip backward by one event
   */
  stepBackward(): void {
    if (!this.session) return;

    if (this.currentEventIndex > 0) {
      this.seekToEvent(this.currentEventIndex - 1);
    }
  }

  /**
   * Change playback speed
   */
  setPlaybackSpeed(speed: number): void {
    if (speed <= 0) {
      console.error('Invalid playback speed:', speed);
      return;
    }

    const wasPlaying = this.state === 'playing';

    if (wasPlaying) {
      // Recalculate timing for new speed
      this.pausedAt = Date.now() - this.startTime;
    }

    this.playbackSpeed = speed;

    if (wasPlaying) {
      // Restart with new speed
      this.startTime = Date.now() - this.pausedAt;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.scheduleNextEvent();
    }
  }

  /**
   * Get current playback state
   */
  getState(): ReplayState {
    return this.state;
  }

  /**
   * Get current progress (0-100)
   */
  getProgress(): number {
    if (!this.session || this.session.events.length === 0) return 0;
    return (this.currentEventIndex / this.session.events.length) * 100;
  }

  /**
   * Get current event index
   */
  getCurrentEventIndex(): number {
    return this.currentEventIndex;
  }

  /**
   * Get total events
   */
  getTotalEvents(): number {
    return this.session?.events.length || 0;
  }

  /**
   * Get current elapsed time (in ms)
   */
  getCurrentTime(): number {
    if (!this.session) return 0;

    if (this.state === 'playing') {
      return Date.now() - this.startTime;
    } else if (this.state === 'paused') {
      return this.pausedAt;
    } else if (this.state === 'finished') {
      return this.session.duration || 0;
    }

    return 0;
  }

  /**
   * Get total duration (in ms)
   */
  getTotalDuration(): number {
    return this.session?.duration || 0;
  }

  /**
   * Get loaded session
   */
  getSession(): Session | null {
    return this.session;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.session = null;
    this.state = 'idle';
  }

  /**
   * Schedule the next event to play
   */
  private scheduleNextEvent(): void {
    if (!this.session || this.state !== 'playing') return;

    // Check if we've finished
    if (this.currentEventIndex >= this.session.events.length) {
      this.finish();
      return;
    }

    const event = this.session.events[this.currentEventIndex];

    // Calculate when this event should play relative to session start
    const eventTime = event.timestamp - this.session.startTime;

    // Calculate elapsed time since we started playback
    const elapsedTime = Date.now() - this.startTime;

    // Calculate how long to wait (adjusted for playback speed)
    const delay = Math.max(0, (eventTime - elapsedTime) / this.playbackSpeed);

    this.timeoutId = window.setTimeout(() => {
      this.playEvent(event, this.currentEventIndex);
      this.currentEventIndex++;
      this.updateProgress();
      this.scheduleNextEvent();
    }, delay);
  }

  /**
   * Play a single event
   */
  private playEvent(event: SessionEvent, index: number): void {
    if (!this.session) return;

    // Find and highlight element if this is a navigation event
    if (event.type === 'navigation' && event.data.elementSelector && this.iframeDocument) {
      const element = this.findElement(event.data.elementSelector, event.data.elementIndex);
      if (element && this.onElementHighlight) {
        this.onElementHighlight(element);
      }
    }

    // Speak the message if available
    if (event.data.message) {
      this.speak(event.data.message.content);
    }

    // Notify listeners
    if (this.onEventPlayed) {
      this.onEventPlayed(event, index, this.session.events.length);
    }

    console.log(`[Replay] Event ${index + 1}/${this.session.events.length}:`, event.type, event.data);
  }

  /**
   * Find an element in the iframe using selector and index
   */
  private findElement(selector: string, index: number = 0): HTMLElement | null {
    if (!this.iframeDocument) return null;

    try {
      const matches = this.iframeDocument.querySelectorAll(selector);
      if (matches.length > index) {
        return matches[index] as HTMLElement;
      }
    } catch (error) {
      console.error('Failed to find element:', selector, error);
    }

    return null;
  }

  /**
   * Speak text using Web Speech API
   */
  private speak(text: string): void {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.5; // Match typical screen reader speed
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Mark replay as finished
   */
  private finish(): void {
    this.state = 'finished';
    this.currentEventIndex = this.session?.events.length || 0;
    this.notifyStateChange('finished');
    this.updateProgress();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Notify state change
   */
  private notifyStateChange(state: ReplayState): void {
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }

  /**
   * Update progress
   */
  private updateProgress(): void {
    if (this.onProgress) {
      this.onProgress(this.getProgress());
    }
  }

  /**
   * Format time for display (mm:ss)
   */
  static formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
