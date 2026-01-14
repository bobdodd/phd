/**
 * Demo: Phase 1-3 Enhancements - ACCESSIBLE VERSION
 *
 * This file demonstrates the CORRECT implementations for all 10 new issue types.
 * Compare with ../inaccessible/phase-enhancements.js to see the problems.
 */

// =============================================================================
// PHASE 1: KEYBOARD ANALYZER ENHANCEMENTS - FIXES
// =============================================================================

// -----------------------------------------------------------------------------
// FIX 1: Missing Escape Handler → Complete Focus Trap with Escape
// WCAG 2.1.2 (No Keyboard Trap) ✓
// -----------------------------------------------------------------------------

const modal = document.getElementById('modal');
const modalContent = document.querySelector('.modal-content');
const firstFocusable = modal.querySelector('button');
const lastFocusable = modal.querySelector('.close-button');

// ✓ FIXED: Tab trap WITH Escape handler
modal.addEventListener('keydown', function(event) {
  // Handle Tab for focus trap
  if (event.key === 'Tab') {
    event.preventDefault();

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
      } else {
        firstFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
      } else {
        lastFocusable.focus();
      }
    }
  }

  // ✓ FIXED: Escape key allows users to exit the trap
  if (event.key === 'Escape' || event.key === 'Esc') {
    closeModal();
  }
});

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  // Return focus to element that opened the modal
  const trigger = document.getElementById('modal-trigger');
  if (trigger) trigger.focus();
}

// -----------------------------------------------------------------------------
// FIX 2: Incomplete Activation Keys → Both Enter AND Space
// WCAG 2.1.1 (Keyboard) ✓
// -----------------------------------------------------------------------------

const customButton = document.getElementById('custom-button');

// ✓ FIXED: Handles BOTH Enter and Space keys
customButton.addEventListener('keydown', function(event) {
  // Buttons must respond to both Enter and Space
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
    event.preventDefault();
    performAction();
  }
});

function performAction() {
  console.log('Action performed with complete keyboard support');
}

// Another example: Toggle switch with complete activation
const toggleSwitch = document.getElementById('toggle-switch');

// ✓ FIXED: Both Enter and Space handled
toggleSwitch.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
    event.preventDefault();
    toggleState();
  }
});

let switchState = false;

function toggleState() {
  switchState = !switchState;
  toggleSwitch.setAttribute('aria-checked', switchState.toString());
  toggleSwitch.classList.toggle('checked', switchState);
  console.log('State toggled:', switchState);
}

// -----------------------------------------------------------------------------
// FIX 3: Touch Without Click → Touch WITH Click Fallback
// WCAG 2.5.2 (Pointer Cancellation) ✓
// -----------------------------------------------------------------------------

const mobileButton = document.getElementById('mobile-action');

// ✓ FIXED: Touch event for mobile
mobileButton.addEventListener('touchstart', function(event) {
  event.preventDefault();
  handleMobileAction();
});

// ✓ FIXED: Click event as fallback for mouse/keyboard users
mobileButton.addEventListener('click', function(event) {
  handleMobileAction();
});

function handleMobileAction() {
  console.log('Action works for all input methods');
}

// Alternative approach: Use only click (works for touch AND mouse)
const universalButton = document.getElementById('universal-btn');

// ✓ BEST PRACTICE: Click event works for touch, mouse, and keyboard
universalButton.addEventListener('click', function() {
  console.log('Universal interaction - works everywhere');
});

// If you need touch-specific behavior, still provide click
const swipeArea = document.getElementById('swipe-area');

swipeArea.addEventListener('touchend', function(event) {
  processSwipe(event);
});

// ✓ FIXED: Click handler as accessible alternative
swipeArea.addEventListener('click', function(event) {
  processSwipe(event);
});

function processSwipe(event) {
  console.log('Swipe/click processed - accessible to all');
}

// =============================================================================
// PHASE 2: ARIA ANALYZER ENHANCEMENTS - FIXES
// =============================================================================

// -----------------------------------------------------------------------------
// FIX 4: Static ARIA State → Dynamic ARIA State Updates
// WCAG 4.1.2 (Name, Role, Value) ✓
// -----------------------------------------------------------------------------

const toggleButton = document.getElementById('toggle-btn');
let buttonPressed = false;

// Set initial state
toggleButton.setAttribute('aria-pressed', 'false');

