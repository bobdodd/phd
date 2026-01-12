/**
 * ARIAAnalyzer Tests
 *
 * Tests for ARIA usage analysis
 */

const ARIAAnalyzer = require('../src/analyzer/ARIAAnalyzer');
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
  const analyzer = new ARIAAnalyzer();
  return analyzer.analyze(tree);
}

console.log('\nARIAAnalyzer Tests');
console.log('========================================');

// === Basic Functionality ===
console.log('\n  Basic Functionality');

test('creates analyzer with default options', () => {
  const analyzer = new ARIAAnalyzer();
  assertEqual(analyzer.options.detectPatterns, true);
  assertEqual(analyzer.options.detectIssues, true);
  assertEqual(analyzer.options.validateRoles, true);
});

test('returns empty results for null tree', () => {
  const analyzer = new ARIAAnalyzer();
  const results = analyzer.analyze(null);
  assertEqual(results.ariaAttributes.length, 0);
});

test('returns empty results for empty code', () => {
  const results = analyzeCode('');
  assertEqual(results.ariaAttributes.length, 0);
});

// === ARIA Attribute Detection ===
console.log('\n  ARIA Attribute Detection');

test('detects setAttribute with aria-label', () => {
  const results = analyzeCode('element.setAttribute("aria-label", "Close button")');
  assertEqual(results.ariaAttributes.length, 1);
  assertEqual(results.ariaAttributes[0].attribute, 'aria-label');
  assertEqual(results.ariaAttributes[0].value, 'Close button');
});

test('detects setAttribute with aria-hidden', () => {
  const results = analyzeCode('modal.setAttribute("aria-hidden", "true")');
  assertEqual(results.ariaAttributes.length, 1);
  assertEqual(results.ariaAttributes[0].attribute, 'aria-hidden');
  assertEqual(results.ariaAttributes[0].value, 'true');
});

test('detects setAttribute with aria-expanded', () => {
  const results = analyzeCode('button.setAttribute("aria-expanded", "false")');
  assertEqual(results.ariaAttributes.length, 1);
  assertEqual(results.ariaAttributes[0].attribute, 'aria-expanded');
});

test('detects removeAttribute with aria-*', () => {
  const results = analyzeCode('element.removeAttribute("aria-hidden")');
  assertEqual(results.ariaAttributes.length, 1);
  assertEqual(results.ariaAttributes[0].type, 'removeAttribute');
  assertEqual(results.ariaAttributes[0].value, null);
});

test('detects getAttribute with aria-*', () => {
  const results = analyzeCode('const expanded = button.getAttribute("aria-expanded")');
  assertEqual(results.ariaPropertyAccess.length, 1);
  assertEqual(results.ariaPropertyAccess[0].attribute, 'aria-expanded');
});

test('tracks element reference', () => {
  const results = analyzeCode('myDialog.setAttribute("aria-labelledby", "dialogTitle")');
  assertEqual(results.ariaAttributes[0].elementRef, 'myDialog');
});

test('identifies ARIA states', () => {
  const results = analyzeCode('element.setAttribute("aria-expanded", "true")');
  assertTrue(results.ariaAttributes[0].isState);
});

test('identifies ARIA properties', () => {
  const results = analyzeCode('element.setAttribute("aria-label", "Menu")');
  assertTrue(results.ariaAttributes[0].isProperty);
});

test('detects multiple ARIA attributes', () => {
  const code = `
    element.setAttribute("aria-label", "Menu");
    element.setAttribute("aria-expanded", "false");
    element.setAttribute("aria-haspopup", "true");
  `;
  const results = analyzeCode(code);
  assertEqual(results.ariaAttributes.length, 3);
});

// === Role Detection ===
console.log('\n  Role Detection');

test('detects setAttribute with role', () => {
  const results = analyzeCode('element.setAttribute("role", "button")');
  assertEqual(results.roleChanges.length, 1);
  assertEqual(results.roleChanges[0].role, 'button');
});

test('validates known roles', () => {
  const results = analyzeCode('element.setAttribute("role", "dialog")');
  assertTrue(results.roleChanges[0].isValid);
});

