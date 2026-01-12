/**
 * ExecutionEngine - Executes ActionLanguage trees
 *
 * This engine interprets ActionLanguage Action trees, managing scope,
 * evaluating expressions, and handling control flow.
 */

const { ExecutionContext } = require('./Stack');
const { createDOMEnvironment } = require('../dom');

/**
 * Special return value wrappers for control flow
 */
class ReturnValue {
  constructor(value) {
    this.value = value;
  }
}

class BreakSignal {
  constructor(label = null) {
    this.label = label;
  }
}

class ContinueSignal {
  constructor(label = null) {
    this.label = label;
  }
}

class ThrowSignal {
  constructor(error) {
    this.error = error;
  }
}

class ExecutionEngine {
  /**
   * Create a new ExecutionEngine
   * @param {Object} [options] - Engine options
   * @param {Object} [options.globals] - Global variables/functions to inject
   * @param {Function} [options.onOutput] - Callback for console output
   * @param {number} [options.maxIterations] - Max loop iterations (safety limit)
   * @param {number} [options.maxCallDepth] - Max call stack depth
   * @param {boolean} [options.enableDOM] - Enable DOM simulation
   * @param {Object} [options.domEnvironment] - Custom DOM environment
   */
  constructor(options = {}) {
    this.options = {
      maxIterations: options.maxIterations || 100000,
      maxCallDepth: options.maxCallDepth || 1000,
      onOutput: options.onOutput || console.log,
      globals: options.globals || {},
      enableDOM: options.enableDOM || false
    };

    this.context = new ExecutionContext();
    this.output = [];
    this.iterationCount = 0;

    // Initialize DOM environment if enabled
    if (this.options.enableDOM) {
      if (options.domEnvironment) {
        this.window = options.domEnvironment.window;
        this.document = options.domEnvironment.document;
      } else {
        const { window, document } = createDOMEnvironment();
        this.window = window;
        this.document = document;
      }
    }

    // Initialize built-ins
    this.initializeBuiltins();

    // Initialize DOM globals if enabled
    if (this.options.enableDOM) {
      this.initializeDOMGlobals();
    }

    // Inject custom globals
    for (const [name, value] of Object.entries(this.options.globals)) {
      this.context.variables.declare(name, value, 'const');
    }
  }

  /**
   * Initialize DOM-related globals
   */
  initializeDOMGlobals() {
    const engine = this;

    // Window object
    this.context.variables.declare('window', this.window, 'const');
    this.context.variables.declare('self', this.window, 'const');

    // Document object
    this.context.variables.declare('document', this.document, 'const');

    // Timer functions bound to window
    this.context.variables.declare('setTimeout', (cb, delay, ...args) => {
      return engine.window.setTimeout(cb, delay, ...args);
    }, 'const');
    this.context.variables.declare('clearTimeout', (id) => {
      return engine.window.clearTimeout(id);
    }, 'const');
    this.context.variables.declare('setInterval', (cb, delay, ...args) => {
      return engine.window.setInterval(cb, delay, ...args);
    }, 'const');
    this.context.variables.declare('clearInterval', (id) => {
      return engine.window.clearInterval(id);
    }, 'const');
    this.context.variables.declare('requestAnimationFrame', (cb) => {
      return engine.window.requestAnimationFrame(cb);
    }, 'const');
    this.context.variables.declare('cancelAnimationFrame', (id) => {
      return engine.window.cancelAnimationFrame(id);
    }, 'const');

    // Dialog functions
    this.context.variables.declare('alert', (msg) => engine.window.alert(msg), 'const');
    this.context.variables.declare('confirm', (msg) => engine.window.confirm(msg), 'const');
    this.context.variables.declare('prompt', (msg, def) => engine.window.prompt(msg, def), 'const');

    // Location and navigator
    this.context.variables.declare('location', this.window.location, 'const');
    this.context.variables.declare('navigator', this.window.navigator, 'const');

    // Storage
    this.context.variables.declare('localStorage', this.window.localStorage, 'const');
    this.context.variables.declare('sessionStorage', this.window.sessionStorage, 'const');

    // Element constructor (for instanceof checks)
    const MockElement = require('../dom/MockElement');
    this.context.variables.declare('Element', MockElement, 'const');
    this.context.variables.declare('HTMLElement', MockElement, 'const');
  }

