'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PreviewIframe from './PreviewIframe';
import { AccessibilityNode, SRMessage, NavigationMode } from '../../lib/screen-reader/types';
import { VirtualScreenReader } from '../../lib/screen-reader/VirtualScreenReader';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  htmlContent,
  cssContent,
  jsContent
}: PreviewModalProps) {
  // Screen reader toggle state
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Screen reader states
  const [srOutput, setSrOutput] = useState<SRMessage[]>([]);
  const [currentNode, setCurrentNode] = useState<AccessibilityNode | null>(null);
  const [mode, setMode] = useState<NavigationMode>('browse');
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.5);
  const [isRecording, setIsRecording] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const iframeDocRef = useRef<Document | null>(null);
  const screenReaderRef = useRef<VirtualScreenReader | null>(null);
  const srOutputRef = useRef<HTMLDivElement>(null);

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
    if (screenReaderEnabled && screenReaderRef.current) {
      screenReaderRef.current.loadDocument(iframeDoc);
    }
  }, [screenReaderEnabled]);

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
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <span className="text-sm text-purple-100">Screen Reader:</span>
              <button
                onClick={handleScreenReaderToggle}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                  screenReaderEnabled
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title={screenReaderEnabled ? 'Disable screen reader' : 'Enable screen reader'}
                aria-label={screenReaderEnabled ? 'Disable screen reader' : 'Enable screen reader'}
                aria-pressed={screenReaderEnabled}
              >
                {screenReaderEnabled ? 'On' : 'Off'}
              </button>
            </div>

            {/* Future: Switch Simulation Toggle (commented for now) */}
            {/*
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <span className="text-sm text-purple-100">Switches:</span>
              <button
                onClick={handleSwitchToggle}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
                  switchEnabled
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                aria-pressed={switchEnabled}
              >
                {switchEnabled ? 'On' : 'Off'}
              </button>
            </div>
            */}

            {/* Recording Controls (only when SR is enabled) */}
            {screenReaderEnabled && (
              <>
                <div className="h-6 w-px bg-white/30"></div>
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
                {isRecording && (
                  <button
                    onClick={exportSession}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    title="Export current session"
                    aria-label="Export session"
                  >
                    💾 Export
                  </button>
                )}
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
          {/* Preview Panel - Full width when SR off, 60% when SR on */}
          <div className={`flex flex-col ${screenReaderEnabled ? 'w-[60%] border-r border-gray-200' : 'w-full'}`}>
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
                htmlContent={htmlContent}
                cssContent={cssContent}
                jsContent={jsContent}
                onDomReady={handleDomReady}
                highlightedElement={screenReaderEnabled ? highlightedElement : null}
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

              {/* Navigation Controls */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
