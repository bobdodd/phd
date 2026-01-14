# Implementation Plan: 10 New Static Analysis Detections

This document details how we'll implement 10 new accessibility issue detections using static JavaScript analysis.

---

## Overview

**Goal:** Add 10 new issue types to increase from 25 to 35 total detections
**Approach:** Enhance existing analyzers + create 2 new specialized analyzers
**Timeline:** 3 phases

---

## Phase 1: Enhance KeyboardAnalyzer (3 new issues)

### 1.1 Missing Escape Key in Focus Traps
**Issue Type:** `missing-escape-handler`
**Severity:** Warning
**WCAG:** 2.1.2 (No Keyboard Trap)

**Detection Logic:**
```javascript
// Find keydown handlers that trap Tab but don't handle Escape
if (handler has Tab key check AND preventDefault on Tab) {
  if (handler does NOT have Escape key check) {
    issue: missing-escape-handler
  }
}
```

**Implementation in KeyboardAnalyzer:**
- Enhance `analyzePatterns()` method
- Add `detectMissingEscapeInTraps()` method
- Track Tab handlers with preventDefault
- Check if same handler or nearby handlers handle Escape

**Example:**
```javascript
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault(); // Focus trap
    // ISSUE: No Escape key to exit trap
  }
});
```

---

### 1.2 Incomplete Activation Keys
**Issue Type:** `incomplete-activation-keys`
**Severity:** Warning
**WCAG:** 2.1.1 (Keyboard)

**Detection Logic:**
```javascript
// For elements with role="button" or role="link"
if (element has keydown handler) {
  if (handler checks Enter BUT NOT Space) {
    issue: incomplete-activation-keys (missing Space)
  }
  if (handler checks Space BUT NOT Enter) {
    issue: incomplete-activation-keys (missing Enter)
  }
}
```

**Implementation:**
- Add `detectIncompleteActivation()` method
- Cross-reference ARIAAnalyzer data (role="button")
- Check keydown handlers for activation keys
- Flag if only one of Enter/Space is handled

**Example:**
```javascript
customButton.setAttribute('role', 'button');
customButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { activate(); }
  // ISSUE: Missing Space key (buttons need both)
});
```

---

### 1.3 Touch Without Click Fallback
**Issue Type:** `touch-without-click`
**Severity:** Warning
**WCAG:** 2.5.2 (Pointer Cancellation)

**Detection Logic:**
```javascript
// Compare touch and click handlers on same element
if (element has touchstart OR touchend handler) {
  if (element does NOT have click handler) {
    issue: touch-without-click
  }
}
```

**Implementation:**
- Track touch event handlers in EventAnalyzer data
- Compare with click handlers per element
- Flag elements with touch-only interaction

**Example:**
```javascript
button.addEventListener('touchstart', handleTouch);
// ISSUE: No click handler for mouse/keyboard users
```

---

## Phase 2: Enhance ARIAAnalyzer (3 new issues)

### 2.1 Static ARIA States (Never Updated)
**Issue Type:** `static-aria-state`
**Severity:** Warning
**WCAG:** 4.1.2 (Name, Role, Value)

**Detection Logic:**
```javascript
// Track ARIA state attributes
const dynamicStates = ['aria-pressed', 'aria-checked', 'aria-selected', 'aria-expanded'];

for (attribute in dynamicStates) {
  if (attribute is SET in code) {
    if (attribute is NEVER updated later in any handler) {
      issue: static-aria-state
    }
  }
}
```

**Implementation in ARIAAnalyzer:**
- Track all aria-* setAttribute calls
- Track all aria-* updates in event handlers
- Flag dynamic states that are set once but never updated
- Cross-reference with EventAnalyzer for handler context

**Example:**
```javascript
button.setAttribute('aria-pressed', 'false');
button.addEventListener('click', toggle);
// ISSUE: aria-pressed never updated in toggle handler
```

---

### 2.2 ARIA Reference Never Mentioned
**Issue Type:** `aria-reference-not-found`
**Severity:** Info
**WCAG:** 4.1.2 (Name, Role, Value)

