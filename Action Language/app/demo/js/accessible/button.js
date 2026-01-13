/**
 * Accessible Button Implementation
 * Demonstrates proper keyboard support and ARIA
 */

(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const button1 = document.getElementById('good-button-1');
    const button2 = document.getElementById('good-button-2');
    const output = document.getElementById('good-output');

    if (!button1 || !button2 || !output) return;

    // Native button automatically has keyboard support
    button1.addEventListener('click', function() {
      output.textContent = 'Native button clicked! ✓';
      output.style.background = '#d4edda';
      output.style.color = '#155724';
    });

    // Custom button with proper keyboard support
    button2.addEventListener('click', function() {
      output.textContent = 'Custom button clicked! ✓';
      output.style.background = '#d4edda';
      output.style.color = '#155724';
    });

    // Handle keyboard events for custom button
    button2.addEventListener('keydown', function(event) {
      // Enter or Space should activate the button
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent page scroll on Space
        // Trigger the click event
        button2.click();
      }
    });

    // Add visual feedback for mousedown/keydown
    button2.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.98)';
    });

    button2.addEventListener('mouseup', function() {
      this.style.transform = 'scale(1)';
    });

    button2.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        this.style.transform = 'scale(0.98)';
      }
    });

    button2.addEventListener('keyup', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        this.style.transform = 'scale(1)';
      }
    });
  }
})();
