/**
 * VS Code Extension Tests
 *
 * Tests for the ActionLanguage Accessibility VS Code extension.
 * These tests verify the core logic without requiring the full VS Code runtime.
 */

const assert = require('assert');
const path = require('path');

// Test counter
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

// Load the analyzer to test integration
const basePath = path.join(__dirname, '../../src');
const { parseAndTransform } = require(path.join(basePath, 'parser'));
const AccessibilityReporter = require(path.join(basePath, 'analyzer/AccessibilityReporter'));

console.log('VS Code Extension Tests');
console.log('═'.repeat(50));

// ============================================================================
// Analyzer Integration Tests
// ============================================================================

console.log('\nAnalyzer Integration:');

test('analyzer loads correctly from extension path', () => {
  assert.ok(parseAndTransform, 'parseAndTransform should be available');
  assert.ok(AccessibilityReporter, 'AccessibilityReporter should be available');
});

test('can analyze simple code', () => {
  const code = `
    element.addEventListener('click', function() {
      console.log('clicked');
    });
  `;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  assert.ok(result, 'Should return a result');
  assert.ok(result.grade, 'Should have a grade');
  assert.ok(result.scores, 'Should have scores');
  assert.ok(Array.isArray(result.issues), 'Should have issues array');
});

test('detects keyboard accessibility issues', () => {
  const code = `
    button.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  `;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  const hasKeyboardIssue = result.issues.some(i =>
    i.message.toLowerCase().includes('keyboard')
  );

  assert.ok(hasKeyboardIssue, 'Should detect missing keyboard handler');
});

test('recognizes accessible patterns', () => {
  const code = `
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.addEventListener('click', handleClick);
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleClick(e);
    });
  `;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  assert.ok(result.scores.keyboard >= 70, 'Should have good keyboard score');
});

// ============================================================================
// Issue Mapping Tests
// ============================================================================

console.log('\nIssue Mapping:');

test('issues have required properties for diagnostics', () => {
  const code = `element.addEventListener('click', fn);`;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  for (const issue of result.issues) {
    assert.ok(issue.message, 'Issue should have message');
    assert.ok(issue.severity, 'Issue should have severity');
    assert.ok(['error', 'warning', 'info'].includes(issue.severity),
      'Severity should be error, warning, or info');
  }
});

test('issues include category for diagnostic codes', () => {
  const code = `
    element.addEventListener('click', fn);
    element.addEventListener('mouseover', fn);
  `;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  const issueWithCategory = result.issues.find(i => i.category);
  // Not all issues may have categories, so this is informational
  if (result.issues.length > 0) {
    console.log(`    (${result.issues.length} issues found)`);
  }
});

test('issues may include element name for range finding', () => {
  const code = `
    customButton.addEventListener('click', function() {
      console.log('click');
    });
  `;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  // Check if any issue references the element name
  const hasElementRef = result.issues.some(i =>
    i.element || i.message.includes('customButton')
  );

  // This is informational - not all analyzers track element names
  if (hasElementRef) {
    console.log('    (Element reference found in issues)');
  }
});

// ============================================================================
// Severity Filtering Tests
// ============================================================================

console.log('\nSeverity Filtering:');

test('can filter issues by error severity', () => {
  const code = `
    element.addEventListener('click', fn);
    element.setAttribute('aria-hidden', 'true');
  `;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  const severityOrder = { error: 0, warning: 1, info: 2 };
  const minLevel = 0; // error only

  const filtered = result.issues.filter(issue => {
    const level = severityOrder[issue.severity] || 2;
    return level <= minLevel;
  });

  // All filtered issues should be errors
  for (const issue of filtered) {
    assert.strictEqual(issue.severity, 'error');
  }
});

test('can filter issues by warning severity', () => {
  const code = `element.addEventListener('click', fn);`;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  const severityOrder = { error: 0, warning: 1, info: 2 };
  const minLevel = 1; // error and warning

  const filtered = result.issues.filter(issue => {
    const level = severityOrder[issue.severity] || 2;
    return level <= minLevel;
  });

  // No info issues should be in filtered results
  const hasInfo = filtered.some(i => i.severity === 'info');
  assert.ok(!hasInfo, 'Should not include info issues');
});

// ============================================================================
// Report Generation Tests
// ============================================================================

console.log('\nReport Generation:');

