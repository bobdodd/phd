/**
 * Inaccessible Button Example
 *
 * This file demonstrates common accessibility issues:
 * - Click-only handler without keyboard equivalent
 * - No ARIA attributes
 * - Mouse-only interactions
 *
 * Expected issues:
 * - Missing keyboard handler for click event
 * - No ARIA role or state management
 */

// Bad: Click-only handler on a div
const customButton = document.querySelector('.custom-button');

customButton.addEventListener('click', function(event) {
  this.classList.toggle('active');
  this.textContent = this.classList.contains('active') ? 'ON' : 'OFF';
});

// Bad: Mouse-only hover effect
customButton.addEventListener('mouseover', function() {
  this.style.backgroundColor = '#007bff';
});

customButton.addEventListener('mouseout', function() {
  this.style.backgroundColor = '#ccc';
});

// Bad: Double-click without keyboard alternative
customButton.addEventListener('dblclick', function() {
  alert('Double clicked!');
});