test('identifies invalid roles', () => {
  const results = analyzeCode('element.setAttribute("role", "notarole")');
  assertFalse(results.roleChanges[0].isValid);
});

test('identifies interactive roles', () => {
  const results = analyzeCode('element.setAttribute("role", "button")');
  assertTrue(results.roleChanges[0].isInteractive);
});

test('identifies non-interactive roles', () => {
  const results = analyzeCode('element.setAttribute("role", "img")');
  assertFalse(results.roleChanges[0].isInteractive);
});

test('detects removeAttribute role', () => {
  const results = analyzeCode('element.removeAttribute("role")');
  assertEqual(results.roleChanges.length, 1);
  assertEqual(results.roleChanges[0].type, 'removeAttribute');
});

test('tracks required attributes for roles', () => {
  const results = analyzeCode('element.setAttribute("role", "checkbox")');
  assertTrue(results.roleChanges[0].requiredAttributes.includes('aria-checked'));
});

// === ARIA Property Assignments ===
console.log('\n  ARIA Property Assignments');

test('detects ariaLabel property assignment', () => {
  const results = analyzeCode('element.ariaLabel = "Close"');
  assertEqual(results.ariaAttributes.length, 1);
  assertEqual(results.ariaAttributes[0].property, 'ariaLabel');
  assertEqual(results.ariaAttributes[0].attribute, 'aria-label');
});

test('detects ariaHidden property assignment', () => {
  const results = analyzeCode('modal.ariaHidden = "true"');
  assertEqual(results.ariaAttributes.length, 1);
  assertEqual(results.ariaAttributes[0].attribute, 'aria-hidden');
});

test('detects ariaExpanded property assignment', () => {
  const results = analyzeCode('button.ariaExpanded = "true"');
  assertEqual(results.ariaAttributes.length, 1);
  assertEqual(results.ariaAttributes[0].attribute, 'aria-expanded');
});

test('detects role property assignment', () => {
  const results = analyzeCode('element.role = "button"');
  assertEqual(results.roleChanges.length, 1);
  assertEqual(results.roleChanges[0].role, 'button');
});

// === Widget Pattern Detection ===
console.log('\n  Widget Pattern Detection');

test('detects tab widget pattern', () => {
  const code = `
    tablist.setAttribute("role", "tablist");
    tab1.setAttribute("role", "tab");
    tab2.setAttribute("role", "tab");
    panel1.setAttribute("role", "tabpanel");
  `;
  const results = analyzeCode(code);
  const tabPattern = results.widgetPatterns.find(p => p.type === 'tabs');
  assertTrue(tabPattern !== undefined);
  assertTrue(tabPattern.isComplete);
});

test('detects incomplete tab pattern', () => {
  const code = `
    tab1.setAttribute("role", "tab");
    panel1.setAttribute("role", "tabpanel");
  `;
  const results = analyzeCode(code);
  const tabPattern = results.widgetPatterns.find(p => p.type === 'tabs');
  assertTrue(tabPattern !== undefined);
  assertFalse(tabPattern.hasTablist);
});

test('detects dialog pattern', () => {
  const code = `
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "dialogTitle");
  `;
  const results = analyzeCode(code);
  const dialogPattern = results.widgetPatterns.find(p => p.type === 'dialog');
  assertTrue(dialogPattern !== undefined);
  assertTrue(dialogPattern.hasModal);
  assertTrue(dialogPattern.hasLabel);
});

test('detects alertdialog', () => {
  const code = 'alert.setAttribute("role", "alertdialog")';
  const results = analyzeCode(code);
  const dialogPattern = results.widgetPatterns.find(p => p.type === 'dialog');
  assertTrue(dialogPattern !== undefined);
  assertEqual(dialogPattern.components.alertDialogs, 1);
});

test('detects menu pattern', () => {
  const code = `
    menu.setAttribute("role", "menu");
    item1.setAttribute("role", "menuitem");
    item2.setAttribute("role", "menuitem");
  `;
  const results = analyzeCode(code);
  const menuPattern = results.widgetPatterns.find(p => p.type === 'menu');
  assertTrue(menuPattern !== undefined);
  assertTrue(menuPattern.isComplete);
});

