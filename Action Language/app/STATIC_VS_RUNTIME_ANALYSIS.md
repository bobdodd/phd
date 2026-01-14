# Static vs Runtime Analysis: What We Can Detect

This document clarifies the **scope** of our accessibility analyzer based on our architecture.

---

## Our Current Architecture

### What We Analyze
We perform **STATIC CODE ANALYSIS** on JavaScript source code:
1. Parse JavaScript → AST (Abstract Syntax Tree)
2. Transform AST → ActionLanguage tree
3. Analyze ActionLanguage tree for patterns
4. Report accessibility issues

### What We DO NOT Analyze
- ❌ HTML markup (except what's created via JavaScript)
- ❌ CSS styles (except inline styles via JavaScript)
- ❌ Runtime DOM state
- ❌ Actual rendered page
- ❌ Network requests or external resources

### Mock DOM (Limited Scope)
We have a **MockDocument/MockElement** implementation, but it's used for:
- ✅ **Execution Engine** - Optional runtime simulation for testing
- ❌ **Not used by analyzers** - Analyzers work on static ActionLanguage trees

**Important:** Our analyzers detect patterns in **JavaScript code**, not the actual DOM.

---

## Detection Capabilities Matrix

### ✅ CAN DETECT (Static Analysis)

#### Category: JavaScript Event Handlers
| What | How |
|------|-----|
| `addEventListener('click', ...)` | Parse function call |
| `element.onclick = handler` | Parse property assignment |
| `setAttribute('onclick', '...')` | Parse setAttribute call |
| jQuery `.on()`, `.click()` | Parse method calls |
| React `onClick={handler}` | Parse JSX attributes |

#### Category: Focus Management
| What | How |
|------|-----|
| `element.focus()` calls | Parse method call |
| `element.blur()` calls | Parse method call |
| `element.tabIndex = N` | Parse property assignment |
| `document.activeElement` access | Parse property access |
| `element.remove()` | Parse method call |
| `element.style.display = 'none'` | Parse property assignment |
| `element.classList.add('hidden')` | Parse method call |

#### Category: ARIA Attributes
| What | How |
|------|-----|
| `setAttribute('role', 'button')` | Parse setAttribute call |
| `setAttribute('aria-label', '...')` | Parse setAttribute call |
| `element.role = 'dialog'` | Parse property assignment |
| `element.setAttribute('aria-expanded', 'true')` | Parse setAttribute call |

#### Category: Keyboard Events
| What | How |
|------|-----|
| `event.key` checks | Parse member access + comparison |
| `event.keyCode` usage (deprecated) | Parse member access |
| `event.which` usage (deprecated) | Parse member access |
| Single-letter key checks | Parse string literal comparison |
| Arrow key handling | Parse key comparison |

#### Category: Dynamic Content
| What | How |
|------|-----|
| `element.textContent = 'X'` | Parse property assignment |
| `element.innerHTML = '<div>X</div>'` | Parse property assignment |
| `setTimeout(() => { ... })` | Parse function call |
| `setInterval(() => { ... })` | Parse function call |

---

### ❌ CANNOT DETECT (Requires DOM/CSS/Runtime)

#### Category: Visual/Rendered State
| What | Why Not |
|------|---------|
| Actual element size (width/height) | Requires computed styles |
| Focus indicator visibility | Requires CSS analysis |
| Color contrast | Requires rendered colors |
| Element overlap/obscuring | Requires layout calculation |
| Actual touch target size | Requires rendering |
| Font size | Requires CSS analysis |

#### Category: HTML Structure
| What | Why Not |
|------|---------|
| Semantic HTML usage in HTML files | We only analyze JavaScript |
| Form labels in HTML `<label for="...">` | HTML structure, not JS |
| Heading hierarchy `<h1>`, `<h2>` | HTML markup |
| Landmark roles in HTML | HTML markup |
| Alt text in `<img alt="...">` | HTML attributes |

#### Category: CSS-Based Accessibility
| What | Why Not |
|------|---------|
| `:focus` styles | CSS analysis needed |
| `outline: none` without alternative | CSS analysis needed |
| `.hidden { display: none; }` class definition | CSS analysis needed |
| Media queries for reduced motion | CSS analysis needed |
| CSS-only show/hide | CSS analysis needed |

#### Category: Runtime State
| What | Why Not |
|------|---------|
| Whether element actually exists in DOM | Requires execution/DOM |
| Current aria-expanded value at runtime | Requires DOM inspection |
| Whether element is actually focusable | Requires browser rendering |
| Actual focus position | Requires DOM state |
| Whether ID actually exists | Requires DOM inspection |

---

## Revised Enhancement Opportunities

Based on our **static analysis** capabilities, here are realistic enhancements:

### ✅ HIGH PRIORITY (Static Analysis Possible)

#### 1. **Missing Escape Key Handler in Modals**
**Detection:**
```javascript
// Find patterns like:
element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') { /* trap focus */ }
  // ISSUE: No Escape key check
});
```
**Feasible:** ✅ Yes - analyze keydown handlers for Tab without Escape

---

#### 2. **Incomplete Enter/Space Activation**
**Detection:**
```javascript
// Find role="button" + keydown handler
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { activate(); }
  // ISSUE: Missing Space key
});
```
**Feasible:** ✅ Yes - check if both Enter AND Space are handled

---

#### 3. **Static ARIA State (Never Updated)**
**Detection:**
```javascript
// Find setAttribute('aria-pressed', 'false') with no updates
button.setAttribute('aria-pressed', 'false');
button.addEventListener('click', toggle);
// ISSUE: aria-pressed never updated in any handler
```
**Feasible:** ✅ Yes - track ARIA attributes set but never modified

---

#### 4. **ARIA References Never Created**
**Detection:**
```javascript
// Find aria-labelledby but ID never accessed
dialog.setAttribute('aria-labelledby', 'dialog-title');
// ISSUE: 'dialog-title' never in getElementById or createElement
```
**Feasible:** ⚠️ Partial - can detect if ID never mentioned in code

---

#### 5. **Missing Live Region for Dynamic Content**
**Detection:**
```javascript
// Find textContent changes without aria-live
statusDiv.textContent = 'Loading complete';
// ISSUE: No aria-live on this element (check setAttribute calls)
```
**Feasible:** ⚠️ Partial - can check if aria-live is set on element, but hard to know if parent has it

---

#### 6. **Form Submit on Input/Change**
**Detection:**
```javascript
// Find unexpected context changes
select.addEventListener('change', () => {
  window.location = select.value; // ISSUE: Unexpected navigation
});
input.addEventListener('input', () => {
  form.submit(); // ISSUE: Auto-submit
});
```
**Feasible:** ✅ Yes - detect location changes or form.submit() in input/change handlers

---

#### 7. **Timeout Without Warning**
**Detection:**
```javascript
// Find setTimeout with navigation/major changes
setTimeout(() => {
  window.location = '/logout'; // ISSUE: Surprise redirect
}, 30000);
```
**Feasible:** ✅ Yes - detect window.location or major changes in setTimeout

---

#### 8. **Auto-update Without Control**
**Detection:**
```javascript
// Find setInterval without clearInterval
const interval = setInterval(() => {
  updateContent();
}, 5000);
// ISSUE: No clearInterval call found
```
**Feasible:** ✅ Yes - track setInterval calls and check for clearInterval

---

#### 9. **Touch Events Without Click**
**Detection:**
```javascript
// Find touchstart without click handler
element.addEventListener('touchstart', handleTouch);
// ISSUE: No 'click' event handler
```
**Feasible:** ✅ Yes - check if element has touch handler but no click handler

---

#### 10. **Non-semantic Button Creation**
**Detection:**
```javascript
// Find createElement('div') + click handler
const btn = document.createElement('div');
btn.addEventListener('click', action);
// ISSUE: Should use createElement('button')
```
**Feasible:** ✅ Yes - detect non-semantic elements with click handlers

---

### ❌ NOT FEASIBLE (Requires DOM/CSS/Runtime)

#### 1. ~~Missing Focus Indicators~~
- Requires CSS analysis (`outline: none`)

#### 2. ~~Small Touch Targets~~
- Requires computed element size

#### 3. ~~Color-Only Indicators~~
- Requires CSS color analysis

#### 4. ~~Missing Form Labels (HTML-based)~~
- Requires HTML `<label>` analysis

#### 5. ~~Missing Landmarks (HTML structure)~~
- Requires HTML `<main>`, `<nav>` analysis

#### 6. ~~Broken ARIA References (Runtime)~~
- Can detect if ID never mentioned, but can't verify actual DOM

---

## Summary

### What We Excel At
✅ **JavaScript-based accessibility issues**
- Event handler patterns
- Keyboard navigation code
- ARIA attribute manipulation via JS
- Focus management in JS
- Dynamic content updates via JS

### What We Cannot Do
❌ **HTML/CSS/Runtime issues**
- Static HTML accessibility
- CSS-based visual issues
- Computed styles and layout
- Actual DOM state at runtime

### Our Sweet Spot
🎯 **Single-Page Applications (SPAs)**
- React, Vue, Angular, etc.
- Heavy JavaScript interaction
- Dynamic ARIA management
- Client-side routing
- JavaScript-driven UI

---

## Realistic Enhancement Plan

### Phase 1: Keyboard & Event Patterns (4 issues)
1. Missing Escape in modal trap
2. Incomplete Enter/Space activation
3. Touch without click fallback
4. Non-semantic button creation

### Phase 2: ARIA State Management (3 issues)
5. Static ARIA states (never updated)
6. ARIA references never mentioned in code
7. Missing aria-live for dynamic updates

### Phase 3: Context & Timing (3 issues)
8. Form submit on input/change
9. Timeout without warning
10. Auto-update without control

**Total New Issues:** 10 (all feasible with static analysis)
**Current Issues:** 25
**Total After Enhancement:** 35 issue types

---

## Architecture Clarification

```
JavaScript Source Code
         ↓
    Parse to AST
         ↓
Transform to ActionLanguage
         ↓
┌─────────────────────────────┐
│  Static Analysis            │
│  (What we DO)               │
│  - Code patterns            │
│  - Function calls           │
│  - Attribute manipulation   │
│  - Event handlers           │
└─────────────────────────────┘
         ↓
   Accessibility Issues


HTML/CSS/Runtime DOM
         ↓
┌─────────────────────────────┐
│  Dynamic Analysis           │
│  (What we DON'T DO)         │
│  - DOM inspection           │
│  - CSS computed styles      │
│  - Element rendering        │
│  - Runtime state            │
└─────────────────────────────┘
```

---

## Conclusion

Our tool is a **JavaScript Static Analysis** tool for accessibility, NOT a full-page accessibility checker like axe-core or WAVE.

**Our niche:** Catching accessibility issues in **JavaScript code** before they reach production, integrated into the developer workflow (VSCode, CLI, CI/CD).

**Complementary tools:** axe-core (runtime DOM), Lighthouse (full page), Pa11y (automated testing)
