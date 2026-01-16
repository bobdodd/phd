/**
 * Menu Setup - Configuration and Element Caching
 *
 * This file handles:
 * - Element caching for performance
 * - Configuration management
 * - State initialization
 *
 * File 1 of 4 in distributed menu pattern
 */

(function() {
  'use strict';

  // Global configuration object shared across all menu files
  window.MenuConfig = {
    // Cached DOM elements
    button: document.getElementById('demo-menu-button'),
    menu: document.getElementById('demo-menu'),
    items: null, // Will be populated after DOM is ready

    // Menu state
    state: {
      isOpen: false,
      currentIndex: -1,
      lastFocusedItem: null
    },

    // Configuration options
    options: {
      closeOnOutsideClick: true,
      closeOnItemActivation: true,
      wrapNavigation: true
    }
  };

  // Initialize menu items after DOM is ready
  function initializeMenuItems() {
    MenuConfig.items = Array.from(
      document.querySelectorAll('#demo-menu [role="menuitem"]')
    );

    console.log('✅ [menu-setup.js] Menu items cached:', {
      count: MenuConfig.items.length,
      ids: MenuConfig.items.map(item => item.id)
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenuItems);
  } else {
    initializeMenuItems();
  }

  console.log('✅ [menu-setup.js] Menu configuration initialized:', {
    button: MenuConfig.button?.id,
    menu: MenuConfig.menu?.id,
    options: MenuConfig.options,
    note: 'This file provides shared configuration for menu-structure.js, menu-navigation.js, and menu-actions.js'
  });
})();
