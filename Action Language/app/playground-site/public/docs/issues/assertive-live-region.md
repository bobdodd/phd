# Assertive Live Region Overuse

**Issue Type:** `assertive-live-region`
**Severity:** Warning
**WCAG:** 4.1.3 (Status Messages)

## Description

This issue occurs when an element uses `aria-live="assertive"`, which interrupts screen readers immediately to announce updates. Assertive live regions should be reserved for urgent, critical information that requires immediate user attention. Overuse disrupts the user experience and can cause important content to be missed.

## Why This Matters

Screen readers have two levels of live region urgency:
- **Polite** (`aria-live="polite"`): Waits for user to pause before announcing
- **Assertive** (`aria-live="assertive"`): Interrupts immediately

Assertive announcements:
- Stop the screen reader mid-sentence
- Can interrupt important information
- May cause users to lose their place
- Create a jarring, disruptive experience

Most updates should use `polite` to respect the user's current focus and activity.

## Examples

### ❌ Problematic Code

```javascript
// Form validation - NOT urgent!
const errorContainer = document.getElementById('form-errors');
errorContainer.setAttribute('aria-live', 'assertive'); // TOO AGGRESSIVE!
errorContainer.textContent = 'Email format is invalid';

// Search results - NOT urgent!
const resultsStatus = document.getElementById('search-status');
resultsStatus.setAttribute('aria-live', 'assertive'); // UNNECESSARY!
resultsStatus.textContent = 'Found 42 results';

// Loading states - NOT urgent!
const loadingStatus = document.getElementById('loading');
loadingStatus.setAttribute('aria-live', 'assertive'); // ANNOYING!
loadingStatus.textContent = 'Loading...';

// Auto-save notifications - NOT urgent!
const saveStatus = document.getElementById('save-status');
saveStatus.setAttribute('aria-live', 'assertive'); // TOO DISRUPTIVE!
saveStatus.textContent = 'Draft saved';
```

### ✅ Correct Code

```javascript
// Form validation - use polite
const errorContainer = document.getElementById('form-errors');
errorContainer.setAttribute('aria-live', 'polite'); // ✓ Non-disruptive
errorContainer.setAttribute('role', 'status');
errorContainer.textContent = 'Email format is invalid';

// Search results - use polite
const resultsStatus = document.getElementById('search-status');
resultsStatus.setAttribute('aria-live', 'polite'); // ✓ Respectful
resultsStatus.setAttribute('role', 'status');
resultsStatus.textContent = 'Found 42 results';

// Loading states - use polite
const loadingStatus = document.getElementById('loading');
loadingStatus.setAttribute('aria-live', 'polite'); // ✓ Patient
loadingStatus.setAttribute('aria-busy', 'true');
loadingStatus.textContent = 'Loading...';

// Critical errors - assertive is appropriate
const criticalError = document.getElementById('critical-error');
criticalError.setAttribute('aria-live', 'assertive'); // ✓ Urgent!
criticalError.setAttribute('role', 'alert');
criticalError.textContent = 'Connection lost. Your work may not be saved.';

// Session timeout warning - assertive is appropriate
const timeoutWarning = document.getElementById('timeout-warning');
timeoutWarning.setAttribute('aria-live', 'assertive'); // ✓ Time-sensitive!
timeoutWarning.setAttribute('role', 'alert');
timeoutWarning.textContent = 'Session will expire in 60 seconds';
```

## When to Use Assertive

### ✅ Appropriate Uses (Rare!)

**Critical System Errors**
```javascript
// Server error preventing work
alert.setAttribute('aria-live', 'assertive');
alert.setAttribute('role', 'alert');
alert.textContent = 'Server error: Unable to save your work';
```

**Time-Sensitive Warnings**
```javascript
// Session about to expire
warning.setAttribute('aria-live', 'assertive');
warning.setAttribute('role', 'alert');
warning.textContent = 'Session expires in 30 seconds. Click to extend.';
```

**Security Alerts**
```javascript
// Account security issue
alert.setAttribute('aria-live', 'assertive');
alert.setAttribute('role', 'alert');
alert.textContent = 'Suspicious activity detected. Please verify your identity.';
```

**Data Loss Prevention**
```javascript
// Connection lost during critical operation
alert.setAttribute('aria-live', 'assertive');
alert.setAttribute('role', 'alert');
alert.textContent = 'Connection lost. Reconnecting...';
```