// === Live Region Detection ===
console.log('\n  Live Region Detection');

test('detects aria-live polite', () => {
  const results = analyzeCode('status.setAttribute("aria-live", "polite")');
  assertTrue(results.liveRegions.length > 0);
  assertTrue(results.liveRegions[0].politeness.includes('polite'));
});

test('detects aria-live assertive', () => {
  const results = analyzeCode('alert.setAttribute("aria-live", "assertive")');
  assertTrue(results.liveRegions.length > 0);
  assertTrue(results.liveRegions[0].politeness.includes('assertive'));
});

test('detects alert role as live region', () => {
  const results = analyzeCode('element.setAttribute("role", "alert")');
  assertTrue(results.liveRegions.length > 0);
  assertEqual(results.liveRegions[0].liveRoles, 1);
});

test('detects status role as live region', () => {
  const results = analyzeCode('element.setAttribute("role", "status")');
  assertTrue(results.liveRegions.length > 0);
});

test('detects aria-atomic', () => {
  const code = `
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
  `;
  const results = analyzeCode(code);
  assertTrue(results.liveRegions[0].hasAtomic);
});

// === Label Pattern Detection ===
console.log('\n  Label Pattern Detection');

test('detects aria-label usage', () => {
  const results = analyzeCode('button.setAttribute("aria-label", "Close dialog")');
  assertTrue(results.labelPatterns.length > 0);
  assertEqual(results.labelPatterns[0].ariaLabel, 1);
});

test('detects aria-labelledby usage', () => {
  const results = analyzeCode('dialog.setAttribute("aria-labelledby", "title")');
  assertTrue(results.labelPatterns.length > 0);
  assertEqual(results.labelPatterns[0].ariaLabelledby, 1);
});

test('detects aria-describedby usage', () => {
  const results = analyzeCode('input.setAttribute("aria-describedby", "hint")');
  assertTrue(results.labelPatterns.length > 0);
  assertEqual(results.labelPatterns[0].ariaDescribedby, 1);
});

// === Issue Detection ===
console.log('\n  Issue Detection');

test('flags invalid role', () => {
  const results = analyzeCode('element.setAttribute("role", "fakeRole")');
  const issue = results.issues.find(i => i.type === 'invalid-role');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'error');
});

test('flags aria-hidden="true" usage', () => {
  const results = analyzeCode('modal.setAttribute("aria-hidden", "true")');
  const issue = results.issues.find(i => i.type === 'aria-hidden-true');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'info');
});

test('flags interactive role without event handler', () => {
  const results = analyzeCode('element.setAttribute("role", "button")');
  const issue = results.issues.find(i => i.type === 'interactive-role-static');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'warning');
});

test('flags assertive live region', () => {
  const results = analyzeCode('element.setAttribute("aria-live", "assertive")');
  const issue = results.issues.find(i => i.type === 'assertive-live-region');
  assertTrue(issue !== undefined);
  assertEqual(issue.severity, 'info');
});

test('flags missing required ARIA attributes', () => {
  const results = analyzeCode('element.setAttribute("role", "checkbox")');
  const issue = results.issues.find(i => i.type === 'missing-required-aria');
  assertTrue(issue !== undefined);
  assertTrue(issue.message.includes('aria-checked'));
});

test('no missing attribute issue when provided', () => {
  const code = `
    element.setAttribute("role", "checkbox");
    element.setAttribute("aria-checked", "false");
  `;
  const results = analyzeCode(code);
  const issue = results.issues.find(i =>
    i.type === 'missing-required-aria' && i.message.includes('aria-checked')
  );
  assertTrue(issue === undefined);
});

test('flags dialog without label', () => {
  const results = analyzeCode('element.setAttribute("role", "dialog")');
  const issue = results.issues.find(i => i.type === 'dialog-missing-label');
  assertTrue(issue !== undefined);
});

test('no dialog label issue when provided', () => {
  const code = `
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-labelledby", "dialogTitle");
  `;
  const results = analyzeCode(code);
  const issue = results.issues.find(i => i.type === 'dialog-missing-label');
  assertTrue(issue === undefined);
});

