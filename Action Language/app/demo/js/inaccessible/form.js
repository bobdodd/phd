/**
 * Inaccessible Form Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues:
 * - No label elements (using div instead)
 * - Placeholder as label anti-pattern
 * - No aria-required
 * - No aria-describedby for error association
 * - No aria-live for error announcements
 * - No aria-invalid state
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const form = document.getElementById('bad-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameInput = document.getElementById('bad-name');
      const emailInput = document.getElementById('bad-email');
      const nameError = document.getElementById('bad-name-error');

      let valid = true;

      // ISSUE: Error message updated without aria-live
      // Screen readers won't announce this change
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Name is required';
        nameInput.parentElement.classList.add('error');
        valid = false;
      } else {
        nameError.textContent = '';
        nameInput.parentElement.classList.remove('error');
      }

      // ISSUE: No error message element at all for email
      if (!emailInput.value.trim()) {
        emailInput.parentElement.classList.add('error');
        valid = false;
      } else {
        emailInput.parentElement.classList.remove('error');
      }

      if (valid) {
        alert('Form submitted ✗ (but inaccessibly)');
        form.reset();
      }
    });
  }
})();
