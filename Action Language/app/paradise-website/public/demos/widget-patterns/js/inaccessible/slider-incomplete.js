/**
 * Inaccessible Slider Implementation
 *
 * This file demonstrates a poorly implemented slider with accessibility issues.
 *
 * ISSUES PRESENT:
 * 1. Missing role="slider" - Screen readers can't identify as slider
 * 2. No ARIA attributes - No valuemin, valuemax, valuenow
 * 3. No accessible name - Missing aria-label or aria-labelledby
 * 4. No keyboard support - Cannot be operated via keyboard
 * 5. No tabindex - Cannot receive keyboard focus
 * 6. Missing aria-orientation for vertical slider
 *
 * This implementation only supports mouse interaction.
 */

(function() {
    'use strict';

    class InaccessibleSlider {
        constructor(element) {
            this.slider = element;
            this.track = element.closest('.slider-wrapper').querySelector('[data-bad-slider-track]');
            this.fill = element.closest('.slider-wrapper').querySelector('[data-bad-slider-fill]');

            // Get values from data attributes (not ARIA)
            this.min = parseInt(element.dataset.badSliderMin);
            this.max = parseInt(element.dataset.badSliderMax);

            // Initialize with middle value
            this.value = Math.floor((this.min + this.max) / 2);

            // Special handling for temperature and brightness
            this.sliderId = element.dataset.badSlider;
            if (this.sliderId === 'bad-temperature') {
                this.value = 68; // Default temperature
            } else if (this.sliderId === 'bad-brightness') {
                this.value = 75; // Default brightness
            } else if (this.sliderId === 'bad-vertical-volume') {
                this.value = 60; // Default vertical volume
            }

            this.orientation = element.dataset.badSliderOrientation || 'horizontal';
            this.isDragging = false;

            // Get associated elements
            this.valueDisplay = document.querySelector(`[data-bad-value-display="${this.sliderId}"]`);

            this.init();
        }

        init() {
            // Set initial position
            this.updateUI();

            // Only add mouse events - NO keyboard support
            this.addMouseEvents();
        }

        addMouseEvents() {
            // Mouse events only
            this.slider.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.track.addEventListener('click', this.handleTrackClick.bind(this));

            // Touch events
            this.slider.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });

            // NOTE: No keyboard event listeners!
            // NOTE: No focus/blur handlers!
        }

        handleMouseDown(event) {
            event.preventDefault();
            this.isDragging = true;

            // NOTE: No focus() call - element can't receive focus anyway

            document.addEventListener('mousemove', this.handleMouseMove.bind(this));
            document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        }

        handleMouseMove(event) {
            if (!this.isDragging) return;

            event.preventDefault();
            this.updateValueFromPosition(event.clientX, event.clientY);
        }

        handleMouseUp(event) {
            if (!this.isDragging) return;

            this.isDragging = false;

            document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
            document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        }

        handleTouchStart(event) {
            event.preventDefault();
            this.isDragging = true;

            document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        }

        handleTouchMove(event) {
            if (!this.isDragging) return;

            event.preventDefault();
            const touch = event.touches[0];
            this.updateValueFromPosition(touch.clientX, touch.clientY);
        }

        handleTouchEnd(event) {
            if (!this.isDragging) return;

            this.isDragging = false;

            document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
            document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        }

        handleTrackClick(event) {
            if (event.target === this.slider) return;

            this.updateValueFromPosition(event.clientX, event.clientY);
            // NOTE: No focus() call
        }

        updateValueFromPosition(clientX, clientY) {
            const rect = this.track.getBoundingClientRect();
            let percentage;

            if (this.orientation === 'vertical') {
                percentage = 1 - ((clientY - rect.top) / rect.height);
            } else {
                percentage = (clientX - rect.left) / rect.width;
            }

            percentage = Math.max(0, Math.min(1, percentage));

            const range = this.max - this.min;
            let newValue = this.min + (range * percentage);
            newValue = Math.round(newValue);

            this.setValue(newValue);
        }

        setValue(value) {
            value = Math.max(this.min, Math.min(this.max, value));
            this.value = value;

            // NOTE: No ARIA attribute updates!
            // NOTE: No aria-valuenow update
            // NOTE: No aria-valuetext update

            this.updateUI();

            // Still dispatch custom event for demo purposes
            this.slider.dispatchEvent(new CustomEvent('sliderchange', {
                detail: { value: value }
            }));
        }

        updateUI() {
            const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;

            if (this.orientation === 'vertical') {
                this.slider.style.bottom = `${percentage}%`;
                this.fill.style.height = `${percentage}%`;
            } else {
                this.slider.style.left = `${percentage}%`;
                this.fill.style.width = `${percentage}%`;
            }

            // Update value display (visual only)
            if (this.valueDisplay) {
                const sliderId = this.sliderId;

                if (sliderId === 'bad-brightness') {
                    this.valueDisplay.textContent = `${this.value}%`;
                } else {
                    this.valueDisplay.textContent = this.value;
                }
            }

            // Update temperature display if present
            if (this.sliderId === 'bad-temperature') {
                const tempDisplay = document.querySelector('[data-temp-display="inaccessible"]');
                if (tempDisplay) {
                    tempDisplay.textContent = `${this.value}°F`;
                }
            }
        }
    }

    // Initialize all inaccessible sliders
    function initInaccessibleSliders() {
        const sliders = document.querySelectorAll('[data-bad-slider]');

        sliders.forEach(slider => {
            new InaccessibleSlider(slider);
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInaccessibleSliders);
    } else {
        initInaccessibleSliders();
    }

})();
