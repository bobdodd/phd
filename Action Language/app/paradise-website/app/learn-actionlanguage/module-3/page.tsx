export default function Module3() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-orange via-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white text-paradise-orange w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl">
              3
            </div>
            <div>
              <h1 className="text-5xl font-bold">
                CRUD Operations on ActionLanguage
              </h1>
              <p className="text-xl text-white/90 mt-2">
                The key to universal adaptivity ⭐
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-3xl">
            <p className="text-lg">
              <strong>Time:</strong> 45-60 minutes • <strong>Level:</strong> Intermediate
            </p>
            <p className="text-lg mt-2">
              This is THE KEY SECTION. By the end, you'll understand how CREATE, READ, UPDATE, and DELETE
              operations on ActionLanguage enable one set of analyzers to work for every UI language.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* The Big Idea */}
          <div className="bg-gradient-to-r from-paradise-orange/10 to-paradise-purple/10 rounded-lg p-8 border-l-4 border-paradise-orange mb-12">
            <h2 className="text-3xl font-bold text-paradise-orange mb-4">The Big Idea</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
              Paradise treats ActionLanguage as a <strong>database</strong>. Just like you can perform
              CRUD operations on database records, you can perform CRUD operations on ActionLanguage nodes.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              This seemingly simple insight is what makes universal adaptivity possible.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue/20 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-paradise-blue">Module Contents</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <a href="#why-crud" className="text-paradise-blue hover:underline">→ Why CRUD?</a>
              <a href="#create" className="text-paradise-green hover:underline">→ CREATE (Parse)</a>
              <a href="#read" className="text-paradise-blue hover:underline">→ READ (Analyze)</a>
              <a href="#update" className="text-paradise-orange hover:underline">→ UPDATE (Fix)</a>
              <a href="#delete" className="text-paradise-purple hover:underline">→ DELETE (Optimize)</a>
              <a href="#pipeline" className="text-paradise-blue hover:underline">→ Complete Pipeline</a>
              <a href="#adaptivity" className="text-paradise-orange hover:underline">→ Universal Adaptivity</a>
              <a href="#example" className="text-paradise-green hover:underline">→ End-to-End Example</a>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">

            {/* Why CRUD? */}
            <section id="why-crud">
              <h2 className="text-3xl font-bold mt-12 mb-6">Why CRUD?</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                When you work with a database, you perform four fundamental operations:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8 not-prose">
                <div className="bg-paradise-green/10 rounded-lg p-5 border border-paradise-green/20">
                  <h4 className="font-bold text-lg mb-2 text-paradise-green">CREATE</h4>
                  <p className="text-sm text-gray-700">Insert new records into the database</p>
                </div>

                <div className="bg-paradise-blue/10 rounded-lg p-5 border border-paradise-blue/20">
                  <h4 className="font-bold text-lg mb-2 text-paradise-blue">READ</h4>
                  <p className="text-sm text-gray-700">Query and retrieve existing records</p>
                </div>

                <div className="bg-paradise-orange/10 rounded-lg p-5 border border-paradise-orange/20">
                  <h4 className="font-bold text-lg mb-2 text-paradise-orange">UPDATE</h4>
                  <p className="text-sm text-gray-700">Modify existing records</p>
                </div>

                <div className="bg-paradise-purple/10 rounded-lg p-5 border border-paradise-purple/20">
                  <h4 className="font-bold text-lg mb-2 text-paradise-purple">DELETE</h4>
                  <p className="text-sm text-gray-700">Remove records from the database</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Paradise applies this same pattern to ActionLanguage:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Treat ActionLanguage like a database
const actionTree = CREATE(sourceCode);      // Parse → ActionLanguage
const issues = READ(actionTree);             // Query for patterns
const fixedTree = UPDATE(actionTree, fixes); // Apply transformations
const optimizedTree = DELETE(fixedTree);     // Remove unused code

