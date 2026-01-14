/**
 * ContextChangeAnalyzer Tests
 *
 * Tests for unexpected context change detection
 */

const ContextChangeAnalyzer = require('../../src/analyzer/ContextChangeAnalyzer');
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

console.log('\nContextChangeAnalyzer Tests');
console.log('========================================');

// === unexpected-form-submit ===
console.log('\n  unexpected-form-submit Detection');

test('detects form.submit() in input handler', () => {
  const code = `
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    input.addEventListener('input', function() {
      form.submit();
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'unexpected-form-submit');
  assertDefined(issue, 'Should detect unexpected-form-submit');
  assertEqual(issue.severity, 'warning');
  assertContains(issue.wcag, '3.2.2');
});

test('detects form.submit() in change handler', () => {
  const code = `
    const form = document.getElementById('form');
    const select = document.getElementById('select');
    select.addEventListener('change', function() {
      form.submit();
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unexpected-form-submit');
  assertDefined(issue);
});

test('does NOT flag form.submit() in click handler', () => {
  const code = `
    const form = document.getElementById('form');
    const button = document.getElementById('button');
    button.addEventListener('click', function() {
      form.submit();
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unexpected-form-submit');
  assertUndefined(issue, 'Should not flag form submit in click handler');
});

// === unexpected-navigation ===
console.log('\n  unexpected-navigation Detection');

test('detects window.location in change handler', () => {
  const code = `
    const select = document.getElementById('lang');
    select.addEventListener('change', function() {
      window.location = '/lang/' + this.value;
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unexpected-navigation');
  assertDefined(issue);
  assertEqual(issue.severity, 'warning');
  assertContains(issue.wcag, '3.2.2');
});

test('detects location.assign() in input handler', () => {
  const code = `
    const input = document.getElementById('jump');
    input.addEventListener('input', function() {
      location.assign('/page/' + this.value);
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unexpected-navigation');
  assertDefined(issue);
});

test('detects navigation in focus handler', () => {
  const code = `
    const input = document.getElementById('input');
    input.addEventListener('focus', function() {
      window.location = '/dashboard';
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unexpected-navigation');
  assertDefined(issue);
  assertContains(issue.wcag, '3.2.1', 'Should reference On Focus criterion');
});

test('does NOT flag navigation in click handler', () => {
  const code = `
    const button = document.getElementById('nav-btn');
    button.addEventListener('click', function() {
      window.location = '/next-page';
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  const issue = results.issues.find(i => i.type === 'unexpected-navigation');
  assertUndefined(issue, 'Should not flag navigation in click handler');
});

// === Statistics ===
console.log('\n  Statistics');

test('tracks form submissions', () => {
  const code = `
    const form = document.getElementById('form');
    input.addEventListener('input', () => form.submit());
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  assertEqual(results.stats.totalFormSubmits, 1);
});

test('tracks navigation changes', () => {
  const code = `
    select.addEventListener('change', () => {
      window.location = '/page';
    });
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ContextChangeAnalyzer();
  const results = analyzer.analyze(tree);

  assertEqual(results.stats.totalNavigations, 1);
});

// === Results ===
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