**Detection Logic:**
```javascript
// Track ID references in ARIA attributes
if (aria-labelledby OR aria-describedby OR aria-controls is set with ID) {
  if (ID is NEVER used in getElementById, querySelector, or createElement with id=) {
    issue: aria-reference-not-found
  }
}
```

**Implementation:**
- Track aria-labelledby, aria-describedby, aria-controls values
- Track all ID references (getElementById, querySelector('#id'), createElement + id)
- Flag referenced IDs never seen in code
- Note: Can't guarantee DOM existence, but can flag suspicious references

**Example:**
```javascript
dialog.setAttribute('aria-labelledby', 'dialog-title-xyz');
// ISSUE: 'dialog-title-xyz' never mentioned elsewhere in code
```

---

### 2.3 Missing Live Region for Dynamic Content
**Issue Type:** `missing-live-region`
**Severity:** Warning
**WCAG:** 4.1.3 (Status Messages)

**Detection Logic:**
```javascript
// Track dynamic text content updates
if (element.textContent = value OR element.innerHTML = value) {
  if (element does NOT have aria-live set) {
    if (update is NOT in response to user click on same element) {
      issue: missing-live-region
    }
  }
}
```

**Implementation:**
- Track textContent/innerHTML assignments
- Check if element has aria-live attribute set
- Consider: immediate updates after click may not need live region
- Flag asynchronous updates (in setTimeout, fetch.then, etc.)

**Example:**
```javascript
setTimeout(() => {
  statusDiv.textContent = 'Loading complete';
  // ISSUE: No aria-live, screen readers won't announce
}, 2000);
```

---

## Phase 3: New Specialized Analyzers (4 new issues)

### 3.1 ContextChangeAnalyzer

**Purpose:** Detect unexpected context changes (navigation, form submission)

#### 3.1.1 Form Submit on Input/Change
**Issue Type:** `unexpected-form-submit`
**Severity:** Warning
**WCAG:** 3.2.2 (On Input)

**Detection Logic:**
```javascript
// Find form.submit() in input/change handlers
if (element is form input) {
  if (input OR change handler calls form.submit()) {
    issue: unexpected-form-submit
  }
}
```

**Example:**
```javascript
input.addEventListener('input', () => {
  form.submit(); // ISSUE: Unexpected submission
});
```

#### 3.1.2 Navigation on Input/Change
**Issue Type:** `unexpected-navigation`
**Severity:** Warning
**WCAG:** 3.2.2 (On Input)

**Detection Logic:**
```javascript
if (change OR input handler) {
  if (handler sets window.location OR calls location.assign/replace/reload) {
    issue: unexpected-navigation
  }
}
```

**Example:**
```javascript
select.addEventListener('change', () => {
  window.location = select.value; // ISSUE: Unexpected navigation
});
```

---

### 3.2 TimingAnalyzer

**Purpose:** Detect timing-related accessibility issues

#### 3.2.1 Timeout Without Warning
**Issue Type:** `unannounced-timeout`
**Severity:** Warning
**WCAG:** 2.2.1 (Timing Adjustable)

**Detection Logic:**
```javascript
// Find setTimeout with significant actions
if (setTimeout with duration > 5000ms) {
  if (callback does navigation OR major DOM changes) {
    if (NO preceding warning/announcement detected) {
      issue: unannounced-timeout
    }
  }
}
```

**Example:**
```javascript
setTimeout(() => {
  window.location = '/logout'; // ISSUE: No warning
}, 30000);
```

#### 3.2.2 Uncontrolled Auto-Update
**Issue Type:** `uncontrolled-auto-update`
**Severity:** Warning
**WCAG:** 2.2.2 (Pause, Stop, Hide)

**Detection Logic:**
```javascript
// Find setInterval without clearInterval
const intervalIds = track setInterval calls;
const clearedIds = track clearInterval calls;

for (id in intervalIds) {
  if (id NOT in clearedIds) {
    issue: uncontrolled-auto-update
  }
}
```

**Example:**
```javascript
setInterval(() => {
  updateFeed(); // ISSUE: No way to pause
}, 5000);
```

