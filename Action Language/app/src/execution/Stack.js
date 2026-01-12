/**
 * Stack - Base class for execution stacks with scope chain support
 *
 * Stacks can be linked to parent stacks to implement scope chains.
 * When searching for values, the stack walks up the chain.
 * When a scope exits, the stack is unlinked.
 */

class Stack {
  /**
   * Create a new Stack
   * @param {Stack} [parent=null] - Parent stack for scope chaining
   */
  constructor(parent = null) {
    this.items = new Map();
    this.parent = parent;
  }

  /**
   * Push an item onto the stack
   * @param {string} name - The item name/key
   * @param {*} value - The item value
   * @throws {Error} If name already exists in current scope
   */
  push(name, value) {
    if (this.items.has(name)) {
      throw new Error(`Duplicate declaration in current scope: ${name}`);
    }
    this.items.set(name, value);
  }

  /**
   * Push or update an item (no duplicate error)
   * @param {string} name
   * @param {*} value
   */
  set(name, value) {
    this.items.set(name, value);
  }

  /**
   * Get an item from current scope only
   * @param {string} name
   * @returns {*} The value or undefined
   */
  getLocal(name) {
    return this.items.get(name);
  }

  /**
   * Check if item exists in current scope only
   * @param {string} name
   * @returns {boolean}
   */
  hasLocal(name) {
    return this.items.has(name);
  }

  /**
   * Get an item, searching up the scope chain
   * @param {string} name
   * @returns {*} The value or undefined
   */
  get(name) {
    if (this.items.has(name)) {
      return this.items.get(name);
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    return undefined;
  }

  /**
   * Check if item exists anywhere in scope chain
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    if (this.items.has(name)) {
      return true;
    }
    if (this.parent) {
      return this.parent.has(name);
    }
    return false;
  }

  /**
   * Update an existing item in the scope chain
   * @param {string} name
   * @param {*} value
   * @returns {boolean} True if updated, false if not found
   */
  update(name, value) {
    if (this.items.has(name)) {
      this.items.set(name, value);
      return true;
    }
    if (this.parent) {
      return this.parent.update(name, value);
    }
    return false;
  }

  /**
   * Delete an item from current scope
   * @param {string} name
   * @returns {boolean}
   */
  delete(name) {
    return this.items.delete(name);
  }

  /**
   * Get all names in current scope
   * @returns {string[]}
   */
  localNames() {
    return Array.from(this.items.keys());
  }

  /**
   * Get all names visible in scope chain
   * @returns {string[]}
   */
  allNames() {
    const names = new Set(this.items.keys());
    if (this.parent) {
      for (const name of this.parent.allNames()) {
        names.add(name);
      }
    }
    return Array.from(names);
  }

  /**
   * Get the depth of this stack in the scope chain
   * @returns {number}
   */
  depth() {
    let d = 0;
    let current = this;
    while (current.parent) {
      d++;
      current = current.parent;
    }
    return d;
  }

  /**
   * Create a new child scope
   * @returns {Stack}
   */
  createChildScope() {
    return new this.constructor(this);
  }

  /**
   * Clear current scope items
   */
  clear() {
    this.items.clear();
  }

  /**
   * Get count of items in current scope
   * @returns {number}
   */
  size() {
    return this.items.size;
  }

  /**
   * Debug: print scope chain
   * @returns {string}
   */
  toString() {
    const lines = [];
    let current = this;
    let level = 0;

    while (current) {
      lines.push(`[Scope ${level}] ${current.items.size} items: ${Array.from(current.items.keys()).join(', ')}`);
      current = current.parent;
      level++;
    }

    return lines.join('\n');
  }
}

/**
 * VariableStack - Stack for variable storage
 */
class VariableStack extends Stack {
  constructor(parent = null) {
    super(parent);
  }

  /**
   * Declare a variable
   * @param {string} name
   * @param {*} value
   * @param {string} [kind='let'] - 'var', 'let', or 'const'
   */
  declare(name, value, kind = 'let') {
    this.push(name, { value, kind, initialized: true });
  }

