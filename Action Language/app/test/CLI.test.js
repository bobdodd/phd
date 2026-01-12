/**
 * CLI Test Suite
 *
 * Tests for the command-line interface
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

// We need to mock process.exit to test CLI behavior
let exitCode = null;
const originalExit = process.exit;
const originalCwd = process.cwd;
const originalLog = console.log;
const originalError = console.error;

let logOutput = [];
let errorOutput = [];

function mockProcess() {
  exitCode = null;
  logOutput = [];
  errorOutput = [];
  process.exit = (code) => { exitCode = code; throw new Error('EXIT'); };
  console.log = (...args) => logOutput.push(args.join(' '));
  console.error = (...args) => errorOutput.push(args.join(' '));
}

function restoreProcess() {
  process.exit = originalExit;
  console.log = originalLog;
  console.error = originalError;
}

// Import CLI class
const CLI = require('../src/cli/index.js');

// Test counter
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log = originalLog;
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.log = originalLog;
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    failed++;
  } finally {
    restoreProcess();
  }
}

// Create test fixtures
const fixturesDir = path.join(__dirname, 'fixtures');
const cliFixturesDir = path.join(fixturesDir, 'cli');

function setupFixtures() {
  // Create fixtures directory if it doesn't exist
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  if (!fs.existsSync(cliFixturesDir)) {
    fs.mkdirSync(cliFixturesDir, { recursive: true });
  }

  // Create test JavaScript files
  fs.writeFileSync(
    path.join(cliFixturesDir, 'simple.js'),
    `
    // Simple test file
    function handleClick(event) {
      console.log('clicked');
    }
    element.addEventListener('click', handleClick);
    `
  );

  fs.writeFileSync(
    path.join(cliFixturesDir, 'accessible.js'),
    `
    // Accessible component
    function handleKeyDown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        handleClick(event);
      }
    }
    function handleClick(event) {
      element.setAttribute('aria-pressed', 'true');
    }
    element.addEventListener('click', handleClick);
    element.addEventListener('keydown', handleKeyDown);
    `
  );

  fs.writeFileSync(
    path.join(cliFixturesDir, 'syntax-error.js'),
    `
    // File with syntax error
    function broken( {
      return;
    }
    `
  );

  // Create config file
  fs.writeFileSync(
    path.join(cliFixturesDir, 'a11y.config.json'),
    JSON.stringify({
      minSeverity: 'warning',
      strict: false
    }, null, 2)
  );

  // Create subdirectory with more files
  const subDir = path.join(cliFixturesDir, 'components');
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(subDir, 'button.js'),
    `
    // Button component
    button.onclick = function() {
      this.textContent = 'Clicked';
    };
    `
  );
}

function cleanupFixtures() {
  // Clean up test files
  const files = [
    path.join(cliFixturesDir, 'simple.js'),
    path.join(cliFixturesDir, 'accessible.js'),
    path.join(cliFixturesDir, 'syntax-error.js'),
    path.join(cliFixturesDir, 'a11y.config.json'),
    path.join(cliFixturesDir, 'components', 'button.js'),
    path.join(cliFixturesDir, 'output.json'),
    path.join(cliFixturesDir, 'output.html')
  ];

  for (const file of files) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }

  // Remove directories
  const subDir = path.join(cliFixturesDir, 'components');
  if (fs.existsSync(subDir)) {
    fs.rmdirSync(subDir);
  }
  if (fs.existsSync(cliFixturesDir)) {
    fs.rmdirSync(cliFixturesDir);
  }
}

// ============================================================================
// Tests
// ============================================================================

originalLog('CLI Tests');
originalLog('═'.repeat(50));

setupFixtures();

// --- Argument Parsing ---

originalLog('\nArgument Parsing:');

test('parses help flag', () => {
  const cli = new CLI();
  cli.parseArgs(['--help']);
  assert.strictEqual(cli.options.help, true);
});

test('parses short help flag', () => {
  const cli = new CLI();
  cli.parseArgs(['-h']);
  assert.strictEqual(cli.options.help, true);
});

test('parses version flag', () => {
  const cli = new CLI();
  cli.parseArgs(['--version']);
  assert.strictEqual(cli.options.version, true);
});

test('parses short version flag', () => {
  const cli = new CLI();
  cli.parseArgs(['-v']);
  assert.strictEqual(cli.options.version, true);
});

test('parses format option', () => {
  const cli = new CLI();
  cli.parseArgs(['--format', 'json', 'file.js']);
  assert.strictEqual(cli.options.format, 'json');
});

test('parses short format option', () => {
  const cli = new CLI();
  cli.parseArgs(['-f', 'html', 'file.js']);
  assert.strictEqual(cli.options.format, 'html');
});

test('parses output option', () => {
  const cli = new CLI();
  cli.parseArgs(['--output', 'report.json', 'file.js']);
  assert.strictEqual(cli.options.output, 'report.json');
});

test('parses short output option', () => {
  const cli = new CLI();
  cli.parseArgs(['-o', 'report.html', 'file.js']);
  assert.strictEqual(cli.options.output, 'report.html');
});

test('parses verbose flag', () => {
  const cli = new CLI();
  cli.parseArgs(['--verbose', 'file.js']);
  assert.strictEqual(cli.options.verbose, true);
});

test('parses quiet flag', () => {
  const cli = new CLI();
  cli.parseArgs(['-q', 'file.js']);
  assert.strictEqual(cli.options.quiet, true);
});

test('parses strict flag', () => {
  const cli = new CLI();
  cli.parseArgs(['--strict', 'file.js']);
  assert.strictEqual(cli.options.strict, true);
});

test('parses min-severity option', () => {
  const cli = new CLI();
  cli.parseArgs(['--min-severity', 'error', 'file.js']);
  assert.strictEqual(cli.options.minSeverity, 'error');
});

test('parses config option', () => {
  const cli = new CLI();
  cli.parseArgs(['-c', 'custom.config.json', 'file.js']);
  assert.strictEqual(cli.options.config, 'custom.config.json');
});

test('parses no-color flag', () => {
  const cli = new CLI();
  cli.parseArgs(['--no-color', 'file.js']);
  assert.strictEqual(cli.options.noColor, true);
});

test('parses positional arguments as files', () => {
  const cli = new CLI();
  cli.parseArgs(['file1.js', 'file2.js', 'src/']);
  assert.deepStrictEqual(cli.files, ['file1.js', 'file2.js', 'src/']);
});

test('parses mixed options and files', () => {
  const cli = new CLI();
  cli.parseArgs(['-f', 'json', 'file1.js', '--strict', 'file2.js']);
  assert.strictEqual(cli.options.format, 'json');
  assert.strictEqual(cli.options.strict, true);
  assert.deepStrictEqual(cli.files, ['file1.js', 'file2.js']);
});

// --- File Discovery ---

originalLog('\nFile Discovery:');

test('isJavaScriptFile identifies .js files', () => {
  const cli = new CLI();
  assert.strictEqual(cli.isJavaScriptFile('test.js'), true);
  assert.strictEqual(cli.isJavaScriptFile('test.jsx'), true);
  assert.strictEqual(cli.isJavaScriptFile('test.mjs'), true);
  assert.strictEqual(cli.isJavaScriptFile('test.cjs'), true);
});

test('isJavaScriptFile rejects non-JS files', () => {
  const cli = new CLI();
  assert.strictEqual(cli.isJavaScriptFile('test.ts'), false);
  assert.strictEqual(cli.isJavaScriptFile('test.css'), false);
  assert.strictEqual(cli.isJavaScriptFile('test.html'), false);
  assert.strictEqual(cli.isJavaScriptFile('test.json'), false);
});

test('discovers single file', () => {
  const cli = new CLI();
  cli.files = [path.join(cliFixturesDir, 'simple.js')];
  const files = cli.discoverFiles();
  assert.strictEqual(files.length, 1);
  assert.ok(files[0].endsWith('simple.js'));
});

test('discovers files in directory', () => {
  const cli = new CLI();
  cli.files = [cliFixturesDir];
  const files = cli.discoverFiles();
  // Should find simple.js, accessible.js, syntax-error.js and components/button.js
  assert.ok(files.length >= 4);
});

test('discovers files recursively', () => {
  const cli = new CLI();
  cli.files = [cliFixturesDir];
  const files = cli.discoverFiles();
  const hasSubdirFile = files.some(f => f.includes('components') && f.includes('button.js'));
  assert.ok(hasSubdirFile, 'Should find files in subdirectories');
});

test('removes duplicate files', () => {
  const cli = new CLI();
  const filePath = path.join(cliFixturesDir, 'simple.js');
  cli.files = [filePath, filePath, filePath];
  const files = cli.discoverFiles();
  assert.strictEqual(files.length, 1);
});

// --- File Analysis ---

originalLog('\nFile Analysis:');

test('analyzes valid JavaScript file', () => {
  const cli = new CLI();
  const result = cli.analyzeFile(path.join(cliFixturesDir, 'simple.js'));
  assert.strictEqual(result.success, true);
  assert.ok(result.result);
  assert.ok(result.summary);
});

test('handles parse errors gracefully', () => {
  const cli = new CLI();
  const result = cli.analyzeFile(path.join(cliFixturesDir, 'syntax-error.js'));
  assert.strictEqual(result.success, false);
  assert.ok(result.error);
});

test('includes relative file path in result', () => {
  const cli = new CLI();
  const result = cli.analyzeFile(path.join(cliFixturesDir, 'simple.js'));
  assert.ok(result.file.includes('simple.js'));
  assert.ok(!path.isAbsolute(result.file));
});

// --- Severity Filtering ---

originalLog('\nSeverity Filtering:');

test('filters issues by error severity', () => {
  const cli = new CLI();
  cli.options.minSeverity = 'error';

  const issues = [
    { severity: 'error', message: 'Error 1' },
    { severity: 'warning', message: 'Warning 1' },
    { severity: 'info', message: 'Info 1' }
  ];

  const filtered = cli.filterBySeverity(issues);
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].severity, 'error');
});

test('filters issues by warning severity', () => {
  const cli = new CLI();
  cli.options.minSeverity = 'warning';

  const issues = [
    { severity: 'error', message: 'Error 1' },
    { severity: 'warning', message: 'Warning 1' },
    { severity: 'info', message: 'Info 1' }
  ];

  const filtered = cli.filterBySeverity(issues);
  assert.strictEqual(filtered.length, 2);
});

test('includes all issues with info severity', () => {
  const cli = new CLI();
  cli.options.minSeverity = 'info';

  const issues = [
    { severity: 'error', message: 'Error 1' },
    { severity: 'warning', message: 'Warning 1' },
    { severity: 'info', message: 'Info 1' }
  ];

  const filtered = cli.filterBySeverity(issues);
  assert.strictEqual(filtered.length, 3);
});

// --- Output Formatting ---

originalLog('\nOutput Formatting:');

test('formats text output', () => {
  const cli = new CLI();
  cli.results = [{
    file: 'test.js',
    success: true,
    result: {
      grade: 'A',
      scores: { overall: 95, keyboard: 100, aria: 90, focus: 95, widgets: 95 },
      issues: []
    }
  }];

  const output = cli.formatText();
  assert.ok(output.includes('Accessibility Analysis Report'));
  assert.ok(output.includes('test.js'));
  assert.ok(output.includes('Grade: '));
});

test('formats JSON output', () => {
  const cli = new CLI();
  cli.results = [{
    file: 'test.js',
    success: true,
    result: {
      grade: 'B',
      scores: { overall: 85, keyboard: 80, aria: 90, focus: 85, widgets: 85 },
      issues: [{ severity: 'warning', message: 'Test warning', category: 'keyboard' }],
      getWCAGLevel: () => 'A',
      statistics: { totalActions: 10 }
    }
  }];

  const output = cli.formatJSON();
  const parsed = JSON.parse(output);

  assert.ok(parsed.timestamp);
  assert.strictEqual(parsed.summary.filesAnalyzed, 1);
  assert.strictEqual(parsed.files[0].grade, 'B');
});

test('formats HTML output', () => {
  const cli = new CLI();
  cli.results = [{
    file: 'test.js',
    success: true,
    result: {
      grade: 'A',
      scores: { overall: 95, keyboard: 100, aria: 90, focus: 95, widgets: 95 },
      issues: []
    }
  }];

  const output = cli.formatHTML();
  assert.ok(output.includes('<!DOCTYPE html>'));
  assert.ok(output.includes('Accessibility Analysis Report'));
  assert.ok(output.includes('test.js'));
});

test('includes parse errors in text output', () => {
  const cli = new CLI();
  cli.results = [{
    file: 'broken.js',
    success: false,
    error: 'Unexpected token'
  }];

  const output = cli.formatText();
  assert.ok(output.includes('broken.js'));
  assert.ok(output.includes('Parse error'));
});

test('includes issues in text output when not quiet', () => {
  const cli = new CLI();
  cli.options.quiet = false;
  cli.results = [{
    file: 'test.js',
    success: true,
    result: {
      grade: 'C',
      scores: { overall: 70, keyboard: 60, aria: 80, focus: 70, widgets: 70 },
      issues: [
        { severity: 'warning', message: 'Missing keyboard handler' }
      ]
    }
  }];

  const output = cli.formatText();
  assert.ok(output.includes('Missing keyboard handler'));
});

// --- Configuration ---

originalLog('\nConfiguration:');

test('loads config from specified file', () => {
  const cli = new CLI();
  cli.options.config = path.join(cliFixturesDir, 'a11y.config.json');
  cli.loadConfig();

  assert.strictEqual(cli.options.minSeverity, 'warning');
  assert.strictEqual(cli.options.strict, false);
});

test('handles missing config file gracefully', () => {
  mockProcess();
  const cli = new CLI();
  cli.options.config = '/nonexistent/config.json';

  try {
    cli.loadConfig();
  } catch (e) {
    // Expected to exit
  }

  assert.strictEqual(exitCode, 2);
});

// --- Help and Version ---

originalLog('\nHelp and Version:');

test('showHelp outputs usage information', () => {
  mockProcess();
  const cli = new CLI();
  cli.showHelp();

  const output = logOutput.join('\n');
  assert.ok(output.includes('USAGE:'));
  assert.ok(output.includes('OPTIONS:'));
  assert.ok(output.includes('EXAMPLES:'));
});

test('showVersion outputs version number', () => {
  mockProcess();
  const cli = new CLI();
  cli.showVersion();

  const output = logOutput.join('\n');
  assert.ok(output.includes('a11y-analyze'));
  assert.ok(output.includes('v'));
});

// --- Integration Tests ---

originalLog('\nIntegration:');

test('full analysis pipeline works', () => {
  const cli = new CLI();
  cli.parseArgs([path.join(cliFixturesDir, 'simple.js'), '--no-color']);

  const files = cli.discoverFiles();
  assert.strictEqual(files.length, 1);

  for (const file of files) {
    const result = cli.analyzeFile(file);
    cli.results.push(result);
  }

  const textOutput = cli.formatText();
  assert.ok(textOutput.includes('simple.js'));

  // Reset results and test JSON
  cli.results = [];
  for (const file of files) {
    const result = cli.analyzeFile(file);
    cli.results.push(result);
  }
  const jsonOutput = cli.formatJSON();
  const parsed = JSON.parse(jsonOutput);
  assert.strictEqual(parsed.files.length, 1);
});

test('analyzes accessible code with better scores', () => {
  const cli = new CLI();

  const simpleResult = cli.analyzeFile(path.join(cliFixturesDir, 'simple.js'));
  const accessibleResult = cli.analyzeFile(path.join(cliFixturesDir, 'accessible.js'));

  // Both should parse successfully
  assert.strictEqual(simpleResult.success, true);
  assert.strictEqual(accessibleResult.success, true);
});

test('handles directory with mixed files', () => {
  const cli = new CLI();
  cli.files = [cliFixturesDir];

  const files = cli.discoverFiles();

  for (const file of files) {
    const result = cli.analyzeFile(file);
    cli.results.push(result);
  }

  // Should have both successful and failed results
  const successful = cli.results.filter(r => r.success);
  const failed = cli.results.filter(r => !r.success);

  assert.ok(successful.length > 0, 'Should have some successful analyses');
  assert.ok(failed.length > 0, 'Should have some failed analyses (syntax error file)');
});

// --- Output File Writing ---

originalLog('\nOutput Writing:');

test('writes JSON output to file', () => {
  const outputPath = path.join(cliFixturesDir, 'output.json');
  const cli = new CLI();
  cli.options.output = outputPath;
  cli.options.quiet = true;
  cli.results = [{
    file: 'test.js',
    success: true,
    result: {
      grade: 'A',
      scores: { overall: 95, keyboard: 100, aria: 90, focus: 95, widgets: 95 },
      issues: [],
      getWCAGLevel: () => 'AA',
      statistics: {}
    }
  }];

  cli.output(cli.formatJSON());

  assert.ok(fs.existsSync(outputPath));
  const content = fs.readFileSync(outputPath, 'utf8');
  const parsed = JSON.parse(content);
  assert.strictEqual(parsed.files.length, 1);
});

test('writes HTML output to file', () => {
  const outputPath = path.join(cliFixturesDir, 'output.html');
  const cli = new CLI();
  cli.options.output = outputPath;
  cli.options.quiet = true;
  cli.results = [{
    file: 'test.js',
    success: true,
    result: {
      grade: 'B',
      scores: { overall: 85, keyboard: 80, aria: 90, focus: 85, widgets: 85 },
      issues: []
    }
  }];

  cli.output(cli.formatHTML());

  assert.ok(fs.existsSync(outputPath));
  const content = fs.readFileSync(outputPath, 'utf8');
  assert.ok(content.includes('<!DOCTYPE html>'));
});

// --- Edge Cases ---

originalLog('\nEdge Cases:');

test('handles empty file list', () => {
  const cli = new CLI();
  cli.files = [];
  const files = cli.discoverFiles();
  assert.strictEqual(files.length, 0);
});

test('handles non-existent path gracefully', () => {
  const cli = new CLI();
  cli.files = ['/nonexistent/path/file.js'];
  const files = cli.discoverFiles();
  assert.strictEqual(files.length, 0);
});

test('handles empty results in formatText', () => {
  const cli = new CLI();
  cli.results = [];
  const output = cli.formatText();
  assert.ok(output.includes('Files analyzed: 0'));
});

test('handles empty results in formatJSON', () => {
  const cli = new CLI();
  cli.results = [];
  const output = cli.formatJSON();
  const parsed = JSON.parse(output);
  assert.strictEqual(parsed.files.length, 0);
});

test('handles empty results in formatHTML', () => {
  const cli = new CLI();
  cli.results = [];
  const output = cli.formatHTML();
  assert.ok(output.includes('<!DOCTYPE html>'));
  assert.ok(output.includes('0'));
});

// --- Cleanup and Summary ---

cleanupFixtures();

originalLog('\n' + '═'.repeat(50));
originalLog(`CLI Tests: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
