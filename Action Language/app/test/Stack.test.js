/**
 * Tests for Stack classes
 */

const {
  Stack,
  VariableStack,
  ConstantStack,
  FunctionStack,
  CallStack,
  ExecutionContext
} = require('../src/execution/Stack');

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
    throw new Error(`${message} Expected ${expected}, got ${actual}`);
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

console.log('\nStack Tests\n' + '='.repeat(40));

// Base Stack tests
console.log('\n  Base Stack');

test('push adds item to stack', () => {
  const stack = new Stack();
  stack.push('x', 10);
  assertEqual(stack.getLocal('x'), 10);
});

test('push throws on duplicate', () => {
  const stack = new Stack();
  stack.push('x', 10);
  assertThrows(() => stack.push('x', 20));
});

test('set allows duplicates', () => {
  const stack = new Stack();
  stack.set('x', 10);
  stack.set('x', 20);
  assertEqual(stack.getLocal('x'), 20);
});

test('getLocal only checks current scope', () => {
  const parent = new Stack();
  parent.push('x', 10);

  const child = new Stack(parent);
  assertEqual(child.getLocal('x'), undefined);
  assertEqual(child.get('x'), 10);
});

test('hasLocal checks current scope only', () => {
  const parent = new Stack();
  parent.push('x', 10);

  const child = new Stack(parent);
  assertFalse(child.hasLocal('x'));
  assertTrue(child.has('x'));
});

test('get walks scope chain', () => {
  const grandparent = new Stack();
  grandparent.push('a', 1);

  const parent = new Stack(grandparent);
  parent.push('b', 2);

  const child = new Stack(parent);
  child.push('c', 3);

  assertEqual(child.get('a'), 1);
  assertEqual(child.get('b'), 2);
  assertEqual(child.get('c'), 3);
});

test('has walks scope chain', () => {
  const parent = new Stack();
  parent.push('x', 10);

  const child = new Stack(parent);
  assertTrue(child.has('x'));
  assertFalse(child.has('y'));
});

test('update modifies in correct scope', () => {
  const parent = new Stack();
  parent.push('x', 10);

  const child = new Stack(parent);
  child.push('y', 20);

  child.update('x', 100);
  assertEqual(parent.getLocal('x'), 100);
});

test('update returns false if not found', () => {
  const stack = new Stack();
  assertFalse(stack.update('missing', 10));
});

test('delete removes from current scope', () => {
  const stack = new Stack();
  stack.push('x', 10);
  assertTrue(stack.delete('x'));
  assertFalse(stack.has('x'));
});

test('localNames returns current scope names', () => {
  const parent = new Stack();
  parent.push('a', 1);

  const child = new Stack(parent);
  child.push('b', 2);
  child.push('c', 3);

  const names = child.localNames();
  assertEqual(names.length, 2);
  assertTrue(names.includes('b'));
  assertTrue(names.includes('c'));
});

test('allNames returns all visible names', () => {
  const parent = new Stack();
  parent.push('a', 1);

  const child = new Stack(parent);
  child.push('b', 2);

  const names = child.allNames();
  assertTrue(names.includes('a'));
  assertTrue(names.includes('b'));
});

test('depth calculates chain depth', () => {
  const root = new Stack();
  const child = new Stack(root);
  const grandchild = new Stack(child);

  assertEqual(root.depth(), 0);
  assertEqual(child.depth(), 1);
  assertEqual(grandchild.depth(), 2);
});

test('createChildScope creates linked scope', () => {
  const parent = new Stack();
  parent.push('x', 10);

  const child = parent.createChildScope();
  assertTrue(child instanceof Stack);
  assertEqual(child.get('x'), 10);
  assertEqual(child.depth(), 1);
});

test('clear removes current scope items', () => {
  const stack = new Stack();
  stack.push('x', 10);
  stack.push('y', 20);
  stack.clear();
  assertEqual(stack.size(), 0);
});

test('size returns item count', () => {
  const stack = new Stack();
  assertEqual(stack.size(), 0);
  stack.push('x', 10);
  assertEqual(stack.size(), 1);
});

test('toString shows scope chain', () => {
  const parent = new Stack();
  parent.push('a', 1);

  const child = new Stack(parent);
  child.push('b', 2);

  const str = child.toString();
  assertTrue(str.includes('Scope 0'));
  assertTrue(str.includes('Scope 1'));
});

// VariableStack tests
console.log('\n  VariableStack');

test('declare creates variable', () => {
  const stack = new VariableStack();
  stack.declare('x', 10, 'let');
  assertEqual(stack.getValue('x'), 10);
});

test('getValue throws for undefined', () => {
  const stack = new VariableStack();
  assertThrows(() => stack.getValue('missing'));
});

test('setValue updates variable', () => {
  const stack = new VariableStack();
  stack.declare('x', 10, 'let');
  stack.setValue('x', 20);
  assertEqual(stack.getValue('x'), 20);
});

