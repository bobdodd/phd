/**
 * Complete Accessible Dialog Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Dialog (Modal)
 *
 * Key Features:
 * - Focus trap (Tab/Shift+Tab cycle within dialog)
 * - Escape key closes dialog
 * - Focus restoration (returns to trigger on close)
 * - Initial focus management (moves into dialog on open)
 * - ARIA attributes (role, aria-modal, aria-labelledby)
 */

(function() {
  'use strict';

  const trigger = document.getElementById('good-trigger');
  const overlay = document.getElementById('good-dialog-overlay');
  const dialog = document.getElementById('good-dialog');
  const closeButton = document.getElementById('good-dialog-close');
  const cancelButton = document.getElementById('good-dialog-cancel');
  const confirmButton = document.getElementById('good-dialog-confirm');

  if (!trigger || !overlay || !dialog) return;

  let previousFocus = null;
  let isOpen = false;

  /**
   * Get all focusable elements within dialog
   */
  function getFocusableElements() {
    return Array.from(
      dialog.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      )
    );
  }

  /**
   * Open dialog with complete accessibility support
   */
  function openDialog() {
    if (isOpen) return;

    // Store current focus for restoration
    previousFocus = document.activeElement;

    // Show dialog
    overlay.classList.add('visible');
    isOpen = true;

    // Move focus to first focusable element (close button)
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listeners
    dialog.addEventListener('keydown', handleDialogKeydown);
    overlay.addEventListener('click', handleOverlayClick);

    // Trap background scroll
    document.body.style.overflow = 'hidden';

    console.log('✅ Accessible dialog opened:', {
      previousFocus: previousFocus?.id || previousFocus?.tagName,
      focusableCount: focusableElements.length,
      ariaModal: dialog.getAttribute('aria-modal'),
      ariaLabelledby: dialog.getAttribute('aria-labelledby'),
      role: dialog.getAttribute('role')
    });
  }

  /**
   * Close dialog with focus restoration
   */
  function closeDialog() {
    if (!isOpen) return;

    // Hide dialog
    overlay.classList.remove('visible');
    isOpen = false;

    // Restore focus to trigger element
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
      console.log('✅ Focus restored to:', previousFocus.id || previousFocus.tagName);
    }

    // Remove event listeners
    dialog.removeEventListener('keydown', handleDialogKeydown);
    overlay.removeEventListener('click', handleOverlayClick);

    // Restore background scroll
    document.body.style.overflow = '';

    console.log('✅ Accessible dialog closed with focus restoration');
  }

  /**
   * Handle keyboard events within dialog
   * Implements focus trap and Escape key handling
   */
  function handleDialogKeydown(event) {
    // Escape key closes dialog
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      console.log('✅ Dialog closed with Escape key');
      return;
    }

    // Tab key implements focus trap
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentElement = document.activeElement;

      // Shift+Tab on first element: wrap to last
      if (event.shiftKey && currentElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        console.log('✅ Focus trap: Shift+Tab wrapped to last element');
      }
      // Tab on last element: wrap to first
      else if (!event.shiftKey && currentElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
        console.log('✅ Focus trap: Tab wrapped to first element');
      }
    }
  }

  /**
   * Handle clicks on overlay (outside dialog)
   * Close dialog when clicking backdrop
   */
  function handleOverlayClick(event) {
    // Only close if clicking directly on overlay (not dialog content)
    if (event.target === overlay) {
      closeDialog();
      console.log('✅ Dialog closed by clicking overlay');
    }
  }

  // Trigger button opens dialog
  trigger.addEventListener('click', openDialog);

  // Close button closes dialog
  if (closeButton) {
    closeButton.addEventListener('click', closeDialog);
  }

  // Cancel button closes dialog
  if (cancelButton) {
    cancelButton.addEventListener('click', closeDialog);
  }

  // Confirm button closes dialog (in real app, would perform action first)
  if (confirmButton) {
    confirmButton.addEventListener('click', () => {
      console.log('✅ Confirm action triggered');
      closeDialog();
    });
  }

  console.log('✅ Accessible dialog initialized:', {
    trigger: trigger.id,
    dialog: dialog.id,
    features: [
      'Focus trap (Tab/Shift+Tab)',
      'Escape key handler',
      'Focus restoration',
      'Initial focus management',
      'Overlay click to close',
      'ARIA attributes (role, aria-modal, aria-labelledby)'
    ]
  });
})();
