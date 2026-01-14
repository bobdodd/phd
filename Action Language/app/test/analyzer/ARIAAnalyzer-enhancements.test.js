/**
 * ARIAAnalyzer Phase 2 Enhancement Tests
 *
 * Tests for new ARIA accessibility detections
 */

const ARIAAnalyzer = require('../../src/analyzer/ARIAAnalyzer');
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

console.log('\nARIAAnalyzer - Phase 2 Enhancements');
console.log('========================================');

// === static-aria-state ===
console.log('\n  static-aria-state Detection');

test('detects aria-pressed set once, never updated', () => {
  const code = `
    const button = document.getElementById('toggle');
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', function() {
      console.log('clicked');
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'static-aria-state');
  assertDefined(issue, 'Should detect static-aria-state');
  assertEqual(issue.severity, 'warning');
  assertContains(issue.wcag, '4.1.2');
  assertEqual(issue.attribute, 'aria-pressed');
});

test('detects aria-checked set once', () => {
  const code = `
    const checkbox = document.getElementById('check');
    checkbox.setAttribute('aria-checked', 'false');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'static-aria-state');
  assertDefined(issue, 'Should detect aria-checked');
  assertEqual(issue.attribute, 'aria-checked');
});

test('detects aria-expanded set once', () => {
  const code = `
    const accordion = document.getElementById('acc');
    accordion.setAttribute('aria-expanded', 'false');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'static-aria-state');
  assertDefined(issue, 'Should detect aria-expanded');
  assertEqual(issue.attribute, 'aria-expanded');
});

test('detects aria-selected set once', () => {
  const code = `
    const tab = document.getElementById('tab1');
    tab.setAttribute('aria-selected', 'true');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'static-aria-state');
  assertDefined(issue, 'Should detect aria-selected');
});

test('does NOT flag when aria-pressed is updated', () => {
  const code = `
    const button = document.getElementById('toggle');
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', function() {
      button.setAttribute('aria-pressed', 'true');
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i =>
    i.type === 'static-aria-state' && i.attribute === 'aria-pressed'
  );
  assertUndefined(issue, 'Should not flag updated attributes');
});

test('does NOT flag non-state ARIA attributes', () => {
  const code = `
    element.setAttribute('aria-label', 'Button');
    element.setAttribute('aria-describedby', 'desc');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  // aria-label and aria-describedby are not state attributes
  const issue = results.issues.find(i => i.type === 'static-aria-state');
  assertUndefined(issue, 'Should not flag non-state attributes');
});

test('tracks multiple state attributes separately', () => {
  const code = `
    button1.setAttribute('aria-pressed', 'false');
    button2.setAttribute('aria-checked', 'false');
    button3.setAttribute('aria-selected', 'false');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issues = results.issues.filter(i => i.type === 'static-aria-state');
  assertEqual(issues.length, 3, 'Should detect all 3 static states');
});

test('handles aria-current', () => {
  const code = `
    link.setAttribute('aria-current', 'page');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i =>
    i.type === 'static-aria-state' && i.attribute === 'aria-current'
  );
  assertDefined(issue, 'Should detect aria-current');
});

test('handles aria-busy', () => {
  const code = `
    section.setAttribute('aria-busy', 'true');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i =>
    i.type === 'static-aria-state' && i.attribute === 'aria-busy'
  );
  assertDefined(issue, 'Should detect aria-busy');
});

test('handles aria-disabled', () => {
  const code = `
    button.setAttribute('aria-disabled', 'true');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i =>
    i.type === 'static-aria-state' && i.attribute === 'aria-disabled'
  );
  assertDefined(issue, 'Should detect aria-disabled');
});

test('handles aria-invalid', () => {
  const code = `
    input.setAttribute('aria-invalid', 'false');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i =>
    i.type === 'static-aria-state' && i.attribute === 'aria-invalid'
  );
  assertDefined(issue, 'Should detect aria-invalid');
});

// === aria-reference-not-found (placeholder) ===
console.log('\n  aria-reference-not-found (Placeholder)');

test('does not crash when analyzing aria-labelledby', () => {
  const code = `
    const dialog = document.getElementById('dialog');
    dialog.setAttribute('aria-labelledby', 'dialog-title');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  // Method exists but doesn't create issues yet (needs ID tracking)
  assertDefined(results, 'Results should be defined');
});

test('handles aria-describedby', () => {
  const code = `
    element.setAttribute('aria-describedby', 'description-id');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  assertDefined(results, 'Results should be defined');
});

test('handles aria-controls', () => {
  const code = `
    button.setAttribute('aria-controls', 'panel-1');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  assertDefined(results, 'Results should be defined');
});

// === missing-live-region (placeholder) ===
console.log('\n  missing-live-region (Placeholder)');

test('does not crash when called', () => {
  const code = `
    const status = document.getElementById('status');
    status.textContent = 'Loading...';
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  // Method exists but doesn't create issues yet (needs DOM tracking)
  assertDefined(results, 'Results should be defined');
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('handles same attribute on different elements', () => {
  const code = `
    button1.setAttribute('aria-pressed', 'false');
    button2.setAttribute('aria-pressed', 'false');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  const issues = results.issues.filter(i => i.type === 'static-aria-state');
  assertEqual(issues.length, 2, 'Should detect both instances');
});

test('groups by element:attribute combination', () => {
  const code = `
    element.setAttribute('aria-pressed', 'false');
    element.setAttribute('aria-checked', 'false');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(tree);

  // Two different attributes on same element = 2 issues
  const issues = results.issues.filter(i => i.type === 'static-aria-state');
  assertEqual(issues.length, 2, 'Should detect both attributes');
});

// === Results ===
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
