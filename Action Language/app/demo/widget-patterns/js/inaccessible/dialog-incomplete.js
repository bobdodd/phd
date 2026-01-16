/**
 * INCOMPLETE Dialog Implementation - FOR DEMONSTRATION ONLY
 * Shows what happens when dialog pattern is partially implemented
 *
 * ❌ Missing:
 * - role="dialog" attribute
 * - aria-modal="true" attribute
 * - aria-labelledby attribute
 * - Focus trap (Tab can escape to background)
 * - Escape key handler
 * - Focus restoration
 * - Initial focus management
 */

(function() {
  'use strict';

  const trigger = document.getElementById('bad-trigger');
  const overlay = document.getElementById('bad-dialog-overlay');
  const closeButton = document.getElementById('bad-dialog-close');
  const cancelButton = document.getElementById('bad-dialog-cancel');
  const confirmButton = document.getElementById('bad-dialog-confirm');

  if (!trigger || !overlay) return;

  /**
   * INCOMPLETE: Only show/hide, no accessibility
   */
  function openDialog() {
    overlay.classList.add('visible');

    // ❌ MISSING: Store previous focus for restoration
    // ❌ MISSING: Move focus into dialog
    // ❌ MISSING: Focus trap implementation
    // ❌ MISSING: Escape key handler

    console.warn('⚠️ Incomplete dialog opened - FOR DEMO ONLY');
    console.warn('Missing: focus trap, Escape handler, focus restoration, ARIA attributes');
  }

  /**
   * INCOMPLETE: Only hide, no focus restoration
   */
  function closeDialog() {
    overlay.classList.remove('visible');

    // ❌ MISSING: Focus restoration to trigger element
    // ❌ MISSING: Remove event listeners

    console.warn('⚠️ Incomplete dialog closed - focus not restored');
  }

  /**
   * INCOMPLETE: Click on overlay closes dialog
   * This works but missing keyboard equivalent
   */
  function handleOverlayClick(event) {
    if (event.target === overlay) {
      closeDialog();
    }
  }

  // Basic open/close functionality (incomplete)
  trigger.addEventListener('click', openDialog);
  overlay.addEventListener('click', handleOverlayClick);

  if (closeButton) {
    closeButton.addEventListener('click', closeDialog);
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', closeDialog);
  }

  if (confirmButton) {
    confirmButton.addEventListener('click', closeDialog);
  }

  // ❌ MISSING: Keyboard event listeners for focus trap
  // ❌ MISSING: Escape key handler
  // ❌ MISSING: Tab/Shift+Tab handling
  // ❌ MISSING: Focus management on open/close

  console.warn('⚠️ Incomplete dialog implementation loaded - FOR DEMO ONLY');
  console.warn('Missing features:');
  console.warn('- No focus trap (Tab can escape to background)');
  console.warn('- No Escape key handler');
  console.warn('- No focus restoration');
  console.warn('- No initial focus management');
  console.warn('- Missing ARIA attributes in HTML (role, aria-modal, aria-labelledby)');
})();
