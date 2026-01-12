/**
 * EventAnalyzer Tests
 *
 * Tests for event handler discovery and cataloging
 */

const EventAnalyzer = require('../src/analyzer/EventAnalyzer');
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
  const analyzer = new EventAnalyzer();
  return analyzer.analyze(tree);
}

console.log('\nEventAnalyzer Tests');
console.log('========================================');

// === Basic Functionality ===
console.log('\n  Basic Functionality');

test('creates analyzer with default options', () => {
  const analyzer = new EventAnalyzer();
  assertEqual(analyzer.options.trackRemovals, true);
  assertEqual(analyzer.options.includeInlineHandlers, true);
});

test('creates analyzer with custom options', () => {
  const analyzer = new EventAnalyzer({ trackRemovals: false });
  assertEqual(analyzer.options.trackRemovals, false);
});

test('returns empty results for null tree', () => {
  const analyzer = new EventAnalyzer();
  const results = analyzer.analyze(null);
  assertEqual(results.handlers.length, 0);
});

test('returns empty results for empty tree', () => {
  const tree = parseAndTransform('');
  const analyzer = new EventAnalyzer();
  const results = analyzer.analyze(tree);
  assertEqual(results.handlers.length, 0);
});

// === addEventListener Detection ===
console.log('\n  addEventListener Detection');

test('detects simple addEventListener', () => {
  const results = analyzeCode('button.addEventListener("click", handler)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'click');
  assertEqual(results.handlers[0].type, 'addEventListener');
});

test('detects addEventListener with inline function', () => {
  const results = analyzeCode('button.addEventListener("click", function(e) { console.log(e); })');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'click');
  assertTrue(results.handlers[0].handler.isInline);
});

test('detects addEventListener with arrow function', () => {
  const results = analyzeCode('button.addEventListener("click", (e) => e.preventDefault())');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'click');
  assertTrue(results.handlers[0].handler.isInline);
});

test('detects multiple event listeners', () => {
  const code = `
    button.addEventListener("click", onClick);
    button.addEventListener("keydown", onKeyDown);
    input.addEventListener("focus", onFocus);
  `;
  const results = analyzeCode(code);
  assertEqual(results.handlers.length, 3);
});

test('extracts element reference', () => {
  const results = analyzeCode('myButton.addEventListener("click", handler)');
  assertEqual(results.handlers[0].elementRef, 'myButton');
});

test('detects capture option (boolean)', () => {
  const results = analyzeCode('button.addEventListener("click", handler, true)');
  assertEqual(results.handlers.length, 1);
  assertTrue(results.handlers[0].options !== null);
  assertEqual(results.handlers[0].options.capture, true);
});

test('tracks location information', () => {
  const results = analyzeCode('button.addEventListener("click", handler)');
  assertTrue(results.handlers[0].location.line !== undefined);
  assertTrue(results.handlers[0].location.column !== undefined);
});

// === Event Types ===
console.log('\n  Event Types');

test('detects click event', () => {
  const results = analyzeCode('el.addEventListener("click", fn)');
  assertEqual(results.handlers[0].eventType, 'click');
});

test('detects keydown event', () => {
  const results = analyzeCode('el.addEventListener("keydown", fn)');
  assertEqual(results.handlers[0].eventType, 'keydown');
});

test('detects keyup event', () => {
  const results = analyzeCode('el.addEventListener("keyup", fn)');
  assertEqual(results.handlers[0].eventType, 'keyup');
});

test('detects focus event', () => {
  const results = analyzeCode('el.addEventListener("focus", fn)');
  assertEqual(results.handlers[0].eventType, 'focus');
});

test('detects blur event', () => {
  const results = analyzeCode('el.addEventListener("blur", fn)');
  assertEqual(results.handlers[0].eventType, 'blur');
});

test('detects change event', () => {
  const results = analyzeCode('el.addEventListener("change", fn)');
  assertEqual(results.handlers[0].eventType, 'change');
});

test('detects submit event', () => {
  const results = analyzeCode('el.addEventListener("submit", fn)');
  assertEqual(results.handlers[0].eventType, 'submit');
});

// === Property Assignment (onclick, etc.) ===
console.log('\n  Property Assignment');

test('detects onclick property', () => {
  const results = analyzeCode('button.onclick = handler');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'click');
  assertEqual(results.handlers[0].type, 'propertyAssignment');
});

