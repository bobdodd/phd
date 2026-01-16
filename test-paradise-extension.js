/**
 * Test file for Paradise VS Code Extension
 * This file should trigger accessibility warnings
 */

// Test 1: Mouse-only click handler (should trigger warning)
const button = document.getElementById('submit');
button.addEventListener('click', () => {
  console.log('Button clicked - NO KEYBOARD SUPPORT!');
});

// Test 2: Click handler WITH keyboard support (should NOT trigger warning)
const accessibleButton = document.getElementById('accessible-btn');
accessibleButton.addEventListener('click', () => {
  console.log('Accessible button clicked');
});
accessibleButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    console.log('Accessible button activated via keyboard');
  }
});

// Test 3: Orphaned event handler (element doesn't exist)
const nonExistent = document.getElementById('does-not-exist');
nonExistent.addEventListener('click', () => {
  console.log('This should be flagged as orphaned');
});
1