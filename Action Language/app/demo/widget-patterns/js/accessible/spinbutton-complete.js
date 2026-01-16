/**
 * Accessible Spinbutton Implementation
 * Follows ARIA Authoring Practices Guide (APG) for spinbutton pattern
 *
 * Features:
 * - Full keyboard navigation (Arrow keys, Home, End, Page Up/Down)
 * - Proper ARIA attributes (role, valuemin, valuemax, valuenow, valuetext)
 * - Screen reader announcements
 * - Value validation and bounds checking
 * - Accessible labels and descriptions
 */

class AccessibleSpinbutton {
    constructor(inputId, options = {}) {
        this.input = document.getElementById(inputId);
        if (!this.input) return;

        this.wrapper = this.input.closest('.spinbutton-wrapper');
        this.buttons = this.wrapper.querySelectorAll('.spinbutton-button');

        this.min = parseInt(this.input.getAttribute('aria-valuemin')) || options.min || 0;
        this.max = parseInt(this.input.getAttribute('aria-valuemax')) || options.max || 100;
        this.step = options.step || 1;
        this.largeStep = options.largeStep || this.step * 10;
        this.wrap = options.wrap || false;
        this.suffix = options.suffix || '';
        this.prefix = options.prefix || '';
        this.formatter = options.formatter || ((val) => val);
        this.valueTextFormatter = options.valueTextFormatter || null;
        this.onChange = options.onChange || null;

        this.currentValue = parseInt(this.input.getAttribute('aria-valuenow')) || this.min;

        this.init();
    }

    init() {
        // Set up button click handlers
        const [increaseBtn, decreaseBtn] = this.buttons;

        if (increaseBtn) {
            increaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.increase();
            });
        }

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.decrease();
            });
        }

        // Keyboard navigation
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Handle manual input
        this.input.addEventListener('input', () => this.handleManualInput());
        this.input.addEventListener('blur', () => this.validateAndFormat());

        // Initial update
        this.updateValue(this.currentValue);
    }

    handleKeydown(e) {
        let handled = false;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.increase();
                handled = true;
                break;

            case 'ArrowDown':
                e.preventDefault();
                this.decrease();
                handled = true;
                break;

            case 'Home':
                e.preventDefault();
                this.setValue(this.min);
                handled = true;
                break;

            case 'End':
                e.preventDefault();
                this.setValue(this.max);
                handled = true;
                break;

            case 'PageUp':
                e.preventDefault();
                this.increase(this.largeStep);
                handled = true;
                break;

            case 'PageDown':
                e.preventDefault();
                this.decrease(this.largeStep);
                handled = true;
                break;
        }

        if (handled) {
            this.announceValue();
        }
    }

    increase(amount = this.step) {
        let newValue = this.currentValue + amount;

        if (this.wrap && newValue > this.max) {
            newValue = this.min;
        } else {
            newValue = Math.min(newValue, this.max);
        }

        this.setValue(newValue);
    }

    decrease(amount = this.step) {
        let newValue = this.currentValue - amount;

        if (this.wrap && newValue < this.min) {
            newValue = this.max;
        } else {
            newValue = Math.max(newValue, this.min);
        }

        this.setValue(newValue);
    }

    setValue(value) {
        value = Math.max(this.min, Math.min(this.max, value));
        this.currentValue = value;
        this.updateValue(value);
    }

    updateValue(value) {
        // Update ARIA attributes
        this.input.setAttribute('aria-valuenow', value);

        // Update aria-valuetext if formatter provided
        if (this.valueTextFormatter) {
            this.input.setAttribute('aria-valuetext', this.valueTextFormatter(value));
        }

        // Update display value
        this.input.value = this.prefix + this.formatter(value) + this.suffix;

        // Update button states
        this.updateButtonStates();

        // Call onChange callback if provided
        if (this.onChange) {
            this.onChange(value);
        }
    }

    updateButtonStates() {
        const [increaseBtn, decreaseBtn] = this.buttons;

        if (!this.wrap) {
            if (increaseBtn) {
                increaseBtn.disabled = this.currentValue >= this.max;
            }
            if (decreaseBtn) {
                decreaseBtn.disabled = this.currentValue <= this.min;
            }
        }
    }

    handleManualInput() {
        const rawValue = this.input.value.replace(/[^0-9-]/g, '');
        const numValue = parseInt(rawValue);

        if (!isNaN(numValue)) {
            this.currentValue = numValue;
        }
    }

    validateAndFormat() {
        const rawValue = this.input.value.replace(/[^0-9-]/g, '');
        let numValue = parseInt(rawValue);

        if (isNaN(numValue)) {
            numValue = this.min;
        }

        this.setValue(numValue);
    }

    announceValue() {
        const announcer = document.getElementById('spinbutton-announcer');
        if (announcer) {
            const valueText = this.valueTextFormatter
                ? this.valueTextFormatter(this.currentValue)
                : `${this.currentValue}`;
            announcer.textContent = valueText;
        }
    }
}

