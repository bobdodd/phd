/**
 * ASTTransformer - Transforms Babel AST into ActionLanguage tree
 *
 * Maps JavaScript AST nodes to semantic Action nodes that represent
 * the program's behavior in a way suitable for accessibility analysis.
 */

const Action = require('../action-language/Action');
const ActionTree = require('../action-language/ActionTree');

class ASTTransformer {
  constructor() {
    this.tree = new ActionTree();
    this.registerStandardTypes();
  }

  /**
   * Register standard action types and attribute types
   */
  registerStandardTypes() {
    // Program structure
    this.tree.registerActionType('program');
    this.tree.registerActionType('seq');
    this.tree.registerActionType('block');

    // Declarations
    this.tree.registerActionType('declareVar');
    this.tree.registerActionType('declareConst');
    this.tree.registerActionType('declareFunction');
    this.tree.registerActionType('declareClass');
    this.tree.registerActionType('declareMethod');
    this.tree.registerActionType('declareParam');

    // Control flow
    this.tree.registerActionType('if');
    this.tree.registerActionType('else');
    this.tree.registerActionType('for');
    this.tree.registerActionType('forIn');
    this.tree.registerActionType('forOf');
    this.tree.registerActionType('while');
    this.tree.registerActionType('doWhile');
    this.tree.registerActionType('switch');
    this.tree.registerActionType('case');
    this.tree.registerActionType('default');
    this.tree.registerActionType('try');
    this.tree.registerActionType('catch');
    this.tree.registerActionType('finally');

    // Statements
    this.tree.registerActionType('return');
    this.tree.registerActionType('throw');
    this.tree.registerActionType('break');
    this.tree.registerActionType('continue');
    this.tree.registerActionType('expression');

    // Expressions
    this.tree.registerActionType('call');
    this.tree.registerActionType('new');
    this.tree.registerActionType('memberAccess');
    this.tree.registerActionType('assign');
    this.tree.registerActionType('binaryOp');
    this.tree.registerActionType('unaryOp');
    this.tree.registerActionType('logicalOp');
    this.tree.registerActionType('conditional');
    this.tree.registerActionType('await');
    this.tree.registerActionType('yield');

    // Literals and identifiers
    this.tree.registerActionType('identifier');
    this.tree.registerActionType('literal');
    this.tree.registerActionType('array');
    this.tree.registerActionType('object');
    this.tree.registerActionType('property');
    this.tree.registerActionType('template');
    this.tree.registerActionType('spread');

    // Functions
    this.tree.registerActionType('arrowFunction');
    this.tree.registerActionType('functionExpr');

    // Modules
    this.tree.registerActionType('import');
    this.tree.registerActionType('export');
    this.tree.registerActionType('exportDefault');

    // Accessibility-relevant patterns (will be detected during analysis)
    this.tree.registerActionType('eventHandler');
    this.tree.registerActionType('domAccess');
    this.tree.registerActionType('timer');
    this.tree.registerActionType('focusOp');

    // Register attribute types
    this.tree.registerAttributeType('name', 'String', 'Identifier name');
    this.tree.registerAttributeType('value', 'String', 'Literal value');
    this.tree.registerAttributeType('kind', 'String', 'Declaration kind (var/let/const)');
    this.tree.registerAttributeType('operator', 'String', 'Operator symbol');
    this.tree.registerAttributeType('async', 'Boolean', 'Is async function');
    this.tree.registerAttributeType('generator', 'Boolean', 'Is generator function');
    this.tree.registerAttributeType('computed', 'Boolean', 'Is computed property');
    this.tree.registerAttributeType('sourceStart', 'Integer', 'Source start position');
    this.tree.registerAttributeType('sourceEnd', 'Integer', 'Source end position');
    this.tree.registerAttributeType('line', 'Integer', 'Source line number');
    this.tree.registerAttributeType('column', 'Integer', 'Source column number');
  }

  /**
   * Transform a Babel AST into an ActionTree
   * @param {Object} ast - Babel AST (from JavaScriptParser.parse)
   * @returns {ActionTree}
   */
  transform(ast) {
    if (ast.type !== 'File' && ast.type !== 'Program') {
      throw new Error(`Expected File or Program node, got ${ast.type}`);
    }

    const programNode = ast.type === 'File' ? ast.program : ast;
    const programAction = this.transformProgram(programNode);

    this.tree.setRoot(programAction);
    return this.tree;
  }

