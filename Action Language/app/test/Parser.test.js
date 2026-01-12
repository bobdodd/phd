/**
 * Tests for JavaScriptParser and ASTTransformer
 */

const { JavaScriptParser, ParseError } = require('../src/parser/JavaScriptParser');
const ASTTransformer = require('../src/parser/ASTTransformer');
const { parseAndTransform } = require('../src/parser');
const Action = require('../src/action-language/Action');

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
    throw new Error(`${message} Expected "${expected}", got "${actual}"`);
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

function assertThrows(fn, message = '') {
  try {
    fn();
    throw new Error(message || 'Expected function to throw');
  } catch (e) {
    if (e.message === message || e.message === 'Expected function to throw') {
      throw e;
    }
  }
}

console.log('\nParser Tests\n' + '='.repeat(40));

Action.resetIdCounter();

// === JavaScriptParser Tests ===
console.log('\n  JavaScriptParser');

test('parses simple variable declaration', () => {
  const ast = JavaScriptParser.parse('const x = 10;');
  assertEqual(ast.type, 'File');
  assertEqual(ast.program.body.length, 1);
  assertEqual(ast.program.body[0].type, 'VariableDeclaration');
});

test('parses function declaration', () => {
  const ast = JavaScriptParser.parse('function add(a, b) { return a + b; }');
  assertEqual(ast.program.body[0].type, 'FunctionDeclaration');
  assertEqual(ast.program.body[0].id.name, 'add');
});

test('parses arrow function', () => {
  const ast = JavaScriptParser.parse('const fn = (x) => x * 2;');
  const declarator = ast.program.body[0].declarations[0];
  assertEqual(declarator.init.type, 'ArrowFunctionExpression');
});

test('parses class declaration', () => {
  const ast = JavaScriptParser.parse('class MyClass { constructor() {} }');
  assertEqual(ast.program.body[0].type, 'ClassDeclaration');
  assertEqual(ast.program.body[0].id.name, 'MyClass');
});

test('parses ES6 imports', () => {
  const ast = JavaScriptParser.parse('import { foo } from "module";');
  assertEqual(ast.program.body[0].type, 'ImportDeclaration');
});

test('parses async/await', () => {
  const ast = JavaScriptParser.parse('async function fetch() { await getData(); }');
  assertEqual(ast.program.body[0].async, true);
});

test('parses JSX', () => {
  const ast = JavaScriptParser.parse('const elem = <div>Hello</div>;');
  assertTrue(ast.program.body.length > 0);
});

test('parseExpression parses expression only', () => {
  const expr = JavaScriptParser.parseExpression('a + b * c');
  assertEqual(expr.type, 'BinaryExpression');
});

test('validate returns valid for good code', () => {
  const result = JavaScriptParser.validate('const x = 1;');
  assertTrue(result.valid);
  assertEqual(result.errors.length, 0);
});

test('validate returns errors for bad code', () => {
  const result = JavaScriptParser.validate('const = ;');
  assertFalse(result.valid);
  assertTrue(result.errors.length > 0);
});

test('extractFunctions finds function declarations', () => {
  const functions = JavaScriptParser.extractFunctions(`
    function foo() {}
    const bar = () => {};
    class C { method() {} }
  `);
  assertTrue(functions.length >= 2);
  assertEqual(functions[0].name, 'foo');
});

test('walkAST visits all nodes', () => {
  const ast = JavaScriptParser.parse('const x = 1 + 2;');
  const types = [];
  JavaScriptParser.walkAST(ast, (node) => {
    types.push(node.type);
  });
  assertTrue(types.includes('VariableDeclaration'));
  assertTrue(types.includes('BinaryExpression'));
  assertTrue(types.includes('NumericLiteral'));
});

test('describeNodeType returns human-readable description', () => {
  assertEqual(JavaScriptParser.describeNodeType('FunctionDeclaration'), 'Function Declaration');
  assertEqual(JavaScriptParser.describeNodeType('IfStatement'), 'If Statement');
});

// === ASTTransformer Tests ===
console.log('\n  ASTTransformer - Declarations');

