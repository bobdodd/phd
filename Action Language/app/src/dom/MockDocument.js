/**
 * MockDocument - Simulates the DOM Document for accessibility analysis
 *
 * Provides document-level APIs for:
 * - Element creation
 * - Element queries (getElementById, querySelector, etc.)
 * - Focus tracking (activeElement)
 * - Event handling
 */

const MockElement = require('./MockElement');

class MockDocument {
  constructor() {
    // Document properties
    this.nodeType = 9; // DOCUMENT_NODE
    this.nodeName = '#document';

    // Create default structure
    this.documentElement = new MockElement('HTML', this);
    this.head = new MockElement('HEAD', this);
    this.body = new MockElement('BODY', this);

    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);

    // Focus tracking
    this._focusedElement = null;

    // Event listeners at document level
    this._eventListeners = new Map();

    // All elements by ID for fast lookup
    this._elementsById = new Map();

    // Interaction tracking
    this._interactions = [];

    // Title
    this.title = '';

    // Ready state
    this.readyState = 'complete';
  }

  // === Element Creation ===

  createElement(tagName) {
    const element = new MockElement(tagName, this);
    this._trackInteraction('createElement', { tagName });
    return element;
  }

  createTextNode(text) {
    return {
      nodeType: 3, // TEXT_NODE
      nodeName: '#text',
      textContent: text,
      data: text
    };
  }

  createDocumentFragment() {
    const fragment = {
      nodeType: 11, // DOCUMENT_FRAGMENT_NODE
      nodeName: '#document-fragment',
      childNodes: [],
      children: [],
      appendChild(child) {
        this.childNodes.push(child);
        if (child.nodeType === 1) this.children.push(child);
        return child;
      },
      querySelectorAll() { return []; },
      querySelector() { return null; }
    };
    return fragment;
  }

  // === Element Queries ===

  getElementById(id) {
    // Check cache first
    if (this._elementsById.has(id)) {
      return this._elementsById.get(id);
    }

    // Search the tree
    const element = this._findById(this.documentElement, id);
    if (element) {
      this._elementsById.set(id, element);
    }

    this._trackInteraction('getElementById', { id, found: !!element });
    return element;
  }

  _findById(element, id) {
    if (element.id === id) return element;

    for (const child of element.children || []) {
      const found = this._findById(child, id);
      if (found) return found;
    }

    return null;
  }

  querySelector(selector) {
    this._trackInteraction('querySelector', { selector });
    return this.documentElement.querySelector(selector) ||
           this.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    this._trackInteraction('querySelectorAll', { selector });

    const results = [];
    const fromDoc = this.documentElement.querySelectorAll(selector);
    results.push(...fromDoc);

    return results;
  }

  getElementsByClassName(className) {
    this._trackInteraction('getElementsByClassName', { className });
    return this.querySelectorAll(`.${className}`);
  }

  getElementsByTagName(tagName) {
    this._trackInteraction('getElementsByTagName', { tagName });
    return this.querySelectorAll(tagName);
  }

  getElementsByName(name) {
    this._trackInteraction('getElementsByName', { name });
    return this.querySelectorAll(`[name="${name}"]`);
  }

  // === Focus Management ===

  get activeElement() {
    return this._focusedElement || this.body;
  }

  /**
   * Check if document has focus
   * @returns {boolean}
   */
  hasFocus() {
    return true; // Always considered focused in simulation
  }

  // === Event Methods ===

  addEventListener(type, listener, options = {}) {
    if (!this._eventListeners.has(type)) {
      this._eventListeners.set(type, []);
    }

    this._eventListeners.get(type).push({
      listener,
      options: typeof options === 'boolean' ? { capture: options } : options,
      timestamp: Date.now()
    });

    this._trackInteraction('document.addEventListener', { type });
  }

  removeEventListener(type, listener) {
    if (!this._eventListeners.has(type)) return;

    const listeners = this._eventListeners.get(type);
    const index = listeners.findIndex(l => l.listener === listener);

    if (index > -1) {
      listeners.splice(index, 1);
      this._trackInteraction('document.removeEventListener', { type });
    }
  }

  dispatchEvent(event) {
    const type = event.type || event;
    const listeners = this._eventListeners.get(type) || [];

    this._trackInteraction('document.dispatchEvent', { type });

    for (const { listener } of listeners) {
      if (typeof listener === 'function') {
        listener.call(this, event);
      }
    }

    return true;
  }

  // === Helper Methods ===

  /**
   * Register an element by ID (for fast lookup)
   * @param {MockElement} element
   */
  registerElement(element) {
    if (element.id) {
      this._elementsById.set(element.id, element);
    }
  }

  /**
   * Unregister an element
   * @param {MockElement} element
   */
  unregisterElement(element) {
    if (element.id) {
      this._elementsById.delete(element.id);
    }
  }

  /**
   * Build a simple DOM structure from HTML-like description
   * @param {Object} structure - { tag, id, children, ... }
   * @returns {MockElement}
   */
  buildElement(structure) {
    const element = this.createElement(structure.tag || 'div');

    if (structure.id) {
      element.id = structure.id;
      element.setAttribute('id', structure.id);
      this.registerElement(element);
    }

    if (structure.className) {
      element.className = structure.className;
      structure.className.split(/\s+/).forEach(c => element.classList.add(c));
    }

    if (structure.textContent) {
      element.textContent = structure.textContent;
    }

    if (structure.attributes) {
      for (const [name, value] of Object.entries(structure.attributes)) {
        element.setAttribute(name, value);
      }
    }

    if (structure.children) {
      for (const childStructure of structure.children) {
        const child = this.buildElement(childStructure);
        element.appendChild(child);
      }
    }

    return element;
  }

  /**
   * Create a common UI pattern for testing
   * @param {string} pattern - 'button', 'dialog', 'menu', etc.
   * @returns {MockElement}
   */
  createPattern(pattern, options = {}) {
    switch (pattern) {
      case 'button':
        return this.buildElement({
          tag: 'button',
          id: options.id || 'btn',
          textContent: options.label || 'Click me',
          attributes: {
            type: 'button',
            ...(options.ariaLabel && { 'aria-label': options.ariaLabel })
          }
        });

      case 'dialog':
        return this.buildElement({
          tag: 'div',
          id: options.id || 'dialog',
          attributes: {
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': options.labelledBy || 'dialog-title'
          },
          children: [
            {
              tag: 'h2',
              id: options.labelledBy || 'dialog-title',
              textContent: options.title || 'Dialog Title'
            },
            {
              tag: 'div',
              className: 'dialog-content',
              textContent: options.content || ''
            },
            {
              tag: 'button',
              id: 'dialog-close',
              textContent: 'Close',
              attributes: { 'aria-label': 'Close dialog' }
            }
          ]
        });

      case 'menu':
        const menuItems = options.items || ['Item 1', 'Item 2', 'Item 3'];
        return this.buildElement({
          tag: 'ul',
          id: options.id || 'menu',
          attributes: { role: 'menu' },
          children: menuItems.map((item, i) => ({
            tag: 'li',
            attributes: { role: 'menuitem', tabindex: i === 0 ? '0' : '-1' },
            textContent: item
          }))
        });

      case 'tabs':
        const tabs = options.tabs || ['Tab 1', 'Tab 2', 'Tab 3'];
        return this.buildElement({
          tag: 'div',
          className: 'tabs',
          children: [
            {
              tag: 'div',
              attributes: { role: 'tablist' },
              children: tabs.map((tab, i) => ({
                tag: 'button',
                id: `tab-${i}`,
                attributes: {
                  role: 'tab',
                  'aria-selected': i === 0 ? 'true' : 'false',
                  'aria-controls': `panel-${i}`,
                  tabindex: i === 0 ? '0' : '-1'
                },
                textContent: tab
              }))
            },
            ...tabs.map((tab, i) => ({
              tag: 'div',
              id: `panel-${i}`,
              attributes: {
                role: 'tabpanel',
                'aria-labelledby': `tab-${i}`,
                hidden: i !== 0 ? 'true' : undefined
              },
              textContent: `Content for ${tab}`
            }))
          ]
        });

      case 'toast':
        return this.buildElement({
          tag: 'div',
          id: options.id || 'toast',
          className: 'toast',
          attributes: {
            role: 'alert',
            'aria-live': options.priority || 'polite'
          },
          textContent: options.message || 'Notification'
        });

      default:
        return this.createElement('div');
    }
  }

  // === Interaction Tracking ===

  _trackInteraction(type, details = {}) {
    this._interactions.push({
      type,
      details,
      timestamp: Date.now()
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
   * Get all interactions from all elements
   * @returns {Array}
   */
  getAllInteractions() {
    const all = [...this._interactions];

    const collectFromElement = (element) => {
      if (element.getInteractions) {
        all.push(...element.getInteractions());
      }
      for (const child of element.children || []) {
        collectFromElement(child);
      }
    };

    collectFromElement(this.documentElement);
    return all.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Clear all tracked interactions
   */
  clearInteractions() {
    this._interactions = [];

    const clearFromElement = (element) => {
      if (element.clearInteractions) {
        element.clearInteractions();
      }
      for (const child of element.children || []) {
        clearFromElement(child);
      }
    };

    clearFromElement(this.documentElement);
  }

  /**
   * Get focus history
   * @returns {Array}
   */
  getFocusHistory() {
    return this.getAllInteractions().filter(i =>
      i.type === 'focus' || i.type === 'blur'
    );
  }

  /**
   * Get all event listener registrations
   * @returns {Array}
   */
  getEventListenerRegistrations() {
    return this.getAllInteractions().filter(i =>
      i.type === 'addEventListener' || i.type === 'document.addEventListener'
    );
  }

  /**
   * Get all ARIA attribute changes
   * @returns {Array}
   */
  getAriaChanges() {
    return this.getAllInteractions().filter(i =>
      i.type === 'setAttribute.aria'
    );
  }

  toString() {
    return '[MockDocument]';
  }
}

module.exports = MockDocument;
