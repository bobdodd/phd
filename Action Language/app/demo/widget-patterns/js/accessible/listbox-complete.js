/**
 * Complete Accessible Listbox Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Listbox
 *
 * Key Features:
 * - Arrow Up/Down navigation
 * - Home/End jump to first/last
 * - Space toggles selection (multi-select)
 * - Enter selects option
 * - Type-ahead search
 * - Focus management
 * - aria-selected state management
 * - Supports both single and multi-select modes
 */

(function() {
  'use strict';

  /**
   * Initialize a listbox with full accessibility features
   */
  function initListbox(listboxId) {
    const listbox = document.getElementById(listboxId);
    if (!listbox) return;

    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    const isMultiselectable = listbox.getAttribute('aria-multiselectable') === 'true';

    let currentIndex = 0;
    let searchString = '';
    let searchTimeout;

    /**
     * Set focus on a specific option
     */
    function focusOption(index) {
      if (index < 0 || index >= options.length) return;

      currentIndex = index;
      const option = options[index];

      // Set focus using roving tabindex pattern
      options.forEach((opt, i) => {
        opt.setAttribute('tabindex', i === index ? '0' : '-1');
      });

      option.focus();

      console.log('✅ Focus moved to option:', {
        index,
        id: option.id,
        text: option.textContent.trim()
      });
    }

    /**
     * Select an option
     */
    function selectOption(index, clearOthers = true) {
      if (index < 0 || index >= options.length) return;

      const option = options[index];
      const currentSelected = option.getAttribute('aria-selected') === 'true';

      // Clear other selections if not multi-select or if clearOthers is true
      if (!isMultiselectable || clearOthers) {
        options.forEach(opt => opt.setAttribute('aria-selected', 'false'));
      }

      // Toggle selection
      const newSelected = clearOthers ? true : !currentSelected;
      option.setAttribute('aria-selected', String(newSelected));

      updateSelectionOutput();

      console.log('✅ Option selection:', {
        index,
        id: option.id,
        text: option.textContent.trim(),
        selected: newSelected,
        multiSelect: isMultiselectable,
        clearOthers
      });
    }

    /**
     * Update the selection output display
     */
    function updateSelectionOutput() {
      const outputId = listboxId.replace('-listbox', '-selection');
      const output = document.getElementById(outputId);
      if (!output) return;

      const selectedOptions = options.filter(opt =>
        opt.getAttribute('aria-selected') === 'true'
      );

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
     * Type-ahead search functionality
     */
    function handleTypeAhead(char) {
      searchString += char.toLowerCase();

      // Clear search string after 500ms of no typing
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchString = '';
      }, 500);

      // Find option that starts with search string
      const matchIndex = options.findIndex(opt => {
        const text = opt.textContent.trim().toLowerCase();
        return text.startsWith(searchString);
      });

      if (matchIndex >= 0) {
        focusOption(matchIndex);
        console.log('✅ Type-ahead match:', {
          searchString,
          matchIndex,
          matchedText: options[matchIndex].textContent.trim()
        });
      }
    }

    /**
     * Keyboard event handler
     */
    listbox.addEventListener('keydown', (event) => {
      let handled = true;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          // Move to next option
          focusOption(Math.min(currentIndex + 1, options.length - 1));
          break;

        case 'ArrowUp':
          event.preventDefault();
          // Move to previous option
          focusOption(Math.max(currentIndex - 1, 0));
          break;

        case 'Home':
          event.preventDefault();
          // Jump to first option
          focusOption(0);
          console.log('✅ Home key: jumped to first option');
          break;

        case 'End':
          event.preventDefault();
          // Jump to last option
          focusOption(options.length - 1);
          console.log('✅ End key: jumped to last option');
          break;

        case ' ':
          event.preventDefault();
          if (isMultiselectable) {
            // Space toggles selection without clearing others
            selectOption(currentIndex, false);
          } else {
            // In single-select, space selects
            selectOption(currentIndex, true);
          }
          break;

        case 'Enter':
          event.preventDefault();
          // Enter always clears others (even in multi-select)
          selectOption(currentIndex, true);
          break;

        default:
          // Handle type-ahead search
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            handleTypeAhead(event.key);
          } else {
            handled = false;
          }
      }

      if (handled) {
        console.log('✅ Keyboard event handled:', {
          key: event.key,
          currentIndex,
          selectedCount: options.filter(opt => opt.getAttribute('aria-selected') === 'true').length
        });
      }
    });

    /**
     * Click handler for mouse interaction
     */
    options.forEach((option, index) => {
      option.addEventListener('click', (event) => {
        event.preventDefault();
        focusOption(index);

        if (isMultiselectable && event.ctrlKey) {
          // Ctrl+click toggles without clearing others
          selectOption(index, false);
        } else {
          // Regular click selects (clears others in single-select)
          selectOption(index, !isMultiselectable);
        }

        console.log('✅ Option clicked:', {
          index,
          id: option.id,
          ctrlKey: event.ctrlKey,
          multiSelect: isMultiselectable
        });
      });
    });

    /**
     * Focus handler for listbox
     */
    listbox.addEventListener('focus', () => {
      // If no option has tabindex="0", set it on the first option
      const focusableOption = options.find(opt => opt.getAttribute('tabindex') === '0');
      if (!focusableOption && options.length > 0) {
        options[0].setAttribute('tabindex', '0');
      }

      console.log('✅ Listbox received focus:', {
        id: listboxId,
        isMulti: isMultiselectable,
        optionCount: options.length
      });
    });

    // Initialize tabindex on first option
    if (options.length > 0) {
      options[0].setAttribute('tabindex', '0');
      options.slice(1).forEach(opt => opt.setAttribute('tabindex', '-1'));
    }

    console.log('✅ Accessible listbox initialized:', {
      id: listboxId,
      optionCount: options.length,
      multiSelect: isMultiselectable,
      features: [
        'Arrow Up/Down navigation',
        'Home/End jump to first/last',
        isMultiselectable ? 'Space toggles selection' : 'Space selects option',
        'Enter selects option',
        'Type-ahead search',
        'Focus management (roving tabindex)',
        'aria-selected state management',
        'Click support with Ctrl modifier'
      ]
    });
  }

  // Initialize all accessible listboxes
  initListbox('good-color-listbox');
  initListbox('good-features-listbox');

  console.log('✅ All accessible listboxes initialized');
})();
