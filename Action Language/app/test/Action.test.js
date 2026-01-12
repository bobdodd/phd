/**
 * Tests for Action class
 */

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
    // Expected error was thrown
  }
}

console.log('\nAction Tests\n' + '='.repeat(40));

// Reset ID counter before tests
Action.resetIdCounter();

test('creates action with type', () => {
  const action = new Action('seq');
  assertEqual(action.actionType, 'seq');
});

test('creates action with attributes', () => {
  const action = new Action('declareVar', { name: 'x', value: 10 });
  assertEqual(action.getAttribute('name'), 'x');
  assertEqual(action.getAttribute('value'), 10);
});

test('creates action with children', () => {
  const child1 = new Action('statement');
  const child2 = new Action('statement');
  const parent = new Action('seq', {}, [child1, child2]);

  assertEqual(parent.children.length, 2);
  assertEqual(child1.parent, parent);
  assertEqual(child2.parent, parent);
});

test('addChild sets parent reference', () => {
  const parent = new Action('seq');
  const child = new Action('statement');
  parent.addChild(child);

  assertEqual(child.parent, parent);
  assertEqual(parent.children.length, 1);
});

test('addChild assigns sequence numbers', () => {
  const parent = new Action('seq');
  const child1 = new Action('s1');
  const child2 = new Action('s2');

  parent.addChild(child1);
  parent.addChild(child2);

  assertEqual(child1.sequenceNumber, 10);
  assertEqual(child2.sequenceNumber, 20);
});

test('addChild with custom sequence number', () => {
  const parent = new Action('seq');
  const child = new Action('statement');
  parent.addChild(child, 50);

  assertEqual(child.sequenceNumber, 50);
});

test('addChild throws for non-Action', () => {
  const parent = new Action('seq');
  assertThrows(() => parent.addChild('not an action'));
});

test('removeChild removes and clears parent', () => {
  const parent = new Action('seq');
  const child = new Action('statement');
  parent.addChild(child);

  const removed = parent.removeChild(child);
  assertTrue(removed);
  assertEqual(child.parent, null);
  assertEqual(parent.children.length, 0);
});

test('removeChild returns false for non-child', () => {
  const parent = new Action('seq');
  const notChild = new Action('other');

  const removed = parent.removeChild(notChild);
  assertFalse(removed);
});

test('getAttribute returns undefined for missing', () => {
  const action = new Action('test');
  assertEqual(action.getAttribute('missing'), undefined);
});

test('setAttribute adds/updates attribute', () => {
  const action = new Action('test');
  action.setAttribute('key', 'value');
  assertEqual(action.getAttribute('key'), 'value');

  action.setAttribute('key', 'updated');
  assertEqual(action.getAttribute('key'), 'updated');
});

test('hasAttribute checks existence', () => {
  const action = new Action('test', { exists: true });
  assertTrue(action.hasAttribute('exists'));
  assertFalse(action.hasAttribute('missing'));
});

test('getAttributes returns plain object', () => {
  const action = new Action('test', { a: 1, b: 2 });
  const attrs = action.getAttributes();
  assertEqual(attrs.a, 1);
  assertEqual(attrs.b, 2);
});

test('hasChildren checks children array', () => {
  const parent = new Action('seq');
  assertFalse(parent.hasChildren());

  parent.addChild(new Action('child'));
  assertTrue(parent.hasChildren());
});

test('getRoot returns root of tree', () => {
  const root = new Action('root');
  const child = new Action('child');
  const grandchild = new Action('grandchild');

  root.addChild(child);
  child.addChild(grandchild);

  assertEqual(grandchild.getRoot(), root);
  assertEqual(child.getRoot(), root);
  assertEqual(root.getRoot(), root);
});

test('getDepth returns depth in tree', () => {
  const root = new Action('root');
  const child = new Action('child');
  const grandchild = new Action('grandchild');

  root.addChild(child);
  child.addChild(grandchild);

  assertEqual(root.getDepth(), 0);
  assertEqual(child.getDepth(), 1);
  assertEqual(grandchild.getDepth(), 2);
});