// Generate back to source
const fixedCode = GENERATE(optimizedTree, language);`}</code></pre>
              </div>

              <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-orange mb-2">The Key Insight</p>
                <p className="text-gray-700 mb-0">
                  Only <strong>CREATE</strong> (parsing) and <strong>GENERATE</strong> (code generation) are
                  language-specific. <strong>READ, UPDATE, and DELETE</strong> operate on ActionLanguage
                  and work universally across all languages.
                </p>
              </div>
            </section>

            {/* CREATE */}
            <section id="create">
              <h2 className="text-3xl font-bold mt-12 mb-6">
                <span className="inline-block bg-paradise-green text-white px-4 py-2 rounded-lg mr-3">CREATE</span>
                Parse to ActionLanguage
              </h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The CREATE operation transforms source code in any language into ActionLanguage nodes.
                This is the only language-specific step in the entire pipeline.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">How CREATE Works</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">CREATE Pipeline:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`function CREATE(sourceCode, language) {
  // Step 1: Parse source code to AST (language-specific)
  const ast = parseToAST(sourceCode, language);

  // Step 2: Transform AST to ActionLanguage (language-specific)
  const actionTree = transformAST(ast);

  // Step 3: Enrich with metadata
  enrichWithMetadata(actionTree);

  return actionTree;
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: JavaScript CREATE</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Input (JavaScript):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`const button = document.getElementById('submit');
button.addEventListener('click', handleClick);
button.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    handleClick(event);
  }
});`}</code></pre>
              </div>

              <div className="text-center py-4 text-2xl text-paradise-green">
                ↓ CREATE (Parse) ↓
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">Output (ActionLanguage):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    id: "node-1",
    actionType: "querySelector",
    method: "getElementById",
    selector: "submit",
    binding: "button"
  },
  {
    id: "node-2",
    actionType: "eventHandler",
    event: "click",
    element: { binding: "button" },
    handler: {
      actionType: "functionReference",
      name: "handleClick"
    }
  },
  {
    id: "node-3",
    actionType: "eventHandler",
    event: "keydown",
    element: { binding: "button" },
    handler: {
      actionType: "functionExpression",
      params: ["event"],
      body: [
        {
          actionType: "conditional",
          condition: {
            actionType: "binaryExpression",
            operator: "||",
            left: {
              operator: "===",
              left: { property: "key", object: "event" },
              right: "Enter"
            },
            right: {
              operator: "===",
              left: { property: "key", object: "event" },
              right: " "
            }
          },
          consequent: [
            {
              actionType: "call",
              name: "handleClick",
              arguments: [{ binding: "event" }]
            }
          ]
        }
      ]
    }
  }
]`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">The Same for Other Languages</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                The beauty of CREATE is that different languages produce the <strong>same ActionLanguage</strong>
                for equivalent interactions:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Objective-C (iOS):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`UIButton *button = [self.view viewWithTag:100];