  /**
   * Transform Program node
   */
  transformProgram(node) {
    const action = this.createAction('program', node);

    for (const statement of node.body) {
      const childAction = this.transformNode(statement);
      if (childAction) {
        action.addChild(childAction);
      }
    }

    return action;
  }

  /**
   * Transform any AST node (dispatcher)
   * @param {Object} node - Babel AST node
   * @returns {Action|null}
   */
  transformNode(node) {
    if (!node) return null;

    const handler = this.nodeHandlers[node.type];
    if (handler) {
      return handler.call(this, node);
    }

    // Unknown node type - create generic action
    console.warn(`Unknown node type: ${node.type}`);
    return this.createAction(node.type, node);
  }

  /**
   * Node type handlers
   */
  get nodeHandlers() {
    return {
      // Declarations
      'VariableDeclaration': this.transformVariableDeclaration,
      'VariableDeclarator': this.transformVariableDeclarator,
      'FunctionDeclaration': this.transformFunctionDeclaration,
      'ClassDeclaration': this.transformClassDeclaration,

      // Statements
      'BlockStatement': this.transformBlockStatement,
      'ExpressionStatement': this.transformExpressionStatement,
      'IfStatement': this.transformIfStatement,
      'ForStatement': this.transformForStatement,
      'ForInStatement': this.transformForInStatement,
      'ForOfStatement': this.transformForOfStatement,
      'WhileStatement': this.transformWhileStatement,
      'DoWhileStatement': this.transformDoWhileStatement,
      'SwitchStatement': this.transformSwitchStatement,
      'SwitchCase': this.transformSwitchCase,
      'TryStatement': this.transformTryStatement,
      'CatchClause': this.transformCatchClause,
      'ReturnStatement': this.transformReturnStatement,
      'ThrowStatement': this.transformThrowStatement,
      'BreakStatement': this.transformBreakStatement,
      'ContinueStatement': this.transformContinueStatement,
      'EmptyStatement': () => null,

      // Expressions
      'CallExpression': this.transformCallExpression,
      'NewExpression': this.transformNewExpression,
      'MemberExpression': this.transformMemberExpression,
      'AssignmentExpression': this.transformAssignmentExpression,
      'BinaryExpression': this.transformBinaryExpression,
      'UnaryExpression': this.transformUnaryExpression,
      'UpdateExpression': this.transformUpdateExpression,
      'LogicalExpression': this.transformLogicalExpression,
      'ConditionalExpression': this.transformConditionalExpression,
      'SequenceExpression': this.transformSequenceExpression,
      'AwaitExpression': this.transformAwaitExpression,
      'YieldExpression': this.transformYieldExpression,

      // Functions
      'ArrowFunctionExpression': this.transformArrowFunction,
      'FunctionExpression': this.transformFunctionExpression,

      // Literals and identifiers
      'Identifier': this.transformIdentifier,
      'Literal': this.transformLiteral,
      'StringLiteral': this.transformStringLiteral,
      'NumericLiteral': this.transformNumericLiteral,
      'BooleanLiteral': this.transformBooleanLiteral,
      'NullLiteral': this.transformNullLiteral,
      'RegExpLiteral': this.transformRegExpLiteral,
      'ArrayExpression': this.transformArrayExpression,
      'ObjectExpression': this.transformObjectExpression,
      'ObjectProperty': this.transformObjectProperty,
      'ObjectMethod': this.transformObjectMethod,
      'SpreadElement': this.transformSpreadElement,
      'TemplateLiteral': this.transformTemplateLiteral,
      'TaggedTemplateExpression': this.transformTaggedTemplateExpression,
      'TemplateElement': this.transformTemplateElement,

      // Modules
      'ImportDeclaration': this.transformImportDeclaration,
      'ExportNamedDeclaration': this.transformExportNamedDeclaration,
      'ExportDefaultDeclaration': this.transformExportDefaultDeclaration,

      // Patterns
      'AssignmentPattern': this.transformAssignmentPattern,
      'RestElement': this.transformRestElement,
      'ObjectPattern': this.transformObjectPattern,
      'ArrayPattern': this.transformArrayPattern,

      // Class members
      'ClassBody': this.transformClassBody,
      'ClassMethod': this.transformClassMethod,
      'ClassProperty': this.transformClassProperty,

      // Other
      'ThisExpression': this.transformThisExpression,
      'Super': this.transformSuper
    };
  }

