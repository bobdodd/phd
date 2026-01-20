/**
 * Speech Engine for Virtual Screen Reader
 * Handles audio output using Web Speech API
 */

export interface SpeechSettings {
  enabled: boolean;
  rate: number; // 0.1 to 10
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
  voice: SpeechSynthesisVoice | null;
}

export class SpeechEngine {
  private synth: SpeechSynthesis;
  private settings: SpeechSettings;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private queue: string[] = [];
  private isSpeaking: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;

    // Default settings
    this.settings = {
      enabled: true,
      rate: 1.5, // Slightly faster than normal (screen readers are typically fast)
      pitch: 1.0,
      volume: 1.0,
      voice: null
    };

    // Load preferred voice when available
    this.loadVoices();

    // Voice list loads asynchronously in some browsers
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  /**
   * Load available voices and set default
   */
  private loadVoices(): void {
    const voices = this.synth.getVoices();

    if (voices.length === 0) return;

    // Try to find a good default voice
    // Prefer: English, US, high quality, natural sounding
    const preferredVoice = voices.find(voice =>
      voice.lang === 'en-US' && (
        voice.name.includes('Samantha') || // macOS high quality
        voice.name.includes('Google US English') || // Chrome
        voice.name.includes('Microsoft David') || // Windows
        voice.name.includes('Natural')
      )
    ) || voices.find(voice => voice.lang.startsWith('en-')) || voices[0];

    this.settings.voice = preferredVoice;
  }

  /**
   * Speak text immediately (cancels current speech)
   */
  speak(text: string, interrupt: boolean = true): void {
    if (!this.settings.enabled || !text.trim()) return;

    // Cancel current speech if interrupting
    if (interrupt) {
      this.cancel();
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    if (this.settings.voice) {
      utterance.voice = this.settings.voice;
    }

    // Track speaking state
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentUtterance = utterance;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.processQueue();
    };

    utterance.onerror = (event) => {
      // Only log non-canceled errors (canceled is expected when toggling off)
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.error('Speech synthesis error:', event.error);
      }
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.processQueue();
    };

    // Speak
    this.synth.speak(utterance);
  }

  /**
   * Add text to queue (doesn't interrupt current speech)
   */
  enqueue(text: string): void {
    if (!this.settings.enabled || !text.trim()) return;

    this.queue.push(text);

    // Start processing if not currently speaking
    if (!this.isSpeaking) {
      this.processQueue();
    }
  }

  /**
   * Process queued messages
   */
  private processQueue(): void {
    if (this.queue.length === 0 || this.isSpeaking) return;

    const text = this.queue.shift();
    if (text) {
      this.speak(text, false);
    }
  }

  /**
   * Stop current speech and clear queue
   */
  cancel(): void {
    try {
      this.synth.cancel();
    } catch (error) {
      // Ignore errors from cancel (can happen if nothing is speaking)
    }
    this.queue = [];
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (this.isSpeaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume speech
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Clear the queue
   */
  clearQueue(): void {
    this.queue = [];
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<SpeechSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Get current settings
   */
  getSettings(): SpeechSettings {
    return { ...this.settings };
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  /**
   * Check if speech is currently active
   */
  isSpeakingNow(): boolean {
    return this.isSpeaking;
  }

  /**
   * Check if speech is paused
   */
  isPaused(): boolean {
    return this.synth.paused;
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Enable/disable speech
   */
  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    if (!enabled) {
      this.cancel();
      this.clearQueue();
    }
  }

  /**
   * Check if speech synthesis is supported
   */
  static isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}
