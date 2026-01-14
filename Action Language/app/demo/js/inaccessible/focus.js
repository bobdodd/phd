/**
 * Inaccessible Focus Management Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues Demonstrated:
 * - removal-without-focus-management: element.remove() without checking focus
 * - hiding-without-focus-management: style.display = 'none' without focus check
 * - hiding-class-without-focus-management: classList operations that may hide elements
 * - positive-tabindex: Using tabindex > 0
 * - standalone-blur: Calling .blur() without focus management
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

    // Additional focus issues
    addPositiveTabIndexIssue();
    addStandaloneBlurIssue();
    addClassListHidingIssue();

    // ISSUE: positive-tabindex
    function addPositiveTabIndexIssue() {
      const container = document.createElement('div');
      container.style.cssText = 'margin: 20px 0; padding: 15px; border: 2px solid #dc2626;';
      container.innerHTML = `
        <h3>Positive tabindex Issue</h3>
        <button tabindex="1">First (tabindex=1)</button>
        <button tabindex="3">Third (tabindex=3)</button>
        <button tabindex="2">Second (tabindex=2)</button>
        <p style="color: #dc2626;">Issue: Positive tabindex disrupts natural tab order</p>
      `;

      // Find a place to append
      const targetSection = document.querySelector('.example.bad');
      if (targetSection) {
        targetSection.appendChild(container);
      }

      // ISSUE: Setting positive tabindex programmatically
      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn, idx) => {
        // ISSUE: positive-tabindex
        btn.tabIndex = idx + 1; // Setting to 1, 2, 3 (should use 0 or -1)
      });
    }

    // ISSUE: standalone-blur
    function addStandaloneBlurIssue() {
      const container = document.createElement('div');
      container.style.cssText = 'margin: 20px 0; padding: 15px; border: 2px solid #dc2626;';
      container.innerHTML = `
        <h3>Standalone .blur() Issue</h3>
        <input type="text" id="blur-input" placeholder="Focus me, then click button">
        <button id="blur-button">Call .blur() without focus management</button>
        <p style="color: #dc2626;">Issue: .blur() removes focus without moving it anywhere</p>
      `;

      const targetSection = document.querySelector('.example.bad');
      if (targetSection) {
        targetSection.appendChild(container);
      }

      const input = container.querySelector('#blur-input');
      const button = container.querySelector('#blur-button');

      button.addEventListener('click', function() {
        // ISSUE: standalone-blur - calling .blur() without focus management
        input.blur(); // Should move focus to a specific element instead
        console.log('Called .blur() - focus goes nowhere specific');
      });
    }

    // ISSUE: hiding-class-without-focus-management
    function addClassListHidingIssue() {
      const container = document.createElement('div');
      container.style.cssText = 'margin: 20px 0; padding: 15px; border: 2px solid #dc2626;';
      container.innerHTML = `
        <h3>classList Hiding Issue</h3>
        <div id="hideable-section" class="visible">
          <button>Focusable button in section</button>
          <button>Another button</button>
        </div>
        <button id="toggle-class-button">Toggle visibility via classList</button>
        <p style="color: #dc2626;">Issue: classList.remove() may hide element with focus</p>
        <style>
          .visible { display: block; }
          .hidden { display: none; }
        </style>
      `;

      const targetSection = document.querySelector('.example.bad');
      if (targetSection) {
        targetSection.appendChild(container);
      }

      const section = container.querySelector('#hideable-section');
      const toggleBtn = container.querySelector('#toggle-class-button');

      toggleBtn.addEventListener('click', function() {
        // ISSUE: hiding-class-without-focus-management
        if (section.classList.contains('visible')) {
          section.classList.remove('visible');
          section.classList.add('hidden');
        } else {
          section.classList.remove('hidden');
          section.classList.add('visible');
        }
        // Missing: Check if section.contains(document.activeElement)
      });
    }

    // Missing:
    // - document.activeElement checks
    // - element.contains(document.activeElement) checks
    // - Focus movement before removal
    // - Focus restoration after hiding
    // - findNextFocusable helper function
  }
})();
