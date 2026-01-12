/**
 * ActionTree - Container and manager for an ActionLanguage program tree
 *
 * Provides high-level operations on the action tree including:
 * - Type and attribute type registries
 * - Tree-wide queries
 * - Modification tracking
 * - Validation
 */

const Action = require('./Action');

class ActionTree {
  /**
   * Create a new ActionTree
   * @param {Action} [root] - Optional root action
   */
  constructor(root = null) {
    this.root = root;
    this.actionTypes = new Set();
    this.attributeTypes = new Map(); // name -> { dataType, description }
    this.dataTypes = new Set(['String', 'Integer', 'Number', 'Boolean', 'Object', 'Array', 'Function', 'Null', 'Undefined']);
    this.metadata = {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      version: '1.0.0',
      source: null
    };
  }

  /**
   * Set the root action
   * @param {Action} action - The root action
   */
  setRoot(action) {
    this.root = action;
    this.metadata.modified = new Date().toISOString();
  }

  /**
   * Register an action type
   * @param {string} typeName - The action type name
   */
  registerActionType(typeName) {
    this.actionTypes.add(typeName);
  }

  /**
   * Register an attribute type
   * @param {string} name - The attribute type name (e.g., 'var.name')
   * @param {string} dataType - The data type (e.g., 'String')
   * @param {string} [description] - Optional description
   */
  registerAttributeType(name, dataType, description = '') {
    if (!this.dataTypes.has(dataType)) {
      throw new Error(`Unknown data type: ${dataType}`);
    }
    this.attributeTypes.set(name, { dataType, description });
  }

  /**
   * Register a custom data type
   * @param {string} typeName - The data type name
   */
  registerDataType(typeName) {
    this.dataTypes.add(typeName);
  }

  /**
   * Find an action by ID anywhere in the tree
   * @param {string} id - The action ID
   * @returns {Action|null}
   */
  findById(id) {
    if (!this.root) return null;
    return this.root.findById(id);
  }

  /**
   * Find all actions of a specific type
   * @param {string} actionType - The action type
   * @returns {Action[]}
   */
  findByType(actionType) {
    if (!this.root) return [];
    return this.root.findByType(actionType);
  }

  /**
   * Find actions matching a predicate
   * @param {Function} predicate - Function (action) => boolean
   * @returns {Action[]}
   */
  findWhere(predicate) {
    const results = [];
    if (this.root) {
      this.root.traverse(action => {
        if (predicate(action)) {
          results.push(action);
        }
      });
    }
    return results;
  }

  /**
   * Find actions with a specific attribute value
   * @param {string} attrKey - The attribute key
   * @param {*} attrValue - The attribute value to match
   * @returns {Action[]}
   */
  findByAttribute(attrKey, attrValue) {
    return this.findWhere(action =>
      action.hasAttribute(attrKey) && action.getAttribute(attrKey) === attrValue
    );
  }

  /**
   * Get all unique action types used in the tree
   * @returns {Set<string>}
   */
  getUsedActionTypes() {
    const types = new Set();
    if (this.root) {
      this.root.traverse(action => {
        types.add(action.actionType);
      });
    }
    return types;
  }

  /**
   * Count total actions in the tree
   * @returns {number}
   */
  countActions() {
    let count = 0;
    if (this.root) {
      this.root.traverse(() => count++);
    }
    return count;
  }

  /**
   * Get the maximum depth of the tree
   * @returns {number}
   */
  getMaxDepth() {
    let maxDepth = 0;
    if (this.root) {
      this.root.traverse((action, depth) => {
        if (depth > maxDepth) maxDepth = depth;
      });
    }
    return maxDepth;
  }

  /**
   * Traverse the entire tree
   * @param {Function} visitor - Function(action, depth)
   * @param {'depth-first'|'breadth-first'} [order='depth-first']
   */
  traverse(visitor, order = 'depth-first') {
    if (!this.root) return;

    if (order === 'breadth-first') {
      this.root.traverseBreadthFirst(visitor);
    } else {
      this.root.traverse(visitor);
    }
  }

  /**
   * Validate the tree structure
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate() {
    const errors = [];

    if (!this.root) {
      errors.push('Tree has no root action');
      return { valid: false, errors };
    }

    // Check for circular references
    const visited = new Set();
    let hasCircular = false;

    this.root.traverse(action => {
      if (visited.has(action.id)) {
        hasCircular = true;
        errors.push(`Circular reference detected at action ${action.id}`);
      }
      visited.add(action.id);
    });

    // Check parent-child consistency
    this.root.traverse(action => {
      for (const child of action.children) {
        if (child.parent !== action) {
          errors.push(`Parent-child mismatch: ${child.id} has wrong parent`);
        }
      }
    });

    // Check for unknown action types (if types are registered)
    if (this.actionTypes.size > 0) {
      this.root.traverse(action => {
        if (!this.actionTypes.has(action.actionType)) {
          errors.push(`Unknown action type: ${action.actionType}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a deep clone of the entire tree
   * @returns {ActionTree}
   */
  clone() {
    const cloned = new ActionTree();
    cloned.actionTypes = new Set(this.actionTypes);
    cloned.attributeTypes = new Map(this.attributeTypes);
    cloned.dataTypes = new Set(this.dataTypes);
    cloned.metadata = { ...this.metadata };

    if (this.root) {
      cloned.root = this.root.clone();
    }

    return cloned;
  }

  /**
   * Convert tree to a plain object
   * @returns {Object}
   */
  toObject() {
    return {
      metadata: this.metadata,
      actionTypes: Array.from(this.actionTypes),
      attributeTypes: Object.fromEntries(this.attributeTypes),
      dataTypes: Array.from(this.dataTypes),
      root: this.root ? this.root.toObject() : null
    };
  }

  /**
   * Create an ActionTree from a plain object
   * @param {Object} obj
   * @returns {ActionTree}
   */
  static fromObject(obj) {
    const tree = new ActionTree();

    if (obj.metadata) {
      tree.metadata = { ...obj.metadata };
    }

    if (obj.actionTypes) {
      tree.actionTypes = new Set(obj.actionTypes);
    }

    if (obj.attributeTypes) {
      tree.attributeTypes = new Map(Object.entries(obj.attributeTypes));
    }

    if (obj.dataTypes) {
      tree.dataTypes = new Set(obj.dataTypes);
    }

    if (obj.root) {
      tree.root = Action.fromObject(obj.root);
    }

    return tree;
  }

  /**
   * Convert to JSON string
   * @param {number} [indent=2] - Indentation spaces
   * @returns {string}
   */
  toJSON(indent = 2) {
    return JSON.stringify(this.toObject(), null, indent);
  }

  /**
   * Create from JSON string
   * @param {string} json
   * @returns {ActionTree}
   */
  static fromJSON(json) {
    return ActionTree.fromObject(JSON.parse(json));
  }

  /**
   * Print tree structure for debugging
   * @returns {string}
   */
  printTree() {
    const lines = [];

    if (!this.root) {
      return '(empty tree)';
    }

    this.root.traverse((action, depth) => {
      const indent = '  '.repeat(depth);
      const attrs = action.attributes.size > 0
        ? ` ${JSON.stringify(Object.fromEntries(action.attributes))}`
        : '';
      lines.push(`${indent}${action.actionType}${attrs}`);
    });

    return lines.join('\n');
  }
}

module.exports = ActionTree;
