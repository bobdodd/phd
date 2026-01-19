/**
 * Incomplete Tree Implementation (Inaccessible)
 * Demonstrates common mistakes and what Paradise detects
 *
 * Missing Features (12 issues):
 * 1. No role="tree" on container
 * 2. No role="treeitem" on nodes
 * 3. No role="group" on child containers
 * 4. No aria-expanded attributes
 * 5. No aria-level attributes
 * 6. No aria-setsize and aria-posinset
 * 7. No roving tabindex implementation
 * 8. No Arrow Up/Down navigation
 * 9. No Arrow Right navigation
 * 10. No Arrow Left navigation
 * 11. No Enter/Space activation
 * 12. No Home/End support
 */

(function() {
  'use strict';

  const tree = document.getElementById('bad-tree');
  if (!tree) return;

  const allItems = Array.from(tree.querySelectorAll('li'));

  /**
   * Toggle visibility of child list
   * ❌ No aria-expanded management
   * ❌ No keyboard support
   */
  function toggleExpander(item) {
    const childList = item.querySelector('ul');
    if (childList) {
      childList.classList.toggle('hidden');

      // Update expander icon
      const expander = item.querySelector('.tree-expander');
      if (expander) {
        expander.textContent = childList.classList.contains('hidden') ? '▶' : '▼';
      }

      console.log('⚠️ Toggled visibility (no ARIA state update):', {
        id: item.id,
        label: item.querySelector('.tree-label')?.textContent,
        visible: !childList.classList.contains('hidden')
      });
    }
  }

  /**
   * Click handlers for expand/collapse
   * ❌ Mouse-only interaction
   * ❌ No keyboard navigation
   */
  allItems.forEach(item => {
    const expander = item.querySelector('.tree-expander');

    if (expander) {
      expander.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleExpander(item);
      });
    }

    // Click on item itself
    item.addEventListener('click', (event) => {
      // Don't activate if clicking expander
      if (event.target.classList.contains('tree-expander')) {
        return;
      }

      const label = item.querySelector('.tree-label')?.textContent || 'Unknown';
      console.log('⚠️ Item clicked (no keyboard support):', {
        id: item.id,
        label
      });
      alert(`Clicked: ${label}`);
    });
  });

  console.log('⚠️ Inaccessible tree initialized with 12 issues:', {
    tree: tree.id,
    items: allItems.length,
    missingFeatures: [
      'No role="tree" on container',
      'No role="treeitem" on nodes',
      'No role="group" on child containers',
      'No aria-expanded attributes',
      'No aria-level attributes',
      'No aria-setsize and aria-posinset',
      'No roving tabindex implementation',
      'No Arrow Up/Down navigation',
      'No Arrow Right navigation',
      'No Arrow Left navigation',
      'No Enter/Space activation',
      'No Home/End support'
    ]
  });
})();
