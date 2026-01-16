/**
 * INACCESSIBLE SWITCH (TOGGLE) IMPLEMENTATION
 *
 * This implementation demonstrates common accessibility mistakes:
 *
 * ISSUES (4 detected by Paradise):
 * 1. Missing role="switch" - Screen readers don't know this is a switch
 * 2. Missing aria-checked - State is not announced to assistive technology
 * 3. Not keyboard accessible - No keyboard event handlers, no tabindex
 * 4. No accessible label - Missing aria-label or aria-labelledby
 *
 * Additional problems:
 * - Only works with mouse clicks
 * - No focus management
 * - No screen reader announcements
 * - State changes are purely visual
 */

(function() {
    'use strict';

    /**
     * Initialize inaccessible switches
     * These only respond to mouse clicks and have no accessibility features
     */
    function initInaccessibleSwitches() {
        // Wi-Fi Bad Switch
        const wifiBad = document.getElementById('wifi-bad');
        if (wifiBad) {
            wifiBad.addEventListener('click', function() {
                toggleBadSwitch(this, 'wifi-bad-state');
            });
        }

        // Notifications Bad Switch
        const notificationsBad = document.getElementById('notifications-bad');
        if (notificationsBad) {
            notificationsBad.addEventListener('click', function() {
                toggleBadSwitch(this, 'notifications-bad-state');
            });
        }

        // Dark Mode Bad Switch
        const darkmodeBad = document.getElementById('darkmode-bad');
        if (darkmodeBad) {
            darkmodeBad.addEventListener('click', function() {
                toggleBadSwitch(this, 'darkmode-bad-state');
            });
        }

        // Bluetooth Bad Switch
        const bluetoothBad = document.getElementById('bluetooth-bad');
        if (bluetoothBad) {
            bluetoothBad.addEventListener('click', function() {
                toggleBadSwitch(this, 'bluetooth-bad-state');
            });
        }
    }

    /**
     * Toggle a bad (inaccessible) switch
     * This only toggles visual appearance, no accessibility support
     * @param {HTMLElement} element - The switch div element
     * @param {string} stateDisplayId - ID of state display element
     */
    function toggleBadSwitch(element, stateDisplayId) {
        // Toggle the 'active' class for visual appearance only
        element.classList.toggle('active');

        // Update state display based on class
        const isActive = element.classList.contains('active');
        updateBadStateDisplay(stateDisplayId, isActive);

        // NO aria-checked update
        // NO keyboard support
        // NO screen reader announcement
        // NO focus management
        // NO role="switch"
    }

    /**
     * Update the visual state display for bad switches
     * @param {string} elementId - ID of the state display element
     * @param {boolean} isActive - Whether the switch is active
     */
    function updateBadStateDisplay(elementId, isActive) {
        const stateElement = document.getElementById(elementId);
        if (stateElement) {
            stateElement.textContent = isActive ? 'On' : 'Off';
            stateElement.style.color = isActive ? '#10b981' : '#ef4444';
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInaccessibleSwitches);
    } else {
        initInaccessibleSwitches();
    }

})();
