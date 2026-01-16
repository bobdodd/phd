/**
 * Inaccessible Meter Pattern Implementation (BAD EXAMPLE)
 * Demonstrates common accessibility mistakes with meters
 *
 * Issues Demonstrated:
 * 1. No role="meter" - Using plain divs without semantic meaning
 * 2. No aria-valuenow - Current value not exposed to screen readers
 * 3. No aria-valuemin/max - Range information unavailable
 * 4. Missing aria-label - No accessible name for meters
 * 5. Color-only indicators - Status conveyed through color alone
 * 6. No screen reader announcements - Value changes not announced
 * 7. Visual-only implementation - Relies entirely on visual presentation
 *
 * Paradise will detect 4 critical issues in this implementation
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInaccessibleMeters);
    } else {
        initInaccessibleMeters();
    }

    function initInaccessibleMeters() {
        // Get fake meter elements (plain divs)
        const fakeDiskFill = document.getElementById('fake-disk-fill');
        const fakeBatteryFill = document.getElementById('fake-battery-fill');
        const fakeRatingFill = document.getElementById('fake-rating-fill');
        const fakeTempFill = document.getElementById('fake-temp-fill');

        if (!fakeDiskFill || !fakeBatteryFill || !fakeRatingFill || !fakeTempFill) {
            console.error('Fake meter elements not found');
            return;
        }

        // Store initial values (but not in any accessible way)
        const meterData = {
            disk: 750,
            battery: 45,
            rating: 4.5,
            temp: 75
        };

        // Simulate random updates (visual only, no accessibility)
        simulateUpdates(fakeDiskFill, fakeBatteryFill, fakeRatingFill, fakeTempFill, meterData);
    }

    /**
     * Simulate meter updates - INACCESSIBLE VERSION
     * Issues:
     * - Only updates visual width
     * - No ARIA attribute updates
     * - No screen reader announcements
     * - Color-only status indication
     */
    function simulateUpdates(diskFill, batteryFill, ratingFill, tempFill, data) {
        setInterval(function() {
            // Randomly update disk usage (visual only)
            const diskVariation = Math.floor(Math.random() * 50) - 25;
            data.disk = Math.max(0, Math.min(1000, data.disk + diskVariation));

            // ISSUE: Only updating visual width, no ARIA updates
            diskFill.style.width = ((data.disk / 1000) * 100) + '%';

            // ISSUE: Color changes not announced to screen readers
            if (data.disk < 300) {
                diskFill.className = 'fake-meter-fill green';
            } else if (data.disk < 700) {
                diskFill.className = 'fake-meter-fill yellow';
            } else {
                diskFill.className = 'fake-meter-fill red';
            }

            // Randomly update battery (visual only)
            const batteryVariation = Math.floor(Math.random() * 10) - 5;
            data.battery = Math.max(0, Math.min(100, data.battery + batteryVariation));

            // ISSUE: No aria-valuenow or aria-valuetext
            batteryFill.style.width = data.battery + '%';

            // ISSUE: Status conveyed through color only
            if (data.battery >= 70) {
                batteryFill.className = 'fake-meter-fill green';
            } else if (data.battery >= 30) {
                batteryFill.className = 'fake-meter-fill yellow';
            } else {
                batteryFill.className = 'fake-meter-fill red';
            }

            // Randomly update rating (visual only)
            const ratingVariation = (Math.random() * 0.2) - 0.1;
            data.rating = Math.max(0, Math.min(5, data.rating + ratingVariation));

            // ISSUE: No semantic meaning for rating value
            ratingFill.style.width = ((data.rating / 5) * 100) + '%';

            // Color based on rating (inaccessible)
            if (data.rating >= 4) {
                ratingFill.className = 'fake-meter-fill green';
            } else if (data.rating >= 2.5) {
                ratingFill.className = 'fake-meter-fill yellow';
            } else {
                ratingFill.className = 'fake-meter-fill red';
            }

            // Update temperature (visual only)
            const tempVariation = Math.floor(Math.random() * 6) - 3;
            data.temp = Math.max(0, Math.min(100, data.temp + tempVariation));

            // ISSUE: No accessible status information
            tempFill.style.width = data.temp + '%';

            // Temperature color coding (not accessible)
            if (data.temp < 60) {
                tempFill.className = 'fake-meter-fill green';
            } else if (data.temp < 80) {
                tempFill.className = 'fake-meter-fill yellow';
            } else {
                tempFill.className = 'fake-meter-fill red';
            }

            // ISSUE: No live region announcements for any updates
            // Screen reader users have no way to know values changed

        }, 3000); // Update every 3 seconds
    }

    /**
     * Additional bad practices demonstrated:
     */

    // ISSUE: No keyboard interaction support
    // Meters are completely non-interactive for keyboard users

    // ISSUE: No focus management
    // If these were interactive, no focus indicators would be provided

    // ISSUE: No alternative text representations
    // Values only shown visually, no aria-valuetext provided

    // ISSUE: Missing semantic relationships
    // Labels not properly associated with meters using aria-labelledby

    // ISSUE: No context for ranges
    // No aria-valuemin, aria-valuemax to indicate valid range

    // ISSUE: Semantic HTML not used
    // Could use <meter> element but using generic <div> instead

})();
