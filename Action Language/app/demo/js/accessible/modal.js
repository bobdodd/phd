/**
 * Accessible Modal Implementation
 * Following WAI-ARIA Authoring Practices for Dialog Pattern
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const trigger = document.getElementById('good-trigger');
    const backdrop = document.getElementById('good-modal-backdrop');
    const modal = document.getElementById('good-modal');
    const closeX = document.getElementById('good-close-x');
    const cancel = document.getElementById('good-cancel');
    const confirm = document.getElementById('good-confirm');

    if (!trigger || !backdrop || !modal) return;

    let previousFocus = null;
    let focusableElements = [];

    // Open modal
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
      // Save reference to trigger button for focus restoration
      previousFocus = document.activeElement;

      // Show modal
      backdrop.classList.add('active');

      // Get all focusable elements within modal
      focusableElements = Array.from(
        modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );

      // Move focus to first focusable element (close button)
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      // Add keyboard listeners
      modal.addEventListener('keydown', handleKeydown);
    }

    function closeModal() {
      // Hide modal
      backdrop.classList.remove('active');

      // Restore focus to trigger button
      if (previousFocus) {
        previousFocus.focus();
      }

      // Remove keyboard listener
      modal.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(e) {
      // Close on Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      // Trap focus with Tab key
      if (e.key === 'Tab') {
        trapFocus(e);
      }
    }

    function trapFocus(e) {
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: Move backwards
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Move forwards
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
})();
