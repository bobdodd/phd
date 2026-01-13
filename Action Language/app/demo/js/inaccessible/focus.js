/**
 * Inaccessible Focus Management Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues:
 * - element.remove() without checking document.activeElement
 * - style.display = 'none' on potentially focused elements
 * - setAttribute('hidden') without focus management
 * - No check for element.contains(document.activeElement)
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Scenario 1: Removing focused elements
    const badContainer = document.getElementById('bad-removable-container');
    const badRemoveAll = document.getElementById('bad-remove-all');
    const badReset = document.getElementById('bad-reset-items');
    const badStatus1 = document.getElementById('bad-status-1');

    // Scenario 2: Hiding focused elements
    const badToggle = document.getElementById('bad-toggle');
    const badSection = document.getElementById('bad-section');
    const badStatus2 = document.getElementById('bad-status-2');

    if (!badContainer || !badRemoveAll) return;

    // Individual remove buttons
    badContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('bad-remove-btn')) {
        const item = e.target.closest('.removable-item');

        // ISSUE: No focus check before removal
        // Missing: if (item.contains(document.activeElement)) { ... }

        item.remove(); // ← Analyzer detects: removal-without-focus-management

        if (badStatus1) {
          badStatus1.textContent = 'Status: Item removed (focus may be lost!)';
        }
      }
    });

    // Remove all button
    badRemoveAll.addEventListener('click', () => {
      const items = badContainer.querySelectorAll('.removable-item');

      // ISSUE: No check if items have focus
      // Missing: Check document.activeElement before removing

      // ISSUE: Directly remove all items without focus management
      items.forEach(item => {
        item.remove(); // ← Multiple removal-without-focus-management issues
      });

      // Hide remove button, show reset
      badRemoveAll.style.display = 'none';
      badReset.style.display = 'inline-block';

      if (badStatus1) {
        badStatus1.textContent = 'Status: All removed (focus lost!)';
      }
    });

    // Reset button
    badReset.addEventListener('click', () => {
      resetItems(badContainer, 'bad', badStatus1);
    });

    // Toggle section
    if (badToggle && badSection) {
      badToggle.addEventListener('click', () => {
        const isHidden = badSection.hasAttribute('hidden');

        if (!isHidden) {
          // ISSUE: No check if section has focus before hiding
          // Missing: if (badSection.contains(document.activeElement)) { ... }

          // ISSUE: Hide section that might have focus
          badSection.style.display = 'none'; // ← Analyzer detects: hiding-focused-element

          if (badStatus2) {
            badStatus2.textContent = 'Status: Section hidden (focus may be lost!)';
          }
        } else {
          // Show section
          badSection.style.display = 'block';
          badSection.removeAttribute('hidden');

          if (badStatus2) {
            badStatus2.textContent = 'Status: Section visible';
          }
        }
      });
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

    // Missing:
    // - document.activeElement checks
    // - element.contains(document.activeElement) checks
    // - Focus movement before removal
    // - Focus restoration after hiding
    // - findNextFocusable helper function
  }
})();