[button addTarget:self
           action:@selector(handleClick:)
 forControlEvents:UIControlEventTouchUpInside];`}</code></pre>
              </div>

              <div className="text-center py-4 text-2xl text-paradise-green">
                ↓ CREATE (Parse) ↓
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">Output (Same ActionLanguage!):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    id: "node-1",
    actionType: "querySelector",
    method: "viewWithTag",
    selector: "100",
    binding: "button"
  },
  {
    id: "node-2",
    actionType: "eventHandler",
    event: "click",  // Normalized from TouchUpInside
    element: { binding: "button" },
    handler: {
      actionType: "functionReference",
      name: "handleClick"
    }
  }
]`}</code></pre>
              </div>

              <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-green mb-2">Write Once, Support Forever</p>
                <p className="text-gray-700 mb-0">
                  To add support for a new language (Kotlin, Swift, Flutter), you only need to write
                  a CREATE function for that language. All analyzers, all fixes, all WCAG rules
                  immediately work with the new language.
                </p>
              </div>
            </section>

            {/* READ */}
            <section id="read">
              <h2 className="text-3xl font-bold mt-12 mb-6">
                <span className="inline-block bg-paradise-blue text-white px-4 py-2 rounded-lg mr-3">READ</span>
                Analyze Patterns
              </h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The READ operation queries the ActionLanguage tree to detect accessibility patterns.
                This is where all the magic happens—and it's completely language-agnostic.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">How READ Works</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">READ Pipeline:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`function READ(actionTree) {
  const issues = [];

  // Initialize all analyzers
  const analyzers = [
    new KeyboardAnalyzer(),
    new FocusAnalyzer(),
    new ARIAAnalyzer(),
    new ContextChangeAnalyzer(),
    new TimingAnalyzer(),
    // ... 9 total
  ];

  // Each analyzer queries the tree for patterns
  for (const analyzer of analyzers) {
    const found = analyzer.analyze(actionTree);
    issues.push(...found);
  }

  return issues;
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Mouse-Only Click Detection</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Let's see how KeyboardAnalyzer detects mouse-only clicks by querying ActionLanguage:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">KeyboardAnalyzer (READ operation):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class KeyboardAnalyzer {
  analyze(actionTree) {
    const issues = [];

    // READ: Find all click event handlers
    const clickHandlers = actionTree.filter(node =>
      node.actionType === 'eventHandler' &&
      node.event === 'click'
    );

    // For each click handler...
    for (const clickHandler of clickHandlers) {
      const element = clickHandler.element;

      // READ: Check if keyboard handler exists for same element
      const hasKeyboard = actionTree.some(node =>
        node.actionType === 'eventHandler' &&
        this.sameElement(node.element, element) &&
        (node.event === 'keydown' ||
         node.event === 'keypress' ||
         node.event === 'keyup')
      );

      if (!hasKeyboard) {
        // Issue detected!
        issues.push({
          type: 'mouse-only-click',
          severity: 'warning',
          wcag: ['2.1.1'],
          node: clickHandler,
          message: 'Click handler without keyboard equivalent'
        });
      }
    }

    return issues;
  }

  sameElement(elem1, elem2) {
    return elem1.binding === elem2.binding ||
           elem1.selector === elem2.selector ||
           elem1.id === elem2.id;
  }
}`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Notice what's happening:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>🔍 <strong>Query</strong> the tree for all click handlers (filter operation)</li>
                <li>🔍 <strong>Query</strong> for keyboard handlers on the same element (some operation)</li>
                <li>⚡ <strong>Pattern match</strong> using simple boolean logic</li>
                <li>✅ <strong>No AI</strong>, no machine learning, no training data</li>
              </ul>

              <h3 className="text-2xl font-bold mt-8 mb-4">More Complex Patterns</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Static ARIA State Detection:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class ARIAAnalyzer {
  analyze(actionTree) {
    const issues = [];

    // READ: Find all setAttribute calls for ARIA state attributes
    const ariaSetters = actionTree.filter(node =>
      node.actionType === 'setAttribute' &&
      this.isARIAState(node.attribute)
    );

    // For each ARIA setter...
    for (const setter of ariaSetters) {
      const element = setter.element;
      const attribute = setter.attribute;

      // READ: Count how many times this attribute is set
      const updateCount = actionTree.filter(node =>
        node.actionType === 'setAttribute' &&
        node.attribute === attribute &&
        this.sameElement(node.element, element)
      ).length;

      // If set exactly once, it's static!
      if (updateCount === 1) {
        issues.push({
          type: 'static-aria-state',
          severity: 'warning',
          wcag: ['4.1.2'],
          node: setter,
          message: \`aria-\${attribute} set once but never updated\`
        });
      }
    }

    return issues;
  }

  isARIAState(attr) {
    return ['aria-expanded', 'aria-selected', 'aria-checked',
            'aria-pressed', 'aria-current'].includes(attr);
  }
}`}</code></pre>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">Language Independence</p>
                <p className="text-gray-700 mb-0">
                  This analyzer works identically for JavaScript, TypeScript, React, Objective-C, Kotlin—any
                  language with a CREATE function. The READ operation only sees ActionLanguage nodes.
                </p>
              </div>
            </section>

            {/* UPDATE */}
            <section id="update">
              <h2 className="text-3xl font-bold mt-12 mb-6">
                <span className="inline-block bg-paradise-orange text-white px-4 py-2 rounded-lg mr-3">UPDATE</span>
                Apply Fixes
              </h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The UPDATE operation modifies the ActionLanguage tree to fix detected issues.
                Like READ, this is completely language-agnostic.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">How UPDATE Works</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">UPDATE Pipeline:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`function UPDATE(actionTree, issues) {
  let modifiedTree = [...actionTree];

  // For each issue detected in READ...
  for (const issue of issues) {
    // Get the appropriate fix generator
    const fixer = getFixGenerator(issue.type);

    // Generate fix nodes (new ActionLanguage)
    const fixNodes = fixer.generateFix(issue, modifiedTree);

    // Insert fix nodes into the tree
    modifiedTree = insertNodes(modifiedTree, fixNodes, issue.node);
  }

  return modifiedTree;
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Adding Keyboard Handler</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Fix Generator for mouse-only-click:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`class MouseOnlyClickFixer {
  generateFix(issue, actionTree) {
    const clickHandler = issue.node;
    const element = clickHandler.element;

    // CREATE new ActionLanguage nodes for keyboard handler
    const keyboardHandler = {
      id: generateId(),
      actionType: "eventHandler",
      event: "keydown",
      element: { ...element },  // Same element
      handler: {
        actionType: "functionExpression",
        params: ["event"],
        body: [
          {
            actionType: "conditional",
            condition: {
              actionType: "binaryExpression",
              operator: "||",
              left: {
                operator: "===",
                left: { property: "key", object: "event" },
                right: "Enter"
              },
              right: {
                operator: "===",
                left: { property: "key", object: "event" },
                right: " "
              }
            },
            consequent: [
              {
                actionType: "preventDefault",
                target: { binding: "event" }
              },
              // Call the same handler as click
              ...clickHandler.handler.body
            ]
          }
        ]
      }
    };

    return [keyboardHandler];
  }
}`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                What just happened?
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>🔨 Generated <strong>new ActionLanguage nodes</strong> for the keyboard handler</li>
                <li>📋 Copied the element reference from the click handler</li>
                <li>✨ Created conditional logic checking for Enter and Space keys</li>
                <li>♻️ Reused the same handler body from the click handler</li>
                <li>🌍 <strong>Works for any language</strong> because it operates on ActionLanguage</li>
              </ul>

              <h3 className="text-2xl font-bold mt-8 mb-4">Before and After UPDATE</h3>

              <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <p className="font-semibold mb-3 text-red-800">Before UPDATE:</p>
                  <pre className="text-xs bg-white p-3 rounded overflow-x-auto"><code>{`[
  {
    actionType: "eventHandler",
    event: "click",
    element: { binding: "button" },
    handler: { ... }
  }
]

