/**
 * Inaccessible Live Regions Implementation
 * INTENTIONAL VIOLATIONS
 *
 * Issues:
 * - Dynamic content updates without role="status" or aria-live
 * - Error messages without role="alert"
 * - Loading states without aria-live or aria-busy
 * - Form validation errors not announced
 * - textContent changes that are silent to screen readers
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Scenario 1: Status messages
    const badSave = document.getElementById('bad-save');
    const badRefresh = document.getElementById('bad-refresh');
    const badExport = document.getElementById('bad-export');
    const badStatus1 = document.getElementById('bad-status-1');

    // Scenario 2: Error alerts
    const badError = document.getElementById('bad-error');
    const badWarning = document.getElementById('bad-warning');
    const badAlert1 = document.getElementById('bad-alert-1');

    // Scenario 3: Loading states
    const badLoad = document.getElementById('bad-load');
    const badLoadingStatus = document.getElementById('bad-loading-status');

    // Scenario 4: Form validation
    const badEmail = document.getElementById('bad-email');
    const badEmailError = document.getElementById('bad-email-error');

    if (!badSave) return;

    // Scenario 1: Status messages WITHOUT live region
    badSave.addEventListener('click', () => {
      // ISSUE: textContent update without role="status" or aria-live
      badStatus1.textContent = 'Saving changes...';
      // Missing: Live region announcement

      setTimeout(() => {
        // ISSUE: Another silent update
        badStatus1.textContent = 'Changes saved successfully ✓';
        // Missing: Screen reader has no idea this changed
      }, 1500);
    });

    badRefresh.addEventListener('click', () => {
      // ISSUE: Dynamic update not announced
      badStatus1.textContent = 'Refreshing data...';

      setTimeout(() => {
        badStatus1.textContent = 'Data refreshed ✓';
      }, 2000);
    });

    badExport.addEventListener('click', () => {
      // ISSUE: Status change not communicated to AT
      badStatus1.textContent = 'Exporting data...';

      setTimeout(() => {
        badStatus1.textContent = 'Export complete ✓';
      }, 1800);
    });

    // Scenario 2: Error alerts WITHOUT role="alert"
    badError.addEventListener('click', () => {
      // ISSUE: Error message not announced
      // Missing: role="alert" on container
      badAlert1.textContent = 'Error: Unable to complete operation';
      badAlert1.style.display = 'block';

      setTimeout(() => {
        badAlert1.style.display = 'none';
      }, 4000);
    });

    badWarning.addEventListener('click', () => {
      // ISSUE: Warning not announced to screen readers
      badAlert1.textContent = 'Warning: Check your input before proceeding';
      badAlert1.style.display = 'block';

      setTimeout(() => {
        badAlert1.style.display = 'none';
      }, 4000);
    });

    // Scenario 3: Loading states WITHOUT aria-live or aria-busy
    badLoad.addEventListener('click', () => {
      // ISSUE: Loading state not communicated
      // Missing: aria-live and aria-busy attributes
      badLoadingStatus.innerHTML = '<span class="loading-spinner"></span> Loading data...';

      setTimeout(() => {
        // ISSUE: Completion not announced
        badLoadingStatus.textContent = 'Data loaded successfully ✓';
      }, 3000);
    });

    // Scenario 4: Form validation WITHOUT announcements
    badEmail.addEventListener('blur', () => {
      const email = badEmail.value.trim();

      if (email && !isValidEmail(email)) {
        badEmail.classList.add('error');

        // ISSUE: Validation error not announced
        // Missing: role="alert" on error container
        // Missing: aria-describedby association
        badEmailError.textContent = 'Please enter a valid email address';
        badEmailError.style.display = 'block';
      } else if (email) {
        badEmail.classList.remove('error');
        badEmail.classList.add('success');
        badEmailError.style.display = 'none';
      }
    });

    badEmail.addEventListener('input', () => {
      if (badEmail.classList.contains('error')) {
        badEmail.classList.remove('error');
        badEmailError.style.display = 'none';
      }
    });

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Missing throughout:
    // - role="status" on status containers
    // - role="alert" on error containers
    // - aria-live="polite" or aria-live="assertive"
    // - aria-busy for loading states
    // - aria-describedby for form errors
    // - Live region containers in the DOM from page load

    // Result: All dynamic updates are SILENT to screen readers
    // Screen reader users have no idea when content changes!
  }
})();
