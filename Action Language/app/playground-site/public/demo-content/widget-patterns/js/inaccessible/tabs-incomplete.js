/**
 * INCOMPLETE Tabs Implementation - FOR DEMONSTRATION ONLY
 * Shows what happens when tabs pattern is partially implemented
 *
 * ❌ Missing:
 * - aria-selected state management
 * - aria-controls attributes
 * - Arrow key navigation
 * - Home/End key support
 * - Roving tabindex management
 */

(function() {
  'use strict';

  const tabsContainer = document.querySelector('#bad-tabs');
  if (!tabsContainer) return;

  const tabs = Array.from(tabsContainer.querySelectorAll('[role="tab"]'));
  const panels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  /**
   * INCOMPLETE: Only handles mouse clicks
   * No keyboard navigation implemented!
   */
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide panels using inline styles (not recommended)
      panels.forEach((panel, i) => {
        if (i === index) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      });

      // ❌ MISSING: aria-selected updates
      // ❌ MISSING: Roving tabindex management
      // ❌ MISSING: Focus management
    });
  });

  // ❌ MISSING: Arrow key navigation
  // ❌ MISSING: Home/End key support
  // ❌ MISSING: Keyboard handler on tablist
  // ❌ MISSING: aria-controls relationships
  // ❌ MISSING: aria-labelledby on panels

  console.warn('⚠️ Incomplete tabs implementation loaded - FOR DEMO ONLY');
  console.warn('Missing: arrow navigation, aria-selected, roving tabindex, aria-controls');
})();
