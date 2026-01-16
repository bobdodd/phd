/**
 * Accessible Disclosure Widget Implementation
 *
 * Follows ARIA Authoring Practices Guide (APG) for disclosure pattern.
 * A disclosure widget allows users to show/hide content with proper accessibility.
 *
 * Key Requirements:
 * - Uses <button> element as disclosure control
 * - aria-expanded indicates current state (true/false)
 * - aria-controls links button to content region (optional but recommended)
 * - State updates dynamically when toggled
 * - Keyboard accessible (Space/Enter to toggle)
 * - Content shown/hidden using hidden attribute
 *
 * References:
 * - https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */

class AccessibleDisclosure {
    constructor(button) {
        this.button = button;
        this.contentId = button.getAttribute('aria-controls');

        if (!this.contentId) {
            console.warn('Disclosure button missing aria-controls attribute:', button);
            return;
        }

        this.content = document.getElementById(this.contentId);

        if (!this.content) {
            console.warn('Disclosure content not found for ID:', this.contentId);
            return;
        }

        // Initialize state
        this.initializeState();

        // Bind events
        this.button.addEventListener('click', this.toggle.bind(this));
    }

    /**
     * Initialize the disclosure state based on aria-expanded attribute
     */
    initializeState() {
        const expanded = this.button.getAttribute('aria-expanded') === 'true';

        // Ensure content visibility matches aria-expanded state
        if (expanded) {
            this.content.hidden = false;
        } else {
            this.content.hidden = true;
        }
    }

    /**
     * Toggle the disclosure state
     */
    toggle() {
        const expanded = this.button.getAttribute('aria-expanded') === 'true';
        const newState = !expanded;

        // Update ARIA attribute - this is critical for screen readers
        this.button.setAttribute('aria-expanded', newState);

        // Update content visibility
        this.content.hidden = !newState;

        // Optional: Dispatch custom event for analytics or other listeners
        this.button.dispatchEvent(new CustomEvent('disclosure-toggled', {
            detail: { expanded: newState },
            bubbles: true
        }));
    }

    /**
     * Programmatically expand the disclosure
     */
    expand() {
        if (this.button.getAttribute('aria-expanded') === 'false') {
            this.toggle();
        }
    }

    /**
     * Programmatically collapse the disclosure
     */
    collapse() {
        if (this.button.getAttribute('aria-expanded') === 'true') {
            this.toggle();
        }
    }

    /**
     * Check if disclosure is currently expanded
     */
    isExpanded() {
        return this.button.getAttribute('aria-expanded') === 'true';
    }
}

/**
 * Initialize all accessible disclosure widgets on the page
 */
function initializeAccessibleDisclosures() {
    // Find all accessible disclosure buttons
    const disclosureButtons = document.querySelectorAll(
        'button.disclosure-accessible[aria-expanded], ' +
        'button.faq-question[aria-expanded], ' +
        'button.details-toggle[aria-expanded]'
    );

    const disclosures = [];

    disclosureButtons.forEach(button => {
        // Verify the button has required attributes
        const hasExpanded = button.hasAttribute('aria-expanded');
        const hasControls = button.hasAttribute('aria-controls');

        if (hasExpanded && hasControls) {
            const disclosure = new AccessibleDisclosure(button);
            disclosures.push(disclosure);
        } else {
            console.warn('Disclosure button missing required attributes:', button);
            if (!hasExpanded) console.warn('  - Missing aria-expanded');
            if (!hasControls) console.warn('  - Missing aria-controls');
        }
    });

    console.log(`Initialized ${disclosures.length} accessible disclosure widgets`);

    return disclosures;
}

/**
 * Utility function to create a disclosure programmatically
 *
 * @param {Object} options - Configuration options
 * @param {string} options.buttonText - Text content for the button
 * @param {string} options.contentHTML - HTML content to show/hide
 * @param {HTMLElement} options.container - Container element to append to
 * @param {boolean} options.initiallyExpanded - Whether to start expanded (default: false)
 * @param {string} options.buttonClass - CSS class for button (default: 'disclosure-accessible')
 * @param {string} options.contentClass - CSS class for content (default: 'disclosure-content')
 */
function createDisclosure(options) {
    const {
        buttonText,
        contentHTML,
        container,
        initiallyExpanded = false,
        buttonClass = 'disclosure-accessible',
        contentClass = 'disclosure-content'
    } = options;

    if (!buttonText || !contentHTML || !container) {
        console.error('createDisclosure requires buttonText, contentHTML, and container');
        return null;
    }

    // Generate unique IDs
    const uniqueId = `disclosure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const contentId = `${uniqueId}-content`;

    // Create button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = buttonClass;
    button.textContent = buttonText;
    button.setAttribute('aria-expanded', initiallyExpanded);
    button.setAttribute('aria-controls', contentId);
    button.id = uniqueId;

    // Create content container
    const content = document.createElement('div');
    content.id = contentId;
    content.className = contentClass;
    content.innerHTML = contentHTML;
    content.hidden = !initiallyExpanded;

    // Append to container
    container.appendChild(button);
    container.appendChild(content);

    // Initialize disclosure behavior
    const disclosure = new AccessibleDisclosure(button);

    return disclosure;
}

// Initialize all disclosures when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibleDisclosures);
} else {
    // DOM is already ready
    initializeAccessibleDisclosures();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AccessibleDisclosure,
        initializeAccessibleDisclosures,
        createDisclosure
    };
}
