/**
 * Inaccessible Modal Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues:
 * - No role="dialog" or aria-modal (in HTML)
 * - No focus trap - Tab key escapes to background
 * - No Escape key handler
 * - No focus restoration on close
 * - Missing aria-label on close button (in HTML)
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const trigger = document.getElementById('bad-trigger');
    const backdrop = document.getElementById('bad-modal-backdrop');
    const closeX = document.getElementById('bad-close-x');
    const cancel = document.getElementById('bad-cancel');
    const confirm = document.getElementById('bad-confirm');

    if (!trigger || !backdrop) return;

    // ISSUE: No reference saved for focus restoration
    // let previousFocus = null; // Missing

    // Open modal - only click handler
    trigger.addEventListener('click', openModal);

    // Close handlers
    closeX.addEventListener('click', closeModal);
    cancel.addEventListener('click', closeModal);
    confirm.addEventListener('click', closeModal);

    // Backdrop click closes modal
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    function openModal() {
      // ISSUE: No previousFocus = document.activeElement;

      // Show modal
      backdrop.classList.add('active');

      // ISSUE: Focus not moved into dialog
      // ISSUE: No keyboard listeners added
      // Missing: modal.addEventListener('keydown', handleKeydown);
    }

    function closeModal() {
      // Hide modal
      backdrop.classList.remove('active');

      // ISSUE: Focus not restored to trigger button
      // Missing: if (previousFocus) previousFocus.focus();
    }

    // Missing:
    // - Escape key handler
    // - Tab key focus trap
    // - No trapFocus function
    // - HTML is missing role="dialog" and aria-modal="true"
    // - Close button missing aria-label

    // This creates a keyboard trap - focus can escape the modal
    // and interact with background elements while modal is open!
  }
})();