// Only click handler - issue!`}</code></pre>
                </div>

                <div className="bg-paradise-green/10 rounded-lg p-6 border border-paradise-green">
                  <p className="font-semibold mb-3 text-paradise-green">After UPDATE:</p>
                  <pre className="text-xs bg-white p-3 rounded overflow-x-auto"><code>{`[
  {
    actionType: "eventHandler",
    event: "click",
    element: { binding: "button" },
    handler: { ... }
  },
  {
    actionType: "eventHandler",
    event: "keydown",
    element: { binding: "button" },
    handler: { ... }
  }
]

// Keyboard handler added!`}</code></pre>
                </div>
              </div>

              <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-orange mb-2">Universal Fixes</p>
                <p className="text-gray-700 mb-0">
                  These fix generators work for JavaScript, Objective-C, Kotlin, or any language with
                  a GENERATE function. You write the fix logic once in terms of ActionLanguage operations.
                </p>
              </div>
            </section>

            {/* DELETE */}
            <section id="delete">
              <h2 className="text-3xl font-bold mt-12 mb-6">
                <span className="inline-block bg-paradise-purple text-white px-4 py-2 rounded-lg mr-3">DELETE</span>
                Optimize Code
              </h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                The DELETE operation removes unnecessary nodes from the ActionLanguage tree—dead code,
                unused bindings, unreachable paths.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">How DELETE Works</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">DELETE Pipeline:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`function DELETE(actionTree) {
  let optimized = [...actionTree];

  // Remove unused bindings
  optimized = removeUnusedBindings(optimized);

  // Remove unreachable code
  optimized = removeUnreachableCode(optimized);

  // Remove duplicate operations
  optimized = removeDuplicates(optimized);

  // Remove no-op transformations
  optimized = removeNoOps(optimized);

  return optimized;
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Removing Unused Bindings</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`function removeUnusedBindings(actionTree) {
  // Build usage map
  const bindings = new Map();
  const usages = new Map();

  // First pass: find all bindings created
  for (const node of actionTree) {
    if (node.binding) {
      bindings.set(node.binding, node);
      usages.set(node.binding, 0);
    }
  }

  // Second pass: count usages
  for (const node of actionTree) {
    walkTree(node, (subnode) => {
      if (subnode.binding && bindings.has(subnode.binding)) {
        usages.set(subnode.binding, usages.get(subnode.binding) + 1);
      }
    });
  }

  // Third pass: remove unused (usage count = 0)
  return actionTree.filter(node => {
    if (!node.binding) return true;
    return usages.get(node.binding) > 0;
  });
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Example: Removing Unreachable Code</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Before DELETE:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  {
    actionType: "conditional",
    condition: { value: false },  // Always false!
    consequent: [
      // This code is unreachable
      { actionType: "call", name: "doSomething" }
    ],
    alternate: [
      { actionType: "call", name: "doSomethingElse" }
    ]
  }
]`}</code></pre>
              </div>

              <div className="text-center py-4 text-2xl text-paradise-purple">
                ↓ DELETE (Optimize) ↓
              </div>

              <div className="bg-paradise-purple/5 rounded-lg p-6 border border-paradise-purple my-6">
                <p className="font-semibold mb-3">After DELETE:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  // Conditional removed, only reachable branch kept
  { actionType: "call", name: "doSomethingElse" }
]`}</code></pre>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                DELETE operations include:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>🗑️ Removing unused variables and bindings</li>
                <li>🗑️ Eliminating unreachable code paths</li>
                <li>🗑️ Removing duplicate event listeners</li>
                <li>🗑️ Simplifying always-true/false conditionals</li>
                <li>🗑️ Removing no-op operations (setAttribute to same value)</li>
              </ul>

              <div className="bg-paradise-purple/10 border-l-4 border-paradise-purple p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-purple mb-2">Why DELETE Matters</p>
                <p className="text-gray-700 mb-0">
                  After applying fixes with UPDATE, you may have introduced redundant code or
                  operations that can be optimized away. DELETE ensures the final generated
                  code is clean and efficient.
                </p>
              </div>
            </section>

            {/* Complete Pipeline */}
            <section id="pipeline">
              <h2 className="text-3xl font-bold mt-12 mb-6">The Complete Pipeline</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Now let's see how all four CRUD operations work together in the complete Paradise pipeline:
              </p>

              <div className="bg-gradient-to-r from-paradise-green/10 via-paradise-blue/10 via-paradise-orange/10 to-paradise-purple/10 rounded-lg p-8 my-8 border border-paradise-blue/20">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-paradise-green text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                        C
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">CREATE (Language-Specific)</h4>
                        <p className="text-sm text-gray-600">Parse source code → ActionLanguage tree</p>
                      </div>
                    </div>
                    <div className="ml-13 bg-white rounded p-3 text-sm">
                      <code>JavaScript/Objective-C/Kotlin → ActionLanguage</code>
                    </div>
                  </div>

                  <div className="flex justify-center text-2xl text-gray-400">↓</div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-paradise-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                        R
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">READ (Universal)</h4>
                        <p className="text-sm text-gray-600">Query tree for accessibility patterns</p>
                      </div>
                    </div>
                    <div className="ml-13 bg-white rounded p-3 text-sm">
                      <code>9 analyzers × 35+ patterns → Issues list</code>
                    </div>
                  </div>

                  <div className="flex justify-center text-2xl text-gray-400">↓</div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-paradise-orange text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                        U
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">UPDATE (Universal)</h4>
                        <p className="text-sm text-gray-600">Generate and apply fixes to tree</p>
                      </div>
                    </div>
                    <div className="ml-13 bg-white rounded p-3 text-sm">
                      <code>Issues → Fix nodes → Modified ActionLanguage</code>
                    </div>
                  </div>

                  <div className="flex justify-center text-2xl text-gray-400">↓</div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-paradise-purple text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                        D
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">DELETE (Universal)</h4>
                        <p className="text-sm text-gray-600">Optimize by removing unnecessary code</p>
                      </div>
                    </div>
                    <div className="ml-13 bg-white rounded p-3 text-sm">
                      <code>Remove unused bindings, unreachable code → Clean tree</code>
                    </div>
                  </div>

                  <div className="flex justify-center text-2xl text-gray-400">↓</div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                        G
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">GENERATE (Language-Specific)</h4>
                        <p className="text-sm text-gray-600">Transform ActionLanguage back to source</p>
                      </div>
                    </div>
                    <div className="ml-13 bg-white rounded p-3 text-sm">
                      <code>ActionLanguage → Fixed JavaScript/Objective-C/Kotlin</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-paradise-blue/10 border-l-4 border-paradise-blue p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-blue mb-2">The 80/20 Rule</p>
                <p className="text-gray-700 mb-0">
                  Only <strong>CREATE and GENERATE</strong> (20%) are language-specific.
                  <strong> READ, UPDATE, and DELETE</strong> (80%) are universal and work
                  identically for every language.
                </p>
              </div>
            </section>

            {/* Universal Adaptivity */}
            <section id="adaptivity">
              <h2 className="text-3xl font-bold mt-12 mb-6">Universal Adaptivity Explained</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                This is where it all comes together. Here's how Paradise achieves universal adaptivity:
              </p>

              <div className="space-y-6 my-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-green">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-green">1. Write CREATE for New Language</h4>
                  <p className="text-gray-700 mb-3">
                    To support Kotlin, write a parser that transforms Kotlin Android code into ActionLanguage.
                    This is the only language-specific work required.
                  </p>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`// Kotlin
button.setOnClickListener { handleClick() }

// ↓ CREATE ↓

// ActionLanguage (same as JavaScript!)
{ actionType: "eventHandler", event: "click", ... }`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-blue">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-blue">2. Existing Analyzers Just Work</h4>
                  <p className="text-gray-700 mb-3">
                    All 9 analyzers detecting 35+ issues immediately work on Kotlin code because they
                    operate on ActionLanguage, not source code.
                  </p>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`// KeyboardAnalyzer doesn't care if input was Kotlin or JavaScript
const issues = READ(actionTree);
// Works identically for both!`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-paradise-orange">
                  <h4 className="font-semibold text-lg mb-3 text-paradise-orange">3. Existing Fixes Just Work</h4>
                  <p className="text-gray-700 mb-3">
                    All fix generators work because they produce ActionLanguage, not source code.
                  </p>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`// Fix generator creates ActionLanguage nodes
const fixed = UPDATE(actionTree, issues);
// Same fixes for JavaScript and Kotlin!`}</code></pre>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gray-600">
                  <h4 className="font-semibold text-lg mb-3">4. Write GENERATE for New Language</h4>
                  <p className="text-gray-700 mb-3">
                    Transform fixed ActionLanguage back to idiomatic Kotlin. This is the second
                    language-specific component.
                  </p>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code>{`// ActionLanguage
{ actionType: "eventHandler", event: "keydown", ... }

// ↓ GENERATE ↓

// Kotlin
button.setOnKeyListener { _, keyCode, event ->
  if (keyCode == KeyEvent.KEYCODE_ENTER) handleClick()
  false
}`}</code></pre>
                </div>
              </div>

              <div className="bg-gradient-to-r from-paradise-orange to-paradise-purple text-white rounded-lg p-8 my-8">
                <h3 className="text-2xl font-bold mb-4">The Result</h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Write 2 functions (CREATE and GENERATE) for new language</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Get 9 analyzers detecting 35+ issues for free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Get 23+ fix generators for free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Get WCAG compliance checking for free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>All future enhancements work automatically</span>
                  </li>
                </ul>
                <p className="text-xl font-bold mt-6 border-t border-white/30 pt-6">
                  This is universal adaptivity through CRUD operations on ActionLanguage.
                </p>
              </div>
            </section>

            {/* End-to-End Example */}
            <section id="example">
              <h2 className="text-3xl font-bold mt-12 mb-6">End-to-End Example</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Let's see the complete CRUD pipeline in action with a real accessibility issue:
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 1: CREATE (Parse)</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Input JavaScript:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Modal with focus trap but no Escape key
const modal = document.getElementById('modal');
const firstBtn = modal.querySelector('button:first-child');
const lastBtn = modal.querySelector('button:last-child');

