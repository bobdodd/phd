/**
 * Complete Accessible Toolbar Implementation
 * Follows WAI-ARIA Authoring Practices Guide for Toolbar
 *
 * Key Features:
 * - role="toolbar" with aria-label
 * - Roving tabindex (only one button in tab order)
 * - Arrow Left/Right navigation
 * - Home/End key support
 * - Enter/Space activation
 * - aria-pressed state management
 * - Focus management
 * - Optional keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
 */

(function() {
  'use strict';

  const toolbar = document.querySelector('#good-toolbar');
  const output = document.querySelector('#good-output');

  if (!toolbar || !output) return;

  const buttons = Array.from(toolbar.querySelectorAll('button'));

  // Track current formatting state
  const state = {
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left'
  };

  /**
   * Move focus to target button and update roving tabindex
   * @param {HTMLElement} targetButton - Button to receive focus
   */
  function moveFocus(targetButton) {
    // Remove all buttons from tab order
    buttons.forEach(btn => {
      btn.tabIndex = -1;
    });

    // Add target button to tab order
    targetButton.tabIndex = 0;

    // Move focus to target button
    targetButton.focus();

    console.log('✅ Focus moved to:', {
      button: targetButton.id,
      label: targetButton.textContent.trim(),
      tabIndex: targetButton.tabIndex
    });
  }

  /**
   * Toggle button pressed state
   * @param {HTMLElement} button - Button to toggle
   * @param {string} formatType - Type of formatting (bold, italic, underline, alignment)
   */
  function toggleButton(button, formatType) {
    const buttonId = button.id.replace('good-', '');

    // Handle alignment buttons (radio group behavior)
    if (formatType === 'alignment') {
      // Unpress all alignment buttons
      buttons.forEach(btn => {
        if (btn.id.includes('align')) {
          btn.setAttribute('aria-pressed', 'false');
        }
      });
      // Press the selected alignment button
      button.setAttribute('aria-pressed', 'true');
      state.alignment = buttonId.replace('align-', '');

      console.log('✅ Alignment changed:', {
        button: button.id,
        alignment: state.alignment,
        ariaPressed: button.getAttribute('aria-pressed')
      });
    } else {
      // Handle toggle buttons (bold, italic, underline)
      const isPressed = button.getAttribute('aria-pressed') === 'true';
      const newState = !isPressed;
      button.setAttribute('aria-pressed', String(newState));
      state[formatType] = newState;

      console.log('✅ Format toggled:', {
        button: button.id,
        format: formatType,
        pressed: newState,
        ariaPressed: button.getAttribute('aria-pressed')
      });
    }

    // Update the output preview
    updateOutput();
  }

  /**
   * Update the output preview with current formatting
   */
  function updateOutput() {
    let styles = [];

    if (state.bold) styles.push('font-weight: bold');
    if (state.italic) styles.push('font-style: italic');
    if (state.underline) styles.push('text-decoration: underline');

    // Add alignment
    if (state.alignment === 'left') styles.push('text-align: left');
    else if (state.alignment === 'center') styles.push('text-align: center');
    else if (state.alignment === 'right') styles.push('text-align: right');

    output.style.cssText = styles.join('; ');

    console.log('✅ Output updated:', {
      bold: state.bold,
      italic: state.italic,
      underline: state.underline,
      alignment: state.alignment
    });
  }

  /**
   * Keyboard navigation handler for toolbar
   */
  toolbar.addEventListener('keydown', (event) => {
    // Only process if a button is focused
    if (!buttons.includes(document.activeElement)) return;

    const currentButton = document.activeElement;
    const currentIndex = buttons.indexOf(currentButton);
    let handled = false;

    switch (event.key) {
      case 'ArrowRight':
        // Move to next button (wrap to first)
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % buttons.length;
        moveFocus(buttons[nextIndex]);
        handled = true;
        console.log('✅ Arrow Right:', {
          from: currentIndex,
          to: nextIndex,
          button: buttons[nextIndex].id
        });
        break;

      case 'ArrowLeft':
        // Move to previous button (wrap to last)
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
        moveFocus(buttons[prevIndex]);
        handled = true;
        console.log('✅ Arrow Left:', {
          from: currentIndex,
          to: prevIndex,
          button: buttons[prevIndex].id
        });
        break;

      case 'Home':
        // Jump to first button
        event.preventDefault();
        moveFocus(buttons[0]);
        handled = true;
        console.log('✅ Home key: jumped to first button');
        break;

      case 'End':
        // Jump to last button
        event.preventDefault();
        moveFocus(buttons[buttons.length - 1]);
        handled = true;
        console.log('✅ End key: jumped to last button');
        break;

      case 'Enter':
      case ' ':
        // Activate the focused button
        event.preventDefault();
        currentButton.click();
        handled = true;
        console.log('✅ Button activated via keyboard:', {
          key: event.key,
          button: currentButton.id
        });
        break;
    }

    if (handled) {
      console.log('✅ Keyboard event handled:', {
        key: event.key,
        currentButton: currentButton.id,
        currentIndex
      });
    }
  });

  /**
   * Click handlers for each button
   */
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      const buttonId = button.id;

      // Determine format type
      if (buttonId.includes('bold')) {
        toggleButton(button, 'bold');
      } else if (buttonId.includes('italic')) {
        toggleButton(button, 'italic');
      } else if (buttonId.includes('underline')) {
        toggleButton(button, 'underline');
      } else if (buttonId.includes('align')) {
        toggleButton(button, 'alignment');
      }

      console.log('✅ Button clicked:', {
        button: buttonId,
        pressed: button.getAttribute('aria-pressed')
      });
    });
  });

  /**
   * Optional: Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
   */
  document.addEventListener('keydown', (event) => {
    // Only handle if Ctrl/Cmd is pressed
    if (!event.ctrlKey && !event.metaKey) return;

    let targetButton = null;

    switch (event.key.toLowerCase()) {
      case 'b':
        // Ctrl+B for Bold
        event.preventDefault();
        targetButton = document.querySelector('#good-bold');
        console.log('✅ Keyboard shortcut: Ctrl+B (Bold)');
        break;

      case 'i':
        // Ctrl+I for Italic
        event.preventDefault();
        targetButton = document.querySelector('#good-italic');
        console.log('✅ Keyboard shortcut: Ctrl+I (Italic)');
        break;

      case 'u':
        // Ctrl+U for Underline
        event.preventDefault();
        targetButton = document.querySelector('#good-underline');
        console.log('✅ Keyboard shortcut: Ctrl+U (Underline)');
        break;
    }

    if (targetButton) {
      targetButton.click();
      console.log('✅ Shortcut activated:', {
        shortcut: `Ctrl+${event.key.toUpperCase()}`,
        button: targetButton.id
      });
    }
  });

  /**
   * Initialize: Set initial state
   */
  function initialize() {
    // Ensure first button is in tab order
    if (buttons.length > 0) {
      buttons[0].tabIndex = 0;
    }

    // Set initial alignment state
    state.alignment = 'left';
    updateOutput();

    console.log('✅ Accessible toolbar initialized:', {
      toolbar: toolbar.id,
      buttonCount: buttons.length,
      features: [
        'role="toolbar"',
        'aria-label="Text Formatting"',
        'Roving tabindex',
        'Arrow Left/Right navigation',
        'Home/End key support',
        'Enter/Space activation',
        'aria-pressed state management',
        'Keyboard shortcuts (Ctrl+B/I/U)',
        'Focus management'
      ],
      initialState: state
    });
  }

  initialize();
})();
