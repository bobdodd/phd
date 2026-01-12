/**
 * DOM Simulation Tests
 *
 * Tests for MockElement, MockDocument, and MockWindow
 */

const { MockElement, MockDocument, MockWindow, createDOMEnvironment } = require('../src/dom');
const { ExecutionEngine } = require('../src/execution');
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

function assertExists(value, message = '') {
  if (value === null || value === undefined) {
    throw new Error(message || 'Expected value to exist');
  }
}

function assertNull(value, message = '') {
  if (value !== null) {
    throw new Error(message || `Expected null, got ${value}`);
  }
}

function assertGreater(actual, expected, message = '') {
  if (actual <= expected) {
    throw new Error(`${message} Expected ${actual} > ${expected}`);
  }
}

function assertLength(array, expected, message = '') {
  if (array.length !== expected) {
    throw new Error(`${message} Expected length ${expected}, got ${array.length}`);
  }
}

function assertIncludes(array, item, message = '') {
  if (!array.includes(item)) {
    throw new Error(message || `Expected array to include ${item}`);
  }
}

function executeWithDOM(code) {
  const tree = parseAndTransform(code);
  const engine = new ExecutionEngine({ enableDOM: true });
  return {
    result: engine.execute(tree),
    engine
  };
}

console.log('\nDOM Simulation Tests');
console.log('========================================');

// === MockElement Tests ===
console.log('\n  MockElement');

let doc = new MockDocument();

test('creates element with correct tag name', () => {
  const div = new MockElement('div', doc);
  assertEqual(div.tagName, 'DIV');
  assertEqual(div.nodeName, 'DIV');
  assertEqual(div.nodeType, 1);
});

test('sets and gets id', () => {
  const div = new MockElement('div', doc);
  div.id = 'myDiv';
  assertEqual(div.id, 'myDiv');
});

test('sets and gets className', () => {
  const div = new MockElement('div', doc);
  div.className = 'foo bar';
  assertEqual(div.className, 'foo bar');
});

test('sets and gets textContent', () => {
  const div = new MockElement('div', doc);
  div.textContent = 'Hello World';
  assertEqual(div.textContent, 'Hello World');
});

test('sets and gets attributes', () => {
  const div = new MockElement('div', doc);
  div.setAttribute('data-id', '123');
  assertEqual(div.getAttribute('data-id'), '123');
});

test('removes attributes', () => {
  const div = new MockElement('div', doc);
  div.setAttribute('data-id', '123');
  div.removeAttribute('data-id');
  assertNull(div.getAttribute('data-id'));
});

test('checks attribute existence', () => {
  const div = new MockElement('div', doc);
  assertFalse(div.hasAttribute('data-id'));
  div.setAttribute('data-id', '123');
  assertTrue(div.hasAttribute('data-id'));
});

test('gets attribute names', () => {
  const div = new MockElement('div', doc);
  div.setAttribute('data-id', '123');
  div.setAttribute('data-name', 'test');
  const names = div.getAttributeNames();
  assertIncludes(names, 'data-id');
  assertIncludes(names, 'data-name');
});

test('tracks ARIA attribute changes', () => {
  const div = new MockElement('div', doc);
  div.setAttribute('aria-label', 'Close');
  div.setAttribute('aria-expanded', 'true');
  const interactions = div.getInteractions();
  const ariaChanges = interactions.filter(i => i.type === 'setAttribute.aria');
  assertLength(ariaChanges, 2);
});

// classList tests
test('classList adds classes', () => {
  const div = new MockElement('div', doc);
  div.classList.add('foo');
  div.classList.add('bar');
  assertTrue(div.classList.contains('foo'));
  assertTrue(div.classList.contains('bar'));
});

test('classList removes classes', () => {
  const div = new MockElement('div', doc);
  div.classList.add('foo', 'bar');
  div.classList.remove('foo');
  assertFalse(div.classList.contains('foo'));
  assertTrue(div.classList.contains('bar'));
});

test('classList toggles classes', () => {
  const div = new MockElement('div', doc);
  assertTrue(div.classList.toggle('foo'));
  assertTrue(div.classList.contains('foo'));
  assertFalse(div.classList.toggle('foo'));
  assertFalse(div.classList.contains('foo'));
});

test('classList replaces classes', () => {
  const div = new MockElement('div', doc);
  div.classList.add('foo');
  div.classList.replace('foo', 'bar');
  assertFalse(div.classList.contains('foo'));
  assertTrue(div.classList.contains('bar'));
});

