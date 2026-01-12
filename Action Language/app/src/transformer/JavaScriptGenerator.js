/**
 * JavaScriptGenerator - Generates JavaScript source code from ActionLanguage trees
 *
 * This enables the round-trip workflow:
 *   JavaScript → ActionTree → (analyze/modify) → JavaScript
 *
 * Use cases:
 * - Programmatic accessibility fixes
 * - Code transformation for user adaptations
 * - Round-trip testing
 */

class JavaScriptGenerator {
  /**
   * Create a new JavaScriptGenerator
   * @param {Object} [options] - Generator options
   * @param {number} [options.indentSize=2] - Spaces per indent level
   * @param {boolean} [options.useSemicolons=true] - Add semicolons
   * @param {boolean} [options.preserveComments=false] - Include comments (if available)
   * @param {string} [options.lineEnding='\n'] - Line ending character
   */
  constructor(options = {}) {
    this.options = {
      indentSize: options.indentSize ?? 2,
      useSemicolons: options.useSemicolons ?? true,
      preserveComments: options.preserveComments ?? false,
      lineEnding: options.lineEnding ?? '\n'
    };

    this.indentLevel = 0;
  }

  /**
   * Generate JavaScript from an ActionTree
   * @param {ActionTree} tree - The ActionTree to generate from
   * @returns {string} JavaScript source code
   */
  generate(tree) {
    if (!tree || !tree.root) {
      return '';
    }

    this.indentLevel = 0;
    return this.generateAction(tree.root);
  }

  /**
   * Generate JavaScript from a single Action
   * @param {Action} action - The action to generate
   * @returns {string} JavaScript source code
   */
  generateAction(action) {
    if (!action) return '';

    const handler = this.generators[action.actionType];
    if (handler) {
      return handler.call(this, action);
    }

    console.warn(`Unknown action type for generation: ${action.actionType}`);
    return `/* Unknown: ${action.actionType} */`;
  }

  /**
   * Get the current indentation string
   */
  get indent() {
    return ' '.repeat(this.indentLevel * this.options.indentSize);
  }

  /**
   * Get semicolon if enabled
   */
  get semi() {
    return this.options.useSemicolons ? ';' : '';
  }

  /**
   * Get line ending
   */
  get eol() {
    return this.options.lineEnding;
  }

  /**
   * Action type generators
   */
  get generators() {
    return {
      // Program structure
      'program': this.genProgram,
      'seq': this.genSeq,
      'block': this.genBlock,

      // Declarations
      'declareVar': this.genDeclareVar,
      'declareConst': this.genDeclareConst,
      'declareFunction': this.genDeclareFunction,
      'declareParam': this.genDeclareParam,
      'declareClass': this.genDeclareClass,
      'declareMethod': this.genDeclareMethod,

      // Control flow
      'if': this.genIf,
      'for': this.genFor,
      'forIn': this.genForIn,
      'forOf': this.genForOf,
      'while': this.genWhile,
      'doWhile': this.genDoWhile,
      'switch': this.genSwitch,
      'case': this.genCase,
      'default': this.genCase,
      'try': this.genTry,
      'catch': this.genCatch,

      // Statements
      'return': this.genReturn,
      'throw': this.genThrow,
      'break': this.genBreak,
      'continue': this.genContinue,
      'expressionStatement': this.genExpressionStatement,

      // Expressions
      'call': this.genCall,
      'new': this.genNew,
      'memberAccess': this.genMemberAccess,
      'assign': this.genAssignment,
      'assignment': this.genAssignment,
      'binaryOp': this.genBinary,
      'binary': this.genBinary,
      'unaryOp': this.genUnary,
      'unary': this.genUnary,
      'logicalOp': this.genLogical,
      'logical': this.genLogical,
      'conditional': this.genConditional,
      'update': this.genUpdate,
      'await': this.genAwait,
      'yield': this.genYield,
      'spread': this.genSpread,

      // Literals and identifiers
      'literal': this.genLiteral,
      'identifier': this.genIdentifier,
      'array': this.genArray,
      'object': this.genObject,
      'property': this.genProperty,
      'templateLiteral': this.genTemplateLiteral,
      'template': this.genTemplateLiteral,

      // Functions
      'arrowFunction': this.genArrowFunction,
      'functionExpr': this.genFunctionExpression,
      'functionExpression': this.genFunctionExpression,
      'finally': this.genFinally,

      // Modules
      'import': this.genImport,
      'export': this.genExport,
      'exportDefault': this.genExportDefault
    };
  }