  // === Declaration Handlers ===

  transformVariableDeclaration(node) {
    const action = this.createAction('seq', node, { kind: node.kind });

    for (const declarator of node.declarations) {
      const declAction = this.transformVariableDeclarator(declarator, node.kind);
      if (declAction) {
        action.addChild(declAction);
      }
    }

    // If only one declaration, return it directly
    if (action.children.length === 1) {
      return action.children[0];
    }

    return action;
  }

  transformVariableDeclarator(node, kind = 'var') {
    const actionType = kind === 'const' ? 'declareConst' : 'declareVar';
    const name = this.getPatternName(node.id);
    const action = this.createAction(actionType, node, { name, kind });

    if (node.init) {
      const initAction = this.transformNode(node.init);
      if (initAction) {
        action.addChild(initAction);
      }
    }

    return action;
  }

  transformFunctionDeclaration(node) {
    const action = this.createAction('declareFunction', node, {
      name: node.id?.name || '<anonymous>',
      async: node.async,
      generator: node.generator
    });

    // Add parameters
    for (const param of node.params) {
      const paramAction = this.createAction('declareParam', param, {
        name: this.getPatternName(param)
      });
      action.addChild(paramAction);
    }

    // Add body
    if (node.body) {
      const bodyAction = this.transformNode(node.body);
      if (bodyAction) {
        action.addChild(bodyAction);
      }
    }

    return action;
  }

  transformClassDeclaration(node) {
    const action = this.createAction('declareClass', node, {
      name: node.id?.name || '<anonymous>'
    });

    if (node.superClass) {
      const superAction = this.transformNode(node.superClass);
      if (superAction) {
        superAction.setAttribute('role', 'extends');
        action.addChild(superAction);
      }
    }

    if (node.body) {
      const bodyAction = this.transformNode(node.body);
      if (bodyAction) {
        action.addChild(bodyAction);
      }
    }

    return action;
  }

  // === Statement Handlers ===

  transformBlockStatement(node) {
    const action = this.createAction('block', node);

    for (const statement of node.body) {
      const childAction = this.transformNode(statement);
      if (childAction) {
        action.addChild(childAction);
      }
    }

    return action;
  }

  transformExpressionStatement(node) {
    // For simple expressions, just return the expression directly
    return this.transformNode(node.expression);
  }

  transformIfStatement(node) {
    const action = this.createAction('if', node);

    // Condition
    const condAction = this.transformNode(node.test);
    if (condAction) {
      condAction.setAttribute('role', 'condition');
      action.addChild(condAction);
    }

    // Consequent (then branch)
    const thenAction = this.transformNode(node.consequent);
    if (thenAction) {
      thenAction.setAttribute('role', 'then');
      action.addChild(thenAction);
    }

    // Alternate (else branch)
    if (node.alternate) {
      const elseAction = this.transformNode(node.alternate);
      if (elseAction) {
        elseAction.setAttribute('role', 'else');
        action.addChild(elseAction);
      }
    }

    return action;
  }

  transformForStatement(node) {
    const action = this.createAction('for', node);

    if (node.init) {
      const initAction = this.transformNode(node.init);
      if (initAction) {
        initAction.setAttribute('role', 'init');
        action.addChild(initAction);
      }
    }

    if (node.test) {
      const testAction = this.transformNode(node.test);
      if (testAction) {
        testAction.setAttribute('role', 'test');
        action.addChild(testAction);
      }
    }

    if (node.update) {
      const updateAction = this.transformNode(node.update);
      if (updateAction) {
        updateAction.setAttribute('role', 'update');
        action.addChild(updateAction);
      }
    }

    const bodyAction = this.transformNode(node.body);
    if (bodyAction) {
      bodyAction.setAttribute('role', 'body');
      action.addChild(bodyAction);
    }

    return action;
  }

