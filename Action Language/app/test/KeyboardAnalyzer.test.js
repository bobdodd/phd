/**
 * KeyboardAnalyzer Tests
 *
 * Tests for keyboard navigation analysis
 */

const KeyboardAnalyzer = require('../src/analyzer/KeyboardAnalyzer');
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
  const analyzer = new KeyboardAnalyzer();
  return analyzer.analyze(tree);
}

console.log('\nKeyboardAnalyzer Tests');
console.log('========================================');

// === Basic Functionality ===
console.log('\n  Basic Functionality');

test('creates analyzer with default options', () => {
  const analyzer = new KeyboardAnalyzer();
  assertEqual(analyzer.options.detectTraps, true);
  assertEqual(analyzer.options.detectMouseOnly, true);
  assertEqual(analyzer.options.detectPatterns, true);
});

test('returns empty results for null tree', () => {
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(null);
  assertEqual(results.keyboardHandlers.length, 0);
});

test('returns empty results for empty code', () => {
  const results = analyzeCode('');
  assertEqual(results.keyboardHandlers.length, 0);
});

// === Keyboard Handler Detection ===
console.log('\n  Keyboard Handler Detection');

test('detects keydown event listener', () => {
  const results = analyzeCode('element.addEventListener("keydown", handler)');
  assertEqual(results.keyboardHandlers.length, 1);
  assertEqual(results.keyboardHandlers[0].eventType, 'keydown');
});

test('detects keyup event listener', () => {
  const results = analyzeCode('element.addEventListener("keyup", handler)');
  assertEqual(results.keyboardHandlers.length, 1);
  assertEqual(results.keyboardHandlers[0].eventType, 'keyup');
});

test('detects keypress event listener', () => {
  const results = analyzeCode('element.addEventListener("keypress", handler)');
  assertEqual(results.keyboardHandlers.length, 1);
  assertEqual(results.keyboardHandlers[0].eventType, 'keypress');
});

test('tracks element reference', () => {
  const results = analyzeCode('myButton.addEventListener("keydown", handler)');
  assertEqual(results.keyboardHandlers[0].elementRef, 'myButton');
});

test('detects multiple keyboard handlers', () => {
  const code = `
    element.addEventListener("keydown", handler1);
    element.addEventListener("keyup", handler2);
  `;
  const results = analyzeCode(code);
  assertEqual(results.keyboardHandlers.length, 2);
});

// === Mouse Handler Detection ===
console.log('\n  Mouse Handler Detection');

test('detects click event listener', () => {
  const results = analyzeCode('element.addEventListener("click", handler)');
  assertEqual(results.mouseHandlers.length, 1);
  assertEqual(results.mouseHandlers[0].eventType, 'click');
});

test('detects mousedown event listener', () => {
  const results = analyzeCode('element.addEventListener("mousedown", handler)');
  assertEqual(results.mouseHandlers.length, 1);
});

test('detects mouseover event listener', () => {
  const results = analyzeCode('element.addEventListener("mouseover", handler)');
  assertEqual(results.mouseHandlers.length, 1);
});

test('distinguishes keyboard from mouse handlers', () => {
  const code = `
    element.addEventListener("click", clickHandler);
    element.addEventListener("keydown", keyHandler);
  `;
  const results = analyzeCode(code);
  assertEqual(results.mouseHandlers.length, 1);
  assertEqual(results.keyboardHandlers.length, 1);
});

// === Key Check Detection ===
console.log('\n  Key Check Detection');

test('detects e.key === "Tab" check', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        doSomething();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.keyChecks.some(k => k.key === 'Tab'));
});

test('detects e.key === "Enter" check', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        activate();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.keyChecks.some(k => k.key === 'Enter'));
});

test('detects e.key === "Escape" check', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.keyChecks.some(k => k.key === 'Escape'));
});

test('detects arrow key checks', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        moveDown();
      }
      if (e.key === "ArrowUp") {
        moveUp();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.keyChecks.some(k => k.key === 'ArrowDown'));
  assertTrue(results.keyChecks.some(k => k.key === 'ArrowUp'));
});

test('detects Space key check', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        toggle();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.keyChecks.some(k => k.key === ' '));
});

test('tracks key property used', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {}
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.keyChecks[0].property, 'key');
});

// === preventDefault Detection ===
console.log('\n  preventDefault Detection');

test('detects preventDefault call', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      e.preventDefault();
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.preventDefaultCalls.length, 1);
});

test('tracks preventDefault in keyboard handler', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      e.preventDefault();
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.preventDefaultCalls[0].inKeyboardHandler);
});

// === Navigation Pattern Detection ===
console.log('\n  Navigation Pattern Detection');

