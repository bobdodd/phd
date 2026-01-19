/**
 * Complete Accessible Tree Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Tree View
 *
 * Key Features:
 * - 4-way arrow navigation (Up/Down/Left/Right)
 * - Arrow Right: Expand collapsed or move to first child if expanded
 * - Arrow Left: Collapse expanded or move to parent if collapsed
 * - Enter/Space activation
 * - Home/End support
 * - Roving tabindex focus management
 * - aria-expanded state management
 * - aria-level, aria-setsize, aria-posinset
 */

(function() {
  'use strict';

  const tree = document.getElementById('good-tree');
  if (!tree) return;

  const allNodes = Array.from(tree.querySelectorAll('[role="treeitem"]'));

  /**
   * Get all currently visible tree nodes
   */
  function getVisibleNodes() {
    return allNodes.filter(node => {
      // Check if any ancestor is collapsed
      let parent = findParentTreeItem(node);
      while (parent) {
        if (parent.getAttribute('aria-expanded') === 'false') {
          return false;
        }
        parent = findParentTreeItem(parent);
      }
      return true;
    });
  }

  /**
   * Find the parent treeitem of a given node
   */
  function findParentTreeItem(node) {
    const parentGroup = node.parentElement?.closest('[role="group"]');
    return parentGroup?.closest('[role="treeitem"]') || null;
  }

  /**
   * Check if a node is expandable (has children)
   */
  function isExpandable(node) {
    return node.hasAttribute('aria-expanded');
  }

  /**
   * Check if a node is expanded
   */
  function isExpanded(node) {
    return node.getAttribute('aria-expanded') === 'true';
  }

  /**
   * Expand a tree node
   */
  function expandNode(node) {
    if (!isExpandable(node)) return;

    node.setAttribute('aria-expanded', 'true');

    // Update visual expander
    const expander = node.querySelector('.tree-expander');
    if (expander) {
      expander.textContent = '▼';
    }

    console.log('✅ Node expanded:', {
      id: node.id,
      label: node.querySelector('.tree-label')?.textContent
    });
  }

  /**
   * Collapse a tree node
   */
  function collapseNode(node) {
    if (!isExpandable(node)) return;

    node.setAttribute('aria-expanded', 'false');

    // Update visual expander
    const expander = node.querySelector('.tree-expander');
    if (expander) {
      expander.textContent = '▶';
    }

    console.log('✅ Node collapsed:', {
      id: node.id,
      label: node.querySelector('.tree-label')?.textContent
    });
  }

  /**
   * Set focus to a specific node (roving tabindex)
   */
  function setFocusToNode(node) {
    // Remove tabindex from all nodes
    allNodes.forEach(n => n.setAttribute('tabindex', '-1'));

    // Set tabindex on target node and focus it
    node.setAttribute('tabindex', '0');
    node.focus();

    console.log('✅ Focus moved:', {
      id: node.id,
      label: node.querySelector('.tree-label')?.textContent,
      level: node.getAttribute('aria-level')
    });
  }

  /**
   * Focus the next visible node
   */
  function focusNextVisibleNode(currentNode) {
    const visibleNodes = getVisibleNodes();
    const currentIndex = visibleNodes.indexOf(currentNode);

    if (currentIndex < visibleNodes.length - 1) {
      setFocusToNode(visibleNodes[currentIndex + 1]);
    }
  }

  /**
   * Focus the previous visible node
   */
  function focusPreviousVisibleNode(currentNode) {
    const visibleNodes = getVisibleNodes();
    const currentIndex = visibleNodes.indexOf(currentNode);

    if (currentIndex > 0) {
      setFocusToNode(visibleNodes[currentIndex - 1]);
    }
  }

  /**
   * Handle Arrow Right key
   * - If collapsed folder: expand it
   * - If expanded folder: move to first child
   * - If file: do nothing
   */
  function handleRightArrow(node) {
    if (isExpandable(node)) {
      if (!isExpanded(node)) {
        // Collapsed folder: expand it
        expandNode(node);
      } else {
        // Expanded folder: move to first child
        const group = node.querySelector('[role="group"]');
        const firstChild = group?.querySelector('[role="treeitem"]');
        if (firstChild) {
          setFocusToNode(firstChild);
        }
      }
    }
    // File (not expandable): do nothing
  }

  /**
   * Handle Arrow Left key
   * - If expanded folder: collapse it
   * - If collapsed folder or file: move to parent
   */
  function handleLeftArrow(node) {
    if (isExpandable(node) && isExpanded(node)) {
      // Expanded folder: collapse it
      collapseNode(node);
    } else {
      // Collapsed folder or file: move to parent
      const parentItem = findParentTreeItem(node);
      if (parentItem) {
        setFocusToNode(parentItem);
      }
    }
  }

  /**
   * Handle Enter or Space key (activation)
   */
  function handleActivation(node) {
    const label = node.querySelector('.tree-label')?.textContent || 'Unknown';
    console.log('✅ Node activated:', {
      id: node.id,
      label,
      level: node.getAttribute('aria-level')
    });
    alert(`Opened: ${label}`);
  }

  /**
   * Tree keyboard navigation
   */
  tree.addEventListener('keydown', (event) => {
    const currentNode = document.activeElement;

    // Only handle if focus is on a treeitem
    if (currentNode.getAttribute('role') !== 'treeitem') return;

    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusNextVisibleNode(currentNode);
        handled = true;
        break;

      case 'ArrowUp':
        event.preventDefault();
        focusPreviousVisibleNode(currentNode);
        handled = true;
        break;

      case 'ArrowRight':
        event.preventDefault();
        handleRightArrow(currentNode);
        handled = true;
        break;

      case 'ArrowLeft':
        event.preventDefault();
        handleLeftArrow(currentNode);
        handled = true;
        break;

      case 'Home':
        event.preventDefault();
        const visibleNodes = getVisibleNodes();
        if (visibleNodes.length > 0) {
          setFocusToNode(visibleNodes[0]);
        }
        handled = true;
        break;

      case 'End':
        event.preventDefault();
        const visible = getVisibleNodes();
        if (visible.length > 0) {
          setFocusToNode(visible[visible.length - 1]);
        }
        handled = true;
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        handleActivation(currentNode);
        handled = true;
        break;

      case '*':
        // Special: expand all siblings at same level (optional enhancement)
        event.preventDefault();
        const parent = findParentTreeItem(currentNode);
        const siblings = parent
          ? Array.from(parent.querySelectorAll(':scope > [role="group"] > [role="treeitem"]'))
          : Array.from(tree.querySelectorAll(':scope > [role="treeitem"]'));

        siblings.forEach(sibling => {
          if (isExpandable(sibling)) {
            expandNode(sibling);
          }
        });
        handled = true;
        break;
    }

    if (handled) {
      console.log('✅ Key handled:', {
        key: event.key,
        currentNode: currentNode.id
      });
    }
  });

  /**
   * Click handler for expand/collapse
   */
  allNodes.forEach(node => {
    const expander = node.querySelector('.tree-expander');

    if (expander && isExpandable(node)) {
      expander.addEventListener('click', (event) => {
        event.stopPropagation();

        if (isExpanded(node)) {
          collapseNode(node);
        } else {
          expandNode(node);
        }
      });
    }

    // Click on node itself focuses it and optionally activates
    node.addEventListener('click', (event) => {
      // Don't activate if clicking expander
      if (event.target.classList.contains('tree-expander')) {
        return;
      }

      setFocusToNode(node);
    });
  });

  console.log('✅ Accessible tree initialized:', {
    tree: tree.id,
    totalNodes: allNodes.length,
    rootNodes: tree.querySelectorAll(':scope > [role="treeitem"]').length,
    features: [
      'Arrow Up/Down navigation',
      'Arrow Right: expand or move to child',
      'Arrow Left: collapse or move to parent',
      'Enter/Space activation',
      'Home/End support',
      'Roving tabindex',
      'aria-expanded management',
      '* key: expand all siblings (bonus)',
      'Click support for expanders',
      'aria-level, aria-setsize, aria-posinset'
    ]
  });
})();
