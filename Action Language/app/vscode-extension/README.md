# ActionLanguage Accessibility Analyzer

A VS Code extension that provides real-time accessibility analysis for JavaScript code.

## Features

- **Real-time Analysis**: Analyzes JavaScript files on save or as you type
- **Inline Diagnostics**: Shows accessibility issues directly in the editor
- **Accessibility Grades**: Letter grades (A-F) based on overall accessibility score
- **Quick Fixes**: Code actions to fix common accessibility issues
- **Detailed Reports**: Webview panel with comprehensive analysis results
- **WCAG Links**: Direct links to relevant WCAG success criteria

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

The analyzer detects common accessibility issues including:

- Click handlers without keyboard equivalents
- Missing ARIA roles and attributes
- Improper focus management
- Screen reader navigation conflicts
- Missing widget patterns (tabs, dialogs, etc.)
- Improper use of aria-hidden

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
- The extension requires the ActionLanguage analyzer to be available

## License

MIT
