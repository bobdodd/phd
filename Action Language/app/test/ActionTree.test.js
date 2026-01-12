/**
 * Tests for ActionTree class
 */

const Action = require('../src/action-language/Action');
const ActionTree = require('../src/action-language/ActionTree');

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

console.log('\nActionTree Tests\n' + '='.repeat(40));

Action.resetIdCounter();

test('creates empty tree', () => {
  const tree = new ActionTree();
  assertEqual(tree.root, null);
  assertTrue(tree.metadata.created !== undefined);
});

test('creates tree with root', () => {
  const root = new Action('program');
  const tree = new ActionTree(root);
  assertEqual(tree.root, root);
});

test('setRoot updates root and modified time', () => {
  const tree = new ActionTree();
  const originalModified = tree.metadata.modified;

  // Small delay to ensure different timestamp
  const root = new Action('program');
  tree.setRoot(root);

  assertEqual(tree.root, root);
});

test('registerActionType adds to set', () => {
  const tree = new ActionTree();
  tree.registerActionType('seq');
  tree.registerActionType('if');

  assertTrue(tree.actionTypes.has('seq'));
  assertTrue(tree.actionTypes.has('if'));
});

test('registerDataType adds custom type', () => {
  const tree = new ActionTree();
  tree.registerDataType('CustomType');

  assertTrue(tree.dataTypes.has('CustomType'));
});

test('registerAttributeType validates data type', () => {
  const tree = new ActionTree();

  assertThrows(() => {
    tree.registerAttributeType('attr', 'InvalidType');
  });
});

test('registerAttributeType with valid type', () => {
  const tree = new ActionTree();
  tree.registerAttributeType('var.name', 'String', 'Variable name');

  assertTrue(tree.attributeTypes.has('var.name'));
  assertEqual(tree.attributeTypes.get('var.name').dataType, 'String');
  assertEqual(tree.attributeTypes.get('var.name').description, 'Variable name');
});

test('findById finds action in tree', () => {
  const root = new Action('program');
  const child = new Action('statement');
  root.addChild(child);

  const tree = new ActionTree(root);
  const found = tree.findById(child.id);

  assertEqual(found, child);
});

test('findById returns null for empty tree', () => {
  const tree = new ActionTree();
  const found = tree.findById('any');
  assertEqual(found, null);
});

test('findByType finds all matching actions', () => {
  const root = new Action('program');
  root.addChild(new Action('statement'));
  root.addChild(new Action('statement'));
  root.addChild(new Action('expression'));

  const tree = new ActionTree(root);
  const found = tree.findByType('statement');

  assertEqual(found.length, 2);
});

test('findByType returns empty for empty tree', () => {
  const tree = new ActionTree();
  const found = tree.findByType('any');
  assertEqual(found.length, 0);
});

test('findWhere finds matching actions', () => {
  const root = new Action('program');
  root.addChild(new Action('var', { name: 'x' }));
  root.addChild(new Action('var', { name: 'y' }));
  root.addChild(new Action('other'));

  const tree = new ActionTree(root);
  const found = tree.findWhere(a => a.hasAttribute('name'));

  assertEqual(found.length, 2);
});

test('findByAttribute finds by key-value', () => {
  const root = new Action('program');
  root.addChild(new Action('var', { name: 'x' }));
  root.addChild(new Action('var', { name: 'y' }));

  const tree = new ActionTree(root);
  const found = tree.findByAttribute('name', 'x');

  assertEqual(found.length, 1);
  assertEqual(found[0].getAttribute('name'), 'x');
});

test('getUsedActionTypes collects all types', () => {
  const root = new Action('program');
  root.addChild(new Action('statement'));
  root.addChild(new Action('expression'));
  root.addChild(new Action('statement'));

  const tree = new ActionTree(root);
  const types = tree.getUsedActionTypes();

  assertEqual(types.size, 3);
  assertTrue(types.has('program'));
  assertTrue(types.has('statement'));
  assertTrue(types.has('expression'));
});

test('countActions counts all nodes', () => {
  const root = new Action('program');
  root.addChild(new Action('s1'));
  root.addChild(new Action('s2'));
  root.children[0].addChild(new Action('s3'));

  const tree = new ActionTree(root);
  assertEqual(tree.countActions(), 4);
});

test('countActions returns 0 for empty tree', () => {
  const tree = new ActionTree();
  assertEqual(tree.countActions(), 0);
});

test('getMaxDepth returns tree depth', () => {
  const root = new Action('program');
  const child = new Action('block');
  const grandchild = new Action('statement');

  root.addChild(child);
  child.addChild(grandchild);

  const tree = new ActionTree(root);
  assertEqual(tree.getMaxDepth(), 2);
});

