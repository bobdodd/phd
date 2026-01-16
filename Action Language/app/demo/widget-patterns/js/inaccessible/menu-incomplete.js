/**
 * Incomplete Menu Implementation (Inaccessible)
 * Demonstrates common mistakes and what Paradise detects
 *
 * Missing Features (8 issues):
 * 1. No aria-haspopup attribute
 * 2. No aria-expanded state management
 * 3. No arrow key navigation
 * 4. No Enter/Space activation
 * 5. No Escape key handler
 * 6. No focus management
 * 7. Missing role="menu" and role="menuitem"
 * 8. No keyboard accessibility
 */

(function() {
  'use strict';

  const button = document.getElementById('bad-menu-button');
  const menu = document.getElementById('bad-menu');

  if (!button || !menu) return;

  const items = Array.from(menu.querySelectorAll('button'));
  let isOpen = false;

  /**
   * Toggle menu visibility (mouse-only)
   * ❌ Missing aria-expanded updates
   * ❌ No focus management
   */
  function toggleMenu() {
    isOpen = !isOpen;

    if (isOpen) {
      menu.removeAttribute('hidden');
      console.log('⚠️ Menu opened (no ARIA state update)');
    } else {
      menu.setAttribute('hidden', '');
      console.log('⚠️ Menu closed (no ARIA state update)');
    }
  }

  /**
   * Button click handler
   * ❌ Mouse-only interaction
   */
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  /**
   * Menu item click handlers
   * ❌ No keyboard activation (Enter/Space)
   * ❌ No arrow navigation
   * ❌ No Escape handler
   */
  items.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const action = item.textContent.trim();
      console.log('⚠️ Menu item clicked (no keyboard support):', action);
      alert(`Action: ${action}`);
      toggleMenu();
    });
  });

  /**
   * Close menu when clicking outside
   * ✓ This part works but doesn't compensate for other issues
   */
  document.addEventListener('click', (event) => {
    if (isOpen) {
      const isInsideMenu = event.target.closest('#bad-menu-button, #bad-menu');
      if (!isInsideMenu) {
        toggleMenu();
        console.log('⚠️ Menu closed by outside click');
      }
    }
  });

  console.log('⚠️ Inaccessible menu initialized with 8 issues:', {
    button: button.id,
    menu: menu.id,
    items: items.length,
    missingFeatures: [
      'No aria-haspopup attribute',
      'No aria-expanded state management',
      'No arrow key navigation',
      'No Enter/Space activation',
      'No Escape key handler',
      'No focus management',
      'Missing role="menu" and role="menuitem"',
      'No keyboard accessibility'
    ]
  });
})();