modal.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstBtn) {
      event.preventDefault();
      lastBtn.focus();
    } else if (!event.shiftKey && document.activeElement === lastBtn) {
      event.preventDefault();
      firstBtn.focus();
    }
  }
});`}</code></pre>
              </div>

              <div className="bg-paradise-green/5 rounded-lg p-6 border border-paradise-green my-6">
                <p className="font-semibold mb-3">ActionLanguage (simplified):</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`[
  { id: "1", actionType: "querySelector", selector: "modal", binding: "modal" },
  { id: "2", actionType: "querySelector", context: "modal", selector: "button:first-child", binding: "firstBtn" },
  { id: "3", actionType: "querySelector", context: "modal", selector: "button:last-child", binding: "lastBtn" },
  {
    id: "4",
    actionType: "eventHandler",
    event: "keydown",
    element: { binding: "modal" },
    handler: {
      body: [
        // Tab key handling logic
        { actionType: "conditional", condition: { key: "Tab" }, ... },
        { actionType: "focusElement", element: { binding: "lastBtn" } },
        { actionType: "focusElement", element: { binding: "firstBtn" } }
      ]
    }
  }
]`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 2: READ (Analyze)</h3>

              <div className="bg-paradise-blue/5 rounded-lg p-6 border border-paradise-blue my-6">
                <p className="font-semibold mb-3">KeyboardAnalyzer detects:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`{
  type: "missing-escape-handler",
  severity: "error",
  wcag: ["2.1.2"],
  node: { id: "4" },
  message: "Focus trap without Escape key handler",
  context: {
    trapElement: { binding: "modal" },
    hasTabTrap: true,
    hasEscapeHandler: false  // ← The problem!
  }
}`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 3: UPDATE (Apply Fix)</h3>

              <div className="bg-paradise-orange/5 rounded-lg p-6 border border-paradise-orange my-6">
                <p className="font-semibold mb-3">Fix generator adds Escape handler:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Modified handler.body with Escape added
{
  actionType: "conditional",
  condition: { key: "Escape" },
  consequent: [
    { actionType: "call", name: "closeModal" },
    {
      actionType: "focusElement",
      element: { binding: "previousFocusedElement" }
    }
  ]
}

// New ActionLanguage node inserted into tree!`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 4: DELETE (Optimize)</h3>

              <div className="bg-paradise-purple/5 rounded-lg p-6 border border-paradise-purple my-6">
                <p className="font-semibold mb-3">No optimizations needed (tree is clean)</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// DELETE pass checks for:
