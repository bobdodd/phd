/**
 * WidgetPatternValidator Tests
 *
 * Tests for WAI-ARIA Authoring Practices validation
 */

const WidgetPatternValidator = require('../src/analyzer/WidgetPatternValidator');
const ARIAAnalyzer = require('../src/analyzer/ARIAAnalyzer');
const KeyboardAnalyzer = require('../src/analyzer/KeyboardAnalyzer');
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
 * Helper to run all analyzers on code
 */
function analyzeCode(code) {
  const tree = parseAndTransform(code);

  const ariaAnalyzer = new ARIAAnalyzer();
  const keyboardAnalyzer = new KeyboardAnalyzer();
  const focusAnalyzer = new FocusAnalyzer();

  return {
    aria: ariaAnalyzer.analyze(tree),
    keyboard: keyboardAnalyzer.analyze(tree),
    focus: focusAnalyzer.analyze(tree)
  };
}

/**
 * Helper to validate code
 */
function validateCode(code, options = {}) {
  const analyzerResults = analyzeCode(code);
  const validator = new WidgetPatternValidator(options);
  return validator.validate(analyzerResults);
}

console.log('\nWidgetPatternValidator Tests');
console.log('========================================');

// === Basic Functionality ===
console.log('\n  Basic Functionality');

test('creates validator with default options', () => {
  const validator = new WidgetPatternValidator();
  assertEqual(validator.options.strictMode, false);
  assertEqual(validator.options.validateKeyboard, true);
  assertEqual(validator.options.validateAria, true);
  assertEqual(validator.options.validateFocus, true);
});

test('creates validator with custom options', () => {
  const validator = new WidgetPatternValidator({ strictMode: true });
  assertEqual(validator.options.strictMode, true);
});

test('returns empty results for null analyzer results', () => {
  const validator = new WidgetPatternValidator();
  const results = validator.validate({});
  assertEqual(results.patterns.length, 0);
});

test('defines all WAI-ARIA APG patterns', () => {
  const validator = new WidgetPatternValidator();
  const patterns = validator.getSupportedPatterns();
  assertTrue(patterns.length >= 15, 'Should have at least 15 patterns');
  assertTrue(patterns.some(p => p.id === 'dialog'));
  assertTrue(patterns.some(p => p.id === 'tabs'));
  assertTrue(patterns.some(p => p.id === 'menu'));
  assertTrue(patterns.some(p => p.id === 'combobox'));
});

// === Pattern Detection ===
console.log('\n  Pattern Detection');

test('detects dialog pattern from role', () => {
  const code = `
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-labelledby', 'title');
  `;
  const results = validateCode(code);
  assertTrue(results.hasPatterns());
  assertTrue(results.patterns.some(p => p.type === 'dialog'));
});

test('detects tabs pattern from roles', () => {
  const code = `
    tablist.setAttribute('role', 'tablist');
    tab1.setAttribute('role', 'tab');
    panel1.setAttribute('role', 'tabpanel');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'tabs'));
});

test('detects menu pattern from role', () => {
  const code = `
    menu.setAttribute('role', 'menu');
    item.setAttribute('role', 'menuitem');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'menu'));
});

test('detects listbox pattern from role', () => {
  const code = `
    list.setAttribute('role', 'listbox');
    option.setAttribute('role', 'option');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'listbox'));
});

test('detects slider pattern from role', () => {
  const code = `
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuenow', '50');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'slider'));
});

test('detects checkbox pattern from role', () => {
  const code = `
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', 'false');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'checkbox'));
});

test('detects combobox pattern from role', () => {
  const code = `
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'listbox1');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'combobox'));
});

test('detects tree pattern from role', () => {
  const code = `
    tree.setAttribute('role', 'tree');
    item.setAttribute('role', 'treeitem');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'treeview'));
});

test('detects grid pattern from role', () => {
  const code = `
    grid.setAttribute('role', 'grid');
    cell.setAttribute('role', 'gridcell');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'grid'));
});

