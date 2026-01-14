/**
 * Demo: Phase 1-3 Enhancement Issues (INTENTIONALLY INACCESSIBLE)
 *
 * This file demonstrates all 10 new accessibility issues added in the enhancement phases.
 * Each section contains intentional violations to test the new detections.
 *
 * See ../accessible/phase-enhancements.js for the corrected versions.
 */

// =============================================================================
// PHASE 1: KEYBOARD ANALYZER ENHANCEMENTS
// =============================================================================

// -----------------------------------------------------------------------------
// ISSUE 1: Missing Escape Handler in Focus Trap
// WCAG 2.1.2 (No Keyboard Trap)
// Expected detection: missing-escape-handler
// -----------------------------------------------------------------------------

const modal = document.getElementById('modal');
const modalContent = document.querySelector('.modal-content');
const firstFocusable = modal.querySelector('button');
const lastFocusable = modal.querySelector('.close-button');

// ISSUE: Tab is trapped but no Escape key to exit
modal.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    event.preventDefault();

    // Focus trap logic
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
  // MISSING: No handler for Escape key to close modal
});

// -----------------------------------------------------------------------------
// ISSUE 2: Incomplete Activation Keys
// WCAG 2.1.1 (Keyboard)
// Expected detection: incomplete-activation-keys
// -----------------------------------------------------------------------------

const customButton = document.getElementById('custom-button');

// ISSUE: Only handles Enter, missing Space key
customButton.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    performAction();
  }
  // MISSING: Space key handler (buttons need both Enter and Space)
});

function performAction() {
  console.log('Action performed');
}

// Another example: Only Space, missing Enter
const toggleSwitch = document.getElementById('toggle-switch');

// ISSUE: Only handles Space, missing Enter key
toggleSwitch.addEventListener('keydown', function(event) {
  if (event.key === ' ' || event.key === 'Space') {
    event.preventDefault();
    toggleState();
  }
  // MISSING: Enter key handler
});

function toggleState() {
  console.log('State toggled');
}

// -----------------------------------------------------------------------------
// ISSUE 3: Touch Without Click Fallback
// WCAG 2.5.2 (Pointer Cancellation)
// Expected detection: touch-without-click
// -----------------------------------------------------------------------------

const mobileButton = document.getElementById('mobile-action');

// ISSUE: Touch event without click fallback - excludes mouse/keyboard users
mobileButton.addEventListener('touchstart', function(event) {
  event.preventDefault();
  handleMobileAction();
});

// MISSING: No click event handler for non-touch devices
function handleMobileAction() {
  console.log('Mobile action triggered');
}

const swipeArea = document.getElementById('swipe-area');

// ISSUE: Touchend without click
swipeArea.addEventListener('touchend', function(event) {
  processSwipe(event);
});

// MISSING: No click handler alternative
function processSwipe(event) {
  console.log('Swipe processed');
}

// =============================================================================
// PHASE 2: ARIA ANALYZER ENHANCEMENTS
// =============================================================================

// -----------------------------------------------------------------------------
// ISSUE 4: Static ARIA State (Never Updated)
// WCAG 4.1.2 (Name, Role, Value)
// Expected detection: static-aria-state
// -----------------------------------------------------------------------------

const toggleButton = document.getElementById('toggle-btn');

// ISSUE: aria-pressed set once but never updated
toggleButton.setAttribute('aria-pressed', 'false');

toggleButton.addEventListener('click', function() {
  // Toggles visual state but doesn't update aria-pressed
  this.classList.toggle('pressed');
  console.log('Button toggled');
  // MISSING: this.setAttribute('aria-pressed', isPressed ? 'true' : 'false');
});

// Another example: aria-expanded never updated
const accordionHeader = document.getElementById('accordion-header');
const accordionPanel = document.getElementById('accordion-panel');

// ISSUE: aria-expanded set but never updated
accordionHeader.setAttribute('aria-expanded', 'false');