  /**
   * Initialize built-in objects and functions
   */
  initializeBuiltins() {
    const engine = this;

    // console object
    const consoleObj = {
      log: (...args) => {
        const output = args.map(a => engine.stringify(a)).join(' ');
        engine.output.push({ type: 'log', args, text: output });
        engine.options.onOutput(output);
      },
      warn: (...args) => {
        const output = args.map(a => engine.stringify(a)).join(' ');
        engine.output.push({ type: 'warn', args, text: output });
        engine.options.onOutput('[WARN]', output);
      },
      error: (...args) => {
        const output = args.map(a => engine.stringify(a)).join(' ');
        engine.output.push({ type: 'error', args, text: output });
        engine.options.onOutput('[ERROR]', output);
      },
      info: (...args) => {
        const output = args.map(a => engine.stringify(a)).join(' ');
        engine.output.push({ type: 'info', args, text: output });
        engine.options.onOutput('[INFO]', output);
      }
    };

    // Math object (pass through native)
    const mathObj = Math;

    // JSON object
    const jsonObj = {
      parse: (str) => JSON.parse(str),
      stringify: (val, replacer, space) => JSON.stringify(val, replacer, space)
    };

    // Object methods
    const objectObj = {
      keys: (obj) => Object.keys(obj),
      values: (obj) => Object.values(obj),
      entries: (obj) => Object.entries(obj),
      assign: (target, ...sources) => Object.assign(target, ...sources),
      freeze: (obj) => Object.freeze(obj),
      isFrozen: (obj) => Object.isFrozen(obj),
      create: (proto, props) => Object.create(proto, props),
      hasOwn: (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    };

    // Array methods (static)
    const arrayObj = {
      isArray: (val) => Array.isArray(val),
      from: (iterable, mapFn) => Array.from(iterable, mapFn),
      of: (...items) => Array.of(...items)
    };

    // String methods (static)
    const stringObj = {
      fromCharCode: (...codes) => String.fromCharCode(...codes),
      fromCodePoint: (...codePoints) => String.fromCodePoint(...codePoints)
    };

    // Number methods
    const numberObj = {
      isNaN: (val) => Number.isNaN(val),
      isFinite: (val) => Number.isFinite(val),
      isInteger: (val) => Number.isInteger(val),
      parseInt: (str, radix) => parseInt(str, radix),
      parseFloat: (str) => parseFloat(str)
    };

    // Global functions
    this.context.variables.declare('console', consoleObj, 'const');
    this.context.variables.declare('Math', mathObj, 'const');
    this.context.variables.declare('JSON', jsonObj, 'const');
    this.context.variables.declare('Object', objectObj, 'const');
    this.context.variables.declare('Array', arrayObj, 'const');
    this.context.variables.declare('String', stringObj, 'const');
    this.context.variables.declare('Number', numberObj, 'const');

    // Global functions
    this.context.variables.declare('parseInt', parseInt, 'const');
    this.context.variables.declare('parseFloat', parseFloat, 'const');
    this.context.variables.declare('isNaN', isNaN, 'const');
    this.context.variables.declare('isFinite', isFinite, 'const');
    this.context.variables.declare('encodeURI', encodeURI, 'const');
    this.context.variables.declare('decodeURI', decodeURI, 'const');
    this.context.variables.declare('encodeURIComponent', encodeURIComponent, 'const');
    this.context.variables.declare('decodeURIComponent', decodeURIComponent, 'const');

    // undefined and null
    this.context.variables.declare('undefined', undefined, 'const');
    this.context.variables.declare('null', null, 'const');
    this.context.variables.declare('NaN', NaN, 'const');
    this.context.variables.declare('Infinity', Infinity, 'const');
  }

  /**
   * Execute an ActionTree
   * @param {ActionTree} tree - The ActionTree to execute
   * @returns {*} The result of execution
   */
  execute(tree) {
    if (!tree.root) {
      return undefined;
    }

    this.iterationCount = 0;
    return this.executeAction(tree.root);
  }

  /**
   * Execute a single Action node
   * @param {Action} action - The action to execute
   * @returns {*} The result
   */
  executeAction(action) {
    if (!action) return undefined;

    const handler = this.actionHandlers[action.actionType];
    if (handler) {
      return handler.call(this, action);
    }

    // Unknown action type
    console.warn(`Unknown action type: ${action.actionType}`);
    return undefined;
  }

  /**
   * Action type handlers
   */
  get actionHandlers() {
    return {
      // Program structure
      'program': this.executeProgram,
      'seq': this.executeSeq,
      'block': this.executeBlock,

      // Declarations
      'declareVar': this.executeDeclareVar,
      'declareConst': this.executeDeclareConst,
      'declareFunction': this.executeDeclareFunction,
      'declareParam': this.executeDeclareParam,
      'declareClass': this.executeDeclareClass,
      'declareMethod': this.executeDeclareMethod,

      // Control flow
      'if': this.executeIf,
      'for': this.executeFor,
      'forIn': this.executeForIn,
      'forOf': this.executeForOf,
      'while': this.executeWhile,
      'doWhile': this.executeDoWhile,
      'switch': this.executeSwitch,
      'case': this.executeCase,
      'default': this.executeCase,
      'try': this.executeTry,
      'catch': this.executeCatch,
      'finally': this.executeFinally,

      // Statements
      'return': this.executeReturn,
      'throw': this.executeThrow,
      'break': this.executeBreak,
      'continue': this.executeContinue,

      // Expressions
      'call': this.executeCall,
      'new': this.executeNew,
      'memberAccess': this.executeMemberAccess,
      'assign': this.executeAssign,
      'binaryOp': this.executeBinaryOp,
      'unaryOp': this.executeUnaryOp,
      'logicalOp': this.executeLogicalOp,
      'conditional': this.executeConditional,
      'await': this.executeAwait,
      'yield': this.executeYield,

      // Functions
      'arrowFunction': this.executeArrowFunction,
      'functionExpr': this.executeFunctionExpr,

      // Literals and identifiers
      'identifier': this.executeIdentifier,
      'literal': this.executeLiteral,
      'array': this.executeArray,
      'object': this.executeObject,
      'property': this.executeProperty,
      'template': this.executeTemplate,
      'spread': this.executeSpread,

      // Modules (no-op in execution context)
      'import': () => undefined,
      'export': this.executeExport,
      'exportDefault': this.executeExportDefault
    };
  }

  // === Program Structure ===

  executeProgram(action) {
    let result;
    for (const child of action.children) {
      result = this.executeAction(child);
      if (result instanceof ReturnValue ||
          result instanceof BreakSignal ||
          result instanceof ContinueSignal ||
          result instanceof ThrowSignal) {
        return result;
      }
    }
    return result;
  }

  executeSeq(action) {
    let result;
    for (const child of action.children) {
      result = this.executeAction(child);
      if (result instanceof ReturnValue ||
          result instanceof BreakSignal ||
          result instanceof ContinueSignal ||
          result instanceof ThrowSignal) {
        return result;
      }
    }
    return result;
  }

  executeBlock(action) {
    // Create new scope
    const savedContext = this.context;
    this.context = this.context.createChildContext();

    let result;
    try {
      for (const child of action.children) {
        result = this.executeAction(child);
        if (result instanceof ReturnValue ||
            result instanceof BreakSignal ||
            result instanceof ContinueSignal ||
            result instanceof ThrowSignal) {
          return result;
        }
      }
    } finally {
      // Restore scope
      this.context = savedContext;
    }

    return result;
  }

  // === Declarations ===

  executeDeclareVar(action) {
    const name = action.getAttribute('name');
    const kind = action.getAttribute('kind') || 'var';

    let value = undefined;
    if (action.children.length > 0) {
      value = this.executeAction(action.children[0]);
    }

    this.context.variables.declare(name, value, kind);
    return value;
  }

  executeDeclareConst(action) {
    const name = action.getAttribute('name');

    let value = undefined;
    if (action.children.length > 0) {
      value = this.executeAction(action.children[0]);
    }

    this.context.variables.declare(name, value, 'const');
    return value;
  }

  executeDeclareFunction(action) {
    const name = action.getAttribute('name');
    const isAsync = action.getAttribute('async');
    const isGenerator = action.getAttribute('generator');

    // Collect parameters
    const params = [];
    let body = null;

    for (const child of action.children) {
      if (child.actionType === 'declareParam') {
        params.push(child.getAttribute('name'));
      } else {
        body = child;
      }
    }

    // Create function object
    const funcDef = {
      name,
      params,
      body,
      async: isAsync,
      generator: isGenerator,
      closure: this.context // Capture current scope
    };

    // Store in function stack
    this.context.functions.declare(name, funcDef);

    // Also store as variable for expressions like `const f = myFunc`
    this.context.variables.declare(name, funcDef, 'const');

    return funcDef;
  }

  executeDeclareParam(action) {
    // Parameters are handled by function call
    return undefined;
  }

  executeDeclareClass(action) {
    const name = action.getAttribute('name');

    // Find superclass and body
    let superClass = null;
    let body = null;

    for (const child of action.children) {
      if (child.getAttribute('role') === 'extends') {
        superClass = this.executeAction(child);
      } else if (child.actionType === 'block') {
        body = child;
      }
    }

    // Create class constructor function
    const classDef = {
      name,
      superClass,
      body,
      isClass: true,
      methods: new Map(),
      staticMethods: new Map()
    };

    // Process class body to extract methods
    if (body) {
      for (const member of body.children) {
        if (member.actionType === 'declareMethod') {
          const methodName = member.getAttribute('name');
          const isStatic = member.getAttribute('static');

          const params = [];
          let methodBody = null;

          for (const child of member.children) {
            if (child.actionType === 'declareParam') {
              params.push(child.getAttribute('name'));
            } else {
              methodBody = child;
            }
          }

          const methodDef = {
            name: methodName,
            params,
            body: methodBody,
            closure: this.context
          };

          if (isStatic) {
            classDef.staticMethods.set(methodName, methodDef);
          } else {
            classDef.methods.set(methodName, methodDef);
          }
        }
      }
    }

    this.context.variables.declare(name, classDef, 'const');
    return classDef;
  }

  executeDeclareMethod(action) {
    // Methods are processed in class declaration
    return undefined;
  }

  // === Control Flow ===

  executeIf(action) {
    let condition = null;
    let thenBranch = null;
    let elseBranch = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'condition') {
        condition = child;
      } else if (role === 'then') {
        thenBranch = child;
      } else if (role === 'else') {
        elseBranch = child;
      }
    }

