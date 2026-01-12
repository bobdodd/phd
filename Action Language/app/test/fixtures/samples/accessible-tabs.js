/**
 * Accessible Tabs Example
 *
 * This file demonstrates proper tab widget patterns per WAI-ARIA APG:
 * - Proper ARIA roles (tablist, tab, tabpanel)
 * - Arrow key navigation
 * - Focus management
 * - aria-selected state management
 *
 * Expected: High accessibility score
 */

const tablist = document.querySelector('.tablist');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

// Set up ARIA attributes
tablist.setAttribute('role', 'tablist');

tabs.forEach((tab, index) => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
  tab.setAttribute('aria-controls', `panel-${index}`);
  tab.id = `tab-${index}`;
});

panels.forEach((panel, index) => {
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', `tab-${index}`);
  panel.id = `panel-${index}`;
  panel.hidden = index !== 0;
});

// Activation function
function activateTab(newTab) {
  const index = Array.from(tabs).indexOf(newTab);

  // Update tabs
  tabs.forEach((tab, i) => {
    const isSelected = i === index;
    tab.setAttribute('aria-selected', String(isSelected));
    tab.setAttribute('tabindex', isSelected ? '0' : '-1');
  });

  // Update panels
  panels.forEach((panel, i) => {
    panel.hidden = i !== index;
  });

  // Move focus
  newTab.focus();
}

// Click handler
tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    activateTab(this);
  });
});

// Keyboard navigation
tablist.addEventListener('keydown', function(event) {
  const currentTab = document.activeElement;
  const currentIndex = Array.from(tabs).indexOf(currentTab);
  let newIndex;

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      newIndex = (currentIndex + 1) % tabs.length;
      activateTab(tabs[newIndex]);
      break;

    case 'ArrowLeft':
      event.preventDefault();
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      activateTab(tabs[newIndex]);
      break;

    case 'Home':
      event.preventDefault();
      activateTab(tabs[0]);
      break;

    case 'End':
      event.preventDefault();
      activateTab(tabs[tabs.length - 1]);
      break;
  }
});