test('issues include suggestions', () => {
  const results = analyzeCode('element.setAttribute("role", "invalidRole")');
  const issue = results.issues.find(i => i.type === 'invalid-role');
  assertTrue(issue.suggestion !== undefined);
});

// === Statistics ===
console.log('\n  Statistics');

test('counts total ARIA changes', () => {
  const code = `
    a.setAttribute("aria-label", "A");
    b.setAttribute("aria-hidden", "true");
    c.setAttribute("aria-expanded", "false");
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.totalAriaChanges, 3);
});

test('counts role changes', () => {
  const code = `
    a.setAttribute("role", "button");
    b.setAttribute("role", "dialog");
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.roleChanges, 2);
});

test('groups by attribute', () => {
  const code = `
    a.setAttribute("aria-label", "A");
    b.setAttribute("aria-label", "B");
    c.setAttribute("aria-hidden", "true");
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byAttribute['aria-label'], 2);
  assertEqual(results.stats.byAttribute['aria-hidden'], 1);
});

test('groups by role', () => {
  const code = `
    a.setAttribute("role", "button");
    b.setAttribute("role", "button");
    c.setAttribute("role", "dialog");
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byRole['button'], 2);
  assertEqual(results.stats.byRole['dialog'], 1);
});

test('groups by element', () => {
  const code = `
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    button.setAttribute("role", "button");
  `;
  const results = analyzeCode(code);
  assertEqual(results.stats.byElement['modal'], 2);
  assertEqual(results.stats.byElement['button'], 1);
});

// === Convenience Methods ===
console.log('\n  Convenience Methods');

test('hasAriaUsage returns true when present', () => {
  const results = analyzeCode('element.setAttribute("aria-label", "test")');
  assertTrue(results.hasAriaUsage());
});

test('hasAriaUsage returns false when none', () => {
  const results = analyzeCode('const x = 5');
  assertFalse(results.hasAriaUsage());
});

test('getAttributesByName filters correctly', () => {
  const code = `
    a.setAttribute("aria-label", "A");
    b.setAttribute("aria-hidden", "true");
    c.setAttribute("aria-label", "C");
  `;
  const results = analyzeCode(code);
  const labels = results.getAttributesByName('aria-label');
  assertEqual(labels.length, 2);
});

test('getRolesByName filters correctly', () => {
  const code = `
    a.setAttribute("role", "button");
    b.setAttribute("role", "dialog");
    c.setAttribute("role", "button");
  `;
  const results = analyzeCode(code);
  const buttons = results.getRolesByName('button');
  assertEqual(buttons.length, 2);
});

test('getByElement filters correctly', () => {
  const code = `
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    button.setAttribute("role", "button");
  `;
  const results = analyzeCode(code);
  const modalOps = results.getByElement('modal');
  assertEqual(modalOps.length, 2);
});

test('hasLiveRegions returns true when present', () => {
  const results = analyzeCode('element.setAttribute("aria-live", "polite")');
  assertTrue(results.hasLiveRegions());
});

test('hasWidgetPatterns returns true when present', () => {
  const results = analyzeCode('element.setAttribute("role", "dialog")');
  assertTrue(results.hasWidgetPatterns());
});

test('hasWarnings returns true when warnings present', () => {
  const results = analyzeCode('element.setAttribute("role", "button")');
  assertTrue(results.hasWarnings());
});

test('hasErrors returns true when errors present', () => {
  const results = analyzeCode('element.setAttribute("role", "notarole")');
  assertTrue(results.hasErrors());
});

// === Event Handler Context ===
console.log('\n  Event Handler Context');

test('detects ARIA in event handler', () => {
  const code = 'button.addEventListener("click", () => dialog.setAttribute("aria-hidden", "false"))';
  const results = analyzeCode(code);
  assertTrue(results.ariaAttributes[0].inEventHandler);
});

test('tracks event type for ARIA changes', () => {
  const code = 'button.addEventListener("click", () => menu.setAttribute("aria-expanded", "true"))';
  const results = analyzeCode(code);
  assertEqual(results.ariaAttributes[0].eventType, 'click');
});

