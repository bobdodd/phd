/**
 * useFocusTrap - Custom Hook for Focus Trap Implementation
 *
 * This hook handles:
 * - Tab key cycling within dialog
 * - Shift+Tab reverse cycling
 * - First/last element wrapping
 * - Focusable element detection
 *
 * ✅ Paradise's multi-model analysis detects focus trap
 * in this hook even when used from a separate component file.
 */

(function() {
  'use strict';

  // Simulated React hook pattern (vanilla JS implementation for demo)
  window.useFocusTrap = function(dialogElement) {
    let trapActive = false;
    let keydownHandler = null;

    /**
     * Get all focusable elements within the dialog
     */
    function getFocusableElements() {
      if (!dialogElement) return [];

      const focusables = dialogElement.querySelectorAll(
        'button:not([disabled]), ' +
        '[href]:not([disabled]), ' +
        'input:not([disabled]), ' +
        'select:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      );

      return Array.from(focusables);
    }

    /**
     * Handle Tab key to trap focus within dialog
     */
    function handleKeyDown(event) {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        // No focusable elements, prevent Tab from doing anything
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentElement = document.activeElement;

      // Shift+Tab on first element: wrap to last
      if (event.shiftKey && currentElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        console.log('✅ [useFocusTrap] Shift+Tab wrapped to last element:', {
          element: lastElement.id || lastElement.tagName,
          totalFocusable: focusableElements.length
        });
      }
      // Tab on last element: wrap to first
      else if (!event.shiftKey && currentElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
        console.log('✅ [useFocusTrap] Tab wrapped to first element:', {
          element: firstElement.id || firstElement.tagName,
          totalFocusable: focusableElements.length
        });
      }
      // Tab/Shift+Tab in middle: let browser handle normally
      else {
        console.log('✅ [useFocusTrap] Tab navigation within dialog:', {
          direction: event.shiftKey ? 'backward' : 'forward',
          currentElement: currentElement.id || currentElement.tagName
        });
      }
    }

    /**
     * Activate focus trap
     */
    function activate() {
      if (trapActive) return;

      trapActive = true;
      keydownHandler = handleKeyDown;
      document.addEventListener('keydown', keydownHandler);

      // Move focus to first focusable element
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      console.log('✅ [useFocusTrap] Focus trap activated:', {
        focusableCount: focusableElements.length,
        firstElement: focusableElements[0]?.id || focusableElements[0]?.tagName
      });
    }

    /**
     * Deactivate focus trap
     */
    function deactivate() {
      if (!trapActive) return;

      trapActive = false;

      if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
      }

      console.log('✅ [useFocusTrap] Focus trap deactivated');
    }

    /**
     * Get current trap state
     */
    function getState() {
      return {
        active: trapActive,
        focusableCount: getFocusableElements().length
      };
    }

    return {
      activate,
      deactivate,
      getState
    };
  };

  console.log('✅ [useFocusTrap] Hook initialized:', {
    features: [
      'Tab key cycling',
      'Shift+Tab reverse cycling',
      'First/last element wrapping',
      'Focusable element detection',
      'Focus trap activation/deactivation'
    ],
    note: 'This hook provides focus trap for accessible dialogs'
  });
})();