  // === Program Structure ===

  genProgram(action) {
    const statements = action.children.map(child => this.generateAction(child));
    return statements.join(this.eol);
  }

  genSeq(action) {
    const statements = action.children.map(child => this.generateAction(child));
    return statements.join(this.eol);
  }

  genBlock(action) {
    this.indentLevel++;
    const statements = action.children.map(child =>
      this.indent + this.generateAction(child)
    );
    this.indentLevel--;

    if (statements.length === 0) {
      return '{}';
    }

    return `{${this.eol}${statements.join(this.eol)}${this.eol}${this.indent}}`;
  }

  // === Declarations ===

  genDeclareVar(action) {
    const name = action.getAttribute('name');
    const kind = action.getAttribute('kind') || 'let';
    // Init is the first child (if present)
    const initChild = action.children[0];

    if (initChild) {
      const init = this.generateAction(initChild);
      return `${kind} ${name} = ${init}${this.semi}`;
    }

    return `${kind} ${name}${this.semi}`;
  }

  genDeclareConst(action) {
    const name = action.getAttribute('name');
    // Init is the first child (if present)
    const initChild = action.children[0];

    if (initChild) {
      const init = this.generateAction(initChild);
      return `const ${name} = ${init}${this.semi}`;
    }

    return `const ${name}${this.semi}`;
  }

  genDeclareFunction(action) {
    const name = action.getAttribute('name') || '';
    const isAsync = action.getAttribute('async') === true || action.getAttribute('async') === 'true';
    const isGenerator = action.getAttribute('generator') === true || action.getAttribute('generator') === 'true';

    // Params are declareParam children
    const params = action.children
      .filter(c => c.actionType === 'declareParam')
      .map(c => this.generateAction(c))
      .join(', ');

    // Body is a block child
    const bodyChild = action.children.find(c => c.actionType === 'block');
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    let prefix = '';
    if (isAsync) prefix += 'async ';
    prefix += 'function';
    if (isGenerator) prefix += '*';

    return `${prefix} ${name}(${params}) ${body}`;
  }

  genDeclareParam(action) {
    const name = action.getAttribute('name');
    const defaultChild = action.children.find(c => c.getAttribute('role') === 'default');
    const restElement = action.getAttribute('rest') === 'true';

    let param = restElement ? `...${name}` : name;

    if (defaultChild) {
      const defaultValue = this.generateAction(defaultChild);
      param += ` = ${defaultValue}`;
    }

    return param;
  }

  genDeclareClass(action) {
    const name = action.getAttribute('name');

    // Find extends (role='extends')
    const extendsChild = action.children.find(c => c.getAttribute('role') === 'extends');
    // Find body (block containing methods)
    const bodyChild = action.children.find(c => c.actionType === 'block');

    let declaration = `class ${name}`;
    if (extendsChild) {
      const superClass = this.generateAction(extendsChild);
      declaration += ` extends ${superClass}`;
    }

    if (!bodyChild || bodyChild.children.length === 0) {
      return `${declaration} {}`;
    }

    this.indentLevel++;
    const members = bodyChild.children.map(child =>
      this.indent + this.generateAction(child)
    );
    this.indentLevel--;

    return `${declaration} {${this.eol}${members.join(this.eol)}${this.eol}${this.indent}}`;
  }

