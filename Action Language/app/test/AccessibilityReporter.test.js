/**
 * AccessibilityReporter Tests
 *
 * Tests for unified accessibility analysis and reporting
 */

const AccessibilityReporter = require('../src/analyzer/AccessibilityReporter');
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
 * Helper to analyze code
 */
function analyzeCode(code, options = {}) {
  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter(options);
  return reporter.analyze(tree);
}

console.log('\nAccessibilityReporter Tests');
console.log('========================================');

// === Basic Functionality ===
console.log('\n  Basic Functionality');

test('creates reporter with default options', () => {
  const reporter = new AccessibilityReporter();
  assertTrue(reporter.options.includeEventAnalysis);
  assertTrue(reporter.options.includeFocusAnalysis);
  assertTrue(reporter.options.includeAriaAnalysis);
  assertTrue(reporter.options.includeKeyboardAnalysis);
  assertTrue(reporter.options.includeWidgetValidation);
  assertFalse(reporter.options.strictMode);
});

test('creates reporter with custom options', () => {
  const reporter = new AccessibilityReporter({
    strictMode: true,
    includeEventAnalysis: false
  });
  assertTrue(reporter.options.strictMode);
  assertFalse(reporter.options.includeEventAnalysis);
});

test('returns results object from analyze', () => {
  const results = analyzeCode('const x = 1;');
  assertTrue(results !== null);
  assertTrue(results.timestamp !== undefined);
  assertTrue(results.scores !== undefined);
  assertTrue(results.grade !== undefined);
});

test('handles empty code', () => {
  const results = analyzeCode('');
  assertTrue(results !== null);
  assertEqual(results.issues.length, 0);
});

// === Score Calculation ===
console.log('\n  Score Calculation');

test('calculates overall score', () => {
  const results = analyzeCode('const x = 1;');
  assertTrue(results.scores.overall >= 0);
  assertTrue(results.scores.overall <= 100);
});

test('calculates category scores', () => {
  const results = analyzeCode('const x = 1;');
  assertTrue(results.scores.keyboard >= 0);
  assertTrue(results.scores.aria >= 0);
  assertTrue(results.scores.focus >= 0);
  assertTrue(results.scores.widgets >= 0);
});

test('good code gets high score', () => {
  const code = `
    // Good accessible dialog
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
    dialog.setAttribute('aria-modal', 'true');

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDialog();
      if (e.key === 'Tab') {
        e.preventDefault();
        handleTab(e);
      }
    });

    function openDialog() {
      dialog.style.display = 'block';
      firstInput.focus();
    }
  `;
  const results = analyzeCode(code);
  assertTrue(results.scores.overall >= 60, `Score should be >= 60, got ${results.scores.overall}`);
});

test('problematic code gets lower score', () => {
  const code = `
    // Mouse-only button
    button.addEventListener('click', handleClick);
    // No keyboard support
  `;
  const results = analyzeCode(code);
  assertTrue(results.scores.overall < 100);
  assertTrue(results.hasWarnings());
});

// === Grade Calculation ===
console.log('\n  Grade Calculation');

test('grade A for score >= 90', () => {
  const reporter = new AccessibilityReporter();
  assertEqual(reporter.calculateGrade(95), 'A');
  assertEqual(reporter.calculateGrade(90), 'A');
});

test('grade B for score >= 80', () => {
  const reporter = new AccessibilityReporter();
  assertEqual(reporter.calculateGrade(85), 'B');
  assertEqual(reporter.calculateGrade(80), 'B');
});

test('grade C for score >= 70', () => {
  const reporter = new AccessibilityReporter();
  assertEqual(reporter.calculateGrade(75), 'C');
  assertEqual(reporter.calculateGrade(70), 'C');
});

test('grade D for score >= 60', () => {
  const reporter = new AccessibilityReporter();
  assertEqual(reporter.calculateGrade(65), 'D');
  assertEqual(reporter.calculateGrade(60), 'D');
});