test('detects onfocus property', () => {
  const results = analyzeCode('input.onfocus = handler');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'focus');
});

test('detects onkeydown property', () => {
  const results = analyzeCode('input.onkeydown = handler');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'keydown');
});

test('detects inline function in property assignment', () => {
  const results = analyzeCode('button.onclick = function() { alert("clicked"); }');
  assertEqual(results.handlers.length, 1);
  assertTrue(results.handlers[0].handler.isInline);
});

test('ignores non-event property assignments', () => {
  const results = analyzeCode('button.disabled = true');
  assertEqual(results.handlers.length, 0);
});

// === setAttribute ===
console.log('\n  setAttribute Detection');

test('detects setAttribute with onclick', () => {
  const results = analyzeCode('button.setAttribute("onclick", "handleClick()")');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'click');
  assertEqual(results.handlers[0].type, 'setAttribute');
});

test('detects setAttribute with onfocus', () => {
  const results = analyzeCode('input.setAttribute("onfocus", "handleFocus()")');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'focus');
});

test('ignores setAttribute with non-event attributes', () => {
  const results = analyzeCode('el.setAttribute("class", "active")');
  assertEqual(results.handlers.length, 0);
});

test('ignores setAttribute with aria attributes', () => {
  const results = analyzeCode('el.setAttribute("aria-label", "Close")');
  assertEqual(results.handlers.length, 0);
});

// === removeEventListener ===
console.log('\n  removeEventListener Detection');

test('detects removeEventListener', () => {
  const results = analyzeCode('button.removeEventListener("click", handler)');
  assertEqual(results.removals.length, 1);
  assertEqual(results.removals[0].eventType, 'click');
});

test('tracks removal element reference', () => {
  const results = analyzeCode('myButton.removeEventListener("click", handler)');
  assertEqual(results.removals[0].elementRef, 'myButton');
});

test('can disable removal tracking', () => {
  const tree = parseAndTransform('button.removeEventListener("click", handler)');
  const analyzer = new EventAnalyzer({ trackRemovals: false });
  const results = analyzer.analyze(tree);
  assertEqual(results.removals.length, 0);
});

// === Statistics ===
console.log('\n  Statistics');

test('counts total handlers', () => {
  const code = `
    a.addEventListener("click", fn1);
    b.addEventListener("keydown", fn2);
    c.onclick = fn3;
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.totalHandlers, 3);
});

test('groups by event type', () => {
  const code = `
    a.addEventListener("click", fn1);
    b.addEventListener("click", fn2);
    c.addEventListener("keydown", fn3);
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byEventType['click'], 2);
  assertEqual(results.stats.byEventType['keydown'], 1);
});

test('groups by element', () => {
  const code = `
    button.addEventListener("click", fn1);
    button.addEventListener("keydown", fn2);
    input.addEventListener("focus", fn3);
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byElement['button'], 2);
  assertEqual(results.stats.byElement['input'], 1);
});

test('groups by pattern', () => {
  const code = `
    a.addEventListener("click", fn);
    b.onclick = fn;
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byPattern['addEventListener'], 1);
  assertEqual(results.stats.byPattern['propertyAssignment'], 1);
});

// === Convenience Methods ===
console.log('\n  Convenience Methods');

test('getHandlersByEventType filters correctly', () => {
  const code = `
    a.addEventListener("click", fn1);
    b.addEventListener("keydown", fn2);
    c.addEventListener("click", fn3);
  `;
  const results = analyzeCode(code);
  const clickHandlers = results.getHandlersByEventType('click');
  assertEqual(clickHandlers.length, 2);
});

test('getHandlersByElement filters correctly', () => {
  const code = `
    button.addEventListener("click", fn1);
    button.addEventListener("keydown", fn2);
    input.addEventListener("focus", fn3);
  `;
  const results = analyzeCode(code);
  const buttonHandlers = results.getHandlersByElement('button');
  assertEqual(buttonHandlers.length, 2);
});

test('hasKeyboardHandlers returns true when present', () => {
  const results = analyzeCode('el.addEventListener("keydown", fn)');
  assertTrue(results.hasKeyboardHandlers());
});

test('hasKeyboardHandlers returns false when absent', () => {
  const results = analyzeCode('el.addEventListener("click", fn)');
  assertFalse(results.hasKeyboardHandlers());
});

