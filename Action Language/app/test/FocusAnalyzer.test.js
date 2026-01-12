/**
 * FocusAnalyzer Tests
 *
 * Tests for focus management analysis
 */

const FocusAnalyzer = require('../src/analyzer/FocusAnalyzer');
const { parseAndTransform } = require('../src/parser');

// Simple test framework
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nGot: ${actual}`);
  }
}

function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(message || 'Expected true');
  }
}

function assertFalse(condition, message = '') {
  if (condition) {
    throw new Error(message || 'Expected false');
  }
}

/**
 * Helper to analyze JavaScript code
 */
function analyzeCode(code) {
  const tree = parseAndTransform(code);
  const analyzer = new FocusAnalyzer();
  return analyzer.analyze(tree);
}

console.log('\nFocusAnalyzer Tests');
console.log('========================================');

// === Basic Functionality ===
console.log('\n  Basic Functionality');

test('creates analyzer with default options', () => {
  const analyzer = new FocusAnalyzer();
  assertEqual(analyzer.options.detectTraps, true);
  assertEqual(analyzer.options.detectReturnPatterns, true);
});

test('returns empty results for null tree', () => {
  const analyzer = new FocusAnalyzer();
  const results = analyzer.analyze(null);
  assertEqual(results.focusOperations.length, 0);
});

test('returns empty results for empty code', () => {
  const results = analyzeCode('');
  assertEqual(results.focusOperations.length, 0);
});

// === Focus Detection ===
console.log('\n  Focus Detection');

test('detects element.focus() call', () => {
  const results = analyzeCode('element.focus()');
  assertEqual(results.focusOperations.length, 1);
  assertEqual(results.focusOperations[0].type, 'focus');
});

test('detects focus with element reference', () => {
  const results = analyzeCode('myButton.focus()');
  assertEqual(results.focusOperations[0].elementRef, 'myButton');
});

test('detects multiple focus calls', () => {
  const code = `
    element1.focus();
    element2.focus();
    element3.focus();
  `;
  const results = analyzeCode(code);
  assertEqual(results.focusOperations.length, 3);
});

test('tracks focus location info', () => {
  const results = analyzeCode('element.focus()');
  assertTrue(results.focusOperations[0].location.line !== undefined);
});

// === Blur Detection ===
console.log('\n  Blur Detection');

test('detects element.blur() call', () => {
  const results = analyzeCode('element.blur()');
  assertEqual(results.blurOperations.length, 1);
  assertEqual(results.blurOperations[0].type, 'blur');
});

test('detects blur with element reference', () => {
  const results = analyzeCode('input.blur()');
  assertEqual(results.blurOperations[0].elementRef, 'input');
});

test('distinguishes focus from blur', () => {
  const code = `
    element.focus();
    element.blur();
  `;
  const results = analyzeCode(code);
  assertEqual(results.focusOperations.length, 1);
  assertEqual(results.blurOperations.length, 1);
});

// === tabIndex Detection ===
console.log('\n  tabIndex Detection');

test('detects tabIndex property assignment', () => {
  const results = analyzeCode('element.tabIndex = 0');
  assertEqual(results.tabIndexChanges.length, 1);
});

test('detects tabIndex value', () => {
  const results = analyzeCode('element.tabIndex = -1');
  assertEqual(results.tabIndexChanges[0].value, -1);
});

test('detects setAttribute tabindex', () => {
  const results = analyzeCode('element.setAttribute("tabindex", "-1")');
  assertEqual(results.tabIndexChanges.length, 1);
});

test('tracks tabIndex element reference', () => {
  const results = analyzeCode('myDiv.tabIndex = 0');
  assertEqual(results.tabIndexChanges[0].elementRef, 'myDiv');
});

test('detects positive tabindex', () => {
  const results = analyzeCode('element.tabIndex = 5');
  assertEqual(results.tabIndexChanges[0].value, 5);
});

// === activeElement Detection ===
console.log('\n  activeElement Detection');

test('detects document.activeElement access', () => {
  const results = analyzeCode('const active = document.activeElement');
  assertEqual(results.activeElementAccess.length, 1);
});

test('detects activeElement in assignment', () => {
  const results = analyzeCode('previousFocus = document.activeElement');
  assertEqual(results.activeElementAccess.length, 1);
});

test('detects multiple activeElement access', () => {
  const code = `
    const prev = document.activeElement;
    const current = document.activeElement;
  `;
  const results = analyzeCode(code);
  assertEqual(results.activeElementAccess.length, 2);
});

// === Focus in Event Handlers ===
console.log('\n  Focus in Event Handlers');

test('detects focus inside click handler', () => {
  const code = 'button.addEventListener("click", () => dialog.focus())';
  const results = analyzeCode(code);
  assertEqual(results.focusInHandlers.length, 1);
  assertEqual(results.focusInHandlers[0].eventType, 'click');
});

test('detects focus inside keydown handler', () => {
  const code = 'element.addEventListener("keydown", (e) => nextElement.focus())';
  const results = analyzeCode(code);
  assertEqual(results.focusInHandlers.length, 1);
  assertEqual(results.focusInHandlers[0].eventType, 'keydown');
});

test('detects focus inside focus handler (potential trap)', () => {
  const code = 'element.addEventListener("focus", () => otherElement.focus())';
  const results = analyzeCode(code);
  assertEqual(results.focusInHandlers.length, 1);
  assertTrue(results.patterns.traps.length > 0);
});

test('marks focus as in event handler', () => {
  const code = 'btn.addEventListener("click", function() { modal.focus(); })';
  const results = analyzeCode(code);
  assertTrue(results.focusInHandlers[0].inEventHandler);
});

// === Focus Pattern Detection ===
console.log('\n  Focus Pattern Detection');

test('identifies focus redirect pattern', () => {
  const code = 'input.addEventListener("focus", () => otherInput.focus())';
  const results = analyzeCode(code);
  const trap = results.patterns.traps.find(t => t.type === 'focus-redirect');
  assertTrue(trap !== undefined);
});

test('identifies keyboard focus pattern', () => {
  const code = 'dialog.addEventListener("keydown", (e) => { if (e.key === "Tab") firstElement.focus(); })';
  const results = analyzeCode(code);
  const pattern = results.patterns.traps.find(t => t.type === 'keyboard-focus');
  assertTrue(pattern !== undefined);
});

test('identifies activeElement save pattern', () => {
  const code = 'const previousFocus = document.activeElement';
  const results = analyzeCode(code);
  const pattern = results.patterns.returns.find(r => r.type === 'activeElement-save');
  assertTrue(pattern !== undefined);
});

test('identifies click-focus pattern', () => {
  const code = 'openBtn.addEventListener("click", () => dialog.focus())';
  const results = analyzeCode(code);
  const pattern = results.patterns.returns.find(r => r.type === 'click-focus');
  assertTrue(pattern !== undefined);
});

// === Issue Detection ===
console.log('\n  Issue Detection');

test('warns about focus on div without tabindex', () => {
  const results = analyzeCode('div.focus()');
  const issue = results.issues.find(i => i.type === 'possibly-non-focusable');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'warning');
});

test('warns about positive tabindex', () => {
  const results = analyzeCode('element.tabIndex = 5');
  const issue = results.issues.find(i => i.type === 'positive-tabindex');
  assertTrue(issue !== undefined);
});

test('no warning for tabindex 0', () => {
  const results = analyzeCode('element.tabIndex = 0');
  const issue = results.issues.find(i => i.type === 'positive-tabindex');
  assertTrue(issue === undefined);
});

test('no warning for tabindex -1', () => {
  const results = analyzeCode('element.tabIndex = -1');
  const issue = results.issues.find(i => i.type === 'positive-tabindex');
  assertTrue(issue === undefined);
});

test('info about standalone blur', () => {
  const results = analyzeCode('element.blur()');
  const issue = results.issues.find(i => i.type === 'standalone-blur');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'info');
});

test('issues include suggestions', () => {
  const results = analyzeCode('div.focus()');
  const issue = results.issues.find(i => i.type === 'possibly-non-focusable');
  assertTrue(issue.suggestion !== undefined);
});

// === Statistics ===
console.log('\n  Statistics');

test('counts total focus calls', () => {
  const code = `
    a.focus();
    b.focus();
    c.focus();
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.totalFocusCalls, 3);
});

