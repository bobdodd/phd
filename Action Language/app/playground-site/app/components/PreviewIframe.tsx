'use client';

import { useEffect, useRef } from 'react';

interface PreviewIframeProps {
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  onDomReady: (iframeDoc: Document) => void;
  highlightedElement?: HTMLElement | null;
}

export default function PreviewIframe({
  htmlContent,
  cssContent,
  jsContent,
  onDomReady,
  highlightedElement
}: PreviewIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previousHighlightRef = useRef<HTMLElement | null>(null);

  // Build and inject HTML into iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Build complete HTML document
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      padding: 1rem;
    }

    /* User's CSS */
    ${cssContent}
  </style>
</head>
<body>
  ${htmlContent}

  <script>
    // Wrap user JavaScript in try-catch for safety
    try {
      ${jsContent}
    } catch (error) {
      console.error('Preview JavaScript Error:', error);
      // Display error in preview
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #fee; border: 2px solid #c00; color: #c00; padding: 1rem; font-family: monospace; font-size: 12px; z-index: 9999;';
      errorDiv.textContent = 'JavaScript Error: ' + error.message;
      document.body.insertBefore(errorDiv, document.body.firstChild);
    }
  </script>
</body>
</html>`;

    // Use srcdoc for sandboxed execution
    iframe.srcdoc = fullHTML;

    // Handle iframe load
    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        onDomReady(iframeDoc);
      }
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [htmlContent, cssContent, jsContent, onDomReady]);

  // Handle element highlighting
  useEffect(() => {
    // Remove previous highlight
    if (previousHighlightRef.current) {
      previousHighlightRef.current.style.outline = '';
      previousHighlightRef.current.style.backgroundColor = '';
      previousHighlightRef.current.style.position = '';
      previousHighlightRef.current.style.zIndex = '';
    }

    // Add new highlight
    if (highlightedElement) {
      // Store for cleanup
      previousHighlightRef.current = highlightedElement;

      // Apply highlight styles
      const originalPosition = window.getComputedStyle(highlightedElement).position;
      if (originalPosition === 'static') {
        highlightedElement.style.position = 'relative';
      }

      highlightedElement.style.outline = '3px solid #3b82f6';
      highlightedElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      highlightedElement.style.zIndex = '1000';

      // Scroll into view
      highlightedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }

    return () => {
      // Cleanup on unmount
      if (previousHighlightRef.current) {
        previousHighlightRef.current.style.outline = '';
        previousHighlightRef.current.style.backgroundColor = '';
        previousHighlightRef.current.style.position = '';
        previousHighlightRef.current.style.zIndex = '';
      }
    };
  }, [highlightedElement]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-none bg-white"
      sandbox="allow-scripts allow-same-origin"
      title="Code Preview"
    />
  );
}