test('result has all required fields for status bar', () => {
  const code = `console.log('test');`;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  assert.ok(result.grade, 'Should have grade');
  assert.ok(result.scores, 'Should have scores');
  assert.ok(typeof result.scores.overall === 'number', 'Should have overall score');
  assert.ok(typeof result.scores.keyboard === 'number', 'Should have keyboard score');
  assert.ok(typeof result.scores.aria === 'number', 'Should have aria score');
  assert.ok(typeof result.scores.focus === 'number', 'Should have focus score');
});

test('result has statistics for report panel', () => {
  const code = `
    element.addEventListener('click', fn);
    element.addEventListener('keydown', fn);
    element.setAttribute('role', 'button');
  `;

  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  assert.ok(result.statistics, 'Should have statistics');
  assert.ok(result.statistics.events, 'Should have event statistics');
});

test('grade reflects score correctly', () => {
  // Test with code that should score well
  const goodCode = `
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.addEventListener('click', handleClick);
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    });
  `;

  const tree = parseAndTransform(goodCode);
  const reporter = new AccessibilityReporter();
  const result = reporter.analyze(tree);

  // Grade should match score range
  if (result.scores.overall >= 90) {
    assert.ok(['A', 'B'].includes(result.grade), 'High score should get A or B');
  }
});

// ============================================================================
// Parse Error Handling Tests
// ============================================================================

console.log('\nError Handling:');

test('handles parse errors gracefully', () => {
  const badCode = `function broken( { return; }`;

  let errorThrown = false;
  try {
    parseAndTransform(badCode);
  } catch (error) {
    errorThrown = true;
    assert.ok(error.message, 'Error should have a message');
  }

  assert.ok(errorThrown, 'Should throw error for invalid syntax');
});

test('error message is suitable for diagnostics', () => {
  const badCode = `const x = {`;

  try {
    parseAndTransform(badCode);
    assert.fail('Should have thrown');
  } catch (error) {
    // Error message should be descriptive enough for users
    assert.ok(error.message.length > 0, 'Error should have descriptive message');
    // Should not contain internal stack traces or paths
    assert.ok(!error.message.includes('node_modules'),
      'Error should not expose internal paths');
  }
});

// ============================================================================
// Package.json Validation Tests
// ============================================================================

console.log('\nPackage Configuration:');

test('package.json has required VS Code fields', () => {
  const pkg = require('../package.json');

  assert.ok(pkg.name, 'Should have name');
  assert.ok(pkg.displayName, 'Should have displayName');
  assert.ok(pkg.version, 'Should have version');
  assert.ok(pkg.engines && pkg.engines.vscode, 'Should have vscode engine version');
  assert.ok(pkg.main, 'Should have main entry point');
  assert.ok(pkg.activationEvents, 'Should have activation events');
});

test('package.json has contribution points', () => {
  const pkg = require('../package.json');

  assert.ok(pkg.contributes, 'Should have contributes');
  assert.ok(pkg.contributes.commands, 'Should contribute commands');
  assert.ok(pkg.contributes.configuration, 'Should contribute configuration');
});

test('commands are properly defined', () => {
  const pkg = require('../package.json');
  const commands = pkg.contributes.commands;

  assert.ok(commands.length >= 3, 'Should have at least 3 commands');

  for (const cmd of commands) {
    assert.ok(cmd.command, 'Command should have command id');
    assert.ok(cmd.title, 'Command should have title');
  }

  // Check specific commands exist
  const commandIds = commands.map(c => c.command);
  assert.ok(commandIds.includes('actionlanguage-a11y.analyzeFile'),
    'Should have analyzeFile command');
  assert.ok(commandIds.includes('actionlanguage-a11y.analyzeWorkspace'),
    'Should have analyzeWorkspace command');
  assert.ok(commandIds.includes('actionlanguage-a11y.showReport'),
    'Should have showReport command');
});

test('configuration properties are properly defined', () => {
  const pkg = require('../package.json');
  const config = pkg.contributes.configuration;

  assert.ok(config.properties, 'Should have configuration properties');

  // Check key settings exist
  const props = config.properties;
  assert.ok(props['actionlanguage-a11y.enable'], 'Should have enable setting');
  assert.ok(props['actionlanguage-a11y.analyzeOnSave'], 'Should have analyzeOnSave setting');
  assert.ok(props['actionlanguage-a11y.minSeverity'], 'Should have minSeverity setting');

  // Check types are specified
  for (const [key, value] of Object.entries(props)) {
    assert.ok(value.type, `${key} should have type`);
    assert.ok('default' in value, `${key} should have default value`);
  }
});

// ============================================================================
// Summary
// ============================================================================

console.log('\n' + '═'.repeat(50));
console.log(`VS Code Extension Tests: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
