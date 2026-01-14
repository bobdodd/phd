/**
 * TimingAnalyzer Tests
 *
 * Tests for timing-related accessibility issues
 */

const TimingAnalyzer = require('../../src/analyzer/TimingAnalyzer');
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

console.log('\nTimingAnalyzer Tests');
console.log('========================================');

// === unannounced-timeout ===
console.log('\n  unannounced-timeout Detection');

test('detects setTimeout with navigation and long delay', () => {
  const code = `
    setTimeout(function() {
      window.location = '/logout';
    }, 30000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'unannounced-timeout');
  assertDefined(issue, 'Should detect unannounced-timeout');
  assertEqual(issue.severity, 'warning');
  assertContains(issue.wcag, '2.2.1');
  assertTrue(issue.hasNavigation, 'Should have hasNavigation flag');
});

test('detects setTimeout with major DOM changes', () => {
  const code = `
    setTimeout(function() {
      const div = document.getElementById('content');
      div.innerHTML = '<p>Changed</p>';
    }, 10000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'unannounced-timeout');
  assertDefined(issue, 'Should detect unannounced-timeout');
  assertTrue(issue.hasMajorDOMChange, 'Should have hasMajorDOMChange flag');
});

test('does NOT flag setTimeout with short delay', () => {
  const code = `
    setTimeout(function() {
      window.location = '/page';
    }, 1000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  // Short delays (< 5000ms) should not be flagged by default
  const issue = results.issues.find(i => i.type === 'unannounced-timeout');
  assertUndefined(issue, 'Should not flag short timeouts');
});

test('does NOT flag setTimeout without major actions', () => {
  const code = `
    setTimeout(function() {
      console.log('Hello');
    }, 30000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unannounced-timeout');
  assertUndefined(issue, 'Should not flag trivial timeouts');
});

test('handles location.assign in timeout', () => {
  const code = `
    setTimeout(function() {
      location.assign('/page');
    }, 15000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unannounced-timeout');
  assertDefined(issue, 'Should detect location.assign');
});

test('handles element.remove in timeout', () => {
  const code = `
    setTimeout(function() {
      element.remove();
    }, 10000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unannounced-timeout');
  assertDefined(issue, 'Should detect element.remove');
});

// === uncontrolled-auto-update ===
console.log('\n  uncontrolled-auto-update Detection');

test('detects setInterval without clearInterval', () => {
  const code = `
    setInterval(function() {
      updateFeed();
    }, 5000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'uncontrolled-auto-update');
  assertDefined(issue, 'Should detect uncontrolled-auto-update');
  assertEqual(issue.severity, 'warning');
  assertContains(issue.wcag, '2.2.2');
});

test('does NOT flag setInterval when clearInterval exists', () => {
  const code = `
    const intervalId = setInterval(function() {
      updateContent();
    }, 3000);

    clearInterval(intervalId);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  // If there's ANY clearInterval, we don't flag (simplified heuristic)
  const issue = results.issues.find(i => i.type === 'uncontrolled-auto-update');
  assertUndefined(issue, 'Should not flag when clearInterval exists');
});

test('detects multiple setInterval without clearInterval', () => {
  const code = `
    setInterval(() => update1(), 1000);
    setInterval(() => update2(), 2000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  const issues = results.issues.filter(i => i.type === 'uncontrolled-auto-update');
  assertEqual(issues.length, 2, 'Should detect both intervals');
});

// === Statistics ===
console.log('\n  Statistics');

test('counts timeouts and intervals', () => {
  const code = `
    setTimeout(() => console.log('1'), 1000);
    setTimeout(() => console.log('2'), 2000);
    setInterval(() => update(), 3000);
    clearInterval(someId);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  assertEqual(results.stats.totalTimeouts, 2);
  assertEqual(results.stats.totalIntervals, 1);
  assertEqual(results.stats.clearedIntervals, 1);
});

test('calculates uncleared intervals', () => {
  const code = `
    setInterval(() => update1(), 1000);
    setInterval(() => update2(), 2000);
    setInterval(() => update3(), 3000);
  `;
  const tree = parseAndTransform(code);
  const analyzer = new TimingAnalyzer();
  const results = analyzer.analyze(tree);

  assertEqual(results.stats.unclearedIntervals, 3);
});

// === Results ===
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