// - Unused bindings: All are used ✓
// - Unreachable code: None found ✓
// - Duplicates: None found ✓

// Tree passes through unchanged`}</code></pre>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Step 5: GENERATE (Code Generation)</h3>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 my-6">
                <p className="font-semibold mb-3">Output JavaScript:</p>
                <pre className="text-sm bg-white p-4 rounded border border-gray-200 overflow-x-auto"><code>{`// Modal with focus trap AND Escape key! ✓
const modal = document.getElementById('modal');
const firstBtn = modal.querySelector('button:first-child');
const lastBtn = modal.querySelector('button:last-child');

modal.addEventListener('keydown', function(event) {
  // NEW: Escape key handler
  if (event.key === 'Escape') {
    closeModal();
    if (previousFocusedElement) {
      previousFocusedElement.focus();
    }
  }

  // Existing: Tab trap
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstBtn) {
      event.preventDefault();
      lastBtn.focus();
    } else if (!event.shiftKey && document.activeElement === lastBtn) {
      event.preventDefault();
      firstBtn.focus();
    }
  }
});`}</code></pre>
              </div>

              <div className="bg-paradise-green/10 border-l-4 border-paradise-green p-6 rounded-r-lg my-8">
                <p className="text-lg font-semibold text-paradise-green mb-2">Issue Fixed!</p>
                <p className="text-gray-700 mb-0">
                  The exact same process works for Objective-C, Kotlin, Swift, or any language with
                  CREATE and GENERATE functions. The core logic (READ, UPDATE, DELETE) never changes.
                </p>
              </div>
            </section>

            {/* Conclusion */}
            <section id="conclusion">
              <h2 className="text-3xl font-bold mt-12 mb-6">Conclusion: Why CRUD Matters</h2>

              <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-lg p-8 my-8">
                <h3 className="text-2xl font-bold mb-4">The Power of Intermediate Representations</h3>
                <p className="text-lg mb-6">
                  By treating ActionLanguage as a database and applying CRUD operations, Paradise
                  achieves what would be impossible with traditional approaches:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-2">Without CRUD (Traditional)</h4>
                    <ul className="space-y-2 text-sm">
                      <li>❌ Separate analyzers per language</li>
                      <li>❌ Separate fixes per language</li>
                      <li>❌ Updates require changing all codebases</li>
                      <li>❌ New language = months of work</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">With CRUD (Paradise)</h4>
                    <ul className="space-y-2 text-sm">
                      <li>✓ One set of analyzers for all languages</li>
                      <li>✓ One set of fixes for all languages</li>
                      <li>✓ Updates automatically work everywhere</li>
                      <li>✓ New language = 2 functions (days of work)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 my-12 not-prose">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-semibold text-lg mb-2">Scalable</h4>
                  <p className="text-sm text-gray-600">
                    Add one language, get decades of accessibility expertise instantly
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">🔬</div>
                  <h4 className="font-semibold text-lg mb-2">Maintainable</h4>
                  <p className="text-sm text-gray-600">
                    Fix a bug once, it's fixed for every language
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-3xl mb-3">🌍</div>
                  <h4 className="font-semibold text-lg mb-2">Future-Proof</h4>
                  <p className="text-sm text-gray-600">
                    New UI frameworks and languages automatically supported
                  </p>
                </div>
              </div>

              <div className="bg-paradise-orange/10 border-l-4 border-paradise-orange p-6 rounded-r-lg my-8">
                <p className="text-2xl font-semibold text-paradise-orange mb-3">
                  This is why Paradise doesn't need AI.
                </p>
                <p className="text-gray-700 text-lg mb-0">
                  CRUD operations on a well-designed intermediate representation solve the problem
                  elegantly, deterministically, and universally. No training data. No probabilistic
                  inference. Just clean software architecture.
                </p>
              </div>
            </section>

            {/* Module Complete */}
            <div className="bg-gradient-to-r from-paradise-green via-paradise-blue via-paradise-orange to-paradise-purple text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-3">Module 3 Complete! 🎉</h3>
              <p className="text-lg mb-6">
                You now understand the core of Paradise: how CRUD operations on ActionLanguage
                enable universal adaptivity. You've seen the complete pipeline from source code
                to fixed code, and how it works identically for any language.
              </p>
              <div className="flex gap-4">
                <a href="/learn-actionlanguage/module-4" className="bg-white text-paradise-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Continue to Module 4
                </a>
                <a href="/learn-actionlanguage" className="bg-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-paradise-purple/90 transition-colors border-2 border-white">
                  Back to Overview
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
