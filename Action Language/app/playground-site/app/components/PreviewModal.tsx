'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PreviewIframe from './PreviewIframe';
import ReplayControls from './ReplayControls';
import SwitchPanel from './SwitchPanel';
import { AccessibilityNode, SRMessage, NavigationMode } from '../../lib/screen-reader/types';
import { VirtualScreenReader } from '../../lib/screen-reader/VirtualScreenReader';
import { Session, SessionRecorder } from '../../lib/screen-reader/SessionRecorder';
import { SessionReplay } from '../../lib/screen-reader/SessionReplay';
import { SwitchSimulator } from '../../lib/screen-reader/SwitchSimulator';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  initialScreenReaderEnabled?: boolean;
  initialSwitchSimulatorEnabled?: boolean;
}

export default function PreviewModal({
  isOpen,
  onClose,
  htmlContent,
  cssContent,
  jsContent,
  initialScreenReaderEnabled = false,
  initialSwitchSimulatorEnabled = false
}: PreviewModalProps) {
  // Screen reader toggle state
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(initialScreenReaderEnabled);

  // Screen reader states
  const [srOutput, setSrOutput] = useState<SRMessage[]>([]);
  const [currentNode, setCurrentNode] = useState<AccessibilityNode | null>(null);
  const [mode, setMode] = useState<NavigationMode>('browse');
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.5);
  const [isRecording, setIsRecording] = useState(false);

  // Replay states
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replaySession, setReplaySession] = useState<Session | null>(null);

  // Switch simulator states
  const [switchSimulatorEnabled, setSwitchSimulatorEnabled] = useState(false);
  const [switchHighlightedElement, setSwitchHighlightedElement] = useState<HTMLElement | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const iframeDocRef = useRef<Document | null>(null);
  const screenReaderRef = useRef<VirtualScreenReader | null>(null);
  const srOutputRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<SessionReplay | null>(null);
  const switchSimulatorRef = useRef<SwitchSimulator | null>(null);

  // Set initial screen reader and switch simulator state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScreenReaderEnabled(initialScreenReaderEnabled);
      setSwitchSimulatorEnabled(initialSwitchSimulatorEnabled);
    }
  }, [isOpen, initialScreenReaderEnabled, initialSwitchSimulatorEnabled]);

  // Initialize screen reader when enabled
  useEffect(() => {
    if (!isOpen || !screenReaderEnabled) return;

    const sr = new VirtualScreenReader(
      // onAnnouncement callback
      (message) => {
        setSrOutput(prev => [...prev, message]);
        // Auto-scroll to latest message
        setTimeout(() => {
          if (srOutputRef.current) {
            srOutputRef.current.scrollTop = srOutputRef.current.scrollHeight;
          }
        }, 0);
      },
      // onPositionChange callback
      (node, element) => {
        setCurrentNode(node);
        setHighlightedElement(element);
      }
    );

    screenReaderRef.current = sr;

    // Load document if iframe is ready
    if (iframeDocRef.current) {
      sr.loadDocument(iframeDocRef.current);
    }

    return () => {
      // Clean up screen reader resources
      if (screenReaderRef.current) {
        screenReaderRef.current.destroy();
      }
      screenReaderRef.current = null;
    };
  }, [isOpen, screenReaderEnabled]);

  // Handle iframe DOM ready
  const handleDomReady = useCallback((iframeDoc: Document) => {
    iframeDocRef.current = iframeDoc;

    // Build accessibility tree and load into screen reader if enabled
    if (screenReaderEnabled && screenReaderRef.current && !isReplayMode) {
      screenReaderRef.current.loadDocument(iframeDoc);
    }

    // If in replay mode, set iframe document for element highlighting
    if (isReplayMode && replayRef.current) {
      replayRef.current.setIframeDocument(iframeDoc);
    }

    // Load switch simulator if enabled
    if (switchSimulatorEnabled && switchSimulatorRef.current) {
      switchSimulatorRef.current.loadDocument(iframeDoc);
    }
  }, [screenReaderEnabled, isReplayMode, switchSimulatorEnabled]);

  // Toggle switch simulator
  const toggleSwitchSimulator = () => {
    const newState = !switchSimulatorEnabled;
    setSwitchSimulatorEnabled(newState);

    if (newState) {
      // Create simulator
      const simulator = new SwitchSimulator(
        {
          mode: 'single',
          scanSpeed: 1000,
          autoRestart: true,
          highlightColor: '#8b5cf6'
        },
        (element) => {
          // Highlight callback
          if (element && element.domElement) {
            setSwitchHighlightedElement(element.domElement);
          } else {
            setSwitchHighlightedElement(null);
          }
        },
        (element) => {
          // Activate callback
          console.log('Element activated:', element);
        },
        (message, type) => {
          // Log callback
          console.log(`[Switch] ${message}`);
        }
      );

      // Load document if available
      if (iframeDocRef.current) {
        simulator.loadDocument(iframeDocRef.current);
      }

      switchSimulatorRef.current = simulator;
    } else {
      // Cleanup
      if (switchSimulatorRef.current) {
        switchSimulatorRef.current.destroy();
        switchSimulatorRef.current = null;
      }
      setSwitchHighlightedElement(null);
    }
  };

  // Handle switch simulator keyboard events
  useEffect(() => {
    if (!isOpen || !switchSimulatorEnabled || !switchSimulatorRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const simulator = switchSimulatorRef.current;
      if (!simulator) return;

      const state = simulator.getState();

      if (e.key === ' ') {
        e.preventDefault();
        // Space = activate (single mode) or activate (dual mode switch 2)
        simulator.handleSwitchPress(state.mode === 'single' ? 1 : 2);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        // Arrow right = step (dual mode switch 1)
        simulator.handleSwitchPress(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, switchSimulatorEnabled]);

  // Handle keyboard navigation (only when screen reader is enabled)
  useEffect(() => {
    if (!isOpen || !screenReaderEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const sr = screenReaderRef.current;
      if (!sr) return;

      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Prevent default for navigation keys
      const navKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'h', 'H', 'k', 'K', 'b', 'B', 'l', 'L', 'f', 'F', 'm', 'M', 't', 'T', 'i', 'I', 'g', 'G', 'r', 'R'];
      if (navKeys.includes(e.key)) {
        e.preventDefault();
      }

      // Tab key handling (only in focus mode)
      if (e.key === 'Tab' && mode === 'focus') {
        e.preventDefault();
        if (e.shiftKey) {
          sr.previousElement();
        } else {
          sr.nextElement();
        }
        return;
      }

      // Navigate based on key
      switch (e.key) {
        case 'ArrowDown':
          sr.nextElement();
          break;
        case 'ArrowUp':
          sr.previousElement();
          break;
        case 'h':
        case 'H':
          if (e.shiftKey) {
            sr.previousHeading();
          } else {
            sr.nextHeading();
          }
          break;
        case 'k':
        case 'K':
          if (e.shiftKey) {
            sr.previousLink();
          } else {
            sr.nextLink();
          }
          break;
        case 'b':
        case 'B':
          if (e.shiftKey) {
            sr.previousButton();
          } else {
            sr.nextButton();
          }
          break;
        case 'l':
        case 'L':
          sr.nextLandmark();
          break;
        case 'f':
        case 'F':
          sr.nextFormControl();
          break;
        case 't':
        case 'T':
          if (e.shiftKey) {
            sr.previousTable();
          } else {
            sr.nextTable();
          }
          break;
        case 'i':
        case 'I':
          if (e.shiftKey) {
            sr.previousList();
          } else {
            sr.nextList();
          }
          break;
        case 'g':
        case 'G':
          if (e.shiftKey) {
            sr.previousGraphic();
          } else {
            sr.nextGraphic();
          }
          break;
        case 'r':
        case 'R':
          sr.nextRegion();
          break;
        case 'm':
        case 'M':
          // Toggle mode
          sr.toggleMode();
          setMode(sr.getMode());
          break;
        case 'Enter':
          sr.activateElement();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, screenReaderEnabled, onClose, mode]);

  // Handle Escape key when screen reader is disabled
  useEffect(() => {
    if (!isOpen || screenReaderEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, screenReaderEnabled, onClose]);

  // Speech control handlers
  const toggleSpeech = () => {
    if (screenReaderRef.current) {
      const newState = screenReaderRef.current.toggleSpeech();
      setSpeechEnabled(newState);
    }
  };

  const changeSpeechRate = (rate: number) => {
    if (screenReaderRef.current) {
      const speechEngine = screenReaderRef.current.getSpeechEngine();
      speechEngine.updateSettings({ rate });
      setSpeechRate(rate);

      // Record rate change
      const recorder = screenReaderRef.current.getSessionRecorder();
      recorder.recordRateChange(rate);
    }
  };

  // Recording control handlers
  const toggleRecording = () => {
    if (!screenReaderRef.current) return;

    if (isRecording) {
      // Stop recording
      const session = screenReaderRef.current.stopRecording();
      setIsRecording(false);

      if (session) {
        // Auto-download session files
        const recorder = screenReaderRef.current.getSessionRecorder();
        recorder.downloadSession(session);
      }
    } else {
      // Start recording
      screenReaderRef.current.startRecording(htmlContent, cssContent, jsContent);
      setIsRecording(true);
    }
  };

  const exportSession = () => {
    if (!screenReaderRef.current) return;

    const session = screenReaderRef.current.getCurrentSession();
    if (session) {
      const recorder = screenReaderRef.current.getSessionRecorder();
      recorder.downloadSession(session);
    }
  };

  // Replay the current session (most recent recording)
  const replayCurrentSession = () => {
    if (!screenReaderRef.current) return;

    const session = screenReaderRef.current.getCurrentSession();
    if (!session) {
      alert('No session to replay');
      return;
    }

    // Enter replay mode
    setIsReplayMode(true);
    setReplaySession(session);

    // Clear SR output
    setSrOutput([]);
    setCurrentNode(null);
    setHighlightedElement(null);

    // Initialize replay engine with element highlighting
    const replay = new SessionReplay(
      (state) => {
        console.log('Replay state:', state);
      },
      (event) => {
        // Simulate SR announcement for this event
        if (event.data.message) {
          setSrOutput(prev => [...prev, event.data.message!]);

          // Auto-scroll to latest message
          setTimeout(() => {
            if (srOutputRef.current) {
              srOutputRef.current.scrollTop = srOutputRef.current.scrollHeight;
            }
          }, 0);
        }
      },
      (progress) => {
        console.log('Progress:', progress);
      },
      (element) => {
        // Highlight the element during replay
        setHighlightedElement(element);
      }
    );

    replay.loadSession(session);

    // Set iframe document if available
    if (iframeDocRef.current) {
      replay.setIframeDocument(iframeDocRef.current);
    }

    replayRef.current = replay;
  };

  // Load session for replay
  const loadSession = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const session = SessionRecorder.loadFromJSON(text);

        // Validate session
        if (!session.id || !session.events || !session.htmlContent) {
          alert('Invalid session file');
          return;
        }

        // Enter replay mode
        setIsReplayMode(true);
        setReplaySession(session);

        // Stop any ongoing recording
        if (isRecording && screenReaderRef.current) {
          screenReaderRef.current.stopRecording();
          setIsRecording(false);
        }

        // Clear SR output
        setSrOutput([]);
        setCurrentNode(null);
        setHighlightedElement(null);

        // Initialize replay engine with element highlighting
        const replay = new SessionReplay(
          (state) => {
            console.log('Replay state:', state);
          },
          (event, index, total) => {
            // Simulate SR announcement for this event
            if (event.data.message) {
              setSrOutput(prev => [...prev, event.data.message!]);

              // Auto-scroll to latest message
              setTimeout(() => {
                if (srOutputRef.current) {
                  srOutputRef.current.scrollTop = srOutputRef.current.scrollHeight;
                }
              }, 0);
            }
          },
          (progress) => {
            console.log('Progress:', progress);
          },
          (element) => {
            // Highlight the element during replay
            setHighlightedElement(element);
          }
        );

        replay.loadSession(session);

        // Set iframe document if available (will be set when iframe loads)
        if (iframeDocRef.current) {
          replay.setIframeDocument(iframeDocRef.current);
        }

        replayRef.current = replay;

      } catch (error) {
        console.error('Failed to load session:', error);
        alert('Failed to load session file. Please check the file format.');
      }
    };
    input.click();
  };

  // Exit replay mode
  const exitReplayMode = () => {
    if (replayRef.current) {
      replayRef.current.destroy();
      replayRef.current = null;
    }
    setIsReplayMode(false);
    setReplaySession(null);
    setSrOutput([]);
    setCurrentNode(null);
    setHighlightedElement(null);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement;
    modalElement.focus();

    return () => {
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

  // Toggle screen reader and reset states
  const handleScreenReaderToggle = () => {
    if (screenReaderEnabled) {
      // Turning off - reset states
      setSrOutput([]);
      setCurrentNode(null);
      setHighlightedElement(null);
      setMode('browse');
      setIsRecording(false);
    }
    setScreenReaderEnabled(!screenReaderEnabled);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full h-[90vh] max-w-[95vw] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 id="preview-modal-title" className="text-3xl font-bold mb-2">
              Accessibility Preview
            </h2>
            <p className="text-purple-100 text-sm">
              Test your code with assistive technologies
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Assistive Technology Toggles */}
            <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2.5">
              <span className="text-sm text-purple-100 font-medium">Screen Reader</span>
              <button
                onClick={handleScreenReaderToggle}
                type="button"
                className="relative focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-800 rounded-full"
                title={screenReaderEnabled ? 'Disable screen reader' : 'Enable screen reader'}
                aria-label="Screen Reader"
                role="switch"
                aria-checked={screenReaderEnabled}
              >
                <span
                  className={`flex items-center w-11 h-6 rounded-full transition-colors duration-200 ${
                    screenReaderEnabled ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-200 ${
                      screenReaderEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>

            {/* Switch Simulator Toggle */}
            <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2.5">
              <span className="text-sm text-purple-100 font-medium">Switch Simulator</span>
              <button
                onClick={toggleSwitchSimulator}
                type="button"
                className="relative focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-800 rounded-full"
                title={switchSimulatorEnabled ? 'Disable switch simulator' : 'Enable switch simulator'}
                aria-label="Switch Simulator"
                role="switch"
                aria-checked={switchSimulatorEnabled}
              >
                <span
                  className={`flex items-center w-11 h-6 rounded-full transition-colors duration-200 ${
                    switchSimulatorEnabled ? 'bg-purple-600' : 'bg-gray-400'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-200 ${
                      switchSimulatorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>

            {/* Recording & Replay Controls (only when SR is enabled) */}
            {screenReaderEnabled && !isReplayMode && (
              <>
                <div className="h-6 w-px bg-white/30"></div>

                {/* Recording Controls */}
                <button
                  onClick={toggleRecording}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                  aria-label={isRecording ? 'Stop recording session' : 'Start recording session'}
                >
                  {isRecording ? '⏹ Stop' : '⏺ Record'}
                </button>

                {/* Export and Replay buttons (only when stopped and has session) */}
                {!isRecording && screenReaderRef.current?.getCurrentSession() && (
                  <>
                    <button
                      onClick={exportSession}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                      title="Export session to files"
                      aria-label="Export session"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={replayCurrentSession}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                      title="Replay current recording"
                      aria-label="Replay session"
                    >
                      ▶ Replay
                    </button>
                  </>
                )}

                {/* Load button (always available when not recording) */}
                {!isRecording && (
                  <button
                    onClick={loadSession}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    title="Load a saved session file"
                    aria-label="Load session"
                  >
                    📂 Load
                  </button>
                )}
              </>
            )}
            {screenReaderEnabled && isReplayMode && (
              <>
                <div className="h-6 w-px bg-white/30"></div>
                <button
                  onClick={exitReplayMode}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  title="Exit replay mode"
                  aria-label="Exit replay mode"
                >
                  ← Exit Replay
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-4xl leading-none px-3 focus:outline-none focus:ring-2 focus:ring-white rounded ml-2"
              aria-label="Close preview modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview Panel - Full width when both off, 60% when either on */}
          <div className={`flex flex-col ${(screenReaderEnabled || switchSimulatorEnabled) ? 'w-[60%] border-r border-gray-200' : 'w-full'}`}>
            {/* Preview Controls */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
              <button
                onClick={() => {
                  // Refresh preview
                  if (screenReaderEnabled) {
                    setSrOutput([]);
                    setCurrentNode(null);
                    setHighlightedElement(null);
                    if (iframeDocRef.current && screenReaderRef.current) {
                      screenReaderRef.current.loadDocument(iframeDocRef.current);
                    }
                  }
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                🔄 Refresh
              </button>
              <div className="flex-1"></div>
              <div className="text-sm text-gray-600">
                Preview Window
              </div>
            </div>

            {/* Preview Iframe */}
            <div className="flex-1 overflow-auto bg-gray-50">
              <PreviewIframe
                htmlContent={isReplayMode && replaySession ? replaySession.htmlContent : htmlContent}
                cssContent={isReplayMode && replaySession ? replaySession.cssContent : cssContent}
                jsContent={isReplayMode && replaySession ? replaySession.jsContent : jsContent}
                onDomReady={handleDomReady}
                highlightedElement={switchSimulatorEnabled ? switchHighlightedElement : highlightedElement}
                isSwitchMode={switchSimulatorEnabled}
              />
            </div>
          </div>

          {/* Screen Reader Panel - 40% - Only shown when enabled */}
          {screenReaderEnabled && (
            <div className="w-[40%] flex flex-col">
              {/* Current Position Display */}
              <div className="bg-purple-50 border-b border-purple-200 px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-purple-900">
                    Virtual Cursor Position
                  </div>
                  {/* Speech Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSpeech}
                      className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        speechEnabled
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                      }`}
                      title={speechEnabled ? 'Mute speech' : 'Enable speech'}
                      aria-label={speechEnabled ? 'Mute speech' : 'Enable speech'}
                    >
                      {speechEnabled ? '🔊' : '🔇'}
                    </button>
                    {speechEnabled && (
                      <select
                        value={speechRate}
                        onChange={(e) => changeSpeechRate(Number(e.target.value))}
                        className="text-xs px-2 py-1 rounded border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        title="Speech rate"
                        aria-label="Speech rate"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1.0}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={1.75}>1.75x</option>
                        <option value={2.0}>2x</option>
                        <option value={2.5}>2.5x</option>
                        <option value={3.0}>3x</option>
                      </select>
                    )}
                  </div>
                </div>
                <div className="text-lg font-bold text-purple-700">
                  {currentNode ? currentNode.name || currentNode.role : 'Not positioned'}
                </div>
                {currentNode && (
                  <div className="text-sm text-purple-600 mt-1">
                    Role: {currentNode.role}
                    {currentNode.properties.level && ` • Level: ${currentNode.properties.level}`}
                  </div>
                )}
              </div>

              {/* SR Output Log */}
              <div ref={srOutputRef} className="flex-1 overflow-auto bg-white px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Screen Reader Output
                </h3>
                <div className="space-y-2">
                  {srOutput.length === 0 ? (
                    <div className="text-gray-400 italic text-sm">
                      No announcements yet. Start navigating with arrow keys.
                    </div>
                  ) : (
                    srOutput.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          message.type === 'navigation'
                            ? 'bg-blue-50 border-blue-500'
                            : message.type === 'announcement'
                            ? 'bg-green-50 border-green-500'
                            : message.type === 'state-change'
                            ? 'bg-yellow-50 border-yellow-500'
                            : message.type === 'error'
                            ? 'bg-red-50 border-red-500'
                            : message.type === 'page-load'
                            ? 'bg-purple-50 border-purple-500'
                            : 'bg-gray-50 border-gray-500'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Replay Controls (when in replay mode) */}
              {isReplayMode && replaySession && replayRef.current && (
                <ReplayControls
                  replay={replayRef.current}
                  session={replaySession}
                />
              )}

              {/* Navigation Controls (when not in replay mode) */}
              {!isReplayMode && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Navigation Shortcuts
                  </h3>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      ↓
                    </kbd>
                    <span className="text-gray-600">Next</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      ↑
                    </kbd>
                    <span className="text-gray-600">Previous</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      Tab
                    </kbd>
                    <span className="text-gray-600">Next (Focus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      M
                    </kbd>
                    <span className="text-gray-600">Toggle mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      H
                    </kbd>
                    <span className="text-gray-600">Headings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      K
                    </kbd>
                    <span className="text-gray-600">Links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      B
                    </kbd>
                    <span className="text-gray-600">Buttons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      L
                    </kbd>
                    <span className="text-gray-600">Landmarks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      R
                    </kbd>
                    <span className="text-gray-600">Regions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      F
                    </kbd>
                    <span className="text-gray-600">Form controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      T
                    </kbd>
                    <span className="text-gray-600">Tables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      I
                    </kbd>
                    <span className="text-gray-600">Lists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      G
                    </kbd>
                    <span className="text-gray-600">Graphics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      Enter
                    </kbd>
                    <span className="text-gray-600">Activate</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 italic mb-3">
                  Use Shift + key for previous item (e.g., Shift+H for previous heading)
                </div>

                {/* Mode Toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Mode:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (screenReaderRef.current) {
                          screenReaderRef.current.toggleMode();
                          setMode(screenReaderRef.current.getMode());
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        mode === 'browse'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Browse
                    </button>
                    <button
                      onClick={() => {
                        if (screenReaderRef.current) {
                          screenReaderRef.current.toggleMode();
                          setMode(screenReaderRef.current.getMode());
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        mode === 'focus'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Focus
                    </button>
                  </div>
                </div>
                </div>
              )}
            </div>
          )}

          {/* Switch Simulator Panel - 40% - Only shown when enabled */}
          {switchSimulatorEnabled && (
            <div className="w-[40%] flex flex-col border-l border-gray-200">
              <SwitchPanel
                simulator={switchSimulatorRef.current}
                isEnabled={switchSimulatorEnabled}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