  transformForInStatement(node) {
    const action = this.createAction('forIn', node);

    const leftAction = this.transformNode(node.left);
    if (leftAction) {
      leftAction.setAttribute('role', 'variable');
      action.addChild(leftAction);
    }

    const rightAction = this.transformNode(node.right);
    if (rightAction) {
      rightAction.setAttribute('role', 'object');
      action.addChild(rightAction);
    }

    const bodyAction = this.transformNode(node.body);
    if (bodyAction) {
      bodyAction.setAttribute('role', 'body');
      action.addChild(bodyAction);
    }

    return action;
  }

  transformForOfStatement(node) {
    const action = this.createAction('forOf', node, { await: node.await });

    const leftAction = this.transformNode(node.left);
    if (leftAction) {
      leftAction.setAttribute('role', 'variable');
      action.addChild(leftAction);
    }

    const rightAction = this.transformNode(node.right);
    if (rightAction) {
      rightAction.setAttribute('role', 'iterable');
      action.addChild(rightAction);
    }

    const bodyAction = this.transformNode(node.body);
    if (bodyAction) {
      bodyAction.setAttribute('role', 'body');
      action.addChild(bodyAction);
    }

    return action;
  }

  transformWhileStatement(node) {
    const action = this.createAction('while', node);

    const testAction = this.transformNode(node.test);
    if (testAction) {
      testAction.setAttribute('role', 'condition');
      action.addChild(testAction);
    }

    const bodyAction = this.transformNode(node.body);
    if (bodyAction) {
      bodyAction.setAttribute('role', 'body');
      action.addChild(bodyAction);
    }

    return action;
  }

  transformDoWhileStatement(node) {
    const action = this.createAction('doWhile', node);

    const bodyAction = this.transformNode(node.body);
    if (bodyAction) {
      bodyAction.setAttribute('role', 'body');
      action.addChild(bodyAction);
    }

    const testAction = this.transformNode(node.test);
    if (testAction) {
      testAction.setAttribute('role', 'condition');
      action.addChild(testAction);
    }

    return action;
  }

  transformSwitchStatement(node) {
    const action = this.createAction('switch', node);

    const discriminantAction = this.transformNode(node.discriminant);
    if (discriminantAction) {
      discriminantAction.setAttribute('role', 'discriminant');
      action.addChild(discriminantAction);
    }

    for (const caseNode of node.cases) {
      const caseAction = this.transformSwitchCase(caseNode);
      if (caseAction) {
        action.addChild(caseAction);
      }
    }

    return action;
  }

  transformSwitchCase(node) {
    const isDefault = node.test === null;
    const action = this.createAction(isDefault ? 'default' : 'case', node);

    if (node.test) {
      const testAction = this.transformNode(node.test);
      if (testAction) {
        testAction.setAttribute('role', 'test');
        action.addChild(testAction);
      }
    }

    for (const statement of node.consequent) {
      const stmtAction = this.transformNode(statement);
      if (stmtAction) {
        action.addChild(stmtAction);
      }
    }

    return action;
  }

  transformTryStatement(node) {
    const action = this.createAction('try', node);

    const blockAction = this.transformNode(node.block);
    if (blockAction) {
      blockAction.setAttribute('role', 'try');
      action.addChild(blockAction);
    }

    if (node.handler) {
      const catchAction = this.transformCatchClause(node.handler);
      if (catchAction) {
        action.addChild(catchAction);
      }
    }

    if (node.finalizer) {
      const finallyAction = this.transformNode(node.finalizer);
      if (finallyAction) {
        finallyAction.setAttribute('role', 'finally');
        const finallyWrapper = this.createAction('finally', node.finalizer);
        finallyWrapper.addChild(finallyAction);
        action.addChild(finallyWrapper);
      }
    }

    return action;
  }

  transformCatchClause(node) {
    const action = this.createAction('catch', node);

    if (node.param) {
      action.setAttribute('param', this.getPatternName(node.param));
    }

    const bodyAction = this.transformNode(node.body);
    if (bodyAction) {
      action.addChild(bodyAction);
    }

    return action;
  }

  transformReturnStatement(node) {
    const action = this.createAction('return', node);

    if (node.argument) {
      const argAction = this.transformNode(node.argument);
      if (argAction) {
        action.addChild(argAction);
      }
    }

    return action;
  }