  genDeclareMethod(action) {
    const name = action.getAttribute('name');
    const kind = action.getAttribute('kind') || 'method';
    const isAsync = action.getAttribute('async') === true || action.getAttribute('async') === 'true';
    const isGenerator = action.getAttribute('generator') === true || action.getAttribute('generator') === 'true';
    const isStatic = action.getAttribute('static') === true || action.getAttribute('static') === 'true';
    const computed = action.getAttribute('computed') === true || action.getAttribute('computed') === 'true';

    // Params are declareParam children
    const params = action.children
      .filter(c => c.actionType === 'declareParam')
      .map(c => this.generateAction(c))
      .join(', ');

    // Body is a block child (not a declareParam)
    const bodyChild = action.children.find(c => c.actionType === 'block');
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    let prefix = '';
    if (isStatic) prefix += 'static ';
    if (isAsync) prefix += 'async ';

    const methodName = computed ? `[${name}]` : name;

    if (kind === 'get') {
      return `${prefix}get ${methodName}() ${body}`;
    } else if (kind === 'set') {
      return `${prefix}set ${methodName}(${params}) ${body}`;
    } else if (kind === 'constructor') {
      return `constructor(${params}) ${body}`;
    } else {
      const star = isGenerator ? '*' : '';
      return `${prefix}${star}${methodName}(${params}) ${body}`;
    }
  }

  // === Control Flow ===

  genIf(action) {
    // ASTTransformer uses: role="condition", role="then", role="else"
    const testChild = action.children.find(c =>
      c.getAttribute('role') === 'condition' || c.getAttribute('role') === 'test'
    );
    const thenChild = action.children.find(c =>
      c.getAttribute('role') === 'then' || c.getAttribute('role') === 'consequent'
    );
    const elseChild = action.children.find(c =>
      c.getAttribute('role') === 'else' || c.getAttribute('role') === 'alternate'
    );

    const test = testChild ? this.generateAction(testChild) : 'true';
    const consequent = thenChild ? this.generateAction(thenChild) : '{}';

    let result = `if (${test}) ${consequent}`;

    if (elseChild) {
      const alternate = this.generateAction(elseChild);
      result += ` else ${alternate}`;
    }

    return result;
  }

  genFor(action) {
    const initChild = action.children.find(c => c.getAttribute('role') === 'init');
    const testChild = action.children.find(c => c.getAttribute('role') === 'test');
    const updateChild = action.children.find(c => c.getAttribute('role') === 'update');
    const bodyChild = action.children.find(c => c.getAttribute('role') === 'body');

    const init = initChild ? this.generateAction(initChild).replace(/;$/, '') : '';
    const test = testChild ? this.generateAction(testChild) : '';
    const update = updateChild ? this.generateAction(updateChild).replace(/;$/, '') : '';
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    return `for (${init}; ${test}; ${update}) ${body}`;
  }

  genForIn(action) {
    const varChild = action.children.find(c => c.getAttribute('role') === 'variable');
    const objChild = action.children.find(c => c.getAttribute('role') === 'object');
    const bodyChild = action.children.find(c => c.getAttribute('role') === 'body');

    const variable = varChild ? this.generateAction(varChild).replace(/;$/, '') : 'let i';
    const object = objChild ? this.generateAction(objChild) : '{}';
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    return `for (${variable} in ${object}) ${body}`;
  }

  genForOf(action) {
    const varChild = action.children.find(c => c.getAttribute('role') === 'variable');
    const iterChild = action.children.find(c => c.getAttribute('role') === 'iterable');
    const bodyChild = action.children.find(c => c.getAttribute('role') === 'body');
    const isAwait = action.getAttribute('await') === 'true';

    const variable = varChild ? this.generateAction(varChild).replace(/;$/, '') : 'let item';
    const iterable = iterChild ? this.generateAction(iterChild) : '[]';
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    const awaitKeyword = isAwait ? 'await ' : '';
    return `for ${awaitKeyword}(${variable} of ${iterable}) ${body}`;
  }

  genWhile(action) {
    const testChild = action.children.find(c => c.getAttribute('role') === 'test');
    const bodyChild = action.children.find(c => c.getAttribute('role') === 'body');

    const test = testChild ? this.generateAction(testChild) : 'true';
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    return `while (${test}) ${body}`;
  }