test('grade F for score < 60', () => {
  const reporter = new AccessibilityReporter();
  assertEqual(reporter.calculateGrade(55), 'F');
  assertEqual(reporter.calculateGrade(0), 'F');
});

// === Issue Collection ===
console.log('\n  Issue Collection');

test('collects keyboard issues', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  assertTrue(results.issues.some(i => i.category === 'keyboard'));
});

test('collects ARIA issues', () => {
  const code = `element.setAttribute('role', 'invalidrole');`;
  const results = analyzeCode(code);
  assertTrue(results.issues.some(i => i.category === 'aria'));
});

test('collects focus issues', () => {
  const code = `
    div.focus(); // focusing non-focusable
  `;
  const results = analyzeCode(code);
  assertTrue(results.issues.some(i => i.category === 'focus'));
});

test('collects widget validation issues', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    // Missing aria-labelledby
  `;
  const results = analyzeCode(code);
  assertTrue(results.issues.some(i => i.category === 'widget' || i.source === 'WidgetPatternValidator'));
});

test('issues include WCAG mapping', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  const keyboardIssue = results.issues.find(i => i.category === 'keyboard');
  assertTrue(keyboardIssue.wcag !== undefined);
  assertTrue(keyboardIssue.wcag.length > 0);
});

// === WCAG Compliance ===
console.log('\n  WCAG Compliance');

test('maps issues to WCAG criteria', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  assertTrue(results.wcagCompliance !== undefined);
  assertTrue(results.wcagCompliance['2.1.1'] !== undefined);
});

test('WCAG criteria include status', () => {
  const results = analyzeCode('const x = 1;');
  const criterion = results.wcagCompliance['2.1.1'];
  assertTrue(['pass', 'fail', 'warning'].includes(criterion.status));
});

test('WCAG criteria include level', () => {
  const results = analyzeCode('const x = 1;');
  const criterion = results.wcagCompliance['2.1.1'];
  assertTrue(['A', 'AA', 'AAA'].includes(criterion.level));
});

test('determines WCAG level from compliance', () => {
  const results = analyzeCode('const x = 1;');
  const level = results.getWCAGLevel();
  assertTrue(['None', 'A', 'AA', 'AAA'].includes(level));
});

// === Issue Grouping ===
console.log('\n  Issue Grouping');

test('groups issues by category', () => {
  const code = `
    button.addEventListener('click', handleClick);
    element.setAttribute('role', 'invalidrole');
  `;
  const results = analyzeCode(code);
  assertTrue(results.issuesByCategory.keyboard !== undefined);
  assertTrue(results.issuesByCategory.aria !== undefined);
  assertTrue(Array.isArray(results.issuesByCategory.keyboard));
});

test('groups issues by severity', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  assertTrue(results.issuesBySeverity.error !== undefined);
  assertTrue(results.issuesBySeverity.warning !== undefined);
  assertTrue(results.issuesBySeverity.info !== undefined);
});

// === Recommendations ===
console.log('\n  Recommendations');

test('generates recommendations', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  assertTrue(results.recommendations.length > 0);
});

test('recommendations have priority', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  const rec = results.recommendations[0];
  assertTrue(['high', 'medium', 'low'].includes(rec.priority));
});

test('recommendations have title and suggestion', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  const rec = results.recommendations[0];
  assertTrue(rec.title !== undefined);
  assertTrue(rec.suggestion !== undefined);
});

test('recommendations include WCAG mapping', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  const rec = results.recommendations[0];
  assertTrue(rec.wcag !== undefined);
});

test('proactive recommendations for missing labels', () => {
  const code = `
    button.addEventListener('click', handleClick);
    button.addEventListener('keydown', handleKey);
  `;
  const results = analyzeCode(code);
  // Should recommend adding ARIA labels
  assertTrue(results.recommendations.some(r =>
    r.title.toLowerCase().includes('label')
  ));
});

// === Statistics ===
console.log('\n  Statistics');

test('compiles event statistics', () => {
  const code = `
    element.addEventListener('click', handler);
    element.addEventListener('keydown', handler);
  `;
  const results = analyzeCode(code);
  assertTrue(results.statistics.events !== undefined);
  assertTrue(results.statistics.events.totalHandlers >= 0);
});

test('compiles keyboard statistics', () => {
  const code = `
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') activate();
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.statistics.keyboard !== undefined);
  assertTrue(results.statistics.keyboard.keyboardHandlers >= 0);
});

