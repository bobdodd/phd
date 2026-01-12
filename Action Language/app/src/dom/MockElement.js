/**
 * MockElement - Simulates a DOM Element for accessibility analysis
 *
 * Tracks all interactions including:
 * - Attribute changes (especially ARIA attributes)
 * - Event listener registration
 * - Focus/blur operations
 * - Style and class changes
 * - Child element manipulation
 */

class MockClassList {
  constructor(element) {
    this.element = element;
    this.classes = new Set();
  }

  add(...classNames) {
    for (const className of classNames) {
      this.classes.add(className);
      this.element._trackInteraction('classList.add', { className });
    }
  }

  remove(...classNames) {
    for (const className of classNames) {
      this.classes.delete(className);
      this.element._trackInteraction('classList.remove', { className });
    }
  }

  toggle(className, force) {
    if (force !== undefined) {
      if (force) {
        this.add(className);
      } else {
        this.remove(className);
      }
      return force;
    }

    if (this.classes.has(className)) {
      this.remove(className);
      return false;
    } else {
      this.add(className);
      return true;
    }
  }

  contains(className) {
    return this.classes.has(className);
  }

  replace(oldClass, newClass) {
    if (this.classes.has(oldClass)) {
      this.classes.delete(oldClass);
      this.classes.add(newClass);
      this.element._trackInteraction('classList.replace', { oldClass, newClass });
      return true;
    }
    return false;
  }

  get length() {
    return this.classes.size;
  }

  item(index) {
    return Array.from(this.classes)[index] || null;
  }

  toString() {
    return Array.from(this.classes).join(' ');
  }

  [Symbol.iterator]() {
    return this.classes[Symbol.iterator]();
  }
}

class MockStyle {
  constructor(element) {
    this.element = element;
    this.properties = new Map();

    // Return a proxy to track property access
    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) {
          return target[prop];
        }
        return target.properties.get(prop) || '';
      },
      set(target, prop, value) {
        if (prop === 'element' || prop === 'properties') {
          target[prop] = value;
          return true;
        }
        target.properties.set(prop, value);
        target.element._trackInteraction('style.set', { property: prop, value });
        return true;
      }
    });
  }

  setProperty(name, value, priority) {
    this.properties.set(name, value);
    this.element._trackInteraction('style.setProperty', { name, value, priority });
  }

  getPropertyValue(name) {
    return this.properties.get(name) || '';
  }

  removeProperty(name) {
    const value = this.properties.get(name);
    this.properties.delete(name);
    this.element._trackInteraction('style.removeProperty', { name });
    return value || '';
  }
}

class MockElement {
  /**
   * Create a MockElement
   * @param {string} tagName - The element tag name
   * @param {MockDocument} document - The owning document
   */
  constructor(tagName, document = null) {
    this.tagName = tagName.toUpperCase();
    this.nodeName = this.tagName;
    this.nodeType = 1; // ELEMENT_NODE
    this.ownerDocument = document;

    // Core properties
    this.id = '';
    this.className = '';
    this.textContent = '';
    this.innerHTML = '';

    // Attributes
    this._attributes = new Map();

    // Tree structure
    this.parentNode = null;
    this.parentElement = null;
    this.childNodes = [];
    this.children = [];
    this.firstChild = null;
    this.lastChild = null;
    this.nextSibling = null;
    this.previousSibling = null;

    // Style and classes
    this.classList = new MockClassList(this);
    this.style = new MockStyle(this);

    // Event listeners
    this._eventListeners = new Map();

    // Focus state
    this._focused = false;

    // Interaction tracking for analysis
    this._interactions = [];

    // ARIA properties (commonly accessed directly)
    this.role = '';
    this.ariaLabel = '';
    this.ariaDescribedBy = '';
    this.ariaHidden = '';
    this.ariaExpanded = '';
    this.ariaPressed = '';
    this.ariaSelected = '';
    this.ariaDisabled = '';
    this.ariaLive = '';
    this.ariaBusy = '';
  }

  // === Attribute Methods ===

  getAttribute(name) {
    // Check ARIA properties first
    if (name.startsWith('aria-')) {
      const propName = 'aria' + name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (this[propName] !== undefined && this[propName] !== '') {
        return this[propName];
      }
    }
    return this._attributes.get(name) || null;
  }

  setAttribute(name, value) {
    const oldValue = this._attributes.get(name);
    this._attributes.set(name, String(value));

    // Track ARIA attribute changes specially
    if (name.startsWith('aria-') || name === 'role') {
      this._trackInteraction('setAttribute.aria', { name, value, oldValue });
    } else {
      this._trackInteraction('setAttribute', { name, value, oldValue });
    }

    // Update direct properties
    if (name === 'id') this.id = value;
    if (name === 'class') {
      this.className = value;
      this.classList.classes = new Set(value.split(/\s+/).filter(Boolean));
    }
    if (name === 'role') this.role = value;

    // Update ARIA properties
    if (name.startsWith('aria-')) {
      const propName = 'aria' + name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      this[propName] = value;
    }
  }