test('classList reports length', () => {
  const div = new MockElement('div', doc);
  div.classList.add('foo', 'bar', 'baz');
  assertEqual(div.classList.length, 3);
});

// style tests
test('style sets properties', () => {
  const div = new MockElement('div', doc);
  div.style.display = 'none';
  assertEqual(div.style.display, 'none');
});

test('style setProperty and getPropertyValue', () => {
  const div = new MockElement('div', doc);
  div.style.setProperty('background-color', 'red');
  assertEqual(div.style.getPropertyValue('background-color'), 'red');
});

test('style removeProperty', () => {
  const div = new MockElement('div', doc);
  div.style.display = 'none';
  div.style.removeProperty('display');
  assertEqual(div.style.display, '');
});

test('style tracks changes', () => {
  const div = new MockElement('div', doc);
  div.style.display = 'none';
  div.style.opacity = '0.5';
  const interactions = div.getInteractions();
  const styleChanges = interactions.filter(i => i.type === 'style.set');
  assertLength(styleChanges, 2);
});

// event listener tests
test('adds event listeners', () => {
  const div = new MockElement('div', doc);
  div.addEventListener('click', () => {});
  const listeners = div.getEventListeners();
  assertTrue(listeners.has('click'));
  assertLength(listeners.get('click'), 1);
});

test('removes event listeners', () => {
  const div = new MockElement('div', doc);
  const handler = () => {};
  div.addEventListener('click', handler);
  div.removeEventListener('click', handler);
  const listeners = div.getEventListeners();
  assertLength(listeners.get('click'), 0);
});

test('dispatches events', () => {
  const div = new MockElement('div', doc);
  let called = false;
  div.addEventListener('click', () => { called = true; });
  div.dispatchEvent({ type: 'click' });
  assertTrue(called);
});

test('tracks event listener registration', () => {
  const div = new MockElement('div', doc);
  div.addEventListener('click', () => {});
  div.addEventListener('keydown', () => {});
  const interactions = div.getInteractions();
  const eventRegistrations = interactions.filter(i => i.type === 'addEventListener');
  assertLength(eventRegistrations, 2);
});

// focus/blur tests
test('tracks focus', () => {
  doc = new MockDocument();
  const btn = new MockElement('button', doc);
  btn.focus();
  assertTrue(btn.hasFocus());
  assertEqual(doc.activeElement, btn);
});

test('tracks blur', () => {
  doc = new MockDocument();
  const btn = new MockElement('button', doc);
  btn.focus();
  btn.blur();
  assertFalse(btn.hasFocus());
});

test('moves focus between elements', () => {
  doc = new MockDocument();
  const btn1 = new MockElement('button', doc);
  const btn2 = new MockElement('button', doc);
  btn1.focus();
  assertTrue(btn1.hasFocus());
  btn2.focus();
  assertFalse(btn1.hasFocus());
  assertTrue(btn2.hasFocus());
  assertEqual(doc.activeElement, btn2);
});

// DOM manipulation tests
test('appends children', () => {
  const parent = new MockElement('div', doc);
  const child = new MockElement('span', doc);
  parent.appendChild(child);
  assertLength(parent.children, 1);
  assertEqual(child.parentNode, parent);
});

test('removes children', () => {
  const parent = new MockElement('div', doc);
  const child = new MockElement('span', doc);
  parent.appendChild(child);
  parent.removeChild(child);
  assertLength(parent.children, 0);
  assertNull(child.parentNode);
});

test('inserts before', () => {
  const parent = new MockElement('div', doc);
  const child1 = new MockElement('span', doc);
  const child2 = new MockElement('span', doc);
  parent.appendChild(child1);
  parent.insertBefore(child2, child1);
  assertEqual(parent.children[0], child2);
  assertEqual(parent.children[1], child1);
});

test('replaces children', () => {
  const parent = new MockElement('div', doc);
  const oldChild = new MockElement('span', doc);
  const newChild = new MockElement('p', doc);
  parent.appendChild(oldChild);
  parent.replaceChild(newChild, oldChild);
  assertEqual(parent.children[0], newChild);
  assertNull(oldChild.parentNode);
});

test('updates sibling pointers', () => {
  const parent = new MockElement('div', doc);
  const child1 = new MockElement('span', doc);
  const child2 = new MockElement('span', doc);
  const child3 = new MockElement('span', doc);
  parent.appendChild(child1);
  parent.appendChild(child2);
  parent.appendChild(child3);
  assertEqual(parent.firstChild, child1);
  assertEqual(parent.lastChild, child3);
  assertEqual(child1.nextSibling, child2);
  assertEqual(child2.previousSibling, child1);
  assertEqual(child2.nextSibling, child3);
});