test('getMaxDepth returns 0 for single node', () => {
  const tree = new ActionTree(new Action('root'));
  assertEqual(tree.getMaxDepth(), 0);
});

test('traverse depth-first by default', () => {
  const root = new Action('root');
  root.addChild(new Action('child'));

  const tree = new ActionTree(root);
  const visited = [];
  tree.traverse((a) => visited.push(a.actionType));

  assertEqual(visited[0], 'root');
  assertEqual(visited[1], 'child');
});

test('traverse breadth-first when specified', () => {
  const root = new Action('root');
  const child1 = new Action('child1');
  child1.addChild(new Action('grandchild'));
  root.addChild(child1);
  root.addChild(new Action('child2'));

  const tree = new ActionTree(root);
  const visited = [];
  tree.traverse((a) => visited.push(a.actionType), 'breadth-first');

  assertEqual(visited[0], 'root');
  assertEqual(visited[1], 'child1');
  assertEqual(visited[2], 'child2');
  assertEqual(visited[3], 'grandchild');
});

test('validate returns valid for correct tree', () => {
  const root = new Action('program');
  root.addChild(new Action('statement'));

  const tree = new ActionTree(root);
  const result = tree.validate();

  assertTrue(result.valid);
  assertEqual(result.errors.length, 0);
});

test('validate returns invalid for empty tree', () => {
  const tree = new ActionTree();
  const result = tree.validate();

  assertFalse(result.valid);
  assertTrue(result.errors.length > 0);
});

test('validate checks unknown action types', () => {
  const root = new Action('program');
  root.addChild(new Action('unknown'));

  const tree = new ActionTree(root);
  tree.registerActionType('program');
  // 'unknown' is not registered

  const result = tree.validate();
  assertTrue(result.errors.some(e => e.includes('Unknown action type')));
});

test('clone creates deep copy of tree', () => {
  const root = new Action('program', { version: '1.0' });
  root.addChild(new Action('statement'));

  const tree = new ActionTree(root);
  tree.registerActionType('program');
  tree.registerActionType('statement');

  const cloned = tree.clone();

  // Different instances
  assertTrue(cloned !== tree);
  assertTrue(cloned.root !== tree.root);

  // Same values
  assertEqual(cloned.root.actionType, 'program');
  assertEqual(cloned.actionTypes.size, 2);
  assertTrue(cloned.actionTypes.has('program'));
});

test('toObject serializes tree', () => {
  const root = new Action('program');
  const tree = new ActionTree(root);
  tree.registerActionType('program');

  const obj = tree.toObject();

  assertTrue(obj.metadata !== undefined);
  assertTrue(obj.actionTypes.includes('program'));
  assertEqual(obj.root.actionType, 'program');
});

test('fromObject deserializes tree', () => {
  const obj = {
    metadata: { version: '2.0', created: '2024-01-01', modified: '2024-01-02' },
    actionTypes: ['program', 'statement'],
    attributeTypes: { 'var.name': { dataType: 'String' } },
    dataTypes: ['String', 'CustomType'],
    root: { actionType: 'program', attributes: {}, children: [] }
  };

  const tree = ActionTree.fromObject(obj);

  assertEqual(tree.metadata.version, '2.0');
  assertTrue(tree.actionTypes.has('program'));
  assertTrue(tree.attributeTypes.has('var.name'));
  assertTrue(tree.dataTypes.has('CustomType'));
  assertEqual(tree.root.actionType, 'program');
});

test('toJSON and fromJSON round-trip', () => {
  const root = new Action('program');
  root.addChild(new Action('statement', { value: 42 }));

  const tree = new ActionTree(root);
  tree.registerActionType('program');

  const json = tree.toJSON();
  const restored = ActionTree.fromJSON(json);

  assertEqual(restored.root.actionType, 'program');
  assertEqual(restored.root.children[0].getAttribute('value'), 42);
  assertTrue(restored.actionTypes.has('program'));
});

test('printTree returns readable output', () => {
  const root = new Action('program');
  root.addChild(new Action('statement'));

  const tree = new ActionTree(root);
  const output = tree.printTree();

  assertTrue(output.includes('program'));
  assertTrue(output.includes('statement'));
});

test('printTree handles empty tree', () => {
  const tree = new ActionTree();
  const output = tree.printTree();

  assertEqual(output, '(empty tree)');
});

console.log('\n' + '='.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);

process.exit(failed > 0 ? 1 : 0);
