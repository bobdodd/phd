/**
 * Inaccessible Disclosure Widget Implementation
 *
 * This implementation demonstrates common accessibility mistakes:
 *
 * ISSUE 1: Missing aria-expanded attribute
 * - Buttons don't have aria-expanded to indicate state
 * - Screen readers can't tell if content is shown or hidden
 *
 * ISSUE 2: Missing aria-controls attribute
 * - No programmatic relationship between button and content
 * - Assistive technology can't navigate to controlled content
 *
 * ISSUE 3: No state management
 * - Even if aria-expanded existed, it wouldn't be updated
 * - State remains static, providing incorrect information
 *
 * Paradise should detect all 3 issues in this implementation.
 */

class InaccessibleDisclosure {
    constructor(button) {
        this.button = button;

        // BAD: Manually finding content by convention instead of aria-controls
        const buttonId = button.id;
        const contentId = buttonId.replace('bad-disclosure-', 'bad-content-');
        this.content = document.getElementById(contentId);

        if (!this.content) {
            console.warn('Content not found for button:', button);
            return;
        }

        // Bind click event
        this.button.addEventListener('click', this.toggle.bind(this));
    }

    /**
     * Toggle content visibility
     *
     * BAD: Only toggles visibility, doesn't update ARIA attributes
     */
    toggle() {
        const isHidden = this.content.hasAttribute('hidden');

        if (isHidden) {
            // Show content
            this.content.removeAttribute('hidden');
            this.button.classList.add('expanded');
        } else {
            // Hide content
            this.content.setAttribute('hidden', '');
            this.button.classList.remove('expanded');
        }

        // BAD: No aria-expanded update
        // BAD: Screen readers don't know state changed
        // BAD: Only visual indicator (CSS class) is updated
    }
}

/**
 * Initialize inaccessible disclosure widgets
 */
function initializeInaccessibleDisclosures() {
    // Find all inaccessible disclosure buttons
    const buttons = document.querySelectorAll('button.disclosure-inaccessible');

    const disclosures = [];

    buttons.forEach(button => {
        // BAD: No validation of required ARIA attributes
        // BAD: No warning about missing accessibility features
        const disclosure = new InaccessibleDisclosure(button);
        disclosures.push(disclosure);
    });

    console.log(`Initialized ${disclosures.length} inaccessible disclosure widgets (missing ARIA attributes)`);

    return disclosures;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInaccessibleDisclosures);
} else {
    initializeInaccessibleDisclosures();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        InaccessibleDisclosure,
        initializeInaccessibleDisclosures
    };
}
