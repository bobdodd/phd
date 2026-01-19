/**
 * INCOMPLETE Accordion Implementation - FOR DEMONSTRATION ONLY
 * Shows what happens when accordion pattern is partially implemented
 *
 * ❌ Missing:
 * - aria-expanded attributes on buttons
 * - aria-controls attributes on buttons
 * - aria-labelledby on panels
 * - State updates (aria-expanded not updated on toggle)
 * - Arrow key navigation
 */

(function() {
  'use strict';

  const accordion = document.getElementById('bad-accordion');
  if (!accordion) return;

  const buttons = Array.from(accordion.querySelectorAll('.accordion-button'));

  /**
   * INCOMPLETE: Only show/hide, no ARIA state management
   */
  function togglePanel(button) {
    const panelId = button.getAttribute('data-panel');
    const panel = document.getElementById(panelId);

    if (!panel) return;

    // Toggle visibility using hidden attribute
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }

    // ❌ MISSING: aria-expanded update
    // ❌ MISSING: State communication to assistive technology

    console.warn('⚠️ Panel toggled without ARIA state update:', panelId);
  }

  // Basic click handlers (incomplete)
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      togglePanel(button);
    });

    console.warn(`⚠️ Incomplete accordion button ${index + 1}:`, {
      missingAriaExpanded: true,
      missingAriaControls: true,
      usingDataAttribute: true
    });
  });

  // ❌ MISSING: Keyboard navigation
  // ❌ MISSING: Arrow key handlers
  // ❌ MISSING: Home/End key support

  console.warn('⚠️ Incomplete accordion implementation loaded - FOR DEMO ONLY');
  console.warn('Missing features:');
  console.warn('- No aria-expanded attributes on buttons');
  console.warn('- No aria-controls attributes linking buttons to panels');
  console.warn('- No aria-labelledby on panels');
  console.warn('- aria-expanded not updated when toggling');
  console.warn('- No arrow key navigation');
})();