test('counts total blur calls', () => {
  const code = `
    a.blur();
    b.blur();
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.totalBlurCalls, 2);
});

test('counts tabIndex changes', () => {
  const code = `
    a.tabIndex = 0;
    b.tabIndex = -1;
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.tabIndexChanges, 2);
});

test('counts focus in event handlers', () => {
  const code = `
    btn1.addEventListener("click", () => modal.focus());
    btn2.addEventListener("click", () => other.focus());
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.focusInEventHandlers, 2);
});

test('groups by element', () => {
  const code = `
    modal.focus();
    modal.blur();
    button.focus();
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byElement['modal'], 2);
  assertEqual(results.stats.byElement['button'], 1);
});

// === Convenience Methods ===
console.log('\n  Convenience Methods');

test('hasFocusManagement returns true when focus calls present', () => {
  const results = analyzeCode('element.focus()');
  assertTrue(results.hasFocusManagement());
});

test('hasFocusManagement returns true when tabIndex changes present', () => {
  const results = analyzeCode('element.tabIndex = 0');
  assertTrue(results.hasFocusManagement());
});

test('hasFocusManagement returns false when no focus operations', () => {
  const results = analyzeCode('const x = 5');
  assertFalse(results.hasFocusManagement());
});

test('getFocusByElement filters correctly', () => {
  const code = `
    modal.focus();
    button.focus();
    modal.focus();
  `;
  const results = analyzeCode(code);
  const modalFocus = results.getFocusByElement('modal');
  assertEqual(modalFocus.length, 2);
});

