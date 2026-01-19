/**
 * Complete Accessible Tabs Implementation
 * Follows WAI-ARIA Authoring Practices Guide
 */

(function() {
  'use strict';

  // Get references to tabs container
  const tabsContainer = document.querySelector('#good-tabs');
  if (!tabsContainer) return;

  const tablist = tabsContainer.querySelector('[role="tablist"]');
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  /**
   * Activate a specific tab
   * @param {HTMLElement} targetTab - The tab to activate
   */
  function activateTab(targetTab) {
    const targetIndex = tabs.indexOf(targetTab);

    // Update all tabs
    tabs.forEach((tab, index) => {
      const isSelected = index === targetIndex;

      // Update aria-selected state
      tab.setAttribute('aria-selected', String(isSelected));

      // Implement roving tabindex
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    // Update all panels
    panels.forEach((panel, index) => {
      if (index === targetIndex) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    // Focus the activated tab
    targetTab.focus();
  }

  /**
   * Handle arrow key navigation
   */
  tablist.addEventListener('keydown', (event) => {
    const currentTab = document.activeElement;

    // Only process if a tab is focused
    if (!tabs.includes(currentTab)) return;

    const currentIndex = tabs.indexOf(currentTab);
    let targetIndex;

    switch (event.key) {
      case 'ArrowLeft':
        // Move to previous tab (wrap to end if at beginning)
        targetIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        event.preventDefault();
        activateTab(tabs[targetIndex]);
        break;

      case 'ArrowRight':
        // Move to next tab (wrap to beginning if at end)
        targetIndex = (currentIndex + 1) % tabs.length;
        event.preventDefault();
        activateTab(tabs[targetIndex]);
        break;

      case 'Home':
        // Jump to first tab
        event.preventDefault();
        activateTab(tabs[0]);
        break;

      case 'End':
        // Jump to last tab
        event.preventDefault();
        activateTab(tabs[tabs.length - 1]);
        break;

      default:
        // Let other keys work normally
        break;
    }
  });

  /**
   * Handle click on tabs
   */
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });
  });

  // Initialize: Ensure first tab is active
  if (tabs.length > 0) {
    activateTab(tabs[0]);
  }

  console.log('✅ Accessible tabs initialized:', {
    tabs: tabs.length,
    panels: panels.length,
    features: [
      'Arrow key navigation',
      'Home/End support',
      'Roving tabindex',
      'aria-selected state management',
      'Click handlers'
    ]
  });
})();
