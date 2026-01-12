/**
 * Tests for XMLSerializer class
 */

const Action = require('../src/action-language/Action');
const ActionTree = require('../src/action-language/ActionTree');
const XMLSerializer = require('../src/action-language/XMLSerializer');

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

console.log('\nXMLSerializer Tests\n' + '='.repeat(40));

Action.resetIdCounter();

test('escapeXml escapes special characters', () => {
  assertEqual(XMLSerializer.escapeXml('&'), '&amp;');
  assertEqual(XMLSerializer.escapeXml('<'), '&lt;');
  assertEqual(XMLSerializer.escapeXml('>'), '&gt;');
  assertEqual(XMLSerializer.escapeXml('"'), '&quot;');
  assertEqual(XMLSerializer.escapeXml("'"), '&apos;');
  assertEqual(XMLSerializer.escapeXml('a & b < c'), 'a &amp; b &lt; c');
});

test('escapeXml handles non-strings', () => {
  assertEqual(XMLSerializer.escapeXml(42), '42');
  assertEqual(XMLSerializer.escapeXml(null), 'null');
});

test('unescapeXml reverses escaping', () => {
  assertEqual(XMLSerializer.unescapeXml('&amp;'), '&');
  assertEqual(XMLSerializer.unescapeXml('&lt;'), '<');
  assertEqual(XMLSerializer.unescapeXml('&gt;'), '>');
  assertEqual(XMLSerializer.unescapeXml('&quot;'), '"');
  assertEqual(XMLSerializer.unescapeXml('&apos;'), "'");
  assertEqual(XMLSerializer.unescapeXml('a &amp; b &lt; c'), 'a & b < c');
});

test('serialize produces valid XML declaration', () => {
  const tree = new ActionTree();
  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
});

test('serialize includes actionLanguage root element', () => {
  const tree = new ActionTree();
  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.includes('<actionLanguage>'));
  assertTrue(xml.includes('</actionLanguage>'));
});

test('serialize includes metadata', () => {
  const tree = new ActionTree();
  tree.metadata.version = '1.2.3';

  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.includes('<metadata>'));
  assertTrue(xml.includes('<version>1.2.3</version>'));
  assertTrue(xml.includes('<created>'));
  assertTrue(xml.includes('<modified>'));
});

test('serialize includes data types', () => {
  const tree = new ActionTree();
  tree.registerDataType('CustomType');

  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.includes('<dataTypes>'));
  assertTrue(xml.includes('<dataType name="CustomType" />'));
});

test('serialize includes action types', () => {
  const tree = new ActionTree();
  tree.registerActionType('seq');
  tree.registerActionType('if');

  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.includes('<actionTypes>'));
  assertTrue(xml.includes('<actionType name="seq" />'));
  assertTrue(xml.includes('<actionType name="if" />'));
});

test('serialize includes attribute types', () => {
  const tree = new ActionTree();
  tree.registerAttributeType('var.name', 'String');

  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.includes('<attributeTypes>'));
  assertTrue(xml.includes('<attributeType name="var.name" dataTypeName="String" />'));
});

test('serialize includes program with root action', () => {
  const root = new Action('program');
  const tree = new ActionTree(root);

  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.includes('<program>'));
  assertTrue(xml.includes('</program>') || xml.includes('<program'));
});

test('serialize serializes action tree', () => {
  const root = new Action('seq');
  root.addChild(new Action('statement', { value: 'test' }));

  const tree = new ActionTree(root);
  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.includes('<seq'));
  assertTrue(xml.includes('<statement'));
  assertTrue(xml.includes('at="value"'));
  assertTrue(xml.includes('av="test"'));
});

test('serialize escapes attribute values', () => {
  const root = new Action('test', { code: 'a < b && c > d' });
  const tree = new ActionTree(root);
  const xml = XMLSerializer.serialize(tree);

  assertTrue(xml.includes('&lt;'));
  assertTrue(xml.includes('&amp;'));
  assertTrue(xml.includes('&gt;'));
});

test('serialize with includeIds false', () => {
  const root = new Action('test');
  const tree = new ActionTree(root);
  const xml = XMLSerializer.serialize(tree, { includeIds: false });

  assertTrue(!xml.includes('id="action-'));
});

test('serialize with custom indent', () => {
  const tree = new ActionTree();
  const xml = XMLSerializer.serialize(tree, { indent: 4 });

  // 4 spaces of indentation
  assertTrue(xml.includes('    <metadata>'));
});

