/**
 * Inaccessible Complex Widgets Implementation
 * INTENTIONAL VIOLATIONS
 *
 * This file demonstrates ALL detectable accessibility issues:
 *
 * Issues Demonstrated:
 * - invalid-role: Using non-existent ARIA roles
 * - missing-required-aria: Role without required attributes
 * - incomplete ARIA patterns (missing keyboard navigation)
 * - possibly-non-focusable: Calling .focus() on non-focusable element
 * - deprecated-keycode: Using event.keyCode instead of event.key
 * - mouse-only-click: Click handlers without keyboard support
 * - interactive-role-static: Interactive role without handlers
 * - aria-hidden-true: Hiding important content
 * - tab-without-shift: Checking Tab without Shift consideration
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

    container.innerHTML = `
      <div class="complex-widgets">
        <!-- ISSUE: invalid-role + missing-required-aria -->
        <div class="widget-section" style="border: 2px solid #dc2626; padding: 10px; margin-bottom: 15px;">
          <h3>Custom Slider (Multiple Issues)</h3>
          <div role="banana" id="bad-slider" style="cursor: pointer; padding: 10px; background: #f3f4f6;">
            Value: <span id="slider-value">50</span>
            <div style="width: 200px; height: 20px; background: #e5e7eb; position: relative; margin-top: 5px;">
              <div id="slider-thumb" style="width: 20px; height: 20px; background: #3b82f6; position: absolute; left: 50%;"></div>
            </div>
          </div>
          <p style="color: #dc2626; font-size: 0.9em;">
            Issues: role="banana" (invalid), missing aria-valuenow/aria-valuemin/aria-valuemax
          </p>
        </div>

        <!-- ISSUE: interactive-role-static -->
        <div class="widget-section" style="border: 2px solid #dc2626; padding: 10px; margin-bottom: 15px;">
          <h3>Static Button (No Handler)</h3>
          <span role="button" id="bad-static-button" style="padding: 8px 16px; background: #f3f4f6; display: inline-block;">
            I have role="button" but no click handler!
          </span>
          <p style="color: #dc2626; font-size: 0.9em;">
            Issue: Interactive role without event handler
          </p>
        </div>

        <!-- ISSUE: Incomplete Combobox (missing keyboard support) -->
        <div class="widget-section">
          <h3>Select Fruit (Broken Combobox)</h3>
          <div id="bad-combobox">
            <input type="text" id="bad-combobox-input" placeholder="Type to filter...">
            <ul id="bad-combobox-listbox" style="display: none; list-style: none; padding: 5px; border: 1px solid #ccc;">
              <li class="bad-option" data-value="apple">Apple</li>
              <li class="bad-option" data-value="banana">Banana</li>
              <li class="bad-option" data-value="cherry">Cherry</li>
              <li class="bad-option" data-value="grape">Grape</li>
              <li class="bad-option" data-value="orange">Orange</li>
            </ul>
          </div>
          <div id="bad-combobox-status"></div>
          <p style="color: #dc2626; font-size: 0.9em;">Missing: role="combobox", aria-expanded, aria-controls, keyboard navigation</p>
        </div>

        <!-- ISSUE: Non-compliant Tree (no keyboard navigation) -->
        <div class="widget-section">
          <h3>File Browser (Broken Tree)</h3>
          <ul id="bad-tree" style="list-style: none;">
            <li class="bad-tree-item" data-has-children="true">
              <span class="bad-tree-label" style="cursor: pointer;">📁 Documents</span>
              <ul class="bad-tree-children" style="display: none; margin-left: 20px; list-style: none;">
                <li class="bad-tree-item">📄 Report.pdf</li>
                <li class="bad-tree-item">📄 Notes.txt</li>
              </ul>
            </li>
            <li class="bad-tree-item" data-has-children="true">
              <span class="bad-tree-label" style="cursor: pointer;">📁 Pictures</span>
              <ul class="bad-tree-children" style="display: none; margin-left: 20px; list-style: none;">
                <li class="bad-tree-item">🖼 Photo1.jpg</li>
                <li class="bad-tree-item">🖼 Photo2.jpg</li>
              </ul>
            </li>
            <li class="bad-tree-item">🎵 Music</li>
          </ul>
          <p style="color: #dc2626; font-size: 0.9em;">Missing: role="tree", role="treeitem", aria-expanded, keyboard arrow navigation</p>
        </div>

        <!-- ISSUE: Toolbar without roving tabindex -->
        <div class="widget-section">
          <h3>Text Editor (Broken Toolbar)</h3>
          <div id="bad-toolbar" style="display: flex; gap: 5px; padding: 5px; background: #f3f4f6;">
            <div class="bad-toolbar-btn" style="cursor: pointer; padding: 5px; border: 1px solid #ccc;"><strong>B</strong></div>
            <div class="bad-toolbar-btn" style="cursor: pointer; padding: 5px; border: 1px solid #ccc;"><em>I</em></div>
            <div class="bad-toolbar-btn" style="cursor: pointer; padding: 5px; border: 1px solid #ccc;"><u>U</u></div>
            <span style="border-left: 1px solid #ccc; margin: 0 5px;"></span>
            <div class="bad-toolbar-btn" style="cursor: pointer; padding: 5px; border: 1px solid #ccc;">⬅</div>
            <div class="bad-toolbar-btn" style="cursor: pointer; padding: 5px; border: 1px solid #ccc;">⬌</div>
            <div class="bad-toolbar-btn" style="cursor: pointer; padding: 5px; border: 1px solid #ccc;">➡</div>
          </div>
          <div id="bad-editor-content" contenteditable="true" style="border: 1px solid #ccc; padding: 10px; min-height: 60px;">
            Edit this text with the toolbar above
          </div>
          <p style="color: #dc2626; font-size: 0.9em;">Missing: role="toolbar", roving tabindex, arrow key navigation, aria-labels</p>
        </div>
      </div>
    `;

    // Initialize broken widgets
    initInvalidRoleSlider();
    initBrokenCombobox();
    initBrokenTree();
    initBrokenToolbar();
    initDeprecatedKeyCode();
    initAriaHiddenIssue();

    // ISSUE: invalid-role + missing-required-aria + possibly-non-focusable
    function initInvalidRoleSlider() {
      const slider = document.getElementById('bad-slider');
      const thumb = document.getElementById('slider-thumb');
      const valueDisplay = document.getElementById('slider-value');

      // ISSUE: Using invalid role="banana" (should be role="slider")
      // This was set in HTML above

      // ISSUE: Trying to set focus on element without tabindex
      slider.addEventListener('click', function(e) {
        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(100, Math.max(0, (x / 200) * 100));

        valueDisplay.textContent = Math.round(percentage);
        thumb.style.left = percentage + '%';

        // ISSUE: possibly-non-focusable - calling .focus() without ensuring element is focusable
        const someDiv = document.createElement('div');
        someDiv.textContent = 'Trying to focus this...';
        slider.appendChild(someDiv);
        // ISSUE: Attempting to focus an element that has no tabindex
        someDiv.focus(); // This won't work and triggers possibly-non-focusable
      });

      // ISSUE: missing-required-aria
      // If this were role="slider" (valid), it would need:
      // - aria-valuenow
      // - aria-valuemin
      // - aria-valuemax
      // But since role="banana" is invalid, the analyzer catches that first
    }

    function initBrokenCombobox() {
      const input = document.getElementById('bad-combobox-input');
      const listbox = document.getElementById('bad-combobox-listbox');
      const options = listbox.querySelectorAll('.bad-option');

      // ISSUE: No ARIA attributes on container or input
      // ISSUE: Input doesn't have role, aria-expanded, aria-controls, aria-autocomplete

      // ISSUE: deprecated-keycode + tab-without-shift
      input.addEventListener('keydown', function(event) {
        // ISSUE: Using deprecated event.keyCode instead of event.key
        if (event.keyCode === 27) { // Should use event.key === 'Escape'
          listbox.style.display = 'none';
        }

        // ISSUE: tab-without-shift - checking for Tab without considering Shift
        if (event.keyCode === 9) { // Should check event.shiftKey for direction
          console.log('Tab pressed (but not checking if Shift+Tab for backward navigation)');
        }
      });

      // ISSUE: Basic filter but no keyboard navigation
      input.addEventListener('input', function() {
        const filter = input.value.toLowerCase();
        let hasVisible = false;

        options.forEach(option => {
          const text = option.textContent.toLowerCase();
          if (text.includes(filter)) {
            option.style.display = 'block';
            hasVisible = true;
          } else {
            option.style.display = 'none';
          }
        });

        // ISSUE: Display shown but no aria-expanded update
        listbox.style.display = hasVisible && filter ? 'block' : 'none';
      });

      // ISSUE: Click-only options (no keyboard support)
      options.forEach(option => {
        option.addEventListener('click', function() {
          input.value = option.textContent;
          listbox.style.display = 'none';
        });

        // ISSUE: Only hover feedback (no keyboard focus)
        option.addEventListener('mouseenter', function() {
          option.style.backgroundColor = '#e5e7eb';
        });

        option.addEventListener('mouseleave', function() {
          option.style.backgroundColor = '';
        });
      });

      // ISSUE: Missing keyboard handlers
      // - No ArrowDown/ArrowUp for navigation
      // - No Enter to select
      // - No Escape to close
      // - No aria-activedescendant tracking
    }

    function initBrokenTree() {
      const treeLabels = document.querySelectorAll('.bad-tree-label');

      // ISSUE: Click-only expansion (no keyboard)
      treeLabels.forEach(label => {
        label.addEventListener('click', function() {
          const parent = label.parentElement;
          const children = parent.querySelector('.bad-tree-children');

          if (children) {
            const isVisible = children.style.display === 'block';
            children.style.display = isVisible ? 'none' : 'block';
            // ISSUE: Visual change but no aria-expanded update
          }
        });
      });

      // ISSUE: No keyboard handlers
      // - No ArrowRight to expand
      // - No ArrowLeft to collapse
      // - No ArrowDown/ArrowUp to navigate items
      // - No Home/End
      // - No focus management

      // ISSUE: No ARIA roles
      // - No role="tree"
      // - No role="treeitem"
      // - No role="group"
      // - No aria-expanded
      // - No tabindex management
    }

    function initBrokenToolbar() {
      const buttons = document.querySelectorAll('.bad-toolbar-btn');

      // ISSUE: Click-only buttons
      buttons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
          console.log('Toolbar action:', index);
          // Visual feedback only
          btn.style.backgroundColor = '#d1d5db';
          setTimeout(() => {
            btn.style.backgroundColor = '';
          }, 200);
        });
      });

      // ISSUE: No keyboard navigation
      // - No ArrowLeft/ArrowRight navigation
      // - No roving tabindex
      // - No Home/End support
      // - Buttons are divs, not focusable

      // ISSUE: No ARIA attributes
      // - No role="toolbar"
      // - No role="button" on items
      // - No aria-label on buttons
      // - No aria-controls linking to editor
      // - No tabindex for focus management
    }

    // ISSUE: deprecated-keycode example
    function initDeprecatedKeyCode() {
      const input = document.getElementById('bad-combobox-input');

      // Additional deprecated keyCode usage example
      document.addEventListener('keydown', function(event) {
        // ISSUE: Using event.keyCode and event.which (both deprecated)
        if (event.which === 13 || event.keyCode === 13) {
          console.log('Enter pressed (using deprecated keyCode/which)');
        }

        // Should use: if (event.key === 'Enter')
      });
    }

    // ISSUE: aria-hidden-true on important content
    function initAriaHiddenIssue() {
      const combobox = document.getElementById('bad-combobox');

      // ISSUE: Setting aria-hidden="true" on interactive content
      // This removes it from accessibility tree completely
      setTimeout(function() {
        combobox.setAttribute('aria-hidden', 'true');
        console.log('Set aria-hidden=true on combobox (removes from accessibility tree!)');
      }, 5000);
    }
  }
})();