test('hasClickHandlers returns true when present', () => {
  const results = analyzeCode('el.addEventListener("click", fn)');
  assertTrue(results.hasClickHandlers());
});

test('hasFocusHandlers returns true for focus event', () => {
  const results = analyzeCode('el.addEventListener("focus", fn)');
  assertTrue(results.hasFocusHandlers());
});

test('hasFocusHandlers returns true for blur event', () => {
  const results = analyzeCode('el.addEventListener("blur", fn)');
  assertTrue(results.hasFocusHandlers());
});

// === Accessibility Patterns ===
console.log('\n  Accessibility Patterns');

test('identifies click without keyboard (accessibility issue)', () => {
  const results = analyzeCode('button.addEventListener("click", handleClick)');
  assertTrue(results.hasClickHandlers());
  assertFalse(results.hasKeyboardHandlers());
});

test('identifies click with keyboard (good practice)', () => {
  const code = `
    button.addEventListener("click", handleClick);
    button.addEventListener("keydown", handleKeyDown);
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasClickHandlers());
  assertTrue(results.hasKeyboardHandlers());
});

test('identifies focus management', () => {
  const code = `
    dialog.addEventListener("focus", trapFocus);
    closeButton.addEventListener("click", returnFocus);
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasFocusHandlers());
});

// === Complex Scenarios ===
console.log('\n  Complex Scenarios');

