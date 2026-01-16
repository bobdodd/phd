/**
 * Complete Accessible Menu Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Menu
 *
 * Key Features:
 * - Arrow Down/Up navigation
 * - Enter/Space activation
 * - Escape to close
 * - Focus management
 * - aria-expanded state management
 * - aria-haspopup indication
 */

(function() {
  'use strict';

  const button = document.getElementById('good-menu-button');
  const menu = document.getElementById('good-menu');

  if (!button || !menu) return;

  const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
  let isOpen = false;

  /**
   * Open the menu
   */
  function openMenu() {
    isOpen = true;

    // Update ARIA state
    button.setAttribute('aria-expanded', 'true');

    // Show menu
    menu.removeAttribute('hidden');

    // Move focus to first menu item
    if (items.length > 0) {
      items[0].focus();
    }

    console.log('✅ Accessible menu opened:', {
      button: button.id,
      menu: menu.id,
      itemCount: items.length,
      ariaExpanded: button.getAttribute('aria-expanded')
    });
  }

  /**
   * Close the menu
   */
  function closeMenu() {
    isOpen = false;

    // Update ARIA state
    button.setAttribute('aria-expanded', 'false');

    // Hide menu
    menu.setAttribute('hidden', '');

    // Return focus to button
    button.focus();

    console.log('✅ Accessible menu closed:', {
      ariaExpanded: button.getAttribute('aria-expanded'),
      focusRestored: true
    });
  }

  /**
   * Toggle menu open/close
   */
  function toggleMenu() {
    if (isOpen) {
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

  // Button keyboard handler (Enter/Space)
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
      }
    }
  });

  // Menu keyboard navigation
  menu.addEventListener('keydown', (event) => {
    if (!isOpen) return;

    const currentItem = document.activeElement;
    const currentIndex = items.indexOf(currentItem);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        // Move to next item (wrap to first)
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
        console.log('✅ Arrow Down:', {
          from: currentIndex,
          to: nextIndex,
          item: items[nextIndex].id
        });
        break;

      case 'ArrowUp':
        event.preventDefault();
        // Move to previous item (wrap to last)
        const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        items[prevIndex].focus();
        console.log('✅ Arrow Up:', {
          from: currentIndex,
          to: prevIndex,
          item: items[prevIndex].id
        });
        break;

      case 'Home':
        event.preventDefault();
        items[0].focus();
        console.log('✅ Home key: jumped to first item');
        break;

      case 'End':
        event.preventDefault();
        items[items.length - 1].focus();
        console.log('✅ End key: jumped to last item');
        break;

      case 'Escape':
        event.preventDefault();
        closeMenu();
        console.log('✅ Escape key: menu closed');
        break;
    }
  });

  // Menu item activation (Enter/Space and click)
  items.forEach((item, index) => {
    // Keyboard activation
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const action = item.textContent.trim();
        console.log('✅ Menu item activated (keyboard):', {
          index,
          id: item.id,
          action,
          key: event.key
        });
        alert(`Action: ${action}`);
        closeMenu();
      }
    });

    // Click activation
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const action = item.textContent.trim();
      console.log('✅ Menu item activated (click):', {
        index,
        id: item.id,
        action
      });
      alert(`Action: ${action}`);
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (isOpen) {
      const isInsideMenu = event.target.closest('#good-menu-button, #good-menu');
      if (!isInsideMenu) {
        closeMenu();
        console.log('✅ Menu closed by outside click');
      }
    }
  });

  console.log('✅ Accessible menu initialized:', {
    button: button.id,
    menu: menu.id,
    items: items.length,
    features: [
      'Arrow Down/Up navigation',
      'Enter/Space activation',
      'Escape to close',
      'Focus management',
      'aria-expanded state management',
      'Outside click closes menu',
      'Home/End key support'
    ]
  });
})();