test('clones elements', () => {
  const div = new MockElement('div', doc);
  div.id = 'original';
  div.className = 'foo bar';
  div.setAttribute('data-test', 'value');
  const clone = div.cloneNode();
  assertEqual(clone.id, 'original');
  assertEqual(clone.className, 'foo bar');
  assertEqual(clone.getAttribute('data-test'), 'value');
});

test('clones deeply', () => {
  const parent = new MockElement('div', doc);
  const child = new MockElement('span', doc);
  parent.appendChild(child);
  const clone = parent.cloneNode(true);
  assertLength(clone.children, 1);
  assertEqual(clone.children[0].tagName, 'SPAN');
});

// query tests
test('queries by id', () => {
  const parent = new MockElement('div', doc);
  const child = new MockElement('span', doc);
  child.id = 'mySpan';
  parent.appendChild(child);
  const found = parent.querySelector('#mySpan');
  assertEqual(found, child);
});

test('queries by class', () => {
  const parent = new MockElement('div', doc);
  const child = new MockElement('span', doc);
  child.classList.add('highlight');
  parent.appendChild(child);
  const found = parent.querySelector('.highlight');
  assertEqual(found, child);
});

test('queries by tag', () => {
  const parent = new MockElement('div', doc);
  const child = new MockElement('span', doc);
  parent.appendChild(child);
  const found = parent.querySelector('span');
  assertEqual(found, child);
});

test('queries all matching elements', () => {
  const parent = new MockElement('div', doc);
  const child1 = new MockElement('span', doc);
  const child2 = new MockElement('span', doc);
  parent.appendChild(child1);
  parent.appendChild(child2);
  const found = parent.querySelectorAll('span');
  assertLength(found, 2);
});

test('queries by attribute', () => {
  const parent = new MockElement('div', doc);
  const child = new MockElement('button', doc);
  child.setAttribute('type', 'submit');
  parent.appendChild(child);
  const found = parent.querySelector('[type="submit"]');
  assertEqual(found, child);
});

// accessibility helpers
test('identifies focusable elements', () => {
  const btn = new MockElement('button', doc);
  const div = new MockElement('div', doc);
  const divWithTabindex = new MockElement('div', doc);
  divWithTabindex.setAttribute('tabindex', '0');
  assertTrue(btn.isFocusable());
  assertFalse(div.isFocusable());
  assertTrue(divWithTabindex.isFocusable());
});

test('handles disabled elements', () => {
  const btn = new MockElement('button', doc);
  btn.setAttribute('disabled', '');
  assertFalse(btn.isFocusable());
});

test('gets accessible name from aria-label', () => {
  const btn = new MockElement('button', doc);
  btn.ariaLabel = 'Close dialog';
  assertEqual(btn.getAccessibleName(), 'Close dialog');
});

test('gets accessible name from text content', () => {
  const btn = new MockElement('button', doc);
  btn.textContent = 'Submit';
  assertEqual(btn.getAccessibleName(), 'Submit');
});

// === MockDocument Tests ===
console.log('\n  MockDocument');

test('has document element', () => {
  const d = new MockDocument();
  assertExists(d.documentElement);
  assertEqual(d.documentElement.tagName, 'HTML');
});

test('has head and body', () => {
  const d = new MockDocument();
  assertExists(d.head);
  assertEqual(d.head.tagName, 'HEAD');
  assertExists(d.body);
  assertEqual(d.body.tagName, 'BODY');
});

test('has correct node type', () => {
  const d = new MockDocument();
  assertEqual(d.nodeType, 9);
  assertEqual(d.nodeName, '#document');
});

test('creates elements', () => {
  const d = new MockDocument();
  const div = d.createElement('div');
  assertEqual(div.tagName, 'DIV');
  assertEqual(div.ownerDocument, d);
});

test('creates text nodes', () => {
  const d = new MockDocument();
  const text = d.createTextNode('Hello');
  assertEqual(text.nodeType, 3);
  assertEqual(text.textContent, 'Hello');
});

test('creates document fragments', () => {
  const d = new MockDocument();
  const frag = d.createDocumentFragment();
  assertEqual(frag.nodeType, 11);
});

test('finds element by id', () => {
  const d = new MockDocument();
  const div = d.createElement('div');
  div.id = 'myDiv';
  d.body.appendChild(div);
  const found = d.getElementById('myDiv');
  assertEqual(found, div);
});