test('transforms variable declaration (let)', () => {
  const tree = parseAndTransform('let x = 10;');
  assertEqual(tree.root.actionType, 'program');
  const decl = tree.root.children[0];
  assertEqual(decl.actionType, 'declareVar');
  assertEqual(decl.getAttribute('name'), 'x');
  assertEqual(decl.getAttribute('kind'), 'let');
});

test('transforms variable declaration (const)', () => {
  const tree = parseAndTransform('const PI = 3.14;');
  const decl = tree.root.children[0];
  assertEqual(decl.actionType, 'declareConst');
  assertEqual(decl.getAttribute('name'), 'PI');
});

test('transforms multiple declarations', () => {
  const tree = parseAndTransform('let a = 1, b = 2;');
  // Should be a seq with two declarations
  const seq = tree.root.children[0];
  assertTrue(seq.children.length === 2 || seq.actionType === 'declareVar');
});

test('transforms function declaration', () => {
  const tree = parseAndTransform('function greet(name) { return "Hello " + name; }');
  const fn = tree.root.children[0];
  assertEqual(fn.actionType, 'declareFunction');
  assertEqual(fn.getAttribute('name'), 'greet');
  // Should have param and body
  assertTrue(fn.children.length >= 2);
});

test('transforms async function', () => {
  const tree = parseAndTransform('async function fetchData() {}');
  const fn = tree.root.children[0];
  assertEqual(fn.getAttribute('async'), true);
});

test('transforms generator function', () => {
  const tree = parseAndTransform('function* gen() { yield 1; }');
  const fn = tree.root.children[0];
  assertEqual(fn.getAttribute('generator'), true);
});

test('transforms class declaration', () => {
  const tree = parseAndTransform('class Animal { constructor(name) { this.name = name; } }');
  const cls = tree.root.children[0];
  assertEqual(cls.actionType, 'declareClass');
  assertEqual(cls.getAttribute('name'), 'Animal');
});

console.log('\n  ASTTransformer - Control Flow');

test('transforms if statement', () => {
  const tree = parseAndTransform('if (x > 0) { y = 1; }');
  const ifStmt = tree.root.children[0];
  assertEqual(ifStmt.actionType, 'if');
  // Should have condition and then branch
  assertTrue(ifStmt.children.some(c => c.getAttribute('role') === 'condition'));
  assertTrue(ifStmt.children.some(c => c.getAttribute('role') === 'then'));
});

test('transforms if-else statement', () => {
  const tree = parseAndTransform('if (x) { a(); } else { b(); }');
  const ifStmt = tree.root.children[0];
  assertTrue(ifStmt.children.some(c => c.getAttribute('role') === 'else'));
});

test('transforms for loop', () => {
  const tree = parseAndTransform('for (let i = 0; i < 10; i++) { console.log(i); }');
  const forStmt = tree.root.children[0];
  assertEqual(forStmt.actionType, 'for');
  assertTrue(forStmt.children.some(c => c.getAttribute('role') === 'init'));
  assertTrue(forStmt.children.some(c => c.getAttribute('role') === 'test'));
  assertTrue(forStmt.children.some(c => c.getAttribute('role') === 'update'));
  assertTrue(forStmt.children.some(c => c.getAttribute('role') === 'body'));
});

test('transforms for-in loop', () => {
  const tree = parseAndTransform('for (const key in obj) { console.log(key); }');
  const forIn = tree.root.children[0];
  assertEqual(forIn.actionType, 'forIn');
});

test('transforms for-of loop', () => {
  const tree = parseAndTransform('for (const item of array) { process(item); }');
  const forOf = tree.root.children[0];
  assertEqual(forOf.actionType, 'forOf');
});

test('transforms while loop', () => {
  const tree = parseAndTransform('while (running) { tick(); }');
  const whileStmt = tree.root.children[0];
  assertEqual(whileStmt.actionType, 'while');
});

test('transforms do-while loop', () => {
  const tree = parseAndTransform('do { process(); } while (hasMore);');
  const doWhile = tree.root.children[0];
  assertEqual(doWhile.actionType, 'doWhile');
});

