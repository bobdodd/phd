/**
 * INACCESSIBLE RADIOGROUP IMPLEMENTATION
 *
 * This implementation demonstrates common accessibility mistakes:
 *
 * ISSUES (6 detected by Paradise):
 * 1. Missing role="radiogroup" - Container doesn't identify as a radiogroup
 * 2. Missing role="radio" - Individual options are not identified as radio buttons
 * 3. Missing aria-checked - Screen readers cannot determine which option is selected
 * 4. Missing aria-labelledby/aria-label - The radiogroup has no accessible name
 * 5. No keyboard navigation - Arrow keys don't work to navigate between options
 * 6. No roving tabindex - Missing proper tabindex management for keyboard focus
 *
 * Additional problems:
 * - Only works with mouse clicks
 * - No focus management
 * - No screen reader announcements
 * - State changes are purely visual
 * - Not recognizable as a radio group by assistive technology
 */

(function() {
    'use strict';

    /**
     * Initialize inaccessible radiogroups
     * These only respond to mouse clicks and have no accessibility features
     */
    function initBadRadiogroups() {
        // Shipping group
        const shippingGroup = document.getElementById('shipping-bad-group');
        if (shippingGroup) {
            initBadRadiogroup(shippingGroup, 'shipping-bad');
        }

        // Size group
        const sizeGroup = document.getElementById('size-bad-group');
        if (sizeGroup) {
            initBadRadiogroup(sizeGroup, 'size-bad');
        }
    }

    /**
     * Initialize a bad (inaccessible) radiogroup
     * @param {HTMLElement} container - The radiogroup container
     * @param {string} groupName - Name prefix for state display elements
     */
    function initBadRadiogroup(container, groupName) {
        const options = container.querySelectorAll('.radio-option-bad');

        options.forEach(option => {
            // Only click handler, no keyboard support
            option.addEventListener('click', function() {
                selectBadRadio(container, this, groupName);
            });

            // NO keydown handler
            // NO arrow key navigation
            // NO Space key selection
        });

        // Initialize state display
        const selected = container.querySelector('.radio-option-bad.selected');
        if (selected) {
            updateBadStateDisplay(groupName, selected);
        }
    }

    /**
     * Select a bad (inaccessible) radio option
     * This only updates visual appearance with CSS classes
     * @param {HTMLElement} container - The radiogroup container
     * @param {HTMLElement} selectedOption - The option to select
     * @param {string} groupName - Name prefix for state display
     */
    function selectBadRadio(container, selectedOption, groupName) {
        // Get all options in this group
        const options = container.querySelectorAll('.radio-option-bad');

        // Deselect all (only CSS class change)
        options.forEach(option => {
            option.classList.remove('selected');
            // NO aria-checked update
            // NO tabindex management
        });

        // Select the clicked option (only CSS class)
        selectedOption.classList.add('selected');
        // NO aria-checked="true"
        // NO focus management
        // NO screen reader announcement

        // Update state display
        updateBadStateDisplay(groupName, selectedOption);
    }

    /**
     * Update the visual state display for bad radiogroups
     * @param {string} groupName - Name prefix for state display elements
     * @param {HTMLElement} selectedOption - The selected option
     */
    function updateBadStateDisplay(groupName, selectedOption) {
        const value = selectedOption.getAttribute('data-value');

        if (groupName === 'shipping-bad') {
            const stateDisplay = document.getElementById('shipping-bad-state');
            const priceDisplay = document.getElementById('shipping-bad-price');

            if (stateDisplay) {
                const labelText = selectedOption.querySelector('.radio-label')?.textContent || value;
                stateDisplay.textContent = labelText;
            }

            if (priceDisplay) {
                const priceText = selectedOption.querySelector('.radio-price')?.textContent || '';
                priceDisplay.textContent = priceText;
            }
        } else if (groupName === 'size-bad') {
            const stateDisplay = document.getElementById('size-bad-state');
            if (stateDisplay) {
                const labelText = selectedOption.querySelector('.radio-label')?.textContent || value;
                stateDisplay.textContent = labelText;
            }
        }

        // NO screen reader announcements
        // State changes are silent to assistive technology
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBadRadiogroups);
    } else {
        initBadRadiogroups();
    }

})();