  removeAttribute(name) {
    const oldValue = this._attributes.get(name);
    this._attributes.delete(name);
    this._trackInteraction('removeAttribute', { name, oldValue });

    if (name === 'id') this.id = '';
    if (name === 'class') {
      this.className = '';
      this.classList.classes.clear();
    }
  }

  hasAttribute(name) {
    return this._attributes.has(name);
  }

  getAttributeNames() {
    return Array.from(this._attributes.keys());
  }

  // === Event Methods ===

  addEventListener(type, listener, options = {}) {
    if (!this._eventListeners.has(type)) {
      this._eventListeners.set(type, []);
    }

    const listenerInfo = {
      listener,
      options: typeof options === 'boolean' ? { capture: options } : options,
      timestamp: Date.now()
    };

    this._eventListeners.get(type).push(listenerInfo);

    this._trackInteraction('addEventListener', {
      type,
      hasListener: true,
      options: listenerInfo.options
    });
  }

  removeEventListener(type, listener, options = {}) {
    if (!this._eventListeners.has(type)) return;

    const listeners = this._eventListeners.get(type);
    const index = listeners.findIndex(l => l.listener === listener);

    if (index > -1) {
      listeners.splice(index, 1);
      this._trackInteraction('removeEventListener', { type });
    }
  }

  dispatchEvent(event) {
    const type = event.type || event;
    const listeners = this._eventListeners.get(type) || [];

    this._trackInteraction('dispatchEvent', { type, listenerCount: listeners.length });

    for (const { listener } of listeners) {
      if (typeof listener === 'function') {
        listener.call(this, event);
      } else if (listener && typeof listener.handleEvent === 'function') {
        listener.handleEvent(event);
      }
    }

    return true;
  }

  /**
   * Get all registered event listeners (for analysis)
   * @returns {Map}
   */
  getEventListeners() {
    return new Map(this._eventListeners);
  }

  // === Focus Methods ===

  focus(options = {}) {
    const previouslyFocused = this.ownerDocument?._focusedElement;

    if (previouslyFocused && previouslyFocused !== this) {
      previouslyFocused._focused = false;
      previouslyFocused._trackInteraction('blur', { reason: 'focus-moved' });
    }

    this._focused = true;
    if (this.ownerDocument) {
      this.ownerDocument._focusedElement = this;
    }

    this._trackInteraction('focus', {
      previousElement: previouslyFocused?.tagName,
      preventScroll: options.preventScroll
    });
  }

  blur() {
    if (this._focused) {
      this._focused = false;
      if (this.ownerDocument?._focusedElement === this) {
        this.ownerDocument._focusedElement = null;
      }
      this._trackInteraction('blur', { reason: 'explicit' });
    }
  }

  /**
   * Check if element is currently focused
   * @returns {boolean}
   */
  hasFocus() {
    return this._focused;
  }

  // === DOM Manipulation ===

