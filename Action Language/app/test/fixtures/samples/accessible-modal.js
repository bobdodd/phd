/**
 * Accessible Modal Dialog Example
 *
 * This file demonstrates proper modal dialog patterns per WAI-ARIA APG:
 * - role="dialog" and aria-modal="true"
 * - Focus trapping within dialog
 * - Escape key to close
 * - Focus restoration on close
 * - aria-labelledby for title
 *
 * Expected: High accessibility score
 */

const modal = document.querySelector('.modal');
const openButton = document.querySelector('.open-modal');
const closeButton = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');
const modalTitle = document.querySelector('.modal-title');

let previouslyFocused = null;

// Set up ARIA attributes
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
modal.setAttribute('aria-labelledby', 'modal-title');
modalTitle.id = 'modal-title';

// Get focusable elements within modal
function getFocusableElements() {
  return modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}

// Open modal with focus management
function openModal() {
  previouslyFocused = document.activeElement;
  modal.hidden = false;
  overlay.hidden = false;
  modal.setAttribute('aria-hidden', 'false');

  // Focus first focusable element
  const focusable = getFocusableElements();
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

// Close modal and restore focus
function closeModal() {
  modal.hidden = true;
  overlay.hidden = true;
  modal.setAttribute('aria-hidden', 'true');

  // Restore focus
  if (previouslyFocused) {
    previouslyFocused.focus();
  }
}

// Open button
openButton.addEventListener('click', openModal);
openButton.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openModal();
  }
});

// Close button
closeButton.addEventListener('click', closeModal);
closeButton.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    closeModal();
  }
});

// Escape key to close
modal.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }

  // Focus trapping with Tab
  if (event.key === 'Tab') {
    const focusable = getFocusableElements();
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
});

// Click overlay to close
overlay.addEventListener('click', closeModal);