test('setValue throws for undefined', () => {
  const stack = new VariableStack();
  assertThrows(() => stack.setValue('missing', 10));
});

test('setValue throws for const', () => {
  const stack = new VariableStack();
  stack.declare('x', 10, 'const');
  assertThrows(() => stack.setValue('x', 20));
});

test('setValue updates in parent scope', () => {
  const parent = new VariableStack();
  parent.declare('x', 10, 'let');

  const child = parent.createChildScope();
  child.setValue('x', 20);

  assertEqual(parent.getValue('x'), 20);
});

// ConstantStack tests
console.log('\n  ConstantStack');

test('declare creates constant', () => {
  const stack = new ConstantStack();
  stack.declare('PI', 3.14159);
  assertEqual(stack.getValue('PI'), 3.14159);
});

test('getValue throws for undefined', () => {
  const stack = new ConstantStack();
  assertThrows(() => stack.getValue('missing'));
});

test('getValue walks scope chain', () => {
  const parent = new ConstantStack();
  parent.declare('PI', 3.14);

  const child = parent.createChildScope();
  assertEqual(child.getValue('PI'), 3.14);
});

// FunctionStack tests
console.log('\n  FunctionStack');

test('declare stores function', () => {
  const stack = new FunctionStack();
  const fn = { params: ['x'], body: {} };
  stack.declare('add', fn);
  assertEqual(stack.getFunction('add'), fn);
});

test('getFunction throws for undefined', () => {
  const stack = new FunctionStack();
  assertThrows(() => stack.getFunction('missing'));
});

test('getFunction walks scope chain', () => {
  const parent = new FunctionStack();
  const fn = { params: [], body: {} };
  parent.declare('myFn', fn);

  const child = parent.createChildScope();
  assertEqual(child.getFunction('myFn'), fn);
});

// CallStack tests
console.log('\n  CallStack');

test('pushFrame adds frame', () => {
  const stack = new CallStack();
  stack.pushFrame({ functionName: 'main', args: [] });
  assertEqual(stack.callDepth(), 1);
});

test('popFrame removes and returns frame', () => {
  const stack = new CallStack();
  stack.pushFrame({ functionName: 'main' });
  stack.pushFrame({ functionName: 'helper' });

  const frame = stack.popFrame();
  assertEqual(frame.functionName, 'helper');
  assertEqual(stack.callDepth(), 1);
});

test('currentFrame returns top frame', () => {
  const stack = new CallStack();
  stack.pushFrame({ functionName: 'main' });
  stack.pushFrame({ functionName: 'helper' });

  assertEqual(stack.currentFrame().functionName, 'helper');
});

test('callDepth returns frame count', () => {
  const stack = new CallStack();
  assertEqual(stack.callDepth(), 0);

  stack.pushFrame({ functionName: 'main' });
  assertEqual(stack.callDepth(), 1);

  stack.pushFrame({ functionName: 'nested' });
  assertEqual(stack.callDepth(), 2);
});

test('getStackTrace returns formatted trace', () => {
  const stack = new CallStack();
  stack.pushFrame({ functionName: 'main' });
  stack.pushFrame({ functionName: 'helper' });

  const trace = stack.getStackTrace();
  assertEqual(trace.length, 2);
  assertTrue(trace[0].includes('helper'));
  assertTrue(trace[1].includes('main'));
});

test('frame includes timestamp', () => {
  const stack = new CallStack();
  stack.pushFrame({ functionName: 'test' });

  const frame = stack.currentFrame();
  assertTrue(frame.timestamp !== undefined);
  assertTrue(typeof frame.timestamp === 'number');
});

// ExecutionContext tests
console.log('\n  ExecutionContext');

test('creates all stacks', () => {
  const ctx = new ExecutionContext();
  assertTrue(ctx.variables instanceof VariableStack);
  assertTrue(ctx.constants instanceof ConstantStack);
  assertTrue(ctx.functions instanceof FunctionStack);
  assertTrue(ctx.callStack instanceof CallStack);
});

test('createChildContext creates linked context', () => {
  const parent = new ExecutionContext();
  parent.variables.declare('x', 10, 'let');

  const child = parent.createChildContext();
  assertEqual(child.variables.getValue('x'), 10);
  assertEqual(child.parent, parent);
});

test('child shares callStack with parent', () => {
  const parent = new ExecutionContext();
  parent.callStack.pushFrame({ functionName: 'main' });

  const child = parent.createChildContext();
  assertEqual(child.callStack, parent.callStack);
  assertEqual(child.callStack.callDepth(), 1);
});

test('depth returns variable stack depth', () => {
  const parent = new ExecutionContext();
  const child = parent.createChildContext();
  const grandchild = child.createChildContext();

  assertEqual(parent.depth(), 0);
  assertEqual(child.depth(), 1);
  assertEqual(grandchild.depth(), 2);
});

console.log('\n' + '='.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);

process.exit(failed > 0 ? 1 : 0);
