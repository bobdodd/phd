/**
 * Complete Accessible Accordion Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Accordion
 *
 * Key Features:
 * - aria-expanded state management
 * - aria-controls linking buttons to panels
 * - aria-labelledby on panels
 * - Optional arrow key navigation
 * - Proper state updates
 */

(function() {
  'use strict';

  const accordion = document.getElementById('good-accordion');
  if (!accordion) return;

  const buttons = Array.from(accordion.querySelectorAll('.accordion-button'));

  /**
   * Toggle an accordion panel
   * @param {HTMLElement} button - The accordion button
   */
  function togglePanel(button) {
    // Get current state
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Get associated panel
    const panelId = button.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);

    if (!panel) {
      console.error('Panel not found:', panelId);
      return;
    }

    // Toggle state
    const newState = !isExpanded;
    button.setAttribute('aria-expanded', String(newState));

    // Show/hide panel
    if (newState) {
      panel.removeAttribute('hidden');
      console.log('✅ Panel expanded:', panelId);
    } else {
      panel.setAttribute('hidden', '');
      console.log('✅ Panel collapsed:', panelId);
    }
  }

  /**
   * Navigate to next/previous accordion button
   * @param {HTMLElement} currentButton - Current focused button
   * @param {number} direction - 1 for next, -1 for previous
   */
  function navigateToButton(currentButton, direction) {
    const currentIndex = buttons.indexOf(currentButton);
    let nextIndex;

    if (direction === 1) {
      // Move to next button (wrap to first)
      nextIndex = (currentIndex + 1) % buttons.length;
    } else {
      // Move to previous button (wrap to last)
      nextIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
    }

    buttons[nextIndex].focus();
    console.log('✅ Navigated to button:', nextIndex + 1);
  }

  // Add click handlers to all buttons
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      togglePanel(button);
    });

    console.log(`✅ Accordion button ${index + 1} initialized:`, {
      id: button.id,
      ariaExpanded: button.getAttribute('aria-expanded'),
      ariaControls: button.getAttribute('aria-controls')
    });
  });

  // Add keyboard navigation (optional enhancement)
  accordion.addEventListener('keydown', (event) => {
    const target = event.target;

    // Only handle if target is an accordion button
    if (!buttons.includes(target)) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        navigateToButton(target, 1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        navigateToButton(target, -1);
        break;

      case 'Home':
        event.preventDefault();
        buttons[0].focus();
        console.log('✅ Jumped to first button');
        break;

      case 'End':
        event.preventDefault();
        buttons[buttons.length - 1].focus();
        console.log('✅ Jumped to last button');
        break;
    }
  });

  console.log('✅ Accessible accordion initialized:', {
    buttons: buttons.length,
    features: [
      'aria-expanded state management',
      'aria-controls linking',
      'aria-labelledby on panels',
      'Arrow key navigation',
      'Home/End key support',
      'Click handlers'
    ]
  });
})();
