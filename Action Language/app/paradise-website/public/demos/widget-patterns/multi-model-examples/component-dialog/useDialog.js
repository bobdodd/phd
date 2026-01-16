/**
 * useDialog - Custom Hook for Dialog State Management
 *
 * This hook handles:
 * - Dialog open/close state
 * - Focus restoration (stores previous focus, restores on close)
 * - Lifecycle management
 *
 * ✅ Paradise's multi-model analysis detects focus restoration
 * in this hook even when used from a separate component file.
 */

(function() {
  'use strict';

  // Simulated React hook pattern (vanilla JS implementation for demo)
  window.useDialog = function() {
    let isOpen = false;
    let previousFocus = null;

    /**
     * Open dialog and store current focus
     */
    function openDialog() {
      // Store the currently focused element for restoration
      previousFocus = document.activeElement;
      isOpen = true;

      console.log('✅ [useDialog] Dialog opened:', {
        previousFocus: previousFocus?.id || previousFocus?.tagName,
        timestamp: new Date().toISOString()
      });

      return true;
    }

    /**
     * Close dialog and restore focus
     */
    function closeDialog() {
      isOpen = false;

      // Restore focus to the element that had focus before dialog opened
      if (previousFocus && typeof previousFocus.focus === 'function') {
        // Small delay to ensure dialog is hidden before focus restoration
        setTimeout(() => {
          previousFocus.focus();
          console.log('✅ [useDialog] Focus restored to:', {
            element: previousFocus.id || previousFocus.tagName,
            timestamp: new Date().toISOString()
          });
        }, 10);
      } else {
        console.warn('⚠️ [useDialog] No previous focus to restore');
      }

      return false;
    }

    /**
     * Get current dialog state
     */
    function getState() {
      return {
        isOpen,
        previousFocus: previousFocus?.id || previousFocus?.tagName || null
      };
    }

    return {
      isOpen,
      openDialog,
      closeDialog,
      getState
    };
  };

  console.log('✅ [useDialog] Hook initialized:', {
    features: [
      'Dialog state management',
      'Focus storage on open',
      'Focus restoration on close',
      'Lifecycle management'
    ],
    note: 'This hook provides focus restoration for accessible dialogs'
  });
})();
