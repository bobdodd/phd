/**
 * Inaccessible Accordion Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues:
 * - Using div elements instead of buttons (in HTML)
 * - Click-only handlers, no keyboard support
 * - No aria-expanded state updates
 * - No aria-controls associations (in HTML)
 * - Using style.display instead of hidden attribute
 * - Elements not focusable (divs don't have tabindex)
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const accordion = document.getElementById('bad-accordion');
    if (!accordion) return;

    const header1 = document.getElementById('bad-header-1');
    const header2 = document.getElementById('bad-header-2');
    const header3 = document.getElementById('bad-header-3');

    const panel1 = document.getElementById('bad-panel-1');
    const panel2 = document.getElementById('bad-panel-2');
    const panel3 = document.getElementById('bad-panel-3');

    if (!header1 || !panel1) return;

    // ISSUE: Only click handlers - no keyboard support
    header1.addEventListener('click', () => togglePanel(panel1));
    header2.addEventListener('click', () => togglePanel(panel2));
    header3.addEventListener('click', () => togglePanel(panel3));

    // Missing: keydown event listeners for Enter/Space

    function togglePanel(panel) {
      // ISSUE: Using style.display instead of hidden attribute
      if (panel.style.display === 'none') {
        panel.style.display = 'block';
      } else {
        panel.style.display = 'none';
      }

      // ISSUE: No aria-expanded state update
      // Missing: header.setAttribute('aria-expanded', isExpanded);
    }

    // Missing:
    // - aria-expanded attribute and updates
    // - aria-controls associations
    // - Keyboard event handlers (Enter/Space)
    // - Button elements (using divs instead)
    // - tabindex to make divs focusable
    // - role="region" on panels
    // - aria-labelledby on panels
  }
})();
