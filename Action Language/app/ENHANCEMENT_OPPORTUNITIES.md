# Enhancement Opportunities: New Accessibility Detections

This document identifies additional accessibility issues we could detect by enhancing our analyzers.

## Current Coverage: 25+ Issue Types ✅

We already detect comprehensive issues across:
- Focus Management (6 types)
- Keyboard Navigation (6 types)
- ARIA Usage (7 types)
- Widget Patterns (6+ patterns)

---

## New Detection Opportunities

### Category A: Advanced Keyboard Patterns

#### 1. **Missing Focus Indicators**
**What:** Detect when `:focus` styles are removed or overridden
**Detection:**
- Parse CSS or style modifications
- Look for `outline: none` without alternative focus indicator
- Check for `element.style.outline = 'none'`

**Example:**
```javascript
button.style.outline = 'none'; // ISSUE: Removes focus indicator
// Should provide alternative: box-shadow, border, etc.
```

**WCAG:** 2.4.7 (Focus Visible)
**Severity:** Warning
**Issue Type:** `focus-indicator-removed`

---

#### 2. **Incomplete Escape Key Handling**
**What:** Elements that trap focus but don't handle Escape
**Detection:**
- Find elements with `tabindex` manipulation
- Check if keydown handler exists with Escape key
- Identify modal/dialog patterns without Escape

**Example:**
```javascript
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') { /* trap */ }
  // ISSUE: Missing Escape handler
});
```

**WCAG:** 2.1.2 (No Keyboard Trap)
**Severity:** Error
**Issue Type:** `missing-escape-handler`

---

#### 3. **Incomplete Enter/Space Activation**
**What:** Custom buttons/links that only handle one activation key
**Detection:**
- Find role="button" or role="link"
- Check if keydown handles BOTH Enter AND Space
- Flag if only one is handled

**Example:**
```javascript
customBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { activate(); }
  // ISSUE: Missing Space key for buttons
});
```

**WCAG:** 2.1.1 (Keyboard)
**Severity:** Warning
**Issue Type:** `incomplete-activation-keys`

---

### Category B: ARIA Relationships & States

#### 4. **Broken ARIA References**
**What:** aria-labelledby, aria-describedby point to non-existent IDs
**Detection:**
- Track setAttribute('aria-labelledby', id)
- Track getElementById calls
- Flag if referenced ID is never accessed/created

**Example:**
```javascript
dialog.setAttribute('aria-labelledby', 'dialog-title');
// ISSUE: 'dialog-title' element never created/referenced
```

**WCAG:** 4.1.2 (Name, Role, Value)
**Severity:** Error
**Issue Type:** `broken-aria-reference`

---

#### 5. **Missing ARIA State Updates**
**What:** Interactive elements with static ARIA states
**Detection:**
- Find aria-pressed, aria-checked, aria-selected set once
- Check if these are ever updated in event handlers
- Flag static states on interactive elements

**Example:**
```javascript
button.setAttribute('aria-pressed', 'false');
button.addEventListener('click', toggle);
// ISSUE: aria-pressed never updated
```

**WCAG:** 4.1.2 (Name, Role, Value)
**Severity:** Warning
**Issue Type:** `static-aria-state`

---

#### 6. **aria-controls Without Target Interaction**
**What:** aria-controls points to element but code never interacts with it
**Detection:**
- Track aria-controls attribute
- Check if controlled element is ever modified
- Flag if no interaction detected

**Example:**
```javascript
button.setAttribute('aria-controls', 'panel-1');
// ISSUE: Code never modifies #panel-1
```

**WCAG:** 4.1.2 (Name, Role, Value)
**Severity:** Info
**Issue Type:** `unused-aria-controls`

---

### Category C: Dynamic Content & Announcements

#### 7. **Missing Live Region Announcements**
**What:** Dynamic text changes without screen reader announcement
**Detection:**
- Find textContent/innerHTML updates
- Check if element or ancestor has aria-live
- Flag dynamic updates without live region

**Example:**
```javascript
statusDiv.textContent = 'Loading complete';
// ISSUE: No aria-live, screen readers won't announce
```

**WCAG:** 4.1.3 (Status Messages)
**Severity:** Warning
**Issue Type:** `missing-live-region`

---

#### 8. **Incorrect aria-live Usage**
**What:** Using aria-live on elements that are removed/hidden
**Detection:**
- Track elements with aria-live
- Check if element is later removed or hidden
- Flag ephemeral live regions