test('compiles ARIA statistics', () => {
  const code = `element.setAttribute('aria-label', 'test');`;
  const results = analyzeCode(code);
  assertTrue(results.statistics.aria !== undefined);
  assertTrue(results.statistics.aria.ariaAttributes >= 0);
});

test('compiles focus statistics', () => {
  const code = `element.focus();`;
  const results = analyzeCode(code);
  assertTrue(results.statistics.focus !== undefined);
  assertTrue(results.statistics.focus.focusCalls >= 0);
});

test('compiles widget statistics', () => {
  const code = `element.setAttribute('role', 'dialog');`;
  const results = analyzeCode(code);
  assertTrue(results.statistics.widgets !== undefined);
  assertTrue(results.statistics.widgets.patternsDetected >= 0);
});

// === Convenience Methods ===
console.log('\n  Convenience Methods');

test('hasIssues returns true when issues present', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  assertTrue(results.hasIssues());
});

test('hasIssues returns false when no issues', () => {
  const results = analyzeCode('const x = 1;');
  assertFalse(results.hasIssues());
});

test('hasErrors returns true for error severity', () => {
  const code = `element.setAttribute('role', 'invalidrole');`;
  const results = analyzeCode(code);
  assertTrue(results.hasErrors());
});

test('hasWarnings returns true for warning severity', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  assertTrue(results.hasWarnings());
});

test('getIssueCount returns correct count', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code);
  assertEqual(results.getIssueCount(), results.issues.length);
});

test('isAccessible returns true when no errors', () => {
  const results = analyzeCode('const x = 1;');
  assertTrue(results.isAccessible());
});

test('isAccessible returns false when errors present', () => {
  const code = `element.setAttribute('role', 'invalidrole');`;
  const results = analyzeCode(code);
  assertFalse(results.isAccessible());
});

// === Report Generation ===
console.log('\n  Report Generation');

