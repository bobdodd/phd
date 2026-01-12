/**
 * Inaccessible Modal Dialog Example
 *
 * This file demonstrates common modal accessibility issues:
 * - No role="dialog"
 * - No focus trapping
 * - No Escape key to close
 * - No aria-modal
 *
 * Expected issues:
 * - Missing dialog ARIA attributes
 * - No focus management
 * - Missing keyboard handler for Escape
 */

const modal = document.querySelector('.modal');
const openButton = document.querySelector('.open-modal');
const closeButton = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');

// Bad: Open modal without focus management
openButton.addEventListener('click', function() {
  modal.style.display = 'block';
  overlay.style.display = 'block';
});

// Bad: Close only via click, no Escape key
closeButton.addEventListener('click', function() {
  modal.style.display = 'none';
  overlay.style.display = 'none';
});

// Bad: Click outside to close (mouse only)
overlay.addEventListener('click', function() {
  modal.style.display = 'none';
  overlay.style.display = 'none';
});