test('findById finds action in subtree', () => {
  const root = new Action('root');
  const child = new Action('child');
  root.addChild(child);

  const found = root.findById(child.id);
  assertEqual(found, child);
});

test('findById returns null if not found', () => {
  const root = new Action('root');
  const found = root.findById('nonexistent');
  assertEqual(found, null);
});

test('findByType finds all matching actions', () => {
  const root = new Action('seq');
  root.addChild(new Action('statement'));
  root.addChild(new Action('statement'));
  root.addChild(new Action('other'));

  const found = root.findByType('statement');
  assertEqual(found.length, 2);
});

test('traverse visits all nodes depth-first', () => {
  const root = new Action('root');
  const child1 = new Action('child1');
  const child2 = new Action('child2');
  const grandchild = new Action('grandchild');

  root.addChild(child1);
  root.addChild(child2);
  child1.addChild(grandchild);

  const visited = [];
  root.traverse((action, depth) => {
    visited.push({ type: action.actionType, depth });
  });

  assertEqual(visited.length, 4);
  assertEqual(visited[0].type, 'root');
  assertEqual(visited[0].depth, 0);
  assertEqual(visited[1].type, 'child1');
  assertEqual(visited[1].depth, 1);
  assertEqual(visited[2].type, 'grandchild');
  assertEqual(visited[2].depth, 2);
  assertEqual(visited[3].type, 'child2');
  assertEqual(visited[3].depth, 1);
});

test('traverseBreadthFirst visits level by level', () => {
  const root = new Action('root');
  const child1 = new Action('child1');
  const child2 = new Action('child2');
  const grandchild = new Action('grandchild');

  root.addChild(child1);
  root.addChild(child2);
  child1.addChild(grandchild);

  const visited = [];
  root.traverseBreadthFirst((action) => {
    visited.push(action.actionType);
  });

  assertEqual(visited[0], 'root');
  assertEqual(visited[1], 'child1');
  assertEqual(visited[2], 'child2');
  assertEqual(visited[3], 'grandchild');
});

test('clone creates deep copy', () => {
  const root = new Action('root', { key: 'value' });
  const child = new Action('child', { num: 42 });
  root.addChild(child);

  const cloned = root.clone();

  // Different instances
  assertTrue(cloned !== root);
  assertTrue(cloned.children[0] !== child);

  // Same values
  assertEqual(cloned.actionType, 'root');
  assertEqual(cloned.getAttribute('key'), 'value');
  assertEqual(cloned.children[0].actionType, 'child');
  assertEqual(cloned.children[0].getAttribute('num'), 42);
});

test('toObject serializes action', () => {
  const action = new Action('test', { attr: 'value' });
  const obj = action.toObject();

  assertEqual(obj.actionType, 'test');
  assertEqual(obj.attributes.attr, 'value');
  assertTrue(Array.isArray(obj.children));
});

test('fromObject deserializes action', () => {
  const obj = {
    id: 'custom-id',
    actionType: 'test',
    attributes: { key: 'value' },
    sequenceNumber: 15,
    children: [
      { actionType: 'child', attributes: {}, children: [] }
    ]
  };

  const action = Action.fromObject(obj);

  assertEqual(action.id, 'custom-id');
  assertEqual(action.actionType, 'test');
  assertEqual(action.getAttribute('key'), 'value');
  assertEqual(action.sequenceNumber, 15);
  assertEqual(action.children.length, 1);
  assertEqual(action.children[0].actionType, 'child');
});

test('toString returns readable representation', () => {
  const action = new Action('test', { name: 'x' });
  const str = action.toString();

  assertTrue(str.includes('test'));
  assertTrue(str.includes('name'));
});

console.log('\n' + '='.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);

process.exit(failed > 0 ? 1 : 0);
