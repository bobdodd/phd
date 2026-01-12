#!/usr/bin/env node

/**
 * ActionLanguage Accessibility Analyzer - CLI
 *
 * Command-line interface for analyzing JavaScript files for accessibility issues.
 *
 * Usage:
 *   a11y-analyze [options] <files...>
 *   a11y-analyze src/
 *   a11y-analyze "src/components/*.js"
 *   a11y-analyze file.js --format json
 */

const fs = require('fs');
const path = require('path');
const { parseAndTransform } = require('../parser');
const AccessibilityReporter = require('../analyzer/AccessibilityReporter');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Disable colors if not a TTY or NO_COLOR is set
const useColors = process.stdout.isTTY && !process.env.NO_COLOR;

function c(color, text) {
  return useColors ? `${colors[color]}${text}${colors.reset}` : text;
}

/**
 * CLI class
 */
class CLI {
  constructor() {
    this.options = {
      format: 'text',
      output: null,
      verbose: false,
      quiet: false,
      strict: false,
      minSeverity: 'info',
      config: null,
      help: false,
      version: false,
      noColor: false
    };
    this.files = [];
    this.results = [];
  }

  /**
   * Parse command line arguments
   */
  parseArgs(args) {
    const positional = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg === '-h' || arg === '--help') {
        this.options.help = true;
      } else if (arg === '-v' || arg === '--version') {
        this.options.version = true;
      } else if (arg === '-f' || arg === '--format') {
        this.options.format = args[++i] || 'text';
      } else if (arg === '-o' || arg === '--output') {
        this.options.output = args[++i];
      } else if (arg === '--verbose') {
        this.options.verbose = true;
      } else if (arg === '-q' || arg === '--quiet') {
        this.options.quiet = true;
      } else if (arg === '--strict') {
        this.options.strict = true;
      } else if (arg === '--min-severity') {
        this.options.minSeverity = args[++i] || 'info';
      } else if (arg === '-c' || arg === '--config') {
        this.options.config = args[++i];
      } else if (arg === '--no-color') {
        this.options.noColor = true;
      } else if (!arg.startsWith('-')) {
        positional.push(arg);
      } else {
        console.error(c('red', `Unknown option: ${arg}`));
        process.exit(1);
      }
    }

    this.files = positional;
  }

  /**
   * Show help message
   */
  showHelp() {
    console.log(`
${c('bold', 'ActionLanguage Accessibility Analyzer')}

${c('cyan', 'USAGE:')}
  a11y-analyze [options] <files...>

${c('cyan', 'ARGUMENTS:')}
  <files...>          JavaScript files or directories to analyze
                      Supports glob patterns (e.g., "src/**/*.js")

${c('cyan', 'OPTIONS:')}
  -h, --help          Show this help message
  -v, --version       Show version number
  -f, --format <fmt>  Output format: text, json, html (default: text)
  -o, --output <file> Write output to file instead of stdout
  -q, --quiet         Only show errors and summary
  --verbose           Show detailed analysis information
  --strict            Treat warnings as errors
  --min-severity <s>  Minimum severity to report: error, warning, info
  -c, --config <file> Load configuration from file
  --no-color          Disable colored output

${c('cyan', 'EXAMPLES:')}
  ${c('dim', '# Analyze a single file')}
  a11y-analyze src/component.js

  ${c('dim', '# Analyze all JS files in a directory')}
  a11y-analyze src/

  ${c('dim', '# Analyze with JSON output')}
  a11y-analyze src/ --format json --output report.json

  ${c('dim', '# Analyze in CI mode (strict, no color)')}
  a11y-analyze src/ --strict --no-color

${c('cyan', 'EXIT CODES:')}
  0  Success - no errors found
  1  Errors found in analyzed files
  2  CLI usage error or file not found

${c('cyan', 'MORE INFO:')}
  https://github.com/example/actionlanguage-a11y
`);
  }

  /**
   * Show version
   */
  showVersion() {
    // Read version from package.json if available
    try {
      const pkgPath = path.join(__dirname, '../../package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      console.log(`a11y-analyze v${pkg.version || '1.0.0'}`);
    } catch {
      console.log('a11y-analyze v1.0.0');
    }
  }

  /**
   * Load configuration file
   */
  loadConfig() {
    if (!this.options.config) {
      // Look for default config files
      const defaultConfigs = [
        '.a11yrc.json',
        '.a11yrc',
        'a11y.config.json',
        'a11y.config.js'
      ];

      for (const configFile of defaultConfigs) {
        const configPath = path.join(process.cwd(), configFile);
        if (fs.existsSync(configPath)) {
          this.options.config = configPath;
          break;
        }
      }
    }

    if (this.options.config) {
      try {
        const configPath = path.resolve(this.options.config);
        if (configPath.endsWith('.js')) {
          const config = require(configPath);
          Object.assign(this.options, config);
        } else {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          Object.assign(this.options, config);
        }
        if (this.options.verbose) {
          console.log(c('dim', `Loaded config from ${this.options.config}`));
        }
      } catch (error) {
        console.error(c('red', `Error loading config: ${error.message}`));
        process.exit(2);
      }
    }
  }

  /**
   * Discover files to analyze
   */
  discoverFiles() {
    const jsFiles = [];

    for (const pattern of this.files) {
      const resolved = path.resolve(pattern);

      if (fs.existsSync(resolved)) {
        const stat = fs.statSync(resolved);

        if (stat.isFile()) {
          if (this.isJavaScriptFile(resolved)) {
            jsFiles.push(resolved);
          }
        } else if (stat.isDirectory()) {
          this.walkDirectory(resolved, jsFiles);
        }
      } else {
        // Try glob pattern matching (simple implementation)
        const matches = this.globMatch(pattern);
        jsFiles.push(...matches);
      }
    }

    return [...new Set(jsFiles)]; // Remove duplicates
  }

  /**
   * Check if file is a JavaScript file
   */
  isJavaScriptFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return ['.js', '.jsx', '.mjs', '.cjs'].includes(ext);
  }

  /**
   * Walk directory recursively
   */
  walkDirectory(dir, files) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip node_modules and hidden directories
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          this.walkDirectory(fullPath, files);
        }
      } else if (entry.isFile() && this.isJavaScriptFile(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  /**
   * Simple glob pattern matching
   */
  globMatch(pattern) {
    const matches = [];
    const parts = pattern.split('/');
    const basePath = process.cwd();

    // Handle simple patterns like "src/*.js" or "src/**/*.js"
    if (pattern.includes('*')) {
      const dirPart = parts.slice(0, -1).join('/').replace(/\*\*/g, '');
      const filePart = parts[parts.length - 1];
      const searchDir = path.join(basePath, dirPart);

      if (fs.existsSync(searchDir)) {
        const recursive = pattern.includes('**');
        this.findMatchingFiles(searchDir, filePart, matches, recursive);
      }
    }

    return matches;
  }

  /**
   * Find files matching a pattern
   */
  findMatchingFiles(dir, pattern, matches, recursive) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isFile() && regex.test(entry.name)) {
          matches.push(fullPath);
        } else if (entry.isDirectory() && recursive) {
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            this.findMatchingFiles(fullPath, pattern, matches, recursive);
          }
        }
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Analyze a single file
   */
  analyzeFile(filePath) {
    const relativePath = path.relative(process.cwd(), filePath);

    try {
      const code = fs.readFileSync(filePath, 'utf8');
      const tree = parseAndTransform(code);

      const reporter = new AccessibilityReporter({
        strictMode: this.options.strict
      });

      const result = reporter.analyze(tree);

      return {
        file: relativePath,
        success: true,
        result: result,
        summary: reporter.getSummary()
      };
    } catch (error) {
      return {
        file: relativePath,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Filter issues by severity
   */
  filterBySeverity(issues) {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    // Use hasOwnProperty to avoid 0 being treated as falsy
    const minLevel = this.options.minSeverity in severityOrder
      ? severityOrder[this.options.minSeverity]
      : 2;

    return issues.filter(issue => {
      const level = issue.severity in severityOrder
        ? severityOrder[issue.severity]
        : 2;
      return level <= minLevel;
    });
  }

  /**
   * Format output as text
   */
  formatText() {
    const lines = [];
    let totalIssues = 0;
    let totalErrors = 0;
    let totalWarnings = 0;
    let filesWithIssues = 0;

    lines.push('');
    lines.push(c('bold', '═══════════════════════════════════════════════════════════'));
    lines.push(c('bold', '  ActionLanguage Accessibility Analysis Report'));
    lines.push(c('bold', '═══════════════════════════════════════════════════════════'));
    lines.push('');

    for (const fileResult of this.results) {
      if (!fileResult.success) {
        lines.push(c('red', `✗ ${fileResult.file}`));
        lines.push(c('red', `  Parse error: ${fileResult.error}`));
        lines.push('');
        continue;
      }

      const result = fileResult.result;
      const issues = this.filterBySeverity(result.issues);

      if (issues.length > 0) {
        filesWithIssues++;
      }

      const errors = issues.filter(i => i.severity === 'error').length;
      const warnings = issues.filter(i => i.severity === 'warning').length;

      totalIssues += issues.length;
      totalErrors += errors;
      totalWarnings += warnings;

      // File header
      const gradeColor = result.grade === 'A' ? 'green' :
                        result.grade === 'B' ? 'green' :
                        result.grade === 'C' ? 'yellow' :
                        result.grade === 'D' ? 'yellow' : 'red';

      lines.push(`${c('cyan', '●')} ${c('bold', fileResult.file)}`);
      lines.push(`  Grade: ${c(gradeColor, result.grade)} (${result.scores.overall}/100)`);

      if (!this.options.quiet && issues.length > 0) {
        lines.push('');
        for (const issue of issues) {
          const icon = issue.severity === 'error' ? c('red', '✗') :
                      issue.severity === 'warning' ? c('yellow', '⚠') :
                      c('blue', 'ℹ');
          lines.push(`  ${icon} ${issue.message}`);
          if (issue.suggestion && this.options.verbose) {
            lines.push(c('dim', `    → ${issue.suggestion}`));
          }
        }
      }

      lines.push('');
    }

    // Summary
    lines.push(c('bold', '───────────────────────────────────────────────────────────'));
    lines.push(c('bold', '  Summary'));
    lines.push(c('bold', '───────────────────────────────────────────────────────────'));
    lines.push('');
    lines.push(`  Files analyzed: ${this.results.length}`);
    lines.push(`  Files with issues: ${filesWithIssues}`);
    lines.push(`  Total issues: ${totalIssues}`);
    lines.push(`    ${c('red', 'Errors')}: ${totalErrors}`);
    lines.push(`    ${c('yellow', 'Warnings')}: ${totalWarnings}`);
    lines.push('');

    if (totalErrors === 0 && totalWarnings === 0) {
      lines.push(c('green', '  ✓ No accessibility issues found!'));
    } else if (totalErrors === 0) {
      lines.push(c('yellow', '  ⚠ Some warnings found, but no blocking errors.'));
    } else {
      lines.push(c('red', '  ✗ Accessibility errors found that should be fixed.'));
    }

    lines.push('');

    return lines.join('\n');
  }

  /**
   * Format output as JSON
   */
  formatJSON() {
    const output = {
      timestamp: new Date().toISOString(),
      summary: {
        filesAnalyzed: this.results.length,
        filesWithErrors: 0,
        totalIssues: 0,
        errors: 0,
        warnings: 0,
        infos: 0
      },
      files: []
    };

    for (const fileResult of this.results) {
      if (!fileResult.success) {
        output.files.push({
          file: fileResult.file,
          success: false,
          error: fileResult.error
        });
        continue;
      }

      const result = fileResult.result;
      const issues = this.filterBySeverity(result.issues);

      const errors = issues.filter(i => i.severity === 'error').length;
      const warnings = issues.filter(i => i.severity === 'warning').length;
      const infos = issues.filter(i => i.severity === 'info').length;

      output.summary.totalIssues += issues.length;
      output.summary.errors += errors;
      output.summary.warnings += warnings;
      output.summary.infos += infos;

      if (errors > 0) {
        output.summary.filesWithErrors++;
      }

      output.files.push({
        file: fileResult.file,
        success: true,
        grade: result.grade,
        scores: result.scores,
        wcagLevel: result.getWCAGLevel(),
        issues: issues.map(i => ({
          severity: i.severity,
          category: i.category,
          message: i.message,
          suggestion: i.suggestion,
          wcag: i.wcag,
          element: i.element
        })),
        statistics: result.statistics
      });
    }

    return JSON.stringify(output, null, 2);
  }

  /**
   * Format output as HTML
   */
  formatHTML() {
    let totalErrors = 0;
    let totalWarnings = 0;

    for (const fileResult of this.results) {
      if (fileResult.success) {
        const issues = this.filterBySeverity(fileResult.result.issues);
        totalErrors += issues.filter(i => i.severity === 'error').length;
        totalWarnings += issues.filter(i => i.severity === 'warning').length;
      }
    }

    const overallStatus = totalErrors > 0 ? 'error' : totalWarnings > 0 ? 'warning' : 'success';
    const statusColor = { error: '#ef4444', warning: '#f97316', success: '#22c55e' };

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Analysis Report</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f9fafb; }
    h1 { color: #1f2937; border-bottom: 2px solid ${statusColor[overallStatus]}; padding-bottom: 10px; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
    .stat { text-align: center; padding: 15px; background: #f3f4f6; border-radius: 6px; }
    .stat-value { font-size: 2rem; font-weight: bold; color: #1f2937; }
    .stat-label { color: #6b7280; font-size: 0.875rem; }
    .file-card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .file-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .file-name { font-weight: 600; color: #1f2937; font-size: 1.1rem; }
    .grade { font-size: 1.5rem; font-weight: bold; padding: 5px 15px; border-radius: 6px; }
    .grade-A, .grade-B { background: #dcfce7; color: #166534; }
    .grade-C { background: #fef9c3; color: #854d0e; }
    .grade-D, .grade-F { background: #fee2e2; color: #991b1b; }
    .issue { padding: 10px 15px; margin: 5px 0; border-left: 4px solid; border-radius: 0 4px 4px 0; }
    .issue-error { background: #fef2f2; border-color: #ef4444; }
    .issue-warning { background: #fffbeb; border-color: #f97316; }
    .issue-info { background: #eff6ff; border-color: #3b82f6; }
    .issue-message { font-weight: 500; }
    .issue-suggestion { color: #6b7280; font-size: 0.875rem; margin-top: 5px; }
    .issue-meta { color: #9ca3af; font-size: 0.75rem; margin-top: 5px; }
    .no-issues { color: #166534; background: #dcfce7; padding: 15px; border-radius: 6px; text-align: center; }
    .scores { display: flex; gap: 20px; margin-top: 10px; }
    .score-item { flex: 1; }
    .score-label { font-size: 0.75rem; color: #6b7280; }
    .score-bar { height: 8px; background: #e5e5e5; border-radius: 4px; overflow: hidden; }
    .score-fill { height: 100%; background: #3b82f6; }
  </style>
</head>
<body>
  <h1>Accessibility Analysis Report</h1>
  <p style="color: #6b7280;">Generated: ${new Date().toISOString()}</p>

  <div class="summary">
    <div class="summary-grid">
      <div class="stat">
        <div class="stat-value">${this.results.length}</div>
        <div class="stat-label">Files Analyzed</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color: #ef4444;">${totalErrors}</div>
        <div class="stat-label">Errors</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color: #f97316;">${totalWarnings}</div>
        <div class="stat-label">Warnings</div>
      </div>
    </div>
  </div>

  ${this.results.map(fileResult => {
    if (!fileResult.success) {
      return `
        <div class="file-card">
          <div class="file-header">
            <span class="file-name">${fileResult.file}</span>
            <span class="grade grade-F">Error</span>
          </div>
          <div class="issue issue-error">
            <div class="issue-message">Parse error: ${fileResult.error}</div>
          </div>
        </div>
      `;
    }

    const result = fileResult.result;
    const issues = this.filterBySeverity(result.issues);

    return `
      <div class="file-card">
        <div class="file-header">
          <span class="file-name">${fileResult.file}</span>
          <span class="grade grade-${result.grade}">${result.grade}</span>
        </div>
        <div class="scores">
          <div class="score-item">
            <div class="score-label">Keyboard ${result.scores.keyboard}%</div>
            <div class="score-bar"><div class="score-fill" style="width: ${result.scores.keyboard}%"></div></div>
          </div>
          <div class="score-item">
            <div class="score-label">ARIA ${result.scores.aria}%</div>
            <div class="score-bar"><div class="score-fill" style="width: ${result.scores.aria}%"></div></div>
          </div>
          <div class="score-item">
            <div class="score-label">Focus ${result.scores.focus}%</div>
            <div class="score-bar"><div class="score-fill" style="width: ${result.scores.focus}%"></div></div>
          </div>
          <div class="score-item">
            <div class="score-label">Widgets ${result.scores.widgets}%</div>
            <div class="score-bar"><div class="score-fill" style="width: ${result.scores.widgets}%"></div></div>
          </div>
        </div>
        ${issues.length === 0 ? '<div class="no-issues">No issues found</div>' : issues.map(issue => `
          <div class="issue issue-${issue.severity}">
            <div class="issue-message">${issue.message}</div>
            ${issue.suggestion ? `<div class="issue-suggestion">${issue.suggestion}</div>` : ''}
            ${issue.wcag ? `<div class="issue-meta">WCAG: ${issue.wcag.join(', ')}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }).join('')}
</body>
</html>`;
  }

  /**
   * Output results
   */
  output(content) {
    if (this.options.output) {
      fs.writeFileSync(this.options.output, content, 'utf8');
      if (!this.options.quiet) {
        console.log(c('green', `Report written to ${this.options.output}`));
      }
    } else {
      console.log(content);
    }
  }

  /**
   * Run the CLI
   */
  run(args) {
    this.parseArgs(args);

    if (this.options.noColor) {
      Object.keys(colors).forEach(k => colors[k] = '');
    }

    if (this.options.help) {
      this.showHelp();
      process.exit(0);
    }

    if (this.options.version) {
      this.showVersion();
      process.exit(0);
    }

    // Load config
    this.loadConfig();

    // Check for files
    if (this.files.length === 0) {
      console.error(c('red', 'Error: No files specified'));
      console.error('Run with --help for usage information');
      process.exit(2);
    }

    // Discover files
    const filesToAnalyze = this.discoverFiles();

    if (filesToAnalyze.length === 0) {
      console.error(c('red', 'Error: No JavaScript files found'));
      process.exit(2);
    }

    if (!this.options.quiet) {
      console.log(c('cyan', `Analyzing ${filesToAnalyze.length} file(s)...`));
      console.log('');
    }

    // Analyze each file
    for (const file of filesToAnalyze) {
      if (this.options.verbose) {
        console.log(c('dim', `Analyzing ${path.relative(process.cwd(), file)}...`));
      }
      const result = this.analyzeFile(file);
      this.results.push(result);
    }

    // Format output
    let output;
    switch (this.options.format) {
      case 'json':
        output = this.formatJSON();
        break;
      case 'html':
        output = this.formatHTML();
        break;
      default:
        output = this.formatText();
    }

    this.output(output);

    // Exit with appropriate code
    const hasErrors = this.results.some(r => {
      if (!r.success) return true;
      const issues = this.filterBySeverity(r.result.issues);
      return issues.some(i => i.severity === 'error');
    });

    const hasWarnings = this.results.some(r => {
      if (!r.success) return false;
      const issues = this.filterBySeverity(r.result.issues);
      return issues.some(i => i.severity === 'warning');
    });

    if (hasErrors || (this.options.strict && hasWarnings)) {
      process.exit(1);
    }

    process.exit(0);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  const cli = new CLI();
  cli.run(process.argv.slice(2));
}

module.exports = CLI;
