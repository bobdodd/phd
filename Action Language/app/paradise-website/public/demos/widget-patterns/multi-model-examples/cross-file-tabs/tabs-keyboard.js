/**
 * Tabs Keyboard Navigation - Arrow Keys and Home/End Support
 *
 * This file handles:
 * - Arrow key navigation (Left/Right)
 * - Home/End key support
 * - Focus management
 *
 * NOTE: Click handlers and state management are in tabs-structure.js
 *
 * ✅ This demonstrates Paradise's multi-model architecture:
 * - Traditional tools see tabs-structure.js and report "missing keyboard handler"
 * - Paradise analyzes BOTH files and sees the complete pattern
 * - Result: Zero false positives!
 */

(function() {
  'use strict';

  const tablist = document.querySelector('[role="tablist"]');
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));

  if (!tablist || tabs.length === 0) return;

  /**
   * Handle keyboard navigation within tablist
   */
  tablist.addEventListener('keydown', (event) => {
    const currentTab = document.activeElement;

    // Only process if a tab is currently focused
    if (!tabs.includes(currentTab)) return;

    const currentIndex = tabs.indexOf(currentTab);
    let targetIndex;
    let handled = false;

    switch (event.key) {
      case 'ArrowLeft':
        // Move to previous tab (wrap to end if at beginning)
        targetIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        handled = true;
        break;

      case 'ArrowRight':
        // Move to next tab (wrap to beginning if at end)
        targetIndex = (currentIndex + 1) % tabs.length;
        handled = true;
        break;

      case 'Home':
        // Jump to first tab
        targetIndex = 0;
        handled = true;
        break;

      case 'End':
        // Jump to last tab
        targetIndex = tabs.length - 1;
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();

      // Activate and focus target tab
      const targetTab = tabs[targetIndex];

      // Use activateTab from tabs-structure.js if available
      if (typeof window.activateTab === 'function') {
        window.activateTab(targetTab);
      } else {
        // Fallback: trigger click event
        targetTab.click();
      }

      // Ensure focus moves to target tab
      targetTab.focus();

      console.log('✅ [tabs-keyboard.js] Navigated:', {
        key: event.key,
        from: currentIndex + 1,
        to: targetIndex + 1,
        tab: targetTab.textContent.trim()
      });
    }
  });

  console.log('✅ [tabs-keyboard.js] Keyboard navigation initialized:', {
    tabs: tabs.length,
    features: [
      'Arrow Left/Right navigation',
      'Home/End key support',
      'Wrap-around navigation',
      'Focus management'
    ],
    note: 'Works with tabs-structure.js for complete pattern'
  });
})();
