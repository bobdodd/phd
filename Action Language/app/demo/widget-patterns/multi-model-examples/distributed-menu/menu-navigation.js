/**
 * Menu Navigation - Arrow Key Handlers
 *
 * This file handles:
 * - Arrow Up/Down navigation between menu items
 * - Focus management during navigation
 * - Wrap-around navigation (optional)
 * - Home/End key support
 *
 * File 3 of 4 in distributed menu pattern
 *
 * ⚠️ File-scope analysis would report FALSE POSITIVE:
 * "Arrow navigation without activation handlers"
 * (Activation handlers are in menu-actions.js)
 */

(function() {
  'use strict';

  const { menu, items, state, options } = window.MenuConfig;

  /**
   * Handle arrow key navigation within menu
   */
  menu.addEventListener('keydown', (event) => {
    // Only handle if menu is open
    if (!state.isOpen) return;

    // Only handle if focus is on a menu item
    const currentElement = document.activeElement;
    if (!items.includes(currentElement)) return;

    const currentIndex = items.indexOf(currentElement);
    let targetIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();

        // Move to next item
        if (options.wrapNavigation) {
          // Wrap to first item if at end
          targetIndex = (currentIndex + 1) % items.length;
        } else {
          // Stop at last item
          targetIndex = Math.min(currentIndex + 1, items.length - 1);
        }

        items[targetIndex].focus();
        state.currentIndex = targetIndex;

        console.log('✅ [menu-navigation.js] Arrow Down:', {
          from: currentIndex,
          to: targetIndex,
          item: items[targetIndex].id
        });
        break;

      case 'ArrowUp':
        event.preventDefault();

        // Move to previous item
        if (options.wrapNavigation) {
          // Wrap to last item if at beginning
          targetIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        } else {
          // Stop at first item
          targetIndex = Math.max(currentIndex - 1, 0);
        }

        items[targetIndex].focus();
        state.currentIndex = targetIndex;

        console.log('✅ [menu-navigation.js] Arrow Up:', {
          from: currentIndex,
          to: targetIndex,
          item: items[targetIndex].id
        });
        break;

      case 'Home':
        event.preventDefault();

        // Jump to first item
        items[0].focus();
        state.currentIndex = 0;

        console.log('✅ [menu-navigation.js] Home key:', {
          to: 0,
          item: items[0].id
        });
        break;

      case 'End':
        event.preventDefault();

        // Jump to last item
        targetIndex = items.length - 1;
        items[targetIndex].focus();
        state.currentIndex = targetIndex;

        console.log('✅ [menu-navigation.js] End key:', {
          to: targetIndex,
          item: items[targetIndex].id
        });
        break;
    }
  });

  console.log('✅ [menu-navigation.js] Navigation handlers initialized:', {
    features: [
      'Arrow Up/Down navigation',
      'Wrap-around navigation',
      'Home/End key support',
      'Focus management',
      'State tracking'
    ],
    note: 'Activation handlers in menu-actions.js, structure in menu-structure.js'
  });
})();
