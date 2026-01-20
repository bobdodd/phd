'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PreviewIframe from './PreviewIframe';
import { AccessibilityNode, SRMessage, NavigationMode } from '../../lib/screen-reader/types';
import { VirtualScreenReader } from '../../lib/screen-reader/VirtualScreenReader';

interface ScreenReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
}

export default function ScreenReaderModal({
  isOpen,
  onClose,
  htmlContent,
  cssContent,
  jsContent
}: ScreenReaderModalProps) {
  const [srOutput, setSrOutput] = useState<SRMessage[]>([]);
  const [currentNode, setCurrentNode] = useState<AccessibilityNode | null>(null);
  const [mode, setMode] = useState<NavigationMode>('browse');
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const iframeDocRef = useRef<Document | null>(null);
  const screenReaderRef = useRef<VirtualScreenReader | null>(null);
  const srOutputRef = useRef<HTMLDivElement>(null);

  // Initialize screen reader
  useEffect(() => {
    if (!isOpen) return;

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

    return () => {
      // Clean up screen reader resources
      if (screenReaderRef.current) {
        screenReaderRef.current.destroy();
      }
      screenReaderRef.current = null;
    };
  }, [isOpen]);

  // Handle iframe DOM ready (wrapped in useCallback to prevent infinite loop)
  const handleDomReady = useCallback((iframeDoc: Document) => {
    iframeDocRef.current = iframeDoc;

    // Build accessibility tree and load into screen reader
    if (screenReaderRef.current) {
      screenReaderRef.current.loadDocument(iframeDoc);
    }
  }, []); // No dependencies - screenReaderRef.current is accessed directly

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const sr = screenReaderRef.current;
      if (!sr) return;

      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Prevent default for navigation keys
      const navKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'h', 'H', 'k', 'K', 'b', 'B', 'l', 'L', 'f', 'F', 'm', 'M'];
      if (navKeys.includes(e.key)) {
        e.preventDefault();
      }

      // Tab key handling (only in focus mode - check mode from state)
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
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    // Save original overflow style
    const originalOverflow = document.body.style.overflow;

    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore original overflow when modal closes
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Focus management and trap
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Store the element that had focus before modal opened
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus the modal container initially
    modalElement.focus();

    // Focus trap implementation
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab (backwards)
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab (forwards)
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    modalElement.addEventListener('keydown', handleTabKey);

    return () => {
      modalElement.removeEventListener('keydown', handleTabKey);
      // Restore focus when modal closes
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sr-modal-title"
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
            <h2 id="sr-modal-title" className="text-3xl font-bold mb-2">
              Virtual Screen Reader
            </h2>
            <p className="text-purple-100">
              Navigate with keyboard, experience what screen reader users hear
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-4xl leading-none px-3 focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Close screen reader modal"
          >
            ×
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview Panel - 60% */}
          <div className="w-[60%] flex flex-col border-r border-gray-200">
            {/* Preview Controls */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
              <button
                onClick={() => {
                  // Refresh preview - reload the document
                  setSrOutput([]);
                  setCurrentNode(null);
                  setHighlightedElement(null);
                  if (iframeDocRef.current && screenReaderRef.current) {
                    screenReaderRef.current.loadDocument(iframeDocRef.current);
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
                highlightedElement={highlightedElement}
              />
            </div>
          </div>

          {/* Screen Reader Panel - 40% */}
          <div className="w-[40%] flex flex-col">
            {/* Current Position Display */}
            <div className="bg-purple-50 border-b border-purple-200 px-6 py-4">
              <div className="text-sm font-semibold text-purple-900 mb-1">
                Virtual Cursor Position
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
                  <span className="text-gray-600">Next (Focus mode)</span>
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
                    F
                  </kbd>
                  <span className="text-gray-600">Form controls</span>
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
        </div>
      </div>
    </div>
  );
}
