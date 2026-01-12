/**
 * JavaScriptGenerator Tests
 *
 * Tests for code generation from ActionLanguage trees
 */

const JavaScriptGenerator = require('../src/transformer/JavaScriptGenerator');
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

function assertContains(str, substr, message = '') {
  if (!str.includes(substr)) {
    throw new Error(message || `Expected "${str}" to contain "${substr}"`);
  }
}

/**
 * Helper to do round-trip: JS -> ActionTree -> JS
 */
function roundTrip(code) {
  const tree = parseAndTransform(code);
  const generator = new JavaScriptGenerator();
  return generator.generate(tree);
}

/**
 * Helper to normalize whitespace for comparison
 */
function normalize(code) {
  return code.replace(/\s+/g, ' ').trim();
}

console.log('\nJavaScriptGenerator Tests');
console.log('========================================');

// === Basic Generator Tests ===
console.log('\n  Basic Generation');

test('creates generator with default options', () => {
  const gen = new JavaScriptGenerator();
  assertEqual(gen.options.indentSize, 2);
  assertEqual(gen.options.useSemicolons, true);
});

test('creates generator with custom options', () => {
  const gen = new JavaScriptGenerator({ indentSize: 4, useSemicolons: false });
  assertEqual(gen.options.indentSize, 4);
  assertEqual(gen.options.useSemicolons, false);
});

test('generates empty string for null tree', () => {
  const gen = new JavaScriptGenerator();
  assertEqual(gen.generate(null), '');
});

// === Literals ===
console.log('\n  Literals');

test('generates number literal', () => {
  const result = roundTrip('42');
  assertContains(result, '42');
});

test('generates string literal', () => {
  // Use parentheses to prevent Babel from treating as directive
  const result = roundTrip('("hello")');
  assertContains(result, '"hello"');
});

test('generates boolean true', () => {
  const result = roundTrip('true');
  assertContains(result, 'true');
});

test('generates boolean false', () => {
  const result = roundTrip('false');
  assertContains(result, 'false');
});

test('generates null', () => {
  const result = roundTrip('null');
  assertContains(result, 'null');
});

test('generates array literal', () => {
  const result = roundTrip('[1, 2, 3]');
  assertContains(result, '[1, 2, 3]');
});

test('generates object literal', () => {
  const result = roundTrip('({ a: 1, b: 2 })');
  assertContains(result, 'a:');
  assertContains(result, 'b:');
});

test('generates template literal', () => {
  const result = roundTrip('`hello ${name}`');
  assertContains(result, '`hello ${');
});

// === Variables ===
console.log('\n  Variables');

test('generates let declaration', () => {
  const result = roundTrip('let x = 5');
  assertContains(result, 'let x = 5');
});

test('generates const declaration', () => {
  const result = roundTrip('const y = 10');
  assertContains(result, 'const y = 10');
});

test('generates var declaration', () => {
  const result = roundTrip('var z = 15');
  assertContains(result, 'var z = 15');
});

test('generates uninitialized variable', () => {
  const result = roundTrip('let x');
  assertContains(result, 'let x');
});

// === Functions ===
console.log('\n  Functions');

test('generates function declaration', () => {
  const result = roundTrip('function foo(a, b) { return a + b; }');
  assertContains(result, 'function foo(a, b)');
  assertContains(result, 'return');
});

test('generates async function', () => {
  const result = roundTrip('async function fetchData() { return await fetch(url); }');
  assertContains(result, 'async function');
});

test('generates arrow function', () => {
  const result = roundTrip('const add = (a, b) => a + b');
  assertContains(result, '=>');
});

test('generates arrow function with block', () => {
  const result = roundTrip('const fn = (x) => { return x * 2; }');
  assertContains(result, '=>');
  assertContains(result, 'return');
});

test('generates function expression', () => {
  const result = roundTrip('const fn = function(x) { return x; }');
  assertContains(result, 'function');
});

// === Control Flow ===
console.log('\n  Control Flow');

test('generates if statement', () => {
  const result = roundTrip('if (x > 0) { y = 1; }');
  assertContains(result, 'if (');
  assertContains(result, 'x > 0');
});

test('generates if-else statement', () => {
  const result = roundTrip('if (x > 0) { y = 1; } else { y = 0; }');
  assertContains(result, 'if (');
  assertContains(result, 'else');
});

test('generates for loop', () => {
  const result = roundTrip('for (let i = 0; i < 10; i++) { console.log(i); }');
  assertContains(result, 'for (');
  assertContains(result, 'i < 10');
});

