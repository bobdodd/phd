# Action Language Accessibility Analyzer

A comprehensive JavaScript accessibility analysis tool that detects 35+ accessibility issues across 9 analyzers, covering 19+ WCAG 2.1 success criteria.

## Overview

The Action Language Accessibility Analyzer is a research project that analyzes JavaScript code for accessibility issues. It uses a custom Action Language AST representation to detect patterns that may cause problems for users with disabilities.

The analyzer can be used as:
- **CLI Tool**: Analyze JavaScript files from the command line
- **VS Code Extension**: Real-time analysis with inline diagnostics and quick fixes
- **Library**: Integrate into your build pipeline or testing framework

## Features

### 35+ Accessibility Issues Detected

The analyzer detects issues across multiple categories:

#### Keyboard Accessibility (KeyboardAnalyzer)
- Missing keyboard event handlers for interactive elements
- Missing Enter/Space activation keys
- Missing Escape handlers in focus traps
- Touch events without click fallbacks
- Incomplete keyboard support patterns

#### ARIA Usage (ARIAAnalyzer)
- Missing or incorrect ARIA roles
- Static ARIA state attributes (never updated)
- Invalid ARIA attribute combinations
- Missing required ARIA properties
- ARIA reference validation (placeholder)
- Live region detection (placeholder)

#### Focus Management (FocusAnalyzer)
- Missing focus indicators
- Focus trap issues
- Tab order problems
- Focus loss after DOM changes

#### Widget Patterns (WidgetPatternValidator)
- Non-compliant modal dialogs
- Incorrect tab patterns
- Accordion implementation issues
- Menu and combobox problems
- Custom widget validation

#### Context Changes (ContextChangeAnalyzer) *NEW*
- Unexpected form submissions in input/focus handlers
- Navigation triggered by non-click events
- Context changes without user action

#### Timing Issues (TimingAnalyzer) *NEW*
- Timeouts without user control
- Auto-refresh without pause mechanism
- Intervals causing navigation or major DOM changes
- Time limits on interactions

#### Semantic HTML (SemanticAnalyzer) *NEW*
- Non-semantic buttons (div/span with role="button")
- Non-semantic links (elements with role="link")
- Missing native HTML elements

### WCAG 2.1 Coverage

The analyzer maps issues to 19+ WCAG 2.1 success criteria:

- **2.1.1** Keyboard (Level A)
- **2.1.2** No Keyboard Trap (Level A)
- **2.2.1** Timing Adjustable (Level A)
- **2.2.2** Pause, Stop, Hide (Level A)
- **2.4.3** Focus Order (Level A)
- **2.4.7** Focus Visible (Level AA)
- **2.5.2** Pointer Cancellation (Level A)
- **3.2.1** On Focus (Level A)
- **3.2.2** On Input (Level A)
- **4.1.2** Name, Role, Value (Level A)
- **4.1.3** Status Messages (Level AA)

### Scoring System

Code is graded A-F based on weighted category scores:

| Category | Weight | What it measures |
|----------|--------|------------------|
| Keyboard | 30% | Keyboard event handlers, key support |
| ARIA | 25% | ARIA attributes, roles, states |
| Focus | 25% | Focus management, tabindex usage |
| Widgets | 20% | WAI-ARIA widget pattern compliance |

**Grade Scale:**
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: 0-59

## Installation

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### From Source

```bash
cd "Action Language/app"
npm install
```

## Usage

### Command Line Interface

Analyze a single file:

```bash
node src/cli.js path/to/file.js
```

Analyze multiple files:

```bash
node src/cli.js src/**/*.js
```

Generate detailed report:

```bash
node src/cli.js --report path/to/file.js
```

### As a Library

```javascript
const { analyzeFile } = require('./src/analyzer');

const results = analyzeFile('path/to/file.js');

console.log(`Grade: ${results.grade}`);
console.log(`Score: ${results.score}/100`);
console.log(`Issues: ${results.issues.length}`);

results.issues.forEach(issue => {
  console.log(`${issue.severity}: ${issue.message}`);
  console.log(`  WCAG: ${issue.wcag.join(', ')}`);
});
```

### VS Code Extension

See [vscode-extension/README.md](vscode-extension/README.md) for installation and usage instructions.

## Project Structure

