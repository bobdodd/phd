/**
 * Inaccessible Keyboard Shortcuts Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues:
 * - Single-character shortcuts that conflict with screen readers
 * - 'h' conflicts with NVDA/JAWS heading navigation
 * - 'b' conflicts with NVDA/JAWS button navigation
 * - 'k' conflicts with NVDA/JAWS link navigation
 * - 't' conflicts with NVDA/JAWS table navigation
 * - Arrow keys conflict with screen reader browse mode
 * - No way to disable or remap shortcuts
 * - WCAG 2.1.4 Character Key Shortcuts violation
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const container = document.querySelector('.example.bad .demo-container');
    if (!container) return;

    // Create demo interface
    container.innerHTML = `
      <div class="shortcuts-demo">
        <div class="editor-area" contenteditable="true" role="textbox" aria-label="Text editor with problematic shortcuts">
          Type some text here. Try single keys: h (heading), b (bold), k (link), t (table).
          Warning: These conflict with screen reader navigation!
        </div>

        <div class="shortcuts-config" role="region" aria-labelledby="bad-shortcuts-title">
          <h3 id="bad-shortcuts-title">Problematic Keyboard Shortcuts</h3>
          <ul role="list">
            <li><kbd>h</kbd> - Heading (conflicts with NVDA/JAWS heading navigation)</li>
            <li><kbd>b</kbd> - Bold (conflicts with button navigation)</li>
            <li><kbd>k</kbd> - Link (conflicts with link navigation)</li>
            <li><kbd>t</kbd> - Table (conflicts with table navigation)</li>
            <li><kbd>↑↓</kbd> - Navigate (conflicts with browse mode)</li>
          </ul>
          <p style="color: #dc2626; font-weight: bold;">
            No way to disable these shortcuts!
          </p>
        </div>

        <div class="status-area" role="status" aria-live="polite"></div>
      </div>
    `;

    const editor = container.querySelector('.editor-area');
    const statusArea = container.querySelector('.status-area');

    // ISSUE: Single-character shortcuts without modifier keys
    // These conflict with screen reader quick navigation keys
    editor.addEventListener('keydown', function(event) {
      // ISSUE: No way to disable shortcuts
      // ISSUE: No check for modifier keys

      switch(event.key.toLowerCase()) {
        // ISSUE: 'h' conflicts with NVDA/JAWS heading navigation (H/Shift+H)
        case 'h':
          event.preventDefault();
          insertHeading();
          break;

        // ISSUE: 'b' conflicts with NVDA/JAWS button navigation (B/Shift+B)
        case 'b':
          event.preventDefault();
          toggleBold();
          break;

        // ISSUE: 'k' conflicts with NVDA/JAWS link navigation (K/Shift+K)
        case 'k':
          event.preventDefault();
          insertLink();
          break;

        // ISSUE: 't' conflicts with NVDA/JAWS table navigation (T/Shift+T)
        case 't':
          event.preventDefault();
          insertTable();
          break;

        // ISSUE: Arrow keys conflict with screen reader browse mode navigation
        case 'arrowup':
          event.preventDefault();
          showStatus('Moving up (conflicts with screen reader navigation)');
          break;

        case 'arrowdown':
          event.preventDefault();
          showStatus('Moving down (conflicts with screen reader navigation)');
          break;
      }
    });

    function insertHeading() {
      showStatus('Heading inserted (but \'h\' conflicts with screen reader heading navigation!)');
      document.execCommand('formatBlock', false, 'h3');
    }

    function toggleBold() {
      showStatus('Bold toggled (but \'b\' conflicts with screen reader button navigation!)');
      document.execCommand('bold');
    }

    function insertLink() {
      showStatus('Link mode (but \'k\' conflicts with screen reader link navigation!)');
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    }

    function insertTable() {
      showStatus('Table inserted (but \'t\' conflicts with screen reader table navigation!)');
      // Simulate table insertion
      document.execCommand('insertHTML', false, '<table><tr><td>Cell</td></tr></table>');
    }

    function showStatus(message) {
      statusArea.textContent = message;
      setTimeout(() => {
        statusArea.textContent = '';
      }, 4000);
    }

    // Show warning on focus
    editor.addEventListener('focus', function() {
      showStatus('Warning: Single-key shortcuts active! Screen reader users will have conflicts.');
    });
  }
})();