test('generates for-in loop', () => {
  const result = roundTrip('for (const key in obj) { console.log(key); }');
  assertContains(result, 'for (');
  assertContains(result, ' in ');
});

test('generates for-of loop', () => {
  const result = roundTrip('for (const item of arr) { console.log(item); }');
  assertContains(result, 'for (');
  assertContains(result, ' of ');
});

test('generates while loop', () => {
  const result = roundTrip('while (x > 0) { x--; }');
  assertContains(result, 'while (');
});

test('generates do-while loop', () => {
  const result = roundTrip('do { x++; } while (x < 10)');
  assertContains(result, 'do {');
  assertContains(result, 'while (');
});

test('generates switch statement', () => {
  const result = roundTrip('switch (x) { case 1: break; default: break; }');
  assertContains(result, 'switch (');
  assertContains(result, 'case 1:');
  assertContains(result, 'default:');
});

test('generates break statement', () => {
  const result = roundTrip('while(true) { break; }');
  assertContains(result, 'break');
});

test('generates continue statement', () => {
  const result = roundTrip('while(true) { continue; }');
  assertContains(result, 'continue');
});

// === Try-Catch ===
console.log('\n  Try-Catch');

test('generates try-catch', () => {
  const result = roundTrip('try { x(); } catch (e) { console.log(e); }');
  assertContains(result, 'try {');
  assertContains(result, 'catch (e)');
});

test('generates try-catch-finally', () => {
  const result = roundTrip('try { x(); } catch (e) { } finally { cleanup(); }');
  assertContains(result, 'try {');
  assertContains(result, 'catch');
  assertContains(result, 'finally {');
});

test('generates throw statement', () => {
  const result = roundTrip('throw new Error("oops")');
  assertContains(result, 'throw');
  assertContains(result, 'Error');
});

// === Expressions ===
console.log('\n  Expressions');

test('generates binary expression', () => {
  const result = roundTrip('const sum = a + b');
  assertContains(result, 'a + b');
});

test('generates comparison', () => {
  const result = roundTrip('const test = x === y');
  assertContains(result, '===');
});

test('generates logical expression', () => {
  const result = roundTrip('const test = a && b');
  assertContains(result, '&&');
});

test('generates ternary expression', () => {
  const result = roundTrip('const val = x > 0 ? 1 : 0');
  assertContains(result, '?');
  assertContains(result, ':');
});

test('generates unary expression', () => {
  const result = roundTrip('const neg = -x');
  assertContains(result, '-');
});

test('generates typeof', () => {
  const result = roundTrip('typeof x');
  assertContains(result, 'typeof');
});

test('generates increment', () => {
  const result = roundTrip('x++');
  assertContains(result, '++');
});

test('generates assignment', () => {
  const result = roundTrip('x = 5');
  assertContains(result, 'x = 5');
});

test('generates compound assignment', () => {
  const result = roundTrip('x += 5');
  assertContains(result, '+=');
});

// === Member Access ===
console.log('\n  Member Access');

test('generates dot notation', () => {
  const result = roundTrip('obj.prop');
  assertContains(result, 'obj.prop');
});

test('generates bracket notation', () => {
  const result = roundTrip('obj["prop"]');
  assertContains(result, 'obj[');
});

test('generates method call', () => {
  const result = roundTrip('obj.method(arg)');
  assertContains(result, 'obj.method(');
});

test('generates chained access', () => {
  const result = roundTrip('a.b.c.d');
  assertContains(result, 'a.b.c.d');
});

// === Classes ===
console.log('\n  Classes');

test('generates class declaration', () => {
  const result = roundTrip('class Foo { constructor() {} }');
  assertContains(result, 'class Foo');
  assertContains(result, 'constructor');
});

test('generates class with extends', () => {
  const result = roundTrip('class Bar extends Foo { }');
  assertContains(result, 'class Bar extends Foo');
});

test('generates class method', () => {
  const result = roundTrip('class Foo { myMethod() { return 1; } }');
  assertContains(result, 'myMethod()');
});

test('generates static method', () => {
  const result = roundTrip('class Foo { static create() { return new Foo(); } }');
  assertContains(result, 'static');
});

// === New Expression ===
console.log('\n  New Expression');

test('generates new expression', () => {
  const result = roundTrip('new Date()');
  assertContains(result, 'new Date()');
});

test('generates new with arguments', () => {
  const result = roundTrip('new Error("message")');
  assertContains(result, 'new Error(');
});

