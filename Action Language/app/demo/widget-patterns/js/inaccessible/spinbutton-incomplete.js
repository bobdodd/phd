/**
 * Inaccessible Spinbutton Implementation
 * Missing critical accessibility features
 *
 * Issues:
 * 1. No role="spinbutton" attribute
 * 2. Missing aria-valuemin, aria-valuemax, aria-valuenow
 * 3. No accessible labels (aria-label or aria-labelledby)
 * 4. No keyboard navigation support
 * 5. Missing aria-valuetext for formatted values
 */

class InaccessibleSpinbutton {
    constructor(inputId, options = {}) {
        this.input = document.getElementById(inputId);
        if (!this.input) return;

        this.wrapper = this.input.closest('.spinbutton-wrapper');
        this.buttons = this.wrapper.querySelectorAll('.spinbutton-button');

        this.min = options.min || 0;
        this.max = options.max || 100;
        this.step = options.step || 1;
        this.suffix = options.suffix || '';
        this.prefix = options.prefix || '';
        this.formatter = options.formatter || ((val) => val);
        this.onChange = options.onChange || null;

        this.currentValue = parseInt(this.input.value) || this.min;

        this.init();
    }

    init() {
        // Only mouse click handlers - no keyboard support
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

        // No keyboard event listeners
        // No proper input validation

        this.updateValue(this.currentValue);
    }

    increase() {
        let newValue = this.currentValue + this.step;
        newValue = Math.min(newValue, this.max);
        this.setValue(newValue);
    }

    decrease() {
        let newValue = this.currentValue - this.step;
        newValue = Math.max(newValue, this.min);
        this.setValue(newValue);
    }

    setValue(value) {
        value = Math.max(this.min, Math.min(this.max, value));
        this.currentValue = value;
        this.updateValue(value);
    }

    updateValue(value) {
        // No ARIA attribute updates
        // No aria-valuenow, no aria-valuetext

        this.input.value = this.prefix + this.formatter(value) + this.suffix;

        if (this.onChange) {
            this.onChange(value);
        }
    }
}

// Initialize inaccessible spinbuttons
document.addEventListener('DOMContentLoaded', () => {
    // Basic Quantity Selector
    new InaccessibleSpinbutton('quantity-bad', {
        min: 0,
        max: 100,
        step: 1,
        onChange: (value) => {
            document.getElementById('quantity-value-bad').textContent = value;
        }
    });

    // Font Size Picker
    new InaccessibleSpinbutton('fontsize-bad', {
        min: 8,
        max: 72,
        step: 2,
        suffix: 'px',
        onChange: (value) => {
            const previewText = document.getElementById('preview-text-bad');
            if (previewText) {
                previewText.style.fontSize = value + 'px';
            }
        }
    });

    // Temperature Control
    new InaccessibleSpinbutton('temperature-bad', {
        min: -50,
        max: 50,
        step: 1,
        onChange: (value) => {
            const display = document.getElementById('temp-display-bad');
            if (display) {
                display.textContent = value + '°C';
            }
        }
    });

    // Time Picker (Hours)
    new InaccessibleSpinbutton('hour-bad', {
        min: 0,
        max: 23,
        step: 1,
        formatter: (val) => val.toString().padStart(2, '0')
    });

    // Time Picker (Minutes)
    new InaccessibleSpinbutton('minute-bad', {
        min: 0,
        max: 59,
        step: 1,
        formatter: (val) => val.toString().padStart(2, '0')
    });

    // Percentage Selector
    new InaccessibleSpinbutton('percentage-bad', {
        min: 0,
        max: 100,
        step: 5,
        suffix: '%',
        onChange: (value) => {
            const fill = document.getElementById('percent-fill-bad');
            const text = document.getElementById('percent-text-bad');

            if (fill) {
                fill.style.width = value + '%';
            }
            if (text) {
                text.textContent = value + '%';
            }
        }
    });
});
