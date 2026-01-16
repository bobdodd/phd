/**
 * Incomplete Combobox Implementation (Inaccessible)
 * Demonstrates common mistakes and what Paradise detects
 *
 * Missing Features (9 issues):
 * 1. No role="combobox" on input
 * 2. No aria-expanded state management
 * 3. No aria-controls linking to listbox
 * 4. No aria-activedescendant for virtual focus
 * 5. No aria-autocomplete attribute
 * 6. No role="listbox" or role="option"
 * 7. No aria-selected on highlighted option
 * 8. No arrow key navigation
 * 9. No Enter/Escape/Alt+Down/Home/End handlers
 */

(function() {
  'use strict';

  /**
   * Initialize incomplete combobox (mouse-only with basic filtering)
   */
  function initBadCombobox(inputId, listboxId, outputId) {
    const input = document.getElementById(inputId);
    const listbox = document.getElementById(listboxId);
    const output = document.getElementById(outputId);

    if (!input || !listbox || !output) return;

    const options = Array.from(listbox.querySelectorAll('.bad-option'));
    let selectedValue = null;

    /**
     * Update selection display
     * ❌ No aria-selected management
     */
    function updateSelectionOutput() {
      if (selectedValue) {
        output.textContent = `${selectedValue.name} (${selectedValue.code})`;
      } else {
        output.textContent = 'None';
      }
    }

    /**
     * Filter options based on input
     * ❌ Missing aria-expanded updates
     * ❌ Missing result count announcements
     */
    input.addEventListener('input', () => {
      const searchTerm = input.value.toLowerCase().trim();

      let visibleCount = 0;

      options.forEach(option => {
        const name = option.querySelector('.country-name').textContent.toLowerCase();
        const code = option.querySelector('.country-code').textContent.toLowerCase();
        const matches = name.includes(searchTerm) || code.includes(searchTerm);

        option.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });

      // Show/hide listbox based on input and results
      if (input.value.length > 0 && visibleCount > 0) {
        listbox.classList.add('open');
        // ❌ MISSING: aria-expanded="true"
        // ❌ MISSING: Announce result count to screen readers
      } else {
        listbox.classList.remove('open');
        // ❌ MISSING: aria-expanded="false"
      }

      console.log('⚠️ Input filtered (no ARIA updates):', {
        searchTerm,
        visibleCount,
        missingFeatures: [
          'No aria-expanded update',
          'No result count announcement',
          'No aria-activedescendant update',
          'Screen readers unaware of popup state'
        ]
      });
    });

    /**
     * Click handler for selecting options
     * ❌ No keyboard support
     * ❌ No aria-selected management
     * ❌ No aria-activedescendant updates
     */
    options.forEach((option, index) => {
      option.addEventListener('click', (event) => {
        event.preventDefault();

        const countryName = option.querySelector('.country-name').textContent.trim();
        const countryCode = option.querySelector('.country-code').textContent.trim();

        selectedValue = {
          name: countryName,
          code: countryCode
        };

        // Set input value
        input.value = countryName;

        // Hide listbox
        listbox.classList.remove('open');
        // ❌ MISSING: aria-expanded="false"

        // Update output
        updateSelectionOutput();

        console.log('⚠️ Option clicked (mouse only, no ARIA):', {
          index,
          name: countryName,
          code: countryCode,
          missingFeatures: [
            'No aria-selected update',
            'No aria-expanded update',
            'No keyboard support',
            'Screen readers not informed of selection'
          ]
        });
      });

      // Hover effect (mouse-only)
      option.addEventListener('mouseenter', () => {
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        // ❌ MISSING: aria-selected update
        // ❌ MISSING: aria-activedescendant update
      });
    });

    /**
     * Click outside to close
     * ❌ No Escape key support
     */
    document.addEventListener('click', (event) => {
      if (!input.contains(event.target) && !listbox.contains(event.target)) {
        listbox.classList.remove('open');
        // ❌ MISSING: aria-expanded="false"
      }
    });

    // Initialize output
    updateSelectionOutput();

    console.log('⚠️ Inaccessible combobox initialized with 9 issues:', {
      inputId,
      listboxId,
      optionCount: options.length,
      missingFeatures: [
        '1. No role="combobox" on input',
        '2. No aria-expanded state management',
        '3. No aria-controls linking to listbox',
        '4. No aria-activedescendant for virtual focus',
        '5. No aria-autocomplete attribute',
        '6. No role="listbox" or role="option"',
        '7. No aria-selected on highlighted option',
        '8. No arrow key navigation (ArrowUp/ArrowDown)',
        '9. No Enter/Escape/Alt+Down/Home/End handlers',
        'Result: Keyboard users completely blocked',
        'Result: Screen readers unaware of popup state',
        'Result: Screen readers cannot track highlighted option'
      ]
    });
  }

  // Initialize all inaccessible comboboxes
  initBadCombobox('bad-country-input', 'bad-country-listbox', 'bad-selection');

  console.log('⚠️ All inaccessible comboboxes initialized - Paradise will detect 9 issues');
})();