test('caches elements by id', () => {
  const d = new MockDocument();
  const div = d.createElement('div');
  div.id = 'myDiv';
  d.body.appendChild(div);
  d.getElementById('myDiv');
  d.getElementById('myDiv');
  assertEqual(d._elementsById.get('myDiv'), div);
});

test('queries with querySelector', () => {
  const d = new MockDocument();
  const div = d.createElement('div');
  div.classList.add('test');
  d.body.appendChild(div);
  const found = d.querySelector('.test');
  assertEqual(found, div);
});

test('queries with querySelectorAll', () => {
  const d = new MockDocument();
  const div1 = d.createElement('div');
  const div2 = d.createElement('div');
  div1.classList.add('item');
  div2.classList.add('item');
  d.body.appendChild(div1);
  d.body.appendChild(div2);
  const found = d.querySelectorAll('.item');
  assertLength(found, 2);
});

test('tracks active element', () => {
  const d = new MockDocument();
  const btn = d.createElement('button');
  d.body.appendChild(btn);
  btn.focus();
  assertEqual(d.activeElement, btn);
});

test('defaults to body', () => {
  const d = new MockDocument();
  assertEqual(d.activeElement, d.body);
});

test('always reports having focus', () => {
  const d = new MockDocument();
  assertTrue(d.hasFocus());
});

test('adds and dispatches event listeners', () => {
  const d = new MockDocument();
  let called = false;
  d.addEventListener('click', () => { called = true; });
  d.dispatchEvent({ type: 'click' });
  assertTrue(called);
});

test('builds element from structure', () => {
  const d = new MockDocument();
  const elem = d.buildElement({
    tag: 'div',
    id: 'container',
    className: 'wrapper',
    textContent: 'Hello'
  });
  assertEqual(elem.tagName, 'DIV');
  assertEqual(elem.id, 'container');
  assertTrue(elem.classList.contains('wrapper'));
  assertEqual(elem.textContent, 'Hello');
});

test('builds nested elements', () => {
  const d = new MockDocument();
  const elem = d.buildElement({
    tag: 'div',
    children: [
      { tag: 'span', textContent: 'Child 1' },
      { tag: 'span', textContent: 'Child 2' }
    ]
  });
  assertLength(elem.children, 2);
  assertEqual(elem.children[0].textContent, 'Child 1');
});

test('creates button pattern', () => {
  const d = new MockDocument();
  const btn = d.createPattern('button', { label: 'Click me' });
  assertEqual(btn.tagName, 'BUTTON');
  assertEqual(btn.textContent, 'Click me');
});

test('creates dialog pattern', () => {
  const d = new MockDocument();
  const dialog = d.createPattern('dialog', { title: 'Confirm' });
  assertEqual(dialog.getAttribute('role'), 'dialog');
  assertEqual(dialog.getAttribute('aria-modal'), 'true');
});

test('creates menu pattern', () => {
  const d = new MockDocument();
  const menu = d.createPattern('menu', { items: ['Open', 'Save', 'Close'] });
  assertEqual(menu.getAttribute('role'), 'menu');
  assertLength(menu.children, 3);
});

test('creates toast pattern', () => {
  const d = new MockDocument();
  const toast = d.createPattern('toast', { message: 'Saved!' });
  assertEqual(toast.getAttribute('role'), 'alert');
  assertEqual(toast.textContent, 'Saved!');
});

test('tracks document interactions', () => {
  const d = new MockDocument();
  d.getElementById('test');
  d.querySelector('.foo');
  const interactions = d.getInteractions();
  assertGreater(interactions.length, 0);
});

test('gets focus history', () => {
  const d = new MockDocument();
  const btn1 = d.createElement('button');
  const btn2 = d.createElement('button');
  d.body.appendChild(btn1);
  d.body.appendChild(btn2);
  btn1.focus();
  btn2.focus();
  const focusHistory = d.getFocusHistory();
  assertGreater(focusHistory.length, 0);
});

test('gets ARIA changes', () => {
  const d = new MockDocument();
  const btn = d.createElement('button');
  d.body.appendChild(btn);  // Must add to document tree for getAllInteractions to find it
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-expanded', 'true');
  const ariaChanges = d.getAriaChanges();
  assertGreater(ariaChanges.length, 0);
});

test('clears interactions', () => {
  const d = new MockDocument();
  d.getElementById('test');
  d.clearInteractions();
  assertLength(d.getInteractions(), 0);
});