  genDoWhile(action) {
    const testChild = action.children.find(c => c.getAttribute('role') === 'test');
    const bodyChild = action.children.find(c => c.getAttribute('role') === 'body');

    const test = testChild ? this.generateAction(testChild) : 'true';
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    return `do ${body} while (${test})${this.semi}`;
  }

  genSwitch(action) {
    const discriminantChild = action.children.find(c => c.getAttribute('role') === 'discriminant');
    const cases = action.children.filter(c =>
      c.actionType === 'case' || c.actionType === 'default'
    );

    const discriminant = discriminantChild ? this.generateAction(discriminantChild) : '';

    this.indentLevel++;
    const caseCode = cases.map(c => this.indent + this.generateAction(c)).join(this.eol);
    this.indentLevel--;

    return `switch (${discriminant}) {${this.eol}${caseCode}${this.eol}${this.indent}}`;
  }

  genCase(action) {
    const isDefault = action.actionType === 'default';
    const testChild = action.children.find(c => c.getAttribute('role') === 'test');
    const consequentChildren = action.children.filter(c => c.getAttribute('role') === 'consequent');

    this.indentLevel++;
    const statements = consequentChildren.map(c =>
      this.indent + this.generateAction(c)
    );
    this.indentLevel--;

    if (isDefault) {
      return `default:${this.eol}${statements.join(this.eol)}`;
    }

    const test = testChild ? this.generateAction(testChild) : '';
    return `case ${test}:${this.eol}${statements.join(this.eol)}`;
  }

  genTry(action) {
    // Block has role 'try'
    const blockChild = action.children.find(c => c.getAttribute('role') === 'try');
    // Catch is a child with actionType 'catch'
    const catchChild = action.children.find(c => c.actionType === 'catch');
    // Finally is a child with actionType 'finally'
    const finallyChild = action.children.find(c => c.actionType === 'finally');

    const block = blockChild ? this.generateAction(blockChild) : '{}';

    let result = `try ${block}`;

    if (catchChild) {
      result += ` ${this.generateAction(catchChild)}`;
    }

    if (finallyChild) {
      result += ` ${this.generateAction(finallyChild)}`;
    }

    return result;
  }

  genCatch(action) {
    const param = action.getAttribute('param');
    // Body is the first child (block)
    const bodyChild = action.children[0];

    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    if (param) {
      return `catch (${param}) ${body}`;
    }
    return `catch ${body}`;
  }

  genFinally(action) {
    // The actual block is a child
    const bodyChild = action.children[0];
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';
    return `finally ${body}`;
  }

  // === Statements ===

  genReturn(action) {
    // Return argument is first child (no role attribute)
    const argChild = action.children[0];

    if (argChild) {
      const arg = this.generateAction(argChild);
      return `return ${arg}${this.semi}`;
    }

    return `return${this.semi}`;
  }

  genThrow(action) {
    const argChild = action.children.find(c => c.getAttribute('role') === 'argument');
    const arg = argChild ? this.generateAction(argChild) : 'new Error()';
    return `throw ${arg}${this.semi}`;
  }

  genBreak(action) {
    const label = action.getAttribute('label');
    if (label) {
      return `break ${label}${this.semi}`;
    }
    return `break${this.semi}`;
  }

  genContinue(action) {
    const label = action.getAttribute('label');
    if (label) {
      return `continue ${label}${this.semi}`;
    }
    return `continue${this.semi}`;
  }

  genExpressionStatement(action) {
    const exprChild = action.children[0];
    if (exprChild) {
      return this.generateAction(exprChild) + this.semi;
    }
    return '';
  }

  // === Expressions ===

  genCall(action) {
    const calleeChild = action.children.find(c => c.getAttribute('role') === 'callee');
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');

    const callee = calleeChild ? this.generateAction(calleeChild) : '';
    const argList = args.map(a => this.generateAction(a)).join(', ');

    return `${callee}(${argList})`;
  }

