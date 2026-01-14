/**
 * SemanticAnalyzer Tests
 *
 * Tests for semantic HTML usage detection
 */

const SemanticAnalyzer = require('../../src/analyzer/SemanticAnalyzer');
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

console.log('\nSemanticAnalyzer Tests');
console.log('========================================');

// === non-semantic-button ===
console.log('\n  non-semantic-button Detection');

test('detects role="button" assignment', () => {
  const code = `
    const element = document.getElementById('btn');
    element.setAttribute('role', 'button');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'non-semantic-button');
  assertDefined(issue, 'Should detect non-semantic-button');
  assertEqual(issue.severity, 'info');
  assertContains(issue.wcag, '4.1.2');
});

test('tracks createElement calls', () => {
  const code = `
    const div = document.createElement('div');
    const span = document.createElement('span');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  assertEqual(results.createdElements.length, 2);
  assertEqual(results.createdElements[0].type, 'div');
  assertEqual(results.createdElements[1].type, 'span');
});

test('does NOT track semantic element creation', () => {
  const code = `
    const button = document.createElement('button');
    const a = document.createElement('a');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  // Only non-semantic elements are tracked
  assertEqual(results.createdElements.length, 0);
});

// === non-semantic-link ===
console.log('\n  non-semantic-link Detection');

test('detects role="link" assignment', () => {
  const code = `
    const element = document.getElementById('link');
    element.setAttribute('role', 'link');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  assertGreaterThan(results.issues.length, 0, 'Should have issues');
  const issue = results.issues.find(i => i.type === 'non-semantic-link');
  assertDefined(issue, 'Should detect non-semantic-link');
  assertEqual(issue.severity, 'info');
  assertContains(issue.wcag, '4.1.2');
});

// === EventAnalyzer integration ===
console.log('\n  EventAnalyzer Integration');

test('detects click handlers via EventAnalyzer data', () => {
  const code = `
    const div = document.getElementById('fake-button');
    div.addEventListener('click', handleClick);
  `;
  const tree = parseAndTransform(code);

  // Simulate EventAnalyzer data
  const mockEventData = {
    handlers: [
      {
        type: 'addEventListener',
        elementRef: 'fake-button',
        eventType: 'click',
        handler: { actionId: 'handler-1' }
      }
    ]
  };

  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree, mockEventData);

  const issue = results.issues.find(i => i.type === 'non-semantic-button');
  assertDefined(issue);
  assertEqual(issue.elementRef, 'fake-button');
});

// === Statistics ===
console.log('\n  Statistics');

test('counts role assignments', () => {
  const code = `
    element1.setAttribute('role', 'button');
    element2.setAttribute('role', 'link');
    element3.setAttribute('role', 'button');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  assertEqual(results.roleAssignments.length, 3);
  assertEqual(results.stats.nonSemanticButtons, 2);
  assertEqual(results.stats.nonSemanticLinks, 1);
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('handles multiple role assignments to same element', () => {
  const code = `
    const el = document.getElementById('el');
    el.setAttribute('role', 'button');
    el.setAttribute('role', 'link');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  assertEqual(results.roleAssignments.length, 2);
});

test('only flags button and link roles', () => {
  const code = `
    el1.setAttribute('role', 'dialog');
    el2.setAttribute('role', 'navigation');
    el3.setAttribute('role', 'button');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  // Only button role should be flagged
  assertEqual(results.issues.length, 1);
  assertEqual(results.issues[0].type, 'non-semantic-button');
});

test('hasNonSemanticButtons returns true when issues exist', () => {
  const code = `
    element.setAttribute('role', 'button');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  assertTrue(results.hasNonSemanticButtons(), 'Should have non-semantic buttons');
});

test('hasNonSemanticLinks returns true when issues exist', () => {
  const code = `
    element.setAttribute('role', 'link');
  `;
  const tree = parseAndTransform(code);
  const analyzer = new SemanticAnalyzer();
  const results = analyzer.analyze(tree);

  assertTrue(results.hasNonSemanticLinks(), 'Should have non-semantic links');
});

// === Results ===
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