// ✓ FIXED: aria-pressed updated on every toggle
toggleButton.addEventListener('click', function() {
  buttonPressed = !buttonPressed;

  // Update ARIA state to reflect actual state
  this.setAttribute('aria-pressed', buttonPressed.toString());
  this.classList.toggle('pressed', buttonPressed);

  console.log('Button state:', buttonPressed);
});

// Another example: Accordion with dynamic aria-expanded
const accordionHeader = document.getElementById('accordion-header');
const accordionPanel = document.getElementById('accordion-panel');
let panelExpanded = false;

// Set initial state
accordionHeader.setAttribute('aria-expanded', 'false');
accordionPanel.style.display = 'none';

// ✓ FIXED: aria-expanded updates with panel visibility
accordionHeader.addEventListener('click', function() {
  panelExpanded = !panelExpanded;

  // Update both visual state AND ARIA state
  accordionPanel.style.display = panelExpanded ? 'block' : 'none';
  accordionHeader.setAttribute('aria-expanded', panelExpanded.toString());

  console.log('Panel expanded:', panelExpanded);
});

// Another example: Custom checkbox with dynamic aria-checked
const customCheckbox = document.getElementById('custom-checkbox');
let checkboxChecked = false;

// Set role and initial state
customCheckbox.setAttribute('role', 'checkbox');
customCheckbox.setAttribute('aria-checked', 'false');
customCheckbox.setAttribute('tabindex', '0');

// ✓ FIXED: aria-checked updated on every toggle
customCheckbox.addEventListener('click', function() {
  checkboxChecked = !checkboxChecked;
  this.setAttribute('aria-checked', checkboxChecked.toString());
  this.classList.toggle('checked', checkboxChecked);
});

// Also handle keyboard activation
customCheckbox.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
    event.preventDefault();
    this.click(); // Reuse click handler
  }
});

// -----------------------------------------------------------------------------
// FIX 5: ARIA Reference → Valid ARIA References
// WCAG 4.1.2 (Name, Role, Value) ✓
// -----------------------------------------------------------------------------

const dialog = document.getElementById('dialog');

// ✓ FIXED: Create the elements that are referenced
const dialogTitle = document.createElement('h2');
dialogTitle.id = 'dialog-title';
dialogTitle.textContent = 'Confirmation Dialog';

const dialogDescription = document.createElement('p');
dialogDescription.id = 'dialog-description';
dialogDescription.textContent = 'Are you sure you want to continue?';

dialog.appendChild(dialogTitle);
dialog.appendChild(dialogDescription);

// Now the references are valid
dialog.setAttribute('aria-labelledby', 'dialog-title');
dialog.setAttribute('aria-describedby', 'dialog-description');

// -----------------------------------------------------------------------------
// FIX 6: Missing Live Region → Proper Live Region Usage
// WCAG 4.1.3 (Status Messages) ✓
// -----------------------------------------------------------------------------

const statusMessage = document.getElementById('status');

// ✓ FIXED: Set aria-live for dynamic updates
statusMessage.setAttribute('aria-live', 'polite');
statusMessage.setAttribute('aria-atomic', 'true');

// Now updates will be announced to screen readers
setTimeout(function() {
  statusMessage.textContent = 'Loading complete!';
}, 2000);

// Another example: Error messages with live region
const errorContainer = document.getElementById('error-container');

// ✓ FIXED: Error container has aria-live
errorContainer.setAttribute('role', 'alert'); // role="alert" implies aria-live="assertive"
errorContainer.setAttribute('aria-live', 'assertive'); // Explicit for clarity

function showError(message) {
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  // Now screen readers will announce the error immediately
}

// Best practice: Create a dedicated announcement region
const announcer = document.createElement('div');
announcer.setAttribute('aria-live', 'polite');
announcer.setAttribute('aria-atomic', 'true');
announcer.className = 'visually-hidden'; // Hide visually but keep for screen readers
document.body.appendChild(announcer);

function announce(message) {
  announcer.textContent = message;
  // Screen reader will announce this
}

// =============================================================================
// PHASE 3: NEW ANALYZERS - FIXES
// =============================================================================

// -----------------------------------------------------------------------------
// FIX 7: Unexpected Form Submit → Explicit Submit Button
// WCAG 3.2.2 (On Input) ✓
// -----------------------------------------------------------------------------

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// ✓ FIXED: No auto-submit - user clicks button explicitly
searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  performSearch();
});

function performSearch() {
  const query = searchInput.value;
  console.log('Search initiated by user action:', query);
  // Perform search...
}

// Optional: Provide search-as-you-type feedback without context change
searchInput.addEventListener('input', function() {
  // Show suggestions WITHOUT submitting form
  showSearchSuggestions(this.value);
});

