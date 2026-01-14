/**
 * Accessible Keyboard Shortcuts Implementation
 * GOOD EXAMPLE
 *
 * Best Practices:
 * - Use modifier keys (Ctrl, Alt, Shift) to avoid screen reader conflicts
 * - Provide configuration UI to remap shortcuts
 * - Document shortcuts in help system
 * - Allow shortcuts to be disabled
 * - Avoid single-character shortcuts that conflict with:
 *   - NVDA/JAWS quick navigation (h, b, k, l, t, etc.)
 *   - Browser shortcuts
 *   - Screen reader commands
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const container = document.querySelector('.example.good .demo-container');
    if (!container) return;

    // Create demo interface
    container.innerHTML = `
      <div class="shortcuts-demo">
        <div class="editor-area" contenteditable="true" role="textbox" aria-label="Text editor">
          Type some text here. Try Ctrl+S to save, Ctrl+B to bold, Ctrl+I to italic.
        </div>

        <div class="shortcuts-config" role="region" aria-labelledby="shortcuts-title">
          <h3 id="shortcuts-title">Keyboard Shortcuts</h3>
          <ul role="list">
            <li><kbd>Ctrl+S</kbd> - Save</li>
            <li><kbd>Ctrl+B</kbd> - Bold</li>
            <li><kbd>Ctrl+I</kbd> - Italic</li>
            <li><kbd>Ctrl+K</kbd> - Insert Link</li>
            <li><kbd>Ctrl+/</kbd> - Show Help</li>
          </ul>
          <button id="good-toggle-shortcuts" type="button" aria-pressed="true">
            Shortcuts Enabled
          </button>
        </div>

        <div class="status-area" role="status" aria-live="polite" aria-atomic="true"></div>
      </div>
    `;

    const editor = container.querySelector('.editor-area');
    const statusArea = container.querySelector('.status-area');
    const toggleBtn = document.getElementById('good-toggle-shortcuts');

    let shortcutsEnabled = true;

    // GOOD: Modifier-based shortcuts (Ctrl, Alt, Shift)
    // These don't conflict with screen reader quick navigation
    editor.addEventListener('keydown', function(event) {
      if (!shortcutsEnabled) return;

      // Check for Ctrl key (or Cmd on Mac)
      const modifier = event.ctrlKey || event.metaKey;

      if (modifier && !event.altKey && !event.shiftKey) {
        switch(event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            saveDocument();
            break;

          case 'b':
            event.preventDefault();
            toggleBold();
            break;

          case 'i':
            event.preventDefault();
            toggleItalic();
            break;

          case 'k':
            event.preventDefault();
            insertLink();
            break;

          case '/':
            event.preventDefault();
            showHelp();
            break;
        }
      }
    });

    // Toggle shortcuts on/off
    toggleBtn.addEventListener('click', function() {
      shortcutsEnabled = !shortcutsEnabled;
      toggleBtn.textContent = shortcutsEnabled ? 'Shortcuts Enabled' : 'Shortcuts Disabled';
      toggleBtn.setAttribute('aria-pressed', shortcutsEnabled.toString());

      showStatus(shortcutsEnabled
        ? 'Keyboard shortcuts enabled'
        : 'Keyboard shortcuts disabled'
      );
    });

    // Shortcut actions
    function saveDocument() {
      showStatus('Document saved (simulated)');
      // Simulate save with visual feedback
      editor.style.borderColor = '#22c55e';
      setTimeout(() => {
        editor.style.borderColor = '';
      }, 500);
    }

    function toggleBold() {
      document.execCommand('bold');
      showStatus('Bold toggled');
    }

    function toggleItalic() {
      document.execCommand('italic');
      showStatus('Italic toggled');
    }

    function insertLink() {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand('createLink', false, url);
        showStatus('Link inserted');
      }
    }

    function showHelp() {
      showStatus('Keyboard shortcuts: Ctrl+S (Save), Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+K (Link)');
    }

    function showStatus(message) {
      statusArea.textContent = message;
      // Clear after 3 seconds
      setTimeout(() => {
        statusArea.textContent = '';
      }, 3000);
    }
  }
})();
