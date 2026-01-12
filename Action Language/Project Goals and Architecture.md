# JavaScript to ActionLanguage Transcoder: Project Goals and Architecture

## Project Vision

Create a **macOS application** that transcodes JavaScript (up to ES6) into the Action Language tree structure, enabling semantic analysis of web page behavior for **accessibility purposes**.

## Primary Goals

### 1. JavaScript Transcoding
- Parse **any JavaScript fragment** (ES6 and earlier)
- Convert to the Action Language tree/digraph representation
- Preserve complete semantic information
- Handle all JavaScript constructs:
  - Variables, constants, expressions
  - Control flow (if, for, while, switch, try/catch)
  - Functions (declarations, expressions, arrows, async)
  - Classes (constructors, methods, inheritance)
  - Closures and scope chains
  - Event handlers and callbacks
  - Promises and async/await
  - DOM manipulation
  - Timer functions (setTimeout, setInterval)

### 2. Execution/Validation
- Execute the ActionLanguage representation
- Validate transcoding correctness by comparing behavior
- Ensure semantic equivalence between original JS and ActionLanguage

### 3. Semantic Analysis for Accessibility
The **real purpose** is to understand web page behavior hidden in JavaScript to better serve disabled users.

## Accessibility Analysis Use Cases

### Understanding Interactive Elements

| Element Pattern | What We Want to Know |
|-----------------|---------------------|
| Button → Dialog | Which dialog opens? Is focus moved there? |
| Dialog close | Does focus return to the triggering button? |
| Escape key | Can the dialog close on Escape? |
| Toast notifications | Is it auto-dismissing? What's the timeout? |
| Custom widgets | What keyboard interactions are supported? |
| Focus management | Is focus trapped appropriately in modals? |

### Event Handler Analysis

We need to find and understand:
- `addEventListener` registrations
- Event handler attributes (`onclick`, `onkeydown`, etc.)
- Delegated event handlers
- Custom event dispatching
- Event propagation and bubbling behavior

### DOM Manipulation Tracking

Understanding how JavaScript modifies the page:
- Element creation and insertion
- Attribute modifications (especially ARIA)
- Class changes that affect visibility/state
- Style changes (display, visibility)
- Focus manipulation (`focus()`, `blur()`)

### Timer and Async Analysis

- `setTimeout` / `setInterval` usage
- Promise chains and their resolution
- Async operations that affect UI state
- Animation and transition callbacks

## Architecture

### Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    macOS Application                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   JS        │  │  Action     │  │   Semantic          │  │
│  │   Parser    │──▶│  Language   │──▶│   Analyzer          │  │
│  │   (ES6)     │  │  Tree       │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│         ▼                ▼                    ▼              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Source    │  │  Execution  │  │   Accessibility     │  │
│  │   Input     │  │  Engine     │  │   Reports           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                          │                    │              │
│                          ▼                    ▼              │
│                   ┌─────────────────────────────────────┐   │
│                   │      Code Modification Engine       │   │
│                   │   (Fix accessibility issues in JS)  │   │
│                   └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. JavaScript Parser
- Full ES6 support
- Produces AST (Abstract Syntax Tree)
- Handles all syntax edge cases

#### 2. AST to ActionLanguage Transformer
- Maps JavaScript AST nodes to Action types
- Preserves scope information
- Maintains reference relationships
- Creates the tree/digraph structure

#### 3. ActionLanguage Tree
- Standardized representation
- Queryable structure
- Serializable to XML
- Supports modification

#### 4. Execution Engine
- Validates transcoding correctness
- Simulates JavaScript behavior
- Tracks state changes

#### 5. Semantic Analyzer
- Pattern recognition for common UI patterns
- Event handler discovery
- Focus management analysis
- Timer/async flow tracking

#### 6. Accessibility Reporter
- Generates findings about page behavior
- Identifies potential issues
- Suggests improvements

#### 7. Code Modifier
- Fixes accessibility issues in the ActionLanguage
- Regenerates corrected JavaScript

## JavaScript to ActionLanguage Mapping

### Variables and Declarations

| JavaScript | ActionLanguage Action |
|------------|----------------------|
| `var x = 5` | `<declareVar at="var.name" av="x"><literal at="literal.number" av="5"/></declareVar>` |
| `let x = 5` | `<declareLet at="let.name" av="x"><literal .../></declareLet>` |
| `const X = 5` | `<declareConst at="const.name" av="X"><literal .../></declareConst>` |

### Functions