  genNew(action) {
    // Constructor has role='constructor'
    const calleeChild = action.children.find(c =>
      c.getAttribute('role') === 'constructor' || c.getAttribute('role') === 'callee'
    );
    const args = action.children.filter(c => c.getAttribute('role') === 'argument');

    const callee = calleeChild ? this.generateAction(calleeChild) : 'Object';
    const argList = args.map(a => this.generateAction(a)).join(', ');

    return `new ${callee}(${argList})`;
  }

  genMemberAccess(action) {
    const objChild = action.children.find(c => c.getAttribute('role') === 'object');
    const propChild = action.children.find(c => c.getAttribute('role') === 'property');
    const computed = action.getAttribute('computed') === true || action.getAttribute('computed') === 'true';
    const property = action.getAttribute('property');
    const optional = action.getAttribute('optional') === true || action.getAttribute('optional') === 'true';

    const obj = objChild ? this.generateAction(objChild) : '';

    // Use property from attribute if available, otherwise from child
    let prop = property;
    if (!prop && propChild) {
      prop = this.generateAction(propChild);
    }

    const optionalChain = optional ? '?' : '';

    if (computed) {
      return `${obj}${optionalChain}[${prop}]`;
    }

    return `${obj}${optionalChain}.${prop}`;
  }

  genAssignment(action) {
    const leftChild = action.children.find(c => c.getAttribute('role') === 'left');
    const rightChild = action.children.find(c => c.getAttribute('role') === 'right');
    const operator = action.getAttribute('operator') || '=';

    const left = leftChild ? this.generateAction(leftChild) : '';
    const right = rightChild ? this.generateAction(rightChild) : '';

    return `${left} ${operator} ${right}`;
  }

  genBinary(action) {
    const leftChild = action.children.find(c => c.getAttribute('role') === 'left');
    const rightChild = action.children.find(c => c.getAttribute('role') === 'right');
    const operator = action.getAttribute('operator') || '+';

    const left = leftChild ? this.generateAction(leftChild) : '';
    const right = rightChild ? this.generateAction(rightChild) : '';

    // Add parentheses for clarity in complex expressions
    return `${left} ${operator} ${right}`;
  }

  genUnary(action) {
    const argChild = action.children.find(c => c.getAttribute('role') === 'argument');
    const operator = action.getAttribute('operator') || '!';
    const prefix = action.getAttribute('prefix') !== 'false';

    const arg = argChild ? this.generateAction(argChild) : '';

    // Some operators need space (typeof, void, delete)
    const needsSpace = ['typeof', 'void', 'delete'].includes(operator);

    if (prefix) {
      return needsSpace ? `${operator} ${arg}` : `${operator}${arg}`;
    }
    return `${arg}${operator}`;
  }

  genLogical(action) {
    const leftChild = action.children.find(c => c.getAttribute('role') === 'left');
    const rightChild = action.children.find(c => c.getAttribute('role') === 'right');
    const operator = action.getAttribute('operator') || '&&';

    const left = leftChild ? this.generateAction(leftChild) : '';
    const right = rightChild ? this.generateAction(rightChild) : '';

    return `${left} ${operator} ${right}`;
  }

  genConditional(action) {
    const testChild = action.children.find(c => c.getAttribute('role') === 'test');
    const consequentChild = action.children.find(c => c.getAttribute('role') === 'consequent');
    const alternateChild = action.children.find(c => c.getAttribute('role') === 'alternate');

    const test = testChild ? this.generateAction(testChild) : 'true';
    const consequent = consequentChild ? this.generateAction(consequentChild) : '';
    const alternate = alternateChild ? this.generateAction(alternateChild) : '';

    return `${test} ? ${consequent} : ${alternate}`;
  }

  genUpdate(action) {
    const argChild = action.children.find(c => c.getAttribute('role') === 'argument');
    const operator = action.getAttribute('operator') || '++';
    const prefix = action.getAttribute('prefix') === 'true';

    const arg = argChild ? this.generateAction(argChild) : '';

    if (prefix) {
      return `${operator}${arg}`;
    }
    return `${arg}${operator}`;
  }

  genAwait(action) {
    // Await argument is first child (no role attribute)
    const argChild = action.children[0];
    const arg = argChild ? this.generateAction(argChild) : '';
    return `await ${arg}`;
  }