  transformThrowStatement(node) {
    const action = this.createAction('throw', node);

    if (node.argument) {
      const argAction = this.transformNode(node.argument);
      if (argAction) {
        action.addChild(argAction);
      }
    }

    return action;
  }

  transformBreakStatement(node) {
    return this.createAction('break', node, {
      label: node.label?.name
    });
  }

  transformContinueStatement(node) {
    return this.createAction('continue', node, {
      label: node.label?.name
    });
  }

  // === Expression Handlers ===

  transformCallExpression(node) {
    const action = this.createAction('call', node);

    // Detect special patterns for accessibility analysis
    const calleeName = this.getCalleeName(node.callee);
    if (calleeName) {
      action.setAttribute('callee', calleeName);
      this.detectAccessibilityPattern(action, calleeName, node);
    }

    const calleeAction = this.transformNode(node.callee);
    if (calleeAction) {
      calleeAction.setAttribute('role', 'callee');
      action.addChild(calleeAction);
    }

    for (const arg of node.arguments) {
      const argAction = this.transformNode(arg);
      if (argAction) {
        argAction.setAttribute('role', 'argument');
        action.addChild(argAction);
      }
    }

    return action;
  }

  transformNewExpression(node) {
    const action = this.createAction('new', node);

    const calleeAction = this.transformNode(node.callee);
    if (calleeAction) {
      calleeAction.setAttribute('role', 'constructor');
      action.addChild(calleeAction);
    }

    for (const arg of node.arguments) {
      const argAction = this.transformNode(arg);
      if (argAction) {
        argAction.setAttribute('role', 'argument');
        action.addChild(argAction);
      }
    }

    return action;
  }

  transformMemberExpression(node) {
    const action = this.createAction('memberAccess', node, {
      computed: node.computed,
      property: node.computed ? undefined : node.property?.name
    });

    const objectAction = this.transformNode(node.object);
    if (objectAction) {
      objectAction.setAttribute('role', 'object');
      action.addChild(objectAction);
    }

    if (node.computed) {
      const propAction = this.transformNode(node.property);
      if (propAction) {
        propAction.setAttribute('role', 'property');
        action.addChild(propAction);
      }
    }

    return action;
  }

  transformAssignmentExpression(node) {
    const action = this.createAction('assign', node, {
      operator: node.operator
    });

    const leftAction = this.transformNode(node.left);
    if (leftAction) {
      leftAction.setAttribute('role', 'left');
      action.addChild(leftAction);
    }

    const rightAction = this.transformNode(node.right);
    if (rightAction) {
      rightAction.setAttribute('role', 'right');
      action.addChild(rightAction);
    }

    return action;
  }

  transformBinaryExpression(node) {
    const action = this.createAction('binaryOp', node, {
      operator: node.operator
    });

    const leftAction = this.transformNode(node.left);
    if (leftAction) {
      leftAction.setAttribute('role', 'left');
      action.addChild(leftAction);
    }

    const rightAction = this.transformNode(node.right);
    if (rightAction) {
      rightAction.setAttribute('role', 'right');
      action.addChild(rightAction);
    }

    return action;
  }

  transformUnaryExpression(node) {
    const action = this.createAction('unaryOp', node, {
      operator: node.operator,
      prefix: node.prefix
    });

    const argAction = this.transformNode(node.argument);
    if (argAction) {
      action.addChild(argAction);
    }

    return action;
  }

  transformUpdateExpression(node) {
    const action = this.createAction('unaryOp', node, {
      operator: node.operator,
      prefix: node.prefix
    });

    const argAction = this.transformNode(node.argument);
    if (argAction) {
      action.addChild(argAction);
    }

    return action;
  }

  transformLogicalExpression(node) {
    const action = this.createAction('logicalOp', node, {
      operator: node.operator
    });

    const leftAction = this.transformNode(node.left);
    if (leftAction) {
      leftAction.setAttribute('role', 'left');
      action.addChild(leftAction);
    }

    const rightAction = this.transformNode(node.right);
    if (rightAction) {
      rightAction.setAttribute('role', 'right');
      action.addChild(rightAction);
    }

    return action;
  }

