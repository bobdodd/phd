/**
 * Inaccessible Tooltip Implementation - Anti-Pattern
 *
 * ACCESSIBILITY ISSUES (Paradise detects 4 problems):
 * 1. Missing role="tooltip" - Tooltip elements lack proper ARIA role
 * 2. No aria-describedby - Triggers don't reference tooltip content
 * 3. Missing keyboard support - No focus event handlers
 * 4. No Escape key handler - Cannot dismiss tooltip with keyboard
 *
 * Additional Problems:
 * - Only works on mouse hover
 * - Screen readers cannot access tooltip content
 * - Keyboard users cannot trigger tooltips
 * - No semantic meaning for assistive technologies
 */

(function() {
    'use strict';

    /**
     * BAD: Creates tooltip without ARIA attributes
     * Missing: role="tooltip", no ID for aria-describedby
     */
    function createBadTooltip(text) {
        const tooltip = document.createElement('div');
        // BAD: Using generic class, no role attribute
        tooltip.className = 'bad-tooltip';
        tooltip.textContent = text;
        // BAD: No role="tooltip"
        // BAD: No unique ID for aria-describedby connection
        return tooltip;
    }

    /**
     * BAD: Only shows tooltip, no accessibility connection
     */
    function showBadTooltip(trigger) {
        const tooltipText = trigger.getAttribute('data-bad-tooltip');
        if (!tooltipText) return;

        const tooltip = createBadTooltip(tooltipText);

        // Position tooltip
        const rect = trigger.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + (rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 30) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.display = 'block';

        document.body.appendChild(tooltip);

        // BAD: No aria-describedby connection
        // BAD: Screen readers won't know about this tooltip
    }

    /**
     * BAD: Simple hide with no cleanup
     */
    function hideBadTooltip() {
        const tooltips = document.querySelectorAll('.bad-tooltip');
        tooltips.forEach(tooltip => {
            // BAD: No transition, just remove
            tooltip.parentNode.removeChild(tooltip);
        });
        // BAD: No aria-describedby cleanup
    }

    /**
     * BAD: Only mouse enter, no focus support
     */
    function handleBadMouseEnter(event) {
        showBadTooltip(event.currentTarget);
    }

    /**
     * BAD: Only mouse leave, no blur support
     */
    function handleBadMouseLeave(event) {
        hideBadTooltip();
    }

    /**
     * BAD: No keyboard event handlers
     * Missing: focus, blur, keydown for Escape
     */

    /**
     * Initialize bad tooltips
     */
    function initBadTooltips() {
        const triggers = document.querySelectorAll('.inaccessible-tooltip');

        triggers.forEach(trigger => {
            // BAD: Only mouseenter and mouseleave
            trigger.addEventListener('mouseenter', handleBadMouseEnter);
            trigger.addEventListener('mouseleave', handleBadMouseLeave);

            // BAD: Missing focus event listener
            // BAD: Missing blur event listener
            // BAD: Missing keydown event listener for Escape
            // BAD: Not ensuring element is keyboard focusable
        });

        console.log(`Inaccessible tooltips initialized: ${triggers.length} triggers found (keyboard users excluded)`);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBadTooltips);
    } else {
        initBadTooltips();
    }
})();