  appendChild(child) {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    child.parentNode = this;
    child.parentElement = this;
    this.childNodes.push(child);

    if (child.nodeType === 1) {
      this.children.push(child);
    }

    this._updateChildPointers();
    this._trackInteraction('appendChild', { childTag: child.tagName });

    return child;
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child);
    if (index > -1) {
      this.childNodes.splice(index, 1);

      const elemIndex = this.children.indexOf(child);
      if (elemIndex > -1) {
        this.children.splice(elemIndex, 1);
      }

      child.parentNode = null;
      child.parentElement = null;
      this._updateChildPointers();
      this._trackInteraction('removeChild', { childTag: child.tagName });

      return child;
    }
    throw new Error('Node not found');
  }

  insertBefore(newChild, refChild) {
    if (!refChild) {
      return this.appendChild(newChild);
    }

    const index = this.childNodes.indexOf(refChild);
    if (index === -1) {
      throw new Error('Reference node not found');
    }

    if (newChild.parentNode) {
      newChild.parentNode.removeChild(newChild);
    }

    newChild.parentNode = this;
    newChild.parentElement = this;
    this.childNodes.splice(index, 0, newChild);

    if (newChild.nodeType === 1) {
      const elemIndex = this.children.indexOf(refChild);
      this.children.splice(elemIndex, 0, newChild);
    }

    this._updateChildPointers();
    this._trackInteraction('insertBefore', { childTag: newChild.tagName });

    return newChild;
  }

  replaceChild(newChild, oldChild) {
    const index = this.childNodes.indexOf(oldChild);
    if (index === -1) {
      throw new Error('Node not found');
    }

    if (newChild.parentNode) {
      newChild.parentNode.removeChild(newChild);
    }

    newChild.parentNode = this;
    newChild.parentElement = this;
    oldChild.parentNode = null;
    oldChild.parentElement = null;

    this.childNodes[index] = newChild;

    const elemIndex = this.children.indexOf(oldChild);
    if (elemIndex > -1) {
      this.children[elemIndex] = newChild;
    }

    this._updateChildPointers();
    this._trackInteraction('replaceChild', {
      newTag: newChild.tagName,
      oldTag: oldChild.tagName
    });

    return oldChild;
  }

  cloneNode(deep = false) {
    const clone = new MockElement(this.tagName, this.ownerDocument);
    clone.id = this.id;
    clone.className = this.className;
    clone.textContent = this.textContent;

    for (const [name, value] of this._attributes) {
      clone._attributes.set(name, value);
    }

    for (const className of this.classList.classes) {
      clone.classList.classes.add(className);
    }

    if (deep) {
      for (const child of this.childNodes) {
        if (child.cloneNode) {
          clone.appendChild(child.cloneNode(true));
        }
      }
    }

    return clone;
  }

  _updateChildPointers() {
    this.firstChild = this.childNodes[0] || null;
    this.lastChild = this.childNodes[this.childNodes.length - 1] || null;

    for (let i = 0; i < this.childNodes.length; i++) {
      this.childNodes[i].previousSibling = this.childNodes[i - 1] || null;
      this.childNodes[i].nextSibling = this.childNodes[i + 1] || null;
    }
  }

  // === Query Methods ===

  querySelector(selector) {
    return this._querySelector(selector, false);
  }

  querySelectorAll(selector) {
    return this._querySelector(selector, true);
  }

  _querySelector(selector, all) {
    const results = [];

    // Simple selector parsing (id, class, tag)
    const traverse = (element) => {
      if (this._matchesSelector(element, selector)) {
        results.push(element);
        if (!all) return;
      }

      for (const child of element.children) {
        traverse(child);
        if (!all && results.length > 0) return;
      }
    };

    for (const child of this.children) {
      traverse(child);
      if (!all && results.length > 0) break;
    }

    return all ? results : (results[0] || null);
  }

  _matchesSelector(element, selector) {
    // Very basic selector matching
    if (selector.startsWith('#')) {
      return element.id === selector.slice(1);
    }
    if (selector.startsWith('.')) {
      return element.classList.contains(selector.slice(1));
    }
    if (selector.startsWith('[')) {
      const match = selector.match(/\[([^\]=]+)(?:="([^"]*)")?\]/);
      if (match) {
        const [, attr, value] = match;
        if (value !== undefined) {
          return element.getAttribute(attr) === value;
        }
        return element.hasAttribute(attr);
      }
    }
    return element.tagName.toLowerCase() === selector.toLowerCase();
  }

  matches(selector) {
    return this._matchesSelector(this, selector);
  }

  closest(selector) {
    let element = this;
    while (element) {
      if (element._matchesSelector && element._matchesSelector(element, selector)) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }

  getElementById(id) {
    return this.querySelector(`#${id}`);
  }

  getElementsByClassName(className) {
    return this.querySelectorAll(`.${className}`);
  }

  getElementsByTagName(tagName) {
    return this.querySelectorAll(tagName);
  }

  // === Accessibility Helpers ===

  /**
   * Check if element is focusable
   * @returns {boolean}
   */
  isFocusable() {
    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'AREA'];
    const tabIndex = this.getAttribute('tabindex');

    if (this.hasAttribute('disabled')) return false;
    if (tabIndex !== null && parseInt(tabIndex) >= 0) return true;
    if (focusableTags.includes(this.tagName)) return true;
    if (this.getAttribute('contenteditable') === 'true') return true;

    return false;
  }

  /**
   * Get accessible name (simplified)
   * @returns {string}
   */
  getAccessibleName() {
    // aria-label takes precedence
    if (this.ariaLabel) return this.ariaLabel;

    // aria-labelledby
    const labelledBy = this.getAttribute('aria-labelledby');
    if (labelledBy && this.ownerDocument) {
      const labelElement = this.ownerDocument.getElementById(labelledBy);
      if (labelElement) return labelElement.textContent;
    }

    // For inputs, check associated label
    if (this.tagName === 'INPUT' || this.tagName === 'SELECT' || this.tagName === 'TEXTAREA') {
      const id = this.id;
      if (id && this.ownerDocument) {
        const label = this.ownerDocument.querySelector(`label[for="${id}"]`);
        if (label) return label.textContent;
      }
    }

    // Fall back to text content for buttons, links
    if (this.tagName === 'BUTTON' || this.tagName === 'A') {
      return this.textContent;
    }

    return '';
  }

  // === Interaction Tracking ===

  _trackInteraction(type, details = {}) {
    this._interactions.push({
      type,
      details,
      timestamp: Date.now(),
      elementId: this.id,
      elementTag: this.tagName
    });
  }

  /**
   * Get all tracked interactions
   * @returns {Array}
   */
  getInteractions() {
    return [...this._interactions];
  }

  /**
   * Clear tracked interactions
   */
  clearInteractions() {
    this._interactions = [];
  }

  // === Common Properties ===

  get outerHTML() {
    const attrs = [];
    for (const [name, value] of this._attributes) {
      attrs.push(`${name}="${value}"`);
    }
    const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
    const tag = this.tagName.toLowerCase();

    if (this.children.length === 0 && !this.textContent) {
      return `<${tag}${attrStr} />`;
    }

    return `<${tag}${attrStr}>${this.innerHTML || this.textContent}</${tag}>`;
  }

  toString() {
    return `[MockElement ${this.tagName}${this.id ? '#' + this.id : ''}]`;
  }
}

module.exports = MockElement;