test('transforms switch statement', () => {
  const tree = parseAndTransform(`
    switch (action) {
      case 'start': begin(); break;
      case 'stop': end(); break;
      default: nothing();
    }
  `);
  const switchStmt = tree.root.children[0];
  assertEqual(switchStmt.actionType, 'switch');
  assertTrue(switchStmt.children.some(c => c.actionType === 'case'));
  assertTrue(switchStmt.children.some(c => c.actionType === 'default'));
});

test('transforms try-catch', () => {
  const tree = parseAndTransform('try { risky(); } catch (e) { handle(e); }');
  const tryStmt = tree.root.children[0];
  assertEqual(tryStmt.actionType, 'try');
  assertTrue(tryStmt.children.some(c => c.actionType === 'catch'));
});

test('transforms try-catch-finally', () => {
  const tree = parseAndTransform('try { risky(); } catch (e) { handle(e); } finally { cleanup(); }');
  const tryStmt = tree.root.children[0];
  assertTrue(tryStmt.children.some(c => c.actionType === 'finally'));
});

console.log('\n  ASTTransformer - Expressions');

test('transforms function call', () => {
  const tree = parseAndTransform('console.log("hello");');
  const call = tree.root.children[0];
  assertEqual(call.actionType, 'call');
  assertEqual(call.getAttribute('callee'), 'console.log');
});

test('transforms new expression', () => {
  const tree = parseAndTransform('new Date()');
  const newExpr = tree.root.children[0];
  assertEqual(newExpr.actionType, 'new');
});

test('transforms member access', () => {
  const tree = parseAndTransform('obj.property');
  const member = tree.root.children[0];
  assertEqual(member.actionType, 'memberAccess');
  assertEqual(member.getAttribute('property'), 'property');
});

test('transforms computed member access', () => {
  const tree = parseAndTransform('obj["key"]');
  const member = tree.root.children[0];
  assertEqual(member.getAttribute('computed'), true);
});

test('transforms assignment', () => {
  const tree = parseAndTransform('x = 10;');
  const assign = tree.root.children[0];
  assertEqual(assign.actionType, 'assign');
  assertEqual(assign.getAttribute('operator'), '=');
});

test('transforms binary expression', () => {
  const tree = parseAndTransform('a + b');
  const binary = tree.root.children[0];
  assertEqual(binary.actionType, 'binaryOp');
  assertEqual(binary.getAttribute('operator'), '+');
});

test('transforms logical expression', () => {
  const tree = parseAndTransform('a && b');
  const logical = tree.root.children[0];
  assertEqual(logical.actionType, 'logicalOp');
  assertEqual(logical.getAttribute('operator'), '&&');
});

test('transforms conditional (ternary)', () => {
  const tree = parseAndTransform('x ? a : b');
  const cond = tree.root.children[0];
  assertEqual(cond.actionType, 'conditional');
});

test('transforms await expression', () => {
  const tree = parseAndTransform('async function f() { await promise; }');
  const fn = tree.root.children[0];
  // Find await in the body
  let foundAwait = false;
  fn.traverse(a => { if (a.actionType === 'await') foundAwait = true; });
  assertTrue(foundAwait);
});

console.log('\n  ASTTransformer - Functions');

test('transforms arrow function', () => {
  const tree = parseAndTransform('const fn = (x) => x * 2;');
  const decl = tree.root.children[0];
  const arrow = decl.children[0];
  assertEqual(arrow.actionType, 'arrowFunction');
});

test('transforms function expression', () => {
  const tree = parseAndTransform('const fn = function named() {};');
  const decl = tree.root.children[0];
  const fnExpr = decl.children[0];
  assertEqual(fnExpr.actionType, 'functionExpr');
});

console.log('\n  ASTTransformer - Literals');

test('transforms string literal', () => {
  const tree = parseAndTransform('const s = "hello";');
  const decl = tree.root.children[0];
  const lit = decl.children[0]; // The initializer
  assertEqual(lit.actionType, 'literal');
  assertEqual(lit.getAttribute('type'), 'string');
});