test('handles document event listeners', () => {
  const results = analyzeCode('document.addEventListener("keydown", handleEscape)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].elementRef, 'document');
});

test('handles window event listeners', () => {
  const results = analyzeCode('window.addEventListener("resize", handleResize)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].elementRef, 'window');
});

test('handles mixed registration patterns', () => {
  const code = `
    button.addEventListener("click", fn1);
    button.onclick = fn2;
    button.setAttribute("onkeydown", "fn3()");
  `;
  const results = analyzeCode(code);
  assertEqual(results.handlers.length, 3);
  assertEqual(results.stats.byPattern['addEventListener'], 1);
  assertEqual(results.stats.byPattern['propertyAssignment'], 1);
  assertEqual(results.stats.byPattern['setAttribute'], 1);
});

test('handles nested event registration', () => {
  const code = `
    function setupEvents() {
      button.addEventListener("click", function() {
        dialog.addEventListener("close", handleClose);
      });
    }
  `;
  const results = analyzeCode(code);
  assertEqual(results.handlers.length, 2);
});

test('handles event delegation pattern', () => {
  const code = `
    container.addEventListener("click", function(e) {
      if (e.target.matches(".item")) {
        handleItemClick(e.target);
      }
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'click');
});

// === Summary Generation ===
console.log('\n  Summary Generation');

test('generates summary', () => {
  const code = `
    button.addEventListener("click", handleClick);
    button.addEventListener("keydown", handleKey);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new EventAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Event Handler Analysis Summary'));
  assertTrue(summary.includes('Total handlers found: 2'));
});

test('summary includes event types', () => {
  const code = `
    a.addEventListener("click", fn);
    b.addEventListener("keydown", fn);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new EventAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('click: 1'));
  assertTrue(summary.includes('keydown: 1'));
});

test('summary identifies keyboard handlers present', () => {
  const code = 'el.addEventListener("keydown", fn)';
  const tree = parseAndTransform(code);
  const analyzer = new EventAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Keyboard handlers present'));
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('handles empty event type', () => {
  // This shouldn't crash, even if the code is unusual
  const results = analyzeCode('el.addEventListener("", fn)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, '');
});

test('handles dynamic event type (variable)', () => {
  const results = analyzeCode('el.addEventListener(eventType, fn)');
  assertEqual(results.handlers.length, 1);
  // Event type is a variable name, not a string
  assertEqual(results.handlers[0].eventType, 'eventType');
});

test('handles chained method calls', () => {
  const results = analyzeCode('getElement().addEventListener("click", fn)');
  assertEqual(results.handlers.length, 1);
});

// === jQuery Patterns ===
console.log('\n  jQuery Patterns');

test('detects jQuery .on() method', () => {
  const results = analyzeCode('$("#btn").on("click", handler)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].type, 'jQueryOn');
  assertEqual(results.handlers[0].eventType, 'click');
});

test('detects jQuery .on() with selector', () => {
  const results = analyzeCode('$("#btn").on("click", handler)');
  assertEqual(results.handlers[0].elementRef, '#btn');
});

test('detects jQuery delegated events', () => {
  const results = analyzeCode('$("#container").on("click", ".item", handler)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].delegateSelector, '.item');
});

test('detects jQuery multiple events', () => {
  const results = analyzeCode('$("#btn").on("mouseenter mouseleave", handler)');
  assertEqual(results.handlers.length, 2);
  assertEqual(results.handlers[0].eventType, 'mouseenter');
  assertEqual(results.handlers[1].eventType, 'mouseleave');
});

test('detects jQuery .click() shorthand', () => {
  const results = analyzeCode('$("#btn").click(handler)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].type, 'jQueryShorthand');
  assertEqual(results.handlers[0].eventType, 'click');
});

test('detects jQuery .focus() shorthand', () => {
  const results = analyzeCode('$("#input").focus(handler)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'focus');
});

test('detects jQuery .keydown() shorthand', () => {
  const results = analyzeCode('$("#input").keydown(handler)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'keydown');
});

test('detects jQuery with jQuery() instead of $()', () => {
  const results = analyzeCode('jQuery("#btn").on("click", handler)');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].type, 'jQueryOn');
});

test('detects jQuery with inline function', () => {
  const results = analyzeCode('$("#btn").click(function() { alert("clicked"); })');
  assertEqual(results.handlers.length, 1);
  assertTrue(results.handlers[0].handler.isInline);
});

// === React JSX Patterns ===
console.log('\n  React JSX Patterns');

test('detects JSX onClick', () => {
  const results = analyzeCode('<button onClick={handleClick}>Click</button>');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].type, 'jsxEventHandler');
  assertEqual(results.handlers[0].eventType, 'click');
});

test('detects JSX onKeyDown', () => {
  const results = analyzeCode('<input onKeyDown={handleKey} />');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'keydown');
});

test('detects JSX onFocus', () => {
  const results = analyzeCode('<input onFocus={handleFocus} />');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'focus');
});

test('detects JSX onChange', () => {
  const results = analyzeCode('<input onChange={handleChange} />');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].eventType, 'change');
});

test('extracts JSX element tag name', () => {
  const results = analyzeCode('<button onClick={handleClick}>Click</button>');
  assertEqual(results.handlers[0].elementRef, 'button');
});

test('detects JSX with inline arrow function', () => {
  const results = analyzeCode('<button onClick={(e) => doSomething(e)}>Click</button>');
  assertEqual(results.handlers.length, 1);
  assertTrue(results.handlers[0].handler.isInline);
});

test('detects multiple JSX event handlers', () => {
  const results = analyzeCode('<input onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} />');
  assertEqual(results.handlers.length, 3);
});

test('detects JSX on custom components', () => {
  const results = analyzeCode('<CustomButton onClick={handleClick} />');
  assertEqual(results.handlers.length, 1);
  assertEqual(results.handlers[0].elementRef, 'CustomButton');
});

test('ignores non-event JSX attributes', () => {
  const results = analyzeCode('<div className="container" id="main" />');
  assertEqual(results.handlers.length, 0);
});

// === Mixed Framework Patterns ===
console.log('\n  Mixed Framework Patterns');

test('detects handlers from multiple frameworks', () => {
  const code = `
    // Native DOM
    button.addEventListener("click", nativeHandler);

    // jQuery
    $("#jqBtn").click(jqHandler);
  `;
  const results = analyzeCode(code);
  assertEqual(results.handlers.length, 2);
  assertEqual(results.stats.byPattern['addEventListener'], 1);
  assertEqual(results.stats.byPattern['jQueryShorthand'], 1);
});

test('statistics include all pattern types', () => {
  const code = `
    el.addEventListener("click", fn1);
    el.onclick = fn2;
    $("#btn").on("click", fn3);
    $("#btn").click(fn4);
  `;
  const results = analyzeCode(code);
  assertEqual(results.handlers.length, 4);
  assertTrue(results.stats.byPattern['addEventListener'] >= 1);
  assertTrue(results.stats.byPattern['propertyAssignment'] >= 1);
  assertTrue(results.stats.byPattern['jQueryOn'] >= 1);
  assertTrue(results.stats.byPattern['jQueryShorthand'] >= 1);
});

// Print results
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
