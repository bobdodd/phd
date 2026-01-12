/**
 * Accessible Button Example
 *
 * This file demonstrates proper accessibility patterns:
 * - Keyboard support for all interactions
 * - Proper ARIA attributes
 * - Focus management
 *
 * Expected: High accessibility score, no errors
 */

const customButton = document.querySelector('.custom-button');

// Set initial ARIA attributes
customButton.setAttribute('role', 'button');
customButton.setAttribute('aria-pressed', 'false');
customButton.setAttribute('tabindex', '0');

// Good: Click handler
function handleActivation(event) {
  const isPressed = customButton.getAttribute('aria-pressed') === 'true';
  customButton.setAttribute('aria-pressed', String(!isPressed));
  customButton.classList.toggle('active');
  customButton.textContent = !isPressed ? 'ON' : 'OFF';
}

customButton.addEventListener('click', handleActivation);

// Good: Keyboard handler for Enter and Space
customButton.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleActivation(event);
  }
});

// Good: Focus styles (managed via CSS, but we track focus)
customButton.addEventListener('focus', function() {
  this.classList.add('focused');
});

customButton.addEventListener('blur', function() {
  this.classList.remove('focused');
});