test('hasWarnings returns true when warnings present', () => {
  const results = analyzeCode('div.focus()');
  assertTrue(results.hasWarnings());
});

test('hasWarnings returns false when no warnings', () => {
  const results = analyzeCode('button.focus()');
  assertFalse(results.hasWarnings());
});

// === Complex Scenarios ===
console.log('\n  Complex Scenarios');

test('analyzes modal focus pattern', () => {
  const code = `
    // Save current focus
    const previousFocus = document.activeElement;

    // Open modal and focus it
    openButton.addEventListener("click", () => {
      modal.style.display = "block";
      modal.focus();
    });

    // Close modal and return focus
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
      previousFocus.focus();
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.activeElementAccess.length > 0);
  assertEqual(results.focusInHandlers.length, 2);
});

test('analyzes focus trap in dialog', () => {
  const code = `
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          lastElement.focus();
        } else {
          firstElement.focus();
        }
      }
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.focusInHandlers.length, 2);
  assertTrue(results.patterns.traps.length > 0);
});

test('analyzes skip link pattern', () => {
  const code = `
    skipLink.addEventListener("click", () => {
      mainContent.tabIndex = -1;
      mainContent.focus();
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.focusOperations.length, 1);
  assertEqual(results.tabIndexChanges.length, 1);
});

test('analyzes accordion focus', () => {
  const code = `
    accordionHeader.addEventListener("click", () => {
      accordionPanel.focus();
    });

    accordionHeader.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        accordionPanel.focus();
      }
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.focusInHandlers.length, 2);
});

// === Summary Generation ===
console.log('\n  Summary Generation');

test('generates summary', () => {
  const code = `
    element.focus();
    element.blur();
    element.tabIndex = 0;
  `;
  const tree = parseAndTransform(code);
  const analyzer = new FocusAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Focus Management Analysis Summary'));
  assertTrue(summary.includes('Focus calls: 1'));
  assertTrue(summary.includes('Blur calls: 1'));
});

test('summary includes issues', () => {
  const code = 'div.focus()';
  const tree = parseAndTransform(code);
  const analyzer = new FocusAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Issues Detected'));
  assertTrue(summary.includes('warning'));
});