  genYield(action) {
    const argChild = action.children.find(c => c.getAttribute('role') === 'argument');
    const delegate = action.getAttribute('delegate') === 'true';
    const arg = argChild ? this.generateAction(argChild) : '';

    if (delegate) {
      return `yield* ${arg}`;
    }
    return arg ? `yield ${arg}` : 'yield';
  }

  genSpread(action) {
    // Spread argument is first child (no role attribute)
    const argChild = action.children[0];
    const arg = argChild ? this.generateAction(argChild) : '';
    return `...${arg}`;
  }

  // === Literals and Identifiers ===

  genLiteral(action) {
    const value = action.getAttribute('value');
    const type = action.getAttribute('type');
    const raw = action.getAttribute('raw');

    // Use raw value if available (preserves original formatting)
    if (raw !== undefined && raw !== null) {
      return raw;
    }

    switch (type) {
      case 'string':
        // Escape and quote string
        return JSON.stringify(value);
      case 'number':
        return String(value);
      case 'boolean':
        return value === 'true' || value === true ? 'true' : 'false';
      case 'null':
        return 'null';
      case 'undefined':
        return 'undefined';
      case 'regexp':
        return value;
      default:
        // Try to infer type
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return JSON.stringify(value);
        return String(value);
    }
  }

  genIdentifier(action) {
    return action.getAttribute('name') || '';
  }

  genArray(action) {
    const elements = action.children.map(c => this.generateAction(c));
    return `[${elements.join(', ')}]`;
  }

  genObject(action) {
    if (action.children.length === 0) {
      return '{}';
    }

    const properties = action.children.map(c => this.generateAction(c));

    // For simple objects, keep on one line
    if (properties.length <= 3 && properties.every(p => p.length < 30)) {
      return `{ ${properties.join(', ')} }`;
    }

    // For complex objects, use multiple lines
    this.indentLevel++;
    const formattedProps = action.children.map(c =>
      this.indent + this.generateAction(c)
    );
    this.indentLevel--;

    return `{${this.eol}${formattedProps.join(',' + this.eol)}${this.eol}${this.indent}}`;
  }

  genProperty(action) {
    const key = action.getAttribute('key');
    const computed = action.getAttribute('computed') === 'true';
    const shorthand = action.getAttribute('shorthand') === 'true';
    const method = action.getAttribute('method') === 'true';
    const kind = action.getAttribute('kind');

    const valueChild = action.children.find(c => c.getAttribute('role') === 'value');

    if (shorthand) {
      return key;
    }

    const keyStr = computed ? `[${key}]` : key;

    if (method && valueChild) {
      // Method shorthand
      const func = valueChild;
      const params = func.children
        .filter(c => c.getAttribute('role') === 'param')
        .map(c => this.generateAction(c))
        .join(', ');
      const bodyChild = func.children.find(c => c.getAttribute('role') === 'body');
      const body = bodyChild ? this.generateAction(bodyChild) : '{}';

      if (kind === 'get') {
        return `get ${keyStr}() ${body}`;
      } else if (kind === 'set') {
        return `set ${keyStr}(${params}) ${body}`;
      }
      return `${keyStr}(${params}) ${body}`;
    }

    const value = valueChild ? this.generateAction(valueChild) : '';
    return `${keyStr}: ${value}`;
  }

  genTemplateLiteral(action) {
    // Quasis are literal children with type='templatePart'
    const quasis = action.children.filter(c =>
      c.actionType === 'literal' && c.getAttribute('type') === 'templatePart'
    );
    const expressions = action.children.filter(c => c.getAttribute('role') === 'expression');

    let result = '`';

    for (let i = 0; i < quasis.length; i++) {
      const quasi = quasis[i];
      const raw = quasi.getAttribute('raw') || quasi.getAttribute('value') || '';
      result += raw;

      if (i < expressions.length) {
        const expr = this.generateAction(expressions[i]);
        result += `\${${expr}}`;
      }
    }

    result += '`';
    return result;
  }

  // === Functions ===