  /**
   * Get variable value
   * @param {string} name
   * @returns {*}
   */
  getValue(name) {
    const entry = this.get(name);
    if (!entry) {
      throw new Error(`Variable not defined: ${name}`);
    }
    return entry.value;
  }

  /**
   * Set variable value
   * @param {string} name
   * @param {*} value
   */
  setValue(name, value) {
    const entry = this.get(name);
    if (!entry) {
      throw new Error(`Variable not defined: ${name}`);
    }
    if (entry.kind === 'const') {
      throw new Error(`Cannot reassign constant: ${name}`);
    }
    // Update in the correct scope
    this.updateValue(name, value);
  }

  /**
   * Update value in scope chain
   * @private
   */
  updateValue(name, value) {
    if (this.items.has(name)) {
      const entry = this.items.get(name);
      entry.value = value;
      return true;
    }
    if (this.parent instanceof VariableStack) {
      return this.parent.updateValue(name, value);
    }
    return false;
  }
}

/**
 * ConstantStack - Stack for constant storage (immutable after declaration)
 */
class ConstantStack extends Stack {
  constructor(parent = null) {
    super(parent);
  }

  /**
   * Declare a constant
   * @param {string} name
   * @param {*} value
   */
  declare(name, value) {
    this.push(name, { value, frozen: true });
  }

  /**
   * Get constant value
   * @param {string} name
   * @returns {*}
   */
  getValue(name) {
    const entry = this.get(name);
    if (!entry) {
      throw new Error(`Constant not defined: ${name}`);
    }
    return entry.value;
  }
}

/**
 * FunctionStack - Stack for function declarations
 */
class FunctionStack extends Stack {
  constructor(parent = null) {
    super(parent);
  }

  /**
   * Declare a function
   * @param {string} name
   * @param {Object} funcDef - Function definition { params, body, closure }
   */
  declare(name, funcDef) {
    this.push(name, funcDef);
  }

  /**
   * Get function definition
   * @param {string} name
   * @returns {Object}
   */
  getFunction(name) {
    const func = this.get(name);
    if (!func) {
      throw new Error(`Function not defined: ${name}`);
    }
    return func;
  }
}

/**
 * CallStack - Stack for tracking function calls (call frames)
 */
class CallStack extends Stack {
  constructor(parent = null) {
    super(parent);
    this.frames = [];
  }

  /**
   * Push a new call frame
   * @param {Object} frame - { functionName, args, returnAddress }
   */
  pushFrame(frame) {
    this.frames.push({
      ...frame,
      timestamp: Date.now()
    });
  }

  /**
   * Pop the current call frame
   * @returns {Object}
   */
  popFrame() {
    return this.frames.pop();
  }

  /**
   * Get current call frame
   * @returns {Object}
   */
  currentFrame() {
    return this.frames[this.frames.length - 1];
  }

  /**
   * Get call stack depth
   * @returns {number}
   */
  callDepth() {
    return this.frames.length;
  }

  /**
   * Get stack trace
   * @returns {string[]}
   */
  getStackTrace() {
    return this.frames.map((frame, i) =>
      `  at ${frame.functionName || '<anonymous>'} (frame ${i})`
    ).reverse();
  }
}

/**
 * ExecutionContext - Combines all stacks for a complete execution context
 */
class ExecutionContext {
  constructor(parent = null) {
    this.variables = parent ? parent.variables.createChildScope() : new VariableStack();
    this.constants = parent ? parent.constants.createChildScope() : new ConstantStack();
    this.functions = parent ? parent.functions.createChildScope() : new FunctionStack();
    this.callStack = parent ? parent.callStack : new CallStack();
    this.parent = parent;
  }

  /**
   * Create a child context (for entering a new scope)
   * @returns {ExecutionContext}
   */
  createChildContext() {
    return new ExecutionContext(this);
  }

  /**
   * Get the scope depth
   * @returns {number}
   */
  depth() {
    return this.variables.depth();
  }
}

module.exports = {
  Stack,
  VariableStack,
  ConstantStack,
  FunctionStack,
  CallStack,
  ExecutionContext
};