test('generates text summary', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
  `;
  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  reporter.analyze(tree);
  const summary = reporter.getSummary();
  assertTrue(summary.includes('Accessibility Analysis Report'));
  assertTrue(summary.includes('Grade:'));
  assertTrue(summary.includes('WCAG'));
});

test('summary includes score bars', () => {
  const code = `element.setAttribute('role', 'dialog');`;
  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  reporter.analyze(tree);
  const summary = reporter.getSummary();
  assertTrue(summary.includes('Keyboard:'));
  assertTrue(summary.includes('ARIA:'));
});

test('generates JSON report', () => {
  const code = `element.setAttribute('role', 'dialog');`;
  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  reporter.analyze(tree);
  const json = reporter.getJSONReport();
  const parsed = JSON.parse(json);
  assertTrue(parsed.scores !== undefined);
  assertTrue(parsed.grade !== undefined);
});

test('generates HTML report', () => {
  const code = `element.setAttribute('role', 'dialog');`;
  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  reporter.analyze(tree);
  const html = reporter.getHTMLReport();
  assertTrue(html.includes('<!DOCTYPE html>'));
  assertTrue(html.includes('Accessibility'));
  assertTrue(html.includes('Overall Score'));
});

test('HTML report includes issues', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const tree = parseAndTransform(code);
  const reporter = new AccessibilityReporter();
  reporter.analyze(tree);
  const html = reporter.getHTMLReport();
  assertTrue(html.includes('Issues'));
});

// === Analyzer Options ===
console.log('\n  Analyzer Options');

test('can disable event analysis', () => {
  const code = `button.addEventListener('click', handleClick);`;
  const results = analyzeCode(code, { includeEventAnalysis: false });
  assertTrue(results.analyzerResults.events === undefined);
});

test('can disable focus analysis', () => {
  const results = analyzeCode('element.focus();', { includeFocusAnalysis: false });
  assertTrue(results.analyzerResults.focus === undefined);
});

test('can disable ARIA analysis', () => {
  const code = `element.setAttribute('role', 'dialog');`;
  const results = analyzeCode(code, { includeAriaAnalysis: false });
  assertTrue(results.analyzerResults.aria === undefined);
});

test('can disable keyboard analysis', () => {
  const code = `element.addEventListener('keydown', handler);`;
  const results = analyzeCode(code, { includeKeyboardAnalysis: false });
  assertTrue(results.analyzerResults.keyboard === undefined);
});

test('can disable widget validation', () => {
  const code = `element.setAttribute('role', 'dialog');`;
  const results = analyzeCode(code, { includeWidgetValidation: false });
  assertTrue(results.widgetValidation === null);
});

// === Complex Scenarios ===
console.log('\n  Complex Scenarios');

test('analyzes complete accessible component', () => {
  const code = `
    // Accessible modal dialog
    const modal = document.getElementById('modal');
    const trigger = document.getElementById('trigger');
    let previousFocus = null;

    function openModal() {
      previousFocus = document.activeElement;
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      modal.querySelector('[autofocus]').focus();
    }

    function closeModal() {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      previousFocus.focus();
    }

    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
      if (e.key === 'Tab') {
        // Tab trap logic
        e.preventDefault();
        if (e.shiftKey) {
          focusPrevious();
        } else {
          focusNext();
        }
      }
    });

    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openModal();
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.scores.overall >= 50);
  assertTrue(results.statistics.keyboard.keyboardHandlers >= 1);
});

test('analyzes inaccessible component', () => {
  const code = `
    // Inaccessible custom button
    div.addEventListener('click', handleClick);
    // No role, no keyboard support, no focus
  `;
  const results = analyzeCode(code);
  assertTrue(results.hasWarnings());
  assertTrue(results.issues.length > 0);
  assertTrue(results.recommendations.length > 0);
});

test('analyzes tabs widget', () => {
  const code = `
    tablist.setAttribute('role', 'tablist');

    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tab.setAttribute('aria-controls', 'panel-' + i);
    });

    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
    });

    tablist.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextTab();
      if (e.key === 'ArrowLeft') prevTab();
      if (e.key === 'Home') firstTab();
      if (e.key === 'End') lastTab();
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.statistics.widgets.patternsDetected >= 1);
});

test('tracks analysis time', () => {
  const results = analyzeCode('const x = 1;');
  assertTrue(results.analysisTime >= 0);
  assertTrue(typeof results.analysisTime === 'number');
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('handles null tree gracefully', () => {
  const reporter = new AccessibilityReporter();
  const results = reporter.analyze(null);
  assertTrue(results !== null);
});

test('getSummary before analyze returns message', () => {
  const reporter = new AccessibilityReporter();
  const summary = reporter.getSummary();
  assertTrue(summary.includes('No analysis'));
});

test('getHTMLReport before analyze returns message', () => {
  const reporter = new AccessibilityReporter();
  const html = reporter.getHTMLReport();
  assertTrue(html.includes('No analysis'));
});

test('getResults returns null before analyze', () => {
  const reporter = new AccessibilityReporter();
  assertEqual(reporter.getResults(), null);
});

test('can reanalyze multiple times', () => {
  const reporter = new AccessibilityReporter();
  const tree1 = parseAndTransform('const x = 1;');
  const tree2 = parseAndTransform('element.focus();');

  const results1 = reporter.analyze(tree1);
  const results2 = reporter.analyze(tree2);

  // Results should be different objects (different issue counts)
  assertTrue(results1 !== results2);
  // Second analysis should have focus-related content
  assertTrue(results2.statistics.focus.focusCalls >= 1);
});

// Print results
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
