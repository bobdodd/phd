/**
 * INCOMPLETE Toolbar Implementation - FOR DEMONSTRATION ONLY
 * Shows what happens when toolbar pattern is partially implemented
 *
 * ❌ Missing 7 Critical Features:
 * 1. No role="toolbar"
 * 2. No aria-label on toolbar
 * 3. No aria-pressed state management
 * 4. No roving tabindex (all buttons have tabindex="0")
 * 5. No Arrow Left/Right navigation
 * 6. No Home/End key support
 * 7. No proper focus management
 */

(function() {
  'use strict';

  const toolbar = document.querySelector('#bad-toolbar');
  const output = document.querySelector('#bad-output');

  if (!toolbar || !output) return;

  const buttons = Array.from(toolbar.querySelectorAll('button'));

  // Track current formatting state (only visual, not exposed to AT)
  const state = {
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left'
  };

  /**
   * INCOMPLETE: Toggle button active state
   * ❌ Uses CSS class instead of aria-pressed
   * ❌ No state exposed to assistive technology
   */
  function toggleButton(button, formatType) {
    const buttonId = button.id.replace('bad-', '');

    // Handle alignment buttons
    if (formatType === 'alignment') {
      // Remove active class from all alignment buttons
      buttons.forEach(btn => {
        if (btn.id.includes('align')) {
          btn.classList.remove('active');
        }
      });
      // Add active class to selected button
      button.classList.add('active');
      state.alignment = buttonId.replace('align-', '');

      console.warn('⚠️ Alignment changed (no aria-pressed):', {
        button: button.id,
        alignment: state.alignment,
        issue: 'State not exposed to screen readers'
      });
    } else {
      // Handle toggle buttons (bold, italic, underline)
      const isActive = button.classList.contains('active');
      if (isActive) {
        button.classList.remove('active');
        state[formatType] = false;
      } else {
        button.classList.add('active');
        state[formatType] = true;
      }

      console.warn('⚠️ Format toggled (no aria-pressed):', {
        button: button.id,
        format: formatType,
        active: state[formatType],
        issue: 'State not exposed to screen readers'
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
  }

  /**
   * INCOMPLETE: Click handlers only
   * ❌ No arrow key navigation
   * ❌ No Home/End support
   * ❌ No Enter/Space handlers (relies on default button behavior)
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

      console.warn('⚠️ Button clicked (mouse-only interaction):', {
        button: buttonId,
        issue: 'No arrow navigation, all buttons in tab order'
      });
    });
  });

  // ❌ MISSING: Arrow Left/Right navigation
  // ❌ MISSING: Home/End key support
  // ❌ MISSING: Roving tabindex management
  // ❌ MISSING: Focus management
  // ❌ MISSING: Keyboard navigation handler

  /**
   * Initialize: Set initial state
   */
  function initialize() {
    // Set initial alignment state
    const alignLeftButton = document.querySelector('#bad-align-left');
    if (alignLeftButton) {
      alignLeftButton.classList.add('active');
    }
    state.alignment = 'left';
    updateOutput();

    console.warn('⚠️ Inaccessible toolbar loaded - FOR DEMO ONLY');
    console.warn('Missing 7 critical features:', {
      toolbar: toolbar.className,
      buttonCount: buttons.length,
      issues: [
        '1. No role="toolbar"',
        '2. No aria-label on toolbar',
        '3. No aria-pressed state management',
        '4. No roving tabindex (all buttons have tabindex="0")',
        '5. No Arrow Left/Right navigation',
        '6. No Home/End key support',
        '7. No proper focus management'
      ],
      consequences: [
        'Screen readers announce as generic div with buttons',
        'No toolbar context communicated',
        'Toggle states not announced to AT users',
        'Tab key stops at every button (poor UX)',
        'Cannot use arrows to navigate between buttons',
        'Cannot quickly jump to first/last button',
        'Excessive tab stops reduce efficiency'
      ]
    });
  }

  initialize();
})();