accordionHeader.addEventListener('click', function() {
  // Shows/hides panel but doesn't update aria-expanded
  const isHidden = accordionPanel.style.display === 'none';
  accordionPanel.style.display = isHidden ? 'block' : 'none';
  // MISSING: accordionHeader.setAttribute('aria-expanded', !isHidden);
});

// Another example: aria-checked on custom checkbox
const customCheckbox = document.getElementById('custom-checkbox');

// ISSUE: aria-checked set once, never updated
customCheckbox.setAttribute('role', 'checkbox');
customCheckbox.setAttribute('aria-checked', 'false');

customCheckbox.addEventListener('click', function() {
  this.classList.toggle('checked');
  // MISSING: Update aria-checked attribute
});

// -----------------------------------------------------------------------------
// ISSUE 5: ARIA Reference Not Found (Placeholder - needs ID tracking)
// WCAG 4.1.2 (Name, Role, Value)
// Expected detection: aria-reference-not-found (when infrastructure ready)
// -----------------------------------------------------------------------------

const dialog = document.getElementById('dialog');

// ISSUE: References ID that's never mentioned elsewhere in code
dialog.setAttribute('aria-labelledby', 'dialog-title-xyz-123');
dialog.setAttribute('aria-describedby', 'dialog-description-456');

// MISSING: Elements with id="dialog-title-xyz-123" and id="dialog-description-456"
// Note: This detection requires ID tracking infrastructure

// -----------------------------------------------------------------------------
// ISSUE 6: Missing Live Region (Placeholder - needs DOM tracking)
// WCAG 4.1.3 (Status Messages)
// Expected detection: missing-live-region (when infrastructure ready)
// -----------------------------------------------------------------------------

const statusMessage = document.getElementById('status');

// ISSUE: Dynamic content update without aria-live
setTimeout(function() {
  statusMessage.textContent = 'Loading complete!';
  // MISSING: aria-live attribute on statusMessage
}, 2000);

// Another example: Error message without live region
const errorContainer = document.getElementById('error-container');

function showError(message) {
  // ISSUE: Updating content without aria-live
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  // MISSING: aria-live attribute
}

// Note: This detection requires DOM operation tracking infrastructure

// =============================================================================
// PHASE 3: NEW ANALYZERS
// =============================================================================

// -----------------------------------------------------------------------------
// ISSUE 7: Unexpected Form Submit
// WCAG 3.2.2 (On Input)
// Expected detection: unexpected-form-submit
// -----------------------------------------------------------------------------

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// ISSUE: Form submits automatically on input change
searchInput.addEventListener('input', function() {
  // Unexpected auto-submit disorients users
  searchForm.submit();
});

// Another example: Submit on change
const filterSelect = document.getElementById('filter-select');
const filterForm = document.getElementById('filter-form');

// ISSUE: Form submits on select change
filterSelect.addEventListener('change', function() {
  filterForm.submit(); // Unexpected context change
});

// -----------------------------------------------------------------------------
// ISSUE 8: Unexpected Navigation
// WCAG 3.2.1 (On Focus), 3.2.2 (On Input)
// Expected detection: unexpected-navigation
// -----------------------------------------------------------------------------

const languageSelect = document.getElementById('language-select');

// ISSUE: Navigation on change event - unexpected context change
languageSelect.addEventListener('change', function() {
  window.location = '/lang/' + this.value;
});

// Another example: Navigation on input
const jumpToInput = document.getElementById('jump-to-page');

// ISSUE: Navigation triggered by input event
jumpToInput.addEventListener('input', function() {
  if (this.value.length >= 3) {
    window.location.href = '/page/' + this.value;
  }
});

// Another example: Navigation on focus (even worse!)
const focusNavInput = document.getElementById('focus-nav');

// ISSUE: Navigation on focus - highly disorienting
focusNavInput.addEventListener('focus', function() {
  location.assign('/dashboard');
});

// Alternative navigation methods also detected
const redirectSelect = document.getElementById('redirect-select');

redirectSelect.addEventListener('change', function() {
  // ISSUE: Using location.assign instead of click
  location.assign(this.value);
});