test('deserialize parses XML', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<actionLanguage>
  <metadata>
    <version>1.0.0</version>
    <created>2024-01-01</created>
    <modified>2024-01-02</modified>
  </metadata>
  <dataTypes>
    <dataType name="String" />
  </dataTypes>
  <actionTypes>
    <actionType name="program" />
  </actionTypes>
  <attributeTypes>
    <attributeType name="var.name" dataTypeName="String" />
  </attributeTypes>
  <program>
    <program id="test-1" />
  </program>
</actionLanguage>`;

  const tree = XMLSerializer.deserialize(xml);

  assertEqual(tree.metadata.version, '1.0.0');
  assertEqual(tree.metadata.created, '2024-01-01');
  assertTrue(tree.dataTypes.has('String'));
  assertTrue(tree.actionTypes.has('program'));
  assertTrue(tree.attributeTypes.has('var.name'));
  assertTrue(tree.root !== null);
  assertEqual(tree.root.actionType, 'program');
});

test('deserialize parses nested actions', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<actionLanguage>
  <metadata>
    <version>1.0.0</version>
    <created>2024-01-01</created>
    <modified>2024-01-02</modified>
  </metadata>
  <dataTypes></dataTypes>
  <actionTypes></actionTypes>
  <attributeTypes></attributeTypes>
  <program>
    <seq id="s1">
      <statement id="st1" at="value" av="hello" />
      <statement id="st2" at="value" av="world" />
    </seq>
  </program>
</actionLanguage>`;

  const tree = XMLSerializer.deserialize(xml);

  assertEqual(tree.root.actionType, 'seq');
  assertEqual(tree.root.children.length, 2);
  assertEqual(tree.root.children[0].getAttribute('value'), 'hello');
  assertEqual(tree.root.children[1].getAttribute('value'), 'world');
});

test('deserialize handles escaped characters', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<actionLanguage>
  <metadata>
    <version>1.0.0</version>
    <created>2024-01-01</created>
    <modified>2024-01-02</modified>
  </metadata>
  <dataTypes></dataTypes>
  <actionTypes></actionTypes>
  <attributeTypes></attributeTypes>
  <program>
    <test at="code" av="a &lt; b &amp;&amp; c &gt; d" />
  </program>
</actionLanguage>`;

  const tree = XMLSerializer.deserialize(xml);
  assertEqual(tree.root.getAttribute('code'), 'a < b && c > d');
});

test('serialize-deserialize round trip', () => {
  // Create original tree
  const root = new Action('program');
  const seq = new Action('seq');
  seq.addChild(new Action('declareVar', { name: 'x', value: '10' }));
  seq.addChild(new Action('declareVar', { name: 'y', value: '20' }));
  root.addChild(seq);

  const original = new ActionTree(root);
  original.registerActionType('program');
  original.registerActionType('seq');
  original.registerActionType('declareVar');
  original.registerAttributeType('name', 'String');
  original.registerAttributeType('value', 'String');

  // Serialize and deserialize
  const xml = XMLSerializer.serialize(original);
  const restored = XMLSerializer.deserialize(xml);

  // Verify structure
  assertEqual(restored.root.actionType, 'program');
  assertEqual(restored.root.children[0].actionType, 'seq');
  assertEqual(restored.root.children[0].children.length, 2);

  // Verify types
  assertTrue(restored.actionTypes.has('program'));
  assertTrue(restored.actionTypes.has('seq'));
  assertTrue(restored.attributeTypes.has('name'));
});

test('deserialize handles deeply nested structure', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<actionLanguage>
  <metadata>
    <version>1.0.0</version>
    <created>2024-01-01</created>
    <modified>2024-01-02</modified>
  </metadata>
  <dataTypes></dataTypes>
  <actionTypes></actionTypes>
  <attributeTypes></attributeTypes>
  <program>
    <level1>
      <level2>
        <level3>
          <level4 at="deep" av="value" />
        </level3>
      </level2>
    </level1>
  </program>
</actionLanguage>`;

  const tree = XMLSerializer.deserialize(xml);

  assertEqual(tree.root.actionType, 'level1');
  assertEqual(tree.root.children[0].actionType, 'level2');
  assertEqual(tree.root.children[0].children[0].actionType, 'level3');
  assertEqual(tree.root.children[0].children[0].children[0].actionType, 'level4');
  assertEqual(tree.root.children[0].children[0].children[0].getAttribute('deep'), 'value');
});

console.log('\n' + '='.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);

process.exit(failed > 0 ? 1 : 0);
