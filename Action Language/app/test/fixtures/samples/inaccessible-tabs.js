/**
 * Inaccessible Tabs Example
 *
 * This file demonstrates common tab widget accessibility issues:
 * - No ARIA roles (tablist, tab, tabpanel)
 * - No arrow key navigation
 * - No focus management
 *
 * Expected issues:
 * - Missing tab widget ARIA roles
 * - Missing keyboard navigation
 * - No aria-selected state
 */

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

// Bad: Click-only tab switching
tabs.forEach((tab, index) => {
  tab.addEventListener('click', function() {
    // Hide all panels
    panels.forEach(p => p.style.display = 'none');
    tabs.forEach(t => t.classList.remove('active'));

    // Show selected panel
    panels[index].style.display = 'block';
    this.classList.add('active');
  });
});