function showSearchSuggestions(query) {
  const suggestions = document.getElementById('suggestions');
  // Update suggestions, but don't submit or navigate
  console.log('Showing suggestions for:', query);
}

// Another example: Filter with explicit apply button
const filterSelect = document.getElementById('filter-select');
const filterForm = document.getElementById('filter-form');
const applyButton = document.getElementById('apply-filter');

// ✓ FIXED: User explicitly applies filter
applyButton.addEventListener('click', function(event) {
  event.preventDefault();
  applyFilters();
});

function applyFilters() {
  const filter = filterSelect.value;
  console.log('Filter applied by user choice:', filter);
  // Apply filter...
}

// -----------------------------------------------------------------------------
// FIX 8: Unexpected Navigation → Explicit Navigation Links/Buttons
// WCAG 3.2.1 (On Focus), 3.2.2 (On Input) ✓
// -----------------------------------------------------------------------------

const languageSelect = document.getElementById('language-select');
const changeLanguageButton = document.getElementById('change-language-btn');

// ✓ FIXED: No auto-navigation - user clicks button
changeLanguageButton.addEventListener('click', function() {
  const selectedLang = languageSelect.value;
  window.location = '/lang/' + selectedLang;
});

// Alternative: Update content without navigation
languageSelect.addEventListener('change', function() {
  // Update UI without navigating
  updateLanguagePreference(this.value);
});

function updateLanguagePreference(lang) {
  // Store preference, update text, but don't navigate
  localStorage.setItem('language', lang);
  console.log('Language preference updated:', lang);
}

// Another example: Jump to page with button
const jumpToInput = document.getElementById('jump-to-page');
const jumpButton = document.getElementById('jump-button');

// ✓ FIXED: Explicit button click for navigation
jumpButton.addEventListener('click', function() {
  const pageNumber = jumpToInput.value;
  if (pageNumber && pageNumber.length >= 1) {
    window.location.href = '/page/' + pageNumber;
  }
});

// ✓ FIXED: No navigation on focus - ever
const safeInput = document.getElementById('safe-input');

safeInput.addEventListener('focus', function() {
  // Only provide focus indication, never navigate
  console.log('Input focused - no context change');
});

// -----------------------------------------------------------------------------
// FIX 9: Unannounced Timeout → Visible Warning with Controls
// WCAG 2.2.1 (Timing Adjustable) ✓
// -----------------------------------------------------------------------------

// ✓ FIXED: Show warning before timeout
let timeoutSeconds = 30;
let timeoutWarningShown = false;

const warningDialog = document.getElementById('timeout-warning');
const extendButton = document.getElementById('extend-session');
const timeRemainingSpan = document.getElementById('time-remaining');

// Show warning 10 seconds before timeout
setTimeout(function() {
  showTimeoutWarning();
}, (timeoutSeconds - 10) * 1000);

function showTimeoutWarning() {
  if (timeoutWarningShown) return;
  timeoutWarningShown = true;

  warningDialog.style.display = 'block';
  warningDialog.setAttribute('role', 'alertdialog');
  warningDialog.setAttribute('aria-live', 'assertive');

  announce('Your session will expire in 10 seconds. Click extend to continue.');

  // Countdown display
  let remaining = 10;
  const countdownInterval = setInterval(function() {
    remaining--;
    timeRemainingSpan.textContent = remaining;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      // Now user has been warned
      window.location = '/logout';
    }
  }, 1000);

  // ✓ Allow user to extend session
  extendButton.addEventListener('click', function() {
    clearInterval(countdownInterval);
    warningDialog.style.display = 'none';
    timeoutWarningShown = false;
    console.log('Session extended by user');
  });
}

// Alternative: Allow user to disable auto-logout
const autoLogoutCheckbox = document.getElementById('auto-logout-toggle');

autoLogoutCheckbox.addEventListener('change', function() {
  if (!this.checked) {
    // User disabled auto-logout
    console.log('Auto-logout disabled by user preference');
  }
});

// -----------------------------------------------------------------------------
// FIX 10: Uncontrolled Auto-Update → User-Controllable Updates
// WCAG 2.2.2 (Pause, Stop, Hide) ✓
// -----------------------------------------------------------------------------

let feedUpdateInterval = null;
let isUpdating = false;
const pauseButton = document.getElementById('pause-updates');
const statusIndicator = document.getElementById('update-status');

