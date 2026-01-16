/**
 * ACCESSIBLE RADIOGROUP IMPLEMENTATION
 *
 * This implementation follows WAI-ARIA best practices for radiogroup controls.
 *
 * Key Accessibility Features:
 * - role="radiogroup" on container element
 * - role="radio" on each radio option
 * - aria-checked to indicate selection state (true/false)
 * - aria-labelledby or aria-label for radiogroup accessible name
 * - Roving tabindex pattern (only one option has tabindex="0" at a time)
 * - Arrow key navigation (Up/Down for vertical, Left/Right for horizontal)
 * - Space key to select focused option
 * - Screen reader announcements of state changes
 * - Support for aria-disabled options
 */

(function() {
    'use strict';

    /**
     * Initialize all accessible radiogroups on the page
     */
    function initRadiogroups() {
        // Get all radiogroups
        const radiogroups = document.querySelectorAll('[role="radiogroup"]');

        radiogroups.forEach(radiogroup => {
            // Skip if already initialized
            if (radiogroup.hasAttribute('data-radiogroup-initialized')) {
                return;
            }

            initRadiogroup(radiogroup);
            radiogroup.setAttribute('data-radiogroup-initialized', 'true');
        });
    }

    /**
     * Initialize a single radiogroup with full accessibility
     * @param {HTMLElement} radiogroup - The radiogroup container element
     */
    function initRadiogroup(radiogroup) {
        const radios = Array.from(radiogroup.querySelectorAll('[role="radio"]'));

        if (radios.length === 0) {
            return;
        }

        // Determine orientation (default to vertical)
        const isHorizontal = radiogroup.classList.contains('horizontal');

        // Set up each radio option
        radios.forEach((radio, index) => {
            // Click handler
            radio.addEventListener('click', function(e) {
                e.preventDefault();
                selectRadio(radiogroup, this);
            });

            // Keyboard handler
            radio.addEventListener('keydown', function(e) {
                handleKeydown(e, radiogroup, radios, index, isHorizontal);
            });
        });

        // Initialize state displays for this radiogroup
        initStateDisplay(radiogroup);
    }

    /**
     * Select a radio option
     * @param {HTMLElement} radiogroup - The radiogroup container
     * @param {HTMLElement} selectedRadio - The radio option to select
     */
    function selectRadio(radiogroup, selectedRadio) {
        // Check if disabled
        if (selectedRadio.getAttribute('aria-disabled') === 'true') {
            return;
        }

        // Get all radios in this group
        const radios = radiogroup.querySelectorAll('[role="radio"]');

        // Deselect all radios and set tabindex to -1
        radios.forEach(radio => {
            radio.setAttribute('aria-checked', 'false');
            radio.setAttribute('tabindex', '-1');
        });

        // Select the clicked radio and set tabindex to 0
        selectedRadio.setAttribute('aria-checked', 'true');
        selectedRadio.setAttribute('tabindex', '0');
        selectedRadio.focus();

        // Update state display
        updateStateDisplay(radiogroup, selectedRadio);

        // Announce to screen readers
        announceSelection(selectedRadio);
    }

    /**
     * Handle keyboard navigation in radiogroup
     * @param {KeyboardEvent} e - The keyboard event
     * @param {HTMLElement} radiogroup - The radiogroup container
     * @param {Array<HTMLElement>} radios - Array of all radio options
     * @param {number} currentIndex - Index of currently focused radio
     * @param {boolean} isHorizontal - Whether the radiogroup is horizontal
     */
    function handleKeydown(e, radiogroup, radios, currentIndex, isHorizontal) {
        let newIndex = currentIndex;
        let handled = false;

        // Get enabled radios (not disabled)
        const enabledRadios = radios.filter(radio =>
            radio.getAttribute('aria-disabled') !== 'true'
        );
        const enabledIndex = enabledRadios.indexOf(radios[currentIndex]);

        switch(e.key) {
            case 'ArrowDown':
            case 'Down':
                if (!isHorizontal) {
                    // Move to next enabled radio (wrap around)
                    const nextIndex = (enabledIndex + 1) % enabledRadios.length;
                    selectRadio(radiogroup, enabledRadios[nextIndex]);
                    handled = true;
                }
                break;

            case 'ArrowUp':
            case 'Up':
                if (!isHorizontal) {
                    // Move to previous enabled radio (wrap around)
                    const prevIndex = (enabledIndex - 1 + enabledRadios.length) % enabledRadios.length;
                    selectRadio(radiogroup, enabledRadios[prevIndex]);
                    handled = true;
                }
                break;

            case 'ArrowRight':
            case 'Right':
                if (isHorizontal) {
                    // Move to next enabled radio (wrap around)
                    const nextIndex = (enabledIndex + 1) % enabledRadios.length;
                    selectRadio(radiogroup, enabledRadios[nextIndex]);
                    handled = true;
                }
                break;

            case 'ArrowLeft':
            case 'Left':
                if (isHorizontal) {
                    // Move to previous enabled radio (wrap around)
                    const prevIndex = (enabledIndex - 1 + enabledRadios.length) % enabledRadios.length;
                    selectRadio(radiogroup, enabledRadios[prevIndex]);
                    handled = true;
                }
                break;

            case ' ':
            case 'Spacebar':
                // Select the currently focused radio
                selectRadio(radiogroup, radios[currentIndex]);
                handled = true;
                break;
        }

        if (handled) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /**
     * Initialize state display for a radiogroup
     * @param {HTMLElement} radiogroup - The radiogroup container
     */
    function initStateDisplay(radiogroup) {
        const selectedRadio = radiogroup.querySelector('[role="radio"][aria-checked="true"]');
        if (selectedRadio) {
            updateStateDisplay(radiogroup, selectedRadio);
        }
    }

    /**
     * Update the state display when selection changes
     * @param {HTMLElement} radiogroup - The radiogroup container
     * @param {HTMLElement} selectedRadio - The newly selected radio
     */
    function updateStateDisplay(radiogroup, selectedRadio) {
        const radiogroupId = radiogroup.id;
        const value = selectedRadio.getAttribute('data-value');

        // Update based on which radiogroup this is
        if (radiogroupId === 'shipping-group') {
            const stateDisplay = document.getElementById('shipping-state');
            const priceDisplay = document.getElementById('shipping-price');

            if (stateDisplay) {
                const labelText = selectedRadio.querySelector('.radio-label')?.textContent || value;
                stateDisplay.textContent = labelText;
            }

            if (priceDisplay) {
                const priceText = selectedRadio.querySelector('.radio-price')?.textContent || '';
                priceDisplay.textContent = priceText;
            }
        } else if (radiogroupId === 'size-group') {
            const stateDisplay = document.getElementById('size-state');
            if (stateDisplay) {
                const labelText = selectedRadio.querySelector('.radio-label')?.textContent || value;
                stateDisplay.textContent = labelText;
            }
        } else if (radiogroupId === 'plan-group') {
            const stateDisplay = document.getElementById('plan-state');
            const priceDisplay = document.getElementById('plan-price');

            if (stateDisplay) {
                const labelText = selectedRadio.querySelector('.radio-label')?.textContent || value;
                stateDisplay.textContent = labelText;
            }

            if (priceDisplay) {
                const priceText = selectedRadio.querySelector('.radio-price')?.textContent || '';
                priceDisplay.textContent = priceText;
            }
        }
    }

    /**
     * Announce selection change to screen readers
     * @param {HTMLElement} selectedRadio - The newly selected radio option
     */
    function announceSelection(selectedRadio) {
        // Get the label text
        const labelElement = selectedRadio.querySelector('.radio-label');
        const labelText = labelElement ? labelElement.textContent : selectedRadio.textContent;

        // Create announcement
        const announcement = `${labelText.trim()} selected`;

        // Create or update live region for announcements
        let liveRegion = document.getElementById('radiogroup-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'radiogroup-live-region';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }

        // Clear and set new announcement
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = announcement;
        }, 100);
    }

    // Initialize all radiogroups when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRadiogroups);
    } else {
        initRadiogroups();
    }

})();