// Initialize spinbuttons when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Basic Quantity Selector
    new AccessibleSpinbutton('quantity-good', {
        min: 0,
        max: 100,
        step: 1,
        largeStep: 10,
        onChange: (value) => {
            document.getElementById('quantity-value-good').textContent = value;
        }
    });

    // 2. Font Size Picker
    new AccessibleSpinbutton('fontsize-good', {
        min: 8,
        max: 72,
        step: 2,
        largeStep: 8,
        suffix: 'px',
        formatter: (val) => val,
        valueTextFormatter: (val) => `${val} pixels`,
        onChange: (value) => {
            const previewText = document.getElementById('preview-text-good');
            if (previewText) {
                previewText.style.fontSize = value + 'px';
            }
        }
    });

    // 3. Temperature Control
    let currentScale = 'C';

    const tempSpinbutton = new AccessibleSpinbutton('temperature-good', {
        min: -50,
        max: 50,
        step: 1,
        largeStep: 5,
        valueTextFormatter: (val) => {
            const unit = currentScale === 'C' ? 'Celsius' : 'Fahrenheit';
            return `${val} degrees ${unit}`;
        },
        onChange: (value) => {
            updateTemperatureDisplay(value, currentScale);
        }
    });

    function updateTemperatureDisplay(value, scale) {
        const display = document.getElementById('temp-display-good');
        if (display) {
            const symbol = scale === 'C' ? '°C' : '°F';
            display.textContent = value + symbol;
        }
    }

    // Temperature scale buttons
    const scaleButtons = document.querySelectorAll('.temperature-scale .scale-button');
    scaleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newScale = button.dataset.scale;
            if (newScale === currentScale) return;

            // Convert temperature
            let currentTemp = tempSpinbutton.currentValue;
            let newTemp;

            if (newScale === 'F') {
                // C to F
                newTemp = Math.round((currentTemp * 9/5) + 32);
                tempSpinbutton.min = -58;
                tempSpinbutton.max = 122;
            } else {
                // F to C
                newTemp = Math.round((currentTemp - 32) * 5/9);
                tempSpinbutton.min = -50;
                tempSpinbutton.max = 50;
            }

            currentScale = newScale;

            // Update button states
            scaleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update spinbutton
            tempSpinbutton.input.setAttribute('aria-valuemin', tempSpinbutton.min);
            tempSpinbutton.input.setAttribute('aria-valuemax', tempSpinbutton.max);
            tempSpinbutton.setValue(newTemp);
        });
    });

    // 4. Time Picker (Hours)
    new AccessibleSpinbutton('hour-good', {
        min: 0,
        max: 23,
        step: 1,
        largeStep: 1,
        wrap: true,
        formatter: (val) => val.toString().padStart(2, '0'),
        valueTextFormatter: (val) => `${val} hours`
    });

    // Time Picker (Minutes)
    new AccessibleSpinbutton('minute-good', {
        min: 0,
        max: 59,
        step: 1,
        largeStep: 15,
        wrap: true,
        formatter: (val) => val.toString().padStart(2, '0'),
        valueTextFormatter: (val) => `${val} minutes`
    });

    // 5. Percentage Selector
    new AccessibleSpinbutton('percentage-good', {
        min: 0,
        max: 100,
        step: 5,
        largeStep: 25,
        suffix: '%',
        valueTextFormatter: (val) => `${val} percent`,
        onChange: (value) => {
            const fill = document.getElementById('percent-fill-good');
            const text = document.getElementById('percent-text-good');

            if (fill) {
                fill.style.width = value + '%';
            }
            if (text) {
                text.textContent = value + '%';
            }
        }
    });
});