---

### 3.3 SemanticAnalyzer

**Purpose:** Detect non-semantic element usage

#### 3.3.1 Non-Semantic Button Creation
**Issue Type:** `non-semantic-button`
**Severity:** Info
**WCAG:** 4.1.2 (Name, Role, Value)

**Detection Logic:**
```javascript
// Find createElement('div') or createElement('span') with click handler
if (createElement('div') OR createElement('span')) {
  if (element gets click handler OR role="button") {
    issue: non-semantic-button
    suggestion: Use createElement('button') instead
  }
}
```

**Example:**
```javascript
const btn = document.createElement('div');
btn.addEventListener('click', action);
// ISSUE: Should use <button>
```

---

## Implementation Files

### New Files to Create
1. `src/analyzer/ContextChangeAnalyzer.js` - Context change detection
2. `src/analyzer/TimingAnalyzer.js` - Timeout/interval analysis
3. `src/analyzer/SemanticAnalyzer.js` - Semantic HTML validation

### Files to Modify
1. `src/analyzer/KeyboardAnalyzer.js` - Add 3 new detections
2. `src/analyzer/ARIAAnalyzer.js` - Add 3 new detections
3. `src/analyzer/AccessibilityReporter.js` - Integrate new analyzers
4. `src/analyzer/index.js` - Export new analyzers

### Demo Files to Create/Update
1. `demo/js/inaccessible/timing-issues.js` - Timeout/interval examples
2. `demo/js/inaccessible/context-changes.js` - Navigation/submit examples
3. `demo/js/inaccessible/semantic-issues.js` - Non-semantic element examples
4. Update `demo/ISSUE_COVERAGE.md` with new issues

---

## Testing Strategy

### Unit Tests
For each new detection, create test cases:
```javascript
// Test: missing-escape-handler
const code = `
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  });
`;
const issues = analyze(code);
expect(issues).toContainIssue('missing-escape-handler');
```

### Integration Tests
- Test with demo files
- Verify no false positives on accessible examples
- Verify all issues caught in inaccessible examples

### Edge Cases
- Multiple event handlers on same element
- Conditional key checks
- Event delegation patterns
- Dynamic event handler attachment

---

## Success Criteria

### Functionality
- [ ] All 10 new issue types detected correctly
- [ ] No false positives on accessible code
- [ ] Accurate line number reporting
- [ ] Helpful fix suggestions

### Performance
- [ ] Analysis time increase < 20%
- [ ] Memory usage acceptable
- [ ] Scales to large files (>1000 lines)

### Code Quality
- [ ] Well-documented code
- [ ] Consistent with existing analyzer patterns
- [ ] Test coverage > 80%

### User Experience
- [ ] Clear issue messages
- [ ] Actionable fix suggestions
- [ ] Correct WCAG criterion mapping
- [ ] VSCode integration works

---

## Rollout Plan

### Week 1: Phase 1 - KeyboardAnalyzer Enhancements
- Day 1-2: Implement missing-escape-handler
- Day 3-4: Implement incomplete-activation-keys
- Day 5: Implement touch-without-click + tests

### Week 2: Phase 2 - ARIAAnalyzer Enhancements
- Day 1-2: Implement static-aria-state
- Day 3: Implement aria-reference-not-found
- Day 4-5: Implement missing-live-region + tests

### Week 3: Phase 3 - New Analyzers
- Day 1-2: Create ContextChangeAnalyzer (2 issues)
- Day 3: Create TimingAnalyzer (2 issues)
- Day 4: Create SemanticAnalyzer (1 issue)
- Day 5: Integration + testing

### Week 4: Demo & Documentation
- Day 1-2: Create demo examples for all 10 issues
- Day 3-4: Update documentation
- Day 5: Final testing + release prep

---

## Next Steps

1. ✅ Get approval on implementation plan
2. Start with Phase 1 (KeyboardAnalyzer enhancements)
3. Create branch: `feature/enhanced-detections`
4. Implement missing-escape-handler first (highest priority)
5. Add tests and demo example
6. Review and iterate

Ready to start implementation? 🚀