    const condValue = this.executeAction(condition);

    if (condValue) {
      return thenBranch ? this.executeAction(thenBranch) : undefined;
    } else {
      return elseBranch ? this.executeAction(elseBranch) : undefined;
    }
  }

  executeFor(action) {
    let init = null;
    let test = null;
    let update = null;
    let body = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'init') init = child;
      else if (role === 'test') test = child;
      else if (role === 'update') update = child;
      else if (role === 'body') body = child;
    }

    // Create scope for loop
    const savedContext = this.context;
    this.context = this.context.createChildContext();

    let result;
    try {
      // Initialize
      if (init) {
        this.executeAction(init);
      }

      // Loop
      while (true) {
        this.checkIterationLimit();

        // Test
        if (test) {
          const testValue = this.executeAction(test);
          if (!testValue) break;
        }

        // Body
        if (body) {
          result = this.executeAction(body);

          if (result instanceof ReturnValue) return result;
          if (result instanceof BreakSignal) break;
          if (result instanceof ContinueSignal) {
            // Continue to update
          }
          if (result instanceof ThrowSignal) return result;
        }

        // Update
        if (update) {
          this.executeAction(update);
        }
      }
    } finally {
      this.context = savedContext;
    }

    return undefined;
  }

  executeForIn(action) {
    let variable = null;
    let object = null;
    let body = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'variable') variable = child;
      else if (role === 'object') object = child;
      else if (role === 'body') body = child;
    }

    const obj = this.executeAction(object);
    const varName = variable?.getAttribute?.('name') || variable?.children?.[0]?.getAttribute?.('name');

    const savedContext = this.context;
    this.context = this.context.createChildContext();

    let result;
    try {
      for (const key in obj) {
        this.checkIterationLimit();

        this.context.variables.set(varName, { value: key, kind: 'let', initialized: true });

        if (body) {
          result = this.executeAction(body);

          if (result instanceof ReturnValue) return result;
          if (result instanceof BreakSignal) break;
          if (result instanceof ContinueSignal) continue;
          if (result instanceof ThrowSignal) return result;
        }
      }
    } finally {
      this.context = savedContext;
    }

    return undefined;
  }

  executeForOf(action) {
    let variable = null;
    let iterable = null;
    let body = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'variable') variable = child;
      else if (role === 'iterable') iterable = child;
      else if (role === 'body') body = child;
    }

    const iter = this.executeAction(iterable);
    const varName = variable?.getAttribute?.('name') || variable?.children?.[0]?.getAttribute?.('name');

    const savedContext = this.context;
    this.context = this.context.createChildContext();

    let result;
    try {
      for (const item of iter) {
        this.checkIterationLimit();

        this.context.variables.set(varName, { value: item, kind: 'let', initialized: true });

        if (body) {
          result = this.executeAction(body);

          if (result instanceof ReturnValue) return result;
          if (result instanceof BreakSignal) break;
          if (result instanceof ContinueSignal) continue;
          if (result instanceof ThrowSignal) return result;
        }
      }
    } finally {
      this.context = savedContext;
    }

    return undefined;
  }

  executeWhile(action) {
    let condition = null;
    let body = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'condition') condition = child;
      else if (role === 'body') body = child;
    }

    let result;
    while (this.executeAction(condition)) {
      this.checkIterationLimit();

      if (body) {
        result = this.executeAction(body);

        if (result instanceof ReturnValue) return result;
        if (result instanceof BreakSignal) break;
        if (result instanceof ContinueSignal) continue;
        if (result instanceof ThrowSignal) return result;
      }
    }

    return undefined;
  }

  executeDoWhile(action) {
    let condition = null;
    let body = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'condition') condition = child;
      else if (role === 'body') body = child;
    }

    let result;
    do {
      this.checkIterationLimit();

      if (body) {
        result = this.executeAction(body);

        if (result instanceof ReturnValue) return result;
        if (result instanceof BreakSignal) break;
        if (result instanceof ContinueSignal) continue;
        if (result instanceof ThrowSignal) return result;
      }
    } while (this.executeAction(condition));

    return undefined;
  }

  executeSwitch(action) {
    let discriminant = null;
    const cases = [];

    for (const child of action.children) {
      if (child.getAttribute('role') === 'discriminant') {
        discriminant = child;
      } else if (child.actionType === 'case' || child.actionType === 'default') {
        cases.push(child);
      }
    }

    const switchValue = this.executeAction(discriminant);

    let matched = false;
    let result;

    for (const caseAction of cases) {
      const isDefault = caseAction.actionType === 'default';

      if (!matched && !isDefault) {
        // Check if this case matches
        const testChild = caseAction.children.find(c => c.getAttribute('role') === 'test');
        if (testChild) {
          const caseValue = this.executeAction(testChild);
          if (switchValue === caseValue) {
            matched = true;
          }
        }
      }

      if (matched || isDefault) {
        matched = true; // Fall through

        // Execute case body
        for (const child of caseAction.children) {
          if (child.getAttribute('role') !== 'test') {
            result = this.executeAction(child);

            if (result instanceof BreakSignal) {
              return undefined; // Break out of switch
            }
            if (result instanceof ReturnValue ||
                result instanceof ContinueSignal ||
                result instanceof ThrowSignal) {
              return result;
            }
          }
        }
      }
    }

    return result;
  }

  executeCase(action) {
    // Cases are handled by switch
    return undefined;
  }

  executeTry(action) {
    let tryBlock = null;
    let catchBlock = null;
    let finallyBlock = null;

    for (const child of action.children) {
      if (child.getAttribute('role') === 'try' || child.actionType === 'block') {
        if (!tryBlock) tryBlock = child;
      } else if (child.actionType === 'catch') {
        catchBlock = child;
      } else if (child.actionType === 'finally') {
        finallyBlock = child;
      }
    }

    let result;
    let error = null;

    try {
      result = this.executeAction(tryBlock);

      if (result instanceof ThrowSignal) {
        error = result.error;
        result = undefined;
      }
    } catch (e) {
      error = e;
    }

    // Handle catch
    if (error !== null && catchBlock) {
      const savedContext = this.context;
      this.context = this.context.createChildContext();

      try {
        const paramName = catchBlock.getAttribute('param');
        if (paramName) {
          this.context.variables.declare(paramName, error, 'let');
        }

        // Execute catch body
        for (const child of catchBlock.children) {
          result = this.executeAction(child);
          if (result instanceof ReturnValue ||
              result instanceof BreakSignal ||
              result instanceof ContinueSignal ||
              result instanceof ThrowSignal) {
            break;
          }
        }

        error = null; // Error was handled
      } finally {
        this.context = savedContext;
      }
    }

    // Handle finally
    if (finallyBlock) {
      for (const child of finallyBlock.children) {
        this.executeAction(child);
      }
    }

    // Re-throw unhandled error
    if (error !== null) {
      return new ThrowSignal(error);
    }

    return result;
  }

  executeCatch(action) {
    // Catch is handled by try
    return undefined;
  }

  executeFinally(action) {
    // Finally is handled by try
    return undefined;
  }

  // === Statements ===

  executeReturn(action) {
    let value = undefined;
    if (action.children.length > 0) {
      value = this.executeAction(action.children[0]);
    }
    return new ReturnValue(value);
  }

  executeThrow(action) {
    let error = undefined;
    if (action.children.length > 0) {
      error = this.executeAction(action.children[0]);
    }
    return new ThrowSignal(error);
  }

  executeBreak(action) {
    return new BreakSignal(action.getAttribute('label'));
  }

  executeContinue(action) {
    return new ContinueSignal(action.getAttribute('label'));
  }

  // === Expressions ===

  executeCall(action) {
    let callee = null;
    const args = [];

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'callee') {
        callee = child;
      } else if (role === 'argument') {
        args.push(this.executeAction(child));
      }
    }

    // Check call depth
    if (this.context.callStack.callDepth() >= this.options.maxCallDepth) {
      throw new Error('Maximum call stack size exceeded');
    }

    // Check if callee is a memberAccess (method call)
    // We need to preserve `this` binding for method calls
    if (callee && (callee.type === 'memberAccess' || callee.actionType === 'memberAccess')) {
      const objAction = callee.children.find(c => c.getAttribute('role') === 'object');
      const obj = this.executeAction(objAction);
      const prop = callee.getAttribute('property');

      if (obj && typeof obj[prop] === 'function') {
        // Call method with proper this binding
        return obj[prop].call(obj, ...args);
      }

      if (obj && obj[prop] && obj[prop].body) {
        // ActionLanguage method
        return this.callFunction(obj[prop], args);
      }

      throw new Error(`${prop} is not a function`);
    }

    // Get the function for non-method calls
    const func = this.executeAction(callee);

    // Handle different function types
    if (typeof func === 'function') {
      // Native function (not a method call)
      return func(...args);
    }

    if (func && func.body) {
      // ActionLanguage function
      return this.callFunction(func, args);
    }

    if (func && typeof func === 'object') {
      // Could be a method call via attribute
      const calleeAttr = action.getAttribute('callee');
      if (calleeAttr && calleeAttr.includes('.')) {
        // Method call - need to get object and method separately
        const parts = calleeAttr.split('.');
        const methodName = parts.pop();

        let obj = this.context.variables.getValue(parts[0]);
        for (let i = 1; i < parts.length; i++) {
          obj = obj[parts[i]];
        }

        if (typeof obj[methodName] === 'function') {
          return obj[methodName].call(obj, ...args);
        }
      }
    }

    throw new Error(`${action.getAttribute('callee') || 'expression'} is not a function`);
  }

  /**
   * Call an ActionLanguage function
   */
  callFunction(func, args) {
    // Push call frame
    this.context.callStack.pushFrame({
      functionName: func.name,
      args
    });

    // Create new scope from closure
    const savedContext = this.context;
    this.context = new ExecutionContext(func.closure);

    let result;
    try {
      // Bind parameters
      for (let i = 0; i < func.params.length; i++) {
        const paramName = func.params[i];
        const argValue = args[i];
        this.context.variables.declare(paramName, argValue, 'let');
      }

      // Execute body
      result = this.executeAction(func.body);

      // Unwrap return value
      if (result instanceof ReturnValue) {
        result = result.value;
      }
    } finally {
      // Restore context
      this.context = savedContext;
      this.context.callStack.popFrame();
    }

    return result;
  }

  executeNew(action) {
    let constructor = null;
    const args = [];

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'constructor') {
        constructor = child;
      } else if (role === 'argument') {
        args.push(this.executeAction(child));
      }
    }

    const classDef = this.executeAction(constructor);

    if (classDef && classDef.isClass) {
      // Create new instance
      const instance = {};

      // Get constructor method
      const constructorMethod = classDef.methods.get('constructor');

      if (constructorMethod) {
        // Push call frame
        this.context.callStack.pushFrame({
          functionName: `${classDef.name}.constructor`,
          args
        });

        const savedContext = this.context;
        this.context = new ExecutionContext(constructorMethod.closure);

        try {
          // Bind 'this'
          this.context.variables.declare('this', instance, 'const');

          // Bind parameters
          for (let i = 0; i < constructorMethod.params.length; i++) {
            this.context.variables.declare(constructorMethod.params[i], args[i], 'let');
          }

          // Execute constructor body
          this.executeAction(constructorMethod.body);
        } finally {
          this.context = savedContext;
          this.context.callStack.popFrame();
        }
      }

      // Attach methods to instance
      for (const [name, method] of classDef.methods) {
        if (name !== 'constructor') {
          instance[name] = (...callArgs) => {
            return this.callMethodOnInstance(instance, method, callArgs);
          };
        }
      }

      return instance;
    }

    throw new Error(`${constructor?.getAttribute?.('name') || 'value'} is not a constructor`);
  }

  callMethodOnInstance(instance, method, args) {
    this.context.callStack.pushFrame({
      functionName: method.name,
      args
    });

    const savedContext = this.context;
    this.context = new ExecutionContext(method.closure);

    let result;
    try {
      this.context.variables.declare('this', instance, 'const');

      for (let i = 0; i < method.params.length; i++) {
        this.context.variables.declare(method.params[i], args[i], 'let');
      }

      result = this.executeAction(method.body);

      if (result instanceof ReturnValue) {
        result = result.value;
      }
    } finally {
      this.context = savedContext;
      this.context.callStack.popFrame();
    }

    return result;
  }

  executeMemberAccess(action) {
    const computed = action.getAttribute('computed');
    const propertyName = action.getAttribute('property');

    let object = null;
    let property = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'object') {
        object = child;
      } else if (role === 'property') {
        property = child;
      }
    }

    const obj = this.executeAction(object);

    if (computed) {
      const prop = this.executeAction(property);
      return obj[prop];
    } else {
      return obj[propertyName];
    }
  }

  executeAssign(action) {
    const operator = action.getAttribute('operator') || '=';

    let left = null;
    let right = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'left') {
        left = child;
      } else if (role === 'right' || role === 'default') {
        right = child;
      }
    }

    const rightValue = this.executeAction(right);

    // Handle different left-hand side types
    if (left.actionType === 'identifier') {
      const name = left.getAttribute('name');
      let currentValue;

      try {
        currentValue = this.context.variables.getValue(name);
      } catch {
        currentValue = undefined;
      }

      const newValue = this.applyAssignOperator(operator, currentValue, rightValue);
      this.context.variables.setValue(name, newValue);
      return newValue;
    }

    if (left.actionType === 'memberAccess') {
      const computed = left.getAttribute('computed');
      const propertyName = left.getAttribute('property');

      let obj = null;
      let prop = null;

      for (const child of left.children) {
        const role = child.getAttribute('role');
        if (role === 'object') {
          obj = this.executeAction(child);
        } else if (role === 'property') {
          prop = this.executeAction(child);
        }
      }

      const key = computed ? prop : propertyName;
      const currentValue = obj[key];
      const newValue = this.applyAssignOperator(operator, currentValue, rightValue);
      obj[key] = newValue;
      return newValue;
    }

    return rightValue;
  }

  applyAssignOperator(operator, left, right) {
    switch (operator) {
      case '=': return right;
      case '+=': return left + right;
      case '-=': return left - right;
      case '*=': return left * right;
      case '/=': return left / right;
      case '%=': return left % right;
      case '**=': return left ** right;
      case '&=': return left & right;
      case '|=': return left | right;
      case '^=': return left ^ right;
      case '<<=': return left << right;
      case '>>=': return left >> right;
      case '>>>=': return left >>> right;
      case '&&=': return left && right;
      case '||=': return left || right;
      case '??=': return left ?? right;
      default: return right;
    }
  }

  executeBinaryOp(action) {
    const operator = action.getAttribute('operator');

    let left = null;
    let right = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'left') left = child;
      else if (role === 'right') right = child;
    }

    const leftValue = this.executeAction(left);
    const rightValue = this.executeAction(right);

    switch (operator) {
      case '+': return leftValue + rightValue;
      case '-': return leftValue - rightValue;
      case '*': return leftValue * rightValue;
      case '/': return leftValue / rightValue;
      case '%': return leftValue % rightValue;
      case '**': return leftValue ** rightValue;
      case '==': return leftValue == rightValue;
      case '!=': return leftValue != rightValue;
      case '===': return leftValue === rightValue;
      case '!==': return leftValue !== rightValue;
      case '<': return leftValue < rightValue;
      case '<=': return leftValue <= rightValue;
      case '>': return leftValue > rightValue;
      case '>=': return leftValue >= rightValue;
      case '&': return leftValue & rightValue;
      case '|': return leftValue | rightValue;
      case '^': return leftValue ^ rightValue;
      case '<<': return leftValue << rightValue;
      case '>>': return leftValue >> rightValue;
      case '>>>': return leftValue >>> rightValue;
      case 'in': return leftValue in rightValue;
      case 'instanceof': return leftValue instanceof rightValue;
      default:
        throw new Error(`Unknown binary operator: ${operator}`);
    }
  }

  executeUnaryOp(action) {
    const operator = action.getAttribute('operator');
    const prefix = action.getAttribute('prefix') !== false;

    const operand = action.children[0];
    let value = this.executeAction(operand);

    switch (operator) {
      case '-': return -value;
      case '+': return +value;
      case '!': return !value;
      case '~': return ~value;
      case 'typeof': return typeof value;
      case 'void': return void value;
      case '++':
      case '--':
        const newValue = operator === '++' ? value + 1 : value - 1;

        // Update the variable
        if (operand.actionType === 'identifier') {
          const name = operand.getAttribute('name');
          this.context.variables.setValue(name, newValue);
        }

        return prefix ? newValue : value;
      default:
        throw new Error(`Unknown unary operator: ${operator}`);
    }
  }

  executeLogicalOp(action) {
    const operator = action.getAttribute('operator');

    let left = null;
    let right = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'left') left = child;
      else if (role === 'right') right = child;
    }

    const leftValue = this.executeAction(left);

    // Short-circuit evaluation
    switch (operator) {
      case '&&':
        return leftValue ? this.executeAction(right) : leftValue;
      case '||':
        return leftValue ? leftValue : this.executeAction(right);
      case '??':
        return leftValue !== null && leftValue !== undefined
          ? leftValue
          : this.executeAction(right);
      default:
        throw new Error(`Unknown logical operator: ${operator}`);
    }
  }

  executeConditional(action) {
    let condition = null;
    let consequent = null;
    let alternate = null;

    for (const child of action.children) {
      const role = child.getAttribute('role');
      if (role === 'condition') condition = child;
      else if (role === 'then') consequent = child;
      else if (role === 'else') alternate = child;
    }

    const condValue = this.executeAction(condition);
    return condValue ? this.executeAction(consequent) : this.executeAction(alternate);
  }

  executeAwait(action) {
    // In synchronous execution, just execute the argument
    // Full async support would require a different execution model
    const value = this.executeAction(action.children[0]);

    // If it's a promise-like, we can't truly await it synchronously
    if (value && typeof value.then === 'function') {
      console.warn('Async/await not fully supported in synchronous execution');
    }

    return value;
  }

  executeYield(action) {
    // Generator support would require a different execution model
    if (action.children.length > 0) {
      return this.executeAction(action.children[0]);
    }
    return undefined;
  }

  // === Functions ===

  executeArrowFunction(action) {
    const isAsync = action.getAttribute('async');

    const params = [];
    let body = null;

    for (const child of action.children) {
      if (child.actionType === 'declareParam') {
        params.push(child.getAttribute('name'));
      } else if (child.getAttribute('role') === 'body') {
        body = child;
      }
    }

    return {
      name: '<arrow>',
      params,
      body,
      async: isAsync,
      isArrow: true,
      closure: this.context
    };
  }

  executeFunctionExpr(action) {
    const name = action.getAttribute('name') || '<anonymous>';
    const isAsync = action.getAttribute('async');
    const isGenerator = action.getAttribute('generator');

    const params = [];
    let body = null;

    for (const child of action.children) {
      if (child.actionType === 'declareParam') {
        params.push(child.getAttribute('name'));
      } else if (child.getAttribute('role') === 'body') {
        body = child;
      }
    }

    return {
      name,
      params,
      body,
      async: isAsync,
      generator: isGenerator,
      closure: this.context
    };
  }

  // === Literals and Identifiers ===

  executeIdentifier(action) {
    const name = action.getAttribute('name');

    if (name === 'this') {
      try {
        return this.context.variables.getValue('this');
      } catch {
        return undefined;
      }
    }

    if (name === 'undefined') return undefined;
    if (name === 'null') return null;
    if (name === 'NaN') return NaN;
    if (name === 'Infinity') return Infinity;

    try {
      return this.context.variables.getValue(name);
    } catch {
      // Check if it's a function
      if (this.context.functions.has(name)) {
        return this.context.functions.getFunction(name);
      }
      throw new Error(`${name} is not defined`);
    }
  }

  executeLiteral(action) {
    const type = action.getAttribute('type');
    const value = action.getAttribute('value');

    switch (type) {
      case 'string':
        return value;
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true';
      case 'null':
        return null;
      case 'regexp':
        const flags = action.getAttribute('flags') || '';
        return new RegExp(value, flags);
      case 'templatePart':
        return value;
      default:
        return value;
    }
  }

  executeArray(action) {
    const elements = [];

    for (const child of action.children) {
      if (child.actionType === 'spread') {
        const spreadValue = this.executeAction(child);
        elements.push(...spreadValue);
      } else {
        elements.push(this.executeAction(child));
      }
    }

    return elements;
  }

  executeObject(action) {
    const obj = {};

    for (const child of action.children) {
      if (child.actionType === 'property') {
        const key = child.getAttribute('key');
        const computed = child.getAttribute('computed');

        let keyValue = key;
        let value;

        for (const propChild of child.children) {
          const role = propChild.getAttribute('role');
          if (role === 'key') {
            keyValue = this.executeAction(propChild);
          } else if (role === 'value') {
            value = this.executeAction(propChild);
          }
        }

        obj[keyValue] = value;
      } else if (child.actionType === 'spread') {
        const spreadValue = this.executeAction(child);
        Object.assign(obj, spreadValue);
      }
    }

    return obj;
  }

  executeProperty(action) {
    // Properties are handled by object
    return undefined;
  }

  executeTemplate(action) {
    let result = '';

    for (const child of action.children) {
      const value = this.executeAction(child);
      result += this.stringify(value);
    }

    return result;
  }

  executeSpread(action) {
    if (action.children.length > 0) {
      return this.executeAction(action.children[0]);
    }
    return [];
  }

  // === Modules ===

  executeExport(action) {
    // Just execute the declaration
    if (action.children.length > 0) {
      return this.executeAction(action.children[0]);
    }
    return undefined;
  }

  executeExportDefault(action) {
    if (action.children.length > 0) {
      return this.executeAction(action.children[0]);
    }
    return undefined;
  }

  // === Utilities ===

  checkIterationLimit() {
    this.iterationCount++;
    if (this.iterationCount > this.options.maxIterations) {
      throw new Error('Maximum iteration limit exceeded (possible infinite loop)');
    }
  }

  stringify(value) {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'string') return value;
    if (typeof value === 'function') return '[Function]';
    if (Array.isArray(value)) {
      return '[' + value.map(v => this.stringify(v)).join(', ') + ']';
    }
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '[Object]';
      }
    }
    return String(value);
  }

  /**
   * Get captured output
   * @returns {Array}
   */
  getOutput() {
    return this.output;
  }

  /**
   * Clear captured output
   */
  clearOutput() {
    this.output = [];
  }
}

module.exports = {
  ExecutionEngine,
  ReturnValue,
  BreakSignal,
  ContinueSignal,
  ThrowSignal
};