```
Action Language/app/
├── src/
│   ├── parser/              # JavaScript to Action Language parser
│   ├── analyzer/            # Accessibility analyzers
│   │   ├── EventAnalyzer.js
│   │   ├── FocusAnalyzer.js
│   │   ├── ARIAAnalyzer.js
│   │   ├── KeyboardAnalyzer.js
│   │   ├── WidgetPatternValidator.js
│   │   ├── ContextChangeAnalyzer.js    # NEW
│   │   ├── TimingAnalyzer.js           # NEW
│   │   ├── SemanticAnalyzer.js         # NEW
│   │   └── AccessibilityReporter.js
│   ├── cli.js               # Command-line interface
│   └── index.js             # Main entry point
├── test/
│   ├── analyzer/            # Comprehensive test suite
│   └── run-all.js          # Test runner
├── demo/                    # Interactive examples
│   ├── js/                 # Demo implementations
│   │   ├── modals/
│   │   ├── accordions/
│   │   ├── focus-management/
│   │   ├── aria-live-regions/
│   │   └── inaccessible/   # Anti-patterns
│   └── index.html          # Demo home page
├── vscode-extension/        # VS Code integration
└── docs/                    # Documentation
    └── ISSUE_COVERAGE.md   # Complete issue reference
```

## Analyzers

### Core Analyzers

- **EventAnalyzer**: Tracks event handlers and user interactions
- **FocusAnalyzer**: Analyzes focus management and keyboard navigation
- **ARIAAnalyzer**: Validates ARIA usage and state management
- **KeyboardAnalyzer**: Ensures keyboard accessibility
- **WidgetPatternValidator**: Validates WAI-ARIA design patterns
- **AccessibilityReporter**: Aggregates results and computes scores

### Phase 2 & 3 Analyzers (NEW)

- **ContextChangeAnalyzer**: Detects unexpected context changes (WCAG 3.2.1, 3.2.2)
- **TimingAnalyzer**: Validates timing controls and limits (WCAG 2.2.1, 2.2.2)
- **SemanticAnalyzer**: Encourages semantic HTML usage (WCAG 4.1.2)

## Recent Enhancements

### Phase 1: Keyboard Enhancements
- `missing-escape-handler`: Tab traps without Escape key
- `incomplete-activation-keys`: Enter without Space or vice versa
- `touch-without-click`: Touch events without click fallback

### Phase 2: ARIA Enhancements
- `static-aria-state`: ARIA state attributes never updated
- `aria-reference-not-found`: Invalid ID references (placeholder)
- `missing-live-region`: Dynamic content without announcements (placeholder)

### Phase 3: New Analyzers
- **ContextChangeAnalyzer**: 2 new detections
- **TimingAnalyzer**: 4 new detections
- **SemanticAnalyzer**: 2 new detections

Total: **10 new accessibility detections** across 3 development phases.

## Testing

Run the full test suite:

```bash
npm test
```

Run specific analyzer tests:

```bash
node test/analyzer/KeyboardAnalyzer.test.js
node test/analyzer/ARIAAnalyzer.test.js
node test/analyzer/ContextChangeAnalyzer.test.js
```

Test coverage:
- 1000+ test cases
- All 9 analyzers
- 35+ issue types
- Edge cases and integration tests

## Demo Examples

Interactive examples demonstrating both accessible and inaccessible patterns:

```bash
cd demo
node server.js
# Open http://localhost:3000
```

Available demos:
- Modal dialogs (accessible vs inaccessible)
- Accordions with proper keyboard support
- Focus management techniques
- ARIA live regions
- Tab panels
- Form validation
- Anti-patterns and common mistakes

## Documentation

- [ISSUE_COVERAGE.md](docs/ISSUE_COVERAGE.md) - Complete reference of all detected issues
- [vscode-extension/README.md](vscode-extension/README.md) - VS Code extension documentation

## Development

### Adding a New Detection

1. Identify the WCAG success criterion
2. Create detection logic in appropriate analyzer
3. Add test cases to `test/analyzer/`
4. Update ISSUE_COVERAGE.md
5. Add demo example if applicable

### Running in Development

```bash
# Watch mode for tests
npm run test:watch

# Analyze demo files
node src/cli.js demo/js/inaccessible/*.js
```

## Requirements

- Node.js 14.x or later
- Tested on macOS, Linux, and Windows

## License

MIT

## Contributing

This is a research project. For questions or contributions, please contact the project maintainer.

## Related Projects

- [VS Code Extension](vscode-extension/) - Real-time analysis in VS Code
- [Demo Suite](demo/) - Interactive accessibility examples

## Acknowledgments

Built on research in accessibility analysis and the Web Content Accessibility Guidelines (WCAG) 2.1.
