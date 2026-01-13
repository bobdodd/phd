/**
 * Accessible Tabs Implementation
 * Following WAI-ARIA Authoring Practices
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const tablist = document.querySelector('[role="tablist"]');
    if (!tablist || tablist.getAttribute('aria-label') !== 'Sample Tabs') return;

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(index));
      tab.addEventListener('keydown', (e) => handleKeyboard(e, index));
    });

    function activateTab(index) {
      // Deactivate all tabs
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
        if (panels[i]) {
          panels[i].setAttribute('aria-hidden', 'true');
        }
      });

      // Activate selected tab
      tabs[index].setAttribute('aria-selected', 'true');
      tabs[index].setAttribute('tabindex', '0');
      tabs[index].focus();
      if (panels[index]) {
        panels[index].setAttribute('aria-hidden', 'false');
      }
    }

    function handleKeyboard(event, currentIndex) {
      let newIndex = currentIndex;

      switch(event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = tabs.length - 1;
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          activateTab(currentIndex);
          return;
        default:
          return;
      }

      activateTab(newIndex);
    }
  }
})();
