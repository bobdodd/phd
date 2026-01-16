/**
 * Tabs Structure - Click Handlers and Basic Setup
 *
 * This file handles:
 * - Click event handlers for tab buttons
 * - Panel visibility management
 * - aria-selected state updates
 * - Roving tabindex management
 *
 * NOTE: Keyboard navigation is in tabs-keyboard.js (separate file)
 *
 * ⚠️ File-scope analysis would flag this as incomplete because
 * it doesn't see the keyboard handlers in the other file.
 *
 * ✅ Paradise's multi-model analysis sees BOTH files and reports
 * the complete pattern with zero false positives.
 */

(function() {
  'use strict';

  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  /**
   * Activate a specific tab
   * @param {HTMLElement} targetTab - The tab to activate
   */
  function activateTab(targetTab) {
    const targetPanelId = targetTab.getAttribute('aria-controls');
    const targetPanel = document.getElementById(targetPanelId);

    // Update all tabs
    tabs.forEach(tab => {
      const isTarget = tab === targetTab;

      // Update aria-selected
      tab.setAttribute('aria-selected', String(isTarget));

      // Implement roving tabindex
      tab.setAttribute('tabindex', isTarget ? '0' : '-1');
    });

    // Update all panels
    panels.forEach(panel => {
      if (panel === targetPanel) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    console.log('✅ [tabs-structure.js] Tab activated:', targetTab.textContent.trim());
  }

  // Add click handlers to all tabs
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });

    console.log(`✅ [tabs-structure.js] Click handler added to tab ${index + 1}`);
  });

  // Initialize: Ensure first tab is active
  if (tabs.length > 0) {
    const activeTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
    if (activeTab) {
      activateTab(activeTab);
    } else {
      activateTab(tabs[0]);
    }
  }

  // Export activateTab for use by keyboard handler
  window.activateTab = activateTab;

  console.log('✅ [tabs-structure.js] Initialized:', {
    tabs: tabs.length,
    panels: panels.length,
    features: [
      'Click handlers',
      'aria-selected updates',
      'Roving tabindex',
      'Panel visibility management'
    ],
    note: 'Keyboard navigation in tabs-keyboard.js'
  });
})();