  genArrowFunction(action) {
    const isAsync = action.getAttribute('async') === true || action.getAttribute('async') === 'true';
    const expression = action.getAttribute('expression') === true || action.getAttribute('expression') === 'true';

    // Params are declareParam children
    const params = action.children
      .filter(c => c.actionType === 'declareParam')
      .map(c => this.generateAction(c));

    // Body is a block or expression (last non-param child)
    const nonParams = action.children.filter(c => c.actionType !== 'declareParam');
    const bodyChild = nonParams[nonParams.length - 1];

    let paramStr;
    if (params.length === 1 && !params[0].includes('=') && !params[0].includes('...')) {
      paramStr = params[0];
    } else {
      paramStr = `(${params.join(', ')})`;
    }

    const asyncPrefix = isAsync ? 'async ' : '';

    if (expression && bodyChild) {
      // Expression body (no braces)
      const body = this.generateAction(bodyChild);
      return `${asyncPrefix}${paramStr} => ${body}`;
    }

    const body = bodyChild ? this.generateAction(bodyChild) : '{}';
    return `${asyncPrefix}${paramStr} => ${body}`;
  }

  genFunctionExpression(action) {
    const name = action.getAttribute('name') || '';
    const isAsync = action.getAttribute('async') === 'true';
    const isGenerator = action.getAttribute('generator') === 'true';

    // Params are declareParam children
    const params = action.children
      .filter(c => c.actionType === 'declareParam')
      .map(c => this.generateAction(c))
      .join(', ');

    // Body is a block child
    const bodyChild = action.children.find(c => c.actionType === 'block');
    const body = bodyChild ? this.generateAction(bodyChild) : '{}';

    let prefix = '';
    if (isAsync) prefix += 'async ';
    prefix += 'function';
    if (isGenerator) prefix += '*';

    const nameStr = name ? ` ${name}` : '';
    return `${prefix}${nameStr}(${params}) ${body}`;
  }

  // === Modules ===

  genImport(action) {
    const source = action.getAttribute('source');
    const specifiers = action.children;

    if (specifiers.length === 0) {
      // Side-effect import
      return `import ${JSON.stringify(source)}${this.semi}`;
    }

    // Specifiers are identifier actions with name and imported attributes
    const parts = [];
    const namedSpecs = [];

    for (const spec of specifiers) {
      const name = spec.getAttribute('name');
      const imported = spec.getAttribute('imported');

      // Check if it's a default import (imported === 'default' or no imported)
      if (imported === 'default' || (!imported && name)) {
        // Default import
        parts.unshift(name);
      } else if (imported === '*') {
        // Namespace import
        parts.push(`* as ${name}`);
      } else {
        // Named import
        if (imported && imported !== name) {
          namedSpecs.push(`${imported} as ${name}`);
        } else {
          namedSpecs.push(name);
        }
      }
    }

    if (namedSpecs.length > 0) {
      parts.push(`{ ${namedSpecs.join(', ')} }`);
    }

    return `import ${parts.join(', ')} from ${JSON.stringify(source)}${this.semi}`;
  }

  genExport(action) {
    const source = action.getAttribute('source');
    const specifiers = action.children.filter(s => s.getAttribute('role') === 'specifier');
    const declaration = action.children.find(s => s.getAttribute('role') === 'declaration');

    if (declaration) {
      const decl = this.generateAction(declaration);
      return `export ${decl}`;
    }

    if (specifiers.length > 0) {
      const specs = specifiers.map(s => {
        const local = s.getAttribute('local');
        const exported = s.getAttribute('exported');
        return local === exported ? local : `${local} as ${exported}`;
      });

      let result = `export { ${specs.join(', ')} }`;
      if (source) {
        result += ` from ${JSON.stringify(source)}`;
      }
      return result + this.semi;
    }

    return 'export {}' + this.semi;
  }

  genExportDefault(action) {
    const declaration = action.children[0];
    if (declaration) {
      const decl = this.generateAction(declaration);
      return `export default ${decl}`;
    }
    return 'export default undefined' + this.semi;
  }
}

module.exports = JavaScriptGenerator;