test('detects arrow navigation pattern', () => {
  const code = `
    list.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") moveNext();
      if (e.key === "ArrowUp") movePrev();
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasArrowNavigation());
  const pattern = results.navigationPatterns.find(p => p.type === 'arrow-navigation');
  assertTrue(pattern.directions.vertical);
});

test('detects horizontal arrow navigation', () => {
  const code = `
    tabs.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prevTab();
      if (e.key === "ArrowRight") nextTab();
    });
  `;
  const results = analyzeCode(code);
  const pattern = results.navigationPatterns.find(p => p.type === 'arrow-navigation');
  assertTrue(pattern.directions.horizontal);
});

test('detects bidirectional navigation', () => {
  const code = `
    grid.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") moveUp();
      if (e.key === "ArrowDown") moveDown();
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    });
  `;
  const results = analyzeCode(code);
  const pattern = results.navigationPatterns.find(p => p.type === 'arrow-navigation');
  assertTrue(pattern.directions.bidirectional);
});

test('detects tab handling pattern', () => {
  const code = `
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        handleTabNavigation(e);
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasNavigationPattern('tab-handling'));
});

test('detects Home/End navigation', () => {
  const code = `
    list.addEventListener("keydown", (e) => {
      if (e.key === "Home") goToFirst();
      if (e.key === "End") goToLast();
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasNavigationPattern('home-end-navigation'));
});

test('detects Enter/Space activation', () => {
  const code = `
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        activate();
      }
    });
  `;
  const results = analyzeCode(code);
  const pattern = results.navigationPatterns.find(p => p.type === 'activation-keys');
  assertTrue(pattern !== undefined);
  assertTrue(pattern.hasEnter);
  assertTrue(pattern.hasSpace);
});

test('detects Escape dismissal pattern', () => {
  const code = `
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasEscapeHandler());
  assertTrue(results.hasNavigationPattern('escape-dismissal'));
});

// === Keyboard Trap Detection ===
console.log('\n  Keyboard Trap Detection');

test('detects potential keyboard trap', () => {
  const code = `
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        focusNext();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasTrapPattern());
});

test('identifies intentional trap with Escape', () => {
  const code = `
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        focusNext();
      }
      if (e.key === "Escape") {
        closeDialog();
      }
    });
  `;
  const results = analyzeCode(code);
  const trap = results.trapPatterns.find(t => t.type === 'intentional-trap');
  assertTrue(trap !== undefined);
  assertTrue(trap.hasEscapeHandler);
});

// === Mouse-only Detection ===
console.log('\n  Mouse-only Detection');

test('detects mouse-only click handler', () => {
  const results = analyzeCode('button.addEventListener("click", handler)');
  assertTrue(results.getMouseOnlyElements().includes('button'));
});

test('no mouse-only warning when keyboard handler exists', () => {
  const code = `
    button.addEventListener("click", clickHandler);
    button.addEventListener("keydown", keyHandler);
  `;
  const results = analyzeCode(code);
  assertFalse(results.getMouseOnlyElements().includes('button'));
});

test('flags mouse-only as accessibility issue', () => {
  const results = analyzeCode('customButton.addEventListener("click", handler)');
  const issue = results.issues.find(i => i.type === 'mouse-only-click');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'warning');
});

test('excludes document from mouse-only check', () => {
  const results = analyzeCode('document.addEventListener("click", handler)');
  assertFalse(results.getMouseOnlyElements().includes('document'));
});

// === Issue Detection ===
console.log('\n  Issue Detection');

test('warns about potential keyboard trap', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
      }
    });
  `;
  const results = analyzeCode(code);
  const issue = results.issues.find(i => i.type === 'potential-keyboard-trap');
  assertTrue(issue !== undefined);
});

test('no trap warning when Escape is handled', () => {
  const code = `
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
      }
      if (e.key === "Escape") {
        close();
      }
    });
  `;
  const results = analyzeCode(code);
  const issue = results.issues.find(i => i.type === 'potential-keyboard-trap');
  assertTrue(issue === undefined);
});

test('issues include suggestions', () => {
  const results = analyzeCode('button.addEventListener("click", handler)');
  const issue = results.issues.find(i => i.type === 'mouse-only-click');
  assertTrue(issue.suggestion !== undefined);
});

// === Statistics ===
console.log('\n  Statistics');

test('counts keyboard handlers', () => {
  const code = `
    a.addEventListener("keydown", h1);
    b.addEventListener("keyup", h2);
    c.addEventListener("keypress", h3);
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.totalKeyboardHandlers, 3);
});

test('counts mouse handlers', () => {
  const code = `
    a.addEventListener("click", h1);
    b.addEventListener("mousedown", h2);
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.totalMouseHandlers, 2);
});

test('groups by key', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {}
      if (e.key === "Enter") {}
      if (e.key === "Escape") {}
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byKey['Enter'], 2);
  assertEqual(results.stats.byKey['Escape'], 1);
});

test('groups by event type', () => {
  const code = `
    a.addEventListener("keydown", h1);
    b.addEventListener("keydown", h2);
    c.addEventListener("keyup", h3);
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byEventType['keydown'], 2);
  assertEqual(results.stats.byEventType['keyup'], 1);
});

test('counts mouse-only elements', () => {
  const code = `
    btn1.addEventListener("click", h1);
    btn2.addEventListener("click", h2);
    btn3.addEventListener("click", h3);
    btn3.addEventListener("keydown", h4);
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.mouseOnlyElements, 2);
});

