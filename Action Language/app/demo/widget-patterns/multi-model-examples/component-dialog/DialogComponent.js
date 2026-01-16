/**
 * DialogComponent - React-Style Component Using Custom Hooks
 *
 * This component:
 * - Uses useDialog hook for state management
 * - Uses useFocusTrap hook for focus cycling
 * - Handles Escape key
 * - Provides ARIA attributes
 *
 * ✅ Paradise analyzes this component + both hooks together
 * and validates the complete dialog pattern with zero false positives.
 */

(function() {
  'use strict';

  // Initialize hooks
  const dialogHook = window.useDialog();
  const overlay = document.getElementById('demo-dialog-overlay');
  const dialog = document.getElementById('demo-dialog');
  const focusTrapHook = window.useFocusTrap(dialog);

  const trigger = document.getElementById('demo-trigger');
  const closeButton = document.getElementById('demo-close');
  const cancelButton = document.getElementById('demo-cancel');
  const confirmButton = document.getElementById('demo-confirm');

  /**
   * Open dialog using both hooks
   */
  function openDialog() {
    // Use dialog hook to manage state and store focus
    dialogHook.openDialog();

    // Show overlay and dialog
    overlay.classList.add('visible');

    // Activate focus trap
    focusTrapHook.activate();

    console.log('✅ [DialogComponent] Dialog opened with hooks:', {
      dialogHook: dialogHook.getState(),
      focusTrap: focusTrapHook.getState()
    });
  }

  /**
   * Close dialog using both hooks
   */
  function closeDialog() {
    // Deactivate focus trap
    focusTrapHook.deactivate();

    // Hide overlay and dialog
    overlay.classList.remove('visible');

    // Use dialog hook to restore focus
    dialogHook.closeDialog();

    console.log('✅ [DialogComponent] Dialog closed with hooks:', {
      dialogHook: dialogHook.getState(),
      focusTrap: focusTrapHook.getState()
    });
  }

  /**
   * Handle Escape key to close dialog
   */
  function handleEscape(event) {
    if (event.key === 'Escape' && overlay.classList.contains('visible')) {
      event.preventDefault();
      closeDialog();
      console.log('✅ [DialogComponent] Dialog closed with Escape key');
    }
  }

  // Wire up event handlers
  trigger.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);
  cancelButton.addEventListener('click', closeDialog);
  confirmButton.addEventListener('click', () => {
    console.log('✅ [DialogComponent] Confirm action triggered');
    closeDialog();
  });

  // Add Escape key handler
  document.addEventListener('keydown', handleEscape);

  console.log('✅ [DialogComponent] Component initialized:', {
    trigger: trigger.id,
    dialog: dialog.id,
    hooks: [
      'useDialog (state + focus restoration)',
      'useFocusTrap (Tab/Shift+Tab cycling)'
    ],
    features: [
      'Opens with focus storage (useDialog)',
      'Focus trap active (useFocusTrap)',
      'Escape key closes',
      'Focus restoration on close (useDialog)',
      'ARIA attributes (role, aria-modal, aria-labelledby)'
    ],
    note: 'Paradise validates complete pattern across all 3 files'
  });
})();
