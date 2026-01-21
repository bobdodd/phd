"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutAnalyzer = void 0;
const BaseAnalyzer_1 = require("./BaseAnalyzer");
class TimeoutAnalyzer extends BaseAnalyzer_1.BaseAnalyzer {
    constructor() {
        super(...arguments);
        this.name = 'TimeoutAnalyzer';
        this.description = 'Detects time limits and timeouts that may prevent users from completing tasks';
        this.TIMEOUT_FUNCTIONS = new Set([
            'setTimeout',
            'setInterval'
        ]);
        this.SESSION_PATTERNS = [
            /session/i,
            /timeout/i,
            /expir/i,
            /logout/i,
            /auth/i,
            /token/i
        ];
        this.REDIRECT_PATTERNS = [
            /location\s*\.\s*href/i,
            /location\s*\.\s*assign/i,
            /location\s*\.\s*replace/i,
            /window\s*\.\s*location/i,
            /window\s*\.\s*open/i,
            /history\s*\.\s*push/i
        ];
        this.TWENTY_HOURS_MS = 20 * 60 * 60 * 1000;
        this.SHORT_TIMEOUT_THRESHOLD = 5 * 60 * 1000;
    }
    analyze(context) {
        const issues = [];
        if (!context.actionLanguageModel) {
            return issues;
        }
        const actionNodes = context.actionLanguageModel.nodes;
        issues.push(...this.detectTimeoutUsage(actionNodes, context));
        return issues;
    }
    detectTimeoutUsage(actionNodes, context) {
        const issues = [];
        for (const node of actionNodes) {
            const code = node.metadata?.sourceCode || '';
            const apiCall = node.metadata?.apiCall;
            if (this.TIMEOUT_FUNCTIONS.has(apiCall || '') ||
                /setTimeout|setInterval/i.test(code)) {
                const duration = this.extractTimeoutDuration(code, node);
                const isRedirect = this.REDIRECT_PATTERNS.some(pattern => pattern.test(code));
                const isSessionRelated = this.SESSION_PATTERNS.some(pattern => pattern.test(code));
                if (isRedirect) {
                    issues.push(...this.detectAutomaticRedirect(node, duration, context));
                }
                if (isSessionRelated) {
                    issues.push(...this.detectSessionTimeout(node, duration, context));
                }
                if (duration && duration < this.TWENTY_HOURS_MS && duration > 0) {
                    if (/countdown|timer|remaining|left/i.test(code)) {
                        issues.push(...this.detectCountdownTimer(node, duration, context));
                    }
                    if (/inactiv|idle/i.test(code) && duration < this.TWENTY_HOURS_MS) {
                        issues.push(...this.detectInactivityTimeout(node, duration, context));
                    }
                }
            }
        }
        return issues;
    }
    detectAutomaticRedirect(node, duration, context) {
        const issues = [];
        const durationText = duration ? this.formatDuration(duration) : 'unknown duration';
        const message = `Automatic redirect detected with ${durationText} delay. Automatically redirecting users violates WCAG 2.2.1 (Timing Adjustable) unless users can control the timing. Users must be able to turn off, adjust, or extend time limits. Provide a manual redirect option or allow users to disable automatic redirect.`;
        const fix = {
            description: 'Provide user control over redirect',
            code: `// ❌ DON'T automatically redirect without user control
// setTimeout(() => {
//   window.location.href = '/dashboard';
// }, 5000);

// ✅ DO provide user control and warning
let redirectTimer;
let secondsRemaining = ${duration ? Math.floor(duration / 1000) : 10};

function showRedirectWarning() {
  const warning = document.getElementById('redirect-warning');
  warning.innerHTML = \`
    <p>Redirecting in <span id="countdown">\${secondsRemaining}</span> seconds</p>
    <button onclick="cancelRedirect()">Stay on this page</button>
    <button onclick="redirectNow()">Go now</button>
  \`;
  warning.style.display = 'block';

  // Update countdown
  const countdownInterval = setInterval(() => {
    secondsRemaining--;
    document.getElementById('countdown').textContent = secondsRemaining;

    if (secondsRemaining <= 0) {
      clearInterval(countdownInterval);
      window.location.href = '/dashboard';
    }
  }, 1000);
}

function cancelRedirect() {
  clearTimeout(redirectTimer);
  document.getElementById('redirect-warning').style.display = 'none';
}

function redirectNow() {
  window.location.href = '/dashboard';
}

// Alternative: Just provide a link instead of auto-redirect
// <a href="/dashboard">Continue to dashboard</a>`,
            location: node.location
        };
        issues.push(this.createIssue('automatic-redirect-no-control', 'warning', message, node.location, ['2.2.1'], context, { fix }));
        return issues;
    }
    detectSessionTimeout(node, duration, context) {
        const issues = [];
        const durationText = duration ? this.formatDuration(duration) : 'unknown duration';
        const isShort = duration ? duration < this.SHORT_TIMEOUT_THRESHOLD : false;
        const severity = isShort ? 'error' : 'warning';
        const message = `Session timeout detected (${durationText}) without visible warning mechanism. WCAG 2.2.1 requires users be warned at least 20 seconds before session expires and given a simple way to extend the session. Users with disabilities may need extra time to complete forms or tasks. Implement a timeout warning dialog that appears before expiration.`;
        const fix = {
            description: 'Add session timeout warning with extension option',
            code: `// Session timeout with proper warning (WCAG 2.2.1 compliant)
const SESSION_DURATION = ${duration || 15 * 60 * 1000}; // 15 minutes
const WARNING_TIME = 2 * 60 * 1000; // Warn 2 minutes before expiration (at least 20 seconds)

let sessionTimer;
let warningTimer;
let sessionStartTime = Date.now();

function startSession() {
  sessionStartTime = Date.now();

  // Set warning timer (fires before actual timeout)
  warningTimer = setTimeout(() => {
    showSessionWarning();
  }, SESSION_DURATION - WARNING_TIME);

  // Set actual session timeout
  sessionTimer = setTimeout(() => {
    logoutUser();
  }, SESSION_DURATION);
}

function showSessionWarning() {
  // Show modal dialog warning user
  const modal = document.getElementById('session-warning-modal');
  modal.innerHTML = \`
    <div role="alertdialog" aria-labelledby="session-warning-title" aria-describedby="session-warning-desc">
      <h2 id="session-warning-title">Session Expiring Soon</h2>
      <p id="session-warning-desc">
        Your session will expire in 2 minutes due to inactivity.
      </p>
      <button onclick="extendSession()" autofocus>
        Stay signed in
      </button>
      <button onclick="logoutUser()">
        Sign out now
      </button>
    </div>
  \`;
  modal.style.display = 'block';

  // Focus the extend button
  modal.querySelector('button').focus();
}

function extendSession() {
  // Clear existing timers
  clearTimeout(sessionTimer);
  clearTimeout(warningTimer);

  // Hide warning
  document.getElementById('session-warning-modal').style.display = 'none';

  // Restart session
  startSession();
}

function logoutUser() {
  // Clear session and redirect to login
  clearTimeout(sessionTimer);
  clearTimeout(warningTimer);
  // ... logout logic ...
}

// Start session on load
startSession();

// Reset timers on user activity (optional but helpful)
['click', 'keydown', 'mousemove'].forEach(event => {
  document.addEventListener(event, () => {
    // Only reset if user was active within session window
    if (Date.now() - sessionStartTime < SESSION_DURATION - WARNING_TIME) {
      clearTimeout(sessionTimer);
      clearTimeout(warningTimer);
      startSession();
    }
  });
});`,
            location: node.location
        };
        issues.push(this.createIssue('session-timeout-no-warning', severity, message, node.location, ['2.2.1'], context, { fix }));
        return issues;
    }
    detectCountdownTimer(node, duration, context) {
        const issues = [];
        const durationText = this.formatDuration(duration);
        const message = `Countdown timer detected (${durationText}) without extension mechanism. If this timer limits the time to complete a task (form, quiz, checkout), users must be able to extend it per WCAG 2.2.1. Provide a way to extend the time limit with a simple action (button, checkbox). Exceptions: real-time events (auctions) or essential timeouts (timed exams).`;
        const fix = {
            description: 'Add time extension capability',
            code: `// Countdown timer with extension (WCAG 2.2.1 compliant)
let timeRemaining = ${Math.floor(duration / 1000)}; // seconds
let timerInterval;
let canExtend = true;

function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay(timeRemaining);

    // Show extension option when 20 seconds remain
    if (timeRemaining === 20 && canExtend) {
      showExtensionOption();
    }

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById('timer').textContent =
    \`\${minutes}:\${secs.toString().padStart(2, '0')}\`;
}

function showExtensionOption() {
  const extensionDiv = document.getElementById('timer-extension');
  extensionDiv.innerHTML = \`
    <div role="alert">
      <p>Time is running low. Need more time?</p>
      <button onclick="extendTimer()">Add 5 more minutes</button>
    </div>
  \`;
  extensionDiv.style.display = 'block';
}

function extendTimer() {
  timeRemaining += 5 * 60; // Add 5 minutes
  document.getElementById('timer-extension').style.display = 'none';
  canExtend = false; // Optional: limit extensions
}

function handleTimeout() {
  // Handle timeout gracefully - don't lose user's work!
  alert('Time expired. Your progress has been saved.');
}

// Alternative: Provide unlimited time option
// <label>
//   <input type="checkbox" id="unlimited-time" />
//   I need unlimited time to complete this (accessibility option)
// </label>`,
            location: node.location
        };
        issues.push(this.createIssue('countdown-timer-no-extension', 'warning', message, node.location, ['2.2.1'], context, { fix }));
        return issues;
    }
    detectInactivityTimeout(node, duration, context) {
        const issues = [];
        const durationText = this.formatDuration(duration);
        const hoursRemaining = duration / (60 * 60 * 1000);
        const message = `Inactivity timeout detected (${durationText}, ${hoursRemaining.toFixed(1)} hours). WCAG 2.2.1 allows inactivity timeouts shorter than 20 hours ONLY if user data is preserved and users can continue where they left off after re-authenticating. If this timeout discards user data (form inputs, progress), it violates WCAG. Either extend timeout to 20+ hours or preserve all user data.`;
        const fix = {
            description: 'Extend timeout or preserve user data',
            code: `// Option 1: Extend timeout to 20+ hours (compliant)
const INACTIVITY_TIMEOUT = 20 * 60 * 60 * 1000; // 20 hours

// Option 2: Preserve user data on timeout
function handleInactivityTimeout() {
  // Save all form data to localStorage
  const formData = new FormData(document.querySelector('form'));
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  localStorage.setItem('saved-form-data', JSON.stringify(data));

  // Save scroll position
  localStorage.setItem('scroll-position', window.scrollY);

  // Then logout/redirect
  logout();
}

// Restore data on return
window.addEventListener('load', () => {
  const savedData = localStorage.getItem('saved-form-data');
  if (savedData) {
    const data = JSON.parse(savedData);
    const form = document.querySelector('form');

    // Restore form values
    Object.keys(data).forEach(key => {
      const input = form.elements[key];
      if (input) input.value = data[key];
    });

    // Restore scroll position
    const scrollPos = localStorage.getItem('scroll-position');
    if (scrollPos) window.scrollTo(0, parseInt(scrollPos));

    // Show message
    alert('Your previous session was restored. Continue where you left off.');
  }
});

// Option 3: No timeout for form/data entry pages
// Don't timeout while user is actively working on forms`,
            location: node.location
        };
        issues.push(this.createIssue('inactivity-timeout-too-short', 'info', message, node.location, ['2.2.1'], context, { fix }));
        return issues;
    }
    extractTimeoutDuration(code, node) {
        if (node.metadata?.timeoutDuration) {
            return node.metadata.timeoutDuration;
        }
        const match = code.match(/set(?:Timeout|Interval)\s*\([^,]+,\s*(\d+)\s*\)/);
        if (match) {
            return parseInt(match[1], 10);
        }
        const durationMatch = code.match(/(\d+)\s*\*\s*60\s*\*\s*1000/);
        if (durationMatch) {
            return parseInt(durationMatch[1], 10) * 60 * 1000;
        }
        return null;
    }
    formatDuration(ms) {
        if (ms < 1000) {
            return `${ms}ms`;
        }
        else if (ms < 60000) {
            return `${(ms / 1000).toFixed(0)} seconds`;
        }
        else if (ms < 3600000) {
            return `${(ms / 60000).toFixed(0)} minutes`;
        }
        else {
            return `${(ms / 3600000).toFixed(1)} hours`;
        }
    }
}
exports.TimeoutAnalyzer = TimeoutAnalyzer;
