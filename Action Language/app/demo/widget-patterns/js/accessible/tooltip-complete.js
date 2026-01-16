/**
 * Accessible Tooltip Implementation
 *
 * Follows ARIA Authoring Practices Guide for Tooltip Pattern:
 * - Uses role="tooltip" on tooltip element
 * - Connects trigger to tooltip via aria-describedby
 * - Shows on hover and focus
 * - Hides on blur and Escape key
 * - Keyboard accessible
 * - Proper ARIA semantics
 */

(function() {
    'use strict';

    // Tooltip counter for unique IDs
    let tooltipIdCounter = 0;

    // Track currently visible tooltip
    let currentTooltip = null;
    let currentTrigger = null;

    /**
     * Creates a tooltip element with proper ARIA attributes
     * @param {string} text - The tooltip text content
     * @param {string} position - Position of tooltip (top, bottom, left, right)
     * @param {string} id - Unique ID for the tooltip
     * @returns {HTMLElement} The created tooltip element
     */
    function createTooltip(text, position, id) {
        const tooltip = document.createElement('div');
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('id', id);
        tooltip.className = `tooltip ${position}`;
        tooltip.textContent = text;
        return tooltip;
    }

    /**
     * Positions tooltip relative to its trigger element
     * @param {HTMLElement} tooltip - The tooltip element
     * @param {HTMLElement} trigger - The trigger element
     * @param {string} position - Desired position (top, bottom, left, right)
     */
    function positionTooltip(tooltip, trigger, position) {
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Reset any inline positioning
        tooltip.style.position = 'absolute';
        tooltip.style.left = '';
        tooltip.style.top = '';
        tooltip.style.right = '';
        tooltip.style.bottom = '';

        // Calculate position based on desired placement
        switch(position) {
            case 'top':
                tooltip.style.left = '50%';
                tooltip.style.bottom = '100%';
                tooltip.style.transform = 'translateX(-50%) translateY(-8px)';
                tooltip.style.marginBottom = '8px';
                break;

            case 'bottom':
                tooltip.style.left = '50%';
                tooltip.style.top = '100%';
                tooltip.style.transform = 'translateX(-50%) translateY(8px)';
                tooltip.style.marginTop = '8px';
                break;

            case 'left':
                tooltip.style.right = '100%';
                tooltip.style.top = '50%';
                tooltip.style.transform = 'translateY(-50%) translateX(-8px)';
                tooltip.style.marginRight = '8px';
                break;

            case 'right':
                tooltip.style.left = '100%';
                tooltip.style.top = '50%';
                tooltip.style.transform = 'translateY(-50%) translateX(8px)';
                tooltip.style.marginLeft = '8px';
                break;

            default:
                // Default to top
                tooltip.style.left = '50%';
                tooltip.style.bottom = '100%';
                tooltip.style.transform = 'translateX(-50%) translateY(-8px)';
        }
    }

    /**
     * Shows the tooltip for a given trigger element
     * @param {HTMLElement} trigger - The element that triggered the tooltip
     */
    function showTooltip(trigger) {
        // Hide any existing tooltip first
        hideTooltip();

        // Get tooltip configuration from data attributes
        const tooltipText = trigger.getAttribute('data-tooltip-text');
        const position = trigger.getAttribute('data-tooltip-position') || 'top';

        if (!tooltipText) return;

        // Generate unique ID for this tooltip
        const tooltipId = `tooltip-${tooltipIdCounter++}`;

        // Create and configure tooltip
        const tooltip = createTooltip(tooltipText, position, tooltipId);

        // Make trigger's position relative for absolute positioning of tooltip
        const triggerPosition = window.getComputedStyle(trigger).position;
        if (triggerPosition === 'static') {
            trigger.style.position = 'relative';
        }

        // Add tooltip to trigger's parent (or trigger itself if appropriate)
        trigger.appendChild(tooltip);

        // Position the tooltip
        positionTooltip(tooltip, trigger, position);

        // Connect tooltip to trigger with aria-describedby
        trigger.setAttribute('aria-describedby', tooltipId);

        // Show tooltip with animation
        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });

        // Store references to current tooltip
        currentTooltip = tooltip;
        currentTrigger = trigger;
    }

    /**
     * Hides the currently visible tooltip
     */
    function hideTooltip() {
        if (!currentTooltip || !currentTrigger) return;

        // Remove show class to trigger fade out animation
        currentTooltip.classList.remove('show');

        // Remove tooltip from DOM after animation
        setTimeout(() => {
            if (currentTooltip && currentTooltip.parentNode) {
                currentTooltip.parentNode.removeChild(currentTooltip);
            }

            // Remove aria-describedby from trigger
            if (currentTrigger) {
                currentTrigger.removeAttribute('aria-describedby');
            }

            // Clear references
            currentTooltip = null;
            currentTrigger = null;
        }, 200); // Match CSS transition duration
    }

    /**
     * Handles mouse enter event
     * @param {Event} event - The mouseenter event
     */
    function handleMouseEnter(event) {
        showTooltip(event.currentTarget);
    }

    /**
     * Handles mouse leave event
     * @param {Event} event - The mouseleave event
     */
    function handleMouseLeave(event) {
        hideTooltip();
    }

    /**
     * Handles focus event
     * @param {Event} event - The focus event
     */
    function handleFocus(event) {
        showTooltip(event.currentTarget);
    }

    /**
     * Handles blur event
     * @param {Event} event - The blur event
     */
    function handleBlur(event) {
        hideTooltip();
    }

    /**
     * Handles keydown event for Escape key
     * @param {Event} event - The keydown event
     */
    function handleKeyDown(event) {
        // Hide tooltip on Escape key
        if (event.key === 'Escape' || event.keyCode === 27) {
            hideTooltip();

            // Return focus to trigger if it exists
            if (currentTrigger) {
                currentTrigger.focus();
            }
        }
    }

    /**
     * Initializes tooltip functionality on a trigger element
     * @param {HTMLElement} trigger - The tooltip trigger element
     */
    function initializeTooltip(trigger) {
        // Ensure trigger is keyboard focusable
        if (!trigger.hasAttribute('tabindex') && trigger.tagName !== 'BUTTON' && trigger.tagName !== 'A') {
            trigger.setAttribute('tabindex', '0');
        }

        // Add event listeners for mouse interactions
        trigger.addEventListener('mouseenter', handleMouseEnter);
        trigger.addEventListener('mouseleave', handleMouseLeave);

        // Add event listeners for keyboard interactions
        trigger.addEventListener('focus', handleFocus);
        trigger.addEventListener('blur', handleBlur);
        trigger.addEventListener('keydown', handleKeyDown);
    }

    /**
     * Initializes all accessible tooltips on the page
     */
    function init() {
        // Find all elements with accessible-tooltip class
        const triggers = document.querySelectorAll('.accessible-tooltip');

        triggers.forEach(trigger => {
            initializeTooltip(trigger);
        });

        // Add global Escape key handler as backup
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                if (currentTooltip) {
                    hideTooltip();
                }
            }
        });

        console.log(`Accessible tooltips initialized: ${triggers.length} triggers found`);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for potential external use
    window.AccessibleTooltip = {
        init: init,
        show: showTooltip,
        hide: hideTooltip
    };
})();
