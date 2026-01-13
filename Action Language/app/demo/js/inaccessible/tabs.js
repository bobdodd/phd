/**
 * Inaccessible Tabs Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues:
 * - No ARIA roles (tablist, tab, tabpanel)
 * - Click-only, no keyboard navigation
 * - No aria-selected state
 * - No aria-controls associations
 * - Using style.display instead of aria-hidden
 * - No arrow key navigation
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const tab1 = document.getElementById('bad-tab-1');
    const tab2 = document.getElementById('bad-tab-2');
    const tab3 = document.getElementById('bad-tab-3');

    const panel1 = document.getElementById('bad-panel-1');
    const panel2 = document.getElementById('bad-panel-2');
    const panel3 = document.getElementById('bad-panel-3');

    if (!tab1 || !panel1) return;

    const tabs = [tab1, tab2, tab3];
    const panels = [panel1, panel2, panel3];

    // ISSUE: Only click handlers - no keyboard navigation
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // ISSUE: Using style.display instead of aria-hidden
        panels.forEach((p, i) => {
          p.style.display = i === index ? 'block' : 'none';
          tabs[i].style.color = i === index ? '#0078d4' : '#666';
          tabs[i].style.background = i === index ? 'white' : 'transparent';
          tabs[i].style.borderBottom = i === index ? '3px solid #0078d4' : '3px solid transparent';
        });
      });
    });

    // Missing:
    // - role="tablist", role="tab", role="tabpanel"
    // - aria-selected attribute
    // - aria-controls linking tabs to panels
    // - aria-labelledby on panels
    // - Arrow key navigation (Left/Right)
    // - Home/End key support
    // - Enter/Space activation
    // - Proper focus management (tabindex roving)
  }
})();
