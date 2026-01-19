/**
 * Accessible Meter Pattern Implementation
 * Demonstrates proper ARIA attributes and semantic HTML for meters
 *
 * Key Features:
 * - Native <meter> elements with proper attributes
 * - Custom ARIA meters with role="meter"
 * - aria-valuenow, aria-valuemin, aria-valuemax
 * - aria-label and aria-labelledby for accessible names
 * - aria-valuetext for human-readable values
 * - Semantic ranges (low/optimum/high) with visual feedback
 * - Screen reader announcements for value changes
 * - Keyboard-accessible controls
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibleMeters);
    } else {
        initAccessibleMeters();
    }

    function initAccessibleMeters() {
        // Get all meter elements and controls
        const elements = {
            // Native meters
            diskMeter: document.getElementById('disk-meter'),
            tempMeter: document.getElementById('temp-meter'),

            // Custom ARIA meters
            batteryMeter: document.getElementById('battery-meter'),
            batteryFill: document.getElementById('battery-fill'),
            batteryStatus: document.getElementById('battery-status'),

            ratingMeter: document.getElementById('rating-meter'),
            ratingFill: document.getElementById('rating-fill'),
            ratingStatus: document.getElementById('rating-status'),

            // Value displays
            diskValueText: document.getElementById('disk-value-text'),
            batteryValueText: document.getElementById('battery-value-text'),
            ratingValueText: document.getElementById('rating-value-text'),
            tempValueText: document.getElementById('temp-value-text'),
            tempStatus: document.getElementById('temp-status'),

            // Controls
            diskSlider: document.getElementById('disk-slider'),
            batterySlider: document.getElementById('battery-slider'),
            ratingInput: document.getElementById('rating-input'),

            // Buttons
            btnOptimal: document.getElementById('btn-optimal'),
            btnMedium: document.getElementById('btn-medium'),
            btnCritical: document.getElementById('btn-critical'),
            btnAnimate: document.getElementById('btn-animate'),

            // Live region for screen reader announcements
            srAnnouncements: document.getElementById('sr-announcements')
        };

        // Verify elements exist
        if (!elements.diskMeter || !elements.batteryMeter) {
            console.error('Required meter elements not found');
            return;
        }

        // Set up event listeners
        setupEventListeners(elements);

        // Initialize keyboard navigation
        setupKeyboardNavigation(elements);
    }

    /**
     * Set up event listeners for interactive controls
     */
    function setupEventListeners(elements) {
        // Disk usage slider
        elements.diskSlider.addEventListener('input', function(e) {
            updateDiskMeter(elements, parseInt(e.target.value));
        });

        // Battery level slider
        elements.batterySlider.addEventListener('input', function(e) {
            updateBatteryMeter(elements, parseInt(e.target.value));
        });

        // Rating input
        elements.ratingInput.addEventListener('input', function(e) {
            updateRatingMeter(elements, parseFloat(e.target.value));
        });

        // Quick action buttons
        elements.btnOptimal.addEventListener('click', function() {
            setOptimalValues(elements);
        });

        elements.btnMedium.addEventListener('click', function() {
            setMediumValues(elements);
        });

        elements.btnCritical.addEventListener('click', function() {
            setCriticalValues(elements);
        });

        elements.btnAnimate.addEventListener('click', function() {
            animateMeters(elements);
        });
    }

    /**
     * Update disk meter with proper ARIA attributes and visual feedback
     */
    function updateDiskMeter(elements, value) {
        // Update native meter element
        elements.diskMeter.value = value;

        // Update visual text
        const percentUsed = Math.round((value / 1000) * 100);
        const displayText = `${value} GB of 1000 GB used`;
        elements.diskValueText.textContent = displayText;

        // Update aria-label for screen readers
        elements.diskMeter.setAttribute('aria-label', `Disk usage: ${displayText}`);

        // Determine status and announce
        const status = getDiskStatus(value);
        announceToScreenReader(elements, `Disk usage updated to ${value} GB, ${status}`);

        // Add visual feedback
        animateElement(elements.diskMeter.closest('.meter-group'));
    }

    /**
     * Update battery meter with ARIA role and attributes
     */
    function updateBatteryMeter(elements, value) {
        // Update ARIA attributes
        elements.batteryMeter.setAttribute('aria-valuenow', value);

        // Determine status
        const status = getBatteryStatus(value);
        const statusText = `${value} percent, ${status} level`;
        elements.batteryMeter.setAttribute('aria-valuetext', statusText);

        // Update visual fill
        elements.batteryFill.style.width = `${value}%`;
        elements.batteryFill.textContent = `${value}%`;

        // Update fill color based on value
        elements.batteryFill.className = 'custom-meter-fill';
        if (value >= 70) {
            elements.batteryFill.classList.add('optimal');
        } else if (value >= 30) {
            elements.batteryFill.classList.add('suboptimal');
        } else {
            elements.batteryFill.classList.add('critical');
        }

        // Update status badge
        elements.batteryValueText.textContent = `${value}%`;
        elements.batteryStatus.className = 'status-badge';
        if (value >= 70) {
            elements.batteryStatus.classList.add('optimal');
            elements.batteryStatus.innerHTML = '⚡ High Level';
        } else if (value >= 30) {
            elements.batteryStatus.classList.add('suboptimal');
            elements.batteryStatus.innerHTML = '⚡ Medium Level';
        } else {
            elements.batteryStatus.classList.add('critical');
            elements.batteryStatus.innerHTML = '⚡ Low Level';
        }

        // Announce to screen readers
        announceToScreenReader(elements, `Battery level updated to ${statusText}`);

        // Add visual feedback
        animateElement(elements.batteryMeter.closest('.meter-group'));
    }

    /**
     * Update rating meter with proper ARIA attributes
     */
    function updateRatingMeter(elements, value) {
        // Clamp value between 0 and 5
        value = Math.max(0, Math.min(5, value));

        // Update ARIA attributes
        elements.ratingMeter.setAttribute('aria-valuenow', value.toFixed(1));

        // Determine status
        const status = getRatingStatus(value);
        const statusText = `${value.toFixed(1)} out of 5 stars, ${status} rating`;
        elements.ratingMeter.setAttribute('aria-valuetext', statusText);

        // Update visual fill (percentage of max)
        const percentage = (value / 5) * 100;
        elements.ratingFill.style.width = `${percentage}%`;

        // Update stars display
        const fullStars = Math.floor(value);
        const hasHalfStar = (value % 1) >= 0.5;
        let starsDisplay = '★'.repeat(fullStars);
        if (hasHalfStar && fullStars < 5) {
            starsDisplay += '⯨';
        }
        starsDisplay += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
        elements.ratingFill.textContent = starsDisplay;

        // Update fill color
        elements.ratingFill.className = 'custom-meter-fill';
        if (value >= 4) {
            elements.ratingFill.classList.add('optimal');
        } else if (value >= 2.5) {
            elements.ratingFill.classList.add('suboptimal');
        } else {
            elements.ratingFill.classList.add('critical');
        }

        // Update value display
        elements.ratingValueText.textContent = `${value.toFixed(1)} / 5.0`;

        // Update status badge
        elements.ratingStatus.className = 'status-badge';
        if (value >= 4) {
            elements.ratingStatus.classList.add('optimal');
            elements.ratingStatus.innerHTML = '⭐ Excellent';
        } else if (value >= 2.5) {
            elements.ratingStatus.classList.add('suboptimal');
            elements.ratingStatus.innerHTML = '⭐ Good';
        } else {
            elements.ratingStatus.classList.add('critical');
            elements.ratingStatus.innerHTML = '⭐ Poor';
        }

        // Announce to screen readers
        announceToScreenReader(elements, `Rating updated to ${statusText}`);

        // Add visual feedback
        animateElement(elements.ratingMeter.closest('.meter-group'));
    }

    /**
     * Helper function to get disk status
     */
    function getDiskStatus(value) {
        if (value < 300) return 'optimal';
        if (value < 700) return 'fair';
        return 'critical';
    }

    /**
     * Helper function to get battery status
     */
    function getBatteryStatus(value) {
        if (value >= 70) return 'high';
        if (value >= 30) return 'medium';
        return 'low';
    }

    /**
     * Helper function to get rating status
     */
    function getRatingStatus(value) {
        if (value >= 4) return 'excellent';
        if (value >= 2.5) return 'good';
        return 'poor';
    }

    /**
     * Set all meters to optimal values
     */
    function setOptimalValues(elements) {
        elements.diskSlider.value = 200;
        updateDiskMeter(elements, 200);

        elements.batterySlider.value = 95;
        updateBatteryMeter(elements, 95);

        elements.ratingInput.value = 5.0;
        updateRatingMeter(elements, 5.0);

        announceToScreenReader(elements, 'All meters set to optimal values');
    }

    /**
     * Set all meters to medium values
     */
    function setMediumValues(elements) {
        elements.diskSlider.value = 500;
        updateDiskMeter(elements, 500);

        elements.batterySlider.value = 50;
        updateBatteryMeter(elements, 50);

        elements.ratingInput.value = 3.0;
        updateRatingMeter(elements, 3.0);

        announceToScreenReader(elements, 'All meters set to medium values');
    }

    /**
     * Set all meters to critical values
     */
    function setCriticalValues(elements) {
        elements.diskSlider.value = 950;
        updateDiskMeter(elements, 950);

        elements.batterySlider.value = 10;
        updateBatteryMeter(elements, 10);

        elements.ratingInput.value = 1.5;
        updateRatingMeter(elements, 1.5);

        announceToScreenReader(elements, 'All meters set to critical values');
    }

    /**
     * Animate meters through different values
     */
    function animateMeters(elements) {
        let step = 0;
        const steps = [
            { disk: 100, battery: 90, rating: 5.0 },
            { disk: 300, battery: 70, rating: 4.5 },
            { disk: 500, battery: 50, rating: 3.5 },
            { disk: 700, battery: 30, rating: 2.5 },
            { disk: 900, battery: 15, rating: 1.5 },
            { disk: 750, battery: 45, rating: 4.5 }
        ];

        announceToScreenReader(elements, 'Starting meter animation');

        const interval = setInterval(function() {
            if (step >= steps.length) {
                clearInterval(interval);
                announceToScreenReader(elements, 'Animation complete');
                return;
            }

            const values = steps[step];

            elements.diskSlider.value = values.disk;
            updateDiskMeter(elements, values.disk);

            elements.batterySlider.value = values.battery;
            updateBatteryMeter(elements, values.battery);

            elements.ratingInput.value = values.rating;
            updateRatingMeter(elements, values.rating);

            step++;
        }, 800);
    }

    /**
     * Announce updates to screen readers using live region
     */
    function announceToScreenReader(elements, message) {
        if (elements.srAnnouncements) {
            elements.srAnnouncements.textContent = message;

            // Clear after announcement to allow repeat announcements
            setTimeout(function() {
                elements.srAnnouncements.textContent = '';
            }, 1000);
        }
    }

    /**
     * Add visual feedback animation
     */
    function animateElement(element) {
        if (!element) return;

        element.classList.add('updating');
        setTimeout(function() {
            element.classList.remove('updating');
        }, 500);
    }

    /**
     * Set up keyboard navigation for better accessibility
     */
    function setupKeyboardNavigation(elements) {
        // Allow keyboard control of sliders with arrow keys
        const sliders = [elements.diskSlider, elements.batterySlider];

        sliders.forEach(function(slider) {
            if (!slider) return;

            slider.addEventListener('keydown', function(e) {
                let step;
                if (slider === elements.diskSlider) {
                    step = 50; // 50 GB increments
                } else {
                    step = 10; // 10% increments
                }

                switch(e.key) {
                    case 'ArrowUp':
                    case 'ArrowRight':
                        e.preventDefault();
                        slider.value = Math.min(
                            parseInt(slider.max),
                            parseInt(slider.value) + step
                        );
                        slider.dispatchEvent(new Event('input'));
                        break;
                    case 'ArrowDown':
                    case 'ArrowLeft':
                        e.preventDefault();
                        slider.value = Math.max(
                            parseInt(slider.min),
                            parseInt(slider.value) - step
                        );
                        slider.dispatchEvent(new Event('input'));
                        break;
                    case 'Home':
                        e.preventDefault();
                        slider.value = slider.min;
                        slider.dispatchEvent(new Event('input'));
                        break;
                    case 'End':
                        e.preventDefault();
                        slider.value = slider.max;
                        slider.dispatchEvent(new Event('input'));
                        break;
                }
            });
        });
    }

})();