**Example:**
```javascript
announcement.setAttribute('aria-live', 'polite');
setTimeout(() => announcement.remove(), 100);
// ISSUE: Live region removed too quickly
```

**WCAG:** 4.1.3 (Status Messages)
**Severity:** Warning
**Issue Type:** `ephemeral-live-region`

---

#### 9. **Multiple Assertive Live Regions**
**What:** Too many aria-live="assertive" regions
**Detection:**
- Count aria-live="assertive" declarations
- Flag if more than 1-2 in same scope
- Suggest using polite instead

**Already detected:** ✅ `assertive-live-region` (but only flags individual, not count)

**Enhancement:** Track total count and warn if excessive

---

### Category D: Form Accessibility

#### 10. **Missing Form Labels**
**What:** Input elements without associated labels
**Detection:**
- Find input/select/textarea elements created
- Check if id is used in `for` attribute elsewhere
- Check for aria-label or aria-labelledby
- Flag unlabeled inputs

**Example:**
```javascript
const input = document.createElement('input');
form.appendChild(input);
// ISSUE: No label, aria-label, or aria-labelledby
```

**WCAG:** 3.3.2 (Labels or Instructions)
**Severity:** Error
**Issue Type:** `missing-form-label`

---

#### 11. **Missing Required Field Indicators**
**What:** Required inputs without aria-required or required attribute
**Detection:**
- Find input validation code
- Check if aria-required is set
- Flag required fields without indicator

**Example:**
```javascript
if (!input.value) {
  showError('This field is required');
  // ISSUE: No aria-required="true" on input
}
```

**WCAG:** 3.3.2 (Labels or Instructions)
**Severity:** Warning
**Issue Type:** `missing-required-indicator`

---

#### 12. **Missing Error Announcements**
**What:** Form validation errors without aria-describedby or live regions
**Detection:**
- Find error message display code
- Check if error element has aria-live
- Check if input has aria-describedby pointing to error
- Flag silent errors

**Example:**
```javascript
errorMsg.textContent = 'Invalid email';
errorMsg.style.display = 'block';
// ISSUE: No aria-live, error not announced
```

**WCAG:** 3.3.1 (Error Identification)
**Severity:** Warning
**Issue Type:** `silent-error-message`

---

### Category E: Timing & Animation

#### 13. **Insufficient Timeout Warnings**
**What:** setTimeout/setInterval that change content without warning
**Detection:**
- Find setTimeout with content changes
- Check if preceding warning/notification exists
- Flag surprise timeouts

**Example:**
```javascript
setTimeout(() => {
  window.location = '/logout';
  // ISSUE: No warning before redirect
}, 30000);
```

**WCAG:** 2.2.1 (Timing Adjustable)
**Severity:** Warning
**Issue Type:** `unannounced-timeout`

---

#### 14. **Auto-updating Content Without Control**
**What:** setInterval updating content without pause/stop mechanism
**Detection:**
- Find setInterval calls
- Check if clearInterval is used
- Flag auto-refresh without user control

**Example:**
```javascript
setInterval(() => {
  updateFeed();
  // ISSUE: No way to pause/stop updates
}, 5000);
```

**WCAG:** 2.2.2 (Pause, Stop, Hide)
**Severity:** Warning
**Issue Type:** `uncontrollable-auto-update`

---

### Category F: Touch & Mobile Interactions

#### 15. **Touch Event Without Click Fallback**
**What:** touchstart/touchend without click handler
**Detection:**
- Find touchstart/touchend handlers
- Check if click handler also exists
- Flag touch-only interactions

**Example:**
```javascript
element.addEventListener('touchstart', handleTouch);
// ISSUE: No click handler for mouse/keyboard users
```

**WCAG:** 2.5.2 (Pointer Cancellation)
**Severity:** Warning
**Issue Type:** `touch-only-interaction`

---

#### 16. **Small Touch Targets**
**What:** Click handlers on elements with small size
**Detection:**
- Find click/touch handlers
- Check if element size is set (via style)
- Flag if width/height < 44px (WCAG 2.5.5 AAA)

**Example:**
```javascript
smallBtn.style.width = '20px';
smallBtn.style.height = '20px';
smallBtn.addEventListener('click', action);
// ISSUE: Touch target too small (< 44x44px)
```

**WCAG:** 2.5.5 (Target Size)
**Severity:** Info
**Issue Type:** `small-touch-target`

---

### Category G: Semantic HTML & Structure

#### 17. **Missing Landmark Roles**
**What:** Content areas without landmark roles or semantic elements
**Detection:**
- Analyze overall structure
- Check for <main>, <nav>, <header>, <footer>
- Check for role="main", role="navigation"
- Flag if file has no landmarks