const reloadSelect = document.getElementById('reload-select');

reloadSelect.addEventListener('change', function() {
  // ISSUE: Reloading page on change
  location.reload();
});

// -----------------------------------------------------------------------------
// ISSUE 9: Unannounced Timeout
// WCAG 2.2.1 (Timing Adjustable)
// Expected detection: unannounced-timeout
// -----------------------------------------------------------------------------

// ISSUE: Timeout redirects to logout without warning
setTimeout(function() {
  window.location = '/logout';
}, 30000); // 30 seconds - no visible warning

// Another example: Major DOM change without warning
setTimeout(function() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '<p>Session expired</p>';
}, 60000); // ISSUE: Major change after 60 seconds, no warning

// Another example: Navigation with long delay
setTimeout(function() {
  location.assign('/expired');
}, 120000); // ISSUE: 2 minute timeout, surprise navigation

// -----------------------------------------------------------------------------
// ISSUE 10: Uncontrolled Auto-Update
// WCAG 2.2.2 (Pause, Stop, Hide)
// Expected detection: uncontrolled-auto-update
// -----------------------------------------------------------------------------

// ISSUE: setInterval without clearInterval - no way to pause
setInterval(function() {
  updateLiveFeed();
}, 5000);

function updateLiveFeed() {
  const feed = document.getElementById('live-feed');
  fetch('/api/updates')
    .then(response => response.json())
    .then(data => {
      feed.innerHTML = formatFeedData(data);
    });
}

function formatFeedData(data) {
  return data.map(item => `<div>${item.content}</div>`).join('');
}

// MISSING: No clearInterval call anywhere
// MISSING: No pause/stop control for users

// Another example: Auto-refreshing content
setInterval(function() {
  const stockPrices = document.getElementById('stock-prices');
  fetch('/api/stocks')
    .then(response => response.json())
    .then(prices => {
      stockPrices.textContent = formatPrices(prices);
    });
}, 3000); // ISSUE: Updates every 3 seconds with no control

function formatPrices(prices) {
  return prices.join(', ');
}

// Another example: Rotating banner
setInterval(function() {
  rotateBanner();
}, 10000); // ISSUE: Auto-rotates every 10 seconds

function rotateBanner() {
  const banner = document.querySelector('.banner');
  const images = banner.querySelectorAll('img');
  // Rotation logic...
}

// MISSING: No clearInterval for any of these intervals
// MISSING: No pause/stop buttons for users

// =============================================================================
// ADDITIONAL SEMANTIC ISSUES (Detected by SemanticAnalyzer)
// =============================================================================

// -----------------------------------------------------------------------------
// Non-Semantic Button Creation
// WCAG 4.1.2 (Name, Role, Value)
// Expected detection: non-semantic-button
// -----------------------------------------------------------------------------

// ISSUE: Creating div as button instead of using <button>
const fakeButton = document.createElement('div');
fakeButton.textContent = 'Click me';
fakeButton.className = 'button-styled';
fakeButton.addEventListener('click', function() {
  console.log('Fake button clicked');
});
document.body.appendChild(fakeButton);

// Another example: Assigning role="button" to non-semantic element
const anotherFakeButton = document.getElementById('fake-btn');
anotherFakeButton.setAttribute('role', 'button');
// ISSUE: Should use native <button> element instead

// Another example: span as button
const spanButton = document.createElement('span');
spanButton.setAttribute('role', 'button');
spanButton.textContent = 'Submit';
// ISSUE: Should use <button> element

// -----------------------------------------------------------------------------
// Non-Semantic Link Creation
// WCAG 4.1.2 (Name, Role, Value)
// Expected detection: non-semantic-link
// -----------------------------------------------------------------------------

// ISSUE: Assigning role="link" to non-semantic element
const fakeLink = document.getElementById('fake-link');
fakeLink.setAttribute('role', 'link');
// ISSUE: Should use native <a> element instead

console.log('Demo loaded: All 10+ new accessibility issues present');
