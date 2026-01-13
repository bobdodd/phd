/**
 * Accessible Live Regions Implementation
 * Demonstrates proper use of ARIA live regions for dynamic updates
 */

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Scenario 1: Status messages
    const goodSave = document.getElementById('good-save');
    const goodRefresh = document.getElementById('good-refresh');
    const goodExport = document.getElementById('good-export');
    const goodStatus1 = document.getElementById('good-status-1');

    // Scenario 2: Error alerts
    const goodError = document.getElementById('good-error');
    const goodWarning = document.getElementById('good-warning');
    const goodAlert1 = document.getElementById('good-alert-1');

    // Scenario 3: Loading states
    const goodLoad = document.getElementById('good-load');
    const goodLoadingStatus = document.getElementById('good-loading-status');

    // Scenario 4: Form validation
    const goodEmail = document.getElementById('good-email');
    const goodEmailError = document.getElementById('good-email-error');

    if (!goodSave) return;

    // Scenario 1: Status messages
    goodSave.addEventListener('click', () => {
      goodStatus1.textContent = 'Saving changes...';
      setTimeout(() => {
        goodStatus1.textContent = 'Changes saved successfully ✓';
      }, 1500);
    });

    goodRefresh.addEventListener('click', () => {
      goodStatus1.textContent = 'Refreshing data...';
      setTimeout(() => {
        goodStatus1.textContent = 'Data refreshed ✓';
      }, 2000);
    });

    goodExport.addEventListener('click', () => {
      goodStatus1.textContent = 'Exporting data...';
      setTimeout(() => {
        goodStatus1.textContent = 'Export complete ✓';
      }, 1800);
    });

    // Scenario 2: Error alerts
    goodError.addEventListener('click', () => {
      goodAlert1.textContent = 'Error: Unable to complete operation';
      goodAlert1.style.display = 'block';
      setTimeout(() => {
        goodAlert1.style.display = 'none';
      }, 4000);
    });

    goodWarning.addEventListener('click', () => {
      goodAlert1.textContent = 'Warning: Check your input before proceeding';
      goodAlert1.style.display = 'block';
      setTimeout(() => {
        goodAlert1.style.display = 'none';
      }, 4000);
    });

    // Scenario 3: Loading states
    goodLoad.addEventListener('click', () => {
      goodLoadingStatus.innerHTML = '<span class="loading-spinner"></span> Loading data...';
      goodLoadingStatus.setAttribute('aria-busy', 'true');

      setTimeout(() => {
        goodLoadingStatus.textContent = 'Data loaded successfully ✓';
        goodLoadingStatus.removeAttribute('aria-busy');
      }, 3000);
    });

    // Scenario 4: Form validation
    goodEmail.addEventListener('blur', () => {
      const email = goodEmail.value.trim();
      if (email && !isValidEmail(email)) {
        goodEmail.classList.add('error');
        goodEmailError.textContent = 'Please enter a valid email address';
        goodEmailError.style.display = 'block';
      } else if (email) {
        goodEmail.classList.remove('error');
        goodEmail.classList.add('success');
        goodEmailError.style.display = 'none';
      }
    });

    goodEmail.addEventListener('input', () => {
      if (goodEmail.classList.contains('error')) {
        goodEmail.classList.remove('error');
        goodEmailError.style.display = 'none';
      }
    });

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }
})();
