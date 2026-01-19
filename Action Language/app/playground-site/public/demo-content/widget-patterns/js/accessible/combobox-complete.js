/**
 * Complete Accessible Combobox Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Combobox with Listbox Popup
 *
 * Key Features:
 * - role="combobox" on input
 * - aria-expanded for popup state
 * - aria-controls linking to listbox
 * - aria-activedescendant for virtual focus
 * - aria-autocomplete="list"
 * - Arrow Up/Down navigation
 * - Enter to select
 * - Escape to close
 * - Alt+Down to open
 * - Home/End navigation
 * - Type-ahead filtering
 * - aria-selected state management
 */

(function() {
  'use strict';

  /**
   * Country data for the combobox
   */
  const countries = [
    { id: 'us', name: 'United States', code: 'USA', flag: '🇺🇸' },
    { id: 'ca', name: 'Canada', code: 'CAN', flag: '🇨🇦' },
    { id: 'uk', name: 'United Kingdom', code: 'GBR', flag: '🇬🇧' },
    { id: 'au', name: 'Australia', code: 'AUS', flag: '🇦🇺' },
    { id: 'de', name: 'Germany', code: 'DEU', flag: '🇩🇪' },
    { id: 'fr', name: 'France', code: 'FRA', flag: '🇫🇷' },
    { id: 'jp', name: 'Japan', code: 'JPN', flag: '🇯🇵' },
    { id: 'cn', name: 'China', code: 'CHN', flag: '🇨🇳' },
    { id: 'in', name: 'India', code: 'IND', flag: '🇮🇳' },
    { id: 'br', name: 'Brazil', code: 'BRA', flag: '🇧🇷' },
    { id: 'mx', name: 'Mexico', code: 'MEX', flag: '🇲🇽' },
    { id: 'es', name: 'Spain', code: 'ESP', flag: '🇪🇸' },
    { id: 'it', name: 'Italy', code: 'ITA', flag: '🇮🇹' },
    { id: 'se', name: 'Sweden', code: 'SWE', flag: '🇸🇪' },
    { id: 'no', name: 'Norway', code: 'NOR', flag: '🇳🇴' }
  ];

  /**
   * Initialize a combobox with full accessibility features
   */
  function initCombobox(comboboxId) {
    const combobox = document.getElementById(comboboxId);
    if (!combobox) return;

    const listboxId = combobox.getAttribute('aria-controls');
    const listbox = document.getElementById(listboxId);
    if (!listbox) return;

    const allOptions = Array.from(listbox.querySelectorAll('[role="option"]'));
    let filteredOptions = allOptions;
    let currentIndex = -1;
    let selectedValue = null;

    /**
     * Open the popup listbox
     */
    function openPopup() {
      combobox.setAttribute('aria-expanded', 'true');
      listbox.setAttribute('aria-hidden', 'false');

      console.log('✅ Popup opened:', {
        comboboxId,
        expanded: true,
        visibleOptions: filteredOptions.length
      });
    }

    /**
     * Close the popup listbox
     */
    function closePopup() {
      combobox.setAttribute('aria-expanded', 'false');
      listbox.setAttribute('aria-hidden', 'true');
      clearHighlight();

      console.log('✅ Popup closed:', {
        comboboxId,
        expanded: false
      });
    }

    /**
     * Check if popup is open
     */
    function isOpen() {
      return combobox.getAttribute('aria-expanded') === 'true';
    }

    /**
     * Highlight an option using aria-activedescendant (virtual focus)
     */
    function highlightOption(index) {
      if (index < 0 || index >= filteredOptions.length) {
        clearHighlight();
        return;
      }

      currentIndex = index;
      const option = filteredOptions[index];

      // Clear previous selection
      allOptions.forEach(opt => opt.setAttribute('aria-selected', 'false'));

      // Set new selection (visual highlight, not final selection)
      option.setAttribute('aria-selected', 'true');

      // Update aria-activedescendant for virtual focus
      combobox.setAttribute('aria-activedescendant', option.id);

      // Scroll into view if needed
      option.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

      console.log('✅ Option highlighted:', {
        index,
        id: option.id,
        text: option.querySelector('.country-name').textContent.trim(),
        virtualFocus: true
      });
    }

    /**
     * Clear the highlight (remove aria-activedescendant)
     */
    function clearHighlight() {
      allOptions.forEach(opt => opt.setAttribute('aria-selected', 'false'));
      combobox.setAttribute('aria-activedescendant', '');
      currentIndex = -1;

      console.log('✅ Highlight cleared');
    }

    /**
     * Filter options based on input value
     */
    function filterOptions() {
      const searchTerm = combobox.value.toLowerCase().trim();

      if (searchTerm === '') {
        // Show all options when input is empty
        filteredOptions = allOptions;
        allOptions.forEach(opt => opt.style.display = '');
      } else {
        // Filter options that match the search term
        filteredOptions = allOptions.filter(option => {
          const name = option.querySelector('.country-name').textContent.toLowerCase();
          const code = option.querySelector('.country-code').textContent.toLowerCase();
          const matches = name.includes(searchTerm) || code.includes(searchTerm);

          // Show/hide based on match
          option.style.display = matches ? '' : 'none';

          return matches;
        });
      }

      // Reset highlight when filtering
      currentIndex = -1;
      clearHighlight();

      // Open popup if we have results
      if (filteredOptions.length > 0) {
        openPopup();
        console.log('✅ Options filtered:', {
          searchTerm,
          matchCount: filteredOptions.length,
          totalOptions: allOptions.length
        });
      } else {
        // Close if no results
        closePopup();
        console.log('⚠️ No matching options:', { searchTerm });
      }
    }

    /**
     * Select an option
     */
    function selectOption(option) {
      if (!option) return;

      const countryName = option.querySelector('.country-name').textContent.trim();
      const countryCode = option.querySelector('.country-code').textContent.trim();

      selectedValue = {
        name: countryName,
        code: countryCode,
        id: option.id
      };

      // Set input value to selected option
      combobox.value = countryName;

      // Close popup
      closePopup();

      // Update selection output
      updateSelectionOutput();

      // Dispatch change event
      combobox.dispatchEvent(new Event('change', { bubbles: true }));

      console.log('✅ Option selected:', {
        id: option.id,
        name: countryName,
        code: countryCode
      });
    }

    /**
     * Update the selection output display
     */
    function updateSelectionOutput() {
      const outputId = comboboxId.replace('-combobox', '-selection');
      const output = document.getElementById(outputId);
      if (!output) return;

      if (selectedValue) {
        output.textContent = `${selectedValue.name} (${selectedValue.code})`;
      } else {
        output.textContent = 'None';
      }
    }

    /**
     * Keyboard event handler for combobox
     */
    combobox.addEventListener('keydown', (event) => {
      let handled = true;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen()) {
            // Open popup and highlight first option
            openPopup();
            highlightOption(0);
          } else {
            // Move to next option
            highlightOption(Math.min(currentIndex + 1, filteredOptions.length - 1));
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (isOpen() && currentIndex > 0) {
            // Move to previous option
            highlightOption(currentIndex - 1);
          } else if (isOpen() && currentIndex === 0) {
            // At first option, do nothing or close
            highlightOption(0);
          }
          break;

        case 'Home':
          event.preventDefault();
          if (isOpen()) {
            // Jump to first visible option
            highlightOption(0);
          }
          break;

        case 'End':
          event.preventDefault();
          if (isOpen()) {
            // Jump to last visible option
            highlightOption(filteredOptions.length - 1);
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (isOpen() && currentIndex >= 0 && filteredOptions[currentIndex]) {
            // Select the highlighted option
            selectOption(filteredOptions[currentIndex]);
          } else if (!isOpen()) {
            // Open popup if closed
            openPopup();
            if (filteredOptions.length > 0) {
              highlightOption(0);
            }
          }
          break;

        case 'Escape':
          event.preventDefault();
          if (isOpen()) {
            // Close popup
            closePopup();
          } else {
            // Clear input if popup already closed
            combobox.value = '';
            selectedValue = null;
            filterOptions();
            updateSelectionOutput();
          }
          break;

        case 'Tab':
          // Allow default tab behavior
          if (isOpen()) {
            closePopup();
          }
          handled = false;
          break;

        case 'ArrowDown':
        case 'Down':
          // Alt+Down opens popup without moving highlight
          if (event.altKey) {
            event.preventDefault();
            if (!isOpen()) {
              openPopup();
              console.log('✅ Alt+Down: Popup opened without highlighting');
            }
          }
          break;

        default:
          handled = false;
      }

      if (handled) {
        console.log('✅ Keyboard event handled:', {
          key: event.key,
          altKey: event.altKey,
          currentIndex,
          isOpen: isOpen(),
          highlightedOption: currentIndex >= 0 ? filteredOptions[currentIndex]?.id : 'none'
        });
      }
    });

    /**
     * Input event handler for filtering
     */
    combobox.addEventListener('input', (event) => {
      filterOptions();
    });

    /**
     * Click handler for selecting options
     */
    allOptions.forEach((option, index) => {
      option.addEventListener('click', (event) => {
        event.preventDefault();
        selectOption(option);

        console.log('✅ Option clicked:', {
          id: option.id,
          index,
          name: option.querySelector('.country-name').textContent.trim()
        });
      });

      // Hover preview
      option.addEventListener('mouseenter', () => {
        const optionIndex = filteredOptions.indexOf(option);
        if (optionIndex >= 0) {
          highlightOption(optionIndex);
        }
      });
    });

    /**
     * Focus handler
     */
    combobox.addEventListener('focus', () => {
      console.log('✅ Combobox focused:', {
        id: comboboxId,
        currentValue: combobox.value,
        selectedValue: selectedValue ? selectedValue.name : 'none'
      });
    });

    /**
     * Blur handler - close popup when focus leaves
     */
    combobox.addEventListener('blur', (event) => {
      // Delay to allow click on option to register
      setTimeout(() => {
        if (isOpen()) {
          closePopup();
        }
      }, 150);
    });

    /**
     * Click outside to close
     */
    document.addEventListener('click', (event) => {
      if (!combobox.contains(event.target) && !listbox.contains(event.target)) {
        if (isOpen()) {
          closePopup();
        }
      }
    });

    // Initialize
    updateSelectionOutput();

    console.log('✅ Accessible combobox initialized:', {
      id: comboboxId,
      listboxId,
      optionCount: allOptions.length,
      features: [
        'role="combobox" on input',
        'aria-expanded state management',
        'aria-controls linking to listbox',
        'aria-activedescendant for virtual focus',
        'aria-autocomplete="list"',
        'role="listbox" on popup',
        'role="option" on items',
        'aria-selected on highlighted option',
        'Arrow Up/Down navigation',
        'Enter to select',
        'Escape to close',
        'Alt+Down to open',
        'Home/End navigation',
        'Type-ahead filtering',
        'Mouse click support',
        'Hover preview'
      ]
    });
  }

  // Initialize all accessible comboboxes
  initCombobox('good-country-combobox');

  console.log('✅ All accessible comboboxes initialized');
})();