  transformConditionalExpression(node) {
    const action = this.createAction('conditional', node);

    const testAction = this.transformNode(node.test);
    if (testAction) {
      testAction.setAttribute('role', 'condition');
      action.addChild(testAction);
    }

    const consequentAction = this.transformNode(node.consequent);
    if (consequentAction) {
      consequentAction.setAttribute('role', 'then');
      action.addChild(consequentAction);
    }

    const alternateAction = this.transformNode(node.alternate);
    if (alternateAction) {
      alternateAction.setAttribute('role', 'else');
      action.addChild(alternateAction);
    }

    return action;
  }

  transformSequenceExpression(node) {
    const action = this.createAction('seq', node);

    for (const expr of node.expressions) {
      const exprAction = this.transformNode(expr);
      if (exprAction) {
        action.addChild(exprAction);
      }
    }

    return action;
  }

  transformAwaitExpression(node) {
    const action = this.createAction('await', node);

    const argAction = this.transformNode(node.argument);
    if (argAction) {
      action.addChild(argAction);
    }

    return action;
  }

  transformYieldExpression(node) {
    const action = this.createAction('yield', node, {
      delegate: node.delegate
    });

    if (node.argument) {
      const argAction = this.transformNode(node.argument);
      if (argAction) {
        action.addChild(argAction);
      }
    }

    return action;
  }

  // === Function Handlers ===

  transformArrowFunction(node) {
    const action = this.createAction('arrowFunction', node, {
      async: node.async,
      expression: node.expression
    });

    for (const param of node.params) {
      const paramAction = this.createAction('declareParam', param, {
        name: this.getPatternName(param)
      });
      action.addChild(paramAction);
    }

    const bodyAction = this.transformNode(node.body);
    if (bodyAction) {
      bodyAction.setAttribute('role', 'body');
      action.addChild(bodyAction);
    }

    return action;
  }

  transformFunctionExpression(node) {
    const action = this.createAction('functionExpr', node, {
      name: node.id?.name,
      async: node.async,
      generator: node.generator
    });

    for (const param of node.params) {
      const paramAction = this.createAction('declareParam', param, {
        name: this.getPatternName(param)
      });
      action.addChild(paramAction);
    }

    if (node.body) {
      const bodyAction = this.transformNode(node.body);
      if (bodyAction) {
        bodyAction.setAttribute('role', 'body');
        action.addChild(bodyAction);
      }
    }

    return action;
  }

  // === Literal and Identifier Handlers ===

  transformIdentifier(node) {
    return this.createAction('identifier', node, { name: node.name });
  }

  transformLiteral(node) {
    return this.createAction('literal', node, {
      value: String(node.value),
      raw: node.raw,
      type: typeof node.value
    });
  }

  transformStringLiteral(node) {
    return this.createAction('literal', node, {
      value: node.value,
      type: 'string'
    });
  }

  transformNumericLiteral(node) {
    return this.createAction('literal', node, {
      value: String(node.value),
      type: 'number'
    });
  }

  transformBooleanLiteral(node) {
    return this.createAction('literal', node, {
      value: String(node.value),
      type: 'boolean'
    });
  }

  transformNullLiteral(node) {
    return this.createAction('literal', node, {
      value: 'null',
      type: 'null'
    });
  }

  transformRegExpLiteral(node) {
    return this.createAction('literal', node, {
      value: node.pattern,
      flags: node.flags,
      type: 'regexp'
    });
  }

  transformArrayExpression(node) {
    const action = this.createAction('array', node);

    for (const element of node.elements) {
      if (element) {
        const elemAction = this.transformNode(element);
        if (elemAction) {
          action.addChild(elemAction);
        }
      }
    }

    return action;
  }

  transformObjectExpression(node) {
    const action = this.createAction('object', node);

    for (const prop of node.properties) {
      const propAction = this.transformNode(prop);
      if (propAction) {
        action.addChild(propAction);
      }
    }

    return action;
  }

  transformObjectProperty(node) {
    const action = this.createAction('property', node, {
      computed: node.computed,
      shorthand: node.shorthand,
      key: !node.computed && node.key?.name ? node.key.name : undefined
    });

    if (node.computed || !node.key?.name) {
      const keyAction = this.transformNode(node.key);
      if (keyAction) {
        keyAction.setAttribute('role', 'key');
        action.addChild(keyAction);
      }
    }

    const valueAction = this.transformNode(node.value);
    if (valueAction) {
      valueAction.setAttribute('role', 'value');
      action.addChild(valueAction);
    }

    return action;
  }