test('summary includes suggestions', () => {
  const code = 'element.tabIndex = 5';
  const tree = parseAndTransform(code);
  const analyzer = new FocusAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Suggestion'));
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('handles chained focus call', () => {
  const results = analyzeCode('getElement().focus()');
  assertEqual(results.focusOperations.length, 1);
});

test('handles querySelector focus', () => {
  const results = analyzeCode('document.querySelector("#modal").focus()');
  assertEqual(results.focusOperations.length, 1);
});

test('handles getElementById focus', () => {
  const results = analyzeCode('document.getElementById("modal").focus()');
  assertEqual(results.focusOperations.length, 1);
  assertTrue(results.focusOperations[0].elementRef.includes('modal'));
});

test('handles deeply nested focus', () => {
  const code = `
    function outer() {
      function inner() {
        element.focus();
      }
    }
  `;
  const results = analyzeCode(code);
  assertEqual(results.focusOperations.length, 1);
});

// === Visibility Detection ===
console.log('\n  Visibility Detection');

test('detects style.display = "none"', () => {
  const results = analyzeCode('element.style.display = "none"');
  assertEqual(results.visibilityChanges.length, 1);
  assertEqual(results.visibilityChanges[0].type, 'display');
  assertTrue(results.visibilityChanges[0].hidesElement);
});

test('detects style.display = "block" (shows element)', () => {
  const results = analyzeCode('element.style.display = "block"');
  assertEqual(results.visibilityChanges.length, 1);
  assertFalse(results.visibilityChanges[0].hidesElement);
});

test('detects style.visibility = "hidden"', () => {
  const results = analyzeCode('modal.style.visibility = "hidden"');
  assertEqual(results.visibilityChanges.length, 1);
  assertEqual(results.visibilityChanges[0].type, 'visibility');
  assertTrue(results.visibilityChanges[0].hidesElement);
});

test('detects style.visibility = "visible" (shows element)', () => {
  const results = analyzeCode('modal.style.visibility = "visible"');
  assertEqual(results.visibilityChanges.length, 1);
  assertFalse(results.visibilityChanges[0].hidesElement);
});

test('detects element.hidden = true', () => {
  const results = analyzeCode('dialog.hidden = true');
  assertEqual(results.visibilityChanges.length, 1);
  assertEqual(results.visibilityChanges[0].type, 'hidden');
  assertTrue(results.visibilityChanges[0].hidesElement);
});

test('detects element.hidden = false', () => {
  const results = analyzeCode('dialog.hidden = false');
  assertEqual(results.visibilityChanges.length, 1);
  assertFalse(results.visibilityChanges[0].hidesElement);
});

test('detects setAttribute("hidden", "")', () => {
  const results = analyzeCode('element.setAttribute("hidden", "")');
  assertEqual(results.visibilityChanges.length, 1);
  assertEqual(results.visibilityChanges[0].type, 'hidden-attribute');
  assertTrue(results.visibilityChanges[0].hidesElement);
});

test('detects removeAttribute("hidden")', () => {
  const results = analyzeCode('element.removeAttribute("hidden")');
  assertEqual(results.visibilityChanges.length, 1);
  assertFalse(results.visibilityChanges[0].hidesElement);
});

test('tracks visibility element reference', () => {
  const results = analyzeCode('myModal.style.display = "none"');
  assertEqual(results.visibilityChanges[0].elementRef, 'myModal');
});

// === Element Removal Detection ===
console.log('\n  Element Removal Detection');

test('detects element.remove()', () => {
  const results = analyzeCode('modal.remove()');
  assertEqual(results.elementRemovals.length, 1);
  assertEqual(results.elementRemovals[0].type, 'remove');
});

test('detects parent.removeChild(element)', () => {
  const results = analyzeCode('parent.removeChild(child)');
  assertEqual(results.elementRemovals.length, 1);
  assertEqual(results.elementRemovals[0].type, 'removeChild');
});

test('tracks removed element reference', () => {
  const results = analyzeCode('dialog.remove()');
  assertEqual(results.elementRemovals[0].elementRef, 'dialog');
});

test('does not flag removeAttribute as removal', () => {
  const results = analyzeCode('element.removeAttribute("id")');
  assertEqual(results.elementRemovals.length, 0);
});

test('does not flag removeEventListener as removal', () => {
  const results = analyzeCode('element.removeEventListener("click", handler)');
  assertEqual(results.elementRemovals.length, 0);
});

// === classList Detection ===
console.log('\n  classList Detection');

test('detects classList.add("hidden")', () => {
  const results = analyzeCode('element.classList.add("hidden")');
  assertEqual(results.classListChanges.length, 1);
  assertEqual(results.classListChanges[0].method, 'add');
  assertTrue(results.classListChanges[0].mayHideElement);
});

test('detects classList.remove("hidden")', () => {
  const results = analyzeCode('element.classList.remove("hidden")');
  assertEqual(results.classListChanges.length, 1);
  assertEqual(results.classListChanges[0].method, 'remove');
  assertFalse(results.classListChanges[0].mayHideElement);
});

test('detects classList.toggle("d-none")', () => {
  const results = analyzeCode('element.classList.toggle("d-none")');
  assertEqual(results.classListChanges.length, 1);
  assertEqual(results.classListChanges[0].method, 'toggle');
  assertTrue(results.classListChanges[0].mayHideElement);
});

test('recognizes common hiding class patterns', () => {
  const hidingClasses = ['hidden', 'hide', 'd-none', 'invisible', 'is-hidden', 'visually-hidden'];
  for (const cls of hidingClasses) {
    const results = analyzeCode(`element.classList.add("${cls}")`);
    assertTrue(results.classListChanges[0].mayHideElement, `Expected "${cls}" to be recognized as hiding class`);
  }
});

test('does not flag non-hiding classes', () => {
  const results = analyzeCode('element.classList.add("active")');
  assertEqual(results.classListChanges.length, 1);
  assertFalse(results.classListChanges[0].mayHideElement);
});

// === Visibility Issues ===
console.log('\n  Visibility Issues');

test('warns when hiding without focus management', () => {
  const results = analyzeCode('modal.style.display = "none"');
  const issue = results.issues.find(i => i.type === 'hiding-without-focus-management');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'warning');
});

test('no warning when hiding with focus move', () => {
  const code = `
    button.addEventListener("click", () => {
      previousFocus.focus();
      modal.style.display = "none";
    });
  `;
  const results = analyzeCode(code);
  const issue = results.issues.find(i => i.type === 'hiding-without-focus-management');
  assertTrue(issue === undefined);
});

test('warns when removing without focus management', () => {
  const results = analyzeCode('element.remove()');
  const issue = results.issues.find(i => i.type === 'removal-without-focus-management');
  assertTrue(issue !== undefined);
});

test('info about hiding class without focus management', () => {
  const results = analyzeCode('element.classList.add("hidden")');
  const issue = results.issues.find(i => i.type === 'hiding-class-without-focus-management');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'info');
});

