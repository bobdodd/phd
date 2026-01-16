/**
 * Menu Actions - Activation and Escape Handlers
 *
 * This file handles:
 * - Enter/Space to open menu (on button)
 * - Enter/Space to activate menu items
 * - Escape to close menu
 * - Menu item activation logic
 *
 * File 4 of 4 in distributed menu pattern
 *
 * ⚠️ File-scope analysis would report FALSE POSITIVE:
 * "Activation handlers without navigation"
 * (Navigation handlers are in menu-navigation.js)
 */

(function() {
  'use strict';

  const { button, menu, items, state, options } = window.MenuConfig;

  /**
   * Handle Enter/Space on menu button to open menu
   */
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (!state.isOpen) {
        window.openMenu();
        console.log('✅ [menu-actions.js] Menu opened with keyboard:', {
          key: event.key,
          focusedItem: items[0]?.id
        });
      } else {
        window.closeMenu();
        console.log('✅ [menu-actions.js] Menu closed with keyboard:', {
          key: event.key
        });
      }
    }
  });

  /**
   * Handle Enter/Space on menu items to activate
   */
  items.forEach((item, index) => {
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        // Activate the menu item
        const action = item.textContent.trim();
        console.log('✅ [menu-actions.js] Menu item activated:', {
          index,
          id: item.id,
          action,
          key: event.key
        });

        // In a real app, this would perform the action
        // For demo, we'll just show an alert
        alert(`Action: ${action}`);

        // Close menu after activation if configured
        if (options.closeOnItemActivation) {
          window.closeMenu();
        }
      }
    });

    // Also handle click for mouse users
    item.addEventListener('click', (event) => {
      event.preventDefault();

      const action = item.textContent.trim();
      console.log('✅ [menu-actions.js] Menu item clicked:', {
        index,
        id: item.id,
        action
      });

      alert(`Action: ${action}`);

      if (options.closeOnItemActivation) {
        window.closeMenu();
      }
    });
  });

  /**
   * Handle Escape to close menu
   */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.isOpen) {
      event.preventDefault();
      window.closeMenu();
      console.log('✅ [menu-actions.js] Menu closed with Escape key');
    }
  });

  console.log('✅ [menu-actions.js] Action handlers initialized:', {
    features: [
      'Enter/Space to open menu (button)',
      'Enter/Space to activate items',
      'Click handlers on items',
      'Escape to close menu',
      'Auto-close on activation'
    ],
    itemCount: items.length,
    note: 'Navigation in menu-navigation.js, structure in menu-structure.js'
  });
})();
