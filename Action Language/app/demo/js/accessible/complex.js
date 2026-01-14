/**
 * Accessible Complex Widgets Implementation
 * GOOD EXAMPLE
 *
 * Demonstrates:
 * - Combobox with autocomplete (ARIA 1.2 pattern)
 * - Tree view with arrow navigation
 * - Toolbar with roving tabindex
 *
 * Best Practices:
 * - Complete ARIA roles and properties
 * - Full keyboard navigation support
 * - Screen reader friendly announcements
 * - Focus management
 * - WAI-ARIA Authoring Practices compliance
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

    container.innerHTML = `
      <div class="complex-widgets">
        <!-- Combobox with Autocomplete -->
        <div class="widget-section">
          <h3 id="combobox-label">Select Fruit (Combobox)</h3>
          <div role="combobox"
               aria-expanded="false"
               aria-owns="combobox-listbox"
               aria-haspopup="listbox"
               id="good-combobox">
            <input type="text"
                   id="good-combobox-input"
                   aria-autocomplete="list"
                   aria-controls="combobox-listbox"
                   aria-labelledby="combobox-label"
                   placeholder="Type to filter...">
            <ul id="combobox-listbox"
                role="listbox"
                aria-labelledby="combobox-label"
                hidden>
              <li role="option" data-value="apple">Apple</li>
              <li role="option" data-value="banana">Banana</li>
              <li role="option" data-value="cherry">Cherry</li>
              <li role="option" data-value="grape">Grape</li>
              <li role="option" data-value="orange">Orange</li>
            </ul>
          </div>
          <div role="status" aria-live="polite" id="combobox-status"></div>
        </div>

        <!-- Tree View -->
        <div class="widget-section">
          <h3 id="tree-label">File Browser (Tree)</h3>
          <ul role="tree" aria-labelledby="tree-label" id="good-tree">
            <li role="treeitem" aria-expanded="false" tabindex="0">
              <span>Documents</span>
              <ul role="group">
                <li role="treeitem" tabindex="-1">Report.pdf</li>
                <li role="treeitem" tabindex="-1">Notes.txt</li>
              </ul>
            </li>
            <li role="treeitem" aria-expanded="false" tabindex="-1">
              <span>Pictures</span>
              <ul role="group">
                <li role="treeitem" tabindex="-1">Photo1.jpg</li>
                <li role="treeitem" tabindex="-1">Photo2.jpg</li>
              </ul>
            </li>
            <li role="treeitem" tabindex="-1">Music</li>
          </ul>
        </div>

        <!-- Toolbar with Roving Tabindex -->
        <div class="widget-section">
          <h3 id="toolbar-label">Text Editor (Toolbar)</h3>
          <div role="toolbar" aria-labelledby="toolbar-label" aria-controls="editor-content" id="good-toolbar">
            <button type="button" aria-label="Bold" tabindex="0"><strong>B</strong></button>
            <button type="button" aria-label="Italic" tabindex="-1"><em>I</em></button>
            <button type="button" aria-label="Underline" tabindex="-1"><u>U</u></button>
            <span role="separator"></span>
            <button type="button" aria-label="Align Left" tabindex="-1">⬅</button>
            <button type="button" aria-label="Align Center" tabindex="-1">⬌</button>
            <button type="button" aria-label="Align Right" tabindex="-1">➡</button>
          </div>
          <div id="editor-content" contenteditable="true" style="border: 1px solid #ccc; padding: 10px; min-height: 60px;" aria-label="Editor content">
            Edit this text with the toolbar above
          </div>
        </div>
      </div>
    `;

    // Initialize widgets
    initCombobox();
    initTree();
    initToolbar();

    function initCombobox() {
      const combobox = document.getElementById('good-combobox');
      const input = document.getElementById('good-combobox-input');
      const listbox = document.getElementById('combobox-listbox');
      const options = listbox.querySelectorAll('[role="option"]');
      const status = document.getElementById('combobox-status');

      let activeIndex = -1;

      input.addEventListener('input', function() {
        const filter = input.value.toLowerCase();
        let visibleCount = 0;

        options.forEach(option => {
          const text = option.textContent.toLowerCase();
          if (text.includes(filter)) {
            option.hidden = false;
            visibleCount++;
          } else {
            option.hidden = true;
          }
        });

        if (visibleCount > 0 && filter) {
          listbox.hidden = false;
          combobox.setAttribute('aria-expanded', 'true');
          status.textContent = `${visibleCount} results available`;
        } else {
          listbox.hidden = true;
          combobox.setAttribute('aria-expanded', 'false');
          status.textContent = '';
        }
      });

      input.addEventListener('keydown', function(event) {
        const visibleOptions = Array.from(options).filter(opt => !opt.hidden);

        switch(event.key) {
          case 'ArrowDown':
            event.preventDefault();
            if (activeIndex < visibleOptions.length - 1) {
              activeIndex++;
              updateActiveOption(visibleOptions);
            }
            break;

          case 'ArrowUp':
            event.preventDefault();
            if (activeIndex > 0) {
              activeIndex--;
              updateActiveOption(visibleOptions);
            }
            break;

          case 'Enter':
            if (activeIndex >= 0) {
              event.preventDefault();
              selectOption(visibleOptions[activeIndex]);
            }
            break;

          case 'Escape':
            listbox.hidden = true;
            combobox.setAttribute('aria-expanded', 'false');
            activeIndex = -1;
            break;
        }
      });

      function updateActiveOption(visibleOptions) {
        visibleOptions.forEach((opt, idx) => {
          if (idx === activeIndex) {
            opt.setAttribute('aria-selected', 'true');
            input.setAttribute('aria-activedescendant', opt.id || '');
          } else {
            opt.removeAttribute('aria-selected');
          }
        });
      }

      function selectOption(option) {
        input.value = option.textContent;
        listbox.hidden = true;
        combobox.setAttribute('aria-expanded', 'false');
        status.textContent = `${option.textContent} selected`;
        activeIndex = -1;
      }
    }

    function initTree() {
      const tree = document.getElementById('good-tree');
      const treeItems = tree.querySelectorAll('[role="treeitem"]');

      treeItems.forEach(item => {
        const hasChildren = item.querySelector('[role="group"]');

        item.addEventListener('keydown', function(event) {
          switch(event.key) {
            case 'ArrowRight':
              if (hasChildren) {
                if (item.getAttribute('aria-expanded') === 'false') {
                  item.setAttribute('aria-expanded', 'true');
                } else {
                  // Focus first child
                  const firstChild = item.querySelector('[role="group"] [role="treeitem"]');
                  if (firstChild) focusItem(firstChild);
                }
              }
              break;

            case 'ArrowLeft':
              if (hasChildren && item.getAttribute('aria-expanded') === 'true') {
                item.setAttribute('aria-expanded', 'false');
              } else {
                // Focus parent
                const parent = item.closest('[role="group"]')?.closest('[role="treeitem"]');
                if (parent) focusItem(parent);
              }
              break;

            case 'ArrowDown':
              const next = getNextItem(item);
              if (next) focusItem(next);
              break;

            case 'ArrowUp':
              const prev = getPrevItem(item);
              if (prev) focusItem(prev);
              break;

            case 'Home':
              focusItem(treeItems[0]);
              break;

            case 'End':
              focusItem(treeItems[treeItems.length - 1]);
              break;
          }
        });

        if (hasChildren) {
          item.addEventListener('click', function() {
            const expanded = item.getAttribute('aria-expanded') === 'true';
            item.setAttribute('aria-expanded', (!expanded).toString());
          });
        }
      });

      function focusItem(item) {
        treeItems.forEach(ti => ti.tabIndex = -1);
        item.tabIndex = 0;
        item.focus();
      }

      function getNextItem(current) {
        const all = Array.from(tree.querySelectorAll('[role="treeitem"]'));
        const idx = all.indexOf(current);
        return all[idx + 1];
      }

      function getPrevItem(current) {
        const all = Array.from(tree.querySelectorAll('[role="treeitem"]'));
        const idx = all.indexOf(current);
        return all[idx - 1];
      }
    }

    function initToolbar() {
      const toolbar = document.getElementById('good-toolbar');
      const buttons = toolbar.querySelectorAll('button');

      buttons.forEach((button, index) => {
        button.addEventListener('keydown', function(event) {
          let newIndex = index;

          switch(event.key) {
            case 'ArrowRight':
              newIndex = (index + 1) % buttons.length;
              break;

            case 'ArrowLeft':
              newIndex = (index - 1 + buttons.length) % buttons.length;
              break;

            case 'Home':
              newIndex = 0;
              break;

            case 'End':
              newIndex = buttons.length - 1;
              break;

            default:
              return;
          }

          event.preventDefault();
          buttons[index].tabIndex = -1;
          buttons[newIndex].tabIndex = 0;
          buttons[newIndex].focus();
        });

        button.addEventListener('click', function() {
          console.log('Toolbar action:', button.getAttribute('aria-label'));
        });
      });
    }
  }
})();