test('detects alertdialog pattern from role', () => {
  const code = `
    element.setAttribute('role', 'alertdialog');
    element.setAttribute('aria-labelledby', 'title');
    element.setAttribute('aria-describedby', 'desc');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'alertdialog'));
});

// === ARIA Validation ===
console.log('\n  ARIA Validation');

test('validates required ARIA attributes for dialog', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('dialog');
  assertTrue(validation !== undefined);
  assertTrue(validation.checks.some(c => c.type === 'aria-attr' && c.status === 'pass'));
});

test('flags missing required ARIA attribute', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    // Missing aria-labelledby
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('dialog');
  assertTrue(validation.checks.some(c =>
    c.type === 'aria-attr' && c.message.includes('aria-labelledby')
  ));
});

test('validates checkbox aria-checked', () => {
  const code = `
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', 'false');
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('checkbox');
  assertTrue(validation.checks.some(c => c.type === 'aria-attr' && c.status === 'pass'));
});

test('flags checkbox missing aria-checked', () => {
  const code = `
    checkbox.setAttribute('role', 'checkbox');
    // Missing aria-checked
  `;
  const results = validateCode(code);
  assertTrue(results.hasWarnings());
});

test('validates slider required attributes', () => {
  const code = `
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuenow', '50');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('slider');
  assertTrue(validation.passed >= 3);
});

// === Keyboard Validation ===
console.log('\n  Keyboard Validation');

test('validates dialog keyboard handling', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') handleTab(e);
      if (e.key === 'Escape') closeDialog();
    });
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('dialog');
  assertTrue(validation.checks.some(c =>
    c.type === 'keyboard' && c.message.includes('Tab') && c.status === 'pass'
  ));
  assertTrue(validation.checks.some(c =>
    c.type === 'keyboard' && c.message.includes('Escape') && c.status === 'pass'
  ));
});

test('flags missing keyboard handling', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
    // No keyboard handling
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('dialog');
  assertTrue(validation.checks.some(c =>
    c.type === 'keyboard' && (c.status === 'warn' || c.status === 'fail')
  ));
});

test('validates tabs arrow key navigation', () => {
  const code = `
    tablist.setAttribute('role', 'tablist');
    tablist.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextTab();
      if (e.key === 'ArrowLeft') prevTab();
    });
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('tabs');
  assertTrue(validation.checks.some(c =>
    c.type === 'keyboard' && c.message.includes('ArrowRight') && c.status === 'pass'
  ));
});

test('validates menu keyboard handling', () => {
  const code = `
    menu.setAttribute('role', 'menu');
    menu.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown': focusNext(); break;
        case 'ArrowUp': focusPrev(); break;
        case 'Enter': activateItem(); break;
        case 'Escape': closeMenu(); break;
      }
    });
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('menu');
  assertTrue(validation.passed >= 4);
});

test('validates slider keyboard handling', () => {
  const code = `
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuenow', '50');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') increase();
      if (e.key === 'ArrowLeft') decrease();
      if (e.key === 'ArrowUp') increase();
      if (e.key === 'ArrowDown') decrease();
    });
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('slider');
  assertTrue(validation.passed >= 4);
});

// === Focus Validation ===
console.log('\n  Focus Validation');

test('detects focus management in dialog', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
    function openDialog() {
      dialog.style.display = 'block';
      firstInput.focus();
    }
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('dialog');
  assertTrue(validation.checks.some(c => c.type === 'focus'));
});

test('warns when dialog lacks focus management', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
    // No focus management
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('dialog');
  assertTrue(validation.checks.some(c =>
    c.type === 'focus' && (c.status === 'warn' || c.status === 'info')
  ));
});

// === Strict Mode ===
console.log('\n  Strict Mode');

test('strict mode treats warnings as errors', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    // Missing aria-labelledby
  `;
  const results = validateCode(code, { strictMode: true });
  assertTrue(results.hasErrors());
});

test('non-strict mode treats missing attrs as warnings', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    // Missing aria-labelledby
  `;
  const results = validateCode(code, { strictMode: false });
  assertTrue(results.hasWarnings());
  assertFalse(results.hasErrors());
});

// === Results and Convenience Methods ===
console.log('\n  Results and Convenience Methods');