  transformObjectMethod(node) {
    const action = this.createAction('declareMethod', node, {
      name: node.key?.name,
      kind: node.kind, // 'get', 'set', or 'method'
      async: node.async,
      generator: node.generator
    });

    for (const param of node.params) {
      const paramAction = this.createAction('declareParam', param, {
        name: this.getPatternName(param)
      });
      action.addChild(paramAction);
    }

    if (node.body) {
      const bodyAction = this.transformNode(node.body);
      if (bodyAction) {
        action.addChild(bodyAction);
      }
    }

    return action;
  }

  transformSpreadElement(node) {
    const action = this.createAction('spread', node);

    const argAction = this.transformNode(node.argument);
    if (argAction) {
      action.addChild(argAction);
    }

    return action;
  }

  transformTemplateLiteral(node) {
    const action = this.createAction('template', node);

    // Interleave quasis and expressions
    for (let i = 0; i < node.quasis.length; i++) {
      const quasiAction = this.transformNode(node.quasis[i]);
      if (quasiAction) {
        action.addChild(quasiAction);
      }

      if (node.expressions[i]) {
        const exprAction = this.transformNode(node.expressions[i]);
        if (exprAction) {
          exprAction.setAttribute('role', 'expression');
          action.addChild(exprAction);
        }
      }
    }

    return action;
  }

  transformTaggedTemplateExpression(node) {
    const action = this.createAction('call', node);

    const tagAction = this.transformNode(node.tag);
    if (tagAction) {
      tagAction.setAttribute('role', 'callee');
      action.addChild(tagAction);
    }

    const quasiAction = this.transformNode(node.quasi);
    if (quasiAction) {
      quasiAction.setAttribute('role', 'argument');
      action.addChild(quasiAction);
    }

    return action;
  }

  transformTemplateElement(node) {
    return this.createAction('literal', node, {
      value: node.value.cooked,
      raw: node.value.raw,
      type: 'templatePart',
      tail: node.tail
    });
  }

  // === Module Handlers ===

  transformImportDeclaration(node) {
    const action = this.createAction('import', node, {
      source: node.source?.value
    });

    for (const specifier of node.specifiers) {
      const spec = this.createAction('identifier', specifier, {
        name: specifier.local?.name,
        imported: specifier.imported?.name || specifier.local?.name
      });
      action.addChild(spec);
    }

    return action;
  }

  transformExportNamedDeclaration(node) {
    const action = this.createAction('export', node);

    if (node.declaration) {
      const declAction = this.transformNode(node.declaration);
      if (declAction) {
        action.addChild(declAction);
      }
    }

    return action;
  }

  transformExportDefaultDeclaration(node) {
    const action = this.createAction('exportDefault', node);

    if (node.declaration) {
      const declAction = this.transformNode(node.declaration);
      if (declAction) {
        action.addChild(declAction);
      }
    }

    return action;
  }

  // === Pattern Handlers ===

  transformAssignmentPattern(node) {
    const action = this.createAction('assign', node, {
      role: 'default'
    });

    const leftAction = this.transformNode(node.left);
    if (leftAction) {
      action.addChild(leftAction);
    }

    const rightAction = this.transformNode(node.right);
    if (rightAction) {
      rightAction.setAttribute('role', 'default');
      action.addChild(rightAction);
    }

    return action;
  }

  transformRestElement(node) {
    return this.createAction('spread', node, {
      name: this.getPatternName(node.argument)
    });
  }

  transformObjectPattern(node) {
    const action = this.createAction('object', node, { pattern: true });

    for (const prop of node.properties) {
      const propAction = this.transformNode(prop);
      if (propAction) {
        action.addChild(propAction);
      }
    }

    return action;
  }

  transformArrayPattern(node) {
    const action = this.createAction('array', node, { pattern: true });

    for (const elem of node.elements) {
      if (elem) {
        const elemAction = this.transformNode(elem);
        if (elemAction) {
          action.addChild(elemAction);
        }
      }
    }

    return action;
  }

