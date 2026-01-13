/**
 * Accessible Focus Management Implementation
 * Demonstrates proper focus handling when removing/hiding elements
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Scenario 1: Removing focused elements
    const goodContainer = document.getElementById('good-removable-container');
    const goodRemoveAll = document.getElementById('good-remove-all');
    const goodReset = document.getElementById('good-reset-items');
    const goodStatus1 = document.getElementById('good-status-1');

    // Scenario 2: Hiding focused elements
    const goodToggle = document.getElementById('good-toggle');
    const goodSection = document.getElementById('good-section');
    const goodStatus2 = document.getElementById('good-status-2');

    if (!goodContainer || !goodRemoveAll) return;

    // Individual remove buttons
    goodContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('good-remove-btn')) {
        const item = e.target.closest('.removable-item');
        removeElementSafely(item, goodStatus1);
      }
    });

    // Remove all button
    goodRemoveAll.addEventListener('click', () => {
      removeAllItemsSafely(goodContainer, goodRemoveAll, goodReset, goodStatus1);
    });

    // Reset button
    goodReset.addEventListener('click', () => {
      resetItems(goodContainer, 'good', goodStatus1);
    });

    // Toggle section
    if (goodToggle && goodSection) {
      goodToggle.addEventListener('click', () => {
        toggleSectionSafely(goodToggle, goodSection, goodStatus2);
      });
    }

    function removeElementSafely(element, statusEl) {
      // Check if element (or any child) has focus
      if (element.contains(document.activeElement)) {
        // Find next focusable element
        const nextFocusable = findNextFocusable(element);
        if (nextFocusable) {
          nextFocusable.focus();
          if (statusEl) {
            statusEl.textContent = 'Status: Focus moved to next element before removal';
          }
        }
      }

      // Now safe to remove
      element.remove();
    }

    function removeAllItemsSafely(container, removeBtn, resetBtn, statusEl) {
      const items = container.querySelectorAll('.removable-item');

      // Check if any item has focus
      let hadFocus = false;
      items.forEach(item => {
        if (item.contains(document.activeElement)) {
          hadFocus = true;
        }
      });

      // If focus was inside, move it to reset button
      if (hadFocus) {
        resetBtn.focus();
        if (statusEl) {
          statusEl.textContent = 'Status: Focus moved to Reset button before removing all items';
        }
      } else {
        if (statusEl) {
          statusEl.textContent = 'Status: All items removed (no focus management needed)';
        }
      }

      // Now safe to remove all
      items.forEach(item => item.remove());

      // Hide remove button, show reset
      removeBtn.style.display = 'none';
      resetBtn.style.display = 'inline-block';
    }

    function toggleSectionSafely(toggleBtn, section, statusEl) {
      const isHidden = section.hasAttribute('hidden');

      if (!isHidden) {
        // About to hide - check if section has focus
        if (section.contains(document.activeElement)) {
          // Move focus to toggle button first
          toggleBtn.focus();
          if (statusEl) {
            statusEl.textContent = 'Status: Focus returned to toggle button, then section hidden';
          }
        } else {
          if (statusEl) {
            statusEl.textContent = 'Status: Section hidden';
          }
        }
        section.setAttribute('hidden', '');
      } else {
        // Showing section
        section.removeAttribute('hidden');
        if (statusEl) {
          statusEl.textContent = 'Status: Section visible';
        }
      }
    }

    function findNextFocusable(currentElement) {
      // Get all focusable elements in the document
      const focusable = Array.from(
        document.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      // Find next element that's not inside currentElement
      for (let i = 0; i < focusable.length; i++) {
        if (!currentElement.contains(focusable[i])) {
          return focusable[i];
        }
      }

      return null;
    }

    function resetItems(container, prefix, statusEl) {
      // Clear existing items
      container.innerHTML = '';

      // Recreate items
      for (let i = 1; i <= 3; i++) {
        const item = document.createElement('div');
        item.className = 'removable-item';
        item.innerHTML = `
          <span>Item ${i}</span>
          <button class="${prefix}-remove-btn" data-item="${i}">×</button>
        `;
        container.appendChild(item);
      }

      // Show remove button, hide reset
      const removeBtn = document.getElementById(`${prefix}-remove-all`);
      const resetBtn = document.getElementById(`${prefix}-reset-items`);
      if (removeBtn) removeBtn.style.display = 'inline-block';
      if (resetBtn) resetBtn.style.display = 'inline-block';

      if (statusEl) {
        statusEl.textContent = 'Status: Items reset';
      }
    }
  }
})();