test('hasPatterns returns true when patterns detected', () => {
  const code = `dialog.setAttribute('role', 'dialog');`;
  const results = validateCode(code);
  assertTrue(results.hasPatterns());
});

test('hasPatterns returns false when no patterns', () => {
  const code = `console.log('hello');`;
  const results = validateCode(code);
  assertFalse(results.hasPatterns());
});

test('getPatternsByType filters patterns', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    menu.setAttribute('role', 'menu');
  `;
  const results = validateCode(code);
  const dialogs = results.getPatternsByType('dialog');
  assertEqual(dialogs.length, 1);
});

test('getIssuesBySeverity filters issues', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
  `;
  const results = validateCode(code);
  const warnings = results.getIssuesBySeverity('warning');
  assertTrue(Array.isArray(warnings));
});

test('isValid returns true when no errors', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') handleTab(e);
      if (e.key === 'Escape') closeDialog();
    });
  `;
  const results = validateCode(code);
  assertTrue(results.isValid());
});

test('summary includes counts', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
  `;
  const results = validateCode(code);
  assertTrue(results.summary.patternsDetected >= 1);
  assertTrue(results.summary.totalChecks >= 0);
});

// === Pattern Documentation ===
console.log('\n  Pattern Documentation');

test('getPatternDocumentation returns pattern info', () => {
  const validator = new WidgetPatternValidator();
  const doc = validator.getPatternDocumentation('dialog');
  assertTrue(doc !== null);
  assertEqual(doc.name, 'Dialog (Modal)');
  assertTrue(doc.requiredAttributes.includes('aria-labelledby'));
  assertTrue(doc.requiredKeys.includes('Tab'));
  assertTrue(doc.requiredKeys.includes('Escape'));
});

test('getPatternDocumentation returns null for unknown', () => {
  const validator = new WidgetPatternValidator();
  const doc = validator.getPatternDocumentation('unknown');
  assertEqual(doc, null);
});

test('getSupportedPatterns lists all patterns', () => {
  const validator = new WidgetPatternValidator();
  const patterns = validator.getSupportedPatterns();
  assertTrue(patterns.length > 0);
  assertTrue(patterns.every(p => p.id && p.name && p.url));
});

// === Report Generation ===
console.log('\n  Report Generation');

test('generates validation report', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
  `;
  const analyzerResults = analyzeCode(code);
  const validator = new WidgetPatternValidator();
  validator.validate(analyzerResults);
  const report = validator.getReport();
  assertTrue(report.includes('Widget Pattern Validation Report'));
  assertTrue(report.includes('Dialog'));
});

test('report includes APG URLs', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'title');
  `;
  const analyzerResults = analyzeCode(code);
  const validator = new WidgetPatternValidator();
  validator.validate(analyzerResults);
  const report = validator.getReport();
  assertTrue(report.includes('w3.org/WAI/ARIA/apg'));
});

test('report shows passed and failed counts', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
  `;
  const analyzerResults = analyzeCode(code);
  const validator = new WidgetPatternValidator();
  validator.validate(analyzerResults);
  const report = validator.getReport();
  assertTrue(report.includes('passed'));
  assertTrue(report.includes('failed') || report.includes('warnings'));
});

// === Complex Scenarios ===
console.log('\n  Complex Scenarios');

test('validates complete dialog implementation', () => {
  const code = `
    // Dialog with full accessibility
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'dialog-title');
    dialog.setAttribute('aria-describedby', 'dialog-desc');

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDialog();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          focusPrev();
        } else {
          focusNext();
        }
      }
    });

    function openDialog() {
      dialog.style.display = 'block';
      firstFocusable.focus();
    }

    function closeDialog() {
      dialog.style.display = 'none';
      trigger.focus();
    }
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('dialog');
  assertTrue(validation.passed >= 3);
});