// === MockWindow Tests ===
console.log('\n  MockWindow');

test('has document', () => {
  const w = new MockWindow();
  assertExists(w.document);
  assertTrue(w.document instanceof MockDocument);
});

test('has self references', () => {
  const w = new MockWindow();
  assertEqual(w.window, w);
  assertEqual(w.self, w);
});

test('has location', () => {
  const w = new MockWindow();
  assertEqual(w.location.href, 'http://localhost/');
  assertEqual(w.location.protocol, 'http:');
});

test('has navigator', () => {
  const w = new MockWindow();
  assertExists(w.navigator.userAgent);
  assertEqual(w.navigator.language, 'en-US');
});

test('has screen dimensions', () => {
  const w = new MockWindow();
  assertGreater(w.screen.width, 0);
  assertGreater(w.innerWidth, 0);
});

test('sets timeout', () => {
  const w = new MockWindow();
  const id = w.setTimeout(() => {}, 100);
  assertGreater(id, 0);
});

test('clears timeout', () => {
  const w = new MockWindow();
  const id = w.setTimeout(() => {}, 100);
  w.clearTimeout(id);
  const timer = w._timers.get(id);
  assertTrue(timer.cancelled);
});

test('sets interval', () => {
  const w = new MockWindow();
  const id = w.setInterval(() => {}, 100);
  assertGreater(id, 0);
  w.clearInterval(id);
});

test('clears interval', () => {
  const w = new MockWindow();
  const id = w.setInterval(() => {}, 100);
  w.clearInterval(id);
  const interval = w._timers.get(id);
  assertTrue(interval.cancelled);
});

test('executes timers manually', () => {
  const w = new MockWindow();
  let value = 0;
  w.setTimeout(() => { value = 1; }, 100);
  w.executeTimers();
  assertEqual(value, 1);
});

test('ticks intervals', () => {
  const w = new MockWindow();
  let count = 0;
  const id = w.setInterval(() => { count++; }, 100);
  w.tickInterval(id);
  w.tickInterval(id);
  assertEqual(count, 2);
});

test('tracks timer interactions', () => {
  const w = new MockWindow();
  w.setTimeout(() => {}, 1000);
  w.setInterval(() => {}, 5000);
  const interactions = w.getInteractions();
  const timerOps = interactions.filter(i =>
    i.type === 'setTimeout' || i.type === 'setInterval'
  );
  assertLength(timerOps, 2);
});

test('requests animation frame', () => {
  const w = new MockWindow();
  const id = w.requestAnimationFrame(() => {});
  assertGreater(id, 0);
});

test('cancels animation frame', () => {
  const w = new MockWindow();
  const id = w.requestAnimationFrame(() => {});
  w.cancelAnimationFrame(id);
  const frame = w._timers.get(id);
  assertTrue(frame.cancelled);
});

test('adds event listeners', () => {
  const w = new MockWindow();
  let called = false;
  w.addEventListener('resize', () => { called = true; });
  w.dispatchEvent({ type: 'resize' });
  assertTrue(called);
});

test('tracks alert', () => {
  const w = new MockWindow();
  w.alert('Hello');
  const interactions = w.getInteractions();
  const alerts = interactions.filter(i => i.type === 'alert');
  assertLength(alerts, 1);
  assertEqual(alerts[0].details.message, 'Hello');
});

test('tracks confirm and returns true', () => {
  const w = new MockWindow();
  const result = w.confirm('Are you sure?');
  assertTrue(result);
});

test('tracks prompt and returns default', () => {
  const w = new MockWindow();
  const result = w.prompt('Name?', 'John');
  assertEqual(result, 'John');
});

test('scrolls to position', () => {
  const w = new MockWindow();
  w.scrollTo(100, 200);
  assertEqual(w.scrollX, 100);
  assertEqual(w.scrollY, 200);
});

test('scrolls by offset', () => {
  const w = new MockWindow();
  w.scrollTo(100, 100);
  w.scrollBy(50, 25);
  assertEqual(w.scrollX, 150);
  assertEqual(w.scrollY, 125);
});

test('tracks window.open', () => {
  const w = new MockWindow();
  w.open('http://example.com', '_blank');
  const interactions = w.getInteractions();
  const opens = interactions.filter(i => i.type === 'window.open');
  assertLength(opens, 1);
});

test('gets and sets localStorage items', () => {
  const w = new MockWindow();
  w.localStorage.setItem('key', 'value');
  assertEqual(w.localStorage.getItem('key'), 'value');
});

