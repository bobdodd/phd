/**
 * Menu Structure - Open/Close and Visibility Management
 *
 * This file handles:
 * - Opening and closing the menu
 * - aria-expanded state updates
 * - Click handlers for button
 * - Outside click detection
 *
 * File 2 of 4 in distributed menu pattern
 *
 * ⚠️ File-scope analysis would report FALSE POSITIVE:
 * "Button has click handler but no keyboard handler"
 * (Keyboard handlers are in menu-actions.js)
 */

(function() {
  'use strict';

  const { button, menu, items, state, options } = window.MenuConfig;

  /**
   * Open the menu
   */
  window.openMenu = function() {
    state.isOpen = true;

    // Update ARIA state
    button.setAttribute('aria-expanded', 'true');

    // Show menu
    menu.removeAttribute('hidden');

    // Focus first menu item
    if (items && items.length > 0) {
      items[0].focus();
      state.currentIndex = 0;
    }

    console.log('✅ [menu-structure.js] Menu opened:', {
      ariaExpanded: button.getAttribute('aria-expanded'),
      focusedItem: items[0]?.id
    });
  };

  /**
   * Close the menu
   */
  window.closeMenu = function() {
    state.isOpen = false;

    // Update ARIA state
    button.setAttribute('aria-expanded', 'false');

    // Hide menu
    menu.setAttribute('hidden', '');

    // Return focus to button
    button.focus();

    // Reset state
    state.currentIndex = -1;

    console.log('✅ [menu-structure.js] Menu closed:', {
      ariaExpanded: button.getAttribute('aria-expanded'),
      focusRestored: true
    });
  };

  /**
   * Toggle menu open/close
   */
  function toggleMenu() {
    if (state.isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Button click handler
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking outside
  if (options.closeOnOutsideClick) {
    document.addEventListener('click', (event) => {
      if (state.isOpen) {
        const isInsideMenu = event.target.closest('#demo-menu-button, #demo-menu');
        if (!isInsideMenu) {
          closeMenu();
          console.log('✅ [menu-structure.js] Menu closed by outside click');
        }
      }
    });
  }

  console.log('✅ [menu-structure.js] Menu structure handlers initialized:', {
    features: [
      'Open/close functionality',
      'aria-expanded updates',
      'Button click handler',
      'Outside click detection',
      'Focus management'
    ],
    note: 'Keyboard handlers in menu-actions.js, navigation in menu-navigation.js'
  });
})();
