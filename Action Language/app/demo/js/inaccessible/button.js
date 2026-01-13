/**
 * Inaccessible Button Implementation
 * INTENTIONAL VIOLATIONS for demo purposes
 *
 * Issues demonstrated:
 * - Click-only handlers (no keyboard support)
 * - Missing role="button"
 * - Missing tabindex="0"
 * - No Enter/Space key handling
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const button1 = document.getElementById('bad-button-1');
    const button2 = document.getElementById('bad-button-2');
    const output = document.getElementById('bad-output');

    if (!button1 || !button2 || !output) return;

    // ISSUE: Only click handler, no keyboard support
    // This will be detected as "mouse-only-click"
    button1.addEventListener('click', function() {
      output.textContent = 'Div clicked (mouse only) ✗';
      output.style.background = '#f8d7da';
      output.style.color = '#721c24';
    });

    // ISSUE: Click handler without keyboard equivalent
    // Missing keydown handler for Enter/Space
    button2.addEventListener('click', function() {
      output.textContent = 'Span clicked (mouse only) ✗';
      output.style.background = '#f8d7da';
      output.style.color = '#721c24';
    });

    // Missing in HTML:
    // - role="button" (screen readers won't announce as button)
    // - tabindex="0" (not keyboard focusable)
    // - keydown handler (no Enter/Space support)

    // The analyzer will detect:
    // 1. mouse-only-click (WCAG 2.1.1 violation)
    // 2. missing keyboard handler
    // 3. incomplete button pattern (if using WidgetPatternValidator)
    // 4. element not focusable
  }
})();
