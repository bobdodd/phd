# ActionLanguage Accessibility Analyzer

A VS Code extension that provides real-time accessibility analysis for JavaScript code.

## Features

- **Real-time Analysis**: Analyzes JavaScript files on save or as you type
- **Inline Diagnostics**: Shows accessibility issues directly in the editor
- **Accessibility Grades**: Letter grades (A-F) based on overall accessibility score
- **Quick Fixes**: Code actions to fix common accessibility issues
- **Detailed Reports**: Webview panel with comprehensive analysis results
- **WCAG Links**: Direct links to relevant WCAG success criteria
- **35+ Issue Types**: Detects keyboard, ARIA, focus, widget, context change, timing, and semantic issues
- **9 Specialized Analyzers**: Comprehensive coverage across all accessibility categories
- **19+ WCAG Criteria**: Maps issues to WCAG 2.1 success criteria (Levels A and AA)

## Installation

### From Source

1. Navigate to the extension directory:
   ```bash
   cd vscode-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy or symlink to VS Code extensions folder:
   ```bash
   # macOS/Linux
   ln -s "$(pwd)" ~/.vscode/extensions/actionlanguage-a11y

   # Windows
   mklink /D "%USERPROFILE%\.vscode\extensions\actionlanguage-a11y" "%cd%"
   ```

4. Restart VS Code

## Usage

### Automatic Analysis

The extension automatically analyzes JavaScript files when:
- A file is opened
- A file is saved (configurable)
- You stop typing (optional, configurable)

### Commands

- **ActionLanguage: Analyze Accessibility** - Analyze the current file
- **ActionLanguage: Analyze Workspace Accessibility** - Analyze all JS files in workspace
- **ActionLanguage: Show Accessibility Report** - Show detailed report in side panel

### Status Bar

The status bar shows the current file's accessibility grade:
- ✓ **A/B** - Good accessibility
- ⚠ **C** - Needs improvement
- ✗ **D/F** - Poor accessibility

Click the status bar item to open the detailed report.

### Quick Fixes

When hovering over an accessibility issue, you can:
- Add keyboard handlers for click-only elements
- Add ARIA role attributes
- Add tabindex for keyboard focus
- Open WCAG documentation

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `actionlanguage-a11y.enable` | `true` | Enable/disable the extension |
| `actionlanguage-a11y.analyzeOnSave` | `true` | Run analysis when file is saved |
| `actionlanguage-a11y.analyzeOnType` | `false` | Run analysis as you type |
| `actionlanguage-a11y.analyzeOnTypeDelay` | `1000` | Delay (ms) before analyzing after typing |
| `actionlanguage-a11y.minSeverity` | `info` | Minimum severity to report (error/warning/info) |
| `actionlanguage-a11y.showInlineHints` | `true` | Show inline hints for issues |
| `actionlanguage-a11y.excludePatterns` | `["**/node_modules/**"]` | Files to exclude |

## Scoring System

The extension scores code across four categories:

| Category | Weight | What it measures |
|----------|--------|------------------|
| Keyboard | 30% | Keyboard event handlers, key support |
| ARIA | 25% | ARIA attributes, roles, states |
| Focus | 25% | Focus management, tabindex usage |
| Widgets | 20% | WAI-ARIA widget pattern compliance |

### Grade Scale

| Grade | Score Range |
|-------|-------------|
| A | 90-100 |
| B | 80-89 |
| C | 70-79 |
| D | 60-69 |
| F | 0-59 |

## Issues Detected

The analyzer detects **35+ accessibility issues** across 9 specialized analyzers:

### Keyboard Accessibility

- Click handlers without keyboard equivalents (Enter/Space)
- Missing Escape handlers in focus traps
- Incomplete activation key support
- Touch events without click fallbacks

### ARIA Usage

- Missing or incorrect ARIA roles
- Static ARIA state attributes (set once, never updated)
- Invalid ARIA attribute combinations
- Missing required ARIA properties
- ARIA reference validation
- Missing live regions for dynamic content

### Focus Management

- Missing focus indicators
- Focus trap issues
- Tab order problems
- Focus loss after DOM changes

### Widget Patterns

- Non-compliant modal dialogs
- Incorrect tab patterns
- Accordion implementation issues
- Menu and combobox problems

### Context Changes (NEW)

- Unexpected form submissions in input/focus handlers
- Navigation triggered by non-user actions

### Timing Issues (NEW)

- Timeouts without user control
- Auto-refresh without pause mechanism
- Intervals causing navigation
- Time limits on interactions

### Semantic HTML (NEW)

- Non-semantic buttons (div/span with role="button")
- Non-semantic links (elements with role="link")

## Development

### Running Tests

```bash
npm test
```

### Project Structure

```
vscode-extension/
├── package.json        # Extension manifest
├── src/
│   └── extension.js    # Main extension code
├── test/
│   └── extension.test.js
└── README.md
```

## Requirements

- VS Code 1.74.0 or later
- Node.js 14.x or later
- The extension requires the ActionLanguage analyzer to be available

## What's New

### Recent Enhancements (Phases 1-3)

**Phase 1 - Keyboard Enhancements:**

- Missing Escape handler detection in focus traps (WCAG 2.1.2)
- Incomplete activation key support (Enter without Space, or vice versa) (WCAG 2.1.1)
- Touch events without click fallback detection (WCAG 2.5.2)

**Phase 2 - ARIA Enhancements:**

- Static ARIA state attribute detection (aria-pressed, aria-checked, aria-expanded never updated) (WCAG 4.1.2)
- ARIA reference validation for aria-labelledby, aria-describedby, etc. (WCAG 4.1.2)
- Missing live region detection for dynamic content (WCAG 4.1.3)

**Phase 3 - New Analyzers:**

- **ContextChangeAnalyzer**: Detects unexpected form submissions and navigation (WCAG 3.2.1, 3.2.2)
- **TimingAnalyzer**: Validates timing controls, auto-refresh, and time limits (WCAG 2.2.1, 2.2.2)
- **SemanticAnalyzer**: Encourages semantic HTML over ARIA roles (WCAG 4.1.2)

Total: **10 new accessibility detections** added across all phases.

## License

MIT
