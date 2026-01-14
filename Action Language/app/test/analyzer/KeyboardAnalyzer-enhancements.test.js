/**
 * KeyboardAnalyzer Phase 1 Enhancement Tests
 *
 * Tests for new keyboard accessibility detections
 */

const KeyboardAnalyzer = require('../../src/analyzer/KeyboardAnalyzer');
const { parseAndTransform } = require('../../src/parser');

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

function assertGreaterThan(actual, expected, message = '') {
  if (actual <= expected) {
    throw new Error(`${message}\nExpected > ${expected}\nGot: ${actual}`);
  }
}

function assertDefined(value, message = '') {
  if (value === undefined || value === null) {
    throw new Error(message || 'Expected value to be defined');
  }
}

function assertUndefined(value, message = '') {
  if (value !== undefined) {
    throw new Error(message || 'Expected value to be undefined');
  }
}

function assertContains(array, value, message = '') {
  if (!array.includes(value)) {
    throw new Error(message || `Expected array to contain ${value}`);
  }
}

console.log('\nKeyboardAnalyzer - Phase 1 Enhancements');
console.log('========================================');

// === missing-escape-handler ===
console.log('\n  missing-escape-handler Detection');

test('detects Tab trap without Escape handler', () => {
  const code = `
    modal.addEventListener('keydown', function(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        // Focus trap logic...
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'missing-escape-handler');
  assertDefined(issue, 'Should detect missing-escape-handler');
  assertEqual(issue.severity, 'warning');
  assertContains(issue.wcag, '2.1.2');
});

test('does NOT flag Tab trap with Escape handler in same handler', () => {
  const code = `
    modal.addEventListener('keydown', function(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
      }
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'missing-escape-handler');
  assertUndefined(issue, 'Should not flag when Escape exists');
});

test('does NOT flag Tab trap with Escape in separate handler', () => {
  const code = `
    modal.addEventListener('keydown', function(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
      }
    });
    modal.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'missing-escape-handler');
  assertUndefined(issue, 'Should not flag with separate Escape handler');
});

test('handles keyCode 27 as Escape', () => {
  const code = `
    modal.addEventListener('keydown', function(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
      }
      if (event.keyCode === 27) {
        closeModal();
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'missing-escape-handler');
  assertUndefined(issue, 'Should recognize keyCode 27');
});

// === incomplete-activation-keys ===
console.log('\n  incomplete-activation-keys Detection');

test('detects Enter without Space', () => {
  const code = `
    customButton.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        activate();
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'incomplete-activation-keys');
  assertDefined(issue, 'Should detect incomplete-activation-keys');
  assertEqual(issue.severity, 'warning');
  assertContains(issue.wcag, '2.1.1');
  assertEqual(issue.missingKey, 'Space');
});

test('detects Space without Enter', () => {
  const code = `
    toggle.addEventListener('keydown', function(event) {
      if (event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'incomplete-activation-keys');
  assertDefined(issue, 'Should detect missing Enter');
  assertEqual(issue.missingKey, 'Enter');
});

test('does NOT flag when both Enter and Space are handled', () => {
  const code = `
    button.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'incomplete-activation-keys');
  assertUndefined(issue, 'Should not flag when both keys present');
});

test('handles Space key variations', () => {
  const code = `
    button.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        activate();
      }
      if (event.key === 'Space') {
        activate();
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'incomplete-activation-keys');
  assertUndefined(issue, 'Should handle Space variations');
});

test('handles keyCode 32 (Space) and 13 (Enter)', () => {
  const code = `
    button.addEventListener('keydown', function(event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        activate();
      }
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'incomplete-activation-keys');
  assertUndefined(issue, 'Should recognize keyCodes');
});

// === touch-without-click ===
console.log('\n  touch-without-click Detection');

test('detects touchstart without click', () => {
  const code = `
    button.addEventListener('touchstart', handleTouch);
  `;
  const tree = parseAndTransform(code);

  // Mock EventAnalyzer data
  const mockEventData = {
    handlers: [
      {
        type: 'addEventListener',
        elementRef: 'button',
        eventType: 'touchstart',
        handler: { actionId: 'handler-1' }
      }
    ]
  };

  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree, mockEventData);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'touch-without-click');
  assertDefined(issue, 'Should detect touch-without-click');
  assertEqual(issue.severity, 'warning');
  assertContains(issue.wcag, '2.5.2');
});

test('detects touchend without click', () => {
  const code = `
    swipeArea.addEventListener('touchend', handleSwipe);
  `;
  const tree = parseAndTransform(code);

  const mockEventData = {
    handlers: [
      {
        type: 'addEventListener',
        elementRef: 'swipeArea',
        eventType: 'touchend',
        handler: { actionId: 'handler-1' }
      }
    ]
  };

  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree, mockEventData);

  const issue = results.issues.find(i => i.type === 'touch-without-click');
  assertDefined(issue, 'Should detect touchend');
});

test('does NOT flag touch with click handler', () => {
  const code = `
    button.addEventListener('touchstart', handleTouch);
    button.addEventListener('click', handleClick);
  `;
  const tree = parseAndTransform(code);

  const mockEventData = {
    handlers: [
      {
        type: 'addEventListener',
        elementRef: 'button',
        eventType: 'touchstart',
        handler: { actionId: 'handler-1' }
      },
      {
        type: 'addEventListener',
        elementRef: 'button',
        eventType: 'click',
        handler: { actionId: 'handler-2' }
      }
    ]
  };

  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree, mockEventData);

  const issue = results.issues.find(i => i.type === 'touch-without-click');
  assertUndefined(issue, 'Should not flag with click handler');
});

test('skips detection when no EventAnalyzer data provided', () => {
  const code = `
    button.addEventListener('touchstart', handleTouch);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree); // No EventAnalyzer data

  // Should not crash, just skip the detection
  assertTrue(results.issues !== undefined, 'Results should be defined');
});

test('includes touch event types in issue', () => {
  const code = ``;
  const tree = parseAndTransform(code);

  const mockEventData = {
    handlers: [
      {
        type: 'addEventListener',
        elementRef: 'element',
        eventType: 'touchstart',
        handler: { actionId: 'h1' }
      },
      {
        type: 'addEventListener',
        elementRef: 'element',
        eventType: 'touchend',
        handler: { actionId: 'h2' }
      }
    ]
  };

  const analyzer = new KeyboardAnalyzer();
  const results = analyzer.analyze(tree, mockEventData);

  const issue = results.issues.find(i => i.type === 'touch-without-click');
  assertDefined(issue, 'Should find issue');
  assertContains(issue.touchEvents, 'touchstart');
  assertContains(issue.touchEvents, 'touchend');
});

// === Results ===
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
