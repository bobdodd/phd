/**
 * Accessible Form Implementation
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const form = document.getElementById('good-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameInput = document.getElementById('good-name');
      const emailInput = document.getElementById('good-email');
      const nameError = document.getElementById('good-name-error');
      const emailError = document.getElementById('good-email-error');

      let valid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Name is required';
        nameInput.setAttribute('aria-invalid', 'true');
        nameInput.parentElement.classList.add('error');
        valid = false;
      } else {
        nameError.textContent = '';
        nameInput.setAttribute('aria-invalid', 'false');
        nameInput.parentElement.classList.remove('error');
      }

      // Validate email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Email is required';
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.parentElement.classList.add('error');
        valid = false;
      } else if (!emailInput.value.includes('@')) {
        emailError.textContent = 'Email must be valid';
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.parentElement.classList.add('error');
        valid = false;
      } else {
        emailError.textContent = '';
        emailInput.setAttribute('aria-invalid', 'false');
        emailInput.parentElement.classList.remove('error');
      }

      if (valid) {
        alert('Form submitted successfully! ✓');
        form.reset();
      }
    });
  }
})();
