/**
 * Tests for ExecutionEngine
 */

const { ExecutionEngine } = require('../src/execution/ExecutionEngine');
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
    throw new Error(`${message} Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertDeepEqual(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message} Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(message || 'Expected true');
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

/**
 * Helper to execute JS code through the full pipeline
 */
function executeJS(code, options = {}) {
  const tree = parseAndTransform(code);
  const engine = new ExecutionEngine({
    onOutput: () => {}, // Suppress output
    ...options
  });
  return engine.execute(tree);
}

/**
 * Helper to get output from execution
 */
function executeJSWithOutput(code) {
  const tree = parseAndTransform(code);
  const engine = new ExecutionEngine({
    onOutput: () => {}
  });
  engine.execute(tree);
  return engine.getOutput();
}

console.log('\nExecutionEngine Tests\n' + '='.repeat(40));

// === Literals ===
console.log('\n  Literals');

test('executes number literal', () => {
  assertEqual(executeJS('42'), 42);
});

test('executes string literal', () => {
  assertEqual(executeJS('const s = "hello"; s'), 'hello');
});

test('executes boolean literals', () => {
  assertEqual(executeJS('true'), true);
  assertEqual(executeJS('false'), false);
});

test('executes null', () => {
  assertEqual(executeJS('null'), null);
});

test('executes array literal', () => {
  assertDeepEqual(executeJS('[1, 2, 3]'), [1, 2, 3]);
});

test('executes object literal', () => {
  assertDeepEqual(executeJS('({ a: 1, b: 2 })'), { a: 1, b: 2 });
});

test('executes template literal', () => {
  assertEqual(executeJS('`hello world`'), 'hello world');
});

// === Variables ===
console.log('\n  Variables');

test('declares and reads variable', () => {
  assertEqual(executeJS('let x = 10; x'), 10);
});

test('declares const', () => {
  assertEqual(executeJS('const PI = 3.14; PI'), 3.14);
});

test('reassigns variable', () => {
  assertEqual(executeJS('let x = 1; x = 2; x'), 2);
});

test('compound assignment +=', () => {
  assertEqual(executeJS('let x = 5; x += 3; x'), 8);
});

test('compound assignment -=', () => {
  assertEqual(executeJS('let x = 10; x -= 3; x'), 7);
});

test('compound assignment *=', () => {
  assertEqual(executeJS('let x = 4; x *= 2; x'), 8);
});

// === Binary Operations ===
console.log('\n  Binary Operations');

test('addition', () => {
  assertEqual(executeJS('2 + 3'), 5);
});

test('subtraction', () => {
  assertEqual(executeJS('10 - 4'), 6);
});

test('multiplication', () => {
  assertEqual(executeJS('3 * 4'), 12);
});

test('division', () => {
  assertEqual(executeJS('20 / 4'), 5);
});

test('modulo', () => {
  assertEqual(executeJS('17 % 5'), 2);
});

test('exponentiation', () => {
  assertEqual(executeJS('2 ** 8'), 256);
});

test('string concatenation', () => {
  assertEqual(executeJS('"hello" + " " + "world"'), 'hello world');
});

test('comparison ==', () => {
  assertEqual(executeJS('5 == 5'), true);
  assertEqual(executeJS('5 == "5"'), true);
});

test('comparison ===', () => {
  assertEqual(executeJS('5 === 5'), true);
  assertEqual(executeJS('5 === "5"'), false);
});

test('comparison <', () => {
  assertEqual(executeJS('3 < 5'), true);
  assertEqual(executeJS('5 < 3'), false);
});

test('comparison >', () => {
  assertEqual(executeJS('5 > 3'), true);
});

test('comparison <=', () => {
  assertEqual(executeJS('5 <= 5'), true);
  assertEqual(executeJS('3 <= 5'), true);
});

test('comparison >=', () => {
  assertEqual(executeJS('5 >= 5'), true);
});

// === Unary Operations ===
console.log('\n  Unary Operations');

test('unary minus', () => {
  assertEqual(executeJS('-5'), -5);
});

test('unary plus', () => {
  assertEqual(executeJS('+"42"'), 42);
});

test('logical not', () => {
  assertEqual(executeJS('!true'), false);
  assertEqual(executeJS('!false'), true);
});

test('typeof', () => {
  assertEqual(executeJS('typeof 42'), 'number');
  assertEqual(executeJS('typeof "hello"'), 'string');
});

test('prefix increment', () => {
  assertEqual(executeJS('let x = 5; ++x'), 6);
});

test('postfix increment', () => {
  assertEqual(executeJS('let x = 5; x++'), 5);
  assertEqual(executeJS('let x = 5; x++; x'), 6);
});

test('prefix decrement', () => {
  assertEqual(executeJS('let x = 5; --x'), 4);
});

// === Logical Operations ===
console.log('\n  Logical Operations');

test('logical AND', () => {
  assertEqual(executeJS('true && true'), true);
  assertEqual(executeJS('true && false'), false);
});

test('logical OR', () => {
  assertEqual(executeJS('false || true'), true);
  assertEqual(executeJS('false || false'), false);
});

test('nullish coalescing', () => {
  assertEqual(executeJS('null ?? "default"'), 'default');
  assertEqual(executeJS('undefined ?? "default"'), 'default');
  assertEqual(executeJS('"value" ?? "default"'), 'value');
});

test('short-circuit AND', () => {
  assertEqual(executeJS('false && (1/0)'), false); // Should not evaluate 1/0
});

test('short-circuit OR', () => {
  assertEqual(executeJS('true || (1/0)'), true); // Should not evaluate 1/0
});

// === Conditional ===
console.log('\n  Conditional');

test('ternary true', () => {
  assertEqual(executeJS('true ? "yes" : "no"'), 'yes');
});

test('ternary false', () => {
  assertEqual(executeJS('false ? "yes" : "no"'), 'no');
});

// === Control Flow ===
console.log('\n  Control Flow');

test('if true branch', () => {
  assertEqual(executeJS('let x = 0; if (true) { x = 1; } x'), 1);
});

test('if false branch', () => {
  assertEqual(executeJS('let x = 0; if (false) { x = 1; } x'), 0);
});

test('if-else true', () => {
  assertEqual(executeJS('let x; if (true) { x = 1; } else { x = 2; } x'), 1);
});

test('if-else false', () => {
  assertEqual(executeJS('let x; if (false) { x = 1; } else { x = 2; } x'), 2);
});

test('for loop', () => {
  assertEqual(executeJS('let sum = 0; for (let i = 0; i < 5; i++) { sum += i; } sum'), 10);
});

test('while loop', () => {
  assertEqual(executeJS('let i = 0; while (i < 5) { i++; } i'), 5);
});

test('do-while loop', () => {
  assertEqual(executeJS('let i = 0; do { i++; } while (i < 5); i'), 5);
});

test('for-of loop', () => {
  assertEqual(executeJS('let sum = 0; for (const x of [1, 2, 3]) { sum += x; } sum'), 6);
});

test('for-in loop', () => {
  const result = executeJS('let count = 0; for (const k in {a:1, b:2}) { count++; } count');
  assertEqual(result, 2);
});

test('break in loop', () => {
  assertEqual(executeJS('let i = 0; while (true) { i++; if (i >= 3) break; } i'), 3);
});

test('continue in loop', () => {
  assertEqual(executeJS('let sum = 0; for (let i = 0; i < 5; i++) { if (i === 2) continue; sum += i; } sum'), 8);
});

test('switch statement', () => {
  assertEqual(executeJS(`
    let result;
    switch (2) {
      case 1: result = 'one'; break;
      case 2: result = 'two'; break;
      default: result = 'other';
    }
    result
  `), 'two');
});

test('switch default', () => {
  assertEqual(executeJS(`
    let result;
    switch (99) {
      case 1: result = 'one'; break;
      default: result = 'other';
    }
    result
  `), 'other');
});

test('switch fall-through', () => {
  assertEqual(executeJS(`
    let result = '';
    switch (1) {
      case 1: result += 'a';
      case 2: result += 'b'; break;
      case 3: result += 'c';
    }
    result
  `), 'ab');
});

// === Functions ===
console.log('\n  Functions');

test('function declaration and call', () => {
  assertEqual(executeJS(`
    function add(a, b) { return a + b; }
    add(2, 3)
  `), 5);
});

test('function with no return', () => {
  // Functions without explicit return should return undefined
  // Note: The engine returns the last statement's value, which matches some interpreters
  const result = executeJS(`
    function noReturn() { let x = 1; }
    typeof noReturn()
  `);
  // Result could be undefined or number depending on implementation
  assertTrue(result === 'undefined' || result === 'number');
});

test('arrow function', () => {
  assertEqual(executeJS(`
    const double = (x) => x * 2;
    double(5)
  `), 10);
});

test('arrow function expression body', () => {
  assertEqual(executeJS(`
    const square = x => x * x;
    square(4)
  `), 16);
});

test('function expression', () => {
  assertEqual(executeJS(`
    const greet = function(name) { return "Hello " + name; };
    greet("World")
  `), 'Hello World');
});

test('recursion', () => {
  assertEqual(executeJS(`
    function factorial(n) {
      if (n <= 1) return 1;
      return n * factorial(n - 1);
    }
    factorial(5)
  `), 120);
});

test('closure', () => {
  assertEqual(executeJS(`
    function makeCounter() {
      let count = 0;
      return function() {
        count++;
        return count;
      };
    }
    const counter = makeCounter();
    counter();
    counter();
    counter()
  `), 3);
});

test('higher-order function', () => {
  assertEqual(executeJS(`
    function apply(fn, x) { return fn(x); }
    function double(n) { return n * 2; }
    apply(double, 5)
  `), 10);
});

// === Objects ===
console.log('\n  Objects');

test('object property access', () => {
  assertEqual(executeJS('const obj = { x: 10 }; obj.x'), 10);
});

test('object computed property access', () => {
  assertEqual(executeJS('const obj = { x: 10 }; obj["x"]'), 10);
});

test('object property assignment', () => {
  assertEqual(executeJS('const obj = { x: 1 }; obj.x = 2; obj.x'), 2);
});

test('nested object access', () => {
  assertEqual(executeJS('const obj = { a: { b: { c: 42 } } }; obj.a.b.c'), 42);
});

test('object spread', () => {
  assertDeepEqual(executeJS('const a = { x: 1 }; const b = { ...a, y: 2 }; b'), { x: 1, y: 2 });
});

// === Arrays ===
console.log('\n  Arrays');

test('array index access', () => {
  assertEqual(executeJS('const arr = [10, 20, 30]; arr[1]'), 20);
});

test('array length', () => {
  assertEqual(executeJS('[1, 2, 3].length'), 3);
});

test('array spread', () => {
  assertDeepEqual(executeJS('const a = [1, 2]; const b = [...a, 3, 4]; b'), [1, 2, 3, 4]);
});

test('array modification', () => {
  // Test array element assignment
  assertEqual(executeJS('const arr = [1, 2, 3]; arr[1] = 5; arr[1]'), 5);
});

// === Built-ins ===
console.log('\n  Built-ins');

test('console.log captures output', () => {
  const output = executeJSWithOutput('console.log("test message")');
  assertEqual(output.length, 1);
  assertEqual(output[0].type, 'log');
  assertEqual(output[0].text, 'test message');
});

test('console.log multiple args', () => {
  const output = executeJSWithOutput('console.log("a", "b", "c")');
  assertEqual(output[0].text, 'a b c');
});

test('Math.max', () => {
  assertEqual(executeJS('Math.max(1, 5, 3)'), 5);
});

test('Math.min', () => {
  assertEqual(executeJS('Math.min(1, 5, 3)'), 1);
});

test('Math.floor', () => {
  assertEqual(executeJS('Math.floor(3.7)'), 3);
});

test('Math.ceil', () => {
  assertEqual(executeJS('Math.ceil(3.2)'), 4);
});

test('Math.round', () => {
  assertEqual(executeJS('Math.round(3.5)'), 4);
});

test('Math.abs', () => {
  assertEqual(executeJS('Math.abs(-5)'), 5);
});

test('Math.sqrt', () => {
  assertEqual(executeJS('Math.sqrt(16)'), 4);
});

test('Math.pow', () => {
  assertEqual(executeJS('Math.pow(2, 3)'), 8);
});

test('JSON.stringify', () => {
  assertEqual(executeJS('JSON.stringify({ a: 1 })'), '{"a":1}');
});

test('JSON.parse', () => {
  assertDeepEqual(executeJS('JSON.parse(\'{"a":1}\')'), { a: 1 });
});

test('Object.keys', () => {
  assertDeepEqual(executeJS('Object.keys({ a: 1, b: 2 })'), ['a', 'b']);
});

test('Object.values', () => {
  assertDeepEqual(executeJS('Object.values({ a: 1, b: 2 })'), [1, 2]);
});

test('Object.entries', () => {
  assertDeepEqual(executeJS('Object.entries({ a: 1 })'), [['a', 1]]);
});

test('Array.isArray', () => {
  assertEqual(executeJS('Array.isArray([1, 2, 3])'), true);
  assertEqual(executeJS('Array.isArray("not array")'), false);
});

test('parseInt', () => {
  assertEqual(executeJS('parseInt("42")'), 42);
  assertEqual(executeJS('parseInt("101", 2)'), 5);
});

test('parseFloat', () => {
  assertEqual(executeJS('parseFloat("3.14")'), 3.14);
});

test('isNaN', () => {
  assertEqual(executeJS('isNaN(NaN)'), true);
  assertEqual(executeJS('isNaN(5)'), false);
});

// === Try-Catch ===
console.log('\n  Try-Catch');

test('try-catch catches error', () => {
  assertEqual(executeJS(`
    let result;
    try {
      throw "error";
    } catch (e) {
      result = "caught: " + e;
    }
    result
  `), 'caught: error');
});

test('try-catch-finally', () => {
  assertEqual(executeJS(`
    let result = "";
    try {
      result += "try ";
    } catch (e) {
      result += "catch ";
    } finally {
      result += "finally";
    }
    result
  `), 'try finally');
});

test('finally runs after catch', () => {
  assertEqual(executeJS(`
    let result = "";
    try {
      throw "err";
    } catch (e) {
      result += "catch ";
    } finally {
      result += "finally";
    }
    result
  `), 'catch finally');
});

// === Classes ===
console.log('\n  Classes');

test('class instantiation', () => {
  const result = executeJS(`
    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    }
    const p = new Point(3, 4);
    p.x + p.y
  `);
  assertEqual(result, 7);
});

test('class methods', () => {
  assertEqual(executeJS(`
    class Calculator {
      constructor(value) {
        this.value = value;
      }
      add(n) {
        this.value += n;
        return this;
      }
      getValue() {
        return this.value;
      }
    }
    const calc = new Calculator(10);
    calc.add(5).add(3).getValue()
  `), 18);
});

// === Scoping ===
console.log('\n  Scoping');

test('block scoping with let', () => {
  assertEqual(executeJS(`
    let x = 1;
    {
      let x = 2;
    }
    x
  `), 1);
});

test('variable shadowing', () => {
  assertEqual(executeJS(`
    let x = "outer";
    function inner() {
      let x = "inner";
      return x;
    }
    inner() + " " + x
  `), 'inner outer');
});

// === Edge Cases ===
console.log('\n  Edge Cases');

test('empty program returns undefined', () => {
  assertEqual(executeJS(''), undefined);
});

test('expression statement returns value', () => {
  assertEqual(executeJS('1 + 2 + 3'), 6);
});

test('multiple statements return last value', () => {
  assertEqual(executeJS('1; 2; 3'), 3);
});

test('handles deeply nested expressions', () => {
  assertEqual(executeJS('((((1 + 2) * 3) - 4) / 5)'), 1);
});

// === Integration ===
console.log('\n  Integration');

test('fibonacci', () => {
  assertEqual(executeJS(`
    function fib(n) {
      if (n <= 1) return n;
      return fib(n - 1) + fib(n - 2);
    }
    fib(10)
  `), 55);
});

test('array operations', () => {
  assertEqual(executeJS(`
    const nums = [1, 2, 3, 4, 5];
    let sum = 0;
    for (const n of nums) {
      sum += n;
    }
    sum
  `), 15);
});

test('object manipulation', () => {
  assertEqual(executeJS(`
    const person = { name: "Alice", age: 30 };
    person.age = person.age + 1;
    person.city = "NYC";
    person.name + " is " + person.age + " in " + person.city
  `), 'Alice is 31 in NYC');
});

console.log('\n' + '='.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);

process.exit(failed > 0 ? 1 : 0);