test('removes localStorage items', () => {
  const w = new MockWindow();
  w.localStorage.setItem('key', 'value');
  w.localStorage.removeItem('key');
  assertNull(w.localStorage.getItem('key'));
});

test('clears localStorage', () => {
  const w = new MockWindow();
  w.localStorage.setItem('key1', 'value1');
  w.localStorage.setItem('key2', 'value2');
  w.localStorage.clear();
  assertEqual(w.localStorage.length, 0);
});

test('has sessionStorage', () => {
  const w = new MockWindow();
  w.sessionStorage.setItem('session', 'data');
  assertEqual(w.sessionStorage.getItem('session'), 'data');
});

test('getComputedStyle returns style object', () => {
  const w = new MockWindow();
  const elem = w.document.createElement('div');
  elem.style.display = 'none';
  const computed = w.getComputedStyle(elem);
  assertEqual(computed.display, 'none');
});

test('matchMedia returns media query result', () => {
  const w = new MockWindow();
  const mq = w.matchMedia('(min-width: 768px)');
  assertEqual(mq.media, '(min-width: 768px)');
  assertFalse(mq.matches);
});

test('analyzes timers', () => {
  const w = new MockWindow();
  w.setTimeout(() => {}, 1000);
  w.setTimeout(() => {}, 100);
  w.setInterval(() => {}, 5000);
  w.setInterval(() => {}, 120000);
  const analysis = w.getTimerAnalysis();
  assertLength(analysis.timeouts, 2);
  assertLength(analysis.intervals, 2);
  assertLength(analysis.shortTimeouts, 2);
  assertLength(analysis.longIntervals, 1);
});

test('gets all interactions including document', () => {
  const w = new MockWindow();
  w.setTimeout(() => {}, 100);
  w.document.getElementById('test');
  const all = w.getAllInteractions();
  assertGreater(all.length, 1);
});

test('clears all interactions', () => {
  const w = new MockWindow();
  w.setTimeout(() => {}, 100);
  w.document.getElementById('test');
  w.clearInteractions();
  assertLength(w.getInteractions(), 0);
  assertLength(w.document.getInteractions(), 0);
});

// === createDOMEnvironment Tests ===
console.log('\n  createDOMEnvironment');

test('creates complete environment', () => {
  const { window, document } = createDOMEnvironment();
  assertTrue(window instanceof MockWindow);
  assertTrue(document instanceof MockDocument);
  assertEqual(window.document, document);
});

// === ExecutionEngine DOM Integration Tests ===
console.log('\n  ExecutionEngine DOM Integration');

test('provides window global', () => {
  const { result } = executeWithDOM('typeof window');
  assertEqual(result, 'object');
});

test('provides document global', () => {
  const { result } = executeWithDOM('typeof document');
  assertEqual(result, 'object');
});

test('provides setTimeout', () => {
  const { result } = executeWithDOM('typeof setTimeout');
  assertEqual(result, 'function');
});

test('creates elements', () => {
  const { result } = executeWithDOM(`
    const div = document.createElement('div');
    div.tagName
  `);
  assertEqual(result, 'DIV');
});

test('manipulates DOM', () => {
  const { result } = executeWithDOM(`
    const btn = document.createElement('button');
    btn.id = 'myBtn';
    btn.textContent = 'Click';
    document.body.appendChild(btn);
    document.getElementById('myBtn').textContent
  `);
  assertEqual(result, 'Click');
});

test('tracks focus', () => {
  const { engine } = executeWithDOM(`
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    btn.focus();
  `);
  const focusHistory = engine.document.getFocusHistory();
  assertTrue(focusHistory.some(f => f.type === 'focus'));
});

test('tracks ARIA changes', () => {
  const { engine } = executeWithDOM(`
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-expanded', 'true');
  `);
  const ariaChanges = engine.document.getAriaChanges();
  assertLength(ariaChanges, 2);
});

test('tracks timers', () => {
  const { engine } = executeWithDOM(`
    setTimeout(function() {}, 1000);
    setInterval(function() {}, 5000);
  `);
  const timerAnalysis = engine.window.getTimerAnalysis();
  assertLength(timerAnalysis.timeouts, 1);
  assertLength(timerAnalysis.intervals, 1);
});

test('tracks event listeners', () => {
  const { engine } = executeWithDOM(`
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    btn.addEventListener('click', function() {});
    btn.addEventListener('keydown', function() {});
  `);
  const registrations = engine.document.getEventListenerRegistrations();
  assertGreater(registrations.length, 0);
});

// Print results
console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
