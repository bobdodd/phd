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

    // Parse and clean HTML content to remove link/style/script tags
    // (CSS and JS are provided separately via cssContent and jsContent)
    let cleanedHTML = htmlContent;

    // Remove link tags (external CSS references)
    cleanedHTML = cleanedHTML.replace(/<link[^>]*>/gi, '');

    // Remove style tags (inline CSS - handled separately)
    cleanedHTML = cleanedHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Remove script tags (inline/external JS - handled separately)
    cleanedHTML = cleanedHTML.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

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
  ${cleanedHTML}

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
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

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

      // Apply highlight styles using iframe's window context
      const iframeWindow = iframe.contentWindow;
      const originalPosition = iframeWindow.getComputedStyle(highlightedElement).position;
      if (originalPosition === 'static') {
        highlightedElement.style.position = 'relative';
      }

      // Apply very visible highlight with animation
      highlightedElement.style.outline = '4px solid #ef4444';
      highlightedElement.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
      highlightedElement.style.zIndex = '9999';
      highlightedElement.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.3)';
      highlightedElement.style.transition = 'all 0.2s ease-in-out';

      // Scroll into view within the iframe only (don't affect parent page)
      // Get element's position relative to iframe's document
      const rect = highlightedElement.getBoundingClientRect();
      const iframeDoc = iframe.contentDocument;

      if (iframeDoc && iframeDoc.documentElement) {
        // Calculate target scroll position (center the element)
        const targetScrollTop = rect.top + iframeDoc.documentElement.scrollTop - (iframeWindow.innerHeight / 2) + (rect.height / 2);
        const targetScrollLeft = rect.left + iframeDoc.documentElement.scrollLeft - (iframeWindow.innerWidth / 2) + (rect.width / 2);

        // Scroll the iframe's document smoothly
        iframeDoc.documentElement.scrollTo({
          top: Math.max(0, targetScrollTop),
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth'
        });
      }
    }

    return () => {
      // Cleanup on unmount
      if (previousHighlightRef.current) {
        previousHighlightRef.current.style.outline = '';
        previousHighlightRef.current.style.backgroundColor = '';
        previousHighlightRef.current.style.position = '';
        previousHighlightRef.current.style.zIndex = '';
        previousHighlightRef.current.style.boxShadow = '';
        previousHighlightRef.current.style.transition = '';
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
