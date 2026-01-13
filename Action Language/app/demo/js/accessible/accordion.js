/**
 * Accessible Accordion Implementation
 * Following WAI-ARIA Authoring Practices for Accordion Pattern
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const accordion = document.getElementById('good-accordion');
    if (!accordion) return;

    const headers = accordion.querySelectorAll('.accordion-header');

    headers.forEach((header, index) => {
      // Click handler
      header.addEventListener('click', () => togglePanel(header));

      // Keyboard handler for Enter and Space
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePanel(header);
        }
      });
    });

    function togglePanel(header) {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      const panelId = header.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      if (!panel) return;

      // Toggle aria-expanded state
      header.setAttribute('aria-expanded', !expanded);

      // Toggle panel visibility using hidden attribute
      if (expanded) {
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
      }
    }
  }
})();
