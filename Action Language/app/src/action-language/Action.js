/**
 * Action - The fundamental node in the ActionLanguage tree
 *
 * Each Action represents an executable unit in the program tree.
 * Actions can have children (forming the tree structure), attributes,
 * and are typed according to their semantic role.
 */

let actionIdCounter = 0;

class Action {
  /**
   * Create a new Action
   * @param {string} actionType - The type of action (e.g., 'seq', 'if', 'declareVar')
   * @param {Object} attributes - Key-value pairs of action attributes
   * @param {Action[]} children - Child actions
   */
  constructor(actionType, attributes = {}, children = []) {
    this.id = `action-${++actionIdCounter}`;
    this.actionType = actionType;
    this.attributes = new Map(Object.entries(attributes));
    this.children = [];
    this.parent = null;
    this.sequenceNumber = 0;

    // Add children properly to set parent references
    children.forEach(child => this.addChild(child));
  }

  /**
   * Add a child action
   * @param {Action} child - The child action to add
   * @param {number} [sequenceNumber] - Optional sequence number (auto-assigned if not provided)
   * @returns {Action} The added child (for chaining)
   */
  addChild(child, sequenceNumber = null) {
    if (!(child instanceof Action)) {
      throw new Error('Child must be an Action instance');
    }

    child.parent = this;
    child.sequenceNumber = sequenceNumber !== null
      ? sequenceNumber
      : (this.children.length + 1) * 10;

    this.children.push(child);
    this.children.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    return child;
  }

  /**
   * Remove a child action
   * @param {Action} child - The child to remove
   * @returns {boolean} True if removed, false if not found
   */
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      child.parent = null;
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get an attribute value
   * @param {string} key - The attribute key
   * @returns {*} The attribute value or undefined
   */
  getAttribute(key) {
    return this.attributes.get(key);
  }

  /**
   * Set an attribute value
   * @param {string} key - The attribute key
   * @param {*} value - The attribute value
   */
  setAttribute(key, value) {
    this.attributes.set(key, value);
  }

  /**
   * Check if action has an attribute
   * @param {string} key - The attribute key
   * @returns {boolean}
   */
  hasAttribute(key) {
    return this.attributes.has(key);
  }

  /**
   * Get all attributes as a plain object
   * @returns {Object}
   */
  getAttributes() {
    return Object.fromEntries(this.attributes);
  }

  /**
   * Check if this action has children
   * @returns {boolean}
   */
  hasChildren() {
    return this.children.length > 0;
  }

  /**
   * Get the root of the tree this action belongs to
   * @returns {Action}
   */
  getRoot() {
    let node = this;
    while (node.parent) {
      node = node.parent;
    }
    return node;
  }

  /**
   * Get the depth of this action in the tree
   * @returns {number}
   */
  getDepth() {
    let depth = 0;
    let node = this;
    while (node.parent) {
      depth++;
      node = node.parent;
    }
    return depth;
  }

  /**
   * Find an action by ID in this subtree
   * @param {string} id - The action ID to find
   * @returns {Action|null}
   */
  findById(id) {
    if (this.id === id) return this;

    for (const child of this.children) {
      const found = child.findById(id);
      if (found) return found;
    }

    return null;
  }

  /**
   * Find all actions of a specific type in this subtree
   * @param {string} actionType - The action type to find
   * @returns {Action[]}
   */
  findByType(actionType) {
    const results = [];

    if (this.actionType === actionType) {
      results.push(this);
    }

    for (const child of this.children) {
      results.push(...child.findByType(actionType));
    }

    return results;
  }

  /**
   * Traverse the tree depth-first, calling visitor for each node
   * @param {Function} visitor - Function called with (action, depth) for each node
   * @param {number} [depth=0] - Current depth (used internally)
   */
  traverse(visitor, depth = 0) {
    visitor(this, depth);
    for (const child of this.children) {
      child.traverse(visitor, depth + 1);
    }
  }

  /**
   * Traverse the tree breadth-first
   * @param {Function} visitor - Function called with (action, depth) for each node
   */
  traverseBreadthFirst(visitor) {
    const queue = [{ action: this, depth: 0 }];

    while (queue.length > 0) {
      const { action, depth } = queue.shift();
      visitor(action, depth);

      for (const child of action.children) {
        queue.push({ action: child, depth: depth + 1 });
      }
    }
  }

  /**
   * Create a deep clone of this action and its subtree
   * @returns {Action}
   */
  clone() {
    const cloned = new Action(
      this.actionType,
      Object.fromEntries(this.attributes),
      []
    );

    // Clone children
    for (const child of this.children) {
      const clonedChild = child.clone();
      clonedChild.sequenceNumber = child.sequenceNumber;
      cloned.addChild(clonedChild, child.sequenceNumber);
    }

    return cloned;
  }

  /**
   * Convert this action to a plain object (for JSON serialization)
   * @returns {Object}
   */
  toObject() {
    return {
      id: this.id,
      actionType: this.actionType,
      attributes: Object.fromEntries(this.attributes),
      sequenceNumber: this.sequenceNumber,
      children: this.children.map(child => child.toObject())
    };
  }

  /**
   * Create an Action from a plain object
   * @param {Object} obj - The plain object
   * @returns {Action}
   */
  static fromObject(obj) {
    const action = new Action(
      obj.actionType,
      obj.attributes || {},
      []
    );

    if (obj.id) {
      action.id = obj.id;
    }

    if (obj.sequenceNumber !== undefined) {
      action.sequenceNumber = obj.sequenceNumber;
    }

    if (obj.children) {
      for (const childObj of obj.children) {
        const child = Action.fromObject(childObj);
        action.addChild(child, child.sequenceNumber);
      }
    }

    return action;
  }

  /**
   * String representation for debugging
   * @returns {string}
   */
  toString() {
    const attrs = this.attributes.size > 0
      ? ` ${JSON.stringify(Object.fromEntries(this.attributes))}`
      : '';
    return `Action<${this.actionType}${attrs}>[${this.children.length} children]`;
  }
}

// Reset ID counter (useful for testing)
Action.resetIdCounter = function() {
  actionIdCounter = 0;
};

module.exports = Action;