// === Spread/Rest ===
console.log('\n  Spread/Rest');

test('generates array spread', () => {
  const result = roundTrip('[...arr]');
  assertContains(result, '...arr');
});

test('generates object spread', () => {
  const result = roundTrip('({ ...obj })');
  assertContains(result, '...');
});

// === Modules ===
console.log('\n  Modules');

test('generates import', () => {
  const result = roundTrip('import { foo } from "module"');
  assertContains(result, 'import');
  assertContains(result, 'from');
});

test('generates default import', () => {
  const result = roundTrip('import foo from "module"');
  assertContains(result, 'import foo');
});

test('generates namespace import', () => {
  const result = roundTrip('import * as mod from "module"');
  assertContains(result, '* as');
});

test('generates export', () => {
  const result = roundTrip('export const x = 5');
  assertContains(result, 'export');
});

test('generates export default', () => {
  const result = roundTrip('export default function() {}');
  assertContains(result, 'export default');
});

// === Round-trip Tests ===
console.log('\n  Round-trip (JS → ActionTree → JS)');

test('round-trip preserves simple function', () => {
  const original = 'function add(a, b) { return a + b; }';
  const result = roundTrip(original);
  assertContains(result, 'function add');
  assertContains(result, 'return a + b');
});

test('round-trip preserves arrow function', () => {
  const original = 'const multiply = (x, y) => x * y';
  const result = roundTrip(original);
  assertContains(result, '=>');
  assertContains(result, 'x * y');
});

test('round-trip preserves class', () => {
  const original = 'class Calculator { add(a, b) { return a + b; } }';
  const result = roundTrip(original);
  assertContains(result, 'class Calculator');
  assertContains(result, 'add(');
});

test('round-trip preserves control flow', () => {
  const original = 'if (x > 0) { return true; } else { return false; }';
  const result = roundTrip(original);
  assertContains(result, 'if (');
  assertContains(result, 'else');
});

test('round-trip preserves complex expression', () => {
  const original = 'const result = a + b * c - d / e';
  const result = roundTrip(original);
  assertContains(result, 'a +');
  assertContains(result, 'b *');
});

// === Formatting Tests ===
console.log('\n  Formatting Options');

test('respects indentSize option', () => {
  const tree = parseAndTransform('function f() { return 1; }');
  const gen4 = new JavaScriptGenerator({ indentSize: 4 });
  const result = gen4.generate(tree);
  assertContains(result, '    '); // 4 spaces
});

test('respects useSemicolons: false', () => {
  const tree = parseAndTransform('const x = 5');
  const genNoSemi = new JavaScriptGenerator({ useSemicolons: false });
  const result = genNoSemi.generate(tree);
  assertTrue(!result.endsWith(';'), 'Should not end with semicolon');
});

// === DOM/Accessibility Related ===
console.log('\n  DOM/Accessibility Patterns');

test('generates addEventListener', () => {
  const result = roundTrip('button.addEventListener("click", handler)');
  assertContains(result, 'addEventListener');
  assertContains(result, '"click"');
});

test('generates setAttribute', () => {
  const result = roundTrip('element.setAttribute("aria-expanded", "true")');
  assertContains(result, 'setAttribute');
  assertContains(result, 'aria-expanded');
});

test('generates focus call', () => {
  const result = roundTrip('element.focus()');
  assertContains(result, '.focus()');
});

test('generates getElementById', () => {
  const result = roundTrip('document.getElementById("myId")');
  assertContains(result, 'getElementById');
});

test('generates querySelector', () => {
  const result = roundTrip('document.querySelector(".myClass")');
  assertContains(result, 'querySelector');
});

test('generates setTimeout', () => {
  const result = roundTrip('setTimeout(callback, 1000)');
  assertContains(result, 'setTimeout');
});

// === Re-execution Test ===
console.log('\n  Re-execution');

test('generated code can be re-parsed', () => {
  const original = 'function test(x) { return x * 2; }';
  const generated = roundTrip(original);
  // Should be able to parse the generated code again
  const tree2 = parseAndTransform(generated);
  assertTrue(tree2.root !== null, 'Generated code should be parseable');
});

test('double round-trip produces consistent output', () => {
  const original = 'const add = (a, b) => a + b';
  const firstPass = roundTrip(original);
  const secondPass = roundTrip(firstPass);
  // After first normalization, should be stable
  assertEqual(normalize(firstPass), normalize(secondPass));
});

// Print results
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