### ❌ Inappropriate Uses (Use Polite Instead)

- ❌ Form validation errors
- ❌ Search results counts
- ❌ Loading/progress indicators
- ❌ Auto-save confirmations
- ❌ General notifications
- ❌ Content updates
- ❌ Filter results
- ❌ Sort order changes
- ❌ Pagination updates
- ❌ Chat messages (non-emergency)

## Alternative Approaches

### Use role="status" (Implicit Polite)
```javascript
// Status updates are implicitly polite
const status = document.getElementById('status');
status.setAttribute('role', 'status'); // Equivalent to aria-live="polite"
status.textContent = 'Changes saved';
```

### Use role="alert" (Implicit Assertive)
```javascript
// Alerts are implicitly assertive - use sparingly!
const alert = document.getElementById('alert');
alert.setAttribute('role', 'alert'); // Equivalent to aria-live="assertive"
alert.textContent = 'Critical error occurred';
```

### Use aria-live="polite" (Default Choice)
```javascript
// Most dynamic content should use polite
const updates = document.getElementById('updates');
updates.setAttribute('aria-live', 'polite');
updates.setAttribute('aria-atomic', 'true');
```

### Use aria-live="off" (Silence Updates)
```javascript
// Disable announcements for purely decorative updates
const decorative = document.getElementById('decorative-animation');
decorative.setAttribute('aria-live', 'off');
```

## Complete Pattern Examples

### Polite Status Updates
```javascript
function createStatusRegion() {
  const status = document.createElement('div');
  status.id = 'status-region';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  status.className = 'sr-only'; // Visually hidden
  document.body.appendChild(status);
  return status;
}

function announceStatus(message) {
  const status = document.getElementById('status-region');
  status.textContent = message;
}

// Usage
announceStatus('Form submitted successfully');
announceStatus('5 items added to cart');
announceStatus('Search returned 42 results');
```

### Assertive Alert (Rare!)
```javascript
function createAlertRegion() {
  const alert = document.createElement('div');
  alert.id = 'alert-region';
  alert.setAttribute('role', 'alert');
  alert.setAttribute('aria-live', 'assertive');
  alert.setAttribute('aria-atomic', 'true');
  alert.className = 'sr-only';
  document.body.appendChild(alert);
  return alert;
}

function announceAlert(message) {
  const alert = document.getElementById('alert-region');
  alert.textContent = message;
}

// Usage - ONLY for critical situations
announceAlert('Connection lost - attempting to reconnect');
announceAlert('Session expiring in 30 seconds');
```

## React Component Example

```typescript
function LiveRegion({ message, priority = 'polite' }) {
  return (
    <div
      role={priority === 'assertive' ? 'alert' : 'status'}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Usage
function MyForm() {
  const [status, setStatus] = useState('');

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>

      {/* Most updates should be polite */}
      <LiveRegion message={status} priority="polite" />

      {/* Reserve assertive for true emergencies */}
      {criticalError && (
        <LiveRegion
          message="Critical error: Unable to save"
          priority="assertive"
        />
      )}
    </>
  );
}
```

## How to Fix

1. **Evaluate urgency**: Is this truly critical/urgent information?
2. **Default to polite**: Change `aria-live="assertive"` to `"polite"`
3. **Use role="status"**: Consider implicit polite announcements
4. **Reserve assertive for emergencies**: Only for critical errors, time-sensitive warnings, security issues
5. **Test with screen reader**: Verify announcements don't interrupt important content

## Decision Tree

```
Is the information:
├─ Blocking user's ability to continue work?
│  └─ YES → Assertive might be appropriate
│
├─ Time-sensitive and requires immediate action?
│  └─ YES → Assertive might be appropriate
│
├─ Related to data loss or security?
│  └─ YES → Assertive might be appropriate
│
└─ Anything else?
   └─ NO → Use polite (or role="status")
```

## Related Issues

- [missing-required-aria](./missing-required-aria.md) - Missing required ARIA attributes
- [static-aria](./static-aria.md) - Static ARIA state values

## Resources

- [WCAG 4.1.3: Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [aria-live (ARIA 1.2)](https://www.w3.org/TR/wai-aria-1.2/#aria-live)
- [Using role="alert"](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19.html)