test('transforms number literal', () => {
  const tree = parseAndTransform('42');
  const lit = tree.root.children[0];
  assertEqual(lit.getAttribute('type'), 'number');
});

test('transforms boolean literal', () => {
  const tree = parseAndTransform('true');
  const lit = tree.root.children[0];
  assertEqual(lit.getAttribute('type'), 'boolean');
});

test('transforms array expression', () => {
  const tree = parseAndTransform('[1, 2, 3]');
  const arr = tree.root.children[0];
  assertEqual(arr.actionType, 'array');
  assertEqual(arr.children.length, 3);
});

test('transforms object expression', () => {
  const tree = parseAndTransform('({ a: 1, b: 2 })');
  const obj = tree.root.children[0];
  assertEqual(obj.actionType, 'object');
});

test('transforms template literal', () => {
  const tree = parseAndTransform('`Hello ${name}!`');
  const template = tree.root.children[0];
  assertEqual(template.actionType, 'template');
});

console.log('\n  ASTTransformer - Modules');

test('transforms import declaration', () => {
  const tree = parseAndTransform('import { foo, bar } from "module";');
  const imp = tree.root.children[0];
  assertEqual(imp.actionType, 'import');
  assertEqual(imp.getAttribute('source'), 'module');
});

test('transforms export declaration', () => {
  const tree = parseAndTransform('export const x = 10;');
  const exp = tree.root.children[0];
  assertEqual(exp.actionType, 'export');
});

test('transforms default export', () => {
  const tree = parseAndTransform('export default function() {}');
  const exp = tree.root.children[0];
  assertEqual(exp.actionType, 'exportDefault');
});

console.log('\n  ASTTransformer - Accessibility Patterns');

test('detects addEventListener pattern', () => {
  const tree = parseAndTransform('element.addEventListener("click", handler);');
  const call = tree.root.children[0];
  assertEqual(call.getAttribute('pattern'), 'eventHandler');
});

test('detects DOM access pattern', () => {
  const tree = parseAndTransform('document.getElementById("myId");');
  const call = tree.root.children[0];
  assertEqual(call.getAttribute('pattern'), 'domAccess');
});

test('detects setTimeout pattern', () => {
  const tree = parseAndTransform('setTimeout(callback, 1000);');
  const call = tree.root.children[0];
  assertEqual(call.getAttribute('pattern'), 'timer');
});

test('detects focus operation', () => {
  const tree = parseAndTransform('element.focus();');
  const call = tree.root.children[0];
  assertEqual(call.getAttribute('pattern'), 'focusOp');
});

console.log('\n  ASTTransformer - Source Location');

test('includes line numbers', () => {
  const tree = parseAndTransform('const x = 1;\nconst y = 2;');
  const first = tree.root.children[0];
  const second = tree.root.children[1];
  assertEqual(first.getAttribute('line'), 1);
  assertEqual(second.getAttribute('line'), 2);
});

test('includes source positions', () => {
  const tree = parseAndTransform('const x = 1;');
  const decl = tree.root.children[0];
  assertTrue(decl.getAttribute('sourceStart') !== undefined);
  assertTrue(decl.getAttribute('sourceEnd') !== undefined);
});

console.log('\n  Integration');

test('full round-trip: JS -> ActionTree -> XML -> ActionTree', () => {
  const XMLSerializer = require('../src/action-language/XMLSerializer');

  const source = `
    function greet(name) {
      if (name) {
        console.log("Hello, " + name);
      } else {
        console.log("Hello, World");
      }
    }
  `;

  // Parse JS to ActionTree
  const tree1 = parseAndTransform(source);

  // Serialize to XML
  const xml = XMLSerializer.serialize(tree1);

  // Deserialize back to ActionTree
  const tree2 = XMLSerializer.deserialize(xml);

  // Verify structure preserved
  assertEqual(tree2.root.actionType, 'program');
  assertTrue(tree2.root.children.length > 0);

  // Find the function
  const fn = tree2.findByType('declareFunction')[0];
  assertTrue(fn !== undefined);
});

console.log('\n' + '='.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);

process.exit(failed > 0 ? 1 : 0);
