/**
 * Incomplete Listbox Implementation (Inaccessible)
 * Demonstrates common mistakes and what Paradise detects
 *
 * Missing Features (6 issues):
 * 1. No role="listbox" or role="option"
 * 2. No aria-selected attributes
 * 3. No aria-multiselectable for multi-select
 * 4. No tabindex for keyboard focus
 * 5. No keyboard navigation (arrows, Home/End, Space/Enter)
 * 6. No type-ahead search
 */

(function() {
  'use strict';

  /**
   * Initialize incomplete listbox (mouse-only)
   */
  function initBadListbox(listboxId, outputId) {
    const listbox = document.getElementById(listboxId);
    if (!listbox) return;

    const options = Array.from(listbox.querySelectorAll('.bad-option'));
    const isMulti = listboxId.includes('features');

    /**
     * Update selection display
     * ❌ No aria-selected updates
     */
    function updateSelectionOutput() {
      const output = document.getElementById(outputId);
      if (!output) return;

      const selectedOptions = options.filter(opt => opt.classList.contains('selected'));

      if (selectedOptions.length === 0) {
        output.textContent = 'None';
      } else {
        const selectedTexts = selectedOptions.map(opt =>
          opt.textContent.trim().replace(/^✓\s*/, '')
        );
        output.textContent = selectedTexts.join(', ');
      }
    }

    /**
     * Click handler only (no keyboard support)
     * ❌ Missing keyboard handlers
     * ❌ Missing ARIA state updates
     */
    options.forEach((option, index) => {
      option.addEventListener('click', (event) => {
        event.preventDefault();

        if (isMulti && event.ctrlKey) {
          // Multi-select: toggle with Ctrl
          option.classList.toggle('selected');
        } else if (isMulti) {
          // Multi-select: toggle without Ctrl
          option.classList.toggle('selected');
        } else {
          // Single select: clear others
          options.forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
        }

        updateSelectionOutput();

        console.log('⚠️ Option clicked (no ARIA state update):', {
          index,
          text: option.textContent.trim(),
          selected: option.classList.contains('selected'),
          missingFeatures: [
            'No aria-selected update',
            'No keyboard support',
            'No screen reader announcement'
          ]
        });
      });
    });

    console.log('⚠️ Inaccessible listbox initialized with 6 issues:', {
      id: listboxId,
      optionCount: options.length,
      multiSelect: isMulti,
      missingFeatures: [
        'No role="listbox" or role="option"',
        'No aria-selected attributes',
        'No aria-multiselectable',
        'No tabindex for keyboard focus',
        'No arrow key navigation',
        'No Home/End support',
        'No Space/Enter handlers',
        'No type-ahead search',
        'No focus management',
        'Mouse-only interaction'
      ]
    });
  }

  // Initialize all inaccessible listboxes
  initBadListbox('bad-color-listbox', 'bad-selection');
  initBadListbox('bad-features-listbox', 'bad-multi-selection');

  console.log('⚠️ All inaccessible listboxes initialized - Paradise will detect 6 issues per listbox');
})();
