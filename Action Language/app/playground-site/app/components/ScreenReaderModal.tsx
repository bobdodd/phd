'use client';

import { useState, useEffect, useRef } from 'react';
import PreviewIframe from './PreviewIframe';
import { AccessibilityNode, SRMessage } from '../../lib/screen-reader/types';

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
  const [accessibilityTree, setAccessibilityTree] = useState<AccessibilityNode[]>([]);
  const [srOutput, setSrOutput] = useState<SRMessage[]>([]);
  const [virtualCursorIndex, setVirtualCursorIndex] = useState(0);
  const [currentNode, setCurrentNode] = useState<AccessibilityNode | null>(null);
  const [mode, setMode] = useState<'browse' | 'focus'>('browse');
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const iframeDocRef = useRef<Document | null>(null);

  // Handle iframe DOM ready
  const handleDomReady = (iframeDoc: Document) => {
    iframeDocRef.current = iframeDoc;

    // TODO: Build accessibility tree from iframe DOM
    // For now, just announce page loaded
    const loadMessage: SRMessage = {
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
      type: 'page-load',
      content: 'Page loaded. Use arrow keys to navigate.'
    };

    setSrOutput([loadMessage]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // TODO: Implement keyboard navigation
      // For now, just log
      console.log('Key pressed:', e.key);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Focus the modal when it opens
    const firstFocusable = modalElement.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
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
                  // Refresh preview
                  setSrOutput([]);
                  setVirtualCursorIndex(0);
                  setCurrentNode(null);
                  setHighlightedElement(null);
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
            <div className="flex-1 overflow-auto bg-white px-6 py-4">
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
                          : message.type === 'error'
                          ? 'bg-red-50 border-red-500'
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
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    ↓
                  </kbd>
                  <span className="text-gray-600">Next element</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    ↑
                  </kbd>
                  <span className="text-gray-600">Previous element</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    H
                  </kbd>
                  <span className="text-gray-600">Next heading</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    K
                  </kbd>
                  <span className="text-gray-600">Next link</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    B
                  </kbd>
                  <span className="text-gray-600">Next button</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    Enter
                  </kbd>
                  <span className="text-gray-600">Activate</span>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Mode:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('browse')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      mode === 'browse'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Browse
                  </button>
                  <button
                    onClick={() => setMode('focus')}
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