**Example:**
```javascript
// Entire app with no <main> or role="main"
// ISSUE: No landmark structure for navigation
```

**WCAG:** 2.4.1 (Bypass Blocks)
**Severity:** Info
**Issue Type:** `missing-landmarks`

---

#### 18. **Non-semantic Button/Link Creation**
**What:** Creating divs/spans as buttons instead of <button>
**Detection:**
- Find createElement('div') or createElement('span')
- Check if click handler added
- Check if role="button" added
- Suggest using <button> instead

**Example:**
```javascript
const btn = document.createElement('div');
btn.addEventListener('click', action);
// ISSUE: Should use <button> element
```

**WCAG:** 4.1.2 (Name, Role, Value)
**Severity:** Info
**Issue Type:** `non-semantic-button`

---

### Category H: Color & Visual Indicators

#### 19. **Color-Only Information**
**What:** Using only color to convey state/information
**Detection:**
- Find style.color or style.backgroundColor changes
- Check if alternative indicator exists (text, icon, aria-label)
- Flag color-only state changes

**Example:**
```javascript
if (isError) {
  input.style.backgroundColor = 'red';
  // ISSUE: No text/icon/aria indicator, only color
}
```

**WCAG:** 1.4.1 (Use of Color)
**Severity:** Warning
**Issue Type:** `color-only-indicator`

---

### Category I: Context Changes

#### 20. **Unexpected Context Changes**
**What:** Form submission or navigation on focus/input
**Detection:**
- Find focus/input handlers
- Check if they call form.submit() or change location
- Flag unexpected context changes

**Example:**
```javascript
select.addEventListener('change', () => {
  window.location = select.value;
  // ISSUE: Unexpected navigation on change
});
```

**WCAG:** 3.2.2 (On Input)
**Severity:** Warning
**Issue Type:** `unexpected-context-change`

---

## Priority Ranking

### High Priority (Immediate Impact)
1. **Missing Focus Indicators** - Critical for keyboard users
2. **Broken ARIA References** - Causes screen reader confusion
3. **Missing Form Labels** - Essential for form accessibility
4. **Missing Escape Handler** - Creates keyboard traps
5. **Incomplete Activation Keys** - Breaks button accessibility

### Medium Priority (Important)
6. **Missing Live Region Announcements** - Screen reader users miss updates
7. **Static ARIA States** - Misleading for assistive tech
8. **Missing Error Announcements** - Form accessibility
9. **Missing Required Indicators** - Form clarity
10. **Touch Without Click** - Mobile/desktop parity

### Low Priority (Nice to Have)
11. **Small Touch Targets** - AAA criterion
12. **Non-semantic Elements** - Best practice
13. **Color-Only Indicators** - Visual accessibility
14. **Missing Landmarks** - Navigation convenience
15. **Unused ARIA Controls** - Code quality

---

## Implementation Strategy

### Phase 1: Enhance Existing Analyzers
- **KeyboardAnalyzer**: Add escape handler detection, activation key completeness
- **ARIAAnalyzer**: Add broken reference detection, static state detection
- **FocusAnalyzer**: Add focus indicator detection

### Phase 2: New Specialized Analyzers
- **FormAnalyzer**: Labels, required fields, error messages
- **DynamicContentAnalyzer**: Live regions, content updates, timeouts
- **StructureAnalyzer**: Landmarks, semantic HTML

### Phase 3: Advanced Analysis
- **TouchInteractionAnalyzer**: Touch targets, fallbacks
- **VisualIndicatorAnalyzer**: Color-only info, contrast (if we parse CSS)
- **ContextChangeAnalyzer**: Unexpected navigation/submission

---

## Next Steps

1. **Review & Prioritize**: Which issues are most valuable?
2. **Design API**: How do new analyzers integrate?
3. **Implement High Priority**: Focus on critical issues first
4. **Add Demo Examples**: Create examples for new issues
5. **Test & Validate**: Ensure accuracy of detection
6. **Document**: Update guides with new capabilities

---

## Estimated Impact

**Current:** 25+ issue types
**After Phase 1:** 35+ issue types (+10)
**After Phase 2:** 45+ issue types (+10)
**After Phase 3:** 50+ issue types (+5)

**WCAG Coverage:**
- Current: ~13 success criteria
- After enhancements: ~20 success criteria

This would make it one of the most comprehensive JavaScript accessibility analyzers available! 🚀
