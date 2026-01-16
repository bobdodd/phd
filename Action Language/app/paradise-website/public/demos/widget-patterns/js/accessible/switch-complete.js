/**
 * ACCESSIBLE SWITCH (TOGGLE) IMPLEMENTATION
 *
 * This implementation follows WAI-ARIA best practices for switch controls.
 *
 * Key Accessibility Features:
 * - role="switch" for proper semantic meaning
 * - aria-checked to indicate state (true/false, not mixed)
 * - aria-label or aria-labelledby for accessible name
 * - Keyboard support (Space and Enter keys)
 * - Screen reader announcements of state changes
 * - Visual focus indicators
 * - Proper tabindex for keyboard navigation
 */

(function() {
    'use strict';

    /**
     * Initialize input checkbox based switches
     * These use native checkbox inputs with role="switch" overlay
     */
    function initInputCheckboxSwitches() {
        // Wi-Fi Switch
        const wifiSwitch = document.getElementById('wifi-switch');
        if (wifiSwitch) {
            wifiSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
                updateStateDisplay('wifi-state', this.checked);
            });
            // Initialize state display
            updateStateDisplay('wifi-state', wifiSwitch.checked);
        }

        // Notifications Switch
        const notificationsSwitch = document.getElementById('notifications-switch');
        if (notificationsSwitch) {
            notificationsSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
                updateStateDisplay('notifications-state', this.checked);
            });
            updateStateDisplay('notifications-state', notificationsSwitch.checked);
        }

        // Dark Mode Switch
        const darkmodeSwitch = document.getElementById('darkmode-switch');
        if (darkmodeSwitch) {
            darkmodeSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
                updateStateDisplay('darkmode-state', this.checked);
            });
            updateStateDisplay('darkmode-state', darkmodeSwitch.checked);
        }

        // Bluetooth Switch (disabled)
        const bluetoothSwitch = document.getElementById('bluetooth-switch');
        if (bluetoothSwitch) {
            bluetoothSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
                updateStateDisplay('bluetooth-state', this.checked);
            });
            updateStateDisplay('bluetooth-state', bluetoothSwitch.checked);
        }
    }

    /**
     * Initialize button-based switches
     * These use custom button elements with full keyboard and ARIA support
     */
    function initButtonSwitches() {
        // Location Services Switch
        const locationBtn = document.getElementById('location-switch-btn');
        if (locationBtn) {
            initButtonSwitch(locationBtn, 'location-state');
        }

        // Autoplay Videos Switch
        const autoplayBtn = document.getElementById('autoplay-switch-btn');
        if (autoplayBtn) {
            initButtonSwitch(autoplayBtn, 'autoplay-state');
        }

        // Analytics Switch
        const analyticsBtn = document.getElementById('analytics-switch-btn');
        if (analyticsBtn) {
            initButtonSwitch(analyticsBtn, 'analytics-state');
        }
    }

    /**
     * Initialize a single button switch with full accessibility
     * @param {HTMLElement} button - The button element with role="switch"
     * @param {string} stateDisplayId - ID of element to update with state
     */
    function initButtonSwitch(button, stateDisplayId) {
        // Click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleButtonSwitch(this, stateDisplayId);
        });

        // Keyboard handler for Space and Enter
        button.addEventListener('keydown', function(e) {
            // Space (32) or Enter (13) keys
            if (e.keyCode === 32 || e.keyCode === 13) {
                e.preventDefault();
                toggleButtonSwitch(this, stateDisplayId);
            }
        });

        // Initialize state display
        const isChecked = button.getAttribute('aria-checked') === 'true';
        updateStateDisplay(stateDisplayId, isChecked);
    }

    /**
     * Toggle a button-based switch
     * @param {HTMLElement} button - The switch button
     * @param {string} stateDisplayId - ID of state display element
     */
    function toggleButtonSwitch(button, stateDisplayId) {
        // Check if disabled
        if (button.getAttribute('aria-disabled') === 'true') {
            return;
        }

        // Get current state
        const currentState = button.getAttribute('aria-checked') === 'true';
        const newState = !currentState;

        // Update aria-checked attribute
        button.setAttribute('aria-checked', newState.toString());

        // Update state display
        updateStateDisplay(stateDisplayId, newState);

        // Announce to screen readers
        announceStateChange(button, newState);
    }

    /**
     * Update aria-checked attribute for input-based switches
     * @param {HTMLInputElement} input - The checkbox input
     */
    function updateAriaChecked(input) {
        input.setAttribute('aria-checked', input.checked.toString());
    }

    /**
     * Update the visual state display
     * @param {string} elementId - ID of the state display element
     * @param {boolean} isChecked - Whether the switch is checked
     */
    function updateStateDisplay(elementId, isChecked) {
        const stateElement = document.getElementById(elementId);
        if (stateElement) {
            stateElement.textContent = isChecked ? 'On' : 'Off';
            stateElement.style.color = isChecked ? '#10b981' : '#ef4444';
        }
    }

    /**
     * Announce state change to screen readers
     * @param {HTMLElement} element - The switch element
     * @param {boolean} newState - The new state (true/false)
     */
    function announceStateChange(element, newState) {
        // Get the label text
        const labelId = element.getAttribute('aria-labelledby');
        let labelText = '';

        if (labelId) {
            const labelElement = document.getElementById(labelId);
            if (labelElement) {
                labelText = labelElement.textContent;
            }
        } else {
            labelText = element.getAttribute('aria-label') || '';
        }

        // Create announcement
        const announcement = `${labelText} ${newState ? 'on' : 'off'}`;

        // Create or update live region for announcements
        let liveRegion = document.getElementById('switch-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'switch-live-region';
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

    /**
     * Initialize size variant switches
     */
    function initSizeVariants() {
        const smallSwitch = document.getElementById('small-switch');
        const mediumSwitch = document.getElementById('medium-switch');
        const largeSwitch = document.getElementById('large-switch');

        if (smallSwitch) {
            smallSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
            });
        }

        if (mediumSwitch) {
            mediumSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
            });
        }

        if (largeSwitch) {
            largeSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
            });
        }
    }

    /**
     * Initialize color variant switches
     */
    function initColorVariants() {
        const successSwitch = document.getElementById('success-switch');
        const dangerSwitch = document.getElementById('danger-switch');
        const warningSwitch = document.getElementById('warning-switch');

        if (successSwitch) {
            successSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
            });
        }

        if (dangerSwitch) {
            dangerSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
            });
        }

        if (warningSwitch) {
            warningSwitch.addEventListener('change', function() {
                updateAriaChecked(this);
            });
        }
    }

    /**
     * Initialize icon switches
     */
    function initIconSwitches() {
        const iconWifi = document.getElementById('icon-wifi');
        const iconSound = document.getElementById('icon-sound');

        if (iconWifi) {
            iconWifi.addEventListener('change', function() {
                updateAriaChecked(this);
            });
        }

        if (iconSound) {
            iconSound.addEventListener('change', function() {
                updateAriaChecked(this);
            });
        }
    }

    // Initialize all switches when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initInputCheckboxSwitches();
            initButtonSwitches();
            initSizeVariants();
            initColorVariants();
            initIconSwitches();
        });
    } else {
        initInputCheckboxSwitches();
        initButtonSwitches();
        initSizeVariants();
        initColorVariants();
        initIconSwitches();
    }

})();