// ✓ FIXED: Provide pause/resume controls
pauseButton.addEventListener('click', function() {
  if (isUpdating) {
    pauseUpdates();
  } else {
    resumeUpdates();
  }
});

function startUpdates() {
  if (feedUpdateInterval) return; // Already running

  isUpdating = true;
  pauseButton.textContent = 'Pause Updates';
  statusIndicator.textContent = 'Live';

  // ✓ Store interval ID so we can clear it
  feedUpdateInterval = setInterval(function() {
    updateLiveFeed();
  }, 5000);

  // Initial update
  updateLiveFeed();
}

function pauseUpdates() {
  // ✓ FIXED: clearInterval allows user to stop updates
  if (feedUpdateInterval) {
    clearInterval(feedUpdateInterval);
    feedUpdateInterval = null;
  }

  isUpdating = false;
  pauseButton.textContent = 'Resume Updates';
  statusIndicator.textContent = 'Paused';

  announce('Live updates paused');
}

function resumeUpdates() {
  startUpdates();
  announce('Live updates resumed');
}

function updateLiveFeed() {
  const feed = document.getElementById('live-feed');
  fetch('/api/updates')
    .then(response => response.json())
    .then(data => {
      feed.innerHTML = formatFeedData(data);
      announce(data.length + ' new items');
    });
}

function formatFeedData(data) {
  return data.map(item => `<div>${item.content}</div>`).join('');
}

// Start updates by default, but user can pause
startUpdates();

// Another example: Stock prices with controls
let stockUpdateInterval = null;
const stockPauseButton = document.getElementById('pause-stocks');

stockPauseButton.addEventListener('click', function() {
  if (stockUpdateInterval) {
    // ✓ User can stop updates
    clearInterval(stockUpdateInterval);
    stockUpdateInterval = null;
    this.textContent = 'Resume Stock Updates';
  } else {
    // ✓ User can restart updates
    stockUpdateInterval = setInterval(updateStockPrices, 3000);
    this.textContent = 'Pause Stock Updates';
  }
});

function updateStockPrices() {
  const stockPrices = document.getElementById('stock-prices');
  fetch('/api/stocks')
    .then(response => response.json())
    .then(prices => {
      stockPrices.textContent = formatPrices(prices);
    });
}

function formatPrices(prices) {
  return prices.join(', ');
}

// Another example: Banner rotation with controls
let bannerInterval = null;
const pauseBannerButton = document.getElementById('pause-banner');

pauseBannerButton.addEventListener('click', function() {
  if (bannerInterval) {
    clearInterval(bannerInterval);
    bannerInterval = null;
    this.textContent = 'Resume Banner';
  } else {
    bannerInterval = setInterval(rotateBanner, 10000);
    this.textContent = 'Pause Banner';
  }
});

function rotateBanner() {
  const banner = document.querySelector('.banner');
  const images = banner.querySelectorAll('img');
  // Rotation logic...
}

// =============================================================================
// SEMANTIC HTML FIXES
// =============================================================================

// -----------------------------------------------------------------------------
// FIX: Non-Semantic Button → Native Button Element
// WCAG 4.1.2 (Name, Role, Value) ✓
// -----------------------------------------------------------------------------

// ✓ FIXED: Use native <button> element
const properButton = document.createElement('button');
properButton.textContent = 'Click me';
properButton.className = 'button-styled';
properButton.addEventListener('click', function() {
  console.log('Proper semantic button clicked');
});
document.body.appendChild(properButton);

// ✓ Benefits of native button:
// - Built-in keyboard support (Enter and Space)
// - Focusable by default
// - Announced correctly by screen readers
// - Works with form submission
// - Better browser compatibility

// If using existing element, prefer button over role
const existingElement = document.getElementById('existing-btn');
// ✗ BAD: existingElement.setAttribute('role', 'button');
// ✓ GOOD: Replace with <button> or use <button> from the start

// -----------------------------------------------------------------------------
// FIX: Non-Semantic Link → Native Anchor Element
// WCAG 4.1.2 (Name, Role, Value) ✓
// -----------------------------------------------------------------------------

// ✓ FIXED: Use native <a> element for links
const properLink = document.createElement('a');
properLink.href = '/destination';
properLink.textContent = 'Go to page';
properLink.addEventListener('click', function(event) {
  // Can still add custom behavior
  console.log('Link clicked');
});

// ✓ Benefits of native link:
// - Built-in keyboard support (Enter)
// - Focusable by default
// - Works with "Open in new tab"
// - Works with browser history
// - Proper semantic meaning

console.log('Accessible demo loaded: All issues properly fixed!');