  // === Class Member Handlers ===

  transformClassBody(node) {
    const action = this.createAction('block', node);

    for (const member of node.body) {
      const memberAction = this.transformNode(member);
      if (memberAction) {
        action.addChild(memberAction);
      }
    }

    return action;
  }

  transformClassMethod(node) {
    const action = this.createAction('declareMethod', node, {
      name: node.key?.name,
      kind: node.kind,
      static: node.static,
      async: node.async,
      generator: node.generator
    });

    for (const param of node.params) {
      const paramAction = this.createAction('declareParam', param, {
        name: this.getPatternName(param)
      });
      action.addChild(paramAction);
    }

    if (node.body) {
      const bodyAction = this.transformNode(node.body);
      if (bodyAction) {
        action.addChild(bodyAction);
      }
    }

    return action;
  }

  transformClassProperty(node) {
    const action = this.createAction('declareVar', node, {
      name: node.key?.name,
      static: node.static
    });

    if (node.value) {
      const valueAction = this.transformNode(node.value);
      if (valueAction) {
        action.addChild(valueAction);
      }
    }

    return action;
  }

  // === Other Handlers ===

  transformThisExpression(node) {
    return this.createAction('identifier', node, { name: 'this' });
  }

  transformSuper(node) {
    return this.createAction('identifier', node, { name: 'super' });
  }

  // === Utility Methods ===

  /**
   * Create an Action with source location info
   */
  createAction(type, node, attrs = {}) {
    const attributes = { ...attrs };

    if (node?.loc) {
      attributes.line = node.loc.start.line;
      attributes.column = node.loc.start.column;
    }

    if (node?.start !== undefined) {
      attributes.sourceStart = node.start;
    }

    if (node?.end !== undefined) {
      attributes.sourceEnd = node.end;
    }

    return new Action(type, attributes);
  }

  /**
   * Get name from identifier or pattern
   */
  getPatternName(node) {
    if (!node) return undefined;

    switch (node.type) {
      case 'Identifier':
        return node.name;
      case 'AssignmentPattern':
        return this.getPatternName(node.left);
      case 'RestElement':
        return '...' + this.getPatternName(node.argument);
      case 'ObjectPattern':
        return '{...}';
      case 'ArrayPattern':
        return '[...]';
      default:
        return undefined;
    }
  }

  /**
   * Get the name of a callee expression
   */
  getCalleeName(node) {
    if (node.type === 'Identifier') {
      return node.name;
    }

    if (node.type === 'MemberExpression') {
      const parts = [];
      let current = node;

      while (current.type === 'MemberExpression') {
        if (!current.computed && current.property?.name) {
          parts.unshift(current.property.name);
        }
        current = current.object;
      }

      if (current.type === 'Identifier') {
        parts.unshift(current.name);
      }

      return parts.join('.');
    }

    return null;
  }

  /**
   * Detect accessibility-relevant patterns
   */
  detectAccessibilityPattern(action, calleeName, node) {
    // Event handlers
    if (/^(addEventListener|on\w+)$/.test(calleeName) ||
        /\.addEventListener$/.test(calleeName) ||
        /\.on\w+$/.test(calleeName)) {
      action.setAttribute('pattern', 'eventHandler');
    }

    // DOM access
    if (/^(document|window)\.(getElementById|querySelector|getElementsBy)/.test(calleeName) ||
        /\.(getElementById|querySelector|querySelectorAll|getElementsBy\w+)$/.test(calleeName)) {
      action.setAttribute('pattern', 'domAccess');
    }

    // Timers
    if (/^(setTimeout|setInterval|clearTimeout|clearInterval)$/.test(calleeName)) {
      action.setAttribute('pattern', 'timer');
    }

    // Focus management
    if (/\.(focus|blur)$/.test(calleeName) ||
        /^(focus|blur)$/.test(calleeName)) {
      action.setAttribute('pattern', 'focusOp');
    }

    // ARIA manipulation
    if (/\.setAttribute$/.test(calleeName) &&
        node.arguments?.[0]?.value?.startsWith?.('aria-')) {
      action.setAttribute('pattern', 'ariaChange');
    }
  }
}

module.exports = ASTTransformer;