// === Visibility Statistics ===
console.log('\n  Visibility Statistics');

test('counts visibility changes', () => {
  const code = `
    a.style.display = "none";
    b.style.visibility = "hidden";
    c.hidden = true;
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.visibilityChanges, 3);
});

test('counts element removals', () => {
  const code = `
    a.remove();
    parent.removeChild(b);
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.elementRemovals, 2);
});

test('counts hiding operations', () => {
  const code = `
    a.style.display = "none";
    b.remove();
    c.classList.add("hidden");
    d.style.display = "block";
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.hidingOperations, 3);
});

// === Visibility Convenience Methods ===
console.log('\n  Visibility Convenience Methods');

test('hasVisibilityChanges returns true when present', () => {
  const results = analyzeCode('element.style.display = "none"');
  assertTrue(results.hasVisibilityChanges());
});

test('hasVisibilityChanges returns false when no changes', () => {
  const results = analyzeCode('const x = 5');
  assertFalse(results.hasVisibilityChanges());
});

test('getHidingOperations returns only hiding ops', () => {
  const code = `
    a.style.display = "none";
    b.style.display = "block";
    c.remove();
  `;
  const results = analyzeCode(code);
  const hiding = results.getHidingOperations();
  assertEqual(hiding.length, 2);
});

test('getVisibilityByElement filters correctly', () => {
  const code = `
    modal.style.display = "none";
    button.style.display = "none";
    modal.style.visibility = "hidden";
  `;
  const results = analyzeCode(code);
  const modalChanges = results.getVisibilityByElement('modal');
  assertEqual(modalChanges.length, 2);
});

// === Complex Visibility Scenarios ===
console.log('\n  Complex Visibility Scenarios');

test('analyzes modal close pattern', () => {
  const code = `
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.visibilityChanges.length, 1);
  assertTrue(results.visibilityChanges[0].inEventHandler);
});

test('analyzes proper modal close with focus return', () => {
  const code = `
    const previousFocus = document.activeElement;

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      previousFocus.focus();
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.activeElementAccess.length > 0);
  assertTrue(results.focusInHandlers.length > 0);
});

test('analyzes accordion toggle', () => {
  const code = `
    header.addEventListener("click", () => {
      panel.classList.toggle("collapsed");
      if (panel.classList.contains("collapsed")) {
        header.focus();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.classListChanges.length > 0);
});

// Print results
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
