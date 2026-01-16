/**
 * Accessible Slider Implementation
 *
 * This file demonstrates a fully accessible slider component following ARIA best practices.
 *
 * Key Features:
 * - Proper ARIA attributes (role, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext)
 * - Full keyboard support (Arrow keys, Home, End, Page Up/Down)
 * - Mouse/touch support with click and drag
 * - Vertical and horizontal orientations
 * - Custom value formatting
 * - Focus management
 */

(function() {
    'use strict';

    class AccessibleSlider {
        constructor(element) {
            this.slider = element;
            this.track = element.closest('.slider-wrapper').querySelector('[data-slider-track]');
            this.fill = element.closest('.slider-wrapper').querySelector('[data-slider-fill]');
            this.min = parseInt(element.getAttribute('aria-valuemin'));
            this.max = parseInt(element.getAttribute('aria-valuemax'));
            this.step = parseInt(element.dataset.sliderStep) || 1;
            this.value = parseInt(element.getAttribute('aria-valuenow'));
            this.orientation = element.dataset.sliderOrientation || 'horizontal';
            this.isDragging = false;

            // Get associated elements
            this.sliderId = element.dataset.slider;
            this.valueDisplay = document.querySelector(`[data-value-display="${this.sliderId}"]`);

            this.init();
        }

        init() {
            // Set initial position
            this.updateUI();

            // Add event listeners
            this.addEventListeners();
        }

        addEventListeners() {
            // Keyboard events
            this.slider.addEventListener('keydown', this.handleKeyDown.bind(this));

            // Mouse events
            this.slider.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.track.addEventListener('click', this.handleTrackClick.bind(this));

            // Touch events
            this.slider.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });

            // Focus events
            this.slider.addEventListener('focus', this.handleFocus.bind(this));
            this.slider.addEventListener('blur', this.handleBlur.bind(this));
        }

        handleKeyDown(event) {
            let newValue = this.value;
            let handled = true;

            const isVertical = this.orientation === 'vertical';
            const increment = this.step;
            const largeIncrement = Math.max(this.step * 10, (this.max - this.min) / 10);

            switch(event.key) {
                case 'ArrowRight':
                case 'ArrowUp':
                    newValue = isVertical ?
                        (event.key === 'ArrowUp' ? this.value + increment : this.value) :
                        (event.key === 'ArrowRight' ? this.value + increment : this.value);
                    break;

                case 'ArrowLeft':
                case 'ArrowDown':
                    newValue = isVertical ?
                        (event.key === 'ArrowDown' ? this.value - increment : this.value) :
                        (event.key === 'ArrowLeft' ? this.value - increment : this.value);
                    break;

                case 'Home':
                    newValue = this.min;
                    break;

                case 'End':
                    newValue = this.max;
                    break;

                case 'PageUp':
                    newValue = this.value + largeIncrement;
                    break;

                case 'PageDown':
                    newValue = this.value - largeIncrement;
                    break;

                default:
                    handled = false;
            }

            if (handled) {
                event.preventDefault();
                this.setValue(newValue);
            }
        }

        handleMouseDown(event) {
            event.preventDefault();
            this.isDragging = true;
            this.slider.focus();

            // Add document-level mouse event listeners
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

            // Remove document-level mouse event listeners
            document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
            document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
        }

        handleTouchStart(event) {
            event.preventDefault();
            this.isDragging = true;
            this.slider.focus();

            // Add document-level touch event listeners
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

            // Remove document-level touch event listeners
            document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
            document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        }

        handleTrackClick(event) {
            // Don't handle if clicking on the thumb
            if (event.target === this.slider) return;

            this.updateValueFromPosition(event.clientX, event.clientY);
            this.slider.focus();
        }

        handleFocus() {
            // Show focus indicator
            const focusIndicator = document.getElementById('focusIndicator');
            if (focusIndicator) {
                focusIndicator.classList.add('visible');
            }
        }

        handleBlur() {
            // Hide focus indicator
            const focusIndicator = document.getElementById('focusIndicator');
            if (focusIndicator) {
                focusIndicator.classList.remove('visible');
            }
        }

        updateValueFromPosition(clientX, clientY) {
            const rect = this.track.getBoundingClientRect();
            let percentage;

            if (this.orientation === 'vertical') {
                // For vertical sliders, calculate from bottom
                percentage = 1 - ((clientY - rect.top) / rect.height);
            } else {
                // For horizontal sliders, calculate from left
                percentage = (clientX - rect.left) / rect.width;
            }

            // Clamp percentage between 0 and 1
            percentage = Math.max(0, Math.min(1, percentage));

            // Calculate new value
            const range = this.max - this.min;
            let newValue = this.min + (range * percentage);

            // Round to nearest step
            newValue = Math.round(newValue / this.step) * this.step;

            this.setValue(newValue);
        }

        setValue(value) {
            // Clamp value between min and max
            value = Math.max(this.min, Math.min(this.max, value));

            // Round to nearest step
            value = Math.round(value / this.step) * this.step;

            // Update internal state
            this.value = value;

            // Update ARIA attributes
            this.slider.setAttribute('aria-valuenow', value);

            // Update aria-valuetext if needed
            this.updateValueText(value);

            // Update UI
            this.updateUI();

            // Trigger change event
            this.slider.dispatchEvent(new CustomEvent('sliderchange', {
                detail: { value: value }
            }));
        }

        updateValueText(value) {
            const sliderId = this.sliderId;

            // Temperature slider
            if (sliderId === 'temperature') {
                this.slider.setAttribute('aria-valuetext', `${value} degrees Fahrenheit`);
                const tempDisplay = document.querySelector('[data-temp-display="accessible"]');
                if (tempDisplay) {
                    tempDisplay.textContent = `${value}°F`;
                }
            }

            // Brightness slider (percentage)
            if (sliderId === 'brightness') {
                this.slider.setAttribute('aria-valuetext', `${value} percent`);
            }
        }

        updateUI() {
            const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;

            if (this.orientation === 'vertical') {
                // Vertical slider: thumb moves from bottom to top
                this.slider.style.bottom = `${percentage}%`;
                this.fill.style.height = `${percentage}%`;
            } else {
                // Horizontal slider: thumb moves from left to right
                this.slider.style.left = `${percentage}%`;
                this.fill.style.width = `${percentage}%`;
            }

            // Update value display
            if (this.valueDisplay) {
                const sliderId = this.sliderId;

                if (sliderId === 'brightness') {
                    this.valueDisplay.textContent = `${this.value}%`;
                } else {
                    this.valueDisplay.textContent = this.value;
                }
            }
        }
    }

    // Initialize all accessible sliders when DOM is ready
    function initAccessibleSliders() {
        const sliders = document.querySelectorAll('[data-slider][role="slider"]');

        sliders.forEach(slider => {
            new AccessibleSlider(slider);
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibleSliders);
    } else {
        initAccessibleSliders();
    }

    // Auto-hide focus indicator after 3 seconds of inactivity
    let focusIndicatorTimeout;
    document.addEventListener('focusin', () => {
        clearTimeout(focusIndicatorTimeout);
        focusIndicatorTimeout = setTimeout(() => {
            const focusIndicator = document.getElementById('focusIndicator');
            if (focusIndicator && !document.activeElement.matches('[role="slider"]')) {
                focusIndicator.classList.remove('visible');
            }
        }, 3000);
    });

})();