// === Convenience Methods ===
console.log('\n  Convenience Methods');

test('hasKeyboardHandlers returns true when present', () => {
  const results = analyzeCode('element.addEventListener("keydown", handler)');
  assertTrue(results.hasKeyboardHandlers());
});

test('hasKeyboardHandlers returns false when none', () => {
  const results = analyzeCode('element.addEventListener("click", handler)');
  assertFalse(results.hasKeyboardHandlers());
});

test('hasMouseHandlers returns true when present', () => {
  const results = analyzeCode('element.addEventListener("click", handler)');
  assertTrue(results.hasMouseHandlers());
});

test('getHandlersByElement filters correctly', () => {
  const code = `
    btn.addEventListener("keydown", h1);
    btn.addEventListener("keyup", h2);
    other.addEventListener("keydown", h3);
  `;
  const results = analyzeCode(code);
  const btnHandlers = results.getHandlersByElement('btn');
  assertEqual(btnHandlers.length, 2);
});

test('getKeyChecks filters by key', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {}
      if (e.key === "Escape") {}
      if (e.key === "Enter") {}
    });
  `;
  const results = analyzeCode(code);
  const enterChecks = results.getKeyChecks('Enter');
  assertEqual(enterChecks.length, 2);
});

test('hasWarnings returns true when warnings present', () => {
  const results = analyzeCode('button.addEventListener("click", handler)');
  assertTrue(results.hasWarnings());
});

// === Complex Scenarios ===
console.log('\n  Complex Scenarios');

test('analyzes complete dialog keyboard handling', () => {
  const code = `
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDialog();
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          focusPrevious();
        } else {
          focusNext();
        }
      }
    });

    closeBtn.addEventListener("click", closeDialog);
    closeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        closeDialog();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasEscapeHandler());
  assertTrue(results.hasNavigationPattern('tab-handling'));
  assertTrue(results.hasNavigationPattern('activation-keys'));
});

test('analyzes menu keyboard navigation', () => {
  const code = `
    menu.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowDown":
          focusNextItem();
          break;
        case "ArrowUp":
          focusPrevItem();
          break;
        case "Home":
          focusFirstItem();
          break;
        case "End":
          focusLastItem();
          break;
        case "Enter":
        case " ":
          activateItem();
          break;
        case "Escape":
          closeMenu();
          break;
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasArrowNavigation());
  assertTrue(results.hasNavigationPattern('home-end-navigation'));
  assertTrue(results.hasNavigationPattern('activation-keys'));
  assertTrue(results.hasEscapeHandler());
});

test('analyzes tabs keyboard navigation', () => {
  const code = `
    tablist.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        activatePreviousTab();
      }
      if (e.key === "ArrowRight") {
        activateNextTab();
      }
      if (e.key === "Home") {
        activateFirstTab();
      }
      if (e.key === "End") {
        activateLastTab();
      }
    });
  `;
  const results = analyzeCode(code);
  const arrowPattern = results.navigationPatterns.find(p => p.type === 'arrow-navigation');
  assertTrue(arrowPattern.directions.horizontal);
  assertFalse(arrowPattern.directions.vertical);
});

test('analyzes grid keyboard navigation', () => {
  const code = `
    grid.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          moveUp();
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowLeft":
          moveLeft();
          break;
        case "ArrowRight":
          moveRight();
          break;
      }
    });
  `;
  const results = analyzeCode(code);
  const pattern = results.navigationPatterns.find(p => p.type === 'arrow-navigation');
  assertTrue(pattern.directions.bidirectional);
});

// === Summary Generation ===
console.log('\n  Summary Generation');

test('generates summary', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter") activate();
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Keyboard Navigation Analysis Summary'));
  assertTrue(summary.includes('Keyboard handlers: 1'));
});

test('summary includes navigation patterns', () => {
  const code = `
    element.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") moveDown();
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Navigation Patterns Detected'));
  assertTrue(summary.includes('arrow-navigation'));
});

test('summary includes issues', () => {
  const code = 'button.addEventListener("click", handler)';
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Issues Detected'));
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('handles getElementById with keyboard handler', () => {
  const results = analyzeCode('document.getElementById("menu").addEventListener("keydown", handler)');
  assertEqual(results.keyboardHandlers.length, 1);
  assertTrue(results.keyboardHandlers[0].elementRef.includes('menu'));
});

test('handles querySelector with keyboard handler', () => {
  const results = analyzeCode('document.querySelector(".dialog").addEventListener("keydown", handler)');
  assertEqual(results.keyboardHandlers.length, 1);
});

test('handles document-level keyboard handler', () => {
  const results = analyzeCode('document.addEventListener("keydown", globalHandler)');
  assertEqual(results.keyboardHandlers.length, 1);
  assertEqual(results.keyboardHandlers[0].elementRef, 'document');
});

test('handles window-level keyboard handler', () => {
  const results = analyzeCode('window.addEventListener("keydown", globalHandler)');
  assertEqual(results.keyboardHandlers.length, 1);
});

// Print results
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