| JavaScript | ActionLanguage Action |
|------------|----------------------|
| `function foo() {}` | `<declareFunction at="function.name" av="foo"><body>...</body></declareFunction>` |
| `() => {}` | `<declareArrowFunction><body>...</body></declareArrowFunction>` |
| `foo()` | `<callFunction at="function.name" av="foo"><params>...</params></callFunction>` |

### Control Flow

| JavaScript | ActionLanguage Action |
|------------|----------------------|
| `if (cond) {}` | `<if><condition>...</condition><then>...</then></if>` |
| `for (;;) {}` | `<for><init>...</init><condition>...</condition><increment>...</increment><body>...</body></for>` |
| `while (cond) {}` | `<while><condition>...</condition><body>...</body></while>` |

### DOM and Events

| JavaScript | ActionLanguage Action |
|------------|----------------------|
| `el.addEventListener('click', fn)` | `<addEventListenerCall><target>...</target><eventType av="click"/><handler>...</handler></addEventListenerCall>` |
| `el.focus()` | `<methodCall at="method.name" av="focus"><target>...</target></methodCall>` |
| `document.getElementById('x')` | `<methodCall at="method.name" av="getElementById"><target>document</target><params><literal av="x"/></params></methodCall>` |

### Timers

| JavaScript | ActionLanguage Action |
|------------|----------------------|
| `setTimeout(fn, 1000)` | `<setTimeoutCall><callback>...</callback><delay av="1000"/></setTimeoutCall>` |
| `setInterval(fn, 500)` | `<setIntervalCall><callback>...</callback><interval av="500"/></setIntervalCall>` |

## Semantic Analysis Patterns

### Button-Dialog Pattern Detection

Looking for:
```javascript
button.addEventListener('click', () => {
    dialog.showModal();  // or dialog.show()
    // Focus should move to dialog or element within
});

dialog.addEventListener('close', () => {
    button.focus();  // Focus should return
});

dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        dialog.close();
    }
});
```

In ActionLanguage, we can query:
1. Find all `addEventListenerCall` where `eventType` is "click"
2. Within handler body, find `methodCall` where `method.name` is "showModal" or "show"
3. Identify the target element
4. Find corresponding close handlers
5. Check for focus management

### Toast/Auto-dismiss Detection

Looking for:
```javascript
toast.classList.add('visible');
setTimeout(() => {
    toast.classList.remove('visible');
}, 5000);
```

In ActionLanguage:
1. Find `setTimeoutCall` actions
2. Analyze callback body for visibility changes
3. Extract timeout duration
4. Report auto-dismiss behavior

## Development Phases

### Phase 1: Core Transcoding
- [ ] JavaScript parser integration (likely use an existing parser like Acorn or Babel)
- [ ] AST to ActionLanguage transformer
- [ ] Basic Action types for all ES6 constructs
- [ ] XML serialization

### Phase 2: Execution Engine
- [ ] Stack architecture in JavaScript
- [ ] Action execution implementations
- [ ] Validation test suite
- [ ] Comparison with native JS execution

### Phase 3: Semantic Analysis
- [ ] Event handler pattern detection
- [ ] Focus management analysis
- [ ] Timer analysis
- [ ] DOM manipulation tracking

### Phase 4: Accessibility Reporting
- [ ] Issue identification
- [ ] Report generation
- [ ] Severity classification
- [ ] Remediation suggestions

### Phase 5: Code Modification
- [ ] ActionLanguage modification API
- [ ] JavaScript regeneration from ActionLanguage
- [ ] Accessibility fix injection

### Phase 6: macOS Application
- [ ] Native macOS UI
- [ ] Web page loading/inspection
- [ ] Interactive analysis tools
- [ ] Report export

## Technology Stack

- **Language**: JavaScript (for transcoding and execution engine)
- **Parser**: Acorn, Babel, or ESTree-compatible parser
- **Platform**: macOS (native application)
- **UI Framework**: TBD (SwiftUI, Electron, or Tauri)
- **Storage**: ActionLanguage XML serialization

## Success Criteria

1. **Complete ES6 Coverage**: Every JavaScript construct can be transcoded
2. **Semantic Equivalence**: Executed ActionLanguage produces same results as original JS
3. **Pattern Detection**: Can identify common accessibility-relevant patterns
4. **Actionable Output**: Analysis produces clear, actionable accessibility findings
5. **Modification Capability**: Can fix issues and regenerate working JavaScript

## Future Extensions

- Support for TypeScript
- Support for JSX/React patterns
- Integration with browser DevTools
- Automated accessibility testing
- CI/CD integration for accessibility checks
- Framework-specific pattern libraries (React, Vue, Angular)