test('validates complete tabs implementation', () => {
  const code = `
    tablist.setAttribute('role', 'tablist');

    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tab.setAttribute('aria-controls', 'panel-' + i);
    });

    panels.forEach((panel, i) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'tab-' + i);
    });

    tablist.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') activateNextTab();
      if (e.key === 'ArrowLeft') activatePrevTab();
      if (e.key === 'Home') activateFirstTab();
      if (e.key === 'End') activateLastTab();
    });
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('tabs');
  assertTrue(validation.passed >= 4);
});

test('validates complete menu implementation', () => {
  const code = `
    menuButton.setAttribute('aria-haspopup', 'menu');
    menuButton.setAttribute('aria-expanded', 'false');

    menu.setAttribute('role', 'menu');

    menuItems.forEach(item => {
      item.setAttribute('role', 'menuitem');
    });

    menu.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusNextItem();
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusPrevItem();
          break;
        case 'Home':
          focusFirstItem();
          break;
        case 'End':
          focusLastItem();
          break;
        case 'Enter':
        case ' ':
          activateItem();
          break;
        case 'Escape':
          closeMenu();
          menuButton.focus();
          break;
      }
    });
  `;
  const results = validateCode(code);
  const validation = results.getValidationByPattern('menu');
  assertTrue(validation.passed >= 4);
});

test('validates combobox with listbox', () => {
  const code = `
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'listbox');
    input.setAttribute('aria-activedescendant', '');

    listbox.setAttribute('role', 'listbox');

    options.forEach(opt => {
      opt.setAttribute('role', 'option');
      opt.setAttribute('aria-selected', 'false');
    });

    input.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          openListbox();
          focusNextOption();
          break;
        case 'ArrowUp':
          focusPrevOption();
          break;
        case 'Enter':
          selectOption();
          break;
        case 'Escape':
          closeListbox();
          break;
      }
    });
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.some(p => p.type === 'combobox'));
  assertTrue(results.patterns.some(p => p.type === 'listbox'));
});

test('detects multiple widget patterns in same code', () => {
  const code = `
    dialog.setAttribute('role', 'dialog');
    menu.setAttribute('role', 'menu');
    tabs.setAttribute('role', 'tablist');
    slider.setAttribute('role', 'slider');
  `;
  const results = validateCode(code);
  assertTrue(results.patterns.length >= 4);
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('handles empty analyzer results gracefully', () => {
  const validator = new WidgetPatternValidator();
  const results = validator.validate({
    aria: null,
    keyboard: null,
    focus: null
  });
  assertEqual(results.patterns.length, 0);
});

test('handles partial analyzer results', () => {
  const code = `dialog.setAttribute('role', 'dialog');`;
  const tree = parseAndTransform(code);
  const ariaAnalyzer = new ARIAAnalyzer();

  const validator = new WidgetPatternValidator();
  const results = validator.validate({
    aria: ariaAnalyzer.analyze(tree),
    keyboard: null,
    focus: null
  });
  assertTrue(results.patterns.length >= 1);
});

test('handles unknown role gracefully', () => {
  const code = `element.setAttribute('role', 'unknownrole');`;
  const results = validateCode(code);
  // Should not crash, may not detect pattern
  assertTrue(true);
});

test('can disable keyboard validation', () => {
  const code = `dialog.setAttribute('role', 'dialog');`;
  const analyzerResults = analyzeCode(code);
  const validator = new WidgetPatternValidator({ validateKeyboard: false });
  const results = validator.validate(analyzerResults);
  const validation = results.getValidationByPattern('dialog');
  assertFalse(validation.checks.some(c => c.type === 'keyboard' && c.status !== 'skipped'));
});

test('can disable ARIA validation', () => {
  const code = `dialog.setAttribute('role', 'dialog');`;
  const analyzerResults = analyzeCode(code);
  const validator = new WidgetPatternValidator({ validateAria: false });
  const results = validator.validate(analyzerResults);
  const validation = results.getValidationByPattern('dialog');
  assertFalse(validation.checks.some(c => c.type === 'aria-attr'));
});

test('can disable focus validation', () => {
  const code = `dialog.setAttribute('role', 'dialog');`;
  const analyzerResults = analyzeCode(code);
  const validator = new WidgetPatternValidator({ validateFocus: false });
  const results = validator.validate(analyzerResults);
  const validation = results.getValidationByPattern('dialog');
  assertFalse(validation.checks.some(c => c.type === 'focus'));
});

// Print results
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