test('no interactive role warning in event handler', () => {
  const code = `
    button.addEventListener("click", () => {
      element.setAttribute("role", "button");
    });
  `;
  const results = analyzeCode(code);
  const issue = results.issues.find(i =>
    i.type === 'interactive-role-static' && i.message.includes('element')
  );
  assertTrue(issue === undefined);
});

// === Complex Scenarios ===
console.log('\n  Complex Scenarios');

test('analyzes complete dialog pattern', () => {
  const code = `
    const previousFocus = document.activeElement;

    openBtn.addEventListener("click", () => {
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", "dialogTitle");
      dialog.setAttribute("aria-hidden", "false");
      dialog.focus();
    });

    closeBtn.addEventListener("click", () => {
      dialog.setAttribute("aria-hidden", "true");
      previousFocus.focus();
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.widgetPatterns.some(p => p.type === 'dialog'));
  assertTrue(results.ariaAttributes.length >= 4);
});

test('analyzes accordion pattern', () => {
  const code = `
    header.addEventListener("click", () => {
      const expanded = header.getAttribute("aria-expanded") === "true";
      header.setAttribute("aria-expanded", expanded ? "false" : "true");
      panel.setAttribute("aria-hidden", expanded ? "true" : "false");
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.ariaPropertyAccess.length > 0);
  assertTrue(results.ariaAttributes.length > 0);
});

test('analyzes menu button pattern', () => {
  const code = `
    menuButton.setAttribute("aria-haspopup", "true");
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {
      menu.setAttribute("role", "menu");
      menuItem1.setAttribute("role", "menuitem");
      menuItem2.setAttribute("role", "menuitem");
      menuButton.setAttribute("aria-expanded", "true");
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.widgetPatterns.some(p => p.type === 'menu'));
  assertTrue(results.ariaAttributes.some(a => a.attribute === 'aria-haspopup'));
});

test('analyzes tabs with keyboard handling', () => {
  const code = `
    tablist.setAttribute("role", "tablist");
    tab1.setAttribute("role", "tab");
    tab1.setAttribute("aria-selected", "true");
    tab1.setAttribute("aria-controls", "panel1");
    panel1.setAttribute("role", "tabpanel");
    panel1.setAttribute("aria-labelledby", "tab1");

    tablist.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        tab2.setAttribute("aria-selected", "true");
        tab1.setAttribute("aria-selected", "false");
      }
    });
  `;
  const results = analyzeCode(code);
  assertTrue(results.widgetPatterns.some(p => p.type === 'tabs'));
  assertTrue(results.labelPatterns.length > 0);
});

test('analyzes live region notification', () => {
  const code = `
    statusRegion.setAttribute("role", "status");
    statusRegion.setAttribute("aria-live", "polite");
    statusRegion.setAttribute("aria-atomic", "true");

    function showMessage(msg) {
      statusRegion.textContent = msg;
    }
  `;
  const results = analyzeCode(code);
  assertTrue(results.liveRegions.length > 0);
  assertTrue(results.liveRegions[0].hasAtomic);
});

// === Summary Generation ===
console.log('\n  Summary Generation');

test('generates summary', () => {
  const code = `
    element.setAttribute("aria-label", "Test");
    element.setAttribute("role", "button");
  `;
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('ARIA Usage Analysis Summary'));
  assertTrue(summary.includes('ARIA attribute changes: 1'));
  assertTrue(summary.includes('Role changes: 1'));
});

test('summary includes widget patterns', () => {
  const code = 'element.setAttribute("role", "dialog")';
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Widget Patterns Detected'));
  assertTrue(summary.includes('dialog'));
});

test('summary includes issues', () => {
  const code = 'element.setAttribute("role", "invalidRole")';
  const tree = parseAndTransform(code);
  const analyzer = new ARIAAnalyzer();
  analyzer.analyze(tree);
  const summary = analyzer.getSummary();
  assertTrue(summary.includes('Issues Detected'));
  assertTrue(summary.includes('error'));
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('handles getElementById with ARIA', () => {
  const results = analyzeCode('document.getElementById("modal").setAttribute("aria-hidden", "true")');
  assertEqual(results.ariaAttributes.length, 1);
  assertTrue(results.ariaAttributes[0].elementRef.includes('modal'));
});

test('handles querySelector with ARIA', () => {
  const results = analyzeCode('document.querySelector(".dialog").setAttribute("role", "dialog")');
  assertEqual(results.roleChanges.length, 1);
});

test('handles multiple roles on same element', () => {
  const code = `
    element.setAttribute("role", "button");
    element.setAttribute("role", "link");
  `;
  const results = analyzeCode(code);
  assertEqual(results.roleChanges.length, 2);
});

test('handles dynamically computed attribute values', () => {
  const results = analyzeCode('element.setAttribute("aria-expanded", isExpanded ? "true" : "false")');
  assertEqual(results.ariaAttributes.length, 1);
  assertEqual(results.ariaAttributes[0].value, undefined); // Dynamic value
});

// === Extended Role Coverage ===
console.log('\n  Extended Role Coverage');

test('identifies grid as interactive role', () => {
  const results = analyzeCode('element.setAttribute("role", "grid")');
  assertTrue(results.roleChanges[0].isInteractive);
});

test('identifies application as interactive role', () => {
  const results = analyzeCode('element.setAttribute("role", "application")');
  assertTrue(results.roleChanges[0].isInteractive);
});

test('flags slider missing valuemin/valuemax', () => {
  const code = `
    slider.setAttribute("role", "slider");
    slider.setAttribute("aria-valuenow", "50");
  `;
  const results = analyzeCode(code);
  const issues = results.issues.filter(i =>
    i.type === 'missing-required-aria' && i.message.includes('slider')
  );
  assertTrue(issues.some(i => i.message.includes('aria-valuemin')));
  assertTrue(issues.some(i => i.message.includes('aria-valuemax')));
});

test('no slider warnings when all attributes provided', () => {
  const code = `
    slider.setAttribute("role", "slider");
    slider.setAttribute("aria-valuenow", "50");
    slider.setAttribute("aria-valuemin", "0");
    slider.setAttribute("aria-valuemax", "100");
  `;
  const results = analyzeCode(code);
  const sliderIssues = results.issues.filter(i =>
    i.type === 'missing-required-aria' && i.message.includes('slider')
  );
  assertEqual(sliderIssues.length, 0);
});

test('flags menuitemcheckbox missing aria-checked', () => {
  const results = analyzeCode('item.setAttribute("role", "menuitemcheckbox")');
  const issue = results.issues.find(i =>
    i.type === 'missing-required-aria' && i.message.includes('aria-checked')
  );
  assertTrue(issue !== undefined);
});

test('flags menuitemradio missing aria-checked', () => {
  const results = analyzeCode('item.setAttribute("role", "menuitemradio")');
  const issue = results.issues.find(i =>
    i.type === 'missing-required-aria' && i.message.includes('aria-checked')
  );
  assertTrue(issue !== undefined);
});

test('flags combobox missing aria-controls', () => {
  const code = `
    combo.setAttribute("role", "combobox");
    combo.setAttribute("aria-expanded", "false");
  `;
  const results = analyzeCode(code);
  const issue = results.issues.find(i =>
    i.type === 'missing-required-aria' && i.message.includes('aria-controls')
  );
  assertTrue(issue !== undefined);
});

test('analyzes complete slider widget', () => {
  const code = `
    slider.setAttribute("role", "slider");
    slider.setAttribute("aria-valuenow", "50");
    slider.setAttribute("aria-valuemin", "0");
    slider.setAttribute("aria-valuemax", "100");
    slider.setAttribute("aria-label", "Volume");

    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        slider.setAttribute("aria-valuenow", "60");
      }
    });
  `;
  const results = analyzeCode(code);
  assertEqual(results.roleChanges.length, 1);
  assertTrue(results.ariaAttributes.length >= 4);
  assertTrue(results.labelPatterns.length > 0);
});

test('analyzes grid widget', () => {
  const code = `
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "Data Grid");
    row.setAttribute("role", "row");
    cell.setAttribute("role", "gridcell");
  `;
  const results = analyzeCode(code);
  assertTrue(results.roleChanges.some(r => r.role === 'grid'));
  assertTrue(results.roleChanges.some(r => r.role === 'gridcell'));
});

// Print results
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
